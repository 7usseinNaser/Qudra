"""add capability score columns and verification status

Revision ID: f5_cap_score
Revises: c866348b018b
Create Date: 2026-09-17 12:15:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'f5_cap_score'
down_revision: Union[str, None] = 'c866348b018b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    verification_status = sa.Enum('PENDING', 'VERIFIED', 'REJECTED', name='verification_status')
    if bind.dialect.name == 'postgresql':
        verification_status.create(bind, checkfirst=True)

    op.add_column('evidence', sa.Column('score', sa.Float(), server_default='0.0', nullable=False))
    op.add_column('evidence', sa.Column(
        'verification_status',
        verification_status,
        server_default='VERIFIED',
        nullable=False
    ))
    op.add_column('evidence', sa.Column(
        'evidence_metadata',
        sa.JSON().with_variant(postgresql.JSONB(), 'postgresql'),
        nullable=True
    ))

    op.add_column('user_capabilities', sa.Column('evidence_strength', sa.Float(), server_default='0.0', nullable=False))
    op.add_column('user_capabilities', sa.Column('evidence_count', sa.Integer(), server_default='0', nullable=False))
    op.add_column('user_capabilities', sa.Column('last_evaluated_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('user_capabilities', sa.Column(
        'breakdown',
        sa.JSON().with_variant(postgresql.JSONB(), 'postgresql'),
        nullable=True
    ))


def downgrade() -> None:
    op.drop_column('user_capabilities', 'breakdown')
    op.drop_column('user_capabilities', 'last_evaluated_at')
    op.drop_column('user_capabilities', 'evidence_count')
    op.drop_column('user_capabilities', 'evidence_strength')

    op.drop_column('evidence', 'evidence_metadata')
    op.drop_column('evidence', 'verification_status')
    op.drop_column('evidence', 'score')

    bind = op.get_bind()
    if bind.dialect.name == 'postgresql':
        sa.Enum(name='verification_status').drop(bind, checkfirst=True)
