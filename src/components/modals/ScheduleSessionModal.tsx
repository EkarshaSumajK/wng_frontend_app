import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { mockStudents } from "@/data/mockData";
import { toast } from "sonner";

interface ScheduleSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleSessionModal({ open, onOpenChange }: ScheduleSessionModalProps) {
  const [counsellorData, setCounsellorData] = useState({
    studentId: "",
    consultationType: "",
    date: "",
    time: "",
    urgency: "",
    description: "",
    preferredCounsellor: ""
  });

  const [psychologistData, setPsychologistData] = useState({
    studentId: "",
    sessionType: "",
    date: "",
    time: "",
    referralReason: "",
    riskLevel: "",
    consentGiven: false,
    previousAssessments: ""
  });

  const handleCounsellorSubmit = () => {
    if (!counsellorData.studentId || !counsellorData.consultationType || !counsellorData.date || !counsellorData.time) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Counsellor consultation scheduled successfully");
    onOpenChange(false);
    resetForms();
  };

  const handlePsychologistSubmit = () => {
    if (!psychologistData.studentId || !psychologistData.sessionType || !psychologistData.date || !psychologistData.time) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!psychologistData.consentGiven) {
      toast.error("Parent/Guardian consent is required");
      return;
    }
    
    toast.success("Clinical psychologist session scheduled successfully");
    onOpenChange(false);
    resetForms();
  };

  const resetForms = () => {
    setCounsellorData({
      studentId: "",
      consultationType: "",
      date: "",
      time: "",
      urgency: "",
      description: "",
      preferredCounsellor: ""
    });
    setPsychologistData({
      studentId: "",
      sessionType: "",
      date: "",
      time: "",
      referralReason: "",
      riskLevel: "",
      consentGiven: false,
      previousAssessments: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Session</DialogTitle>
          <DialogDescription>
            Book a consultation with a counsellor or clinical psychologist
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="counsellor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="counsellor">Counsellor Consultation</TabsTrigger>
            <TabsTrigger value="psychologist">Clinical Psychologist</TabsTrigger>
          </TabsList>

          <TabsContent value="counsellor" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="counsellor-student">Student Name *</Label>
              <Select value={counsellorData.studentId} onValueChange={(value) => setCounsellorData({...counsellorData, studentId: value})}>
                <SelectTrigger id="counsellor-student">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map(student => (
                    <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation-type">Consultation Type *</Label>
              <Select value={counsellorData.consultationType} onValueChange={(value) => setCounsellorData({...counsellorData, consultationType: value})}>
                <SelectTrigger id="consultation-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="behavioral">Behavioral Concern</SelectItem>
                  <SelectItem value="academic">Academic Support</SelectItem>
                  <SelectItem value="social-emotional">Social-Emotional Issue</SelectItem>
                  <SelectItem value="general">General Wellbeing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="counsellor-date">Preferred Date *</Label>
                <Input 
                  id="counsellor-date" 
                  type="date" 
                  value={counsellorData.date}
                  onChange={(e) => setCounsellorData({...counsellorData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="counsellor-time">Preferred Time *</Label>
                <Input 
                  id="counsellor-time" 
                  type="time" 
                  value={counsellorData.time}
                  onChange={(e) => setCounsellorData({...counsellorData, time: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level *</Label>
              <Select value={counsellorData.urgency} onValueChange={(value) => setCounsellorData({...counsellorData, urgency: value})}>
                <SelectTrigger id="urgency">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brief Description of Concern</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the concern or reason for consultation..."
                value={counsellorData.description}
                onChange={(e) => setCounsellorData({...counsellorData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred-counsellor">Preferred Counsellor (Optional)</Label>
              <Input 
                id="preferred-counsellor" 
                placeholder="Enter counsellor name"
                value={counsellorData.preferredCounsellor}
                onChange={(e) => setCounsellorData({...counsellorData, preferredCounsellor: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleCounsellorSubmit}>Book Session</Button>
            </div>
          </TabsContent>

          <TabsContent value="psychologist" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="psychologist-student">Student Name *</Label>
              <Select value={psychologistData.studentId} onValueChange={(value) => setPsychologistData({...psychologistData, studentId: value})}>
                <SelectTrigger id="psychologist-student">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map(student => (
                    <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-type">Session Type *</Label>
              <Select value={psychologistData.sessionType} onValueChange={(value) => setPsychologistData({...psychologistData, sessionType: value})}>
                <SelectTrigger id="session-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial Assessment</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="crisis">Crisis Intervention</SelectItem>
                  <SelectItem value="psychoeducational">Psychoeducational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="psychologist-date">Preferred Date *</Label>
                <Input 
                  id="psychologist-date" 
                  type="date" 
                  value={psychologistData.date}
                  onChange={(e) => setPsychologistData({...psychologistData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="psychologist-time">Preferred Time *</Label>
                <Input 
                  id="psychologist-time" 
                  type="time" 
                  value={psychologistData.time}
                  onChange={(e) => setPsychologistData({...psychologistData, time: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral-reason">Referral Reason *</Label>
              <Textarea 
                id="referral-reason" 
                placeholder="Describe the reason for psychological assessment..."
                value={psychologistData.referralReason}
                onChange={(e) => setPsychologistData({...psychologistData, referralReason: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk-level">Risk Level *</Label>
              <Select value={psychologistData.riskLevel} onValueChange={(value) => setPsychologistData({...psychologistData, riskLevel: value})}>
                <SelectTrigger id="risk-level">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="consent" 
                checked={psychologistData.consentGiven}
                onCheckedChange={(checked) => setPsychologistData({...psychologistData, consentGiven: checked as boolean})}
              />
              <Label htmlFor="consent" className="text-sm font-normal">
                Parent/Guardian consent has been obtained *
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previous-assessments">Previous Assessments (if any)</Label>
              <Textarea 
                id="previous-assessments" 
                placeholder="List any previous psychological assessments or interventions..."
                value={psychologistData.previousAssessments}
                onChange={(e) => setPsychologistData({...psychologistData, previousAssessments: e.target.value})}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handlePsychologistSubmit}>Book Session</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
