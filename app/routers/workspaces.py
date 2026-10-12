"""Router for Feature 10: Mini Project Workspace."""

import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.workspace import (
    WorkspaceDashboardRead,
    WorkspaceMemberRead,
    WorkspaceProgressRead,
    WorkspaceRead,
    WorkspaceTaskCreate,
    WorkspaceTaskRead,
)
from app.services.workspace_service import WorkspaceService

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.get("/{workspace_id}", response_model=WorkspaceRead)
def get_workspace(
    workspace_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WorkspaceRead:
    """Returns workspace details including all members."""
    return WorkspaceService(db).get_workspace(workspace_id, current_user.id)


@router.get("/{workspace_id}/members", response_model=list[WorkspaceMemberRead])
def get_workspace_members(
    workspace_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[WorkspaceMemberRead]:
    """Returns all active members of a workspace."""
    return WorkspaceService(db).get_workspace_members(workspace_id, current_user.id)


@router.get("/{workspace_id}/tasks", response_model=list[WorkspaceTaskRead])
def list_workspace_tasks(
    workspace_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[WorkspaceTaskRead]:
    """Lists all tasks within a workspace."""
    return WorkspaceService(db).list_workspace_tasks(workspace_id, current_user.id)


@router.post(
    "/{workspace_id}/tasks",
    response_model=WorkspaceTaskRead,
    status_code=status.HTTP_201_CREATED,
)
def create_workspace_task(
    workspace_id: uuid.UUID,
    payload: WorkspaceTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WorkspaceTaskRead:
    """Creates a new task inside a workspace."""
    return WorkspaceService(db).create_workspace_task(
        workspace_id, current_user.id, payload
    )


@router.get("/{workspace_id}/progress", response_model=WorkspaceProgressRead)
def get_workspace_progress(
    workspace_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> WorkspaceProgressRead:
    """Returns real-time progress counters for a workspace."""
    return WorkspaceService(db).get_workspace_progress(workspace_id, current_user.id)
