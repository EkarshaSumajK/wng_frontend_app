import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types";
import { Heart, AlertTriangle, FileText, Loader2, User, Mail, Phone, Calendar, GraduationCap, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentsApi } from "@/services/students";
import { useObservations } from "@/hooks/useObservations";
import { useStudentAssessments } from "@/hooks/useAssessments";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ViewStudentProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export function ViewStudentProfileModal({ open, onOpenChange, student }: ViewStudentProfileModalProps) {
  // Fetch full student details from API
  const { data: fullStudentData, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student', student?.id],
    queryFn: () => studentsApi.getById(student!.id),
    enabled: !!student?.id && open,
  });

  // Fetch student observations
  const { data: observationsData = [] } = useObservations({ 
    student_id: student?.id,
  });

  // Fetch student assessments using the dedicated student assessments hook
  const { data: assessmentsData, isLoading: isLoadingAssessments } = useStudentAssessments(student?.id);

  if (!student) return null;

  // Use API data if available, otherwise use passed student data
  const studentData = fullStudentData || student;
  const studentObservations = observationsData || [];
  // The student assessments endpoint returns { student_id, student_name, total_assessments, overall_statistics, assessments: [...] }
  const studentAssessments = assessmentsData?.assessments || [];
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">Student Profile</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive student information and wellbeing data
              </p>
            </div>
          </div>
        </DialogHeader>

        {isLoadingStudent ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading student profile...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
          {/* Basic Info */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-background to-muted/20 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-semibold text-foreground">
                      {fullStudentData?.first_name && fullStudentData?.last_name 
                        ? `${fullStudentData.first_name} ${fullStudentData.last_name}`
                        : studentData.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Roll Number</p>
                    <p className="font-semibold font-mono text-foreground">
                      {fullStudentData?.roll_number || studentData.rollNumber || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Grade</p>
                    <p className="font-semibold text-foreground">
                      {fullStudentData?.grade || studentData.grade || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Gender</p>
                    <p className="font-semibold text-foreground capitalize">
                      {fullStudentData?.gender?.toLowerCase() || studentData.gender?.toLowerCase() || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                    <p className="font-semibold text-foreground">
                      {fullStudentData?.dob 
                        ? new Date(fullStudentData.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : studentData.dateOfBirth 
                          ? new Date(studentData.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Parent Email</p>
                    <p className="font-semibold text-foreground text-sm break-all">
                      {fullStudentData?.parent_email || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Parent Phone</p>
                    <p className="font-semibold text-foreground">
                      {fullStudentData?.parent_phone || studentData.parentContact || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Student ID</p>
                    <p className="font-semibold font-mono text-xs text-foreground break-all">
                      {fullStudentData?.student_id || studentData.id}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk & Wellbeing */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-background to-muted/20 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                Wellbeing Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 hover:shadow-md transition-all">
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Risk Level</p>
                  <Badge className={`${getRiskLevelColor(fullStudentData?.risk_level || studentData.riskLevel)} text-sm px-4 py-1.5`}>
                    {formatRiskLevel(fullStudentData?.risk_level || studentData.riskLevel)}
                  </Badge>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 hover:shadow-md transition-all">
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Wellbeing Score</p>
                  <p className={`text-3xl font-bold ${
                    ((fullStudentData?.wellbeing_score || studentData.wellbeingScore) || 0) >= 80 ? 'text-green-600' :
                    ((fullStudentData?.wellbeing_score || studentData.wellbeingScore) || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {fullStudentData?.wellbeing_score || studentData.wellbeingScore || 0}
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 hover:shadow-md transition-all">
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Consent Status</p>
                  <Badge variant={(fullStudentData?.consent_status || studentData.consentStatus)?.toLowerCase() === 'granted' ? 'default' : 'secondary'} className="text-sm px-4 py-1.5">
                    {fullStudentData?.consent_status || studentData.consentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment History */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-background to-muted/20 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Assessment History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoadingAssessments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : studentAssessments && studentAssessments.length > 0 ? (
                <div className="space-y-3">
                  {studentAssessments.slice(0, 5).map((assessment: any, index: number) => (
                    <div 
                      key={assessment.assessment_id} 
                      className="p-4 border-2 rounded-xl hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 hover:shadow-md"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{assessment.title || assessment.template_name || 'Assessment'}</p>
                          {assessment.template_name && assessment.title !== assessment.template_name && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {assessment.template_name}
                            </p>
                          )}
                          {assessment.category && (
                            <Badge variant="outline" className="mt-2 text-xs capitalize">
                              {assessment.category}
                            </Badge>
                          )}
                          <Separator className="my-2" />
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{assessment.completed_at ? new Date(assessment.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                            </div>
                            <span>•</span>
                            <span>{assessment.responses?.length || 0} questions</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          {assessment.total_score !== undefined && assessment.total_score !== null && (
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 min-w-[80px]">
                              <p className="text-xs text-muted-foreground mb-1">Score</p>
                              <p className="text-2xl font-bold text-primary">{assessment.total_score.toFixed(1)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {studentAssessments.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2 font-medium">
                      +{studentAssessments.length - 5} more assessments
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">No assessment records available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observation Summary */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-background to-muted/20 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                Recent Observations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {studentObservations && studentObservations.length > 0 ? (
                <div className="space-y-3">
                  {studentObservations.slice(0, 5).map((observation: any, index: number) => (
                    <div 
                      key={observation.observation_id} 
                      className="p-4 border-2 rounded-xl hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 hover:shadow-md"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={
                            observation.severity?.toLowerCase() === 'critical' ? 'destructive' :
                            observation.severity?.toLowerCase() === 'high' ? 'secondary' : 'default'
                          } className="capitalize font-semibold">
                            {observation.severity?.toLowerCase() || 'low'}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {observation.category || 'General'}
                          </Badge>
                          {!observation.processed && (
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                              Pending Review
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(observation.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(observation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <p className="text-sm leading-relaxed whitespace-pre-line">{observation.content || observation.behavior_description || 'No description'}</p>
                      {observation.reporter_name && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3 pt-3 border-t">
                          <User className="w-3 h-3" />
                          <span>Reported by: <span className="font-medium">{observation.reporter_name}</span></span>
                        </div>
                      )}
                    </div>
                  ))}
                  {studentObservations.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2 font-medium">
                      +{studentObservations.length - 5} more observations
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">No observations recorded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {(fullStudentData?.notes || studentData.notes) && (
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-background to-muted/20 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed whitespace-pre-line bg-muted/30 p-4 rounded-lg border">
                  {fullStudentData?.notes || studentData.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
