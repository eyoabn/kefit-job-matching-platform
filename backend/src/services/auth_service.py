import uuid
from fastapi import HTTPException, status

from src.models.user import User, UserRole
from src.models.freelancer_profile import FreelancerProfile
from src.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserOut
from src.repositories.user_repo import UserRepository
from src.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)


class AuthService:
    def __init__(self, db):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register_user(self, data: RegisterRequest) -> User:
        existing = await self.user_repo.get_by_email(data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        hashed = hash_password(data.password)
        user = await self.user_repo.create(
            email=data.email,
            hashed_password=hashed,
            name=data.name,
            role=UserRole(data.role),
        )

        if data.role == "Freelancer":
            profile = FreelancerProfile(user_id=user.id)
            self.db.add(profile)
            await self.db.flush()

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def login_user(self, data: LoginRequest) -> TokenResponse:
        user = await self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=30,
        )

    async def refresh_access_token(self, refresh_token: str) -> TokenResponse:
        try:
            payload = decode_token(refresh_token)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not a refresh token",
            )

        user_id = payload.get("sub")
        access_token = create_access_token({"sub": user_id})

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=30,
        )

    async def get_current_user(self, token: str) -> User:
        try:
            payload = decode_token(token)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        user = await self.user_repo.get(int(user_id))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        return user