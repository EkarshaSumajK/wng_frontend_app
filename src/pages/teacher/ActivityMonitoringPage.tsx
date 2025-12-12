import { useState } from 'react';
import { 
  ArrowLeft, Send, CheckCircle, XCircle, Clock, Eye, FileText, 
  User, Search, Calendar, BookOpen, Loader2, Sparkles, GraduationCap, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingState } from '@/components/shared/LoadingState';
import { ActivityAnalyticsDashboard } from '@/components/shared/ActivityAnalyticsDashboard';
import { 
  useTeacherAssignments, 
  useAssignmentSubmissions,
  useUpdateSubmissionStatus,
  useAddComment,
  useSubmissionComments,
  type ActivityAssignment,
  type ActivitySubmission
} from '@/hooks/useActivityAssignments';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const statusConfig = {
  VERIFIED: { label: 'Verified', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800', icon: CheckCircle },
  SUBMITTED: { label: 'Not verified', color: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800', icon: Clock },
  PENDING: { label: 'Not received', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700', icon: XCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800', icon: XCircle },
};

// Hook to fetch class details
const useClassDetails = (classIds: string[]) => {
  return useQuery({
    queryKey: ['class-details', classIds],
    queryFn: async () => {
      if (classIds.length === 0) return {};
      
      const classDetails: Record<string, any> = {};
      await Promise.all(
        classIds.map(async (classId) => {
          try {
            const { data } = await api.get(`/classes/${classId}`);
            classDetails[classId] = data;
          } catch (error) {
            console.error(`Failed to fetch class ${classId}:`, error);
          }
        })
      );
      return classDetails;
    },
    enabled: classIds.length > 0,
  });
};

export default function ActivityMonitoringPage() {
  const { user } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState<ActivityAssignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ActivitySubmission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');
  const [viewingFileUrl, setViewingFileUrl] = useState<string | null>(null);
  
  // Filter states
  const [activitySearch, setActivitySearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  // API Hooks
  const { data: assignments = [], isLoading: assignmentsLoading } = useTeacherAssignments();
  const { data: submissions = [], isLoading: submissionsLoading } = useAssignmentSubmissions(selectedAssignment?.assignment_id);
  const { data: comments = [] } = useSubmissionComments(selectedSubmission?.submission_id);
  const updateStatusMutation = useUpdateSubmissionStatus();
  const addCommentMutation = useAddComment();

  // Get unique class IDs and fetch their details
  const uniqueClassIds = [...new Set(assignments.map(a => a.class_id))];
  const { data: classDetailsMap = {} } = useClassDetails(uniqueClassIds);
  
  // Group assignments by class_id for display
  const assignmentsByClass = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.class_id]) {
      acc[assignment.class_id] = [];
    }
    acc[assignment.class_id].push(assignment);
    return acc;
  }, {} as Record<string, typeof assignments>);

  // Get unique classes for filter dropdown with real class names
  const classOptions = [
    { value: 'all', label: 'All Classes' },
    ...uniqueClassIds.map(classId => {
      const classData = classDetailsMap[classId];
      let label;
      
      if (classData) {
        // Use name if available, otherwise construct from grade and section
        if (classData.name) {
          label = classData.name;
        } else if (classData.grade && classData.section) {
          label = `Grade ${classData.grade}-${classData.section}`;
        } else if (classData.grade) {
          label = `Grade ${classData.grade}`;
        } else {
          label = `Class ${classId.slice(0, 8)}`;
        }
      } else {
        label = `Class (${assignmentsByClass[classId]?.[0]?.total_students || 0} students)`;
      }
      
      return {
        value: classId,
        label
      };
    })
  ];

  // Filter assignments by search and all filters
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.activity?.title.toLowerCase().includes(activitySearch.toLowerCase());
    const matchesClass = classFilter === 'all' || assignment.class_id === classFilter;
    const matchesType = typeFilter === 'all' || assignment.activity?.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || assignment.activity?.location === locationFilter;
    const matchesRisk = riskFilter === 'all' || assignment.activity?.risk_level === riskFilter;
    const matchesSkill = skillFilter === 'all' || assignment.activity?.skill_level === skillFilter;
    const matchesTheme = themeFilter === 'all' || assignment.activity?.theme?.includes(themeFilter);
    return matchesSearch && matchesClass && matchesType && matchesLocation && matchesRisk && matchesSkill && matchesTheme;
  });

  // Filter submissions by search and status
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.student_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssignments = filteredAssignments.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Calculate stats for selected assignment
  const stats = selectedAssignment ? {
    verified: submissions.filter(s => s.status === 'VERIFIED').length,
    not_verified: submissions.filter(s => s.status === 'SUBMITTED').length,
    not_received: submissions.filter(s => s.status === 'PENDING').length,
  } : null;

  const handleVerify = async (submissionId: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        submissionId,
        status: 'VERIFIED',
      });
      toast.success('Submission verified successfully');
    } catch (error) {
      toast.error('Failed to verify submission');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedSubmission) return;
    
    try {
      await addCommentMutation.mutateAsync({
        submissionId: selectedSubmission.submission_id,
        message: newComment,
      });
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (assignmentsLoading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading assignments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100/50 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Activity Monitoring
          </h1>
        </div>
        <p className="text-base md:text-lg text-muted-foreground ml-13">Track student submissions for assigned activities</p>
      </div>

      {!selectedAssignment ? (
        /* Main View - List of Assigned Activities */
        <div className="space-y-12">
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50/50 to-transparent rounded-3xl -z-10" />
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border-2 border-blue-100 dark:border-blue-900/50 shadow-xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      Assigned Activities
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">{assignments.length} activities assigned</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      value={activitySearch}
                      onChange={(e) => {
                        setActivitySearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Select value={classFilter} onValueChange={(value) => {
                    setClassFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Filters Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <Select value={typeFilter} onValueChange={(value) => {
                    setTypeFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Activity Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="PHYSICAL_DEVELOPMENT">Physical</SelectItem>
                      <SelectItem value="COGNITIVE_DEVELOPMENT">Cognitive</SelectItem>
                      <SelectItem value="SOCIAL_EMOTIONAL_DEVELOPMENT">Social & Emotional</SelectItem>
                      <SelectItem value="LANGUAGE_COMMUNICATION_DEVELOPMENT">Language</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={locationFilter} onValueChange={(value) => {
                    setLocationFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="IN_CLASS">In Class</SelectItem>
                      <SelectItem value="AT_HOME">At Home</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={riskFilter} onValueChange={(value) => {
                    setRiskFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="LOW">Low Risk</SelectItem>
                      <SelectItem value="MEDIUM">Medium Risk</SelectItem>
                      <SelectItem value="HIGH">High Risk</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={skillFilter} onValueChange={(value) => {
                    setSkillFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Skill Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={themeFilter} onValueChange={(value) => {
                    setThemeFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Themes</SelectItem>
                      <SelectItem value="mindfulness">Mindfulness</SelectItem>
                      <SelectItem value="physical-activity">Physical Activity</SelectItem>
                      <SelectItem value="social-skills">Social Skills</SelectItem>
                      <SelectItem value="emotional-awareness">Emotional Awareness</SelectItem>
                      <SelectItem value="stress-relief">Stress Relief</SelectItem>
                      <SelectItem value="focus">Focus</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="cognitive-skills">Cognitive Skills</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters Button */}
                {(typeFilter !== 'all' || locationFilter !== 'all' || riskFilter !== 'all' || skillFilter !== 'all' || themeFilter !== 'all' || classFilter !== 'all' || activitySearch) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTypeFilter('all');
                      setLocationFilter('all');
                      setRiskFilter('all');
                      setSkillFilter('all');
                      setThemeFilter('all');
                      setClassFilter('all');
                      setActivitySearch('');
                      setCurrentPage(1);
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>

              {filteredAssignments.length === 0 ? (
                <Card className="border-2">
                  <CardContent className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground">
                      {assignments.length === 0 ? 'No activities assigned yet' : 'No activities match your filters'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* 3x3 Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {paginatedAssignments.map((assignment) => {
                      const verified = assignment.submission_count || 0;
                      const notReceived = assignment.total_students - verified;
                      
                      const classData = classDetailsMap[assignment.class_id];
                      const classLabel = classData?.name || (classData?.grade ? `Grade ${classData.grade}${classData.section ? `-${classData.section}` : ''}` : 'Class');

                      return (
                        <div
                          key={assignment.assignment_id}
                          className="group cursor-pointer space-y-3"
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          {/* Thumbnail / App Icon Style */}
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                            {assignment.activity?.thumbnail_url ? (
                              <img 
                                src={assignment.activity.thumbnail_url} 
                                alt={assignment.activity.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-secondary/20">
                                <Sparkles className="w-12 h-12 text-muted-foreground/50" />
                              </div>
                            )}
                            {/* Students Badge Overlay */}
                            <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                              {assignment.total_students} Students
                            </div>
                            
                            {/* Due Date Badge (Top Left) */}
                            {assignment.due_date && (
                              <div className="absolute top-2 left-2 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-gray-800 backdrop-blur-sm shadow-sm flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(assignment.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                            )}

                            {/* Class Badge (Top Right) */}
                            <div className="absolute top-2 right-2 rounded-lg bg-primary/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              {classLabel}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-2">
                            <h3 className="font-semibold leading-tight text-foreground group-hover:text-primary line-clamp-1 text-lg">
                              {assignment.activity?.title || 'Activity'}
                            </h3>
                            
                            {/* Stats Row */}
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                <span className="font-medium">{verified} Done</span>
                              </div>
                              <div className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" />
                                <span className="font-medium">{notReceived} Pending</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      ) : (
        /* Detail View - Student Submissions for Selected Assignment */
        <div className="space-y-6">
          {/* Back Button and Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedAssignment(null);
                setSelectedSubmission(null);
                setSearchQuery('');
              }}
              className="group hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Activities
            </Button>
            <div className="h-8 w-px bg-gray-200" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedAssignment.activity?.title || 'Activity'}
            </h2>
            <Badge variant="secondary" className="ml-2">
              {selectedAssignment.total_students} Students
            </Badge>
          </div>

          {/* Tabs for Submissions and Analytics */}
          <Tabs defaultValue="submissions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <ActivityAnalyticsDashboard 
                activityId={selectedAssignment.activity?.activity_id || selectedAssignment.activity_id} 
                submissions={submissions}
              />
            </TabsContent>

            <TabsContent value="submissions">
            {submissionsLoading ? (
              <div className="p-8">
                <LoadingState message="Loading submissions..." />
              </div>
            ) : (
            <>
              {/* Assignment Card */}
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r from-background to-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{selectedAssignment.activity?.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-green-50">
                            {selectedAssignment.status} {selectedAssignment.due_date && `until ${new Date(selectedAssignment.due_date).toLocaleDateString()}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {stats && (
                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold">{stats.verified} Verified</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                        <Clock className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        <span className="text-sm font-semibold">{stats.not_verified} Pending Review</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-semibold">{stats.not_received} Not Received</span>
                      </div>
                    </div>
                  )}

                  {/* Search and Filter */}
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search student..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="submitted">Pending</SelectItem>
                        <SelectItem value="pending">Not Received</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content - Students List and Detail */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Students List */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Student Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[600px] overflow-y-auto pr-2 space-y-2">
                      {filteredSubmissions.map((submission) => {
                        const config = statusConfig[submission.status as keyof typeof statusConfig];
                        const StatusIcon = config.icon;

                        return (
                          <div
                            key={submission.submission_id}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedSubmission?.submission_id === submission.submission_id
                                ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                                : 'border-border hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-500 text-white">
                                    {submission.student_name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">{submission.student_name}</p>
                                  {submission.submitted_at && (
                                    <p className="text-xs text-muted-foreground">
                                      Received on {new Date(submission.submitted_at).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Badge className={`${config.color} font-semibold`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {config.label}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Submission Detail Panel */}
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-muted/50">
                    <CardTitle>
                      {selectedSubmission ? `${selectedSubmission.student_name}'s Submission` : 'Select a student'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {selectedSubmission ? (
                      <>
                        {/* Status */}
                        <div>
                          <div className="flex items-center justify-between">
                            <Badge className={`${statusConfig[selectedSubmission.status as keyof typeof statusConfig].color} text-sm px-3 py-1`}>
                              {statusConfig[selectedSubmission.status as keyof typeof statusConfig].label}
                            </Badge>
                            {selectedSubmission.status === 'SUBMITTED' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleVerify(selectedSubmission.submission_id)}
                                disabled={updateStatusMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Verified
                              </Button>
                            )}
                          </div>
                        </div>

                        <Separator />

                        {/* Activity Description */}
                        <div>
                          <h4 className="font-semibold mb-2">Activity Description</h4>
                          <p className="text-sm text-muted-foreground">{selectedAssignment.activity?.description}</p>
                        </div>

                        {/* Uploaded File */}
                        {selectedSubmission.file_url && (
                          <div>
                            <h4 className="font-semibold mb-3">Submitted File</h4>
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border">
                              <Button 
                                variant="ghost" 
                                className="flex items-center gap-2 text-primary hover:underline p-0 h-auto hover:bg-transparent"
                                onClick={() => setViewingFileUrl(selectedSubmission.file_url)}
                              >
                                <FileText className="w-5 h-5" />
                                <span className="text-sm font-medium">View Submission</span>
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Comments */}
                        <div>
                          <h4 className="font-semibold mb-3">Comments</h4>
                          <div className="space-y-4">
                            {comments.map((comment) => (
                              <div key={comment.comment_id} className="flex gap-3">
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                  <AvatarFallback className="bg-blue-50 text-primary text-xs">
                                    {comment.sender_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                    <p className="text-sm font-semibold mb-1">{comment.sender_name}</p>
                                    <p className="text-sm text-muted-foreground">{comment.message}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(comment.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}

                            {/* Add Comment */}
                            <div className="flex gap-2">
                              <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Enter your comment..."
                                className="resize-none"
                                rows={2}
                              />
                              <Button 
                                size="icon" 
                                onClick={handleAddComment} 
                                disabled={!newComment.trim() || addCommentMutation.isPending}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Select a student to view submission details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Image Preview Modal */}
      <Dialog open={!!viewingFileUrl} onOpenChange={(open) => !open && setViewingFileUrl(null)}>
        <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Submission Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            {viewingFileUrl && (
              <img 
                src={viewingFileUrl} 
                alt="Submission" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
