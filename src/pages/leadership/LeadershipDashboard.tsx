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
    <div className="space-y-6 animate-in fade-in duration-700 relative pb-8">
      <AnimatedBackground />
      
      {/* Header with modern design */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100/50 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Good morning, {user?.name || 'Principal'}
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">Here's your school's wellbeing overview</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 rounded-xl bg-white/50 border border-white/20 backdrop-blur-sm shadow-sm">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Academic Year</span>
              <span className="font-bold text-sm">2024-2025</span>
            </div>
            <Badge variant="secondary" className="w-fit h-full py-2 px-4 text-sm">
              <Clock className="w-3 h-3 mr-2" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards with enhanced design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="relative overflow-hidden border-2 hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Wellbeing Index</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">{Math.round(wellbeingIndex)}%</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`bg-emerald-50 text-emerald-700 border-emerald-200 ${assessmentData.trend_analysis.trend === 'improving' ? 'text-emerald-700' : 'text-rose-700'}`}>
                <TrendingUp className={`w-3 h-3 mr-1 ${assessmentData.trend_analysis.trend !== 'improving' && 'rotate-180'}`} />
                {Math.abs(assessmentData.trend_analysis.change_percentage)}%
              </Badge>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Students Screened</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">{Math.round(screeningPercentage)}%</div>
            <p className="text-xs text-muted-foreground">
              {assessmentData.students_assessed} / {overview.total_students} students
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-rose-500/50 hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">At-Risk Students</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">{totalAtRisk}</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50">
                {riskLevels.critical} Critical
              </Badge>
              <span className="text-xs text-muted-foreground">cases</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-purple-500/50 hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Active Cases</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">{mentalHealth.active_cases}</div>
            <p className="text-xs text-muted-foreground">
              {mentalHealth.total_cases} total cases recorded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-premium overflow-hidden border-2 hover:border-primary/30 transition-all duration-300 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20 pb-3">
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Wellbeing Trends
                  </CardTitle>
                  <CardDescription>Monthly average wellbeing score analysis</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-full hover:bg-primary hover:text-white transition-colors">
                  View Report <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                  <MetricChart
                    title=""
                    data={monthlyTrends}
                    type="line"
                    xKey="month"
                    yKey="wellbeingIndex"
                    height={300}
                    colors={["#2563eb"]} // Explicit blue color
                    bare={true}
                  />
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium overflow-hidden border-2 hover:border-secondary/30 transition-all duration-300 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20 pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <School className="w-5 h-5 text-secondary" />
                Class Performance
              </CardTitle>
              <CardDescription>Top performing classes by wellbeing index</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {classMetrics.slice(0, 5).map((metric: any, index: number) => (
                  <div 
                    key={metric.id} 
                    className="group flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blue-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                        {metric.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{metric.name}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{metric.teacher}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-medium text-muted-foreground">Score</div>
                        <div className="font-bold text-base text-primary">{metric.wellbeingIndex}</div>
                      </div>
                      <div className="w-20">
                        <Progress value={metric.wellbeingIndex} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          <Card className="card-glass border-2 hover:border-destructive/30 transition-all duration-300 shadow-lg bg-card">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20 pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-destructive" />
                Risk Distribution
              </CardTitle>
              <CardDescription>Current active cases breakdown</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[180px] w-full mb-4 relative">
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-2xl font-bold text-foreground">{mentalHealth.active_cases}</span>
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
                    height={180}
                    colors={["#10b981", "#f59e0b", "#f97316", "#ef4444"]}
                    bare={true}
                  />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Critical Risk", count: riskLevels.critical, color: "bg-red-500", total: mentalHealth.active_cases },
                  { label: "High Risk", count: riskLevels.high, color: "bg-orange-500", total: mentalHealth.active_cases },
                  { label: "Medium Risk", count: riskLevels.medium, color: "bg-amber-500", total: mentalHealth.active_cases },
                  { label: "Low Risk", count: riskLevels.low, color: "bg-emerald-500", total: mentalHealth.active_cases },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                      <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2 pl-3">
                      <span className="font-bold text-base">{item.count}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {Math.round((item.count / (item.total || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border shadow-lg overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            
            <CardHeader className="pb-2">
              <CardTitle className="text-primary-foreground flex items-center gap-2 text-base">
                <Brain className="w-4 h-4" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <p className="text-primary-foreground/90 text-sm leading-relaxed">
                Based on recent assessments, Grade 10 shows a <span className="font-bold text-primary-foreground">15% increase</span> in anxiety indicators. Consider scheduling a workshop.
              </p>
              <Button variant="secondary" size="sm" className="w-full bg-white/20 hover:bg-white/30 text-primary-foreground border-none backdrop-blur-sm h-8">
                View Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}