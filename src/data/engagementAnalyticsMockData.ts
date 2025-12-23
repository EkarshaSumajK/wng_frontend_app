/**
 * Mock data for Engagement Analytics
 * Tracks student submissions/attendance for Assessments, Activities, and Webinars
 */

// Unified engagement data interface
export interface EngagementData {
  done: number;  // submitted/completed/attended
  total: number;
  rate: number;
}

export interface SchoolEngagementSummary {
  id: string;
  name: string;
  totalStudents: number;
  assessments: EngagementData;
  activities: EngagementData;
  webinars: EngagementData;
}

export interface ClassEngagementSummary {
  id: string;
  name: string;
  grade: string;
  section: string;
  teacherName: string;
  totalStudents: number;
  assessments: EngagementData;
  activities: EngagementData;
  webinars: EngagementData;
}

export interface StudentEngagementSummary {
  id: string;
  name: string;
  className: string;
  grade: string;
  section: string;
  rollNumber: string;
  assessments: EngagementData;
  activities: EngagementData;
  webinars: EngagementData;
  lastActive: string;
}

export interface AssessmentDetail {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  totalStudentsAssigned: number;
  studentsSubmitted: number;
  studentsPending: number;
  avgScore: number;
  submissionRate: number;
}

export interface ActivityDetail {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  totalStudentsAssigned: number;
  studentsCompleted: number;
  studentsInProgress: number;
  studentsNotStarted: number;
  completionRate: number;
}

export interface WebinarDetail {
  id: string;
  title: string;
  date: string;
  duration: string;
  totalStudentsInvited: number;
  studentsAttended: number;
  studentsMissed: number;
  attendanceRate: number;
  avgWatchTime: string;
}

// Student submission status for individual items
export interface StudentItemStatus {
  studentId: string;
  studentName: string;
  className: string;
  status: "submitted" | "pending" | "completed" | "in_progress" | "not_started" | "attended" | "missed";
  submittedAt?: string;
  score?: number;
  watchTime?: string;
}

// Enhanced assessment with student-level data
export interface AssessmentWithStudents extends AssessmentDetail {
  students: StudentItemStatus[];
}

// Enhanced activity with student-level data
export interface ActivityWithStudents extends ActivityDetail {
  students: StudentItemStatus[];
}

// Enhanced webinar with student-level data
export interface WebinarWithStudents extends WebinarDetail {
  students: StudentItemStatus[];
}

// Summary stats for dashboard
export interface EngagementStats {
  totalAssessments: number;
  totalActivities: number;
  totalWebinars: number;
  avgAssessmentSubmissionRate: number;
  avgActivityCompletionRate: number;
  avgWebinarAttendanceRate: number;
  studentsWithFullParticipation: number;
  studentsNeedingAttention: number;
}

// School-wise mock data
export const mockSchoolEngagement: SchoolEngagementSummary = {
  id: "school-1",
  name: "Greenwood International School",
  totalStudents: 1250,
  assessments: { done: 4850, total: 6250, rate: 77.6 },
  activities: { done: 8920, total: 11250, rate: 79.3 },
  webinars: { done: 3200, total: 5000, rate: 64.0 },
};

// Class-wise mock data
export const mockClassEngagement: ClassEngagementSummary[] = [
  {
    id: "class-1",
    name: "Grade 6 - Section A",
    grade: "6",
    section: "A",
    teacherName: "Ms. Sarah Johnson",
    totalStudents: 32,
    assessments: { done: 145, total: 160, rate: 90.6 },
    activities: { done: 256, total: 288, rate: 88.9 },
    webinars: { done: 98, total: 128, rate: 76.6 },
  },
  {
    id: "class-2",
    name: "Grade 6 - Section B",
    grade: "6",
    section: "B",
    teacherName: "Mr. David Chen",
    totalStudents: 30,
    assessments: { done: 128, total: 150, rate: 85.3 },
    activities: { done: 215, total: 270, rate: 79.6 },
    webinars: { done: 82, total: 120, rate: 68.3 },
  },
  {
    id: "class-3",
    name: "Grade 7 - Section A",
    grade: "7",
    section: "A",
    teacherName: "Ms. Emily Rodriguez",
    totalStudents: 35,
    assessments: { done: 162, total: 175, rate: 92.6 },
    activities: { done: 298, total: 315, rate: 94.6 },
    webinars: { done: 112, total: 140, rate: 80.0 },
  },
  {
    id: "class-4",
    name: "Grade 7 - Section B",
    grade: "7",
    section: "B",
    teacherName: "Mr. James Wilson",
    totalStudents: 33,
    assessments: { done: 138, total: 165, rate: 83.6 },
    activities: { done: 245, total: 297, rate: 82.5 },
    webinars: { done: 89, total: 132, rate: 67.4 },
  },
  {
    id: "class-5",
    name: "Grade 8 - Section A",
    grade: "8",
    section: "A",
    teacherName: "Ms. Priya Sharma",
    totalStudents: 34,
    assessments: { done: 155, total: 170, rate: 91.2 },
    activities: { done: 278, total: 306, rate: 90.8 },
    webinars: { done: 105, total: 136, rate: 77.2 },
  },
  {
    id: "class-6",
    name: "Grade 8 - Section B",
    grade: "8",
    section: "B",
    teacherName: "Mr. Michael Brown",
    totalStudents: 31,
    assessments: { done: 118, total: 155, rate: 76.1 },
    activities: { done: 198, total: 279, rate: 71.0 },
    webinars: { done: 72, total: 124, rate: 58.1 },
  },
];

// Student-wise mock data
export const mockStudentEngagement: StudentEngagementSummary[] = [
  {
    id: "student-1",
    name: "Emma Thompson",
    className: "Grade 6 - Section A",
    grade: "6",
    section: "A",
    rollNumber: "6A01",
    assessments: { done: 5, total: 5, rate: 100 },
    activities: { done: 9, total: 9, rate: 100 },
    webinars: { done: 4, total: 4, rate: 100 },
    lastActive: "2024-12-17",
  },
  {
    id: "student-2",
    name: "Liam Anderson",
    className: "Grade 6 - Section A",
    grade: "6",
    section: "A",
    rollNumber: "6A02",
    assessments: { done: 4, total: 5, rate: 80 },
    activities: { done: 7, total: 9, rate: 77.8 },
    webinars: { done: 3, total: 4, rate: 75 },
    lastActive: "2024-12-16",
  },
  {
    id: "student-3",
    name: "Sophia Martinez",
    className: "Grade 6 - Section A",
    grade: "6",
    section: "A",
    rollNumber: "6A03",
    assessments: { done: 5, total: 5, rate: 100 },
    activities: { done: 8, total: 9, rate: 88.9 },
    webinars: { done: 4, total: 4, rate: 100 },
    lastActive: "2024-12-17",
  },
  {
    id: "student-4",
    name: "Noah Williams",
    className: "Grade 6 - Section B",
    grade: "6",
    section: "B",
    rollNumber: "6B01",
    assessments: { done: 3, total: 5, rate: 60 },
    activities: { done: 5, total: 9, rate: 55.6 },
    webinars: { done: 2, total: 4, rate: 50 },
    lastActive: "2024-12-14",
  },
  {
    id: "student-5",
    name: "Olivia Johnson",
    className: "Grade 7 - Section A",
    grade: "7",
    section: "A",
    rollNumber: "7A01",
    assessments: { done: 5, total: 5, rate: 100 },
    activities: { done: 9, total: 9, rate: 100 },
    webinars: { done: 4, total: 4, rate: 100 },
    lastActive: "2024-12-17",
  },
  {
    id: "student-6",
    name: "Ethan Brown",
    className: "Grade 7 - Section A",
    grade: "7",
    section: "A",
    rollNumber: "7A02",
    assessments: { done: 4, total: 5, rate: 80 },
    activities: { done: 8, total: 9, rate: 88.9 },
    webinars: { done: 3, total: 4, rate: 75 },
    lastActive: "2024-12-16",
  },
  {
    id: "student-7",
    name: "Ava Davis",
    className: "Grade 7 - Section B",
    grade: "7",
    section: "B",
    rollNumber: "7B01",
    assessments: { done: 4, total: 5, rate: 80 },
    activities: { done: 7, total: 9, rate: 77.8 },
    webinars: { done: 2, total: 4, rate: 50 },
    lastActive: "2024-12-15",
  },
  {
    id: "student-8",
    name: "Mason Garcia",
    className: "Grade 8 - Section A",
    grade: "8",
    section: "A",
    rollNumber: "8A01",
    assessments: { done: 5, total: 5, rate: 100 },
    activities: { done: 9, total: 9, rate: 100 },
    webinars: { done: 4, total: 4, rate: 100 },
    lastActive: "2024-12-17",
  },
  {
    id: "student-9",
    name: "Isabella Wilson",
    className: "Grade 8 - Section A",
    grade: "8",
    section: "A",
    rollNumber: "8A02",
    assessments: { done: 4, total: 5, rate: 80 },
    activities: { done: 8, total: 9, rate: 88.9 },
    webinars: { done: 3, total: 4, rate: 75 },
    lastActive: "2024-12-16",
  },
  {
    id: "student-10",
    name: "James Taylor",
    className: "Grade 8 - Section B",
    grade: "8",
    section: "B",
    rollNumber: "8B01",
    assessments: { done: 2, total: 5, rate: 40 },
    activities: { done: 4, total: 9, rate: 44.4 },
    webinars: { done: 1, total: 4, rate: 25 },
    lastActive: "2024-12-10",
  },
];

// Assessment details mock data - showing how many STUDENTS submitted each assessment
export const mockAssessmentDetails: AssessmentDetail[] = [
  {
    id: "assess-1",
    title: "Emotional Intelligence Assessment",
    type: "Self-Assessment",
    dueDate: "2024-12-20",
    totalStudentsAssigned: 1250,
    studentsSubmitted: 980,
    studentsPending: 270,
    avgScore: 78.5,
    submissionRate: 78.4,
  },
  {
    id: "assess-2",
    title: "Stress Management Quiz",
    type: "Quiz",
    dueDate: "2024-12-18",
    totalStudentsAssigned: 1250,
    studentsSubmitted: 1120,
    studentsPending: 130,
    avgScore: 82.3,
    submissionRate: 89.6,
  },
  {
    id: "assess-3",
    title: "Social Skills Evaluation",
    type: "Peer Assessment",
    dueDate: "2024-12-22",
    totalStudentsAssigned: 1250,
    studentsSubmitted: 850,
    studentsPending: 400,
    avgScore: 75.8,
    submissionRate: 68.0,
  },
  {
    id: "assess-4",
    title: "Mindfulness Check-in",
    type: "Self-Assessment",
    dueDate: "2024-12-15",
    totalStudentsAssigned: 1250,
    studentsSubmitted: 1180,
    studentsPending: 70,
    avgScore: 85.2,
    submissionRate: 94.4,
  },
  {
    id: "assess-5",
    title: "Conflict Resolution Assessment",
    type: "Scenario-Based",
    dueDate: "2024-12-25",
    totalStudentsAssigned: 1250,
    studentsSubmitted: 720,
    studentsPending: 530,
    avgScore: 71.4,
    submissionRate: 57.6,
  },
];

// Activity details mock data - showing how many STUDENTS completed each activity
export const mockActivityDetails: ActivityDetail[] = [
  {
    id: "activity-1",
    title: "Daily Gratitude Journal",
    category: "Mindfulness",
    dueDate: "Ongoing",
    totalStudentsAssigned: 1250,
    studentsCompleted: 1050,
    studentsInProgress: 150,
    studentsNotStarted: 50,
    completionRate: 84.0,
  },
  {
    id: "activity-2",
    title: "Breathing Exercises",
    category: "Stress Relief",
    dueDate: "2024-12-20",
    totalStudentsAssigned: 1250,
    studentsCompleted: 920,
    studentsInProgress: 200,
    studentsNotStarted: 130,
    completionRate: 73.6,
  },
  {
    id: "activity-3",
    title: "Peer Support Circle",
    category: "Social Skills",
    dueDate: "2024-12-19",
    totalStudentsAssigned: 1250,
    studentsCompleted: 780,
    studentsInProgress: 320,
    studentsNotStarted: 150,
    completionRate: 62.4,
  },
  {
    id: "activity-4",
    title: "Goal Setting Workshop",
    category: "Personal Development",
    dueDate: "2024-12-21",
    totalStudentsAssigned: 1250,
    studentsCompleted: 890,
    studentsInProgress: 250,
    studentsNotStarted: 110,
    completionRate: 71.2,
  },
  {
    id: "activity-5",
    title: "Emotion Identification Game",
    category: "Emotional Intelligence",
    dueDate: "2024-12-18",
    totalStudentsAssigned: 1250,
    studentsCompleted: 1100,
    studentsInProgress: 100,
    studentsNotStarted: 50,
    completionRate: 88.0,
  },
];

// Webinar details mock data - showing how many STUDENTS attended each webinar
export const mockWebinarDetails: WebinarDetail[] = [
  {
    id: "webinar-1",
    title: "Managing Exam Stress",
    date: "2024-12-15",
    duration: "45 mins",
    totalStudentsInvited: 1250,
    studentsAttended: 890,
    studentsMissed: 360,
    attendanceRate: 71.2,
    avgWatchTime: "38 mins",
  },
  {
    id: "webinar-2",
    title: "Building Healthy Relationships",
    date: "2024-12-12",
    duration: "60 mins",
    totalStudentsInvited: 1250,
    studentsAttended: 720,
    studentsMissed: 530,
    attendanceRate: 57.6,
    avgWatchTime: "52 mins",
  },
  {
    id: "webinar-3",
    title: "Digital Wellness & Screen Time",
    date: "2024-12-10",
    duration: "50 mins",
    totalStudentsInvited: 1250,
    studentsAttended: 650,
    studentsMissed: 600,
    attendanceRate: 52.0,
    avgWatchTime: "42 mins",
  },
  {
    id: "webinar-4",
    title: "Career Guidance Session",
    date: "2024-12-08",
    duration: "90 mins",
    totalStudentsInvited: 500,
    studentsAttended: 420,
    studentsMissed: 80,
    attendanceRate: 84.0,
    avgWatchTime: "78 mins",
  },
  {
    id: "webinar-5",
    title: "Parent-Child Communication",
    date: "2024-12-05",
    duration: "55 mins",
    totalStudentsInvited: 800,
    studentsAttended: 520,
    studentsMissed: 280,
    attendanceRate: 65.0,
    avgWatchTime: "48 mins",
  },
];

// Overall engagement statistics
export const mockEngagementStats: EngagementStats = {
  totalAssessments: 5,
  totalActivities: 5,
  totalWebinars: 5,
  avgAssessmentSubmissionRate: 77.6,
  avgActivityCompletionRate: 75.8,
  avgWebinarAttendanceRate: 66.0,
  studentsWithFullParticipation: 312,
  studentsNeedingAttention: 89,
};

// Trend data for charts - Daily, Weekly, Monthly, Yearly
export const mockEngagementTrends = {
  daily: [
    { date: "Dec 11", assessments: 78, activities: 72, webinars: 0 },
    { date: "Dec 12", assessments: 82, activities: 75, webinars: 58 },
    { date: "Dec 13", assessments: 75, activities: 78, webinars: 0 },
    { date: "Dec 14", assessments: 80, activities: 74, webinars: 0 },
    { date: "Dec 15", assessments: 85, activities: 80, webinars: 71 },
    { date: "Dec 16", assessments: 79, activities: 76, webinars: 0 },
    { date: "Dec 17", assessments: 88, activities: 82, webinars: 0 },
  ],
  weekly: [
    { week: "Week 1", assessments: 72, activities: 68, webinars: 55 },
    { week: "Week 2", assessments: 75, activities: 72, webinars: 60 },
    { week: "Week 3", assessments: 78, activities: 76, webinars: 62 },
    { week: "Week 4", assessments: 82, activities: 80, webinars: 68 },
  ],
  monthly: [
    { month: "Sep", assessments: 65, activities: 60, webinars: 50 },
    { month: "Oct", assessments: 72, activities: 68, webinars: 55 },
    { month: "Nov", assessments: 78, activities: 75, webinars: 62 },
    { month: "Dec", assessments: 82, activities: 80, webinars: 68 },
  ],
  yearly: [
    { year: "2022", assessments: 58, activities: 52, webinars: 42 },
    { year: "2023", assessments: 68, activities: 65, webinars: 55 },
    { year: "2024", assessments: 78, activities: 75, webinars: 65 },
  ],
};

// Best Performers - Students with highest engagement
export interface TopPerformer {
  id: string;
  name: string;
  className: string;
  rollNumber: string;
  avatar?: string;
  overallRate: number;
  assessmentsCompleted: number;
  activitiesCompleted: number;
  webinarsAttended: number;
  streak: number;
  lastActive: string;
  rank: number;
}

export const mockTopPerformers: TopPerformer[] = [
  {
    id: "student-1",
    name: "Emma Thompson",
    className: "Grade 6 - Section A",
    rollNumber: "6A01",
    overallRate: 100,
    assessmentsCompleted: 5,
    activitiesCompleted: 9,
    webinarsAttended: 4,
    streak: 15,
    lastActive: "2024-12-17",
    rank: 1,
  },
  {
    id: "student-5",
    name: "Olivia Johnson",
    className: "Grade 7 - Section A",
    rollNumber: "7A01",
    overallRate: 100,
    assessmentsCompleted: 5,
    activitiesCompleted: 9,
    webinarsAttended: 4,
    streak: 12,
    lastActive: "2024-12-17",
    rank: 2,
  },
  {
    id: "student-8",
    name: "Mason Garcia",
    className: "Grade 8 - Section A",
    rollNumber: "8A01",
    overallRate: 100,
    assessmentsCompleted: 5,
    activitiesCompleted: 9,
    webinarsAttended: 4,
    streak: 18,
    lastActive: "2024-12-17",
    rank: 3,
  },
  {
    id: "student-3",
    name: "Sophia Martinez",
    className: "Grade 6 - Section A",
    rollNumber: "6A03",
    overallRate: 94.4,
    assessmentsCompleted: 5,
    activitiesCompleted: 8,
    webinarsAttended: 4,
    streak: 10,
    lastActive: "2024-12-17",
    rank: 4,
  },
  {
    id: "student-6",
    name: "Ethan Brown",
    className: "Grade 7 - Section A",
    rollNumber: "7A02",
    overallRate: 83.3,
    assessmentsCompleted: 4,
    activitiesCompleted: 8,
    webinarsAttended: 3,
    streak: 8,
    lastActive: "2024-12-16",
    rank: 5,
  },
];

// Non-Submitters - Students who haven't completed tasks
export interface NonSubmitter {
  id: string;
  name: string;
  className: string;
  rollNumber: string;
  pendingAssessments: number;
  pendingActivities: number;
  missedWebinars: number;
  overallPendingRate: number;
  lastActive: string;
  daysInactive: number;
}

export const mockNonSubmitters: NonSubmitter[] = [
  {
    id: "student-10",
    name: "James Taylor",
    className: "Grade 8 - Section B",
    rollNumber: "8B01",
    pendingAssessments: 3,
    pendingActivities: 5,
    missedWebinars: 3,
    overallPendingRate: 61.1,
    lastActive: "2024-12-10",
    daysInactive: 7,
  },
  {
    id: "student-4",
    name: "Noah Williams",
    className: "Grade 6 - Section B",
    rollNumber: "6B01",
    pendingAssessments: 2,
    pendingActivities: 4,
    missedWebinars: 2,
    overallPendingRate: 44.4,
    lastActive: "2024-12-14",
    daysInactive: 3,
  },
  {
    id: "student-7",
    name: "Ava Davis",
    className: "Grade 7 - Section B",
    rollNumber: "7B01",
    pendingAssessments: 1,
    pendingActivities: 2,
    missedWebinars: 2,
    overallPendingRate: 27.8,
    lastActive: "2024-12-15",
    daysInactive: 2,
  },
  {
    id: "student-11",
    name: "Lucas Martinez",
    className: "Grade 6 - Section B",
    rollNumber: "6B05",
    pendingAssessments: 2,
    pendingActivities: 3,
    missedWebinars: 2,
    overallPendingRate: 38.9,
    lastActive: "2024-12-12",
    daysInactive: 5,
  },
  {
    id: "student-12",
    name: "Mia Johnson",
    className: "Grade 8 - Section B",
    rollNumber: "8B03",
    pendingAssessments: 1,
    pendingActivities: 2,
    missedWebinars: 1,
    overallPendingRate: 22.2,
    lastActive: "2024-12-16",
    daysInactive: 1,
  },
];

// Time-based metrics summary
export interface TimeBasedMetrics {
  period: string;
  totalSubmissions: number;
  totalCompletions: number;
  totalAttendance: number;
  avgSubmissionRate: number;
  avgCompletionRate: number;
  avgAttendanceRate: number;
  newSubmissions: number;
  trend: "up" | "down" | "stable";
  trendPercentage: number;
}

// ============ COMPREHENSIVE SCHOOL ANALYTICS ============

// Assessment Analytics - Score Distribution
export interface ScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}

export const mockScoreDistribution: ScoreDistribution[] = [
  { range: "90-100", count: 245, percentage: 19.6 },
  { range: "80-89", count: 312, percentage: 24.9 },
  { range: "70-79", count: 298, percentage: 23.8 },
  { range: "60-69", count: 187, percentage: 15.0 },
  { range: "50-59", count: 124, percentage: 9.9 },
  { range: "Below 50", count: 84, percentage: 6.7 },
];

// Assessment Analytics - Difficulty Analysis
export interface DifficultyAnalysis {
  assessmentId: string;
  title: string;
  avgScore: number;
  avgTimeMinutes: number;
  passRate: number;
  difficulty: "Easy" | "Medium" | "Hard";
  totalAttempts: number;
}

export const mockDifficultyAnalysis: DifficultyAnalysis[] = [
  { assessmentId: "assess-1", title: "Emotional Intelligence Assessment", avgScore: 78.5, avgTimeMinutes: 18, passRate: 85.2, difficulty: "Medium", totalAttempts: 980 },
  { assessmentId: "assess-2", title: "Stress Management Quiz", avgScore: 82.3, avgTimeMinutes: 12, passRate: 91.5, difficulty: "Easy", totalAttempts: 1120 },
  { assessmentId: "assess-3", title: "Social Skills Evaluation", avgScore: 75.8, avgTimeMinutes: 25, passRate: 78.4, difficulty: "Hard", totalAttempts: 850 },
  { assessmentId: "assess-4", title: "Mindfulness Check-in", avgScore: 85.2, avgTimeMinutes: 8, passRate: 94.1, difficulty: "Easy", totalAttempts: 1180 },
  { assessmentId: "assess-5", title: "Conflict Resolution Assessment", avgScore: 71.4, avgTimeMinutes: 22, passRate: 72.8, difficulty: "Hard", totalAttempts: 720 },
];

// Grade-wise Performance Comparison
export interface GradePerformance {
  grade: string;
  assessmentRate: number;
  activityRate: number;
  webinarRate: number;
  avgScore: number;
  totalStudents: number;
  improvement: number; // vs last month
}

export const mockGradePerformance: GradePerformance[] = [
  { grade: "6", assessmentRate: 87.9, activityRate: 84.2, webinarRate: 72.4, avgScore: 76.5, totalStudents: 62, improvement: 5.2 },
  { grade: "7", assessmentRate: 88.1, activityRate: 88.5, webinarRate: 73.7, avgScore: 79.2, totalStudents: 68, improvement: 3.8 },
  { grade: "8", assessmentRate: 83.6, activityRate: 80.9, webinarRate: 67.6, avgScore: 74.8, totalStudents: 65, improvement: -1.2 },
  { grade: "9", assessmentRate: 79.4, activityRate: 76.2, webinarRate: 62.5, avgScore: 72.1, totalStudents: 58, improvement: 2.1 },
  { grade: "10", assessmentRate: 82.8, activityRate: 78.5, webinarRate: 68.9, avgScore: 77.4, totalStudents: 55, improvement: 4.5 },
];

// Activity Analytics - Category Breakdown
export interface ActivityCategoryStats {
  category: string;
  totalActivities: number;
  avgCompletionRate: number;
  avgTimeSpentMinutes: number;
  popularityRank: number;
  studentEngagement: number; // 1-100 score
}

export const mockActivityCategoryStats: ActivityCategoryStats[] = [
  { category: "Mindfulness", totalActivities: 12, avgCompletionRate: 84.0, avgTimeSpentMinutes: 15, popularityRank: 1, studentEngagement: 92 },
  { category: "Stress Relief", totalActivities: 8, avgCompletionRate: 73.6, avgTimeSpentMinutes: 20, popularityRank: 3, studentEngagement: 78 },
  { category: "Social Skills", totalActivities: 10, avgCompletionRate: 62.4, avgTimeSpentMinutes: 35, popularityRank: 4, studentEngagement: 65 },
  { category: "Personal Development", totalActivities: 15, avgCompletionRate: 71.2, avgTimeSpentMinutes: 25, popularityRank: 2, studentEngagement: 85 },
  { category: "Emotional Intelligence", totalActivities: 9, avgCompletionRate: 88.0, avgTimeSpentMinutes: 18, popularityRank: 1, studentEngagement: 94 },
];

// Webinar Analytics - Engagement Metrics
export interface WebinarEngagementMetrics {
  webinarId: string;
  title: string;
  totalRegistered: number;
  actualAttendees: number;
  avgWatchTimePercent: number;
  peakViewers: number;
  dropOffRate: number;
  questionsAsked: number;
  pollParticipation: number;
  replayViews: number;
  rating: number; // 1-5
}

export const mockWebinarEngagementMetrics: WebinarEngagementMetrics[] = [
  { webinarId: "webinar-1", title: "Managing Exam Stress", totalRegistered: 1250, actualAttendees: 890, avgWatchTimePercent: 84.4, peakViewers: 920, dropOffRate: 15.6, questionsAsked: 45, pollParticipation: 78, replayViews: 234, rating: 4.5 },
  { webinarId: "webinar-2", title: "Building Healthy Relationships", totalRegistered: 1250, actualAttendees: 720, avgWatchTimePercent: 86.7, peakViewers: 780, dropOffRate: 13.3, questionsAsked: 62, pollParticipation: 82, replayViews: 312, rating: 4.7 },
  { webinarId: "webinar-3", title: "Digital Wellness & Screen Time", totalRegistered: 1250, actualAttendees: 650, avgWatchTimePercent: 84.0, peakViewers: 690, dropOffRate: 16.0, questionsAsked: 38, pollParticipation: 71, replayViews: 456, rating: 4.2 },
  { webinarId: "webinar-4", title: "Career Guidance Session", totalRegistered: 500, actualAttendees: 420, avgWatchTimePercent: 86.7, peakViewers: 445, dropOffRate: 13.3, questionsAsked: 89, pollParticipation: 91, replayViews: 178, rating: 4.8 },
  { webinarId: "webinar-5", title: "Parent-Child Communication", totalRegistered: 800, actualAttendees: 520, avgWatchTimePercent: 87.3, peakViewers: 560, dropOffRate: 12.7, questionsAsked: 54, pollParticipation: 85, replayViews: 289, rating: 4.6 },
];

// Participation Heatmap Data (Day of week x Hour)
export interface ParticipationHeatmapData {
  day: string;
  hour: number;
  value: number; // engagement count
}

export const mockParticipationHeatmap: ParticipationHeatmapData[] = [
  // Monday
  { day: "Mon", hour: 8, value: 45 }, { day: "Mon", hour: 9, value: 78 }, { day: "Mon", hour: 10, value: 92 },
  { day: "Mon", hour: 11, value: 85 }, { day: "Mon", hour: 12, value: 42 }, { day: "Mon", hour: 13, value: 38 },
  { day: "Mon", hour: 14, value: 88 }, { day: "Mon", hour: 15, value: 95 }, { day: "Mon", hour: 16, value: 72 },
  // Tuesday
  { day: "Tue", hour: 8, value: 52 }, { day: "Tue", hour: 9, value: 82 }, { day: "Tue", hour: 10, value: 98 },
  { day: "Tue", hour: 11, value: 91 }, { day: "Tue", hour: 12, value: 48 }, { day: "Tue", hour: 13, value: 42 },
  { day: "Tue", hour: 14, value: 92 }, { day: "Tue", hour: 15, value: 88 }, { day: "Tue", hour: 16, value: 68 },
  // Wednesday
  { day: "Wed", hour: 8, value: 48 }, { day: "Wed", hour: 9, value: 75 }, { day: "Wed", hour: 10, value: 88 },
  { day: "Wed", hour: 11, value: 82 }, { day: "Wed", hour: 12, value: 45 }, { day: "Wed", hour: 13, value: 40 },
  { day: "Wed", hour: 14, value: 85 }, { day: "Wed", hour: 15, value: 92 }, { day: "Wed", hour: 16, value: 75 },
  // Thursday
  { day: "Thu", hour: 8, value: 55 }, { day: "Thu", hour: 9, value: 85 }, { day: "Thu", hour: 10, value: 95 },
  { day: "Thu", hour: 11, value: 88 }, { day: "Thu", hour: 12, value: 50 }, { day: "Thu", hour: 13, value: 45 },
  { day: "Thu", hour: 14, value: 90 }, { day: "Thu", hour: 15, value: 85 }, { day: "Thu", hour: 16, value: 70 },
  // Friday
  { day: "Fri", hour: 8, value: 42 }, { day: "Fri", hour: 9, value: 72 }, { day: "Fri", hour: 10, value: 82 },
  { day: "Fri", hour: 11, value: 78 }, { day: "Fri", hour: 12, value: 55 }, { day: "Fri", hour: 13, value: 48 },
  { day: "Fri", hour: 14, value: 75 }, { day: "Fri", hour: 15, value: 68 }, { day: "Fri", hour: 16, value: 58 },
];

// Improvement Tracking Over Time
export interface ImprovementTracking {
  studentId: string;
  studentName: string;
  className: string;
  monthlyScores: { month: string; score: number }[];
  overallImprovement: number;
  consistencyScore: number; // 1-100
}

export const mockImprovementTracking: ImprovementTracking[] = [
  { studentId: "student-1", studentName: "Emma Thompson", className: "Grade 6 - Section A", monthlyScores: [{ month: "Sep", score: 72 }, { month: "Oct", score: 78 }, { month: "Nov", score: 85 }, { month: "Dec", score: 92 }], overallImprovement: 27.8, consistencyScore: 95 },
  { studentId: "student-2", studentName: "Liam Anderson", className: "Grade 6 - Section A", monthlyScores: [{ month: "Sep", score: 65 }, { month: "Oct", score: 68 }, { month: "Nov", score: 72 }, { month: "Dec", score: 78 }], overallImprovement: 20.0, consistencyScore: 82 },
  { studentId: "student-5", studentName: "Olivia Johnson", className: "Grade 7 - Section A", monthlyScores: [{ month: "Sep", score: 80 }, { month: "Oct", score: 82 }, { month: "Nov", score: 88 }, { month: "Dec", score: 94 }], overallImprovement: 17.5, consistencyScore: 98 },
  { studentId: "student-8", studentName: "Mason Garcia", className: "Grade 8 - Section A", monthlyScores: [{ month: "Sep", score: 75 }, { month: "Oct", score: 80 }, { month: "Nov", score: 86 }, { month: "Dec", score: 91 }], overallImprovement: 21.3, consistencyScore: 94 },
  { studentId: "student-10", studentName: "James Taylor", className: "Grade 8 - Section B", monthlyScores: [{ month: "Sep", score: 58 }, { month: "Oct", score: 52 }, { month: "Nov", score: 48 }, { month: "Dec", score: 45 }], overallImprovement: -22.4, consistencyScore: 35 },
];

// Attendance Patterns
export interface AttendancePattern {
  type: "assessment" | "activity" | "webinar";
  onTime: number;
  late: number;
  missed: number;
  avgDelayMinutes: number;
}

export const mockAttendancePatterns: AttendancePattern[] = [
  { type: "assessment", onTime: 78, late: 15, missed: 7, avgDelayMinutes: 12 },
  { type: "activity", onTime: 72, late: 18, missed: 10, avgDelayMinutes: 8 },
  { type: "webinar", onTime: 65, late: 20, missed: 15, avgDelayMinutes: 5 },
];

// Risk Assessment - Students at Risk
export interface StudentRiskAssessment {
  studentId: string;
  studentName: string;
  className: string;
  riskLevel: "High" | "Medium" | "Low";
  riskScore: number; // 0-100, higher = more at risk
  factors: string[];
  recommendedActions: string[];
  lastEngagement: string;
}

export const mockStudentRiskAssessment: StudentRiskAssessment[] = [
  { studentId: "student-10", studentName: "James Taylor", className: "Grade 8 - Section B", riskLevel: "High", riskScore: 85, factors: ["7 days inactive", "Declining scores", "3 missed webinars"], recommendedActions: ["Schedule counselor meeting", "Parent notification", "Peer support assignment"], lastEngagement: "2024-12-10" },
  { studentId: "student-4", studentName: "Noah Williams", className: "Grade 6 - Section B", riskLevel: "High", riskScore: 72, factors: ["Low completion rate", "Irregular participation", "Below avg scores"], recommendedActions: ["One-on-one check-in", "Study group inclusion"], lastEngagement: "2024-12-14" },
  { studentId: "student-11", studentName: "Lucas Martinez", className: "Grade 6 - Section B", riskLevel: "Medium", riskScore: 58, factors: ["5 days inactive", "Pending assessments"], recommendedActions: ["Reminder notification", "Teacher follow-up"], lastEngagement: "2024-12-12" },
  { studentId: "student-7", studentName: "Ava Davis", className: "Grade 7 - Section B", riskLevel: "Medium", riskScore: 45, factors: ["Missed webinars", "Inconsistent activity"], recommendedActions: ["Engagement incentive", "Schedule flexibility"], lastEngagement: "2024-12-15" },
  { studentId: "student-12", studentName: "Mia Johnson", className: "Grade 8 - Section B", riskLevel: "Low", riskScore: 28, factors: ["Minor delays in submissions"], recommendedActions: ["Continue monitoring"], lastEngagement: "2024-12-16" },
];

// Summary Statistics for Dashboard
export interface ComprehensiveStats {
  // Assessment Stats
  totalAssessmentsCreated: number;
  avgAssessmentScore: number;
  highestScoringAssessment: string;
  lowestScoringAssessment: string;
  assessmentCompletionTrend: "up" | "down" | "stable";
  
  // Activity Stats
  totalActivitiesCreated: number;
  mostPopularCategory: string;
  avgActivityDuration: number;
  activityEngagementScore: number;
  
  // Webinar Stats
  totalWebinarsHosted: number;
  avgAttendanceRate: number;
  avgRating: number;
  totalReplayViews: number;
  
  // Overall
  overallEngagementScore: number;
  studentsImproving: number;
  studentsDeclining: number;
  studentsAtRisk: number;
}

export const mockComprehensiveStats: ComprehensiveStats = {
  totalAssessmentsCreated: 25,
  avgAssessmentScore: 78.6,
  highestScoringAssessment: "Mindfulness Check-in",
  lowestScoringAssessment: "Conflict Resolution Assessment",
  assessmentCompletionTrend: "up",
  
  totalActivitiesCreated: 54,
  mostPopularCategory: "Emotional Intelligence",
  avgActivityDuration: 22,
  activityEngagementScore: 83,
  
  totalWebinarsHosted: 12,
  avgAttendanceRate: 66.0,
  avgRating: 4.56,
  totalReplayViews: 1469,
  
  overallEngagementScore: 76,
  studentsImproving: 892,
  studentsDeclining: 124,
  studentsAtRisk: 89,
};

export const mockTimeBasedMetrics: Record<string, TimeBasedMetrics> = {
  today: {
    period: "Today",
    totalSubmissions: 145,
    totalCompletions: 210,
    totalAttendance: 0,
    avgSubmissionRate: 88,
    avgCompletionRate: 82,
    avgAttendanceRate: 0,
    newSubmissions: 145,
    trend: "up",
    trendPercentage: 12,
  },
  week: {
    period: "This Week",
    totalSubmissions: 890,
    totalCompletions: 1250,
    totalAttendance: 720,
    avgSubmissionRate: 82,
    avgCompletionRate: 80,
    avgAttendanceRate: 68,
    newSubmissions: 320,
    trend: "up",
    trendPercentage: 8,
  },
  month: {
    period: "This Month",
    totalSubmissions: 4850,
    totalCompletions: 8920,
    totalAttendance: 3200,
    avgSubmissionRate: 77.6,
    avgCompletionRate: 79.3,
    avgAttendanceRate: 64,
    newSubmissions: 1200,
    trend: "up",
    trendPercentage: 5,
  },
  year: {
    period: "This Year",
    totalSubmissions: 45000,
    totalCompletions: 82000,
    totalAttendance: 28000,
    avgSubmissionRate: 75,
    avgCompletionRate: 76,
    avgAttendanceRate: 62,
    newSubmissions: 12000,
    trend: "up",
    trendPercentage: 15,
  },
};

// ============ DETAILED STUDENT PROFILE ============

export interface StudentAssessmentRecord {
  id: string;
  title: string;
  type: string;
  status: "submitted" | "pending" | "overdue";
  score?: number;
  maxScore: number;
  submittedAt?: string;
  dueDate: string;
  timeSpent?: number; // minutes
  attempts: number;
}

export interface StudentActivityRecord {
  id: string;
  title: string;
  category: string;
  status: "completed" | "in_progress" | "not_started";
  completedAt?: string;
  timeSpent?: number; // minutes
  progress: number; // 0-100
}

export interface StudentWebinarRecord {
  id: string;
  title: string;
  date: string;
  status: "attended" | "missed" | "partial";
  watchTime?: number; // minutes
  totalDuration: number; // minutes
  watchPercentage?: number;
  questionsAsked: number;
  rating?: number;
}

export interface StudentStrengthWeakness {
  area: string;
  score: number;
  trend: "improving" | "declining" | "stable";
  recommendation: string;
}

export interface StudentDetailedProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  className: string;
  grade: string;
  section: string;
  rollNumber: string;
  dateOfBirth: string;
  parentName: string;
  parentContact: string;
  joinedDate: string;
  lastActive: string;
  
  // Overall Stats
  overallEngagementScore: number;
  rank: number;
  totalRanked: number;
  streak: number;
  longestStreak: number;
  totalTimeSpent: number; // minutes
  
  // Engagement Summary
  assessments: EngagementData & { avgScore: number };
  activities: EngagementData & { avgTimeSpent: number };
  webinars: EngagementData & { avgWatchTime: number };
  
  // Performance Trend
  monthlyPerformance: { month: string; assessmentScore: number; activityRate: number; webinarRate: number }[];
  
  // Strengths & Weaknesses
  strengths: StudentStrengthWeakness[];
  weaknesses: StudentStrengthWeakness[];
  
  // Recent Activity
  recentAssessments: StudentAssessmentRecord[];
  recentActivities: StudentActivityRecord[];
  recentWebinars: StudentWebinarRecord[];
  
  // Badges & Achievements
  badges: { id: string; name: string; icon: string; earnedAt: string; description: string }[];
  
  // Notes from teachers/counselors
  notes: { id: string; author: string; role: string; date: string; content: string }[];
}

// Mock detailed student profiles
export const mockStudentDetailedProfiles: Record<string, StudentDetailedProfile> = {
  "student-1": {
    id: "student-1",
    name: "Emma Thompson",
    email: "emma.t@school.edu",
    phone: "+1 (555) 123-4567",
    className: "Grade 6 - Section A",
    grade: "6",
    section: "A",
    rollNumber: "6A01",
    dateOfBirth: "2012-05-15",
    parentName: "Sarah Thompson",
    parentContact: "+1 (555) 123-4568",
    joinedDate: "2023-06-01",
    lastActive: "2024-12-17",
    
    overallEngagementScore: 98,
    rank: 1,
    totalRanked: 1250,
    streak: 15,
    longestStreak: 28,
    totalTimeSpent: 2450,
    
    assessments: { done: 5, total: 5, rate: 100, avgScore: 92.4 },
    activities: { done: 9, total: 9, rate: 100, avgTimeSpent: 22 },
    webinars: { done: 4, total: 4, rate: 100, avgWatchTime: 42 },
    
    monthlyPerformance: [
      { month: "Sep", assessmentScore: 85, activityRate: 90, webinarRate: 85 },
      { month: "Oct", assessmentScore: 88, activityRate: 95, webinarRate: 90 },
      { month: "Nov", assessmentScore: 91, activityRate: 98, webinarRate: 95 },
      { month: "Dec", assessmentScore: 95, activityRate: 100, webinarRate: 100 },
    ],
    
    strengths: [
      { area: "Emotional Intelligence", score: 95, trend: "improving", recommendation: "Consider peer mentoring role" },
      { area: "Mindfulness", score: 92, trend: "stable", recommendation: "Maintain current practices" },
      { area: "Communication", score: 90, trend: "improving", recommendation: "Leadership opportunities" },
    ],
    weaknesses: [
      { area: "Conflict Resolution", score: 72, trend: "improving", recommendation: "Role-play exercises recommended" },
    ],
    
    recentAssessments: [
      { id: "a1", title: "Emotional Intelligence Assessment", type: "Self-Assessment", status: "submitted", score: 94, maxScore: 100, submittedAt: "2024-12-16", dueDate: "2024-12-20", timeSpent: 18, attempts: 1 },
      { id: "a2", title: "Stress Management Quiz", type: "Quiz", status: "submitted", score: 88, maxScore: 100, submittedAt: "2024-12-15", dueDate: "2024-12-18", timeSpent: 12, attempts: 1 },
      { id: "a3", title: "Social Skills Evaluation", type: "Peer Assessment", status: "submitted", score: 92, maxScore: 100, submittedAt: "2024-12-14", dueDate: "2024-12-22", timeSpent: 25, attempts: 1 },
    ],
    
    recentActivities: [
      { id: "act1", title: "Daily Gratitude Journal", category: "Mindfulness", status: "completed", completedAt: "2024-12-17", timeSpent: 10, progress: 100 },
      { id: "act2", title: "Breathing Exercises", category: "Stress Relief", status: "completed", completedAt: "2024-12-16", timeSpent: 15, progress: 100 },
      { id: "act3", title: "Peer Support Circle", category: "Social Skills", status: "completed", completedAt: "2024-12-15", timeSpent: 35, progress: 100 },
    ],
    
    recentWebinars: [
      { id: "w1", title: "Managing Exam Stress", date: "2024-12-15", status: "attended", watchTime: 42, totalDuration: 45, watchPercentage: 93, questionsAsked: 2, rating: 5 },
      { id: "w2", title: "Building Healthy Relationships", date: "2024-12-12", status: "attended", watchTime: 58, totalDuration: 60, watchPercentage: 97, questionsAsked: 1, rating: 5 },
    ],
    
    badges: [
      { id: "b1", name: "Perfect Attendance", icon: "🏆", earnedAt: "2024-12-01", description: "Attended all webinars this month" },
      { id: "b2", name: "Quick Learner", icon: "⚡", earnedAt: "2024-11-15", description: "Completed 10 activities in one week" },
      { id: "b3", name: "Top Scorer", icon: "🌟", earnedAt: "2024-11-20", description: "Scored 90%+ in 5 consecutive assessments" },
      { id: "b4", name: "Streak Master", icon: "🔥", earnedAt: "2024-12-10", description: "Maintained 14-day engagement streak" },
    ],
    
    notes: [
      { id: "n1", author: "Ms. Sarah Johnson", role: "Class Teacher", date: "2024-12-15", content: "Emma shows exceptional leadership qualities. Recommended for peer mentoring program." },
      { id: "n2", author: "Dr. Michael Chen", role: "School Counselor", date: "2024-12-10", content: "Great progress in emotional regulation. Continue current approach." },
    ],
  },
  "student-10": {
    id: "student-10",
    name: "James Taylor",
    email: "james.t@school.edu",
    phone: "+1 (555) 987-6543",
    className: "Grade 8 - Section B",
    grade: "8",
    section: "B",
    rollNumber: "8B01",
    dateOfBirth: "2010-08-22",
    parentName: "Robert Taylor",
    parentContact: "+1 (555) 987-6544",
    joinedDate: "2023-06-01",
    lastActive: "2024-12-10",
    
    overallEngagementScore: 38,
    rank: 1180,
    totalRanked: 1250,
    streak: 0,
    longestStreak: 5,
    totalTimeSpent: 420,
    
    assessments: { done: 2, total: 5, rate: 40, avgScore: 58.5 },
    activities: { done: 4, total: 9, rate: 44.4, avgTimeSpent: 12 },
    webinars: { done: 1, total: 4, rate: 25, avgWatchTime: 18 },
    
    monthlyPerformance: [
      { month: "Sep", assessmentScore: 68, activityRate: 65, webinarRate: 50 },
      { month: "Oct", assessmentScore: 62, activityRate: 55, webinarRate: 40 },
      { month: "Nov", assessmentScore: 55, activityRate: 48, webinarRate: 30 },
      { month: "Dec", assessmentScore: 48, activityRate: 40, webinarRate: 25 },
    ],
    
    strengths: [
      { area: "Creative Thinking", score: 75, trend: "stable", recommendation: "Channel into art therapy activities" },
    ],
    weaknesses: [
      { area: "Time Management", score: 35, trend: "declining", recommendation: "Structured schedule needed" },
      { area: "Engagement", score: 38, trend: "declining", recommendation: "One-on-one counseling sessions" },
      { area: "Stress Management", score: 42, trend: "declining", recommendation: "Immediate intervention required" },
    ],
    
    recentAssessments: [
      { id: "a1", title: "Emotional Intelligence Assessment", type: "Self-Assessment", status: "pending", maxScore: 100, dueDate: "2024-12-20", attempts: 0 },
      { id: "a2", title: "Stress Management Quiz", type: "Quiz", status: "overdue", maxScore: 100, dueDate: "2024-12-18", attempts: 0 },
      { id: "a3", title: "Social Skills Evaluation", type: "Peer Assessment", status: "pending", maxScore: 100, dueDate: "2024-12-22", attempts: 0 },
    ],
    
    recentActivities: [
      { id: "act1", title: "Daily Gratitude Journal", category: "Mindfulness", status: "not_started", progress: 0 },
      { id: "act2", title: "Breathing Exercises", category: "Stress Relief", status: "in_progress", timeSpent: 5, progress: 25 },
      { id: "act3", title: "Peer Support Circle", category: "Social Skills", status: "not_started", progress: 0 },
    ],
    
    recentWebinars: [
      { id: "w1", title: "Managing Exam Stress", date: "2024-12-15", status: "missed", totalDuration: 45, questionsAsked: 0 },
      { id: "w2", title: "Building Healthy Relationships", date: "2024-12-12", status: "partial", watchTime: 18, totalDuration: 60, watchPercentage: 30, questionsAsked: 0 },
    ],
    
    badges: [],
    
    notes: [
      { id: "n1", author: "Mr. Michael Brown", role: "Class Teacher", date: "2024-12-12", content: "James has been disengaged lately. Recommend parent meeting." },
      { id: "n2", author: "Dr. Michael Chen", role: "School Counselor", date: "2024-12-08", content: "Scheduled counseling session for next week. Signs of academic stress." },
      { id: "n3", author: "Ms. Principal", role: "Principal", date: "2024-12-05", content: "Flag for immediate attention. Declining performance across all areas." },
    ],
  },
};

// Helper function to get student profile by ID
export const getStudentProfile = (studentId: string): StudentDetailedProfile | undefined => {
  return mockStudentDetailedProfiles[studentId];
};


// ============ DETAILED ASSESSMENT & ACTIVITY VIEWS ============

// Student submission for an assessment
export interface AssessmentStudentSubmission {
  studentId: string;
  studentName: string;
  className: string;
  rollNumber: string;
  status: "submitted" | "pending" | "overdue";
  submittedAt?: string;
  score?: number;
  maxScore: number;
  timeSpent?: number; // minutes
  attempts: number;
  grade?: string;
  feedback?: string;
}

// Detailed Assessment View
export interface AssessmentDetailedView {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  maxScore: number;
  passingScore: number;
  timeLimit?: number; // minutes
  totalQuestions: number;
  
  // Stats
  totalStudentsAssigned: number;
  studentsSubmitted: number;
  studentsPending: number;
  studentsOverdue: number;
  avgScore: number;
  highestScore: number;
  lowestScore: number;
  medianScore: number;
  passRate: number;
  avgTimeSpent: number;
  
  // Score distribution
  scoreDistribution: { range: string; count: number }[];
  
  // Class-wise breakdown
  classWiseStats: { className: string; submitted: number; total: number; avgScore: number }[];
  
  // Student submissions
  submissions: AssessmentStudentSubmission[];
}

// Student completion for an activity
export interface ActivityStudentCompletion {
  studentId: string;
  studentName: string;
  className: string;
  rollNumber: string;
  status: "completed" | "in_progress" | "not_started";
  startedAt?: string;
  completedAt?: string;
  progress: number; // 0-100
  timeSpent?: number; // minutes
  rating?: number; // 1-5
  feedback?: string;
}

// Detailed Activity View
export interface ActivityDetailedView {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  estimatedTime: number; // minutes
  difficulty: "Easy" | "Medium" | "Hard";
  
  // Stats
  totalStudentsAssigned: number;
  studentsCompleted: number;
  studentsInProgress: number;
  studentsNotStarted: number;
  completionRate: number;
  avgTimeSpent: number;
  avgRating: number;
  
  // Progress distribution
  progressDistribution: { range: string; count: number }[];
  
  // Class-wise breakdown
  classWiseStats: { className: string; completed: number; total: number; avgProgress: number }[];
  
  // Student completions
  completions: ActivityStudentCompletion[];
}

// Mock detailed assessment data
export const mockAssessmentDetailedViews: Record<string, AssessmentDetailedView> = {
  "assess-1": {
    id: "assess-1",
    title: "Emotional Intelligence Assessment",
    description: "Comprehensive assessment to evaluate students' emotional intelligence quotient including self-awareness, empathy, and social skills.",
    type: "Self-Assessment",
    category: "Emotional Intelligence",
    createdBy: "Dr. Sarah Wilson",
    createdAt: "2024-12-01",
    dueDate: "2024-12-20",
    maxScore: 100,
    passingScore: 60,
    timeLimit: 30,
    totalQuestions: 25,
    
    totalStudentsAssigned: 1250,
    studentsSubmitted: 980,
    studentsPending: 180,
    studentsOverdue: 90,
    avgScore: 78.5,
    highestScore: 98,
    lowestScore: 42,
    medianScore: 80,
    passRate: 85.2,
    avgTimeSpent: 18,
    
    scoreDistribution: [
      { range: "90-100", count: 156 },
      { range: "80-89", count: 284 },
      { range: "70-79", count: 312 },
      { range: "60-69", count: 145 },
      { range: "50-59", count: 58 },
      { range: "Below 50", count: 25 },
    ],
    
    classWiseStats: [
      { className: "Grade 6 - Section A", submitted: 30, total: 32, avgScore: 82.5 },
      { className: "Grade 6 - Section B", submitted: 26, total: 30, avgScore: 76.8 },
      { className: "Grade 7 - Section A", submitted: 34, total: 35, avgScore: 85.2 },
      { className: "Grade 7 - Section B", submitted: 28, total: 33, avgScore: 74.5 },
      { className: "Grade 8 - Section A", submitted: 32, total: 34, avgScore: 80.1 },
      { className: "Grade 8 - Section B", submitted: 24, total: 31, avgScore: 71.3 },
    ],
    
    submissions: [
      { studentId: "student-1", studentName: "Emma Thompson", className: "Grade 6 - Section A", rollNumber: "6A01", status: "submitted", submittedAt: "2024-12-16T10:30:00", score: 94, maxScore: 100, timeSpent: 22, attempts: 1, grade: "A", feedback: "Excellent understanding of emotional concepts" },
      { studentId: "student-2", studentName: "Liam Anderson", className: "Grade 6 - Section A", rollNumber: "6A02", status: "submitted", submittedAt: "2024-12-15T14:20:00", score: 78, maxScore: 100, timeSpent: 25, attempts: 1, grade: "B", feedback: "Good effort, needs work on empathy section" },
      { studentId: "student-3", studentName: "Sophia Martinez", className: "Grade 6 - Section A", rollNumber: "6A03", status: "submitted", submittedAt: "2024-12-16T09:15:00", score: 88, maxScore: 100, timeSpent: 20, attempts: 1, grade: "A", feedback: "Strong performance overall" },
      { studentId: "student-4", studentName: "Noah Williams", className: "Grade 6 - Section B", rollNumber: "6B01", status: "pending", maxScore: 100, attempts: 0 },
      { studentId: "student-5", studentName: "Olivia Johnson", className: "Grade 7 - Section A", rollNumber: "7A01", status: "submitted", submittedAt: "2024-12-14T11:45:00", score: 96, maxScore: 100, timeSpent: 18, attempts: 1, grade: "A+", feedback: "Outstanding performance" },
      { studentId: "student-6", studentName: "Ethan Brown", className: "Grade 7 - Section A", rollNumber: "7A02", status: "submitted", submittedAt: "2024-12-15T16:30:00", score: 82, maxScore: 100, timeSpent: 24, attempts: 1, grade: "B+", feedback: "Good understanding" },
      { studentId: "student-7", studentName: "Ava Davis", className: "Grade 7 - Section B", rollNumber: "7B01", status: "submitted", submittedAt: "2024-12-16T08:00:00", score: 75, maxScore: 100, timeSpent: 28, attempts: 2, grade: "B", feedback: "Improved on second attempt" },
      { studentId: "student-8", studentName: "Mason Garcia", className: "Grade 8 - Section A", rollNumber: "8A01", status: "submitted", submittedAt: "2024-12-13T13:20:00", score: 92, maxScore: 100, timeSpent: 19, attempts: 1, grade: "A", feedback: "Excellent work" },
      { studentId: "student-9", studentName: "Isabella Wilson", className: "Grade 8 - Section A", rollNumber: "8A02", status: "submitted", submittedAt: "2024-12-14T15:10:00", score: 85, maxScore: 100, timeSpent: 21, attempts: 1, grade: "A-", feedback: "Very good performance" },
      { studentId: "student-10", studentName: "James Taylor", className: "Grade 8 - Section B", rollNumber: "8B01", status: "overdue", maxScore: 100, attempts: 0 },
    ],
  },
  "assess-2": {
    id: "assess-2",
    title: "Stress Management Quiz",
    description: "Quick quiz to assess students' knowledge and application of stress management techniques.",
    type: "Quiz",
    category: "Stress Management",
    createdBy: "Ms. Emily Rodriguez",
    createdAt: "2024-12-05",
    dueDate: "2024-12-18",
    maxScore: 100,
    passingScore: 50,
    timeLimit: 15,
    totalQuestions: 15,
    
    totalStudentsAssigned: 1250,
    studentsSubmitted: 1120,
    studentsPending: 80,
    studentsOverdue: 50,
    avgScore: 82.3,
    highestScore: 100,
    lowestScore: 38,
    medianScore: 84,
    passRate: 91.5,
    avgTimeSpent: 12,
    
    scoreDistribution: [
      { range: "90-100", count: 312 },
      { range: "80-89", count: 398 },
      { range: "70-79", count: 256 },
      { range: "60-69", count: 98 },
      { range: "50-59", count: 42 },
      { range: "Below 50", count: 14 },
    ],
    
    classWiseStats: [
      { className: "Grade 6 - Section A", submitted: 31, total: 32, avgScore: 85.2 },
      { className: "Grade 6 - Section B", submitted: 28, total: 30, avgScore: 80.5 },
      { className: "Grade 7 - Section A", submitted: 35, total: 35, avgScore: 88.1 },
      { className: "Grade 7 - Section B", submitted: 30, total: 33, avgScore: 79.8 },
      { className: "Grade 8 - Section A", submitted: 33, total: 34, avgScore: 83.4 },
      { className: "Grade 8 - Section B", submitted: 27, total: 31, avgScore: 76.2 },
    ],
    
    submissions: [
      { studentId: "student-1", studentName: "Emma Thompson", className: "Grade 6 - Section A", rollNumber: "6A01", status: "submitted", submittedAt: "2024-12-15T09:00:00", score: 92, maxScore: 100, timeSpent: 10, attempts: 1, grade: "A" },
      { studentId: "student-5", studentName: "Olivia Johnson", className: "Grade 7 - Section A", rollNumber: "7A01", status: "submitted", submittedAt: "2024-12-14T10:30:00", score: 100, maxScore: 100, timeSpent: 8, attempts: 1, grade: "A+" },
      { studentId: "student-8", studentName: "Mason Garcia", className: "Grade 8 - Section A", rollNumber: "8A01", status: "submitted", submittedAt: "2024-12-13T14:00:00", score: 95, maxScore: 100, timeSpent: 9, attempts: 1, grade: "A" },
    ],
  },
};

// Mock detailed activity data
export const mockActivityDetailedViews: Record<string, ActivityDetailedView> = {
  "activity-1": {
    id: "activity-1",
    title: "Daily Gratitude Journal",
    description: "Students maintain a daily journal documenting things they are grateful for, promoting positive thinking and mindfulness.",
    category: "Mindfulness",
    type: "Journal",
    createdBy: "Ms. Priya Sharma",
    createdAt: "2024-11-01",
    dueDate: "Ongoing",
    estimatedTime: 10,
    difficulty: "Easy",
    
    totalStudentsAssigned: 1250,
    studentsCompleted: 1050,
    studentsInProgress: 150,
    studentsNotStarted: 50,
    completionRate: 84.0,
    avgTimeSpent: 12,
    avgRating: 4.5,
    
    progressDistribution: [
      { range: "100%", count: 1050 },
      { range: "75-99%", count: 85 },
      { range: "50-74%", count: 45 },
      { range: "25-49%", count: 20 },
      { range: "1-24%", count: 0 },
      { range: "0%", count: 50 },
    ],
    
    classWiseStats: [
      { className: "Grade 6 - Section A", completed: 30, total: 32, avgProgress: 95 },
      { className: "Grade 6 - Section B", completed: 24, total: 30, avgProgress: 82 },
      { className: "Grade 7 - Section A", completed: 34, total: 35, avgProgress: 98 },
      { className: "Grade 7 - Section B", completed: 27, total: 33, avgProgress: 85 },
      { className: "Grade 8 - Section A", completed: 32, total: 34, avgProgress: 96 },
      { className: "Grade 8 - Section B", completed: 22, total: 31, avgProgress: 75 },
    ],
    
    completions: [
      { studentId: "student-1", studentName: "Emma Thompson", className: "Grade 6 - Section A", rollNumber: "6A01", status: "completed", startedAt: "2024-11-01", completedAt: "2024-12-17", progress: 100, timeSpent: 450, rating: 5, feedback: "Love this activity!" },
      { studentId: "student-2", studentName: "Liam Anderson", className: "Grade 6 - Section A", rollNumber: "6A02", status: "completed", startedAt: "2024-11-02", completedAt: "2024-12-15", progress: 100, timeSpent: 380, rating: 4 },
      { studentId: "student-3", studentName: "Sophia Martinez", className: "Grade 6 - Section A", rollNumber: "6A03", status: "completed", startedAt: "2024-11-01", completedAt: "2024-12-16", progress: 100, timeSpent: 420, rating: 5, feedback: "Very helpful for my mindset" },
      { studentId: "student-4", studentName: "Noah Williams", className: "Grade 6 - Section B", rollNumber: "6B01", status: "in_progress", startedAt: "2024-11-15", progress: 45, timeSpent: 120 },
      { studentId: "student-5", studentName: "Olivia Johnson", className: "Grade 7 - Section A", rollNumber: "7A01", status: "completed", startedAt: "2024-11-01", completedAt: "2024-12-17", progress: 100, timeSpent: 480, rating: 5 },
      { studentId: "student-6", studentName: "Ethan Brown", className: "Grade 7 - Section A", rollNumber: "7A02", status: "completed", startedAt: "2024-11-03", completedAt: "2024-12-14", progress: 100, timeSpent: 350, rating: 4 },
      { studentId: "student-7", studentName: "Ava Davis", className: "Grade 7 - Section B", rollNumber: "7B01", status: "in_progress", startedAt: "2024-11-10", progress: 72, timeSpent: 210 },
      { studentId: "student-8", studentName: "Mason Garcia", className: "Grade 8 - Section A", rollNumber: "8A01", status: "completed", startedAt: "2024-11-01", completedAt: "2024-12-17", progress: 100, timeSpent: 510, rating: 5, feedback: "Great for daily reflection" },
      { studentId: "student-9", studentName: "Isabella Wilson", className: "Grade 8 - Section A", rollNumber: "8A02", status: "completed", startedAt: "2024-11-02", completedAt: "2024-12-15", progress: 100, timeSpent: 390, rating: 4 },
      { studentId: "student-10", studentName: "James Taylor", className: "Grade 8 - Section B", rollNumber: "8B01", status: "not_started", progress: 0 },
    ],
  },
  "activity-2": {
    id: "activity-2",
    title: "Breathing Exercises",
    description: "Guided breathing exercises to help students manage stress and anxiety through controlled breathing techniques.",
    category: "Stress Relief",
    type: "Exercise",
    createdBy: "Dr. Michael Chen",
    createdAt: "2024-11-15",
    dueDate: "2024-12-20",
    estimatedTime: 15,
    difficulty: "Easy",
    
    totalStudentsAssigned: 1250,
    studentsCompleted: 920,
    studentsInProgress: 200,
    studentsNotStarted: 130,
    completionRate: 73.6,
    avgTimeSpent: 18,
    avgRating: 4.3,
    
    progressDistribution: [
      { range: "100%", count: 920 },
      { range: "75-99%", count: 120 },
      { range: "50-74%", count: 55 },
      { range: "25-49%", count: 25 },
      { range: "1-24%", count: 0 },
      { range: "0%", count: 130 },
    ],
    
    classWiseStats: [
      { className: "Grade 6 - Section A", completed: 28, total: 32, avgProgress: 90 },
      { className: "Grade 6 - Section B", completed: 20, total: 30, avgProgress: 72 },
      { className: "Grade 7 - Section A", completed: 32, total: 35, avgProgress: 94 },
      { className: "Grade 7 - Section B", completed: 24, total: 33, avgProgress: 78 },
      { className: "Grade 8 - Section A", completed: 30, total: 34, avgProgress: 92 },
      { className: "Grade 8 - Section B", completed: 18, total: 31, avgProgress: 65 },
    ],
    
    completions: [
      { studentId: "student-1", studentName: "Emma Thompson", className: "Grade 6 - Section A", rollNumber: "6A01", status: "completed", startedAt: "2024-11-16", completedAt: "2024-12-10", progress: 100, timeSpent: 180, rating: 5 },
      { studentId: "student-5", studentName: "Olivia Johnson", className: "Grade 7 - Section A", rollNumber: "7A01", status: "completed", startedAt: "2024-11-15", completedAt: "2024-12-08", progress: 100, timeSpent: 165, rating: 5 },
      { studentId: "student-10", studentName: "James Taylor", className: "Grade 8 - Section B", rollNumber: "8B01", status: "in_progress", startedAt: "2024-12-01", progress: 25, timeSpent: 30 },
    ],
  },
};

// Helper functions
export const getAssessmentDetails = (assessmentId: string): AssessmentDetailedView | undefined => {
  return mockAssessmentDetailedViews[assessmentId];
};

export const getActivityDetails = (activityId: string): ActivityDetailedView | undefined => {
  return mockActivityDetailedViews[activityId];
};


// ============ DETAILED WEBINAR VIEW ============

// Student attendance for a webinar
export interface WebinarStudentAttendance {
  studentId: string;
  studentName: string;
  className: string;
  rollNumber: string;
  status: "attended" | "missed" | "partial";
  joinedAt?: string;
  leftAt?: string;
  watchTime?: number; // minutes
  watchPercentage?: number;
  questionsAsked: number;
  pollsAnswered: number;
  rating?: number;
  feedback?: string;
}

// Detailed Webinar View
export interface WebinarDetailedView {
  id: string;
  title: string;
  description: string;
  topic: string;
  presenter: string;
  presenterRole: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  recordingUrl?: string;
  
  // Stats
  totalStudentsInvited: number;
  studentsAttended: number;
  studentsMissed: number;
  studentsPartial: number;
  attendanceRate: number;
  avgWatchTime: number;
  avgWatchPercentage: number;
  peakViewers: number;
  totalQuestionsAsked: number;
  totalPollResponses: number;
  avgRating: number;
  replayViews: number;
  
  // Engagement timeline
  engagementTimeline: { minute: number; viewers: number }[];
  
  // Class-wise breakdown
  classWiseStats: { className: string; attended: number; total: number; avgWatchTime: number }[];
  
  // Student attendance
  attendance: WebinarStudentAttendance[];
}

// Mock detailed webinar data
export const mockWebinarDetailedViews: Record<string, WebinarDetailedView> = {
  "webinar-1": {
    id: "webinar-1",
    title: "Managing Exam Stress",
    description: "Learn effective techniques to manage stress during exam periods. This session covers breathing exercises, time management, and positive mindset strategies.",
    topic: "Stress Management",
    presenter: "Dr. Sarah Wilson",
    presenterRole: "School Psychologist",
    scheduledDate: "2024-12-15",
    startTime: "10:00 AM",
    endTime: "10:45 AM",
    duration: 45,
    recordingUrl: "/recordings/webinar-1.mp4",
    
    totalStudentsInvited: 1250,
    studentsAttended: 890,
    studentsMissed: 280,
    studentsPartial: 80,
    attendanceRate: 71.2,
    avgWatchTime: 38,
    avgWatchPercentage: 84.4,
    peakViewers: 920,
    totalQuestionsAsked: 45,
    totalPollResponses: 712,
    avgRating: 4.5,
    replayViews: 234,
    
    engagementTimeline: [
      { minute: 0, viewers: 650 },
      { minute: 5, viewers: 820 },
      { minute: 10, viewers: 890 },
      { minute: 15, viewers: 920 },
      { minute: 20, viewers: 905 },
      { minute: 25, viewers: 880 },
      { minute: 30, viewers: 860 },
      { minute: 35, viewers: 840 },
      { minute: 40, viewers: 810 },
      { minute: 45, viewers: 780 },
    ],
    
    classWiseStats: [
      { className: "Grade 6 - Section A", attended: 28, total: 32, avgWatchTime: 42 },
      { className: "Grade 6 - Section B", attended: 22, total: 30, avgWatchTime: 35 },
      { className: "Grade 7 - Section A", attended: 32, total: 35, avgWatchTime: 44 },
      { className: "Grade 7 - Section B", attended: 24, total: 33, avgWatchTime: 36 },
      { className: "Grade 8 - Section A", attended: 30, total: 34, avgWatchTime: 40 },
      { className: "Grade 8 - Section B", attended: 18, total: 31, avgWatchTime: 32 },
    ],
    
    attendance: [
      { studentId: "student-1", studentName: "Emma Thompson", className: "Grade 6 - Section A", rollNumber: "6A01", status: "attended", joinedAt: "9:58 AM", leftAt: "10:45 AM", watchTime: 45, watchPercentage: 100, questionsAsked: 2, pollsAnswered: 3, rating: 5, feedback: "Very helpful session!" },
      { studentId: "student-2", studentName: "Liam Anderson", className: "Grade 6 - Section A", rollNumber: "6A02", status: "attended", joinedAt: "10:05 AM", leftAt: "10:42 AM", watchTime: 37, watchPercentage: 82, questionsAsked: 0, pollsAnswered: 2, rating: 4 },
      { studentId: "student-3", studentName: "Sophia Martinez", className: "Grade 6 - Section A", rollNumber: "6A03", status: "attended", joinedAt: "10:00 AM", leftAt: "10:45 AM", watchTime: 45, watchPercentage: 100, questionsAsked: 1, pollsAnswered: 3, rating: 5 },
      { studentId: "student-4", studentName: "Noah Williams", className: "Grade 6 - Section B", rollNumber: "6B01", status: "missed", questionsAsked: 0, pollsAnswered: 0 },
      { studentId: "student-5", studentName: "Olivia Johnson", className: "Grade 7 - Section A", rollNumber: "7A01", status: "attended", joinedAt: "9:55 AM", leftAt: "10:45 AM", watchTime: 45, watchPercentage: 100, questionsAsked: 3, pollsAnswered: 3, rating: 5, feedback: "Excellent tips!" },
      { studentId: "student-6", studentName: "Ethan Brown", className: "Grade 7 - Section A", rollNumber: "7A02", status: "attended", joinedAt: "10:10 AM", leftAt: "10:40 AM", watchTime: 30, watchPercentage: 67, questionsAsked: 0, pollsAnswered: 2, rating: 4 },
      { studentId: "student-7", studentName: "Ava Davis", className: "Grade 7 - Section B", rollNumber: "7B01", status: "partial", joinedAt: "10:20 AM", leftAt: "10:35 AM", watchTime: 15, watchPercentage: 33, questionsAsked: 0, pollsAnswered: 1 },
      { studentId: "student-8", studentName: "Mason Garcia", className: "Grade 8 - Section A", rollNumber: "8A01", status: "attended", joinedAt: "9:58 AM", leftAt: "10:45 AM", watchTime: 45, watchPercentage: 100, questionsAsked: 2, pollsAnswered: 3, rating: 5 },
      { studentId: "student-9", studentName: "Isabella Wilson", className: "Grade 8 - Section A", rollNumber: "8A02", status: "attended", joinedAt: "10:02 AM", leftAt: "10:43 AM", watchTime: 41, watchPercentage: 91, questionsAsked: 1, pollsAnswered: 3, rating: 4 },
      { studentId: "student-10", studentName: "James Taylor", className: "Grade 8 - Section B", rollNumber: "8B01", status: "missed", questionsAsked: 0, pollsAnswered: 0 },
    ],
  },
  "webinar-2": {
    id: "webinar-2",
    title: "Building Healthy Relationships",
    description: "Understanding the foundations of healthy relationships with peers, family, and teachers. Learn communication skills and conflict resolution.",
    topic: "Social Skills",
    presenter: "Ms. Emily Rodriguez",
    presenterRole: "School Counselor",
    scheduledDate: "2024-12-12",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    duration: 60,
    recordingUrl: "/recordings/webinar-2.mp4",
    
    totalStudentsInvited: 1250,
    studentsAttended: 720,
    studentsMissed: 430,
    studentsPartial: 100,
    attendanceRate: 57.6,
    avgWatchTime: 52,
    avgWatchPercentage: 86.7,
    peakViewers: 780,
    totalQuestionsAsked: 62,
    totalPollResponses: 645,
    avgRating: 4.7,
    replayViews: 312,
    
    engagementTimeline: [
      { minute: 0, viewers: 520 },
      { minute: 10, viewers: 680 },
      { minute: 20, viewers: 750 },
      { minute: 30, viewers: 780 },
      { minute: 40, viewers: 760 },
      { minute: 50, viewers: 720 },
      { minute: 60, viewers: 690 },
    ],
    
    classWiseStats: [
      { className: "Grade 6 - Section A", attended: 26, total: 32, avgWatchTime: 55 },
      { className: "Grade 6 - Section B", attended: 18, total: 30, avgWatchTime: 48 },
      { className: "Grade 7 - Section A", attended: 30, total: 35, avgWatchTime: 58 },
      { className: "Grade 7 - Section B", attended: 20, total: 33, avgWatchTime: 50 },
      { className: "Grade 8 - Section A", attended: 28, total: 34, avgWatchTime: 54 },
      { className: "Grade 8 - Section B", attended: 15, total: 31, avgWatchTime: 45 },
    ],
    
    attendance: [
      { studentId: "student-1", studentName: "Emma Thompson", className: "Grade 6 - Section A", rollNumber: "6A01", status: "attended", joinedAt: "1:58 PM", leftAt: "3:00 PM", watchTime: 60, watchPercentage: 100, questionsAsked: 1, pollsAnswered: 4, rating: 5 },
      { studentId: "student-5", studentName: "Olivia Johnson", className: "Grade 7 - Section A", rollNumber: "7A01", status: "attended", joinedAt: "2:00 PM", leftAt: "3:00 PM", watchTime: 60, watchPercentage: 100, questionsAsked: 2, pollsAnswered: 4, rating: 5 },
      { studentId: "student-10", studentName: "James Taylor", className: "Grade 8 - Section B", rollNumber: "8B01", status: "partial", joinedAt: "2:30 PM", leftAt: "2:48 PM", watchTime: 18, watchPercentage: 30, questionsAsked: 0, pollsAnswered: 0 },
    ],
  },
  "webinar-3": {
    id: "webinar-3",
    title: "Digital Wellness & Screen Time",
    description: "Understanding the impact of digital devices on mental health and learning effective strategies for balanced screen time.",
    topic: "Digital Wellness",
    presenter: "Dr. Michael Chen",
    presenterRole: "Child Psychologist",
    scheduledDate: "2024-12-10",
    startTime: "11:00 AM",
    endTime: "11:50 AM",
    duration: 50,
    recordingUrl: "/recordings/webinar-3.mp4",
    
    totalStudentsInvited: 1250,
    studentsAttended: 650,
    studentsMissed: 500,
    studentsPartial: 100,
    attendanceRate: 52.0,
    avgWatchTime: 42,
    avgWatchPercentage: 84.0,
    peakViewers: 690,
    totalQuestionsAsked: 38,
    totalPollResponses: 580,
    avgRating: 4.2,
    replayViews: 456,
    
    engagementTimeline: [
      { minute: 0, viewers: 480 },
      { minute: 10, viewers: 620 },
      { minute: 20, viewers: 680 },
      { minute: 30, viewers: 690 },
      { minute: 40, viewers: 660 },
      { minute: 50, viewers: 620 },
    ],
    
    classWiseStats: [
      { className: "Grade 6 - Section A", attended: 24, total: 32, avgWatchTime: 45 },
      { className: "Grade 6 - Section B", attended: 16, total: 30, avgWatchTime: 38 },
      { className: "Grade 7 - Section A", attended: 28, total: 35, avgWatchTime: 46 },
      { className: "Grade 7 - Section B", attended: 18, total: 33, avgWatchTime: 40 },
      { className: "Grade 8 - Section A", attended: 26, total: 34, avgWatchTime: 44 },
      { className: "Grade 8 - Section B", attended: 14, total: 31, avgWatchTime: 35 },
    ],
    
    attendance: [
      { studentId: "student-1", studentName: "Emma Thompson", className: "Grade 6 - Section A", rollNumber: "6A01", status: "attended", joinedAt: "10:58 AM", leftAt: "11:50 AM", watchTime: 50, watchPercentage: 100, questionsAsked: 1, pollsAnswered: 3, rating: 4 },
      { studentId: "student-5", studentName: "Olivia Johnson", className: "Grade 7 - Section A", rollNumber: "7A01", status: "attended", joinedAt: "11:00 AM", leftAt: "11:50 AM", watchTime: 50, watchPercentage: 100, questionsAsked: 2, pollsAnswered: 3, rating: 5 },
    ],
  },
  "webinar-4": {
    id: "webinar-4",
    title: "Career Guidance Session",
    description: "Exploring various career paths and understanding how to align interests with future opportunities.",
    topic: "Career Development",
    presenter: "Mr. James Wilson",
    presenterRole: "Career Counselor",
    scheduledDate: "2024-12-08",
    startTime: "3:00 PM",
    endTime: "4:30 PM",
    duration: 90,
    recordingUrl: "/recordings/webinar-4.mp4",
    
    totalStudentsInvited: 500,
    studentsAttended: 420,
    studentsMissed: 60,
    studentsPartial: 20,
    attendanceRate: 84.0,
    avgWatchTime: 78,
    avgWatchPercentage: 86.7,
    peakViewers: 445,
    totalQuestionsAsked: 89,
    totalPollResponses: 398,
    avgRating: 4.8,
    replayViews: 178,
    
    engagementTimeline: [
      { minute: 0, viewers: 380 },
      { minute: 15, viewers: 420 },
      { minute: 30, viewers: 445 },
      { minute: 45, viewers: 440 },
      { minute: 60, viewers: 425 },
      { minute: 75, viewers: 410 },
      { minute: 90, viewers: 395 },
    ],
    
    classWiseStats: [
      { className: "Grade 8 - Section A", attended: 32, total: 34, avgWatchTime: 82 },
      { className: "Grade 8 - Section B", attended: 26, total: 31, avgWatchTime: 75 },
    ],
    
    attendance: [
      { studentId: "student-8", studentName: "Mason Garcia", className: "Grade 8 - Section A", rollNumber: "8A01", status: "attended", joinedAt: "2:55 PM", leftAt: "4:30 PM", watchTime: 90, watchPercentage: 100, questionsAsked: 4, pollsAnswered: 5, rating: 5, feedback: "Very informative!" },
      { studentId: "student-9", studentName: "Isabella Wilson", className: "Grade 8 - Section A", rollNumber: "8A02", status: "attended", joinedAt: "3:00 PM", leftAt: "4:28 PM", watchTime: 88, watchPercentage: 98, questionsAsked: 2, pollsAnswered: 5, rating: 5 },
    ],
  },
  "webinar-5": {
    id: "webinar-5",
    title: "Parent-Child Communication",
    description: "Strategies for improving communication between parents and children for better understanding and support.",
    topic: "Family Relationships",
    presenter: "Dr. Priya Sharma",
    presenterRole: "Family Therapist",
    scheduledDate: "2024-12-05",
    startTime: "4:00 PM",
    endTime: "4:55 PM",
    duration: 55,
    recordingUrl: "/recordings/webinar-5.mp4",
    
    totalStudentsInvited: 800,
    studentsAttended: 520,
    studentsMissed: 220,
    studentsPartial: 60,
    attendanceRate: 65.0,
    avgWatchTime: 48,
    avgWatchPercentage: 87.3,
    peakViewers: 560,
    totalQuestionsAsked: 54,
    totalPollResponses: 485,
    avgRating: 4.6,
    replayViews: 289,
    
    engagementTimeline: [
      { minute: 0, viewers: 420 },
      { minute: 10, viewers: 510 },
      { minute: 20, viewers: 550 },
      { minute: 30, viewers: 560 },
      { minute: 40, viewers: 540 },
      { minute: 55, viewers: 510 },
    ],
    
    classWiseStats: [
      { className: "Grade 6 - Section A", attended: 25, total: 32, avgWatchTime: 50 },
      { className: "Grade 6 - Section B", attended: 18, total: 30, avgWatchTime: 45 },
      { className: "Grade 7 - Section A", attended: 28, total: 35, avgWatchTime: 52 },
      { className: "Grade 7 - Section B", attended: 20, total: 33, avgWatchTime: 46 },
    ],
    
    attendance: [
      { studentId: "student-1", studentName: "Emma Thompson", className: "Grade 6 - Section A", rollNumber: "6A01", status: "attended", joinedAt: "3:58 PM", leftAt: "4:55 PM", watchTime: 55, watchPercentage: 100, questionsAsked: 1, pollsAnswered: 3, rating: 5 },
      { studentId: "student-5", studentName: "Olivia Johnson", className: "Grade 7 - Section A", rollNumber: "7A01", status: "attended", joinedAt: "4:00 PM", leftAt: "4:55 PM", watchTime: 55, watchPercentage: 100, questionsAsked: 2, pollsAnswered: 3, rating: 5 },
    ],
  },
};

// Helper function
export const getWebinarDetails = (webinarId: string): WebinarDetailedView | undefined => {
  return mockWebinarDetailedViews[webinarId];
};


// ============ ASSESSMENT QUESTIONS & RESPONSES ============

export interface AssessmentQuestion {
  id: string;
  questionNumber: number;
  question: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "rating_scale" | "essay";
  options?: string[];
  correctAnswer?: string;
  points: number;
  category: string;
}

export interface StudentQuestionResponse {
  questionId: string;
  studentAnswer: string;
  isCorrect?: boolean;
  pointsEarned: number;
  timeSpent?: number; // seconds
}

export interface StudentAssessmentResponse {
  studentId: string;
  studentName: string;
  className: string;
  rollNumber: string;
  submittedAt: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number; // minutes
  responses: StudentQuestionResponse[];
}

export interface AssessmentQuestionsData {
  assessmentId: string;
  questions: AssessmentQuestion[];
  studentResponses: StudentAssessmentResponse[];
}

// Mock assessment questions data
export const mockAssessmentQuestions: Record<string, AssessmentQuestionsData> = {
  "assess-1": {
    assessmentId: "assess-1",
    questions: [
      { id: "q1", questionNumber: 1, question: "How well do you recognize your own emotions when they occur?", type: "rating_scale", options: ["1 - Never", "2 - Rarely", "3 - Sometimes", "4 - Often", "5 - Always"], points: 4, category: "Self-Awareness" },
      { id: "q2", questionNumber: 2, question: "When you feel angry, what is the best first step to manage it?", type: "multiple_choice", options: ["A) Express it immediately", "B) Take deep breaths and pause", "C) Ignore the feeling", "D) Blame others"], correctAnswer: "B) Take deep breaths and pause", points: 4, category: "Self-Regulation" },
      { id: "q3", questionNumber: 3, question: "Empathy means understanding and sharing the feelings of others.", type: "true_false", options: ["True", "False"], correctAnswer: "True", points: 4, category: "Empathy" },
      { id: "q4", questionNumber: 4, question: "Which of the following is NOT a component of emotional intelligence?", type: "multiple_choice", options: ["A) Self-awareness", "B) Social skills", "C) Physical strength", "D) Motivation"], correctAnswer: "C) Physical strength", points: 4, category: "General Knowledge" },
      { id: "q5", questionNumber: 5, question: "Describe a situation where you successfully managed a difficult emotion.", type: "short_answer", points: 8, category: "Self-Reflection" },
      { id: "q6", questionNumber: 6, question: "How often do you consider others' feelings before speaking?", type: "rating_scale", options: ["1 - Never", "2 - Rarely", "3 - Sometimes", "4 - Often", "5 - Always"], points: 4, category: "Social Awareness" },
      { id: "q7", questionNumber: 7, question: "Active listening involves only hearing words, not observing body language.", type: "true_false", options: ["True", "False"], correctAnswer: "False", points: 4, category: "Communication" },
      { id: "q8", questionNumber: 8, question: "What motivates you to achieve your goals?", type: "essay", points: 12, category: "Motivation" },
      { id: "q9", questionNumber: 9, question: "When a friend is upset, the best approach is to:", type: "multiple_choice", options: ["A) Tell them to stop being sad", "B) Listen and validate their feelings", "C) Change the subject", "D) Leave them alone"], correctAnswer: "B) Listen and validate their feelings", points: 4, category: "Empathy" },
      { id: "q10", questionNumber: 10, question: "Rate your ability to stay calm under pressure.", type: "rating_scale", options: ["1 - Very Poor", "2 - Poor", "3 - Average", "4 - Good", "5 - Excellent"], points: 4, category: "Self-Regulation" },
    ],
    studentResponses: [
      {
        studentId: "student-1",
        studentName: "Emma Thompson",
        className: "Grade 6 - Section A",
        rollNumber: "6A01",
        submittedAt: "2024-12-16T10:30:00",
        totalScore: 94,
        maxScore: 100,
        percentage: 94,
        timeSpent: 22,
        responses: [
          { questionId: "q1", studentAnswer: "5 - Always", pointsEarned: 4, timeSpent: 45 },
          { questionId: "q2", studentAnswer: "B) Take deep breaths and pause", isCorrect: true, pointsEarned: 4, timeSpent: 60 },
          { questionId: "q3", studentAnswer: "True", isCorrect: true, pointsEarned: 4, timeSpent: 30 },
          { questionId: "q4", studentAnswer: "C) Physical strength", isCorrect: true, pointsEarned: 4, timeSpent: 55 },
          { questionId: "q5", studentAnswer: "When I was nervous before my presentation, I practiced deep breathing and positive self-talk. I reminded myself that I had prepared well and focused on sharing my knowledge rather than worrying about judgment.", pointsEarned: 8, timeSpent: 180 },
          { questionId: "q6", studentAnswer: "4 - Often", pointsEarned: 4, timeSpent: 40 },
          { questionId: "q7", studentAnswer: "False", isCorrect: true, pointsEarned: 4, timeSpent: 35 },
          { questionId: "q8", studentAnswer: "I am motivated by my desire to learn new things and help others. When I achieve a goal, I feel proud and it encourages me to set new challenges. My family's support also motivates me to do my best.", pointsEarned: 10, timeSpent: 240 },
          { questionId: "q9", studentAnswer: "B) Listen and validate their feelings", isCorrect: true, pointsEarned: 4, timeSpent: 50 },
          { questionId: "q10", studentAnswer: "4 - Good", pointsEarned: 4, timeSpent: 35 },
        ]
      },
      {
        studentId: "student-2",
        studentName: "Liam Anderson",
        className: "Grade 6 - Section A",
        rollNumber: "6A02",
        submittedAt: "2024-12-15T14:20:00",
        totalScore: 78,
        maxScore: 100,
        percentage: 78,
        timeSpent: 25,
        responses: [
          { questionId: "q1", studentAnswer: "3 - Sometimes", pointsEarned: 3, timeSpent: 50 },
          { questionId: "q2", studentAnswer: "B) Take deep breaths and pause", isCorrect: true, pointsEarned: 4, timeSpent: 70 },
          { questionId: "q3", studentAnswer: "True", isCorrect: true, pointsEarned: 4, timeSpent: 25 },
          { questionId: "q4", studentAnswer: "C) Physical strength", isCorrect: true, pointsEarned: 4, timeSpent: 65 },
          { questionId: "q5", studentAnswer: "I got angry at my brother but I walked away to calm down.", pointsEarned: 5, timeSpent: 120 },
          { questionId: "q6", studentAnswer: "3 - Sometimes", pointsEarned: 3, timeSpent: 45 },
          { questionId: "q7", studentAnswer: "True", isCorrect: false, pointsEarned: 0, timeSpent: 40 },
          { questionId: "q8", studentAnswer: "I want to make my parents proud and get good grades so I can have a good future.", pointsEarned: 7, timeSpent: 180 },
          { questionId: "q9", studentAnswer: "B) Listen and validate their feelings", isCorrect: true, pointsEarned: 4, timeSpent: 55 },
          { questionId: "q10", studentAnswer: "3 - Average", pointsEarned: 3, timeSpent: 40 },
        ]
      },
      {
        studentId: "student-5",
        studentName: "Olivia Johnson",
        className: "Grade 7 - Section A",
        rollNumber: "7A01",
        submittedAt: "2024-12-14T11:45:00",
        totalScore: 96,
        maxScore: 100,
        percentage: 96,
        timeSpent: 18,
        responses: [
          { questionId: "q1", studentAnswer: "5 - Always", pointsEarned: 4, timeSpent: 40 },
          { questionId: "q2", studentAnswer: "B) Take deep breaths and pause", isCorrect: true, pointsEarned: 4, timeSpent: 50 },
          { questionId: "q3", studentAnswer: "True", isCorrect: true, pointsEarned: 4, timeSpent: 20 },
          { questionId: "q4", studentAnswer: "C) Physical strength", isCorrect: true, pointsEarned: 4, timeSpent: 45 },
          { questionId: "q5", studentAnswer: "During exam week, I felt overwhelmed with stress. I created a study schedule, took regular breaks, and practiced mindfulness meditation. This helped me stay focused and calm throughout the exams.", pointsEarned: 8, timeSpent: 150 },
          { questionId: "q6", studentAnswer: "5 - Always", pointsEarned: 4, timeSpent: 35 },
          { questionId: "q7", studentAnswer: "False", isCorrect: true, pointsEarned: 4, timeSpent: 25 },
          { questionId: "q8", studentAnswer: "My motivation comes from my passion for learning and my goal to become a doctor. I want to help people and make a positive impact on their lives. Every challenge I overcome brings me closer to my dream.", pointsEarned: 12, timeSpent: 200 },
          { questionId: "q9", studentAnswer: "B) Listen and validate their feelings", isCorrect: true, pointsEarned: 4, timeSpent: 40 },
          { questionId: "q10", studentAnswer: "4 - Good", pointsEarned: 4, timeSpent: 30 },
        ]
      },
    ]
  },
  "assess-2": {
    assessmentId: "assess-2",
    questions: [
      { id: "q1", questionNumber: 1, question: "What is the first sign that you are feeling stressed?", type: "multiple_choice", options: ["A) Headache", "B) Fast heartbeat", "C) Sweaty palms", "D) All of the above"], correctAnswer: "D) All of the above", points: 5, category: "Stress Recognition" },
      { id: "q2", questionNumber: 2, question: "Deep breathing helps reduce stress.", type: "true_false", options: ["True", "False"], correctAnswer: "True", points: 5, category: "Stress Relief" },
      { id: "q3", questionNumber: 3, question: "How many hours of sleep do teenagers need for optimal stress management?", type: "multiple_choice", options: ["A) 4-5 hours", "B) 6-7 hours", "C) 8-10 hours", "D) 12+ hours"], correctAnswer: "C) 8-10 hours", points: 5, category: "Sleep & Stress" },
      { id: "q4", questionNumber: 4, question: "Rate how often you practice relaxation techniques.", type: "rating_scale", options: ["1 - Never", "2 - Rarely", "3 - Sometimes", "4 - Often", "5 - Daily"], points: 5, category: "Self-Care" },
      { id: "q5", questionNumber: 5, question: "Exercise has no effect on stress levels.", type: "true_false", options: ["True", "False"], correctAnswer: "False", points: 5, category: "Physical Activity" },
    ],
    studentResponses: [
      {
        studentId: "student-1",
        studentName: "Emma Thompson",
        className: "Grade 6 - Section A",
        rollNumber: "6A01",
        submittedAt: "2024-12-15T09:00:00",
        totalScore: 92,
        maxScore: 100,
        percentage: 92,
        timeSpent: 10,
        responses: [
          { questionId: "q1", studentAnswer: "D) All of the above", isCorrect: true, pointsEarned: 5, timeSpent: 45 },
          { questionId: "q2", studentAnswer: "True", isCorrect: true, pointsEarned: 5, timeSpent: 20 },
          { questionId: "q3", studentAnswer: "C) 8-10 hours", isCorrect: true, pointsEarned: 5, timeSpent: 35 },
          { questionId: "q4", studentAnswer: "4 - Often", pointsEarned: 4, timeSpent: 30 },
          { questionId: "q5", studentAnswer: "False", isCorrect: true, pointsEarned: 5, timeSpent: 25 },
        ]
      },
    ]
  }
};

// ============ ACTIVITY TASKS & RESPONSES ============

export interface ActivityTask {
  id: string;
  taskNumber: number;
  title: string;
  description: string;
  type: "reflection" | "exercise" | "journal" | "video" | "quiz" | "interactive";
  duration: number; // minutes
  points: number;
  isRequired: boolean;
}

export interface StudentTaskResponse {
  taskId: string;
  status: "completed" | "in_progress" | "skipped";
  response?: string;
  completedAt?: string;
  timeSpent?: number; // minutes
  rating?: number; // 1-5
  feedback?: string;
}

export interface StudentActivityResponse {
  studentId: string;
  studentName: string;
  className: string;
  rollNumber: string;
  startedAt: string;
  completedAt?: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  responses: StudentTaskResponse[];
}

export interface ActivityTasksData {
  activityId: string;
  tasks: ActivityTask[];
  studentResponses: StudentActivityResponse[];
}

// Mock activity tasks data
export const mockActivityTasks: Record<string, ActivityTasksData> = {
  "activity-1": {
    activityId: "activity-1",
    tasks: [
      { id: "t1", taskNumber: 1, title: "Morning Gratitude", description: "Write 3 things you are grateful for this morning.", type: "journal", duration: 5, points: 10, isRequired: true },
      { id: "t2", taskNumber: 2, title: "Gratitude Reflection Video", description: "Watch a 3-minute video about the science of gratitude.", type: "video", duration: 3, points: 5, isRequired: true },
      { id: "t3", taskNumber: 3, title: "Gratitude Letter", description: "Write a short letter to someone you appreciate.", type: "reflection", duration: 10, points: 15, isRequired: false },
      { id: "t4", taskNumber: 4, title: "Evening Reflection", description: "Reflect on positive moments from your day.", type: "journal", duration: 5, points: 10, isRequired: true },
      { id: "t5", taskNumber: 5, title: "Gratitude Quiz", description: "Test your knowledge about gratitude practices.", type: "quiz", duration: 5, points: 10, isRequired: true },
    ],
    studentResponses: [
      {
        studentId: "student-1",
        studentName: "Emma Thompson",
        className: "Grade 6 - Section A",
        rollNumber: "6A01",
        startedAt: "2024-11-01T08:00:00",
        completedAt: "2024-12-17T08:30:00",
        progress: 100,
        totalTasks: 5,
        completedTasks: 5,
        responses: [
          { taskId: "t1", status: "completed", response: "1. My supportive family who always encourages me\n2. My best friend who makes me laugh\n3. The beautiful sunrise I saw this morning", completedAt: "2024-12-17T08:10:00", timeSpent: 6, rating: 5, feedback: "This exercise helps me start my day positively!" },
          { taskId: "t2", status: "completed", completedAt: "2024-12-17T08:15:00", timeSpent: 3, rating: 4 },
          { taskId: "t3", status: "completed", response: "Dear Mom, Thank you for always believing in me and supporting my dreams. Your love and encouragement mean the world to me. I appreciate everything you do for our family. Love, Emma", completedAt: "2024-12-17T08:25:00", timeSpent: 12, rating: 5, feedback: "Writing this made me feel so happy!" },
          { taskId: "t4", status: "completed", response: "Today I had a great conversation with my teacher about my project. I also helped a classmate understand a difficult concept, which felt rewarding.", completedAt: "2024-12-17T20:00:00", timeSpent: 5, rating: 5 },
          { taskId: "t5", status: "completed", completedAt: "2024-12-17T08:30:00", timeSpent: 4, rating: 4 },
        ]
      },
      {
        studentId: "student-4",
        studentName: "Noah Williams",
        className: "Grade 6 - Section B",
        rollNumber: "6B01",
        startedAt: "2024-11-15T09:00:00",
        progress: 45,
        totalTasks: 5,
        completedTasks: 2,
        responses: [
          { taskId: "t1", status: "completed", response: "1. Video games\n2. Pizza\n3. Weekends", completedAt: "2024-11-15T09:05:00", timeSpent: 3, rating: 3 },
          { taskId: "t2", status: "completed", completedAt: "2024-11-15T09:10:00", timeSpent: 3, rating: 3 },
          { taskId: "t3", status: "skipped" },
          { taskId: "t4", status: "in_progress", response: "Today was okay I guess...", timeSpent: 2 },
          { taskId: "t5", status: "in_progress" },
        ]
      },
      {
        studentId: "student-10",
        studentName: "James Taylor",
        className: "Grade 8 - Section B",
        rollNumber: "8B01",
        startedAt: "2024-12-01T10:00:00",
        progress: 0,
        totalTasks: 5,
        completedTasks: 0,
        responses: []
      },
    ]
  },
  "activity-2": {
    activityId: "activity-2",
    tasks: [
      { id: "t1", taskNumber: 1, title: "Introduction to Breathing", description: "Learn about the 4-7-8 breathing technique.", type: "video", duration: 5, points: 10, isRequired: true },
      { id: "t2", taskNumber: 2, title: "Practice Session 1", description: "Follow along with a guided breathing exercise.", type: "exercise", duration: 5, points: 15, isRequired: true },
      { id: "t3", taskNumber: 3, title: "Breathing Journal", description: "Record how you felt before and after the exercise.", type: "journal", duration: 5, points: 10, isRequired: true },
      { id: "t4", taskNumber: 4, title: "Practice Session 2", description: "Try the box breathing technique.", type: "exercise", duration: 5, points: 15, isRequired: true },
      { id: "t5", taskNumber: 5, title: "Reflection", description: "Which breathing technique works best for you and why?", type: "reflection", duration: 5, points: 10, isRequired: false },
    ],
    studentResponses: [
      {
        studentId: "student-1",
        studentName: "Emma Thompson",
        className: "Grade 6 - Section A",
        rollNumber: "6A01",
        startedAt: "2024-11-16T14:00:00",
        completedAt: "2024-12-10T15:00:00",
        progress: 100,
        totalTasks: 5,
        completedTasks: 5,
        responses: [
          { taskId: "t1", status: "completed", completedAt: "2024-11-16T14:05:00", timeSpent: 5, rating: 5 },
          { taskId: "t2", status: "completed", completedAt: "2024-11-16T14:12:00", timeSpent: 6, rating: 5, feedback: "I felt so relaxed after this!" },
          { taskId: "t3", status: "completed", response: "Before: I felt anxious about my upcoming test.\nAfter: I feel much calmer and more focused. My heart rate slowed down and I feel ready to study.", completedAt: "2024-11-16T14:18:00", timeSpent: 5, rating: 5 },
          { taskId: "t4", status: "completed", completedAt: "2024-12-10T14:55:00", timeSpent: 5, rating: 4 },
          { taskId: "t5", status: "completed", response: "The 4-7-8 technique works best for me because it's easy to remember and I can do it anywhere. I use it before tests and when I feel stressed.", completedAt: "2024-12-10T15:00:00", timeSpent: 6, rating: 5 },
        ]
      },
    ]
  }
};

// Helper functions
export const getAssessmentQuestions = (assessmentId: string): AssessmentQuestionsData | undefined => {
  return mockAssessmentQuestions[assessmentId];
};

export const getActivityTasks = (activityId: string): ActivityTasksData | undefined => {
  return mockActivityTasks[activityId];
};
