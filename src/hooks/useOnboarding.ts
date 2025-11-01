import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as onboardingService from '@/services/onboarding';

// Teachers
export const useTeachers = (schoolId: string) => {
  return useQuery({
    queryKey: ['teachers', schoolId],
    queryFn: () => onboardingService.getTeachers(schoolId),
    enabled: !!schoolId,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: 'Success',
        description: 'Teacher created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create teacher',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      onboardingService.updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: 'Success',
        description: 'Teacher updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update teacher',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: 'Success',
        description: 'Teacher deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete teacher',
        variant: 'destructive',
      });
    },
  });
};

// Counsellors
export const useCounsellors = (schoolId: string) => {
  return useQuery({
    queryKey: ['counsellors', schoolId],
    queryFn: () => onboardingService.getCounsellors(schoolId),
    enabled: !!schoolId,
  });
};

export const useCreateCounsellor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.createCounsellor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellors'] });
      toast({
        title: 'Success',
        description: 'Counsellor created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create counsellor',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCounsellor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      onboardingService.updateCounsellor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellors'] });
      toast({
        title: 'Success',
        description: 'Counsellor updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update counsellor',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCounsellor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.deleteCounsellor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellors'] });
      toast({
        title: 'Success',
        description: 'Counsellor deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete counsellor',
        variant: 'destructive',
      });
    },
  });
};

// School Admins
export const useSchoolAdmins = (schoolId: string) => {
  return useQuery({
    queryKey: ['school-admins', schoolId],
    queryFn: () => onboardingService.getSchoolAdmins(schoolId),
    enabled: !!schoolId,
  });
};

export const useCreateSchoolAdmin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.createSchoolAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-admins'] });
      toast({
        title: 'Success',
        description: 'School admin created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create school admin',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSchoolAdmin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      onboardingService.updateSchoolAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-admins'] });
      toast({
        title: 'Success',
        description: 'School admin updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update school admin',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteSchoolAdmin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.deleteSchoolAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-admins'] });
      toast({
        title: 'Success',
        description: 'School admin deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete school admin',
        variant: 'destructive',
      });
    },
  });
};

// Parents
export const useParents = (schoolId: string) => {
  return useQuery({
    queryKey: ['parents', schoolId],
    queryFn: () => onboardingService.getParents(schoolId),
    enabled: !!schoolId,
  });
};

export const useCreateParent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.createParent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      toast({
        title: 'Success',
        description: 'Parent created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create parent',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateParent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      onboardingService.updateParent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      toast({
        title: 'Success',
        description: 'Parent updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update parent',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteParent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.deleteParent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      toast({
        title: 'Success',
        description: 'Parent deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete parent',
        variant: 'destructive',
      });
    },
  });
};

// Students
export const useStudents = (schoolId: string) => {
  return useQuery({
    queryKey: ['students', schoolId],
    queryFn: () => onboardingService.getStudents(schoolId),
    enabled: !!schoolId,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Student created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create student',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      onboardingService.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Student updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update student',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Success',
        description: 'Student deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete student',
        variant: 'destructive',
      });
    },
  });
};

// Classes
export const useClasses = (schoolId: string) => {
  return useQuery({
    queryKey: ['classes', schoolId],
    queryFn: () => onboardingService.getClasses(schoolId),
    enabled: !!schoolId,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({
        title: 'Success',
        description: 'Class created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create class',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      onboardingService.updateClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({
        title: 'Success',
        description: 'Class updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update class',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: onboardingService.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({
        title: 'Success',
        description: 'Class deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete class',
        variant: 'destructive',
      });
    },
  });
};
