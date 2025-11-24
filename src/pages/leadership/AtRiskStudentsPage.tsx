import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, Filter, Download, TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useAtRiskStudents } from "@/hooks/useSchoolAdmin";
import { ViewCaseDetailModal } from "@/components/modals/ViewCaseDetailModal";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";
import { AnimatedBackground } from "@/components/ui/animated-background";

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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
      <AnimatedBackground />
      
      {/* Enhanced Header */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/10 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                At-Risk Students
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-15">
              Students requiring immediate attention and support
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[200px] h-11 border-2">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH_CRITICAL">High & Critical</SelectItem>
                <SelectItem value="CRITICAL">Critical Only</SelectItem>
                <SelectItem value="HIGH">High Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="h-11 border-2">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Summary Cards */}
      <motion.div 
        className="grid gap-4 md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Total High & Critical</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">{students.length}</div>
            <p className="text-xs text-muted-foreground">Students requiring attention</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-red-500/50 hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Critical Cases</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-1">
              {allStudents.filter((s: any) => s.risk_level === 'CRITICAL').length}
            </div>
            <p className="text-xs text-muted-foreground">Immediate intervention needed</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-orange-500/50 hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">High Risk</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {allStudents.filter((s: any) => s.risk_level === 'HIGH').length}
            </div>
            <p className="text-xs text-muted-foreground">Close monitoring required</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Students List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-2 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Student Cases</CardTitle>
                <CardDescription className="text-sm mt-1">Active cases requiring attention</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {students.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-base font-medium text-foreground mb-1">No at-risk students found</p>
                <p className="text-sm text-muted-foreground">All students are within acceptable risk levels</p>
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((student: any, index: number) => (
                  <motion.div
                    key={student.case_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between p-4 border-2 border-border rounded-xl hover:border-primary/30 hover:bg-muted/30 transition-all duration-300 hover:shadow-md">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-base group-hover:text-primary transition-colors">{student.student.name}</h4>
                          <Badge className={`${getRiskLevelColor(student.risk_level)} shadow-sm`}>
                            {formatRiskLevel(student.risk_level)}
                          </Badge>
                          <Badge variant="outline" className="font-medium">{student.status}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            Counsellor: <span className="font-medium">{student.assigned_counsellor || 'Unassigned'}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Open for <span className="font-medium">{student.days_open} days</span>
                          </span>
                          {student.tags && student.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <span>Tags: <span className="font-medium">{student.tags.join(', ')}</span></span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewCase(student)}
                        className="ml-4 border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        View Case
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Case Detail Modal */}
      <ViewCaseDetailModal
        isOpen={showCaseModal}
        onClose={handleCloseModal}
        caseData={selectedCase}
      />
    </div>
  );
}
