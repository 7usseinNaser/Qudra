"""add problems, problem_capabilities, and problem_analyses tables

Revision ID: d98129e410a1
Revises: f5_cap_score
Create Date: 2026-09-20 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd98129e410a1'
down_revision: Union[str, None] = 'f5_cap_score'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    problem_status = sa.Enum('DRAFT', 'ANALYZING', 'ANALYZED', 'FAILED', name='problem_status')
    if bind.dialect.name == 'postgresql':
        problem_status.create(bind, checkfirst=True)

    # 1. Create problems table
    op.create_table(
        'problems',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('domain', sa.String(length=120), nullable=True),
        sa.Column('project_type', sa.String(length=120), nullable=True),
        sa.Column('status', problem_status, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_problems_user_id'), 'problems', ['user_id'], unique=False)

    # 2. Create problem_capabilities table
    op.create_table(
        'problem_capabilities',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('problem_id', sa.UUID(), nullable=False),
        sa.Column('capability_id', sa.UUID(), nullable=False),
        sa.Column('importance', sa.Integer(), nullable=False),
        sa.Column('required_level', sa.String(length=50), nullable=False),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['capability_id'], ['capabilities.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['problem_id'], ['problems.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('problem_id', 'capability_id', name='uq_problem_capability')
    )
    op.create_index(op.f('ix_problem_capabilities_problem_id'), 'problem_capabilities', ['problem_id'], unique=False)
    op.create_index(op.f('ix_problem_capabilities_capability_id'), 'problem_capabilities', ['capability_id'], unique=False)

    # 3. Create problem_analyses table
    op.create_table(
        'problem_analyses',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('problem_id', sa.UUID(), nullable=False),
        sa.Column('project_type', sa.String(length=255), nullable=True),
        sa.Column('domain', sa.String(length=120), nullable=True),
        sa.Column('problem_summary', sa.Text(), nullable=True),
        sa.Column('solution_direction', sa.Text(), nullable=True),
        sa.Column('target_users', sa.JSON().with_variant(postgresql.JSONB(), 'postgresql'), nullable=True),
        sa.Column('technical_requirements', sa.JSON().with_variant(postgresql.JSONB(), 'postgresql'), nullable=True),
        sa.Column('potential_features', sa.JSON().with_variant(postgresql.JSONB(), 'postgresql'), nullable=True),
        sa.Column('constraints', sa.JSON().with_variant(postgresql.JSONB(), 'postgresql'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['problem_id'], ['problems.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('problem_id')
    )
    op.create_index(op.f('ix_problem_analyses_problem_id'), 'problem_analyses', ['problem_id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_problem_analyses_problem_id'), table_name='problem_analyses')
    op.drop_table('problem_analyses')
    op.drop_index(op.f('ix_problem_capabilities_capability_id'), table_name='problem_capabilities')
    op.drop_index(op.f('ix_problem_capabilities_problem_id'), table_name='problem_capabilities')
    op.drop_table('problem_capabilities')
    op.drop_index(op.f('ix_problems_user_id'), table_name='problems')
    op.drop_table('problems')
    bind = op.get_bind()
    if bind.dialect.name == 'postgresql':
        sa.Enum(name='problem_status').drop(bind, checkfirst=True)
