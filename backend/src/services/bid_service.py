import uuid
from fastapi import HTTPException, status

from src.models.bid import Bid, BidStatus
from src.models.job import Job, JobStatus
from src.schemas.bid import BidCreate, BidUpdate
from src.repositories.bid_repo import BidRepository
from src.repositories.job_repo import JobRepository


class BidService:
    def __init__(self, db):
        self.db = db
        self.bid_repo = BidRepository(db)
        self.job_repo = JobRepository(db)

    async def submit_bid(
        self,
        job_id: uuid.UUID,
        data: BidCreate,
        freelancer_id: uuid.UUID,
    ) -> Bid:
        job = await self.job_repo.get(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found",
            )
        if job.status != JobStatus.OPEN:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Job is not open for bidding",
            )

        existing = await self.bid_repo.get_duplicate(job_id, freelancer_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already submitted a bid for this job",
            )

        bid = await self.bid_repo.create(
            job_id=job_id,
            freelancer_id=freelancer_id,
            amount=data.amount,
            delivery_days=data.delivery_days,
            proposal=data.proposal,
            status=BidStatus.PENDING,
        )
        await self.db.commit()
        await self.db.refresh(bid)
        return bid

    async def get_bids_for_job(
        self,
        job_id: uuid.UUID,
        client_id: uuid.UUID,
    ) -> list[Bid]:
        job = await self.job_repo.get(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found",
            )
        if job.client_id != client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view these bids",
            )
        return await self.bid_repo.get_by_job(job_id)

    async def update_bid(
        self,
        bid_id: uuid.UUID,
        data: BidUpdate,
        freelancer_id: uuid.UUID,
    ) -> Bid:
        bid = await self.bid_repo.get(bid_id)
        if not bid:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bid not found",
            )
        if bid.freelancer_id != freelancer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this bid",
            )
        if data.amount is not None:
            bid.amount = data.amount
        if data.delivery_days is not None:
            bid.delivery_days = data.delivery_days
        if data.proposal is not None:
            bid.proposal = data.proposal
        if data.status is not None:
            bid.status = BidStatus(data.status)
        await self.db.flush()
        await self.db.commit()
        await self.db.refresh(bid)
        return bid