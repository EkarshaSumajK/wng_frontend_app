import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  UserPlus,
  Eye,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  GraduationCap,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTeacherClassesInsights } from '@/hooks/useTeachers';
import { ViewStudentProfileModal } from '@/components/modals/ViewStudentProfileModal';
import { ReferStudentModal } from '@/components/modals/ReferStudentModal';
import { useCounsellors } from '@/hooks/useCounsellors';
import { Student } from '@/types';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Separator } from '@/components/ui/separator';

export default function StudentMonitoringPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);

  const { data: classesInsights, isLoading } = useTeacherClassesInsights(user?.id);
  const { data: counselors = [] } = useCounsellors({ school_id: user?.school_id });

  // Calculate class metrics
  const classes = useMemo(() => {
    return (classesInsights?.classes || []).map(cls => {
      const students = cls.students || [];
      const highRiskCount = students.filter((s: any) => 
        s.wellbeing_status?.toUpperCase() === 'HIGH' || s.wellbeing_status?.toUpperCase() === 'CRITICAL'
      ).length;
      const mediumRiskCount = students.filter((s: any) => 
        s.wellbeing_status?.toUpperCase() === 'MEDIUM'
      ).length;
      
      const avgWellbeing = students.length > 0
        ? students.reduce((sum: number, s: any) => sum + (s.recent_assessment_score || 0), 0) / students.length
        : 0;

      const atRiskCount = highRiskCount + mediumRiskCount;
      const caseRatePercent = students.length > 0 ? (atRiskCount / students.length) * 100 : 0;

      return {
        ...cls,
        students: students.map((student: any) => ({
          student_id: student.student_id,
          name: student.name,
          grade: cls.grade || cls.class_name?.split(' ')[1] || 'N/A',
          section: cls.section || cls.class_name?.split(' ')[2] || 'N/A',
          class_name: cls.class_name,
          gender: student.gender,
          risk_level: student.wellbeing_status?.toUpperCase() || 'LOW',
          has_active_case: student.has_active_case,
          recent_assessment_score: student.recent_assessment_score,
        })),
        total_students: students.length,
        at_risk_count: atRiskCount,
        high_risk_count: highRiskCount,
        medium_risk_count: mediumRiskCount,
        avg_wellbeing: avgWellbeing.toFixed(1),
        case_rate_percent: caseRatePercent.toFixed(1),
      };
    });
  }, [classesInsights]);

  // Overall statistics
  const allStudents = classes.flatMap(cls => cls.students);
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

  // Filter students in selected class
  const filteredStudents = useMemo(() => {
    if (!selectedClass) return [];
    return selectedClass.students.filter((student: any) => {
      return student.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [selectedClass, searchQuery]);

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
      <div className="flex items-center justify-center h-96 relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading classes...</p>
        </div>
      </div>
    );
  }

  // If a class is selected, show student detail view
  if (selectedClass) {
    return (
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
        <AnimatedBackground />
        
        {/* Header */}
        <div className="relative z-10">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedClass(null);
              setSearchQuery('');
            }}
            className="mb-2 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classes
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {selectedClass.class_name}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mt-1">
                {selectedClass.total_students} students • {selectedClass.at_risk_count} at risk
              </p>
            </div>
          </div>
        </div>

        {/* Class Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <Card className="card-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Total Students</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedClass.total_students}</div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">At Risk</CardTitle>
              <AlertCircle className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{selectedClass.at_risk_count}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedClass.case_rate_percent}% of class
              </p>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">Avg Wellbeing</CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedClass.avg_wellbeing}</div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">High Risk</CardTitle>
              <AlertCircle className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{selectedClass.high_risk_count}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="card-professional shadow-lg relative z-10">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="card-professional shadow-lg relative z-10">
          <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
            <CardTitle className="text-2xl font-bold">
              Students ({filteredStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredStudents.map((student: any, index) => (
                <div
                  key={student.student_id}
                  className="group relative p-5 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-sm font-bold text-white">
                          {student.name?.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <p className="font-bold text-foreground text-lg">{student.name}</p>
                          {getRiskIcon(student.risk_level)}
                          {getRiskBadge(student.risk_level)}
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                          {student.gender && (
                            <>
                              <span className="capitalize">{student.gender.toLowerCase()}</span>
                              <span>•</span>
                            </>
                          )}
                          {student.recent_assessment_score && (
                            <>
                              <span>Score: {student.recent_assessment_score}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(student)}
                        className="hover:bg-primary/10 hover:border-primary transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleRefer(student)}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
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
                  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-base text-muted-foreground font-semibold mb-1">
                    No students found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search' : 'No students in this class'}
                  </p>
                </div>
              )}
            </div>
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

  // Class overview - default view
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
      <AnimatedBackground />
      
      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Student Monitoring
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mt-1">
              Monitor student wellbeing across your classes
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 relative z-10">
        <Card className="card-professional hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Total Students</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Across {classes.length} classes</p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">High Risk</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{highRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Medium Risk</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-md">
              <Minus className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{mediumRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Need monitoring</p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Low Risk</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{lowRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Stable wellbeing</p>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Healthy</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white rotate-180" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{healthyCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Thriving students</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Cards */}
      <Card className="card-professional shadow-lg relative z-10">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
          <CardTitle className="text-2xl font-bold">Your Classes</CardTitle>
          <CardDescription>Click on a class to view students</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls: any) => (
              <Card 
                key={cls.class_id} 
                className="card-professional cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => setSelectedClass(cls)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{cls.class_name}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>
                    {cls.total_students} students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* At Risk Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium">At Risk Students</span>
                      </div>
                      <span className="text-sm font-bold">{cls.at_risk_count}</span>
                    </div>
                    <Progress value={parseFloat(cls.case_rate_percent)} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {cls.case_rate_percent}% of class
                    </p>
                  </div>

                  {/* Average Wellbeing */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Avg Wellbeing</span>
                      </div>
                      <span className="text-sm font-bold">{cls.avg_wellbeing}</span>
                    </div>
                  </div>

                  {/* Risk Indicator */}
                  <div className="pt-2 border-t">
                    {parseFloat(cls.case_rate_percent) > 30 ? (
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">High risk - needs attention</span>
                      </div>
                    ) : parseFloat(cls.case_rate_percent) > 15 ? (
                      <div className="flex items-center gap-2 text-warning">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Moderate risk - monitor closely</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-success">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-medium">Normal risk level</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {classes.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-base text-muted-foreground font-semibold mb-1">
                No classes assigned
              </p>
              <p className="text-sm text-muted-foreground">
                You don't have any classes assigned yet
              </p>
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
