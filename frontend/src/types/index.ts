export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Preset {
  id: string;
  en: string;
  hi: string;
  te: string;
  ta: string;
  bn: string;
}

export interface VolunteerTask {
  task: string;
  location: string;
}

export interface Announcement {
  language: string;
  message: string;
}

export interface CopilotAction {
  action_id: string;
  description: string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  assigned_role?: string;
  expected_impact?: string;
}

export interface HeatmapSector {
  id: string;
  name: string;
  density: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  prediction?: string;
  queue_time?: string;
  recommendation?: string;
  confidence?: number;
  expected_crowd?: string;
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
  recommended_actions: CopilotAction[];
  alternative_actions: CopilotAction[];
  expected_impact?: string;
  estimated_crowd_reduction?: number;
  volunteer_tasks: VolunteerTask[];
  multilingual_announcement: Announcement[];
}
