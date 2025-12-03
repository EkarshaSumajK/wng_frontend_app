import { Clock, AlertTriangle, Users, TrendingUp, Activity, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCounsellorDashboard } from "@/hooks/useCounsellors";
import { useCases } from "@/hooks/useCases";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ViewCaseDetailModal } from "@/components/modals/ViewCaseDetailModal";
import { AddObservationModal } from '@/components/modals/AddObservationModal';
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LoadingState } from '@/components/shared/LoadingState';
import { useState } from "react";


import { format } from "date-fns";

export default function CounsellorDashboard() {
  const { user } = useAuth();
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useCounsellorDashboard(user?.id);
  const { data: casesResponse = [] } = useCases({ 
    assigned_counsellor: user?.id
  });
  
  // Fetch calendar events for dynamic metrics
  // Debug logging


  // Transform cases data
  const cases = Array.isArray(casesResponse) ? casesResponse.map((item: any) => ({
    ...item.case,
    student: item.student,
    counsellor: item.counsellor,
  })) : [];
  
  // Show loading state
  if (isDashboardLoading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading dashboard..." />
      </div>
    );
  }
  
  // Show error state
  if (dashboardError) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-medium mb-2">Failed to load dashboard</p>
            <p className="text-sm text-muted-foreground">{dashboardError.toString()}</p>
          </div>
        </div>
      </div>
    );
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'intake':
        return 'bg-primary text-primary-foreground';
      case 'intervention':
        return 'bg-warning text-warning-foreground';
      case 'closed':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const caseload = dashboardData?.caseload;
  const calendarMetrics = dashboardData?.calendar_metrics;
  const highPriorityCases = (caseload?.by_risk_level?.critical || 0) + (caseload?.by_risk_level?.high || 0);
  
  console.log('Caseload:', caseload);
  console.log('High Priority Cases:', highPriorityCases);
  
  // Get priority cases (critical and high risk)
  const priorityCases = cases
    .filter((c: any) => c.risk_level === 'CRITICAL' || c.risk_level === 'HIGH')
    .slice(0, 3);

  const handleViewCase = (caseData: any) => {
    setSelectedCase(caseData);
    setIsCaseModalOpen(true);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
      <AnimatedBackground />
      {/* Header with modern design */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Good morning, {user?.name || 'Counsellor'}
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">Here's your caseload overview for today</p>
          </div>
          <Badge variant="secondary" className="w-fit">
            <Clock className="w-3 h-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* Stats Cards with enhanced design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Active Cases</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-2">{caseload?.active_cases || 0}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{caseload?.by_status.intake || 0}
              </Badge>
              <span className="text-xs text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-warning/50 hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">High Priority</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-2">{highPriorityCases}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-purple/50 hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Today's Sessions</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-2">{calendarMetrics?.todays_sessions_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              {calendarMetrics?.next_session ? (
                <>
                  Next: <span className="font-semibold text-foreground">{calendarMetrics.next_session.student_name || calendarMetrics.next_session.title}</span> at {format(new Date(calendarMetrics.next_session.start_time), "h:mm a")}
                </>
              ) : (
                "No more sessions today"
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Priority Cases with modern design */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Priority Cases</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Cases requiring immediate attention or follow-up
                </CardDescription>
              </div>
            </div>
            <Badge variant="destructive" className="text-sm px-3 py-1">
              {priorityCases.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {priorityCases.length > 0 ? (
            <div className="space-y-4">
              {priorityCases.map((case_: any, index) => (
                <div 
                  key={case_.case_id} 
                  className="group relative p-5 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent dark:hover:from-primary/20 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleViewCase(case_)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-foreground text-lg">
                          {case_.student?.first_name} {case_.student?.last_name}
                        </p>
                        <Badge className={`${getRiskLevelColor(case_.risk_level)} font-semibold`}>
                          {formatRiskLevel(case_.risk_level)}
                        </Badge>
                        <Badge className={getStatusColor(case_.status)} variant="secondary">
                          {case_.status}
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {case_.ai_summary || 'No summary available'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Updated: {case_.updated_at || case_.created_at ? new Date(case_.updated_at || case_.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-success" />
              </div>
              <p className="text-base text-muted-foreground font-semibold mb-1">
                All Clear!
              </p>
              <p className="text-sm text-muted-foreground">
                No high priority cases at the moment
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Case Detail Modal */}
      <ViewCaseDetailModal
        isOpen={isCaseModalOpen}
        onClose={() => {
          setIsCaseModalOpen(false);
          setSelectedCase(null);
        }}
        caseData={selectedCase}
      />
    </div>
  );
}