import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.exceptions import CapabilityNotFoundError
from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.repositories.capability_repository import CapabilityRepository
from app.repositories.user_capability_repository import UserCapabilityRepository
from app.schemas.capability import (
    CapabilityScoreComponents,
    CapabilityScoreDetailRead,
    CapabilityScoreWeights,
    CapabilitySummary,
    UserCapabilityRead,
)
from app.schemas.user import UserRead
from app.services.capability_scoring_service import (
    CAPABILITY_SCORE_WEIGHTS,
    CapabilityScoringService,
)

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
            evidence_strength=uc.evidence_strength if uc.last_evaluated_at is not None else uc.strength,
            evidence_count=uc.evidence_count,
            components=uc.breakdown or {},
            weights=CAPABILITY_SCORE_WEIGHTS,
            last_evaluated_at=uc.last_evaluated_at,
            updated_at=uc.updated_at,
        )
        for uc, cap in rows
    ]


@router.get(
    "/me/capabilities/{capability_id}",
    response_model=CapabilityScoreDetailRead,
)
def get_my_capability_score(
    capability_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CapabilityScoreDetailRead:
    cap = CapabilityRepository(db).get_by_id(capability_id)
    if cap is None:
        raise CapabilityNotFoundError()

    scoring_service = CapabilityScoringService(db)
    result = scoring_service.calculate_capability_score(current_user.id, capability_id)

    components_dict = result["components"]
    weights_dict = result["weights"]

    return CapabilityScoreDetailRead(
        capability=CapabilitySummary(id=cap.id, name=cap.name),
        score=result["score"],
        components=CapabilityScoreComponents(
            practical=components_dict.get("practical", 0.0),
            project=components_dict.get("project", 0.0),
            oral=components_dict.get("oral", 0.0),
            freshness=components_dict.get("freshness", 0.0),
        ),
        weights=CapabilityScoreWeights(
            practical=weights_dict.get("practical", 0.40),
            project=weights_dict.get("project", 0.30),
            oral=weights_dict.get("oral", 0.20),
            freshness=weights_dict.get("freshness", 0.10),
        ),
        evidence_count=result["evidence_count"],
        last_evaluated_at=result["last_evaluated_at"],
    )


@router.post(
    "/me/capabilities/{capability_id}/recalculate",
    response_model=CapabilityScoreDetailRead,
)
def recalculate_my_capability_score(
    capability_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CapabilityScoreDetailRead:
    cap = CapabilityRepository(db).get_by_id(capability_id)
    if cap is None:
        raise CapabilityNotFoundError()

    scoring_service = CapabilityScoringService(db)
    user_cap = scoring_service.recalculate_user_capability(current_user.id, capability_id)
    result = scoring_service.calculate_capability_score(current_user.id, capability_id)

    components_dict = result["components"]
    weights_dict = result["weights"]

    return CapabilityScoreDetailRead(
        capability=CapabilitySummary(id=cap.id, name=cap.name),
        score=result["score"],
        components=CapabilityScoreComponents(
            practical=components_dict.get("practical", 0.0),
            project=components_dict.get("project", 0.0),
            oral=components_dict.get("oral", 0.0),
            freshness=components_dict.get("freshness", 0.0),
        ),
        weights=CapabilityScoreWeights(
            practical=weights_dict.get("practical", 0.40),
            project=weights_dict.get("project", 0.30),
            oral=weights_dict.get("oral", 0.20),
            freshness=weights_dict.get("freshness", 0.10),
        ),
        evidence_count=result["evidence_count"],
        last_evaluated_at=user_cap.last_evaluated_at or result["last_evaluated_at"],
    )
