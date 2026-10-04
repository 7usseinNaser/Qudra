import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.repositories.opportunity_repository import OpportunityRepository
from app.schemas.opportunity import OpportunityCreate, OpportunityRead

router = APIRouter(prefix="/opportunities", tags=["opportunities"])


@router.post("", response_model=OpportunityRead, status_code=status.HTTP_201_CREATED)
def create_opportunity(
    payload: OpportunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OpportunityRead:
    repo = OpportunityRepository(db)
    opp = repo.create(
        title=payload.title,
        organization=payload.organization,
        type=payload.type,
        location=payload.location,
        field=payload.field,
        city=payload.city,
        description=payload.description,
        requirements=payload.requirements,
        compensation=payload.compensation,
        duration=payload.duration,
        experience=payload.experience,
        is_verified_org=payload.is_verified_org,
    )
    return OpportunityRead.model_validate(opp)


@router.get("", response_model=list[OpportunityRead])
def list_opportunities(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[OpportunityRead]:
    skip = (page - 1) * page_size
    opps = OpportunityRepository(db).list_all(skip=skip, limit=page_size)
    return [OpportunityRead.model_validate(o) for o in opps]


@router.get("/{opportunity_id}", response_model=OpportunityRead)
def get_opportunity(
    opportunity_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OpportunityRead:
    opp = OpportunityRepository(db).get_by_id(opportunity_id)
    if not opp:
        from app.core.exceptions import AppError
        raise AppError("Opportunity not found.")
    return OpportunityRead.model_validate(opp)
