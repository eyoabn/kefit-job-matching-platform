import asyncio
from sqlalchemy import select
from src.database import async_session_maker
from src.models.user import User, UserRole
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def create_admin():
    async with async_session_maker() as session:
        email = "admin@kefet.com"
        user = (await session.execute(select(User).where(User.email == email))).scalar_one_or_none()
        if not user:
            user = User(
                email=email,
                hashed_password=get_password_hash("Admin@1234"),
                name="System Admin",
                role=UserRole.ADMIN,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            session.add(user)
            await session.commit()
            print(f"✅ Admin user created successfully!")
            print(f"Email: {email}")
            print(f"Password: Admin@1234")
        else:
            # If the user exists but is not an admin, we could upgrade them, but let's just create a unique one
            if user.role != UserRole.ADMIN:
                user.role = UserRole.ADMIN
                await session.commit()
                print(f"✅ User {email} upgraded to Admin role!")
            else:
                print(f"ℹ️ Admin user already exists with email {email}")

if __name__ == "__main__":
    asyncio.run(create_admin())
