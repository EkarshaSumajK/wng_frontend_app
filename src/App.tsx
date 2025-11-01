import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";

// Simple loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Eager load critical pages (login, onboarding)
import Login from "./pages/Login";
import SchoolSelection from "./pages/onboarding/SchoolSelection";
import SchoolOnboarding from "./pages/onboarding/SchoolOnboarding";
import DataOnboarding from "./pages/onboarding/DataOnboarding";
import RoleSelection from "./pages/onboarding/RoleSelection";

// Lazy load all other pages for faster initial load
const CounsellorDashboard = lazy(() => import("./pages/counsellor/CounsellorDashboard"));
const CasesPage = lazy(() => import("./pages/counsellor/CasesPage"));
const StudentsPage = lazy(() => import("./pages/counsellor/StudentsPage"));
const AssessmentsPage = lazy(() => import("./pages/counsellor/AssessmentsPage"));
const CounsellorActivitiesPage = lazy(() => import("./pages/counsellor/ActivitiesPage"));
const AIInsightsPage = lazy(() => import("./pages/counsellor/AIInsightsPage"));
const CalendarPage = lazy(() => import("./pages/counsellor/CalendarPage"));
const ResourcesPage = lazy(() => import("./pages/counsellor/ResourcesPage"));
const WebinarsPage = lazy(() => import("./pages/counsellor/WebinarsPage"));

const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const TeacherResourcesPage = lazy(() => import("./pages/teacher/ResourcesPage"));
const TeacherCalendarPage = lazy(() => import("./pages/teacher/TeacherCalendarPage"));
const TeacherAssessmentsPage = lazy(() => import("./pages/teacher/AssessmentsPage"));
const TeacherActivitiesPage = lazy(() => import("./pages/teacher/ActivitiesPage"));
const StudentMonitoringPage = lazy(() => import("./pages/teacher/StudentMonitoringPage"));
const TeacherWebinarsPage = lazy(() => import("./pages/teacher/WebinarsPage"));

const LeadershipDashboard = lazy(() => import("./pages/leadership/LeadershipDashboard"));
const OnboardingPage = lazy(() => import("./pages/leadership/OnboardingPage"));
const SchoolOverviewPage = lazy(() => import("./pages/leadership/SchoolOverviewPage"));
const AnalyticsPage = lazy(() => import("./pages/leadership/AnalyticsPage"));
const RiskManagementPage = lazy(() => import("./pages/leadership/RiskManagementPage"));
const GovernancePage = lazy(() => import("./pages/leadership/GovernancePage"));
const ReportsPage = lazy(() => import("./pages/leadership/ReportsPage"));
const GradeLevelAnalysisPage = lazy(() => import("./pages/leadership/GradeLevelAnalysisPage"));
const LeadershipGradeDetailPage = lazy(() => import("./pages/leadership/GradeDetailPage"));
const LeadershipSectionDetailPage = lazy(() => import("./pages/leadership/SectionDetailPage"));
const AtRiskStudentsPage = lazy(() => import("./pages/leadership/AtRiskStudentsPage"));
const MarketplacePage = lazy(() => import("./pages/leadership/MarketplacePage"));
const LeadershipResourcesPage = lazy(() => import("./pages/leadership/ResourcesPage"));
const LeadershipWebinarsPage = lazy(() => import("./pages/leadership/WebinarsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh longer
      cacheTime: 30 * 60 * 1000, // 30 minutes - cache persists much longer
      refetchOnMount: false, // Don't refetch on component mount if data is fresh
      refetchOnReconnect: true, // Refetch when connection is restored
      suspense: false, // Disable suspense for better error handling
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/school-selection" element={<SchoolSelection />} />
            <Route path="/school-onboarding" element={<SchoolOnboarding />} />
            <Route path="/data-onboarding" element={<DataOnboarding />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            
            {/* Protected Routes with Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Counsellor Routes */}
              <Route path="/counsellor" element={<CounsellorDashboard />} />
              <Route path="/counsellor/cases" element={<CasesPage />} />
              <Route path="/counsellor/students" element={<StudentsPage />} />
              <Route path="/counsellor/assessments" element={<AssessmentsPage />} />
              <Route path="/counsellor/activities" element={<CounsellorActivitiesPage />} />
              <Route path="/counsellor/ai-insights" element={<AIInsightsPage />} />
              <Route path="/counsellor/calendar" element={<CalendarPage />} />
              <Route path="/counsellor/resources" element={<ResourcesPage />} />
              <Route path="/counsellor/webinars" element={<WebinarsPage />} />
              
              {/* Teacher Routes */}
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/students" element={<StudentMonitoringPage />} />
              <Route path="/teacher/assessments" element={<TeacherAssessmentsPage />} />
              <Route path="/teacher/activities" element={<TeacherActivitiesPage />} />
              <Route path="/teacher/resources" element={<TeacherResourcesPage />} />
              <Route path="/teacher/calendar" element={<TeacherCalendarPage />} />
              <Route path="/teacher/webinars" element={<TeacherWebinarsPage />} />
              
              {/* Leadership Routes */}
              <Route path="/leadership" element={<LeadershipDashboard />} />
              <Route path="/leadership/onboarding" element={<OnboardingPage />} />
              <Route path="/leadership/overview" element={<SchoolOverviewPage />} />
              <Route path="/leadership/analytics" element={<AnalyticsPage />} />
              <Route path="/leadership/risk" element={<RiskManagementPage />} />
              <Route path="/leadership/at-risk-students" element={<AtRiskStudentsPage />} />
              <Route path="/leadership/grade-analysis" element={<GradeLevelAnalysisPage />} />
              <Route path="/leadership/grade/:grade" element={<LeadershipGradeDetailPage />} />
              <Route path="/leadership/section/:sectionId" element={<LeadershipSectionDetailPage />} />
              <Route path="/leadership/governance" element={<GovernancePage />} />
              <Route path="/leadership/reports" element={<ReportsPage />} />
              <Route path="/leadership/marketplace" element={<MarketplacePage />} />
              <Route path="/leadership/resources" element={<LeadershipResourcesPage />} />
              <Route path="/leadership/webinars" element={<LeadershipWebinarsPage />} />
              
              {/* Principal Routes (alias for Leadership) */}
              <Route path="/principal" element={<LeadershipDashboard />} />
              <Route path="/principal/onboarding" element={<OnboardingPage />} />
              <Route path="/principal/overview" element={<SchoolOverviewPage />} />
              <Route path="/principal/analytics" element={<AnalyticsPage />} />
              <Route path="/principal/risk" element={<RiskManagementPage />} />
              <Route path="/principal/at-risk-students" element={<AtRiskStudentsPage />} />
              <Route path="/principal/grade-analysis" element={<GradeLevelAnalysisPage />} />
              <Route path="/principal/grade/:grade" element={<LeadershipGradeDetailPage />} />
              <Route path="/principal/section/:sectionId" element={<LeadershipSectionDetailPage />} />
              <Route path="/principal/governance" element={<GovernancePage />} />
              <Route path="/principal/reports" element={<ReportsPage />} />
              <Route path="/principal/marketplace" element={<MarketplacePage />} />
              <Route path="/principal/resources" element={<LeadershipResourcesPage />} />
              <Route path="/principal/webinars" element={<LeadershipWebinarsPage />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
