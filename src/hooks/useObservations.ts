import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observationsApi, CreateObservationData, UpdateObservationData } from '@/services/observations';
import { useToast } from '@/hooks/use-toast';

export const useObservations = (params?: {
  student_id?: string;
  reported_by?: string;
  severity?: string;
  processed?: boolean;
}) => {
  return useQuery({
    queryKey: ['observations', params],
    queryFn: () => observationsApi.getAll(params),
  });
};

export const useObservation = (id: string) => {
  return useQuery({
    queryKey: ['observations', id],
    queryFn: () => observationsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateObservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateObservationData) => observationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
      toast({
        title: 'Success',
        description: 'Observation created successfully',
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

export const useUpdateObservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateObservationData }) =>
      observationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
      toast({
        title: 'Success',
        description: 'Observation updated successfully',
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

export const useDeleteObservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => observationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
      toast({
        title: 'Success',
        description: 'Observation deleted successfully',
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
