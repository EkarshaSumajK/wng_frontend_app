import api from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
export interface ActivityAssignment {
  assignment_id: string;
  activity_id: string;
  class_id: string;
  due_date: string | null;
  status: string;
  created_at: string;
  activity: {
    activity_id: string;
    title: string;
    description: string;
  } | null;
  submission_count: number;
  total_students: number;
}

export interface ActivitySubmission {
  submission_id: string;
  student_id: string;
  student_name: string;
  file_url: string | null;
  status: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  submitted_at: string | null;
  feedback: string | null;
}

export interface SubmissionComment {
  comment_id: string;
  submission_id: string;
  user_id: string | null;
  student_id: string | null;
  message: string;
  created_at: string;
  sender_name: string;
}

// Get all assignments for the teacher from all their classes
export function useTeacherAssignments() {
  return useQuery({
    queryKey: ['teacher-assignments'],
    queryFn: async () => {
      // First get dashboard stats to get our classes
      const { data: stats } = await api.get('/activity-assignments/dashboard/stats');
      
      if (!stats.classes || stats.classes.length === 0) {
        return [];
      }
      
      // Fetch assignments for all classes
      const promises = stats.classes.map((cls: any) =>
        api.get<ActivityAssignment[]>(`/activity-assignments/assignments/class/${cls.class_id}`)
      );
      
      const results = await Promise.all(promises);
      return results.flatMap(r => r.data);
    },
  });
}

// Get assignments for a specific class
export function useClassAssignments(classId: string | undefined) {
  return useQuery({
    queryKey: ['class-assignments', classId],
    queryFn: async () => {
      if (!classId) return [];
      const { data } = await api.get<ActivityAssignment[]>(`/activity-assignments/assignments/class/${classId}`);
      return data;
    },
    enabled: !!classId,
  });
}

// Get submissions for an assignment
export function useAssignmentSubmissions(assignmentId: string | undefined) {
  return useQuery({
    queryKey: ['assignment-submissions', assignmentId],
    queryFn: async () => {
      if (!assignmentId) return [];
      const { data} = await api.get<ActivitySubmission[]>(`/activity-assignments/submissions/assignment/${assignmentId}`);
      return data;
    },
    enabled: !!assignmentId,
  });
}

// Get comments for a submission
export function useSubmissionComments(submissionId: string | undefined) {
  return useQuery({
    queryKey: ['submission-comments', submissionId],
    queryFn: async () => {
      if (!submissionId) return [];
      const { data } = await api.get<SubmissionComment[]>(`/activity-assignments/submissions/${submissionId}/comments`);
      return data;
    },
    enabled: !!submissionId,
  });
}

// Verify/Update submission status
export function useUpdateSubmissionStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ submissionId, status, feedback }: { submissionId: string; status: string; feedback?: string }) => {
      const { data } = await api.put(`/activity-assignments/submissions/${submissionId}`, {
        status,
        feedback,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
    },
  });
}

// Add comment to submission
export function useAddComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ submissionId, message }: { submissionId: string; message: string }) => {
      const { data } = await api.post(`/activity-assignments/submissions/${submissionId}/comments`, {
        message,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submission-comments', variables.submissionId] });
    },
  });
}

// Assign activity to class
export function useAssignActivity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ activityId, classId, dueDate }: { activityId: string; classId: string; dueDate?: string }) => {
      const { data } = await api.post('/activity-assignments/assignments', {
        activity_id: activityId,
        class_id: classId,
        due_date: dueDate,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['class-assignments'] });
    },
  });
}
