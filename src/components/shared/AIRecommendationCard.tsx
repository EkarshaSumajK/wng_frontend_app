import { Brain, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIRecommendation } from "@/types";

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  onAccept?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
}

export function AIRecommendationCard({ 
  recommendation, 
  onAccept, 
  onDismiss,
  compact = false 
}: AIRecommendationCardProps) {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'ai-confidence-high';
      case 'medium':
        return 'ai-confidence-medium';
      case 'low':
        return 'ai-confidence-low';
      default:
        return 'ai-confidence-medium';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-4 h-4" />;
      case 'intervention':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  if (compact) {
    return (
      <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getTypeIcon(recommendation.type)}
            <Badge variant="outline" className={getConfidenceColor(recommendation.confidence)}>
              {recommendation.confidence} confidence
            </Badge>
          </div>
          
          <p className="text-sm font-medium text-foreground mb-1">
            {recommendation.recommendation}
          </p>
          
          <p className="text-xs text-muted-foreground">
            {recommendation.rationale}
          </p>
          
          {(onAccept || onDismiss) && (
            <div className="flex gap-2 mt-3">
              {onAccept && (
                <Button size="sm" variant="default" onClick={onAccept}>
                  Accept
                </Button>
              )}
              {onDismiss && (
                <Button size="sm" variant="outline" onClick={onDismiss}>
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="card-professional">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            AI Recommendation
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {getTypeIcon(recommendation.type)}
            <Badge 
              variant="outline" 
              className={getConfidenceColor(recommendation.confidence)}
            >
              {recommendation.confidence} confidence
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Recommendation</h4>
          <p className="text-sm text-foreground">{recommendation.recommendation}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-foreground mb-2">Rationale</h4>
          <p className="text-sm text-muted-foreground">{recommendation.rationale}</p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>Model: {recommendation.modelVersion}</p>
            <p>Generated: {new Date(recommendation.createdAt).toLocaleString()}</p>
          </div>
          
          {(onAccept || onDismiss) && (
            <div className="flex gap-2">
              {onDismiss && (
                <Button variant="outline" onClick={onDismiss}>
                  Dismiss
                </Button>
              )}
              {onAccept && (
                <Button onClick={onAccept}>
                  Accept Recommendation
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}