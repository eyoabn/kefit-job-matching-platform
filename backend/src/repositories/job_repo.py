import uuid
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from src.models.job import Job
from src.repositories.base_repo import GenericAsyncRepository


class JobRepository(GenericAsyncRepository):
    model = Job

    async def get_with_skills(self, job_id: uuid.UUID) -> Job | None:
        result = await self.session.execute(
            select(Job)
            .options(selectinload(Job.bids))
            .where(Job.id == job_id)
        )
        return result.scalar_one_or_none()

    async def get_all_filtered(
        self,
        skip: int = 0,
        limit: int = 20,
        category: str | None = None,
        min_budget: float | None = None,
        max_budget: float | None = None,
        skills: list[str] | None = None,
        status: str | None = None,
        search: str | None = None,
    ) -> tuple[list[Job], int]:
        query = select(Job)

        if category:
            query = query.where(Job.category == category)
        if min_budget is not None:
            query = query.where(Job.budget >= min_budget)
        if max_budget is not None:
            query = query.where(Job.budget <= max_budget)
        if status:
            query = query.where(Job.status == status)
        if search:
            query = query.where(
                or_(
                    Job.title.ilike(f"%{search}%"),
                    Job.description.ilike(f"%{search}%"),
                )
            )

        count_result = await self.session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar_one()

        result = await self.session.execute(
            query.offset(skip).limit(limit).order_by(Job.created_at.desc())
        )
        return list(result.scalars().all()), total

    async def get_by_client(self, client_id: uuid.UUID) -> list[Job]:
        result = await self.session.execute(
            select(Job)
            .where(Job.client_id == client_id)
            .order_by(Job.created_at.desc())
        )
        return list(result.scalars().all())