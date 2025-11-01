import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (noteData: any) => void;
  initialData?: {
    date: string;
    duration: string;
    type: string;
    summary: string;
    interventions: string;
    nextSteps: string;
  };
  isEditing?: boolean;
}

export function AddNoteModal({ open, onOpenChange, onSubmit, initialData, isEditing = false }: AddNoteModalProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    duration: initialData?.duration || '',
    type: initialData?.type || '',
    summary: initialData?.summary || '',
    interventions: initialData?.interventions || '',
    nextSteps: initialData?.nextSteps || '',
    attachments: [] as File[]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || new Date().toISOString().split('T')[0],
        duration: initialData.duration || '',
        type: initialData.type || '',
        summary: initialData.summary || '',
        interventions: initialData.interventions || '',
        nextSteps: initialData.nextSteps || '',
        attachments: []
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        duration: '',
        type: '',
        summary: '',
        interventions: '',
        nextSteps: '',
        attachments: []
      });
    }
  }, [initialData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...Array.from(e.target.files)]
      });
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: newAttachments });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const noteData = {
      ...formData,
      interventions: formData.interventions.split(',').map(s => s.trim()),
      nextSteps: formData.nextSteps.split('\n').filter(s => s.trim())
    };
    onSubmit(noteData);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      duration: '',
      type: '',
      summary: '',
      interventions: '',
      nextSteps: '',
      attachments: []
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {isEditing ? 'Edit Session Note' : 'Add Session Note'}
          </DialogTitle>
          <DialogDescription>
            Record details of a counseling session including interventions and follow-up actions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Session Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="45"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Session Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INDIVIDUAL">Individual Counseling</SelectItem>
                <SelectItem value="GROUP">Group Session</SelectItem>
                <SelectItem value="ASSESSMENT">Assessment</SelectItem>
                <SelectItem value="CONSULTATION">Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary">Session Summary</Label>
            <Textarea
              id="summary"
              placeholder="Describe what was covered in the session, student's presentation, key topics discussed..."
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interventions">Interventions Used</Label>
            <Input
              id="interventions"
              placeholder="e.g., CBT techniques, mindfulness, role-playing (separated by commas)"
              value={formData.interventions}
              onChange={(e) => setFormData({...formData, interventions: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nextSteps">Next Steps</Label>
            <Textarea
              id="nextSteps"
              placeholder="Action items and follow-up plans (one per line)"
              value={formData.nextSteps}
              onChange={(e) => setFormData({...formData, nextSteps: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('attachments')?.click()}
                className="w-full justify-start"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </div>
            
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
              {isEditing ? 'Update Note' : 'Add Note'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}