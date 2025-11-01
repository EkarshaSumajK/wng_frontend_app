import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarEventsApi } from '@/services/calendarEvents';
import { useToast } from '@/hooks/use-toast';

export const useCalendarEvents = (params?: {
  school_id?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
}) => {
  return useQuery({
    queryKey: ['calendar-events', params],
    queryFn: () => calendarEventsApi.getAll(params),
  });
};

export const useMyCalendarEvents = () => {
  return useQuery({
    queryKey: ['calendar-events', 'my'],
    queryFn: () => calendarEventsApi.getMyEvents(),
  });
};

export const useCalendarEvent = (id: string) => {
  return useQuery({
    queryKey: ['calendar-events', id],
    queryFn: () => calendarEventsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => calendarEventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast({
        title: 'Success',
        description: 'Wellness check scheduled successfully',
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

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      calendarEventsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast({
        title: 'Success',
        description: 'Event updated successfully',
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

export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => calendarEventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
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
