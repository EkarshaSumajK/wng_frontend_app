import { apiClient } from './api';

export interface TeacherDashboardData {
  teacher_id: string;
  teacher_name: string;
  overview: {
    total_classes: number;
    total_students: number;
    active_cases: number;
    overall_wellbeing_percentage: number;
  };
  student_wellbeing: {
    students_at_risk: number;
    critical: number;
    high_risk: number;
    medium_risk: number;
    healthy: number;
  };
  assessment_analytics: {
    total_assessments_completed: number;
    recent_assessments_30_days: number;
    students_assessed: number;
    students_not_assessed: number;
    assessment_completion_rate: number;
    average_assessment_score: number;
    by_category: Array<{
      category: string;
      average_score: number;
      total_assessments: number;
      min_score: number;
      max_score: number;
    }>;
    recent_assessments: Array<{
      assessment_id: string;
      title: string;
      template_name: string;
      category: string;
      students_completed: number;
      average_score: number;
      created_at: string;
    }>;
    students_with_assessments: Array<{
      student_id: string;
      student_name: string;
      class_id: string | null;
      assessments_completed: number;
      total_responses: number;
      average_score: number;
      last_assessment_date: string | null;
      has_active_case: boolean;
      risk_level: string | null;
    }>;
    students_without_assessments: Array<{
      student_id: string;
      student_name: string;
      class_id: string | null;
    }>;
  };
  recent_activity_30_days: {
    observations: number;
    assessments_completed: number;
  };
}

export interface ClassInsight {
  class_id: string;
  class_name: string;
  grade: string;
  section: string;
  total_students: number;
  performance_metrics: {
    average_assessment_score: number;
    completed_assessments: number;
    total_responses: number;
    assessments_per_student: number;
  };
  wellbeing_metrics: {
    active_cases: number;
    recent_observations: number;
    observation_severity: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  students: Array<{
    student_id: string;
    name: string;
    gender: string | null;
    wellbeing_status: string;
    recent_assessment_score: number | null;
    has_active_case: boolean;
  }>;
}

export interface AllClassesInsights {
  teacher_id: string;
  teacher_name: string;
  total_classes: number;
  classes: ClassInsight[];
}

export const teachersApi = {
  getDashboard: (teacherId: string) =>
    apiClient.get<TeacherDashboardData>(`/teachers/${teacherId}/dashboard`),

  getAllClassesInsights: (teacherId: string) =>
    apiClient.get<AllClassesInsights>(`/teachers/${teacherId}/classes-insights`),

  getClassInsight: (teacherId: string, classId: string) =>
    apiClient.get<ClassInsight>(`/teachers/${teacherId}/class/${classId}/insights`),

  getClasses: (teacherId: string) =>
    apiClient.get<Array<{
      class_id: string;
      name: string;
      grade: string;
      section: string;
      capacity: number;
      academic_year: string;
    }>>(`/teachers/${teacherId}/classes`),

  getStudents: (teacherId: string) =>
    apiClient.get<Array<{
      student_id: string;
      first_name: string;
      last_name: string;
      class_name: string;
      class_id: string;
      gender: string | null;
    }>>(`/teachers/${teacherId}/students`),
};
