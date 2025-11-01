import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { riskAlertsApi, CreateRiskAlertData, UpdateRiskAlertData } from '@/services/riskAlerts';
import { useToast } from '@/hooks/use-toast';

export const useRiskAlerts = (params?: {
  student_id?: string;
  status?: string;
  assigned_to?: string;
}) => {
  return useQuery({
    queryKey: ['risk-alerts', params],
    queryFn: () => riskAlertsApi.getAll(params),
  });
};

export const useRiskAlert = (id: string) => {
  return useQuery({
    queryKey: ['risk-alerts', id],
    queryFn: () => riskAlertsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateRiskAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateRiskAlertData) => riskAlertsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-alerts'] });
      toast({
        title: 'Alert Created',
        description: 'Risk alert has been created successfully',
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

export const useUpdateRiskAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRiskAlertData }) =>
      riskAlertsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-alerts'] });
      toast({
        title: 'Success',
        description: 'Risk alert updated successfully',
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

export const useDeleteRiskAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => riskAlertsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-alerts'] });
      toast({
        title: 'Success',
        description: 'Risk alert deleted successfully',
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
