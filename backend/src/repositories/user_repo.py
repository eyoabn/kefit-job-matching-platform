import uuid
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from src.models.user import User
from src.repositories.base_repo import GenericAsyncRepository


class UserRepository(GenericAsyncRepository):
    model = User

    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def get_with_profile(self, user_id: uuid.UUID) -> User | None:
        result = await self.session.execute(
            select(User)
            .options(selectinload(User.freelancer_profile))
            .where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_role(self, role: str, skip: int = 0, limit: int = 100) -> list[User]:
        result = await self.session.execute(
            select(User)
            .where(User.role == role)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())