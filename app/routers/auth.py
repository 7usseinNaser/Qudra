import urllib.parse

import httpx
from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import AppError
from app.core.security import create_access_token, hash_password
from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.repositories.user_repository import UserRepository
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserRead
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


class VerifyEmailPayload(BaseModel):
    code: str


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    service = AuthService(db)
    user = service.register(payload)
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Token:
    service = AuthService(db)
    user = service.authenticate(form_data.username, form_data.password)
    access_token = service.create_token_for_user(user)
    return Token(access_token=access_token)


@router.post("/verify-email", response_model=UserRead)
def verify_email(
    payload: VerifyEmailPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserRead:
    if len(payload.code) < 4:
        raise ValueError("Code must be at least 4 characters")
    return UserRepository(db).update(current_user, is_email_verified=True)


@router.get("/github")
def github_login() -> RedirectResponse:
    if not settings.GITHUB_CLIENT_ID:
        raise AppError("GitHub OAuth is not configured.")
    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": settings.GITHUB_REDIRECT_URI,
        "scope": "read:user user:email repo",
    }
    url = f"https://github.com/login/oauth/authorize?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=url)


@router.get("/github/callback")
def github_callback(
    code: str = Query(...),
    db: Session = Depends(get_db),
) -> Token:
    if not settings.GITHUB_CLIENT_ID or not settings.GITHUB_CLIENT_SECRET:
        raise AppError("GitHub OAuth is not configured.")

    token_resp = httpx.post(
        "https://github.com/login/oauth/access_token",
        json={
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.GITHUB_REDIRECT_URI,
        },
        headers={"Accept": "application/json"},
    )
    token_resp.raise_for_status()
    token_data = token_resp.json()
    gh_access_token = token_data.get("access_token")
    if not gh_access_token:
        raise AppError("Failed to obtain GitHub access token.")

    user_resp = httpx.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {gh_access_token}"},
    )
    user_resp.raise_for_status()
    gh_user = user_resp.json()

    gh_id = str(gh_user["id"])
    gh_username = gh_user.get("login")
    gh_avatar = gh_user.get("avatar_url")
    gh_name = gh_user.get("name") or gh_username or "GitHub User"

    email_resp = httpx.get(
        "https://api.github.com/user/emails",
        headers={"Authorization": f"Bearer {gh_access_token}"},
    )
    email_resp.raise_for_status()
    emails = email_resp.json()
    primary_email = next(
        (e["email"] for e in emails if e.get("primary") and e.get("verified")),
        None,
    )
    if not primary_email:
        raise AppError("No verified primary email found on GitHub account.")

    repo = UserRepository(db)
    user = repo.get_by_github_id(gh_id)

    if user:
        user = repo.update(
            user,
            github_access_token=gh_access_token,
            github_username=gh_username,
            avatar_url=gh_avatar or user.avatar_url,
        )
    else:
        existing = repo.get_by_email(primary_email)
        if existing:
            user = repo.update(
                existing,
                github_id=gh_id,
                github_username=gh_username,
                github_access_token=gh_access_token,
                avatar_url=gh_avatar or existing.avatar_url,
                is_email_verified=True,
            )
        else:
            import secrets as _secrets
            user = User(
                email=primary_email,
                hashed_password=hash_password(_secrets.token_urlsafe(32)),
                full_name=gh_name,
                role="talent",
                github_id=gh_id,
                github_username=gh_username,
                github_access_token=gh_access_token,
                avatar_url=gh_avatar,
                is_email_verified=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    access_token = create_access_token(subject=str(user.id))
    return Token(access_token=access_token)
