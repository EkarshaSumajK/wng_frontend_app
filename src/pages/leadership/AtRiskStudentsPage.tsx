import { useState } from "react";
import { AlertTriangle, Loader2, Filter, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useAtRiskStudents } from "@/hooks/useSchoolAdmin";
import { ViewCaseDetailModal } from "@/components/modals/ViewCaseDetailModal";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";

export default function AtRiskStudentsPage() {
  const { user } = useAuth();
  const [riskFilter, setRiskFilter] = useState<string>("HIGH_CRITICAL");
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showCaseModal, setShowCaseModal] = useState(false);
  
  const { data, isLoading } = useAtRiskStudents(
    user?.school_id, 
    riskFilter === "HIGH_CRITICAL" ? undefined : riskFilter
  );

  const handleViewCase = (student: any) => {
    setSelectedCase(student);
    setShowCaseModal(true);
  };

  const handleCloseModal = () => {
    setShowCaseModal(false);
    setSelectedCase(null);
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const allStudents = (data as any)?.students || [];
  
  // Filter to show only HIGH and CRITICAL risk levels
  const students = allStudents.filter((student: any) => {
    if (riskFilter === "HIGH_CRITICAL") {
      return student.risk_level === 'HIGH' || student.risk_level === 'CRITICAL';
    }
    return true; // For specific filters (CRITICAL or HIGH), show all from API
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">At-Risk Students</h1>
          <p className="text-muted-foreground">Students requiring immediate attention and support</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HIGH_CRITICAL">High & Critical</SelectItem>
              <SelectItem value="CRITICAL">Critical Only</SelectItem>
              <SelectItem value="HIGH">High Only</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total High & Critical</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical Cases</p>
              <p className="text-2xl font-bold text-destructive">
                {allStudents.filter((s: any) => s.risk_level === 'CRITICAL').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High Risk</p>
              <p className="text-2xl font-bold text-destructive/70">
                {allStudents.filter((s: any) => s.risk_level === 'HIGH').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle>Student Cases</CardTitle>
          <CardDescription>Active cases requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No at-risk students found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student: any) => (
                <div
                  key={student.case_id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{student.student.name}</h4>
                      <Badge className={getRiskLevelColor(student.risk_level)}>
                        {formatRiskLevel(student.risk_level)}
                      </Badge>
                      <Badge variant="outline">{student.status}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Counsellor: {student.assigned_counsellor || 'Unassigned'}</span>
                      <span>•</span>
                      <span>Open for {student.days_open} days</span>
                      {student.tags && student.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span>Tags: {student.tags.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewCase(student)}
                  >
                    View Case
                  </Button>
                </div>
              ))}
            </div>
          )}
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
