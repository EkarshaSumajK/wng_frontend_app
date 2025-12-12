import { useQuery } from "@tanstack/react-query";
import {
  counsellorAnalyticsApi,
  ClassFilters,
  StudentFilters,
} from "@/services/counsellorAnalytics";

// School Overview
export const useCounsellorOverview = (schoolId?: string, days = 30) => {
  return useQuery({
    queryKey: ["counsellor-analytics", "overview", schoolId, days],
    queryFn: () => counsellorAnalyticsApi.getOverview(schoolId!, days),
    enabled: !!schoolId,
  });
};

// Classes
export const useCounsellorClasses = (
  schoolId?: string,
  filters?: ClassFilters
) => {
  return useQuery({
    queryKey: ["counsellor-analytics", "classes", schoolId, filters],
    queryFn: () => counsellorAnalyticsApi.getClasses(schoolId!, filters),
    enabled: !!schoolId,
  });
};

export const useCounsellorClass = (classId?: string, days = 30) => {
  return useQuery({
    queryKey: ["counsellor-analytics", "class", classId, days],
    queryFn: () => counsellorAnalyticsApi.getClass(classId!, days),
    enabled: !!classId,
  });
};

// Students
export const useCounsellorStudents = (
  schoolId?: string,
  filters?: StudentFilters
) => {
  return useQuery({
    queryKey: ["counsellor-analytics", "students", schoolId, filters],
    queryFn: () => counsellorAnalyticsApi.getStudents(schoolId!, filters),
    enabled: !!schoolId,
  });
};

export const useCounsellorStudent = (studentId?: string, days = 30) => {
  return useQuery({
    queryKey: ["counsellor-analytics", "student", studentId, days],
    queryFn: () => counsellorAnalyticsApi.getStudent(studentId!, days),
    enabled: !!studentId,
  });
};

export const useStudentAssessments = (
  studentId?: string,
  includeResponses = false,
  days?: number
) => {
  return useQuery({
    queryKey: [
      "counsellor-analytics",
      "student-assessments",
      studentId,
      includeResponses,
      days,
    ],
    queryFn: () =>
      counsellorAnalyticsApi.getStudentAssessments(
        studentId!,
        includeResponses,
        days
      ),
    enabled: !!studentId,
  });
};

export const useStudentActivities = (
  studentId?: string,
  status?: string,
  days?: number
) => {
  return useQuery({
    queryKey: ["counsellor-analytics", "student-activities", studentId, status, days],
    queryFn: () =>
      counsellorAnalyticsApi.getStudentActivities(studentId!, status, days),
    enabled: !!studentId,
  });
};

export const useStudentWebinars = (
  studentId?: string,
  attended?: boolean,
  days?: number
) => {
  return useQuery({
    queryKey: ["counsellor-analytics", "student-webinars", studentId, attended, days],
    queryFn: () =>
      counsellorAnalyticsApi.getStudentWebinars(studentId!, attended, days),
    enabled: !!studentId,
  });
};

export const useStudentStreak = (studentId?: string, days = 30) => {
  return useQuery({
    queryKey: ["counsellor-analytics", "student-streak", studentId, days],
    queryFn: () => counsellorAnalyticsApi.getStudentStreak(studentId!, days),
    enabled: !!studentId,
  });
};
