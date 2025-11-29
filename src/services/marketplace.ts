import { apiClient } from './api';

export interface Therapist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  experience: string;
  languages: string[];
  availability: string;
  fee: string;
  image: string;
  isRecommended: boolean;
  about: string;
  expertise: string[];
}

export interface TherapistFilters {
  specialty?: string;
  city?: string;
  availability_status?: string;
  min_rating?: number;
  language?: string;
  search?: string;
  limit?: number;
}

interface BackendTherapistResponse {
  therapists: BackendTherapist[];
  total: number;
  page: number;
  page_size: number;
}

interface BackendTherapist {
  therapist_id: string;
  name: string;
  specialty: string;
  rating: number;
  review_count: number;
  location: string;
  city: string;
  experience_years: number;
  languages: string[];
  availability_status: string;
  consultation_fee_min: number;
  consultation_fee_max: number;
  profile_image_url?: string;
  bio?: string;
  areas_of_expertise?: string[];
  verified: boolean;
}

export const marketplaceApi = {
  getTherapists: async (filters?: TherapistFilters) => {
    try {
        const params: Record<string, string | number> = {};
        if (filters) {
          if (filters.specialty && filters.specialty !== "all") params.specialty = filters.specialty;
          if (filters.city && filters.city !== "all") params.city = filters.city;
          if (filters.availability_status && filters.availability_status !== "all") params.availability_status = filters.availability_status;
          if (filters.min_rating) params.min_rating = filters.min_rating;
          if (filters.language && filters.language !== "all") params.language = filters.language;
          if (filters.search) params.search = filters.search;
          if (filters.limit) params.limit = filters.limit;
        }

        const response = await apiClient.get<BackendTherapistResponse>('/therapists', params);
        
        // Check if response is wrapped or direct
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const therapistsData = response.therapists || (response as any).data?.therapists || [];
        
        return therapistsData.map((item: BackendTherapist) => ({
            id: item.therapist_id,
            name: item.name,
            specialty: item.specialty,
            rating: Number(item.rating),
            reviews: item.review_count,
            location: item.location,
            experience: `${item.experience_years} years`,
            languages: item.languages || [],
            availability: item.availability_status,
            fee: `₹${item.consultation_fee_min} - ₹${item.consultation_fee_max}`,
            image: item.profile_image_url || "default",
            isRecommended: Number(item.rating) > 4.8,
            about: item.bio || "No bio available",
            expertise: item.areas_of_expertise || []
        })) as Therapist[];
    } catch (error) {
        console.error("Failed to fetch therapists", error);
        return [];
    }
  },
  
  getTherapistById: (id: string) => 
    apiClient.get<Therapist>(`/therapists/${id}`)
};
