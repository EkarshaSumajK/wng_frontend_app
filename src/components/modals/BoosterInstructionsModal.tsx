import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DailyBooster } from "@/types";
import { Clock, Target, Lightbulb, CheckCircle } from "lucide-react";

interface BoosterInstructionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booster: DailyBooster | null;
}

export function BoosterInstructionsModal({ open, onOpenChange, booster }: BoosterInstructionsModalProps) {
  if (!booster) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return '📖';
      case 'puzzle': return '🧩';
      case 'movement': return '🏃';
      default: return '✨';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{getTypeIcon(booster.type)}</span>
            {booster.title}
          </DialogTitle>
          <DialogDescription>{booster.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Info */}
          <div className="flex gap-3 flex-wrap">
            <Badge variant="outline" className="capitalize">{booster.type}</Badge>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4" />
              <span>{booster.duration} minutes</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Target className="w-4 h-4" />
              <span>Grades {booster.targetGrades.join(', ')}</span>
            </div>
            <Badge variant="secondary" className="capitalize">{booster.difficulty}</Badge>
          </div>

          {/* Purpose */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Purpose</p>
                  <p className="text-sm text-muted-foreground">{booster.purpose}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Materials (if any) */}
          {booster.materials && booster.materials.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Materials Needed
              </h3>
              <div className="flex flex-wrap gap-2">
                {booster.materials.map((material, index) => (
                  <Badge key={index} variant="outline">{material}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Full Instructions */}
          <div>
            <h3 className="font-semibold mb-3">Step-by-Step Instructions</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {booster.fullInstructions}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-sm mb-2">💡 Tips for Success</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Set a positive, welcoming tone before starting</li>
                <li>• Adjust pacing based on student engagement</li>
                <li>• Encourage participation but don't force it</li>
                <li>• Keep the atmosphere light and enjoyable</li>
                <li>• Use these regularly for best results</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm">
              Print Instructions
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button>Mark as Used</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
