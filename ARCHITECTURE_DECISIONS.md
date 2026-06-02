# Architecture Decision Records
# Kefit Freelance Marketplace

---

## ADR-001: FastAPI over Django

**Decision:** Use FastAPI as the backend framework.

**Reasoning:**
- FastAPI is async-first, which supports high concurrency
  targets (≥1000 concurrent users per NFR).
- Native OpenAPI/Swagger generation at /docs and /redoc
  with zero extra configuration — critical for graded
  documentation.
- Pydantic v2 integration provides schema-first request
  and response validation automatically.
- Lighter weight than Django — no ORM coupling, no admin
  overhead, cleaner separation of concerns.
- Django was considered but rejected due to its synchronous
  default ORM and tighter coupling between layers, which
  conflicts with the layered architecture requirement.

**Status:** Accepted

---

## ADR-002: PostgreSQL over MySQL

**Decision:** Use PostgreSQL 16 as the relational database.

**Reasoning:**
- Native ENUM types map cleanly to Python enums via
  SQLAlchemy without workarounds.
- Superior concurrency handling via MVCC (Multi-Version
  Concurrency Control) — critical for the hire workflow
  where concurrent bid acceptance must be prevented.
- SELECT FOR UPDATE (pessimistic locking) is more reliable
  in PostgreSQL than MySQL InnoDB under high concurrency.
- JSONB support available for future AI-driven job matching
  (noted in executive summary as future iteration).
- pg_dump tooling is more straightforward for the backup
  strategy defined in Phase B4.
- MySQL was considered but rejected due to weaker
  concurrency guarantees and less clean ENUM handling.

**Status:** Accepted

---

## ADR-003: SQLAlchemy 2.0 over Raw SQL

**Decision:** Use SQLAlchemy 2.0 with async support via asyncpg.

**Reasoning:**
- Type-safe mapped_column() syntax in SQLAlchemy 2.0
  eliminates a class of runtime errors caught only in
  production with raw SQL.
- Repository pattern implementation is cleaner with
  SQLAlchemy session management than raw psycopg2.
- Alembic (SQLAlchemy's migration tool) provides versioned,
  reversible migrations compatible with CI/CD pipelines.
- Raw SQL was considered for performance but rejected
  because the performance difference is negligible at
  prototype scale, and maintainability cost is too high.

**Status:** Accepted

---

## ADR-004: JWT (Stateless) over Django Sessions

**Decision:** Use JWT with access token + refresh token strategy.

**Reasoning:**
- Stateless authentication scales horizontally without
  shared session storage between workers.
- Access token (30 min expiry) stored in React memory only
  — not localStorage — to prevent XSS attacks.
- Refresh token (7 days expiry) stored in HttpOnly cookie
  — inaccessible to JavaScript — to prevent CSRF and XSS.
- Role (Client/Freelancer/Admin) embedded in JWT payload
  enables stateless RBAC without a database lookup on
  every request.
- Sessions were rejected because they require server-side
  storage (Redis or DB), adding infrastructure complexity
  that is not justified at prototype scale.

**Status:** Accepted

---

## ADR-005: Repository Pattern over Direct ORM Calls

**Decision:** Enforce Router → Service → Repository layering.

**Reasoning:**
- Routers handle only HTTP concerns (request parsing,
  response serialization, status codes).
- Services handle only business logic (validation rules,
  workflow orchestration, transaction boundaries).
- Repositories handle only data access (SQLAlchemy queries,
  session management, commits, rollbacks).
- This separation makes unit testing services possible
  without a real database by mocking repositories.
- Direct ORM calls in routers were rejected because they
  mix HTTP and business concerns, making testing harder
  and the codebase less maintainable.

**Status:** Accepted

---

## ADR-006: Pydantic v2 over Manual Validation

**Decision:** Use Pydantic v2 schemas for all request/response models.

**Reasoning:**
- Automatic FastAPI integration generates OpenAPI schema
  from Pydantic models with zero extra code.
- Validation errors automatically return structured 422
  responses with field-level detail, which the frontend
  maps directly to React Hook Form field errors.
- Manual validation was rejected as it duplicates what
  Pydantic provides for free and is error-prone.

**Status:** Accepted

---

## ADR-007: slowapi over In-Memory Rate Limiting

**Decision:** Use slowapi for rate limiting, backed by Redis.

**Reasoning:**
- In-memory rate limiting does not survive multi-worker
  Uvicorn/Gunicorn deployments — each worker maintains
  its own counter, making the limit ineffective.
- slowapi uses Redis as a shared counter store, ensuring
  rate limits are enforced correctly across all workers.
- Redis is already in the docker-compose stack for this
  purpose, adding no new infrastructure.

**Status:** Accepted

---

## ADR-008: Normalized Skills Tables over String Arrays

**Decision:** Use Skills, UserSkills, JobSkills junction tables.

**Reasoning:**
- Storing skills as a comma-separated string or PostgreSQL
  array violates 3NF and makes skill-based search
  (Phase 6) require full-text scanning instead of
  indexed lookups.
- Normalized junction tables enable efficient OR-logic
  skill matching: SELECT jobs WHERE skill IN (user_skills)
  using indexed foreign key joins.
- The slight schema complexity is justified by the direct
  impact on search quality and query performance.

**Status:** Accepted

---

## ADR-009: Polling over WebSockets for Messaging

**Decision:** Use REST polling (5s interval) for prototype messaging.

**Reasoning:**
- WebSocket infrastructure (connection management, 
  heartbeats, reconnection logic) adds significant
  complexity not justified for a prototype submission.
- 5-second polling provides acceptable UX for a demo
  while keeping the backend stateless and simple.
- Production migration path is documented: replace polling
  with FastAPI WebSocket endpoints + Redis pub/sub
  (pg_notify is an alternative using existing PostgreSQL).

**Status:** Accepted for prototype.
           Production should use WebSockets + Redis pub/sub.

---

## ADR-010: SELECT FOR UPDATE for Hire Concurrency

**Decision:** Use pessimistic locking on bid row during hire transaction.

**Reasoning:**
- The hire workflow is a multi-step atomic operation:
  validate bid → insert contract → update job status →
  update all bids. Without locking, two concurrent hire
  requests for the same job can both pass validation
  before either commits, creating two contracts.
- SELECT FOR UPDATE locks the bid row for the duration
  of the transaction, causing the second concurrent
  request to wait and then receive a 409 conflict.
- Optimistic locking (version columns) was considered
  but rejected because it requires a retry mechanism
  on the client side, complicating the frontend.

**Status:** Accepted