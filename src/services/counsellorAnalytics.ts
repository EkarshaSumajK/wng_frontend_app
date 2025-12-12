import { apiClient } from "./api";

// ============ Types ============

export interface SchoolOverview {
  school_id: string;
  school_name: string;
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
  summary: {
    total_students: number;
    total_classes: number;
    avg_wellbeing_score: number | null;
    avg_activity_completion: number;
    avg_daily_streak: number;
    total_app_openings: number;
  };
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  engagement: {
    total_app_openings: number;
    total_assessments_completed: number;
    total_activities_completed: number;
  };
  top_performers: StudentSummary[];
  at_risk_students: AtRiskStudent[];
}

export interface StudentSummary {
  student_id: string;
  student_name: string;
  class_name: string;
  daily_streak: number;
  wellbeing_score: number;
}

export interface AtRiskStudent {
  student_id: string;
  student_name: string;
  class_name: string;
  wellbeing_score: number;
  risk_level: "low" | "medium" | "high";
  last_active: string | null;
}

export interface ClassMetrics {
  avg_wellbeing: number;
  assessment_completion: number;
  activity_completion: number;
  avg_daily_streak: number;
  avg_app_openings?: number;
  avg_session_time?: number;
}

export interface ClassAnalytics {
  class_id: string;
  name: string;
  grade: string;
  section: string | null;
  teacher_id?: string;
  teacher_name: string | null;
  total_students: number;
  metrics: ClassMetrics;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  at_risk_count: number;
}

export interface ClassDetailedAnalytics extends ClassAnalytics {
  teacher: {
    id: string;
    name: string;
    email: string;
  } | null;
  students: StudentListItem[];
}

export interface StudentListItem {
  student_id: string;
  name: string;
  email?: string;
  class_id: string;
  class_name: string | null;
  wellbeing_score: number | null;
  risk_level: "low" | "medium" | "high";
  daily_streak: number;
  max_streak: number;
  last_active: string | null;
  assessments_completed: number;
  assessments_total?: number;
  activities_completed: number;
  activities_total?: number;
  webinars_attended?: number;
  webinars_total?: number;
  app_openings?: number;
  avg_session_time?: number;
}

export interface DailyStreak {
  date: string;
  day: string;
  day_of_week?: string;
  app_opened: boolean;
  app_open_time?: string;
  activity_completed: boolean;
  activities_count?: number;
  session_duration_minutes?: number;
  streak_maintained?: boolean;
}

export interface StudentDetailed {
  student_id: string;
  name: string;
  email?: string;
  class: {
    id: string;
    name: string;
    grade: string;
    section?: string;
  } | null;
  profile?: {
    date_of_birth?: string;
    gender?: string;
    parent_contact?: string;
  };
  current_metrics: {
    wellbeing_score: number | null;
    risk_level: string;
    daily_streak: number;
    max_streak: number;
    last_active?: string;
  };
  engagement: {
    total_app_openings: number;
    avg_session_time?: number;
    total_time_spent?: number;
    assessments_completed: number;
    assessments_total: number;
    activities_completed: number;
    activities_total: number;
    webinars_attended?: number;
    webinars_total?: number;
  };
  streak_history: {
    current_streak: number;
    max_streak: number;
    weekly_data: DailyStreak[];
  };
  wellbeing_trend: Array<{
    date: string;
    week?: string;
    score: number;
  }>;
}

export interface AssessmentResponse {
  question_id: string;
  question_text: string;
  answer_value: number;
  answer_text?: string;
  score: number;
}

export interface StudentAssessment {
  assessment_id: string;
  template_id: string;
  template_name: string;
  category: string;
  completed_at: string;
  total_score: number;
  max_score: number;
  total_questions: number;
  questions_answered: number;
  risk_level?: string;
  responses?: AssessmentResponse[];
}

export interface StudentAssessmentHistory {
  student_id: string;
  student_name: string;
  total_assessments: number;
  assessments: StudentAssessment[];
}

export interface StudentActivity {
  submission_id: string;
  activity_id: string;
  activity_title: string;
  activity_type: string;
  assigned_at: string;
  due_date: string;
  submitted_at: string | null;
  status: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED";
  feedback: string | null;
  file_url?: string | null;
  student_response?: {
    text?: string;
    media_url?: string;
  };
}

export interface StudentActivityHistory {
  student_id: string;
  student_name: string;
  total_activities: number;
  status_breakdown: {
    pending: number;
    submitted: number;
    verified: number;
    rejected: number;
  };
  activities: StudentActivity[];
}

export interface StudentWebinar {
  webinar_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  host?: { name: string };
  attended: boolean;
  join_time?: string;
  leave_time?: string;
  watch_duration_minutes?: number;
  recording_url?: string;
}

export interface StudentWebinarHistory {
  student_id: string;
  student_name: string;
  total_webinars: number;
  attended_count: number;
  missed_count: number;
  attendance_rate: number;
  webinars: StudentWebinar[];
}

export interface StudentStreakData {
  student_id: string;
  student_name: string;
  current_streak: number;
  max_streak: number;
  total_active_days: number;
  streak_start_date: string | null;
  daily_history: DailyStreak[];
  weekly_summary?: Array<{
    week_start: string;
    week_end: string;
    days_active: number;
    activities_completed: number;
    avg_session_time: number;
  }>;
}

// ============ Filter Types ============

export interface ClassFilters {
  search?: string;
  grade?: string;
  days?: number;
}

export interface StudentFilters {
  class_id?: string;
  search?: string;
  risk_level?: "low" | "medium" | "high";
  days?: number;
  page?: number;
  limit?: number;
}

// ============ API Functions ============

export const counsellorAnalyticsApi = {
  // School Overview
  getOverview: async (schoolId: string, days = 30): Promise<SchoolOverview> => {
    return apiClient.get<SchoolOverview>("/analytics/counsellor/overview", {
      school_id: schoolId,
      days,
    });
  },

  // Classes
  getClasses: async (
    schoolId: string,
    filters?: ClassFilters
  ): Promise<{ total_classes: number; classes: ClassAnalytics[] }> => {
    const params: Record<string, string | number> = { school_id: schoolId };
    if (filters?.search) params.search = filters.search;
    if (filters?.grade) params.grade = filters.grade;
    if (filters?.days) params.days = filters.days;

    return apiClient.get("/analytics/counsellor/classes", params);
  },

  getClass: async (
    classId: string,
    days = 30
  ): Promise<ClassDetailedAnalytics> => {
    return apiClient.get<ClassDetailedAnalytics>(
      `/analytics/counsellor/classes/${classId}`,
      { days }
    );
  },

  // Students
  getStudents: async (
    schoolId: string,
    filters?: StudentFilters
  ): Promise<{
    total_students: number;
    page: number;
    limit: number;
    total_pages: number;
    students: StudentListItem[];
  }> => {
    const params: Record<string, string | number> = { school_id: schoolId };
    if (filters?.class_id) params.class_id = filters.class_id;
    if (filters?.search) params.search = filters.search;
    if (filters?.risk_level) params.risk_level = filters.risk_level;
    if (filters?.days) params.days = filters.days;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    return apiClient.get("/analytics/counsellor/students", params);
  },

  getStudent: async (studentId: string, days = 30): Promise<StudentDetailed> => {
    return apiClient.get<StudentDetailed>(
      `/analytics/counsellor/students/${studentId}`,
      { days }
    );
  },

  getStudentAssessments: async (
    studentId: string,
    includeResponses = false,
    days?: number
  ): Promise<StudentAssessmentHistory> => {
    const params: Record<string, string | number | boolean> = {
      include_responses: includeResponses,
    };
    if (days) params.days = days;

    return apiClient.get<StudentAssessmentHistory>(
      `/analytics/counsellor/students/${studentId}/assessments`,
      params
    );
  },

  getStudentActivities: async (
    studentId: string,
    status?: string,
    days?: number
  ): Promise<StudentActivityHistory> => {
    const params: Record<string, string | number> = {};
    if (status) params.status = status;
    if (days) params.days = days;

    return apiClient.get<StudentActivityHistory>(
      `/analytics/counsellor/students/${studentId}/activities`,
      params
    );
  },

  getStudentWebinars: async (
    studentId: string,
    attended?: boolean,
    days?: number
  ): Promise<StudentWebinarHistory> => {
    const params: Record<string, string | number | boolean> = {};
    if (attended !== undefined) params.attended = attended;
    if (days) params.days = days;

    return apiClient.get<StudentWebinarHistory>(
      `/analytics/counsellor/students/${studentId}/webinars`,
      params
    );
  },

  getStudentStreak: async (
    studentId: string,
    days = 30
  ): Promise<StudentStreakData> => {
    return apiClient.get<StudentStreakData>(
      `/analytics/counsellor/students/${studentId}/streak`,
      { days }
    );
  },
};

export default counsellorAnalyticsApi;
