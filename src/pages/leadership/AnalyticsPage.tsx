import { useState, useMemo } from "react";
import {
  School,
  Users,
  User,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  CheckCircle,
  Clock,
  Flame,
  Video,
  ClipboardList,
  Loader2,
  AlertTriangle,
  Search,
  X,
  Eye,
  Heart,
  Zap,
  Award,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useCounsellorOverview,
  useCounsellorClasses,
  useCounsellorClass,
  useCounsellorStudents,
  useCounsellorStudent,
  useStudentAssessments,
  useStudentActivities,
  useStudentWebinars,
  useStudentStreak,
} from "@/hooks/useCounsellorAnalytics";
import type {
  SchoolOverview,
  ClassAnalytics,
  ClassDetailedAnalytics,
  StudentListItem,
  StudentDetailed,
} from "@/services/counsellorAnalytics";
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
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AnalyticsLeaderboard, type LeaderboardEntry } from "@/components/shared/AnalyticsLeaderboard";

// Color palette
// Theme-aware Color Palette & Chart Colors
const COLORS = {
  primary: "#8b5cf6", // Violet
  secondary: "#06b6d4", // Cyan
  success: "#10b981", // Emerald
  warning: "#f59e0b", // Amber
  danger: "#ef4444", // Red
  info: "#3b82f6", // Blue
  // Gradient arrays for charts
  gradients: [
    ["#8b5cf6", "#c4b5fd"], 
    ["#06b6d4", "#67e8f9"],
    ["#10b981", "#6ee7b7"],
    ["#f59e0b", "#fcd34d"],
    ["#ec4899", "#f9a8d4"],
    ["#3b82f6", "#93c5fd"]
  ],
  // Semantic gradients for cards
  cardGradients: {
    violet: "from-violet-500/10 via-purple-500/10 to-indigo-500/10 hover:from-violet-500/20 hover:via-purple-500/20 hover:to-indigo-500/20",
    blue: "from-blue-500/10 via-cyan-500/10 to-sky-500/10 hover:from-blue-500/20 hover:via-cyan-500/20 hover:to-sky-500/20",
    green: "from-emerald-500/10 via-green-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:via-green-500/20 hover:to-teal-500/20",
    orange: "from-orange-500/10 via-amber-500/10 to-yellow-500/10 hover:from-orange-500/20 hover:via-amber-500/20 hover:to-yellow-500/20",
    red: "from-red-500/10 via-rose-500/10 to-pink-500/10 hover:from-red-500/20 hover:via-rose-500/20 hover:to-pink-500/20",
  },
  // Legacy gradient array for backward compatibility
  gradient: ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"],
};

export default function LeadershipAnalyticsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overall");
  const [timeFilter, setTimeFilter] = useState("30");
  const [classSearchInput, setClassSearchInput] = useState("");
  const [classSearchQuery, setClassSearchQuery] = useState("");
  const [studentSearchInput, setStudentSearchInput] = useState("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState("all");
  const [studentPage, setStudentPage] = useState(1);

  const days = parseInt(timeFilter);

  // API Hooks
  const { data: overviewData, isLoading: overviewLoading } = useCounsellorOverview(
    user?.school_id,
    days
  );

  const { data: classesData, isLoading: classesLoading } = useCounsellorClasses(
    user?.school_id,
    { days, search: classSearchQuery || undefined }
  );

  const { data: classDetailData, isLoading: classDetailLoading } = useCounsellorClass(
    selectedClassId || undefined,
    days
  );

  const { data: studentsData, isLoading: studentsLoading } = useCounsellorStudents(
    user?.school_id,
    { 
      days, 
      limit: 20, 
      page: studentPage,
      search: studentSearchQuery || undefined,
      risk_level: riskFilter !== "all" ? (riskFilter as "low" | "medium" | "high") : undefined
    }
  );

  // Search handlers
  const handleClassSearch = () => {
    setClassSearchQuery(classSearchInput);
  };

  const handleStudentSearch = () => {
    setStudentPage(1); // Reset to first page on new search
    setStudentSearchQuery(studentSearchInput);
  };

  const clearClassSearch = () => {
    setClassSearchInput("");
    setClassSearchQuery("");
  };

  const clearStudentSearch = () => {
    setStudentSearchInput("");
    setStudentSearchQuery("");
    setStudentPage(1);
  };

  // Handle risk filter change
  const handleRiskFilterChange = (value: string) => {
    setRiskFilter(value);
    setStudentPage(1); // Reset to first page on filter change
  };

  const totalStudentPages = studentsData?.total_pages || 1;

  const { data: studentDetailData, isLoading: studentDetailLoading } = useCounsellorStudent(
    selectedStudentId || undefined,
    days
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-10">
      <AnimatedBackground />

      {/* Header */}
      <div className="relative z-10 bg-card/40 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">School Analytics</h1>
              <p className="text-muted-foreground">School-wide insights across all classes and students</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-muted/50 backdrop-blur-sm rounded-2xl mb-8">
          <TabsTrigger value="overall" className="rounded-xl gap-2 text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            <School className="w-5 h-5" />
            Overall
          </TabsTrigger>
          <TabsTrigger value="class" className="rounded-xl gap-2 text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            <Users className="w-5 h-5" />
            Class-wise
          </TabsTrigger>
          {/* <TabsTrigger value="student" className="rounded-xl gap-2 text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
            <User className="w-5 h-5" />
            Student-wise
          </TabsTrigger> */}
        </TabsList>

        {/* Overall Tab */}
        <TabsContent value="overall" className="space-y-6">
          {overviewLoading ? (
            <LoadingState message="Loading overview..." />
          ) : overviewData ? (
            <OverallView 
              data={overviewData} 
              students={studentsData?.students || []}
              onSelectStudent={(id) => {
                setSelectedStudentId(id);
                setActiveTab("student");
              }} 
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">No data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Class Tab */}
        <TabsContent value="class" className="space-y-6">
          {!selectedClassId && (
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes by name or teacher..."
                  value={classSearchInput}
                  onChange={(e) => setClassSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleClassSearch()}
                  className="pl-10 pr-8"
                />
                {classSearchInput && (
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={clearClassSearch}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Button onClick={handleClassSearch} className="gap-2">
                <Search className="w-4 h-4" />
                Search
              </Button>
              <Badge variant="secondary" className="px-3 py-1">
                {classesData?.total_classes || 0} classes
              </Badge>
            </div>
          )}
          {classesLoading ? (
            <LoadingState message="Loading classes..." />
          ) : (
            <ClassWiseView
              classes={classesData?.classes || []}
              selectedClassId={selectedClassId}
              onSelectClass={setSelectedClassId}
              onSelectStudent={(id) => {
                if (id) {
                  setSelectedStudentId(id);
                  setActiveTab("student");
                }
              }}
              classDetail={classDetailData}
              classDetailLoading={classDetailLoading}
            />
          )}
        </TabsContent>

        {/* Student Tab */}
        <TabsContent value="student" className="space-y-6">
          {!selectedStudentId && (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name or class..."
                  value={studentSearchInput}
                  onChange={(e) => setStudentSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStudentSearch()}
                  className="pl-10 pr-8"
                />
                {studentSearchInput && (
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={clearStudentSearch}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Button onClick={handleStudentSearch} className="gap-2">
                <Search className="w-4 h-4" />
                Search
              </Button>
              <Select value={riskFilter} onValueChange={handleRiskFilterChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="px-3 py-1">
                {studentsData?.total_students || 0} students
              </Badge>
            </div>
          )}
          {studentsLoading ? (
            <LoadingState message="Loading students..." />
          ) : (
            <>
              <StudentWiseView
                students={studentsData?.students || []}
                selectedStudentId={selectedStudentId}
                onSelectStudent={setSelectedStudentId}
                studentDetail={studentDetailData}
                studentDetailLoading={studentDetailLoading}
              />
              {/* Pagination */}
              {!selectedStudentId && totalStudentPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                    disabled={studentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    Page {studentPage} of {totalStudentPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStudentPage((p) => Math.min(totalStudentPages, p + 1))}
                    disabled={studentPage === totalStudentPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}


// Overall View Component
function OverallView({ 
  data, 
  students = [], 
  onSelectStudent 
}: { 
  data: SchoolOverview; 
  students?: StudentListItem[];
  onSelectStudent?: (id: string) => void;
}) {
  const { summary, risk_distribution, engagement, top_performers, at_risk_students } = data;

  const riskDistributionData = [
    { name: "Low Risk", value: risk_distribution.low, color: COLORS.success },
    { name: "Medium Risk", value: risk_distribution.medium, color: COLORS.warning },
    { name: "High Risk", value: risk_distribution.high, color: COLORS.danger },
  ].filter((item) => item.value > 0);

  const engagementData = [
    { name: "App Opens", value: engagement.total_app_openings, fill: "#8b5cf6" },
    { name: "Assessments", value: engagement.total_assessments_completed, fill: "#06b6d4" },
    { name: "Activities", value: engagement.total_activities_completed, fill: "#10b981" },
  ].filter((item) => item.value > 0);

  const StatCard = ({ title, value, subtext, icon: Icon, gradient }: any) => (
    <Card className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${gradient} group hover:scale-[1.02] transition-transform duration-300`}>
      <CardContent className="pt-6 relative z-10">
        <div className="absolute right-4 top-4 p-2 bg-white/10 rounded-xl backdrop-blur-sm">
          <Icon className="w-6 h-6 text-foreground/80 dark:text-white/90" />
        </div>
        <p className="text-3xl font-bold text-foreground dark:text-white mb-1 tracking-tight">{value}</p>
        <p className="text-sm font-medium text-muted-foreground dark:text-white/70">{title}</p>
        {subtext && <p className="text-xs text-muted-foreground/80 dark:text-white/50 mt-2">{subtext}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Students"
          value={summary.total_students}
          icon={Users}
          gradient={COLORS.cardGradients.violet}
        />
        <StatCard
          title="Avg Wellbeing"
          value={` ${(summary.avg_wellbeing_score ?? 0).toFixed(0)}%`}
          icon={Heart}
          gradient={COLORS.cardGradients.blue}
        />
        <StatCard
          title="Activity Rate"
          value={`${(summary.avg_activity_completion ?? 0).toFixed(0)}%`}
          icon={ClipboardList}
          gradient={COLORS.cardGradients.green}
        />
        <StatCard
          title="Avg Streak"
          value={(summary.avg_daily_streak ?? 0).toFixed(1)}
          subtext="Consecutive Days"
          icon={Activity}
          gradient={COLORS.cardGradients.orange}
        />
        <StatCard
          title="App Openings"
          value={summary.total_app_openings ?? 0}
          icon={Flame}
          gradient={COLORS.cardGradients.red}
        />
        <StatCard
          title="At-Risk"
          value={risk_distribution.high}
          subtext="Students Critical"
          icon={AlertTriangle}
          gradient="from-red-500/20 via-red-500/20 to-rose-500/20"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Risk Distribution
            </CardTitle>
            <CardDescription>Students categorized by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                low: { label: "Low Risk", color: COLORS.success },
                medium: { label: "Medium Risk", color: COLORS.warning },
                high: { label: "High Risk", color: COLORS.danger },
              } satisfies ChartConfig}
              className="h-[300px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistributionData.map((entry, index) => (
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
              <Zap className="w-5 h-5 text-primary" />
              Engagement Overview
            </CardTitle>
            <CardDescription>Total engagement across all activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {engagementData.map((item, index) => (
                <div key={index} className="p-4 rounded-xl border-2 text-center">
                  <p className="text-3xl font-bold" style={{ color: item.fill }}>{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Leaderboard */}
      <div className="grid gap-6">
        <AnalyticsLeaderboard
          title="Student Leaderboard"
          description="Comprehensive ranking based on wellbeing and activity scores"
          students={students.map((s) => ({
            id: s.student_id,
            name: s.name,
            className: s.class_name || "Unknown",
            score: s.wellbeing_score || 0,
            scoreLabel: "Wellbeing Score",
            streak: s.daily_streak,
            riskLevel: s.risk_level,
            avatar: undefined,
          }))}
        />
      </div>
    </div>
  );
}


// Class-wise View Component
function ClassWiseView({
  classes,
  selectedClassId,
  onSelectClass,
  onSelectStudent,
  classDetail,
  classDetailLoading,
}: {
  classes: ClassAnalytics[];
  selectedClassId: string | null;
  onSelectClass: (id: string | null) => void;
  onSelectStudent: (id: string | null) => void;
  classDetail?: ClassDetailedAnalytics;
  classDetailLoading: boolean;
}) {
  const [studentSearch, setStudentSearch] = useState("");

  if (selectedClassId) {
    if (classDetailLoading) {
      return <LoadingState message="Loading class details..." />;
    }

    if (!classDetail) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Class not found</p>
          </CardContent>
        </Card>
      );
    }

    const riskData = [
      { name: "Low", value: classDetail.risk_distribution.low, color: COLORS.success },
      { name: "Medium", value: classDetail.risk_distribution.medium, color: COLORS.warning },
      { name: "High", value: classDetail.risk_distribution.high, color: COLORS.danger },
    ].filter((item) => item.value > 0);

    const filteredStudents = classDetail.students?.filter(student => 
      student.name.toLowerCase().includes(studentSearch.toLowerCase())
    ) || [];

    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => onSelectClass(null)} className="gap-2">
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to All Classes
        </Button>

        {/* Class Header */}
        <Card className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 border-2 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-background">
                  {classDetail.grade}{classDetail.section}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{classDetail.name}</h2>
                  <p className="text-muted-foreground">Teacher: {classDetail.teacher?.name || classDetail.teacher_name || "N/A"}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm shadow-sm">{classDetail.total_students} students</Badge>
                    <Badge variant="destructive" className="shadow-sm">{classDetail.at_risk_count} at risk</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm text-muted-foreground">Avg Wellbeing</p>
                <div className="flex items-baseline justify-end gap-1">
                  <p className="text-4xl font-bold text-primary">{classDetail.metrics.avg_wellbeing}</p>
                  <span className="text-lg text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Section: Class vs School Avg (Simulated for visualization) */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Performance Comparison
              </CardTitle>
              <CardDescription>Class Average vs School Benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  class: { label: classDetail.name, color: COLORS.primary },
                  school: { label: "School Average", color: COLORS.secondary },
                } satisfies ChartConfig}
                className="h-[250px]"
              >
                <BarChart data={[
                  { name: "Wellbeing", class: classDetail.metrics.avg_wellbeing, school: 78 },
                  { name: "Assessment", class: classDetail.metrics.assessment_completion, school: 65 },
                  { name: "Activity", class: classDetail.metrics.activity_completion, school: 72 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="class" fill="var(--color-class)" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="school" fill="var(--color-school)" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
             <Card className="h-full">
                <CardHeader>
                  <CardTitle>Key Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Wellbeing Score</span>
                      <span className="font-bold text-primary">{classDetail.metrics.avg_wellbeing}%</span>
                    </div>
                    <Progress value={classDetail.metrics.avg_wellbeing} className="h-2" />
                  </div>
                   <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Assessment Rate</span>
                      <span className="font-bold text-cyan-600">{classDetail.metrics.assessment_completion}%</span>
                    </div>
                    <Progress value={classDetail.metrics.assessment_completion} className="h-2 bg-cyan-100" />
                  </div>
                   <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Activity Rate</span>
                      <span className="font-bold text-emerald-600">{classDetail.metrics.activity_completion}%</span>
                    </div>
                    <Progress value={classDetail.metrics.activity_completion} className="h-2 bg-emerald-100" />
                  </div>
                </CardContent>
             </Card>
          </div>
        </div>

        {/* Risk Distribution & Student List */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  low: { label: "Low", color: COLORS.success },
                  medium: { label: "Medium", color: COLORS.warning },
                  high: { label: "High", color: COLORS.danger },
                } satisfies ChartConfig}
                className="h-[200px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie data={riskData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name">
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex justify-center gap-4 mt-2">
                {riskData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                   <CardTitle>Students in {classDetail.name}</CardTitle>
                   <CardDescription>{classDetail.students?.length || 0} students</CardDescription>
                </div>
                <div className="relative w-48">
                   <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                      placeholder="Search student..." 
                      className="pl-8 h-9"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                   />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                  <div 
                    key={student.student_id} 
                    className="flex items-center justify-between p-3 rounded-xl border hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-all"
                    onClick={() => onSelectStudent(student.student_id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: COLORS.gradient[index % COLORS.gradient.length] }}
                      >
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {student.daily_streak} day streak
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="font-bold text-primary">{student.wellbeing_score ?? 0}%</p>
                        <p className="text-xs text-muted-foreground">Wellbeing</p>
                      </div>
                      <Badge
                        className={
                          student.risk_level === "low"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : student.risk_level === "medium"
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }
                      >
                        {student.risk_level}
                      </Badge>
                    </div>
                  </div>
                ))
               ) : (
                <p className="text-center text-muted-foreground py-4">No students found matching "{studentSearch}"</p>
               )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Class list view (unchanged)
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classes.length > 0 ? (
        classes.map((classData, index) => (
          <Card
            key={classData.class_id}
            className="cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
            onClick={() => onSelectClass(classData.class_id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: COLORS.gradient[index % COLORS.gradient.length] }}
                  >
                    {classData.grade}{classData.section}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{classData.name}</p>
                    <p className="text-sm text-muted-foreground">{classData.teacher_name || "No teacher"}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2 rounded-lg bg-muted/50 text-center">
                  <p className="text-xl font-bold text-primary">{classData.metrics.avg_wellbeing}%</p>
                  <p className="text-xs text-muted-foreground">Wellbeing</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50 text-center">
                  <p className="text-xl font-bold text-cyan-600">{classData.metrics.assessment_completion}%</p>
                  <p className="text-xs text-muted-foreground">Assessments</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="secondary">{classData.total_students} students</Badge>
                <Badge variant={classData.at_risk_count > 3 ? "destructive" : "outline"}>
                  {classData.at_risk_count} at risk
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No classes found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


// Student-wise View Component
function StudentWiseView({
  students,
  selectedStudentId,
  onSelectStudent,
  studentDetail,
  studentDetailLoading,
}: {
  students: StudentListItem[];
  selectedStudentId: string | null;
  onSelectStudent: (id: string | null) => void;
  studentDetail?: StudentDetailed;
  studentDetailLoading: boolean;
}) {
  if (selectedStudentId) {
    return (
      <StudentDetailView
        studentId={selectedStudentId}
        studentDetail={studentDetail}
        loading={studentDetailLoading}
        onBack={() => onSelectStudent(null)}
      />
    );
  }

  // Student list view
  return (
    <div className="space-y-4">
      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No students found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student, index) => (
            <Card
              key={student.student_id}
              className="cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
              onClick={() => onSelectStudent(student.student_id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: COLORS.gradient[index % COLORS.gradient.length] }}
                    >
                      {student.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.class_name || "No class"}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      student.risk_level === "low"
                        ? "bg-green-100 text-green-700"
                        : student.risk_level === "medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {student.risk_level}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-bold text-primary">{student.wellbeing_score ?? 0}%</p>
                    <p className="text-xs text-muted-foreground">Wellbeing</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-bold text-orange-600">{student.daily_streak}</p>
                    <p className="text-xs text-muted-foreground">Streak</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-bold text-cyan-600">{student.assessments_completed}</p>
                    <p className="text-xs text-muted-foreground">Assessments</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Last active: {student.last_active ? new Date(student.last_active).toLocaleDateString() : "Never"}</span>
                  <ChevronRight className="w-4 h-4 group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Student Detail View Component
function StudentDetailView({
  studentId,
  studentDetail,
  loading,
  onBack,
}: {
  studentId: string;
  studentDetail?: StudentDetailed;
  loading: boolean;
  onBack: () => void;
}) {
  // Fetch additional data
  const { data: assessmentsData } = useStudentAssessments(studentId, true);
  const { data: activitiesData } = useStudentActivities(studentId);
  const { data: webinarsData } = useStudentWebinars(studentId);
  const { data: streakData } = useStudentStreak(studentId);
  
  // Modal state for activity details
  const [selectedActivity, setSelectedActivity] = useState<typeof activitiesData extends { activities: (infer T)[] } ? T : never | null>(null);
  // Modal state for attachment preview
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);

  if (loading) {
    return <LoadingState message="Loading student details..." />;
  }

  if (!studentDetail) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Student not found</p>
        </CardContent>
      </Card>
    );
  }

  const { current_metrics, engagement, streak_history, wellbeing_trend } = studentDetail;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-700 border-green-200";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
      case "high": return "bg-red-100 text-red-700 border-red-200";
      default: return "";
    }
  };

  const completionData = [
    { name: "Assessments", completed: engagement.assessments_completed, total: engagement.assessments_total, color: "#06b6d4" },
    { name: "Activities", completed: engagement.activities_completed, total: engagement.activities_total, color: "#10b981" },
    { name: "Webinars", completed: engagement.webinars_attended || 0, total: engagement.webinars_total || 0, color: "#f59e0b" },
  ].filter((item) => item.total > 0);

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to All Students
      </Button>

      {/* Student Header */}
      <Card className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {studentDetail.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{studentDetail.name}</h2>
                <p className="text-muted-foreground">{studentDetail.class?.name || "No class"}</p>
                {studentDetail.email && <p className="text-sm text-muted-foreground">{studentDetail.email}</p>}
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={getRiskColor(current_metrics.risk_level)}>
                    {current_metrics.risk_level.toUpperCase()} RISK
                  </Badge>
                  <div className="flex items-center gap-1 text-orange-600">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold">{current_metrics.daily_streak} day streak</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-background/50">
                <p className="text-3xl font-bold text-primary">{current_metrics.wellbeing_score ?? 0}%</p>
                <p className="text-xs text-muted-foreground">Wellbeing</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-background/50">
                <p className="text-3xl font-bold text-orange-600">{current_metrics.daily_streak}</p>
                <p className="text-xs text-muted-foreground">Current Streak</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-background/50">
                <p className="text-3xl font-bold text-blue-600">{engagement.total_app_openings}</p>
                <p className="text-xs text-muted-foreground">App Opens</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-background/50">
                <p className="text-3xl font-bold text-emerald-600">{engagement.avg_session_time || 0}m</p>
                <p className="text-xs text-muted-foreground">Avg Session</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Streak Heatmap */}
      {streakData && (
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Activity Heatmap
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted" />
                  <div className="w-3 h-3 rounded-sm bg-green-200" />
                  <div className="w-3 h-3 rounded-sm bg-green-400" />
                  <div className="w-3 h-3 rounded-sm bg-green-600" />
                </div>
                <span className="text-xs text-muted-foreground">More</span>
              </div>
            </div>
            <CardDescription>Visualizing student consistency over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 p-4 bg-muted/20 rounded-xl justify-center">
              {streakData.daily_history.slice(0, 30).map((day, index) => {
                 const intensity = day.activity_completed ? 'bg-green-500 hover:bg-green-600' : 
                                   day.app_opened ? 'bg-green-200 hover:bg-green-300' : 'bg-muted hover:bg-muted-foreground/20';
                 
                 return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className={`w-8 h-8 rounded-md transition-colors cursor-pointer ${intensity}`} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-bold">{day.date}</p>
                      <p>{day.activity_completed ? "Completed Activity" : day.app_opened ? "Visited App" : "Inactive"}</p>
                    </TooltipContent>
                  </Tooltip>
                 );
              })}
            </div>
             <div className="flex justify-between items-center mt-4 px-2">
                <div className="flex gap-4">
                   <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{streakData.current_streak}</p>
                      <p className="text-xs text-muted-foreground">Current Streak</p>
                   </div>
                   <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{streakData.max_streak}</p>
                      <p className="text-xs text-muted-foreground">Max Streak</p>
                   </div>
                   <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{streakData.total_active_days}</p>
                      <p className="text-xs text-muted-foreground">Total Active Days</p>
                   </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                   Showing last 30 days
                </div>
             </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {wellbeing_trend && wellbeing_trend.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Wellbeing Trend
              </CardTitle>
              <CardDescription>Score progression over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: { label: "Wellbeing Score", color: "#8b5cf6" },
                } satisfies ChartConfig}
                className="h-[200px]"
              >
                <LineChart data={wellbeing_trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={3} dot={{ fill: "var(--color-score)", strokeWidth: 2, r: 5 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Completion Progress
            </CardTitle>
            <CardDescription>Progress across all activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completionData.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">{item.completed}/{item.total}</span>
                  </div>
                  <Progress value={item.total > 0 ? (item.completed / item.total) * 100 : 0} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>History & Responses</CardTitle>
          <CardDescription>Detailed history with student responses</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assessments" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="assessments" className="gap-2">
                <ClipboardList className="w-4 h-4" />
                Assessments
              </TabsTrigger>
              <TabsTrigger value="activities" className="gap-2">
                <Activity className="w-4 h-4" />
                Activities
              </TabsTrigger>
              <TabsTrigger value="webinars" className="gap-2">
                <Video className="w-4 h-4" />
                Webinars
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assessments" className="space-y-3">
              {assessmentsData?.assessments?.length ? (
                assessmentsData.assessments.map((assessment, index) => (
                  <div key={assessment.assessment_id} className="p-4 rounded-xl border-2 hover:border-primary/30 hover:shadow-md transition-all bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ backgroundColor: COLORS.gradient[index % COLORS.gradient.length] }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{assessment.template_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(assessment.completed_at).toLocaleDateString()} • {assessment.questions_answered} questions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{assessment.total_score}</p>
                          <p className="text-xs text-muted-foreground">/ {assessment.max_score}</p>
                        </div>
                        <div className="w-16">
                          <Progress value={(assessment.total_score / assessment.max_score) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                    {assessment.responses && assessment.responses.length > 0 && (
                      <div className="mt-4 ml-13 p-4 bg-muted/30 rounded-xl border">
                        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Responses</p>
                        <div className="space-y-2">
                          {assessment.responses.map((r, i) => {
                            // Helper to extract display value from various formats
                            const getDisplayValue = (val: unknown): string => {
                              if (val === null || val === undefined) return 'N/A';
                              if (typeof val === 'string') {
                                // Try to parse if it looks like JSON
                                try {
                                  const parsed = JSON.parse(val);
                                  if (parsed && typeof parsed === 'object') {
                                    return parsed.text || parsed.value?.toString() || val;
                                  }
                                } catch {
                                  return val;
                                }
                                return val;
                              }
                              if (typeof val === 'number') return val.toString();
                              if (typeof val === 'object') {
                                const obj = val as Record<string, unknown>;
                                return (obj.text as string) || (obj.value as string)?.toString() || 'N/A';
                              }
                              return String(val);
                            };
                            
                            const displayValue = getDisplayValue(r.answer_text) !== 'N/A' 
                              ? getDisplayValue(r.answer_text) 
                              : getDisplayValue(r.answer_value);
                            
                            return (
                              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                                  {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  {r.question_text && (
                                    <p className="text-sm text-muted-foreground mb-1 truncate">{r.question_text}</p>
                                  )}
                                  <p className="text-sm font-medium">{displayValue}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No assessments found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activities" className="space-y-3">
              {activitiesData?.activities?.length ? (
                activitiesData.activities.map((activity, index) => (
                  <div 
                    key={activity.submission_id} 
                    className="p-4 rounded-xl border-2 hover:border-primary/30 hover:shadow-md transition-all bg-card cursor-pointer"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ backgroundColor: COLORS.gradient[index % COLORS.gradient.length] }}
                        >
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{activity.activity_title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>{activity.activity_type}</span>
                            <span>•</span>
                            <span>Due: {new Date(activity.due_date).toLocaleDateString()}</span>
                            {activity.submitted_at && (
                              <>
                                <span>•</span>
                                <span>Submitted: {new Date(activity.submitted_at).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          activity.status === "VERIFIED" ? "bg-green-100 text-green-700 border border-green-200" :
                          activity.status === "SUBMITTED" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                          activity.status === "REJECTED" ? "bg-red-100 text-red-700 border border-red-200" :
                          "bg-amber-100 text-amber-700 border border-amber-200"
                        }>
                          {activity.status === "VERIFIED" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {activity.status === "PENDING" && <Clock className="w-3 h-3 mr-1" />}
                          {activity.status}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    {/* Preview of response */}
                    {activity.student_response?.text && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 ml-13">
                        {activity.student_response.text}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No activities found</p>
                </div>
              )}
              
              {/* Activity Detail Modal */}
              <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  {selectedActivity && (
                    <>
                      <DialogHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <DialogTitle className="text-xl">{selectedActivity.activity_title}</DialogTitle>
                            <DialogDescription className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{selectedActivity.activity_type}</Badge>
                              <Badge className={
                                selectedActivity.status === "VERIFIED" ? "bg-green-100 text-green-700" :
                                selectedActivity.status === "SUBMITTED" ? "bg-blue-100 text-blue-700" :
                                selectedActivity.status === "REJECTED" ? "bg-red-100 text-red-700" :
                                "bg-amber-100 text-amber-700"
                              }>
                                {selectedActivity.status}
                              </Badge>
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>
                      
                      <div className="space-y-4 mt-4">
                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground">Assigned</p>
                            <p className="font-medium">{new Date(selectedActivity.assigned_at).toLocaleDateString()}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground">Due Date</p>
                            <p className="font-medium">{new Date(selectedActivity.due_date).toLocaleDateString()}</p>
                          </div>
                          {selectedActivity.submitted_at && (
                            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 col-span-2">
                              <p className="text-xs text-green-600">Submitted</p>
                              <p className="font-medium text-green-700">{new Date(selectedActivity.submitted_at).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Student Response */}
                        {(selectedActivity.student_response?.text || selectedActivity.student_response?.media_url || selectedActivity.file_url) && (
                          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              Student Response
                            </p>
                            {selectedActivity.student_response?.text && (
                              <p className="text-sm whitespace-pre-wrap bg-white dark:bg-gray-900 p-3 rounded-lg border">
                                {selectedActivity.student_response.text}
                              </p>
                            )}
                            {(selectedActivity.student_response?.media_url || selectedActivity.file_url) && (
                              <div className="mt-3 flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => setAttachmentUrl(selectedActivity.student_response?.media_url || selectedActivity.file_url || null)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View Attachment
                                </Button>
                                <a 
                                  href={selectedActivity.student_response?.media_url || selectedActivity.file_url || '#'} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                                >
                                  Open in New Tab
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Teacher Feedback */}
                        {selectedActivity.feedback && (
                          <div className="p-4 bg-green-50/50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Teacher Feedback
                            </p>
                            <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded-lg border">
                              {selectedActivity.feedback}
                            </p>
                          </div>
                        )}
                        
                        {/* No response yet */}
                        {!selectedActivity.student_response?.text && !selectedActivity.file_url && selectedActivity.status === "PENDING" && (
                          <div className="text-center py-8 bg-muted/30 rounded-xl">
                            <Clock className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                            <p className="text-muted-foreground">No response submitted yet</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              
              {/* Attachment Preview Modal */}
              <Dialog open={!!attachmentUrl} onOpenChange={(open) => !open && setAttachmentUrl(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Attachment Preview</DialogTitle>
                    <DialogDescription>Student submitted file</DialogDescription>
                  </DialogHeader>
                  {attachmentUrl && (
                    <div className="mt-4">
                      {/* Check if it's an image */}
                      {/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(attachmentUrl) ? (
                        <div className="flex justify-center">
                          <img 
                            src={attachmentUrl} 
                            alt="Attachment" 
                            className="max-w-full max-h-[60vh] rounded-lg object-contain"
                          />
                        </div>
                      ) : /\.(mp4|webm|ogg)$/i.test(attachmentUrl) ? (
                        <video 
                          src={attachmentUrl} 
                          controls 
                          className="w-full max-h-[60vh] rounded-lg"
                        />
                      ) : /\.(mp3|wav|ogg|m4a)$/i.test(attachmentUrl) ? (
                        <audio src={attachmentUrl} controls className="w-full" />
                      ) : /\.pdf$/i.test(attachmentUrl) ? (
                        <iframe 
                          src={attachmentUrl} 
                          className="w-full h-[60vh] rounded-lg border"
                          title="PDF Preview"
                        />
                      ) : (
                        <div className="text-center py-12 bg-muted/30 rounded-xl">
                          <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                          <a 
                            href={attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Open File
                          </a>
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <a 
                          href={attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm"
                        >
                          Open in New Tab
                        </a>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="webinars" className="space-y-3">
              {webinarsData?.webinars?.length ? (
                webinarsData.webinars.map((webinar) => (
                  <div key={webinar.webinar_id} className="p-4 rounded-xl border-2 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{webinar.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(webinar.scheduled_at).toLocaleDateString()} • {webinar.duration_minutes} min
                        </p>
                      </div>
                      <Badge className={webinar.attended ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {webinar.attended ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                        {webinar.attended ? "Attended" : "Missed"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No webinars found</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
