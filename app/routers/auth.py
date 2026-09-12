from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.db.models.user import User
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
