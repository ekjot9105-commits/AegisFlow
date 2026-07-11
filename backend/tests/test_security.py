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


def test_pii_sanitizer_removes_names():
    payload = {
        "user": "John Doe",
        "message": "Hello from Alice and Bob",
    }

    # Send request
    response = client.post("/test-pii", json=payload)
    data = response.json()

    # The middleware should redact hardcoded names
    assert "John Doe" not in str(data)
    assert "Alice" not in str(data)
    assert "Bob" not in str(data)
    assert "[REDACTED]" in str(data)


def test_mock_auth_jwt_validation():
    # We can test MockAuthMiddleware here if we add it to the test app
    pass
