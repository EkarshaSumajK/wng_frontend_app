import { useState } from "react";
import { Users, BookOpen, Eye, AlertTriangle, Heart, MessageSquare, Activity, Clock, TrendingUp, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AddObservationModal } from "@/components/modals/AddObservationModal";
import { ViewStudentProfileModal } from "@/components/modals/ViewStudentProfileModal";
import { useAuth } from "@/contexts/AuthContext";
import { useTeacherDashboard, useTeacherClassesInsights } from "@/hooks/useTeachers";
import { useObservations, useCreateObservation } from "@/hooks/useObservations";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { AnimatedBackground } from "@/components/ui/animated-background";

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

  const getWellbeingColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  if (isDashboardLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
      <AnimatedBackground />
      {/* Header with modern design */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100/50 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Good morning, {user?.name || 'Teacher'}
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">Here's your classroom wellbeing overview</p>
          </div>
          <Badge variant="secondary" className="w-fit">
            <Clock className="w-3 h-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* Stats Cards with enhanced design */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="relative overflow-hidden border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Students</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-green-300 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Wellbeing</CardTitle>
              <Heart className="w-4 h-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{avgWellbeing.toFixed(0)}%</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-yellow-300 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">At Risk</CardTitle>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{totalAtRisk}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Cases</CardTitle>
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.overview?.active_cases || 0}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Observations</CardTitle>
              <Eye className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentObservations}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Assessments</CardTitle>
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.recent_activity_30_days?.assessments_completed || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* My Classes Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-2 hover:border-blue-200 transition-all duration-300 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">My Classes</CardTitle>
                    <CardDescription className="text-sm">Click on a class to view detailed metrics</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {classesInsights?.classes?.length || 0} Classes
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {classesInsights?.classes && classesInsights.classes.length > 0 ? (
                  classesInsights.classes.map((classData, index) => {
                    const wellbeingPercentage = classData.total_students > 0
                      ? ((classData.total_students - classData.wellbeing_metrics.active_cases) / classData.total_students * 100)
                      : 100;
                    
                    return (
                      <div 
                        key={classData.class_id}
                        className={`group p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                          selectedClass === classData.class_id 
                            ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 border-primary shadow-md' 
                            : 'border-border hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-900/20'
                        }`}
                        onClick={() => setSelectedClass(classData.class_id)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-lg">{classData.class_name}</h3>
                          <Badge 
                            variant={classData.wellbeing_metrics.active_cases > 3 ? 'destructive' : classData.wellbeing_metrics.active_cases > 0 ? 'secondary' : 'default'}
                            className="font-semibold"
                          >
                            {classData.wellbeing_metrics.active_cases} at risk
                          </Badge>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center text-sm mb-1.5">
                              <span className="text-muted-foreground font-medium">Wellbeing Index</span>
                              <span className={`font-bold ${getWellbeingColor(wellbeingPercentage)}`}>
                                {wellbeingPercentage.toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={wellbeingPercentage} className="h-2.5" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center text-sm mb-1.5">
                              <span className="text-muted-foreground font-medium">Avg Assessment Score</span>
                              <span className={`font-bold ${getWellbeingColor(classData.performance_metrics.average_assessment_score)}`}>
                                {classData.performance_metrics.average_assessment_score.toFixed(1)}
                              </span>
                            </div>
                            <Progress value={classData.performance_metrics.average_assessment_score} className="h-2.5" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span className="font-semibold">{classData.total_students}</span> students
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            <span className="font-semibold">{classData.performance_metrics.completed_assessments}</span> assessments
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      No classes assigned yet
                    </p>
                  </div>
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
                  // Simple direct lookup - search through all classes for the student
                  let studentName = observation.student_name || observation.student?.name;
                  
                  if (!studentName && classesInsights?.classes) {
                    // Search through all classes to find the student
                    for (const cls of classesInsights.classes) {
                      const foundStudent = cls.students.find(
                        (s: any) => s.student_id === observation.student_id
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
                            <p className="font-semibold text-base">{studentName || 'Unknown Student'}</p>
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
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
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
