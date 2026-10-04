"""Pydantic schemas for Feature 7: Explainable Matching."""

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class MatchCapabilityBreakdown(BaseModel):
    """Per-capability score breakdown for a candidate against a problem requirement."""

    capability_id: uuid.UUID
    capability_name: str
    required_level: str
    importance: int
    user_score: float = Field(description="User's evidence_strength for this capability (0-100)")
    status: str = Field(description="COVERED / PARTIAL / GAP")


class MatchExplanation(BaseModel):
    """Structured, fact-based explanation of a match result."""

    summary: str
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    relevant_projects: list[str] = Field(default_factory=list)


class MatchCandidateRead(BaseModel):
    """A single candidate's match result for a problem."""

    model_config = ConfigDict(from_attributes=True)

    user_id: uuid.UUID
    user_name: str
    total_score: float = Field(description="Final weighted match score (0-100)")
    capability_score: float = Field(description="Weighted capability match component (0-100)")
    practical_score: float = Field(description="Practical evidence component (0-100)")
    project_relevance_score: float = Field(description="Project relevance component (0-100)")
    oral_score: float = Field(description="Oral assessment component (0-100)")
    freshness_score: float = Field(description="Evidence freshness component (0-100)")
    explanation: MatchExplanation
    capability_breakdown: list[MatchCapabilityBreakdown] = Field(default_factory=list)
    matched_at: datetime | None = None


class MatchesResponse(BaseModel):
    """Top-level response for problem matching endpoint."""

    model_config = ConfigDict(from_attributes=True)

    problem_id: uuid.UUID
    problem_title: str
    total_candidates: int
    weights: dict[str, float]
    matches: list[MatchCandidateRead] = Field(default_factory=list)
