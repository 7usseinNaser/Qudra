import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=255)
    role: str = Field(default="talent", max_length=50)


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=255)
    username: str | None = Field(default=None, max_length=100)
    headline: str | None = Field(default=None, max_length=255)
    bio: str | None = Field(default=None)
    avatar_url: str | None = Field(default=None, max_length=500)
    is_email_verified: bool | None = None
    is_onboarded: bool | None = None


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: str
    username: str | None = None
    headline: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    is_active: bool
    is_email_verified: bool
    is_onboarded: bool
    created_at: datetime
