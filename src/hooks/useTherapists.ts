import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// Types
export interface Therapist {
  therapist_id: string;
  name: string;
  specialty: string;
  bio?: string;
  rating: number;
  review_count: number;
  location: string;
  city: string;
  state?: string;
  distance_km?: number;
  experience_years: number;
  languages: string[];
  availability_status: 'Available' | 'Limited' | 'Unavailable';
  consultation_fee_min: number;
  consultation_fee_max: number;
  qualifications?: any[];
  areas_of_expertise?: string[];
  profile_image_url?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface TherapistBooking {
  booking_id: string;
  therapist_id: string;
  user_id: string;
  student_id?: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: 'Requested' | 'Confirmed' | 'Cancelled' | 'Completed';
  notes?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  cancelled_at?: string;
  completed_at?: string;
}

interface TherapistsParams {
  specialty?: string;
  city?: string;
  availability_status?: string;
  min_rating?: number;
  language?: string;
  min_experience?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

interface BookingCreateData {
  therapist_id: string;
  student_id?: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes?: number;
  notes?: string;
}

// Fetch all therapists with filters
export const useTherapists = (params?: TherapistsParams) => {
  return useQuery({
    queryKey: ['therapists', params],
    queryFn: async () => {
      const response = await api.get('/therapists', { params });
      return response.data;
    },
  });
};

// Fetch single therapist
export const useTherapist = (therapistId: string) => {
  return useQuery({
    queryKey: ['therapist', therapistId],
    queryFn: async () => {
      const response = await api.get(`/therapists/${therapistId}`);
      return response.data;
    },
    enabled: !!therapistId,
  });
};

// Fetch user's therapist bookings
export const useMyTherapistBookings = () => {
  return useQuery({
    queryKey: ['my-therapist-bookings'],
    queryFn: async () => {
      const response = await api.get('/therapists/my-bookings');
      return response.data;
    },
  });
};

// Book appointment with therapist
export const useBookTherapist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: BookingCreateData) => {
      const response = await api.post(`/therapists/${bookingData.therapist_id}/book`, bookingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
      queryClient.invalidateQueries({ queryKey: ['my-therapist-bookings'] });
    },
  });
};

// Update booking
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bookingId, data }: { bookingId: string; data: Partial<TherapistBooking> }) => {
      const response = await api.put(`/therapists/bookings/${bookingId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-therapist-bookings'] });
    },
  });
};

// Cancel booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bookingId, reason }: { bookingId: string; reason?: string }) => {
      const response = await api.post(`/therapists/bookings/${bookingId}/cancel`, { cancellation_reason: reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-therapist-bookings'] });
    },
  });
};

// Create therapist (admin only)
export const useCreateTherapist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (therapistData: Partial<Therapist>) => {
      const response = await api.post('/therapists', therapistData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
    },
  });
};

// Update therapist (admin only)
export const useUpdateTherapist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ therapistId, data }: { therapistId: string; data: Partial<Therapist> }) => {
      const response = await api.put(`/therapists/${therapistId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
    },
  });
};

// Delete therapist (admin only)
export const useDeleteTherapist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (therapistId: string) => {
      const response = await api.delete(`/therapists/${therapistId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
    },
  });
};
