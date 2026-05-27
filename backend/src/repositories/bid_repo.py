import uuid
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.models.bid import Bid
from src.repositories.base_repo import GenericAsyncRepository


class BidRepository(GenericAsyncRepository):
    model = Bid

    async def get_by_job(self, job_id: uuid.UUID) -> list[Bid]:
        result = await self.session.execute(
            select(Bid)
            .options(selectinload(Bid.freelancer))
            .where(Bid.job_id == job_id)
            .order_by(Bid.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_freelancer(self, freelancer_id: uuid.UUID) -> list[Bid]:
        result = await self.session.execute(
            select(Bid)
            .options(selectinload(Bid.job))
            .where(Bid.freelancer_id == freelancer_id)
            .order_by(Bid.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_for_update(self, bid_id: uuid.UUID) -> Bid | None:
        result = await self.session.execute(
            select(Bid).where(Bid.id == bid_id).with_for_update()
        )
        return result.scalar_one_or_none()

    async def get_duplicate(self, job_id: uuid.UUID, freelancer_id: uuid.UUID) -> Bid | None:
        result = await self.session.execute(
            select(Bid).where(
                Bid.job_id == job_id,
                Bid.freelancer_id == freelancer_id,
            )
        )
        return result.scalar_one_or_none()