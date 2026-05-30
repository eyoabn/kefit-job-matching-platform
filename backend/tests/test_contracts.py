import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Contract, Job, User


@pytest.mark.asyncio
async def test_hire_freelancer(authenticated_client: AsyncClient, sample_job: dict, sample_bid: dict):
    """Test hiring a freelancer for a job."""
    response = await authenticated_client.post(
        f"/api/v1/jobs/{sample_job['id']}/hire/{sample_bid['id']}",
    )
    assert response.status_code == 200
    assert "detail" in response.json()
    assert "Freelancer hired successfully" in response.json()["detail"]
    
    # Verify job status is updated to InProgress
    job_response = await authenticated_client.get(f"/api/v1/jobs/{sample_job['id']}")
    assert job_response.status_code == 200
    job_data = job_response.json()
    assert job_data["status"] == "InProgress"


@pytest.mark.asyncio
async def test_concurrent_hire_returns_409(authenticated_client: AsyncClient, sample_job: dict, sample_bid: dict):
    """Test that concurrent hire attempts return 409."""
    # First hire
    response1 = await authenticated_client.post(
        f"/api/v1/jobs/{sample_job['id']}/hire/{sample_bid['id']}",
    )
    assert response1.status_code == 200
    
    # Second hire attempt for the same job and bid
    response2 = await authenticated_client.post(
        f"/api/v1/jobs/{sample_job['id']}/hire/{sample_bid['id']}",
    )
    assert response2.status_code == 409
    assert "Another user is currently hiring for this job" in response2.json()["detail"]


@pytest.mark.asyncio
async def test_complete_contract(authenticated_client: AsyncClient, sample_contract: dict):
    """Test completing a contract."""
    contract_id = sample_contract["id"]
    response = await authenticated_client.put(
        f"/api/v1/contracts/{contract_id}/complete",
    )
    assert response.status_code == 200
    assert "detail" in response.json()
    
    # Verify contract status is updated to Completed
    contract_response = await authenticated_client.get(f"/api/v1/contracts/{contract_id}")
    assert contract_response.status_code == 200
    contract_data = contract_response.json()
    assert contract_data["status"] == "Completed"


@pytest.mark.asyncio
async def test_leave_review(authenticated_client: AsyncClient, sample_contract: dict, freelancer_user: User):
    """Test leaving a review for a completed contract."""
    # First, complete the contract
    contract_id = sample_contract["id"]
    await authenticated_client.put(f"/api/v1/contracts/{contract_id}/complete")
    
    # Then leave a review
    response = await authenticated_client.post(
        f"/api/v1/contracts/{contract_id}/review",
        json={
            "rating": 5,
            "comment": "Excellent work!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["rating"] == 5
    assert data["comment"] == "Excellent work!"
    assert data["reviewer_id"] == freelancer_user.id  # Assuming the client is reviewing the freelancer


@pytest.mark.asyncio
async def test_duplicate_review_fails(authenticated_client: AsyncClient, sample_contract: dict):
    """Test that leaving a duplicate review fails."""
    contract_id = sample_contract["id"]
    # First, complete the contract
    await authenticated_client.put(f"/api/v1/contracts/{contract_id}/complete")
    
    # Leave first review
    response1 = await authenticated_client.post(
        f"/api/v1/contracts/{contract_id}/review",
        json={
            "rating": 4,
            "comment": "Good job.",
        },
    )
    assert response1.status_code == 200
    
    # Attempt to leave another review for the same contract by the same user
    response2 = await authenticated_client.post(
        f"/api/v1/contracts/{contract_id}/review",
        json={
            "rating": 5,
            "comment": "Excellent!",
        },
    )
    assert response2.status_code == 409  # or 422, depending on implementation
    assert "already" in response2.json()["detail"].lower() or "duplicate" in response2.json()["detail"].lower()