import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.capability import Capability


class CapabilityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, capability_id: uuid.UUID) -> Capability | None:
        return self.db.get(Capability, capability_id)

    def get_by_name(self, name: str) -> Capability | None:
        stmt = select(Capability).where(Capability.name == name)
        return self.db.execute(stmt).scalar_one_or_none()

    def list_all(self) -> list[Capability]:
        stmt = select(Capability).order_by(Capability.name)
        return list(self.db.execute(stmt).scalars().all())

    def create(self, *, name: str, category: str | None, description: str | None) -> Capability:
        capability = Capability(name=name, category=category, description=description)
        self.db.add(capability)
        self.db.commit()
        self.db.refresh(capability)
        return capability
