import { Clock, AlertTriangle, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCounsellorDashboard } from "@/hooks/useCounsellors";
import { useCases } from "@/hooks/useCases";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";

export default function CounsellorDashboard() {
  const { user } = useAuth();
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useCounsellorDashboard(user?.id);
  const { data: casesResponse = [] } = useCases({ 
    assigned_counsellor: user?.id
  });

  // Debug logging
  console.log('Dashboard Data:', dashboardData);
  console.log('Dashboard Loading:', isDashboardLoading);
  console.log('Dashboard Error:', dashboardError);
  console.log('User ID:', user?.id);

  // Transform cases data
  const cases = Array.isArray(casesResponse) ? casesResponse.map((item: any) => ({
    ...item.case,
    student: item.student,
    counsellor: item.counsellor,
  })) : [];
  
  // Show loading state
  if (isDashboardLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
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
  const highPriorityCases = (caseload?.by_risk_level?.critical || 0) + (caseload?.by_risk_level?.high || 0);
  
  console.log('Caseload:', caseload);
  console.log('High Priority Cases:', highPriorityCases);
  
  // Get priority cases (critical and high risk)
  const priorityCases = cases
    .filter((c: any) => c.risk_level === 'CRITICAL' || c.risk_level === 'HIGH')
    .slice(0, 3);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Good morning, {user?.name || 'Counsellor'}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">Here's your caseload overview for today</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="card-professional hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Active Cases</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{caseload?.active_cases || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success font-semibold">+{caseload?.by_status.intake || 0}</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">High Priority</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{highPriorityCases}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Today's Sessions</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">7</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next: {priorityCases[0]?.student?.first_name || 'No sessions'} at 10:30 AM
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Priority Cases */}
      <Card className="card-professional shadow-lg">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            Priority Cases
          </CardTitle>
          <CardDescription className="text-base">
            Cases requiring immediate attention or follow-up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {priorityCases.length > 0 ? (
            priorityCases.map((case_: any) => (
              <div key={case_.case_id} className="flex items-start justify-between p-4 border-2 border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-pointer hover:shadow-md">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <p className="font-bold text-foreground text-base">
                      {case_.student?.first_name} {case_.student?.last_name}
                    </p>
                    <Badge className={getRiskLevelColor(case_.risk_level)}>
                      {formatRiskLevel(case_.risk_level)}
                    </Badge>
                    <Badge className={getStatusColor(case_.status)} variant="secondary">
                      {case_.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {case_.ai_summary || 'No summary available'}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Updated: {case_.updated_at ? new Date(case_.updated_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-success" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                No high priority cases at the moment
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}