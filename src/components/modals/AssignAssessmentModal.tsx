import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useAssessmentTemplates } from '@/hooks/useAssessments';

interface AssignAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (assessmentData: any) => void;
  schoolId: string;
  studentId?: string;
  classId?: string;
}

export function AssignAssessmentModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  schoolId,
  studentId,
  classId 
}: AssignAssessmentModalProps) {
  const [formData, setFormData] = useState({
    template_id: '',
    title: '',
    notes: ''
  });

  const { data: templates = [], isLoading: loadingTemplates } = useAssessmentTemplates({ is_active: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected template to get its name
    const selectedTemplate = templates.find((t: any) => t.template_id === formData.template_id);
    
    onSubmit({
      template_id: formData.template_id,
      school_id: schoolId,
      class_id: classId,
      title: formData.title || selectedTemplate?.name,
      notes: formData.notes || undefined,
      created_by: schoolId // This will be overridden in the parent component
    });
    setFormData({
      template_id: '',
      title: '',
      notes: ''
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Assign Assessment
          </DialogTitle>
          <DialogDescription>
            Select an assessment template to assign. The assessment will be available for the student to complete.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template">Assessment Template *</Label>
            <Select 
              value={formData.template_id} 
              onValueChange={(value) => setFormData({...formData, template_id: value})}
              required
              disabled={loadingTemplates}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  loadingTemplates 
                    ? "Loading templates..." 
                    : templates.length === 0 
                      ? "No templates available" 
                      : "Select assessment template"
                } />
              </SelectTrigger>
              <SelectContent>
                {templates.length === 0 && !loadingTemplates ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No assessment templates available
                  </div>
                ) : (
                  templates.map((template: any) => (
                    <SelectItem key={template.template_id} value={template.template_id}>
                      {template.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {templates.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {templates.length} template{templates.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              placeholder="e.g., Initial Screening, Follow-up Assessment"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this assessment..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
              Assign Assessment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
