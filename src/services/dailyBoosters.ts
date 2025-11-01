import { apiClient } from './api';
import type { DailyBooster } from '@/types';

export interface CreateDailyBoosterData {
  school_id?: string;
  title: string;
  type: 'story' | 'puzzle' | 'movement';
  duration?: number;
  description?: string;
  purpose?: string;
  target_grades?: string[];
  difficulty: 'easy' | 'medium' | 'engaging';
  full_instructions: string;
  materials?: string[];
}

export interface UpdateDailyBoosterData {
  title?: string;
  type?: 'story' | 'puzzle' | 'movement';
  duration?: number;
  description?: string;
  purpose?: string;
  target_grades?: string[];
  difficulty?: 'easy' | 'medium' | 'engaging';
  full_instructions?: string;
  materials?: string[];
}

export const dailyBoostersApi = {
  getAll: (params?: { 
    school_id?: string; 
    booster_type?: string;
    skip?: number; 
    limit?: number;
  }) =>
    apiClient.get<DailyBooster[]>('/daily-boosters/', params),

  getById: (id: string) =>
    apiClient.get<DailyBooster>(`/daily-boosters/${id}`),

  create: (data: CreateDailyBoosterData) =>
    apiClient.post<DailyBooster>('/daily-boosters/', data),

  update: (id: string, data: UpdateDailyBoosterData) =>
    apiClient.put<DailyBooster>(`/daily-boosters/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/daily-boosters/${id}`),
};
