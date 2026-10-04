import uuid
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
from app.schemas.evidence import EvidenceCreate


class EvidenceService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = EvidenceRepository(db)
        self.capability_repo = CapabilityRepository(db)
        self.project_repo = ProjectRepository(db)
        self.user_capability_repo = UserCapabilityRepository(db)

    def create(self, user_id: uuid.UUID, data: EvidenceCreate) -> Evidence:
        if self.capability_repo.get_by_id(data.capability_id) is None:
            raise CapabilityNotFoundError()

        if data.type == EvidenceType.PROJECT:
            if data.project_id is None:
                raise EvidenceValidationError("project_id is required when evidence type is PROJECT.")
            project = self.project_repo.get_by_id(data.project_id)
            if project is None:
                raise ProjectNotFoundError()
            if project.owner_id != user_id:
                raise ProjectAccessDeniedError()
        elif data.project_id is not None:
            raise EvidenceValidationError("project_id must be omitted unless evidence type is PROJECT.")

        evidence = self.repo.create(
            user_id=user_id,
            capability_id=data.capability_id,
            type=data.type,
            project_id=data.project_id,
            title=data.title,
            description=data.description,
            strength=data.strength,
            score=data.score if (data.score and data.score > 0) else data.strength,
            verification_status=data.verification_status,
            evidence_metadata=data.evidence_metadata,
        )

        self.user_capability_repo.upsert_add_strength(
            user_id=user_id, capability_id=data.capability_id, delta=data.strength
        )

        from app.services.capability_scoring_service import CapabilityScoringService

        CapabilityScoringService(self.db).recalculate_user_capability(
            user_id=user_id, capability_id=data.capability_id
        )

        return evidence

    def update_verification_status(
        self, user_id: uuid.UUID, evidence_id: uuid.UUID, status: str
    ) -> Evidence:
        evidence = self.repo.db.get(Evidence, evidence_id)
        if evidence is None:
            raise EvidenceValidationError("Evidence not found.")
        if evidence.user_id != user_id:
            raise ProjectAccessDeniedError("You do not have access to this evidence.")

        evidence.verification_status = status
        self.repo.db.commit()
        self.repo.db.refresh(evidence)

        from app.services.capability_scoring_service import CapabilityScoringService

        CapabilityScoringService(self.db).recalculate_user_capability(
            user_id=user_id, capability_id=evidence.capability_id
        )

        return evidence

    def list_for_user(self, user_id: uuid.UUID) -> list[Evidence]:
        return self.repo.list_for_user(user_id)