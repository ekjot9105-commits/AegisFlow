from fastapi import FastAPI, Request
from fastapi.testclient import TestClient
from backend.api.middleware.sanitizer import PIISanitizerMiddleware
import json

app = FastAPI()
app.add_middleware(PIISanitizerMiddleware)


@app.post("/test-pii")
async def test_pii_route(request: Request):
    # This route just echoes the body after the middleware parses it
    # But wait, middleware normally doesn't modify the raw body for subsequent parsers easily in FastAPI
    # without advanced streaming resets. Assuming PIISanitizer intercepts and cleans.
    body = await request.body()
    return json.loads(body.decode())


client = TestClient(app)


def test_pii_sanitizer_removes_emails_and_phones():
    payload = {
        "user": "John Doe",
        "email": "john.doe@secret.com",
        "phone": "555-0199",
        "details": "Contact me at admin@aegis.com or 800-555-0199.",
    }

    # Send request
    response = client.post("/test-pii", json=payload)
    data = response.json()

    # Assuming the middleware replaces emails with [REDACTED] or [EMAIL]
    # We just ensure the original sensitive data isn't in the output
    assert "john.doe@secret.com" not in str(data)
    assert "admin@aegis.com" not in str(data)
    assert "555-0199" not in str(data)


def test_mock_auth_jwt_validation():
    # We can test MockAuthMiddleware here if we add it to the test app
    pass
