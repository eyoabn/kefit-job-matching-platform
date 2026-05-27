import uuid
from sqlalchemy import select, and_, or_, func
from sqlalchemy.orm import selectinload

from src.models.message import Message
from src.repositories.base_repo import GenericAsyncRepository


class MessageRepository(GenericAsyncRepository):
    model = Message

    async def get_thread(
        self,
        sender_id: uuid.UUID,
        receiver_id: uuid.UUID,
        page: int = 1,
        limit: int = 50,
    ) -> tuple[list[Message], int]:
        offset = (page - 1) * limit
        conversation_filter = or_(
            and_(
                Message.sender_id == sender_id,
                Message.receiver_id == receiver_id,
            ),
            and_(
                Message.sender_id == receiver_id,
                Message.receiver_id == sender_id,
            ),
        )
        query = select(Message).where(conversation_filter)
        count_result = await self.session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar_one()
        result = await self.session.execute(
            query.offset(offset).limit(limit).order_by(Message.created_at.desc())
        )
        return list(result.scalars().all()), total

    async def get_conversations(self, user_id: uuid.UUID) -> list[dict]:
        subq = (
            select(
                func.coalesce(Message.receiver_id, Message.sender_id).label("other_user_id"),
                func.max(Message.created_at).label("last_message_time"),
            )
            .where(or_(Message.sender_id == user_id, Message.receiver_id == user_id))
            .group_by("other_user_id")
            .subquery()
        )
        result = await self.session.execute(
            select(Message)
            .where(
                or_(Message.sender_id == user_id, Message.receiver_id == user_id)
            )
            .order_by(Message.created_at.desc())
        )
        messages = result.scalars().all()
        conversations_map: dict[uuid.UUID, dict] = {}
        for msg in messages:
            other_id = msg.receiver_id if msg.sender_id == user_id else msg.sender_id
            if other_id not in conversations_map:
                conversations_map[other_id] = {
                    "user_id": other_id,
                    "last_message": msg.content,
                    "last_message_time": msg.created_at,
                    "unread_count": 0,
                }
            if not msg.read and msg.receiver_id == user_id:
                conversations_map[other_id]["unread_count"] += 1
        return list(conversations_map.values())

    async def mark_as_read(self, message_id: uuid.UUID) -> Message | None:
        message = await self.session.get(Message, message_id)
        if message:
            message.read = True
            await self.session.flush()
        return message

    async def mark_thread_read(self, sender_id: uuid.UUID, receiver_id: uuid.UUID) -> None:
        result = await self.session.execute(
            select(Message).where(
                Message.sender_id == sender_id,
                Message.receiver_id == receiver_id,
                Message.read == False,
            )
        )
        messages = result.scalars().all()
        for msg in messages:
            msg.read = True
        await self.session.flush()