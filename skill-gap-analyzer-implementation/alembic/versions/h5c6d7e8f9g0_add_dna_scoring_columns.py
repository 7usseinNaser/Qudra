"""add dna scoring and project detail columns

Revision ID: h5c6d7e8f9g0
Revises: g4b5c6d7e8f9
Create Date: 2026-09-12
"""
from alembic import op
import sqlalchemy as sa

revision = "h5c6d7e8f9g0"
down_revision = "g4b5c6d7e8f9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("projects", sa.Column("technologies", sa.Text(), nullable=True))
    op.add_column("projects", sa.Column("contribution", sa.Text(), nullable=True))

    op.add_column("user_capabilities", sa.Column("evidence_strength", sa.Float(), nullable=False, server_default="0.0"))
    op.add_column("user_capabilities", sa.Column("evidence_count", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("user_capabilities", sa.Column("breakdown", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("user_capabilities", "breakdown")
    op.drop_column("user_capabilities", "evidence_count")
    op.drop_column("user_capabilities", "evidence_strength")
    op.drop_column("projects", "contribution")
    op.drop_column("projects", "technologies")
