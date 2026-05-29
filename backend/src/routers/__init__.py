from src.routers.auth import router as auth_router
from src.routers.jobs import router as jobs_router
from src.routers.bids import router as bids_router
from src.routers.contracts import router as contracts_router
from src.routers.messages import router as messages_router
from src.routers.notifications import router as notifications_router
from src.routers.users import router as users_router

__all__ = [
    "auth_router",
    "jobs_router",
    "bids_router",
    "contracts_router",
    "messages_router",
    "notifications_router",
    "users_router",
]
