import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CreditCard, CheckCircle2, User, Mail, Phone, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { marketplaceApi } from "@/services/marketplace";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface BookTherapistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  therapist: any;
  onSuccess?: () => void;
}

export function BookTherapistModal({ open, onOpenChange, therapist, onSuccess }: BookTherapistModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Booking Details, 2: Payment, 3: Success
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    sessionType: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to book an appointment");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Format date and time for backend
      // appointment_date should be YYYY-MM-DD
      // appointment_time should be HH:MM:SS
      
      await marketplaceApi.bookTherapist(therapist.id, {
        therapist_id: therapist.id,
        appointment_date: bookingData.date, // Already YYYY-MM-DD from input type="date"
        appointment_time: `${bookingData.time}:00`, // Add seconds
        duration_minutes: bookingData.sessionType === 'group' ? 90 : 
                          bookingData.sessionType === 'workshop' ? 120 : 
                          bookingData.sessionType === 'staff' ? 45 : 60,
        notes: `Session Type: ${bookingData.sessionType}. ${bookingData.notes}`,
      }, user.id); // Pass user.id as second argument

      setStep(3);
      onSuccess?.(); // Trigger success callback
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setBookingData({
      date: "",
      time: "",
      sessionType: "",
      contactEmail: "",
      contactPhone: "",
      notes: "",
    });
    setPaymentData({
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    });
    onOpenChange(false);
  };

  const sessionFee = therapist?.fee?.split(" - ")[0]?.replace("₹", "").replace(",", "") || "2000";
  const platformFee = "100";
  const total = (parseInt(sessionFee) + parseInt(platformFee)).toString();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Book Appointment</DialogTitle>
              <DialogDescription>
                Schedule a session with {therapist?.name}
              </DialogDescription>
            </DialogHeader>

            <Separator />

            {/* Therapist Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xl font-bold">
                  {therapist?.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{therapist?.name}</h3>
                  <p className="text-sm text-muted-foreground">{therapist?.specialty}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{therapist?.experience}</Badge>
                    <Badge variant="secondary">{therapist?.fee}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Special Guest Therapist:</strong> This professional will be available for your entire school. 
                  Book sessions for students, staff consultations, or group workshops.
                </p>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Preferred Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Preferred Time *
                  </Label>
                  <Select
                    value={bookingData.time}
                    onValueChange={(value) => setBookingData({ ...bookingData, time: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="15:00">03:00 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                      <SelectItem value="17:00">05:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Session Type */}
              <div className="space-y-2">
                <Label htmlFor="sessionType">Session Type *</Label>
                <Select
                  value={bookingData.sessionType}
                  onValueChange={(value) => setBookingData({ ...bookingData, sessionType: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Student Session (60 min)</SelectItem>
                    <SelectItem value="group">Group Session (90 min)</SelectItem>
                    <SelectItem value="staff">Staff Consultation (45 min)</SelectItem>
                    <SelectItem value="workshop">School Workshop (120 min)</SelectItem>
                    <SelectItem value="consultation">Initial Consultation (45 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Information */}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Email *
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={bookingData.contactEmail}
                    onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Phone *
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="1234567890"
                    value={bookingData.contactPhone}
                    onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Any specific concerns or requirements..."
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                />
              </div>

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-primary">
                  Continue to Payment
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Payment Details
              </DialogTitle>
              <DialogDescription>
                Complete your booking by providing payment information
              </DialogDescription>
            </DialogHeader>

            <Separator />

            {/* Booking Summary */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Therapist</span>
                  <span className="font-medium">{therapist?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">{bookingData.date} at {bookingData.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Session Type</span>
                  <span className="font-medium capitalize">{bookingData.sessionType}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Session Fee</span>
                  <span className="font-medium">₹{sessionFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium">₹{platformFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {/* Demo Payment Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> This is a demonstration payment gateway. Use any test card details.
                </p>
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    setPaymentData({ ...paymentData, cardNumber: value });
                  }}
                  maxLength={19}
                  required
                />
              </div>

              {/* Card Name */}
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name *</Label>
                <Input
                  id="cardName"
                  placeholder="Name on card"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setPaymentData({ ...paymentData, expiryDate: value });
                    }}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '') })}
                    maxLength={3}
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={isProcessing} className="bg-gradient-primary">
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay ₹{total}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground">
                  Your appointment has been successfully booked
                </p>
              </div>

              <Card className="bg-muted/50 text-left">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Therapist</p>
                      <p className="font-semibold">{therapist?.name}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="font-semibold">{bookingData.date} at {bookingData.time}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Session Type</p>
                      <p className="font-semibold capitalize">{bookingData.sessionType.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Amount Paid</p>
                      <p className="font-semibold text-green-600">₹{total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to <strong>{bookingData.contactEmail}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  You will receive a reminder 24 hours before your appointment.
                </p>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This therapist will be available as a special guest for your entire school. 
                    All staff members can schedule sessions during their visit.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Close
                </Button>
                <Button 
                  className="flex-1 bg-gradient-primary"
                  onClick={() => {
                    // Create calendar event
                    const event = {
                      title: `${bookingData.sessionType.charAt(0).toUpperCase() + bookingData.sessionType.slice(1)} Session - ${therapist?.name}`,
                      description: `Special Guest Therapist Visit\\n\\nTherapist: ${therapist?.name}\\nSpecialty: ${therapist?.specialty}\\nSession Type: ${bookingData.sessionType}\\nContact: ${bookingData.contactEmail}\\nPhone: ${bookingData.contactPhone}\\n\\nNotes: ${bookingData.notes || 'None'}\\n\\nThis is a school-wide resource. All staff can schedule sessions during this visit.`,
                      start: `${bookingData.date}T${bookingData.time}:00`,
                      end: `${bookingData.date}T${parseInt(bookingData.time.split(':')[0]) + 1}:${bookingData.time.split(':')[1]}:00`,
                      location: therapist?.location || 'School Campus'
                    };

                    // Create .ics file content
                    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WellNest Group//Therapy Booking//EN
BEGIN:VEVENT
UID:${Date.now()}@wellnestgroup.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${event.start.replace(/[-:]/g, '')}
DTEND:${event.end.replace(/[-:]/g, '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT24H
DESCRIPTION:Reminder: Therapy session tomorrow
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

                    // Create download link
                    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `therapy-session-${bookingData.date}.ics`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
