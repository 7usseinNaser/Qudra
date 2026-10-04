import uuid
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class SkillGapSummary(BaseModel):
    covered: int = 0
    partial: int = 0
    gaps: int = 0


class SkillGapCapabilityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    capability_id: uuid.UUID
    capability_name: str
    required_level: str
    current_score: float
    status: Literal["COVERED", "PARTIAL", "GAP"]
    gap: float
    priority: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW", "NONE"]
    reason: str


class SkillGapResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    problem_id: uuid.UUID
    user_id: uuid.UUID
    overall_readiness: float
    summary: SkillGapSummary
    capabilities: list[SkillGapCapabilityRead] = Field(default_factory=list)
