"""Feature 9 & 10: Task, TaskCapability, TaskAllocation, and TaskAssignment models.

Provides full lifecycle management for project tasks within a Mini Project Workspace.
"""

import enum
import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text, UniqueConstraint, func, JSON
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class AllocationType(str, enum.Enum):
    HUMAN = "HUMAN"
    AI = "AI"
    HUMAN_AI = "HUMAN_AI"


class TaskStatus(str, enum.Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"
    BLOCKED = "BLOCKED"
    CANCELLED = "CANCELLED"


class TaskPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class TaskComplexity(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class Task(Base):
    """A project work task associated with a Workspace, Problem, and Team."""

    __tablename__ = "tasks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    workspace_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("workspaces.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    problem_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("problems.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    team_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("teams.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    task_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, name="task_status"),
        default=TaskStatus.TODO,
        nullable=False,
    )
    priority: Mapped[TaskPriority] = mapped_column(
        Enum(TaskPriority, name="task_priority"),
        default=TaskPriority.MEDIUM,
        nullable=False,
    )
    complexity: Mapped[TaskComplexity] = mapped_column(
        Enum(TaskComplexity, name="task_complexity"),
        default=TaskComplexity.MEDIUM,
        nullable=False,
    )
    requires_human_judgment: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    requires_verification: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    estimated_effort: Mapped[str | None] = mapped_column(String(50), nullable=True)
    due_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    assigned_member_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("workspace_members.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    problem: Mapped["Problem"] = relationship("Problem")
    team: Mapped["Team | None"] = relationship("Team")
    workspace: Mapped["Workspace | None"] = relationship("Workspace", back_populates="tasks")
    assigned_member: Mapped["WorkspaceMember | None"] = relationship(
        "WorkspaceMember", foreign_keys=[assigned_member_id]
    )
    creator: Mapped["User | None"] = relationship("User", foreign_keys=[created_by])
    capabilities: Mapped[list["TaskCapability"]] = relationship(
        "TaskCapability", back_populates="task", cascade="all, delete-orphan"
    )
    allocation: Mapped["TaskAllocation | None"] = relationship(
        "TaskAllocation", back_populates="task", uselist=False, cascade="all, delete-orphan"
    )


class TaskCapability(Base):
    """Capability requirements for a specific task."""

    __tablename__ = "task_capabilities"
    __table_args__ = (
        UniqueConstraint("task_id", "capability_id", name="uq_task_capability"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    task_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    capability_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("capabilities.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    importance: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    required_level: Mapped[str] = mapped_column(
        String(50), default="INTERMEDIATE", nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    task: Mapped["Task"] = relationship("Task", back_populates="capabilities")
    capability: Mapped["Capability"] = relationship("Capability")


class TaskAllocation(Base):
    """Stores the determined Human vs AI allocation decision for a task."""

    __tablename__ = "task_allocations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    task_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tasks.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    allocation_type: Mapped[AllocationType] = mapped_column(
        Enum(AllocationType, name="allocation_type"),
        nullable=False,
    )
    primary_team_member_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("team_members.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    human_suitability_score: Mapped[float] = mapped_column(
        Float, default=0.0, nullable=False
    )
    ai_suitability_score: Mapped[float] = mapped_column(
        Float, default=0.0, nullable=False
    )
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    ai_contribution: Mapped[Any | None] = mapped_column(
        JSON().with_variant(JSONB(), "postgresql"), nullable=True, default=list
    )
    human_contribution: Mapped[Any | None] = mapped_column(
        JSON().with_variant(JSONB(), "postgresql"), nullable=True, default=list
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    task: Mapped["Task"] = relationship("Task", back_populates="allocation")
    primary_team_member: Mapped["TeamMember | None"] = relationship("TeamMember")
