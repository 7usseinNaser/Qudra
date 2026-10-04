import enum
import uuid
from datetime import datetime

from typing import Any

from sqlalchemy import DateTime, Enum, Float, ForeignKey, String, Text, func, JSON
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class EvidenceType(str, enum.Enum):
    PROJECT = "PROJECT"
    ORAL = "ORAL"
    PRACTICAL = "PRACTICAL"


class VerificationStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class Evidence(Base):
    """A single piece of evidence contributing to a user's Capability Profile.

    `project_id` is populated (and required) when type == PROJECT, linking
    back to the Project that serves as proof. ORAL/PRACTICAL evidence is
    logged directly here in Phase 2; the assessment mechanics that generate
    them (OralAssessment, Challenge/ChallengeSubmission) arrive in Phase 4.
    """

    __tablename__ = "evidence"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    capability_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("capabilities.id", ondelete="CASCADE"), nullable=False
    )
    type: Mapped[EvidenceType] = mapped_column(
        Enum(EvidenceType, name="evidence_type"), nullable=False
    )
    project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    strength: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus, name="verification_status"),
        default=VerificationStatus.VERIFIED,
        nullable=False,
    )
    evidence_metadata: Mapped[Any | None] = mapped_column(
        JSON().with_variant(JSONB(), "postgresql"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
