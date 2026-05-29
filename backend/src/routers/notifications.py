from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from src.dependencies import get_db, get_current_user
from src.models import Notification, User
from src.schemas import NotificationResponse

router = APIRouter()


@router.get("")
async def get_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[NotificationResponse]:
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
    )
    notifications = result.scalars().all()

    return [
        NotificationResponse(
            id=n.id,
            user_id=n.user_id,
            title=n.title,
            message=n.message,
            type=n.type.value,
            read=n.read,
            link=n.link,
            created_at=n.created_at,
        )
        for n in notifications
    ]


@router.post("/read-all")
async def mark_all_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await db.execute(
        update(Notification)
        .where(
            Notification.user_id == current_user.id,
            Notification.read == False,
        )
        .values(read=True)
    )
    return {"detail": "All notifications marked as read"}


@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.get(Notification, notification_id)
    if not result:
        raise HTTPException(status_code=404, detail="Notification not found")
    if result.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your notification")

    result.read = True
    await db.flush()
    return {"detail": "Marked as read"}
