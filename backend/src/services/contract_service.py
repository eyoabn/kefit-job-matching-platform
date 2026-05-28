import uuid
from datetime import datetime
from fastapi import HTTPException, status

from src.models.contract import Contract, ContractStatus
from src.models.job import Job, JobStatus
from src.models.bid import Bid, BidStatus
from src.schemas.contract import ContractCreate
from src.repositories.contract_repo import ContractRepository
from src.repositories.job_repo import JobRepository
from src.repositories.bid_repo import BidRepository
from src.services.event_dispatcher import EventDispatcher


class ContractService:
    def __init__(self, db):
        self.db = db
        self.contract_repo = ContractRepository(db)
        self.job_repo = JobRepository(db)
        self.bid_repo = BidRepository(db)

    async def hire_freelancer(
        self,
        job_id: uuid.UUID,
        bid_id: uuid.UUID,
        client_id: uuid.UUID,
    ) -> Contract:
        job = await self.job_repo.get(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found",
            )
        if job.client_id != client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized",
            )

        bid = await self.bid_repo.get_for_update(bid_id)
        if not bid:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bid not found",
            )
        if bid.job_id != job_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bid does not belong to this job",
            )
        if bid.status != BidStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bid is no longer pending",
            )

        try:
            contract = Contract(
                job_id=job_id,
                client_id=client_id,
                freelancer_id=bid.freelancer_id,
                bid_id=bid_id,
                amount=bid.amount,
                status=ContractStatus.ACTIVE,
            )
            self.db.add(contract)

            job.status = JobStatus.IN_PROGRESS

            bid.status = BidStatus.ACCEPTED
            self.db.flush()

            other_bids_result = await self.bid_repo.get_by_job(job_id)
            for other_bid in other_bids_result:
                if other_bid.id != bid_id:
                    other_bid.status = BidStatus.REJECTED

            await self.db.commit()
            await self.db.refresh(contract)

            dispatcher = EventDispatcher(self.db)
            await dispatcher.dispatch("contract_hired", {"contract_id": contract.id})

            return contract

        except Exception as e:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Failed to create contract",
            )

    async def complete_contract(
        self,
        contract_id: uuid.UUID,
        client_id: uuid.UUID,
    ) -> Contract:
        contract = await self.contract_repo.get(contract_id)
        if not contract:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contract not found",
            )
        if contract.client_id != client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized",
            )
        if contract.status != ContractStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contract is not active",
            )

        contract.status = ContractStatus.COMPLETED
        contract.end_date = datetime.utcnow()
        await self.db.flush()
        await self.db.commit()
        await self.db.refresh(contract)
        return contract

    async def leave_review(
        self,
        contract_id: uuid.UUID,
        rating: int,
        comment: str | None,
        review_type: str,
        reviewer_id: uuid.UUID,
        reviewee_id: uuid.UUID,
    ) -> None:
        from src.models.review import Review
        review = Review(
            contract_id=contract_id,
            reviewer_id=reviewer_id,
            reviewee_id=reviewee_id,
            rating=rating,
            comment=comment,
            review_type=review_type,
        )
        self.db.add(review)
        await self.db.flush()
        await self.db.commit()