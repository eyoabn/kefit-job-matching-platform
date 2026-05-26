import enum
import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, Enum as SAEnum, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base


class NotificationType(str, enum.Enum):
    BID = "Bid"
    CONTRACT = "Contract"
    MESSAGE = "Message"
    SYSTEM = "System"


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
    )
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(String(500))
    type: Mapped[NotificationType] = mapped_column(
        SAEnum(NotificationType),
        default=NotificationType.SYSTEM,
    )
    read: Mapped[bool] = mapped_column(Boolean, default=False)
    link: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    user = relationship("User", back_populates="notifications")
