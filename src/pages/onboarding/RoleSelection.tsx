import { useState, useEffect } from "react";
import { Brain, Users, Shield, Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { useNavigate, useLocation } from "react-router-dom";

const roles = [
  {
    id: 'COUNSELLOR' as UserRole,
    title: 'School Counsellor',
    description: 'Manage student cases, conduct assessments, and provide therapeutic interventions',
    icon: Brain,
    features: [
      'Case management system',
      'AI-powered risk assessment',
      'Intervention planning tools',
      'Session notes & tracking',
      'Resource library access'
    ]
  },
  {
    id: 'TEACHER' as UserRole,
    title: 'Teacher',
    description: 'Monitor classroom wellbeing, implement programs, and observe student behavior',
    icon: Users,
    features: [
      'Class wellbeing dashboard',
      'Observation logging',
      'Activity planning',
      'Student participation tracking',
      'Counsellor collaboration'
    ]
  },
  {
    id: 'PRINCIPAL' as UserRole,
    title: 'Principal',
    description: 'Oversee school-wide mental health initiatives and resource allocation',
    icon: Shield,
    features: [
      'School-wide analytics',
      'Resource management',
      'Policy oversight',
      'Staff workload monitoring',
      'Compliance reporting'
    ]
  }
];

export default function RoleSelection() {
  const { loginWithRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  useEffect(() => {
    console.log('RoleSelection: useEffect triggered, location:', location.pathname);
    // Get selected school from localStorage
    const schoolData = localStorage.getItem('selected_school');
    if (schoolData) {
      const school = JSON.parse(schoolData);
      setSelectedSchool(school);
      console.log('RoleSelection: Loaded school:', school.name, school.school_id);
    } else {
      // If no school selected, redirect back to school selection
      console.warn('RoleSelection: No school found, redirecting to school selection');
      navigate('/school-selection');
    }
  }, [navigate, location]);

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    try {
      // Add a brief delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      await loginWithRole(role);
      
      // Navigate to appropriate dashboard based on role
      const roleRoutes: Record<UserRole, string> = {
        COUNSELLOR: '/counsellor',
        TEACHER: '/teacher',
        PRINCIPAL: '/principal',
        LEADERSHIP: '/leadership',
      };
      
      navigate(roleRoutes[role] || '/counsellor');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      setSelectedRole(null);
    }
  };

  const handleBackToSchools = () => {
    localStorage.removeItem('selected_school');
    navigate('/school-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-secondary/30 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToSchools}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Schools
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              WellNest Group
            </h1>
          </div>
          
          {selectedSchool && (
            <div className="flex items-center justify-center gap-2 mb-4 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{selectedSchool.name}</span>
            </div>
          )}
          
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Select Your Role
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your role to access tailored tools and insights for supporting student wellbeing
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <Card 
              key={role.id}
              className={`card-professional cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedRole === role.id ? 'ring-2 ring-primary shadow-professional-lg' : ''
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-gradient-secondary rounded-xl flex items-center justify-center mb-4">
                  <role.icon className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <CardDescription className="text-center">
                  {role.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full mt-6"
                  variant={selectedRole === role.id ? "default" : "outline"}
                  disabled={selectedRole !== null}
                >
                  {selectedRole === role.id ? 'Accessing...' : `Enter as ${role.title}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-center">
            <p className="text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure the backend server is running on http://localhost:8000
            </p>
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Secure • WCAG 2.1 AA Compliant • Privacy-First Design</p>
          <p className="mt-2 text-xs">Demo credentials: All passwords are "password123"</p>
        </div>
      </div>
    </div>
  );
}