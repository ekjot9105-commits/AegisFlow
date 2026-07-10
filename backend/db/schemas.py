"""
Pydantic schemas for AegisFlow API and AI data validation.

This module contains the core data structures used for API requests,
responses, and structured AI outputs. It enforces type safety and
validation rules across the application.
"""

from typing import List, Optional, Generic, TypeVar, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

T = TypeVar("T")

class RiskLevel(str, Enum):
    """Enumeration of possible risk levels for incidents."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ActionPriority(str, Enum):
    """Priority levels for recommended actions."""
    NORMAL = "normal"
    URGENT = "urgent"
    IMMEDIATE = "immediate"

class APIResponse(BaseModel, Generic[T]):
    """
    Standardized API response wrapper.
    Ensures a consistent structure for all endpoints.
    """
    success: bool = Field(..., description="Indicates if the request was successful")
    message: str = Field(..., description="Human-readable message about the result")
    data: Optional[T] = Field(None, description="The payload of the response")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional context or pagination info")

# --- AI Data Models ---

class ActionRecommendation(BaseModel):
    """A specific action recommended by the AI."""
    action_id: str = Field(..., description="Unique identifier for the action")
    description: str = Field(..., description="Detailed description of what to do")
    priority: ActionPriority = Field(..., description="Priority level of this action")
    expected_impact: str = Field(..., description="What this action aims to achieve")
    assigned_role: str = Field(..., description="Role responsible for execution (e.g., Volunteer, Operator)")

class VolunteerTask(BaseModel):
    """A specific task assigned to a volunteer based on AI recommendations."""
    task_id: str = Field(..., description="Unique task identifier")
    location: str = Field(..., description="Where the task should be performed (e.g., Gate 4)")
    instructions: str = Field(..., description="Step-by-step instructions for the volunteer")

class MultilingualAnnouncement(BaseModel):
    """Public address announcements generated in multiple languages."""
    english: str = Field(..., description="Announcement text in English")
    spanish: str = Field(..., description="Announcement text in Spanish")
    french: str = Field(..., description="Announcement text in French")

class CopilotRecommendation(BaseModel):
    """
    Structured output from the Operations Copilot Agent.
    Contains the full analysis and mitigation plan for an incident.
    """
    incident_id: str = Field(..., description="ID of the incident being analyzed")
    risk_score: int = Field(..., ge=1, le=100, description="Risk score from 1 to 100")
    risk_level: RiskLevel = Field(..., description="Categorized risk level")
    confidence: float = Field(..., ge=0.0, le=1.0, description="AI confidence score between 0.0 and 1.0")
    reasoning: str = Field(..., description="Detailed explanation of the AI's analysis")
    reasoning_chain: List[str] = Field(..., description="Step-by-step logical reasoning path taken by the AI")
    evidence: List[str] = Field(..., description="Data points supporting the reasoning")
    root_cause: str = Field(..., description="Identified core reason for the issue")
    situation_summary: str = Field(..., description="Detailed summary of the current situation")
    estimated_crowd_reduction: int = Field(..., description="Estimated percentage reduction in crowd density if actions are taken")
    recommended_actions: List[ActionRecommendation] = Field(..., description="List of mitigation steps")
    alternative_actions: List[ActionRecommendation] = Field(default_factory=list, description="Alternative mitigation steps with lower confidence or different trade-offs")
    volunteer_tasks: List[VolunteerTask] = Field(..., description="Specific tasks for volunteers")
    multilingual_announcement: MultilingualAnnouncement = Field(..., description="Generated PA announcements")
    incident_summary: str = Field(..., description="Brief summary for executive dashboard")

# --- Input Models ---

class SensorTelemetry(BaseModel):
    """Simulated input from a stadium sensor."""
    sensor_id: str = Field(..., description="Unique sensor ID")
    location: str = Field(..., description="Physical location of the sensor")
    metric_type: str = Field(..., description="Type of data (e.g., crowd_density, temperature)")
    value: float = Field(..., description="Current sensor reading")
    timestamp: str = Field(..., description="ISO 8601 timestamp")

class IncidentReportInput(BaseModel):
    """Input payload for a manually reported incident."""
    location: str = Field(..., description="Where the incident occurred")
    description: str = Field(..., description="What happened")
    reporter_role: str = Field(..., description="Role of the person reporting")
