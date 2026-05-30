import time
import uuid
import logging
from pythonjsonlogger import jsonlogger

from fastapi import Request

# Configure JSON logger
logger = logging.getLogger("access")
logger.setLevel(logging.INFO)

# Create handler if not exists
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = jsonlogger.JsonFormatter(
        '%(timestamp)s %(request_id)s %(user_id)s %(method)s %(endpoint)s %(status_code)s %(latency_ms)s'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.propagate = False


async def logging_middleware(request: Request, call_next):
    """
    Structured JSON logging middleware.
    Logs request details with request_id, user_id, method, endpoint, status_code, latency_ms.
    """
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    # Extract user_id if available (from current_user dependency)
    user_id = getattr(request.state, "user_id", None)
    if user_id is None:
        # Try to get from auth header or state
        user_id = getattr(request.state, "user", None)
        if user_id and hasattr(user_id, "id"):
            user_id = str(user_id.id)
        else:
            user_id = None
    
    start_time = time.time()
    
    # Process request
    response = await call_next(request)
    
    # Calculate latency
    latency_ms = int((time.time() - start_time) * 1000)
    
    # Log the request
    logger.info(
        "",
        extra={
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "request_id": request_id,
            "user_id": user_id or "-",
            "method": request.method,
            "endpoint": request.url.path,
            "status_code": response.status_code,
            "latency_ms": latency_ms,
        }
    )
    
    return response