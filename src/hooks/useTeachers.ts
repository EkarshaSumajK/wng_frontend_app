import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '@/services/teachers';

export const useTeacherDashboard = (teacherId?: string) => {
  return useQuery({
    queryKey: ['teachers', teacherId, 'dashboard'],
    queryFn: () => teachersApi.getDashboard(teacherId!),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTeacherClassesInsights = (teacherId?: string) => {
  return useQuery({
    queryKey: ['teachers', teacherId, 'classes-insights'],
    queryFn: () => teachersApi.getAllClassesInsights(teacherId!),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTeacherClassInsight = (teacherId?: string, classId?: string) => {
  return useQuery({
    queryKey: ['teachers', teacherId, 'class', classId, 'insights'],
    queryFn: () => teachersApi.getClassInsight(teacherId!, classId!),
    enabled: !!teacherId && !!classId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTeacherClasses = (teacherId?: string) => {
  return useQuery({
    queryKey: ['teachers', teacherId, 'classes'],
    queryFn: () => teachersApi.getClasses(teacherId!),
    enabled: !!teacherId,
  });
};

export const useTeacherStudents = (teacherId?: string) => {
  return useQuery({
    queryKey: ['teachers', teacherId, 'students'],
    queryFn: () => teachersApi.getStudents(teacherId!),
    enabled: !!teacherId,
  });
};
