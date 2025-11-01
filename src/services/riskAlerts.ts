import { apiClient } from './api';
import type { RiskAlert } from '@/types';

export interface CreateRiskAlertData {
  student_id: string;
  level: 'high' | 'critical';
  type: 'behavioral' | 'academic' | 'emotional' | 'social';
  description: string;
  triggers?: string[];
  recommendations?: string[];
  assigned_to?: string;
  status?: 'new' | 'in-review' | 'escalated' | 'resolved';
}

export interface UpdateRiskAlertData {
  level?: 'high' | 'critical';
  type?: 'behavioral' | 'academic' | 'emotional' | 'social';
  description?: string;
  triggers?: string[];
  recommendations?: string[];
  assigned_to?: string;
  status?: 'new' | 'in-review' | 'escalated' | 'resolved';
}

export const riskAlertsApi = {
  getAll: (params?: { 
    student_id?: string; 
    status?: string;
    assigned_to?: string;
    skip?: number; 
    limit?: number;
  }) =>
    apiClient.get<RiskAlert[]>('/risk-alerts', params),

  getById: (id: string) =>
    apiClient.get<RiskAlert>(`/risk-alerts/${id}`),

  create: (data: CreateRiskAlertData) =>
    apiClient.post<RiskAlert>('/risk-alerts', data),

  update: (id: string, data: UpdateRiskAlertData) =>
    apiClient.put<RiskAlert>(`/risk-alerts/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/risk-alerts/${id}`),
};
