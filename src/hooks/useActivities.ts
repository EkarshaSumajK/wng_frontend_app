import { useQuery } from '@tanstack/react-query';
import { activitiesApi, GetActivitiesParams } from '@/services/activities';

export const useActivities = (params?: GetActivitiesParams) => {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => activitiesApi.getAll(params),
  });
};

export const useActivity = (id: string, includeFlashcards: boolean = false) => {
  return useQuery({
    queryKey: ['activities', id, { includeFlashcards }],
    queryFn: () => activitiesApi.getById(id, includeFlashcards),
    enabled: !!id,
  });
};

export const useActivityWithFlashcards = (id: string) => {
  return useQuery({
    queryKey: ['activities', id, 'flashcards'],
    queryFn: () => activitiesApi.getById(id, true),
    enabled: !!id,
  });
};


