import { apiClient } from './api';
import type { Activity } from '@/types';

export interface CreateActivityData {
  school_id?: string;
  title: string;
  description?: string;
  type: 'MINDFULNESS' | 'SOCIAL_SKILLS' | 'EMOTIONAL_REGULATION' | 'ACADEMIC_SUPPORT' | 'TEAM_BUILDING';
  duration?: number;
  target_grades?: string[];
  materials?: string[];
  instructions?: string[];
  objectives?: string[];
}

export interface UpdateActivityData {
  title?: string;
  description?: string;
  type?: 'MINDFULNESS' | 'SOCIAL_SKILLS' | 'EMOTIONAL_REGULATION' | 'ACADEMIC_SUPPORT' | 'TEAM_BUILDING';
  duration?: number;
  target_grades?: string[];
  materials?: string[];
  instructions?: string[];
  objectives?: string[];
}

export const activitiesApi = {
  getAll: (params?: { 
    school_id?: string; 
    activity_type?: string;
    skip?: number; 
    limit?: number;
  }) =>
    apiClient.get<Activity[]>('/activities/', params),

  getById: (id: string) =>
    apiClient.get<Activity>(`/activities/${id}`),

  create: (data: CreateActivityData) =>
    apiClient.post<Activity>('/activities/', data),

  update: (id: string, data: UpdateActivityData) =>
    apiClient.put<Activity>(`/activities/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/activities/${id}`),
};
