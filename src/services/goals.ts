import { apiClient } from './api';
import type { Goal } from '@/types';

export interface CreateGoalData {
  case_id: string;
  title: string;
  description?: string;
  target_date?: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  progress?: number;
}

export interface UpdateGoalData {
  title?: string;
  description?: string;
  target_date?: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  progress?: number;
}

export const goalsApi = {
  getAll: (params?: { case_id?: string; skip?: number; limit?: number }) =>
    apiClient.get<Goal[]>('/goals', params),

  getById: (id: string) =>
    apiClient.get<Goal>(`/goals/${id}`),

  create: (data: CreateGoalData) =>
    apiClient.post<Goal>('/goals', data),

  update: (id: string, data: UpdateGoalData) =>
    apiClient.put<Goal>(`/goals/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/goals/${id}`),
};
