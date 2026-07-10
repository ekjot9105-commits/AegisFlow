"""
Incident Orchestration Service.

Acts as the coordination layer between API routes, the Semantic Cache, 
and the Operations Copilot Agent. Keeps business logic out of routers.
"""

import logging
from typing import List
import hashlib

from backend.db.schemas import SensorTelemetry, IncidentReportInput, CopilotRecommendation
from backend.ai.agents.operations_copilot import OperationsCopilotAgent
from backend.services.cache import semantic_cache
from backend.ai.core import get_ai_service

logger = logging.getLogger(__name__)

class IncidentService:
    def __init__(self):
        # Instantiate dependencies. In a stricter DI setup, these would be injected.
        self.ai_service = get_ai_service(use_mock=None)
        self.agent = OperationsCopilotAgent(ai_service=self.ai_service)
        self.cache = semantic_cache
        
    def _generate_cache_key(
        self, 
        incident_id: str, 
        telemetry: List[SensorTelemetry], 
        reports: List[IncidentReportInput]
    ) -> str:
        """Generates a deterministic hash for the incident input state."""
        # Simple string representation for hashing
        raw_state = f"{incident_id}-"
        raw_state += "-".join([t.model_dump_json() for t in telemetry])
        raw_state += "-".join([r.model_dump_json() for r in reports])
        return raw_state

    async def get_mitigation_plan(
        self, 
        incident_id: str, 
        telemetry: List[SensorTelemetry], 
        reports: List[IncidentReportInput]
    ) -> CopilotRecommendation:
        """
        Orchestrates retrieving or generating a mitigation plan.
        Checks semantic cache first to prevent redundant LLM calls.
        """
        cache_key_prompt = self._generate_cache_key(incident_id, telemetry, reports)
        
        # 1. Check Cache
        cached_response = await self.cache.get(cache_key_prompt)
        if cached_response:
            logger.info(f"Returning cached mitigation plan for {incident_id}")
            return cached_response
            
        # 2. Call AI Agent
        logger.info(f"No cache found. Querying Operations Copilot for {incident_id}")
        recommendation = await self.agent.analyze_incident(
            incident_id=incident_id,
            telemetry_data=telemetry,
            recent_reports=reports
        )
        
        # 3. Store in Cache (TTL 5 minutes)
        await self.cache.set(cache_key_prompt, recommendation, ttl_seconds=300)
        
        return recommendation

# Dependency provider for FastAPI
def get_incident_service() -> IncidentService:
    return IncidentService()
