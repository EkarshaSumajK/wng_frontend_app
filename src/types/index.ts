export type UserRole = 'COUNSELLOR' | 'TEACHER' | 'PRINCIPAL' | 'LEADERSHIP';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  school_id?: string;
  school_name?: string;
  school_logo_url?: string;
  profile_picture_url?: string;
}

export interface Student {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  rollNumber?: string;
  grade: string;
  class?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  lastAssessment?: string;
  wellbeingScore?: number;
  consentStatus: 'GRANTED' | 'PENDING' | 'DENIED';
  dateOfBirth?: string;
  parentContact?: string;
  notes?: string;
}

export interface Case {
  case_id: string;
  student_id: string;
  student?: {
    student_id: string;
    full_name: string;
    grade: string;
    class_id?: string;
  };
  status: 'INTAKE' | 'ASSESSMENT' | 'INTERVENTION' | 'MONITORING' | 'CLOSED';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tags?: string[];
  assigned_counsellor?: string;
  ai_summary?: string;
  created_at: string;
  updated_at: string;
  // Legacy fields for backward compatibility
  id?: string;
  studentId?: string;
  studentName?: string;
  priority?: string;
  assignedCounsellor?: string;
  createdAt?: string;
  updatedAt?: string;
  summary?: string;
  aiRecommendations?: AIRecommendation[];
  sessionNotes?: SessionNote[];
  goals?: Goal[];
  nextSession?: string;
}

export interface SessionNote {
  id: string;
  caseId: string;
  date: string;
  duration: number;
  type: 'INDIVIDUAL' | 'GROUP' | 'ASSESSMENT' | 'CONSULTATION';
  summary: string;
  interventions: string[];
  nextSteps: string[];
  counsellorId: string;
}

export interface Goal {
  id: string;
  caseId: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  progress: number;
  createdAt: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'wellbeing' | 'risk' | 'academic' | 'behavioral';
  questions: AssessmentQuestion[];
  targetGrades: string[];
  estimatedTime: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'scale' | 'text' | 'yes-no';
  options?: string[];
  scaleRange?: { min: number; max: number; labels: string[] };
  required: boolean;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  responses: { questionId: string; answer: any }[];
  score?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  completedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'INTERVENTION' | 'ASSESSMENT' | 'REFERRAL' | 'ALERT';
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  rationale: string;
  recommendation: string;
  modelVersion: string;
  createdAt: string;
  isReviewed: boolean;
  reviewedBy?: string;
  relatedStudentId?: string;
  relatedCaseId?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'mindfulness' | 'social-skills' | 'emotional-regulation' | 'academic-support' | 'team-building';
  duration: number;
  targetGrade: string[];
  materials: string[];
  instructions: string[];
  objectives: string[];
  createdBy: string;
  createdAt: string;
}

export interface AssessmentTemplate {
  id: string;
  title: string;
  description: string;
  category: 'behavioral' | 'cognitive';
  focus: string;
  format: string;
  duration: number;
  targetGrades: string[];
  itemsCount: number;
  lastUsed?: string;
}

export interface DailyBooster {
  id: string;
  title: string;
  type: 'story' | 'puzzle' | 'movement';
  duration: number;
  description: string;
  purpose: string;
  targetGrades: string[];
  difficulty: 'easy' | 'medium' | 'engaging';
  fullInstructions: string;
  materials?: string[];
}

export interface Observation {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  date: string;
  context: string;
  behavior: string;
  triggers?: string;
  interventions?: string;
  outcome?: string;
  followUpNeeded: boolean;
  sharedWithCounsellor: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'SESSION' | 'ASSESSMENT' | 'MEETING' | 'ACTIVITY' | 'REMINDER';
  startTime: string;
  endTime: string;
  attendees: string[];
  location?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  relatedCaseId?: string;
  relatedStudentId?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'worksheet' | 'video' | 'article' | 'book' | 'tool';
  category: 'anxiety' | 'depression' | 'trauma' | 'behavioral' | 'academic' | 'social';
  url?: string;
  fileUrl?: string;
  tags: string[];
  rating: number;
  downloads: number;
  createdAt: string;
}

export interface SchoolMetrics {
  wellbeingIndex: number;
  studentsScreened: number;
  totalStudents: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  counsellorWorkload: {
    name: string;
    activeCases: number;
    capacity: number;
  }[];
  monthlyTrends: {
    month: string;
    wellbeingIndex: number;
    casesOpened: number;
    casesClosed: number;
    assessmentsCompleted: number;
  }[];
}

export interface ClassMetrics {
  id: string;
  name: string;
  teacher: string;
  wellbeingIndex: number;
  participationRate: number;
  atRiskCount: number;
  totalStudents: number;
  lastUpdated: string;
  trends: {
    week: string;
    wellbeingScore: number;
    participationRate: number;
  }[];
}

export interface RiskAlert {
  id: string;
  studentId: string;
  studentName: string;
  level: 'HIGH' | 'CRITICAL';
  type: 'BEHAVIORAL' | 'ACADEMIC' | 'EMOTIONAL' | 'SOCIAL';
  description: string;
  triggers: string[];
  recommendations: string[];
  assignedTo: string;
  status: 'NEW' | 'IN_REVIEW' | 'ESCALATED' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
}

export interface ConsentRecord {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  consentType: 'ASSESSMENT' | 'INTERVENTION' | 'DATA_SHARING' | 'AI_ANALYSIS';
  status: 'GRANTED' | 'PENDING' | 'DENIED' | 'REVOKED';
  grantedAt?: string;
  expiresAt?: string;
  documents: string[];
}