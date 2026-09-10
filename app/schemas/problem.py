import uuid
from datetime import datetime

from typing import Any
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.db.models.problem import ProblemStatus


class ProblemCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=10)
    domain: str | None = Field(default=None, max_length=120)


class RequiredCapabilityRead(BaseModel):
    capability_id: uuid.UUID
    name: str
    category: str | None = None
    importance: int | str
    required_level: str | int
    reason: str | None = None


class ProblemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: str
    domain: str | None
    project_type: str | None
    status: ProblemStatus
    created_at: datetime
    updated_at: datetime
    required_capabilities: list[RequiredCapabilityRead] = []


class RequiredCapabilityAnalysis(BaseModel):
    name: str = Field(min_length=1)
    category: str | None = None
    importance: int = Field(default=50)
    required_level: str = Field(default="INTERMEDIATE")
    reason: str | None = None

    @field_validator("importance", mode="before")
    @classmethod
    def parse_importance(cls, v: Any) -> int:
        if isinstance(v, (int, float)):
            return max(0, min(100, int(v)))
        if isinstance(v, str):
            v_clean = v.strip().upper()
            mapping = {"HIGH": 90, "MEDIUM": 60, "LOW": 30, "CRITICAL": 95}
            if v_clean in mapping:
                return mapping[v_clean]
            try:
                return max(0, min(100, int(v_clean)))
            except ValueError:
                return 50
        return 50

    @field_validator("required_level", mode="before")
    @classmethod
    def parse_required_level(cls, v: Any) -> str:
        if isinstance(v, (int, float)):
            val = int(v)
            if val >= 80:
                return f"ADVANCED ({val}%)"
            elif val >= 50:
                return f"INTERMEDIATE ({val}%)"
            else:
                return f"BEGINNER ({val}%)"
        return str(v)


class ProblemAnalysisResponse(BaseModel):
    project_type: str = Field(min_length=1)
    domain: str | None = None
    target_users: list[str] = []
    problem_summary: str = Field(min_length=1)
    solution_direction: str = Field(min_length=1)
    required_capabilities: list[RequiredCapabilityAnalysis] = []
    technical_requirements: list[str] = []
    potential_features: list[str] = []
    constraints: list[str] = []


class ProblemAnalysisRead(BaseModel):
    problem_id: uuid.UUID
    project_type: str | None
    domain: str | None
    problem_summary: str | None
    solution_direction: str | None
    target_users: list[str] = []
    technical_requirements: list[str] = []
    potential_features: list[str] = []
    constraints: list[str] = []
    required_capabilities: list[RequiredCapabilityRead] = []
    created_at: datetime
