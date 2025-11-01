import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call login API
      const response = await login(email, password);
      
      // For principals, check if school needs data onboarding
      if (response.role === 'PRINCIPAL' && response.school_id) {
        try {
          // Fetch school data to check needs_data_onboarding flag
          const schoolResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/schools/${response.school_id}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
              },
            }
          );
          
          if (schoolResponse.ok) {
            const schoolData = await schoolResponse.json();
            const school = schoolData.data || schoolData;
            
            // Check if school needs data onboarding
            const needsOnboarding = school.settings?.needs_data_onboarding || false;
            
            if (needsOnboarding) {
              // Store school data for onboarding page
              localStorage.setItem('selected_school', JSON.stringify({
                school_id: school.school_id,
                name: school.name,
                needs_data_onboarding: true
              }));
              
              // Redirect to data onboarding
              navigate('/data-onboarding');
              return;
            }
          }
        } catch (schoolErr) {
          console.error('Failed to fetch school data:', schoolErr);
          // Continue to normal flow if school fetch fails
        }
      }
      
      // Navigate based on user role
      const roleRoutes: Record<string, string> = {
        COUNSELLOR: '/counsellor',
        TEACHER: '/teacher',
        PRINCIPAL: '/principal',
        LEADERSHIP: '/leadership',
      };
      
      const route = roleRoutes[response.role] || '/counsellor';
      navigate(route);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-secondary opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient-hero">
              WellNest Group
            </h1>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-lg">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="card-professional shadow-xl animate-in fade-in slide-in-from-bottom duration-700">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    // TODO: Implement forgot password
                    alert('Forgot password functionality coming soon');
                  }}
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Register School Link */}
        <div className="mt-6 text-center space-y-3 animate-in fade-in duration-1000">
          <p className="text-sm text-muted-foreground font-medium">
            Don't have an account?
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/school-onboarding')}
            >
              Register Your School
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/school-selection')}
              className="text-sm"
            >
              School Selection
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground animate-in fade-in duration-1000">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Secure
            </span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>Privacy-First Design</span>
          </div>
        </div>
      </div>
    </div>
  );
}
