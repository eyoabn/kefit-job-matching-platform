import uuid

from src.models.notification import Notification
from src.repositories.notification_repo import NotificationRepository


class NotificationService:
    def __init__(self, db):
        self.db = db
        self.notification_repo = NotificationRepository(db)

    async def get_notifications(
        self,
        user_id: uuid.UUID,
        skip: int = 0,
        limit: int = 50,
        unread_first: bool = True,
    ) -> tuple[list[Notification], int]:
        return await self.notification_repo.get_by_user(
            user_id=user_id,
            skip=skip,
            limit=limit,
            unread_first=unread_first,
        )

    async def mark_all_read(self, user_id: uuid.UUID) -> None:
        return await self.notification_repo.mark_all_read(user_id)

    async def get_unread_count(self, user_id: uuid.UUID) -> int:
        return await self.notification_repo.get_unread_count(user_id)