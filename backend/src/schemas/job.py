import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class JobBase(BaseModel):
    title: str
    description: str
    category: str
    budget: float
    deadline: datetime
    skills: list[str] = []


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    budget: float | None = None
    deadline: datetime | None = None
    skills: list[str] | None = None
    status: str | None = None


class JobResponse(JobBase):
    id: uuid.UUID
    client_id: uuid.UUID
    status: str
    created_at: datetime
    bid_count: int = 0

    model_config = {"from_attributes": True}


class JobListOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    category: str
    budget: float
    deadline: datetime
    skills: list[str]
    status: str
    client_id: uuid.UUID
    client_name: str | None = None
    bid_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class JobFilter(BaseModel):
    category: Optional[str] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
    skills: Optional[list[str]] = None
    status: Optional[str] = None
    search: Optional[str] = None
