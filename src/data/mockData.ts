/**
 * DEPRECATED: Mock data has been replaced with real API calls
 * 
 * This file is kept for backward compatibility only.
 * All data should now be fetched using React Query hooks.
 * 
 * See: src/data/README.md for migration guide
 */

// Export empty arrays to prevent import errors
export const mockStudents: any[] = [];
export const mockCases: any[] = [];
export const mockSessionNotes: any[] = [];
export const mockGoals: any[] = [];
export const mockAssessments: any[] = [];
export const mockAssessmentResponses: any[] = [];
export const mockAIRecommendations: any[] = [];
export const mockActivities: any[] = [];
export const mockAssessmentTemplates: any[] = [];
export const mockDailyBoosters: any[] = [];
export const mockObservations: any[] = [];
export const mockCalendarEvents: any[] = [];
export const mockResources: any[] = [];
export const mockSchoolMetrics: any = {};
export const mockClassMetrics: any[] = [];
export const mockRiskAlerts: any[] = [];

// Mock data for Governance & Compliance (temporary until API is implemented)
export const mockConsentRecords: any[] = [
  {
    id: "1",
    studentName: "Emma Johnson",
    parentName: "Sarah Johnson",
    consentType: "mental-health-services",
    status: "granted",
    grantedDate: "2024-01-15",
    expiresAt: "2025-01-15",
    documentUrl: "/consents/doc1.pdf"
  },
  {
    id: "2",
    studentName: "Michael Chen",
    parentName: "Wei Chen",
    consentType: "data-sharing",
    status: "granted",
    grantedDate: "2024-02-01",
    expiresAt: "2025-02-01",
    documentUrl: "/consents/doc2.pdf"
  },
  {
    id: "3",
    studentName: "Sofia Rodriguez",
    parentName: "Maria Rodriguez",
    consentType: "assessment",
    status: "pending",
    grantedDate: null,
    expiresAt: null,
    documentUrl: null
  },
  {
    id: "4",
    studentName: "James Wilson",
    parentName: "Robert Wilson",
    consentType: "mental-health-services",
    status: "granted",
    grantedDate: "2024-01-20",
    expiresAt: "2024-12-20",
    documentUrl: "/consents/doc4.pdf"
  },
  {
    id: "5",
    studentName: "Aisha Patel",
    parentName: "Priya Patel",
    consentType: "counseling",
    status: "denied",
    grantedDate: null,
    expiresAt: null,
    documentUrl: null
  },
  {
    id: "6",
    studentName: "Lucas Brown",
    parentName: "Jennifer Brown",
    consentType: "data-sharing",
    status: "pending",
    grantedDate: null,
    expiresAt: null,
    documentUrl: null
  },
  {
    id: "7",
    studentName: "Olivia Martinez",
    parentName: "Carlos Martinez",
    consentType: "assessment",
    status: "granted",
    grantedDate: "2024-03-01",
    expiresAt: "2025-03-01",
    documentUrl: "/consents/doc7.pdf"
  },
  {
    id: "8",
    studentName: "Noah Anderson",
    parentName: "Lisa Anderson",
    consentType: "mental-health-services",
    status: "granted",
    grantedDate: "2023-11-15",
    expiresAt: "2024-11-15",
    documentUrl: "/consents/doc8.pdf"
  }
];

console.warn(
  '⚠️ DEPRECATED: You are importing from mockData. Please use API hooks instead.\n' +
  'See src/data/README.md for migration guide.'
);
