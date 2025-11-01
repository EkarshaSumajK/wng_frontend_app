import { apiClient } from './api';
import type { AIRecommendation } from '@/types';

export interface CreateAIRecommendationData {
  type: 'intervention' | 'assessment' | 'referral' | 'alert';
  confidence: 'low' | 'medium' | 'high';
  rationale?: string;
  recommendation: string;
  model_version?: string;
  related_student_id?: string;
  related_case_id?: string;
}

export interface UpdateAIRecommendationData {
  is_reviewed?: boolean;
  reviewed_by?: string;
}

export const aiRecommendationsApi = {
  getAll: (params?: { 
    student_id?: string; 
    case_id?: string; 
    is_reviewed?: boolean;
    skip?: number; 
    limit?: number;
  }) =>
    apiClient.get<AIRecommendation[]>('/ai-recommendations', params),

  getById: (id: string) =>
    apiClient.get<AIRecommendation>(`/ai-recommendations/${id}`),

  create: (data: CreateAIRecommendationData) =>
    apiClient.post<AIRecommendation>('/ai-recommendations', data),

  update: (id: string, data: UpdateAIRecommendationData) =>
    apiClient.put<AIRecommendation>(`/ai-recommendations/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/ai-recommendations/${id}`),

  markAsReviewed: (id: string, reviewedBy: string) =>
    apiClient.put<AIRecommendation>(`/ai-recommendations/${id}`, {
      is_reviewed: true,
      reviewed_by: reviewedBy,
    }),
};
