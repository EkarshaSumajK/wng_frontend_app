import { useQuery } from "@tanstack/react-query";
import {
  teacherAnalyticsApi,
  TeacherStudentFilters,
} from "@/services/teacherAnalytics";

// Teacher Overview
export const useTeacherAnalyticsOverview = (teacherId?: string, days = 30) => {
  return useQuery({
    queryKey: ["teacher-analytics", "overview", teacherId, days],
    queryFn: () => teacherAnalyticsApi.getOverview(teacherId!, days),
    enabled: !!teacherId,
  });
};

// Teacher's Classes
export const useTeacherAnalyticsClasses = (
  teacherId?: string,
  filters?: { search?: string; days?: number }
) => {
  return useQuery({
    queryKey: ["teacher-analytics", "classes", teacherId, filters],
    queryFn: () => teacherAnalyticsApi.getClasses(teacherId!, filters),
    enabled: !!teacherId,
  });
};

// Class Details
export const useTeacherAnalyticsClass = (classId?: string, days = 30) => {
  return useQuery({
    queryKey: ["teacher-analytics", "class", classId, days],
    queryFn: () => teacherAnalyticsApi.getClass(classId!, days),
    enabled: !!classId,
  });
};

// Teacher's Students (paginated)
export const useTeacherAnalyticsStudents = (
  teacherId?: string,
  filters?: TeacherStudentFilters
) => {
  return useQuery({
    queryKey: ["teacher-analytics", "students", teacherId, filters],
    queryFn: () => teacherAnalyticsApi.getStudents(teacherId!, filters),
    enabled: !!teacherId,
  });
};

// Student Details (shared counsellor endpoint)
export const useTeacherAnalyticsStudent = (studentId?: string, days = 30) => {
  return useQuery({
    queryKey: ["teacher-analytics", "student", studentId, days],
    queryFn: () => teacherAnalyticsApi.getStudent(studentId!, days),
    enabled: !!studentId,
  });
};

// Student Assessments
export const useTeacherStudentAssessments = (
  studentId?: string,
  includeResponses = false,
  days?: number
) => {
  return useQuery({
    queryKey: [
      "teacher-analytics",
      "student-assessments",
      studentId,
      includeResponses,
      days,
    ],
    queryFn: () =>
      teacherAnalyticsApi.getStudentAssessments(studentId!, includeResponses, days),
    enabled: !!studentId,
  });
};

// Student Activities
export const useTeacherStudentActivities = (
  studentId?: string,
  status?: string,
  days?: number
) => {
  return useQuery({
    queryKey: ["teacher-analytics", "student-activities", studentId, status, days],
    queryFn: () => teacherAnalyticsApi.getStudentActivities(studentId!, status, days),
    enabled: !!studentId,
  });
};

// Student Streak
export const useTeacherStudentStreak = (studentId?: string, days = 30) => {
  return useQuery({
    queryKey: ["teacher-analytics", "student-streak", studentId, days],
    queryFn: () => teacherAnalyticsApi.getStudentStreak(studentId!, days),
    enabled: !!studentId,
  });
};
