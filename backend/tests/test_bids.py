import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Bid, Job, User


@pytest.mark.asyncio
async def test_submit_bid_as_freelancer(authenticated_freelancer: AsyncClient, sample_job: dict):
    """Test submitting a bid as a freelancer."""
    response = await authenticated_freelancer.post(
        f"/api/v1/jobs/{sample_job['id']}/bids",
        json={
            "amount": 400.0,
            "delivery_days": 7,
            "proposal": "I can do this job.",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 400.0
    assert data["delivery_days"] == 7
    assert data["proposal"] == "I can do this job."
    assert data["status"] == "Pending"


@pytest.mark.asyncio
async def test_submit_bid_as_client_fails(authenticated_client: AsyncClient, sample_job: dict):
    """Test that clients cannot submit bids."""
    response = await authenticated_client.post(
        f"/api/v1/jobs/{sample_job['id']}/bids",
        json={
            "amount": 400.0,
            "delivery_days": 7,
            "proposal": "I can do this job.",
        },
    )
    assert response.status_code == 403
    assert "Only freelancers can bid" in response.json()["detail"]


@pytest.mark.asyncio
async def test_duplicate_bid_returns_409(authenticated_freelancer: AsyncClient, sample_job: dict, sample_bid: dict):
    """Test that submitting a duplicate bid returns 409."""
    response = await authenticated_freelancer.post(
        f"/api/v1/jobs/{sample_job['id']}/bids",
        json={
            "amount": 350.0,
            "delivery_days": 5,
            "proposal": "I can do it cheaper and faster.",
        },
    )
    assert response.status_code == 409
    assert "You already bid on this job" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_bids_as_job_owner(authenticated_client: AsyncClient, sample_job: dict, sample_bid: dict):
    """Test getting bids for a job as the job owner (client)."""
    response = await authenticated_client.get(f"/api/v1/jobs/{sample_job['id']}/bids")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["amount"] == sample_bid["amount"]
    assert data[0]["freelancer_name"] is not None


@pytest.mark.asyncio
async def test_update_bid_as_freelancer(authenticated_freelancer: AsyncClient, sample_bid: dict):
    """Test updating a bid as the freelancer who made it."""
    bid_id = sample_bid["id"]
    response = await authenticated_freelancer.patch(
        f"/api/v1/bids/{bid_id}",
        json={
            "amount": 450.0,
            "delivery_days": 5,
            "proposal": "Updated proposal.",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 450.0
    assert data["delivery_days"] == 5
    assert data["proposal"] == "Updated proposal."