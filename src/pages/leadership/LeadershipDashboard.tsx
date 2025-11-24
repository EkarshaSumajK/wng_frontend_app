import { useState } from "react";
import { School, TrendingUp, Users, AlertTriangle, FileText, Shield, Loader2, Clock, Activity, Target, Brain, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MetricChart } from "@/components/shared/MetricChart";
import { useAuth } from "@/contexts/AuthContext";
import { useSchoolDashboard } from "@/hooks/useSchoolAdmin";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorFallback } from "@/components/ui/error-fallback";

export default function LeadershipDashboard() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading: isDashboardLoading, error } = useSchoolDashboard(user?.school_id);

  if (error) {
    return (
      <div className="p-8">
        <ErrorFallback 
          title="Failed to load dashboard" 
          message="We encountered an issue fetching your school's data. Please try refreshing the page."
          error={error as Error}
          resetErrorBoundary={() => window.location.reload()}
        />
      </div>
    );
  }

  if (isDashboardLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700 relative pb-10">
        <AnimatedBackground />
        
        {/* Skeleton Header */}
        <div className="relative z-10 bg-card/40 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="w-14 h-14 rounded-2xl" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-12 w-48 rounded-2xl" />
          </div>
        </div>

        {/* Skeleton Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <StatsCard 
              key={i} 
              title="" 
              value="" 
              icon={Activity} 
              isLoading={true} 
              className="h-32"
            />
          ))}
        </div>

        {/* Skeleton Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="card-premium h-[450px]">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </CardContent>
            </Card>
            <Card className="card-premium h-[400px]">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="card-glass h-[400px]">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto mb-6" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-8">
        <ErrorFallback 
          title="No Data Available" 
          message="We couldn't find any dashboard data for your school."
        />
      </div>
    );
  }

  const overview = (dashboardData as any).overview;
  const mentalHealth = (dashboardData as any).mental_health_metrics;
  const riskLevels = (dashboardData as any).cases_by_risk_level;
  const assessmentData = (dashboardData as any).assessment_analytics;
  const monthlyTrends = (dashboardData as any).monthly_trends || [];
  const classMetrics = (dashboardData as any).class_metrics || [];

  const wellbeingIndex = assessmentData.average_assessment_score || 0;
  const screeningPercentage = assessmentData.assessment_completion_rate || 0;
  const totalAtRisk = riskLevels.critical + riskLevels.high + riskLevels.medium;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative pb-10">
      <AnimatedBackground />
      
      {/* Enhanced Header */}
      <div className="relative z-10 bg-card/40 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient">
                  School Overview
                </h1>
                <p className="text-muted-foreground font-medium">Welcome back, {user?.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-background/50 backdrop-blur-md p-2 rounded-2xl border border-white/10">
            <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div className="px-4 py-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Academic Year</span>
              <span className="font-bold">2024-2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Wellbeing Index"
          value={`${Math.round(wellbeingIndex)}%`}
          icon={Activity}
          trend={{
            value: assessmentData.trend_analysis.change_percentage,
            label: "vs last month",
            isPositive: assessmentData.trend_analysis.trend === 'improving'
          }}
          delay={100}
          className="bg-gradient-to-br from-emerald-50/50 to-white/50 dark:from-emerald-950/30 dark:to-background/50 border-emerald-100/50 dark:border-emerald-900/50"
        />
        
        <StatsCard
          title="Students Screened"
          value={`${Math.round(screeningPercentage)}%`}
          description={`${assessmentData.students_assessed} / ${overview.total_students} students`}
          icon={Users}
          delay={200}
          className="bg-gradient-to-br from-blue-50/50 to-white/50 dark:from-blue-950/30 dark:to-background/50 border-blue-100/50 dark:border-blue-900/50"
        />
        
        <StatsCard
          title="At-Risk Students"
          value={totalAtRisk}
          description={`${riskLevels.critical} critical cases`}
          icon={AlertTriangle}
          trend={{
            value: 5, // Example trend
            label: "vs last month",
            isPositive: false // Negative because increase in risk is bad
          }}
          delay={300}
          className="bg-gradient-to-br from-rose-50/50 to-white/50 dark:from-rose-950/30 dark:to-background/50 border-rose-100/50 dark:border-rose-900/50"
        />
        
        <StatsCard
          title="Active Cases"
          value={mentalHealth.active_cases}
          description={`${mentalHealth.total_cases} total cases`}
          icon={FileText}
          delay={400}
          className="bg-gradient-to-br from-purple-50/50 to-white/50 dark:from-purple-950/30 dark:to-background/50 border-purple-100/50 dark:border-purple-900/50"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="card-premium overflow-hidden border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Wellbeing Trends
                </CardTitle>
                <CardDescription>Monthly average wellbeing score analysis</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-full hover:bg-primary hover:text-white transition-colors">
                View Report <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full mt-4">
                <MetricChart
                  title=""
                  data={monthlyTrends}
                  type="line"
                  xKey="month"
                  yKey="wellbeingIndex"
                  height={350}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium overflow-hidden border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <School className="w-5 h-5 text-secondary" />
                Class Performance
              </CardTitle>
              <CardDescription>Top performing classes by wellbeing index</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classMetrics.slice(0, 5).map((metric: any, index: number) => (
                  <div 
                    key={metric.id} 
                    className="group flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/10"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                        {metric.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{metric.name}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{metric.teacher}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm font-medium text-muted-foreground">Score</div>
                        <div className="font-bold text-lg text-primary">{metric.wellbeingIndex}</div>
                      </div>
                      <div className="w-24">
                        <Progress value={metric.wellbeingIndex} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-8">
          <Card className="card-glass border-none shadow-xl bg-gradient-to-b from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-destructive" />
                Risk Distribution
              </CardTitle>
              <CardDescription>Current active cases breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full mb-6 relative">
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-3xl font-bold text-foreground">{mentalHealth.active_cases}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Active</span>
                </div>
                <MetricChart
                  title=""
                  data={[
                    { name: "Low", value: riskLevels.low },
                    { name: "Medium", value: riskLevels.medium },
                    { name: "High", value: riskLevels.high },
                    { name: "Critical", value: riskLevels.critical }
                  ]}
                  type="pie"
                  yKey="value"
                  height={200}
                  colors={["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--destructive))"]}
                />
              </div>
              
              <div className="space-y-3">
                {[
                  { label: "Critical Risk", count: riskLevels.critical, color: "bg-destructive" },
                  { label: "High Risk", count: riskLevels.high, color: "bg-orange-500" },
                  { label: "Medium Risk", count: riskLevels.medium, color: "bg-warning" },
                  { label: "Low Risk", count: riskLevels.low, color: "bg-success" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <span className="font-bold text-sm">{item.count}</span>
                  </div>
                ))}
              </div>
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
                Based on recent assessments, Grade 10 shows a <span className="font-bold text-white">15% increase</span> in anxiety indicators. Consider scheduling a workshop.
              </p>
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                View Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}