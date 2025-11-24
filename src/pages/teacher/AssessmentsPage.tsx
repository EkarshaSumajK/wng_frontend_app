import { useState, useMemo } from 'react';
import { Eye, Users, Clock, CheckCircle, FileText, TrendingUp, ArrowLeft, ClipboardList, BarChart3, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/shared/DataTable';
import { FilterSection } from '@/components/shared/FilterSection';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useAssessments, 
  useAssessmentTemplates, 
  useAssessment
} from '@/hooks/useAssessments';
import { useTeacherClassesInsights } from '@/hooks/useTeachers';
import { Separator } from '@/components/ui/separator';

export default function TeacherAssessmentsPage() {
  const { user } = useAuth();
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Extract unique categories
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    relevantAssessments.forEach((a: any) => {
      if (a.category) categories.add(a.category);
    });
    return Array.from(categories).sort();
  }, [relevantAssessments]);

  // Filter assessments
  const filteredAssessments = useMemo(() => {
    return relevantAssessments.filter((a: any) => {
      const matchesCategory = selectedCategories.length === 0 || (a.category && selectedCategories.includes(a.category));
      const matchesSearch = !searchQuery || 
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.template_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.class_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [relevantAssessments, selectedCategories, searchQuery]);

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
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
        {/* Header with modern design */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
          <Button
            variant="ghost"
            onClick={() => setSelectedAssessmentId(null)}
            className="mb-4 hover:bg-primary/10 hover:text-primary font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {selectedAssessment.title || 'Assessment Details'}
                </h1>
              </div>
              <p className="text-base text-muted-foreground ml-13">{selectedAssessment.notes || 'No description'}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {selectedAssessment.category && (
                <Badge variant="outline" className="text-sm px-3 py-1 font-semibold capitalize">{selectedAssessment.category}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Assessment Details */}
        <div className="grid lg:grid-cols-3 gap-6 relative z-10">
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-professional shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-background to-muted/20 border-b">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Assessment Information
                </CardTitle>
                <CardDescription>Details about this assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
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
              <Card className="card-professional shadow-lg border-2">
                <CardHeader className="bg-gradient-to-r from-background to-muted/20 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <ClipboardList className="w-4 h-4 text-white" />
                    </div>
                    Assessment Questions
                  </CardTitle>
                  <CardDescription>{selectedAssessment.template.questions.length} questions</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {selectedAssessment.template.questions.map((question: any, index: number) => (
                      <div key={question.question_id || index} className="p-4 border-2 rounded-xl hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                          <h4 className="font-semibold text-foreground">Question {index + 1}</h4>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="capitalize">
                              {question.question_type?.replace('_', ' ')}
                            </Badge>
                            {question.required && <Badge variant="secondary">Required</Badge>}
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <p className="text-sm leading-relaxed mb-3">{question.question_text}</p>
                        
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
              <Card className="card-professional shadow-lg border-2">
                <CardHeader className="bg-gradient-to-r from-background to-muted/20 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    Student Results
                  </CardTitle>
                  <CardDescription>Responses from students in your class</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {selectedAssessment.student_results.map((result: any, index: number) => (
                      <div 
                        key={result.student_id} 
                        className="p-4 border-2 rounded-xl hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 hover:shadow-md"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{result.student_name}</p>
                            <Separator className="my-2" />
                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{result.completed_at ? new Date(result.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                              </div>
                              <span>•</span>
                              <span>{result.responses?.length || 0} questions answered</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={`text-sm px-3 py-1.5 ${
                                result.total_score < 50 ? 'bg-red-500 hover:bg-red-600' : 
                                result.total_score < 75 ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                              } text-white`}
                            >
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
            <Card className="card-professional shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-background to-muted/20 border-b">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Assessment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
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

            <Card className="card-professional bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Teacher Note
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header with modern design */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Assessments
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">View and monitor student assessments for your classes</p>
          </div>
        </div>
      </div>

      {/* Stats Cards with enhanced design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="relative overflow-hidden border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Total Assessments</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">{assessmentsLoading ? '...' : relevantAssessments.length}</div>
            <p className="text-xs text-muted-foreground">For your classes</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Completed</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">{assessmentsLoading ? '...' : completedAssessments}</div>
            <p className="text-xs text-muted-foreground">With student responses</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Student Responses</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">{assessmentsLoading ? '...' : totalResponses}</div>
            <p className="text-xs text-muted-foreground">Total submissions</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Templates</CardTitle>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">{templatesLoading ? '...' : templates.length}</div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-gray-900">Filters</h3>
            </div>
            
            {uniqueCategories.length > 0 && (
              <FilterSection 
                title="Category" 
                options={uniqueCategories} 
                selected={selectedCategories} 
                setSelected={setSelectedCategories} 
              />
            )}

            <Button 
              variant="outline" 
              className="w-full mt-6 text-gray-500 hover:text-primary border-dashed"
              onClick={() => {
                setSelectedCategories([]);
                setSearchQuery('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessments by title, class, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white border-gray-200 focus:border-primary rounded-xl"
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
                <Card className="card-professional shadow-lg">
                  <CardContent className="py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading assessments...</p>
                  </CardContent>
                </Card>
              ) : filteredAssessments.length > 0 ? (
                <DataTable
                  data={filteredAssessments}
                  columns={assessmentColumns}
                  title="Assessment Library"
                  searchPlaceholder="Search assessments..."
                  onRowClick={(assessment: any) => setSelectedAssessmentId(assessment.assessment_id)}
                  actions={assessmentActions}
                  searchable={false}
                />
              ) : (
                <Card className="card-professional shadow-lg">
                  <CardContent className="py-12 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-base text-muted-foreground font-semibold mb-2">No assessments available yet</p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery || selectedCategories.length > 0
                        ? 'Try adjusting your filters'
                        : 'Assessments will appear here once they are created by your school counsellor'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="templates">
              <Card className="card-professional shadow-lg border-2">
                <CardHeader className="bg-gradient-to-r from-background to-muted/20 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <ClipboardList className="w-4 h-4 text-white" />
                    </div>
                    Assessment Templates
                  </CardTitle>
                  <CardDescription>Pre-built assessment templates available at your school</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
              {templatesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading templates...</p>
                </div>
              ) : templates.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template: any, index: number) => (
                    <Card 
                      key={template.template_id} 
                      className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base font-bold">{template.name}</CardTitle>
                          {template.is_active && (
                            <Badge variant="default" className="ml-2 bg-green-500">Active</Badge>
                          )}
                        </div>
                        {template.category && (
                          <Badge variant="outline" className="w-fit capitalize mt-2">{template.category}</Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <Separator className="mb-3" />
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {template.description || 'No description available'}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold text-foreground">{template.questions?.length || 0}</span>
                          <span className="text-muted-foreground">questions</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-base text-muted-foreground font-semibold">No templates available yet</p>
                </div>
              )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
