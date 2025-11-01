import { useState } from 'react';
import { Plus, Eye, Clock, AlertTriangle, FileText, Target, Users, Phone, Pencil, Trash2, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable } from '@/components/shared/DataTable';
import { Case } from '@/types';
import { NewCaseModal } from '@/components/modals/NewCaseModal';
import { AddNoteModal } from '@/components/modals/AddNoteModal';
import { AddGoalModal } from '@/components/modals/AddGoalModal';
import { AssignAssessmentModal } from '@/components/modals/AssignAssessmentModal';
import { ScheduleCaseSessionModal } from '@/components/modals/ScheduleCaseSessionModal';
import { useCases, useCreateCase, useUpdateCase } from '@/hooks/useCases';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionNotes, useCreateSessionNote, useUpdateSessionNote, useDeleteSessionNote } from '@/hooks/useSessionNotes';
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '@/hooks/useGoals';
import { useAssessments, useStudentAssessments, useCreateAssessment, useDeleteAssessment, useExcludeStudent, useIncludeStudent } from '@/hooks/useAssessments';
import { useActivities } from '@/hooks/useActivities';
import { getRiskLevelColor, formatRiskLevel } from '@/lib/utils';

const activityTypeLabels: Record<string, string> = {
  MINDFULNESS: 'Mindfulness',
  SOCIAL_SKILLS: 'Social Skills',
  EMOTIONAL_REGULATION: 'Emotional Regulation',
  ACADEMIC_SUPPORT: 'Academic Support',
  TEAM_BUILDING: 'Team Building',
};

const activityTypeColors: Record<string, string> = {
  MINDFULNESS: 'bg-purple-100 text-purple-800 border-purple-200',
  SOCIAL_SKILLS: 'bg-blue-100 text-blue-800 border-blue-200',
  EMOTIONAL_REGULATION: 'bg-green-100 text-green-800 border-green-200',
  ACADEMIC_SUPPORT: 'bg-orange-100 text-orange-800 border-orange-200',
  TEAM_BUILDING: 'bg-pink-100 text-pink-800 border-pink-200',
};

export default function CasesPage() {
  const { user } = useAuth();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [showAssignAssessmentModal, setShowAssignAssessmentModal] = useState(false);
  const [showScheduleSessionModal, setShowScheduleSessionModal] = useState(false);

  // Fetch cases from API
  const { data: casesResponse = [], isLoading } = useCases({ 
    assigned_counsellor: user?.id 
  });
  const createCaseMutation = useCreateCase();
  const updateCaseMutation = useUpdateCase();

  // Transform the API response to match the expected format
  const cases = Array.isArray(casesResponse) ? casesResponse.map((item: any) => ({
    ...item.case,
    student: item.student,
    teacher: item.teacher,
    counsellor: item.counsellor,
    parents: item.parents
  })) : [];

  // Fetch data for selected case (hooks must be at top level)
  const { data: sessionNotesData = [] } = useSessionNotes(
    selectedCase ? (selectedCase as any).case_id : undefined
  );
  const { data: goalsData = [] } = useGoals(
    selectedCase ? (selectedCase as any).case_id : undefined
  );
  const { data: studentAssessmentsResponse } = useStudentAssessments(
    selectedCase ? (selectedCase as any).student_id : undefined
  );
  const assessmentsData = studentAssessmentsResponse?.assessments || [];
  
  // Fetch class assessments (assigned but not yet completed)
  const { data: classAssessments = [] } = useAssessments({
    school_id: user?.school_id,
  });
  
  // Fetch activities for recommendations
  const { data: activities = [] } = useActivities({
    school_id: user?.school_id,
  });
  
  const createSessionNote = useCreateSessionNote();
  const updateSessionNote = useUpdateSessionNote();
  const deleteSessionNote = useDeleteSessionNote();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const createAssessment = useCreateAssessment();
  const deleteAssessment = useDeleteAssessment();
  const excludeStudent = useExcludeStudent();
  const includeStudent = useIncludeStudent();

  const handleNewCase = async (caseData: any) => {
    const riskLevel = (caseData.priority || 'medium').toUpperCase();
    
    try {
      // Create the case
      const newCase = await createCaseMutation.mutateAsync({
        student_id: caseData.studentId,
        created_by: user?.id || '',
        presenting_concerns: caseData.summary || caseData.initialNotes,
        initial_risk: riskLevel as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
      });
      
      // Immediately assign the counsellor using the update mutation
      if (newCase && (newCase as any).case_id && caseData.assignedCounsellor) {
        await updateCaseMutation.mutateAsync({
          id: (newCase as any).case_id,
          data: {
            assigned_counsellor: caseData.assignedCounsellor
          }
        });
      }
      
      setShowNewCaseModal(false);
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const handleAddNote = (noteData: any) => {
    if (!selectedCase) return;
    
    if (editingNote) {
      // Update existing note
      updateSessionNote.mutate({
        id: editingNote.session_note_id,
        data: {
          date: noteData.date ? `${noteData.date}T00:00:00` : undefined,
          duration: noteData.duration,
          type: noteData.type,
          summary: noteData.summary,
          interventions: noteData.interventions,
          next_steps: noteData.nextSteps
        }
      });
      setEditingNote(null);
    } else {
      // Create new note
      createSessionNote.mutate({
        case_id: (selectedCase as any).case_id,
        counsellor_id: user?.id || '',
        date: noteData.date ? `${noteData.date}T00:00:00` : new Date().toISOString(),
        duration: noteData.duration || 45,
        type: noteData.type || 'INDIVIDUAL',
        summary: noteData.summary || '',
        interventions: noteData.interventions || [],
        next_steps: noteData.nextSteps || []
      });
    }
    setShowAddNoteModal(false);
  };

  const handleAssignAssessment = (assessmentData: any) => {
    if (!selectedCase) return;
    
    createAssessment.mutate({
      ...assessmentData,
      created_by: user?.id
    });
    setShowAssignAssessmentModal(false);
  };

  const handleAddGoal = (goalData: any) => {
    if (!selectedCase) return;
    
    if (editingGoal) {
      // Update existing goal
      updateGoal.mutate({
        id: editingGoal.goal_id,
        data: {
          title: goalData.title,
          description: goalData.description || '',
          target_date: goalData.targetDate ? `${goalData.targetDate}T00:00:00` : '',
        }
      });
      setEditingGoal(null);
    } else {
      // Create new goal
      createGoal.mutate({
        case_id: (selectedCase as any).case_id,
        title: goalData.title,
        description: goalData.description || '',
        target_date: goalData.targetDate ? `${goalData.targetDate}T00:00:00` : '',
        status: 'NOT_STARTED',
        progress: goalData.progress || 0
      });
    }
    setShowAddGoalModal(false);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'intake':
        return 'bg-primary text-primary-foreground';
      case 'assessment':
        return 'bg-info text-info-foreground';
      case 'intervention':
        return 'bg-warning text-warning-foreground';
      case 'monitoring':
        return 'bg-accent text-accent-foreground';
      case 'closed':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const caseColumns = [
    {
      key: 'student',
      label: 'Student',
      render: (case_: any) => (
        <div>
          <p className="font-medium text-foreground">
            {case_.student?.first_name} {case_.student?.last_name}
          </p>
          <p className="text-sm text-muted-foreground">ID: {case_.student_id}</p>
        </div>
      )
    },
    {
      key: 'risk_level',
      label: 'Risk Level',
      render: (case_: any) => (
        <Badge className={getRiskLevelColor(case_.risk_level)}>
          {formatRiskLevel(case_.risk_level)}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (case_: any) => (
        <Badge className={getStatusColor(case_.status)} variant="secondary">
          {case_.status}
        </Badge>
      )
    },
    {
      key: 'ai_summary',
      label: 'Summary',
      render: (case_: any) => (
        <p className="text-sm line-clamp-2 max-w-md">{case_.ai_summary || 'No summary available'}</p>
      )
    }
  ];

  const caseActions = (case_: Case) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setSelectedCase(case_)}
    >
      <Eye className="w-3 h-3 mr-1" />
      View
    </Button>
  );

  if (selectedCase) {
    const caseSessionNotes = sessionNotesData;
    const caseGoals = goalsData;
    const caseAssessments = assessmentsData;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => setSelectedCase(null)}
              className="mb-2"
            >
              ← Back to Cases
            </Button>
            <h1 className="text-3xl font-semibold text-foreground">
              Case: {(selectedCase as any).student?.first_name} {(selectedCase as any).student?.last_name}
            </h1>
            <p className="text-muted-foreground">
              Case ID: {(selectedCase as any).case_id} • Assigned to {(selectedCase as any).counsellor?.display_name || 'Unassigned'}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className={getRiskLevelColor((selectedCase as any).risk_level)}>
              {formatRiskLevel((selectedCase as any).risk_level)} risk
            </Badge>
            <Badge className={getStatusColor((selectedCase as any).status)} variant="secondary">
              {(selectedCase as any).status}
            </Badge>
          </div>
        </div>

        {/* Case Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>Case Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground">{(selectedCase as any).ai_summary || 'No summary available'}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Created:</span>
                      <p className="text-muted-foreground">
                        {(selectedCase as any).created_at ? new Date((selectedCase as any).created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <p className="text-muted-foreground">
                        {(selectedCase as any).updated_at ? new Date((selectedCase as any).updated_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Student ID:</span>
                      <p className="text-muted-foreground">{(selectedCase as any).student_id}</p>
                    </div>
                    <div>
                      <span className="font-medium">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {((selectedCase as any).tags || []).map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowScheduleSessionModal(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Session
                  </Button>
                  {/* <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Consult with Expert
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Parent/Guardian
                  </Button> */}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Session Notes</h3>
              <Button onClick={() => setShowAddNoteModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>

            <div className="space-y-4">
              {caseSessionNotes.length > 0 ? (
                caseSessionNotes.map((note: any) => (
                  <Card key={note.session_note_id || note.id} className="card-professional">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {note.type?.replace(/_/g, ' ').split(' ').map((word: string) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')} Session
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {note.date ? new Date(note.date).toLocaleDateString() : 'N/A'} • {note.duration || 0} min
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingNote(note);
                              setShowAddNoteModal(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this session note?')) {
                                deleteSessionNote.mutate(note.session_note_id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Summary</h4>
                        <p className="text-sm text-muted-foreground">{note.summary}</p>
                      </div>
                      
                      {note.interventions && note.interventions.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Interventions Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {note.interventions.map((intervention: string, index: number) => (
                              <Badge key={index} variant="outline">{intervention}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {note.next_steps && note.next_steps.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Next Steps</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {note.next_steps.map((step: string, index: number) => (
                              <li key={index}>• {step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="card-professional">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No session notes recorded yet
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setShowAssignAssessmentModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Assign Assessment
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {(studentAssessmentsResponse?.total_assessments || 0) + 
                     classAssessments.filter((a: any) => a.class_id === (selectedCase as any).student?.class_id).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Assessments</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {classAssessments.filter((a: any) => a.class_id === (selectedCase as any).student?.class_id).length} pending, {studentAssessmentsResponse?.total_assessments || 0} completed
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {studentAssessmentsResponse?.overall_statistics.average_score?.toFixed(1) || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">Average Score</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {studentAssessmentsResponse?.total_assessments ? 'From completed' : 'No data yet'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {studentAssessmentsResponse?.overall_statistics.min_score?.toFixed(1) || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">Lowest Score</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {studentAssessmentsResponse?.total_assessments ? 'From completed' : 'No data yet'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {studentAssessmentsResponse?.overall_statistics.max_score?.toFixed(1) || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">Highest Score</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {studentAssessmentsResponse?.total_assessments ? 'From completed' : 'No data yet'}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Assessments</CardTitle>
                <CardDescription>Assigned and completed assessments for this student</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Show assigned assessments (from class) */}
                  {classAssessments.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Assigned Assessments</h4>
                      {classAssessments
                        .filter((assessment: any) => 
                          assessment.class_id === (selectedCase as any).student?.class_id
                        )
                        .map((assessment: any) => (
                          <div key={assessment.assessment_id} className="p-4 border border-border rounded-lg bg-muted/30">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{assessment.title || assessment.template_name}</h4>
                                {assessment.category && (
                                  <Badge variant="outline" className="mt-1">{assessment.category}</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {assessment.excluded_students?.includes((selectedCase as any).student_id) ? (
                                  <>
                                    <Badge variant="outline" className="border-muted-foreground">Excluded</Badge>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        includeStudent.mutate({
                                          assessmentId: assessment.assessment_id,
                                          studentId: (selectedCase as any).student_id
                                        });
                                      }}
                                    >
                                      Include Student
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Badge variant="secondary">Pending</Badge>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        if (confirm('Exclude this student from this assessment? They will not be able to complete it.')) {
                                          excludeStudent.mutate({
                                            assessmentId: assessment.assessment_id,
                                            studentId: (selectedCase as any).student_id
                                          });
                                        }
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Assigned to class: {assessment.created_at ? new Date(assessment.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                            {assessment.notes && (
                              <p className="text-sm text-muted-foreground mt-2">{assessment.notes}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              {assessment.excluded_students?.includes((selectedCase as any).student_id)
                                ? 'This student has been excluded from this assessment.'
                                : 'This assessment is assigned to the entire class. Click the trash icon to exclude this student.'}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                  
                  {/* Show completed assessments */}
                  {caseAssessments.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Completed Assessments</h4>
                      {caseAssessments.map((assessment: any) => (
                      <div key={assessment.assessment_id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{assessment.template_name}</h4>
                            {assessment.category && (
                              <Badge variant="outline" className="mt-1">{assessment.category}</Badge>
                            )}
                          </div>
                          <Badge variant={assessment.total_score < 50 ? 'destructive' : assessment.total_score < 75 ? 'secondary' : 'default'}>
                            Score: {Math.round(assessment.total_score)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                          <div>
                            <span className="text-muted-foreground">Total Score:</span>
                            <p className="font-medium">{Math.round(assessment.total_score)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Completed:</span>
                            <p className="text-muted-foreground">
                              {assessment.completed_at 
                                ? new Date(assessment.completed_at).toLocaleDateString()
                                : 'In Progress'}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Responses:</span>
                            <p className="text-muted-foreground">
                              {assessment.responses?.length || 0} questions
                            </p>
                          </div>
                        </div>
                        {assessment.title && (
                          <p className="text-sm text-muted-foreground mt-2">{assessment.title}</p>
                        )}
                      </div>
                      ))}
                    </div>
                  )}
                  
                  {caseAssessments.length === 0 && classAssessments.filter((a: any) => a.class_id === (selectedCase as any).student?.class_id).length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No assessments assigned yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Treatment Goals</h3>
              <Button onClick={() => setShowAddGoalModal(true)}>
                <Target className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>

            <div className="grid gap-4">
              {caseGoals.length > 0 ? (
                caseGoals.map((goal: any) => (
                  <Card key={goal.goal_id || goal.id} className="card-professional">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{goal.title}</CardTitle>
                        <Badge 
                          variant="outline"
                          className={
                            goal.status === 'COMPLETED' ? 'border-success text-success' :
                            goal.status === 'IN_PROGRESS' ? 'border-warning text-warning' :
                            'border-muted text-muted-foreground'
                          }
                        >
                          {goal.status?.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{goal.description}</p>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Target Date: {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'Not set'}</span>
                        <span>Created: {goal.created_at ? new Date(goal.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingGoal(goal);
                            setShowAddGoalModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        {goal.status !== 'COMPLETED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              updateGoal.mutate({
                                id: goal.goal_id,
                                data: {
                                  status: 'COMPLETED',
                                  progress: 100
                                }
                              });
                            }}
                            className="flex-1"
                          >
                            <Target className="w-3 h-3 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                        {goal.status === 'COMPLETED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              updateGoal.mutate({
                                id: goal.goal_id,
                                data: {
                                  status: 'IN_PROGRESS',
                                  progress: 90
                                }
                              });
                            }}
                            className="flex-1"
                          >
                            Reopen Goal
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the goal "${goal.title}"?`)) {
                              deleteGoal.mutate(goal.goal_id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="card-professional">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No goals set yet
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recommended Activities</h3>
              <Badge variant="outline">{activities.length} available</Badge>
            </div>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Wellbeing Activities
                </CardTitle>
                <CardDescription>
                  Activities that may help support this student's wellbeing and treatment goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {activities.slice(0, 6).map((activity: any) => (
                      <div 
                        key={activity.activity_id} 
                        className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedActivity(activity)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{activity.title}</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {activityTypeLabels[activity.type] || activity.type?.replace(/_/g, ' ')}
                              </Badge>
                              {activity.duration && (
                                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {activity.duration} min
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {activity.description || 'No description available'}
                        </p>
                        {activity.objectives && activity.objectives.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Objectives:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {activity.objectives.slice(0, 2).map((obj: string, idx: number) => (
                                <li key={idx}>• {obj}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-3 h-3 mr-2" />
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No activities available. Create activities in the Activities section.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Activity Tracking - Coming Soon
            <Card className="card-professional bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base">Activity Tracking</CardTitle>
                <CardDescription>
                  Track which activities have been used with this student
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Activity tracking feature coming soon. You'll be able to log which activities were completed, 
                  student engagement levels, and outcomes.
                </p>
                <Button variant="outline" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Log Activity (Coming Soon)
                </Button>
              </CardContent>
            </Card>
            */}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <AddNoteModal
          open={showAddNoteModal}
          onOpenChange={(open) => {
            setShowAddNoteModal(open);
            if (!open) setEditingNote(null);
          }}
          onSubmit={handleAddNote}
          initialData={editingNote ? {
            date: editingNote.date ? editingNote.date.split('T')[0] : '',
            duration: editingNote.duration?.toString() || '',
            type: editingNote.type || '',
            summary: editingNote.summary || '',
            interventions: editingNote.interventions?.join(', ') || '',
            nextSteps: editingNote.next_steps?.join('\n') || ''
          } : undefined}
          isEditing={!!editingNote}
        />
        <AddGoalModal
          open={showAddGoalModal}
          onOpenChange={(open) => {
            setShowAddGoalModal(open);
            if (!open) setEditingGoal(null);
          }}
          onSubmit={handleAddGoal}
          initialData={editingGoal ? {
            title: editingGoal.title,
            description: editingGoal.description,
            targetDate: editingGoal.target_date ? editingGoal.target_date.split('T')[0] : '',
            progress: editingGoal.progress || 0
          } : undefined}
          isEditing={!!editingGoal}
        />
        <AssignAssessmentModal
          open={showAssignAssessmentModal}
          onOpenChange={setShowAssignAssessmentModal}
          onSubmit={handleAssignAssessment}
          schoolId={user?.school_id || ''}
          studentId={selectedCase ? (selectedCase as any).student_id : undefined}
          classId={selectedCase ? (selectedCase as any).student?.class_id : undefined}
        />
        <ScheduleCaseSessionModal
          open={showScheduleSessionModal}
          onOpenChange={setShowScheduleSessionModal}
          studentId={selectedCase ? (selectedCase as any).student_id : ''}
          studentName={selectedCase ? `${(selectedCase as any).student?.first_name} ${(selectedCase as any).student?.last_name}` : ''}
          caseId={selectedCase ? (selectedCase as any).case_id : undefined}
        />

        {/* Activity Detail Modal */}
        {selectedActivity && (
          <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedActivity.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={activityTypeColors[selectedActivity.type]}>
                      {activityTypeLabels[selectedActivity.type]}
                    </Badge>
                    {selectedActivity.duration && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedActivity.duration} minutes
                      </Badge>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Description */}
                {selectedActivity.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{selectedActivity.description}</p>
                  </div>
                )}

                {/* Objectives */}
                {selectedActivity.objectives && selectedActivity.objectives.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Learning Objectives</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedActivity.objectives.map((obj: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground">{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Target Grades */}
                {selectedActivity.target_grades && selectedActivity.target_grades.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Target Grades</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.target_grades.map((grade: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          Grade {grade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {selectedActivity.materials && selectedActivity.materials.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Materials Needed</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedActivity.materials.map((material: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground">{material}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructions */}
                {selectedActivity.instructions && selectedActivity.instructions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Instructions</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      {selectedActivity.instructions.map((instruction: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground">{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Case Management</h1>
          <p className="text-muted-foreground">Manage and track all active student cases</p>
        </div>
        
        <Button 
          className="bg-gradient-primary hover:bg-primary-hover"
          onClick={() => setShowNewCaseModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.length}</div>
            <p className="text-xs text-muted-foreground">
              Active cases
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cases.filter(c => c.risk_level === 'CRITICAL').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cases.filter(c => c.status === 'intervention').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active treatment
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <BookOpen className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">
              Available resources
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cases Table */}
      {isLoading ? (
        <Card className="card-professional">
          <CardContent className="py-8 text-center text-muted-foreground">
            Loading cases...
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={cases}
          columns={caseColumns}
          title="All Cases"
          searchPlaceholder="Search cases..."
          onRowClick={setSelectedCase}
          actions={caseActions}
        />
      )}

      {/* Modals */}
      <NewCaseModal
        open={showNewCaseModal}
        onOpenChange={setShowNewCaseModal}
        onSubmit={handleNewCase}
      />
    </div>
  );
}