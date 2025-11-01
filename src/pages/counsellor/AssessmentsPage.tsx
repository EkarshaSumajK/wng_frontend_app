import { useState } from 'react';
import { Plus, Eye, Play, Users, Clock, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/shared/DataTable';
import { StatCard } from '@/components/shared/StatCard';
import { Assessment, AssessmentResponse } from '@/types';
import { CreateAssessmentModal } from '@/components/modals/CreateAssessmentModal';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useAssessments, 
  useAssessmentTemplates, 
  useCreateAssessment,
  useDeleteAssessment,
  useAssessment
} from '@/hooks/useAssessments';
import { useClasses } from '@/hooks/useClasses';

export default function AssessmentsPage() {
  const { user } = useAuth();
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch assessments for the school
  const { data: assessments = [], isLoading: assessmentsLoading } = useAssessments({
    school_id: user?.school_id
  });

  // Fetch templates
  const { data: templates = [], isLoading: templatesLoading } = useAssessmentTemplates({
    is_active: true
  });

  // Fetch classes for the school
  const { data: classes = [] } = useClasses({ school_id: user?.school_id });

  // Fetch selected assessment details
  const { data: selectedAssessment } = useAssessment(selectedAssessmentId || '') as { data: any };

  // Mutations
  const createAssessment = useCreateAssessment();
  const deleteAssessment = useDeleteAssessment();

  const handleCreateAssessment = (assessmentData: any) => {
    // Send assessment with questions directly to backend
    createAssessment.mutate({
      school_id: user?.school_id,
      class_id: assessmentData.classId || undefined,
      title: assessmentData.title,
      description: assessmentData.description,
      category: assessmentData.type,
      questions: assessmentData.questions.map((q: any) => ({
        question_id: q.id,
        question_text: q.question,
        question_type: q.type === 'multiple-choice' ? 'multiple_choice' : 
                       q.type === 'yes-no' ? 'yes_no' : 
                       q.type === 'scale' ? 'rating_scale' : 'text',
        required: q.required,
        answer_options: q.type === 'multiple-choice' ? 
          q.options?.map((opt: string, idx: number) => ({
            option_id: `opt_${idx}`,
            text: opt,
            value: idx + 1
          })) : undefined,
        min_value: q.type === 'scale' ? (q.scaleRange?.min || 1) : undefined,
        max_value: q.type === 'scale' ? (q.scaleRange?.max || 5) : undefined,
      })),
      created_by: user?.id,
      notes: assessmentData.description
    });
    
    setShowCreateModal(false);
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      deleteAssessment.mutate(assessmentId);
    }
  };



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
          <Badge variant="outline">{assessment.category}</Badge>
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
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedAssessmentId(assessment.assessment_id)}
      >
        <Eye className="w-3 h-3 mr-1" />
        View
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDeleteAssessment(assessment.assessment_id)}
      >
        <Trash2 className="w-3 h-3 mr-1" />
        Delete
      </Button>
    </div>
  );

  const responseActions = (response: AssessmentResponse) => (
    <Button
      variant="outline"
      size="sm"
    >
      <Eye className="w-3 h-3 mr-1" />
      Review
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
              <Badge variant="outline">{selectedAssessment.category}</Badge>
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
                  <p className="text-muted-foreground">{selectedAssessment.template_name || 'N/A'}</p>
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
                    <p className="text-muted-foreground">{selectedAssessment.student_results.length} students</p>
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
                            <Badge variant="outline">{question.question_type}</Badge>
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
                  <CardDescription>Responses from students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedAssessment.student_results.map((result: any) => (
                      <div key={result.student_id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{result.student_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Completed: {result.completed_at ? new Date(result.completed_at).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <Badge variant={result.total_score < 50 ? 'destructive' : result.total_score < 75 ? 'secondary' : 'default'}>
                            Score: {Math.round(result.total_score)}
                          </Badge>
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
                  <p className="text-sm text-muted-foreground break-all">{selectedAssessment.assessment_id}</p>
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
                    <p className="text-muted-foreground">{selectedAssessment.category}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    handleDeleteAssessment(selectedAssessment.assessment_id);
                    setSelectedAssessmentId(null);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Assessment
                </Button>
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
          <p className="text-muted-foreground">Create, manage, and review student assessments</p>
        </div>
        
        <Button 
          className="bg-gradient-primary hover:bg-primary-hover"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Total Assessments"
          value={assessmentsLoading ? '...' : assessments.length}
          icon={Users}
          subtitle="Available assessments"
        />
        
        <StatCard
          title="Templates Available"
          value={templatesLoading ? '...' : templates.length}
          icon={Play}
          variant="success"
          subtitle="Assessment templates"
        />
        
        <StatCard
          title="Active Templates"
          value={templatesLoading ? '...' : templates.filter((t: any) => t.is_active).length}
          icon={CheckCircle}
          variant="success"
          subtitle="Ready to use"
        />
        
        <StatCard
          title="Categories"
          value={templatesLoading ? '...' : new Set(templates.map((t: any) => t.category).filter(Boolean)).size}
          icon={Clock}
          subtitle="Template categories"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assessments">Assessment Library</TabsTrigger>
          <TabsTrigger value="responses">Student Responses</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments">
          {assessmentsLoading ? (
            <Card className="card-professional">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Loading assessments...</p>
              </CardContent>
            </Card>
          ) : (
            <DataTable
              data={assessments}
              columns={assessmentColumns}
              title="Assessment Library"
              searchPlaceholder="Search assessments..."
              onRowClick={(assessment: any) => setSelectedAssessmentId(assessment.assessment_id)}
              actions={assessmentActions}
            />
          )}
        </TabsContent>

        <TabsContent value="responses">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>Student Responses</CardTitle>
              <CardDescription>View and review student assessment responses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Student responses are available in the Cases page for each individual student.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>Assessment Templates</CardTitle>
              <CardDescription>Pre-built assessment templates for common scenarios</CardDescription>
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
                          <Badge variant="outline" className="w-fit">{template.category}</Badge>
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
                <p className="text-muted-foreground">No templates available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Assessment Modal */}
      <CreateAssessmentModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateAssessment}
        classes={classes}
      />
    </div>
  );
}