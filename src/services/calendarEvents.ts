import { apiClient } from './api';

export interface CreateCalendarEventData {
  school_id?: string;
  title: string;
  description?: string;
  type: 'SESSION' | 'ASSESSMENT' | 'MEETING' | 'ACTIVITY' | 'REMINDER';
  start_time: string;
  end_time: string;
  location?: string;
  attendees?: string[];
  related_case_id?: string;
  related_student_id?: string;
}

export interface UpdateCalendarEventData {
  title?: string;
  description?: string;
  type?: 'SESSION' | 'ASSESSMENT' | 'MEETING' | 'ACTIVITY' | 'REMINDER';
  start_time?: string;
  end_time?: string;
  location?: string;
  attendees?: string[];
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
}

export const calendarEventsApi = {
  getAll: (params?: {
    school_id?: string;
    start_date?: string;
    end_date?: string;
    type?: string;
  }) =>
    apiClient.get('/calendar-events/', params),

  getMyEvents: () =>
    apiClient.get('/calendar-events/my-events'),

  getById: (id: string) =>
    apiClient.get(`/calendar-events/${id}`),

  create: (data: CreateCalendarEventData) =>
    apiClient.post('/calendar-events/', data),

  update: (id: string, data: UpdateCalendarEventData) =>
    apiClient.put(`/calendar-events/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/calendar-events/${id}`),
};
