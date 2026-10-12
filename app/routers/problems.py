import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.allocation import TaskRead
from app.schemas.matching import MatchesResponse
from app.schemas.problem import (
    ProblemAnalysisRead,
    ProblemCreate,
    ProblemRead,
)
from app.schemas.skill_gap import SkillGapResponse
from app.schemas.team import ComposeTeamRequest, TeamCompositionResponse
from app.schemas.workspace import WorkspaceRead
from app.services.matching_service import MatchingService
from app.services.problem_analysis_service import ProblemAnalysisService
from app.services.skill_gap_service import SkillGapService
from app.services.task_allocation_service import TaskAllocationService
from app.services.team_composer_service import TeamComposerService
from app.services.workspace_service import WorkspaceService

router = APIRouter(prefix="/problems", tags=["problems"])


@router.post("", response_model=ProblemRead, status_code=status.HTTP_201_CREATED)
def create_problem(
    payload: ProblemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProblemRead:
    return ProblemAnalysisService(db).create_problem(current_user.id, payload)


@router.get("", response_model=list[ProblemRead])
def list_problems(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ProblemRead]:
    return ProblemAnalysisService(db).list_user_problems(
        current_user.id, page=page, page_size=page_size
    )


@router.get("/{problem_id}", response_model=ProblemRead)
def get_problem(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProblemRead:
    return ProblemAnalysisService(db).get_problem(problem_id, current_user.id)


@router.post("/{problem_id}/analyze", response_model=ProblemAnalysisRead)
async def analyze_problem(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProblemAnalysisRead:
    return await ProblemAnalysisService(db).analyze_problem(problem_id, current_user.id)


@router.get("/{problem_id}/analysis", response_model=ProblemAnalysisRead)
def get_problem_analysis(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProblemAnalysisRead:
    return ProblemAnalysisService(db).get_analysis(problem_id, current_user.id)


@router.get("/{problem_id}/skill-gap", response_model=SkillGapResponse)
def get_problem_skill_gap(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SkillGapResponse:
    """Computes and returns the deterministic skill gap analysis for a problem against the user's capability profile."""
    return SkillGapService(db).analyze_skill_gap(
        user_id=current_user.id, problem_id=problem_id
    )


@router.get("/{problem_id}/matches", response_model=MatchesResponse)
def get_problem_matches(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MatchesResponse:
    """Computes explainable match scores for all eligible candidates against a problem.

    The problem must be analyzed first. Returns ranked candidates with
    per-component scores and structured explanations.
    """
    return MatchingService(db).find_matches(problem_id)


@router.post("/{problem_id}/matches/recalculate", response_model=MatchesResponse)
def recalculate_problem_matches(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MatchesResponse:
    """Force recalculation of match scores for a problem.

    Clears existing match snapshots and recomputes all candidates' scores
    from current evidence. Useful after new evidence submissions or
    capability score recalculations.
    """
    return MatchingService(db).recalculate_matches(problem_id)


@router.post("/{problem_id}/compose-team", response_model=TeamCompositionResponse)
def compose_problem_team(
    problem_id: uuid.UUID,
    config: ComposeTeamRequest | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TeamCompositionResponse:
    """Composes the smallest effective complementary team for an analyzed problem."""
    return TeamComposerService(db).compose_team(
        problem_id=problem_id,
        request_user_id=current_user.id,
        config=config,
    )


@router.get("/{problem_id}/tasks", response_model=list[TaskRead])
def list_problem_tasks(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[TaskRead]:
    """Lists all workspace tasks associated with a problem."""
    return TaskAllocationService(db).list_tasks_for_problem(
        problem_id=problem_id, user_id=current_user.id
    )


@router.post(
    "/{problem_id}/workspace",
    response_model=WorkspaceRead,
    status_code=status.HTTP_201_CREATED,
)
def create_problem_workspace(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WorkspaceRead:
    """Creates a Mini Project Workspace from a problem's composed team.

    A PROPOSED team must exist (compose-team must be called first).
    Returns the workspace with all mirrored team members.
    """
    return WorkspaceService(db).create_workspace(problem_id, current_user.id)
