import { apiClient } from './api';
import type { Case } from '@/types';

export interface CreateCaseData {
  student_id: string;
  created_by: string;
  presenting_concerns?: string;
  initial_risk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'INTAKE' | 'ASSESSMENT' | 'INTERVENTION' | 'MONITORING' | 'CLOSED';
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tags?: string[];
  assigned_counsellor?: string;
}

export interface UpdateCaseData {
  status?: 'intake' | 'assessment' | 'intervention' | 'monitoring' | 'closed';
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  assigned_counsellor?: string;
  ai_summary?: string;
}

export const casesApi = {
  getAll: (params?: {
    student_id?: string;
    status?: string;
    risk_level?: string;
    assigned_counsellor?: string;
    skip?: number;
    limit?: number;
  }) => apiClient.get<Case[]>('/cases', params),

  getById: (id: string) => apiClient.get<Case>(`/cases/${id}`),

  create: (data: CreateCaseData) => apiClient.post<Case>('/cases', data),

  update: (id: string, data: UpdateCaseData) =>
    apiClient.patch<Case>(`/cases/${id}`, data),

  delete: (id: string) => apiClient.delete(`/cases/${id}`),
};
