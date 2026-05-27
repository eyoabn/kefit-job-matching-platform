import uuid
from sqlalchemy import select, func, case

from src.models.contract import Contract
from src.models.job import Job
from src.models.bid import Bid
from src.models.review import Review
from src.database import async_session_maker


class DashboardRepository:
    def __init__(self, session):
        self.session = session

    async def get_client_stats(self, client_id: uuid.UUID) -> dict:
        total_jobs_result = await self.session.execute(
            select(func.count()).where(Job.client_id == client_id)
        )
        total_jobs = total_jobs_result.scalar_one()

        open_jobs_result = await self.session.execute(
            select(func.count()).where(
                Job.client_id == client_id,
                Job.status == "Open",
            )
        )
        open_jobs = open_jobs_result.scalar_one()

        active_contracts_result = await self.session.execute(
            select(func.count()).where(
                Contract.client_id == client_id,
                Contract.status == "Active",
            )
        )
        active_contracts = active_contracts_result.scalar_one()

        completed_contracts_result = await self.session.execute(
            select(func.count()).where(
                Contract.client_id == client_id,
                Contract.status == "Completed",
            )
        )
        completed_contracts = completed_contracts_result.scalar_one()

        total_spent_result = await self.session.execute(
            select(func.coalesce(func.sum(Contract.amount), 0)).where(
                Contract.client_id == client_id,
                Contract.status == "Completed",
            )
        )
        total_spent = total_spent_result.scalar_one()

        return {
            "total_jobs": total_jobs,
            "open_jobs": open_jobs,
            "active_contracts": active_contracts,
            "completed_contracts": completed_contracts,
            "total_spent": float(total_spent),
        }

    async def get_freelancer_stats(self, freelancer_id: uuid.UUID) -> dict:
        total_bids_result = await self.session.execute(
            select(func.count()).where(Bid.freelancer_id == freelancer_id)
        )
        total_bids = total_bids_result.scalar_one()

        active_contracts_result = await self.session.execute(
            select(func.count()).where(
                Contract.freelancer_id == freelancer_id,
                Contract.status == "Active",
            )
        )
        active_contracts = active_contracts_result.scalar_one()

        completed_contracts_result = await self.session.execute(
            select(func.count()).where(
                Contract.freelancer_id == freelancer_id,
                Contract.status == "Completed",
            )
        )
        completed_contracts = completed_contracts_result.scalar_one()

        total_earnings_result = await self.session.execute(
            select(func.coalesce(func.sum(Contract.amount), 0)).where(
                Contract.freelancer_id == freelancer_id,
                Contract.status == "Completed",
            )
        )
        total_earnings = total_earnings_result.scalar_one()

        avg_rating_result = await self.session.execute(
            select(func.avg(Review.rating)).where(
                Review.reviewee_id == freelancer_id,
            )
        )
        avg_rating = avg_rating_result.scalar_one()

        return {
            "total_bids": total_bids,
            "active_contracts": active_contracts,
            "completed_contracts": completed_contracts,
            "total_earnings": float(total_earnings),
            "avg_rating": round(float(avg_rating), 2) if avg_rating else None,
        }