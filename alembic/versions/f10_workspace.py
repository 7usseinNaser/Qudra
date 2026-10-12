"""Feature 10: Mini Project Workspace — add workspaces, workspace_members tables and alter tasks.

Revision ID: f10_workspace
Revises: f9_tasks_allocations
Create Date: 2026-10-07 19:00:00.000000
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "f10_workspace"
down_revision: Union[str, None] = "f9_tasks_allocations"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create workspaces table
    op.create_table(
        "workspaces",
        sa.Column("id", sa.UUID(), nullable=False, default=sa.text("gen_random_uuid()")),
        sa.Column("problem_id", sa.UUID(), nullable=False),
        sa.Column("team_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "status",
            sa.Enum(
                "PLANNING",
                "IN_PROGRESS",
                "COMPLETED",
                "ARCHIVED",
                name="workspace_status",
            ),
            nullable=False,
            server_default="PLANNING",
        ),
        sa.Column("progress", sa.Float(), nullable=False, server_default="0.0"),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("outcome_summary", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["problem_id"], ["problems.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["team_id"], ["teams.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_workspaces_problem_id", "workspaces", ["problem_id"])
    op.create_index("ix_workspaces_team_id", "workspaces", ["team_id"])

    # 2. Create workspace_members table
    op.create_table(
        "workspace_members",
        sa.Column("id", sa.UUID(), nullable=False, default=sa.text("gen_random_uuid()")),
        sa.Column("workspace_id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("team_member_id", sa.UUID(), nullable=False),
        sa.Column("role", sa.String(255), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "ACTIVE",
                "REMOVED",
                name="workspace_member_status",
            ),
            nullable=False,
            server_default="ACTIVE",
        ),
        sa.Column(
            "joined_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["workspace_id"], ["workspaces.id"], ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["team_member_id"], ["team_members.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_workspace_members_workspace_id", "workspace_members", ["workspace_id"]
    )
    op.create_index(
        "ix_workspace_members_user_id", "workspace_members", ["user_id"]
    )
    op.create_index(
        "ix_workspace_members_team_member_id", "workspace_members", ["team_member_id"]
    )

    # 3. Alter tasks table — add workspace columns
    op.add_column(
        "tasks",
        sa.Column(
            "workspace_id",
            sa.UUID(),
            sa.ForeignKey("workspaces.id", ondelete="CASCADE"),
            nullable=True,
            index=True,
        ),
    )
    op.add_column(
        "tasks",
        sa.Column(
            "assigned_member_id",
            sa.UUID(),
            sa.ForeignKey("workspace_members.id", ondelete="SET NULL"),
            nullable=True,
            index=True,
        ),
    )
    op.add_column(
        "tasks",
        sa.Column("estimated_effort", sa.String(50), nullable=True),
    )
    op.add_column(
        "tasks",
        sa.Column("due_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "tasks",
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "tasks",
        sa.Column(
            "created_by",
            sa.UUID(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.create_index("ix_tasks_workspace_id", "tasks", ["workspace_id"])
    op.create_index("ix_tasks_assigned_member_id", "tasks", ["assigned_member_id"])

    # 4. Extend task_status enum with BLOCKED value (PostgreSQL only)
    # For SQLite (used in testing), the Enum is stored as VARCHAR so no DDL needed.
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'BLOCKED'")
        op.execute("ALTER TYPE task_priority ADD VALUE IF NOT EXISTS 'CRITICAL'")


def downgrade() -> None:
    op.drop_index("ix_tasks_assigned_member_id", table_name="tasks")
    op.drop_index("ix_tasks_workspace_id", table_name="tasks")
    op.drop_column("tasks", "created_by")
    op.drop_column("tasks", "completed_at")
    op.drop_column("tasks", "due_at")
    op.drop_column("tasks", "estimated_effort")
    op.drop_column("tasks", "assigned_member_id")
    op.drop_column("tasks", "workspace_id")

    op.drop_index(
        "ix_workspace_members_team_member_id", table_name="workspace_members"
    )
    op.drop_index("ix_workspace_members_user_id", table_name="workspace_members")
    op.drop_index(
        "ix_workspace_members_workspace_id", table_name="workspace_members"
    )
    op.drop_table("workspace_members")

    op.drop_index("ix_workspaces_team_id", table_name="workspaces")
    op.drop_index("ix_workspaces_problem_id", table_name="workspaces")
    op.drop_table("workspaces")

    sa.Enum(name="workspace_member_status").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="workspace_status").drop(op.get_bind(), checkfirst=True)
