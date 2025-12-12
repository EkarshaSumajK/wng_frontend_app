import { apiClient } from "./api";

// ============ Enums ============

export type WebinarStatus = "Upcoming" | "Live" | "Recorded" | "Cancelled";
export type RegistrationType = "school" | "class";
export type WatchStatus = "Completed" | "Partial" | "Absent";

// ============ Types ============

export interface WebinarAnalytics {
  total_invited: number;
  total_attended: number;
  attendance_rate: number;
  avg_watch_time: number;
}

export interface WebinarListItem {
  webinar_id: string;
  title: string;
  description: string | null;
  school_id: string | null;
  class_ids: string[] | null;
  target_audience: string | null;
  target_grades: string[] | null;
  speaker_name: string;
  date: string;
  duration_minutes: number;
  category: string | null;
  status: WebinarStatus | null;
  thumbnail_url: string | null;
  analytics: WebinarAnalytics;
}

export interface WebinarListResponse {
  total: number;
  skip: number;
  limit: number;
  webinars: WebinarListItem[];
}

export interface WebinarSpeaker {
  name: string;
  title: string | null;
  bio: string | null;
  image_url: string | null;
}

export interface WebinarSchedule {
  date: string;
  duration_minutes: number;
  status: WebinarStatus | null;
}

export interface WebinarDetailAnalytics {
  total_invited: number;
  total_attended: number;
  total_absent: number;
  attendance_rate: number;
  avg_watch_time: number;
  min_watch_time: number;
  max_watch_time: number;
  completion_rate: number;
}


export interface ClassBreakdownItem {
  class_id: string;
  class_name: string;
  grade: string;
  section: string | null;
  teacher_name: string | null;
  total_students: number;
  invited: number;
  attended: number;
  attendance_rate: number;
  avg_watch_time: number;
  completion_rate: number;
  students: StudentAttendance[];
}

export interface StudentAttendance {
  student_id: string;
  student_name: string;
  attended: boolean;
  watch_duration_minutes: number | null;
  watch_percentage: number;
  status: WatchStatus;
}

export interface ClassBreakdownResponse {
  webinar_id: string;
  title: string;
  total_classes: number;
  class_breakdown: ClassBreakdownItem[];
}

export interface WebinarDetail {
  webinar_id: string;
  title: string;
  description: string | null;
  school_id: string | null;
  class_ids: string[] | null;
  target_audience: string | null;
  target_grades: string[] | null;
  speaker: WebinarSpeaker;
  schedule: WebinarSchedule;
  category: string | null;
  analytics: WebinarDetailAnalytics;
  class_breakdown: ClassBreakdownItem[];
  watch_time_distribution: Record<string, number>;
}

export interface Participant {
  student_id: string;
  student_name: string;
  class_id: string | null;
  class_name: string | null;
  grade: string | null;
  attended: boolean;
  join_time: string | null;
  leave_time: string | null;
  watch_duration_minutes: number | null;
  watch_percentage: number;
  status: WatchStatus;
}

export interface ParticipantsResponse {
  webinar_id: string;
  title: string;
  total_participants: number;
  skip: number;
  limit: number;
  participants: Participant[];
}

// ============ Registration Types ============

export interface RegistrationRequest {
  registration_type: RegistrationType;
  class_ids?: string[];
  grade_ids?: string[];
  notify_students?: boolean;
}

export interface RegistrationResponse {
  registration_id: string;
  webinar_id: string;
  school_id: string;
  registration_type: RegistrationType;
  class_ids: string[];
  grade_ids: string[];
  total_students_invited: number;
  registered_by: string;
  registered_at: string;
  status: "Active" | "Completed" | "Cancelled";
}

export interface WebinarInfo {
  title: string | null;
  speaker_name: string | null;
  date: string | null;
  duration_minutes: number | null;
  status: string | null;
  category: string | null;
  thumbnail_url: string | null;
}

export interface RegistrationItem {
  registration_id: string;
  webinar_id: string;
  webinar: WebinarInfo;
  registration_type: RegistrationType;
  class_ids: string[];
  class_names: string[];
  total_students_invited: number;
  registered_at: string;
  analytics: WebinarAnalytics | null;
}

export interface MyRegistrationsResponse {
  total_registrations: number;
  registrations: RegistrationItem[];
}


// ============ Registered Webinars Analytics Types ============

export interface RegisteredWebinarSummary {
  total_students_invited: number;
  total_attended: number;
  overall_attendance_rate: number;
  avg_watch_time: number;
}

export interface RegisteredWebinarItem {
  webinar_id: string;
  title: string | null;
  speaker_name: string | null;
  date: string | null;
  status: string | null;
  registration_type: RegistrationType;
  classes_registered: string[];
  analytics: WebinarAnalytics;
}

export interface RegisteredWebinarsResponse {
  school_id: string;
  total_registered_webinars: number;
  summary: RegisteredWebinarSummary;
  webinars: RegisteredWebinarItem[];
}

export interface SchoolWebinarSummary {
  school_id: string;
  period_days: number;
  total_webinars: number;
  summary: {
    total_student_invites: number;
    total_attended: number;
    overall_attendance_rate: number;
    avg_watch_time: number;
  };
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  upcoming: number;
  completed: number;
}

// ============ Filter Types ============

export interface WebinarFilters {
  school_id?: string;
  status?: WebinarStatus;
  days?: number;
  skip?: number;
  limit?: number;
}

export interface ParticipantFilters {
  attended?: boolean;
  class_id?: string;
  search?: string;
  skip?: number;
  limit?: number;
}

// ============ API Functions ============

export const webinarAnalyticsApi = {
  // Get webinars with analytics
  getWebinars: async (filters?: WebinarFilters): Promise<WebinarListResponse> => {
    const params: Record<string, string | number> = {};
    if (filters?.school_id) params.school_id = filters.school_id;
    if (filters?.status) params.status = filters.status;
    if (filters?.days) params.days = filters.days;
    if (filters?.skip) params.skip = filters.skip;
    if (filters?.limit) params.limit = filters.limit;

    return apiClient.get("/analytics/webinars", params);
  },

  // Get single webinar analytics
  getWebinar: async (webinarId: string): Promise<WebinarDetail> => {
    return apiClient.get<WebinarDetail>(`/analytics/webinars/${webinarId}`);
  },

  // Get webinar participants
  getParticipants: async (
    webinarId: string,
    filters?: ParticipantFilters
  ): Promise<ParticipantsResponse> => {
    const params: Record<string, string | number | boolean> = {};
    if (filters?.attended !== undefined) params.attended = filters.attended;
    if (filters?.class_id) params.class_id = filters.class_id;
    if (filters?.search) params.search = filters.search;
    if (filters?.skip) params.skip = filters.skip;
    if (filters?.limit) params.limit = filters.limit;

    return apiClient.get<ParticipantsResponse>(
      `/analytics/webinars/${webinarId}/participants`,
      params
    );
  },

  // Register webinar for school
  registerWebinar: async (
    webinarId: string,
    schoolId: string,
    userId: string,
    request: RegistrationRequest
  ): Promise<RegistrationResponse> => {
    const queryParams = new URLSearchParams({
      school_id: schoolId,
      user_id: userId,
    });
    return apiClient.post<RegistrationResponse>(
      `/analytics/webinars/${webinarId}/register?${queryParams.toString()}`,
      request
    );
  },

  // Get my registrations
  getMyRegistrations: async (
    schoolId: string,
    params?: { status?: string; include_analytics?: boolean }
  ): Promise<MyRegistrationsResponse> => {
    const queryParams: Record<string, string | boolean> = { school_id: schoolId };
    if (params?.status) queryParams.status = params.status;
    if (params?.include_analytics) queryParams.include_analytics = true;

    return apiClient.get<MyRegistrationsResponse>("/analytics/webinars/registrations", queryParams);
  },

  // Get registered webinars analytics
  getRegisteredAnalytics: async (
    schoolId: string,
    params?: { status?: string; days?: number }
  ): Promise<RegisteredWebinarsResponse> => {
    const queryParams: Record<string, string | number> = { school_id: schoolId };
    if (params?.status) queryParams.status = params.status;
    if (params?.days) queryParams.days = params.days;

    return apiClient.get<RegisteredWebinarsResponse>("/analytics/webinars/registered", queryParams);
  },

  // Get class breakdown
  getClassBreakdown: async (
    webinarId: string,
    schoolId: string
  ): Promise<ClassBreakdownResponse> => {
    return apiClient.get<ClassBreakdownResponse>(
      `/analytics/webinars/${webinarId}/class-breakdown`,
      { school_id: schoolId }
    );
  },

  // Unregister webinar
  unregisterWebinar: async (
    webinarId: string,
    schoolId: string
  ): Promise<{ webinar_id: string; school_id: string; students_removed: number; unregistered_at: string }> => {
    const queryParams = new URLSearchParams({ school_id: schoolId });
    return apiClient.post(
      `/analytics/webinars/${webinarId}/unregister?${queryParams.toString()}`,
      null
    );
  },

  // Get school webinar summary (legacy - for backward compatibility)
  getSchoolSummary: async (schoolId: string, days = 30): Promise<SchoolWebinarSummary> => {
    return apiClient.get<SchoolWebinarSummary>(
      `/analytics/webinars/school/${schoolId}/summary`,
      { days }
    );
  },
};

export default webinarAnalyticsApi;
