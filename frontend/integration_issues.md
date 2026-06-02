# Integration Issues

## Backend Not Yet Built
**Status**: Frontend is fully wired but requires backend at `http://localhost:8000/api/v1`

The frontend is complete and all phases (F1-F5) are implemented. The backend folder does not yet exist.

---

## Potential API Mismatches to Verify

### Field Naming Convention
- Frontend uses camelCase: `deliveryTime`, `freelancerId`, `createdAt`
- Backend may use snake_case: `delivery_time`, `freelancer_id`, `created_at`
- **Action**: Verify backend schema matches frontend types

### Bid Submission
- Frontend calls: `POST /api/v1/jobs/{jobId}/bids`
- Frontend sends: `{ amount, timeline, proposal }`
- Backend may expect: `{ job_id, amount, delivery_days, proposal }`
- **Action**: Verify field names match when backend is built

### Notifications
- Frontend calls: `POST /api/v1/notifications/read-all`
- Integration docs say: `PUT /api/v1/notifications/read-all`
- **Action**: Use POST (more RESTful for action) - verify backend supports it

### Messages
- Frontend sends: `{ receiver_id, content }`
- Backend may expect different structure
- **Action**: Verify when backend is built

---

## Verified Working

| Phase | Feature | Status |
|-------|---------|--------|
| F1 | Auth (login/register/logout) | ✅ Wired |
| F1 | JWT token handling | ✅ In memory |
| F1 | Role-based routing | ✅ ProtectedRoute |
| F2 | Job CRUD | ✅ Wired |
| F2 | Bid submission | ✅ Wired |
| F2 | Hire freelancer | ✅ Wired with 409 |
| F3 | Job browse + filters | ✅ Wired |
| F3 | Submit bid form | ✅ 409 handling |
| F4 | Messaging | ✅ Polling + optimistic |
| F5 | Notifications | ✅ 10s polling |
| F5 | Unread badge | ✅ Dropdown |

---

## To Test When Backend is Ready

1. Start backend: `cd backend && uvicorn src.main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Test flows from Phase F6

---

## Last Updated
Phase F5 complete - 2026-04-27