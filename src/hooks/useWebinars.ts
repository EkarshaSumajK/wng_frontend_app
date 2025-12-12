import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { webinarAnalyticsApi, RegistrationRequest } from "@/services/webinarAnalytics";

// Types
export interface Webinar {
  webinar_id: string;
  title: string;
  description?: string;
  speaker_name: string;
  speaker_title?: string;
  speaker_bio?: string;
  speaker_image_url?: string;
  date: string;
  duration_minutes: number;
  category: string;
  status: "Upcoming" | "Live" | "Recorded" | "Cancelled";
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  price: number;
  topics?: string[];
  video_url?: string;
  thumbnail_url?: string;
  max_attendees?: number;
  attendee_count: number;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface WebinarRegistration {
  registration_id: string;
  webinar_id: string;
  user_id: string;
  status: "Registered" | "Attended" | "Cancelled";
  registered_at: string;
  attended_at?: string;
  cancelled_at?: string;
}

interface WebinarsParams {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// Fetch all webinars with filters
export const useWebinars = (params?: WebinarsParams) => {
  return useQuery({
    queryKey: ["webinars", params],
    queryFn: async () => {
      const response = await api.get("/webinars", { params });
      return response.data;
    },
  });
};

// Fetch single webinar
export const useWebinar = (webinarId: string) => {
  return useQuery({
    queryKey: ["webinar", webinarId],
    queryFn: async () => {
      const response = await api.get(`/webinars/${webinarId}`);
      return response.data;
    },
    enabled: !!webinarId,
  });
};

// Fetch user's webinar registrations
export const useMyWebinarRegistrations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-webinar-registrations", user?.school_id],
    queryFn: async () => {
      if (!user?.school_id) {
        throw new Error("No school ID available");
      }
      return webinarAnalyticsApi.getMyRegistrations(user.school_id, { include_analytics: true });
    },
    enabled: !!user?.school_id,
  });
};

// Register for a webinar with school/class selection
export const useRegisterWebinar = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      webinarId,
      request,
    }: {
      webinarId: string;
      request?: RegistrationRequest;
    }) => {
      if (!user?.school_id || !user?.id) {
        throw new Error("User authentication required");
      }
      return webinarAnalyticsApi.registerWebinar(
        webinarId,
        user.school_id,
        user.id,
        request || { registration_type: "school" }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webinars"] });
      queryClient.invalidateQueries({ queryKey: ["my-webinar-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registered-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["webinar-analytics"] });
    },
  });
};

// Unregister from a webinar
export const useUnregisterWebinar = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (webinarId: string) => {
      if (!user?.school_id) {
        throw new Error("User authentication required");
      }
      return webinarAnalyticsApi.unregisterWebinar(webinarId, user.school_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webinars"] });
      queryClient.invalidateQueries({ queryKey: ["my-webinar-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registered-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["webinar-analytics"] });
    },
  });
};

// Create webinar (admin only)
export const useCreateWebinar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (webinarData: Partial<Webinar>) => {
      const response = await api.post("/webinars", webinarData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webinars"] });
    },
  });
};

// Update webinar (admin only)
export const useUpdateWebinar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ webinarId, data }: { webinarId: string; data: Partial<Webinar> }) => {
      const response = await api.put(`/webinars/${webinarId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webinars"] });
    },
  });
};

// Delete webinar (admin only)
export const useDeleteWebinar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (webinarId: string) => {
      const response = await api.delete(`/webinars/${webinarId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webinars"] });
    },
  });
};
