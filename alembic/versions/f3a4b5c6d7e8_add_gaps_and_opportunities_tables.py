"""add gaps and opportunities tables

Revision ID: f3a4b5c6d7e8
Revises: a1b2c3d4e5f6
Create Date: 2026-09-12
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "f3a4b5c6d7e8"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "gaps",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False, index=True),
        sa.Column("capability_id", postgresql.UUID(as_uuid=True), nullable=False, index=True),
        sa.Column("capability_name", sa.String(255), nullable=False),
        sa.Column("current_strength", sa.Float, nullable=False, server_default="0.0"),
        sa.Column("required_strength", sa.Float, nullable=False, server_default="0.0"),
        sa.Column("target_strength", sa.Float, nullable=False, server_default="0.0"),
        sa.Column("severity", sa.String(50), nullable=False, server_default="moderate"),
        sa.Column("reason", sa.Text, nullable=True),
        sa.Column("recommended_action", sa.Text, nullable=True),
        sa.Column("impact", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "opportunities",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("organization", sa.String(255), nullable=False),
        sa.Column("type", sa.String(50), nullable=False, server_default="job"),
        sa.Column("location", sa.String(50), nullable=False, server_default="remote"),
        sa.Column("field", sa.String(100), nullable=False),
        sa.Column("city", sa.String(100), nullable=True),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("requirements", sa.Text, nullable=True),
        sa.Column("compensation", sa.String(255), nullable=True),
        sa.Column("duration", sa.String(255), nullable=True),
        sa.Column("experience", sa.String(255), nullable=True),
        sa.Column("is_verified_org", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("posted_date", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("opportunities")
    op.drop_table("gaps")
