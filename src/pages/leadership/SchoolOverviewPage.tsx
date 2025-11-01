import { useState } from "react";
import { School, TrendingUp, Users, AlertTriangle, BarChart3, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/shared/StatCard";
import { MetricChart } from "@/components/shared/MetricChart";
import { useAuth } from "@/contexts/AuthContext";
import { useSchoolDashboard, useCounsellorWorkload } from "@/hooks/useSchoolAdmin";
import { Progress } from "@/components/ui/progress";

export default function SchoolOverviewPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("6months");
  const { data: dashboardData, isLoading: isDashboardLoading } = useSchoolDashboard(user?.school_id);
  const { data: workloadData, isLoading: isWorkloadLoading } = useCounsellorWorkload(user?.school_id);

  if (isDashboardLoading || isWorkloadLoading) {
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

  const overview = (dashboardData as any).overview;
  const mentalHealth = (dashboardData as any).mental_health_metrics;
  const riskLevels = (dashboardData as any).cases_by_risk_level;
  const assessmentData = (dashboardData as any).assessment_analytics;
  const monthlyTrends = (dashboardData as any).monthly_trends || [];
  const classMetrics = (dashboardData as any).class_metrics || [];
  const counsellorWorkload = workloadData?.workload || [];

  const wellbeingIndex = Math.round(assessmentData.average_assessment_score || 0);
  const totalAtRisk = riskLevels.medium + riskLevels.high + riskLevels.critical;
  const completionRate = assessmentData.assessment_completion_rate || 0;
  const criticalAlerts = riskLevels.critical;

  const stats = [
    { title: "School Wellbeing Index", value: `${wellbeingIndex}%`, icon: School },
    { title: "Students Screened", value: `${assessmentData.students_assessed}/${overview.total_students}`, icon: Users },
    { title: "At Risk Students", value: totalAtRisk.toString(), icon: AlertTriangle },
    { title: "Critical Alerts", value: criticalAlerts.toString(), icon: BarChart3 }
  ];

  const riskData = [
    { name: "Low Risk", value: riskLevels.low },
    { name: "Medium Risk", value: riskLevels.medium },
    { name: "High Risk", value: riskLevels.high }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">School Overview</h1>
          <p className="text-muted-foreground">Comprehensive view of school-wide wellbeing metrics</p>
        </div>
        <div className="flex gap-2">
          {/* <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select> */}
          {/* <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Generate Report
          </Button> */}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricChart
                title=""
                data={riskData}
                type="pie"
                yKey="value"
                height={250}
                colors={["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"]}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Wellbeing metrics by class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classMetrics.slice(0, 8).map((classMetric: any) => (
                <div key={classMetric.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{classMetric.name}</span>
                      <span className="text-sm text-muted-foreground">
                        Teacher: {classMetric.teacher}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Wellbeing</p>
                      <p className="font-medium">{classMetric.wellbeingIndex}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">At Risk</p>
                      <p className="font-medium">{classMetric.atRiskCount}</p>
                    </div>
                    <Badge variant={classMetric.atRiskCount > 3 ? 'destructive' : classMetric.atRiskCount > 0 ? 'secondary' : 'default'}>
                      {classMetric.atRiskCount === 0 ? 'Good' : classMetric.atRiskCount > 3 ? 'Needs Attention' : 'Monitor'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Counsellor Workload</CardTitle>
            <CardDescription>Case distribution across counsellors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {counsellorWorkload.map((counsellor: any) => {
                const capacity = 30; // Default capacity
                const percentage = (counsellor.active_cases / capacity) * 100;
                
                return (
                  <div key={counsellor.counsellor_id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{counsellor.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {counsellor.active_cases}/{capacity}
                      </span>
                    </div>
                    <Progress 
                      value={percentage}
                      className={percentage > 90 ? 'bg-destructive/20' : percentage > 70 ? 'bg-warning/20' : ''}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{counsellor.active_cases} active cases</span>
                      <span>{Math.round(percentage)}% capacity</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}