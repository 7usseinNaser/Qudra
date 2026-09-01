import enum
import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String, Text, func, JSON
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ChallengeSubmissionStatus(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    EVALUATING = "EVALUATING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class Challenge(Base):
    __tablename__ = "challenges"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    capability_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("capabilities.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50), default="INTERMEDIATE", nullable=False)
    time_limit_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    evaluation_criteria: Mapped[Any | None] = mapped_column(
        JSON().with_variant(JSONB(), "postgresql"), nullable=True
    )
    starter_content: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    capability: Mapped["Capability"] = relationship("Capability")
    submissions: Mapped[list["ChallengeSubmission"]] = relationship(
        "ChallengeSubmission", back_populates="challenge", cascade="all, delete-orphan"
    )


class ChallengeSubmission(Base):
    __tablename__ = "challenge_submissions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    challenge_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    submission_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    code: Mapped[str | None] = mapped_column(Text, nullable=True)
    repository_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    test_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    ai_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    final_score: Mapped[float | None] = mapped_column(Float, nullable=True)

    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[ChallengeSubmissionStatus] = mapped_column(
        Enum(ChallengeSubmissionStatus, name="challenge_submission_status"),
        default=ChallengeSubmissionStatus.SUBMITTED,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    evaluated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    challenge: Mapped["Challenge"] = relationship("Challenge", back_populates="submissions")
    user: Mapped["User"] = relationship("User")
