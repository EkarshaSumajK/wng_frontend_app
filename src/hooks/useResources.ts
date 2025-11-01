import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi, CreateResourceData, UpdateResourceData } from '@/services/resources';
import { useToast } from '@/hooks/use-toast';

export const useResources = (params?: {
  school_id?: string;
  type?: string;
  status?: string;
  category?: string;
  tag?: string;
  search?: string;
  include_global?: boolean;
}) => {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => resourcesApi.getAll(params),
  });
};

export const useResource = (id: string, increment_view = false) => {
  return useQuery({
    queryKey: ['resources', id],
    queryFn: () => resourcesApi.getById(id, increment_view),
    enabled: !!id,
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateResourceData) => resourcesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Success',
        description: 'Resource created successfully',
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

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResourceData }) =>
      resourcesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Success',
        description: 'Resource updated successfully',
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

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => resourcesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Success',
        description: 'Resource deleted successfully',
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

export const useResourceCategories = (params?: { school_id?: string; include_global?: boolean }) => {
  return useQuery({
    queryKey: ['resourceCategories', params],
    queryFn: () => resourcesApi.getCategories(params),
  });
};

export const useResourceTags = (params?: { school_id?: string; include_global?: boolean }) => {
  return useQuery({
    queryKey: ['resourceTags', params],
    queryFn: () => resourcesApi.getTags(params),
  });
};

export const useResourceStats = (params?: { school_id?: string; include_global?: boolean }) => {
  return useQuery({
    queryKey: ['resourceStats', params],
    queryFn: () => resourcesApi.getStats(params),
  });
};
