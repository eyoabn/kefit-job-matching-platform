import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey, Float, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base


class FreelancerProfile(Base):
    __tablename__ = "freelancer_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        unique=True,
    )
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hourly_rate: Mapped[float | None] = mapped_column(Float, nullable=True)
    availability: Mapped[str | None] = mapped_column(String(100), nullable=True)
    portfolio_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    years_of_experience: Mapped[int | None] = mapped_column(nullable=True)
    education: Mapped[str | None] = mapped_column(Text, nullable=True)
    certifications: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    user = relationship("User", back_populates="freelancer_profile")