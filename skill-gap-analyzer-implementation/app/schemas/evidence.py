import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.db.models.evidence import EvidenceType


class EvidenceCreate(BaseModel):
    capability_id: uuid.UUID
    type: EvidenceType
    project_id: uuid.UUID | None = None
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    strength: float = Field(default=1.0, gt=0, le=100)


class EvidenceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    capability_id: uuid.UUID
    type: EvidenceType
    project_id: uuid.UUID | None
    title: str
    description: str | None
    strength: float
    created_at: datetime
