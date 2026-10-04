"""add match_results table

Revision ID: f7_match_results
Revises: d98129e410a1
Create Date: 2026-10-03 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f7_match_results'
down_revision: Union[str, None] = 'd98129e410a1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'match_results',
        sa.Column('id', sa.UUID(), nullable=False, default=sa.text('gen_random_uuid()')),
        sa.Column('problem_id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('total_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('capability_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('practical_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('project_relevance_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('oral_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('freshness_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column(
            'explanation',
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
        sa.ForeignKeyConstraint(['problem_id'], ['problems.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('problem_id', 'user_id', name='uq_problem_user_match'),
    )
    op.create_index('ix_match_results_problem_id', 'match_results', ['problem_id'])
    op.create_index('ix_match_results_user_id', 'match_results', ['user_id'])


def downgrade() -> None:
    op.drop_index('ix_match_results_user_id', table_name='match_results')
    op.drop_index('ix_match_results_problem_id', table_name='match_results')
    op.drop_table('match_results')
