import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.challenge import (
    ChallengeCreate,
    ChallengeRead,
    ChallengeSubmissionRead,
    ChallengeSubmitRequest,
)
from app.services.challenge_service import ChallengeService

router = APIRouter(prefix="/challenges", tags=["challenges"])


@router.post("", response_model=ChallengeRead, status_code=status.HTTP_201_CREATED)
def create_challenge(
    payload: ChallengeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChallengeRead:
    return ChallengeService(db).create_challenge(payload)


@router.get("", response_model=list[ChallengeRead])
def list_challenges(
    capability_id: uuid.UUID | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ChallengeRead]:
    return ChallengeService(db).list_challenges(
        capability_id=capability_id, page=page, page_size=page_size
    )


@router.get("/{challenge_id}", response_model=ChallengeRead)
def get_challenge(
    challenge_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChallengeRead:
    return ChallengeService(db).get_challenge(challenge_id)


@router.post(
    "/{challenge_id}/submit",
    response_model=ChallengeSubmissionRead,
    status_code=status.HTTP_201_CREATED,
)
async def submit_challenge(
    challenge_id: uuid.UUID,
    payload: ChallengeSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChallengeSubmissionRead:
    return await ChallengeService(db).submit_challenge(
        current_user.id, challenge_id, payload
    )
