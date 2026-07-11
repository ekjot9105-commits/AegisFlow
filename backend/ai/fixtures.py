"""
Fixtures and mock data for AI services.

Used by MockGeminiService to simulate realistic AI responses
without relying on an external API or hardcoding large dicts in core logic.
"""

DEFAULT_COPILOT_RECOMMENDATION = {
    "incident_id": "INC-AUTO-999",
    "risk_score": 85,
    "risk_level": "high",
    "confidence": 0.92,
    "reasoning": "High density detected at Gate 4 combined with unexpected metro arrival spike.",
    "reasoning_chain": [
        "Observed density at Gate 4 reached 95%.",
        "Correlated with recent metro arrival bringing 500+ passengers.",
        "Historical data shows Gate 5 is currently underutilized (30% density).",
        "Rerouting will distribute the load and resolve the bottleneck within 10 minutes.",
    ],
    "evidence": ["Crowd density > 90%", "Metro arrived with 500+ passengers"],
    "root_cause": "Transportation schedule misalignment causing sudden surge.",
    "situation_summary": "Gate 4 is experiencing critical overcrowding due to a sudden influx from the nearby metro station. If unresolved, this will lead to severe queue spillover into the main pedestrian walkway within 5 minutes.",
    "estimated_crowd_reduction": 40,
    "recommended_actions": [
        {
            "action_id": "ACT-001",
            "description": "Reroute incoming fans to Gate 5 using digital signage.",
            "priority": "urgent",
            "expected_impact": "Reduce Gate 4 density by 40% within 10 minutes.",
            "assigned_role": "Operator",
        }
    ],
    "alternative_actions": [
        {
            "action_id": "ACT-002",
            "description": "Deploy additional security to Gate 4 and open emergency overflow lanes.",
            "priority": "normal",
            "expected_impact": "Increase Gate 4 throughput by 15%, but requires more staff.",
            "assigned_role": "Volunteer",
        }
    ],
    "volunteer_tasks": [
        {
            "task_id": "TSK-001",
            "location": "Gate 4 Approach",
            "instructions": "Form a line and direct fans towards Gate 5. Use megaphones.",
        }
    ],
    "multilingual_announcement": {
        "english": "Attention fans: Gate 4 is currently experiencing high volume. Please proceed to Gate 5 for faster entry.",
        "spanish": "Atención aficionados: La Puerta 4 tiene un alto volumen. Por favor, diríjase a la Puerta 5 para una entrada más rápida.",
        "french": "Attention les fans : La porte 4 connaît actuellement une forte affluence. Veuillez vous diriger vers la porte 5.",
    },
    "incident_summary": "Gate 4 overcrowding due to metro surge. Rerouting to Gate 5 initiated.",
}
