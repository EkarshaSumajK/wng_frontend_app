import { useState } from 'react';
import { 
  ArrowLeft, Send, CheckCircle, XCircle, Clock, Eye, FileText, 
  User, Search, Calendar, BookOpen, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  VERIFIED: { label: 'Verified', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  SUBMITTED: { label: 'Not verified', color: 'bg-pink-100 text-pink-800 border-pink-200', icon: Clock },
  PENDING: { label: 'Not received', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
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

  // Filter assignments by search and class
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.activity?.title.toLowerCase().includes(activitySearch.toLowerCase());
    const matchesClass = classFilter === 'all' || assignment.class_id === classFilter;
    return matchesSearch && matchesClass;
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Activity Monitoring
          </h1>
        </div>
        <p className="text-base md:text-lg text-muted-foreground ml-13">Track student submissions for assigned activities</p>
      </div>

      {!selectedAssignment ? (
        /* Main View - List of Assigned Activities */
        <div className="space-y-12">
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-3xl -z-10" />
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border-2 border-primary/10 shadow-xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Assigned Activities
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">{assignments.length} activities assigned</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedAssignments.map((assignment) => {
                      const verified = assignment.submission_count || 0;
                      const notReceived = assignment.total_students - verified;
                      
                      return (
                        <Card
                          key={assignment.assignment_id}
                          className="cursor-pointer transition-colors duration-300 hover:border-primary border-2 group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 h-full"
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between mb-3">
                              <CardTitle className="text-lg font-bold line-clamp-2">
                                {assignment.activity?.title || 'Activity'}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="bg-primary/10">
                                {assignment.total_students} Students
                              </Badge>
                              {assignment.due_date && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Separator />
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {assignment.activity?.description || 'No description'}
                            </p>

                            {/* Stats */}
                            <div className="flex gap-2 flex-wrap">
                              <div className="flex items-center gap-1 text-xs px-2 py-1 bg-green-50 rounded">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span className="font-semibold">{verified} Submitted</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-50 rounded">
                                <XCircle className="w-3 h-3 text-gray-600" />
                                <span className="font-semibold">{notReceived} Pending</span>
                              </div>
                            </div>

                            <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:border-primary transition-colors">
                              <Eye className="w-3 h-3 mr-2" />
                              View Submissions
                            </Button>
                          </CardContent>
                        </Card>
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
              className="group hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Activities
            </Button>
            <div className="h-8 w-px bg-gray-200" />
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedAssignment.activity?.title || 'Activity'}
            </h2>
            <Badge variant="secondary" className="ml-2">
              {selectedAssignment.total_students} Students
            </Badge>
          </div>

          {submissionsLoading ? (
            <Card className="border-2">
              <CardContent className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading submissions...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Assignment Card */}
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
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
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold">{stats.verified} Verified</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-lg">
                        <Clock className="w-5 h-5 text-pink-600" />
                        <span className="text-sm font-semibold">{stats.not_verified} Pending Review</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                        <XCircle className="w-5 h-5 text-gray-600" />
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
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-100 hover:border-primary/50 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white">
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
                  <CardHeader className="bg-gradient-to-r from-background to-muted/20">
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
                            <div className="p-4 rounded-lg bg-gray-50 border">
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
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {comment.sender_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-gray-50 rounded-lg p-3">
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
