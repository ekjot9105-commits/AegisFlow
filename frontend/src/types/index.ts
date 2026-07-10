export interface VolunteerTask {
  task: string;
  location: string;
}

export interface Announcement {
  language: string;
  message: string;
}

export interface CopilotRecommendation {
  incident_id: string;
  risk_score: number;
  confidence: number;
  situation_summary: string;
  root_cause: string;
  evidence: string[];
  reasoning: string;
  reasoning_chain: string[];
  recommended_actions: any[];
  alternative_actions: any[];
  expected_impact?: string;
  estimated_crowd_reduction?: number;
  volunteer_tasks: VolunteerTask[];
  multilingual_announcement: any;
}
