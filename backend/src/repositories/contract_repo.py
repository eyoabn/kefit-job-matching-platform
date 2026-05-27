import uuid
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.models.contract import Contract
from src.repositories.base_repo import GenericAsyncRepository


class ContractRepository(GenericAsyncRepository):
    model = Contract

    async def get_by_job(self, job_id: uuid.UUID) -> list[Contract]:
        result = await self.session.execute(
            select(Contract).where(Contract.job_id == job_id)
        )
        return list(result.scalars().all())

    async def get_by_client(self, client_id: uuid.UUID) -> list[Contract]:
        result = await self.session.execute(
            select(Contract)
            .options(selectinload(Contract.job), selectinload(Contract.freelancer))
            .where(Contract.client_id == client_id)
            .order_by(Contract.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_freelancer(self, freelancer_id: uuid.UUID) -> list[Contract]:
        result = await self.session.execute(
            select(Contract)
            .options(selectinload(Contract.job), selectinload(Contract.client))
            .where(Contract.freelancer_id == freelancer_id)
            .order_by(Contract.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_with_review(self, contract_id: uuid.UUID) -> Contract | None:
        result = await self.session.execute(
            select(Contract)
            .options(selectinload(Contract.reviews))
            .where(Contract.id == contract_id)
        )
        return result.scalar_one_or_none()