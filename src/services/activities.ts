import { apiClient } from './api';

// Activity from the activity database (different structure)
export interface ActivityResponse {
  activity_id: string;
  activity_name: string;
  description: string | null;
  therapy_goal: string | null;
  learning_goal: string | null;
  age: number | null;
  themes: string[];
  diagnosis: string | null;
  framework: string | null;
  setting: string | null;
  supervision: string | null;
  duration: string | null;
  risk_level: string | null;
  skill_level: string | null;
  cognitive: string | null;
  sensory: string | null;
  instructions: string[] | Record<string, unknown>;
  flashcards: Record<string, string> | null;
}

export interface ActivitiesListResponse {
  filters: {
    age: number | null;
    diagnosis: string | null;
    themes: string[] | null;
  };
  count: number;
  activities: ActivityResponse[];
}

export interface GetActivitiesParams {
  age?: number;
  diagnosis?: string;
  themes?: string;  // Comma-separated
  include_flashcards?: boolean;
  skip?: number;
  limit?: number;
}

export const activitiesApi = {
  getAll: (params?: GetActivitiesParams) =>
    apiClient.get<ActivitiesListResponse>('/activities/', params),

  getById: (id: string, includeFlashcards: boolean = false) =>
    apiClient.get<ActivityResponse>(`/activities/${id}`, { include_flashcards: includeFlashcards }),
};


