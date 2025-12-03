import { useState, useEffect } from "react";
import { Brain, Users, Shield, Building2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { useNavigate, useLocation } from "react-router-dom";
import { GridBackground } from "@/components/ui/grid-background";
import { getDevMockCredentials } from "@/lib/dev-utils";

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
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get selected school from localStorage
    const schoolData = localStorage.getItem('selected_school');
    if (schoolData) {
      const school = JSON.parse(schoolData);
      setSelectedSchool(school);
    } else {
      // If no school selected, redirect back to school selection
      navigate('/school-selection');
    }
  }, [navigate, location]);

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    setIsLoading(true);
    try {
      // Add a brief delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Try to determine domain from selected school, default to greenwood.edu
      let domain = 'greenwood.edu';
      if (selectedSchool?.email) {
        const parts = selectedSchool.email.split('@');
        if (parts.length === 2) {
          domain = parts[1];
        }
      }

      const creds = getDevMockCredentials(role, domain);
      if (!creds.email || !creds.password) {
        throw new Error(`No mock credentials found for role ${role}`);
      }

      await login(creds.email, creds.password);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSchools = () => {
    localStorage.removeItem('selected_school');
    navigate('/school-selection');
  };

  return (
    <GridBackground className="p-4 sm:p-6">
      <div className={`w-full max-w-7xl relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mx-auto`}>
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToSchools}
            className="gap-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            disabled={selectedRole !== null}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Schools
          </Button>
        </div>

        {/* Enhanced Header */}
        <div className="text-center mb-10 space-y-6">
          {selectedSchool && (
            <div className="inline-flex items-center gap-3 mb-2 px-6 py-3 bg-card rounded-2xl shadow-sm border border-border">
              <div className="w-10 h-10 bg-secondary/50 rounded-xl flex items-center justify-center overflow-hidden">
                {selectedSchool.logo_url ? (
                  <img src={selectedSchool.logo_url} alt={selectedSchool.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-5 h-5 text-primary" />
                )}
              </div>
              <h1 className="text-xl font-bold text-foreground">
                {selectedSchool.name}
              </h1>
            </div>
          )}
          
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Select Your Role
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Choose your role to access tailored tools and insights for supporting student wellbeing
            </p>
          </div>
        </div>

        {/* Enhanced Role Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <Card 
              key={role.id}
              className={`border-none shadow-lg hover:shadow-xl bg-card cursor-pointer transition-all duration-300 hover:-translate-y-1 group ${
                selectedRole === role.id 
                  ? 'ring-2 ring-primary' 
                  : ''
              } ${selectedRole !== null && selectedRole !== role.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => selectedRole === null && handleRoleSelect(role.id)}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                    hoveredRole === role.id || selectedRole === role.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-secondary/50 text-primary'
                  }`}>
                    <role.icon className="w-8 h-8" />
                  </div>
                </div>
                <CardTitle className="text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
                  {role.title}
                </CardTitle>
                <CardDescription className="text-center text-sm line-clamp-2">
                  {role.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="h-px w-full bg-border" />
                
                <ul className="space-y-3">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full h-12 rounded-xl font-medium"
                  variant={selectedRole === role.id ? "default" : "outline"}
                  disabled={selectedRole !== null}
                >
                  {selectedRole === role.id ? (
                    <>
                      {selectedRole && isLoading && <Spinner size="sm" className="mr-2" />}
                      Accessing...
                    </>
                  ) : (
                    "Enter Portal"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center animate-in slide-in-from-top duration-300 max-w-md mx-auto">
            <p className="text-destructive font-medium mb-1">{error}</p>
            <p className="text-xs text-destructive/80">
              Please try again or contact support.
            </p>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wellnest Connect. All rights reserved.
          </p>
        </div>
      </div>
    </GridBackground>
  );
}