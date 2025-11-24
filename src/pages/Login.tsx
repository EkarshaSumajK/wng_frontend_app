import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Building2, Loader2, Shield, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Animation on mount
  useEffect(() => {
    setMounted(true);
    
    // Load remembered email
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    // Keyboard shortcut: Ctrl/Cmd + K to focus email
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('email')?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Email validation
  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null;
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailTouched(true);
    setPasswordTouched(true);

    // Client-side validation
    if (!isEmailValid(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

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
      // Enhanced error messages
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      
      if (errorMessage.includes('credentials') || errorMessage.includes('password')) {
        setError('Invalid email or password. Please try again.');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (errorMessage.includes('timeout')) {
        setError('Request timed out. Please try again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
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

      <div className={`w-full max-w-md relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Enhanced Header */}
        <div className="text-center mb-8 space-y-6">
          <div className="inline-flex items-center gap-3 mb-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary transform group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient-hero">
              WellNest Group
            </h1>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              Welcome Back
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Sign in to access your dashboard
            </p>
          </div>
        </div>

        {/* Enhanced Login Card */}
        <Card className="card-professional shadow-xl backdrop-blur-sm bg-card/95 border-2 hover:border-primary/20 transition-all duration-300">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field with validation */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center justify-between">
                  <span>Email Address</span>
                  {emailTouched && email && (
                    <span className={`text-xs ${isEmailValid(email) ? 'text-success' : 'text-destructive'}`}>
                      {isEmailValid(email) ? '✓ Valid' : '✗ Invalid format'}
                    </span>
                  )}
                </Label>
                <div className="relative group">
                  <Mail className={`absolute left-3 top-3 w-4 h-4 transition-colors ${
                    emailTouched && email && isEmailValid(email) 
                      ? 'text-success' 
                      : 'text-muted-foreground group-focus-within:text-primary'
                  }`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@school.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    onBlur={() => setEmailTouched(true)}
                    className={`pl-10 transition-all duration-200 ${
                      emailTouched && email && !isEmailValid(email)
                        ? 'border-destructive focus-visible:ring-destructive'
                        : 'focus-visible:ring-primary'
                    }`}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  {emailTouched && email && isEmailValid(email) && (
                    <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-success" />
                  )}
                </div>
              </div>

              {/* Password Field with strength indicator */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center justify-between">
                  <span>Password</span>
                  {passwordTouched && password && (
                    <span className={`text-xs ${
                      getPasswordStrength(password) === 'strong' ? 'text-success' :
                      getPasswordStrength(password) === 'medium' ? 'text-warning' :
                      'text-muted-foreground'
                    }`}>
                      {getPasswordStrength(password) === 'strong' ? '● Strong' :
                       getPasswordStrength(password) === 'medium' ? '● Medium' :
                       '● Weak'}
                    </span>
                  )}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    className="pl-10 pr-10 focus-visible:ring-primary transition-all duration-200"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded p-0.5"
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer select-none"
                  >
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary-hover hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                  onClick={() => {
                    // TODO: Implement forgot password
                    alert('Forgot password functionality coming soon');
                  }}
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message with animation */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-lg animate-in slide-in-from-top duration-300">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              {/* Enhanced Submit Button */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full group relative overflow-hidden"
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>

              {/* Keyboard shortcut hint */}
              <p className="text-xs text-center text-muted-foreground">
                Press <kbd className="px-2 py-0.5 bg-muted rounded border border-border font-mono">⌘K</kbd> or <kbd className="px-2 py-0.5 bg-muted rounded border border-border font-mono">Ctrl+K</kbd> to focus email
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Enhanced Register School Section */}
        <div className="mt-8 space-y-5">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-semibold tracking-wider">
                New to WellNest?
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/school-onboarding')}
              className="group relative overflow-hidden border-2 border-primary hover:border-primary bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 hover:to-primary/5 transition-all duration-300 shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center font-semibold">
                <Building2 className="w-4 h-4 mr-2" />
                Register School
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/school-selection')}
              className="group relative overflow-hidden border-2 border-secondary hover:border-secondary bg-gradient-to-br from-secondary/5 to-transparent hover:from-secondary/10 hover:to-secondary/5 transition-all duration-300 shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center font-semibold">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                School Selection
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </div>

        {/* Enhanced Footer with social proof */}
        <div className="mt-8">
          <p className="text-center text-xs text-muted-foreground">
            Trusted by schools nationwide for student mental health support
          </p>
        </div>
      </div>
    </div>
  );
}
