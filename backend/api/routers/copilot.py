"""
API Router for the Operations Copilot.

Handles incoming REST requests for incident analysis and mitigation generation.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from backend.db.schemas import (
    APIResponse,
    CopilotRecommendation,
    SensorTelemetry,
    IncidentReportInput,
)
from backend.services.incident_service import IncidentService, get_incident_service

router = APIRouter(prefix="/api/v1/copilot", tags=["Copilot"])


class AnalyzeIncidentRequest(BaseModel):
    """Payload for requesting an AI analysis of an incident."""

    incident_id: str = Field(..., description="Unique ID for the incident")
    telemetry: List[SensorTelemetry] = Field(
        default_factory=list, description="Recent sensor data"
    )
    reports: List[IncidentReportInput] = Field(
        default_factory=list, description="Recent manual reports"
    )


@router.post("/analyze", response_model=APIResponse[CopilotRecommendation])
async def analyze_incident(
    request: AnalyzeIncidentRequest,
    service: IncidentService = Depends(get_incident_service),
):
    """
    Analyzes an ongoing incident using Generative AI.
    Returns a comprehensive mitigation plan including root causes and actionable steps.
    """
    try:
        recommendation = await service.get_mitigation_plan(
            incident_id=request.incident_id,
            telemetry=request.telemetry,
            reports=request.reports,
        )

        return APIResponse(
            success=True,
            message="Mitigation plan generated successfully.",
            data=recommendation,
        )
    except ValueError as ve:
        # Handles specific domain errors (like missing mock data config)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        # Catch-all will be handled securely by the global exception handler in main.py
        raise e
