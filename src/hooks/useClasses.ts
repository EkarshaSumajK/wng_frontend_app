import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

interface Class {
  class_id: string;
  name: string;
  grade?: string;
  section?: string;
  school_id: string;
  teacher_id?: string;
}

export const useClasses = (params?: { school_id?: string }) => {
  return useQuery({
    queryKey: ['classes', params],
    queryFn: () => apiClient.get<Class[]>('/classes/', params),
    enabled: !!params?.school_id,
  });
};

export const useClass = (id: string) => {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: () => apiClient.get<Class>(`/classes/${id}`),
    enabled: !!id,
  });
};
