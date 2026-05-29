from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from src.dependencies import get_db, get_current_user
from src.models import Contract, User
from src.schemas import ContractResponse

from src.services.contract_service import ContractService
from src.schemas.contract import ContractCreate
from src.schemas.review import ReviewCreate

router = APIRouter()


@router.post("/hire")
async def hire_freelancer(
    request: ContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.value != "Client":
        raise HTTPException(status_code=403, detail="Only clients can hire")

    service = ContractService(db)
    contract = await service.hire_freelancer(
        job_id=request.job_id,
        bid_id=request.bid_id,
        client_id=current_user.id,
    )
    return {
        "id": contract.id,
        "job_id": contract.job_id,
        "client_id": contract.client_id,
        "freelancer_id": contract.freelancer_id,
        "bid_id": contract.bid_id,
        "amount": contract.amount,
        "status": contract.status.value,
        "start_date": contract.start_date,
    }


@router.get("")
async def get_contracts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ContractResponse]:
    query = select(Contract).where(
        or_(
            Contract.client_id == current_user.id,
            Contract.freelancer_id == current_user.id,
        )
    )
    result = await db.execute(query)
    contracts = result.scalars().all()

    return [
        ContractResponse(
            id=c.id,
            job_id=c.job_id,
            client_id=c.client_id,
            freelancer_id=c.freelancer_id,
            bid_id=c.bid_id,
            amount=c.amount,
            status=c.status.value,
            start_date=c.start_date,
            end_date=c.end_date,
            created_at=c.created_at,
        )
        for c in contracts
    ]


@router.get("/{contract_id}")
async def get_contract(
    contract_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.get(Contract, contract_id)
    if not result:
        raise HTTPException(status_code=404, detail="Contract not found")
    if result.client_id != current_user.id and result.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your contract")
    return result


@router.put("/{contract_id}/complete")
async def complete_contract(
    contract_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark a contract as complete. Only the client can call this."""
    service = ContractService(db)
    contract = await service.complete_contract(
        contract_id=contract_id,
        client_id=current_user.id,
    )
    return ContractResponse(
        id=contract.id,
        job_id=contract.job_id,
        client_id=contract.client_id,
        freelancer_id=contract.freelancer_id,
        bid_id=contract.bid_id,
        amount=contract.amount,
        status=contract.status.value,
        start_date=contract.start_date,
        end_date=contract.end_date,
        created_at=contract.created_at,
    )


@router.post("/{contract_id}/review")
async def leave_review(
    contract_id: UUID,
    request: ReviewSubmit,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a review for a completed contract."""
    contract = await db.get(Contract, contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if contract.client_id != current_user.id and contract.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your contract")

    # Determine review type automatically from caller's role
    from src.models.review import ReviewType
    role = current_user.role.value
    review_type = ReviewType.CLIENT_REVIEW if role == "Client" else ReviewType.FREELANCER_REVIEW
    reviewee_id = (
        contract.freelancer_id if role == "Client" else contract.client_id
    )

    service = ContractService(db)
    await service.leave_review(
        contract_id=contract_id,
        rating=request.rating,
        comment=request.comment,
        review_type=review_type.value,
        reviewer_id=current_user.id,
        reviewee_id=reviewee_id,
    )
    return {"detail": "Review submitted successfully"}


@router.patch("/{contract_id}")
async def update_contract(
    contract_id: UUID,
    request: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.get(Contract, contract_id)
    if not result:
        raise HTTPException(status_code=404, detail="Contract not found")
    if result.client_id != current_user.id and result.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your contract")

    for key, value in request.items():
        if key == "status" and value == "Completed":
            from datetime import datetime
            result.end_date = datetime.utcnow()
        setattr(result, key, value)

    await db.flush()
    await db.refresh(result)
    return result
