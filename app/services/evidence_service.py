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
    """Logs evidence and maintains the user's Capability Profile.

    NOTE: capability `strength` here is a simple additive placeholder
    (see UserCapability docstring). Full capability scoring lands in Phase 5.
    """

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

        # Evidence contributes to the user's Capability Profile (spec section 8).
        self.user_capability_repo.upsert_add_strength(
            user_id=user_id, capability_id=data.capability_id, delta=data.strength
        )

        return evidence

    def list_for_user(self, user_id: uuid.UUID) -> list[Evidence]:
        return self.repo.list_for_user(user_id)
