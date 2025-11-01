import { apiClient } from './api';
import type { Assessment, AssessmentResponse } from '@/types';

export interface CreateAssessmentData {
  template_id?: string;
  school_id: string;
  class_id?: string;
  title?: string;
  description?: string;
  category?: string;
  questions?: any[];
  notes?: string;
  created_by?: string;
}

export interface UpdateAssessmentData {
  title?: string;
  notes?: string;
}

export interface AssessmentTemplate {
  template_id: string;
  name: string;
  description?: string;
  category?: string;
  questions: any[];
  is_active: boolean;
}

export interface SubmitAssessmentData {
  assessment_id: string;
  student_id: string;
  responses: Array<{
    question_id: string;
    answer: any;
  }>;
}

export const assessmentsApi = {
  getAll: (params?: {
    school_id?: string;
    class_id?: string;
    skip?: number;
    limit?: number;
  }) => apiClient.get<Assessment[]>('/assessments', params),

  getById: (id: string) => apiClient.get<Assessment>(`/assessments/${id}`),

  getByStudentId: (studentId: string) =>
    apiClient.get<any>(`/assessments/results/student/${studentId}`),

  create: (data: CreateAssessmentData) =>
    apiClient.post<Assessment>('/assessments', data),

  update: (id: string, data: UpdateAssessmentData) =>
    apiClient.put<Assessment>(`/assessments/${id}`, data),

  delete: (id: string) => apiClient.delete(`/assessments/${id}`),

  excludeStudent: (assessmentId: string, studentId: string) =>
    apiClient.patch<any>(`/assessments/${assessmentId}/exclude-student/${studentId}`, {}),

  includeStudent: (assessmentId: string, studentId: string) =>
    apiClient.patch<any>(`/assessments/${assessmentId}/include-student/${studentId}`, {}),

  submit: (data: SubmitAssessmentData) =>
    apiClient.post<any>('/assessments/submit', data),

  getResponses: (assessmentId: string) =>
    apiClient.get<AssessmentResponse[]>(`/assessments/${assessmentId}/responses`),

  // Template endpoints
  getTemplates: (params?: {
    category?: string;
    is_active?: boolean;
    skip?: number;
    limit?: number;
  }) => apiClient.get<AssessmentTemplate[]>('/assessments/templates', params),

  getTemplateById: (id: string) =>
    apiClient.get<AssessmentTemplate>(`/assessments/templates/${id}`),

  createTemplate: (data: any) =>
    apiClient.post<AssessmentTemplate>('/assessments/templates', data),
};
