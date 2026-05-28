import uuid
from fastapi import HTTPException, status

from src.models.job import Job, JobStatus
from src.schemas.job import JobCreate, JobUpdate, JobListOut
from src.repositories.job_repo import JobRepository


class JobService:
    def __init__(self, db):
        self.db = db
        self.job_repo = JobRepository(db)

    async def create_job(self, data: JobCreate, client_id: uuid.UUID) -> Job:
        if data.deadline <= __import__("datetime").datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Deadline must be in the future",
            )
        job = await self.job_repo.create(
            title=data.title,
            description=data.description,
            category=data.category,
            budget=data.budget,
            deadline=data.deadline,
            skills=data.skills,
            client_id=client_id,
            status=JobStatus.OPEN,
        )
        await self.db.commit()
        await self.db.refresh(job)
        return job

    async def get_jobs(
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
        return await self.job_repo.get_all_filtered(
            skip=skip,
            limit=limit,
            category=category,
            min_budget=min_budget,
            max_budget=max_budget,
            skills=skills,
            status=status,
            search=search,
        )

    async def get_job(self, job_id: uuid.UUID) -> Job | None:
        return await self.job_repo.get_with_skills(job_id)

    async def update_job(
        self,
        job_id: uuid.UUID,
        data: JobUpdate,
        client_id: uuid.UUID,
    ) -> Job:
        job = await self.job_repo.get(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found",
            )
        if job.client_id != client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this job",
            )
        if data.title is not None:
            job.title = data.title
        if data.description is not None:
            job.description = data.description
        if data.category is not None:
            job.category = data.category
        if data.budget is not None:
            job.budget = data.budget
        if data.deadline is not None:
            job.deadline = data.deadline
        if data.skills is not None:
            job.skills = data.skills
        if data.status is not None:
            job.status = JobStatus(data.status)
        await self.db.flush()
        await self.db.commit()
        await self.db.refresh(job)
        return job

    async def delete_job(self, job_id: uuid.UUID, client_id: uuid.UUID) -> bool:
        job = await self.job_repo.get(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found",
            )
        if job.client_id != client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this job",
            )
        return await self.job_repo.delete(job_id)

    async def search_jobs(
        self,
        q: str | None = None,
        category: str | None = None,
        min_budget: float | None = None,
        max_budget: float | None = None,
        skills: list[str] | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Job], int]:
        return await self.job_repo.get_all_filtered(
            skip=skip,
            limit=limit,
            category=category,
            min_budget=min_budget,
            max_budget=max_budget,
            skills=skills,
            search=q,
        )