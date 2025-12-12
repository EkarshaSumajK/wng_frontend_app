import { useState } from "react";
import {
  Users,
  BarChart3,
  Target,
  CheckCircle,
  TrendingUp,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssessmentAnalytics, useAssessmentMonitoring } from "@/hooks/useAnalytics";
import type { StudentCompletion, NotStartedStudent } from "@/services/analytics";
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
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Student result type from the assessment hook
interface StudentResultData {
  student_id: string;
  student_name: string;
  total_score: number;
  completed_at: string;
  responses?: Array<{
    question_id?: string;
    question_text?: string;
    answer_value?: number;
    answer_text?: string;
  }>;
}

interface AssessmentAnalyticsDashboardProps {
  assessmentId: string;
  studentResults?: StudentResultData[];
}

// Vibrant color palette
const COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  primary: "#8b5cf6",
  secondary: "#06b6d4",
  gradient: ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"],
};

export function AssessmentAnalyticsDashboard({
  assessmentId,
  studentResults: externalStudentResults,
}: AssessmentAnalyticsDashboardProps) {
  const { data, isLoading, error } = useAssessmentAnalytics(assessmentId);
  const { data: monitoringData } = useAssessmentMonitoring(assessmentId);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">
            Failed to load assessment analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  // Use external student results if provided, otherwise use API data
  const studentResults = externalStudentResults && externalStudentResults.length > 0 
    ? externalStudentResults 
    : data.student_results;

  const displayedStudents = showAllStudents
    ? studentResults
    : studentResults.slice(0, 10);
  const displayedQuestions = showAllQuestions
    ? data.question_analysis
    : data.question_analysis.slice(0, 5);

  // Prepare pie chart data
  const scoreDistributionData = [
    { name: "Low Risk", value: data.score_distribution.low, color: COLORS.low },
    { name: "Medium Risk", value: data.score_distribution.medium, color: COLORS.medium },
    { name: "High Risk", value: data.score_distribution.high, color: COLORS.high },
  ].filter((d) => d.value > 0);

  // Prepare question analysis data
  const questionData = data.question_analysis.slice(0, 8).map((q, i) => ({
    name: `Q${i + 1}`,
    avgScore: q.average_score,
    maxScore: q.max_score,
    fullQuestion: q.question_text,
  }));

  // Prepare percentile data for radial chart
  const percentileData = [
    {
      name: "75th",
      value: data.overall_statistics.percentiles["75th"],
      fill: "#8b5cf6",
    },
    {
      name: "50th",
      value: data.overall_statistics.percentiles["50th"],
      fill: "#3b82f6",
    },
    {
      name: "25th",
      value: data.overall_statistics.percentiles["25th"],
      fill: "#06b6d4",
    },
  ];

  // Categorize students using the combined student results
  const maxScore = data.overall_statistics.max || 100;
  const lowRiskStudents = studentResults.filter(
    (s) => (s.total_score / maxScore) * 100 <= 33
  );
  const mediumRiskStudents = studentResults.filter(
    (s) =>
      (s.total_score / maxScore) * 100 > 33 &&
      (s.total_score / maxScore) * 100 <= 66
  );
  const highRiskStudents = studentResults.filter(
    (s) => (s.total_score / maxScore) * 100 > 66
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 rounded-2xl p-6 border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.template_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                {data.category}
              </Badge>
              <Badge variant="outline">{data.class_name}</Badge>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">{data.title}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-violet-500 bg-gradient-to-r from-violet-50 to-transparent dark:from-violet-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold text-violet-600">
                  {data.completion_metrics.completion_rate.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.completion_metrics.total_completed}/{data.completion_metrics.total_expected} students
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold text-blue-600">
                  {data.overall_statistics.mean.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Median: {data.overall_statistics.median.toFixed(1)}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500 bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score Range</p>
                <p className="text-3xl font-bold text-cyan-600">
                  {data.overall_statistics.min} - {data.overall_statistics.max}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Std Dev: {data.overall_statistics.std_dev.toFixed(2)}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Responses</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {data.overall_statistics.count}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total submissions</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
              Risk Distribution
            </CardTitle>
            <CardDescription>Students categorized by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {scoreDistributionData.map((entry, index) => (
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

        {/* Question Analysis Bar Chart */}
        {questionData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                Question Performance
              </CardTitle>
              <CardDescription>Average score per question</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={questionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [value.toFixed(2), name === "avgScore" ? "Avg Score" : "Max Score"]}
                  />
                  <Legend />
                  <Bar dataKey="avgScore" name="Avg Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maxScore" name="Max Score" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Percentiles Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            Score Percentiles
          </CardTitle>
          <CardDescription>Distribution of scores across students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-950/30 dark:to-cyan-900/20 border-2 border-cyan-200 dark:border-cyan-800">
              <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-2">25th Percentile</p>
              <p className="text-4xl font-bold text-cyan-600">{data.overall_statistics.percentiles["25th"]}</p>
              <Progress value={(data.overall_statistics.percentiles["25th"] / data.overall_statistics.max) * 100} className="mt-3 h-2" />
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">50th Percentile (Median)</p>
              <p className="text-4xl font-bold text-blue-600">{data.overall_statistics.percentiles["50th"]}</p>
              <Progress value={(data.overall_statistics.percentiles["50th"] / data.overall_statistics.max) * 100} className="mt-3 h-2" />
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/20 border-2 border-violet-200 dark:border-violet-800">
              <p className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-2">75th Percentile</p>
              <p className="text-4xl font-bold text-violet-600">{data.overall_statistics.percentiles["75th"]}</p>
              <Progress value={(data.overall_statistics.percentiles["75th"] / data.overall_statistics.max) * 100} className="mt-3 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students by Risk Level Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
            Students by Risk Level
          </CardTitle>
          <CardDescription>View students grouped by their assessment scores</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="high" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="low" className="gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Low Risk</span>
                <Badge variant="secondary" className="ml-1 bg-green-200 text-green-800">
                  {lowRiskStudents.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="medium" className="gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Medium Risk</span>
                <Badge variant="secondary" className="ml-1 bg-amber-200 text-amber-800">
                  {mediumRiskStudents.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="high" className="gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">High Risk</span>
                <Badge variant="secondary" className="ml-1 bg-red-200 text-red-800">
                  {highRiskStudents.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="low">
              <StudentList
                students={lowRiskStudents}
                maxScore={data.overall_statistics.max}
                color="green"
                icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                emptyMessage="No low risk students"
                description="Students with scores in the lower third (healthier)"
              />
            </TabsContent>

            <TabsContent value="medium">
              <StudentList
                students={mediumRiskStudents}
                maxScore={data.overall_statistics.max}
                color="amber"
                icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
                emptyMessage="No medium risk students"
                description="Students requiring monitoring"
              />
            </TabsContent>

            <TabsContent value="high">
              <StudentList
                students={highRiskStudents}
                maxScore={data.overall_statistics.max}
                color="red"
                icon={<TrendingUp className="w-5 h-5 text-red-600" />}
                emptyMessage="No high risk students"
                description="Students requiring immediate attention"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Question Analysis Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            Question Analysis
          </CardTitle>
          <CardDescription>Detailed breakdown by question</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayedQuestions.map((q, index) => (
              <div
                key={q.question_id}
                className="p-4 rounded-xl border-2 hover:border-primary/30 hover:bg-muted/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: COLORS.gradient[index % COLORS.gradient.length] }}
                      >
                        {index + 1}
                      </div>
                      <p className="font-medium">{q.question_text}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground ml-10">
                      <span>{q.response_count} responses</span>
                      <span>Range: {q.min_score} - {q.max_score}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{q.average_score.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">avg score</p>
                  </div>
                </div>
                <div className="mt-3 ml-10">
                  <Progress value={(q.average_score / q.max_score) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
          {data.question_analysis.length > 5 && (
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowAllQuestions(!showAllQuestions)}
            >
              {showAllQuestions ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" /> Show All {data.question_analysis.length} Questions
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Monitoring Section - Completion Status */}
      {monitoringData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500" />
              Students by Completion Status
            </CardTitle>
            <CardDescription>Track which students have completed, partially completed, or not started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-600">{monitoringData.summary.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-2 border-amber-200 dark:border-amber-800 text-center">
                <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-600">{monitoringData.summary.incomplete}</p>
                <p className="text-xs text-muted-foreground">Incomplete</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-200 dark:border-red-800 text-center">
                <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{monitoringData.summary.not_started}</p>
                <p className="text-xs text-muted-foreground">Not Started</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/20 border-2 border-slate-200 dark:border-slate-800 text-center">
                <Users className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-600">{monitoringData.summary.expected_students}</p>
                <p className="text-xs text-muted-foreground">Expected</p>
              </div>
            </div>
            <Tabs defaultValue="incomplete" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="completed" className="gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Completed</span>
                  <Badge variant="secondary" className="ml-1 bg-emerald-200 text-emerald-800">
                    {monitoringData.completed_students.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="incomplete" className="gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Incomplete</span>
                  <Badge variant="secondary" className="ml-1 bg-amber-200 text-amber-800">
                    {monitoringData.incomplete_students.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="not_started" className="gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
                  <XCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Not Started</span>
                  <Badge variant="secondary" className="ml-1 bg-red-200 text-red-800">
                    {monitoringData.not_started_students.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="completed">
                <CompletionStudentList
                  students={monitoringData.completed_students}
                  type="completed"
                  totalQuestions={monitoringData.total_questions}
                />
              </TabsContent>

              <TabsContent value="incomplete">
                <CompletionStudentList
                  students={monitoringData.incomplete_students}
                  type="incomplete"
                  totalQuestions={monitoringData.total_questions}
                />
              </TabsContent>

              <TabsContent value="not_started">
                <NotStartedStudentList students={monitoringData.not_started_students} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Student List Component with Response Viewing
function StudentList({
  students,
  maxScore,
  color,
  icon,
  emptyMessage,
  description,
}: {
  students: Array<{ 
    student_id: string; 
    student_name: string; 
    total_score: number; 
    completed_at: string;
    responses?: Array<{
      question_id?: string;
      question_text?: string;
      answer_value?: number;
      answer_text?: string;
    }>;
  }>;
  maxScore: number;
  color: string;
  icon: React.ReactNode;
  emptyMessage: string;
  description: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const displayedStudents = showAll ? students : students.slice(0, 5);

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const colorClasses: Record<string, { bg: string; bgLight: string; border: string; text: string }> = {
    green: { bg: "bg-green-100 dark:bg-green-900", bgLight: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800", text: "text-green-600" },
    amber: { bg: "bg-amber-100 dark:bg-amber-900", bgLight: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", text: "text-amber-600" },
    red: { bg: "bg-red-100 dark:bg-red-900", bgLight: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", text: "text-red-600" },
  };

  const classes = colorClasses[color] || colorClasses.green;

  return (
    <div className="space-y-3">
      <div className={`p-4 rounded-xl ${classes.bgLight} border ${classes.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${classes.bg} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <p className="font-semibold">{students.length} Students</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {displayedStudents.map((student, index) => {
          const scorePercent = (student.total_score / maxScore) * 100;
          const isExpanded = expandedStudent === student.student_id;
          const hasResponses = student.responses && student.responses.length > 0;
          
          return (
            <div
              key={student.student_id}
              className={`rounded-xl border-2 transition-all ${isExpanded ? 'border-primary/50 shadow-md' : 'hover:border-primary/30'}`}
            >
              <div
                className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-xl ${!isExpanded ? 'rounded-b-xl' : ''}`}
                onClick={() => hasResponses && setExpandedStudent(isExpanded ? null : student.student_id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${classes.bg} flex items-center justify-center font-bold text-sm ${classes.text}`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{student.student_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(student.completed_at).toLocaleDateString()} • {student.responses?.length || 0} responses
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <Progress value={scorePercent} className="h-2" />
                  </div>
                  <Badge className={`${classes.bgLight} ${classes.text} border ${classes.border}`}>
                    {student.total_score.toFixed(0)}
                  </Badge>
                  {hasResponses && (
                    <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Expanded Responses Section */}
              {isExpanded && hasResponses && (
                <div className="border-t p-4 bg-muted/30 rounded-b-xl">
                  <p className="text-sm font-semibold mb-3 text-muted-foreground">Student Responses</p>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {student.responses?.map((response: any, rIndex) => {
                      // Helper to safely get string value
                      const getStringValue = (val: any): string | null => {
                        if (val === null || val === undefined) return null;
                        if (typeof val === 'string') return val;
                        if (typeof val === 'number') return String(val);
                        if (typeof val === 'object') {
                          if (val.text) return val.text;
                          if (val.value !== undefined) return String(val.value);
                          return JSON.stringify(val);
                        }
                        return String(val);
                      };
                      
                      // Handle different field names from API
                      const questionText = getStringValue(response.question_text || response.questionText || response.question);
                      
                      // Get answer value - could be number or object with value property
                      let answerValue: number | null = null;
                      const rawValue = response.answer_value ?? response.answerValue ?? response.value ?? response.score;
                      if (rawValue !== null && rawValue !== undefined) {
                        if (typeof rawValue === 'number') {
                          answerValue = rawValue;
                        } else if (typeof rawValue === 'object' && rawValue.value !== undefined) {
                          answerValue = Number(rawValue.value);
                        } else if (typeof rawValue === 'string') {
                          answerValue = parseFloat(rawValue);
                        }
                      }
                      
                      // Get answer text
                      const rawAnswerText = response.answer_text || response.answerText || response.answer || response.selected_option || response.selectedOption;
                      const answerText = getStringValue(rawAnswerText);
                      
                      return (
                        <div 
                          key={`${student.student_id}-response-${rIndex}`} 
                          className="p-3 bg-background rounded-lg border"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1">Question {rIndex + 1}</p>
                              <p className="text-sm font-medium">
                                {questionText || `Question ${rIndex + 1}`}
                              </p>
                            </div>
                            <div className="text-right">
                              {answerValue !== null && !isNaN(answerValue) && (
                                <Badge variant="outline" className="font-bold">
                                  Score: {answerValue}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {answerText && (
                            <div className="mt-2 p-2 bg-primary/5 rounded-md border-l-2 border-primary/30">
                              <p className="text-xs text-muted-foreground mb-1">Answer:</p>
                              <p className="text-sm font-medium text-foreground">
                                {answerText}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {students.length > 5 && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" /> Show All {students.length} Students
            </>
          )}
        </Button>
      )}
    </div>
  );
}

// Completion Student List Component for Monitoring Tab
function CompletionStudentList({
  students,
  type,
  totalQuestions,
}: {
  students: StudentCompletion[];
  type: "completed" | "incomplete";
  totalQuestions: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const displayedStudents = showAll ? students : students.slice(0, 5);

  const colorConfig = {
    completed: {
      bg: "bg-emerald-100 dark:bg-emerald-900",
      bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-600",
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    },
    incomplete: {
      bg: "bg-amber-100 dark:bg-amber-900",
      bgLight: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-600",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
    },
  };

  const config = colorConfig[type];

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 rounded-full ${config.bg} flex items-center justify-center mx-auto mb-4`}>
          {config.icon}
        </div>
        <p className="text-muted-foreground">
          {type === "completed" ? "No completed students yet" : "No incomplete submissions"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className={`p-4 rounded-xl ${config.bgLight} border ${config.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
            {config.icon}
          </div>
          <div>
            <p className="font-semibold">{students.length} Students</p>
            <p className="text-sm text-muted-foreground">
              {type === "completed" 
                ? "All questions answered" 
                : "Some questions missing"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {displayedStudents.map((student, index) => {
          const isExpanded = expandedStudent === student.student_id;
          const progressPercent = (student.answered_questions / totalQuestions) * 100;

          return (
            <div
              key={student.student_id}
              className={`rounded-xl border-2 transition-all ${isExpanded ? 'border-primary/50 shadow-md' : 'hover:border-primary/30'}`}
            >
              <div
                className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-xl ${!isExpanded ? 'rounded-b-xl' : ''}`}
                onClick={() => setExpandedStudent(isExpanded ? null : student.student_id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center font-bold text-sm ${config.text}`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{student.student_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.answered_questions}/{totalQuestions} questions • Score: {student.total_score.toFixed(0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                  <Badge className={`${config.bgLight} ${config.text} border ${config.border}`}>
                    {progressPercent.toFixed(0)}%
                  </Badge>
                  <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t p-4 bg-muted/30 rounded-b-xl">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-background rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Expected Questions</p>
                      <p className="text-lg font-bold">{student.expected_questions}</p>
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Answered Questions</p>
                      <p className="text-lg font-bold">{student.answered_questions}</p>
                    </div>
                  </div>

                  {student.missing_questions.length > 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 mb-3">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">
                        Missing Questions ({student.missing_questions.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {student.missing_questions.map((q) => (
                          <Badge key={q} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                            {q}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.extra_questions.length > 0 && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        Extra Questions ({student.extra_questions.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {student.extra_questions.map((q) => (
                          <Badge key={q} variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                            {q}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-3">
                    Completed at: {new Date(student.completed_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {students.length > 5 && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" /> Show All {students.length} Students
            </>
          )}
        </Button>
      )}
    </div>
  );
}

// Not Started Student List Component
function NotStartedStudentList({ students }: { students: NotStartedStudent[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayedStudents = showAll ? students : students.slice(0, 10);

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <p className="text-muted-foreground">All students have started the assessment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold">{students.length} Students</p>
            <p className="text-sm text-muted-foreground">Haven't started the assessment yet</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {displayedStudents.map((student, index) => (
          <div
            key={student.student_id}
            className="flex items-center gap-3 p-3 rounded-xl border-2 hover:border-red-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center font-bold text-sm text-red-600">
              {index + 1}
            </div>
            <p className="font-medium">{student.student_name}</p>
          </div>
        ))}
      </div>

      {students.length > 10 && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" /> Show All {students.length} Students
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default AssessmentAnalyticsDashboard;
