import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class GapCreate(BaseModel):
    capability_id: uuid.UUID
    capability_name: str = Field(min_length=1, max_length=255)
    current_strength: float = Field(default=0.0, ge=0.0, le=100.0)
    required_strength: float = Field(default=0.0, ge=0.0, le=100.0)
    target_strength: float = Field(default=0.0, ge=0.0, le=100.0)
    severity: str = Field(default="moderate", max_length=50)
    reason: str | None = None
    recommended_action: str | None = None
    impact: str | None = None


class GapRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    capability_id: uuid.UUID
    capability_name: str
    current_strength: float
    required_strength: float
    target_strength: float
    severity: str
    reason: str | None
    recommended_action: str | None
    impact: str | None
    created_at: datetime
