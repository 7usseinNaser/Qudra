import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.capability import Capability
from app.db.models.user_capability import UserCapability


class UserCapabilityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, user_id: uuid.UUID, capability_id: uuid.UUID) -> UserCapability | None:
        stmt = select(UserCapability).where(
            UserCapability.user_id == user_id,
            UserCapability.capability_id == capability_id,
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def list_for_user_with_capability(
        self, user_id: uuid.UUID
    ) -> list[tuple[UserCapability, Capability]]:
        stmt = (
            select(UserCapability, Capability)
            .join(Capability, Capability.id == UserCapability.capability_id)
            .where(UserCapability.user_id == user_id)
            .order_by(Capability.name)
        )
        return list(self.db.execute(stmt).all())

    def upsert_add_strength(
        self, *, user_id: uuid.UUID, capability_id: uuid.UUID, delta: float
    ) -> UserCapability:
        entry = self.get(user_id, capability_id)
        if entry is None:
            entry = UserCapability(
                user_id=user_id, capability_id=capability_id, strength=0.0
            )
            self.db.add(entry)

        entry.strength = min(100.0, entry.strength + delta)
        self.db.commit()
        self.db.refresh(entry)
        return entry
