from pydantic import BaseModel
import uuid
from datetime import datetime


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: str = "Freelancer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    name: str
    role: str
    avatar_url: str | None = None
    bio: str | None = None
    skills: list[str] | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
