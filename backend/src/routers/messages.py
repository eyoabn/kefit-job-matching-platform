from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func

from src.dependencies import get_db, get_current_user
from src.models import Message, User
from src.schemas import MessageCreate, MessageResponse, ConversationResponse

router = APIRouter()


@router.get("/conversations")
async def get_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ConversationResponse]:
    subq = (
        select(
            func.greatest(Message.sender_id, Message.receiver_id).label("user_id"),
            func.least(Message.sender_id, Message.receiver_id).label("other_id"),
            func.max(Message.id).label("last_msg_id"),
        )
        .where(
            or_(
                Message.sender_id == current_user.id,
                Message.receiver_id == current_user.id,
            )
        )
        .group_by(
            func.greatest(Message.sender_id, Message.receiver_id),
            func.least(Message.sender_id, Message.receiver_id),
        )
        .subquery()
    )

    result = await db.execute(
        select(Message)
        .join(subq, Message.id == subq.c.last_msg_id)
    )
    messages = result.scalars().all()

    conversations = []
    for msg in messages:
        other_id = msg.sender_id if msg.receiver_id == current_user.id else msg.receiver_id
        user_result = await db.get(User, other_id)
        if user_result:
            unread_count_result = await db.execute(
                select(func.count(Message.id)).where(
                    Message.sender_id == other_id,
                    Message.receiver_id == current_user.id,
                    Message.read == False,
                )
            )
            unread_count = unread_count_result.scalar() or 0
            conversations.append(
                ConversationResponse(
                    user_id=other_id,
                    user_name=user_result.name,
                    user_avatar=user_result.avatar_url,
                    last_message=msg.content,
                    last_message_time=msg.created_at.isoformat(),
                    unread_count=unread_count,
                    online=False,
                )
            )
    return conversations


@router.get("/{user_id}")
async def get_thread(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[MessageResponse]:
    result = await db.execute(
        select(Message).where(
            or_(
                and_(
                    Message.sender_id == current_user.id,
                    Message.receiver_id == user_id,
                ),
                and_(
                    Message.sender_id == user_id,
                    Message.receiver_id == current_user.id,
                ),
            )
        ).order_by(Message.created_at.asc())
    )
    messages = result.scalars().all()
    return [
        MessageResponse(
            id=msg.id,
            sender_id=msg.sender_id,
            receiver_id=msg.receiver_id,
            content=msg.content,
            read=msg.read,
            created_at=msg.created_at,
        )
        for msg in messages
    ]


@router.post("")
async def send_message(
    request: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    receiver = await db.get(User, request.receiver_id)
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    message = Message(
        sender_id=current_user.id,
        receiver_id=request.receiver_id,
        content=request.content,
    )
    db.add(message)
    await db.flush()
    await db.refresh(message)

    return MessageResponse(
        id=message.id,
        sender_id=message.sender_id,
        receiver_id=message.receiver_id,
        content=message.content,
        read=message.read,
        created_at=message.created_at,
    )


@router.put("/{message_id}/read")
async def mark_as_read(
    message_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.get(Message, message_id)
    if not result:
        raise HTTPException(status_code=404, detail="Message not found")
    if result.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your message")

    result.read = True
    await db.flush()
    return {"detail": "Marked as read"}
