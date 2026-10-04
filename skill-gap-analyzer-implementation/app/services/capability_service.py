from sqlalchemy.orm import Session

from app.core.exceptions import CapabilityAlreadyExistsError, CapabilityNotFoundError
from app.db.models.capability import Capability
from app.repositories.capability_repository import CapabilityRepository
from app.schemas.capability import CapabilityCreate


class CapabilityService:
    def __init__(self, db: Session):
        self.repo = CapabilityRepository(db)

    def create(self, data: CapabilityCreate) -> Capability:
        if self.repo.get_by_name(data.name):
            raise CapabilityAlreadyExistsError()
        return self.repo.create(
            name=data.name, category=data.category, description=data.description
        )

    def list_all(self) -> list[Capability]:
        return self.repo.list_all()

    def get(self, capability_id) -> Capability:
        capability = self.repo.get_by_id(capability_id)
        if capability is None:
            raise CapabilityNotFoundError()
        return capability
