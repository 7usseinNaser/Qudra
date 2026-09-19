import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.schemas.project import (
    ProjectCapabilityCreate,
    ProjectCapabilityRead,
    ProjectCreate,
    ProjectRead,
    ProjectUpdate,
)
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProjectRead:
    return ProjectService(db).create(current_user.id, payload)


@router.get("", response_model=list[ProjectRead])
def list_my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ProjectRead]:
    return ProjectService(db).list_for_owner(current_user.id)


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProjectRead:
    return ProjectService(db).get_owned(current_user.id, project_id)


@router.patch("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: uuid.UUID,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProjectRead:
    return ProjectService(db).update(current_user.id, project_id, payload)


@router.post(
    "/{project_id}/capabilities",
    response_model=ProjectCapabilityRead,
    status_code=status.HTTP_201_CREATED,
)
def add_project_capability(
    project_id: uuid.UUID,
    payload: ProjectCapabilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProjectCapabilityRead:
    return ProjectService(db).add_capability(
        current_user.id, project_id, payload.capability_id
    )
