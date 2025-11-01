import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentsApi, CreateAssessmentData, UpdateAssessmentData } from '@/services/assessments';
import { useToast } from '@/hooks/use-toast';

export const useAssessments = (params?: {
  school_id?: string;
  student_id?: string;
}) => {
  return useQuery({
    queryKey: ['assessments', params],
    queryFn: () => assessmentsApi.getAll(params),
  });
};

export const useAssessment = (id: string) => {
  return useQuery({
    queryKey: ['assessments', id],
    queryFn: () => assessmentsApi.getById(id),
    enabled: !!id,
  });
};

export const useStudentAssessments = (studentId?: string) => {
  return useQuery({
    queryKey: ['assessments', 'student', studentId],
    queryFn: () => assessmentsApi.getByStudentId(studentId!),
    enabled: !!studentId,
  });
};

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateAssessmentData) => assessmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast({
        title: 'Success',
        description: 'Assessment created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssessmentData }) =>
      assessmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast({
        title: 'Success',
        description: 'Assessment updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => assessmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast({
        title: 'Success',
        description: 'Assessment deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => assessmentsApi.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast({
        title: 'Success',
        description: 'Assessment submitted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useAssessmentTemplates = (params?: {
  category?: string;
  is_active?: boolean;
}) => {
  return useQuery({
    queryKey: ['assessmentTemplates', params],
    queryFn: () => assessmentsApi.getTemplates(params),
  });
};

export const useAssessmentTemplate = (id: string) => {
  return useQuery({
    queryKey: ['assessmentTemplates', id],
    queryFn: () => assessmentsApi.getTemplateById(id),
    enabled: !!id,
  });
};

export const useExcludeStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ assessmentId, studentId }: { assessmentId: string; studentId: string }) =>
      assessmentsApi.excludeStudent(assessmentId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast({
        title: 'Success',
        description: 'Student excluded from assessment',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useIncludeStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ assessmentId, studentId }: { assessmentId: string; studentId: string }) =>
      assessmentsApi.includeStudent(assessmentId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast({
        title: 'Success',
        description: 'Student included in assessment',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => assessmentsApi.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessmentTemplates'] });
      toast({
        title: 'Success',
        description: 'Assessment template created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
