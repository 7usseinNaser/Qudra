"""add tasks, task_capabilities, and task_allocations tables

Revision ID: f9_tasks_allocations
Revises: f8_teams
Create Date: 2026-10-04 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f9_tasks_allocations'
down_revision: Union[str, None] = 'f8_teams'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.UUID(), nullable=False, default=sa.text('gen_random_uuid()')),
        sa.Column('problem_id', sa.UUID(), nullable=False),
        sa.Column('team_id', sa.UUID(), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('task_type', sa.String(length=100), nullable=True),
        sa.Column(
            'status',
            sa.Enum('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED', name='task_status'),
            nullable=False,
            server_default='TODO',
        ),
        sa.Column(
            'priority',
            sa.Enum('HIGH', 'MEDIUM', 'LOW', name='task_priority'),
            nullable=False,
            server_default='MEDIUM',
        ),
        sa.Column(
            'complexity',
            sa.Enum('HIGH', 'MEDIUM', 'LOW', name='task_complexity'),
            nullable=False,
            server_default='MEDIUM',
        ),
        sa.Column('requires_human_judgment', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('requires_verification', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(['problem_id'], ['problems.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_tasks_problem_id', 'tasks', ['problem_id'])
    op.create_index('ix_tasks_team_id', 'tasks', ['team_id'])

    # 2. Create task_capabilities table
    op.create_table(
        'task_capabilities',
        sa.Column('id', sa.UUID(), nullable=False, default=sa.text('gen_random_uuid()')),
        sa.Column('task_id', sa.UUID(), nullable=False),
        sa.Column('capability_id', sa.UUID(), nullable=False),
        sa.Column('importance', sa.Integer(), nullable=False, server_default='50'),
        sa.Column('required_level', sa.String(length=50), nullable=False, server_default='INTERMEDIATE'),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['capability_id'], ['capabilities.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('task_id', 'capability_id', name='uq_task_capability'),
    )
    op.create_index('ix_task_capabilities_task_id', 'task_capabilities', ['task_id'])
    op.create_index('ix_task_capabilities_capability_id', 'task_capabilities', ['capability_id'])

    # 3. Create task_allocations table
    op.create_table(
        'task_allocations',
        sa.Column('id', sa.UUID(), nullable=False, default=sa.text('gen_random_uuid()')),
        sa.Column('task_id', sa.UUID(), nullable=False),
        sa.Column(
            'allocation_type',
            sa.Enum('HUMAN', 'AI', 'HUMAN_AI', name='allocation_type'),
            nullable=False,
        ),
        sa.Column('primary_team_member_id', sa.UUID(), nullable=True),
        sa.Column('human_suitability_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('ai_suitability_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.Column(
            'ai_contribution',
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column(
            'human_contribution',
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['primary_team_member_id'], ['team_members.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('task_id', name='uq_task_allocation_task_id'),
    )
    op.create_index('ix_task_allocations_task_id', 'task_allocations', ['task_id'])
    op.create_index('ix_task_allocations_primary_team_member_id', 'task_allocations', ['primary_team_member_id'])


def downgrade() -> None:
    op.drop_index('ix_task_allocations_primary_team_member_id', table_name='task_allocations')
    op.drop_index('ix_task_allocations_task_id', table_name='task_allocations')
    op.drop_table('task_allocations')

    op.drop_index('ix_task_capabilities_capability_id', table_name='task_capabilities')
    op.drop_index('ix_task_capabilities_task_id', table_name='task_capabilities')
    op.drop_table('task_capabilities')

    op.drop_index('ix_tasks_team_id', table_name='tasks')
    op.drop_index('ix_tasks_problem_id', table_name='tasks')
    op.drop_table('tasks')

    sa.Enum(name='allocation_type').drop(op.get_bind(), checkfirst=False)
    sa.Enum(name='task_complexity').drop(op.get_bind(), checkfirst=False)
    sa.Enum(name='task_priority').drop(op.get_bind(), checkfirst=False)
    sa.Enum(name='task_status').drop(op.get_bind(), checkfirst=False)
