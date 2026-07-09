from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
import asyncio
import json
import random

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])

@router.get("/heatmap/stream")
async def heatmap_stream():
    """Server-Sent Events endpoint for real-time heatmap data"""
    async def event_generator():
        while True:
            # Generate mock dynamic data
            data = [
                {"id": "N1", "name": "North Gate 1", "density": random.randint(40, 60), "risk": "low", "trend": "stable"},
                {"id": "N2", "name": "North Gate 2", "density": random.randint(80, 95), "risk": "high", "trend": "up"},
                {"id": "E1", "name": "East Plaza", "density": random.randint(60, 75), "risk": "medium", "trend": "stable"},
                {"id": "S1", "name": "South VIP", "density": random.randint(20, 40), "risk": "low", "trend": "down"},
                {"id": "W1", "name": "West Gate 4", "density": random.randint(90, 99), "risk": "critical", "trend": "up"},
            ]
            yield {
                "event": "message",
                "id": "message_id",
                "retry": 15000,
                "data": json.dumps(data)
            }
            await asyncio.sleep(3) # Send update every 3 seconds

    return EventSourceResponse(event_generator())
