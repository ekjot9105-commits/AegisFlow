"""
Main FastAPI Application Entry Point for AegisFlow.

This module initializes the FastAPI app, configures global middleware
(such as the PII Sanitizer and CORS), and registers structured exception handlers
to ensure secure and consistent API responses.
"""

import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from backend.api.middleware.sanitizer import PIISanitizerMiddleware
from backend.db.schemas import APIResponse
from backend.api.routers import copilot, dashboard, chat
import jwt
import os

# Configure slowapi for rate limiting
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Enforces standard HTTP security headers for production."""
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

class MockAuthMiddleware(BaseHTTPMiddleware):
    """Validates Authorization tokens."""
    async def dispatch(self, request: Request, call_next):
        if request.method != "OPTIONS" and request.url.path.startswith("/api"):
            auth = request.headers.get("Authorization")
            if not auth or not auth.startswith("Bearer "):
                return JSONResponse(
                    status_code=401, 
                    content=APIResponse(success=False, message="Unauthorized - Missing Token", data=None).model_dump()
                )
            
            token = auth.split("Bearer ")[1]
            try:
                # Use PyJWT with an environment secret (falling back to a default for demo only)
                secret = os.getenv("JWT_SECRET", "super_secure_fifa_secret_2026")
                payload = jwt.decode(token, secret, algorithms=["HS256"])
                request.state.user = payload
            except jwt.ExpiredSignatureError:
                return JSONResponse(
                    status_code=401, 
                    content=APIResponse(success=False, message="Unauthorized - Token Expired", data=None).model_dump()
                )
            except jwt.InvalidTokenError:
                # Mock fallback for development if token is literally 'mock_dev_token_123'
                if token != "mock_dev_token_123":
                    return JSONResponse(
                        status_code=401, 
                        content=APIResponse(success=False, message="Unauthorized - Invalid Token", data=None).model_dump()
                    )
        return await call_next(request)



def create_app() -> FastAPI:
    """Factory function to create and configure the FastAPI application."""
    app = FastAPI(
        title="AegisFlow API",
        description="AI Stadium Operations Copilot for FIFA World Cup 2026",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Add CORS Middleware (restrict origins in production)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # Add Custom Middlewares
    app.add_middleware(MockAuthMiddleware)
    app.add_middleware(PIISanitizerMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    # Register API Routers
    app.include_router(copilot.router)
    app.include_router(dashboard.router)
    app.include_router(chat.router)

    # Register Global Exception Handlers
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        """Handles standard HTTP exceptions gracefully."""
        logger.warning(f"HTTP Exception {exc.status_code} at {request.url.path}: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content=APIResponse(
                success=False,
                message=str(exc.detail),
                data=None
            ).model_dump()
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """Handles Pydantic validation errors securely without leaking internal state."""
        logger.warning(f"Validation Error at {request.url.path}: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=APIResponse(
                success=False,
                message="Invalid request payload",
                data={"errors": [{"loc": err["loc"], "msg": err["msg"]} for err in exc.errors()]}
            ).model_dump()
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """Catch-all for unhandled exceptions to prevent stack trace leaks."""
        logger.error(f"Unhandled Exception at {request.url.path}: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=APIResponse(
                success=False,
                message="An internal server error occurred.",
                data=None
            ).model_dump()
        )

    # Health Check Endpoint
    @app.get("/health", response_model=APIResponse[dict], tags=["System"])
    async def health_check():
        """Simple health check endpoint."""
        return APIResponse(
            success=True,
            message="System is healthy",
            data={"status": "online"}
        )

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    # Typically run via `uvicorn backend.main:app --reload`
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
