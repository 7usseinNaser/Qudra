import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models.challenge import Challenge, ChallengeSubmission


class ChallengeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        *,
        capability_id: uuid.UUID,
        title: str,
        description: str,
        difficulty: str = "INTERMEDIATE",
        time_limit: int | None = None,
        evaluation_criteria: dict | list | None = None,
        starter_code: str | None = None,
    ) -> Challenge:
        challenge = Challenge(
            capability_id=capability_id,
            title=title,
            description=description,
            difficulty=difficulty,
            time_limit=time_limit,
            evaluation_criteria=evaluation_criteria,
            starter_code=starter_code,
        )
        self.db.add(challenge)
        self.db.commit()
        self.db.refresh(challenge)
        return challenge

    def get_by_id(self, challenge_id: uuid.UUID) -> Challenge | None:
        stmt = (
            select(Challenge)
            .options(selectinload(Challenge.capability))
            .where(Challenge.id == challenge_id)
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def list_all(
        self, capability_id: uuid.UUID | None = None, skip: int = 0, limit: int = 20
    ) -> Sequence[Challenge]:
        stmt = select(Challenge).options(selectinload(Challenge.capability))
        if capability_id:
            stmt = stmt.where(Challenge.capability_id == capability_id)
        stmt = stmt.order_by(Challenge.created_at.desc()).offset(skip).limit(limit)
        return self.db.execute(stmt).scalars().all()

    def create_submission(
        self,
        *,
        challenge_id: uuid.UUID,
        user_id: uuid.UUID,
        answer: str | None,
        code: str | None,
        repository_url: str | None,
        test_score: float,
        ai_score: float,
        final_score: float,
        feedback: str | None,
    ) -> ChallengeSubmission:
        submission = ChallengeSubmission(
            challenge_id=challenge_id,
            user_id=user_id,
            answer=answer,
            code=code,
            repository_url=repository_url,
            test_score=test_score,
            ai_score=ai_score,
            final_score=final_score,
            feedback=feedback,
        )
        self.db.add(submission)
        self.db.commit()
        self.db.refresh(submission)
        return submission

    def get_submission_by_id(self, submission_id: uuid.UUID) -> ChallengeSubmission | None:
        stmt = (
            select(ChallengeSubmission)
            .options(selectinload(ChallengeSubmission.challenge))
            .where(ChallengeSubmission.id == submission_id)
        )
        return self.db.execute(stmt).scalar_one_or_none()
