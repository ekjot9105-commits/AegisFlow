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
            # Generate mock dynamic data with AI predictive fields
            data = [
                {"id": "N1", "name": "North Gate 1", "density": random.randint(40, 60), "risk": "low", "trend": "stable", "prediction": "Stable flow expected", "recommendation": "Maintain standard protocol", "confidence": 92, "expected_crowd": "+150 pax/10m", "queue_time": "3 mins"},
                {"id": "N2", "name": "North Gate 2", "density": random.randint(80, 95), "risk": "high", "trend": "up", "prediction": "Congestion likely in 5m", "recommendation": "Deploy crowd control to N2", "confidence": 88, "expected_crowd": "+500 pax/10m", "queue_time": "12 mins"},
                {"id": "E1", "name": "East Plaza", "density": random.randint(60, 75), "risk": "medium", "trend": "stable", "prediction": "Moderate increase likely", "recommendation": "Monitor East Plaza density", "confidence": 85, "expected_crowd": "+300 pax/10m", "queue_time": "6 mins"},
                {"id": "S1", "name": "South VIP", "density": random.randint(20, 40), "risk": "low", "trend": "down", "prediction": "Decreasing traffic", "recommendation": "None", "confidence": 95, "expected_crowd": "-50 pax/10m", "queue_time": "1 min"},
                {"id": "W1", "name": "West Gate 4", "density": random.randint(90, 99), "risk": "critical", "trend": "up", "prediction": "Severe bottleneck imminent", "recommendation": "Reroute incoming fans to W2", "confidence": 94, "expected_crowd": "+800 pax/10m", "queue_time": "25 mins"},
            ]
            yield {
                "event": "message",
                "id": "message_id",
                "retry": 15000,
                "data": json.dumps(data)
            }
            await asyncio.sleep(3) # Send update every 3 seconds

    return EventSourceResponse(event_generator())
