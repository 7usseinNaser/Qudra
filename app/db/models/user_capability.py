import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserCapability(Base):
    """A user's capability-profile entry.

    `strength` reflects the strength/quality of accumulated evidence, NOT an
    "expertise percentage" (spec section 8). The real scoring algorithm is
    introduced in Phase 5; for now this is a simple additive placeholder
    maintained by EvidenceService.
    """

    __tablename__ = "user_capabilities"
    __table_args__ = (UniqueConstraint("user_id", "capability_id", name="uq_user_capability"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    capability_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("capabilities.id", ondelete="CASCADE"), nullable=False
    )
    strength: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
