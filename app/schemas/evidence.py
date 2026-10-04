import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from typing import Any
from app.db.models.evidence import EvidenceType, VerificationStatus


class EvidenceCreate(BaseModel):
    capability_id: uuid.UUID
    type: EvidenceType
    project_id: uuid.UUID | None = None
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    strength: float = Field(default=1.0, gt=0, le=100)
    score: float | None = None
    verification_status: VerificationStatus = VerificationStatus.VERIFIED
    evidence_metadata: dict[str, Any] | None = None


class EvidenceStatusUpdate(BaseModel):
    status: VerificationStatus


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
    score: float = 0.0
    verification_status: VerificationStatus = VerificationStatus.VERIFIED
    evidence_metadata: dict[str, Any] | None = None
    created_at: datetime
