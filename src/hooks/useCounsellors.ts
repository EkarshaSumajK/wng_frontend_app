import { useQuery } from '@tanstack/react-query';
import { counsellorsApi } from '@/services/counsellors';

export const useCounsellors = (params: { school_id?: string }) => {
  return useQuery({
    queryKey: ['counsellors', params],
    queryFn: () => counsellorsApi.getAll({ school_id: params.school_id! }),
    enabled: !!params.school_id,
  });
};

export const useCounsellorDashboard = (counsellorId?: string) => {
  return useQuery({
    queryKey: ['counsellor-dashboard', counsellorId],
    queryFn: () => counsellorsApi.getDashboard(counsellorId!),
    enabled: !!counsellorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCounsellorCaseload = (counsellorId?: string) => {
  return useQuery({
    queryKey: ['counsellor-caseload', counsellorId],
    queryFn: () => counsellorsApi.getCaseload(counsellorId!),
    enabled: !!counsellorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCounsellorCases = (counsellorId?: string) => {
  return useQuery({
    queryKey: ['counsellor-cases', counsellorId],
    queryFn: () => counsellorsApi.getCases(counsellorId!),
    enabled: !!counsellorId,
  });
};
