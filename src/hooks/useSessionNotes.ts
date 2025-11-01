import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionNotesApi, CreateSessionNoteData, UpdateSessionNoteData } from '@/services/sessionNotes';
import { useToast } from '@/hooks/use-toast';

export const useSessionNotes = (caseId?: string) => {
  return useQuery({
    queryKey: ['sessionNotes', caseId],
    queryFn: () => sessionNotesApi.getAll({ case_id: caseId }),
    enabled: !!caseId,
  });
};

export const useSessionNote = (id: string) => {
  return useQuery({
    queryKey: ['sessionNotes', id],
    queryFn: () => sessionNotesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSessionNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateSessionNoteData) => sessionNotesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionNotes'] });
      toast({
        title: 'Success',
        description: 'Session note created successfully',
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

export const useUpdateSessionNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSessionNoteData }) =>
      sessionNotesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionNotes'] });
      toast({
        title: 'Success',
        description: 'Session note updated successfully',
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

export const useDeleteSessionNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => sessionNotesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionNotes'] });
      toast({
        title: 'Success',
        description: 'Session note deleted successfully',
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
