import { apiClient } from './api';

export const schoolAdminApi = {
  // Dashboard endpoints
  getDashboardOverview: (schoolId: string) =>
    apiClient.get(`/school-admin/dashboard/overview?school_id=${schoolId}`),

  getAtRiskStudents: (schoolId: string, riskLevel?: string) =>
    apiClient.get(`/school-admin/dashboard/at-risk-students?school_id=${schoolId}${riskLevel ? `&risk_level=${riskLevel}` : ''}`),

  getCounsellorWorkload: (schoolId: string) =>
    apiClient.get(`/school-admin/dashboard/counsellor-workload?school_id=${schoolId}`),

  getGradeLevelAnalysis: (schoolId: string) =>
    apiClient.get(`/school-admin/dashboard/grade-level-analysis?school_id=${schoolId}`),

  getMonthlySummary: (schoolId: string, year: number, month: number) =>
    apiClient.get(`/school-admin/reports/monthly-summary?school_id=${schoolId}&year=${year}&month=${month}`),

  // Admin management
  listAdmins: (schoolId: string) =>
    apiClient.get(`/school-admin?school_id=${schoolId}`),

  getAdmin: (adminId: string) =>
    apiClient.get(`/school-admin/${adminId}`),

  createAdmin: (data: any) =>
    apiClient.post('/school-admin', data),

  updateAdmin: (adminId: string, data: any) =>
    apiClient.patch(`/school-admin/${adminId}`, data),

  deleteAdmin: (adminId: string) =>
    apiClient.delete(`/school-admin/${adminId}`),

  uploadLogo: (schoolId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.uploadFile<any>(`/schools/${schoolId}/logo`, formData);
  },
};

// Risk Alerts API
export const riskAlertsApi = {
  getRiskAlerts: (schoolId: string, filters?: { status?: string; level?: string }) =>
    apiClient.get(`/risk-alerts?school_id=${schoolId}${filters?.status ? `&status=${filters.status}` : ''}${filters?.level ? `&level=${filters.level}` : ''}`),

  updateRiskAlert: (alertId: string, data: any) =>
    apiClient.put(`/risk-alerts/${alertId}`, data),
};
