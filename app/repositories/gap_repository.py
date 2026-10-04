import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.gap import Gap


class GapRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, *, user_id: uuid.UUID, **fields: object) -> Gap:
        gap = Gap(user_id=user_id, **fields)
        self.db.add(gap)
        self.db.commit()
        self.db.refresh(gap)
        return gap

    def list_for_user(self, user_id: uuid.UUID) -> Sequence[Gap]:
        stmt = select(Gap).where(Gap.user_id == user_id).order_by(Gap.created_at.desc())
        return self.db.execute(stmt).scalars().all()

    def get_by_id(self, gap_id: uuid.UUID) -> Gap | None:
        return self.db.get(Gap, gap_id)

    def delete(self, gap: Gap) -> None:
        self.db.delete(gap)
        self.db.commit()
