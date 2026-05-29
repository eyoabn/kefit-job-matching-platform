from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from src.dependencies import get_db, get_current_user, get_optional_user
from src.models import Job, User, Bid
from src.models.job import JobStatus
from src.models.bid import BidStatus
from src.schemas import JobCreate, JobUpdate, JobResponse

router = APIRouter()


@router.get("")
async def get_jobs(
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
    status: str | None = None,
    category: str | None = None,
    min_budget: float | None = None,
    max_budget: float | None = None,
    my_jobs: bool = False,
) -> list[JobResponse]:
    query = select(Job)
    if my_jobs and current_user:
        query = query.where(Job.client_id == current_user.id)
    if status:
        query = query.where(Job.status == status)
    if category:
        query = query.where(Job.category == category)
    if min_budget:
        query = query.where(Job.budget >= min_budget)
    if max_budget:
        query = query.where(Job.budget <= max_budget)
    query = query.order_by(Job.created_at.desc())

    result = await db.execute(query)
    jobs = result.scalars().all()

    job_responses = []
    for job in jobs:
        bid_count_result = await db.execute(
            select(func.count(Bid.id)).where(Bid.job_id == job.id)
        )
        bid_count = bid_count_result.scalar() or 0
        job_responses.append(
            JobResponse(
                id=job.id,
                title=job.title,
                description=job.description,
                category=job.category,
                budget=job.budget,
                deadline=job.deadline,
                skills=job.skills or [],
                client_id=job.client_id,
                status=job.status.value,
                created_at=job.created_at,
                bid_count=bid_count,
            )
        )
    return job_responses


@router.post("")
async def create_job(
    request: JobCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.value != "Client":
        raise HTTPException(status_code=403, detail="Only clients can create jobs")

    job = Job(
        title=request.title,
        description=request.description,
        category=request.category,
        budget=request.budget,
        deadline=request.deadline,
        skills=request.skills,
        client_id=current_user.id,
    )
    db.add(job)
    await db.flush()
    await db.commit()
    await db.refresh(job)

    return JobResponse(
        id=job.id,
        title=job.title,
        description=job.description,
        category=job.category,
        budget=job.budget,
        deadline=job.deadline,
        skills=job.skills or [],
        client_id=job.client_id,
        status=job.status.value,
        created_at=job.created_at,
        bid_count=0,
    )


@router.get("/{job_id}")
async def get_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    result = await db.get(Job, job_id)
    if not result:
        raise HTTPException(status_code=404, detail="Job not found")

    bid_count_result = await db.execute(
        select(func.count(Bid.id)).where(Bid.job_id == job_id)
    )
    bid_count = bid_count_result.scalar() or 0

    return JobResponse(
        id=result.id,
        title=result.title,
        description=result.description,
        category=result.category,
        budget=result.budget,
        deadline=result.deadline,
        skills=result.skills or [],
        client_id=result.client_id,
        status=result.status.value,
        created_at=result.created_at,
        bid_count=bid_count,
    )


@router.put("/{job_id}")
async def update_job(
    job_id: UUID,
    request: JobUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.get(Job, job_id)
    if not result:
        raise HTTPException(status_code=404, detail="Job not found")
    if result.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your job")

    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(result, key, value)

    await db.flush()
    await db.commit()
    await db.refresh(result)

    return result


@router.delete("/{job_id}")
async def delete_job(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.get(Job, job_id)
    if not result:
        raise HTTPException(status_code=404, detail="Job not found")
    if result.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your job")

    await db.delete(result)
    await db.commit()
    return {"detail": "Job deleted"}


@router.post("/{job_id}/hire/{bid_id}")
async def hire_freelancer(
    job_id: UUID,
    bid_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = await db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your job")
    if job.status.value == "InProgress":
        raise HTTPException(status_code=409, detail="Already hired")

    bid = await db.get(Bid, bid_id)
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    if bid.job_id != job_id:
        raise HTTPException(status_code=400, detail="Bid does not belong to this job")
    if bid.status.value != "Pending":
        raise HTTPException(status_code=409, detail="This bid was already accepted")

    bid.status = BidStatus.ACCEPTED
    job.status = JobStatus.IN_PROGRESS

    await db.flush()
    await db.commit()
    return {"detail": "Freelancer hired successfully"}
