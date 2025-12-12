import { apiClient } from "./api";

// ============ Types ============

// Period info
export interface Period {
  start_date: string;
  end_date: string;
  days: number;
}

// Summary metrics
export interface TeacherSummary {
  total_students: number;
  total_classes: number;
  avg_wellbeing_score: number | null;
  avg_activity_completion: number;
  avg_daily_streak: number;
  total_app_openings: number;
}

// Risk distribution
export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

// Engagement metrics
export interface Engagement {
  total_app_openings: number;
  total_assessments_completed: number;
  total_activities_completed: number;
}

// Top performer
export interface TopPerformer {
  student_id: string;
  student_name: string;
  class_name: string | null;
  daily_streak: number;
  wellbeing_score: number | null;
}

// At-risk student
export interface AtRiskStudent {
  student_id: string;
  student_name: string;
  class_name: string | null;
  wellbeing_score: number | null;
  risk_level: "low" | "medium" | "high";
  last_active: string | null;
}

// Teacher Overview Response
export interface TeacherOverview {
  teacher_id: string;
  teacher_name: string;
  period: Period;
  summary: TeacherSummary;
  risk_distribution: RiskDistribution;
  engagement: Engagement;
  top_performers: TopPerformer[];
  at_risk_students: AtRiskStudent[];
}

// Class metrics
export interface ClassMetrics {
  avg_wellbeing: number | null;
  assessment_completion: number;
  activity_completion: number;
  avg_daily_streak: number;
}

// Class item
export interface TeacherClass {
  class_id: string;
  name: string;
  grade: string;
  section: string | null;
  total_students: number;
  metrics: ClassMetrics;
  risk_distribution: RiskDistribution;
  at_risk_count: number;
}

// Classes Response
export interface TeacherClassesResponse {
  total_classes: number;
  classes: TeacherClass[];
}

// Student item
export interface StudentItem {
  student_id: string;
  name: string;
  class_id?: string;
  class_name?: string;
  wellbeing_score: number | null;
  risk_level: "low" | "medium" | "high";
  daily_streak: number;
  max_streak: number;
  last_active: string | null;
  assessments_completed: number;
  activities_completed: number;
}

// Class Details Response
export interface TeacherClassDetailed {
  class_id: string;
  name: string;
  grade: string;
  section: string | null;
  total_students: number;
  metrics: ClassMetrics;
  risk_distribution: RiskDistribution;
  at_risk_count: number;
  students: StudentItem[];
}

// Students Response (paginated)
export interface TeacherStudentsResponse {
  total_students: number;
  page: number;
  limit: number;
  total_pages: number;
  students: StudentItem[];
}

// ============ Filter Types ============

export interface TeacherStudentFilters {
  class_id?: string;
  search?: string;
  risk_level?: "low" | "medium" | "high";
  days?: number;
  page?: number;
  limit?: number;
}

// ============ API Functions ============
// Note: apiClient.handleResponse already extracts .data from wrapped responses

export const teacherAnalyticsApi = {
  // Get overview for teacher's classes
  getOverview: async (teacherId: string, days = 30): Promise<TeacherOverview> => {
    return apiClient.get<TeacherOverview>("/analytics/teacher/overview", {
      teacher_id: teacherId,
      days,
    });
  },

  // Get teacher's classes with analytics
  getClasses: async (
    teacherId: string,
    filters?: { search?: string; days?: number }
  ): Promise<TeacherClassesResponse> => {
    const params: Record<string, string | number> = { teacher_id: teacherId };
    if (filters?.search) params.search = filters.search;
    if (filters?.days) params.days = filters.days;

    return apiClient.get<TeacherClassesResponse>("/analytics/teacher/classes", params);
  },

  // Get detailed class analytics
  getClass: async (classId: string, days = 30): Promise<TeacherClassDetailed> => {
    return apiClient.get<TeacherClassDetailed>(
      `/analytics/teacher/classes/${classId}`,
      { days }
    );
  },

  // Get students from teacher's classes
  getStudents: async (
    teacherId: string,
    filters?: TeacherStudentFilters
  ): Promise<TeacherStudentsResponse> => {
    const params: Record<string, string | number> = { teacher_id: teacherId };
    if (filters?.class_id) params.class_id = filters.class_id;
    if (filters?.search) params.search = filters.search;
    if (filters?.risk_level) params.risk_level = filters.risk_level;
    if (filters?.days) params.days = filters.days;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    return apiClient.get<TeacherStudentsResponse>("/analytics/teacher/students", params);
  },

  // Get detailed student info (shared counsellor endpoint)
  getStudent: async (studentId: string, days = 30) => {
    return apiClient.get(`/analytics/counsellor/students/${studentId}`, { days });
  },

  // Get student assessments (shared counsellor endpoint)
  getStudentAssessments: async (
    studentId: string,
    includeResponses = false,
    days?: number
  ) => {
    const params: Record<string, string | number | boolean> = {
      include_responses: includeResponses,
    };
    if (days) params.days = days;
    return apiClient.get(
      `/analytics/counsellor/students/${studentId}/assessments`,
      params
    );
  },

  // Get student activities (shared counsellor endpoint)
  getStudentActivities: async (
    studentId: string,
    status?: string,
    days?: number
  ) => {
    const params: Record<string, string | number> = {};
    if (status) params.status = status;
    if (days) params.days = days;
    return apiClient.get(
      `/analytics/counsellor/students/${studentId}/activities`,
      params
    );
  },

  // Get student streak (shared counsellor endpoint)
  getStudentStreak: async (studentId: string, days = 30) => {
    return apiClient.get(
      `/analytics/counsellor/students/${studentId}/streak`,
      { days }
    );
  },
};

export default teacherAnalyticsApi;
