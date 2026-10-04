import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Float, ForeignKey, UniqueConstraint, func, JSON
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class MatchResult(Base):
    """A calculated match result snapshot between a candidate user and a problem."""

    __tablename__ = "match_results"
    __table_args__ = (
        UniqueConstraint("problem_id", "user_id", name="uq_problem_user_match"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    problem_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("problems.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    total_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    capability_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    practical_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    project_relevance_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    oral_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    freshness_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

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
    user: Mapped["User"] = relationship("User")
