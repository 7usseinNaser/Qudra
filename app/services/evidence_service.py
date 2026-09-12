import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import (
    CapabilityNotFoundError,
    EvidenceValidationError,
    ProjectAccessDeniedError,
    ProjectNotFoundError,
)
from app.db.models.evidence import Evidence, EvidenceType
from app.db.models.user_capability import UserCapability
from app.repositories.capability_repository import CapabilityRepository
from app.repositories.evidence_repository import EvidenceRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.user_capability_repository import UserCapabilityRepository
from app.schemas.evidence import EvidenceCreate

PRACTICAL_WEIGHT = 0.40
PROJECT_WEIGHT = 0.30
ORAL_WEIGHT = 0.20
FRESHNESS_WEIGHT = 0.10


def _freshness_score(created_at: datetime) -> float:
    """Return 0–100 based on how recent the evidence is (within 12 months)."""
    now = datetime.now(timezone.utc)
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    days_old = (now - created_at).days
    if days_old <= 30:
        return 100.0
    if days_old <= 90:
        return 85.0
    if days_old <= 180:
        return 70.0
    if days_old <= 365:
        return 50.0
    return max(10.0, 100.0 - (days_old - 365) * 0.1)


class EvidenceService:
    def __init__(self, db: Session):
        self.repo = EvidenceRepository(db)
        self.capability_repo = CapabilityRepository(db)
        self.project_repo = ProjectRepository(db)
        self.user_capability_repo = UserCapabilityRepository(db)

    def create(self, user_id: uuid.UUID, data: EvidenceCreate) -> Evidence:
        if self.capability_repo.get_by_id(data.capability_id) is None:
            raise CapabilityNotFoundError()

        if data.type == EvidenceType.PROJECT:
            if data.project_id is None:
                raise EvidenceValidationError(
                    "project_id is required when evidence type is PROJECT."
                )
            project = self.project_repo.get_by_id(data.project_id)
            if project is None:
                raise ProjectNotFoundError()
            if project.owner_id != user_id:
                raise ProjectAccessDeniedError()
        elif data.project_id is not None:
            raise EvidenceValidationError(
                "project_id must be omitted unless evidence type is PROJECT."
            )

        evidence = self.repo.create(
            user_id=user_id,
            capability_id=data.capability_id,
            type=data.type,
            project_id=data.project_id,
            title=data.title,
            description=data.description,
            strength=data.strength,
        )

        breakdown = self._compute_breakdown(evidence)
        self.user_capability_repo.upsert_add_strength(
            user_id=user_id,
            capability_id=data.capability_id,
            delta=data.strength,
            breakdown=breakdown,
        )

        return evidence

    def list_for_user(self, user_id: uuid.UUID) -> list[Evidence]:
        return self.repo.list_for_user(user_id)

    def get_full_capability_profile(self, user_id: uuid.UUID) -> list[UserCapability]:
        """Return the user's full capability profile with computed breakdowns."""
        return self.user_capability_repo.list_for_user(user_id)

    def _compute_breakdown(self, evidence: Evidence) -> dict[str, float]:
        """Compute multi-factor breakdown for a single evidence item."""
        type_weight_map = {
            EvidenceType.GITHUB_REPO: PRACTICAL_WEIGHT,
            EvidenceType.PROJECT: PROJECT_WEIGHT,
            EvidenceType.CHALLENGE: PRACTICAL_WEIGHT,
            EvidenceType.ORAL_ASSESSMENT: ORAL_WEIGHT,
            EvidenceType.FILE_UPLOAD: PRACTICAL_WEIGHT,
        }
        type_weight = type_weight_map.get(evidence.type, PRACTICAL_WEIGHT)
        freshness = _freshness_score(evidence.created_at)

        return {
            "practical": type_weight * evidence.strength,
            "project": PROJECT_WEIGHT * evidence.strength if evidence.type == EvidenceType.PROJECT else 0.0,
            "oral": ORAL_WEIGHT * evidence.strength if evidence.type == EvidenceType.ORAL_ASSESSMENT else 0.0,
            "freshness": FRESHNESS_WEIGHT * freshness,
            "freshness_raw": freshness,
            "type_weight": type_weight,
        }
