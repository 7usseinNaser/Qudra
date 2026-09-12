import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ChallengeCreate(BaseModel):
    capability_id: uuid.UUID
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=10)
    difficulty: str = Field(default="INTERMEDIATE")
    time_limit: int | None = Field(default=None, ge=1)
    evaluation_criteria: dict[str, Any] | list[Any] | None = None
    starter_code: str | None = None


class ChallengeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    capability_id: uuid.UUID
    title: str
    description: str
    difficulty: str
    time_limit: int | None
    starter_code: str | None
    evaluation_criteria: Any | None
    created_at: datetime


class ChallengeSubmitRequest(BaseModel):
    answer: str | None = None
    code: str | None = None
    repository_url: str | None = None


class ChallengeSubmissionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    challenge_id: uuid.UUID
    user_id: uuid.UUID
    answer: str | None
    code: str | None
    repository_url: str | None
    test_score: float
    ai_score: float
    final_score: float
    feedback: str | None
    created_at: datetime
