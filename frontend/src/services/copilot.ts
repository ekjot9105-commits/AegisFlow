import type { CopilotRecommendation } from '../types';


export const fetchRecommendations = async (): Promise<CopilotRecommendation> => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const payload = {
    incident_id: "INC-AUTO-999",
    telemetry: [],
    reports: []
  };

  try {
    const response = await fetch(`${apiUrl}/api/v1/copilot/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock_dev_token_123'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('API Error');
    const json = await response.json();
    if (!json.success) throw new Error(json.message);
    
    return json.data as CopilotRecommendation;
  } catch (e) {
    // Graceful fallback for Netlify demo when backend is down
    console.warn("Backend unreachable, falling back to mock Copilot data", e);
    return {
      incident_id: "INC-2026-004",
      risk_score: 85,
      confidence: 94,
      situation_summary: "Predicted Crowd Surge at Transit Hub C due to Metro Line Delay.",
      root_cause: "Metro Authority reported a 15-minute delay on the Red Line, causing a bottleneck of arriving fans at Transit Hub C.",
      evidence: [
        "Metro API: Red Line Delay (15 mins).",
        "Sensor TH-C-01 reports arriving crowd density increasing by 12%/min.",
        "Historical Model: Delay at this time correlates with severe bottlenecks and loitering."
      ],
      reasoning: "The sudden pause in transit flow will cause arriving fans to loiter, increasing congestion and associated carbon footprint from idling transport vehicles. Redirecting incoming fans to the newly opened Eco-Shuttle route and deploying volunteer guides will optimize transit flow and minimize unnecessary idling.",
      reasoning_chain: [
        "Detected 15-minute Metro delay via Transportation API.",
        "Identified cascading crowd surge risk at Transit Hub C.",
        "Calculated that loitering crowd will cause local transit gridlock and increase carbon footprint.",
        "Formulated mitigation: Deploy Eco-Shuttles and redirect crowd."
      ],
      recommended_actions: [
        {
          action_id: "ACT-001",
          description: "Deploy 5 Electric Eco-Shuttles from Reserve Fleet to Transit Hub C.",
          priority: "urgent",
          expected_impact: "Optimized Public Transit Flow (Transportation)",
          assigned_role: "Transport Coordinator"
        },
        {
          action_id: "ACT-002",
          description: "Reroute pedestrian traffic away from Hub C using digital signage.",
          priority: "high",
          expected_impact: "Reduced crowd loitering / Carbon Offset (Sustainability)",
          assigned_role: "Operator"
        }
      ],
      alternative_actions: [],
      estimated_crowd_reduction: 45,
      volunteer_tasks: [
        { task: "Guide fans to Eco-Shuttle pickup points", location: "Transit Hub C" },
        { task: "Manage shuttle boarding queues", location: "Shuttle Bay 1" }
      ],
      multilingual_announcement: [
        { language: "English", message: "Attention fans. Due to a Metro delay, please use the free Electric Eco-Shuttles available at Exit B for faster transport." },
        { language: "Spanish", message: "Atención aficionados. Debido a un retraso en el Metro, utilicen los Eco-Shuttles eléctricos gratuitos en la Salida B para un transporte más rápido." }
      ]
    };
  }
};

export const executeRecommendation = async (_incidentId: string, action: 'approve' | 'reject' | 'modify') => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, action };
};
