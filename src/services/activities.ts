import { apiClient } from './api';

// Flashcard prompt structure (curated activities only)
export interface FlashcardPrompt {
  Style: string;
  Context: string;
  Image_name: string | null;
  "What to draw": string;
}

// Curated activities have all fields
export interface CuratedActivityData {
  Age: number;
  Type: string;
  Themes: string[];
  Sensory: string;
  Setting: string;
  "Age Band": string;
  Duration: string;
  Elements: string[]; // Empty array for curated
  Cognitive: string;
  Diagnosis: string;
  Framework: string;
  "Risk Level": string;
  "Activity ID": string;
  Facilitator: string;
  "Skill Level": string;
  "Therapy Goal": string;
  "Activity Name": string;
  "Learning Goal": string;
  "Flashcard Prompts": FlashcardPrompt[];
  Instructions?: string[]; // Some activities use this field name
  "Full Instructions"?: string[]; // Some activities use this field name
  "Supervision Level": string;
  "Materials Required": string[];
  "Duration Preference": string;
  "Environment Setting": string;
  "Safety Requirements": string[];
  "Activity Description": string;
  "Activity Success Criteria": string[];
}

// Generated activities have fewer fields (no instructions, materials, safety, etc.)
export interface GeneratedActivityData {
  Age: number;
  Type: string;
  Themes: string[];
  Sensory: string;
  Setting: string;
  "Age Band": string;
  Elements: string[]; // Populated for generated activities
  Cognitive: string;
  Diagnosis: string;
  Framework: string;
  "Risk Level": string;
  "Activity ID": string;
  "Skill Level": string;
  "Therapy Goal": string;
  "Activity Name": string;
  "Learning Goal": string;
  "Supervision Level": string;
  "Duration Preference": string;
  "Activity Description": string;
}

// Union type for activity_data
export type ActivityData = CuratedActivityData | GeneratedActivityData;

// Activity from the activity database
export interface ActivityResponse {
  // Database columns
  id: number;
  activity_id: string;
  activity_name: string;
  framework: string;
  age: number;
  diagnosis: string;
  cognitive: string;
  sensory: string;
  themes: string; // Comma-separated string in DB
  setting: string;
  supervision: string;
  duration_pref: string;
  risk_level: string;
  skill_level: string;
  
  // Raw JSONB from database
  activity_data: ActivityData;
  
  // Metadata
  source: "curated" | "generated";
  flashcards: string[] | null; // S3 flashcard images when include_flashcards=true
  thumbnail_url?: string | null; // URL from S3 presigned generation
}

export type ActivitySource = "all" | "curated" | "generated";

export interface ActivitiesListResponse {
  filters: {
    age: number | null;
    diagnosis: string | null;
    themes: string[] | null;
    source: string;
  };
  total_count: number;
  count: number;
  activities: ActivityResponse[];
}

export interface GetActivitiesParams {
  age?: number;
  diagnosis?: string;
  themes?: string;  // Comma-separated
  source?: ActivitySource;
  include_flashcards?: boolean;
  skip?: number;
  limit?: number;
}

// Type guard to check if activity is curated
export function isCuratedActivity(activity: ActivityResponse): boolean {
  return activity.source === "curated";
}

// Helper to get description
export function getActivityDescription(activity: ActivityResponse): string | null {
  return activity.activity_data?.["Activity Description"] || null;
}

// Helper to get therapy goal
export function getActivityTherapyGoal(activity: ActivityResponse): string | null {
  return activity.activity_data?.["Therapy Goal"] || null;
}

// Helper to get learning goal
export function getActivityLearningGoal(activity: ActivityResponse): string | null {
  return activity.activity_data?.["Learning Goal"] || null;
}

// Helper to get themes as array (activity_data.Themes is already an array)
export function getActivityThemes(activity: ActivityResponse): string[] {
  if (activity.activity_data?.Themes && activity.activity_data.Themes.length > 0) {
    return activity.activity_data.Themes;
  }
  // Fallback to comma-separated themes column
  if (activity.themes) {
    return activity.themes.split(',').map(t => t.trim()).filter(Boolean);
  }
  return [];
}

// Safe accessor for curated-only fields - Materials Required
export function getActivityMaterials(activity: ActivityResponse): string[] {
  if (activity.source === "curated") {
    return (activity.activity_data as CuratedActivityData)["Materials Required"] || [];
  }
  return [];
}

// Safe accessor for curated-only fields - Safety Requirements
export function getActivitySafetyRequirements(activity: ActivityResponse): string[] {
  if (activity.source === "curated") {
    return (activity.activity_data as CuratedActivityData)["Safety Requirements"] || [];
  }
  return [];
}

// Safe accessor for curated-only fields - Instructions
export function getActivityInstructions(activity: ActivityResponse): string[] {
  if (activity.source === "curated") {
    const data = activity.activity_data as CuratedActivityData;
    // Check both "Instructions" and "Full Instructions" field names
    return (data as any)["Instructions"] || data["Full Instructions"] || [];
  }
  return [];
}

// Safe accessor for curated-only fields - Success Criteria
export function getActivitySuccessCriteria(activity: ActivityResponse): string[] {
  if (activity.source === "curated") {
    return (activity.activity_data as CuratedActivityData)["Activity Success Criteria"] || [];
  }
  return [];
}

// Safe accessor for curated-only fields - Flashcard Prompts
export function getActivityFlashcardPrompts(activity: ActivityResponse): FlashcardPrompt[] {
  if (activity.source === "curated") {
    return (activity.activity_data as CuratedActivityData)["Flashcard Prompts"] || [];
  }
  return [];
}

// Safe accessor for curated-only fields - Facilitator
export function getActivityFacilitator(activity: ActivityResponse): string | null {
  if (activity.source === "curated") {
    return (activity.activity_data as CuratedActivityData).Facilitator || null;
  }
  return null;
}

// Safe accessor for curated-only fields - Environment Setting
export function getActivityEnvironmentSetting(activity: ActivityResponse): string | null {
  if (activity.source === "curated") {
    return (activity.activity_data as CuratedActivityData)["Environment Setting"] || null;
  }
  return null;
}

// Safe accessor for curated-only fields - Duration (detailed)
export function getActivityDetailedDuration(activity: ActivityResponse): string | null {
  if (activity.source === "curated") {
    return (activity.activity_data as CuratedActivityData).Duration || null;
  }
  return null;
}

// Helper to get duration (works for both curated and generated)
export function getActivityDuration(activity: ActivityResponse): string | null {
  // Try detailed Duration first (curated only), then Duration Preference
  if (activity.source === "curated") {
    const detailed = (activity.activity_data as CuratedActivityData).Duration;
    if (detailed) return detailed;
  }
  return activity.activity_data?.["Duration Preference"] || activity.duration_pref || null;
}

// Helper to get age band
export function getActivityAgeBand(activity: ActivityResponse): string | null {
  return activity.activity_data?.["Age Band"] || null;
}

// Helper to get elements (populated for generated activities, empty for curated)
export function getActivityElements(activity: ActivityResponse): string[] {
  return activity.activity_data?.Elements || [];
}

// Helper to get activity type
export function getActivityType(activity: ActivityResponse): string | null {
  return activity.activity_data?.Type || null;
}

// Helper to get cognitive info
export function getActivityCognitive(activity: ActivityResponse): string | null {
  return activity.activity_data?.Cognitive || activity.cognitive || null;
}

// Helper to get sensory info
export function getActivitySensory(activity: ActivityResponse): string | null {
  return activity.activity_data?.Sensory || activity.sensory || null;
}

// Helper to get framework
export function getActivityFramework(activity: ActivityResponse): string | null {
  return activity.activity_data?.Framework || activity.framework || null;
}

// Helper to get thumbnail URL
export function getActivityThumbnail(activity: ActivityResponse): string | null {
  return activity.thumbnail_url || null;
}

export const activitiesApi = {
  getAll: (params?: GetActivitiesParams) =>
    apiClient.get<ActivitiesListResponse>('/activities/', params),

  getById: (id: string, includeFlashcards: boolean = false) =>
    apiClient.get<ActivityResponse>(`/activities/${id}`, { include_flashcards: includeFlashcards }),
};
