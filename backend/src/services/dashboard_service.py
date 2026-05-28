import uuid
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.models.job import Job
from src.models.bid import Bid
from src.models.contract import Contract
from src.schemas.dashboard import (
    ClientDashboardOut,
    FreelancerDashboardOut,
    JobSummary,
    BidSummary,
    ContractSummary,
)
from src.repositories.dashboard_repo import DashboardRepository
from src.repositories.job_repo import JobRepository
from src.repositories.bid_repo import BidRepository
from src.repositories.contract_repo import ContractRepository


class DashboardService:
    def __init__(self, db):
        self.db = db
        self.dashboard_repo = DashboardRepository(db)
        self.job_repo = JobRepository(db)
        self.bid_repo = BidRepository(db)
        self.contract_repo = ContractRepository(db)

    async def get_client_dashboard(self, client_id: uuid.UUID) -> ClientDashboardOut:
        stats = await self.dashboard_repo.get_client_stats(client_id)

        jobs = await self.job_repo.get_by_client(client_id)
        recent_jobs = [
            JobSummary(
                id=j.id,
                title=j.title,
                budget=j.budget,
                status=j.status.value,
                created_at=j.created_at,
            )
            for j in jobs[:5]
        ]

        bids_result = await self.db.execute(
            select(Bid)
            .join(Job)
            .where(Job.client_id == client_id)
            .options(selectinload(Bid.job))
            .order_by(Bid.created_at.desc())
            .limit(10)
        )
        bids = bids_result.scalars().all()
        recent_bids = [
            BidSummary(
                id=b.id,
                job_title=b.job.title if b.job else "Unknown",
                amount=b.amount,
                status=b.status.value,
                created_at=b.created_at,
            )
            for b in bids
        ]

        return ClientDashboardOut(
            total_jobs=stats["total_jobs"],
            open_jobs=stats["open_jobs"],
            active_contracts=stats["active_contracts"],
            completed_contracts=stats["completed_contracts"],
            total_spent=stats["total_spent"],
            recent_jobs=recent_jobs,
            recent_bids=recent_bids,
        )

    async def get_freelancer_dashboard(self, freelancer_id: uuid.UUID) -> FreelancerDashboardOut:
        stats = await self.dashboard_repo.get_freelancer_stats(freelancer_id)

        bids = await self.bid_repo.get_by_freelancer(freelancer_id)
        recent_bids = [
            BidSummary(
                id=b.id,
                job_title=b.job.title if b.job else "Unknown",
                amount=b.amount,
                status=b.status.value,
                created_at=b.created_at,
            )
            for b in bids[:5]
        ]

        contracts = await self.contract_repo.get_by_freelancer(freelancer_id)
        recent_contracts = [
            ContractSummary(
                id=c.id,
                job_title=c.job.title if c.job else "Unknown",
                client_name=c.client.name if c.client else None,
                freelancer_name=None,
                amount=c.amount,
                status=c.status.value,
                created_at=c.created_at,
            )
            for c in contracts[:5]
        ]

        return FreelancerDashboardOut(
            total_bids=stats["total_bids"],
            active_contracts=stats["active_contracts"],
            completed_contracts=stats["completed_contracts"],
            total_earnings=stats["total_earnings"],
            avg_rating=stats["avg_rating"],
            recent_bids=recent_bids,
            recent_contracts=recent_contracts,
        )