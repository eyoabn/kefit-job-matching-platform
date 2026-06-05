from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address

from src.config import settings
# from src.database import engine, Base
from src.middleware.error_handler import error_handler_middleware
from src.middleware.logging_middleware import logging_middleware


limiter = Limiter(key_func=get_remote_address)


import asyncio
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migrations and seed data on startup
    import subprocess
    import sys
    from src.seed_demo_data import seed_demo_data
    
    print("Running database migrations...")
    subprocess.run([sys.executable, "-m", "alembic", "upgrade", "head"], check=False)
    
    print("Seeding demo data...")
    try:
        await seed_demo_data()
    except Exception as e:
        print(f"Seed data error (may already exist): {e}")
        
    yield


app = FastAPI(
    title="Kefit API",
    description="Ethiopian Freelance Marketplace API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.state.limiter = limiter

# Add custom middleware
app.middleware("http")(logging_middleware)
app.middleware("http")(error_handler_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


from src.routers import auth, jobs, bids, contracts, messages, notifications, users, admin

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/api/v1/jobs", tags=["jobs"])
app.include_router(bids.router, prefix="/api/v1/bids", tags=["bids"])
app.include_router(contracts.router, prefix="/api/v1/contracts", tags=["contracts"])
app.include_router(messages.router, prefix="/api/v1/messages", tags=["messages"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])