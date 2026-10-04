"""Feature 8: Team Composer — Database models.

Team, TeamMember, and TeamCapabilityCoverage models for persisting
composed team snapshots.
"""

import enum
import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Enum, Float, ForeignKey, String, func, JSON
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TeamStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PROPOSED = "PROPOSED"
    ACCEPTED = "ACCEPTED"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"


class TeamMemberStatus(str, enum.Enum):
    PROPOSED = "PROPOSED"
    INVITED = "INVITED"
    ACCEPTED = "ACCEPTED"
    DECLINED = "DECLINED"
    REMOVED = "REMOVED"


class Team(Base):
    """A composed team for a specific problem."""

    __tablename__ = "teams"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    problem_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("problems.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[TeamStatus] = mapped_column(
        Enum(TeamStatus, name="team_status"),
        default=TeamStatus.PROPOSED,
        nullable=False,
    )
    team_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    coverage_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    explanation: Mapped[Any | None] = mapped_column(
        JSON().with_variant(JSONB(), "postgresql"), nullable=True, default=dict
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
    members: Mapped[list["TeamMember"]] = relationship(
        "TeamMember", back_populates="team", cascade="all, delete-orphan"
    )
    capabilities: Mapped[list["TeamCapabilityCoverage"]] = relationship(
        "TeamCapabilityCoverage", back_populates="team", cascade="all, delete-orphan"
    )


class TeamMember(Base):
    """A member of a composed team."""

    __tablename__ = "team_members"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    team_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("teams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    suggested_role: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contribution_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    member_status: Mapped[TeamMemberStatus] = mapped_column(
        Enum(TeamMemberStatus, name="team_member_status"),
        default=TeamMemberStatus.PROPOSED,
        nullable=False,
    )
    covered_capabilities: Mapped[Any | None] = mapped_column(
        JSON().with_variant(JSONB(), "postgresql"), nullable=True, default=list
    )

    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    team: Mapped["Team"] = relationship("Team", back_populates="members")
    user: Mapped["User"] = relationship("User")


class TeamCapabilityCoverage(Base):
    """Tracks coverage status for each required capability in a team."""

    __tablename__ = "team_capabilities"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    team_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("teams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    capability_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("capabilities.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    coverage_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    coverage_status: Mapped[str] = mapped_column(String(20), default="GAP", nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    team: Mapped["Team"] = relationship("Team", back_populates="capabilities")
    capability: Mapped["Capability"] = relationship("Capability")
