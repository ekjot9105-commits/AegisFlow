import type { CopilotRecommendation } from '../types';


export const fetchRecommendations = async (): Promise<CopilotRecommendation> => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const payload = {
    incident_id: "INC-AUTO-999",
    telemetry: [],
    reports: []
  };

  const response = await fetch(`${apiUrl}/api/v1/copilot/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock_dev_token_123'
    },
    body: JSON.stringify(payload)
  });

  const json = await response.json();
  if (!json.success) throw new Error(json.message);
  
  return json.data as CopilotRecommendation;
};

export const executeRecommendation = async (_incidentId: string, action: 'approve' | 'reject' | 'modify') => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, action };
};
