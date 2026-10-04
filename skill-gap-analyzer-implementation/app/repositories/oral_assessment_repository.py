import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models.oral_assessment import OralAssessment


class OralAssessmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self, *, user_id: uuid.UUID, capability_id: uuid.UUID, question: str
    ) -> OralAssessment:
        assessment = OralAssessment(
            user_id=user_id,
            capability_id=capability_id,
            question=question,
        )
        self.db.add(assessment)
        self.db.commit()
        self.db.refresh(assessment)
        return assessment

    def get_by_id(self, assessment_id: uuid.UUID) -> OralAssessment | None:
        stmt = (
            select(OralAssessment)
            .options(selectinload(OralAssessment.capability))
            .where(OralAssessment.id == assessment_id)
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def list_by_user(self, user_id: uuid.UUID) -> Sequence[OralAssessment]:
        stmt = (
            select(OralAssessment)
            .options(selectinload(OralAssessment.capability))
            .where(OralAssessment.user_id == user_id)
            .order_by(OralAssessment.created_at.desc())
        )
        return self.db.execute(stmt).scalars().all()

    def update_evaluation(
        self,
        assessment: OralAssessment,
        *,
        transcript: str,
        audio_url: str | None,
        correctness_score: float,
        relevance_score: float,
        depth_score: float,
        completeness_score: float,
        overall_score: float,
        feedback: str | None,
    ) -> OralAssessment:
        assessment.transcript = transcript
        if audio_url:
            assessment.audio_url = audio_url
        assessment.correctness_score = correctness_score
        assessment.relevance_score = relevance_score
        assessment.depth_score = depth_score
        assessment.completeness_score = completeness_score
        assessment.overall_score = overall_score
        assessment.feedback = feedback

        self.db.commit()
        self.db.refresh(assessment)
        return assessment
