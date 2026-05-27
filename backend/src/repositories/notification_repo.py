import uuid
from sqlalchemy import select, func, update

from src.models.notification import Notification
from src.repositories.base_repo import GenericAsyncRepository


class NotificationRepository(GenericAsyncRepository):
    model = Notification

    async def get_by_user(
        self,
        user_id: uuid.UUID,
        skip: int = 0,
        limit: int = 50,
        unread_first: bool = True,
    ) -> tuple[list[Notification], int]:
        query = select(Notification).where(Notification.user_id == user_id)
        if unread_first:
            query = query.order_by(Notification.read.asc(), Notification.created_at.desc())
        else:
            query = query.order_by(Notification.created_at.desc())
        count_result = await self.session.execute(
            select(func.count()).where(Notification.user_id == user_id)
        )
        total = count_result.scalar_one()
        result = await self.session.execute(query.offset(skip).limit(limit))
        return list(result.scalars().all()), total

    async def mark_all_read(self, user_id: uuid.UUID) -> None:
        await self.session.execute(
            update(Notification)
            .where(Notification.user_id == user_id, Notification.read == False)
            .values(read=True)
        )
        await self.session.flush()

    async def get_unread_count(self, user_id: uuid.UUID) -> int:
        result = await self.session.execute(
            select(func.count()).where(
                Notification.user_id == user_id,
                Notification.read == False,
            )
        )
        return result.scalar_one()