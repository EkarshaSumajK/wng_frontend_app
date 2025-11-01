import { useState } from "react";
import { School, TrendingUp, Users, AlertTriangle, FileText, Shield, Loader2, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricChart } from "@/components/shared/MetricChart";
import { useAuth } from "@/contexts/AuthContext";
import { useSchoolDashboard } from "@/hooks/useSchoolAdmin";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";

export default function LeadershipDashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("6months");
  const { data: dashboardData, isLoading: isDashboardLoading } = useSchoolDashboard(user?.school_id);

  if (isDashboardLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const overview = dashboardData.overview;
  const mentalHealth = dashboardData.mental_health_metrics;
  const riskLevels = dashboardData.cases_by_risk_level;
  const assessmentData = dashboardData.assessment_analytics;
  const monthlyTrends = dashboardData.monthly_trends || [];
  const classMetrics = dashboardData.class_metrics || [];

  // Calculate wellbeing index from assessment scores (0-100 scale)
  const wellbeingIndex = assessmentData.average_assessment_score || 0;
  const screeningPercentage = assessmentData.assessment_completion_rate || 0;
  const totalAtRisk = riskLevels.critical + riskLevels.high + riskLevels.medium;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">School Mental Health Overview</h1>
          <p className="text-muted-foreground text-base md:text-lg">Comprehensive insights into student wellbeing across the school</p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          {/* <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px] border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select> */}
          {/* <Button variant="outline" size="lg">
            <Calendar className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="gradient" size="lg">
            <Shield className="w-4 h-4 mr-2" />
            Policy Center
          </Button> */}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="card-professional hover:shadow-xl transition-all duration-300 border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">School Wellbeing Index</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{Math.round(wellbeingIndex)}%</div>
            <Progress value={wellbeingIndex} className="mt-3 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {assessmentData.trend_analysis.trend === 'improving' && (
                <span className="text-success font-semibold">+{assessmentData.trend_analysis.change_percentage}%</span>
              )}
              {assessmentData.trend_analysis.trend === 'declining' && (
                <span className="text-destructive font-semibold">{assessmentData.trend_analysis.change_percentage}%</span>
              )}
              {assessmentData.trend_analysis.trend === 'stable' && (
                <span className="text-muted-foreground font-semibold">Stable</span>
              )}
              {' '}from last period
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Students Screened</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{Math.round(screeningPercentage)}%</div>
            <Progress value={screeningPercentage} className="mt-3 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-semibold">{assessmentData.students_assessed}</span> of <span className="font-semibold">{overview.total_students}</span> students
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">At-Risk Students</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalAtRisk}</div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-semibold">{riskLevels.critical}</span> critical, <span className="font-semibold">{riskLevels.high}</span> high, <span className="font-semibold">{riskLevels.medium}</span> medium
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Active Cases</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{mentalHealth.active_cases}</div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-semibold">{mentalHealth.total_cases}</span> total cases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card className="card-professional shadow-lg">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            Risk Distribution
          </CardTitle>
          <CardDescription className="text-base">
            Active cases by risk level across the school
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {riskLevels.critical > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span className="text-sm font-medium">Critical Risk</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{riskLevels.critical}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((riskLevels.critical / mentalHealth.active_cases) * 100)}%
                    </div>
                  </div>
                </div>
                <Progress 
                  value={(riskLevels.critical / mentalHealth.active_cases) * 100} 
                  className="h-2" 
                />
              </>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive/70 rounded-full"></div>
                <span className="text-sm font-medium">High Risk</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{riskLevels.high}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((riskLevels.high / mentalHealth.active_cases) * 100)}%
                </div>
              </div>
            </div>
            <Progress 
              value={(riskLevels.high / mentalHealth.active_cases) * 100} 
              className="h-2" 
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-sm font-medium">Medium Risk</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{riskLevels.medium}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((riskLevels.medium / mentalHealth.active_cases) * 100)}%
                </div>
              </div>
            </div>
            <Progress 
              value={(riskLevels.medium / mentalHealth.active_cases) * 100} 
              className="h-2" 
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm font-medium">Low Risk</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{riskLevels.low}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((riskLevels.low / mentalHealth.active_cases) * 100)}%
                </div>
              </div>
            </div>
            <Progress 
              value={(riskLevels.low / mentalHealth.active_cases) * 100} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends and Risk Distribution */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MetricChart
            title="Monthly Wellbeing Trends"
            data={monthlyTrends}
            type="line"
            xKey="month"
            yKey="wellbeingIndex"
            height={400}
          />
        </div>

        <div>
          <Card className="card-professional h-full">
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>Active cases by risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <MetricChart
                title=""
                data={[
                  { name: "Low Risk", value: riskLevels.low },
                  { name: "Medium Risk", value: riskLevels.medium },
                  { name: "High Risk", value: riskLevels.high },
                  { name: "Critical", value: riskLevels.critical }
                ]}
                type="pie"
                yKey="value"
                height={250}
                colors={["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--destructive))"]}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Class Performance */}
      <Card className="card-professional shadow-lg">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <School className="w-5 h-5 text-primary" />
            </div>
            Class Performance
          </CardTitle>
          <CardDescription className="text-base">
            Wellbeing metrics by class across the school
          </CardDescription>
        </CardHeader>
        <CardContent>
          {classMetrics.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No class data available</p>
          ) : (
            <div className="space-y-3">
              {classMetrics.slice(0, 8).map((classMetric: any) => (
                <div key={classMetric.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/60 hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-base">{classMetric.name}</span>
                      <span className="text-sm text-muted-foreground font-medium">
                        Teacher: {classMetric.teacher}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground font-medium">Wellbeing</p>
                      <p className="font-bold text-lg">{classMetric.wellbeingIndex}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground font-medium">At Risk</p>
                      <p className="font-bold text-lg">{classMetric.atRiskCount}</p>
                    </div>
                    <Badge 
                      className="font-semibold px-3 py-1"
                      variant={classMetric.atRiskCount > 3 ? 'destructive' : classMetric.atRiskCount > 0 ? 'secondary' : 'default'}
                    >
                      {classMetric.atRiskCount === 0 ? 'Good' : classMetric.atRiskCount > 3 ? 'Needs Attention' : 'Monitor'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}