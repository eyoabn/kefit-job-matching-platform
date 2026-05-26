import enum
import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, Enum as SAEnum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base


class UserRole(str, enum.Enum):
    CLIENT = "Client"
    FREELANCER = "Freelancer"
    ADMIN = "Admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.FREELANCER)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    skills: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    jobs = relationship("Job", back_populates="client", foreign_keys="Job.client_id")
    bids = relationship("Bid", back_populates="freelancer")
    sent_messages = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
    received_messages = relationship("Message", back_populates="receiver", foreign_keys="Message.receiver_id")
    notifications = relationship("Notification", back_populates="user")
    freelancer_profile = relationship("FreelancerProfile", back_populates="user")
    given_reviews = relationship("Review", back_populates="reviewer", foreign_keys="Review.reviewer_id")
    received_reviews = relationship("Review", back_populates="reviewee", foreign_keys="Review.reviewee_id")
