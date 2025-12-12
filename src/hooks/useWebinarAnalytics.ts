import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  webinarAnalyticsApi,
  WebinarFilters,
  ParticipantFilters,
  RegistrationRequest,
} from "@/services/webinarAnalytics";

// Get webinars with analytics
export const useWebinars = (filters?: WebinarFilters) => {
  return useQuery({
    queryKey: ["webinar-analytics", "list", filters],
    queryFn: () => webinarAnalyticsApi.getWebinars(filters),
    enabled: true,
  });
};

// Get single webinar analytics
export const useWebinar = (webinarId?: string) => {
  return useQuery({
    queryKey: ["webinar-analytics", "detail", webinarId],
    queryFn: () => webinarAnalyticsApi.getWebinar(webinarId!),
    enabled: !!webinarId,
  });
};

// Get webinar participants
export const useWebinarParticipants = (
  webinarId?: string,
  filters?: ParticipantFilters
) => {
  return useQuery({
    queryKey: ["webinar-analytics", "participants", webinarId, filters],
    queryFn: () => webinarAnalyticsApi.getParticipants(webinarId!, filters),
    enabled: !!webinarId,
  });
};

// Get my registrations
export const useMyRegistrations = (schoolId?: string, includeAnalytics = false) => {
  return useQuery({
    queryKey: ["my-registrations", schoolId, includeAnalytics],
    queryFn: () => webinarAnalyticsApi.getMyRegistrations(schoolId!, { include_analytics: includeAnalytics }),
    enabled: !!schoolId,
  });
};

// Get registered webinars analytics
export const useRegisteredAnalytics = (schoolId?: string, days = 30) => {
  return useQuery({
    queryKey: ["registered-analytics", schoolId, days],
    queryFn: () => webinarAnalyticsApi.getRegisteredAnalytics(schoolId!, { days }),
    enabled: !!schoolId,
  });
};

// Get class breakdown
export const useClassBreakdown = (webinarId?: string, schoolId?: string) => {
  return useQuery({
    queryKey: ["class-breakdown", webinarId, schoolId],
    queryFn: () => webinarAnalyticsApi.getClassBreakdown(webinarId!, schoolId!),
    enabled: !!webinarId && !!schoolId,
  });
};

// Get school webinar summary (legacy)
export const useSchoolWebinarSummary = (schoolId?: string, days = 30) => {
  return useQuery({
    queryKey: ["webinar-analytics", "school-summary", schoolId, days],
    queryFn: () => webinarAnalyticsApi.getSchoolSummary(schoolId!, days),
    enabled: !!schoolId,
  });
};

// Register webinar mutation
export const useRegisterWebinarAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      webinarId,
      schoolId,
      userId,
      request,
    }: {
      webinarId: string;
      schoolId: string;
      userId: string;
      request: RegistrationRequest;
    }) => webinarAnalyticsApi.registerWebinar(webinarId, schoolId, userId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-registrations", variables.schoolId] });
      queryClient.invalidateQueries({ queryKey: ["registered-analytics", variables.schoolId] });
      queryClient.invalidateQueries({ queryKey: ["webinar-analytics"] });
    },
  });
};

// Unregister webinar mutation
export const useUnregisterWebinarAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ webinarId, schoolId }: { webinarId: string; schoolId: string }) =>
      webinarAnalyticsApi.unregisterWebinar(webinarId, schoolId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-registrations", variables.schoolId] });
      queryClient.invalidateQueries({ queryKey: ["registered-analytics", variables.schoolId] });
      queryClient.invalidateQueries({ queryKey: ["webinar-analytics"] });
    },
  });
};
