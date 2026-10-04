import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class OpportunityCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    organization: str = Field(min_length=1, max_length=255)
    type: str = Field(default="job", max_length=50)
    location: str = Field(default="remote", max_length=50)
    field: str = Field(min_length=1, max_length=100)
    city: str | None = None
    description: str = Field(min_length=10)
    requirements: str | None = None
    compensation: str | None = None
    duration: str | None = None
    experience: str | None = None
    is_verified_org: bool = False


class OpportunityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    organization: str
    type: str
    location: str
    field: str
    city: str | None
    description: str
    requirements: str | None
    compensation: str | None
    duration: str | None
    experience: str | None
    is_verified_org: bool
    posted_date: datetime
    created_at: datetime
