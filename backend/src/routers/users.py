from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.dependencies import get_db, get_current_user
from src.models import User
from src.schemas import UserOut

router = APIRouter(tags=["users"])


@router.get("/me", response_model=UserOut)
async def read_current_user(
    current_user: User = Depends(get_current_user),
):
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=UserOut)
async def update_current_user(
    user_in: UserOut,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update current user.
    """
    # TODO: Implement update logic using user service
    # For now, just return the current user
    return current_user