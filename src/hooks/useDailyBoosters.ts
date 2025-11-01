import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dailyBoostersApi, CreateDailyBoosterData, UpdateDailyBoosterData } from '@/services/dailyBoosters';
import { useToast } from '@/hooks/use-toast';

export const useDailyBoosters = (params?: {
  school_id?: string;
  booster_type?: string;
}) => {
  return useQuery({
    queryKey: ['dailyBoosters', params],
    queryFn: () => dailyBoostersApi.getAll(params),
  });
};

export const useDailyBooster = (id: string) => {
  return useQuery({
    queryKey: ['dailyBoosters', id],
    queryFn: () => dailyBoostersApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateDailyBooster = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateDailyBoosterData) => dailyBoostersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyBoosters'] });
      toast({
        title: 'Success',
        description: 'Daily booster created successfully',
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

export const useUpdateDailyBooster = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDailyBoosterData }) =>
      dailyBoostersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyBoosters'] });
      toast({
        title: 'Success',
        description: 'Daily booster updated successfully',
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

export const useDeleteDailyBooster = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => dailyBoostersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyBoosters'] });
      toast({
        title: 'Success',
        description: 'Daily booster deleted successfully',
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
