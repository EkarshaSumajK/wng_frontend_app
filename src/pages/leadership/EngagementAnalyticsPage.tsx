import { useState, useMemo } from "react";
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
  HelpCircle,
  Star,
  Play,
  BookOpen,
  Filter,
  RefreshCw,
  Sparkles,
  Target,
  Zap,
  GraduationCap,
  Building2,
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
  Area,
  AreaChart,
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
  mockSchoolEngagement,
  mockClassEngagement,
  mockStudentEngagement,
  mockAssessmentDetails,
  mockActivityDetails,
  mockWebinarDetails,
  mockEngagementTrends,
  mockEngagementStats,
  mockTopPerformers,
  mockNonSubmitters,
  mockTimeBasedMetrics,
  mockScoreDistribution,
  mockDifficultyAnalysis,
  mockGradePerformance,
  mockActivityCategoryStats,
  mockWebinarEngagementMetrics,
  mockStudentRiskAssessment,
  mockComprehensiveStats,
  mockImprovementTracking,
  mockStudentDetailedProfiles,
  mockAssessmentDetailedViews,
  mockActivityDetailedViews,
  mockWebinarDetailedViews,
  mockAssessmentQuestions,
  mockActivityTasks,
  type ClassEngagementSummary,
  type StudentEngagementSummary,
  type StudentDetailedProfile,
  type AssessmentDetailedView,
  type ActivityDetailedView,
  type WebinarDetailedView,
} from "@/data/engagementAnalyticsMockData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { AnalyticsLeaderboard, type LeaderboardEntry } from "@/components/shared/AnalyticsLeaderboard";

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

  // Get time-based metrics
  const currentMetrics = mockTimeBasedMetrics[timePeriod] || mockTimeBasedMetrics.month;

  // Filter classes based on search and grade
  const filteredClasses = useMemo(() => {
    return mockClassEngagement.filter((cls) => {
      const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = gradeFilter === "all" || cls.grade === gradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [searchQuery, gradeFilter]);

  // Filter students based on search and selected class
  const filteredStudents = useMemo(() => {
    let students = mockStudentEngagement;
    if (selectedClassId) {
      const selectedClass = mockClassEngagement.find((c) => c.id === selectedClassId);
      if (selectedClass) {
        students = students.filter((s) => s.className === selectedClass.name);
      }
    }
    if (searchQuery) {
      students = students.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.className.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return students;
  }, [searchQuery, selectedClassId]);

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
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-purple-600/20 rounded-3xl" />
        <div className="absolute inset-0 bg-card/60 backdrop-blur-xl rounded-3xl" />
        <div className="relative p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl blur-lg opacity-50" />
                <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl ring-2 ring-white/20">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Engagement Analytics
                  </h1>
                  <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    School-wide
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Comprehensive view of student participation across all classes
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
                            ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md" 
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
              <CalendarDays className="w-4 h-4 text-indigo-500" />
              <span className="text-muted-foreground">Period:</span>
              <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 border-0">
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
              <span className="text-blue-600 font-medium">{mockClassEngagement.length} Classes</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Users className="w-4 h-4 text-amber-500" />
              <span className="text-amber-600 font-medium">{mockSchoolEngagement.totalStudents.toLocaleString()} Students</span>
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button variant="link" className="p-0 h-auto" onClick={handleBackToSchool}>
                Overall
              </Button>
              {selectedClassId && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <Button variant="link" className="p-0 h-auto" onClick={handleBackToClasses}>
                    {mockClassEngagement.find((c) => c.id === selectedClassId)?.name}
                  </Button>
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
interface EngagementContentProps {
  type: EngagementType;
  viewLevel: ViewLevel;
  timePeriod: TimePeriod;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  gradeFilter: string;
  setGradeFilter: (grade: string) => void;
  filteredClasses: ClassEngagementSummary[];
  filteredStudents: StudentEngagementSummary[];
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
  const getEngagementData = (item: any) => {
    switch (type) {
      case "assessments": return item.assessments;
      case "activities": return item.activities;
      case "webinars": return item.webinars;
    }
  };

  const getSchoolData = () => getEngagementData(mockSchoolEngagement);
  const getActionLabel = () => {
    switch (type) {
      case "assessments": return { done: "Submitted", pending: "Pending" };
      case "activities": return { done: "Completed", pending: "In Progress" };
      case "webinars": return { done: "Attended", pending: "Missed" };
    }
  };

  const labels = getActionLabel();

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

  // Fallback for direct student view if somehow reached
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
  
  const schoolData = mockSchoolEngagement;
  const engagementData = type === "assessments" ? schoolData.assessments :
    type === "activities" ? schoolData.activities : schoolData.webinars;
  
  const details = type === "assessments" ? mockAssessmentDetails :
    type === "activities" ? mockActivityDetails : mockWebinarDetails;
  
  // Get unique classes for filter
  const uniqueClasses = [...new Set(mockClassEngagement.map(c => c.name))].sort();
  
  // Filter details based on search
  const filteredDetails = details.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(detailsSearchQuery.toLowerCase()) ||
      (item.type && item.type.toLowerCase().includes(detailsSearchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(detailsSearchQuery.toLowerCase()));
    return matchesSearch;
  });
  
  // Show detailed assessment view if selected
  if (selectedAssessmentId && type === "assessments") {
    const assessmentDetail = mockAssessmentDetailedViews[selectedAssessmentId];
    if (assessmentDetail) {
      return <AssessmentDetailedViewComponent assessment={assessmentDetail} onBack={() => setSelectedAssessmentId(null)} />;
    }
  }
  
  // Show detailed activity view if selected
  if (selectedActivityId && type === "activities") {
    const activityDetail = mockActivityDetailedViews[selectedActivityId];
    if (activityDetail) {
      return <ActivityDetailedViewComponent activity={activityDetail} onBack={() => setSelectedActivityId(null)} />;
    }
  }
  
  // Show detailed webinar view if selected
  if (selectedWebinarId && type === "webinars") {
    const webinarDetail = mockWebinarDetailedViews[selectedWebinarId];
    if (webinarDetail) {
      return <WebinarDetailedViewComponent webinar={webinarDetail} onBack={() => setSelectedWebinarId(null)} />;
    }
  }

  // Determine trend data based on selected type and time period
  const trendData = type === "webinars" 
    ? mockEngagementTrends.monthly 
    : (() => {
      switch (timePeriod) {
        case "today": return mockEngagementTrends.daily;
        case "week": return mockEngagementTrends.daily;
        case "month": return mockEngagementTrends.weekly;
        case "year": return mockEngagementTrends.monthly;
        default: return mockEngagementTrends.daily;
      }
    })();

  const trendKey = type === "webinars" 
    ? "month" 
    : (() => {
      switch (timePeriod) {
        case "today": 
        case "week": return "date";
        case "month": return "week";
        case "year": return "month";
        default: return "date";
      }
    })();
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
  const avgStudentsCompleted = Math.round(
    details.reduce((sum: number, item: any) => 
      sum + (item.studentsSubmitted || item.studentsCompleted || item.studentsAttended || 0), 0
    ) / totalItemCount
  );
  const avgStudentsPending = Math.round(
    details.reduce((sum: number, item: any) => 
      sum + (item.studentsPending || item.studentsNotStarted || item.studentsMissed || 0), 0
    ) / totalItemCount
  );

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
            students={mockStudentEngagement.map((s) => {
                const data = type === "assessments" ? s.assessments : type === "activities" ? s.activities : s.webinars;
                // Calculate pending count for "Needs Attention" check
                const pending = data.total - data.done;
                const riskLevel: "high" | "medium" | "low" = pending >= 3 ? "high" : pending >= 1 ? "medium" : "low";
                
                return {
                    id: s.id,
                    name: s.name,
                    className: s.className,
                    score: data.rate,
                    scoreLabel: "Completion Rate",
                    streak: 0, 
                    riskLevel: riskLevel,
                    avatar: undefined,
                };
            })}
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Grade-wise Performance
          </CardTitle>
          <CardDescription>Compare engagement rates across different grades</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              [type === "assessments" ? "assessmentRate" : type === "activities" ? "activityRate" : "webinarRate"]: { 
                label: type === "assessments" ? "Assessments" : type === "activities" ? "Activities" : "Webinars", 
                color: type === "assessments" ? COLORS.primary : type === "activities" ? COLORS.secondary : COLORS.success 
              },
            } satisfies ChartConfig}
            className="h-[300px]"
          >
            <BarChart data={mockGradePerformance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="grade" tickLine={false} axisLine={false} tickFormatter={(v) => `Grade ${v}`} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey={type === "assessments" ? "assessmentRate" : type === "activities" ? "activityRate" : "webinarRate"} 
                name={type === "assessments" ? "Assessments" : type === "activities" ? "Activities" : "Webinars"} 
                fill={type === "assessments" ? COLORS.primary : type === "activities" ? COLORS.secondary : COLORS.success} 
                radius={[4, 4, 0, 0]} 
                barSize={30} 
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Type-specific Analytics */}
      {type === "assessments" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              Assessment Difficulty Analysis
            </CardTitle>
            <CardDescription>Pass rates and average time per assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDifficultyAnalysis.map((item) => (
                <div key={item.assessmentId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={item.difficulty === "Easy" ? "default" : item.difficulty === "Medium" ? "secondary" : "destructive"} className="text-xs">
                        {item.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Avg: {item.avgTimeMinutes} min</span>
                    </div>
                  </div>
                  <div className="text-center ml-4">
                    <p className={`font-bold ${item.passRate >= 80 ? "text-green-500" : item.passRate >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                      {item.passRate.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Pass Rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {type === "activities" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-500" />
              Activity Category Performance
            </CardTitle>
            <CardDescription>Engagement breakdown by activity category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockActivityCategoryStats.map((cat) => (
                <div key={cat.category} className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{cat.category}</h4>
                    <Badge variant="outline">#{cat.popularityRank}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">{cat.avgCompletionRate}%</span>
                    </div>
                    <Progress value={cat.avgCompletionRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{cat.totalActivities} activities</span>
                      <span>~{cat.avgTimeSpentMinutes} min avg</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Engagement:</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${cat.studentEngagement}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{cat.studentEngagement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                {mockWebinarEngagementMetrics.map((webinar) => (
                  <TableRow key={webinar.webinarId}>
                    <TableCell className="font-medium max-w-[200px]">
                      <div className="truncate">{webinar.title}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col">
                        <span className="font-semibold">{webinar.actualAttendees}/{webinar.totalRegistered}</span>
                        <span className="text-xs text-muted-foreground">{((webinar.actualAttendees/webinar.totalRegistered)*100).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span className="font-medium">{webinar.rating}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Students at Risk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Students at Risk
          </CardTitle>
          <CardDescription>Students requiring immediate attention based on engagement patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockStudentRiskAssessment.map((student) => (
              <div
                key={student.studentId}
                className={`p-4 rounded-xl border ${
                  student.riskLevel === "High" ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" :
                  student.riskLevel === "Medium" ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800" :
                  "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      student.riskLevel === "High" ? "bg-red-100 dark:bg-red-900" :
                      student.riskLevel === "Medium" ? "bg-yellow-100 dark:bg-yellow-900" :
                      "bg-green-100 dark:bg-green-900"
                    }`}>
                      <span className={`text-lg font-bold ${
                        student.riskLevel === "High" ? "text-red-600" :
                        student.riskLevel === "Medium" ? "text-yellow-600" :
                        "text-green-600"
                      }`}>{student.riskScore}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{student.studentName}</p>
                      <p className="text-sm text-muted-foreground">{student.className}</p>
                    </div>
                  </div>
                  <Badge variant={student.riskLevel === "High" ? "destructive" : student.riskLevel === "Medium" ? "secondary" : "default"}>
                    {student.riskLevel} Risk
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {student.factors.map((factor, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{factor}</Badge>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-dashed">
                  <p className="text-xs text-muted-foreground mb-2">Recommended Actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.recommendedActions.map((action, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{action}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


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
  filteredClasses: ClassEngagementSummary[];
  onClassSelect: (classId: string) => void;
}) {
  const labels = type === "assessments" ? { done: "Submitted", pending: "Pending" } :
    type === "activities" ? { done: "Completed", pending: "Not Started" } :
    { done: "Attended", pending: "Missed" };

  const grades = [...new Set(mockClassEngagement.map((c) => c.grade))].sort();

  // Calculate class comparison data for chart
  const chartData = filteredClasses.map((cls) => {
    const data = type === "assessments" ? cls.assessments :
      type === "activities" ? cls.activities : cls.webinars;
    return {
      name: `${cls.grade}${cls.section}`,
      rate: data.rate,
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
            {grades.map((grade) => (
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
             const data = type === "assessments" ? cls.assessments : type === "activities" ? cls.activities : cls.webinars;
             const pending = data.total - data.done;
             const riskLevel: "high" | "medium" | "low" = pending >= 3 ? "high" : pending >= 1 ? "medium" : "low";

             return {
                id: cls.id,
                name: cls.name, // Class name as student name
                className: `Grade ${cls.grade}`, // Grade as class name
                score: data.rate,
                scoreLabel: "Completion Rate",
                streak: 0,
                riskLevel: riskLevel,
                avatar: undefined,
             };
          })}
        />
      </div>

      {/* Class Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => {
          const data = type === "assessments" ? cls.assessments :
            type === "activities" ? cls.activities : cls.webinars;
          const completed = data.done;
          
          return (
            <Card
              key={cls.id}
              className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
              onClick={() => onClassSelect(cls.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
                      {cls.grade}{cls.section}
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {cls.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{cls.teacherName}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{labels.done}</span>
                    <span className="font-medium">{completed} / {data.total}</span>
                  </div>
                  <Progress value={data.rate} className="h-2" />
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{cls.totalStudents} students</Badge>
                    <span className={`text-lg font-bold ${
                      data.rate >= 80 ? "text-green-500" :
                      data.rate >= 60 ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {data.rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No classes found matching your criteria</p>
          </CardContent>
        </Card>
      )}
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
  const [engagementFilter, setEngagementFilter] = useState<string>("all");
  const [performanceFilter, setPerformanceFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  
  const labels = type === "assessments" ? { done: "Submitted", pending: "Pending" } :
    type === "activities" ? { done: "Completed", pending: "Not Started" } :
    { done: "Attended", pending: "Missed" };
  
  // Get unique class names for filter
  const uniqueClasses = useMemo(() => {
    const classes = [...new Set(filteredStudents.map(s => s.className))];
    return classes.sort();
  }, [filteredStudents]);
  
  // Apply additional filters
  const advancedFilteredStudents = filteredStudents.filter((student) => {
    const data = type === "assessments" ? student.assessments :
      type === "activities" ? student.activities : student.webinars;
    
    // Class filter
    if (classFilter !== "all" && student.className !== classFilter) {
      return false;
    }
    
    // Engagement filter
    if (engagementFilter !== "all") {
      const pending = data.total - data.done;
      switch (engagementFilter) {
        case "completed_all":
          if (data.done !== data.total) return false;
          break;
        case "has_pending":
          if (pending === 0) return false;
          break;
        case "not_started":
          if (data.done !== 0) return false;
          break;
        case "partial":
          if (data.done === 0 || data.done === data.total) return false;
          break;
      }
    }
    
    // Performance filter
    if (performanceFilter !== "all") {
      switch (performanceFilter) {
        case "excellent":
          if (data.rate < 90) return false;
          break;
        case "good":
          if (data.rate < 70 || data.rate >= 90) return false;
          break;
        case "average":
          if (data.rate < 50 || data.rate >= 70) return false;
          break;
        case "needs_attention":
          if (data.rate >= 50) return false;
          break;
        case "critical":
          if (data.rate >= 30) return false;
          break;
      }
    }
    
    return true;
  });
  
  const studentProfile = selectedStudentProfile ? mockStudentDetailedProfiles[selectedStudentProfile] : null;
  
  // If a student profile is selected, show the detailed view
  if (studentProfile) {
    return (
      <StudentDetailedProfileView 
        profile={studentProfile} 
        onBack={() => setSelectedStudentProfile(null)} 
      />
    );
  }

  const selectedClass = selectedClassId
    ? mockClassEngagement.find((c) => c.id === selectedClassId)
    : null;
  
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
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                {selectedClass.grade}{selectedClass.section}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedClass.name}</h2>
                <p className="text-muted-foreground">{selectedClass.teacherName}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-primary">
                  {(type === "assessments" ? selectedClass.assessments :
                    type === "activities" ? selectedClass.activities :
                    selectedClass.webinars).rate.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
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
                const data = type === "assessments" ? student.assessments :
                  type === "activities" ? student.activities : student.webinars;
                const completed = data.done;
                
                return (
                  <TableRow
                    key={student.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedStudentProfile(student.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell className="text-center font-medium">{completed}</TableCell>
                    <TableCell className="text-center">{data.total}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={data.rate >= 80 ? "default" : data.rate >= 60 ? "secondary" : "destructive"}>
                        {data.rate.toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(student.lastActive).toLocaleDateString()}
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
function StudentAssessmentResponseView({
  assessment,
  studentResponse,
  questions,
  onBack,
}: {
  assessment: AssessmentDetailedView;
  studentResponse: { studentId: string; studentName: string; className: string; rollNumber: string; submittedAt: string; totalScore: number; maxScore: number; percentage: number; timeSpent: number; responses: { questionId: string; studentAnswer: string; isCorrect?: boolean; pointsEarned: number; timeSpent?: number }[] };
  questions: { id: string; questionNumber: number; question: string; type: string; options?: string[]; correctAnswer?: string; points: number; category: string }[];
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Assessment
      </Button>

      {/* Student Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {studentResponse.studentName.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <h1 className="text-xl font-bold">{studentResponse.studentName}</h1>
              <p className="text-white/80">{studentResponse.className} • {studentResponse.rollNumber}</p>
              <p className="text-white/60 text-sm mt-1">Submitted: {new Date(studentResponse.submittedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Assessment</p>
              <p className="font-medium">{assessment.title}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className={`text-2xl font-bold ${studentResponse.percentage >= 80 ? "text-green-500" : studentResponse.percentage >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                  {studentResponse.totalScore}/{studentResponse.maxScore}
                </p>
                <p className="text-xs text-muted-foreground">Score ({studentResponse.percentage}%)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{studentResponse.timeSpent}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions and Answers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-violet-500" />
            Questions & Answers ({questions.length})
          </CardTitle>
          <CardDescription>Review {studentResponse.studentName}'s responses to each question</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questions.map((q) => {
              const response = studentResponse.responses.find(r => r.questionId === q.id);
              return (
                <div key={q.id} className="p-4 rounded-xl border bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 font-bold">
                      {q.questionNumber}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{q.question}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{q.type.replace("_", " ")}</Badge>
                            <Badge variant="secondary" className="text-xs">{q.category}</Badge>
                            <span className="text-xs text-muted-foreground">{q.points} pts</span>
                          </div>
                        </div>
                        {response && (
                          <div className="text-right">
                            {response.isCorrect !== undefined ? (
                              response.isCorrect ? (
                                <Badge className="bg-green-500 gap-1"><CheckCircle className="w-3 h-3" /> Correct</Badge>
                              ) : (
                                <Badge variant="destructive" className="gap-1"><AlertCircle className="w-3 h-3" /> Incorrect</Badge>
                              )
                            ) : (
                              <Badge variant="secondary">{response.pointsEarned}/{q.points} pts</Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {q.options && (
                        <div className="mt-3 space-y-1">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = q.correctAnswer === opt;
                            const isSelected = response?.studentAnswer === opt;
                            return (
                              <div 
                                key={optIdx} 
                                className={`text-sm px-3 py-2 rounded-lg flex items-center justify-between ${
                                  isCorrect ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" : 
                                  isSelected && !isCorrect ? "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700" : 
                                  "bg-muted/50"
                                }`}
                              >
                                <span>{opt}</span>
                                <div className="flex items-center gap-2">
                                  {isCorrect && <Badge className="bg-green-500 text-xs">Correct Answer</Badge>}
                                  {isSelected && <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs">Student's Answer</Badge>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {!q.options && response && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Student's Answer:</p>
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm whitespace-pre-wrap">{response.studentAnswer}</p>
                          </div>
                        </div>
                      )}

                      {response?.timeSpent && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Time spent: {Math.floor(response.timeSpent / 60)}:{(response.timeSpent % 60).toString().padStart(2, '0')}
                        </div>
                      )}

                      {!response && (
                        <div className="mt-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-muted-foreground text-sm">
                          No response recorded
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Student Activity Response View - Shows individual student's task responses
function StudentActivityResponseView({
  activity,
  studentResponse,
  tasks,
  onBack,
}: {
  activity: ActivityDetailedView;
  studentResponse: { studentId: string; studentName: string; className: string; rollNumber: string; startedAt: string; completedAt?: string; progress: number; totalTasks: number; completedTasks: number; responses: { taskId: string; status: string; response?: string; completedAt?: string; timeSpent?: number; rating?: number; feedback?: string }[] };
  tasks: { id: string; taskNumber: number; title: string; description: string; type: string; duration: number; points: number; isRequired: boolean }[];
  onBack: () => void;
}) {
  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-500 gap-1"><CheckCircle className="w-3 h-3" /> Completed</Badge>;
      case "in_progress": return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> In Progress</Badge>;
      case "skipped": return <Badge variant="outline" className="gap-1 text-muted-foreground">Skipped</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
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

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Activity
      </Button>

      {/* Student Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {studentResponse.studentName.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <h1 className="text-xl font-bold">{studentResponse.studentName}</h1>
              <p className="text-white/80">{studentResponse.className} • {studentResponse.rollNumber}</p>
              <p className="text-white/60 text-sm mt-1">Started: {new Date(studentResponse.startedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activity</p>
              <p className="font-medium">{activity.title}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <Progress value={studentResponse.progress} className="h-2 w-24" />
                  <span className={`text-xl font-bold ${studentResponse.progress === 100 ? "text-green-500" : studentResponse.progress >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                    {studentResponse.progress}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{studentResponse.completedTasks}/{studentResponse.totalTasks} tasks</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks and Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            Tasks & Responses ({tasks.length})
          </CardTitle>
          <CardDescription>Review {studentResponse.studentName}'s progress on each task</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tasks.map((t) => {
              const response = studentResponse.responses.find(r => r.taskId === t.id);
              return (
                <div key={t.id} className="p-4 rounded-xl border bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600">
                      {getTaskTypeIcon(t.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Task {t.taskNumber}: {t.title}</p>
                            {t.isRequired && <Badge variant="secondary" className="text-xs">Required</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{t.type}</Badge>
                            <span className="text-xs text-muted-foreground">{t.duration} min • {t.points} pts</span>
                          </div>
                        </div>
                        {response ? getTaskStatusBadge(response.status) : <Badge variant="outline">Not Started</Badge>}
                      </div>

                      {response?.response && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Student's Response:</p>
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm whitespace-pre-wrap">{response.response}</p>
                          </div>
                        </div>
                      )}

                      {response && (
                        <div className="mt-3 flex items-center gap-4 flex-wrap">
                          {response.rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">Rating:</span>
                              <span className="text-amber-500">{"★".repeat(response.rating)}{"☆".repeat(5 - response.rating)}</span>
                            </div>
                          )}
                          {response.timeSpent && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {response.timeSpent} min
                            </div>
                          )}
                          {response.completedAt && (
                            <span className="text-xs text-muted-foreground">
                              Completed: {new Date(response.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      {response?.feedback && (
                        <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                          <p className="text-xs text-amber-700 dark:text-amber-400 italic">Student feedback: "{response.feedback}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Student Detailed Profile View Component
function StudentDetailedProfileView({ 
  profile, 
  onBack 
}: { 
  profile: StudentDetailedProfile; 
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "assessments" | "activities" | "webinars">("overview");
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
      case "completed":
      case "attended":
        return <Badge className="bg-green-500">✓ {status}</Badge>;
      case "pending":
      case "in_progress":
        return <Badge variant="secondary">{status.replace("_", " ")}</Badge>;
      case "overdue":
      case "missed":
        return <Badge variant="destructive">{status}</Badge>;
      case "partial":
        return <Badge variant="outline" className="text-yellow-600">Partial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Students
      </Button>

      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold shadow-lg">
              {profile.name.split(" ").map(n => n[0]).join("")}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-white/80">
                <span>{profile.className}</span>
                <span>•</span>
                <span>Roll: {profile.rollNumber}</span>
                <span>•</span>
                <span>Rank #{profile.rank} of {profile.totalRanked}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.badges.slice(0, 4).map(badge => (
                  <span key={badge.id} className="px-2 py-1 bg-white/20 rounded-full text-sm" title={badge.description}>
                    {badge.icon} {badge.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Score Circle */}
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full border-4 ${profile.overallEngagementScore >= 80 ? "border-green-400" : profile.overallEngagementScore >= 60 ? "border-yellow-400" : "border-red-400"} flex items-center justify-center bg-white/10`}>
                <span className="text-2xl font-bold">{profile.overallEngagementScore}</span>
              </div>
              <p className="text-sm mt-1 text-white/80">Engagement Score</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30">
              <p className="text-2xl font-bold text-violet-600">{profile.assessments.rate}%</p>
              <p className="text-xs text-muted-foreground">Assessments</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <p className="text-2xl font-bold text-blue-600">{profile.activities.rate}%</p>
              <p className="text-xs text-muted-foreground">Activities</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
              <p className="text-2xl font-bold text-emerald-600">{profile.webinars.rate}%</p>
              <p className="text-xs text-muted-foreground">Webinars</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <p className="text-2xl font-bold text-orange-600">{profile.streak}</p>
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30">
              <p className="text-2xl font-bold text-cyan-600">{Math.round(profile.totalTimeSpent / 60)}h</p>
              <p className="text-xs text-muted-foreground">Time Spent</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-pink-50 dark:bg-pink-950/30">
              <p className="text-2xl font-bold text-pink-600">{profile.assessments.avgScore?.toFixed(0) || "N/A"}</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="webinars">Webinars</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Joined</p>
                    <p className="font-medium">{new Date(profile.joinedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Parent/Guardian</p>
                    <p className="font-medium">{profile.parentName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Parent Contact</p>
                    <p className="font-medium">{profile.parentContact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    assessmentScore: { label: "Assessment", color: COLORS.primary },
                    activityRate: { label: "Activity", color: COLORS.secondary },
                    webinarRate: { label: "Webinar", color: COLORS.success },
                  } satisfies ChartConfig}
                  className="h-[200px]"
                >
                  <LineChart data={profile.monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="assessmentScore" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="activityRate" stroke={COLORS.secondary} strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="webinarRate" stroke={COLORS.success} strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.strengths.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.area}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">{item.score}</span>
                        {item.trend === "improving" && <TrendingUp className="w-4 h-4 text-green-500" />}
                      </div>
                    </div>
                    <Progress value={item.score} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">{item.recommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.weaknesses.length > 0 ? profile.weaknesses.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.area}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-bold">{item.score}</span>
                        {item.trend === "declining" && <TrendingDown className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                    <Progress value={item.score} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">{item.recommendation}</p>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-center py-4">No significant weaknesses identified</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notes from Teachers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Notes & Observations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.notes.map((note) => (
                <div key={note.id} className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{note.author}</span>
                      <Badge variant="outline" className="ml-2 text-xs">{note.role}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(note.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm">{note.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>
                {profile.assessments.done}/{profile.assessments.total} completed • Avg Score: {profile.assessments.avgScore?.toFixed(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Time</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.recentAssessments.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-center">
                        {item.score !== undefined ? (
                          <span className={getScoreColor(item.score)}>{item.score}/{item.maxScore}</span>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-center">{item.timeSpent ? `${item.timeSpent} min` : "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>
                {profile.activities.done}/{profile.activities.total} completed • Avg Time: {profile.activities.avgTimeSpent} min
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Time Spent</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.recentActivities.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-center">{item.timeSpent ? `${item.timeSpent} min` : "-"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webinars Tab */}
        <TabsContent value="webinars" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Webinar Attendance</CardTitle>
              <CardDescription>
                {profile.webinars.done}/{profile.webinars.total} attended • Avg Watch Time: {profile.webinars.avgWatchTime} min
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Webinar</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Watch Time</TableHead>
                    <TableHead className="text-center">Questions</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.recentWebinars.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-center">
                        {item.watchTime ? `${item.watchTime}/${item.totalDuration} min (${item.watchPercentage}%)` : "-"}
                      </TableCell>
                      <TableCell className="text-center">{item.questionsAsked}</TableCell>
                      <TableCell className="text-center">
                        {item.rating ? (
                          <span className="text-amber-500">{"★".repeat(item.rating)}</span>
                        ) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


// Assessment Detailed View Component
function AssessmentDetailedViewComponent({
  assessment,
  onBack,
}: {
  assessment: AssessmentDetailedView;
  onBack: () => void;
}) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "questions">("overview");
  const [selectedResponseStudentId, setSelectedResponseStudentId] = useState<string | null>(null);
  const [viewStudentResponses, setViewStudentResponses] = useState<string | null>(null);

  // Get questions data for this assessment
  const questionsData = mockAssessmentQuestions[assessment.id];

  // Show student's individual responses view
  if (viewStudentResponses && questionsData) {
    const studentResponse = questionsData.studentResponses.find(sr => sr.studentId === viewStudentResponses);
    if (studentResponse) {
      return (
        <StudentAssessmentResponseView
          assessment={assessment}
          studentResponse={studentResponse}
          questions={questionsData.questions}
          onBack={() => setViewStudentResponses(null)}
        />
      );
    }
  }

  // Show student profile if selected
  if (selectedStudentId) {
    const studentProfile = mockStudentDetailedProfiles[selectedStudentId];
    if (studentProfile) {
      return (
        <StudentDetailedProfileView 
          profile={studentProfile} 
          onBack={() => setSelectedStudentId(null)} 
        />
      );
    }
  }

  const filteredSubmissions = assessment.submissions.filter((s) => {
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
                  <BarChart data={assessment.scoreDistribution}>
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
                  {assessment.classWiseStats.map((cls) => (
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
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Time</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
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
                      <TableCell className="text-center">{getGradeBadge(submission.grade) || "-"}</TableCell>
                      <TableCell className="text-center">{submission.timeSpent ? `${submission.timeSpent} min` : "-"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {submission.status === "submitted" && questionsData && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1 h-7 text-xs"
                              onClick={() => setViewStudentResponses(submission.studentId)}
                            >
                              <FileText className="w-3 h-3" />
                              View Answers
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
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          {questionsData ? (
            <>
              {/* Questions List */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-violet-500" />
                    Assessment Questions ({questionsData.questions.length})
                  </CardTitle>
                  <CardDescription>View all questions and their details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {questionsData.questions.map((q) => (
                      <div key={q.id} className="p-4 rounded-xl border bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 font-bold text-sm">
                              Q{q.questionNumber}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{q.question}</p>
                              <div className="flex items-center gap-2 mt-2">
                                {getQuestionTypeIcon(q.type)}
                                {getQuestionTypeBadge(q.type)}
                                <Badge variant="secondary" className="text-xs">{q.category}</Badge>
                                <span className="text-xs text-muted-foreground">{q.points} pts</span>
                              </div>
                              {q.options && (
                                <div className="mt-3 space-y-1">
                                  {q.options.map((opt, idx) => (
                                    <div key={idx} className={`text-xs px-2 py-1 rounded ${q.correctAnswer === opt ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-muted/50"}`}>
                                      {opt} {q.correctAnswer === opt && <CheckCircle2 className="w-3 h-3 inline ml-1" />}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Student Responses */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-500" />
                    Student Responses ({questionsData.studentResponses.length})
                  </CardTitle>
                  <CardDescription>Click on a student to view their detailed responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questionsData.studentResponses.map((sr) => (
                      <div key={sr.studentId}>
                        <div 
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedResponseStudentId === sr.studentId ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30" : "hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-950/20"}`}
                          onClick={() => setSelectedResponseStudentId(selectedResponseStudentId === sr.studentId ? null : sr.studentId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                {sr.studentName.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-medium">{sr.studentName}</p>
                                <p className="text-xs text-muted-foreground">{sr.className} • {sr.rollNumber}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className={`font-bold text-lg ${sr.percentage >= 80 ? "text-green-500" : sr.percentage >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                                  {sr.totalScore}/{sr.maxScore}
                                </p>
                                <p className="text-xs text-muted-foreground">{sr.percentage}%</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">{sr.timeSpent} min</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{new Date(sr.submittedAt).toLocaleDateString()}</p>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${selectedResponseStudentId === sr.studentId ? "rotate-90" : ""}`} />
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded Response Details */}
                        {selectedResponseStudentId === sr.studentId && (
                          <div className="mt-2 ml-4 p-4 rounded-xl bg-muted/30 border-l-4 border-violet-500 space-y-4">
                            {sr.responses.map((resp, idx) => {
                              const question = questionsData.questions.find(q => q.id === resp.questionId);
                              if (!question) return null;
                              return (
                                <div key={resp.questionId} className="p-3 rounded-lg bg-background">
                                  <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 text-xs font-bold">
                                      {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-muted-foreground">{question.question}</p>
                                      <div className="mt-2 p-2 rounded-lg bg-muted/50">
                                        <p className="text-sm font-medium">{resp.studentAnswer}</p>
                                      </div>
                                      <div className="flex items-center gap-3 mt-2">
                                        {resp.isCorrect !== undefined && (
                                          resp.isCorrect ? (
                                            <Badge className="bg-green-500 gap-1"><CheckCircle2 className="w-3 h-3" /> Correct</Badge>
                                          ) : (
                                            <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Incorrect</Badge>
                                          )
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                          Points: <span className="font-medium text-foreground">{resp.pointsEarned}/{question.points}</span>
                                        </span>
                                        {resp.timeSpent && (
                                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {Math.floor(resp.timeSpent / 60)}:{(resp.timeSpent % 60).toString().padStart(2, '0')}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                  <h3 className="font-medium text-lg">No Question Data Available</h3>
                  <p className="text-muted-foreground text-sm mt-1">Question details for this assessment are not available yet.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Activity Detailed View Component
function ActivityDetailedViewComponent({
  activity,
  onBack,
}: {
  activity: ActivityDetailedView;
  onBack: () => void;
}) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "tasks">("overview");
  const [selectedResponseStudentId, setSelectedResponseStudentId] = useState<string | null>(null);
  const [viewStudentResponses, setViewStudentResponses] = useState<string | null>(null);

  // Get tasks data for this activity
  const tasksData = mockActivityTasks[activity.id];

  // Show student's individual task responses view
  if (viewStudentResponses && tasksData) {
    const studentResponse = tasksData.studentResponses.find(sr => sr.studentId === viewStudentResponses);
    if (studentResponse) {
      return (
        <StudentActivityResponseView
          activity={activity}
          studentResponse={studentResponse}
          tasks={tasksData.tasks}
          onBack={() => setViewStudentResponses(null)}
        />
      );
    }
  }

  // Show student profile if selected
  if (selectedStudentId) {
    const studentProfile = mockStudentDetailedProfiles[selectedStudentId];
    if (studentProfile) {
      return (
        <StudentDetailedProfileView 
          profile={studentProfile} 
          onBack={() => setSelectedStudentId(null)} 
        />
      );
    }
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
              <p className="text-3xl font-bold">{activity.completionRate.toFixed(0)}%</p>
              <p className="text-sm text-white/80">Completion</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <p className="text-2xl font-bold text-blue-600">{activity.totalStudentsAssigned}</p>
              <p className="text-xs text-muted-foreground">Assigned</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
              <p className="text-2xl font-bold text-green-600">{activity.studentsCompleted}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/30">
              <p className="text-2xl font-bold text-yellow-600">{activity.studentsInProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-950/30">
              <p className="text-2xl font-bold text-gray-600">{activity.studentsNotStarted}</p>
              <p className="text-xs text-muted-foreground">Not Started</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
              <div className="flex items-center justify-center gap-1">
                <span className="text-amber-500">★</span>
                <p className="text-2xl font-bold text-amber-600">{activity.avgRating.toFixed(1)}</p>
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
            {/* Progress Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Progress Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ count: { label: "Students", color: COLORS.secondary } } satisfies ChartConfig}
                  className="h-[200px]"
                >
                  <BarChart data={activity.progressDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="range" tickLine={false} axisLine={false} fontSize={11} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

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
                  {activity.classWiseStats.map((cls) => (
                    <div key={cls.className} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{cls.className}</p>
                        <p className="text-xs text-muted-foreground">{cls.completed}/{cls.total} completed</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={cls.avgProgress} className="h-2 w-20" />
                        <span className="font-bold text-primary w-12 text-right">{cls.avgProgress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mb-6">
            <AnalyticsLeaderboard
              title="Activity Top Performers"
              description="Ranking based on progress and completion"
              students={tasksData ? tasksData.studentResponses.map((sr) => ({
                id: sr.studentId,
                name: sr.studentName,
                className: sr.className,
                score: sr.progress,
                scoreLabel: "Progress",
                streak: 0,
                riskLevel: sr.progress < 50 ? "high" : sr.progress < 80 ? "medium" : "low",
                avatar: undefined,
              })) : []}
            />
          </div>

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
                    <TableHead className="text-center">Time Spent</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
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
                      <TableCell className="text-center">
                        {completion.timeSpent ? `${Math.round(completion.timeSpent / 60)}h ${completion.timeSpent % 60}m` : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {completion.rating ? (
                          <span className="text-amber-500">{"★".repeat(completion.rating)}</span>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {completion.completedAt ? new Date(completion.completedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {completion.status !== "not_started" && tasksData && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1 h-7 text-xs"
                              onClick={() => setViewStudentResponses(completion.studentId)}
                            >
                              <Activity className="w-3 h-3" />
                              View Tasks
                            </Button>
                          )}
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
          {tasksData ? (
            <>
              {/* Tasks List */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-500" />
                    Activity Tasks ({tasksData.tasks.length})
                  </CardTitle>
                  <CardDescription>View all tasks and their details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasksData.tasks.map((t) => (
                      <div key={t.id} className="p-4 rounded-xl border bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 font-bold text-sm">
                              {t.taskNumber}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{t.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                {getTaskTypeIcon(t.type)}
                                {getTaskTypeBadge(t.type)}
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {t.duration} min
                                </span>
                                <span className="text-xs text-muted-foreground">{t.points} pts</span>
                                {t.isRequired && <Badge variant="secondary" className="text-xs">Required</Badge>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Student Responses */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-500" />
                    Student Responses ({tasksData.studentResponses.length})
                  </CardTitle>
                  <CardDescription>Click on a student to view their task responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasksData.studentResponses.map((sr) => (
                      <div key={sr.studentId}>
                        <div 
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedResponseStudentId === sr.studentId ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30" : "hover:border-cyan-300 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20"}`}
                          onClick={() => setSelectedResponseStudentId(selectedResponseStudentId === sr.studentId ? null : sr.studentId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                {sr.studentName.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-medium">{sr.studentName}</p>
                                <p className="text-xs text-muted-foreground">{sr.className} • {sr.rollNumber}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <Progress value={sr.progress} className="h-2 w-20" />
                                  <span className={`font-bold ${sr.progress === 100 ? "text-green-500" : sr.progress >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                                    {sr.progress}%
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{sr.completedTasks}/{sr.totalTasks} tasks</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Started</p>
                                <p className="text-xs">{new Date(sr.startedAt).toLocaleDateString()}</p>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${selectedResponseStudentId === sr.studentId ? "rotate-90" : ""}`} />
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded Response Details */}
                        {selectedResponseStudentId === sr.studentId && (
                          <div className="mt-2 ml-4 p-4 rounded-xl bg-muted/30 border-l-4 border-cyan-500 space-y-4">
                            {sr.responses.length > 0 ? sr.responses.map((resp) => {
                              const task = tasksData.tasks.find(t => t.id === resp.taskId);
                              if (!task) return null;
                              return (
                                <div key={resp.taskId} className="p-3 rounded-lg bg-background">
                                  <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 text-xs font-bold">
                                      {task.taskNumber}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{task.title}</p>
                                        {getTaskStatusBadge(resp.status)}
                                      </div>
                                      {resp.response && (
                                        <div className="mt-2 p-2 rounded-lg bg-muted/50">
                                          <p className="text-sm whitespace-pre-wrap">{resp.response}</p>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                                        {resp.timeSpent && (
                                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {resp.timeSpent} min
                                          </span>
                                        )}
                                        {resp.rating && (
                                          <span className="text-xs text-amber-500">
                                            {"★".repeat(resp.rating)}{"☆".repeat(5 - resp.rating)}
                                          </span>
                                        )}
                                        {resp.completedAt && (
                                          <span className="text-xs text-muted-foreground">
                                            Completed: {new Date(resp.completedAt).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                      {resp.feedback && (
                                        <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                                          <p className="text-xs text-amber-700 dark:text-amber-400 italic">"{resp.feedback}"</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }) : (
                              <div className="text-center py-4 text-muted-foreground">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">No tasks started yet</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <Activity className="w-12 h-12 text-muted-foreground mb-3" />
                  <h3 className="font-medium text-lg">No Task Data Available</h3>
                  <p className="text-muted-foreground text-sm mt-1">Task details for this activity are not available yet.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Webinar Detailed View Component
function WebinarDetailedViewComponent({
  webinar,
  onBack,
}: {
  webinar: WebinarDetailedView;
  onBack: () => void;
}) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Show student profile if selected
  if (selectedStudentId) {
    const studentProfile = mockStudentDetailedProfiles[selectedStudentId];
    if (studentProfile) {
      return (
        <StudentDetailedProfileView 
          profile={studentProfile} 
          onBack={() => setSelectedStudentId(null)} 
        />
      );
    }
  }

  const filteredAttendance = webinar.attendance.filter((a) => {
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    const matchesSearch = a.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attended": return <Badge className="bg-green-500">✓ Attended</Badge>;
      case "partial": return <Badge variant="secondary">Partial</Badge>;
      case "missed": return <Badge variant="destructive">Missed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

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
            <span>🕐 {webinar.startTime} - {webinar.endTime}</span>
            <span>⏱️ {webinar.duration} mins</span>
            <span>👤 {webinar.presenter} ({webinar.presenterRole})</span>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <p className="text-2xl font-bold text-blue-600">{webinar.totalStudentsInvited}</p>
              <p className="text-xs text-muted-foreground">Invited</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
              <p className="text-2xl font-bold text-green-600">{webinar.studentsAttended}</p>
              <p className="text-xs text-muted-foreground">Attended</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/30">
              <p className="text-2xl font-bold text-yellow-600">{webinar.studentsPartial}</p>
              <p className="text-xs text-muted-foreground">Partial</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
              <p className="text-2xl font-bold text-red-600">{webinar.studentsMissed}</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30">
              <p className="text-2xl font-bold text-purple-600">{webinar.avgWatchPercentage.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Avg Watch</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
              <div className="flex items-center justify-center gap-1">
                <span className="text-amber-500">★</span>
                <p className="text-2xl font-bold text-amber-600">{webinar.avgRating.toFixed(1)}</p>
              </div>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
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
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {webinar.classWiseStats.map((cls) => (
              <div key={cls.className} className="p-3 rounded-xl bg-muted/50 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{cls.className}</span>
                  <Badge variant={cls.attended / cls.total >= 0.8 ? "default" : cls.attended / cls.total >= 0.6 ? "secondary" : "destructive"}>
                    {((cls.attended / cls.total) * 100).toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={(cls.attended / cls.total) * 100} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{cls.attended}/{cls.total} attended</span>
                  <span>Avg: {cls.avgWatchTime} min</span>
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
            <div>
              <CardTitle>Student Attendance</CardTitle>
              <CardDescription>{filteredAttendance.length} students</CardDescription>
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
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
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
                <TableHead className="text-center">Watch Time</TableHead>
                <TableHead className="text-center">Questions</TableHead>
                <TableHead className="text-center">Polls</TableHead>
                <TableHead className="text-center">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((attendance) => (
                <TableRow 
                  key={attendance.studentId}
                  className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                  onClick={() => setSelectedStudentId(attendance.studentId)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                        {attendance.studentName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{attendance.studentName}</p>
                        <p className="text-xs text-muted-foreground">{attendance.rollNumber}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{attendance.className}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(attendance.status)}</TableCell>
                  <TableCell className="text-center">
                    {attendance.watchTime !== undefined ? (
                      <div>
                        <p className="font-medium">{attendance.watchTime}/{webinar.duration} min</p>
                        <p className="text-xs text-muted-foreground">{attendance.watchPercentage?.toFixed(0)}%</p>
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-violet-600 font-medium">{attendance.questionsAsked}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-blue-600 font-medium">{attendance.pollsAnswered}</span>
                  </TableCell>
                  <TableCell className="text-center flex items-center justify-center gap-2">
                    {attendance.rating ? (
                      <span className="text-amber-500">{"★".repeat(attendance.rating)}</span>
                    ) : "-"}
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredAttendance.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="w-10 h-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No students found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
