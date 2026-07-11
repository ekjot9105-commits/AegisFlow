export interface KPIData {
  crowdDensity: number;
  activeIncidents: number;
  aiConfidence: number;
  volunteers: number;
  medicalAlerts: number;
  predictionAccuracy: number;
  averageResponseTime: string;
}

import type { HeatmapSector } from '../types';
export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'delay' | 'medical' | 'prediction' | 'approved' | 'announcement';
  title: string;
  description: string;
  status: 'pending' | 'resolved' | 'active';
}

export interface SystemHealthData {
  status: 'healthy' | 'degraded' | 'critical';
  cpuUsage: number;
  memoryUsage: number;
  cacheHits: number;
  cacheMisses: number;
  lastSync: string;
}

// Mocked fetch functions for TanStack Query
export const fetchKPIData = async (): Promise<KPIData> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    crowdDensity: 78,
    activeIncidents: 3,
    aiConfidence: 94,
    volunteers: 142,
    medicalAlerts: 1,
    predictionAccuracy: 91,
    averageResponseTime: '1m 45s'
  };
};

export const fetchHeatmapData = async (): Promise<HeatmapSector[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: 'N1', name: 'North Gate 1', density: 45, risk: 'low', trend: 'stable' },
    { id: 'N2', name: 'North Gate 2', density: 88, risk: 'high', trend: 'up' },
    { id: 'E1', name: 'East Plaza', density: 65, risk: 'medium', trend: 'stable' },
    { id: 'S1', name: 'South VIP', density: 30, risk: 'low', trend: 'down' },
    { id: 'W1', name: 'West Gate 4', density: 95, risk: 'critical', trend: 'up' },
  ];
};

export const fetchTimeline = async (): Promise<TimelineEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  return [
    { id: '1', timestamp: '14:25', type: 'delay', title: 'Metro Delay Detected', description: 'Red line delayed by 15 mins.', status: 'active' },
    { id: '2', timestamp: '14:28', type: 'prediction', title: 'AI Prediction Generated', description: 'Surge expected at Gate 4 in 10 mins.', status: 'resolved' },
    { id: '3', timestamp: '14:30', type: 'approved', title: 'Operator Approved Mitigation', description: 'Reroute to Gate 5 approved.', status: 'resolved' },
    { id: '4', timestamp: '14:31', type: 'announcement', title: 'Announcement Sent', description: 'Multilingual PA announcement dispatched.', status: 'resolved' },
    { id: '5', timestamp: '14:45', type: 'medical', title: 'Medical Alert', description: 'Heat exhaustion near East Plaza.', status: 'active' },
  ];
};

export const fetchSystemHealth = async (): Promise<SystemHealthData> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    status: 'healthy',
    cpuUsage: 42,
    memoryUsage: 68,
    cacheHits: 8432,
    cacheMisses: 105,
    lastSync: new Date().toISOString()
  };
};
