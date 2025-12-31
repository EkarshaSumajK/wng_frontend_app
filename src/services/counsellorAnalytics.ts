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
  id: string;
  class_id: string;
  name: string;
  grade: string;
  section: string | null;
  teacher_id?: string;
  teacher_name: string | null;
  teacherName?: string | null; // For compatibility if mapped
  total_students: number;
  totalStudents?: number; // For compatibility if mapped
  metrics: ClassMetrics;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  at_risk_count: number;
  assessments?: {
    rate: number;
    done: number;
    total: number;
  };
  activities?: {
    rate: number;
    done: number;
    total: number;
  };
  webinars?: {
    rate: number;
    done: number;
    total: number;
  };
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
  // Mapped properties for frontend use
  className?: string; // Mapped from class_name
  classId?: string; // Mapped from class_id
  assessments?: { done: number; total: number; rate: number };
  activities?: { done: number; total: number; rate: number };
  webinars?: { done: number; total: number; rate: number };
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
  teacher_id?: string;
  search?: string;
  grade?: string;
  days?: number;
}

export interface StudentFilters {
  class_id?: string;
  teacher_id?: string;
  search?: string;
  risk_level?: "low" | "medium" | "high";
  days?: number;
  page?: number;
  limit?: number;
}

export interface AssessmentQuestion {
  id: string;
  question_id?: string; // For compatibility
  questionNumber: number;
  question: string;
  type: string;
  points: number;
  category: string;
  options?: string[];
  correctAnswer?: string;
  stats?: {
    totalResponses: number;
    optionCounts: Record<string, number>;
  };
}

export interface AssessmentSubmission {
  studentId: string;
  studentName: string;
  className: string;
  rollNumber: string;
  status: string;
  score?: number;
  maxScore?: number;
  grade?: string;
  timeSpent?: number;
  submittedAt?: string;
}

export interface AssessmentDetailedView {
  id: string;
  type: string;
  title: string;
  description: string;
  createdBy: string;
  dueDate: string;
  totalQuestions: number;
  timeLimit?: number;
  avgScore: number;
  totalStudentsAssigned: number;
  studentsSubmitted: number;
  studentsPending: number;
  studentsOverdue: number;
  passRate: number;
  avgTimeSpent: number;
  scoreDistribution: { range: string; count: number }[];
  classWiseStats: { className: string; submitted: number; total: number; avgScore: number }[];
  submissions: AssessmentSubmission[];
  questions?: AssessmentQuestion[];
}

export interface ActivityTask {
  id: string;
  title: string;
  description: string;
  type: string;
  required: boolean;
}

export interface ActivityCompletion {
  studentId: string;
  studentName: string;
  className: string;
  rollNumber: string;
  status: string;
  completedAt?: string;
  feedback?: string;
  rating?: number;
}

export interface ActivityDetailedView {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdBy: string;
  dueDate: string;
  estimatedTime: number;
  completionRate: number;
  totalStudentsAssigned: number;
  studentsCompleted: number;
  studentsInProgress: number;
  studentsNotStarted: number;
  avgTimeSpent: number;
  avgRating: number;
  completions: ActivityCompletion[];
  tasks?: ActivityTask[];
  classWiseStats: { className: string; completed: number; total: number; avgTime: number }[];
}

export interface WebinarAttendance {
  studentId: string;
  studentName: string;
  className: string;
  classId?: string | null;
  rollNumber: string;
  status: "attended" | "absent";
  attended: boolean;
  joinTime?: string | null;
  leaveTime?: string | null;
  duration?: number | null;
  watchPercentage: number;
  rating?: number | null;
}

export interface WebinarDetailedView {
  id: string;
  title: string;
  topic: string;
  description: string;
  presenter: string;
  presenterRole: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalStudentsInvited: number;
  studentsAttended: number;
  studentsAbsent: number;
  avgWatchPercentage: number;
  avgRating: number;
  attendance: WebinarAttendance[];
  classWiseStats: { className: string; attended: number; total: number; avgWatchTime: number }[];
}


export interface LeaderboardEntry {
  id: string;
  name: string;
  className: string;
  score: number;
  scoreLabel: string;
  secondaryScore?: number;
  secondaryLabel?: string;
  riskLevel?: "low" | "medium" | "high";
  avatar?: string;
}

export interface StudentAssessmentResponse {
  questionId: string;
  questionText: string;
  questionType: string;
  maxPoints: number;
  options?: string[];
  studentAnswer: any;
  score: number;
}

export interface StudentAssessmentResponses {
  student: {
    id: string;
    name: string;
    className: string;
  };
  assessment: {
    id: string;
    title: string;
    description: string;
  };
  status: string;
  totalScore?: number;
  maxScore?: number;
  completedAt?: string;
  responses: StudentAssessmentResponse[];
}

export interface StudentProfileDetails {
  id: string;
  name: string;
  class: string;
  section?: string;
  rollNumber: string;
  rank?: string;
  totalStudents?: number;
  avatar?: string;
  email?: string;
  phone?: string;
  dob?: string;
  joined?: string;
  parentName?: string;
  parentContact?: string;
  stats: {
    engagementScore: number;
    attendanceRate: number;
    assessmentsCompleted: number;
    activitiesCompleted: number;
    activitiesCount?: number;
    webinarsAttended: number;
    dayStreak: number;
    timeSpent: string;
    avgScore: number;
  };
  performanceTrend?: {
    month: string;
    assessments: number;
    activities: number;
    webinars: number;
  }[];
  strengths?: { skill: string; score: number }[];
  improvements?: { skill: string; score: number }[];
  notes?: { author: string; role: string; date: string; text: string }[];
  alerts: {
    id: string;
    type: string;
    severity: string;
    date: string;
    message: string;
  }[];
  assessments: {
    id: string;
    title: string;
    submittedAt?: string;
    totalScore: number;
    classAverage?: number;
    status: string;
  }[];
  activities: {
    id: string;
    title: string;
    type?: string;
    submittedAt?: string;
    completedAt?: string;
    status: string;
    feedback?: string;
    fileUrl?: string;
  }[];
  webinars: {
    id: string;
    title: string;
    date: string;
    status: string;
    duration: number;
  }[];
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
    if (filters?.teacher_id) params.teacher_id = filters.teacher_id;
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
    if (filters?.teacher_id) params.teacher_id = filters.teacher_id;
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

  // ============ School Wide Analytics (New) ============

  getTrends: async (
    schoolId: string,
    days = 30,
    teacherId?: string
  ): Promise<{ trends: any[] }> => {
    const params: Record<string, string | number> = { school_id: schoolId, days };
    if (teacherId) params.teacher_id = teacherId;
    return apiClient.get<{ trends: any[] }>("/analytics/counsellor/trends", params);
  },

  getSchoolAssessments: async (
    schoolId: string,
    days = 30,
    classId?: string,
    teacherId?: string
  ): Promise<{ assessments: any[] }> => {
    const params: Record<string, string | number> = { school_id: schoolId, days };
    if (classId) params.class_id = classId;
    if (teacherId) params.teacher_id = teacherId;
    return apiClient.get<{ assessments: any[] }>("/analytics/counsellor/assessments", params);
  },

  getSchoolActivities: async (
    schoolId: string,
    days = 30,
    classId?: string,
    teacherId?: string
  ): Promise<{ activities: any[] }> => {
    const params: Record<string, string | number> = { school_id: schoolId, days };
    if (classId) params.class_id = classId;
    if (teacherId) params.teacher_id = teacherId;
    return apiClient.get<{ activities: any[] }>("/analytics/counsellor/activities", params);
  },

  getSchoolWebinars: async (
    schoolId: string,
    days = 30,
    classId?: string,
    teacherId?: string
  ): Promise<{ webinars: any[] }> => {
    const params: Record<string, string | number> = { school_id: schoolId, days };
    if (classId) params.class_id = classId;
    if (teacherId) params.teacher_id = teacherId;
    return apiClient.get<{ webinars: any[] }>("/analytics/counsellor/webinars", params);
  },

  getAssessmentDetails: async (
    templateId: string,
    schoolId: string,
    days = 30
  ): Promise<AssessmentDetailedView> => {
    return apiClient.get<AssessmentDetailedView>(`/analytics/counsellor/assessments/${templateId}`, {
      school_id: schoolId,
      days,
    });
  },

  getActivityDetails: async (
    activityId: string,
    schoolId: string,
    days = 30
  ): Promise<ActivityDetailedView> => {
    return apiClient.get<ActivityDetailedView>(`/analytics/counsellor/activities/${activityId}`, {
      school_id: schoolId,
      days,
    });
  },

  getWebinarDetails: async (
    webinarId: string,
    schoolId: string
  ): Promise<WebinarDetailedView> => {
    return apiClient.get<WebinarDetailedView>(`/analytics/counsellor/webinars/${webinarId}`, {
      school_id: schoolId,
    });
  },

  getLeaderboard: async (
    schoolId: string,
    type: string,
    days = 30,
    page = 1,
    limit = 10
  ): Promise<{ students: LeaderboardEntry[]; total: number }> => {
    return apiClient.get<{ students: LeaderboardEntry[]; total: number }>("/analytics/counsellor/leaderboard", {
      school_id: schoolId,
      type,
      days,
      page,
      limit
    });
  },

  getStudentAssessmentResponses: async (
    templateId: string,
    studentId: string,
    schoolId: string
  ): Promise<StudentAssessmentResponses> => {
    return apiClient.get<StudentAssessmentResponses>(`/analytics/counsellor/assessments/${templateId}/students/${studentId}/responses`, {
      school_id: schoolId,
    });
  },

  getStudentProfile: async (
    studentId: string,
    schoolId: string
  ): Promise<StudentProfileDetails> => {
    return apiClient.get<StudentProfileDetails>(`/analytics/counsellor/students/${studentId}`, {
      school_id: schoolId,
    });
  },

};

export default counsellorAnalyticsApi;
