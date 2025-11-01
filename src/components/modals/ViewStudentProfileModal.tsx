import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types";
import { Heart, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentsApi } from "@/services/students";
import { useObservations } from "@/hooks/useObservations";
import { useStudentAssessments } from "@/hooks/useAssessments";
import { getRiskLevelColor, formatRiskLevel } from "@/lib/utils";

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
  
  console.log('Student Assessments Data:', assessmentsData);
  console.log('Processed Assessments:', studentAssessments);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
        </DialogHeader>

        {isLoadingStudent ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {fullStudentData?.first_name && fullStudentData?.last_name 
                      ? `${fullStudentData.first_name} ${fullStudentData.last_name}`
                      : studentData.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roll Number</p>
                  <p className="font-medium font-mono">
                    {fullStudentData?.roll_number || studentData.rollNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className="font-medium">
                    {fullStudentData?.grade || studentData.grade || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">
                    {fullStudentData?.gender?.toLowerCase() || studentData.gender?.toLowerCase() || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {fullStudentData?.dob 
                      ? new Date(fullStudentData.dob).toLocaleDateString()
                      : studentData.dateOfBirth 
                        ? new Date(studentData.dateOfBirth).toLocaleDateString()
                        : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parent Email</p>
                  <p className="font-medium text-sm">
                    {fullStudentData?.parent_email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parent Phone</p>
                  <p className="font-medium text-sm">
                    {fullStudentData?.parent_phone || studentData.parentContact || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium font-mono text-xs">
                    {fullStudentData?.student_id || studentData.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk & Wellbeing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Wellbeing Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                  <Badge className={getRiskLevelColor(fullStudentData?.risk_level || studentData.riskLevel)}>
                    {formatRiskLevel(fullStudentData?.risk_level || studentData.riskLevel)}
                  </Badge>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Wellbeing Score</p>
                  <p className={`text-2xl font-bold ${
                    ((fullStudentData?.wellbeing_score || studentData.wellbeingScore) || 0) >= 80 ? 'text-success' :
                    ((fullStudentData?.wellbeing_score || studentData.wellbeingScore) || 0) >= 60 ? 'text-warning' : 'text-destructive'
                  }`}>
                    {fullStudentData?.wellbeing_score || studentData.wellbeingScore || 'N/A'}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Consent Status</p>
                  <Badge variant={(fullStudentData?.consent_status || studentData.consentStatus)?.toLowerCase() === 'granted' ? 'default' : 'secondary'} className="text-base">
                    {fullStudentData?.consent_status || studentData.consentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Assessment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAssessments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : studentAssessments && studentAssessments.length > 0 ? (
                <div className="space-y-3">
                  {studentAssessments.slice(0, 5).map((assessment: any) => (
                    <div key={assessment.assessment_id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{assessment.title || assessment.template_name || 'Assessment'}</p>
                          {assessment.template_name && assessment.title !== assessment.template_name && (
                            <p className="text-sm text-muted-foreground">
                              {assessment.template_name}
                            </p>
                          )}
                          {assessment.category && (
                            <Badge variant="outline" className="mt-1 text-xs capitalize">
                              {assessment.category}
                            </Badge>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Completed: {assessment.completed_at ? new Date(assessment.completed_at).toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {assessment.responses?.length || 0} questions answered
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          {assessment.total_score !== undefined && assessment.total_score !== null && (
                            <div>
                              <p className="text-sm text-muted-foreground">Score</p>
                              <p className="text-2xl font-bold">{assessment.total_score.toFixed(1)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {studentAssessments.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{studentAssessments.length - 5} more assessments
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No assessment records available</p>
              )}
            </CardContent>
          </Card>

          {/* Observation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Recent Observations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentObservations && studentObservations.length > 0 ? (
                <div className="space-y-3">
                  {studentObservations.slice(0, 5).map((observation: any) => (
                    <div key={observation.observation_id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            observation.severity?.toLowerCase() === 'critical' ? 'destructive' :
                            observation.severity?.toLowerCase() === 'high' ? 'secondary' : 'default'
                          } className="capitalize">
                            {observation.severity?.toLowerCase() || 'low'}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{observation.category || 'General'}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(observation.timestamp).toLocaleDateString()} {new Date(observation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className="text-sm whitespace-pre-line">{observation.content || observation.behavior_description || 'No description'}</p>
                      {observation.reporter_name && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Reported by: {observation.reporter_name}
                        </p>
                      )}
                      {!observation.processed && (
                        <Badge variant="secondary" className="mt-2">Pending Review</Badge>
                      )}
                    </div>
                  ))}
                  {studentObservations.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{studentObservations.length - 5} more observations
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No observations recorded</p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {(fullStudentData?.notes || studentData.notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{fullStudentData?.notes || studentData.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
