import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schoolAdminApi, riskAlertsApi } from '@/services/schoolAdmin';
import { toast } from 'sonner';

export const useSchoolDashboard = (schoolId?: string) => {
  return useQuery({
    queryKey: ['school-admin', 'dashboard', schoolId],
    queryFn: () => schoolAdminApi.getDashboardOverview(schoolId!),
    enabled: !!schoolId,
  });
};

export const useAtRiskStudents = (schoolId?: string, riskLevel?: string) => {
  return useQuery({
    queryKey: ['school-admin', 'at-risk-students', schoolId, riskLevel],
    queryFn: () => schoolAdminApi.getAtRiskStudents(schoolId!, riskLevel),
    enabled: !!schoolId,
  });
};

export const useCounsellorWorkload = (schoolId?: string) => {
  return useQuery({
    queryKey: ['school-admin', 'counsellor-workload', schoolId],
    queryFn: () => schoolAdminApi.getCounsellorWorkload(schoolId!),
    enabled: !!schoolId,
  });
};

export const useGradeLevelAnalysis = (schoolId?: string) => {
  return useQuery({
    queryKey: ['school-admin', 'grade-level', schoolId],
    queryFn: () => schoolAdminApi.getGradeLevelAnalysis(schoolId!),
    enabled: !!schoolId,
  });
};

export const useMonthlySummary = (schoolId?: string, year?: number, month?: number) => {
  return useQuery({
    queryKey: ['school-admin', 'monthly-summary', schoolId, year, month],
    queryFn: () => schoolAdminApi.getMonthlySummary(schoolId!, year!, month!),
    enabled: !!schoolId && !!year && !!month,
  });
};

export const useSchoolAdmins = (schoolId?: string) => {
  return useQuery({
    queryKey: ['school-admin', 'list', schoolId],
    queryFn: () => schoolAdminApi.listAdmins(schoolId!),
    enabled: !!schoolId,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schoolAdminApi.createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-admin'] });
      toast.success('Admin created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create admin');
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminId, data }: { adminId: string; data: any }) =>
      schoolAdminApi.updateAdmin(adminId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-admin'] });
      toast.success('Admin updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update admin');
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schoolAdminApi.deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-admin'] });
      toast.success('Admin deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete admin');
    },
  });
};

// Risk Alerts Hooks
export const useRiskAlerts = (schoolId?: string, filters?: { status?: string; level?: string }) => {
  return useQuery({
    queryKey: ['risk-alerts', schoolId, filters],
    queryFn: () => riskAlertsApi.getRiskAlerts(schoolId!, filters),
    enabled: !!schoolId,
  });
};

export const useUpdateRiskAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, data }: { alertId: string; data: any }) =>
      riskAlertsApi.updateRiskAlert(alertId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-alerts'] });
      toast.success('Risk alert updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update risk alert');
    },
  });
};
