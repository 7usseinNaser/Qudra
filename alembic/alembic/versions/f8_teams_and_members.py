"""add teams, team_members, and team_capabilities tables

Revision ID: f8_teams
Revises: f7_match_results
Create Date: 2026-10-04 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f8_teams'
down_revision: Union[str, None] = 'f7_match_results'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create teams table
    op.create_table(
        'teams',
        sa.Column('id', sa.UUID(), nullable=False, default=sa.text('gen_random_uuid()')),
        sa.Column('problem_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=True),
        sa.Column(
            'status',
            sa.Enum('DRAFT', 'PROPOSED', 'ACCEPTED', 'ACTIVE', 'COMPLETED', 'ARCHIVED', name='team_status'),
            nullable=False,
            server_default='PROPOSED',
        ),
        sa.Column('team_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('coverage_score', sa.Float(), nullable=False, server_default='0.0'),
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
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_teams_problem_id', 'teams', ['problem_id'])

    # 2. Create team_members table
    op.create_table(
        'team_members',
        sa.Column('id', sa.UUID(), nullable=False, default=sa.text('gen_random_uuid()')),
        sa.Column('team_id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('suggested_role', sa.String(length=255), nullable=True),
        sa.Column('contribution_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column(
            'member_status',
            sa.Enum('PROPOSED', 'INVITED', 'ACCEPTED', 'DECLINED', 'REMOVED', name='team_member_status'),
            nullable=False,
            server_default='PROPOSED',
        ),
        sa.Column(
            'covered_capabilities',
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column(
            'joined_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_team_members_team_id', 'team_members', ['team_id'])
    op.create_index('ix_team_members_user_id', 'team_members', ['user_id'])

    # 3. Create team_capabilities table
    op.create_table(
        'team_capabilities',
        sa.Column('id', sa.UUID(), nullable=False, default=sa.text('gen_random_uuid()')),
        sa.Column('team_id', sa.UUID(), nullable=False),
        sa.Column('capability_id', sa.UUID(), nullable=False),
        sa.Column('coverage_score', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('coverage_status', sa.String(length=20), nullable=False, server_default='GAP'),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['capability_id'], ['capabilities.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_team_capabilities_team_id', 'team_capabilities', ['team_id'])
    op.create_index('ix_team_capabilities_capability_id', 'team_capabilities', ['capability_id'])


def downgrade() -> None:
    op.drop_index('ix_team_capabilities_capability_id', table_name='team_capabilities')
    op.drop_index('ix_team_capabilities_team_id', table_name='team_capabilities')
    op.drop_table('team_capabilities')

    op.drop_index('ix_team_members_user_id', table_name='team_members')
    op.drop_index('ix_team_members_team_id', table_name='team_members')
    op.drop_table('team_members')

    op.drop_index('ix_teams_problem_id', table_name='teams')
    op.drop_table('teams')

    sa.Enum(name='team_member_status').drop(op.get_bind(), checkfirst=False)
    sa.Enum(name='team_status').drop(op.get_bind(), checkfirst=False)
