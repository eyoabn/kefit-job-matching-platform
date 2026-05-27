import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str
    role: str = "Freelancer"


class UserUpdate(BaseModel):
    name: str | None = None
    bio: str | None = None
    skills: list[str] | None = None
    avatar_url: str | None = None


class UserResponse(UserBase):
    id: uuid.UUID
    role: str
    avatar_url: str | None = None
    bio: str | None = None
    skills: list[str] | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserPublic(BaseModel):
    id: uuid.UUID
    name: str
    role: str
    avatar_url: str | None = None
    bio: str | None = None
    skills: list[str] | None = None

    model_config = {"from_attributes": True}


class AdminUserResponse(UserResponse):
    status: str = "Active"


class AdminDashboardStatsResponse(BaseModel):
    total_users: int
    active_jobs: int
    total_revenue: int
    active_contracts: int
