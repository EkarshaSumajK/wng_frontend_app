import { useState, useMemo } from "react";
import {
  Users,
  User,
  ChevronRight,
  BarChart3,
  ClipboardList,
  Activity,
  Video,
  Search,
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Award,
  AlertTriangle,
  Flame,
  CalendarDays,
  CalendarRange,
  FileText,
  Clock,
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
  mockClassEngagement,
  mockStudentEngagement,
  mockEngagementTrends,
  mockAssessmentDetails,
  mockActivityDetails,
  mockWebinarDetails,
  mockTopPerformers,
  mockNonSubmitters,
  mockTimeBasedMetrics,
  mockScoreDistribution,
  mockDifficultyAnalysis,
  mockActivityCategoryStats,
  mockWebinarEngagementMetrics,
  mockStudentRiskAssessment,
  mockImprovementTracking,
  mockStudentDetailedProfiles,
  mockAssessmentDetailedViews,
  mockActivityDetailedViews,
  mockWebinarDetailedViews,
  mockAssessmentQuestions,
  mockActivityTasks,
  type ClassEngagementSummary,
  type AssessmentQuestionsData,
  type ActivityTasksData,
  type StudentEngagementSummary,
  type StudentDetailedProfile,
  type AssessmentDetailedView,
  type ActivityDetailedView,
  type WebinarDetailedView,
} from "@/data/engagementAnalyticsMockData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const COLORS = {
  primary: "#8b5cf6",
  secondary: "#06b6d4",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  cardGradients: {
    violet: "from-violet-500/10 via-purple-500/10 to-indigo-500/10",
    blue: "from-blue-500/10 via-cyan-500/10 to-sky-500/10",
    green: "from-emerald-500/10 via-green-500/10 to-teal-500/10",
    orange: "from-orange-500/10 via-amber-500/10 to-yellow-500/10",
  },
};

type EngagementType = "assessments" | "activities" | "webinars";
type ViewLevel = "myClasses" | "class" | "student";
type TimePeriod = "today" | "week" | "month" | "year" | "custom";

// Mock: Teacher's assigned classes (subset of all classes)
const teacherClasses = mockClassEngagement.slice(0, 3);

export default function TeacherEngagementAnalyticsPage() {
  const [engagementType, setEngagementType] = useState<EngagementType>("assessments");
  const [viewLevel, setViewLevel] = useState<ViewLevel>("myClasses");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Get time-based metrics
  const currentMetrics = mockTimeBasedMetrics[timePeriod] || mockTimeBasedMetrics.month;

  // Filter students based on search and selected class
  const filteredStudents = useMemo(() => {
    let students = mockStudentEngagement;
    if (selectedClassId) {
      const selectedClass = teacherClasses.find((c) => c.id === selectedClassId);
      if (selectedClass) {
        students = students.filter((s) => s.className === selectedClass.name);
      }
    } else {
      // Show only students from teacher's classes
      const teacherClassNames = teacherClasses.map((c) => c.name);
      students = students.filter((s) => teacherClassNames.includes(s.className));
    }
    if (searchQuery) {
      students = students.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.className.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return students;
  }, [searchQuery, selectedClassId]);

  // Calculate totals for teacher's classes
  const teacherTotals = useMemo(() => {
    const totals = {
      totalStudents: 0,
      assessments: { done: 0, total: 0, rate: 0 },
      activities: { done: 0, total: 0, rate: 0 },
      webinars: { done: 0, total: 0, rate: 0 },
    };
    teacherClasses.forEach((cls) => {
      totals.totalStudents += cls.totalStudents;
      totals.assessments.done += cls.assessments.done;
      totals.assessments.total += cls.assessments.total;
      totals.activities.done += cls.activities.done;
      totals.activities.total += cls.activities.total;
      totals.webinars.done += cls.webinars.done;
      totals.webinars.total += cls.webinars.total;
    });
    totals.assessments.rate = (totals.assessments.done / totals.assessments.total) * 100;
    totals.activities.rate = (totals.activities.done / totals.activities.total) * 100;
    totals.webinars.rate = (totals.webinars.done / totals.webinars.total) * 100;
    return totals;
  }, []);

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setViewLevel("student");
    setSearchQuery("");
  };

  const handleBackToClasses = () => {
    setSelectedClassId(null);
    setViewLevel("myClasses");
    setSearchQuery("");
  };

  const labels = engagementType === "assessments" ? { done: "Submitted", pending: "Pending" } :
    engagementType === "activities" ? { done: "Completed", pending: "Not Started" } :
    { done: "Attended", pending: "Missed" };

  return (
    <TooltipProvider>
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-10">
      <AnimatedBackground />

      {/* Enhanced Header */}
      <div className="relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl" />
        <div className="absolute inset-0 bg-card/60 backdrop-blur-xl rounded-3xl" />
        <div className="relative p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl blur-lg opacity-50" />
                <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl ring-2 ring-white/20">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    My Class Engagement
                  </h1>
                  <Badge variant="secondary" className="bg-violet-500/10 text-violet-600 border-violet-500/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Track student participation across assessments, activities & webinars
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
                            ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md" 
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
              <CalendarDays className="w-4 h-4 text-violet-500" />
              <span className="text-muted-foreground">Period:</span>
              <Badge variant="secondary" className="bg-violet-500/10 text-violet-600 border-0">
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
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-medium">{teacherClasses.length} Classes</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Users className="w-4 h-4 text-amber-500" />
              <span className="text-amber-600 font-medium">{teacherTotals.totalStudents} Students</span>
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
            setSearchQuery("");
          }}>
            <TabsList className="h-11 p-1 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm">
              <TabsTrigger value="myClasses" className="rounded-lg gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">My Classes</span>
              </TabsTrigger>
              <TabsTrigger value="class" className="rounded-lg gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Class Detail</span>
              </TabsTrigger>
              <TabsTrigger value="student" className="rounded-lg gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Students</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Breadcrumb Navigation */}
          {selectedClassId && (
            <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary" onClick={handleBackToClasses}>
                My Classes
              </Button>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{teacherClasses.find((c) => c.id === selectedClassId)?.name}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {viewLevel === "myClasses" && (
            <MyClassesView
              type={engagementType}
              teacherClasses={teacherClasses}
              teacherTotals={teacherTotals}
              onClassSelect={handleClassSelect}
              labels={labels}
            />
          )}

          {viewLevel === "class" && (
            <ClassDetailView
              type={engagementType}
              teacherClasses={teacherClasses}
              selectedClassId={selectedClassId}
              onClassSelect={handleClassSelect}
              labels={labels}
            />
          )}

          {viewLevel === "student" && (
            <StudentView
              type={engagementType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredStudents={filteredStudents}
              selectedClassId={selectedClassId}
              onBackToClasses={handleBackToClasses}
              labels={labels}
            />
          )}
        </div>
      </Tabs>
    </div>
    </TooltipProvider>
  );
}


// My Classes Overview Component
function MyClassesView({
  type,
  teacherClasses,
  teacherTotals,
  onClassSelect,
  labels,
}: {
  type: EngagementType;
  teacherClasses: ClassEngagementSummary[];
  teacherTotals: any;
  onClassSelect: (classId: string) => void;
  labels: { done: string; pending: string };
}) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedWebinarId, setSelectedWebinarId] = useState<string | null>(null);
  
  // Show detailed assessment view if selected
  if (selectedAssessmentId && type === "assessments") {
    const assessmentDetail = mockAssessmentDetailedViews[selectedAssessmentId];
    if (assessmentDetail) {
      return <TeacherAssessmentDetailView assessment={assessmentDetail} onBack={() => setSelectedAssessmentId(null)} />;
    }
  }
  
  // Show detailed activity view if selected
  if (selectedActivityId && type === "activities") {
    const activityDetail = mockActivityDetailedViews[selectedActivityId];
    if (activityDetail) {
      return <TeacherActivityDetailView activity={activityDetail} onBack={() => setSelectedActivityId(null)} />;
    }
  }
  
  // Show detailed webinar view if selected
  if (selectedWebinarId && type === "webinars") {
    const webinarDetail = mockWebinarDetailedViews[selectedWebinarId];
    if (webinarDetail) {
      return <TeacherWebinarDetailView webinar={webinarDetail} onBack={() => setSelectedWebinarId(null)} />;
    }
  }
  
  const engagementData = type === "assessments" ? teacherTotals.assessments :
    type === "activities" ? teacherTotals.activities : teacherTotals.webinars;

  const pieData = [
    { name: labels.done, value: engagementData.done, color: COLORS.success },
    { name: labels.pending, value: engagementData.total - engagementData.done, color: COLORS.warning },
  ];

  const chartData = teacherClasses.map((cls) => {
    const data = type === "assessments" ? cls.assessments :
      type === "activities" ? cls.activities : cls.webinars;
    return {
      name: `${cls.grade}${cls.section}`,
      rate: data.rate,
      fullName: cls.name,
    };
  });

  const StatCard = ({ title, value, icon: Icon, gradient, trend }: any) => (
    <Card className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${gradient} group hover:scale-[1.02] transition-transform duration-300`}>
      <CardContent className="pt-6 relative z-10">
        <div className="absolute right-4 top-4 p-2 bg-white/10 rounded-xl backdrop-blur-sm">
          <Icon className="w-6 h-6 text-foreground/80 dark:text-white/90" />
        </div>
        <p className="text-3xl font-bold text-foreground dark:text-white mb-1 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-muted-foreground dark:text-white/70">{title}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="My Classes"
          value={teacherClasses.length}
          icon={Users}
          gradient={COLORS.cardGradients.violet}
        />
        <StatCard
          title="Total Students"
          value={teacherTotals.totalStudents}
          icon={User}
          gradient={COLORS.cardGradients.blue}
        />
        <StatCard
          title={labels.done}
          value={engagementData.done.toLocaleString()}
          icon={CheckCircle}
          gradient={COLORS.cardGradients.green}
          trend="+3.5% this week"
        />
        <StatCard
          title="Avg Rate"
          value={`${engagementData.rate.toFixed(1)}%`}
          icon={TrendingUp}
          gradient={COLORS.cardGradients.orange}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Overall Status
            </CardTitle>
            <CardDescription>Across all your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                done: { label: labels.done, color: COLORS.success },
                pending: { label: labels.pending, color: COLORS.warning },
              } satisfies ChartConfig}
              className="h-[250px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
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
              Class Comparison
            </CardTitle>
            <CardDescription>Completion rate by class</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: { label: "Rate", color: COLORS.primary },
              } satisfies ChartConfig}
              className="h-[250px]"
            >
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
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
                <Bar dataKey="rate" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Class Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teacherClasses.map((cls) => {
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
                      <p className="text-sm text-muted-foreground">{cls.totalStudents} students</p>
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
                  <div className="flex justify-end">
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

      {/* Best Performers & Non-Submitters */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Best Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Top Performers
            </CardTitle>
            <CardDescription>Students with highest engagement in your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTopPerformers.slice(0, 5).map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-200/50 dark:border-amber-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                      style={{
                        background: index === 0 ? "linear-gradient(135deg, #fbbf24, #f59e0b)" :
                          index === 1 ? "linear-gradient(135deg, #9ca3af, #6b7280)" :
                          index === 2 ? "linear-gradient(135deg, #d97706, #b45309)" :
                          "linear-gradient(135deg, #8b5cf6, #7c3aed)"
                      }}
                    >
                      #{student.rank}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.className}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-orange-600">{student.streak} days</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Streak</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{student.overallRate}%</p>
                      <p className="text-xs text-muted-foreground">Rate</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Non-Submitters / Needs Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Needs Attention
            </CardTitle>
            <CardDescription>Students with pending submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockNonSubmitters.slice(0, 5).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.className}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-bold text-red-600">{student.daysInactive}</p>
                      <p className="text-xs text-muted-foreground">Days Inactive</p>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2 text-xs">
                        <Badge variant="outline" className="text-red-600 border-red-300">
                          {student.pendingAssessments} Assess
                        </Badge>
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          {student.pendingActivities} Act
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Pending</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Type-specific Analytics */}
      {type === "assessments" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              Assessment Difficulty
            </CardTitle>
            <CardDescription>Pass rates by assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockDifficultyAnalysis.slice(0, 4).map((item) => (
                <div key={item.assessmentId} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <Badge variant={item.difficulty === "Easy" ? "default" : item.difficulty === "Medium" ? "secondary" : "destructive"} className="text-xs mt-1">
                      {item.difficulty}
                    </Badge>
                  </div>
                  <div className="text-center ml-2">
                    <p className={`font-bold text-sm ${item.passRate >= 80 ? "text-green-500" : item.passRate >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                      {item.passRate.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Pass</p>
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
            <CardDescription>Engagement by activity type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {mockActivityCategoryStats.slice(0, 6).map((cat) => (
                <div key={cat.category} className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{cat.category}</h4>
                    <Badge variant="outline" className="text-xs">#{cat.popularityRank}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{cat.avgCompletionRate}%</span>
                    </div>
                    <Progress value={cat.avgCompletionRate} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">{cat.totalActivities} activities • ~{cat.avgTimeSpentMinutes} min</p>
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
              Webinar Engagement
            </CardTitle>
            <CardDescription>Detailed metrics for each webinar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWebinarEngagementMetrics.slice(0, 4).map((webinar) => (
                <div key={webinar.webinarId} className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{webinar.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{webinar.actualAttendees}/{webinar.totalRegistered} attended</span>
                      <span className="text-amber-500 text-xs">★ {webinar.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-2">
                    <div className="text-center">
                      <p className="font-bold text-sm text-primary">{webinar.avgWatchTimePercent}%</p>
                      <p className="text-xs text-muted-foreground">Watch</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm">{webinar.questionsAsked}</p>
                      <p className="text-xs text-muted-foreground">Q&A</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm">{webinar.replayViews}</p>
                      <p className="text-xs text-muted-foreground">Replays</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
          <CardDescription>Students requiring attention in your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockStudentRiskAssessment.slice(0, 3).map((student) => (
              <div
                key={student.studentId}
                className={`p-3 rounded-xl border ${
                  student.riskLevel === "High" ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" :
                  student.riskLevel === "Medium" ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800" :
                  "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      student.riskLevel === "High" ? "bg-red-100 dark:bg-red-900" :
                      student.riskLevel === "Medium" ? "bg-yellow-100 dark:bg-yellow-900" :
                      "bg-green-100 dark:bg-green-900"
                    }`}>
                      <span className={`font-bold ${
                        student.riskLevel === "High" ? "text-red-600" :
                        student.riskLevel === "Medium" ? "text-yellow-600" :
                        "text-green-600"
                      }`}>{student.riskScore}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{student.studentName}</p>
                      <p className="text-xs text-muted-foreground">{student.className}</p>
                    </div>
                  </div>
                  <Badge variant={student.riskLevel === "High" ? "destructive" : student.riskLevel === "Medium" ? "secondary" : "default"} className="text-xs">
                    {student.riskLevel}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {student.factors.slice(0, 2).map((factor, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{factor}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Student Progress
          </CardTitle>
          <CardDescription>Track improvement over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockImprovementTracking.slice(0, 3).map((student) => (
              <div key={student.studentId} className="p-3 rounded-xl bg-muted/30 border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{student.studentName}</p>
                    <p className="text-xs text-muted-foreground">{student.className}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className={`font-bold text-sm ${student.overallImprovement >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {student.overallImprovement >= 0 ? "+" : ""}{student.overallImprovement.toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Change</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm text-primary">{student.consistencyScore}</p>
                      <p className="text-xs text-muted-foreground">Consistency</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {student.monthlyScores.map((score, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <div className="h-10 flex items-end justify-center">
                        <div 
                          className={`w-full max-w-[30px] rounded-t ${student.overallImprovement >= 0 ? "bg-green-500" : "bg-red-500"}`}
                          style={{ height: `${score.score * 0.4}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1">{score.month}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}

// Class Detail View Component
function ClassDetailView({
  type,
  teacherClasses,
  selectedClassId,
  onClassSelect,
  labels,
}: {
  type: EngagementType;
  teacherClasses: ClassEngagementSummary[];
  selectedClassId: string | null;
  onClassSelect: (classId: string) => void;
  labels: { done: string; pending: string };
}) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedWebinarId, setSelectedWebinarId] = useState<string | null>(null);
  
  // Show detailed assessment view if selected
  if (selectedAssessmentId && type === "assessments") {
    const assessmentDetail = mockAssessmentDetailedViews[selectedAssessmentId];
    if (assessmentDetail) {
      return <TeacherAssessmentDetailView assessment={assessmentDetail} onBack={() => setSelectedAssessmentId(null)} />;
    }
  }
  
  // Show detailed activity view if selected
  if (selectedActivityId && type === "activities") {
    const activityDetail = mockActivityDetailedViews[selectedActivityId];
    if (activityDetail) {
      return <TeacherActivityDetailView activity={activityDetail} onBack={() => setSelectedActivityId(null)} />;
    }
  }
  
  // Show detailed webinar view if selected
  if (selectedWebinarId && type === "webinars") {
    const webinarDetail = mockWebinarDetailedViews[selectedWebinarId];
    if (webinarDetail) {
      return <TeacherWebinarDetailView webinar={webinarDetail} onBack={() => setSelectedWebinarId(null)} />;
    }
  }
  
  if (!selectedClassId) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select a Class</CardTitle>
            <CardDescription>Choose a class to view detailed engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teacherClasses.map((cls) => {
                const data = type === "assessments" ? cls.assessments :
                  type === "activities" ? cls.activities : cls.webinars;
                
                return (
                  <Card
                    key={cls.id}
                    className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                    onClick={() => onClassSelect(cls.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {cls.grade}{cls.section}
                        </div>
                        <div>
                          <h3 className="font-semibold">{cls.name}</h3>
                          <p className="text-xs text-muted-foreground">{cls.totalStudents} students</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Progress value={data.rate} className="h-2 flex-1 mr-3" />
                        <span className="font-bold text-primary">{data.rate.toFixed(0)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedClass = teacherClasses.find((c) => c.id === selectedClassId);
  if (!selectedClass) return null;

  const data = type === "assessments" ? selectedClass.assessments :
    type === "activities" ? selectedClass.activities : selectedClass.webinars;
  const completed = data.done;

  const trendData = mockEngagementTrends.weekly;

  return (
    <div className="space-y-6">
      {/* Class Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {selectedClass.grade}{selectedClass.section}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary">{selectedClass.totalStudents} students</Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-primary">{data.rate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-500">{completed}</p>
            <p className="text-sm text-muted-foreground">{labels.done}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-yellow-500">{data.total - completed}</p>
            <p className="text-sm text-muted-foreground">{labels.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-500">{data.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              [type]: { label: type.charAt(0).toUpperCase() + type.slice(1), color: COLORS.primary },
            } satisfies ChartConfig}
            className="h-[250px]"
          >
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey={type}
                stroke={COLORS.primary}
                strokeWidth={3}
                dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Item Details Table */}
      <ItemDetailsTable 
        type={type} 
        labels={labels} 
        onAssessmentSelect={setSelectedAssessmentId}
        onActivitySelect={setSelectedActivityId}
        onWebinarSelect={setSelectedWebinarId}
      />
    </div>
  );
}

// Item Details Table Component
function ItemDetailsTable({ 
  type, 
  labels,
  onAssessmentSelect,
  onActivitySelect,
  onWebinarSelect,
}: { 
  type: EngagementType; 
  labels: { done: string; pending: string };
  onAssessmentSelect?: (id: string) => void;
  onActivitySelect?: (id: string) => void;
  onWebinarSelect?: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  
  const details = type === "assessments" ? mockAssessmentDetails :
    type === "activities" ? mockActivityDetails : mockWebinarDetails;

  // Get unique classes for filter
  const uniqueClasses = [...new Set(mockClassEngagement.map(c => c.name))].sort();
  
  // Filter details based on search
  const filteredDetails = details.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              {type === "assessments" ? "Assessment" : type === "activities" ? "Activity" : "Webinar"} Details
            </CardTitle>
            <CardDescription>
              How many students {type === "assessments" ? "submitted" : type === "activities" ? "completed" : "attended"} each item
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${type}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
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
              <TableHead>{type === "webinars" ? "Date" : "Type"}</TableHead>
              <TableHead className="text-center">Students Assigned</TableHead>
              <TableHead className="text-center">Students {labels.done}</TableHead>
              <TableHead className="text-center">Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDetails.map((item: any) => {
              const studentsCompleted = item.studentsSubmitted || item.studentsCompleted || item.studentsAttended;
              const totalStudents = item.totalStudentsAssigned || item.totalStudentsInvited;
              const rate = item.submissionRate || item.completionRate || item.attendanceRate;
              return (
                <TableRow 
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    if (type === "assessments" && onAssessmentSelect) onAssessmentSelect(item.id);
                    else if (type === "activities" && onActivitySelect) onActivitySelect(item.id);
                    else if (type === "webinars" && onWebinarSelect) onWebinarSelect(item.id);
                  }}
                >
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type || item.category || item.date}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{totalStudents}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-green-600">{studentsCompleted}</span>
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
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No {type} found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Student View Component
function StudentView({
  type,
  searchQuery,
  setSearchQuery,
  filteredStudents,
  selectedClassId,
  onBackToClasses,
  labels,
}: {
  type: EngagementType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredStudents: StudentEngagementSummary[];
  selectedClassId: string | null;
  onBackToClasses: () => void;
  labels: { done: string; pending: string };
}) {
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<string | null>(null);
  const [engagementFilter, setEngagementFilter] = useState<string>("all");
  const [performanceFilter, setPerformanceFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  
  const studentProfile = selectedStudentProfile ? mockStudentDetailedProfiles[selectedStudentProfile] : null;
  
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
  
  // If a student profile is selected, show the detailed view
  if (studentProfile) {
    return (
      <TeacherStudentProfileView 
        profile={studentProfile} 
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
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {selectedClassId && (
          <Button variant="outline" onClick={onBackToClasses} className="gap-2">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back
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

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Student Progress
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
            {questions.map((q, idx) => {
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

                      {/* Options for multiple choice */}
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

                      {/* Student's answer for non-multiple choice */}
                      {!q.options && response && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Student's Answer:</p>
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm whitespace-pre-wrap">{response.studentAnswer}</p>
                          </div>
                        </div>
                      )}

                      {/* Time spent */}
                      {response?.timeSpent && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Time spent: {Math.floor(response.timeSpent / 60)}:{(response.timeSpent % 60).toString().padStart(2, '0')}
                        </div>
                      )}

                      {/* No response */}
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

                      {/* Student's response */}
                      {response?.response && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Student's Response:</p>
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm whitespace-pre-wrap">{response.response}</p>
                          </div>
                        </div>
                      )}

                      {/* Rating and feedback */}
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

                      {/* Student feedback */}
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

// Teacher Student Profile View Component (Simplified version)
function TeacherStudentProfileView({ 
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
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shadow-lg">
              {profile.name.split(" ").map(n => n[0]).join("")}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-white/80">
                <span>{profile.className}</span>
                <span>•</span>
                <span>Roll: {profile.rollNumber}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.badges.slice(0, 3).map(badge => (
                  <span key={badge.id} className="px-2 py-1 bg-white/20 rounded-full text-sm" title={badge.description}>
                    {badge.icon} {badge.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Score Circle */}
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full border-4 ${profile.overallEngagementScore >= 80 ? "border-green-400" : profile.overallEngagementScore >= 60 ? "border-yellow-400" : "border-red-400"} flex items-center justify-center bg-white/10`}>
                <span className="text-xl font-bold">{profile.overallEngagementScore}</span>
              </div>
              <p className="text-xs mt-1 text-white/80">Score</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <div className="text-center p-2 rounded-lg bg-violet-50 dark:bg-violet-950/30">
              <p className="text-xl font-bold text-violet-600">{profile.assessments.rate}%</p>
              <p className="text-xs text-muted-foreground">Assessments</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <p className="text-xl font-bold text-blue-600">{profile.activities.rate}%</p>
              <p className="text-xs text-muted-foreground">Activities</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <p className="text-xl font-bold text-emerald-600">{profile.webinars.rate}%</p>
              <p className="text-xs text-muted-foreground">Webinars</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <p className="text-xl font-bold text-orange-600">{profile.streak}</p>
              </div>
              <p className="text-xs text-muted-foreground">Streak</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
              <p className="text-xl font-bold text-cyan-600">{Math.round(profile.totalTimeSpent / 60)}h</p>
              <p className="text-xs text-muted-foreground">Time</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-pink-50 dark:bg-pink-950/30">
              <p className="text-xl font-bold text-pink-600">{profile.assessments.avgScore?.toFixed(0) || "N/A"}</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4 h-10">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="assessments" className="text-sm">Assessments</TabsTrigger>
          <TabsTrigger value="activities" className="text-sm">Activities</TabsTrigger>
          <TabsTrigger value="webinars" className="text-sm">Webinars</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Parent</p>
                    <p className="font-medium">{profile.parentName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Parent Contact</p>
                    <p className="font-medium">{profile.parentContact}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Last Active</p>
                    <p className="font-medium">{new Date(profile.lastActive).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Trend */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    assessmentScore: { label: "Assessment", color: COLORS.primary },
                    activityRate: { label: "Activity", color: COLORS.success },
                  } satisfies ChartConfig}
                  className="h-[150px]"
                >
                  <LineChart data={profile.monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={10} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="assessmentScore" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="activityRate" stroke={COLORS.success} strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.strengths.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.area}</span>
                      <span className="text-green-600 font-bold text-sm">{item.score}</span>
                    </div>
                    <Progress value={item.score} className="h-1.5 mt-1" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  Needs Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.weaknesses.length > 0 ? profile.weaknesses.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.area}</span>
                      <span className="text-red-600 font-bold text-sm">{item.score}</span>
                    </div>
                    <Progress value={item.score} className="h-1.5 mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">{item.recommendation}</p>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-center py-2 text-sm">No issues identified</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Assessment History</CardTitle>
              <CardDescription className="text-xs">
                {profile.assessments.done}/{profile.assessments.total} completed • Avg: {profile.assessments.avgScore?.toFixed(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.recentAssessments.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      {item.score !== undefined ? (
                        <p className={`font-bold ${getScoreColor(item.score)}`}>{item.score}/{item.maxScore}</p>
                      ) : (
                        <p className="text-muted-foreground">-</p>
                      )}
                      <p className="text-xs text-muted-foreground">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Activity History</CardTitle>
              <CardDescription className="text-xs">
                {profile.activities.done}/{profile.activities.total} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.recentActivities.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="flex items-center gap-2">
                        <Progress value={item.progress} className="h-2 w-16" />
                        <span className="text-sm font-medium">{item.progress}%</span>
                      </div>
                      {item.timeSpent && <p className="text-xs text-muted-foreground">{item.timeSpent} min</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webinars Tab */}
        <TabsContent value="webinars" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Webinar Attendance</CardTitle>
              <CardDescription className="text-xs">
                {profile.webinars.done}/{profile.webinars.total} attended
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.recentWebinars.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      {item.watchTime ? (
                        <p className="font-medium text-sm">{item.watchTime}/{item.totalDuration} min</p>
                      ) : (
                        <p className="text-muted-foreground">-</p>
                      )}
                      {item.rating && <span className="text-amber-500 text-sm">{"★".repeat(item.rating)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


// Teacher Assessment Detail View Component
function TeacherAssessmentDetailView({
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
        <TeacherStudentProfileView 
          profile={studentProfile} 
          onBack={() => setSelectedStudentId(null)} 
        />
      );
    }
  }

  const filteredSubmissions = assessment.submissions.filter((s) => {
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted": return <Badge className="bg-green-500">✓ Submitted</Badge>;
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      case "overdue": return <Badge variant="destructive">Overdue</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
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
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back
      </Button>

      {/* Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-5 text-white">
          <Badge className="bg-white/20 mb-2">{assessment.type}</Badge>
          <h1 className="text-xl font-bold">{assessment.title}</h1>
          <p className="text-white/80 text-sm mt-1">{assessment.description}</p>
          <div className="flex gap-4 mt-3 text-sm text-white/80">
            <span>Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>{assessment.totalQuestions} Questions</span>
          </div>
        </div>
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <p className="text-xl font-bold text-blue-600">{assessment.totalStudentsAssigned}</p>
              <p className="text-xs text-muted-foreground">Assigned</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
              <p className="text-xl font-bold text-green-600">{assessment.studentsSubmitted}</p>
              <p className="text-xs text-muted-foreground">Submitted</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
              <p className="text-xl font-bold text-yellow-600">{assessment.studentsPending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
              <p className="text-xl font-bold text-red-600">{assessment.studentsOverdue}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <p className="text-xl font-bold text-purple-600">{assessment.avgScore.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <p className="text-xl font-bold text-emerald-600">{assessment.passRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Pass Rate</p>
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
          {/* Score Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ count: { label: "Students", color: COLORS.primary } } satisfies ChartConfig} className="h-[180px]">
                <BarChart data={assessment.scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" tickLine={false} axisLine={false} fontSize={10} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Student Submissions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Student Submissions</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-[150px] h-8 text-sm" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[120px] h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredSubmissions.map((s) => (
                  <div 
                    key={s.studentId} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {s.studentName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{s.studentName}</p>
                        <p className="text-xs text-muted-foreground">{s.className} • {s.rollNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(s.status)}
                      {s.score !== undefined ? (
                        <span className={`font-bold ${s.score >= 80 ? "text-green-500" : s.score >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                          {s.score}/{s.maxScore}
                        </span>
                      ) : <span className="text-muted-foreground">-</span>}
                      {s.status === "submitted" && questionsData && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1 h-7 text-xs"
                          onClick={() => setViewStudentResponses(s.studentId)}
                        >
                          <FileText className="w-3 h-3" />
                          View Answers
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 h-7 text-xs"
                        onClick={() => setSelectedStudentId(s.studentId)}
                      >
                        <User className="w-3 h-3" />
                        Profile
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredSubmissions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <AlertCircle className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No students found matching your criteria</p>
                  </div>
                )}
              </div>
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

// Teacher Activity Detail View Component
function TeacherActivityDetailView({
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
        <TeacherStudentProfileView 
          profile={studentProfile} 
          onBack={() => setSelectedStudentId(null)} 
        />
      );
    }
  }

  const filteredCompletions = activity.completions.filter((c) => {
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesSearch = c.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-500">✓ Completed</Badge>;
      case "in_progress": return <Badge variant="secondary">In Progress</Badge>;
      case "not_started": return <Badge variant="outline">Not Started</Badge>;
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
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back
      </Button>

      {/* Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-5 text-white">
          <Badge className="bg-white/20 mb-2">{activity.category}</Badge>
          <h1 className="text-xl font-bold">{activity.title}</h1>
          <p className="text-white/80 text-sm mt-1">{activity.description}</p>
          <div className="flex gap-4 mt-3 text-sm text-white/80">
            <span>Due: {activity.dueDate}</span>
            <span>•</span>
            <span>Est. {activity.estimatedTime} min</span>
          </div>
        </div>
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <p className="text-xl font-bold text-blue-600">{activity.totalStudentsAssigned}</p>
              <p className="text-xs text-muted-foreground">Assigned</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
              <p className="text-xl font-bold text-green-600">{activity.studentsCompleted}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
              <p className="text-xl font-bold text-yellow-600">{activity.studentsInProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-950/30">
              <p className="text-xl font-bold text-gray-600">{activity.studentsNotStarted}</p>
              <p className="text-xs text-muted-foreground">Not Started</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <div className="flex items-center justify-center gap-1">
                <span className="text-amber-500">★</span>
                <p className="text-xl font-bold text-amber-600">{activity.avgRating.toFixed(1)}</p>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
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
          {/* Progress Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Progress Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ count: { label: "Students", color: COLORS.secondary } } satisfies ChartConfig} className="h-[180px]">
                <BarChart data={activity.progressDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" tickLine={false} axisLine={false} fontSize={10} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Student Progress */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Student Progress</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-[150px] h-8 text-sm" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[120px] h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="not_started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredCompletions.map((c) => (
                  <div 
                    key={c.studentId} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {c.studentName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{c.studentName}</p>
                        <p className="text-xs text-muted-foreground">{c.className} • {c.rollNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(c.status)}
                      <div className="flex items-center gap-2 w-24">
                        <Progress value={c.progress} className="h-2 flex-1" />
                        <span className="text-xs font-medium w-8">{c.progress}%</span>
                      </div>
                      {c.rating && <span className="text-amber-500 text-sm">{"★".repeat(c.rating)}</span>}
                      {c.status !== "not_started" && tasksData && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1 h-7 text-xs"
                          onClick={() => setViewStudentResponses(c.studentId)}
                        >
                          <Activity className="w-3 h-3" />
                          View Tasks
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 h-7 text-xs"
                        onClick={() => setSelectedStudentId(c.studentId)}
                      >
                        <User className="w-3 h-3" />
                        Profile
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredCompletions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <AlertCircle className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No students found matching your criteria</p>
                  </div>
                )}
              </div>
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

// Teacher Webinar Detail View Component
function TeacherWebinarDetailView({
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
        <TeacherStudentProfileView 
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
        Back
      </Button>

      {/* Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white">
          <Badge className="bg-white/20 mb-2">{webinar.topic}</Badge>
          <h1 className="text-xl font-bold">{webinar.title}</h1>
          <p className="text-white/80 text-sm mt-1">{webinar.description}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/80">
            <span>📅 {new Date(webinar.scheduledDate).toLocaleDateString()}</span>
            <span>🕐 {webinar.startTime} - {webinar.endTime}</span>
            <span>⏱️ {webinar.duration} mins</span>
            <span>👤 {webinar.presenter} ({webinar.presenterRole})</span>
          </div>
        </div>
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <p className="text-xl font-bold text-blue-600">{webinar.totalStudentsInvited}</p>
              <p className="text-xs text-muted-foreground">Invited</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
              <p className="text-xl font-bold text-green-600">{webinar.studentsAttended}</p>
              <p className="text-xs text-muted-foreground">Attended</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
              <p className="text-xl font-bold text-yellow-600">{webinar.studentsPartial}</p>
              <p className="text-xs text-muted-foreground">Partial</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
              <p className="text-xl font-bold text-red-600">{webinar.studentsMissed}</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <p className="text-xl font-bold text-purple-600">{webinar.avgWatchPercentage.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Avg Watch</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <div className="flex items-center justify-center gap-1">
                <span className="text-amber-500">★</span>
                <p className="text-xl font-bold text-amber-600">{webinar.avgRating.toFixed(1)}</p>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class-wise Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Class-wise Attendance</CardTitle>
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

      {/* Student Attendance */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Student Attendance</CardTitle>
            <div className="flex gap-2">
              <Input 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-[150px] h-8 text-sm" 
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px] h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredAttendance.map((a) => (
              <div 
                key={a.studentId} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                onClick={() => setSelectedStudentId(a.studentId)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                    {a.studentName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{a.studentName}</p>
                    <p className="text-xs text-muted-foreground">{a.className} • {a.rollNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(a.status)}
                  {a.watchTime !== undefined ? (
                    <div className="text-right">
                      <p className="font-medium text-sm">{a.watchTime}/{webinar.duration} min</p>
                      <p className="text-xs text-muted-foreground">{a.watchPercentage?.toFixed(0)}% watched</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <span title="Questions" className="text-violet-500">💬 {a.questionsAsked}</span>
                    <span title="Polls" className="text-blue-500">📊 {a.pollsAnswered}</span>
                  </div>
                  {a.rating && <span className="text-amber-500 text-sm">{"★".repeat(a.rating)}</span>}
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
            {filteredAttendance.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No students found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
