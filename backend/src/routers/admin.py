from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from src.dependencies import get_db, require_roles
from src.models import User, Job, Contract, UserRole
from src.models.job import JobStatus
from src.models.contract import ContractStatus
from src.schemas.user import AdminUserResponse, AdminDashboardStatsResponse

router = APIRouter(tags=["admin"])


@router.get("/users", response_model=list[AdminUserResponse])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    # Require admin role
    current_user: User = Depends(require_roles(UserRole.ADMIN.value)),
):
    """
    Get all users for the admin dashboard.
    """
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users


@router.get("/dashboard-stats", response_model=AdminDashboardStatsResponse)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    # Require admin role
    current_user: User = Depends(require_roles(UserRole.ADMIN.value)),
):
    """
    Get key statistics for the admin dashboard.
    """
    total_users_result = await db.execute(select(func.count(User.id)))
    total_users = total_users_result.scalar_one()

    active_jobs_result = await db.execute(
        select(func.count(Job.id)).where(Job.status == JobStatus.OPEN)
    )
    active_jobs = active_jobs_result.scalar_one()

    active_contracts_result = await db.execute(
        select(func.count(Contract.id)).where(Contract.status == ContractStatus.ACTIVE)
    )
    active_contracts = active_contracts_result.scalar_one()

    # Calculate total revenue from completed contracts
    revenue_result = await db.execute(
        select(func.sum(Contract.amount)).where(Contract.status == ContractStatus.COMPLETED)
    )
    total_revenue = revenue_result.scalar_one() or 0

    return AdminDashboardStatsResponse(
        total_users=total_users,
        active_jobs=active_jobs,
        total_revenue=int(total_revenue),
        active_contracts=active_contracts,
    )
