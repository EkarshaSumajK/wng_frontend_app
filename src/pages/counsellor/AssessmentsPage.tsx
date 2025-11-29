import { useState, useMemo } from 'react';
import { Plus, Eye, Play, Users, Clock, CheckCircle, AlertCircle, Trash2, ClipboardList, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/shared/DataTable';
import { Assessment, AssessmentResponse } from '@/types';
import { Input } from '@/components/ui/input';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AssessmentsPage() {
  const { user } = useAuth();
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
  const { data: selectedAssessment, isLoading: selectedAssessmentLoading } = useAssessment(
    selectedAssessmentId || ''
  ) as { data: any; isLoading: boolean };

  // Mutations
  const createAssessment = useCreateAssessment();
  const deleteAssessment = useDeleteAssessment();

  const handleDeleteAssessment = (assessmentId: string) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      deleteAssessment.mutate(assessmentId);
    }
  };

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    assessments.forEach((a: any) => { if (a.category) categories.add(a.category); });
    templates.forEach((t: any) => { if (t.category) categories.add(t.category); });
    return Array.from(categories);
  }, [assessments, templates]);

  const uniqueClasses = useMemo(() => {
    const classNames = new Set<string>();
    classes.forEach((c: any) => {
      if (c.class_name) classNames.add(c.class_name);
      else if (c.name) classNames.add(c.name);
    });
    assessments.forEach((a: any) => { if (a.class_name) classNames.add(a.class_name); });
    return Array.from(classNames);
  }, [assessments, classes]);

    const filteredAssessments = useMemo(() => {
    return assessments.filter((a: any) => {
      const matchesCategory = selectedCategories.length === 0 || (a.category && selectedCategories.includes(a.category));
      const matchesClass = selectedClasses.length === 0 || (a.class_name && selectedClasses.includes(a.class_name));
      const matchesSearch = !searchQuery || (a.title && a.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesClass && matchesSearch;
    });
  }, [assessments, selectedCategories, selectedClasses, searchQuery]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t: any) => {
      const matchesCategory = selectedCategories.length === 0 || (t.category && selectedCategories.includes(t.category));
      const matchesSearch = !searchQuery || (t.name && t.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategories, searchQuery]);

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

  if (selectedAssessmentId) {
    if (selectedAssessmentLoading) {
      return (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedAssessmentId(null)}
            className="mb-4"
          >
            ← Back to Assessments
          </Button>
          <Card className="card-professional">
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading assessment details...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!selectedAssessment) {
      return (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedAssessmentId(null)}
            className="mb-4"
          >
            ← Back to Assessments
          </Button>
          <Card className="card-professional">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Assessment not found</p>
            </CardContent>
          </Card>
        </div>
      );
    }

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
            ← Back to Assessments
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
                <Badge variant="outline" className="text-sm px-3 py-1 font-semibold">{selectedAssessment.category}</Badge>
              )}
            </div>
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
            <p className="text-base md:text-lg text-muted-foreground ml-13">Manage and review student assessments</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white border-gray-200 focus:border-primary rounded-xl"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filters:</span>
            </div>
            <Select
              value={selectedCategories.length > 0 ? selectedCategories[0] : "all"}
              onValueChange={(value) => setSelectedCategories(value === "all" ? [] : [value])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedClasses.length > 0 ? selectedClasses[0] : "all"}
              onValueChange={(value) => setSelectedClasses(value === "all" ? [] : [value])}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedCategories.length > 0 || selectedClasses.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedClasses([]);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

          {/* Tabs */}
          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="assessments">Assessment Library</TabsTrigger>
              <TabsTrigger value="responses">Student Responses</TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>Assessment Templates</CardTitle>
                  <CardDescription>Pre-built assessment templates for common scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  {templatesLoading ? (
                    <p className="text-muted-foreground">Loading templates...</p>
                  ) : filteredTemplates.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTemplates.map((template: any) => (
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
                    <p className="text-muted-foreground">No templates available matching your criteria.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessments">
              {assessmentsLoading ? (
                <Card className="card-professional">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Loading assessments...</p>
                  </CardContent>
                </Card>
              ) : (
                <DataTable
                  data={filteredAssessments}
                  columns={assessmentColumns}
                  title="Assessment Library"
                  searchPlaceholder="Search assessments..."
                  onRowClick={(assessment: any) => setSelectedAssessmentId(assessment.assessment_id)}
                  actions={assessmentActions}
                  searchable={false} // Hide internal search since we have a global one
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
          </Tabs>
      </div>
    </div>
  );
}