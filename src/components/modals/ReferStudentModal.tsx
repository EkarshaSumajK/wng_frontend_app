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
import { CalendarIcon, AlertTriangle, X, UserPlus, Clock, FileText, Users } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">Refer Student for Wellness Check</DialogTitle>
              <DialogDescription className="mt-1">
                Schedule a wellness check appointment with a counselor for{" "}
                <span className="font-semibold text-foreground">{student?.first_name} {student?.last_name}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
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
          <div className="space-y-3">
            <Label htmlFor="counselor" className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Select Counselor *
            </Label>
            <Select
              value={formData.counselor_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, counselor_id: value }))
              }
              required
            >
              <SelectTrigger className="h-12 border-2">
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

          <Separator />

          {/* Date & Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Preferred Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-12 border-2"
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
            <div className="space-y-3">
              <Label htmlFor="time" className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Preferred Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time: e.target.value }))
                }
                className="h-12 border-2"
                required
              />
            </div>
          </div>

          <Separator />

          {/* Reason */}
          <div className="space-y-3">
            <Label htmlFor="reason" className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Reason for Referral *
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Brief description of concerns..."
              rows={4}
              className="resize-none border-2"
              required
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-base font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Any additional context or observations..."
              rows={3}
              className="resize-none border-2"
            />
          </div>

          {/* Actions */}
          <Separator />
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
              disabled={createEvent.isPending}
            >
              {createEvent.isPending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Schedule Wellness Check
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
