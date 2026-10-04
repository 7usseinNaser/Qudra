"""Router for Task management and Human / AI Allocations."""

import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.allocation import (
    TaskAllocationRead,
    TaskCreate,
    TaskRead,
)
from app.services.task_allocation_service import TaskAllocationService

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskRead:
    """Creates a project task with optional required capabilities."""
    return TaskAllocationService(db).create_task(current_user.id, payload)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskRead:
    """Retrieves task details and its required capabilities."""
    return TaskAllocationService(db).get_task(task_id, current_user.id)


@router.post("/{task_id}/allocation", response_model=TaskAllocationRead)
def allocate_task(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskAllocationRead:
    """Computes and stores the Human / AI / Human_AI allocation decision for a task."""
    return TaskAllocationService(db).allocate_task(task_id, current_user.id)


@router.get("/{task_id}/allocation", response_model=TaskAllocationRead)
def get_task_allocation(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskAllocationRead:
    """Gets the existing Human / AI allocation or computes it if not present."""
    return TaskAllocationService(db).get_allocation(task_id, current_user.id)


@router.post("/{task_id}/allocation/recalculate", response_model=TaskAllocationRead)
def recalculate_task_allocation(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskAllocationRead:
    """Forces recalculation of the Human / AI allocation for a task."""
    return TaskAllocationService(db).recalculate_allocation(task_id, current_user.id)
