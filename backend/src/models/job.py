import enum
import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, Enum as SAEnum, ForeignKey, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base


class JobStatus(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "InProgress"
    CLOSED = "Closed"


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    title: Mapped[str] = mapped_column(String(500), index=True)
    description: Mapped[str] = mapped_column(String(5000))
    category: Mapped[str] = mapped_column(String(100))
    budget: Mapped[float] = mapped_column(Float)
    deadline: Mapped[datetime] = mapped_column(DateTime)
    skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    status: Mapped[JobStatus] = mapped_column(
        SAEnum(JobStatus),
        default=JobStatus.OPEN,
    )
    client_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    client = relationship("User", back_populates="jobs", foreign_keys=[client_id])
    bids = relationship("Bid", back_populates="job")
