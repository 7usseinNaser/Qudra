from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.evidence import EvidenceCreate, EvidenceRead
from app.services.evidence_service import EvidenceService

router = APIRouter(prefix="/evidence", tags=["evidence"])


@router.post("", response_model=EvidenceRead, status_code=status.HTTP_201_CREATED)
def create_evidence(
    payload: EvidenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EvidenceRead:
    return EvidenceService(db).create(current_user.id, payload)


@router.get("", response_model=list[EvidenceRead])
def list_my_evidence(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[EvidenceRead]:
    return EvidenceService(db).list_for_user(current_user.id)
