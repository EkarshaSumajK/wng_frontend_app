import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateCalendarEvent } from "@/hooks/useCalendarEvents";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, AlertTriangle, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ReferStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: any;
  counselors?: any[];
}

export function ReferStudentModal({
  open,
  onOpenChange,
  student,
  counselors = [],
}: ReferStudentModalProps) {
  const { user } = useAuth();
  const createEvent = useCreateCalendarEvent();
  const { toast } = useToast();
  const [conflictError, setConflictError] = useState<any>(null);

  const [formData, setFormData] = useState({
    counselor_id: "",
    date: new Date(),
    time: "09:00",
    reason: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date and time
    const [hours, minutes] = formData.time.split(":");
    const startTime = new Date(formData.date);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30); // 30 min default

    const studentName = student?.first_name && student?.last_name 
  ? `${student.first_name} ${student.last_name}`
  : student?.name || 'Student';


    const eventData = {
      school_id: user?.school_id,
      title: `Wellness Check: ${studentName}`,
      description: `Reason: ${formData.reason}\n\nNotes: ${
        formData.notes
      }\n\nReferred by: ${user?.display_name || user?.name || "Teacher"}`,
      type: "SESSION",
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      location: "Counselor Office",
      status: "REQUESTED",
      attendees: [formData.counselor_id, user?.id].filter(Boolean),
      related_student_id: student?.student_id,
    };

    try {
      setConflictError(null);
      await createEvent.mutateAsync(eventData as any);

      toast({
        title: "Wellness Check Scheduled!",
        description: `Successfully scheduled wellness check for ${studentName}`,
      });

      onOpenChange(false);

      // Reset form
      setFormData({
        counselor_id: "",
        date: new Date(),
        time: "09:00",
        reason: "",
        notes: "",
      });
    } catch (error: any) {
      console.error("Scheduling error:", error);

      // Parse error response
      let errorDetail = null;
      let errorMessage = "Failed to schedule wellness check. Please try again.";

      if (error?.message) {
        try {
          const jsonMatch = error.message.match(/\{.*\}/s);
          if (jsonMatch) {
            errorDetail = JSON.parse(jsonMatch[0]);
            if (errorDetail.message) {
              errorMessage = errorDetail.message;
            }
          } else {
            errorMessage = error.message;
          }
        } catch (parseError) {
          errorMessage = error.message;
        }
      }

      if (error?.response?.data?.detail) {
        errorDetail = error.response.data.detail;
        if (typeof errorDetail === "object" && errorDetail.message) {
          errorMessage = errorDetail.message;
        }
      }

      const isConflict =
        error?.response?.status === 409 ||
        errorMessage.toLowerCase().includes("conflict");

      if (isConflict && errorDetail && typeof errorDetail === "object") {
        setConflictError(errorDetail);
      }

      toast({
        variant: "destructive",
        title: isConflict ? "Scheduling Conflict" : "Error",
        description: errorMessage,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Refer Student for Wellness Check</DialogTitle>
          <DialogDescription>
            Schedule a wellness check appointment with a counselor for{" "}
            {student?.first_name} {student?.last_name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  {typeof conflictError === "string"
                    ? conflictError.replace(
                        "You already have",
                        "The counselor already has"
                      )
                    : (
                        conflictError.message ||
                        "The counselor already has events scheduled during this time."
                      ).replace(
                        "You already have",
                        "The counselor already has"
                      )}
                </p>
                {conflictError.conflicts &&
                  Array.isArray(conflictError.conflicts) &&
                  conflictError.conflicts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Conflicting Events:</p>
                      <div className="space-y-2">
                        {conflictError.conflicts.map(
                          (conflict: any, idx: number) => {
                            try {
                              const startIST = new Date(
                                new Date(conflict.start_time).getTime() +
                                  5.5 * 60 * 60 * 1000
                              );
                              const endIST = new Date(
                                new Date(conflict.end_time).getTime() +
                                  5.5 * 60 * 60 * 1000
                              );

                              return (
                                <div
                                  key={idx}
                                  className="bg-destructive/10 rounded-md p-3 text-sm"
                                >
                                  <div className="font-medium">
                                    {(() => {
                                      let title = conflict.title || "Wellness Check";
                                      // Remove "undefined" text and clean up
                                      title = title.replace(/undefined/g, '').replace(/\s+/g, ' ').trim();
                                      if (title.endsWith(':')) title = title.slice(0, -1).trim();
                                      return title || "Wellness Check";
                                    })()}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {format(
                                      startIST,
                                      "MMM d, yyyy 'at' h:mm a"
                                    )}
                                    {` - ${format(endIST, "h:mm a")} IST`}
                                  </div>
                                </div>
                              );
                            } catch (err) {
                              return (
                                <div
                                  key={idx}
                                  className="bg-destructive/10 rounded-md p-3 text-sm"
                                >
                                  <div className="font-medium">
                                    Conflicting Event
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Unable to display details
                                  </div>
                                </div>
                              );
                            }
                          }
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground italic mt-2">
                        Please select a different time to avoid conflicts.
                      </p>
                    </div>
                  )}
              </AlertDescription>
            </Alert>
          )}

          {/* Counselor Selection */}
          <div className="space-y-2">
            <Label htmlFor="counselor">Select Counselor *</Label>
            <Select
              value={formData.counselor_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, counselor_id: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a counselor" />
              </SelectTrigger>
              <SelectContent>
                {counselors.map((counselor) => (
                  <SelectItem key={counselor.user_id} value={counselor.user_id}>
                    {counselor.display_name || counselor.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Preferred Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) =>
                    date && setFormData((prev) => ({ ...prev, date }))
                  }
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Preferred Time *</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
              required
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Referral *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Brief description of concerns..."
              rows={3}
              required
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Any additional context or observations..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createEvent.isPending}
            >
              {createEvent.isPending
                ? "Scheduling..."
                : "Schedule Wellness Check"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
