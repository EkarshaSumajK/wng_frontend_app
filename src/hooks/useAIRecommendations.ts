import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiRecommendationsApi, CreateAIRecommendationData, UpdateAIRecommendationData } from '@/services/aiRecommendations';
import { useToast } from '@/hooks/use-toast';

export const useAIRecommendations = (params?: {
  student_id?: string;
  case_id?: string;
  is_reviewed?: boolean;
}) => {
  return useQuery({
    queryKey: ['aiRecommendations', params],
    queryFn: () => aiRecommendationsApi.getAll(params),
  });
};

export const useAIRecommendation = (id: string) => {
  return useQuery({
    queryKey: ['aiRecommendations', id],
    queryFn: () => aiRecommendationsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateAIRecommendation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateAIRecommendationData) => aiRecommendationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] });
      toast({
        title: 'Success',
        description: 'AI recommendation created successfully',
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

export const useUpdateAIRecommendation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAIRecommendationData }) =>
      aiRecommendationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] });
      toast({
        title: 'Success',
        description: 'AI recommendation updated successfully',
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

export const useDeleteAIRecommendation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => aiRecommendationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiRecommendations'] });
      toast({
        title: 'Success',
        description: 'AI recommendation deleted successfully',
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
