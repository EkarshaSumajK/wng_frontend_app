import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target } from 'lucide-react';

interface AddGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (goalData: any) => void;
  initialData?: {
    title: string;
    description: string;
    targetDate: string;
    progress: number;
  };
  isEditing?: boolean;
}

export function AddGoalModal({ open, onOpenChange, onSubmit, initialData, isEditing = false }: AddGoalModalProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    targetDate: initialData?.targetDate || '',
    progress: initialData?.progress || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      targetDate: '',
      progress: 0
    });
    onOpenChange(false);
  };

  // Update form data when initialData changes or modal opens
  useEffect(() => {
    if (open && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        targetDate: initialData.targetDate || '',
        progress: initialData.progress || 0
      });
    } else if (!open) {
      // Reset form when modal closes
      setFormData({
        title: '',
        description: '',
        targetDate: '',
        progress: 0
      });
    }
  }, [initialData, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {isEditing ? 'Edit Treatment Goal' : 'Add Treatment Goal'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the goal details below.'
              : 'Set a specific, measurable goal for this student\'s treatment plan.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="e.g., Reduce anxiety symptoms during presentations"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of what success looks like and how progress will be measured..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="progress">Initial Progress (%)</Label>
            <Input
              id="progress"
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={formData.progress}
              onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
              {isEditing ? 'Update Goal' : 'Add Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}