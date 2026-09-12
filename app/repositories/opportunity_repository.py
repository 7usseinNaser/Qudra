import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.opportunity import Opportunity


class OpportunityRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **fields: object) -> Opportunity:
        opp = Opportunity(**fields)
        self.db.add(opp)
        self.db.commit()
        self.db.refresh(opp)
        return opp

    def list_all(self, skip: int = 0, limit: int = 20) -> Sequence[Opportunity]:
        stmt = select(Opportunity).order_by(Opportunity.posted_date.desc()).offset(skip).limit(limit)
        return self.db.execute(stmt).scalars().all()

    def get_by_id(self, opp_id: uuid.UUID) -> Opportunity | None:
        return self.db.get(Opportunity, opp_id)
