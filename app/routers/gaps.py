import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.repositories.gap_repository import GapRepository
from app.schemas.gap import GapCreate, GapRead

router = APIRouter(prefix="/gaps", tags=["gaps"])


@router.post("", response_model=GapRead, status_code=status.HTTP_201_CREATED)
def create_gap(
    payload: GapCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GapRead:
    repo = GapRepository(db)
    gap = repo.create(
        user_id=current_user.id,
        capability_id=payload.capability_id,
        capability_name=payload.capability_name,
        current_strength=payload.current_strength,
        required_strength=payload.required_strength,
        target_strength=payload.target_strength,
        severity=payload.severity,
        reason=payload.reason,
        recommended_action=payload.recommended_action,
        impact=payload.impact,
    )
    return GapRead.model_validate(gap)


@router.get("", response_model=list[GapRead])
def list_gaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[GapRead]:
    gaps = GapRepository(db).list_for_user(current_user.id)
    return [GapRead.model_validate(g) for g in gaps]


@router.get("/{gap_id}", response_model=GapRead)
def get_gap(
    gap_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GapRead:
    gap = GapRepository(db).get_by_id(gap_id)
    if not gap or gap.user_id != current_user.id:
        from app.core.exceptions import AppError
        raise AppError("Gap not found.")
    return GapRead.model_validate(gap)
