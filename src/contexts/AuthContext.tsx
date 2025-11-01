import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { apiClient } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  loginWithRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock credentials for quick login - now school-specific
const getMockCredentials = (role: UserRole, schoolId?: string): { email: string; password: string } => {
  // Get school data from localStorage to get the actual domain
  const schoolData = localStorage.getItem('selected_school');
  let schoolDomain = 'greenwood.edu'; // default
  let schoolEmail = ''; // Will be extracted from school data if available
  
  if (schoolData) {
    try {
      const school = JSON.parse(schoolData);
      console.log('getMockCredentials: Using school:', school.name, school.school_id);
      
      // First, try to use the email from school data if available
      if (school.email) {
        const emailParts = school.email.split('@');
        if (emailParts.length === 2) {
          schoolDomain = emailParts[1];
          console.log('getMockCredentials: Extracted domain from school email:', schoolDomain);
        }
      } else {
        // Fallback: Extract domain from school name or use a mapping
        const schoolDomainMap: Record<string, string> = {
          'Greenwood High School': 'greenwood.edu',
          'Riverside Academy': 'riverside.edu',
          'Oakridge International School': 'oakridge.edu',
          'Maple Valley School': 'maplevalley.edu',
          'Lincoln High School': 'lincoln.edu',
          'Washington Academy': 'washington.edu',
        };
        schoolDomain = schoolDomainMap[school.name] || schoolDomain;
        console.log('getMockCredentials: Using mapped domain:', schoolDomain);
      }
    } catch (e) {
      console.error('Failed to parse school data:', e);
    }
  }
  
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
  };
  
  console.log('getMockCredentials: Generated credentials for', role, ':', credentials[role].email);
  return credentials[role];
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          apiClient.setToken(token);
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            
            // Fetch school name if not provided
            let schoolName = userData.school_name;
            if (userData.school_id && !schoolName) {
              try {
                const schoolResponse = await fetch(
                  `${import.meta.env.VITE_API_BASE_URL}/schools/${userData.school_id}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                  }
                );
                if (schoolResponse.ok) {
                  const schoolData = await schoolResponse.json();
                  schoolName = schoolData.data?.name || schoolData.name;
                }
              } catch (error) {
                console.error('Failed to fetch school name:', error);
              }
            }
            
            setUser({
              id: userData.user_id,
              name: userData.display_name,
              email: userData.email,
              role: userData.role as UserRole,
              school_id: userData.school_id,
              school_name: schoolName,
            });
          } else {
            // Token invalid, clear it
            localStorage.removeItem('auth_token');
            apiClient.clearToken();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          apiClient.clearToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Set token
      apiClient.setToken(data.access_token);
      localStorage.setItem('auth_token', data.access_token);
      
      // Fetch school name if not provided
      let schoolName = data.user.school_name;
      if (data.user.school_id && !schoolName) {
        try {
          const schoolResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/schools/${data.user.school_id}`,
            {
              headers: {
                'Authorization': `Bearer ${data.access_token}`,
              },
            }
          );
          if (schoolResponse.ok) {
            const schoolData = await schoolResponse.json();
            schoolName = schoolData.data?.name || schoolData.name;
          }
        } catch (error) {
          console.error('Failed to fetch school name:', error);
        }
      }
      
      // Set user
      const userData: User = {
        id: data.user.user_id,
        name: data.user.display_name,
        email: data.user.email,
        role: data.user.role as UserRole,
        school_id: data.user.school_id,
        school_name: schoolName,
      };
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithRole = async (role: UserRole) => {
    // Get selected school from localStorage
    const schoolData = localStorage.getItem('selected_school');
    const schoolId = schoolData ? JSON.parse(schoolData).school_id : undefined;
    
    const credentials = getMockCredentials(role, schoolId);
    await login(credentials.email, credentials.password);
  };

  const logout = () => {
    setUser(null);
    apiClient.clearToken();
    localStorage.removeItem('auth_token');
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, loginWithRole, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};