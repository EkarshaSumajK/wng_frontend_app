import { useQuery } from "@tanstack/react-query";
import {
  counsellorAnalyticsApi,
  ClassFilters,
  StudentFilters,
} from "@/services/counsellorAnalytics";

/**
 * Leadership/Principal Analytics Hooks
 * 
 * These hooks use the same API endpoints as counselor analytics
 * but with different query keys to avoid cache conflicts.
 * 
 * Principals have school-wide access like counselors.
 */

// School Overview
export const useLeadershipOverview = (schoolId?: string, days = 30) => {
  return useQuery({
    queryKey: ["leadership-analytics", "overview", schoolId, days],
    queryFn: () => counsellorAnalyticsApi.getOverview(schoolId!, days),
    enabled: !!schoolId,
  });
};

// Classes
export const useLeadershipClasses = (
  schoolId?: string,
  filters?: ClassFilters
) => {
  return useQuery({
    queryKey: ["leadership-analytics", "classes", schoolId, filters],
    queryFn: () => counsellorAnalyticsApi.getClasses(schoolId!, filters),
    enabled: !!schoolId,
  });
};

export const useLeadershipClass = (classId?: string, days = 30) => {
  return useQuery({
    queryKey: ["leadership-analytics", "class", classId, days],
    queryFn: () => counsellorAnalyticsApi.getClass(classId!, days),
    enabled: !!classId,
  });
};

// Students
export const useLeadershipStudents = (
  schoolId?: string,
  filters?: StudentFilters
) => {
  return useQuery({
    queryKey: ["leadership-analytics", "students", schoolId, filters],
    queryFn: () => counsellorAnalyticsApi.getStudents(schoolId!, filters),
    enabled: !!schoolId,
  });
};

export const useLeadershipStudent = (studentId?: string, days = 30) => {
  return useQuery({
    queryKey: ["leadership-analytics", "student", studentId, days],
    queryFn: () => counsellorAnalyticsApi.getStudent(studentId!, days),
    enabled: !!studentId,
  });
};

export const useLeadershipStudentAssessments = (
  studentId?: string,
  includeResponses = false,
  days?: number
) => {
  return useQuery({
    queryKey: [
      "leadership-analytics",
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

export const useLeadershipStudentActivities = (
  studentId?: string,
  status?: string,
  days?: number
) => {
  return useQuery({
    queryKey: ["leadership-analytics", "student-activities", studentId, status, days],
    queryFn: () =>
      counsellorAnalyticsApi.getStudentActivities(studentId!, status, days),
    enabled: !!studentId,
  });
};

export const useLeadershipStudentWebinars = (
  studentId?: string,
  attended?: boolean,
  days?: number
) => {
  return useQuery({
    queryKey: ["leadership-analytics", "student-webinars", studentId, attended, days],
    queryFn: () =>
      counsellorAnalyticsApi.getStudentWebinars(studentId!, attended, days),
    enabled: !!studentId,
  });
};

export const useLeadershipStudentStreak = (studentId?: string, days = 30) => {
  return useQuery({
    queryKey: ["leadership-analytics", "student-streak", studentId, days],
    queryFn: () => counsellorAnalyticsApi.getStudentStreak(studentId!, days),
    enabled: !!studentId,
  });
};

// ============ School Wide Analytics ============

export const useLeadershipTrends = (schoolId?: string, days = 30, teacherId?: string) => {
  return useQuery({
    queryKey: ["leadership-analytics", "trends", schoolId, days, teacherId],
    queryFn: () => counsellorAnalyticsApi.getTrends(schoolId!, days, teacherId),
    enabled: !!schoolId,
  });
};

export const useLeadershipAssessments = (
  schoolId?: string,
  days = 30,
  classId?: string,
  teacherId?: string
) => {
  return useQuery({
    queryKey: ["leadership-analytics", "school-assessments", schoolId, days, classId, teacherId],
    queryFn: () => counsellorAnalyticsApi.getSchoolAssessments(schoolId!, days, classId, teacherId),
    enabled: !!schoolId,
  });
};

export const useLeadershipActivities = (
  schoolId?: string,
  days = 30,
  classId?: string,
  teacherId?: string
) => {
  return useQuery({
    queryKey: ["leadership-analytics", "school-activities", schoolId, days, classId, teacherId],
    queryFn: () => counsellorAnalyticsApi.getSchoolActivities(schoolId!, days, classId, teacherId),
    enabled: !!schoolId,
  });
};

export const useLeadershipWebinars = (
  schoolId?: string,
  days = 30,
  classId?: string,
  teacherId?: string
) => {
  return useQuery({
    queryKey: ["leadership-analytics", "school-webinars", schoolId, days, classId, teacherId],
    queryFn: () => counsellorAnalyticsApi.getSchoolWebinars(schoolId!, days, classId, teacherId),
    enabled: !!schoolId,
  });
};

export const useLeadershipAssessmentDetails = (
  templateId?: string | null,
  schoolId?: string,
  days = 30
) => {
  return useQuery({
    queryKey: ["leadership-analytics", "assessment-details", templateId, schoolId, days],
    queryFn: () => counsellorAnalyticsApi.getAssessmentDetails(templateId!, schoolId!, days),
    enabled: !!templateId && !!schoolId,
  });
};

export const useLeadershipActivityDetails = (
  activityId?: string | null,
  schoolId?: string,
  days = 30
) => {
  return useQuery({
    queryKey: ["leadership-analytics", "activity-details", activityId, schoolId, days],
    queryFn: () => counsellorAnalyticsApi.getActivityDetails(activityId!, schoolId!, days),
    enabled: !!activityId && !!schoolId,
  });
};

export const useLeadershipWebinarDetails = (
  webinarId?: string | null,
  schoolId?: string
) => {
  return useQuery({
    queryKey: ["leadership-analytics", "webinar-details", webinarId, schoolId],
    queryFn: () => counsellorAnalyticsApi.getWebinarDetails(webinarId!, schoolId!),
    enabled: !!webinarId && !!schoolId,
  });
};


