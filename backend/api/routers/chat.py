from fastapi import APIRouter
from pydantic import BaseModel
import asyncio
from typing import List

router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatQueryRequest(BaseModel):
    query: str
    history: List[ChatMessage] = []


@router.post("/query")
async def process_chat_query(request: ChatQueryRequest):
    """
    Operator Copilot endpoint.
    Answers natural language queries about operations using AI.
    """
    # Simulate AI processing delay
    await asyncio.sleep(1.2)

    query = request.query.lower()

    # Mock intelligent responses based on intent
    if "gate 4" in query and "crowd" in query:
        response = "Gate 4 is crowded due to an unexpected arrival of 500+ passengers from the East Metro Station. Mitigation protocol ACT-001 (Rerouting to Gate 5) is recommended."
    elif "risk" in query or "highest" in query:
        response = "The highest risk area currently is West Gate 4 (Density: 95%). East Plaza is showing a moderate increasing trend."
    elif "halftime" in query:
        response = "During halftime, concessions in Sector North experienced a 30% increase above predicted demand, causing minor corridor congestion. Volunteer deployment resolved it within 4 minutes."
    else:
        response = "I'm monitoring all stadium systems. Could you provide more specific details about the sector or metric you're inquiring about?"

    return {
        "success": True,
        "message": "Query processed",
        "data": {"response": response},
    }
