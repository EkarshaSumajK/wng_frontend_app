import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Eye, MessageSquare, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface AddObservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (observationData: any) => void;
  preselectedStudent?: {
    id: string;
    name: string;
  };
}

export function AddObservationModal({ open, onOpenChange, onSubmit, preselectedStudent }: AddObservationModalProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    date: new Date().toISOString().split('T')[0],
    context: '',
    behavior: '',
    triggers: '',
    interventions: '',
    outcome: '',
    followUpNeeded: false,
    shareWithCounsellor: false
  });

  // Update form when preselectedStudent changes or modal opens
  useEffect(() => {
    if (open && preselectedStudent) {
      setFormData(prev => ({
        ...prev,
        studentId: preselectedStudent.id,
        studentName: preselectedStudent.name
      }));
    } else if (!open) {
      // Reset form when modal closes
      setFormData({
        studentId: '',
        studentName: '',
        date: new Date().toISOString().split('T')[0],
        context: '',
        behavior: '',
        triggers: '',
        interventions: '',
        outcome: '',
        followUpNeeded: false,
        shareWithCounsellor: false
      });
    }
  }, [open, preselectedStudent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine all observation details into content field for API
    const content = `
Context: ${formData.context}

Observed Behavior:
${formData.behavior}

${formData.triggers ? `Potential Triggers:\n${formData.triggers}\n\n` : ''}${formData.interventions ? `Interventions Used:\n${formData.interventions}\n\n` : ''}${formData.outcome ? `Outcome:\n${formData.outcome}` : ''}
    `.trim();
    
    onSubmit({
      ...formData,
      behavior_description: content, // For backward compatibility
      content: content // For API
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Eye className="w-6 h-6 text-primary" />
            Add Student Observation
          </DialogTitle>
          <DialogDescription>
            Record a behavioral observation to track student wellbeing and identify patterns. This information helps counsellors provide better support.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information - Highlighted when pre-selected */}
          {preselectedStudent && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium text-primary mb-2">Observation for:</p>
              <p className="text-lg font-semibold">{formData.studentName}</p>
              <p className="text-sm text-muted-foreground font-mono">{formData.studentId?.slice(0, 8)}</p>
            </div>
          )}
          
          {!preselectedStudent && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  placeholder="e.g., s123"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  placeholder="Full name"
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  required
                />
              </div>
            </div>
          )}
          
          {/* Observation Details */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Observation Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="context">Context/Setting *</Label>
                <Input
                  id="context"
                  placeholder="e.g., Math class, Recess, Lunch"
                  value={formData.context}
                  onChange={(e) => setFormData({...formData, context: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="behavior">What did you observe? *</Label>
              <Textarea
                id="behavior"
                placeholder="Describe the specific behavior, actions, or concerns you observed..."
                value={formData.behavior}
                onChange={(e) => setFormData({...formData, behavior: e.target.value})}
                required
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">Be specific and objective. Focus on observable behaviors.</p>
            </div>
          </div>
          
          {/* Additional Details - Collapsible/Optional */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Additional Information (Optional)</h3>
            
            <div className="space-y-2">
              <Label htmlFor="triggers">Possible Triggers or Context</Label>
              <Textarea
                id="triggers"
                placeholder="What might have contributed to this behavior? (e.g., peer interaction, assignment difficulty, time of day)"
                value={formData.triggers}
                onChange={(e) => setFormData({...formData, triggers: e.target.value})}
                rows={2}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interventions">Your Response/Intervention</Label>
              <Textarea
                id="interventions"
                placeholder="What actions did you take? (e.g., redirected student, provided break, spoke privately)"
                value={formData.interventions}
                onChange={(e) => setFormData({...formData, interventions: e.target.value})}
                rows={2}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome/Result</Label>
              <Textarea
                id="outcome"
                placeholder="How did the student respond? What was the result of your intervention?"
                value={formData.outcome}
                onChange={(e) => setFormData({...formData, outcome: e.target.value})}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
          
          {/* Action Flags */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Action Required</h3>
            
            <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Switch
                  id="followUpNeeded"
                  checked={formData.followUpNeeded}
                  onCheckedChange={(checked) => setFormData({...formData, followUpNeeded: checked})}
                />
                <div className="flex-1">
                  <Label htmlFor="followUpNeeded" className="cursor-pointer font-medium">
                    Follow-up needed
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check this if you plan to monitor or address this behavior again
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Switch
                  id="shareWithCounsellor"
                  checked={formData.shareWithCounsellor}
                  onCheckedChange={(checked) => setFormData({...formData, shareWithCounsellor: checked})}
                />
                <div className="flex-1">
                  <Label htmlFor="shareWithCounsellor" className="cursor-pointer font-medium">
                    Share with school counsellor
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Notify the counsellor about this observation for potential intervention
                  </p>
                </div>
              </div>
            </div>
            
            {(formData.followUpNeeded || formData.shareWithCounsellor) && (
              <div className="flex items-center gap-2 text-sm p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                <p className="text-amber-800 dark:text-amber-200">
                  This observation will be marked as {formData.followUpNeeded && formData.shareWithCounsellor ? 'HIGH' : 'MEDIUM'} priority
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
              <Eye className="w-4 h-4 mr-2" />
              Save Observation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}