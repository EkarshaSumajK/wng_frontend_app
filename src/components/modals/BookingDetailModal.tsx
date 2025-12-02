import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, MapPin, FileText, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface BookingDetailModalProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: (bookingId: string) => void;
  onReschedule?: (bookingId: string) => void;
}

export function BookingDetailModal({ booking, open, onOpenChange, onCancel, onReschedule }: BookingDetailModalProps) {
  if (!booking) return null;

  const therapist = booking.therapist;
  const statusColor = 
    (booking.status === 'Confirmed' || booking.status === 'Requested') ? 'bg-green-100 text-green-800' :
    booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
    booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
    'bg-yellow-100 text-yellow-800';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Booking Details</DialogTitle>
            <Badge variant="outline" className={statusColor}>
              {(booking.status === 'Confirmed' || booking.status === 'Requested') ? 'Booked' : booking.status}
            </Badge>
          </div>
          <DialogDescription>
            Reference ID: {booking.booking_id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Therapist Info */}
          {therapist && (
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {therapist.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold">{therapist.name}</h3>
                <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />
                  {therapist.location}
                </div>
              </div>
            </div>
          )}

          {/* Session Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {format(new Date(booking.appointment_date), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time & Duration</p>
                <p className="font-medium">
                  {booking.appointment_time} ({booking.duration_minutes} mins)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-medium text-sm">
                  {booking.notes || "No additional notes"}
                </p>
              </div>
            </div>
          </div>

          {booking.cancellation_reason && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex gap-2 text-sm text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Cancellation Reason:</span> {booking.cancellation_reason}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
            <>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => onReschedule?.(booking.booking_id)}
              >
                Reschedule
              </Button>
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto"
                onClick={() => onCancel?.(booking.booking_id)}
              >
                Cancel Booking
              </Button>
            </>
          )}
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
