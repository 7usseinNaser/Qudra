import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.capability import CapabilityCreate, CapabilityRead
from app.services.capability_service import CapabilityService

router = APIRouter(prefix="/capabilities", tags=["capabilities"])


@router.post("", response_model=CapabilityRead, status_code=status.HTTP_201_CREATED)
def create_capability(
    payload: CapabilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CapabilityRead:
    # NOTE: open to any authenticated user for now — no role/admin system
    # exists yet (consistent with Phase 1 not introducing roles either).
    return CapabilityService(db).create(payload)


@router.get("", response_model=list[CapabilityRead])
def list_capabilities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[CapabilityRead]:
    return CapabilityService(db).list_all()


@router.get("/{capability_id}", response_model=CapabilityRead)
def get_capability(
    capability_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CapabilityRead:
    return CapabilityService(db).get(capability_id)
