import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Job, User


@pytest.mark.asyncio
async def test_create_job_as_client(authenticated_client: AsyncClient):
    """Test creating a job as a client."""
    response = await authenticated_client.post(
        "/api/v1/jobs",
        json={
            "title": "Test Job",
            "description": "This is a test job",
            "category": "Web Development",
            "budget": 500.0,
            "deadline": "2026-12-31",
            "skills": ["Python", "FastAPI"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Job"
    assert data["budget"] == 500.0
    assert data["status"] == "Pending"


@pytest.mark.asyncio
async def test_create_job_as_freelancer_fails(authenticated_freelancer: AsyncClient):
    """Test that freelancers cannot create jobs."""
    response = await authenticated_freelancer.post(
        "/api/v1/jobs",
        json={
            "title": "Test Job",
            "description": "This is a test job",
            "category": "Web Development",
            "budget": 500.0,
            "deadline": "2026-12-31",
            "skills": ["Python", "FastAPI"],
        },
    )
    assert response.status_code == 403
    assert "Only clients can create jobs" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_jobs_list(authenticated_client: AsyncClient, sample_job: dict):
    """Test getting a list of jobs."""
    response = await authenticated_client.get("/api/v1/jobs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["title"] == sample_job["title"]


@pytest.mark.asyncio
async def test_get_jobs_with_filters(authenticated_client: AsyncClient, sample_job: dict):
    """Test getting jobs with filters."""
    # Filter by category
    response = await authenticated_client.get(
        "/api/v1/jobs?category=Web Development"
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["category"] == "Web Development"
    
    # Filter by budget range
    response = await authenticated_client.get(
        "/api/v1/jobs?min_budget=400&max_budget=600"
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["budget"] >= 400
    assert data[0]["budget"] <= 600


@pytest.mark.asyncio
async def test_update_own_job(authenticated_client: AsyncClient, sample_job: dict):
    """Test updating own job."""
    job_id = sample_job["id"]
    response = await authenticated_client.put(
        f"/api/v1/jobs/{job_id}",
        json={
            "title": "Updated Job Title",
            "description": "Updated job description",
            "budget": 600.0,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Job Title"
    assert data["budget"] == 600.0


@pytest.mark.asyncio
async def test_delete_own_job(authenticated_client: AsyncClient, sample_job: dict):
    """Test deleting own job."""
    job_id = sample_job["id"]
    response = await authenticated_client.delete(f"/api/v1/jobs/{job_id}")
    assert response.status_code == 200
    assert "detail" in response.json()
    
    # Verify job is deleted
    response = await authenticated_client.get(f"/api/v1/jobs/{job_id}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_search_jobs_by_skill(authenticated_client: AsyncClient, sample_job: dict):
    """Test searching jobs by skill."""
    response = await authenticated_client.get("/api/v1/jobs/search?skill=Python")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "Python" in data[0]["skills"]