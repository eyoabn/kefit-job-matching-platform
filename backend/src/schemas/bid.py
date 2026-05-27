import uuid
from datetime import datetime
from pydantic import BaseModel


class BidBase(BaseModel):
    amount: float
    delivery_days: int = 30
    proposal: str


class BidCreate(BidBase):
    job_id: uuid.UUID


class BidUpdate(BaseModel):
    amount: float | None = None
    delivery_days: int | None = None
    proposal: str | None = None
    status: str | None = None


class BidResponse(BidBase):
    id: uuid.UUID
    job_id: uuid.UUID
    freelancer_id: uuid.UUID
    status: str
    created_at: datetime
    freelancer_name: str | None = None

    model_config = {"from_attributes": True}
