import { useState } from "react";
import { AlertTriangle, Shield, Users, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { useAuth } from "@/contexts/AuthContext";
import { useRiskAlerts, useAtRiskStudents } from "@/hooks/useSchoolAdmin";
import { LoadingState } from '@/components/shared/LoadingState';
import { ViewCaseDetailModal } from "@/components/modals/ViewCaseDetailModal";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";

export default function RiskManagementPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showCaseModal, setShowCaseModal] = useState(false);

  const filters = {
    status: statusFilter !== "all" ? statusFilter : undefined,
    level: levelFilter !== "all" ? levelFilter : undefined,
  };

  const { data: alertsData, isLoading } = useRiskAlerts(user?.school_id, filters);
  const { data: atRiskData } = useAtRiskStudents(user?.school_id);

  const handleReviewAlert = (alert: any) => {
    // Find the corresponding case from at-risk students data
    const students = (atRiskData as any)?.students || [];
    const studentCase = students.find((s: any) => s.student.student_id === alert.studentId);
    
    if (studentCase) {
      setSelectedCase(studentCase);
      setShowCaseModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowCaseModal(false);
    setSelectedCase(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState message="Loading risk data..." />
      </div>
    );
  }

  const alerts = (alertsData as any) || [];
  const filteredAlerts = alerts;

  const criticalCount = alerts.filter((alert: any) => alert.level === 'critical').length;
  const newCount = alerts.filter((alert: any) => alert.status === 'new').length;
  const inReviewCount = alerts.filter((alert: any) => alert.status === 'in-review').length;
  const resolvedCount = alerts.filter((alert: any) => alert.status === 'resolved').length;

  const stats = [
    { title: "Critical Alerts", value: criticalCount.toString(), icon: AlertTriangle },
    { title: "New Alerts", value: newCount.toString(), icon: Shield },
    { title: "Under Review", value: inReviewCount.toString(), icon: Clock },
    { title: "Resolved This Week", value: resolvedCount.toString(), icon: CheckCircle }
  ];

  const columns = [
    {
      key: "studentName",
      label: "Student",
      render: (alert: any) => (
        <div className="font-medium">{alert.studentName}</div>
      ),
    },
    {
      key: "level",
      label: "Risk Level",
      render: (alert: any) => (
        <Badge className={getRiskLevelColor(alert.level)}>
          {formatRiskLevel(alert.level)}
        </Badge>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (alert: any) => (
        <Badge variant="outline" className="capitalize">
          {alert.type}
        </Badge>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (alert: any) => (
        <div className="max-w-xs">
          <p className="text-sm line-clamp-2">{alert.description}</p>
        </div>
      ),
    },
    {
      key: "assignedTo",
      label: "Assigned To",
      render: (alert: any) => (
        <span className="text-sm">{alert.assignedTo}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (alert: any) => (
        <Badge variant={
          alert.status === 'resolved' ? 'default' :
          alert.status === 'in-review' ? 'secondary' :
          alert.status === 'escalated' ? 'destructive' : 'outline'
        }>
          {alert.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (alert: any) => (
        <span className="text-sm">
          {new Date(alert.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risk Management</h1>
          <p className="text-muted-foreground">Monitor and manage student risk assessments and alerts</p>
        </div>
        <Button>
          <Shield className="mr-2 h-4 w-4" />
          Create Risk Protocol
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Active Risk Alerts</CardTitle>
              <CardDescription>
                Monitor and respond to student risk indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DataTable 
                data={filteredAlerts}
                columns={columns}
                actions={(alert) => (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleReviewAlert(alert)}
                    >
                      Review
                    </Button>
                    {alert.status === 'new' && (
                      <Button size="sm" variant="outline">
                        Assign
                      </Button>
                    )}
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Escalation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800 dark:text-red-200">Critical Protocol</span>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Immediate intervention required within 2 hours
                </p>
                <Button size="sm" variant="destructive" className="w-full mt-2">
                  Activate Emergency Response
                </Button>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">High Risk Protocol</span>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Assessment and intervention within 24 hours
                </p>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  Schedule Assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Critical Alerts</span>
                <span className="font-medium text-green-600 dark:text-green-400">1.2 hrs avg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">High Risk Alerts</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">8.5 hrs avg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resolution Rate</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">False Positives</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">6%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Review All Critical
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Assign Unassigned
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Update Protocols
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Protocols</CardTitle>
          <CardDescription>Established procedures for different risk scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Self-Harm Indicators</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Immediate crisis intervention protocol
              </p>
              <Badge variant="destructive">Critical</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Academic Decline</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Early intervention and support planning
              </p>
              <Badge variant="secondary">High</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Social Isolation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Peer support and engagement strategies
              </p>
              <Badge variant="secondary">High</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Behavioral Changes</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Monitoring and pattern analysis
              </p>
              <Badge variant="outline">Medium</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Detail Modal */}
      <ViewCaseDetailModal
        isOpen={showCaseModal}
        onClose={handleCloseModal}
        caseData={selectedCase}
      />
    </div>
  );
}