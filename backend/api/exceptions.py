"""
Global exception handlers for AegisFlow API.
"""

import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from backend.db.schemas import APIResponse

logger = logging.getLogger(__name__)


async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """Handles standard HTTP exceptions gracefully."""
    logger.warning(
        f"HTTP Exception {exc.status_code} at {request.url.path}: {exc.detail}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=APIResponse(
            success=False, message=str(exc.detail), data=None
        ).model_dump(),
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Handles Pydantic validation errors securely without leaking internal state."""
    logger.warning(f"Validation Error at {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=APIResponse(
            success=False,
            message="Invalid request payload",
            data={
                "errors": [
                    {"loc": err["loc"], "msg": err["msg"]} for err in exc.errors()
                ]
            },
        ).model_dump(),
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all for unhandled exceptions to prevent stack trace leaks."""
    logger.error(
        f"Unhandled Exception at {request.url.path}: {str(exc)}", exc_info=True
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=APIResponse(
            success=False, message="An internal server error occurred.", data=None
        ).model_dump(),
    )


def register_exception_handlers(app) -> None:
    """Registers all global exception handlers on the FastAPI app instance."""
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)
