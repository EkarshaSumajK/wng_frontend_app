import { useState } from 'react';
import { Eye, Users, Clock, CheckCircle, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/shared/DataTable';
import { StatCard } from '@/components/shared/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useAssessments, 
  useAssessmentTemplates, 
  useAssessment
} from '@/hooks/useAssessments';
import { useTeacherClassesInsights } from '@/hooks/useTeachers';

export default function TeacherAssessmentsPage() {
  const { user } = useAuth();
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);

  // Fetch assessments for the school
  const { data: assessments = [], isLoading: assessmentsLoading } = useAssessments({
    school_id: user?.school_id
  });

  // Fetch templates
  const { data: templates = [], isLoading: templatesLoading } = useAssessmentTemplates({
    is_active: true
  });

  // Fetch teacher's classes to filter relevant assessments
  const { data: classesInsights } = useTeacherClassesInsights(user?.id);

  // Fetch selected assessment details
  const { data: selectedAssessment } = useAssessment(selectedAssessmentId || '') as { data: any };

  // Filter assessments to only show those for teacher's classes
  const teacherClassIds = new Set(classesInsights?.classes?.map(c => c.class_id) || []);
  const relevantAssessments = assessments.filter((a: any) => 
    !a.class_id || teacherClassIds.has(a.class_id)
  );

  // Calculate stats
  const completedAssessments = relevantAssessments.filter((a: any) => 
    a.students_completed && a.students_completed > 0
  ).length;

  const totalResponses = relevantAssessments.reduce((sum: number, a: any) => 
    sum + (a.students_completed || 0), 0
  );

  const assessmentColumns = [
    {
      key: 'title',
      label: 'Assessment',
      render: (assessment: any) => (
        <div>
          <p className="font-medium text-foreground">{assessment.title || 'Untitled Assessment'}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {assessment.template_name || assessment.notes || 'No description'}
          </p>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (assessment: any) => (
        assessment.category ? (
          <Badge variant="outline" className="capitalize">{assessment.category}</Badge>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )
      )
    },
    {
      key: 'class',
      label: 'Class',
      render: (assessment: any) => (
        <span className="text-sm">{assessment.class_name || 'School-wide'}</span>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (assessment: any) => (
        <span className="text-sm text-muted-foreground">
          {assessment.created_at ? new Date(assessment.created_at).toLocaleDateString() : 'N/A'}
        </span>
      )
    }
  ];

  const assessmentActions = (assessment: any) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setSelectedAssessmentId(assessment.assessment_id)}
    >
      <Eye className="w-3 h-3 mr-1" />
      View Details
    </Button>
  );

  if (selectedAssessmentId && selectedAssessment) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => setSelectedAssessmentId(null)}
              className="mb-2"
            >
              ← Back to Assessments
            </Button>
            <h1 className="text-3xl font-semibold text-foreground">
              {selectedAssessment.title || 'Assessment Details'}
            </h1>
            <p className="text-muted-foreground">{selectedAssessment.notes || 'No description'}</p>
          </div>
          <div className="flex gap-2">
            {selectedAssessment.category && (
              <Badge variant="outline" className="capitalize">{selectedAssessment.category}</Badge>
            )}
          </div>
        </div>

        {/* Assessment Details */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Assessment Information</CardTitle>
                <CardDescription>Details about this assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-medium">Template:</span>
                  <p className="text-muted-foreground">{selectedAssessment.template?.name || selectedAssessment.template_name || 'N/A'}</p>
                </div>
                {selectedAssessment.title && (
                  <div>
                    <span className="font-medium">Title:</span>
                    <p className="text-muted-foreground">{selectedAssessment.title}</p>
                  </div>
                )}
                {selectedAssessment.notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="text-muted-foreground">{selectedAssessment.notes}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Class:</span>
                  <p className="text-muted-foreground">{selectedAssessment.class_name || 'School-wide'}</p>
                </div>
                {selectedAssessment.student_results && selectedAssessment.student_results.length > 0 && (
                  <div>
                    <span className="font-medium">Student Responses:</span>
                    <p className="text-muted-foreground">{selectedAssessment.student_results.length} students completed</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedAssessment.template?.questions && selectedAssessment.template.questions.length > 0 && (
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>Assessment Questions</CardTitle>
                  <CardDescription>{selectedAssessment.template.questions.length} questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedAssessment.template.questions.map((question: any, index: number) => (
                      <div key={question.question_id || index} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="capitalize">
                              {question.question_type?.replace('_', ' ')}
                            </Badge>
                            {question.required && <Badge variant="secondary">Required</Badge>}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{question.question_text}</p>
                        
                        {question.answer_options && question.answer_options.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Answer Options:</p>
                            {question.answer_options.map((option: any, optIndex: number) => (
                              <div key={option.option_id || optIndex} className="text-sm text-muted-foreground pl-4">
                                • {option.text} {option.value !== undefined && `(${option.value})`}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {(question.min_value !== undefined || question.max_value !== undefined) && (
                          <div className="text-sm text-muted-foreground">
                            Scale: {question.min_value || 0} - {question.max_value || 5}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedAssessment.student_results && selectedAssessment.student_results.length > 0 && (
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>Student Results</CardTitle>
                  <CardDescription>Responses from students in your class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedAssessment.student_results.map((result: any) => (
                      <div key={result.student_id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{result.student_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Completed: {result.completed_at ? new Date(result.completed_at).toLocaleDateString() : 'N/A'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {result.responses?.length || 0} questions answered
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              result.total_score < 50 ? 'destructive' : 
                              result.total_score < 75 ? 'secondary' : 'default'
                            }>
                              Score: {Math.round(result.total_score)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-medium">Assessment ID:</span>
                  <p className="text-sm text-muted-foreground break-all font-mono">
                    {selectedAssessment.assessment_id?.slice(0, 8)}...
                  </p>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <p className="text-muted-foreground">
                    {new Date(selectedAssessment.created_at).toLocaleDateString()}
                  </p>
                </div>
                {selectedAssessment.category && (
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground capitalize">{selectedAssessment.category}</p>
                  </div>
                )}
                {selectedAssessment.student_results && (
                  <div>
                    <span className="font-medium">Completion Rate:</span>
                    <p className="text-muted-foreground">
                      {selectedAssessment.student_results.length} students
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-professional bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base">Teacher Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  As a teacher, you can view assessment details and student results for your classes. 
                  To create new assessments, please contact your school counsellor.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Assessments</h1>
          <p className="text-muted-foreground">View and monitor student assessments for your classes</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Total Assessments"
          value={assessmentsLoading ? '...' : relevantAssessments.length.toString()}
          icon={FileText}
          subtitle="For your classes"
        />
        
        <StatCard
          title="Completed"
          value={assessmentsLoading ? '...' : completedAssessments.toString()}
          icon={CheckCircle}
          variant="success"
          subtitle="With student responses"
        />
        
        <StatCard
          title="Student Responses"
          value={assessmentsLoading ? '...' : totalResponses.toString()}
          icon={Users}
          variant="success"
          subtitle="Total submissions"
        />
        
        <StatCard
          title="Templates"
          value={templatesLoading ? '...' : templates.length.toString()}
          icon={TrendingUp}
          subtitle="Available templates"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assessments">My Class Assessments</TabsTrigger>
          <TabsTrigger value="templates">Available Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments">
          {assessmentsLoading ? (
            <Card className="card-professional">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Loading assessments...</p>
              </CardContent>
            </Card>
          ) : relevantAssessments.length > 0 ? (
            <DataTable
              data={relevantAssessments}
              columns={assessmentColumns}
              title="Assessment Library"
              searchPlaceholder="Search assessments..."
              onRowClick={(assessment: any) => setSelectedAssessmentId(assessment.assessment_id)}
              actions={assessmentActions}
            />
          ) : (
            <Card className="card-professional">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2">No assessments available yet</p>
                <p className="text-sm text-muted-foreground">
                  Assessments will appear here once they are created by your school counsellor
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>Assessment Templates</CardTitle>
              <CardDescription>Pre-built assessment templates available at your school</CardDescription>
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <p className="text-muted-foreground">Loading templates...</p>
              ) : templates.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template: any) => (
                    <Card key={template.template_id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          {template.is_active && (
                            <Badge variant="default" className="ml-2">Active</Badge>
                          )}
                        </div>
                        {template.category && (
                          <Badge variant="outline" className="w-fit capitalize">{template.category}</Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.description || 'No description available'}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{template.questions?.length || 0}</span> questions
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No templates available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
