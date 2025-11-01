import { apiClient } from './api';
import type { SessionNote } from '@/types';

export interface CreateSessionNoteData {
  case_id: string;
  counsellor_id: string;
  date: string;
  duration?: number;
  type: 'INDIVIDUAL' | 'GROUP' | 'ASSESSMENT' | 'CONSULTATION';
  summary?: string;
  interventions?: string[];
  next_steps?: string[];
}

export interface UpdateSessionNoteData {
  date?: string;
  duration?: number;
  type?: 'INDIVIDUAL' | 'GROUP' | 'ASSESSMENT' | 'CONSULTATION';
  summary?: string;
  interventions?: string[];
  next_steps?: string[];
}

export const sessionNotesApi = {
  getAll: (params?: { case_id?: string; skip?: number; limit?: number }) =>
    apiClient.get<SessionNote[]>('/session-notes', params),

  getById: (id: string) =>
    apiClient.get<SessionNote>(`/session-notes/${id}`),

  create: (data: CreateSessionNoteData) =>
    apiClient.post<SessionNote>('/session-notes', data),

  update: (id: string, data: UpdateSessionNoteData) =>
    apiClient.put<SessionNote>(`/session-notes/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/session-notes/${id}`),
};
