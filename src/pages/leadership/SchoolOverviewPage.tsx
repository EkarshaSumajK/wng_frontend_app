import { useState } from "react";
import { School, TrendingUp, Users, AlertTriangle, BarChart3, Calendar, Loader2, Shield, Clock, ArrowUpRight, Target, Brain, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricChart } from "@/components/shared/MetricChart";
import { useAuth } from "@/contexts/AuthContext";
import { useSchoolDashboard, useCounsellorWorkload } from "@/hooks/useSchoolAdmin";
import { Progress } from "@/components/ui/progress";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { StatsCard } from "@/components/ui/stats-card";
import { UpdateLogoModal } from "@/components/modals/UpdateLogoModal";

export default function SchoolOverviewPage() {
  const { user, updateUser } = useAuth();
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
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
  const rawMonthlyTrends = (dashboardData as any).monthly_trends || [];
  const classMetrics = (dashboardData as any).class_metrics || [];
  const counsellorWorkload = (workloadData as any)?.workload || [];

  // Convert 5-point scale to percentage for display
  const wellbeingScore = assessmentData.average_assessment_score || 0;
  const wellbeingIndex = Math.round((wellbeingScore / 5) * 100);
  
  const totalAtRisk = riskLevels.medium + riskLevels.high + riskLevels.critical;
  const criticalAlerts = riskLevels.critical;

  // Process monthly trends to use percentages
  const monthlyTrends = rawMonthlyTrends.map((trend: any) => ({
    ...trend,
    wellbeingIndex: Math.round((trend.wellbeingIndex / 5) * 100)
  }));

  const riskData = [
    { name: "Low Risk", value: riskLevels.low },
    { name: "Medium Risk", value: riskLevels.medium },
    { name: "High Risk", value: riskLevels.high },
    { name: "Critical", value: riskLevels.critical }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative pb-10">
      <AnimatedBackground />
      
      {/* Enhanced Header */}
      <div className="relative z-10 bg-card/40 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-blue-200 relative group cursor-pointer"
                onClick={() => setIsLogoModalOpen(true)}
              >
                {user?.school_logo_url ? (
                  <img src={user.school_logo_url} alt="School Logo" className="w-8 h-8 object-contain bg-white rounded-md" />
                ) : (
                  <Shield className="w-8 h-8 text-white" />
                )}
                <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  School Overview
                </h1>
                <p className="text-muted-foreground font-medium">Comprehensive view of school-wide wellbeing metrics</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-background/50 backdrop-blur-md p-2 rounded-2xl border border-white/10">
            <div className="px-4 py-2 rounded-xl bg-blue-50 text-primary font-bold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Wellbeing Index"
          value={`${wellbeingIndex}%`}
          icon={School}
          trend={{
            value: assessmentData.trend_analysis?.change_percentage || 0,
            label: "vs last month",
            isPositive: assessmentData.trend_analysis?.trend === 'improving'
          }}
          delay={100}
          className="bg-gradient-to-br from-emerald-50/50 to-white/50 dark:from-emerald-950/30 dark:to-background/50 border-emerald-100/50 dark:border-emerald-900/50"
        />
        
        <StatsCard
          title="Students Screened"
          value={`${assessmentData.students_assessed}`}
          description={`out of ${overview.total_students} students`}
          icon={Users}
          delay={200}
          className="bg-gradient-to-br from-blue-50/50 to-white/50 dark:from-blue-950/30 dark:to-background/50 border-blue-100/50 dark:border-blue-900/50"
        />
        
        <StatsCard
          title="At-Risk Students"
          value={totalAtRisk.toString()}
          description={`${criticalAlerts} critical alerts`}
          icon={AlertTriangle}
          delay={300}
          className="bg-gradient-to-br from-rose-50/50 to-white/50 dark:from-rose-950/30 dark:to-background/50 border-rose-100/50 dark:border-rose-900/50"
        />
        
        <StatsCard
          title="Critical Alerts"
          value={criticalAlerts.toString()}
          description="Requires immediate attention"
          icon={BarChart3}
          delay={400}
          className="bg-gradient-to-br from-purple-50/50 to-white/50 dark:from-purple-950/30 dark:to-background/50 border-purple-100/50 dark:border-purple-900/50"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="card-premium overflow-hidden border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Monthly Wellbeing Trends
                </CardTitle>
                <CardDescription>Average wellbeing score over time (0-100%)</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full mt-4">
                <MetricChart
                  title=""
                  data={monthlyTrends}
                  type="line"
                  xKey="month"
                  yKey="wellbeingIndex"
                  height={400}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="card-glass border-none shadow-xl bg-gradient-to-b from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-destructive" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MetricChart
                title=""
                data={riskData}
                type="pie"
                yKey="value"
                height={250}
                colors={["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--destructive))"]}
              />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary to-secondary text-white border-none shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-white/90 text-sm leading-relaxed">
                {assessmentData.trend_analysis?.trend === 'improving' 
                  ? "Wellbeing scores are improving. Keep up the good work with the recent wellness initiatives."
                  : "Wellbeing scores have slightly declined. Consider reviewing the recent stress factors in Grade 10."}
              </p>
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                View Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-premium overflow-hidden border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="w-5 h-5 text-secondary" />
              Class Performance
            </CardTitle>
            <CardDescription>Wellbeing metrics by class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classMetrics.slice(0, 8).map((classMetric: any, index: number) => (
                <div 
                  key={classMetric.id} 
                  className="group flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-100"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {classMetric.name.substring(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium group-hover:text-primary transition-colors">{classMetric.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {classMetric.teacher}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</p>
                      <p className="font-bold text-primary">{classMetric.wellbeingIndex}</p>
                    </div>
                    <div className="w-24">
                      <Progress 
                        value={(classMetric.wellbeingIndex / 5) * 100} 
                        className="h-2"
                      />
                    </div>
                    <Badge variant={classMetric.atRiskCount > 3 ? 'destructive' : classMetric.atRiskCount > 0 ? 'secondary' : 'outline'}>
                      {classMetric.atRiskCount} At Risk
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium overflow-hidden border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Counsellor Workload
            </CardTitle>
            <CardDescription>Case distribution across counsellors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {counsellorWorkload.map((counsellor: any) => {
                const capacity = 30; // Default capacity
                const percentage = (counsellor.active_cases / capacity) * 100;
                
                return (
                  <div key={counsellor.counsellor_id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                          {counsellor.name.charAt(0)}
                        </div>
                        <span className="font-medium">{counsellor.name}</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {counsellor.active_cases} / {capacity}
                      </span>
                    </div>
                    <Progress 
                      value={percentage}
                      className={`h-2 ${percentage > 90 ? 'bg-destructive/20' : percentage > 70 ? 'bg-warning/20' : 'bg-purple-100'}`}
                      indicatorClassName={percentage > 90 ? 'bg-destructive' : percentage > 70 ? 'bg-warning' : 'bg-purple-500'}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>


      <UpdateLogoModal 
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        schoolId={user?.school_id || ''}
        currentLogoUrl={user?.school_logo_url}
        onSuccess={(newLogoUrl) => updateUser({ school_logo_url: newLogoUrl })}
      />
    </div>
  );
}