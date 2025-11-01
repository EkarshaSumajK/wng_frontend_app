import { apiClient } from './api';

export interface School {
  school_id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  principal_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSchoolData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  principal_name?: string;
}

export interface UpdateSchoolData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  principal_name?: string;
}

export const schoolsApi = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    apiClient.get<School[]>('/schools', params),

  getById: (id: string) => apiClient.get<School>(`/schools/${id}`),

  create: (data: CreateSchoolData) => apiClient.post<School>('/schools', data),

  update: (id: string, data: UpdateSchoolData) =>
    apiClient.patch<School>(`/schools/${id}`, data),
};
