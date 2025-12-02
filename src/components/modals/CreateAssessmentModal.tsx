import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CreateAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (assessmentData: any) => void;
  classes?: Array<{ class_id: string; name: string }>;
}

interface Question {
  id: string;
  question: string;
  type: string;
  required: boolean;
  options?: string[];
  scaleRange?: { min: number; max: number; labels?: string[] };
}

export function CreateAssessmentModal({ open, onOpenChange, onSubmit, classes = [] }: CreateAssessmentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    classId: '',
    targetGrades: [] as string[],
    estimatedTime: '',
    questions: [] as Question[]
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    question: '',
    type: '',
    required: false,
    options: ['']
  });

  const addQuestion = () => {
    if (currentQuestion.question && currentQuestion.type) {
      const newQuestion = {
        ...currentQuestion,
        id: `q${Date.now()}`,
        options: currentQuestion.type === 'multiple-choice' ? currentQuestion.options?.filter(o => o.trim()) : undefined,
        scaleRange: currentQuestion.type === 'scale' ? { min: 1, max: 5 } : undefined
      };
      setFormData({
        ...formData,
        questions: [...formData.questions, newQuestion]
      });
      setCurrentQuestion({
        id: '',
        question: '',
        type: '',
        required: false,
        options: ['']
      });
    }
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...(currentQuestion.options || []), '']
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const removeOption = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options?.filter((_, i) => i !== index) || []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      type: '',
      classId: '',
      targetGrades: [],
      estimatedTime: '',
      questions: []
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create Assessment
          </DialogTitle>
          <DialogDescription>
            Build a comprehensive assessment with custom questions for student wellbeing evaluation.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assessment Title</Label>
              <Input
                id="title"
                placeholder="e.g., Weekly Wellbeing Check"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the assessment purpose and scope..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Assessment Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wellbeing">Wellbeing</SelectItem>
                    <SelectItem value="risk">Risk Assessment</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Duration (minutes)</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  placeholder="15"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">Assign to Class (Optional)</Label>
              <Select value={formData.classId || undefined} onValueChange={(value) => setFormData({...formData, classId: value === 'school-wide' ? '' : value})}>
                <SelectTrigger>
                  <SelectValue placeholder="School-wide (all classes)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school-wide">School-wide (all classes)</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.class_id} value={cls.class_id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-semibold">Questions ({formData.questions.length})</h3>
            
            {formData.questions.map((question, index) => (
              <div key={question.id} className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{question.type}</Badge>
                      {question.required && <Badge variant="secondary">Required</Badge>}
                    </div>
                    <p className="font-medium">{question.question}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="p-4 border-2 border-dashed rounded-lg space-y-4">
              <h4 className="font-medium">Add New Question</h4>
              
              <div className="space-y-2">
                <Label htmlFor="questionText">Question</Label>
                <Textarea
                  id="questionText"
                  placeholder="Enter your question here..."
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select 
                    value={currentQuestion.type} 
                    onValueChange={(value) => setCurrentQuestion({...currentQuestion, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="scale">Rating Scale</SelectItem>
                      <SelectItem value="yes-no">Yes/No</SelectItem>
                      <SelectItem value="text">Open Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 mt-7">
                  <input
                    type="checkbox"
                    id="required"
                    checked={currentQuestion.required}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, required: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="required">Required question</Label>
                </div>
              </div>
              
              {currentQuestion.type === 'multiple-choice' && (
                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              )}
              
              <Button type="button" onClick={addQuestion} disabled={!currentQuestion.question || !currentQuestion.type}>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover" disabled={formData.questions.length === 0}>
              Create Assessment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}