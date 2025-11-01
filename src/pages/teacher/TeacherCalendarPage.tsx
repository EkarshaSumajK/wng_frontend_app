import { useState } from "react";
import { Calendar, BookOpen, Users, Clock, Plus, Edit, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { EditCalendarEventModal } from "@/components/modals/EditCalendarEventModal";
import { useMyCalendarEvents, useUpdateCalendarEvent } from "@/hooks/useCalendarEvents";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfWeek } from "date-fns";

export default function TeacherCalendarPage() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Fetch calendar events
  const { data: eventsData = [], isLoading } = useMyCalendarEvents();
  const updateEvent = useUpdateCalendarEvent();
  
  // Transform API events to calendar format with IST timezone
  const events = eventsData
    .filter((event: any) => event.start_time && event.end_time) // Filter out events with invalid dates
    .map((event: any) => {
      // Parse UTC times and convert to IST
      const startUTC = new Date(event.start_time);
      const endUTC = new Date(event.end_time);
      
      // Add IST offset (5 hours 30 minutes = 330 minutes)
      const startIST = new Date(startUTC.getTime() + (5.5 * 60 * 60 * 1000));
      const endIST = new Date(endUTC.getTime() + (5.5 * 60 * 60 * 1000));
      
      return {
        id: event.event_id,
        title: event.title || 'Untitled Event',
        start: startIST,
        end: endIST,
        type: event.type?.toLowerCase() || 'session',
        description: event.description,
        location: event.location,
        status: event.status,
        related_student_id: event.related_student_id,
        attendees: event.attendees || [],
      };
    });

  const now = new Date();
  const todayDate = format(now, "yyyy-MM-dd");

  // Today's Schedule: Only NON-completed events today
  const todaysEvents = events.filter(
    (event: any) =>
      format(event.start, "yyyy-MM-dd") === todayDate &&
      event.status !== "COMPLETED"
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
    { title: "Today's Events", value: todaysEvents.length.toString(), icon: Calendar },
    { title: "This Week", value: thisWeekEvents.length.toString(), icon: BookOpen },
    { title: "Total Events", value: events.length.toString(), icon: Users },
    { title: "Upcoming", value: upcomingEvents.length.toString(), icon: Clock }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Calendar</h1>
        <p className="text-muted-foreground">Manage your class schedule and activities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>
              {todayDate} - {todaysEvents.length} events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No activities scheduled for today</p>
              ) : (
                todaysEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => handleEditEvent(event)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{event.title}</span>
                        <Badge
                          variant={
                            event.status === "COMPLETED"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(event.start, "p")} - {format(event.end, "p")}
                      </div>
                      {event.location && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Next 5 scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{event.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {event.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(event.start, 'PPp')}
                      </div>
                      {event.location && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
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
                <p className="text-muted-foreground text-center py-4">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Completed Events
          </CardTitle>
          <CardDescription>Recently completed activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedEvents.length > 0 ? (
              completedEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{event.title}</span>
                      <Badge variant="default" className="text-xs">
                        COMPLETED
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(event.start, "PPp")}
                    </div>
                    {event.location && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditEvent(event)}
                    title="Edit Event"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No completed events
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <EditCalendarEventModal
        event={selectedEvent}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        canDelete={true}
      />
    </div>
  );
}