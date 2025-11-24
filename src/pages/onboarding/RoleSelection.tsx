import { useState, useEffect } from "react";
import { Brain, Users, Shield, Building2, ArrowLeft, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);

  useEffect(() => {
    setMounted(true);
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-secondary opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-accent opacity-5 rounded-full blur-3xl"></div>
        
        {/* Floating particles effect */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-secondary/20 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-accent/20 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
      </div>

      <div className={`w-full max-w-7xl relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToSchools}
            className="gap-2 hover:bg-primary/5 transition-colors"
            disabled={selectedRole !== null}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Schools
          </Button>
        </div>

        {/* Enhanced Header */}
        <div className="text-center mb-10 space-y-6">
          {selectedSchool && (
            <div className="inline-flex items-center gap-3 mb-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary transform group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gradient-hero">
                {selectedSchool.name}
              </h1>
            </div>
          )}
          
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              Select Your Role
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
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
              className={`card-professional cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl backdrop-blur-sm bg-card/95 border-2 group ${
                selectedRole === role.id 
                  ? 'ring-2 ring-primary border-primary/50 shadow-primary' 
                  : hoveredRole === role.id
                  ? 'border-primary/30'
                  : 'hover:border-primary/20'
              } ${selectedRole !== null && selectedRole !== role.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => selectedRole === null && handleRoleSelect(role.id)}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  <div className={`absolute inset-0 rounded-2xl blur-lg opacity-30 transition-opacity ${
                    role.id === 'COUNSELLOR' ? 'bg-gradient-primary' :
                    role.id === 'TEACHER' ? 'bg-gradient-secondary' :
                    'bg-gradient-accent'
                  } ${hoveredRole === role.id || selectedRole === role.id ? 'opacity-50' : ''}`}></div>
                  <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 ${
                    role.id === 'COUNSELLOR' ? 'bg-gradient-primary' :
                    role.id === 'TEACHER' ? 'bg-gradient-secondary' :
                    'bg-gradient-accent'
                  }`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                  {role.title}
                </CardTitle>
                <CardDescription className="text-center text-sm">
                  {role.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2.5">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full group/btn relative overflow-hidden"
                  variant={selectedRole === role.id ? "gradient" : "outline"}
                  disabled={selectedRole !== null}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {selectedRole === role.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Accessing...
                      </>
                    ) : (
                      <>
                        Enter as {role.title}
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-8 p-4 bg-destructive/10 border border-destructive rounded-lg text-center animate-in slide-in-from-top duration-300">
            <p className="text-destructive font-medium mb-2">{error}</p>
            <p className="text-sm text-muted-foreground">
              Make sure the backend server is running on http://localhost:8000
            </p>
          </div>
        )}
        
        {/* Enhanced Footer */}
        <div className="mt-12 space-y-3">
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              disabled={selectedRole !== null}
            >
              ← Back to Login
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground font-medium">
            Powered by <span className="text-gradient-hero font-semibold">WellNest Group</span>
          </p>
        </div>
      </div>
    </div>
  );
}