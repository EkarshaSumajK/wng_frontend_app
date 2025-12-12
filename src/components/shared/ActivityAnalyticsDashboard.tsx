import { useState } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Send,
  UserX,
} from "lucide-react";
import type { ActivityStudentSubmission } from "@/services/analytics";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatCard } from "@/components/shared/StatCard";
import { useActivityAnalytics } from "@/hooks/useAnalytics";
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

// Submission type from the activity assignments hook
interface SubmissionData {
  submission_id?: string;
  student_id: string;
  student_name: string;
  class_id?: string;
  class_name?: string;
  status: string;
  submitted_at?: string | null;
  verified_at?: string | null;
  feedback?: string | null;
}

interface ActivityAnalyticsDashboardProps {
  activityId: string;
  submissions?: SubmissionData[];
}

// Vibrant color palette
const COLORS = {
  pending: "#f59e0b",
  submitted: "#3b82f6",
  verified: "#10b981",
  rejected: "#ef4444",
  gradient: ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"],
};

export function ActivityAnalyticsDashboard({
  activityId,
  submissions: externalSubmissions,
}: ActivityAnalyticsDashboardProps) {
  const { data, isLoading, error } = useActivityAnalytics(activityId);
  const [showAllClasses, setShowAllClasses] = useState(false);

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
            Failed to load activity analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedClasses = showAllClasses
    ? data.class_breakdown
    : data.class_breakdown.slice(0, 5);

  // Helper function to get students by status - uses external submissions if provided, otherwise API data
  const getStudentsByStatus = (status: string): ActivityStudentSubmission[] => {
    // First try external submissions (from parent component)
    if (externalSubmissions && externalSubmissions.length > 0) {
      return externalSubmissions
        .filter(s => s.status === status)
        .map(s => ({
          student_id: s.student_id,
          student_name: s.student_name,
          class_id: s.class_id || "",
          class_name: s.class_name || "",
          status: s.status as 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED',
          submitted_at: s.submitted_at || null,
          verified_at: s.verified_at || null,
          feedback: s.feedback || null,
        }));
    }
    // Fall back to API data
    return data.student_submissions?.filter(s => s.status === status) || [];
  };

  // Prepare pie chart data with colors
  const pieData = [
    { name: "Pending", value: data.status_distribution.PENDING, color: COLORS.pending },
    { name: "Submitted", value: data.status_distribution.SUBMITTED, color: COLORS.submitted },
    { name: "Verified", value: data.status_distribution.VERIFIED, color: COLORS.verified },
    { name: "Rejected", value: data.status_distribution.REJECTED, color: COLORS.rejected },
  ].filter((d) => d.value > 0);

  // Prepare timeline data
  const timelineData = data.submission_timeline.map((t) => ({
    date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    submissions: t.count,
  }));

  // Prepare class comparison data
  const classComparisonData = data.class_breakdown.slice(0, 8).map((cls) => ({
    name: cls.class_name.length > 10 ? cls.class_name.slice(0, 10) + "..." : cls.class_name,
    completed: cls.completed,
    pending: cls.total_students - cls.completed,
    rate: cls.completion_rate,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{data.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {data.type.replace(/_/g, " ")}
              </Badge>
              <Badge variant="outline">{data.duration} min</Badge>
              <Badge variant="outline">{data.total_assignments} classes</Badge>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">{data.description}</p>
      </div>

      {/* Summary Stats with Colorful Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {data.submission_metrics.completion_rate.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.submission_metrics.total_completed}/{data.submission_metrics.total_expected} students
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-3xl font-bold text-green-600">{data.submission_metrics.verified_count}</p>
                <p className="text-xs text-muted-foreground mt-1">Approved submissions</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-amber-600">{data.submission_metrics.pending_review}</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expected</p>
                <p className="text-3xl font-bold text-blue-600">{data.submission_metrics.total_expected}</p>
                <p className="text-xs text-muted-foreground mt-1">Across all classes</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Colorful Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
              Status Distribution
            </CardTitle>
            <CardDescription>Breakdown of submission statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
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

        {/* Submission Timeline Area Chart */}
        {timelineData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                Submission Timeline
              </CardTitle>
              <CardDescription>Daily submission activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
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
                    dataKey="submissions"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorSubmissions)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Class Comparison Bar Chart */}
      {classComparisonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
              Class Comparison
            </CardTitle>
            <CardDescription>Completion status by class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Status Lists with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
            Students by Status
          </CardTitle>
          <CardDescription>View students grouped by their submission status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="pending" className="gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Pending</span>
                <Badge variant="secondary" className="ml-1 bg-amber-200 text-amber-800">
                  {data.status_distribution.PENDING}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="submitted" className="gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Submitted</span>
                <Badge variant="secondary" className="ml-1 bg-blue-200 text-blue-800">
                  {data.status_distribution.SUBMITTED}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="verified" className="gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Verified</span>
                <Badge variant="secondary" className="ml-1 bg-green-200 text-green-800">
                  {data.status_distribution.VERIFIED}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
                <XCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Rejected</span>
                <Badge variant="secondary" className="ml-1 bg-red-200 text-red-800">
                  {data.status_distribution.REJECTED}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <StudentStatusList
                students={getStudentsByStatus("PENDING")}
                status="PENDING"
                count={data.status_distribution.PENDING}
                icon={<Clock className="w-5 h-5 text-amber-600" />}
                color="amber"
                emptyMessage="No pending submissions"
                description="Students who haven't submitted yet"
              />
            </TabsContent>

            <TabsContent value="submitted">
              <StudentStatusList
                students={getStudentsByStatus("SUBMITTED")}
                status="SUBMITTED"
                count={data.status_distribution.SUBMITTED}
                icon={<Send className="w-5 h-5 text-blue-600" />}
                color="blue"
                emptyMessage="No submissions awaiting review"
                description="Submissions waiting for verification"
              />
            </TabsContent>

            <TabsContent value="verified">
              <StudentStatusList
                students={getStudentsByStatus("VERIFIED")}
                status="VERIFIED"
                count={data.status_distribution.VERIFIED}
                icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                color="green"
                emptyMessage="No verified submissions yet"
                description="Successfully verified submissions"
              />
            </TabsContent>

            <TabsContent value="rejected">
              <StudentStatusList
                students={getStudentsByStatus("REJECTED")}
                status="REJECTED"
                count={data.status_distribution.REJECTED}
                icon={<XCircle className="w-5 h-5 text-red-600" />}
                color="red"
                emptyMessage="No rejected submissions"
                description="Submissions that need to be redone"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Class Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            Class Details
          </CardTitle>
          <CardDescription>Detailed breakdown by class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayedClasses.map((cls, index) => (
              <div
                key={cls.assignment_id}
                className="flex items-center justify-between p-4 rounded-xl border-2 hover:border-primary/30 hover:bg-muted/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: COLORS.gradient[index % COLORS.gradient.length] }}
                  >
                    {cls.class_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{cls.class_name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Due: {new Date(cls.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {cls.completed}/{cls.total_students}
                    </p>
                    <p className="text-xs text-muted-foreground">completed</p>
                  </div>
                  <div className="w-24">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={cls.completion_rate}
                        className="h-2"
                        style={{
                          background: `linear-gradient(to right, ${
                            cls.completion_rate >= 80 ? "#10b981" : cls.completion_rate >= 50 ? "#f59e0b" : "#ef4444"
                          } ${cls.completion_rate}%, hsl(var(--muted)) ${cls.completion_rate}%)`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-center mt-1 font-medium">
                      {cls.completion_rate.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {data.class_breakdown.length > 5 && (
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowAllClasses(!showAllClasses)}
            >
              {showAllClasses ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" /> Show All {data.class_breakdown.length} Classes
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Student Status List Component
function StudentStatusList({
  students,
  status,
  count,
  icon,
  color,
  emptyMessage,
  description,
}: {
  students: ActivityStudentSubmission[];
  status: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  emptyMessage: string;
  description: string;
}) {
  const getStatusBadgeClass = (statusVal: string) => {
    switch (statusVal) {
      case "PENDING": return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      case "SUBMITTED": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "VERIFIED": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "REJECTED": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const colorClasses: Record<string, { bg: string; bgLight: string; border: string; text: string }> = {
    amber: { bg: "bg-amber-100 dark:bg-amber-900", bgLight: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", text: "text-amber-700 dark:text-amber-300" },
    blue: { bg: "bg-blue-100 dark:bg-blue-900", bgLight: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300" },
    green: { bg: "bg-green-100 dark:bg-green-900", bgLight: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-300" },
    red: { bg: "bg-red-100 dark:bg-red-900", bgLight: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-300" },
  };

  const classes = colorClasses[color] || colorClasses.amber;

  // No students at all
  if (count === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 rounded-full ${classes.bg} flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Have count but no detailed student list from API
  if (students.length === 0) {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-xl ${classes.bgLight} border ${classes.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${classes.bg} flex items-center justify-center`}>
              {icon}
            </div>
            <div>
              <p className="font-semibold">{count} Students</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center py-4">
          Student details will be available when the API provides the full list
        </p>
      </div>
    );
  }

  // Have both count and student list
  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className={`p-4 rounded-xl ${classes.bgLight} border ${classes.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${classes.bg} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <p className="font-semibold">{count} Students</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      {/* Student List */}
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {students.map((student) => (
            <div
              key={student.student_id}
              className="flex items-center justify-between p-3 rounded-xl border hover:border-primary/30 hover:bg-muted/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${classes.bg} flex items-center justify-center font-semibold ${classes.text}`}>
                  {student.student_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{student.student_name}</p>
                  <p className="text-xs text-muted-foreground">{student.class_name}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusBadgeClass(student.status)}>
                  {student.status}
                </Badge>
                {student.submitted_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(student.submitted_at).toLocaleDateString()}
                  </p>
                )}
                {student.feedback && (
                  <p className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate">
                    {student.feedback}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ActivityAnalyticsDashboard;
