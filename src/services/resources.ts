import { apiClient } from './api';

export interface Resource {
  resource_id: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'AUDIO' | 'ARTICLE';
  category?: string;
  tags?: string[];
  target_audience?: string[];
  video_url?: string;
  audio_url?: string;
  article_url?: string;
  thumbnail_url?: string;
  author_id?: string;
  school_id?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  view_count: number;
  posted_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateResourceData {
  title: string;
  description?: string;
  type: 'VIDEO' | 'AUDIO' | 'ARTICLE';
  category?: string;
  tags?: string[];
  target_audience?: string[];
  video_url?: string;
  audio_url?: string;
  article_url?: string;
  thumbnail_url?: string;
  author_id?: string;
  author_name: string;
  school_id?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface UpdateResourceData {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  target_audience?: string[];
  video_url?: string;
  audio_url?: string;
  article_url?: string;
  thumbnail_url?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export const resourcesApi = {
  getAll: (params?: {
    school_id?: string;
    type?: string;
    status?: string;
    category?: string;
    tag?: string;
    target_audience?: string;
    author_id?: string;
    search?: string;
    include_global?: boolean;
    skip?: number;
    limit?: number;
  }) => apiClient.get<Resource[]>('/resources', params),

  getById: (id: string, increment_view?: boolean) =>
    apiClient.get<Resource>(`/resources/${id}`, { increment_view }),

  create: (data: CreateResourceData) =>
    apiClient.post<Resource>('/resources', data),

  update: (id: string, data: UpdateResourceData) =>
    apiClient.patch<Resource>(`/resources/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/resources/${id}`),

  getCategories: (params?: { school_id?: string; include_global?: boolean }) =>
    apiClient.get<Array<{ category: string; count: number }>>('/resources/categories/list', params),

  getTags: (params?: { school_id?: string; include_global?: boolean }) =>
    apiClient.get<Array<{ tag: string; count: number }>>('/resources/tags/list', params),

  getStats: (params?: { school_id?: string; include_global?: boolean }) =>
    apiClient.get<any>('/resources/stats/overview', params),
};
