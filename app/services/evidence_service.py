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
from app.repositories.capability_repository import CapabilityRepository
from app.repositories.evidence_repository import EvidenceRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.user_capability_repository import UserCapabilityRepository
from app.repositories.user_repository import UserRepository
from app.schemas.capability import CapabilityProfileItem, FullCapabilityProfileRead
from app.schemas.evidence import EvidenceCreate


class EvidenceService:
    """Logs evidence and maintains the user's Capability Profile using multi-factor evidence weighting.

    Weights per QUDRA specification:
    - Practical Evidence -> 40%
    - Project Evidence   -> 30%
    - Oral Evidence      -> 20%
    - Freshness          -> 10%
    """

    PRACTICAL_WEIGHT = 0.40
    PROJECT_WEIGHT = 0.30
    ORAL_WEIGHT = 0.20
    FRESHNESS_WEIGHT = 0.10

    def __init__(self, db: Session):
        self.db = db
        self.repo = EvidenceRepository(db)
        self.capability_repo = CapabilityRepository(db)
        self.project_repo = ProjectRepository(db)
        self.user_capability_repo = UserCapabilityRepository(db)
        self.user_repo = UserRepository(db)

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

        # Recalculate Capability Profile metrics and update strength
        self.recalculate_capability_profile(user_id, data.capability_id, delta=data.strength)

        return evidence

    def recalculate_capability_profile(
        self, user_id: uuid.UUID, capability_id: uuid.UUID, delta: float = 0.0
    ):
        """Calculates evidence strength based on:
        40% Practical + 30% Project + 20% Oral + 10% Freshness.
        """
        all_evidence = self.repo.list_for_user_and_capability(user_id, capability_id)
        if not all_evidence:
            return self.user_capability_repo.upsert_add_strength(
                user_id=user_id,
                capability_id=capability_id,
                delta=delta,
                evidence_strength=0.0,
                evidence_count=0,
                breakdown={
                    "practical_evidence": 0.0,
                    "project_evidence": 0.0,
                    "oral_evidence": 0.0,
                    "freshness": 100.0,
                },
            )

        practical_scores = [e.strength for e in all_evidence if e.type == EvidenceType.PRACTICAL]
        project_scores = [e.strength for e in all_evidence if e.type == EvidenceType.PROJECT]
        oral_scores = [e.strength for e in all_evidence if e.type == EvidenceType.ORAL]

        practical_avg = round(sum(practical_scores) / len(practical_scores), 1) if practical_scores else 0.0
        project_avg = round(sum(project_scores) / len(project_scores), 1) if project_scores else 0.0
        oral_avg = round(sum(oral_scores) / len(oral_scores), 1) if oral_scores else 0.0

        # Calculate Freshness based on newest evidence
        newest_evidence = max(all_evidence, key=lambda e: e.created_at)
        now_dt = datetime.now(timezone.utc)
        created_at_dt = newest_evidence.created_at
        if created_at_dt.tzinfo is None:
            created_at_dt = created_at_dt.replace(tzinfo=timezone.utc)
        days_old = max(0, (now_dt - created_at_dt).days)
        freshness = max(50.0, round(100.0 - (days_old * 0.1), 1))

        # Multi-factor formula calculation
        if practical_scores and project_scores and oral_scores:
            evidence_strength = round(
                self.PRACTICAL_WEIGHT * practical_avg
                + self.PROJECT_WEIGHT * project_avg
                + self.ORAL_WEIGHT * oral_avg
                + self.FRESHNESS_WEIGHT * freshness,
                1,
            )
        else:
            # Dynamically normalize over active categories
            weighted_sum = self.FRESHNESS_WEIGHT * freshness
            total_weight = self.FRESHNESS_WEIGHT

            if practical_scores:
                weighted_sum += self.PRACTICAL_WEIGHT * practical_avg
                total_weight += self.PRACTICAL_WEIGHT
            if project_scores:
                weighted_sum += self.PROJECT_WEIGHT * project_avg
                total_weight += self.PROJECT_WEIGHT
            if oral_scores:
                weighted_sum += self.ORAL_WEIGHT * oral_avg
                total_weight += self.ORAL_WEIGHT

            evidence_strength = round(weighted_sum / total_weight, 1)

        breakdown = {
            "practical_evidence": practical_avg,
            "project_evidence": project_avg,
            "oral_evidence": oral_avg,
            "freshness": freshness,
        }

        return self.user_capability_repo.upsert_add_strength(
            user_id=user_id,
            capability_id=capability_id,
            delta=delta,
            evidence_strength=evidence_strength,
            evidence_count=len(all_evidence),
            breakdown=breakdown,
        )

    def list_for_user(self, user_id: uuid.UUID) -> list[Evidence]:
        return self.repo.list_for_user(user_id)

    def get_full_capability_profile(self, user_id: uuid.UUID) -> FullCapabilityProfileRead:
        user = self.user_repo.get_by_id(user_id)
        email = user.email if user else ""
        full_name = user.full_name if user else None

        rows = self.user_capability_repo.list_for_user_with_capability(user_id)
        items: list[CapabilityProfileItem] = []
        for uc, cap in rows:
            items.append(
                CapabilityProfileItem(
                    capability_id=uc.capability_id,
                    capability_name=cap.name,
                    capability_category=cap.category,
                    evidence_strength=uc.evidence_strength if uc.evidence_strength > 0 else uc.strength,
                    evidence_count=uc.evidence_count,
                    breakdown=uc.breakdown or {},
                    updated_at=uc.updated_at,
                )
            )

        return FullCapabilityProfileRead(
            user_id=user_id,
            full_name=full_name,
            email=email,
            capabilities=items,
        )
