import { apiClient } from './api';

export interface OnboardingUser {
  user_id?: string;
  email: string;
  display_name: string;
  role: 'teacher' | 'counsellor' | 'school_admin' | 'parent';
  phone?: string;
  school_id: string;
  password: string;
  profile?: any;
  availability?: any;
}

export interface OnboardingStudent {
  student_id?: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  school_id: string;
  class_id?: string;
  parent_email?: string;
  parent_phone?: string;
  medical_info?: any;
  emergency_contact?: any;
}

export interface SchoolOnboardingData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  timezone: string;
  academic_year: string;
  settings?: {
    enable_parent_portal?: boolean;
    enable_sso?: boolean;
    notification_preferences?: {
      email_notifications?: boolean;
      sms_notifications?: boolean;
      weekly_reports?: boolean;
    };
    custom_fields?: any;
  };
}

// School Onboarding
export const onboardSchool = async (data: SchoolOnboardingData) => {
  const response = await apiClient.post('/schools/onboarding', data);
  return response;
};

export const getSchools = async () => {
  const response = await apiClient.get('/schools');
  return response;
};

export const getSchoolById = async (schoolId: string) => {
  const response = await apiClient.get(`/schools/${schoolId}`);
  return response;
};

export const updateSchool = async (schoolId: string, data: Partial<SchoolOnboardingData>) => {
  const response = await apiClient.patch(`/schools/${schoolId}`, data);
  return response;
};

export const deleteSchool = async (schoolId: string) => {
  const response = await apiClient.delete(`/schools/${schoolId}`);
  return response;
};

// Teachers
export const createTeacher = async (data: OnboardingUser) => {
  const response = await apiClient.post('/teachers/', { ...data, role: 'TEACHER' });
  return response;
};

export const getTeachers = async (schoolId: string) => {
  const response = await apiClient.get(`/teachers/?school_id=${schoolId}`);
  return response;
};

export const updateTeacher = async (teacherId: string, data: Partial<OnboardingUser>) => {
  const response = await apiClient.patch(`/teachers/${teacherId}`, data);
  return response;
};

export const deleteTeacher = async (teacherId: string) => {
  const response = await apiClient.delete(`/teachers/${teacherId}`);
  return response;
};

// Counsellors
export const createCounsellor = async (data: OnboardingUser) => {
  const response = await apiClient.post('/counsellors/', { ...data, role: 'COUNSELLOR' });
  return response;
};

export const getCounsellors = async (schoolId: string) => {
  const response = await apiClient.get(`/counsellors/?school_id=${schoolId}`);
  return response;
};

export const updateCounsellor = async (counsellorId: string, data: Partial<OnboardingUser>) => {
  const response = await apiClient.patch(`/counsellors/${counsellorId}`, data);
  return response;
};

export const deleteCounsellor = async (counsellorId: string) => {
  const response = await apiClient.delete(`/counsellors/${counsellorId}`);
  return response;
};

// School Admins
export const createSchoolAdmin = async (data: OnboardingUser) => {
  const response = await apiClient.post('/users/', { ...data, role: 'PRINCIPAL' });
  return response;
};

export const getSchoolAdmins = async (schoolId: string) => {
  const response = await apiClient.get(`/users/?school_id=${schoolId}&role=PRINCIPAL`);
  return response;
};

export const updateSchoolAdmin = async (adminId: string, data: Partial<OnboardingUser>) => {
  const response = await apiClient.patch(`/users/${adminId}`, data);
  return response;
};

export const deleteSchoolAdmin = async (adminId: string) => {
  const response = await apiClient.delete(`/users/${adminId}`);
  return response;
};

// Parents
export const createParent = async (data: OnboardingUser) => {
  const response = await apiClient.post('/users/', { ...data, role: 'PARENT' });
  return response;
};

export const getParents = async (schoolId: string) => {
  const response = await apiClient.get(`/users/?school_id=${schoolId}&role=PARENT`);
  return response;
};

export const updateParent = async (parentId: string, data: Partial<OnboardingUser>) => {
  const response = await apiClient.patch(`/users/${parentId}`, data);
  return response;
};

export const deleteParent = async (parentId: string) => {
  const response = await apiClient.delete(`/users/${parentId}`);
  return response;
};

// Students
export const createStudent = async (data: OnboardingStudent) => {
  const response = await apiClient.post('/students/', data);
  return response;
};

export const getStudents = async (schoolId: string) => {
  const response = await apiClient.get(`/students/?school_id=${schoolId}`);
  return response;
};

export const updateStudent = async (studentId: string, data: Partial<OnboardingStudent>) => {
  const response = await apiClient.patch(`/students/${studentId}`, data);
  return response;
};

export const deleteStudent = async (studentId: string) => {
  const response = await apiClient.delete(`/students/${studentId}`);
  return response;
};

// Classes
export const getClasses = async (schoolId: string) => {
  const response = await apiClient.get(`/classes/?school_id=${schoolId}`);
  return response;
};

export const createClass = async (data: any) => {
  const response = await apiClient.post('/classes/', data);
  return response;
};

export const updateClass = async (classId: string, data: any) => {
  const response = await apiClient.patch(`/classes/${classId}`, data);
  return response;
};

export const deleteClass = async (classId: string) => {
  const response = await apiClient.delete(`/classes/${classId}`);
  return response;
};
