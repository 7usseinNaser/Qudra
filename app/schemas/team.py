"""Pydantic schemas for Feature 8: Team Composer."""

import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from app.db.models.team import TeamMemberStatus, TeamStatus


class ComposeTeamRequest(BaseModel):
    """Optional configuration parameters for composing a team."""

    max_team_size: int = Field(default=5, ge=1, le=20, description="Maximum number of team members")
    min_coverage_threshold: float = Field(default=70.0, ge=0.0, le=100.0, description="Score threshold to consider a capability covered")


class TeamMemberRead(BaseModel):
    """A member selected for the composed team."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID | None = None
    user_id: uuid.UUID
    user_name: str | None = None
    suggested_role: str = Field(description="Evidence-based suggested role")
    contribution_score: float = Field(description="Individual contribution / match score (0-100)")
    member_status: TeamMemberStatus = TeamMemberStatus.PROPOSED
    covered_capabilities: list[str] = Field(default_factory=list, description="Names of required capabilities covered by this member")


class TeamCapabilityCoverageRead(BaseModel):
    """Coverage status for a single required capability across the composed team."""

    model_config = ConfigDict(from_attributes=True)

    capability_id: uuid.UUID
    capability: str
    required_level: str
    importance: int | None = None
    coverage_score: float = Field(description="Highest/effective capability score in team (0-100)")
    status: Literal["COVERED", "PARTIAL", "GAP"]


class TeamGapRead(BaseModel):
    """A required capability that remains uncovered or partially covered by the team."""

    capability_id: uuid.UUID
    capability: str
    required_level: str
    coverage_score: float = 0.0
    status: Literal["PARTIAL", "GAP"]
    reason: str


class TeamExplanation(BaseModel):
    """Structured, fact-based explanation of why this team was composed."""

    summary: str
    member_explanations: list[str] = Field(default_factory=list)
    redundancy_notes: list[str] = Field(default_factory=list)


class TeamCompositionResponse(BaseModel):
    """Top-level response for team composition."""

    model_config = ConfigDict(from_attributes=True)

    team_id: uuid.UUID
    problem_id: uuid.UUID
    problem_title: str | None = None
    team_score: float = Field(description="Overall team objective score (0-100)")
    coverage_score: float = Field(description="Overall capability coverage score (0-100)")
    team_size: int
    status: TeamStatus = TeamStatus.PROPOSED
    members: list[TeamMemberRead] = Field(default_factory=list)
    capability_coverage: list[TeamCapabilityCoverageRead] = Field(default_factory=list)
    gaps: list[TeamGapRead] = Field(default_factory=list)
    explanation: TeamExplanation
    created_at: datetime | None = None
