import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ClipboardCheck,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Send,
  Heart,
  Brain,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useStudentSummary,
  useStudentAssessmentAnalytics,
  useStudentActivityAnalytics,
} from "@/hooks/useAnalytics";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

interface StudentAnalyticsDashboardProps {
  studentId: string;
  studentName?: string;
}

// Vibrant color palette
const COLORS = {
  pending: "#f59e0b",
  submitted: "#3b82f6",
  verified: "#10b981",
  rejected: "#ef4444",
  primary: "#8b5cf6",
  secondary: "#06b6d4",
  categories: ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"],
};

export function StudentAnalyticsDashboard({ studentId, studentName }: StudentAnalyticsDashboardProps) {
  const [assessmentDays, setAssessmentDays] = useState<number | undefined>(undefined);
  const [assessmentCategory, setAssessmentCategory] = useState<string | undefined>(undefined);
  const [activityDays, setActivityDays] = useState<number | undefined>(undefined);
  const [activityStatus, setActivityStatus] = useState<string | undefined>(undefined);

  const { data: summary, isLoading: summaryLoading } = useStudentSummary(studentId);
  const { data: assessmentData, isLoading: assessmentLoading } = useStudentAssessmentAnalytics(
    studentId,
    { days: assessmentDays, category: assessmentCategory as any }
  );
  const { data: activityData, isLoading: activityLoading } = useStudentActivityAnalytics(
    studentId,
    { days: activityDays, status: activityStatus as any }
  );

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW": return { bg: "from-green-500", text: "text-green-600", badge: "bg-green-100 text-green-700" };
      case "MEDIUM": return { bg: "from-amber-500", text: "text-amber-600", badge: "bg-amber-100 text-amber-700" };
      case "HIGH": return { bg: "from-red-500", text: "text-red-600", badge: "bg-red-100 text-red-700" };
      default: return { bg: "from-gray-500", text: "text-gray-600", badge: "bg-gray-100 text-gray-700" };
    }
  };

  const riskColors = summary ? getRiskColor(summary.risk_level) : getRiskColor("LOW");

  return (
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div className={`bg-gradient-to-r ${riskColors.bg} via-purple-500/10 to-blue-500/10 rounded-2xl p-6 border`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {studentName || summary?.student_name || "Student"} Analytics
              </h2>
              <p className="text-muted-foreground">
                Comprehensive view of assessments and activities
              </p>
            </div>
          </div>
          {summary && (
            <Badge className={`text-sm px-4 py-2 ${riskColors.badge}`}>
              {summary.risk_level} Risk
            </Badge>
          )}
        </div>
      </div>

      {/* Summary Stats with Colorful Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wellbeing Score</p>
                  <p className="text-3xl font-bold text-purple-600">{summary.wellbeing_score}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.wellbeing_score >= 70 ? "Good" : summary.wellbeing_score >= 50 ? "Moderate" : "Needs Attention"}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Target className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assessments</p>
                  <p className="text-3xl font-bold text-blue-600">{summary.assessments.total_completed}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg: {summary.assessments.average_score.toFixed(1)}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <ClipboardCheck className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Activity Completion</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {summary.activities.completion_rate.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.activities.total_completed}/{summary.activities.total_assigned}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <Activity className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified Activities</p>
                  <p className="text-3xl font-bold text-green-600">
                    {summary.activities.status_breakdown.VERIFIED}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.activities.status_breakdown.PENDING} pending
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="assessments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assessments" className="gap-2">
            <Brain className="w-4 h-4" />
            Assessments
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Activities
          </TabsTrigger>
        </TabsList>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Select
              value={assessmentCategory || "all"}
              onValueChange={(v) => setAssessmentCategory(v === "all" ? undefined : v)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="depression">Depression</SelectItem>
                <SelectItem value="anxiety">Anxiety</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={assessmentDays?.toString() || "all"}
              onValueChange={(v) => setAssessmentDays(v === "all" ? undefined : parseInt(v))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {assessmentLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : assessmentData ? (
            <div className="space-y-6">
              {/* Charts Row */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Score Trend Chart */}
                {assessmentData.score_trend.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                        Score Trend
                      </CardTitle>
                      <CardDescription>Assessment scores over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={assessmentData.score_trend.map((t) => ({
                          date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                          score: t.score,
                          assessment: t.assessment,
                        }))}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#8b5cf6"
                            fillOpacity={1}
                            fill="url(#colorScore)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Category Breakdown Pie Chart */}
                {assessmentData.category_breakdown.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                        Category Breakdown
                      </CardTitle>
                      <CardDescription>Assessments by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={assessmentData.category_breakdown.map((c) => ({
                              name: c.category.charAt(0).toUpperCase() + c.category.slice(1),
                              value: c.assessment_count,
                              avgScore: c.average_score.toFixed(1),
                            }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {assessmentData.category_breakdown.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS.categories[index % COLORS.categories.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Statistics and Comparison Row */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Colorful Statistics Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                      Overall Statistics
                    </CardTitle>
                    <CardDescription>Assessment score analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-purple-600 font-medium">Mean Score</p>
                        <p className="text-2xl font-bold text-purple-700">{assessmentData.overall_statistics.mean.toFixed(1)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-600 font-medium">Median Score</p>
                        <p className="text-2xl font-bold text-blue-700">{assessmentData.overall_statistics.median.toFixed(1)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                        <p className="text-xs text-cyan-600 font-medium">Score Range</p>
                        <p className="text-2xl font-bold text-cyan-700">
                          {assessmentData.overall_statistics.min} - {assessmentData.overall_statistics.max}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-xs text-emerald-600 font-medium">Std Deviation</p>
                        <p className="text-2xl font-bold text-emerald-700">{assessmentData.overall_statistics.std_dev.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Class Comparison Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                      Class Comparison
                    </CardTitle>
                    <CardDescription>How this student compares to class</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                          Student Average
                        </span>
                        <span className="font-bold text-purple-600">{assessmentData.class_comparison.student_average.toFixed(1)}</span>
                      </div>
                      <Progress value={(assessmentData.class_comparison.student_average / 20) * 100} className="h-3 bg-purple-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          Class Average
                        </span>
                        <span className="font-bold text-blue-600">{assessmentData.class_comparison.class_average.toFixed(1)}</span>
                      </div>
                      <Progress value={(assessmentData.class_comparison.class_average / 20) * 100} className="h-3 bg-blue-100" />
                    </div>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      assessmentData.class_comparison.difference < 0 
                        ? "bg-green-50 dark:bg-green-950/30" 
                        : "bg-amber-50 dark:bg-amber-950/30"
                    }`}>
                      {assessmentData.class_comparison.difference < 0 ? (
                        <TrendingDown className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-amber-500" />
                      )}
                      <span className="text-sm font-medium">
                        {Math.abs(assessmentData.class_comparison.difference).toFixed(1)} points{" "}
                        {assessmentData.class_comparison.difference < 0 ? "below" : "above"} class average
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
                    Recent Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {assessmentData.assessments.map((assessment, index) => (
                        <div
                          key={assessment.assessment_id}
                          className="flex items-center justify-between p-4 rounded-xl border-2 hover:border-primary/30 hover:bg-muted/30 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: COLORS.categories[index % COLORS.categories.length] }}
                            >
                              {assessment.template_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold">{assessment.template_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {assessment.title} • {new Date(assessment.completed_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-2xl">{assessment.total_score}</p>
                            <Badge className={`${
                              assessment.category === "depression" ? "bg-purple-100 text-purple-700" :
                              assessment.category === "anxiety" ? "bg-blue-100 text-blue-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                              {assessment.category}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">No assessment data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Select
              value={activityStatus || "all"}
              onValueChange={(v) => setActivityStatus(v === "all" ? undefined : v)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={activityDays?.toString() || "all"}
              onValueChange={(v) => setActivityDays(v === "all" ? undefined : parseInt(v))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {activityLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : activityData ? (
            <div className="space-y-6">
              {/* Activity Metrics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-cyan-500 bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                        <p className="text-3xl font-bold text-cyan-600">
                          {activityData.overall_metrics.completion_rate.toFixed(0)}%
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                        <Target className="w-6 h-6 text-cyan-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Assigned</p>
                        <p className="text-3xl font-bold text-blue-600">
                          {activityData.overall_metrics.total_assigned}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <ClipboardCheck className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Verified</p>
                        <p className="text-3xl font-bold text-green-600">
                          {activityData.overall_metrics.verified_count}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending</p>
                        <p className="text-3xl font-bold text-amber-600">
                          {activityData.overall_metrics.pending_count}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Status Distribution Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                      Status Distribution
                    </CardTitle>
                    <CardDescription>Activities by status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Pending", value: activityData.status_distribution.PENDING, color: COLORS.pending },
                            { name: "Submitted", value: activityData.status_distribution.SUBMITTED, color: COLORS.submitted },
                            { name: "Verified", value: activityData.status_distribution.VERIFIED, color: COLORS.verified },
                            { name: "Rejected", value: activityData.status_distribution.REJECTED, color: COLORS.rejected },
                          ].filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { color: COLORS.pending },
                            { color: COLORS.submitted },
                            { color: COLORS.verified },
                            { color: COLORS.rejected },
                          ].filter((_, i) => [
                            activityData.status_distribution.PENDING,
                            activityData.status_distribution.SUBMITTED,
                            activityData.status_distribution.VERIFIED,
                            activityData.status_distribution.REJECTED,
                          ][i] > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Weekly Trend Chart */}
                {activityData.weekly_completion_trend.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                        Weekly Completion Trend
                      </CardTitle>
                      <CardDescription>Activities completed per week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={activityData.weekly_completion_trend.map((w) => ({
                          week: new Date(w.week_of).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                          completed: w.completed,
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="completed" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Activity Type Distribution */}
              {activityData.activity_type_distribution.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                      Activity Types
                    </CardTitle>
                    <CardDescription>Distribution by activity type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activityData.activity_type_distribution.map((type, index) => (
                        <div key={type.type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS.categories[index % COLORS.categories.length] }}
                              />
                              {type.type.replace(/_/g, " ")}
                            </span>
                            <span className="font-medium">{type.count} ({type.percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${type.percentage}%`,
                                backgroundColor: COLORS.categories[index % COLORS.categories.length]
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status Lists with Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                    Submissions by Status
                  </CardTitle>
                  <CardDescription>View submissions grouped by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                      <TabsTrigger value="pending" className="gap-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
                        <Clock className="w-3 h-3" />
                        <span className="hidden sm:inline">Pending</span>
                        <Badge variant="secondary" className="ml-1 bg-amber-200 text-amber-800 text-xs">
                          {activityData.status_distribution.PENDING}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="submitted" className="gap-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                        <Send className="w-3 h-3" />
                        <span className="hidden sm:inline">Submitted</span>
                        <Badge variant="secondary" className="ml-1 bg-blue-200 text-blue-800 text-xs">
                          {activityData.status_distribution.SUBMITTED}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="verified" className="gap-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        <span className="hidden sm:inline">Verified</span>
                        <Badge variant="secondary" className="ml-1 bg-green-200 text-green-800 text-xs">
                          {activityData.status_distribution.VERIFIED}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="rejected" className="gap-1 data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
                        <XCircle className="w-3 h-3" />
                        <span className="hidden sm:inline">Rejected</span>
                        <Badge variant="secondary" className="ml-1 bg-red-200 text-red-800 text-xs">
                          {activityData.status_distribution.REJECTED}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                      <SubmissionList 
                        submissions={activityData.recent_submissions.filter(s => s.status === "PENDING")}
                        status="PENDING"
                        emptyMessage="No pending activities"
                      />
                    </TabsContent>
                    <TabsContent value="submitted">
                      <SubmissionList 
                        submissions={activityData.recent_submissions.filter(s => s.status === "SUBMITTED")}
                        status="SUBMITTED"
                        emptyMessage="No submitted activities awaiting review"
                      />
                    </TabsContent>
                    <TabsContent value="verified">
                      <SubmissionList 
                        submissions={activityData.recent_submissions.filter(s => s.status === "VERIFIED")}
                        status="VERIFIED"
                        emptyMessage="No verified activities yet"
                      />
                    </TabsContent>
                    <TabsContent value="rejected">
                      <SubmissionList 
                        submissions={activityData.recent_submissions.filter(s => s.status === "REJECTED")}
                        status="REJECTED"
                        emptyMessage="No rejected activities"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <p className="text-muted-foreground">No activity data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}


// Submission List Component
function SubmissionList({
  submissions,
  status,
  emptyMessage,
}: {
  submissions: any[];
  status: string;
  emptyMessage: string;
}) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING": return { color: "amber", icon: <Clock className="w-5 h-5 text-amber-600" /> };
      case "SUBMITTED": return { color: "blue", icon: <Send className="w-5 h-5 text-blue-600" /> };
      case "VERIFIED": return { color: "green", icon: <CheckCircle className="w-5 h-5 text-green-600" /> };
      case "REJECTED": return { color: "red", icon: <XCircle className="w-5 h-5 text-red-600" /> };
      default: return { color: "gray", icon: <AlertCircle className="w-5 h-5 text-gray-600" /> };
    }
  };

  const config = getStatusConfig(status);

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 rounded-full bg-${config.color}-100 dark:bg-${config.color}-900/30 flex items-center justify-center mx-auto mb-4`}>
          {config.icon}
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-3">
        {submissions.map((submission) => (
          <div
            key={submission.submission_id}
            className="flex items-center justify-between p-4 rounded-xl border-2 hover:border-primary/30 hover:bg-muted/30 transition-all"
          >
            <div className="flex items-center gap-3">
              {config.icon}
              <div>
                <p className="font-semibold">{submission.activity_title}</p>
                <p className="text-sm text-muted-foreground">
                  {submission.activity_type.replace(/_/g, " ")} •{" "}
                  {new Date(submission.submitted_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`bg-${config.color}-100 text-${config.color}-700`}>
                {submission.status}
              </Badge>
              {submission.feedback && (
                <p className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate">
                  {submission.feedback}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default StudentAnalyticsDashboard;
