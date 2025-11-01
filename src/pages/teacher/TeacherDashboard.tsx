import { useState } from "react";
import { Users, BookOpen, Eye, AlertTriangle, Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/shared/StatCard";
import { AddObservationModal } from "@/components/modals/AddObservationModal";
import { ViewStudentProfileModal } from "@/components/modals/ViewStudentProfileModal";
import { useAuth } from "@/contexts/AuthContext";
import { useTeacherDashboard, useTeacherClassesInsights } from "@/hooks/useTeachers";
import { useObservations, useCreateObservation } from "@/hooks/useObservations";
import { Student } from "@/types";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useTeacherDashboard(user?.id);
  const { data: classesInsights } = useTeacherClassesInsights(user?.id);
  const { data: observationsData = [] } = useObservations({ reported_by: user?.id });
  const createObservation = useCreateObservation();

  // Transform students data for observations lookup
  const allStudents = classesInsights?.classes?.flatMap(cls => 
    cls.students.map(student => ({
      student_id: student.student_id,
      student_name: student.name,
      class_id: cls.class_id,
      class_name: cls.class_name,
      risk_level: student.wellbeing_status,
      has_active_case: student.has_active_case,
      average_score: student.recent_assessment_score || 0,
      gender: student.gender
    }))
  ) || [];

  const totalStudents = dashboardData?.overview?.total_students || 0;
  const totalAtRisk = dashboardData?.student_wellbeing?.students_at_risk || 0;
  const avgWellbeing = dashboardData?.overview?.overall_wellbeing_percentage || 0;
  const recentObservations = dashboardData?.recent_activity_30_days?.observations || 0;

  const stats = [
    { title: "Total Students", value: totalStudents.toString(), icon: Users },
    { title: "Class Wellbeing", value: avgWellbeing.toFixed(0) + "%", icon: Heart, variant: "success" as const },
    { title: "At Risk Students", value: totalAtRisk.toString(), icon: AlertTriangle, variant: "warning" as const },
    { title: "Active Cases", value: dashboardData?.overview?.active_cases?.toString() || "0", icon: BookOpen },
    { title: "Recent Observations", value: recentObservations.toString(), icon: Eye },
    { title: "Assessments (30d)", value: dashboardData?.recent_activity_30_days?.assessments_completed?.toString() || "0", icon: MessageSquare }
  ];



  const getWellbeingColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };



  if (isDashboardLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Good morning, {user?.name || 'Teacher'}
        </h1>
        <p className="text-muted-foreground">Here's your classroom wellbeing overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* My Classes Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                My Classes
              </CardTitle>
              <CardDescription>Click on a class to view detailed metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classesInsights?.classes && classesInsights.classes.length > 0 ? (
                  classesInsights.classes.map((classData) => {
                    const wellbeingPercentage = classData.total_students > 0
                      ? ((classData.total_students - classData.wellbeing_metrics.active_cases) / classData.total_students * 100)
                      : 100;
                    
                    return (
                      <div 
                        key={classData.class_id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedClass === classData.class_id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedClass(classData.class_id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{classData.class_name}</h3>
                          <Badge variant={classData.wellbeing_metrics.active_cases > 3 ? 'destructive' : classData.wellbeing_metrics.active_cases > 0 ? 'secondary' : 'default'}>
                            {classData.wellbeing_metrics.active_cases} at risk
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Wellbeing Index</span>
                            <span className={`font-medium ${getWellbeingColor(wellbeingPercentage)}`}>
                              {wellbeingPercentage.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={wellbeingPercentage} className="h-2" />
                          
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Avg Assessment Score</span>
                            <span className={`font-medium ${getWellbeingColor(classData.performance_metrics.average_assessment_score)}`}>
                              {classData.performance_metrics.average_assessment_score.toFixed(1)}
                            </span>
                          </div>
                          <Progress value={classData.performance_metrics.average_assessment_score} className="h-2" />
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          {classData.total_students} students • {classData.performance_metrics.completed_assessments} assessments
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No classes assigned yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Detailed Metrics */}
        <div className="space-y-4">
          {selectedClass ? (
            (() => {
              const classData = classesInsights?.classes.find(c => c.class_id === selectedClass);
              if (!classData) return null;
              
              return (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{classData.class_name}</CardTitle>
                      <CardDescription>Class performance overview</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Students</span>
                          <span className="font-medium">{classData.total_students}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Active Cases</span>
                          <span className="font-medium text-warning">{classData.wellbeing_metrics.active_cases}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avg Score</span>
                          <span className="font-medium">{classData.performance_metrics.average_assessment_score.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Assessments</span>
                          <span className="font-medium">{classData.performance_metrics.completed_assessments}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Observation Severity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Critical</span>
                        <Badge variant="destructive">{classData.wellbeing_metrics.observation_severity.critical}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">High</span>
                        <Badge variant="secondary">{classData.wellbeing_metrics.observation_severity.high}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Medium</span>
                        <Badge variant="outline">{classData.wellbeing_metrics.observation_severity.medium}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Low</span>
                        <Badge variant="default">{classData.wellbeing_metrics.observation_severity.low}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </>
              );
            })()
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a class to view detailed metrics</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Observations Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Observations</CardTitle>
          <CardDescription>Latest behavioral observations across your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(() => {
              // Create a set of student IDs from teacher's classes for efficient lookup
              const teacherStudentIds = new Set<string>();
              if (classesInsights?.classes) {
                classesInsights.classes.forEach(cls => {
                  cls.students.forEach(student => {
                    teacherStudentIds.add(String(student.student_id));
                  });
                });
              }
              
              // Filter observations to only show students in teacher's classes
              const filteredObservations = observationsData?.filter((observation: any) => 
                teacherStudentIds.has(String(observation.student_id))
              ) || [];
              
              return filteredObservations.length > 0 ? (
                filteredObservations.slice(0, 5).map((observation: any) => {
                  // Create a student map for efficient lookup
                  const studentMap = new Map(
                    allStudents.map(s => [String(s.student_id), s])
                  );
                  
                  // Try to find student by exact match
                  const student = studentMap.get(String(observation.student_id));
                  
                  // Get student name - search through classes
                  let studentName = student?.student_name;
                  
                  if (!studentName && classesInsights?.classes) {
                    for (const cls of classesInsights.classes) {
                      const foundStudent = cls.students.find(
                        s => String(s.student_id) === String(observation.student_id)
                      );
                      if (foundStudent) {
                        studentName = foundStudent.name;
                        break;
                      }
                    }
                  }
                  
                  return (
                    <div key={observation.observation_id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <p className="font-semibold text-base">{studentName}</p>
                            <p className="text-xs text-muted-foreground font-mono">ID: {String(observation.student_id).slice(0, 8)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={getRiskLevelColor(observation.severity || 'low')}
                          >
                            {formatRiskLevel(observation.severity || 'low')}
                          </Badge>
                          {!observation.processed && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Pending Review
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {observation.category || 'General'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(observation.timestamp).toLocaleDateString()} at {new Date(observation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {observation.content || observation.behavior_description || 'No description available'}
                      </p>
                      
                      {observation.reporter_name && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Reported by: {observation.reporter_name}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No recent observations
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click "Observe" next to any student to add an observation
                  </p>
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      <AddObservationModal
        open={isObservationModalOpen}
        onOpenChange={(open) => {
          setIsObservationModalOpen(open);
          if (!open) setSelectedStudent(null);
        }}
        onSubmit={(data) => {
          // Determine severity based on follow-up needed and share with counsellor flags
          let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
          if (data.shareWithCounsellor && data.followUpNeeded) {
            severity = 'HIGH';
          } else if (data.shareWithCounsellor || data.followUpNeeded) {
            severity = 'MEDIUM';
          }
          
          createObservation.mutate({
            student_id: data.studentId,
            reported_by: user!.id,
            severity: severity,
            category: data.context,
            content: data.content
          });
          
          setIsObservationModalOpen(false);
          setSelectedStudent(null);
        }}
        preselectedStudent={selectedStudent ? {
          id: selectedStudent.student_id,
          name: selectedStudent.student_name
        } : undefined}
      />

      <ViewStudentProfileModal
        open={isProfileModalOpen}
        onOpenChange={(open) => {
          setIsProfileModalOpen(open);
          if (!open) setSelectedStudent(null);
        }}
        student={selectedStudent}
      />
    </div>
  );
}
