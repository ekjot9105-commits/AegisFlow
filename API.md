# API Documentation

AegisFlow uses a RESTful API built on FastAPI. Below is an overview of the core endpoints.

## Base URL
`/api/v1`

---

## 1. Copilot Operations

### `POST /copilot/analyze`
Analyzes current stadium metrics (an incident) and generates predictive crowd and risk intelligence.

**Expected Request:**
```json
{
  "incident_id": "Gate 4 Congestion",
  "location": "Sector W1",
  "severity": "high",
  "description": "Sudden influx of fans causing bottleneck.",
  "timestamp": "2026-07-11T12:00:00Z",
  "status": "active"
}
```

**Expected Response (CopilotRecommendation):**
```json
{
  "success": true,
  "message": "Analysis complete",
  "data": {
    "incident_id": "Gate 4 Congestion",
    "risk_score": 75,
    "confidence": 92,
    "situation_summary": "Gate 4 density will exceed capacity.",
    "root_cause": "Simultaneous metro arrivals.",
    "evidence": ["Density spike in W1"],
    "reasoning": "Historical data suggests metro surges cause W1 choke points.",
    "reasoning_chain": ["Detected surge", "Correlated with transit"],
    "recommended_actions": [
      {
        "action_id": "REROUTE_FANS",
        "description": "Redirect fans to Gate 5",
        "priority": "high",
        "assigned_role": "steward",
        "expected_impact": "Reduce density by 30%"
      }
    ],
    "alternative_actions": [],
    "estimated_crowd_reduction": 30,
    "volunteer_tasks": [],
    "multilingual_announcement": []
  }
}
```

---

## 2. Dashboard Analytics

### `GET /dashboard/heatmap/stream`
Server-Sent Events (SSE) endpoint that continuously streams real-time heatmap sector data to the frontend.

**Event Data Payload (Array of Sectors):**
```json
[
  {
    "id": "N1",
    "name": "North Gate 1",
    "density": 45,
    "risk": "low",
    "trend": "stable"
  }
]
```

### `GET /dashboard/predict?horizon={minutes}`
Generates predicted state of the stadium heatmap sectors for a given future time horizon (e.g., 5, 10, or 15 minutes).

**Expected Response:**
```json
{
  "success": true,
  "message": "Prediction generated",
  "data": [
    {
      "id": "W1",
      "name": "West Gate 4",
      "predicted_density": 95,
      "risk_trend": "increasing",
      "predicted_queue_time": 15
    }
  ]
}
```

---

## 3. Fan Services

### `POST /chat/query`
Interacts with the multilingual AI assistant for fan inquiries via the Semantic Cache.

**Expected Request:**
```json
{
  "query": "Where is the nearest medical tent to sector A?",
  "language": "en"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Query processed",
  "data": {
    "answer": "The nearest medical tent is located near Gate 2, just past the Sector A concessions.",
    "cached": false,
    "confidence": 95
  }
}
```
