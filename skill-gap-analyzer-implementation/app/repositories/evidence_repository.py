import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.evidence import Evidence


class EvidenceRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_for_user(self, user_id: uuid.UUID) -> list[Evidence]:
        stmt = (
            select(Evidence)
            .where(Evidence.user_id == user_id)
            .order_by(Evidence.created_at.desc())
        )
        return list(self.db.execute(stmt).scalars().all())

    def create(self, **fields) -> Evidence:
        evidence = Evidence(**fields)
        self.db.add(evidence)
        self.db.commit()
        self.db.refresh(evidence)
        return evidence
