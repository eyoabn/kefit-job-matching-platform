import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.notification import Notification, NotificationType
from src.models.job import Job
from src.models.contract import Contract
from src.models.message import Message


class EventDispatcher:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def dispatch(self, event_type: str, payload: dict) -> None:
        handler_map = {
            "bid_submitted": self.on_bid_submitted,
            "contract_hired": self.on_contract_hired,
            "message_received": self.on_message_received,
            "contract_completed": self.on_contract_completed,
        }
        handler = handler_map.get(event_type)
        if handler:
            await handler(**payload)

    async def on_bid_submitted(
        self,
        job_id: uuid.UUID,
        freelancer_id: uuid.UUID,
    ) -> None:
        job = await self.db.get(Job, job_id)
        if job:
            notification = Notification(
                user_id=job.client_id,
                title="New Bid Received",
                message=f"A freelancer has submitted a bid for your job: {job.title}",
                type=NotificationType.BID,
                link=f"/client/jobs/{job_id}/bids",
            )
            self.db.add(notification)
            await self.db.flush()

    async def on_contract_hired(
        self,
        contract_id: uuid.UUID,
    ) -> None:
        contract = await self.db.get(Contract, contract_id)
        if contract:
            notification = Notification(
                user_id=contract.freelancer_id,
                title="Contract Awarded",
                message=f"You have been hired for the job! Contract ID: {contract_id}",
                type=NotificationType.CONTRACT,
                link=f"/freelancer/contracts/{contract_id}",
            )
            self.db.add(notification)
            await self.db.flush()

    async def on_message_received(
        self,
        message_id: uuid.UUID,
    ) -> None:
        message = await self.db.get(Message, message_id)
        if message:
            notification = Notification(
                user_id=message.receiver_id,
                title="New Message",
                message=f"You have a new message from a user",
                type=NotificationType.MESSAGE,
                link=f"/messages/{message.sender_id}",
            )
            self.db.add(notification)
            await self.db.flush()

    async def on_contract_completed(
        self,
        contract_id: uuid.UUID,
    ) -> None:
        contract = await self.db.get(Contract, contract_id)
        if contract:
            for user_id in [contract.client_id, contract.freelancer_id]:
                notification = Notification(
                    user_id=user_id,
                    title="Contract Completed",
                    message=f"Contract for job has been marked as completed",
                    type=NotificationType.CONTRACT,
                    link=f"/contracts/{contract_id}",
                )
                self.db.add(notification)
            await self.db.flush()