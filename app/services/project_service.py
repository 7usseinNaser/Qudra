import uuid

from sqlalchemy.orm import Session

from app.core.exceptions import (
    CapabilityNotFoundError,
    ProjectAccessDeniedError,
    ProjectCapabilityAlreadyExistsError,
    ProjectNotFoundError,
)
from app.db.models.project import Project
from app.repositories.capability_repository import CapabilityRepository
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    def __init__(self, db: Session):
        self.repo = ProjectRepository(db)
        self.capability_repo = CapabilityRepository(db)

    def create(self, owner_id: uuid.UUID, data: ProjectCreate) -> Project:
        return self.repo.create(
            owner_id=owner_id,
            title=data.title,
            description=data.description,
            status=data.status,
        )

    def list_for_owner(self, owner_id: uuid.UUID) -> list[Project]:
        return self.repo.list_for_owner(owner_id)

    def get_owned(self, owner_id: uuid.UUID, project_id: uuid.UUID) -> Project:
        project = self.repo.get_by_id(project_id)
        if project is None:
            raise ProjectNotFoundError()
        if project.owner_id != owner_id:
            raise ProjectAccessDeniedError()
        return project

    def update(self, owner_id: uuid.UUID, project_id: uuid.UUID, data: ProjectUpdate) -> Project:
        project = self.get_owned(owner_id, project_id)
        return self.repo.update(
            project,
            title=data.title,
            description=data.description,
            status=data.status,
        )

    def add_capability(self, owner_id: uuid.UUID, project_id: uuid.UUID, capability_id: uuid.UUID):
        project = self.get_owned(owner_id, project_id)
        # Ensure the capability actually exists before tagging.
        if self.capability_repo.get_by_id(capability_id) is None:
            raise CapabilityNotFoundError()
        if self.repo.get_project_capability(project.id, capability_id):
            raise ProjectCapabilityAlreadyExistsError()
        return self.repo.add_capability(project.id, capability_id)
