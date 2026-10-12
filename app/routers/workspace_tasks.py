"""Router for individual task operations — state machine endpoints (Feature 10)."""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.workspace import WorkspaceTaskRead
from app.services.workspace_service import WorkspaceService

# This router extends the existing /tasks prefix with workspace-aware endpoints.
# It must be registered BEFORE the generic tasks router to avoid route conflicts.
router = APIRouter(prefix="/tasks", tags=["workspace-tasks"])


@router.get("/{task_id}/detail", response_model=WorkspaceTaskRead)
def get_workspace_task(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WorkspaceTaskRead:
    """Returns workspace task detail (includes workspace-specific fields)."""
    return WorkspaceService(db).get_task(task_id, current_user.id)


@router.patch("/{task_id}", response_model=WorkspaceTaskRead)
def update_workspace_task(
    task_id: uuid.UUID,
    payload: WorkspaceTaskRead,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WorkspaceTaskRead:
    """Updates workspace task fields."""
    from app.schemas.workspace import WorkspaceTaskCreate

    update_payload = WorkspaceTaskCreate(
        title=payload.title,
        description=payload.description,
        task_type=payload.task_type,
        priority=payload.priority,
        estimated_effort=payload.estimated_effort,
        due_at=payload.due_at,
        assigned_member_id=payload.assigned_member_id,
    )
    return WorkspaceService(db).update_task(task_id, current_user.id, update_payload)


@router.post("/{task_id}/start", response_model=WorkspaceTaskRead)
def start_task(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WorkspaceTaskRead:
    """Transitions a task from TODO → IN_PROGRESS."""
    return WorkspaceService(db).start_task(task_id, current_user.id)


@router.post("/{task_id}/complete", response_model=WorkspaceTaskRead)
def complete_task(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WorkspaceTaskRead:
    """Transitions a task from IN_PROGRESS or BLOCKED → DONE."""
    return WorkspaceService(db).complete_task(task_id, current_user.id)


@router.post("/{task_id}/block", response_model=WorkspaceTaskRead)
def block_task(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WorkspaceTaskRead:
    """Transitions a task from TODO or IN_PROGRESS → BLOCKED."""
    return WorkspaceService(db).block_task(task_id, current_user.id)
