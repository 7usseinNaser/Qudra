import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.db.models.oral_assessment import OralAssessmentStatus


class OralQuestionCreateRequest(BaseModel):
    capability_id: uuid.UUID
    difficulty: str = Field(default="INTERMEDIATE", max_length=50)


class OralAssessmentQuestionRead(BaseModel):
    assessment_id: uuid.UUID
    capability_id: uuid.UUID
    capability_name: str
    question: str
    difficulty: str
    status: OralAssessmentStatus


class OralAssessmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    capability_id: uuid.UUID
    question: str
    difficulty: str
    audio_url: str | None
    transcript: str | None
    correctness_score: float
    relevance_score: float
    depth_score: float
    clarity_score: float
    overall_score: float
    feedback: str | None
    status: OralAssessmentStatus
    created_at: datetime
    completed_at: datetime | None
