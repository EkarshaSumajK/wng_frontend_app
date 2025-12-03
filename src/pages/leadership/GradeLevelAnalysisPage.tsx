import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricChart } from "@/components/shared/MetricChart";
import { useAuth } from "@/contexts/AuthContext";
import { useGradeLevelAnalysis, useSchoolDashboard } from "@/hooks/useSchoolAdmin";
import { LoadingState } from '@/components/shared/LoadingState';

export default function GradeLevelAnalysisPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useGradeLevelAnalysis(user?.school_id);
  const { data: dashboardData, isLoading: isDashboardLoading } = useSchoolDashboard(user?.school_id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Loading grades..." />
      </div>
    );
  }

  const gradeLevels = (data as any)?.grade_levels || [];
  const classMetrics = (dashboardData as any)?.class_metrics || [];
  
  // Prepare class comparison data
  const classComparisonData = classMetrics.map((cls: any) => ({
    name: cls.name,
    wellbeing: cls.wellbeingIndex,
    atRisk: cls.atRiskCount,
    totalStudents: cls.totalStudents || 0
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Grade Level Analysis</h1>
        <p className="text-muted-foreground">Mental health metrics broken down by grade level</p>
      </div>

      {/* Grade Level Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gradeLevels.map((grade: any) => (
          <Card 
            key={grade.grade} 
            className="card-professional cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/leadership/grade/${grade.grade}`)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Grade {grade.grade}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{grade.total_classes} classes</Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardTitle>
              <CardDescription>
                {grade.total_students} students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Active Cases */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">Active Cases</span>
                  </div>
                  <span className="text-sm font-bold">{grade.active_cases}</span>
                </div>
                <Progress value={grade.case_rate_percent} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {grade.case_rate_percent}% of students
                </p>
              </div>

              {/* Recent Observations */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Recent Observations</span>
                  </div>
                  <span className="text-sm font-bold">{grade.observations}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 30 days
                </p>
              </div>

              {/* Risk Indicator */}
              <div className="pt-2 border-t">
                {grade.case_rate_percent > 15 ? (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-medium">High risk level - requires attention</span>
                  </div>
                ) : grade.case_rate_percent > 8 ? (
                  <div className="flex items-center gap-2 text-warning">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-medium">Moderate risk level - monitor closely</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-success">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Normal risk level</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {gradeLevels.length === 0 && (
        <Card className="card-professional">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No grade level data available</p>
          </CardContent>
        </Card>
      )}

      {/* Class-by-Class Comparison */}
      {classComparisonData.length > 0 && (
        <Card className="card-professional">
          <CardHeader>
            <CardTitle>Class-by-Class Comparison</CardTitle>
            <CardDescription>
              Wellbeing metrics and at-risk student counts across all classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetricChart
              title=""
              data={classComparisonData}
              type="bar"
              xKey="name"
              yKey="wellbeing"
              height={400}
            />
            
            {/* Class Details Table */}
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">Detailed Breakdown - Click to view students</h3>
              {classMetrics.map((cls: any) => (
                <div 
                  key={cls.id} 
                  onClick={() => navigate(`/leadership/section/${cls.id}`)}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{cls.name}</span>
                      <span className="text-sm text-muted-foreground">
                        Teacher: {cls.teacher}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Students</p>
                      <p className="font-medium">{cls.totalStudents || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Wellbeing</p>
                      <p className="font-medium">{cls.wellbeingIndex}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">At Risk</p>
                      <p className="font-medium">{cls.atRiskCount}</p>
                    </div>
                    <Badge variant={cls.atRiskCount > 3 ? 'destructive' : cls.atRiskCount > 0 ? 'secondary' : 'default'}>
                      {cls.atRiskCount === 0 ? 'Good' : cls.atRiskCount > 3 ? 'Needs Attention' : 'Monitor'}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
