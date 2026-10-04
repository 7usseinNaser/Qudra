"""Pydantic schemas for Feature 9: Human / AI Allocation and Task Management."""

import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from app.db.models.task import (
    AllocationType,
    TaskComplexity,
    TaskPriority,
    TaskStatus,
)


class TaskCapabilityCreate(BaseModel):
    capability_id: uuid.UUID
    importance: int = Field(default=50, ge=1, le=100)
    required_level: str = Field(default="INTERMEDIATE")


class TaskCapabilityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    capability_id: uuid.UUID
    capability_name: str | None = None
    importance: int
    required_level: str


class TaskCreate(BaseModel):
    problem_id: uuid.UUID
    team_id: uuid.UUID | None = None
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    task_type: str | None = None
    priority: TaskPriority = TaskPriority.MEDIUM
    complexity: TaskComplexity = TaskComplexity.MEDIUM
    requires_human_judgment: bool = False
    requires_verification: bool = True
    required_capabilities: list[TaskCapabilityCreate] = Field(default_factory=list)


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    problem_id: uuid.UUID
    team_id: uuid.UUID | None = None
    title: str
    description: str | None = None
    task_type: str | None = None
    status: TaskStatus
    priority: TaskPriority
    complexity: TaskComplexity
    requires_human_judgment: bool
    requires_verification: bool
    capabilities: list[TaskCapabilityRead] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class TaskAllocationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    task_id: uuid.UUID
    task_title: str | None = None
    allocation_type: AllocationType
    primary_team_member_id: uuid.UUID | None = None
    primary_team_member_name: str | None = None
    human_suitability_score: float = Field(description="Suitability of the selected human team member (0-100)")
    ai_suitability_score: float = Field(description="Suitability score for AI automation (0-100)")
    reason: str
    ai_contribution: list[str] = Field(default_factory=list)
    human_contribution: list[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
