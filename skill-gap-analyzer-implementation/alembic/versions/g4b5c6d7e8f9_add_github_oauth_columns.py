"""add github oauth columns to users

Revision ID: g4b5c6d7e8f9
Revises: f3a4b5c6d7e8
Create Date: 2026-09-12
"""
from alembic import op
import sqlalchemy as sa

revision = "g4b5c6d7e8f9"
down_revision = "f3a4b5c6d7e8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("github_id", sa.String(100), nullable=True))
    op.add_column("users", sa.Column("github_username", sa.String(100), nullable=True))
    op.add_column("users", sa.Column("github_access_token", sa.String(255), nullable=True))
    op.create_unique_constraint("uq_users_github_id", "users", ["github_id"])
    op.create_index("ix_users_github_id", "users", ["github_id"])


def downgrade() -> None:
    op.drop_index("ix_users_github_id", table_name="users")
    op.drop_constraint("uq_users_github_id", "users", type_="unique")
    op.drop_column("users", "github_access_token")
    op.drop_column("users", "github_username")
    op.drop_column("users", "github_id")
