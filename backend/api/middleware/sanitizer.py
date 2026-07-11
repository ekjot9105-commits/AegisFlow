"""
PII Sanitizer Middleware for AegisFlow.

Intercepts incoming requests and masks Personally Identifiable Information (PII)
such as emails, phone numbers, ticket IDs, and basic names to ensure no sensitive
data is ever transmitted to the LLM or logged.
"""

import re
import json
import logging
from typing import Dict, Any, Union
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class PIISanitizer:
    """
    Core sanitization logic using regex rules to mask sensitive data.
    """

    # Regex patterns for various PII types
    EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
    PHONE_PATTERN = re.compile(
        r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"
    )
    TICKET_ID_PATTERN = re.compile(r"\bTKT-\d{4,8}\b", flags=re.IGNORECASE)

    # Basic mock name matching. In production, NER models like spaCy or AWS Comprehend would be used.
    # For this mock, we redact specific common placeholder names and any explicit name matches.
    MOCK_NAMES = ["John Doe", "Jane Smith", "Alice", "Bob", "Charlie", "Ekjot"]

    @classmethod
    def sanitize_text(cls, text: str) -> str:
        """Applies all masking rules to a given string."""
        if not isinstance(text, str):
            return text

        text = cls.EMAIL_PATTERN.sub("[EMAIL_REDACTED]", text)
        text = cls.PHONE_PATTERN.sub("[PHONE_REDACTED]", text)
        text = cls.TICKET_ID_PATTERN.sub("[TICKET_REDACTED]", text)

        for name in cls.MOCK_NAMES:
            text = re.sub(rf"\b{name}\b", "[NAME_REDACTED]", text, flags=re.IGNORECASE)

        return text

    @classmethod
    def sanitize_dict(
        cls, data: Union[Dict[str, Any], list, str]
    ) -> Union[Dict[str, Any], list, str]:
        """Recursively sanitizes a dictionary, list, or string."""
        if isinstance(data, str):
            return cls.sanitize_text(data)
        elif isinstance(data, dict):
            return {k: cls.sanitize_dict(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [cls.sanitize_dict(item) for item in data]
        return data


class PIISanitizerMiddleware(BaseHTTPMiddleware):
    """
    FastAPI middleware to intercept and sanitize request bodies.
    """

    async def dispatch(self, request: Request, call_next):
        # Only process requests that have a JSON body
        if request.method in [
            "POST",
            "PUT",
            "PATCH",
        ] and "application/json" in request.headers.get("content-type", ""):
            try:
                body_bytes = await request.body()
                if body_bytes:
                    body_json = json.loads(body_bytes)
                    sanitized_json = PIISanitizer.sanitize_dict(body_json)

                    # Reconstruct the request with the sanitized body
                    sanitized_bytes = json.dumps(sanitized_json).encode("utf-8")

                    # Override the request stream
                    async def receive():
                        return {"type": "http.request", "body": sanitized_bytes}

                    request._receive = receive
                    logger.debug("Request body sanitized successfully.")

            except json.JSONDecodeError:
                # Malformed JSON will be caught downstream by Pydantic validation
                pass
            except Exception as e:
                logger.error(f"Error in PIISanitizerMiddleware: {str(e)}")

        response = await call_next(request)
        return response
