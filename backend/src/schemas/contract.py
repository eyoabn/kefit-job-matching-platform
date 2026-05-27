import uuid
from datetime import datetime
from pydantic import BaseModel


class ContractBase(BaseModel):
    job_id: uuid.UUID
    freelancer_id: uuid.UUID
    bid_id: uuid.UUID
    amount: float


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    status: str | None = None
    end_date: datetime | None = None


class ContractResponse(ContractBase):
    id: uuid.UUID
    client_id: uuid.UUID
    status: str
    start_date: datetime
    end_date: datetime | None = None
    created_at: datetime
    client_name: str | None = None
    freelancer_name: str | None = None
    job_title: str | None = None

    model_config = {"from_attributes": True}


class ContractComplete(BaseModel):
    end_date: datetime | None = None
