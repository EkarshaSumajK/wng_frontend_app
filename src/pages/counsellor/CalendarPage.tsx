import { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  User,
  MapPin,
  AlertCircle,
  Edit,
  CheckCircle,
  FileText,
  Coffee,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatCard } from "@/components/shared/StatCard";
import { EditCalendarEventModal } from "@/components/modals/EditCalendarEventModal";
import { NewCaseModal } from "@/components/modals/NewCaseModal";
import { ScheduleSessionModal } from "@/components/modals/ScheduleSessionModal";
import {
  useMyCalendarEvents,
  useUpdateCalendarEvent,
} from "@/hooks/useCalendarEvents";
import { useCreateCase } from "@/hooks/useCases";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfWeek } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function CalendarPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [selectedEventForCase, setSelectedEventForCase] = useState<any>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const { data: eventsData = [], isLoading } = useMyCalendarEvents();
  const updateEvent = useUpdateCalendarEvent();
  const createCase = useCreateCase();

  // Transform API events to calendar format with IST timezone
  const timezone = "Asia/Kolkata";
  const events = Array.isArray(eventsData) ? eventsData.map((event: any) => {
    // Parse UTC times and convert to IST
    const startUTC = new Date(event.start_time);
    const endUTC = new Date(event.end_time);

    // Add IST offset (5 hours 30 minutes = 330 minutes)
    const startIST = new Date(startUTC.getTime() + 5.5 * 60 * 60 * 1000);
    const endIST = new Date(endUTC.getTime() + 5.5 * 60 * 60 * 1000);

    return {
      id: event.event_id,
      title: event.title,
      start: startIST,
      end: endIST,
      type: event.type?.toLowerCase() || "session",
      description: event.description,
      location: event.location,
      status: event.status,
      related_student_id: event.related_student_id,
      attendees: event.attendees || [],
    };
  }) : [];

  const now = new Date();
  const todayDate = format(now, "yyyy-MM-dd");

  // Today's Schedule: Only NON-completed events today
  const todaysEvents = events.filter(
    (event: any) =>
      format(event.start, "yyyy-MM-dd") === todayDate &&
      event.status !== "COMPLETED"
  );

  // Requested Events: Events that need counselor approval
  const requestedEvents = events.filter(
    (event: any) => event.status === "REQUESTED"
  );

  // Upcoming Sessions: Future NON-completed events (excluding today)
  const upcomingEvents = events
    .filter(
      (event: any) =>
        event.start > now &&
        event.status !== "COMPLETED" &&
        format(event.start, "yyyy-MM-dd") !== todayDate
    )
    .slice(0, 5);

  // Completed Sessions: ONLY completed events (any date)
  const completedEvents = events
    .filter((event: any) => event.status === "COMPLETED")
    .sort((a: any, b: any) => b.start.getTime() - a.start.getTime()) // Most recent first
    .slice(0, 5);

  const thisWeekEvents = events.filter((event: any) => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return event.start >= weekStart && event.start <= weekEnd;
  });

  const stats = [
    {
      title: "Today's Sessions",
      value: todaysEvents.length.toString(),
      icon: Calendar,
    },
    {
      title: "Pending Requests",
      value: requestedEvents.length.toString(),
      icon: AlertCircle,
    },
    {
      title: "This Week",
      value: thisWeekEvents.length.toString(),
      icon: Clock,
    },
    { title: "Total Events", value: events.length.toString(), icon: User },
  ];

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleMarkComplete = async (event: any) => {
    await updateEvent.mutateAsync({
      id: event.id,
      data: { status: "COMPLETED" },
    });
  };

  const handleOpenCaseModal = (event: any) => {
    setSelectedEventForCase(event);
    setIsNewCaseModalOpen(true);
  };

  const handleCreateCaseSubmit = async (caseData: any) => {
    const fullCaseData = {
      student_id: caseData.studentId,
      created_by: caseData.assignedCounsellor || user?.id || "",
      presenting_concerns: caseData.summary,
      initial_risk: caseData.priority?.toUpperCase() || "MEDIUM",
      status: "INTAKE",
      notes: caseData.initialNotes || undefined,
    };

    await createCase.mutateAsync(fullCaseData as any);

    // Automatically mark the session as completed after creating a case
    if (selectedEventForCase) {
      await updateEvent.mutateAsync({
        id: selectedEventForCase.id,
        data: { status: "COMPLETED" },
      });
    }
    
    setSelectedEventForCase(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
      <AnimatedBackground />
      {/* Header with modern design */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100/50 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Calendar
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">
              Manage your appointments and sessions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards with enhanced design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const gradients = [
            { from: 'from-blue-500', to: 'to-cyan-500', bg: 'from-blue-500/10 to-cyan-500/10' },
            { from: 'from-orange-500', to: 'to-red-500', bg: 'from-orange-500/10 to-red-500/10' },
            { from: 'from-green-500', to: 'to-emerald-500', bg: 'from-green-500/10 to-emerald-500/10' },
            { from: 'from-purple-500', to: 'to-pink-500', bg: 'from-purple-500/10 to-pink-500/10' },
          ];
          const gradient = gradients[index];
          
          return (
            <Card key={index} className="relative overflow-hidden border-2 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">{stat.title}</CardTitle>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient.from} ${gradient.to} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {requestedEvents.length > 0 && (
        <Card className="border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-50/50 shadow-sm rounded-xl">
          <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Pending Requests</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {requestedEvents.length} wellness check{requestedEvents.length !== 1 ? 's' : ''} awaiting your approval
                  </CardDescription>
                </div>
              </div>
              <Badge variant="destructive" className="text-sm px-3 py-1">
                {requestedEvents.length} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {requestedEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border border-yellow-300"
                    onClick={() => handleEditEvent(event)}
                  >
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-base">{event.title}</span>
                        <Badge className="text-xs border-yellow-500 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100">
                          REQUESTED
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {format(event.start, "PPp")}
                      </div>
                      {event.location && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="border border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md rounded-xl">
          <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Today's Schedule</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {selectedDate} - {todaysEvents.length} appointments
                  </CardDescription>
                </div>
              </div>
              <Badge className="text-sm bg-purple-600 text-white hover:bg-purple-700">
                {todaysEvents.length} Today
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {todaysEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Coffee className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">No sessions today</p>
                      <p className="text-sm text-muted-foreground">Enjoy your free time!</p>
                    </div>
                  </div>
                ) : (
                  todaysEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border border-gray-100 dark:border-border rounded-xl hover:border-blue-100 hover:shadow-md transition-all duration-300 cursor-pointer gap-3 sm:gap-0"
                      onClick={() => handleEditEvent(event)}
                    >
                      <div className="flex-1 w-full sm:w-auto">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-semibold text-base">{event.title}</span>
                          <Badge
                            className={`text-xs ${
                              event.status === "COMPLETED"
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-purple-600 text-white hover:bg-purple-700"
                            }`}
                          >
                            {event.status}
                          </Badge>
                          {event.related_student_id && (
                            <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-border text-gray-700 dark:text-gray-300">
                              Wellness Check
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {format(event.start, "p")} - {format(event.end, "p")}
                        </div>
                        {event.location && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Next 5 scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event: any) => (
                    <div
                      key={event.id}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border border-gray-100 dark:border-border rounded-xl hover:border-blue-100 hover:shadow-md transition-all duration-300 gap-3 sm:gap-0"
                    >
                      <div className="flex-1 w-full sm:w-auto">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-semibold text-base">{event.title}</span>
                          <Badge className={`text-xs ${
                            event.status === "COMPLETED"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-purple-600 text-white hover:bg-purple-700"
                          }`}>
                            {event.status}
                          </Badge>
                          {event.related_student_id && (
                            <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-border text-gray-700 dark:text-gray-300">
                              Wellness Check
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {format(event.start, "PPp")}
                        </div>
                        {event.location && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkComplete(event)}
                          title="Mark Complete"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">No upcoming sessions</p>
                      <p className="text-sm text-muted-foreground">You're all caught up for now.</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Completed Sessions
          </CardTitle>
          <CardDescription>Recently completed appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {completedEvents.length > 0 ? (
                completedEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border border-gray-100 dark:border-border rounded-xl hover:border-blue-100 hover:shadow-md transition-all duration-300 gap-3 sm:gap-0"
                  >
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-base">{event.title}</span>
                        <Badge className="text-xs bg-blue-600 text-white hover:bg-blue-700">
                          COMPLETED
                        </Badge>
                        {event.related_student_id && (
                          <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-border text-gray-700 dark:text-gray-300">
                            Wellness Check
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {format(event.start, "PPp")}
                      </div>
                      {event.location && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenCaseModal(event)}
                        title="Create Case"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEvent(event)}
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">No completed sessions</p>
                    <p className="text-sm text-muted-foreground">Completed sessions will appear here.</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      </div>

      <EditCalendarEventModal
        event={selectedEvent}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        canDelete={true}
      />

      <NewCaseModal
        open={isNewCaseModalOpen}
        onOpenChange={setIsNewCaseModalOpen}
        onSubmit={handleCreateCaseSubmit}
        initialStudentId={selectedEventForCase?.related_student_id}
      />

      <ScheduleSessionModal
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
      />
    </div>
  );
}
