import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CapabilityCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    category: str | None = Field(default=None, max_length=120)
    description: str | None = None


class CapabilityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    category: str | None
    description: str | None
    created_at: datetime


class UserCapabilityRead(BaseModel):
    id: uuid.UUID
    capability_id: uuid.UUID
    capability_name: str
    capability_category: str | None
    strength: float
    evidence_strength: float = 0.0
    evidence_count: int = 0
    components: dict[str, float] = Field(default_factory=dict)
    weights: dict[str, float] = Field(default_factory=dict)
    last_evaluated_at: datetime | None = None
    updated_at: datetime


class CapabilitySummary(BaseModel):
    id: uuid.UUID
    name: str


class CapabilityScoreComponents(BaseModel):
    practical: float = 0.0
    project: float = 0.0
    oral: float = 0.0
    freshness: float = 0.0


class CapabilityScoreWeights(BaseModel):
    practical: float = 0.40
    project: float = 0.30
    oral: float = 0.20
    freshness: float = 0.10


class CapabilityScoreDetailRead(BaseModel):
    capability: CapabilitySummary
    score: float
    components: CapabilityScoreComponents
    weights: CapabilityScoreWeights
    evidence_count: int
    last_evaluated_at: datetime | None = None
