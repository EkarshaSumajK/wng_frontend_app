import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSchoolDashboard } from '@/hooks/useSchoolAdmin';
import { Loader2 } from 'lucide-react';

export default function GradeDetailPage() {
  const { grade } = useParams<{ grade: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useSchoolDashboard(user?.school_id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const classMetrics = (dashboardData as any)?.class_metrics || [];
  const sectionsInGrade = classMetrics.filter((cls: any) => {
    const className = cls.name || '';
    return className.startsWith(`Grade ${grade}`);
  });

  const totalStudents = sectionsInGrade.reduce((sum: number, cls: any) => sum + (cls.totalStudents || 0), 0);
  const totalAtRisk = sectionsInGrade.reduce((sum: number, cls: any) => sum + (cls.atRiskCount || 0), 0);
  const avgWellbeing = sectionsInGrade.length > 0
    ? (sectionsInGrade.reduce((sum: number, cls: any) => sum + (cls.wellbeingIndex || 0), 0) / sectionsInGrade.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/leadership/grade-analysis')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Grade Analysis
          </Button>
          <h1 className="text-3xl font-semibold text-foreground">Grade {grade} Overview</h1>
          <p className="text-muted-foreground">{sectionsInGrade.length} sections • {totalStudents} students</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {sectionsInGrade.length} sections
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk Students</CardTitle>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAtRisk}</div>
            <p className="text-xs text-muted-foreground">
              {totalStudents > 0 ? ((totalAtRisk / totalStudents) * 100).toFixed(1) : 0}% of grade
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wellbeing</CardTitle>
            <TrendingUp className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWellbeing}</div>
            <p className="text-xs text-muted-foreground">
              Grade average score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sections List */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle>Sections in Grade {grade}</CardTitle>
          <CardDescription>Click on a section to view student details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sectionsInGrade.length > 0 ? (
            sectionsInGrade.map((section: any) => (
              <div
                key={section.id}
                onClick={() => navigate(`/leadership/section/${section.id}`)}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-foreground">{section.name}</h3>
                    <Badge variant="outline">{section.totalStudents || 0} students</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Teacher: {section.teacher || 'Not assigned'}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Wellbeing</p>
                    <p className="font-medium text-lg">{section.wellbeingIndex || 'N/A'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">At Risk</p>
                    <p className="font-medium text-lg">{section.atRiskCount || 0}</p>
                  </div>
                  <Badge
                    variant={
                      section.atRiskCount > 3
                        ? 'destructive'
                        : section.atRiskCount > 0
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {section.atRiskCount === 0
                      ? 'Good'
                      : section.atRiskCount > 3
                      ? 'Needs Attention'
                      : 'Monitor'}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No sections found for Grade {grade}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
