import { apiClient } from './api';

// ============ Types ============

// Assessment Analytics Types
export interface AssessmentCompletionMetrics {
  total_expected: number;
  total_completed: number;
  completion_rate: number;
}

export interface AssessmentStatistics {
  min: number;
  max: number;
  mean: number;
  median: number;
  std_dev: number;
  count: number;
  percentiles: {
    "25th": number;
    "50th": number;
    "75th": number;
  };
}

export interface QuestionAnalysis {
  question_id: string;
  question_text: string;
  response_count: number;
  average_score: number;
  min_score: number;
  max_score: number;
}

export interface StudentResult {
  student_id: string;
  student_name: string;
  total_score: number;
  completed_at: string;
}

export interface AssessmentAnalytics {
  assessment_id: string;
  template_name: string;
  category: string;
  title: string;
  class_name: string;
  created_at: string;
  completion_metrics: AssessmentCompletionMetrics;
  overall_statistics: AssessmentStatistics;
  score_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  question_analysis: QuestionAnalysis[];
  student_results: StudentResult[];
}

// Student Assessment Analytics Types
export interface CategoryBreakdown {
  category: string;
  assessment_count: number;
  total_responses: number;
  average_score: number;
}

export interface ScoreTrend {
  date: string;
  assessment: string;
  score: number;
}

export interface ClassComparison {
  class_average: number;
  student_average: number;
  difference: number;
  percentile_rank: number | null;
}

export interface StudentAssessmentItem {
  assessment_id: string;
  template_name: string;
  category: string;
  title: string;
  total_score: number;
  completed_at: string;
}

export interface StudentAssessmentAnalytics {
  student_id: string;
  student_name: string;
  class_id: string;
  total_assessments: number;
  overall_statistics: AssessmentStatistics;
  category_breakdown: CategoryBreakdown[];
  score_trend: ScoreTrend[];
  class_comparison: ClassComparison;
  assessments: StudentAssessmentItem[];
}

// Activity Analytics Types
export interface ActivitySubmissionMetrics {
  total_expected: number;
  total_completed: number;
  completion_rate: number;
  verified_count: number;
  pending_review: number;
}

export interface ActivityStatusDistribution {
  PENDING: number;
  SUBMITTED: number;
  VERIFIED: number;
  REJECTED: number;
}

export interface ClassBreakdown {
  assignment_id: string;
  class_id: string;
  class_name: string;
  assigned_at: string;
  due_date: string;
  total_students: number;
  completed: number;
  completion_rate: number;
}

export interface SubmissionTimeline {
  date: string;
  count: number;
}

export interface ActivityStudentSubmission {
  student_id: string;
  student_name: string;
  class_id: string;
  class_name: string;
  status: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  submitted_at: string | null;
  verified_at: string | null;
  feedback: string | null;
}

export interface ActivityAnalytics {
  activity_id: string;
  title: string;
  type: string;
  description: string;
  duration: number;
  total_assignments: number;
  submission_metrics: ActivitySubmissionMetrics;
  status_distribution: ActivityStatusDistribution;
  class_breakdown: ClassBreakdown[];
  submission_timeline: SubmissionTimeline[];
  student_submissions?: ActivityStudentSubmission[];
}

// Student Activity Analytics Types
export interface StudentActivityMetrics {
  total_assigned: number;
  total_completed: number;
  completion_rate: number;
  verified_count: number;
  rejected_count: number;
  pending_count: number;
}

export interface ActivityTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface WeeklyCompletionTrend {
  week_of: string;
  completed: number;
}

export interface RecentSubmission {
  submission_id: string;
  activity_id: string;
  activity_title: string;
  activity_type: string;
  status: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  submitted_at: string;
  feedback: string;
  due_date: string;
}

export interface StudentActivityAnalytics {
  student_id: string;
  student_name: string;
  class_id: string;
  overall_metrics: StudentActivityMetrics;
  status_distribution: ActivityStatusDistribution;
  activity_type_distribution: ActivityTypeDistribution[];
  weekly_completion_trend: WeeklyCompletionTrend[];
  recent_submissions: RecentSubmission[];
}

// Student Summary Types
export interface StudentSummary {
  student_id: string;
  student_name: string;
  class_id: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  wellbeing_score: number;
  assessments: {
    total_completed: number;
    average_score: number;
    last_assessment: string;
  };
  activities: {
    total_assigned: number;
    total_completed: number;
    completion_rate: number;
    status_breakdown: ActivityStatusDistribution;
  };
}

// Filter Types
export interface StudentAssessmentFilters {
  school_id?: string;
  category?: 'depression' | 'anxiety' | 'behavioral';
  days?: number;
}

export interface StudentActivityFilters {
  class_id?: string;
  status?: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  days?: number;
}

// Assessment Monitoring Types
export interface StudentCompletion {
  student_id: string;
  student_name: string;
  expected_questions: number;
  answered_questions: number;
  missing_questions: string[];
  extra_questions: string[];
  completed_at: string;
  total_score: number;
}

export interface NotStartedStudent {
  student_id: string;
  student_name: string;
}

export interface AssessmentMonitoringSummary {
  expected_students: number;
  completed: number;
  incomplete: number;
  not_started: number;
  unexpected_responses: number;
  completion_rate: number;
}

export interface AssessmentMonitoring {
  assessment_id: string;
  template_name: string;
  title: string;
  class_name: string;
  total_questions: number;
  question_ids: string[];
  summary: AssessmentMonitoringSummary;
  completed_students: StudentCompletion[];
  incomplete_students: StudentCompletion[];
  not_started_students: NotStartedStudent[];
  unexpected_students: StudentCompletion[];
}

// Question Breakdown Types
export interface QuestionResponse {
  student_id: string;
  student_name: string;
  answer: number;
  score: number;
}

export interface QuestionBreakdownItem {
  question_id: string;
  question_text: string;
  question_type: string;
  response_count: number;
  average_score: number;
  min_score: number;
  max_score: number;
  responses: QuestionResponse[];
}

export interface QuestionBreakdown {
  assessment_id: string;
  template_name: string;
  title: string;
  total_questions: number;
  question_breakdown: QuestionBreakdownItem[];
}

// Student Assessment History Types
export interface StudentAssessmentResponse {
  question_id: string;
  question_text: string;
  answer: number;
  score: number;
}

export interface StudentAssessmentHistoryItem {
  assessment_id: string;
  template_name: string;
  category: string;
  title: string;
  total_questions_in_template: number;
  questions_answered: number;
  total_score: number;
  completed_at: string;
  is_complete: boolean;
  responses?: StudentAssessmentResponse[];
}

export interface StudentAssessmentHistory {
  student_id: string;
  student_name: string;
  total_assessments: number;
  complete_assessments: number;
  incomplete_assessments: number;
  assessment_history: StudentAssessmentHistoryItem[];
}

// ============ API Functions ============

export const analyticsApi = {
  // Assessment Analytics
  getAssessmentAnalytics: async (assessmentId: string): Promise<AssessmentAnalytics> => {
    return apiClient.get<AssessmentAnalytics>(`/analytics/assessments/${assessmentId}`);
  },

  getStudentAssessments: async (
    studentId: string,
    filters?: StudentAssessmentFilters
  ): Promise<StudentAssessmentAnalytics> => {
    const params: Record<string, string | number> = {};
    if (filters?.school_id) params.school_id = filters.school_id;
    if (filters?.category) params.category = filters.category;
    if (filters?.days) params.days = filters.days;
    
    return apiClient.get<StudentAssessmentAnalytics>(
      `/analytics/students/${studentId}/assessments`,
      params
    );
  },

  // Activity Analytics
  getActivityAnalytics: async (activityId: string): Promise<ActivityAnalytics> => {
    return apiClient.get<ActivityAnalytics>(`/analytics/activities/${activityId}`);
  },

  getStudentActivities: async (
    studentId: string,
    filters?: StudentActivityFilters
  ): Promise<StudentActivityAnalytics> => {
    const params: Record<string, string | number> = {};
    if (filters?.class_id) params.class_id = filters.class_id;
    if (filters?.status) params.status = filters.status;
    if (filters?.days) params.days = filters.days;
    
    return apiClient.get<StudentActivityAnalytics>(
      `/analytics/students/${studentId}/activities`,
      params
    );
  },

  // Combined Analytics
  getStudentSummary: async (studentId: string): Promise<StudentSummary> => {
    return apiClient.get<StudentSummary>(`/analytics/students/${studentId}/summary`);
  },

  // Assessment Monitoring
  getAssessmentMonitoring: async (assessmentId: string): Promise<AssessmentMonitoring> => {
    return apiClient.get<AssessmentMonitoring>(`/analytics/assessments/${assessmentId}/monitoring`);
  },

  getQuestionBreakdown: async (assessmentId: string): Promise<QuestionBreakdown> => {
    return apiClient.get<QuestionBreakdown>(`/analytics/assessments/${assessmentId}/question-breakdown`);
  },

  getStudentAssessmentHistory: async (
    studentId: string,
    includeResponses = false
  ): Promise<StudentAssessmentHistory> => {
    return apiClient.get<StudentAssessmentHistory>(
      `/analytics/students/${studentId}/assessment-history`,
      { include_responses: includeResponses }
    );
  },
};

export default analyticsApi;
