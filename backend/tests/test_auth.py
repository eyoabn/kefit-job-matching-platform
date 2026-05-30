import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User


@pytest.mark.asyncio
async def test_register_client(authenticated_client: AsyncClient):
    """Test client registration."""
    response = await authenticated_client.post(
        "/api/v1/auth/register",
        json={
            "email": "newclient@test.com",
            "password": "newclientpass123",
            "name": "New Client",
            "role": "Client",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_freelancer(authenticated_client: AsyncClient):
    """Test freelancer registration."""
    response = await authenticated_client.post(
        "/api/v1/auth/register",
        json={
            "email": "newfreelancer@test.com",
            "password": "newfreelancerpass123",
            "name": "New Freelancer",
            "role": "Freelancer",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, client_user: User):
    """Test successful login."""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": client_user.email,
            "password": "clientpass123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, client_user: User):
    """Test login with wrong password."""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": client_user.email,
            "password": "wrongpassword",
        },
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_inactive_user(client: AsyncClient, db_session: AsyncSession):
    """Test login with inactive user."""
    # Create an inactive user
    from src.models import User, UserRole
    from src.utils.security import get_password_hash
    
    inactive_user = User(
        email="inactive@test.com",
        hashed_password=get_password_hash("testpass123"),
        name="Inactive User",
        role=UserRole.CLIENT,
        is_active=False,
    )
    db_session.add(inactive_user)
    await db_session.flush()
    
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": inactive_user.email,
            "password": "testpass123",
        },
    )
    # Depending on implementation, this might be 401 or 403
    assert response.status_code in (401, 403)


@pytest.mark.asyncio
async def test_refresh_token(client: AsyncClient, client_user: User):
    """Test token refresh."""
    # First login to get refresh token
    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": client_user.email,
            "password": "clientpass123",
        },
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    refresh_token = login_data["refresh_token"]
    
    # Use refresh token to get new access token
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"token": refresh_token},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_get_me(authenticated_client: AsyncClient, client_user: User):
    """Test getting current user info."""
    response = await authenticated_client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == client_user.email
    assert data["name"] == client_user.name
    assert data["role"] == client_user.role.value