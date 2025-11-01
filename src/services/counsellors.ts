import { apiClient } from './api';

export interface CounsellorDashboard {
  counsellor_id: string;
  counsellor_name: string;
  caseload: {
    total_cases: number;
    active_cases: number;
    closed_cases: number;
    by_risk_level: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    by_status: {
      intake: number;
      assessment: number;
      intervention: number;
      monitoring: number;
      closed: number;
    };
  };
  assessment_analytics: {
    total_students_assessed: number;
    students_without_assessments: number;
    total_assessments_completed: number;
    recent_assessments_30_days: number;
    average_assessment_score: number;
    by_category: Array<{
      category: string;
      average_score: number;
      total_assessments: number;
      min_score: number;
      max_score: number;
    }>;
    students_at_risk_by_assessment: Array<{
      student_id: string;
      student_name: string;
      average_score: number;
      assessments_completed: number;
      has_active_case: boolean;
      risk_level: string | null;
    }>;
    student_assessment_details: Array<{
      student_id: string;
      student_name: string;
      case_status: string;
      risk_level: string;
      assessments_completed: number;
      total_responses: number;
      average_score: number | null;
      last_assessment_date: string | null;
      has_assessments: boolean;
    }>;
  };
}

export interface CounsellorCaseload {
  counsellor_id: string;
  counsellor_name: string;
  total_cases: number;
  active_cases: number;
  by_risk_level: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  by_status: {
    intake: number;
    assessment: number;
    intervention: number;
    monitoring: number;
    closed: number;
  };
  recent_activity: {
    new_cases_this_week: number;
    closed_cases_this_week: number;
    sessions_this_week: number;
  };
  students: Array<{
    student_id: string;
    student_name: string;
    case_id: string;
    status: string;
    risk_level: string;
    last_session: string | null;
    next_session: string | null;
    days_since_last_contact: number | null;
  }>;
}

export const counsellorsApi = {
  getAll: (params: { school_id: string }) =>
    apiClient.get<any[]>('/counsellors/', params),

  getDashboard: (counsellorId: string) =>
    apiClient.get<CounsellorDashboard>(`/counsellors/${counsellorId}/dashboard`),

  getCaseload: (counsellorId: string) =>
    apiClient.get<CounsellorCaseload>(`/counsellors/${counsellorId}/caseload`),

  getCases: (counsellorId: string) =>
    apiClient.get<any[]>(`/counsellors/${counsellorId}/cases`),
};
