import { useState } from "react";
import {
  Users,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Search,
  ChevronRight,
  Loader2,
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useWebinar,
  useWebinarParticipants,
} from "@/hooks/useWebinarAnalytics";
import type { Participant } from "@/services/webinarAnalytics";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = {
  primary: "#8b5cf6",
  secondary: "#06b6d4",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  gradient: ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"],
};

interface WebinarAnalyticsDashboardProps {
  webinarId: string;
}

export function WebinarAnalyticsDashboard({ webinarId }: WebinarAnalyticsDashboardProps) {
  const { data: webinar, isLoading } = useWebinar(webinarId);
  const [participantFilter, setParticipantFilter] = useState<string>("all");
  const [participantSearch, setParticipantSearch] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  const { data: participantsData } = useWebinarParticipants(webinarId, {
    attended: participantFilter === "all" ? undefined : participantFilter === "attended",
    search: participantSearch || undefined,
    limit: 100,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!webinar) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">Webinar not found</p>
        </CardContent>
      </Card>
    );
  }

  const { analytics, class_breakdown, watch_time_distribution } = webinar;

  // Prepare watch time distribution data
  const watchTimeData = Object.entries(watch_time_distribution || {}).map(([range, count]) => ({
    name: range,
    value: count,
  }));

  // Prepare class breakdown data
  const classData = class_breakdown?.map((c) => ({
    name: c.class_name,
    attended: c.attended,
    absent: c.invited - c.attended,
    rate: c.attendance_rate,
  })) || [];

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Upcoming": return "bg-blue-100 text-blue-700";
      case "Live": return "bg-red-100 text-red-700";
      case "Recorded": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 rounded-2xl p-6 border">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Video className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{webinar.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(webinar.schedule.status)}>
                  {webinar.schedule.status || "Unknown"}
                </Badge>
                {webinar.category && (
                  <Badge variant="outline">{webinar.category}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {webinar.speaker.name} {webinar.speaker.title && `• ${webinar.speaker.title}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Scheduled</p>
            <p className="font-semibold">{new Date(webinar.schedule.date).toLocaleDateString()}</p>
            <p className="text-sm text-muted-foreground">{webinar.schedule.duration_minutes} min</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invited</p>
                <p className="text-3xl font-bold text-violet-600">{analytics.total_invited}</p>
              </div>
              <Users className="w-8 h-8 text-violet-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attended</p>
                <p className="text-3xl font-bold text-green-600">{analytics.total_attended}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.attendance_rate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
            <Progress value={analytics.attendance_rate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Watch Time</p>
                <p className="text-3xl font-bold text-amber-600">{analytics.avg_watch_time.toFixed(0)} min</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Watch Time Distribution */}
        {watchTimeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Watch Time Distribution
              </CardTitle>
              <CardDescription>How long participants watched</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "Participants", color: COLORS.primary },
                } satisfies ChartConfig}
                className="h-[250px]"
              >
                <BarChart data={watchTimeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Class Breakdown */}
        {classData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Attendance by Class
              </CardTitle>
              <CardDescription>Breakdown per class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {class_breakdown?.slice(0, 6).map((cls, index) => (
                  <div key={cls.class_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: COLORS.gradient[index % COLORS.gradient.length] }}
                      >
                        {cls.grade}
                      </div>
                      <div>
                        <p className="font-medium">{cls.class_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cls.attended}/{cls.invited} attended
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20">
                        <Progress value={cls.attendance_rate} className="h-2" />
                      </div>
                      <span className="font-bold text-sm w-12 text-right">
                        {cls.attendance_rate.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Participants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Participants
              </CardTitle>
              <CardDescription>
                {participantsData?.total_participants || 0} total participants
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={participantFilter} onValueChange={setParticipantFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="attended" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="attended" className="gap-2">
                <CheckCircle className="w-4 h-4" />
                Completed
                <Badge variant="secondary" className="ml-1">
                  {participantsData?.participants.filter((p) => p.status === "Completed").length || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="partial" className="gap-2">
                <Clock className="w-4 h-4" />
                Partial
                <Badge variant="secondary" className="ml-1">
                  {participantsData?.participants.filter((p) => p.status === "Partial").length || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="absent" className="gap-2">
                <XCircle className="w-4 h-4" />
                Absent
                <Badge variant="secondary" className="ml-1">
                  {participantsData?.participants.filter((p) => p.status === "Absent").length || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {["attended", "partial", "absent"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-2">
                {participantsData?.participants
                  .filter((p) =>
                    tab === "attended"
                      ? p.status === "Completed"
                      : tab === "partial"
                      ? p.status === "Partial"
                      : p.status === "Absent"
                  )
                  .map((participant, index) => (
                    <div
                      key={participant.student_id}
                      className="flex items-center justify-between p-3 rounded-xl border hover:border-primary/30 hover:bg-muted/50 cursor-pointer transition-all"
                      onClick={() => setSelectedParticipant(participant)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: COLORS.gradient[index % COLORS.gradient.length] }}
                        >
                          {participant.student_name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{participant.student_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {participant.class_name || "No class"} • Grade {participant.grade || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {participant.attended && (
                          <div className="text-right">
                            <p className="font-bold text-primary">{participant.watch_duration_minutes || 0} min</p>
                            <p className="text-xs text-muted-foreground">{participant.watch_percentage}% watched</p>
                          </div>
                        )}
                        <Badge
                          className={
                            participant.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : participant.status === "Partial"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {participant.status}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )) || (
                  <p className="text-center text-muted-foreground py-8">No participants found</p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Participant Detail Modal */}
      <Dialog open={!!selectedParticipant} onOpenChange={(open) => !open && setSelectedParticipant(null)}>
        <DialogContent>
          {selectedParticipant && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedParticipant.student_name}</DialogTitle>
                <DialogDescription>
                  {selectedParticipant.class_name} • Grade {selectedParticipant.grade}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      className={`mt-1 ${
                        selectedParticipant.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : selectedParticipant.status === "Partial"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedParticipant.status}
                    </Badge>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground">Watch Time</p>
                    <p className="text-xl font-bold">{selectedParticipant.watch_duration_minutes || 0} min</p>
                  </div>
                </div>
                {selectedParticipant.attended && (
                  <>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">Watch Progress</p>
                      <Progress value={selectedParticipant.watch_percentage} className="h-3" />
                      <p className="text-right text-sm mt-1">{selectedParticipant.watch_percentage}%</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                        <p className="text-xs text-green-600">Join Time</p>
                        <p className="font-medium">
                          {selectedParticipant.join_time
                            ? new Date(selectedParticipant.join_time).toLocaleTimeString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30">
                        <p className="text-xs text-red-600">Leave Time</p>
                        <p className="font-medium">
                          {selectedParticipant.leave_time
                            ? new Date(selectedParticipant.leave_time).toLocaleTimeString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {!selectedParticipant.attended && (
                  <div className="text-center py-8 bg-red-50 dark:bg-red-950/30 rounded-xl">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                    <p className="text-muted-foreground">Did not attend this webinar</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WebinarAnalyticsDashboard;
