import uuid
import logging
from typing import Union

from fastapi import Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)


async def error_handler_middleware(request: Request, call_next):
    """
    Global exception handler middleware.
    Catches exceptions and returns structured JSON error responses.
    """
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    try:
        return await call_next(request)
    except HTTPException as exc:
        # Let FastAPI handle HTTPException normally, but we can add request_id
        # We'll return a JSONResponse with our structure
        logger.warning(
            f"HTTPException: {exc.detail}",
            extra={"request_id": request_id, "status_code": exc.status_code},
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": exc.status_code,
                "message": exc.detail,
                "details": None,
                "request_id": request_id,
            },
        )
    except RequestValidationError as exc:
        logger.warning(
            f"Validation error: {exc.errors()}",
            extra={"request_id": request_id},
        )
        return JSONResponse(
            status_code=422,
            content={
                "code": 422,
                "message": "Validation error",
                "details": exc.errors(),
                "request_id": request_id,
            },
        )
    except SQLAlchemyError as exc:
        # Log the error for internal debugging
        logger.error(
            f"Database error: {exc}",
            extra={"request_id": request_id},
            exc_info=True,
        )
        return JSONResponse(
            status_code=500,
            content={
                "code": 500,
                "message": "Internal server error",
                "details": "A database error occurred",
                "request_id": request_id,
            },
        )
    except Exception as exc:
        # Catch-all for unexpected errors
        logger.error(
            f"Unhandled exception: {exc}",
            extra={"request_id": request_id},
            exc_info=True,
        )
        return JSONResponse(
            status_code=500,
            content={
                "code": 500,
                "message": "Internal server error",
                "details": "An unexpected error occurred",
                "request_id": request_id,
            },
        )