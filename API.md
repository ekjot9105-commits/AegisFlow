# API Documentation

AegisFlow uses a RESTful API built on FastAPI. Below is an overview of the core endpoints.

## Base URL
`/api/v1`

---

## 1. Copilot Operations

### `POST /copilot/predict`
Analyzes current stadium metrics and generates predictive crowd and risk intelligence.

**Expected Request:**
```json
{
  "crowd_density": 85,
  "flow_rate": 120,
  "active_incidents": ["Gate 4 Congestion"],
  "time_to_match": 45
}
```

**Expected Response:**
```json
{
  "risk_score": 75,
  "prediction": "Gate 4 density will exceed 100% capacity in 10 minutes.",
  "recommendations": ["Redirect fans to Gate 5", "Dispatch 3 volunteers"],
  "reasoning": "Simultaneous metro arrivals detected alongside localized choke points.",
  "confidence": 92
}
```

---

## 2. Dashboard Analytics

### `GET /dashboard/kpi`
Retrieves real-time Key Performance Indicators.

**Expected Response:**
```json
{
  "crowdDensity": 82,
  "activeIncidents": 2,
  "aiConfidence": 94,
  "volunteers": 45,
  "medicalAlerts": 1,
  "predictionAccuracy": 93,
  "averageResponseTime": "1m 15s"
}
```

### `GET /dashboard/incidents`
Retrieves a chronological list of ongoing stadium incidents.

---

## 3. Fan Services

### `POST /fan/concierge`
Interacts with the multilingual AI assistant for fan inquiries.

**Expected Request:**
```json
{
  "message": "Where is the nearest medical tent to sector A?",
  "language": "en"
}
```

**Expected Response:**
```json
{
  "reply": "The nearest medical tent is located near Gate 2, just past the Sector A concessions.",
  "language_detected": "en"
}
```
