import { apiClient } from './api';
import type { Observation } from '@/types';

export interface CreateObservationData {
  student_id: string;
  reported_by: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category?: string;
  content?: string;
  audio_url?: string;
}

export interface UpdateObservationData {
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category?: string;
  content?: string;
  processed?: boolean;
}

export const observationsApi = {
  getAll: (params?: {
    student_id?: string;
    reported_by?: string;
    severity?: string;
    processed?: boolean;
    skip?: number;
    limit?: number;
  }) => apiClient.get<Observation[]>('/observations/', params),

  getById: (id: string) => apiClient.get<Observation>(`/observations/${id}`),

  create: (data: CreateObservationData) =>
    apiClient.post<Observation>('/observations/', data),

  update: (id: string, data: UpdateObservationData) =>
    apiClient.put<Observation>(`/observations/${id}`, data),

  delete: (id: string) => apiClient.delete(`/observations/${id}`),
};
