import { UserRole } from '@/types';

// Mock credentials for development reference only
export const getDevMockCredentials = (role: UserRole, schoolDomain: string = 'greenwood.edu'): { email: string; password: string } => {
  const credentials: Record<UserRole, { email: string; password: string }> = {
    COUNSELLOR: {
      email: `counsellor1@${schoolDomain}`,
      password: 'password123',
    },
    TEACHER: {
      email: `teacher1@${schoolDomain}`,
      password: 'password123',
    },
    PRINCIPAL: {
      email: `principal@${schoolDomain}`,
      password: 'password123',
    },
    LEADERSHIP: {
      email: `principal@${schoolDomain}`,
      password: 'password123',
    },
    // Add other roles as needed
    PARENT: {
        email: `parent1@${schoolDomain}`,
        password: 'password123',
    },
    CLINICIAN: {
        email: `clinician1@${schoolDomain}`,
        password: 'password123',
    },
    ADMIN: {
        email: `admin@${schoolDomain}`,
        password: 'password123',
    }
  };
  
  return credentials[role] || { email: '', password: '' };
};
