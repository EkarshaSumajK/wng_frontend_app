import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  School,
  Users,
  User,
  ChevronRight,
  BarChart3,
  Calendar,
  ClipboardList,
  Activity,
  Video,
  Search,
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Award,
  AlertTriangle,
  Flame,
  CalendarDays,
  CalendarRange,
  FileText,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Timer,
  Zap,
  GraduationCap,
  Trophy,
  Shield,
  ArrowLeft,
  Loader2,
  HelpCircle,
  Star,
  Play,
  BookOpen,
  Filter,
  RefreshCw,
  Sparkles,
  Target,
  Heart,
  Send,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AnalyticsLeaderboard } from "@/components/shared/AnalyticsLeaderboard";
import { useAuth } from "@/contexts/AuthContext";
import {
  useSchoolTrends,
  useSchoolAssessments,
  useSchoolActivities,
  useSchoolWebinars,
  useAssessmentDetails,
  useActivityDetails,
  useWebinarDetails,
  useCounsellorClasses,
  useCounsellorStudents,
} from "@/hooks/useCounsellorAnalytics";
import {
    ActivityDetailedView,
    AssessmentDetailedView,
    WebinarDetailedView,
    StudentListItem as StudentEngagementSummary,
    ClassAnalytics as ClassEngagementSummary,
    counsellorAnalyticsApi,
    LeaderboardEntry
} from "@/services/counsellorAnalytics";
import { useEffect } from "react";

// Import mock data only for fallbacks if needed, or remove completely. 
// For now, let's keep types and maybe some localized mocks if used in sub-components that I haven't refactored yet.
// Actually, I should remove mock data usage entirely.

const COLORS = {
  primary: "#8b5cf6",
  secondary: "#06b6d4",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  gradient: ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"],
  cardGradients: {
    violet: "from-violet-500/10 via-purple-500/10 to-indigo-500/10",
    blue: "from-blue-500/10 via-cyan-500/10 to-sky-500/10",
    green: "from-emerald-500/10 via-green-500/10 to-teal-500/10",
    orange: "from-orange-500/10 via-amber-500/10 to-yellow-500/10",
  },
};

type EngagementType = "assessments" | "activities" | "webinars";
type ViewLevel = "school" | "class" | "student";

type TimePeriod = "today" | "week" | "month" | "year" | "custom";

const daysFromPeriod = (period: TimePeriod): number => {
  switch (period) {
    case "today": return 1;
    case "week": return 7;
    case "month": return 30;
    case "year": return 365;
    default: return 30;
  }
};

const calculateAvgRate = (items: any[], key: string): number => {
    if (!items || !items.length) return 0;
    const sum = items.reduce((acc, item) => acc + (item[key] || 0), 0);
    return sum / items.length;
};

// Wrapper components for detailed views
// Stub components that will be properly implemented or imported if existing ones are usable
// Using simple wrappers for now that render NOTHING if data is missing, or simple placeholder
// Ideally, we should reuse AssessmentDetailedViewComponent if it exists in the file (it likely does further down)

function RefactoredAssessmentDetailView({ templateId, schoolId, onBack }: { templateId: string, schoolId: string, onBack: () => void }) {
    const { data, isLoading } = useAssessmentDetails(templateId, schoolId);
    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!data) return <div className="p-8 text-center">Assessment data not found</div>;
    // We assume AssessmentDetailedViewComponent exists in this file
    return <AssessmentDetailedViewComponent assessment={data} onBack={onBack} schoolId={schoolId} />;
}

function RefactoredActivityDetailView({ activityId, schoolId, onBack }: { activityId: string, schoolId: string, onBack: () => void }) {
    const { data, isLoading } = useActivityDetails(activityId, schoolId);
    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!data) return <div className="p-8 text-center">Activity data not found</div>;
    return <ActivityDetailedViewComponent activity={data} onBack={onBack} schoolId={schoolId} />;
}

function RefactoredWebinarDetailView({ webinarId, schoolId, onBack }: { webinarId: string, schoolId: string, onBack: () => void }) {
    const { data, isLoading } = useWebinarDetails(webinarId, schoolId);
    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!data) return <div className="p-8 text-center">Webinar data not found</div>;
    return <WebinarDetailedViewComponent webinar={data} onBack={onBack} schoolId={schoolId} />;
}

export default function EngagementAnalyticsPage() {
  const [engagementType, setEngagementType] = useState<EngagementType>("assessments");
  const [viewLevel, setViewLevel] = useState<ViewLevel>("school");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [gradeFilter, setGradeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const { user } = useAuth();
  const schoolId = user?.school_id || '';
  
  // Fetch classes for filter
  const { data: classesData } = useCounsellorClasses(schoolId);
  const classes = classesData?.classes || [];

  // Filter classes based on search and grade
  const filteredClasses = useMemo(() => {
    return classes.filter((cls: any) => {
      const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cls.teacherName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = gradeFilter === "all" || cls.grade === gradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [searchQuery, gradeFilter, classes]);
  
  // Define filters for student fetching
  const studentFilters = useMemo(() => {
    const filters: any = { limit: 100 }; // Increase limit to ensure we get more students
    if (selectedClassId) {
      filters.class_id = selectedClassId;
    }
    return filters;
  }, [selectedClassId]);

  // Fetch students for search/filter
  const { data: studentsData } = useCounsellorStudents(schoolId, studentFilters);
  const allStudents = useMemo(() => {
    return (studentsData?.students || []).map((s: any) => ({
      ...s,
      // Map properties to match StudentEngagementSummary type expected by StudentView
      id: s.student_id,
      classId: s.class_id,
      className: s.class_name || s.className || '',
      assessments: { 
        done: s.assessments_completed || 0, 
        total: s.assessments_total || 0,
        rate: s.assessments_total ? (s.assessments_completed / s.assessments_total * 100) : 0 
      },
      activities: { 
        done: s.activities_completed || 0, 
        total: s.activities_total || 0,
        rate: s.activities_total ? (s.activities_completed / s.activities_total * 100) : 0 
      },
      webinars: { 
        done: s.webinars_attended || 0, 
        total: s.webinars_total || 0,
        rate: s.webinars_total ? (s.webinars_attended / s.webinars_total * 100) : 0 
      }
    }));
  }, [studentsData]);

  // Filter students based on search and selected class
  // Filter students based on search and selected class
  const filteredStudents = useMemo(() => {
    let students = allStudents;
    if (selectedClassId) {
       const cls = classes.find((c: any) => (c.id || c.class_id) === selectedClassId);
       if (cls) {
          students = students.filter((s: any) => s.classId === (cls.id || cls.class_id));
       }
    }
    if (searchQuery) {
      students = students.filter((s: any) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.className && s.className.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return students;
  }, [searchQuery, selectedClassId, allStudents, classes]);

  // Fetch real data for analytics
  const { data: trendResponse, isLoading: isLoadingTrends } = useSchoolTrends(schoolId, daysFromPeriod(timePeriod));
  const { data: assessmentsResponse, isLoading: isLoadingAssessments } = useSchoolAssessments(schoolId, daysFromPeriod(timePeriod));
  const { data: activitiesResponse, isLoading: isLoadingActivities } = useSchoolActivities(schoolId, daysFromPeriod(timePeriod));
  const { data: webinarsResponse, isLoading: isLoadingWebinars } = useSchoolWebinars(schoolId, daysFromPeriod(timePeriod));
  
  const trends = trendResponse?.trends || [];
  const assessmentDetails = assessmentsResponse?.assessments || [];
  const activityDetails = activitiesResponse?.activities || [];
  const webinarDetails = webinarsResponse?.webinars || [];


  const currentMetrics = { period: timePeriod, trend: "up", trendPercentage: 0 }; // Placeholder

  const getEngagementLabel = () => {
    switch (engagementType) {
      case "assessments": return "Assessments";
      case "activities": return "Activities";
      case "webinars": return "Webinars";
    }
  };

  const getEngagementIcon = () => {
    switch (engagementType) {
      case "assessments": return ClipboardList;
      case "activities": return Activity;
      case "webinars": return Video;
    }
  };

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setViewLevel("class"); // Keep view level as class
    setSearchQuery("");
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleBackToClasses = () => {
    setSelectedClassId(null);
    setViewLevel("class");
    setSearchQuery("");
  };

  const handleBackToSchool = () => {
    setSelectedClassId(null);
    setSelectedStudentId(null);
    setViewLevel("school");
    setSearchQuery("");
  };

  const EngagementIcon = getEngagementIcon();

  return (
    <TooltipProvider>
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-10">
      <AnimatedBackground />

      {/* Enhanced Header */}
      <div className="relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-rose-600/20 to-red-600/20 rounded-3xl" />
        <div className="absolute inset-0 bg-card/60 backdrop-blur-xl rounded-3xl" />
        <div className="relative p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl blur-lg opacity-50" />
                <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-xl ring-2 ring-white/20">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Student Engagement
                  </h1>
                  <Badge variant="secondary" className="bg-pink-500/10 text-pink-600 border-pink-500/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Counsellor View
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Monitor student wellbeing through participation patterns
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Time Period Buttons */}
              <div className="flex items-center bg-background/50 backdrop-blur-sm rounded-xl p-1 border border-border/50 shadow-sm">
                {["today", "week", "month", "year"].map((period) => (
                  <Tooltip key={period}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={timePeriod === period ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setTimePeriod(period as TimePeriod)}
                        className={`rounded-lg capitalize transition-all ${
                          timePeriod === period 
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md" 
                            : "hover:bg-muted/80"
                        }`}
                      >
                        {period}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View {period}'s data</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              {/* Custom Date Range */}
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-muted/80">
                    <CalendarRange className="w-4 h-4" />
                    {dateRange.from && dateRange.to
                      ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                      : "Custom"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      setDateRange({ from: range?.from, to: range?.to });
                      if (range?.from && range?.to) {
                        setTimePeriod("custom");
                        setShowDatePicker(false);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-muted/80">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download report as PDF/Excel</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Separator className="my-4 bg-border/50" />

          {/* Time Period Summary with enhanced styling */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
              <CalendarDays className="w-4 h-4 text-pink-500" />
              <span className="text-muted-foreground">Period:</span>
              <Badge variant="secondary" className="bg-pink-500/10 text-pink-600 border-0">
                {currentMetrics.period}
              </Badge>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              currentMetrics.trend === "up" 
                ? "bg-emerald-500/10 border-emerald-500/20" 
                : "bg-red-500/10 border-red-500/20"
            }`}>
              {currentMetrics.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={currentMetrics.trend === "up" ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                {currentMetrics.trend === "up" ? "+" : "-"}{currentMetrics.trendPercentage}% vs previous
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <GraduationCap className="w-4 h-4 text-blue-500" />
<span className="text-blue-600 font-medium">{classes.length} Classes</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Users className="w-4 h-4 text-amber-500" />
              <span className="text-amber-600 font-medium">{allStudents.length.toLocaleString()} Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Engagement Type Tabs */}
      <Tabs value={engagementType} onValueChange={(v) => setEngagementType(v as EngagementType)} className="w-full">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-blue-500/5 to-emerald-500/5 rounded-2xl" />
          <TabsList className="relative grid w-full grid-cols-3 h-16 p-1.5 bg-background/50 backdrop-blur-sm rounded-2xl mb-6 border border-border/50 shadow-lg">
            <TabsTrigger
              value="assessments"
              className="rounded-xl gap-2.5 text-base font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-violet-500/25"
            >
              <div className="p-1.5 rounded-lg bg-violet-500/10 data-[state=active]:bg-white/20">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline">Assessments</span>
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="rounded-xl gap-2.5 text-base font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25"
            >
              <div className="p-1.5 rounded-lg bg-blue-500/10 data-[state=active]:bg-white/20">
                <Activity className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
            <TabsTrigger
              value="webinars"
              className="rounded-xl gap-2.5 text-base font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/10 data-[state=active]:bg-white/20">
                <Video className="w-5 h-5" />
              </div>
              <span className="hidden sm:inline">Webinars</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Enhanced View Level Sub-tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Tabs value={viewLevel} onValueChange={(v) => {
            setViewLevel(v as ViewLevel);
            setSelectedClassId(null);
            setSelectedStudentId(null);
            setSearchQuery("");
          }}>
            <TabsList className="h-11 p-1 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm">
              <TabsTrigger value="school" className="rounded-lg gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <School className="w-4 h-4" />
                <span className="hidden sm:inline">Overall</span>
              </TabsTrigger>
              <TabsTrigger value="class" className="rounded-lg gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Class-wise</span>
              </TabsTrigger>
              {/* <TabsTrigger value="student" className="rounded-lg gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Student-wise</span>
              </TabsTrigger> */}
            </TabsList>
          </Tabs>

          {/* Breadcrumb navigation */}
          {(selectedClassId || selectedStudentId) && (
            <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary" onClick={handleBackToSchool}>
                Overall
              </Button>
              {selectedClassId && (
                <>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{classes.find((c: any) => c.id === selectedClassId)?.name}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content based on engagement type and view level */}
        <TabsContent value="assessments" className="space-y-6">
          <EngagementContent
            type="assessments"
            viewLevel={viewLevel}
            timePeriod={timePeriod}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            gradeFilter={gradeFilter}
            setGradeFilter={setGradeFilter}
            filteredClasses={filteredClasses}
            filteredStudents={filteredStudents}
            selectedClassId={selectedClassId}
            onClassSelect={handleClassSelect}
            onStudentSelect={handleStudentSelect}
            onBackToClasses={handleBackToClasses}
          />
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <EngagementContent
            type="activities"
            viewLevel={viewLevel}
            timePeriod={timePeriod}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            gradeFilter={gradeFilter}
            setGradeFilter={setGradeFilter}
            filteredClasses={filteredClasses}
            filteredStudents={filteredStudents}
            selectedClassId={selectedClassId}
            onClassSelect={handleClassSelect}
            onStudentSelect={handleStudentSelect}
            onBackToClasses={handleBackToClasses}
          />
        </TabsContent>

        <TabsContent value="webinars" className="space-y-6">
          <EngagementContent
            type="webinars"
            viewLevel={viewLevel}
            timePeriod={timePeriod}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            gradeFilter={gradeFilter}
            setGradeFilter={setGradeFilter}
            filteredClasses={filteredClasses}
            filteredStudents={filteredStudents}
            selectedClassId={selectedClassId}
            onClassSelect={handleClassSelect}
            onStudentSelect={handleStudentSelect}
            onBackToClasses={handleBackToClasses}
          />
        </TabsContent>
      </Tabs>
    </div>
    </TooltipProvider>
  );
}


// Engagement Content Component
// Engagement Content Component
interface EngagementContentProps {
  type: EngagementType;
  viewLevel: ViewLevel;
  timePeriod: TimePeriod;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  gradeFilter: string;
  setGradeFilter: (grade: string) => void;
  filteredClasses: any[]; // Relaxed type for API data
  filteredStudents: any[]; // Relaxed type for API data
  selectedClassId: string | null;
  onClassSelect: (classId: string) => void;
  onStudentSelect: (studentId: string) => void;
  onBackToClasses: () => void;
}

function EngagementContent({
  type,
  viewLevel,
  timePeriod,
  searchQuery,
  setSearchQuery,
  gradeFilter,
  setGradeFilter,
  filteredClasses,
  filteredStudents,
  selectedClassId,
  onClassSelect,
  onStudentSelect,
  onBackToClasses,
}: EngagementContentProps) {
  
  // Removed getSchoolData/mockSchoolEngagement usage as SchoolView fetches its own data
  
  if (viewLevel === "school") {
    return <SchoolView type={type} timePeriod={timePeriod} />;
  }

  if (viewLevel === "class") {
    if (selectedClassId) {
      return (
        <StudentView
          type={type}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredStudents={filteredStudents}
          selectedClassId={selectedClassId}
          onStudentSelect={onStudentSelect}
          onBackToClasses={onBackToClasses}
        />
      );
    }

    return (
      <ClassView
        type={type}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        gradeFilter={gradeFilter}
        setGradeFilter={setGradeFilter}
        filteredClasses={filteredClasses}
        onClassSelect={onClassSelect}
      />
    );
  }

  return (
    <StudentView
      type={type}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredStudents={filteredStudents}
      selectedClassId={selectedClassId}
      onStudentSelect={onStudentSelect}
      onBackToClasses={onBackToClasses}
    />
  );
}



// School View Component
function SchoolView({ type, timePeriod }: { type: EngagementType; timePeriod: TimePeriod }) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedWebinarId, setSelectedWebinarId] = useState<string | null>(null);
  const [detailsSearchQuery, setDetailsSearchQuery] = useState("");
  const [detailsClassFilter, setDetailsClassFilter] = useState("all");
  const { user } = useAuth();
  const schoolId = user?.school_id || ''; // Fallback or handle null
  
  // Fetch real data
  const { data: trendResponse, isLoading: isLoadingTrends } = useSchoolTrends(schoolId, daysFromPeriod(timePeriod));
  const { data: assessmentsResponse, isLoading: isLoadingAssessments } = useSchoolAssessments(schoolId, daysFromPeriod(timePeriod));
  const { data: activitiesResponse, isLoading: isLoadingActivities } = useSchoolActivities(schoolId, daysFromPeriod(timePeriod));
  const { data: webinarsResponse, isLoading: isLoadingWebinars } = useSchoolWebinars(schoolId, daysFromPeriod(timePeriod));
  
  // Use real data or fallbacks
  const trends = trendResponse?.trends || [];
  const assessmentDetails = assessmentsResponse?.assessments || [];
  const activityDetails = activitiesResponse?.activities || [];
  const webinarDetails = webinarsResponse?.webinars || [];

  // Fetch Leaderboard
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [leaderboardTotalPages, setLeaderboardTotalPages] = useState(1);
  const [leaderboardTotal, setLeaderboardTotal] = useState(0);
  const LEADERBOARD_LIMIT = 10;

  useEffect(() => {
    async function fetchLeaderboard() {
        if (!schoolId) return;
        setIsLeaderboardLoading(true);
        try {
            const res = await counsellorAnalyticsApi.getLeaderboard(
                schoolId, 
                type, 
                daysFromPeriod(timePeriod), 
                leaderboardPage, 
                LEADERBOARD_LIMIT
            );
            setLeaderboardData(res.students || []);
            // Calculate total pages from total count
            const total = res.total || 0;
            setLeaderboardTotal(total);
            setLeaderboardTotalPages(Math.ceil(total / LEADERBOARD_LIMIT));
        } catch (err) {
            console.error("Failed to fetch leaderboard", err);
        } finally {
            setIsLeaderboardLoading(false);
        }
    }
    fetchLeaderboard();
  }, [schoolId, type, timePeriod, leaderboardPage]); // Re-fetch on page change


  const schoolData = {
     assessments: {
         id: "assessments",
         rate: calculateAvgRate(assessmentDetails, "submissionRate"),
         done: assessmentDetails.reduce((acc: number, item: any) => acc + (item.studentsSubmitted || 0), 0),
         total: assessmentDetails.reduce((acc: number, item: any) => acc + (item.totalStudentsAssigned || 0), 0),
     },
     activities: {
         id: "activities",
         rate: calculateAvgRate(activityDetails, "completionRate"),
         done: activityDetails.reduce((acc: number, item: any) => acc + (item.studentsCompleted || 0), 0),
         total: activityDetails.reduce((acc: number, item: any) => acc + (item.totalStudentsAssigned || 0), 0),
     },
     webinars: {
         id: "webinars",
         rate: calculateAvgRate(webinarDetails, "attendanceRate"),
         done: webinarDetails.reduce((acc: number, item: any) => acc + (item.studentsAttended || 0), 0),
         total: webinarDetails.reduce((acc: number, item: any) => acc + (item.totalStudentsInvited || 0), 0),
     },
     totalStudents: 1250 // This should ideally come from an API too
  };

  const engagementData = type === "assessments" ? schoolData.assessments :
    type === "activities" ? schoolData.activities : schoolData.webinars;
  
  const details = type === "assessments" ? assessmentDetails :
    type === "activities" ? activityDetails : webinarDetails;
  
  // Get unique classes for filter (Placeholder until Class API integrated completely)
  const uniqueClasses = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"]; 
  
  // Filter details based on search
  const filteredDetails = details.filter((item: any) => {
    const matchesSearch = (item.title || '').toLowerCase().includes(detailsSearchQuery.toLowerCase()) ||
      (item.type && item.type.toLowerCase().includes(detailsSearchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(detailsSearchQuery.toLowerCase()));
    return matchesSearch;
  });
  
  // Show detailed assessment view if selected
  if (selectedAssessmentId && type === "assessments") {
     return <RefactoredAssessmentDetailView templateId={selectedAssessmentId} schoolId={schoolId} onBack={() => setSelectedAssessmentId(null)} />;
  }
  
  // Show detailed activity view if selected
  if (selectedActivityId && type === "activities") {
      return <RefactoredActivityDetailView activityId={selectedActivityId} schoolId={schoolId} onBack={() => setSelectedActivityId(null)} />;

  }
  
  // Show detailed webinar view if selected
  if (selectedWebinarId && type === "webinars") {
       return <RefactoredWebinarDetailView webinarId={selectedWebinarId} schoolId={schoolId} onBack={() => setSelectedWebinarId(null)} />;
  }

  // Determine trend data based on selected type and time period
  const trendData = trends;

  const trendKey = "date";
  
  const labels = type === "assessments" ? { done: "Submitted", pending: "Pending" } :
    type === "activities" ? { done: "Completed", pending: "Not Started" } :
    { done: "Attended", pending: "Missed" };

  const pieData = [
    { name: labels.done, value: engagementData.done, color: COLORS.success },
    { name: labels.pending, value: engagementData.total - engagementData.done, color: COLORS.warning },
  ];

  const StatCard = ({ title, value, subtext, icon: Icon, gradient, trend }: any) => (
    <Card className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${gradient} group hover:scale-[1.02] transition-transform duration-300`}>
      <CardContent className="pt-6 relative z-10">
        <div className="absolute right-4 top-4 p-2 bg-white/10 rounded-xl backdrop-blur-sm">
          <Icon className="w-6 h-6 text-foreground/80 dark:text-white/90" />
        </div>
        <p className="text-3xl font-bold text-foreground dark:text-white mb-1 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-muted-foreground dark:text-white/70">{title}</p>
        {subtext && <p className="text-xs text-muted-foreground/80 dark:text-white/50 mt-2">{subtext}</p>}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Calculate students who completed vs pending
  const totalItemCount = details.length;
  // Use engagementData.done/total for averages?
  // Actually, average per item is: total submissions / number of items
  const avgStudentsCompleted = totalItemCount ? Math.round(engagementData.done / totalItemCount) : 0;
  const avgStudentsPending = totalItemCount ? Math.round((engagementData.total - engagementData.done) / totalItemCount) : 0;


  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={schoolData.totalStudents.toLocaleString()}
          icon={Users}
          gradient={COLORS.cardGradients.violet}
        />
        <StatCard
          title={`Total ${type === "assessments" ? "Assessments" : type === "activities" ? "Activities" : "Webinars"}`}
          value={totalItemCount}
          subtext="Available items"
          icon={type === "assessments" ? ClipboardList : type === "activities" ? Activity : Video}
          gradient={COLORS.cardGradients.blue}
        />
        <StatCard
          title={`Avg Students ${labels.done}`}
          value={avgStudentsCompleted.toLocaleString()}
          subtext="Per item"
          icon={CheckCircle}
          gradient={COLORS.cardGradients.green}
          trend="+5.2% from last month"
        />
        <StatCard
          title={`Avg Students ${labels.pending}`}
          value={avgStudentsPending.toLocaleString()}
          subtext="Per item"
          icon={Clock}
          gradient={COLORS.cardGradients.orange}
        />
        <StatCard
          title="Avg Rate"
          value={`${engagementData.rate.toFixed(1)}%`}
          subtext={type === "assessments" ? "Submission" : type === "activities" ? "Completion" : "Attendance"}
          icon={TrendingUp}
          gradient="from-cyan-500/10 via-sky-500/10 to-blue-500/10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              {type.charAt(0).toUpperCase() + type.slice(1)} Status
            </CardTitle>
            <CardDescription>Overall completion breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                done: { label: labels.done, color: COLORS.success },
                pending: { label: labels.pending, color: COLORS.warning },
              } satisfies ChartConfig}
              className="h-[280px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {type === "webinars" ? "Monthly" : 
               timePeriod === "today" || timePeriod === "week" ? "Daily" : 
               timePeriod === "month" ? "Weekly" : "Monthly"} Trend
            </CardTitle>
            <CardDescription>Engagement rate over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                [type]: { label: type.charAt(0).toUpperCase() + type.slice(1), color: COLORS.primary },
              } satisfies ChartConfig}
              className="h-[280px]"
            >
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={trendKey} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey={type}
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Leaderboard */}
       <div className="grid gap-6">
        <AnalyticsLeaderboard
            title="School Engagement Leaderboard"
            description={`Ranking based on ${type} performance`}
            students={leaderboardData} // Real API data
            isLoading={isLeaderboardLoading}
            currentPage={leaderboardPage}
            totalPages={leaderboardTotalPages}
            totalStudents={leaderboardTotal}
            onPageChange={setLeaderboardPage}
        />
      </div>

      {/* Details Table - Shows how many students completed each item */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                {type === "assessments" ? "Assessment" : type === "activities" ? "Activity" : "Webinar"} Details
              </CardTitle>
              <CardDescription>
                How many students {type === "assessments" ? "submitted" : type === "activities" ? "completed" : "attended"} each {type.slice(0, -1)}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${type}...`}
                  value={detailsSearchQuery}
                  onChange={(e) => setDetailsSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={detailsClassFilter} onValueChange={setDetailsClassFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>{type === "webinars" ? "Date" : "Type/Category"}</TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col">
                    <span>Students</span>
                    <span className="text-xs text-muted-foreground">Assigned</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col">
                    <span>Students</span>
                    <span className="text-xs text-muted-foreground">{labels.done}</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col">
                    <span>Students</span>
                    <span className="text-xs text-muted-foreground">{labels.pending}</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDetails.map((item: any) => {
                const studentsCompleted = item.studentsSubmitted || item.studentsCompleted || item.studentsAttended;
                const studentsPending = item.studentsPending || item.studentsNotStarted || item.studentsMissed;
                const totalStudents = item.totalStudentsAssigned || item.totalStudentsInvited;
                const rate = item.submissionRate || item.completionRate || item.attendanceRate;
                return (
                  <TableRow 
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      if (type === "assessments") setSelectedAssessmentId(item.id);
                      else if (type === "activities") setSelectedActivityId(item.id);
                      else if (type === "webinars") setSelectedWebinarId(item.id);
                    }}
                  >
                    <TableCell className="font-medium max-w-[200px]">
                      <div className="truncate">{item.title}</div>
                      {item.dueDate && item.dueDate !== "Ongoing" && (
                        <div className="text-xs text-muted-foreground">Due: {item.dueDate}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.type || item.category || item.date}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold">{totalStudents}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-green-600">{studentsCompleted}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-orange-500">{studentsPending}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={rate >= 80 ? "default" : rate >= 60 ? "secondary" : "destructive"}>
                        {rate.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredDetails.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No {type} found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>



      {/* Grade-wise Performance Comparison */}

      {/* Grade-wise Performance - Placeholder until Class API integration */}
      {/* <Card>...</Card> */}

      {/* Type-specific Analytics */}




      {type === "webinars" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-500" />
              Webinar Engagement Metrics
            </CardTitle>
            <CardDescription>Detailed engagement analytics for each webinar</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Webinar</TableHead>
                  <TableHead className="text-center">Attendance</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Webinar Metrics using real data */}
                {webinarDetails.map((webinar: any) => (
                  <TableRow key={webinar.id}>
                    <TableCell className="font-medium max-w-[200px]">
                      <div className="truncate">{webinar.title}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col">
                        <span className="font-semibold">{webinar.studentsAttended}/{webinar.totalStudentsInvited}</span>
                        <span className="text-xs text-muted-foreground">
                          {webinar.totalStudentsInvited ? ((webinar.studentsAttended / webinar.totalStudentsInvited) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span className="font-medium">-</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}



    </div>
  );
}


// Class View Component
function ClassView({
  type,
  searchQuery,
  setSearchQuery,
  gradeFilter,
  setGradeFilter,
  filteredClasses,
  onClassSelect,
}: {
  type: EngagementType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  gradeFilter: string;
  setGradeFilter: (grade: string) => void;
  filteredClasses: any[];
  onClassSelect: (classId: string) => void;
}) {
  const labels = type === "assessments" ? { done: "Submitted", pending: "Pending" } :
    type === "activities" ? { done: "Completed", pending: "Not Started" } :
    { done: "Attended", pending: "Missed" };

  const grades = [...new Set(filteredClasses.map((c: any) => c.grade))].sort();

  // Calculate class comparison data for chart
  const chartData = filteredClasses.map((cls) => {
    // Backend might not return nested stats yet, so we default to 0
    const data = (type === "assessments" ? cls.assessments :
      type === "activities" ? cls.activities : cls.webinars) || { rate: 0, done: 0, total: 0 };
    return {
      name: `${cls.grade}${cls.section}`,
      rate: data.rate || 0,
      fullName: cls.name,
    };
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search classes or teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {grades.map((grade: any) => (
              <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="px-3 py-1">
          {filteredClasses.length} classes
        </Badge>
      </div>

      {/* Class Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Class-wise Comparison
          </CardTitle>
          <CardDescription>
            {type.charAt(0).toUpperCase() + type.slice(1)} completion rate by class
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              rate: { label: "Completion Rate", color: COLORS.primary },
            } satisfies ChartConfig}
            className="h-[300px]"
          >
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={60} />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{data.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          Rate: <span className="font-bold text-primary">{data.rate.toFixed(1)}%</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="rate"
                fill={COLORS.primary}
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Class Leaderboard */}
      <div className="grid gap-6">
        <AnalyticsLeaderboard
          title="Class Performance Leaderboard"
          description={`Ranking based on ${type} performance`}
          students={filteredClasses.map((cls) => {
             const data = (type === "assessments" ? cls.assessments : type === "activities" ? cls.activities : cls.webinars) || { rate: 0, done: 0, total: 0 };
             const pending = (data.total || 0) - (data.done || 0);
             const riskLevel: "high" | "medium" | "low" = pending >= 3 ? "high" : pending >= 1 ? "medium" : "low";

             return {
                id: cls.id,
                name: cls.name, // Class name as student name for leaderboard reuse
                className: `Grade ${cls.grade}`, // Grade as class name
                score: data.rate || 0,
                scoreLabel: "Completion Rate",
                streak: 0,
                riskLevel: riskLevel,
                avatar: undefined,
             };
          }).sort((a, b) => b.score - a.score)}
        />
      </div>

      {/* Class Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => {
          const data = (type === "assessments" ? cls.assessments :
            type === "activities" ? cls.activities : cls.webinars) || { rate: 0, done: 0, total: 0 };
          const completed = data.done || 0;
          const total = data.total || 0;
          const rate = data.rate || 0;
          
          return (
            <Card
              key={cls.id}
              className="group cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary"
              onClick={() => onClassSelect(cls.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {cls.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Users className="w-4 h-4" />
                      <span>{cls.totalStudents || 0} Students</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/5">
                    Grade {cls.grade}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Completion Rate
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{rate}%</span>
                      </div>
                    </div>
                    {rate >= 80 ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded">
                        <TrendingUp className="w-3 h-3" />
                        High
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded">
                        <TrendingDown className="w-3 h-3" />
                        Avg
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{labels.done}: {completed}</span>
                      <span>Target: {total}</span>
                    </div>
                    <Progress value={rate} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Teacher: {cls.teacherName || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


// Student View Component
function StudentView({
  type,
  searchQuery,
  setSearchQuery,
  filteredStudents,
  selectedClassId,
  onStudentSelect,
  onBackToClasses,
}: {
  type: EngagementType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredStudents: StudentEngagementSummary[];
  selectedClassId: string | null;
  onStudentSelect: (studentId: string) => void;
  onBackToClasses: () => void;
}) {
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<string | null>(null);
  const { user } = useAuth();
  const schoolId = user?.school_id || '';
  const [engagementFilter, setEngagementFilter] = useState<string>("all");
  const [performanceFilter, setPerformanceFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  
  const labels = type === "assessments" ? { done: "Submitted", pending: "Pending" } :
    type === "activities" ? { done: "Completed", pending: "Not Started" } :
    { done: "Attended", pending: "Missed" };
  
  // Get unique class names for filter
  const uniqueClasses = useMemo(() => {
    const classes = [...new Set(filteredStudents.map(s => s.class_name || ""))];
    return classes.filter(Boolean).sort();
  }, [filteredStudents]);
  
  const { data: classesData } = useCounsellorClasses(schoolId);
  const classes = classesData?.classes || [];

  const selectedClass = selectedClassId
    ? classes.find((c: any) => c.id === selectedClassId)
    : null;

  // Apply additional filters
  const advancedFilteredStudents = filteredStudents.filter((student) => {
    let completed = 0;
    let total = 0;
    let rate = 0;

    if (type === "assessments") {
        completed = student.assessments_completed;
        total = student.assessments_total || 0;
    } else if (type === "activities") {
        completed = student.activities_completed;
        total = student.activities_total || 0;
    } else {
        completed = student.webinars_attended || 0;
        total = student.webinars_total || 0;
    }
    
    rate = total > 0 ? (completed / total) * 100 : 0;
    const pending = total - completed;

    // Class filter
    if (classFilter !== "all" && student.className !== classFilter) {
      return false;
    }
    
    // Engagement filter
    if (engagementFilter !== "all") {
      switch (engagementFilter) {
        case "completed_all":
          if (completed !== total) return false;
          break;
        case "has_pending":
          if (pending === 0) return false;
          break;
        case "not_started":
          if (completed !== 0) return false;
          break;
        case "partial":
          if (completed === 0 || completed === total) return false;
          break;
      }
    }
    
    // Performance filter
    if (performanceFilter !== "all") {
      switch (performanceFilter) {
        case "excellent":
          if (rate < 90) return false;
          break;
        case "good":
          if (rate < 70 || rate >= 90) return false;
          break;
        case "average":
          if (rate < 50 || rate >= 70) return false;
          break;
        case "needs_attention":
          if (rate >= 50) return false;
          break;
        case "critical":
          if (rate >= 30) return false;
          break;
      }
    }
    
    return true;
  });
  
  // If a student profile is selected, show the detailed view
  if (selectedStudentProfile) {
    return (
      <StudentDetailedProfileView 
        studentId={selectedStudentProfile} 
        schoolId={schoolId}
        onBack={() => setSelectedStudentProfile(null)} 
      />
    );
  }
  
  // Get filter labels based on type
  const getEngagementFilterLabel = () => {
    switch (type) {
      case "assessments":
        return {
          completed_all: "All Submitted",
          has_pending: "Has Pending",
          not_started: "Not Submitted Any",
          partial: "Partially Submitted",
        };
      case "activities":
        return {
          completed_all: "All Completed",
          has_pending: "Has Incomplete",
          not_started: "Not Started Any",
          partial: "Partially Completed",
        };
      case "webinars":
        return {
          completed_all: "Attended All",
          has_pending: "Missed Some",
          not_started: "Missed All",
          partial: "Partial Attendance",
        };
    }
  };
  
  const engagementLabels = getEngagementFilterLabel();

  return (
    <div className="space-y-6">
      {/* Back button and filters */}
      <div className="flex flex-wrap items-center gap-4">
        {selectedClassId && (
          <Button variant="outline" onClick={onBackToClasses} className="gap-2">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Classes
          </Button>
        )}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Engagement Status Filter */}
        <Select value={engagementFilter} onValueChange={setEngagementFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Engagement Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="completed_all">{engagementLabels.completed_all}</SelectItem>
            <SelectItem value="has_pending">{engagementLabels.has_pending}</SelectItem>
            <SelectItem value="not_started">{engagementLabels.not_started}</SelectItem>
            <SelectItem value="partial">{engagementLabels.partial}</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Class Filter */}
        {!selectedClassId && uniqueClasses.length > 1 && (
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {uniqueClasses.map((className) => (
                <SelectItem key={className} value={className}>{className}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {/* Performance Filter */}
        <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Performance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="excellent">Excellent (90%+)</SelectItem>
            <SelectItem value="good">Good (70-89%)</SelectItem>
            <SelectItem value="average">Average (50-69%)</SelectItem>
            <SelectItem value="needs_attention">Needs Attention (30-49%)</SelectItem>
            <SelectItem value="critical">Critical (&lt;30%)</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Clear Filters */}
        {(engagementFilter !== "all" || performanceFilter !== "all" || classFilter !== "all") && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setEngagementFilter("all");
              setPerformanceFilter("all");
              setClassFilter("all");
            }}
            className="gap-1 text-muted-foreground"
          >
            <X className="w-3 h-3" />
            Clear Filters
          </Button>
        )}
        
        <Badge variant="secondary" className="px-3 py-1">
          {advancedFilteredStudents.length} students
        </Badge>
      </div>

      {/* Class Header if selected */}
      {selectedClass && (
        <Card className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {selectedClass.grade}{selectedClass.section}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selectedClass.teacher_name || selectedClass.teacherName || "Unknown Teacher"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                {/* Stats Text */}
                <div className="text-right">
                    {(() => {
                       // Prefer direct object (assessments) if available, fallback to metrics if needed (though ClassView uses direct object)
                       const data = (type === "assessments" ? selectedClass.assessments :
                         type === "activities" ? selectedClass.activities : selectedClass.webinars) || { rate: 0, done: 0, total: 0 };
                       return (
                         <>
                           <div className="flex items-baseline justify-end gap-2">
                              <p className="text-4xl font-bold text-primary">{data.rate.toFixed(1)}%</p>
                           </div>
                           <p className="text-sm text-muted-foreground">Completion Rate</p>
                         </>
                       );
                    })()}
                 </div>

                 {/* Pie Chart */}
                 <div className="h-[80px] w-[80px] relative">
                    {(() => {
                       const data = (type === "assessments" ? selectedClass.assessments :
                         type === "activities" ? selectedClass.activities : selectedClass.webinars) || { rate: 0, done: 0, total: 0 };
                       const completed = data.done || 0;
                       const total = data.total || 0;
                       const pending = Math.max(0, total - completed);
                       
                       return (
                         <ChartContainer
                            config={{
                              done: { label: labels.done, color: COLORS.success },
                              pending: { label: labels.pending, color: COLORS.warning },
                            } satisfies ChartConfig}
                            className="h-full w-full"
                          >
                            <PieChart>
                              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                              <Pie
                                data={[
                                  { name: labels.done, value: completed, color: COLORS.success },
                                  { name: labels.pending, value: pending, color: COLORS.warning },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={20}
                                outerRadius={35}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                 <Cell key="cell-done" fill={COLORS.success} />
                                 <Cell key="cell-pending" fill={COLORS.warning} />
                              </Pie>
                            </PieChart>
                          </ChartContainer>
                       );
                    })()}
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Student {type.charAt(0).toUpperCase() + type.slice(1)} Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="text-center">{labels.done}</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Rate</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {advancedFilteredStudents.map((student) => {
                let completed = 0;
                let total = 0;
                let rate = 0;

                if (type === "assessments") {
                    completed = student.assessments_completed;
                    total = student.assessments_total || 0;
                } else if (type === "activities") {
                    completed = student.activities_completed;
                    total = student.activities_total || 0;
                } else {
                    completed = student.webinars_attended || 0;
                    total = student.webinars_total || 0;
                }
                
                rate = total > 0 ? (completed / total) * 100 : 0;
                
                return (
                  <TableRow
                    key={student.student_id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedStudentProfile(student.student_id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.student_id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.class_name}</TableCell>
                    <TableCell className="text-center font-medium">{completed}</TableCell>
                    <TableCell className="text-center">{total}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={rate >= 80 ? "default" : rate >= 60 ? "secondary" : "destructive"}>
                        {rate.toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {student.last_active ? new Date(student.last_active).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {advancedFilteredStudents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No students found matching the filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


// Student Assessment Response View - Shows individual student's answers
// Stub for detailed profile view
// Student Detailed Profile View
function StudentDetailedProfileView({ studentId, schoolId, onBack }: { studentId: string, schoolId: string, onBack: () => void }) {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['student-profile', studentId],
    queryFn: () => counsellorAnalyticsApi.getStudentProfile(studentId, schoolId),
    enabled: !!studentId,
  });

  const [viewingAssessmentId, setViewingAssessmentId] = useState<string | null>(null);
  const [viewingActivity, setViewingActivity] = useState<any | null>(null);

  // Prepare chart data using performanceTrend
  const chartData = useMemo(() => {
     if (profile?.performanceTrend && profile.performanceTrend.length > 0) {
         return profile.performanceTrend.map(item => ({
             name: item.month,
             assessments: item.assessments,
             activities: item.activities,
             webinars: item.webinars
         }));
     }
     // Fallback if no trend data or incomplete profile
     return [];
  }, [profile]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading student profile...</p>
      </div>
    );
  }

  if (error || !profile || !profile.stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">Failed to load profile</h3>
        <p className="text-muted-foreground mb-4">Could not fetch complete student data.</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  // Refined Stats - Removed Streak, Time, Avg Score as requested
  const uniqueStats = [
    { label: "Assessments", value: profile.stats?.assessmentsCompleted ?? 0, icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-50", info: "Total Completed" },
    { label: "Activities", value: profile.stats?.activitiesCount ?? 0, icon: Activity, color: "text-blue-600", bg: "bg-blue-50", info: "Total Completed" },
    { label: "Webinars", value: profile.stats?.webinarsAttended ?? 0, icon: Video, color: "text-green-600", bg: "bg-green-50", info: "Attended Live" },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="pl-0 gap-2 mb-2" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </Button>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-2 border-white/30">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span>
                   {profile.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <div className="flex items-center gap-3 text-white/90 text-sm mb-3">
                <span>Grade {profile.class} - Section {profile.section || "A"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span>Roll: {profile.rollNumber}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span>Rank {profile.rank || "#1"} of {profile.totalStudents || 1250}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                 <Badge className="bg-amber-400/90 hover:bg-amber-500 text-black border-none gap-1">
                   <Trophy className="w-3 h-3" /> Top Scorer
                 </Badge>
                 <Badge className="bg-purple-300/30 hover:bg-purple-300/40 text-white border-white/20 gap-1 backdrop-blur-sm">
                   <CheckCircle2 className="w-3 h-3" /> Perfect Attendance
                 </Badge>
                 <Badge className="bg-blue-300/30 hover:bg-blue-300/40 text-white border-white/20 gap-1 backdrop-blur-sm">
                   <Zap className="w-3 h-3" /> Quick Learner
                 </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
             <div className="relative w-24 h-24 flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                 <div className="absolute inset-0 rounded-full border-4 border-green-400 border-t-transparent animate-spin-slow" style={{ transform: 'rotate(-45deg)' }}></div>
                 <div className="text-center">
                    <span className="text-3xl font-bold">{profile.stats.engagementScore}</span>
                 </div>
                 <div className="absolute -bottom-6 whitespace-nowrap text-sm font-medium opacity-90">Engagement Score</div>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Resized to 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {uniqueStats.map((stat, i) => (
           <Card key={i} className="border-none shadow-sm bg-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                 <div className={`mb-3 p-3 rounded-full ${stat.bg} ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                 </div>
                 <div className="text-3xl font-bold mb-1">{stat.value}</div>
                 <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                 <div className="text-xs text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded">{stat.info}</div>
              </CardContent>
           </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="bg-card rounded-lg p-1 shadow-sm border inline-flex w-full">
           <TabsList className="w-full justify-start h-auto bg-transparent p-0 gap-6 px-4">
              <TabsTrigger 
                 value="overview" 
                 className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 h-auto font-semibold text-muted-foreground data-[state=active]:text-foreground"
              >Overview</TabsTrigger>
              <TabsTrigger 
                 value="assessments"
                 className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 h-auto font-semibold text-muted-foreground data-[state=active]:text-foreground"
              >Assessments</TabsTrigger>
              <TabsTrigger 
                 value="activities"
                 className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 h-auto font-semibold text-muted-foreground data-[state=active]:text-foreground"
              >Activities</TabsTrigger>
              <TabsTrigger 
                 value="webinars"
                 className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 h-auto font-semibold text-muted-foreground data-[state=active]:text-foreground"
              >Webinars</TabsTrigger>
           </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Student Info */}
              <div className="space-y-6">
                 <Card>
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-lg">
                          <User className="w-5 h-5" /> Student Information
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <div className="text-xs text-muted-foreground mb-1">Email</div>
                             <div className="text-sm font-medium truncate" title={profile.email}>{profile.email || "N/A"}</div>
                          </div>
                          <div>
                             <div className="text-xs text-muted-foreground mb-1">Phone</div>
                             <div className="text-sm font-medium">{profile.phone || "+1 (555) 123-4567"}</div>
                          </div>
                          <div>
                             <div className="text-xs text-muted-foreground mb-1">Date of Birth</div>
                             <div className="text-sm font-medium">{profile.dob ? new Date(profile.dob).toLocaleDateString() : "N/A"}</div>
                          </div>
                          <div>
                             <div className="text-xs text-muted-foreground mb-1">Joined</div>
                             <div className="text-sm font-medium">{profile.joined ? new Date(profile.joined).toLocaleDateString() : "N/A"}</div>
                          </div>
                       </div>
                       <Separator />
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <div className="text-xs text-muted-foreground mb-1">Parent/Guardian</div>
                             <div className="text-sm font-medium">{profile.parentName || "Sarah Thompson"}</div>
                          </div>
                          <div>
                             <div className="text-xs text-muted-foreground mb-1">Parent Contact</div>
                             <div className="text-sm font-medium">{profile.parentContact || "N/A"}</div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>

                 {/* Strengths */}
                 <Card>
                   <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-green-600">
                         <CheckCircle className="w-5 h-5" /> Strengths
                      </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      {profile.strengths?.map((strength, idx) => (
                         <div key={idx}>
                            <div className="flex justify-between text-sm mb-1">
                               <span className="font-medium">{strength.skill}</span>
                               <span className="text-green-600 font-bold">{strength.score}</span>
                            </div>
                            <Progress value={strength.score} className="h-2 bg-green-100" />
                         </div>
                      ))}
                      {(!profile.strengths?.length) && <p className="text-sm text-muted-foreground">No data available.</p>}
                   </CardContent>
                 </Card>
              </div>

              {/* Right Column: Performance Trend */}
              <div className="md:col-span-2 space-y-6">
                 <Card>
                    <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-lg">
                          <TrendingUp className="w-5 h-5" /> Performance Trend
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full">
                       {/* Real Chart using Recharts Multi-Line */}
                       {chartData.length > 0 ? (
                           <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                               <XAxis 
                                 dataKey="name" 
                                 stroke="#888888" 
                                 fontSize={12} 
                                 tickLine={false} 
                                 axisLine={false}
                               />
                               <YAxis 
                                 stroke="#888888" 
                                 fontSize={12} 
                                 tickLine={false} 
                                 axisLine={false} 
                                 tickFormatter={(value) => `${value}`} 
                                 domain={[0, 100]}
                               />
                               <RechartsTooltip 
                                 cursor={{ stroke: '#888888', strokeWidth: 1 }}
                                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                               />
                               <Legend verticalAlign="top" height={36}/>
                               {/* Assessments - Purple */}
                               <Line 
                                  type="monotone" 
                                  dataKey="assessments" 
                                  name="Assessments" 
                                  stroke="#8b5cf6" 
                                  strokeWidth={3} 
                                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} 
                                  activeDot={{ r: 6 }} 
                               />
                               {/* Activities - Blue */}
                               <Line 
                                  type="monotone" 
                                  dataKey="activities" 
                                  name="Activities" 
                                  stroke="#0ea5e9" 
                                  strokeWidth={3} 
                                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} 
                                  activeDot={{ r: 6 }} 
                               />
                               {/* Webinars - Green */}
                               <Line 
                                  type="monotone" 
                                  dataKey="webinars" 
                                  name="Webinars" 
                                  stroke="#22c55e" 
                                  strokeWidth={3} 
                                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} 
                                  activeDot={{ r: 6 }} 
                               />
                             </LineChart>
                           </ResponsiveContainer>
                       ) : (
                          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                             <BarChart3 className="w-12 h-12 mb-2 opacity-20" />
                             <p>No assessment data available for trend analysis.</p>
                          </div>
                       )}
                    </CardContent>
                 </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Areas for Improvement */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2 text-lg text-red-500">
                              <AlertTriangle className="w-5 h-5" /> Areas for Improvement
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {profile.improvements?.map((area, idx) => (
                              <div key={idx}>
                                 <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">{area.skill}</span>
                                    <span className="text-red-500 font-bold">{area.score}</span>
                                 </div>
                                 <Progress value={area.score} className="h-2 bg-red-100" />
                              </div>
                           ))}
                           {(!profile.improvements?.length) && <p className="text-sm text-muted-foreground">No data available.</p>}
                        </CardContent>
                     </Card>

                     {/* Notes */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2 text-lg">
                              <FileText className="w-5 h-5" /> Notes & Observations
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                           {profile.notes && profile.notes.length > 0 ? (
                              profile.notes.map((note, idx) => (
                                <div key={idx} className="bg-muted/30 p-3 rounded-lg border text-sm hover:bg-muted/50 transition-colors">
                                   <div className="flex justify-between mb-1">
                                      <span className="font-semibold text-primary">{note.author}</span>
                                      <span className="text-xs text-muted-foreground">{new Date(note.date).toLocaleDateString()}</span>
                                   </div>
                                   <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                      <Badge variant="outline" className="text-[10px] h-4 py-0">{note.role}</Badge>
                                   </div>
                                   <p className="text-foreground/90 leading-relaxed text-xs">
                                      {note.text}
                                   </p>
                                </div>
                              ))
                           ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                 <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                 <p>No notes recorded.</p>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                 </div>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="assessments">
          {/* ... Existing Assessments Table ... */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Class Avg</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.assessments && profile.assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{assessment.status}</Badge>
                      </TableCell>
                      <TableCell className="font-bold">{assessment.totalScore}</TableCell>
                      <TableCell className="text-muted-foreground">{assessment.classAverage ?? '-'}</TableCell>
                      <TableCell>
                        {assessment.submittedAt ? new Date(assessment.submittedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                         <Button variant="ghost" size="sm" onClick={() => setViewingAssessmentId(assessment.id)}>
                            View Response
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!profile.assessments || profile.assessments.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No assessments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          {/* ... Existing Activities Table ... */}
           <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                   <TableHead>Activity</TableHead>
                   <TableHead>Type</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Submitted</TableHead>
                   <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                 {profile.activities && profile.activities.map((activity: any) => (
                   <TableRow key={activity.id}>
                     <TableCell className="font-medium">{activity.title}</TableCell>
                     <TableCell className="capitalize">{activity.type?.toLowerCase() || 'Activity'}</TableCell>
                     <TableCell>
                       <Badge variant={activity.status === 'VERIFIED' ? 'default' : 'secondary'}>
                         {activity.status}
                       </Badge>
                     </TableCell>
                     <TableCell>{new Date(activity.submittedAt).toLocaleDateString()}</TableCell>
                     <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setViewingActivity(activity)}>
                           View Response
                        </Button>
                     </TableCell>
                   </TableRow>
                 ))}
                 {(!profile.activities || profile.activities.length === 0) && (
                   <TableRow>
                     <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                       No activity history found.
                     </TableCell>
                   </TableRow>
                 )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webinars">
           {/* ... Existing Webinars Table ... */}
           <Card>
            <CardHeader>
              <CardTitle>Webinar Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.webinars && profile.webinars.map((webinar) => (
                      <TableRow key={webinar.id}>
                        <TableCell className="font-medium">{webinar.title}</TableCell>
                        <TableCell>{webinar.date ? new Date(webinar.date).toLocaleDateString() : "-"}</TableCell>
                        <TableCell>
                           <Badge variant={webinar.status === 'attended' ? 'default' : 'secondary'}>
                             {webinar.status}
                           </Badge>
                        </TableCell>
                        <TableCell>{webinar.duration} mins</TableCell>
                      </TableRow>
                  ))}
                   {(!profile.webinars || profile.webinars.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No webinar history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>

      {/* Assessment Responses Modal */}
      {viewingAssessmentId && (
        <StudentResponsesModal 
          assessmentId={viewingAssessmentId}
          studentId={studentId}
          schoolId={schoolId}
          onClose={() => setViewingAssessmentId(null)}
        />
      )}

      {/* Activity Response Modal */}
      {viewingActivity && (
         <Dialog open={true} onOpenChange={() => setViewingActivity(null)}>
           <DialogContent className="max-w-md">
             <DialogHeader>
               <DialogTitle>Activity Submission</DialogTitle>
             </DialogHeader>
             <div className="space-y-4 pt-4">
                <div className="space-y-1">
                   <h4 className="font-semibold">{viewingActivity.title}</h4>
                   <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(viewingActivity.submittedAt).toLocaleDateString()}
                   </p>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg border">
                   <p className="text-sm font-medium mb-1">Feedback:</p>
                   <p className="text-sm text-muted-foreground text-wrap break-words">
                      {viewingActivity.feedback || "No feedback provided."}
                   </p>
                </div>

                {viewingActivity.fileUrl && (
                   <div className="pt-2">
                      <Button className="w-full" asChild>
                         <a href={viewingActivity.fileUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4 mr-2" />
                            View Attached File
                         </a>
                      </Button>
                   </div>
                )}
             </div>
           </DialogContent>
         </Dialog>
      )}
    </div>
  );
}

// Student Responses Modal Component
function StudentResponsesModal({ 
  assessmentId, 
  studentId, 
  schoolId, 
  onClose 
}: { 
  assessmentId: string; 
  studentId: string; 
  schoolId: string; 
  onClose: () => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-assessment-responses', assessmentId, studentId],
    queryFn: () => counsellorAnalyticsApi.getStudentAssessmentResponses(assessmentId, studentId, schoolId),
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Student Assessment Responses</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="py-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
            <p className="text-muted-foreground">Failed to load responses</p>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Student Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{data.student.name}</h3>
                    <p className="text-sm text-muted-foreground">{data.student.className}</p>
                  </div>
                  {data.status === "submitted" && data.totalScore !== undefined && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {data.totalScore}/{data.maxScore}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((data.totalScore / (data.maxScore || 1)) * 100)}% Score
                      </p>
                    </div>
                  )}
                </div>
                {data.completedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Submitted: {new Date(data.completedAt).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Responses */}
            {data.status === "not_submitted" ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Student has not submitted this assessment yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.responses.map((response, index) => {
                  const scorePercentage = (response.score / response.maxPoints) * 100;
                  const isCorrect = scorePercentage >= 80;

                  return (
                    <Card key={response.questionId}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium mb-2">{response.questionText}</p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline">{response.questionType}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {response.maxPoints} points
                              </span>
                            </div>

                            {/* Student Answer */}
                            <div className="bg-muted/30 rounded-lg p-3 mb-2">
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Student's Answer:</p>
                              <p className="text-sm">{response.studentAnswer}</p>
                            </div>

                            {/* Score */}
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <Progress value={scorePercentage} className="h-2" />
                              </div>
                              <span className={`text-sm font-semibold ${
                                isCorrect ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {response.score}/{response.maxPoints}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Assessment Detailed View Component
function AssessmentDetailedViewComponent({
  assessment,
  onBack,
  schoolId,
}: {
  assessment: AssessmentDetailedView;
  onBack: () => void;
  schoolId: string;
}) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "questions">("overview");
  const [selectedResponseStudentId, setSelectedResponseStudentId] = useState<string | null>(null);
  const [viewStudentResponses, setViewStudentResponses] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSubmissions = assessment.submissions.filter((s) => {
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubmissions.slice(start, start + itemsPerPage);
  }, [filteredSubmissions, currentPage, itemsPerPage]);

  const handleViewResponses = (studentId: string) => {
    setViewStudentResponses(studentId);
  };

  // Show student profile if selected
  if (selectedStudentId) {
      return (
        <StudentDetailedProfileView 
          studentId={selectedStudentId}
          schoolId={schoolId}
          onBack={() => setSelectedStudentId(null)} 
        />
      );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-500">✓ Submitted</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGradeBadge = (grade?: string) => {
    if (!grade) return null;
    const colors: Record<string, string> = {
      "A+": "bg-green-600", "A": "bg-green-500", "A-": "bg-green-400",
      "B+": "bg-blue-500", "B": "bg-blue-400", "B-": "bg-blue-300",
      "C+": "bg-yellow-500", "C": "bg-yellow-400", "C-": "bg-yellow-300",
      "D": "bg-orange-500", "F": "bg-red-500",
    };
    return <Badge className={colors[grade] || "bg-gray-500"}>{grade}</Badge>;
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "multiple_choice": return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case "true_false": return <HelpCircle className="w-4 h-4 text-green-500" />;
      case "short_answer": return <MessageSquare className="w-4 h-4 text-orange-500" />;
      case "rating_scale": return <Star className="w-4 h-4 text-amber-500" />;
      case "essay": return <FileText className="w-4 h-4 text-purple-500" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getQuestionTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      multiple_choice: "Multiple Choice",
      true_false: "True/False",
      short_answer: "Short Answer",
      rating_scale: "Rating Scale",
      essay: "Essay",
    };
    return <Badge variant="outline" className="text-xs">{labels[type] || type}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Assessments
      </Button>

      {/* Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <Badge className="bg-white/20 mb-2">{assessment.type}</Badge>
              <h1 className="text-2xl font-bold">{assessment.title}</h1>
              <p className="text-white/80 mt-2 max-w-2xl">{assessment.description}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/80">
                <span>Created by: {assessment.createdBy}</span>
                <span>•</span>
                <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>{assessment.totalQuestions} Questions</span>
                {assessment.timeLimit && <><span>•</span><span>{assessment.timeLimit} min limit</span></>}
              </div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">{assessment.avgScore.toFixed(1)}</p>
              <p className="text-sm text-white/80">Avg Score</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <p className="text-2xl font-bold text-blue-600">{assessment.totalStudentsAssigned}</p>
              <p className="text-xs text-muted-foreground">Assigned</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
              <p className="text-2xl font-bold text-green-600">{assessment.studentsSubmitted}</p>
              <p className="text-xs text-muted-foreground">Submitted</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/30">
              <p className="text-2xl font-bold text-yellow-600">{assessment.studentsPending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
              <p className="text-2xl font-bold text-red-600">{assessment.studentsOverdue}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
              <p className="text-2xl font-bold text-emerald-600">{assessment.passRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Pass Rate</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30">
              <p className="text-2xl font-bold text-purple-600">{assessment.avgTimeSpent} min</p>
              <p className="text-xs text-muted-foreground">Avg Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Overview and Questions */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "overview" | "questions")}>
        <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50 backdrop-blur-sm rounded-xl mb-4">
          <TabsTrigger value="overview" className="rounded-lg gap-2 data-[state=active]:bg-violet-500 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4" />
            Overview & Students
          </TabsTrigger>
          <TabsTrigger value="questions" className="rounded-lg gap-2 data-[state=active]:bg-violet-500 data-[state=active]:text-white">
            <FileText className="w-4 h-4" />
            Questions & Responses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ count: { label: "Students", color: COLORS.primary } } satisfies ChartConfig}
                  className="h-[200px]"
                >
                  <BarChart data={assessment.scoreDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="range" tickLine={false} axisLine={false} fontSize={11} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Class-wise Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Class-wise Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(assessment.classWiseStats || []).map((cls) => (
                    <div key={cls.className} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{cls.className}</p>
                        <p className="text-xs text-muted-foreground">{cls.submitted}/{cls.total} submitted</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={(cls.submitted / cls.total) * 100} className="h-2 w-20" />
                        <span className="font-bold text-primary w-12 text-right">{cls.avgScore.toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mb-6">
            <AnalyticsLeaderboard
              title="Assessment Top Performers"
              description="Ranking based on score and completion time"
              students={filteredSubmissions.map((s) => ({
                id: s.studentId,
                name: s.studentName,
                className: s.className,
                score: s.score || 0,
                scoreLabel: "Score",
                streak: 0,
                riskLevel: (s.score || 0) < 50 ? "high" : (s.score || 0) < 70 ? "medium" : "low",
                avatar: undefined,
              }))}
            />
          </div>

          {/* Student Submissions Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Student Submissions</CardTitle>
                  <CardDescription>{filteredSubmissions.length} students</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-[200px]"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubmissions.map((submission) => (
                    <TableRow 
                      key={submission.studentId}
                      className="hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {submission.studentName.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-medium">{submission.studentName}</p>
                            <p className="text-xs text-muted-foreground">{submission.rollNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{submission.className}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-center">
                        {submission.score !== undefined ? (
                          <span className={`font-bold ${submission.score >= 80 ? "text-green-500" : submission.score >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                            {submission.score}/{submission.maxScore}
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {submission.status === "submitted" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-1 h-7 text-xs"
                              onClick={() => handleViewResponses(submission.studentId)}
                            >
                              <FileText className="w-3 h-3" />
                              Responses
                            </Button>
                          )}

                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1 h-7 text-xs"
                            onClick={() => setSelectedStudentId(submission.studentId)}
                          >
                            <User className="w-3 h-3" />
                            Profile
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
             <div className="p-4 border-t">
               <Pagination>
                 <PaginationContent>
                   <PaginationItem>
                     <PaginationPrevious 
                       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                       className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                     />
                   </PaginationItem>
                   <PaginationItem>
                      <span className="px-4 text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
                   </PaginationItem>
                   <PaginationItem>
                     <PaginationNext 
                       onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                       className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                     />
                   </PaginationItem>
                 </PaginationContent>
               </Pagination>
             </div>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {assessment.questions && assessment.questions.length > 0 ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-violet-500" />
                  Assessment Questions ({assessment.questions.length})
                </CardTitle>
                <CardDescription>View all questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessment.questions.map((q) => (
                    <div key={q.question_id || q.id} className="p-4 rounded-xl border bg-muted/30">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm">
                          Q{q.questionNumber}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{q.question}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <Badge variant="outline">{q.type}</Badge>
                             <span className="text-xs text-muted-foreground">{q.points} pts</span>
                          </div>

                          {/* Question Stats */}
                           {q.stats && q.stats.totalResponses > 0 && (
                              <div className="mt-4 pt-4 border-t border-dashed">
                                 <div className="text-xs font-semibold mb-2">{q.stats.totalResponses} Responses</div>
                                 <div className="space-y-3">
                                    {q.options && q.options.length > 0 ? (
                                       q.options.map((opt) => {
                                          const count = q.stats?.optionCounts[opt] || 0;
                                          const percentage = Math.round((count / q.stats!.totalResponses) * 100);
                                          return (
                                             <div key={opt} className="text-sm">
                                                <div className="flex justify-between mb-1">
                                                   <span className="text-muted-foreground">{opt}</span>
                                                   <span className="font-medium">{count} ({percentage}%)</span>
                                                </div>
                                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                   <div className="h-full bg-violet-500 rounded-full" style={{ width: `${percentage}%` }} />
                                                </div>
                                             </div>
                                          );
                                       })
                                    ) : (
                                       <div className="text-xs text-muted-foreground italic">
                                          Response breakdown available for multiple choice questions.
                                       </div>
                                    )}
                                 </div>
                              </div>
                           )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
             <Card>
               <CardContent className="py-12 text-center">
                 <p className="text-muted-foreground">No questions available.</p>
               </CardContent>
             </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Student Responses Modal */}
      {viewStudentResponses && (
        <StudentResponsesModal
          assessmentId={assessment.id}
          studentId={viewStudentResponses}
          schoolId={schoolId}
          onClose={() => setViewStudentResponses(null)}
        />
      )}
    </div>
  );
}

// Activity Detailed View Component
function ActivityDetailedViewComponent({
  activity,
  onBack,
  schoolId,
}: {
  activity: ActivityDetailedView;
  onBack: () => void;
  schoolId: string;
}) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "tasks">("overview");
  const [selectedResponseStudentId, setSelectedResponseStudentId] = useState<string | null>(null);
  const [viewStudentResponses, setViewStudentResponses] = useState<string | null>(null);

  // Show student profile if selected
  if (selectedStudentId) {
      return (
        <StudentDetailedProfileView 
          studentId={selectedStudentId}
          schoolId={schoolId}
          onBack={() => setSelectedStudentId(null)} 
        />
      );
  }

  const filteredCompletions = activity.completions.filter((c) => {
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesSearch = c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">✓ Completed</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "not_started":
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return <Badge className="bg-green-500">Easy</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "Hard":
        return <Badge className="bg-red-500">Hard</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "reflection": return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case "exercise": return <Activity className="w-4 h-4 text-green-500" />;
      case "journal": return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "video": return <Play className="w-4 h-4 text-red-500" />;
      case "quiz": return <ClipboardList className="w-4 h-4 text-orange-500" />;
      case "interactive": return <Star className="w-4 h-4 text-amber-500" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTaskTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      reflection: "Reflection",
      exercise: "Exercise",
      journal: "Journal",
      video: "Video",
      quiz: "Quiz",
      interactive: "Interactive",
    };
    return <Badge variant="outline" className="text-xs">{labels[type] || type}</Badge>;
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-500 gap-1"><CheckCircle2 className="w-3 h-3" /> Done</Badge>;
      case "in_progress": return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> In Progress</Badge>;
      case "skipped": return <Badge variant="outline" className="gap-1 text-muted-foreground"><XCircle className="w-3 h-3" /> Skipped</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Activities
      </Button>

      {/* Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20">{activity.category}</Badge>
                {getDifficultyBadge(activity.difficulty)}
              </div>
              <h1 className="text-2xl font-bold">{activity.title}</h1>
              <p className="text-white/80 mt-2 max-w-2xl">{activity.description}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/80">
                <span>Created by: {activity.createdBy}</span>
                <span>•</span>
                <span>Due: {activity.dueDate}</span>
                <span>•</span>
                <span>Est. Time: {activity.estimatedTime} min</span>
              </div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">{(activity.completionRate || 0).toFixed(0)}%</p>
              <p className="text-sm text-white/80">Completion</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <p className="text-2xl font-bold text-blue-600">{activity.totalStudentsAssigned}</p>
              <p className="text-xs text-muted-foreground">Assigned</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
              <p className="text-2xl font-bold text-green-600">{activity.studentsCompleted}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>

            <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
              <div className="flex items-center justify-center gap-1">
                <span className="text-amber-500">★</span>
                <p className="text-2xl font-bold text-amber-600">{(activity.avgRating || 0).toFixed(1)}</p>
              </div>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Overview and Tasks */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "overview" | "tasks")}>
        <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50 backdrop-blur-sm rounded-xl mb-4">
          <TabsTrigger value="overview" className="rounded-lg gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4" />
            Overview & Students
          </TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-lg gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <Activity className="w-4 h-4" />
            Tasks & Responses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Progress Distribution - Removed as not supported by API */ }

            {/* Class-wise Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Class-wise Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(activity.classWiseStats || []).map((cls) => (
                    <div key={cls.className} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{cls.className}</p>
                        <p className="text-xs text-muted-foreground">{cls.completed}/{cls.total} completed</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={cls.total > 0 ? (cls.completed / cls.total) * 100 : 0} className="h-2 w-20" />
                        <span className="font-bold text-primary w-12 text-right">
                          {cls.total > 0 ? ((cls.completed / cls.total) * 100).toFixed(0) : 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

{/* Activity Leaderboard Removed as data not available in summary */ }

          {/* Student Completions Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Student Progress</CardTitle>
                  <CardDescription>{filteredCompletions.length} students</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-[200px]"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="not_started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompletions.map((completion) => (
                    <TableRow 
                      key={completion.studentId}
                      className="hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {completion.studentName.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-medium">{completion.studentName}</p>
                            <p className="text-xs text-muted-foreground">{completion.rollNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{completion.className}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(completion.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {completion.completedAt ? new Date(completion.completedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1 h-7 text-xs"
                            onClick={() => setSelectedStudentId(completion.studentId)}
                          >
                            <User className="w-3 h-3" />
                            Profile
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" />
                Activity Tasks ({activity.tasks?.length || 0})
              </CardTitle>
              <CardDescription>View all tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {activity.tasks && activity.tasks.length > 0 ? (
                <div className="space-y-4">
                  {activity.tasks.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl border bg-muted/30">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{t.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{t.type}</Badge>
                          {t.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No tasks defined.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Webinar Detailed View Component
function WebinarDetailedViewComponent({
  webinar,
  onBack,
  schoolId,
}: {
  webinar: WebinarDetailedView;
  onBack: () => void;
  schoolId: string;
}) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Show student profile if selected
  if (selectedStudentId) {
      return (
        <StudentDetailedProfileView 
          studentId={selectedStudentId}
          schoolId={schoolId}
          onBack={() => setSelectedStudentId(null)} 
        />
      );
  }

  const filteredAttendance = (webinar.attendance || []).filter((a) => {
    const matchesClass = !selectedClassName || a.className === selectedClassName;
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    const matchesSearch = a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesStatus && matchesSearch;
  });

  // Reset to page 1 when filters change
  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleClassSelect = (className: string) => {
    setSelectedClassName(className);
    setFilterStatus("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleBackToAllClasses = () => {
    setSelectedClassName(null);
    setFilterStatus("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredAttendance.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const paginatedAttendance = filteredAttendance.slice(startIndex, endIndex);

  // Get selected class stats
  const selectedClassStats = selectedClassName 
    ? (webinar.classWiseStats || []).find(c => c.className === selectedClassName)
    : null;

  const getStatusBadge = (status: string, attended: boolean) => {
    if (status === "attended" || attended) {
      return <Badge className="bg-green-500 hover:bg-green-600">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Present
      </Badge>;
    } else {
      return <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Absent
      </Badge>;
    }
  };

  // Calculate stats from the data
  const totalInvited = webinar.totalStudentsInvited || (webinar.attendance || []).length;
  const attendedCount = webinar.studentsAttended || (webinar.attendance || []).filter(a => a.status === 'attended').length;
  const absentCount = webinar.studentsAbsent || (webinar.attendance || []).filter(a => a.status === 'absent').length;
  
  const ratings = (webinar.attendance || []).filter(a => a.rating).map(a => a.rating || 0);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : webinar.avgRating || 0;

  return (
    <div className="space-y-6">

      <Button variant="outline" onClick={onBack} className="gap-2">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Webinars
      </Button>

      {/* Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white">
          <Badge className="bg-white/20 mb-2">{webinar.topic}</Badge>
          <h1 className="text-2xl font-bold">{webinar.title}</h1>
          <p className="text-white/80 mt-2">{webinar.description}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/80">
            <span>📅 {new Date(webinar.scheduledDate).toLocaleDateString()}</span>
            <span>⏱️ {webinar.duration} mins</span>
            <span>👤 {webinar.presenter}</span>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <p className="text-2xl font-bold text-blue-600">{totalInvited}</p>
              <p className="text-xs text-muted-foreground">Total Invited</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
              <p className="text-2xl font-bold text-green-600">{attendedCount}</p>
              <p className="text-xs text-muted-foreground">Present</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
              <p className="text-2xl font-bold text-emerald-600">
                {totalInvited > 0 ? Math.round((attendedCount / totalInvited) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Attendance Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class-wise Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Class-wise Attendance
          </CardTitle>
          <CardDescription>
            Click on a class to view detailed student attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {(webinar.classWiseStats || []).map((cls) => (
              <div 
                key={cls.className} 
                className="p-3 rounded-xl bg-muted/50 border hover:bg-muted hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => handleClassSelect(cls.className)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">
                    {cls.className}
                  </span>
                  <Badge variant={cls.attended / cls.total >= 0.8 ? "default" : cls.attended / cls.total >= 0.6 ? "secondary" : "destructive"}>
                    {((cls.attended / cls.total) * 100).toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={(cls.attended / cls.total) * 100} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{cls.attended}/{cls.total} attended</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              {selectedClassName && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToAllClasses}
                  className="gap-2 mb-2 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Classes
                </Button>
              )}
              <CardTitle className="flex items-center gap-2">
                {selectedClassName ? (
                  <>
                    <Users className="w-5 h-5 text-primary" />
                    {selectedClassName} - Student Attendance
                  </>
                ) : (
                  "Student Attendance List"
                )}
              </CardTitle>
              <CardDescription>
                {selectedClassName && selectedClassStats && (
                  <span className="inline-flex items-center gap-2 mr-3">
                    <Badge variant="outline">
                      {selectedClassStats.attended}/{selectedClassStats.total} Present
                    </Badge>
                    <Badge variant="outline">
                      {((selectedClassStats.attended / selectedClassStats.total) * 100).toFixed(0)}% Attendance
                    </Badge>
                  </span>
                )}
                Showing {filteredAttendance.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredAttendance.length)} of {filteredAttendance.length} students
                {filterStatus !== "all" && ` (filtered by ${filterStatus})`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 w-[200px]"
                />
              </div>
              <Select value={filterStatus} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="attended">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAttendance.map((attendance) => (
                  <TableRow 
                    key={attendance.studentId}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                          {attendance.studentName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{attendance.studentName}</p>
                          <p className="text-xs text-muted-foreground">{attendance.rollNumber || "N/A"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {attendance.className}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(attendance.status, attendance.attended)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedStudentId(attendance.studentId)}
                        className="gap-1"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredAttendance.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-lg font-medium text-muted-foreground">No students found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? "Try adjusting your search terms" : "No students match the selected filters"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredAttendance.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    const showEllipsis = 
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return (
                        <PaginationItem key={page}>
                          <span className="px-2">...</span>
                        </PaginationItem>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
