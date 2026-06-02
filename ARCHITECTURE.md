# System Architecture
# Kefet Freelance Marketplace

---

## System Overview

Kefet is a web-based freelance job marketplace connecting
Ethiopian clients and freelancers through structured job
posting, competitive bidding, hiring workflows, and
integrated messaging.

---

## Architecture Style

Three-Tier Layered Architecture:

  [ React + TypeScript Frontend ]
            ↕ HTTP/REST (JSON)
  [ FastAPI Backend (Python 3.11) ]
            ↕ SQLAlchemy 2.0 (asyncpg)
  [ PostgreSQL 16 Database ]

---

## Backend Layer Responsibilities

  ┌─────────────────────────────────────────────────┐
  │  ROUTERS  (src/routers/)                        │
  │  - Parse HTTP requests                          │
  │  - Validate input via Pydantic schemas          │
  │  - Call service layer                           │
  │  - Return HTTP responses                        │
  │  - NO business logic                            │
  ├─────────────────────────────────────────────────┤
  │  SERVICES  (src/services/)                      │
  │  - Business logic & workflow orchestration      │
  │  - Transaction boundaries (commit/rollback)     │
  │  - Call repository layer only                   │
  │  - NO direct SQLAlchemy queries                 │
  ├─────────────────────────────────────────────────┤
  │  REPOSITORIES  (src/repositories/)              │
  │  - All database queries                         │
  │  - SQLAlchemy session management                │
  │  - NO business logic                            │
  │  - Returns domain models to services            │
  ├─────────────────────────────────────────────────┤
  │  MODELS  (src/models/)                          │
  │  - SQLAlchemy ORM table definitions             │
  │  - ENUMs, constraints, relationships            │
  │  - Alembic migration source of truth            │
  └─────────────────────────────────────────────────┘

---

## RBAC Role Matrix

  Feature                    Client    Freelancer   Admin
  ─────────────────────────────────────────────────────
  Post job                     ✅         ❌          ✅
  Edit/delete own job          ✅         ❌          ✅
  Browse jobs                  ✅         ✅          ✅
  Submit bid                   ❌         ✅          ❌
  View bids on own job         ✅         ❌          ✅
  Hire freelancer              ✅         ❌          ✅
  View own contracts           ✅         ✅          ✅
  Send messages                ✅         ✅          ✅
  View notifications           ✅         ✅          ✅
  Manage all users             ❌         ❌          ✅
  Deactivate users             ❌         ❌          ✅

---

## Key Workflows

### 1. Register & Login
  Client/Freelancer → POST /auth/register
  → POST /auth/login
  → Receive access token (30min) + refresh token (7d)
  → Access token stored in React memory only
  → Refresh token stored in HttpOnly cookie

### 2. Job Posting & Bidding
  Client → POST /jobs (status: Open)
  Freelancer → POST /jobs/{id}/bids
  Client → GET /jobs/{id}/bids (view all bids)

### 3. Hire Workflow (ACID Transaction)
  Client → POST /jobs/{job_id}/hire/{bid_id}
    BEGIN TRANSACTION
      SELECT bid FOR UPDATE          ← pessimistic lock
      INSERT contracts
      UPDATE jobs SET status = In_Progress
      UPDATE winning bid → Accepted
      UPDATE all other bids → Rejected
    COMMIT
  → Returns 409 if concurrent hire detected

### 4. Messaging
  POST /messages → send
  GET  /messages/{user_id} → thread (polled every 5s)
  PUT  /messages/{id}/read → mark read

### 5. Notifications (Event-Driven)
  BidSubmitted     → notify client
  ContractHired    → notify freelancer
  MessageReceived  → notify receiver

---

## NFR Targets

  Metric                  Target
  ──────────────────────────────────────
  Response time           ≤ 2 seconds (p95)
  Concurrent users        ≥ 1,000
  System availability     ≥ 99%
  Error rate              ≤ 1%
  Test coverage           ≥ 80%

---

## Technology Stack

  Layer           Technology
  ───────────────────────────────────────
  Frontend        React 18 + TypeScript
  Backend         FastAPI (Python 3.11)
  ORM             SQLAlchemy 2.0 + asyncpg
  Database        PostgreSQL 16
  Migrations      Alembic
  Auth            JWT (python-jose) + bcrypt
  Rate Limiting   slowapi + Redis
  Validation      Pydantic v2
  Containerization Docker + docker-compose
  Load Testing    Locust
  CI/CD           GitHub Actions

---

## Directory Structure
```
  kefet-freelance-marketplace/
  ├── ARCHITECTURE.md
  ├── ARCHITECTURE_DECISIONS.md
  ├── frontend/                 ← React + TypeScript
  └── backend/
      ├── src/
      │   ├── main.py
      │   ├── config.py
      │   ├── dependencies.py
      │   ├── routers/
      │   ├── services/
      │   ├── repositories/
      │   ├── models/
      │   ├── schemas/
      │   ├── middleware/
      │   └── utils/
      ├── alembic/
      ├── tests/
      ├── Dockerfile
      ├── requirements.txt
      └── .env.example
      ```