import { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/shared/DataTable';
import { StatCard } from '@/components/shared/StatCard';
import { AIRecommendationCard } from '@/components/shared/AIRecommendationCard';
import { mockAIRecommendations } from '@/data/mockData';
import { AIRecommendation } from '@/types';

export default function AIInsightsPage() {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'ai-confidence-high';
      case 'medium':
        return 'ai-confidence-medium';
      case 'low':
        return 'ai-confidence-low';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'intervention':
        return 'bg-primary text-primary-foreground';
      case 'assessment':
        return 'bg-warning text-warning-foreground';
      case 'referral':
        return 'bg-success text-success-foreground';
      case 'alert':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const recommendationColumns = [
    {
      key: 'type',
      label: 'Type',
      render: (rec: AIRecommendation) => (
        <Badge className={getTypeColor(rec.type)} variant="secondary">
          {rec.type}
        </Badge>
      )
    },
    {
      key: 'confidence',
      label: 'Confidence',
      render: (rec: AIRecommendation) => (
        <Badge className={getConfidenceColor(rec.confidence)} variant="outline">
          {rec.confidence}
        </Badge>
      )
    },
    {
      key: 'recommendation',
      label: 'Recommendation',
      render: (rec: AIRecommendation) => (
        <p className="text-sm line-clamp-2 max-w-md">{rec.recommendation}</p>
      )
    },
    {
      key: 'relatedStudentId',
      label: 'Student',
      render: (rec: AIRecommendation) => (
        <span className="text-sm text-muted-foreground">
          {rec.relatedStudentId ? `Student ${rec.relatedStudentId}` : 'General'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (rec: AIRecommendation) => (
        <span className="text-sm text-muted-foreground">
          {new Date(rec.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'isReviewed',
      label: 'Status',
      render: (rec: AIRecommendation) => (
        rec.isReviewed ? (
          <Badge variant="outline" className="border-success text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Reviewed
          </Badge>
        ) : (
          <Badge variant="outline" className="border-warning text-warning">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      )
    }
  ];

  const recommendationActions = (rec: AIRecommendation) => (
    <div className="flex gap-2">
      {!rec.isReviewed && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-success border-success hover:bg-success hover:text-success-foreground"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Dismiss
          </Button>
        </>
      )}
    </div>
  );

  const pendingRecommendations = mockAIRecommendations.filter(r => !r.isReviewed);
  const reviewedRecommendations = mockAIRecommendations.filter(r => r.isReviewed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">AI Insights</h1>
          <p className="text-muted-foreground">AI-powered recommendations and pattern analysis</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary">
            <Brain className="w-3 h-3 mr-1" />
            WellNest AI v2.3
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Total Insights"
          value={mockAIRecommendations.length}
          icon={Brain}
          subtitle="Generated this month"
        />
        
        <StatCard
          title="Pending Review"
          value={pendingRecommendations.length}
          icon={Clock}
          variant="warning"
          subtitle="Awaiting action"
        />
        
        <StatCard
          title="High Confidence"
          value={mockAIRecommendations.filter(r => r.confidence === 'high').length}
          icon={TrendingUp}
          variant="success"
          subtitle="Reliable insights"
        />
        
        <StatCard
          title="Critical Alerts"
          value={mockAIRecommendations.filter(r => r.type === 'alert').length}
          icon={AlertTriangle}
          variant="destructive"
          subtitle="Urgent attention needed"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="all">All Insights</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {pendingRecommendations.length > 0 ? (
            <div className="space-y-4">
              {pendingRecommendations.map((rec) => (
                <AIRecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onAccept={() => {}}
                  onDismiss={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card className="card-professional">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground">No pending AI recommendations to review.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all">
          <DataTable
            data={mockAIRecommendations}
            columns={recommendationColumns}
            title="All AI Insights"
            searchPlaceholder="Search insights..."
            actions={recommendationActions}
          />
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Behavioral Patterns</CardTitle>
                <CardDescription>AI-identified patterns in student behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Social Withdrawal Pattern</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Detected in 3 students: increasing isolation during lunch periods and group activities.
                  </p>
                  <Badge className="ai-confidence-high" variant="outline">High Confidence</Badge>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Academic Stress Correlation</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Strong correlation between test periods and increased anxiety symptoms in Grade 8 students.
                  </p>
                  <Badge className="ai-confidence-medium" variant="outline">Medium Confidence</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Intervention Effectiveness</CardTitle>
                <CardDescription>AI analysis of intervention outcomes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">CBT Techniques</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    85% success rate in reducing anxiety symptoms when applied consistently over 4+ weeks.
                  </p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Mindfulness Activities</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    72% improvement in emotional regulation scores after implementing daily mindfulness.
                  </p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Risk Predictions</CardTitle>
                <CardDescription>AI forecasting of potential risk escalations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/20 bg-destructive-light/5 rounded-lg">
                  <h4 className="font-medium mb-2 text-destructive">High Risk Prediction</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Alex Thompson: 78% probability of anxiety escalation within next 2 weeks based on current trajectory.
                  </p>
                  <Badge variant="outline" className="border-destructive text-destructive">
                    Immediate Intervention Recommended
                  </Badge>
                </div>
                
                <div className="p-4 border border-warning/20 bg-warning-light/5 rounded-lg">
                  <h4 className="font-medium mb-2 text-warning">Medium Risk Prediction</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sam Chen: 45% probability of social difficulties escalating during upcoming group project period.
                  </p>
                  <Badge variant="outline" className="border-warning text-warning">
                    Monitor Closely
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Positive Outcomes</CardTitle>
                <CardDescription>Predicted improvements and success factors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-success/20 bg-success-light/5 rounded-lg">
                  <h4 className="font-medium mb-2 text-success">Improvement Prediction</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Emma Wilson: 82% probability of continued wellbeing improvement with current support level.
                  </p>
                  <Badge variant="outline" className="border-success text-success">
                    Maintain Current Plan
                  </Badge>
                </div>
                
                <div className="p-4 border border-primary/20 bg-primary-light/5 rounded-lg">
                  <h4 className="font-medium mb-2 text-primary">Readiness Assessment</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Jordan Lee: Ready for reduced intervention frequency based on stability metrics.
                  </p>
                  <Badge variant="outline" className="border-primary text-primary">
                    Consider Stepping Down
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}