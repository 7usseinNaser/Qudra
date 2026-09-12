import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.project import Project
from app.db.models.project_capability import ProjectCapability


class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, project_id: uuid.UUID) -> Project | None:
        return self.db.get(Project, project_id)

    def list_for_owner(self, owner_id: uuid.UUID) -> list[Project]:
        stmt = (
            select(Project)
            .where(Project.owner_id == owner_id)
            .order_by(Project.created_at.desc())
        )
        return list(self.db.execute(stmt).scalars().all())

    def create(self, *, owner_id: uuid.UUID, title: str, description: str | None, status) -> Project:
        project = Project(owner_id=owner_id, title=title, description=description, status=status)
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def update(self, project: Project, **fields) -> Project:
        for key, value in fields.items():
            if value is not None:
                setattr(project, key, value)
        self.db.commit()
        self.db.refresh(project)
        return project

    def get_project_capability(
        self, project_id: uuid.UUID, capability_id: uuid.UUID
    ) -> ProjectCapability | None:
        stmt = select(ProjectCapability).where(
            ProjectCapability.project_id == project_id,
            ProjectCapability.capability_id == capability_id,
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def add_capability(self, project_id: uuid.UUID, capability_id: uuid.UUID) -> ProjectCapability:
        link = ProjectCapability(project_id=project_id, capability_id=capability_id)
        self.db.add(link)
        self.db.commit()
        self.db.refresh(link)
        return link
