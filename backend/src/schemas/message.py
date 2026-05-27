import uuid
from datetime import datetime
from pydantic import BaseModel


class MessageBase(BaseModel):
    content: str


class MessageCreate(MessageBase):
    receiver_id: uuid.UUID


class MessageResponse(MessageBase):
    id: uuid.UUID
    sender_id: uuid.UUID
    receiver_id: uuid.UUID
    read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationResponse(BaseModel):
    user_id: uuid.UUID
    user_name: str
    user_avatar: str | None = None
    last_message: str
    last_message_time: str
    unread_count: int
    online: bool = False
