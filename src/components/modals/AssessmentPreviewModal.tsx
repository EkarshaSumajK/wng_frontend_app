import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssessmentTemplate } from "@/types";
import { Clock, Target, FileText, CheckCircle } from "lucide-react";

interface AssessmentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: AssessmentTemplate | null;
}

export function AssessmentPreviewModal({ open, onOpenChange, assessment }: AssessmentPreviewModalProps) {
  if (!assessment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>{assessment.title}</DialogTitle>
          <DialogDescription>{assessment.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Badge variant="outline" className="mb-2">{assessment.category}</Badge>
              <p className="text-xs text-muted-foreground">Category</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">{assessment.duration} min</span>
              </div>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <FileText className="w-4 h-4" />
                <span className="font-semibold">{assessment.itemsCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Items</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Target className="w-4 h-4" />
                <span className="font-semibold">{assessment.targetGrades.join(', ')}</span>
              </div>
              <p className="text-xs text-muted-foreground">Grades</p>
            </div>
          </div>

          {/* Assessment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Focus Area:</p>
                <p className="text-sm text-muted-foreground">{assessment.focus}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Format:</p>
                <p className="text-sm text-muted-foreground">{assessment.format}</p>
              </div>
              {assessment.lastUsed && (
                <div>
                  <p className="text-sm font-medium mb-1">Last Used:</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(assessment.lastUsed).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Structured Observations</p>
                    <p className="text-xs text-muted-foreground">Teacher-rated items based on classroom behavior and interactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Rating Scales</p>
                    <p className="text-xs text-muted-foreground">Standardized scales for consistent assessment across students</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Scoring Rubric</p>
                    <p className="text-xs text-muted-foreground">Clear guidelines for interpretation and follow-up actions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Review all items before beginning the assessment</li>
                <li>Observe student behavior in natural classroom settings</li>
                <li>Complete rating scales based on recent observations (last 1-2 weeks)</li>
                <li>Score according to provided rubric</li>
                <li>Review results and identify areas requiring intervention</li>
                <li>Share findings with counsellor if indicated</li>
              </ol>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button>Use Template</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
