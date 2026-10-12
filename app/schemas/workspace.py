"""Pydantic schemas for Feature 10: Mini Project Workspace."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.db.models.task import TaskPriority, TaskStatus
from app.db.models.workspace import WorkspaceMemberStatus, WorkspaceStatus


# ---------------------------------------------------------------------------
# Workspace Member
# ---------------------------------------------------------------------------


class WorkspaceMemberRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID
    user_id: uuid.UUID
    team_member_id: uuid.UUID
    role: str
    status: WorkspaceMemberStatus
    joined_at: datetime


# ---------------------------------------------------------------------------
# Task (workspace-aware view)
# ---------------------------------------------------------------------------


class WorkspaceTaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    task_type: str | None = None
    priority: TaskPriority = TaskPriority.MEDIUM
    estimated_effort: str | None = None
    due_at: datetime | None = None
    assigned_member_id: uuid.UUID | None = None


class WorkspaceTaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    workspace_id: uuid.UUID | None
    problem_id: uuid.UUID
    title: str
    description: str | None = None
    task_type: str | None = None
    status: TaskStatus
    priority: TaskPriority
    estimated_effort: str | None = None
    due_at: datetime | None = None
    completed_at: datetime | None = None
    assigned_member_id: uuid.UUID | None = None
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Workspace Progress
# ---------------------------------------------------------------------------


class WorkspaceProgressRead(BaseModel):
    workspace_id: uuid.UUID
    total_tasks: int
    todo: int
    in_progress: int
    done: int
    blocked: int
    cancelled: int
    progress_percent: float = Field(description="Completed tasks / total × 100")


# ---------------------------------------------------------------------------
# Workspace
# ---------------------------------------------------------------------------


class WorkspaceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    problem_id: uuid.UUID
    team_id: uuid.UUID
    title: str
    description: str | None = None
    status: WorkspaceStatus
    progress: float
    started_at: datetime | None = None
    completed_at: datetime | None = None
    outcome_summary: str | None = None
    created_at: datetime
    updated_at: datetime
    members: list[WorkspaceMemberRead] = Field(default_factory=list)


class WorkspaceDashboardRead(BaseModel):
    """Rich dashboard — workspace + progress counters."""

    workspace: WorkspaceRead
    progress: WorkspaceProgressRead
