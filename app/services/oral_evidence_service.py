import uuid
from sqlalchemy.orm import Session

from app.ai.provider import AIProvider, MockAIProvider
from app.core.exceptions import (
    AppError,
    CapabilityNotFoundError,
)
from app.db.models.evidence import Evidence, EvidenceType, VerificationStatus
from app.db.models.oral_assessment import OralAssessment
from app.repositories.capability_repository import CapabilityRepository
from app.repositories.oral_assessment_repository import OralAssessmentRepository
from app.repositories.user_capability_repository import UserCapabilityRepository
from app.schemas.oral_assessment import (
    OralAssessmentQuestionRead,
    OralAssessmentRead,
)


class OralAssessmentNotFoundError(AppError):
    status_code = 404
    detail = "Oral assessment not found."


class OralAssessmentAccessDeniedError(AppError):
    status_code = 403
    detail = "You do not have access to this assessment."


class OralEvidenceService:
    def __init__(self, db: Session, ai_provider: AIProvider | None = None):
        self.db = db
        self.repo = OralAssessmentRepository(db)
        self.cap_repo = CapabilityRepository(db)
        self.user_cap_repo = UserCapabilityRepository(db)
        self.ai_provider = ai_provider or MockAIProvider()

    async def start_assessment(
        self, user_id: uuid.UUID, capability_id: uuid.UUID
    ) -> OralAssessmentQuestionRead:
        capability = self.cap_repo.get_by_id(capability_id)
        if not capability:
            raise CapabilityNotFoundError()

        question = await self.ai_provider.generate_oral_question(
            capability.name, capability.category
        )

        assessment = self.repo.create(
            user_id=user_id,
            capability_id=capability_id,
            question=question,
        )

        return OralAssessmentQuestionRead(
            assessment_id=assessment.id,
            capability_id=capability.id,
            capability_name=capability.name,
            question=question,
        )

    async def submit_assessment(
        self,
        user_id: uuid.UUID,
        assessment_id: uuid.UUID,
        transcript: str,
        audio_url: str | None = None,
    ) -> OralAssessmentRead:
        assessment = self.repo.get_by_id(assessment_id)
        if not assessment:
            raise OralAssessmentNotFoundError()
        if assessment.user_id != user_id:
            raise OralAssessmentAccessDeniedError()

        capability = assessment.capability

        eval_res = await self.ai_provider.evaluate_oral_answer(
            question=assessment.question,
            transcript=transcript,
            capability_name=capability.name,
        )

        updated_assessment = self.repo.update_evaluation(
            assessment,
            transcript=transcript,
            audio_url=audio_url,
            correctness_score=float(eval_res["correctness_score"]),
            relevance_score=float(eval_res["relevance_score"]),
            depth_score=float(eval_res["depth_score"]),
            completeness_score=float(eval_res["completeness_score"]),
            overall_score=float(eval_res["overall_score"]),
            feedback=str(eval_res["feedback"]),
        )

        # Create Evidence entry
        evidence = Evidence(
            user_id=user_id,
            capability_id=capability.id,
            type=EvidenceType.ORAL,
            source_id=updated_assessment.id,
            title=f"Oral Assessment: {capability.name}",
            description=updated_assessment.question[:200],
            score=updated_assessment.overall_score,
            quality=updated_assessment.depth_score,
            verification_status=VerificationStatus.VERIFIED,
            strength=min(1.0, updated_assessment.overall_score / 100.0),
        )
        self.db.add(evidence)

        # Update user capability strength profile
        self.user_cap_repo.upsert_add_strength(
            user_id=user_id,
            capability_id=capability.id,
            delta=updated_assessment.overall_score * 0.20,
        )

        self.db.commit()

        return OralAssessmentRead.model_validate(updated_assessment)
