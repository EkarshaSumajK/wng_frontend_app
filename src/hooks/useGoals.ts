import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi, CreateGoalData, UpdateGoalData } from '@/services/goals';
import { useToast } from '@/hooks/use-toast';

export const useGoals = (caseId?: string) => {
  return useQuery({
    queryKey: ['goals', caseId],
    queryFn: () => goalsApi.getAll({ case_id: caseId }),
    enabled: !!caseId,
  });
};

export const useGoal = (id: string) => {
  return useQuery({
    queryKey: ['goals', id],
    queryFn: () => goalsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateGoalData) => goalsApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals', variables.case_id] });
      toast({
        title: 'Success',
        description: 'Goal created successfully',
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

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalData }) =>
      goalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: 'Success',
        description: 'Goal updated successfully',
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

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => goalsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: 'Success',
        description: 'Goal deleted successfully',
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
