import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useStudents } from '@/hooks/useStudents';
import { useSchoolDashboard } from '@/hooks/useSchoolAdmin';
import { Loader2 } from 'lucide-react';
import { ViewStudentProfileModal } from '@/components/modals/ViewStudentProfileModal';
import { useState } from 'react';

export default function SectionDetailPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const { data: dashboardData, isLoading: isDashboardLoading } = useSchoolDashboard(user?.school_id);
  const { data: studentsResponse, isLoading: isStudentsLoading } = useStudents({
    school_id: user?.school_id,
    class_id: sectionId,
  });

  if (isDashboardLoading || isStudentsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const classMetrics = (dashboardData as any)?.class_metrics || [];
  const sectionInfo = classMetrics.find((cls: any) => cls.id === sectionId);
  const students = Array.isArray(studentsResponse) ? studentsResponse : ((studentsResponse as any)?.students || []);

  const gradeName = sectionInfo?.name?.match(/Grade (\d+)/)?.[1] || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(gradeName ? `/leadership/grade/${gradeName}` : '/leadership/grade-analysis')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {gradeName ? `Grade ${gradeName}` : 'Grade Analysis'}
          </Button>
          <h1 className="text-3xl font-semibold text-foreground">
            {sectionInfo?.name || 'Section Details'}
          </h1>
          <p className="text-muted-foreground">
            Teacher: {sectionInfo?.teacher || 'Not assigned'} • {students.length} students
          </p>
        </div>
      </div>

      {/* Section Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">In this section</p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sectionInfo?.atRiskCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">Students at risk</p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wellbeing Index</CardTitle>
            <AlertTriangle className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectionInfo?.wellbeingIndex || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Section average</p>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>Click on a student to view their profile and case details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {students.length > 0 ? (
            students.map((student: any) => (
                <div
                  key={student.student_id}
                  onClick={() => setSelectedStudent(student)}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-foreground">
                        {student.first_name} {student.last_name}
                      </h3>
                      <Badge variant="outline">
                        Grade {student.grade_level || 'N/A'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Student ID: {student.student_id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No students found in this section
            </p>
          )}
        </CardContent>
      </Card>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <ViewStudentProfileModal
          student={{
            ...selectedStudent,
            id: selectedStudent.student_id,
            name: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
            grade: selectedStudent.grade_level,
          }}
          open={!!selectedStudent}
          onOpenChange={(open) => !open && setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
