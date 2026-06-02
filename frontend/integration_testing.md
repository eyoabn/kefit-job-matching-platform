# Integration Testing Documentation

## Phase A4: Integration Testing & Validation

### Backend Status

The FastAPI backend is built and configured. Database (SQLite) initializes correctly on startup.

### API Endpoints Available

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login user |
| `/auth/refresh` | POST | Refresh token |
| `/auth/me` | GET | Get current user |
| `/auth/logout` | POST | Logout user |
| `/jobs` | GET, POST | List/Create jobs |
| `/jobs/{id}` | GET, PATCH, DELETE | Get/Update/Delete job |
| `/jobs/{id}/bids` | GET, POST | List/Create bids |
| `/bids/{id}` | GET, PATCH | Get/Update bid |
| `/contracts` | GET | List contracts |
| `/contracts/{id}` | GET, PATCH | Get/Update contract |
| `/messages` | GET, POST | List/Send messages |
| `/notifications` | GET | List notifications |
| `/uploads` | POST | Upload file |

### E2E Test Flows

To verify integration, test these flows manually or with Cypress/Playwright:

#### Flow 1: Job Posting
```bash
# 1. Login as Client
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"password123"}'

# 2. Create Job
curl -X POST http://localhost:8000/api/v1/jobs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Web Developer Needed",
    "description":"Build a React website",
    "budget_min":500,
    "budget_max":2000,
    "deadline":"2026-05-30T00:00:00Z",
    "category":"Web Development"
  }'
```

#### Flow 2: Bidding & Hiring
```bash
# Freelancer submits bid
curl -X POST http://localhost:8000/api/v1/bids \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_id":"<job_id>",
    "amount":1500,
    "delivery_days":30,
    "proposal":"I can build this website"
  }'

# Client hires (creates contract)
curl -X POST http://localhost:8000/api/v1/jobs/<job_id>/hire/<bid_id> \
  -H "Authorization: Bearer <token>"
```

#### Flow 3: Messages
```bash
# Send message
curl -X POST http://localhost:8000/api/v1/messages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"receiver_id":"<user_id>","content":"Hello!"}'

# Get conversations
curl http://localhost:8000/api/v1/messages \
  -H "Authorization: Bearer <token>"
```

#### Flow 4: Contract Completion & Review
```bash
# Complete contract
curl -X PUT http://localhost:8000/api/v1/contracts/<contract_id>/complete \
  -H "Authorization: Bearer <token>"

# Leave review
curl -X POST http://localhost:8000/api/v1/contracts/<contract_id>/review \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Great work!","quality_rating":5}'
```

### Latency Targets

| Endpoint | Target |
|----------|--------|
| GET /jobs | ≤2s |
| POST /jobs/{id}/bids | ≤2s |
| GET /dashboard | ≤2s |
| GET /messages/{user_id} | ≤2s |

### Known Issues

* No CORS configuration issues detected
* JWT tokens include role claims
* File upload: max 10MB configured in backend

### Running the Backend

```bash
cd backend
source venv/bin/activate
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

### Running E2E Tests (Example with curl)

```bash
# Test health
curl http://localhost:8000/health

# Test register and get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","first_name":"Test","last_name":"User","role":"Freelancer"}' \
  | jq -r '.access_token')

# Test authenticated endpoints
curl http://localhost:8000/api/v1/jobs -H "Authorization: Bearer $TOKEN"
```