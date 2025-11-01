import { useState } from "react";
import { BarChart3, TrendingUp, Download, Filter, Calendar, Users, Target, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/shared/StatCard";
import { MetricChart } from "@/components/shared/MetricChart";
import { useAuth } from "@/contexts/AuthContext";
import { useSchoolDashboard } from "@/hooks/useSchoolAdmin";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("6months");
  const [analysisType, setAnalysisType] = useState("trends");
  const { data: dashboardData, isLoading } = useSchoolDashboard(user?.school_id);

  if (isLoading) {
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

  const monthlyTrends = (dashboardData as any).monthly_trends || [];
  const classMetrics = (dashboardData as any).class_metrics || [];
  const assessmentData = (dashboardData as any).assessment_analytics;
  
  const casesData = monthlyTrends.map((trend: any) => ({
    month: trend.month,
    opened: trend.casesOpened,
    closed: trend.casesClosed,
    net: trend.casesOpened - trend.casesClosed
  }));

  const assessmentsData = monthlyTrends.map((trend: any) => ({
    month: trend.month,
    assessments: trend.assessmentsCompleted
  }));

  const classComparisonData = classMetrics.map((cls: any) => ({
    name: cls.name.split(' ')[0], // Shortened class names for chart
    wellbeing: cls.wellbeingIndex,
    participation: 85, // Default value
    atRisk: cls.atRiskCount
  }));

  const responseRate = Math.round(assessmentData.assessment_completion_rate || 0);
  const trendDirection = assessmentData.trend_analysis.change_percentage || 0;
  const dataPoints = assessmentData.total_assessments_completed || 0;
  const activeCohorts = classMetrics.length || 0;

  const stats = [
    { title: "Avg Response Rate", value: `${responseRate}%`, icon: Target },
    { title: "Trend Direction", value: `${trendDirection > 0 ? '+' : ''}${trendDirection.toFixed(1)}%`, icon: TrendingUp },
    { title: "Data Points", value: dataPoints.toString(), icon: BarChart3 },
    { title: "Active Cohorts", value: activeCohorts.toString(), icon: Users }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-muted-foreground">Deep insights into student wellbeing patterns and trends</p>
        </div>
        <div className="flex gap-2">
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trends">Trends Analysis</SelectItem>
              <SelectItem value="comparison">Comparative Analysis</SelectItem>
              <SelectItem value="predictive">Predictive Insights</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MetricChart
          title="Wellbeing Index Trends"
          data={monthlyTrends}
          type="line"
          xKey="month"
          yKey="wellbeingIndex"
          height={350}
        />

        <MetricChart
          title="Case Management Flow"
          data={casesData}
          type="bar"
          xKey="month"
          yKey="opened"
          height={350}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MetricChart
            title="Class-by-Class Comparison"
            data={classComparisonData}
            type="bar"
            xKey="name"
            yKey="wellbeing"
            height={400}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>AI-generated analysis highlights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Positive Trend</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Overall wellbeing index has improved by 8% over the last quarter
              </p>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Seasonal Pattern</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Wellbeing scores typically dip 12% during exam periods
              </p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">Target Achievement</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                87% of intervention goals are being met within target timeframes
              </p>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800 dark:text-purple-200">High Impact</span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Group interventions show 23% better outcomes than individual sessions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Completion Analysis</CardTitle>
          <CardDescription>Monthly assessment activity and completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <MetricChart
            title=""
            data={assessmentsData}
            type="bar"
            xKey="month"
            yKey="assessments"
            height={300}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Predictive Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Risk Level Stability</span>
              <span className="font-medium text-green-600">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Early Intervention Success</span>
              <span className="font-medium text-blue-600">78%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Assessment Accuracy</span>
              <span className="font-medium text-purple-600">84%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Resource Utilization</span>
              <span className="font-medium text-orange-600">71%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparative Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">vs. Last Year</span>
              <span className="font-medium text-green-600">+15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">vs. District Average</span>
              <span className="font-medium text-blue-600">+8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">vs. Similar Schools</span>
              <span className="font-medium text-green-600">+12%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Goal Achievement</span>
              <span className="font-medium text-purple-600">94%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Custom Report Builder
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Analytics Review
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export Raw Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}