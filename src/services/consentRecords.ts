import { apiClient } from './api';
import type { ConsentRecord } from '@/types';

export interface CreateConsentRecordData {
  student_id: string;
  parent_name?: string;
  consent_type: 'assessment' | 'intervention' | 'data-sharing' | 'ai-analysis';
  status?: 'granted' | 'pending' | 'denied' | 'revoked';
  documents?: string[];
}

export interface UpdateConsentRecordData {
  parent_name?: string;
  status?: 'granted' | 'pending' | 'denied' | 'revoked';
  granted_at?: string;
  expires_at?: string;
  documents?: string[];
}

export const consentRecordsApi = {
  getAll: (params?: { 
    student_id?: string; 
    status?: string;
    skip?: number; 
    limit?: number;
  }) =>
    apiClient.get<ConsentRecord[]>('/consent-records', params),

  getById: (id: string) =>
    apiClient.get<ConsentRecord>(`/consent-records/${id}`),

  create: (data: CreateConsentRecordData) =>
    apiClient.post<ConsentRecord>('/consent-records', data),

  update: (id: string, data: UpdateConsentRecordData) =>
    apiClient.put<ConsentRecord>(`/consent-records/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/consent-records/${id}`),
};
