import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarIcon, Clock, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { format, addMinutes, setHours, setMinutes, isSameDay, startOfDay, parseISO } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { useCreateCalendarEvent, useMyCalendarEvents } from "@/hooks/useCalendarEvents";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ScheduleCaseSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
  caseId?: string;
}

export function ScheduleCaseSessionModal({ 
  open, 
  onOpenChange, 
  studentId, 
  studentName,
  caseId 
}: ScheduleCaseSessionModalProps) {
  const { user } = useAuth();
  const createEvent = useCreateCalendarEvent();
  const { data: existingEvents = [] } = useMyCalendarEvents();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState("45");
  const [sessionType, setSessionType] = useState("SESSION");
  const [location, setLocation] = useState("Counselor Office");
  const [description, setDescription] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [conflictError, setConflictError] = useState<any>(null);
  const { toast } = useToast();
  
  // Configurable scheduling settings
  const [workStart, setWorkStart] = useState(8); // 8 AM
  const [workEnd, setWorkEnd] = useState(17); // 5 PM
  const [slotInterval, setSlotInterval] = useState(30); // 30-minute intervals
  const [bufferTime, setBufferTime] = useState(0); // Buffer between sessions

  // Generate available time slots for the selected date
  const availableSlots = useMemo(() => {
    if (!selectedDate || !Array.isArray(existingEvents)) return [];

    const slots: { time: string; available: boolean; label: string; reason?: string }[] = [];
    const sessionDuration = parseInt(duration);
    const timezone = "Asia/Kolkata"; // IST

    // Generate all possible time slots
    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        // Create slot time in IST
        const slotStart = new Date(selectedDate);
        slotStart.setHours(hour, minute, 0, 0);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + sessionDuration);

        // Skip if slot end goes beyond work hours
        if (slotEnd.getHours() > workEnd || (slotEnd.getHours() === workEnd && slotEnd.getMinutes() > 0)) {
          continue;
        }

        // Don't show past time slots for today
        const isPast = isSameDay(selectedDate, new Date()) && slotStart < new Date();
        if (isPast) continue;

        // Check if this slot conflicts with any existing events (including buffer time)
        let hasConflict = false;
        let conflictReason = "";

        for (const event of existingEvents) {
          // Convert UTC event times to IST for comparison
          const eventStartUTC = new Date(event.start_time);
          const eventEndUTC = new Date(event.end_time);
          const eventStart = toZonedTime(eventStartUTC, timezone);
          const eventEnd = toZonedTime(eventEndUTC, timezone);
          
          if (!isSameDay(eventStart, selectedDate)) continue;
          
          // Add buffer time to event boundaries
          const bufferedEventStart = addMinutes(eventStart, -bufferTime);
          const bufferedEventEnd = addMinutes(eventEnd, bufferTime);
          
          // Check if slot overlaps with buffered event time
          const overlaps = (
            (slotStart >= bufferedEventStart && slotStart < bufferedEventEnd) ||
            (slotEnd > bufferedEventStart && slotEnd <= bufferedEventEnd) ||
            (slotStart <= bufferedEventStart && slotEnd >= bufferedEventEnd)
          );

          if (overlaps) {
            hasConflict = true;
            conflictReason = event.title || "Existing event";
            break;
          }
        }

        slots.push({
          time: format(slotStart, "HH:mm"),
          available: !hasConflict,
          label: format(slotStart, "h:mm a"),
          reason: hasConflict ? conflictReason : undefined,
        });
      }
    }

    return slots;
  }, [selectedDate, existingEvents, duration, workStart, workEnd, slotInterval, bufferTime]);

  // Count available slots
  const availableCount = availableSlots.filter(s => s.available).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTime) {
      alert("Please select a time slot");
      return;
    }

    // Combine date and time in IST timezone
    const [hours, minutes] = selectedTime.split(":");
    const timezone = "Asia/Kolkata"; // IST
    
    // Create a date in IST timezone
    const localDate = new Date(selectedDate);
    localDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Convert IST to UTC for storage
    const startTime = fromZonedTime(localDate, timezone);
    const endTime = addMinutes(startTime, parseInt(duration));

    const eventData = {
      school_id: user?.school_id,
      title: `Session: ${studentName}`,
      description: description || `Counseling session with ${studentName}`,
      type: sessionType,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      location: location,
      attendees: [user?.id].filter(Boolean),
      related_student_id: studentId,
      related_case_id: caseId,
      status: "SCHEDULED",
    };

    try {
      setConflictError(null); // Clear any previous errors
      await createEvent.mutateAsync(eventData as any);
      
      // Success toast
      toast({
        title: "Session Scheduled!",
        description: `Successfully scheduled session with ${studentName} on ${format(selectedDate, "MMM d")} at ${availableSlots.find(s => s.time === selectedTime)?.label}`,
      });
      
      onOpenChange(false);
      
      // Reset form
      setSelectedDate(new Date());
      setSelectedTime(null);
      setDuration("45");
      setSessionType("SESSION");
      setLocation("Counselor Office");
      setDescription("");
    } catch (error: any) {
      console.error("Scheduling error:", error);
      
      // The API client throws errors, but we need to extract the original response
      // Try to parse the error message which might contain JSON
      let errorDetail = null;
      let errorMessage = "Failed to schedule session. Please try again.";
      let isConflict = false;
      
      // Check if error message contains JSON (from API client)
      if (error?.message) {
        try {
          // Try to parse JSON from error message
          const jsonMatch = error.message.match(/\{.*\}/s);
          if (jsonMatch) {
            errorDetail = JSON.parse(jsonMatch[0]);
            if (errorDetail.message) {
              errorMessage = errorDetail.message;
            }
            isConflict = true;
          } else {
            errorMessage = error.message;
          }
        } catch (parseError) {
          // If parsing fails, use the error message as is
          errorMessage = error.message;
          isConflict = errorMessage.toLowerCase().includes('conflict');
        }
      }
      
      // Also check response structure (if available)
      if (error?.response?.data?.detail) {
        errorDetail = error.response.data.detail;
        if (typeof errorDetail === 'object' && errorDetail.message) {
          errorMessage = errorDetail.message;
        }
        isConflict = error.response.status === 409;
      }
      
      if (isConflict && errorDetail && typeof errorDetail === 'object') {
        setConflictError(errorDetail);
        
        // Show toast notification
        toast({
          variant: "destructive",
          title: "Scheduling Conflict",
          description: errorMessage,
        });
      } else {
        // Show generic error toast
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl">Schedule Session</DialogTitle>
          <DialogDescription className="text-base">
            Book a counseling session with <span className="font-semibold text-foreground">{studentName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Conflict Error Alert */}
          {conflictError && (
            <Alert variant="destructive" className="border-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold flex items-center justify-between">
                Time Conflict Detected
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConflictError(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertTitle>
              <AlertDescription className="mt-3 space-y-3">
                <p className="text-sm">
                  {typeof conflictError === 'string' 
                    ? conflictError 
                    : conflictError.message || "You already have events scheduled during this time."}
                </p>
                {conflictError.conflicts && Array.isArray(conflictError.conflicts) && conflictError.conflicts.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Conflicting Events:</p>
                    <div className="space-y-2">
                      {conflictError.conflicts.map((conflict: any, idx: number) => {
                        try {
                          // Convert UTC times to IST for display
                          const timezone = "Asia/Kolkata";
                          const startIST = toZonedTime(new Date(conflict.start_time), timezone);
                          const endIST = toZonedTime(new Date(conflict.end_time), timezone);
                          
                          return (
                            <div key={idx} className="bg-destructive/10 rounded-md p-3 text-sm">
                              <div className="font-medium">{conflict.title || "Untitled Event"}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {format(startIST, "MMM d, yyyy 'at' h:mm a")}
                                {` - ${format(endIST, "h:mm a")} IST`}
                              </div>
                            </div>
                          );
                        } catch (err) {
                          console.error("Error rendering conflict:", conflict, err);
                          return (
                            <div key={idx} className="bg-destructive/10 rounded-md p-3 text-sm">
                              <div className="font-medium">Conflicting Event</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Unable to display details
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground italic mt-2">
                      Please select a different time slot to avoid conflicts.
                    </p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Session Configuration */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Session Type</Label>
                <Select value={sessionType} onValueChange={setSessionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SESSION">Individual Session</SelectItem>
                    <SelectItem value="ASSESSMENT">Assessment</SelectItem>
                    <SelectItem value="MEETING">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={(value) => {
                  setDuration(value);
                  setSelectedTime(null); // Reset time when duration changes
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Scheduling Options */}
            <div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Options
              </Button>
              
              {showAdvanced && (
                <div className="mt-3 p-4 border rounded-lg space-y-3 bg-muted/30">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Work Start Time</Label>
                      <Select value={workStart.toString()} onValueChange={(v) => {
                        setWorkStart(parseInt(v));
                        setSelectedTime(null);
                      }}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 6).map(h => (
                            <SelectItem key={h} value={h.toString()}>{h}:00 AM</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Work End Time</Label>
                      <Select value={workEnd.toString()} onValueChange={(v) => {
                        setWorkEnd(parseInt(v));
                        setSelectedTime(null);
                      }}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 8 }, (_, i) => i + 14).map(h => (
                            <SelectItem key={h} value={h.toString()}>{h > 12 ? h - 12 : h}:00 {h >= 12 ? 'PM' : 'AM'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Time Slot Interval</Label>
                      <Select value={slotInterval.toString()} onValueChange={(v) => {
                        setSlotInterval(parseInt(v));
                        setSelectedTime(null);
                      }}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Buffer Time</Label>
                      <Select value={bufferTime.toString()} onValueChange={(v) => {
                        setBufferTime(parseInt(v));
                        setSelectedTime(null);
                      }}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No buffer</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Buffer time adds padding before/after sessions to prevent back-to-back scheduling.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Date and Time Selection - Calendly Style */}
          <div className="grid lg:grid-cols-[380px,1fr] gap-6 bg-muted/30 p-6 rounded-lg">
            {/* Calendar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </Label>
              </div>
              <div className="bg-background rounded-lg p-3 shadow-sm">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }
                  }}
                  disabled={(date) => date < startOfDay(new Date())}
                  className="rounded-md"
                />
              </div>
              <div className="text-xs text-muted-foreground bg-background p-3 rounded-lg">
                <p className="font-medium mb-1">Selected: {format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                {selectedTime && (
                  <p className="text-primary">
                    Time: {availableSlots.find(s => s.time === selectedTime)?.label} ({duration} min)
                  </p>
                )}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <Clock className="h-5 w-5" />
                  Available Times
                </Label>
                <Badge variant="secondary" className="text-xs font-normal">
                  {availableCount} of {availableSlots.length} available
                </Badge>
              </div>
              <div className="bg-background rounded-lg shadow-sm">
                <div className="p-4 max-h-[380px] overflow-y-auto">
                  {availableSlots.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">
                        No time slots available
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Try adjusting your working hours or selecting a different date
                      </p>
                    </div>
                  ) : availableCount === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">
                        All slots are booked
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Try selecting a different date or reducing buffer time
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          type="button"
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "justify-center font-medium",
                            selectedTime === slot.time && "ring-2 ring-primary ring-offset-2",
                            !slot.available && "opacity-40 cursor-not-allowed hover:bg-transparent"
                          )}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          title={slot.reason}
                        >
                          {slot.label}
                          {selectedTime === slot.time && <CheckCircle2 className="h-3 w-3 ml-1" />}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Time Summary */}
          {selectedTime && (
            <div className="p-5 bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <p className="font-semibold text-lg">Booking Confirmed</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Date:</span> {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Time:</span> {availableSlots.find(s => s.time === selectedTime)?.label}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Duration:</span> {duration} minutes
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Student:</span> {studentName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Counselor Office">🏢 Counselor Office</SelectItem>
                  <SelectItem value="Room 201">🚪 Room 201</SelectItem>
                  <SelectItem value="Room 202">🚪 Room 202</SelectItem>
                  <SelectItem value="Conference Room">👥 Conference Room</SelectItem>
                  <SelectItem value="Virtual">💻 Virtual/Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <Label className="text-sm font-medium">Session Info</Label>
              <div className="h-10 px-3 py-2 border rounded-md bg-muted/50 text-sm flex items-center text-muted-foreground">
                {sessionType === "SESSION" ? "Individual Session" : sessionType === "ASSESSMENT" ? "Assessment" : "Meeting"}
              </div>
            </div> */}
          </div>

          {/* Description */}
          <div className="space-y-2 p-2">
            <Label htmlFor="description" className="text-sm font-medium">Session Notes (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes, agenda items, or special considerations for this session..."
              rows={3}
              className="resize-none"
            />
          </div>
        </form>

        {/* Actions - Fixed at bottom */}
        <div className="flex gap-3 pt-4 border-t mt-auto">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="flex-1"
            disabled={createEvent.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            className="flex-1" 
            disabled={!selectedTime || createEvent.isPending}
          >
            {createEvent.isPending ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirm Booking
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
