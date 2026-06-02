# Architecture Decisions

## Authentication & Token Storage

### Decision: In-Memory Access Token Storage

**Problem:** Storing JWT access tokens in `localStorage` exposes them to XSS attacks.

**Solution:** Store access token in JavaScript memory only (React state/context), never in localStorage.

### Implementation Details

1. **Access Token:** Stored in React's `AuthContext` and attached to Axios requests via request interceptor. Never persisted to localStorage/sessionStorage.

2. **Refresh Token:** Stored in HttpOnly cookie by the backend. The browser JavaScript cannot access this cookie, providing protection against XSS.

3. **Token Refresh Flow:**
   - When access token expires (401), axios interceptor attempts to refresh using the HttpOnly cookie
   - If refresh succeeds, the new access token is stored in memory and the original request is retried
   - If refresh fails, user is redirected to login

### Request Queue for Concurrent Refresh

During token refresh, concurrent API requests are queued to prevent multiple simultaneous refresh calls:
- First failed request triggers refresh
- Subsequent requests wait for refresh to complete
- Queued requests are retried with the new token once refresh succeeds

### Why This Is Secure

| Storage | XSS Access | CSRF Access |
|---------|------------|-------------|
| localStorage | Yes | No |
| sessionStorage | Yes | No |
| HttpOnly Cookie | No | Yes (when withCredentials=true) |

- XSS attacker cannot read the HttpOnly cookie or access token in memory
- CSRF protection provided by SameSite=Strict/Lax cookie attributes
- CORS policy prevents cross-origin requests from accessing tokens

### Security Best Practices Followed

1. No credentials hardcoded anywhere
2. Environment variables only in `.env.local` (gitignored)
3. Access tokens never leave browser memory
4. Refresh tokens use HttpOnly cookies
5. Request queue prevents token refresh race conditions