import { useQuery } from '@tanstack/react-query';
import {
  analyticsApi,
  StudentAssessmentFilters,
  StudentActivityFilters,
} from '@/services/analytics';

// Assessment Analytics Hooks
export const useAssessmentAnalytics = (assessmentId?: string) => {
  return useQuery({
    queryKey: ['analytics', 'assessments', assessmentId],
    queryFn: () => analyticsApi.getAssessmentAnalytics(assessmentId!),
    enabled: !!assessmentId,
  });
};

export const useStudentAssessmentAnalytics = (
  studentId?: string,
  filters?: StudentAssessmentFilters
) => {
  return useQuery({
    queryKey: ['analytics', 'students', studentId, 'assessments', filters],
    queryFn: () => analyticsApi.getStudentAssessments(studentId!, filters),
    enabled: !!studentId,
  });
};

// Activity Analytics Hooks
export const useActivityAnalytics = (activityId?: string) => {
  return useQuery({
    queryKey: ['analytics', 'activities', activityId],
    queryFn: () => analyticsApi.getActivityAnalytics(activityId!),
    enabled: !!activityId,
  });
};

export const useStudentActivityAnalytics = (
  studentId?: string,
  filters?: StudentActivityFilters
) => {
  return useQuery({
    queryKey: ['analytics', 'students', studentId, 'activities', filters],
    queryFn: () => analyticsApi.getStudentActivities(studentId!, filters),
    enabled: !!studentId,
  });
};

// Combined Analytics Hook
export const useStudentSummary = (studentId?: string) => {
  return useQuery({
    queryKey: ['analytics', 'students', studentId, 'summary'],
    queryFn: () => analyticsApi.getStudentSummary(studentId!),
    enabled: !!studentId,
  });
};

// Assessment Monitoring Hooks
export const useAssessmentMonitoring = (assessmentId?: string) => {
  return useQuery({
    queryKey: ['analytics', 'assessments', assessmentId, 'monitoring'],
    queryFn: () => analyticsApi.getAssessmentMonitoring(assessmentId!),
    enabled: !!assessmentId,
  });
};

export const useQuestionBreakdown = (assessmentId?: string) => {
  return useQuery({
    queryKey: ['analytics', 'assessments', assessmentId, 'question-breakdown'],
    queryFn: () => analyticsApi.getQuestionBreakdown(assessmentId!),
    enabled: !!assessmentId,
  });
};

export const useStudentAssessmentHistory = (
  studentId?: string,
  includeResponses = false
) => {
  return useQuery({
    queryKey: ['analytics', 'students', studentId, 'assessment-history', includeResponses],
    queryFn: () => analyticsApi.getStudentAssessmentHistory(studentId!, includeResponses),
    enabled: !!studentId,
  });
};
