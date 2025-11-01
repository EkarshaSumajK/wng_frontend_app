import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schoolsApi, CreateSchoolData, UpdateSchoolData } from '@/services/schools';
import { useToast } from '@/hooks/use-toast';

export const useSchools = (params?: { skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['schools', params],
    queryFn: () => schoolsApi.getAll(params),
  });
};

export const useSchool = (id?: string) => {
  return useQuery({
    queryKey: ['schools', id],
    queryFn: () => schoolsApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateSchoolData) => schoolsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast({
        title: 'Success',
        description: 'School created successfully',
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

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSchoolData }) =>
      schoolsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast({
        title: 'Success',
        description: 'School updated successfully',
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
