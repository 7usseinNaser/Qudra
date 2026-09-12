from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.repositories.user_capability_repository import UserCapabilityRepository
from app.schemas.capability import UserCapabilityRead
from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)) -> UserRead:
    return current_user


@router.get("/me/capabilities", response_model=list[UserCapabilityRead])
def read_my_capability_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UserCapabilityRead]:
    rows = UserCapabilityRepository(db).list_for_user_with_capability(current_user.id)
    return [
        UserCapabilityRead(
            id=uc.id,
            capability_id=uc.capability_id,
            capability_name=cap.name,
            capability_category=cap.category,
            strength=uc.strength,
            updated_at=uc.updated_at,
        )
        for uc, cap in rows
    ]
