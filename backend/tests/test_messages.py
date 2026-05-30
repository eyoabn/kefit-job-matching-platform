import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import Message, User


@pytest.mark.asyncio
async def test_send_message(authenticated_client: AsyncClient, authenticated_freelancer: AsyncClient, client_user: User, freelancer_user: User):
    """Test sending a message."""
    # Send a message from client to freelancer
    response = await authenticated_client.post(
        "/api/v1/messages",
        json={
            "receiver_id": freelancer_user.id,
            "content": "Hello, I have a job for you.",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["receiver_id"] == freelancer_user.id
    assert data["sender_id"] == client_user.id
    assert data["content"] == "Hello, I have a job for you."
    assert not data["is_read"]


@pytest.mark.asyncio
async def test_get_thread(authenticated_client: AsyncClient, authenticated_freelancer: AsyncClient, client_user: User, freelancer_user: User):
    """Test getting the message thread between two users."""
    # Send a message from client to freelancer
    await authenticated_client.post(
        "/api/v1/messages",
        json={
            "receiver_id": freelancer_user.id,
            "content": "Hello, I have a job for you.",
        },
    )
    # Send a reply from freelancer to client
    await authenticated_freelancer.post(
        "/api/v1/messages",
        json={
            "receiver_id": client_user.id,
            "content": "Sure, what are the details?",
        },
    )
    
    # Get the thread from the client's perspective
    response = await authenticated_client.get(f"/api/v1/messages/{freelancer_user.id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    # Check that the messages are in the thread
    contents = [msg["content"] for msg in data]
    assert "Hello, I have a job for you." in contents
    assert "Sure, what are the details?" in contents


@pytest.mark.asyncio
async def test_mark_as_read(authenticated_client: AsyncClient, authenticated_freelancer: AsyncClient, client_user: User, freelancer_user: User):
    """Test marking a message as read."""
    # Send a message from client to freelancer
    response = await authenticated_client.post(
        "/api/v1/messages",
        json={
            "receiver_id": freelancer_user.id,
            "content": "Please read this.",
        },
    )
    assert response.status_code == 200
    message_id = response.json()["id"]
    
    # Mark the message as read (as the receiver, i.e., freelancer)
    response = await authenticated_freelancer.put(f"/api/v1/messages/{message_id}/read")
    assert response.status_code == 200
    assert response.json()["detail"] == "Message marked as read"
    
    # Verify the message is marked as read
    # We can get the thread and check the is_read flag
    response = await authenticated_freelancer.get(f"/api/v1/messages/{client_user.id}")
    assert response.status_code == 200
    data = response.json()
    # Find the message we sent
    for msg in data:
        if msg["id"] == message_id:
            assert msg["is_read"] == True
            break
    else:
        assert False, "Message not found in thread"


@pytest.mark.asyncio
async def test_get_conversations(authenticated_client: AsyncClient, authenticated_freelancer: AsyncClient, client_user: User, freelancer_user: User):
    """Test getting the list of conversations."""
    # Send a message from client to freelancer
    await authenticated_client.post(
        "/api/v1/messages",
        json={
            "receiver_id": freelancer_user.id,
            "content": "Hello",
        },
    )
    
    # Get conversations for the client
    response = await authenticated_client.get("/api/v1/messages/conversations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # We should have one conversation (with the freelancer)
    assert len(data) >= 1
    # Check that the conversation is with the freelancer
    found = False
    for conv in data:
        if conv["id"] == freelancer_user.id:
            found = True
            break
    assert found, "Conversation with freelancer not found"