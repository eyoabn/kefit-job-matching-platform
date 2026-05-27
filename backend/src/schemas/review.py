import uuid
from datetime import datetime
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    contract_id: uuid.UUID
    reviewee_id: uuid.UUID
    rating: int = Field(..., ge=1, le=5)
    comment: str | None = None
    review_type: str


class ReviewSubmit(BaseModel):
    """Simplified payload sent by the frontend to POST /contracts/{id}/review."""
    rating: int = Field(..., ge=1, le=5)
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: uuid.UUID
    contract_id: uuid.UUID
    reviewer_id: uuid.UUID
    reviewee_id: uuid.UUID
    rating: int
    comment: str | None = None
    review_type: str
    created_at: datetime

    model_config = {"from_attributes": True}