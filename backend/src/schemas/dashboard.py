import uuid
from datetime import datetime
from pydantic import BaseModel


class JobSummary(BaseModel):
    id: uuid.UUID
    title: str
    budget: float
    status: str
    created_at: datetime


class BidSummary(BaseModel):
    id: uuid.UUID
    job_title: str
    amount: float
    status: str
    created_at: datetime


class ContractSummary(BaseModel):
    id: uuid.UUID
    job_title: str
    client_name: str | None = None
    freelancer_name: str | None = None
    amount: float
    status: str
    created_at: datetime


class ClientDashboardOut(BaseModel):
    total_jobs: int
    open_jobs: int
    active_contracts: int
    completed_contracts: int
    total_spent: float
    recent_jobs: list[JobSummary]
    recent_bids: list[BidSummary]


class FreelancerDashboardOut(BaseModel):
    total_bids: int
    active_contracts: int
    completed_contracts: int
    total_earnings: float
    avg_rating: float | None = None
    recent_bids: list[BidSummary]
    recent_contracts: list[ContractSummary]