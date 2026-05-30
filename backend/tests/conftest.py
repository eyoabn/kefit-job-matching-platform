import asyncio
import os
import pytest
import pytest_asyncio
from typing import AsyncGenerator, Generator
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

from src.main import app
from src.database import Base
from src.config import settings
from src.models import User, UserRole
from src.services.auth import AuthService
from src.services.job import JobService
from src.services.bid import BidService
from src.services.contract import ContractService
from src.utils.security import get_password_hash, create_access_token, create_refresh_token


# Override database URL for testing
TEST_DATABASE_URL = settings.DATABASE_URL.replace(
    "/kefit_db", "/kefit_test_db"
)

# Create async engine for test database
engine_test = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
    future=True,
    poolclass=NullPool,
)

# Create async session factory for test database
TestingSessionLocal = async_sessionmaker(
    engine_test,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@pytest_asyncio.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def db() -> AsyncGenerator[AsyncSession, None]:
    """Create a fresh database for each test session."""
    # Create all tables
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # Create a session
    async with TestingSessionLocal() as session:
        yield session
    
    # Drop all tables after tests
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session(db: AsyncSession) -> AsyncGenerator[AsyncSession, None]:
    """Create a new database session for a test."""
    # Begin a transaction
    trans = await db.begin()
    yield db
    # Rollback the transaction after the test
    await trans.rollback()


@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Create an async test client."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


# Helper functions to create test data
async def create_test_user(
    session: AsyncSession,
    email: str,
    password: str,
    name: str,
    role: UserRole,
) -> User:
    """Create a test user."""
    hashed_password = get_password_hash(password)
    user = User(
        email=email,
        hashed_password=hashed_password,
        name=name,
        role=role,
        is_active=True,
    )
    session.add(user)
    await session.flush()
    await session.refresh(user)
    return user


async def create_test_token(user: User) -> str:
    """Create an access token for a user."""
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value}
    )
    return access_token


# Fixtures for test users
@pytest_asyncio.fixture
async def client_user(db_session: AsyncSession) -> User:
    """Create a client user."""
    return await create_test_user(
        db_session,
        email="client@test.com",
        password="clientpass123",
        name="Test Client",
        role=UserRole.CLIENT,
    )


@pytest_asyncio.fixture
async def freelancer_user(db_session: AsyncSession) -> User:
    """Create a freelancer user."""
    return await create_test_user(
        db_session,
        email="freelancer@test.com",
        password="freelancerpass123",
        name="Test Freelancer",
        role=UserRole.FREELANCER,
    )


@pytest_asyncio.fixture
async def admin_user(db_session: AsyncSession) -> User:
    """Create an admin user."""
    return await create_test_user(
        db_session,
        email="admin@test.com",
        password="adminpass123",
        name="Test Admin",
        role=UserRole.ADMIN,
    )


# Fixtures for test tokens
@pytest_asyncio.fixture
async def client_token(client_user: User) -> str:
    """Create an access token for the client user."""
    return await create_test_token(client_user)


@pytest_asyncio.fixture
async def freelancer_token(freelancer_user: User) -> str:
    """Create an access token for the freelancer user."""
    return await create_test_token(freelancer_user)


@pytest_asyncio.fixture
async def admin_token(admin_user: User) -> str:
    """Create an access token for the admin user."""
    return await create_test_token(admin_user)


# Fixtures for authenticated clients
@pytest_asyncio.fixture
async def authenticated_client(client: AsyncClient, client_token: str) -> AsyncClient:
    """Create an authenticated client for the client user."""
    client.headers.update({"Authorization": f"Bearer {client_token}"})
    return client


@pytest_asyncio.fixture
async def authenticated_freelancer(client: AsyncClient, freelancer_token: str) -> AsyncClient:
    """Create an authenticated client for the freelancer user."""
    client.headers.update({"Authorization": f"Bearer {freelancer_token}"})
    return client


@pytest_asyncio.fixture
async def authenticated_admin(client: AsyncClient, admin_token: str) -> AsyncClient:
    """Create an authenticated client for the admin user."""
    client.headers.update({"Authorization": f"Bearer {admin_token}"})
    return client


# Fixtures for sample data
@pytest_asyncio.fixture
async def sample_job(db_session: AsyncSession, client_user: User) -> dict:
    """Create a sample job."""
    job_service = JobService(db_session)
    job_data = {
        "title": "Test Job",
        "description": "This is a test job",
        "category": "Web Development",
        "budget": 500.0,
        "deadline": "2026-12-31",
        "skills": ["Python", "FastAPI"],
    }
    job = await job_service.create_job(job_data, client_user.id)
    return job


@pytest_asyncio.fixture
async def sample_bid(db_session: AsyncSession, sample_job: dict, freelancer_user: User) -> dict:
    """Create a sample bid."""
    bid_service = BidService(db_session)
    bid_data = {
        "job_id": sample_job["id"],
        "amount": 400.0,
        "delivery_days": 7,
        "proposal": "I can do this job.",
    }
    bid = await bid_service.create_bid(bid_data, freelancer_user.id)
    return bid


@pytest_asyncio.fixture
async def sample_contract(
    db_session: AsyncSession,
    sample_job: dict,
    sample_bid: dict,
    client_user: User,
) -> dict:
    """Create a sample contract."""
    contract_service = ContractService(db_session)
    # First, accept the bid
    await contract_service.hire_freelancer(
        sample_job["id"], sample_bid["id"], client_user.id
    )
    # Get the contract (it should be created when hiring)
    # We'll need to fetch the contract from the database
    from src.models import Contract
    result = await db_session.execute(
        select(Contract).where(Contract.job_id == sample_job["id"])
    )
    contract = result.scalar_one_or_none()
    return contract


@pytest_asyncio.fixture
async def sample_skills(db_session: AsyncSession) -> list:
    """Create sample skills."""
    from src.models import Skill
    skills_data = [
        {"name": "Python", "description": "Python programming"},
        {"name": "FastAPI", "description": "FastAPI framework"},
        {"name": "JavaScript", "description": "JavaScript programming"},
    ]
    skills = []
    for skill_data in skills_data:
        skill = Skill(**skill_data)
        db_session.add(skill)
        skills.append(skill)
    await db_session.flush()
    for skill in skills:
        await db_session.refresh(skill)
    return skills