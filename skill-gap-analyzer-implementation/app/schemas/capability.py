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
    updated_at: datetime
