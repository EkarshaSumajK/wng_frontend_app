import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateActivity, useUpdateActivity } from '@/hooks/useActivities';

interface CreateActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity?: any;
}

const activityTypes = [
  { value: 'MINDFULNESS', label: 'Mindfulness' },
  { value: 'SOCIAL_SKILLS', label: 'Social Skills' },
  { value: 'EMOTIONAL_REGULATION', label: 'Emotional Regulation' },
  { value: 'ACADEMIC_SUPPORT', label: 'Academic Support' },
  { value: 'TEAM_BUILDING', label: 'Team Building' },
];

const gradeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export function CreateActivityModal({ open, onOpenChange, activity }: CreateActivityModalProps) {
  const { user } = useAuth();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'MINDFULNESS',
    duration: '',
    target_grades: [] as string[],
    materials: [] as string[],
    instructions: [] as string[],
    objectives: [] as string[],
  });

  const [newMaterial, setNewMaterial] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [newObjective, setNewObjective] = useState('');

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || '',
        description: activity.description || '',
        type: activity.type || 'MINDFULNESS',
        duration: activity.duration?.toString() || '',
        target_grades: activity.target_grades || [],
        materials: activity.materials || [],
        instructions: activity.instructions || [],
        objectives: activity.objectives || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'MINDFULNESS',
        duration: '',
        target_grades: [],
        materials: [],
        instructions: [],
        objectives: [],
      });
    }
  }, [activity, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      school_id: user?.school_id,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      type: formData.type as any,
    };

    if (activity) {
      await updateActivity.mutateAsync({
        id: activity.activity_id,
        data,
      });
    } else {
      await createActivity.mutateAsync(data as any);
    }

    onOpenChange(false);
  };

  const addItem = (type: 'materials' | 'instructions' | 'objectives', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()],
      }));
      if (type === 'materials') setNewMaterial('');
      if (type === 'instructions') setNewInstruction('');
      if (type === 'objectives') setNewObjective('');
    }
  };

  const removeItem = (type: 'materials' | 'instructions' | 'objectives', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const toggleGrade = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      target_grades: prev.target_grades.includes(grade)
        ? prev.target_grades.filter(g => g !== grade)
        : [...prev.target_grades, grade],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{activity ? 'Edit Activity' : 'Create New Activity'}</DialogTitle>
          <DialogDescription>
            {activity ? 'Update the activity details below' : 'Fill in the details to create a new wellbeing activity'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Mindful Breathing Exercise"
              required
            />
          </div>

          {/* Type and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Activity Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="30"
                min="1"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the activity..."
              rows={3}
            />
          </div>

          {/* Target Grades */}
          <div className="space-y-2">
            <Label>Target Grades</Label>
            <div className="flex flex-wrap gap-2">
              {gradeOptions.map(grade => (
                <Badge
                  key={grade}
                  variant={formData.target_grades.includes(grade) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleGrade(grade)}
                >
                  Grade {grade}
                </Badge>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <Label>Learning Objectives</Label>
            <div className="flex gap-2">
              <Input
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Add an objective..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('objectives', newObjective);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem('objectives', newObjective)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.objectives.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="flex-1 text-sm">{obj}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem('objectives', idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Materials */}
          <div className="space-y-2">
            <Label>Materials Needed</Label>
            <div className="flex gap-2">
              <Input
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Add a material..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('materials', newMaterial);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem('materials', newMaterial)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.materials.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.materials.map((material, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="flex-1 text-sm">{material}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem('materials', idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label>Instructions</Label>
            <div className="flex gap-2">
              <Input
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                placeholder="Add an instruction step..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('instructions', newInstruction);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem('instructions', newInstruction)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.instructions.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.instructions.map((instruction, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="text-xs text-muted-foreground mr-2">{idx + 1}.</span>
                    <span className="flex-1 text-sm">{instruction}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem('instructions', idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {activity ? 'Update Activity' : 'Create Activity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
