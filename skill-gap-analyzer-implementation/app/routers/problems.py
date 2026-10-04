import uuid
from typing import Sequence

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.problem import (
    ProblemAnalysisRead,
    ProblemCreate,
    ProblemRead,
)
from app.services.problem_analysis_service import ProblemAnalysisService

router = APIRouter(prefix="/problems", tags=["problems"])


@router.post("", response_model=ProblemRead, status_code=status.HTTP_201_CREATED)
def create_problem(
    payload: ProblemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProblemRead:
    service = ProblemAnalysisService(db)
    return service.create_problem(current_user.id, payload)


@router.get("", response_model=list[ProblemRead])
def list_problems(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ProblemRead]:
    service = ProblemAnalysisService(db)
    return service.list_user_problems(current_user.id, page=page, page_size=page_size)


@router.get("/{problem_id}", response_model=ProblemRead)
def get_problem(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProblemRead:
    service = ProblemAnalysisService(db)
    return service.get_problem(problem_id, current_user.id)


@router.post("/{problem_id}/analyze", response_model=ProblemAnalysisRead)
async def analyze_problem(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProblemAnalysisRead:
    service = ProblemAnalysisService(db)
    return await service.analyze_problem(problem_id, current_user.id)


@router.get("/{problem_id}/analysis", response_model=ProblemAnalysisRead)
def get_problem_analysis(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProblemAnalysisRead:
    service = ProblemAnalysisService(db)
    return service.get_analysis(problem_id, current_user.id)
