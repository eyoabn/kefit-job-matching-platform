import enum
import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, Enum as SAEnum, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base


class ContractStatus(str, enum.Enum):
    ACTIVE = "Active"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id"),
    )
    client_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
    )
    freelancer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
    )
    bid_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("bids.id"),
    )
    amount: Mapped[float] = mapped_column(Float)
    start_date: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
    end_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    status: Mapped[ContractStatus] = mapped_column(
        SAEnum(ContractStatus),
        default=ContractStatus.ACTIVE,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    job = relationship("Job")
    client = relationship("User", foreign_keys=[client_id])
    freelancer = relationship("User", foreign_keys=[freelancer_id])
    bid = relationship("Bid")
    reviews = relationship("Review", back_populates="contract")
