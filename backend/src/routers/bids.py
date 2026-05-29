from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.dependencies import get_db, get_current_user
from src.models import Bid, Job, User
from src.schemas import BidCreate, BidUpdate, BidResponse

router = APIRouter()


@router.get("/freelancer/{freelancer_id}")
async def get_freelancer_bids(
    freelancer_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[BidResponse]:
    """Return all bids submitted by a specific freelancer."""
    result = await db.execute(
        select(Bid)
        .options(selectinload(Bid.freelancer))
        .where(Bid.freelancer_id == freelancer_id)
    )
    bids = result.scalars().all()

    return [
        BidResponse(
            id=bid.id,
            job_id=bid.job_id,
            freelancer_id=bid.freelancer_id,
            amount=bid.amount,
            delivery_days=bid.delivery_days,
            proposal=bid.proposal,
            status=bid.status.value,
            created_at=bid.created_at,
            freelancer_name=bid.freelancer.name if bid.freelancer else None,
        )
        for bid in bids
    ]


@router.get("/{job_id}/bids")
async def get_job_bids(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[BidResponse]:
    result = await db.execute(
        select(Bid)
        .options(selectinload(Bid.freelancer))
        .where(Bid.job_id == job_id)
    )
    bids = result.scalars().all()

    return [
        BidResponse(
            id=bid.id,
            job_id=bid.job_id,
            freelancer_id=bid.freelancer_id,
            amount=bid.amount,
            delivery_days=bid.delivery_days,
            proposal=bid.proposal,
            status=bid.status.value,
            created_at=bid.created_at,
            freelancer_name=bid.freelancer.name if bid.freelancer else None,
        )
        for bid in bids
    ]


@router.post("")
async def create_bid(
    request: BidCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.value != "Freelancer":
        raise HTTPException(status_code=403, detail="Only freelancers can bid")

    existing = await db.execute(
        select(Bid).where(
            Bid.job_id == request.job_id,
            Bid.freelancer_id == current_user.id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="You already bid on this job")

    bid = Bid(
        job_id=request.job_id,
        freelancer_id=current_user.id,
        amount=request.amount,
        delivery_days=request.delivery_days,
        proposal=request.proposal,
    )
    db.add(bid)
    await db.flush()
    await db.commit()
    await db.refresh(bid)

    return BidResponse(
        id=bid.id,
        job_id=bid.job_id,
        freelancer_id=bid.freelancer_id,
        amount=bid.amount,
        delivery_days=bid.delivery_days,
        proposal=bid.proposal,
        status=bid.status.value,
        created_at=bid.created_at,
        freelancer_name=current_user.name,
    )


@router.get("/{bid_id}")
async def get_bid(
    bid_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.get(Bid, bid_id)
    if not result:
        raise HTTPException(status_code=404, detail="Bid not found")
    return result


@router.patch("/{bid_id}")
async def update_bid(
    bid_id: UUID,
    request: BidUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.get(Bid, bid_id)
    if not result:
        raise HTTPException(status_code=404, detail="Bid not found")
    if result.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your bid")

    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(result, key, value)

    await db.flush()
    await db.commit()
    await db.refresh(result)
    return result
