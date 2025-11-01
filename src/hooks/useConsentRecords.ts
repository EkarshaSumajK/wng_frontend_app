import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consentRecordsApi, CreateConsentRecordData, UpdateConsentRecordData } from '@/services/consentRecords';
import { useToast } from '@/hooks/use-toast';

export const useConsentRecords = (params?: {
  student_id?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['consentRecords', params],
    queryFn: () => consentRecordsApi.getAll(params),
  });
};

export const useConsentRecord = (id: string) => {
  return useQuery({
    queryKey: ['consentRecords', id],
    queryFn: () => consentRecordsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateConsentRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateConsentRecordData) => consentRecordsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consentRecords'] });
      toast({
        title: 'Success',
        description: 'Consent record created successfully',
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

export const useUpdateConsentRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConsentRecordData }) =>
      consentRecordsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consentRecords'] });
      toast({
        title: 'Success',
        description: 'Consent record updated successfully',
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

export const useDeleteConsentRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => consentRecordsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consentRecords'] });
      toast({
        title: 'Success',
        description: 'Consent record deleted successfully',
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
