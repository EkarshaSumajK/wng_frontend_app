import { apiClient } from './api';
import type { Student } from '@/types';

export interface CreateStudentData {
  school_id: string;
  first_name: string;
  last_name: string;
  roll_number?: string;
  grade?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  class_id?: string;
  parent_email?: string;
  parent_phone?: string;
  risk_level?: 'low' | 'medium' | 'high';
  wellbeing_score?: number;
  consent_status?: 'granted' | 'pending' | 'denied';
  notes?: string;
}

export interface UpdateStudentData {
  first_name?: string;
  last_name?: string;
  roll_number?: string;
  grade?: string;
  class_id?: string;
  parent_email?: string;
  parent_phone?: string;
  risk_level?: 'low' | 'medium' | 'high';
  wellbeing_score?: number;
  consent_status?: 'granted' | 'pending' | 'denied';
  notes?: string;
}

export const studentsApi = {
  getAll: (params?: {
    school_id?: string;
    class_id?: string;
    risk_level?: string;
    skip?: number;
    limit?: number;
  }) => apiClient.get<Student[]>('/students/', params),

  getById: (id: string) => apiClient.get<Student>(`/students/${id}`),

  create: (data: CreateStudentData) => apiClient.post<Student>('/students/', data),

  update: (id: string, data: UpdateStudentData) =>
    apiClient.put<Student>(`/students/${id}`, data),

  delete: (id: string) => apiClient.delete(`/students/${id}`),
};
