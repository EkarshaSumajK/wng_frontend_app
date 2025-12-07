import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ClipboardList, CheckCircle, FileText, Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface AssessmentTemplateDetailModalProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  onCreateAssessment?: (templateId: string, classId?: string) => void;
  readOnly?: boolean;
  classes?: any[];
}

export function AssessmentTemplateDetailModal({
  template,
  isOpen,
  onClose,
  onCreateAssessment,
  readOnly = false,
  classes = []
}: AssessmentTemplateDetailModalProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  if (!template) return null;

  const questions = template.questions || [];
  const questionTypeBreakdown = questions.reduce((acc: any, q: any) => {
    const type = q.question_type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const handleCreateAssessment = () => {
    if (onCreateAssessment && template.template_id) {
      onCreateAssessment(template.template_id, selectedClassId);
      onClose();
    }
  };

  const renderAnswerOptions = (question: any) => {
    const questionType = question.question_type?.toLowerCase();

    // For scale/rating questions
    if (questionType === 'rating_scale' || questionType === 'scale') {
      const minValue = question.min_value || 0;
      const maxValue = question.max_value || 10;
      const range = maxValue - minValue + 1;
      const scalePoints = Array.from({ length: range }, (_, i) => minValue + i);

      return (
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <span>Scale Range</span>
            <span className="text-primary font-bold">{minValue} - {maxValue}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {scalePoints.map((value) => (
              <div
                key={value}
                className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all"
              >
                <span className="text-base font-bold text-primary">{value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // For multiple choice questions
    if (question.answer_options && question.answer_options.length > 0) {
      return (
        <div className="space-y-3 mt-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Answer Options
          </p>
          <div className="space-y-2">
            {question.answer_options.map((option: any, optIndex: number) => (
              <div
                key={option.option_id || optIndex}
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border hover:border-primary/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-card dark:bg-card shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-sm font-bold text-primary">{optIndex + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{option.text}</p>
                </div>
                {option.value !== undefined && (
                  <Badge variant="secondary" className="text-xs font-semibold">
                    Score: {option.value}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const getQuestionTypeIcon = (type: string) => {
    const lowerType = type?.toLowerCase() || '';
    if (lowerType.includes('scale') || lowerType.includes('rating')) {
      return '📊';
    }
    if (lowerType.includes('choice') || lowerType.includes('multiple')) {
      return '☑️';
    }
    if (lowerType.includes('text')) {
      return '📝';
    }
    return '❓';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Enhanced Header */}
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold">{template.name}</DialogTitle>
                  {template.category && (
                    <p className="text-sm text-muted-foreground capitalize mt-1">
                      {template.category} Assessment
                    </p>
                  )}
                </div>
              </div>
              {template.description && (
                <DialogDescription className="text-base leading-relaxed pl-15">
                  {template.description}
                </DialogDescription>
              )}
            </div>
            <div className="flex gap-2">
              {template.is_active && (
                <Badge className="bg-green-500 text-white shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <Card className="border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{questions.length}</div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mt-1">Total Questions</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-100 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950 dark:to-transparent">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  {questions.filter((q: any) => q.required).length}
                </div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mt-1">Required</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-100 dark:border-green-900 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950 dark:to-transparent">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {Object.keys(questionTypeBreakdown).length}
                </div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300 mt-1">Question Types</p>
              </CardContent>
            </Card>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Enhanced Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between sticky top-0 bg-background py-2 z-10">
            <h3 className="text-xl font-bold">Assessment Questions</h3>
            <Badge variant="secondary" className="text-sm px-3 py-1">{questions.length} Questions</Badge>
          </div>

          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question: any, index: number) => (
                <Card key={question.question_id || index} className="border-2 shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent pb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md flex-shrink-0">
                          <span className="text-lg font-bold text-white">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold leading-tight mb-2">
                            {question.question_text}
                          </CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs font-semibold">
                              <span className="mr-1">{getQuestionTypeIcon(question.question_type)}</span>
                              {question.question_type?.replace(/_/g, ' ')}
                            </Badge>
                            {question.required && (
                              <Badge className="bg-red-500 text-white text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4">
                    {renderAnswerOptions(question)}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="py-16 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No questions available</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enhanced Actions */}
        <div className="flex justify-between items-center gap-3 mt-6 pt-6 border-t-2">
          {readOnly && (
            <div className="flex-1 px-4 py-3 bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Teacher View:</strong> You can review this template but cannot create assessments. Contact your counsellor to assign this assessment.
              </p>
            </div>
          )}
          <div className="flex gap-3 ml-auto items-center">
            {!readOnly && onCreateAssessment && classes && classes.length > 0 && (
              <div className="flex items-center gap-2 mr-2">
                <Label htmlFor="class-select" className="whitespace-nowrap">Assign to Class:</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger className="w-[200px]" id="class-select">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.class_id} value={cls.class_id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button variant="outline" onClick={onClose} size="lg">
              Close
            </Button>
            {!readOnly && onCreateAssessment && (
              <Button 
                onClick={handleCreateAssessment} 
                size="lg" 
                className="shadow-lg"
                disabled={classes && classes.length > 0 && !selectedClassId}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Assessment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
