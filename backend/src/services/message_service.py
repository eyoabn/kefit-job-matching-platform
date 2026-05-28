import uuid
from fastapi import HTTPException, status

from src.models.message import Message
from src.repositories.message_repo import MessageRepository


class MessageService:
    def __init__(self, db):
        self.db = db
        self.message_repo = MessageRepository(db)

    async def send_message(
        self,
        receiver_id: uuid.UUID,
        content: str,
        sender_id: uuid.UUID,
    ) -> Message:
        if sender_id == receiver_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot send message to yourself",
            )

        message = await self.message_repo.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content,
            read=False,
        )
        await self.db.commit()
        await self.db.refresh(message)
        return message

    async def get_thread(
        self,
        user_id: uuid.UUID,
        current_user_id: uuid.UUID,
        page: int = 1,
        limit: int = 50,
    ) -> tuple[list[Message], int]:
        return await self.message_repo.get_thread(
            sender_id=user_id,
            receiver_id=current_user_id,
            page=page,
            limit=limit,
        )

    async def get_conversations(self, user_id: uuid.UUID) -> list[dict]:
        return await self.message_repo.get_conversations(user_id)

    async def mark_as_read(
        self,
        message_id: uuid.UUID,
        user_id: uuid.UUID,
    ) -> Message:
        message = await self.message_repo.get(message_id)
        if not message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found",
            )
        if message.receiver_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to mark this message as read",
            )
        return await self.message_repo.mark_as_read(message_id)