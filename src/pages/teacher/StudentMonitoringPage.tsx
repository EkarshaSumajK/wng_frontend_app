import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  UserPlus,
  Eye,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTeacherClassesInsights } from '@/hooks/useTeachers';
import { ViewStudentProfileModal } from '@/components/modals/ViewStudentProfileModal';
import { ReferStudentModal } from '@/components/modals/ReferStudentModal';
import { useCounsellors } from '@/hooks/useCounsellors';
import { Student } from '@/types';

export default function StudentMonitoringPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: classesInsights, isLoading } = useTeacherClassesInsights(user?.id);
  const { data: counselors = [] } = useCounsellors({ school_id: user?.school_id });

  // Transform students from classes data
  const allStudents = classesInsights?.classes?.flatMap(cls => 
    cls.students.map(student => ({
      student_id: student.student_id,
      name: student.name,
      grade: cls.grade || cls.class_name?.split(' ')[1] || 'N/A',
      section: cls.section || cls.class_name?.split(' ')[2] || 'N/A',
      class_name: cls.class_name,
      gender: student.gender,
      risk_level: student.wellbeing_status?.toUpperCase() || 'LOW',
      has_active_case: student.has_active_case,
      recent_assessment_score: student.recent_assessment_score,
    }))
  ) || [];

  // Filter students
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student: any) => {
      const matchesSearch =
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.grade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.class_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk =
        riskFilter === 'all' ||
        (riskFilter === 'high' && (student.risk_level === 'HIGH' || student.risk_level === 'CRITICAL')) ||
        (riskFilter === 'medium' && student.risk_level === 'MEDIUM') ||
        (riskFilter === 'low' && student.risk_level === 'LOW') ||
        (riskFilter === 'healthy' && student.risk_level === 'HEALTHY');

      return matchesSearch && matchesRisk;
    });
  }, [allStudents, searchQuery, riskFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRiskFilterChange = (value: string) => {
    setRiskFilter(value);
    setCurrentPage(1);
  };

  // Calculate statistics
  const totalStudents = allStudents.length;
  const highRiskCount = allStudents.filter((s: any) => 
    s.risk_level === 'HIGH' || s.risk_level === 'CRITICAL'
  ).length;
  const mediumRiskCount = allStudents.filter((s: any) => 
    s.risk_level === 'MEDIUM'
  ).length;
  const lowRiskCount = allStudents.filter((s: any) => 
    s.risk_level === 'LOW'
  ).length;
  const healthyCount = allStudents.filter((s: any) => 
    s.risk_level === 'HEALTHY'
  ).length;

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return <Badge variant="destructive" className="bg-red-600">Critical Risk</Badge>;
      case 'HIGH':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning" className="bg-yellow-500">Medium Risk</Badge>;
      case 'LOW':
        return <Badge variant="secondary">Low Risk</Badge>;
      case 'HEALTHY':
        return <Badge variant="success" className="bg-green-600">Healthy</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'HIGH':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'MEDIUM':
        return <Minus className="w-4 h-4 text-yellow-500" />;
      case 'LOW':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'HEALTHY':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  const handleViewProfile = (student: any) => {
    // Transform to Student type format for the modal
    const transformedStudent: Student = {
      id: student.student_id,
      name: student.name,
      rollNumber: student.student_id?.slice(0, 8),
      grade: student.class_name || 'N/A',
      class: student.class_name,
      riskLevel: (student.risk_level === 'CRITICAL' ? 'HIGH' : student.risk_level) as 'LOW' | 'MEDIUM' | 'HIGH',
      wellbeingScore: student.recent_assessment_score,
      consentStatus: 'GRANTED' as const,
      lastAssessment: null,
    };
    setSelectedStudent(transformedStudent);
    setIsProfileModalOpen(true);
  };

  const handleRefer = (student: any) => {
    setSelectedStudent(student);
    setIsReferModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Student Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor student wellbeing and refer to counselors when needed
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        <Card className="card-professional hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Total Students</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Under your supervision</p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">High Risk</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{highRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Medium Risk</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{mediumRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Need monitoring</p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 border-l-4 border-l-info">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Low Risk</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-info" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-info">{lowRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Stable wellbeing</p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Healthy</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{healthyCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Thriving students</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-professional">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, grade, or section..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskFilter} onValueChange={handleRiskFilterChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="card-professional">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Students ({filteredStudents.length})
            {filteredStudents.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paginatedStudents.map((student: any) => (
              <div
                key={student.student_id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {student.name?.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{student.name}</p>
                      {getRiskIcon(student.risk_level)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Grade {student.grade}</span>
                      <span>•</span>
                      <span>Section {student.section}</span>
                      {student.gender && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{student.gender.toLowerCase()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getRiskBadge(student.risk_level)}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProfile(student)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRefer(student)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Refer
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                
                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewStudentProfileModal
        student={selectedStudent}
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
      
      <ReferStudentModal
        student={selectedStudent}
        counselors={counselors}
        open={isReferModalOpen}
        onOpenChange={setIsReferModalOpen}
      />
    </div>
  );
}
