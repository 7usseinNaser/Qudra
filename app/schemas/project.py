import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.db.models.project import ProjectStatus


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    status: ProjectStatus = ProjectStatus.DRAFT


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    status: ProjectStatus | None = None


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    owner_id: uuid.UUID
    title: str
    description: str | None
    status: ProjectStatus
    created_at: datetime
    updated_at: datetime


class ProjectCapabilityCreate(BaseModel):
    capability_id: uuid.UUID


class ProjectCapabilityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: uuid.UUID
    capability_id: uuid.UUID
