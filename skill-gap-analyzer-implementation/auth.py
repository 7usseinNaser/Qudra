import uuid

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import InactiveUserError, NotAuthenticatedError
from app.core.security import decode_access_token
from app.db.models.user import User
from app.db.session import get_db
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    subject = decode_access_token(token)
    if subject is None:
        raise NotAuthenticatedError()

    try:
        user_id = uuid.UUID(subject)
    except ValueError:
        raise NotAuthenticatedError()

    user = UserRepository(db).get_by_id(user_id)
    if user is None:
        raise NotAuthenticatedError()
    if not user.is_active:
        raise InactiveUserError()

    return user
