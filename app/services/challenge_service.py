import uuid
from typing import Sequence

from sqlalchemy.orm import Session

from app.ai.provider import AIProvider, MockAIProvider
from app.core.exceptions import (
    AppError,
    CapabilityNotFoundError,
)
from app.db.models.evidence import Evidence, EvidenceType, VerificationStatus
from app.repositories.capability_repository import CapabilityRepository
from app.repositories.challenge_repository import ChallengeRepository
from app.repositories.user_capability_repository import UserCapabilityRepository
from app.schemas.challenge import (
    ChallengeCreate,
    ChallengeRead,
    ChallengeSubmissionRead,
    ChallengeSubmitRequest,
)


class ChallengeNotFoundError(AppError):
    status_code = 404
    detail = "Practical challenge not found."


class ChallengeService:
    def __init__(self, db: Session, ai_provider: AIProvider | None = None):
        self.db = db
        self.repo = ChallengeRepository(db)
        self.cap_repo = CapabilityRepository(db)
        self.user_cap_repo = UserCapabilityRepository(db)
        self.ai_provider = ai_provider or MockAIProvider()

    def create_challenge(self, data: ChallengeCreate) -> ChallengeRead:
        capability = self.cap_repo.get_by_id(data.capability_id)
        if not capability:
            raise CapabilityNotFoundError()

        challenge = self.repo.create(
            capability_id=data.capability_id,
            title=data.title,
            description=data.description,
            difficulty=data.difficulty,
            time_limit=data.time_limit,
            evaluation_criteria=data.evaluation_criteria,
            starter_code=data.starter_code,
        )
        return ChallengeRead.model_validate(challenge)

    def get_challenge(self, challenge_id: uuid.UUID) -> ChallengeRead:
        challenge = self.repo.get_by_id(challenge_id)
        if not challenge:
            raise ChallengeNotFoundError()
        return ChallengeRead.model_validate(challenge)

    def list_challenges(
        self, capability_id: uuid.UUID | None = None, page: int = 1, page_size: int = 10
    ) -> list[ChallengeRead]:
        skip = (max(1, page) - 1) * max(1, page_size)
        challenges = self.repo.list_all(capability_id=capability_id, skip=skip, limit=page_size)
        return [ChallengeRead.model_validate(c) for c in challenges]

    async def submit_challenge(
        self, user_id: uuid.UUID, challenge_id: uuid.UUID, data: ChallengeSubmitRequest
    ) -> ChallengeSubmissionRead:
        challenge = self.repo.get_by_id(challenge_id)
        if not challenge:
            raise ChallengeNotFoundError()

        eval_res = await self.ai_provider.evaluate_practical_submission(
            challenge_title=challenge.title,
            description=challenge.description,
            answer=data.answer,
            code=data.code,
        )

        test_score = float(eval_res["test_score"])
        ai_score = float(eval_res["ai_score"])
        final_score = float(eval_res["final_score"])
        feedback = str(eval_res["feedback"])

        submission = self.repo.create_submission(
            challenge_id=challenge_id,
            user_id=user_id,
            answer=data.answer,
            code=data.code,
            repository_url=data.repository_url,
            test_score=test_score,
            ai_score=ai_score,
            final_score=final_score,
            feedback=feedback,
        )

        # Generate Evidence entry
        evidence = Evidence(
            user_id=user_id,
            capability_id=challenge.capability_id,
            type=EvidenceType.PRACTICAL,
            source_id=submission.id,
            title=f"Practical Challenge: {challenge.title}",
            description=challenge.description[:200],
            score=final_score,
            quality=ai_score,
            verification_status=VerificationStatus.VERIFIED,
            strength=min(1.0, final_score / 100.0),
        )
        self.db.add(evidence)

        # Update user capability strength profile
        self.user_cap_repo.upsert_add_strength(
            user_id=user_id,
            capability_id=challenge.capability_id,
            delta=final_score * 0.40,
        )

        self.db.commit()

        return ChallengeSubmissionRead.model_validate(submission)
