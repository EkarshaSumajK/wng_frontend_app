import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Building2, Loader2, Phone, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { GridBackground } from "@/components/ui/grid-background";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Validation Schemas
const emailLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

const phoneLoginSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

// Types
type EmailLoginFormValues = z.infer<typeof emailLoginSchema>;
type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // State
  const [activeTab, setActiveTab] = useState("email");
  const [authType, setAuthType] = useState<"password" | "otp">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // OTP State (Mock for now as backend implementation is pending)
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Forms
  const emailForm = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const phoneForm = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: "",
      password: "",
      rememberMe: false,
    },
  });

  // Animation on mount
  useEffect(() => {
    setMounted(true);
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      emailForm.setValue('email', rememberedEmail);
      emailForm.setValue('rememberMe', true);
    }
  }, [emailForm]);

  // OTP Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOtp = async () => {
    // This would be connected to a real backend endpoint
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpTimer(30);
      setError(null);
    }, 1000);
  };

  const onEmailSubmit = async (data: EmailLoginFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      if (data.rememberMe) {
        localStorage.setItem('remembered_email', data.email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      if (authType === "otp") {
        // OTP Login Logic (Placeholder)
        throw new Error("OTP Login not yet implemented on backend");
      } else {
        // Password Login
        const response = await login(data.email, data.password);
        handleLoginSuccess(response);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onPhoneSubmit = async (data: PhoneLoginFormValues) => {
    setError(null);
    setIsLoading(true);
    
    try {
       // Phone login logic would go here
       throw new Error("Phone login not yet implemented on backend");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (response: any) => {
      if (response.role === 'PRINCIPAL' && response.school_id) {
        try {
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
            const needsOnboarding = school.settings?.needs_data_onboarding || false;
            
            if (needsOnboarding) {
              localStorage.setItem('selected_school', JSON.stringify({
                school_id: school.school_id,
                name: school.name,
                needs_data_onboarding: true
              }));
              navigate('/data-onboarding');
              return;
            }
          }
        } catch (schoolErr) {
          console.error('Failed to fetch school data:', schoolErr);
        }
      }
      
      const roleRoutes: Record<string, string> = {
        COUNSELLOR: '/counsellor',
        TEACHER: '/teacher',
        PRINCIPAL: '/principal',
        LEADERSHIP: '/leadership',
      };
      
      const route = roleRoutes[response.role] || '/counsellor';
      navigate(route);
  };

  return (
    <GridBackground className="p-4 sm:p-6">
      <div className={`w-full max-w-3xl space-y-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mx-auto`}>
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/50 text-primary mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Wellnest Connect <br></br>School Mental Wellness Platform
          </h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-8">
          {/* Login Card */}
          <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50">
            <CardContent className="p-6">
              <Tabs defaultValue="email" className="w-full" onValueChange={(val) => { setActiveTab(val); setError(null); }}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>

                {/* Email Login Form */}
                <TabsContent value="email" className="space-y-4 mt-0">
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                              <FormControl>
                                <Input 
                                  placeholder="name@school.edu" 
                                  className="pl-10 h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 transition-colors" 
                                  {...field} 
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <Label>Authentication Method</Label>
                        <RadioGroup 
                          defaultValue="password" 
                          value={authType}
                          onValueChange={(v) => setAuthType(v as "password" | "otp")}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="password" id="e-password" />
                            <Label htmlFor="e-password" className="font-normal cursor-pointer">Password</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="otp" id="e-otp" />
                            <Label htmlFor="e-otp" className="font-normal cursor-pointer">OTP</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {authType === 'password' ? (
                        <FormField
                          control={emailForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="animate-in fade-in slide-in-from-top-2">
                              <Label>Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                                <FormControl>
                                  <Input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    className="pl-10 pr-10 h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 transition-colors" 
                                    {...field} 
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                          <Label>One-Time Password</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <KeyRound className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                              <Input
                                placeholder="Enter OTP"
                                className="pl-10 h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 transition-colors"
                                disabled={!otpSent || isLoading}
                              />
                            </div>
                            <Button 
                              type="button" 
                              variant="outline"
                              className="h-12 px-4 whitespace-nowrap"
                              onClick={handleSendOtp}
                              disabled={isLoading || (otpSent && otpTimer > 0)}
                            >
                              {otpTimer > 0 ? `Resend in ${otpTimer}s` : (otpSent ? "Resend OTP" : "Get OTP")}
                            </Button>
                          </div>
                          {otpSent && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> OTP Sent to your email</p>}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <FormField
                          control={emailForm.control}
                          name="rememberMe"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <Label className="text-sm font-normal cursor-pointer">
                                Remember me
                              </Label>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="link"
                          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors px-0"
                          onClick={() => alert('Please contact your administrator to reset your password.')}
                        >
                          Forgot password?
                        </Button>
                      </div>

                      {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-red-500" />
                          {error}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* Phone Login Form */}
                <TabsContent value="phone" className="space-y-6 mt-0">
                   <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                      <FormField
                        control={phoneForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <Label>Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                              <FormControl>
                                <Input 
                                  type="tel"
                                  placeholder="+1 (555) 000-0000" 
                                  className="pl-10 h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 transition-colors" 
                                  {...field} 
                                  disabled={isLoading}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <Label>Authentication Method</Label>
                        <RadioGroup 
                          defaultValue="password" 
                          value={authType}
                          onValueChange={(v) => setAuthType(v as "password" | "otp")}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="password" id="p-password" />
                            <Label htmlFor="p-password" className="font-normal cursor-pointer">Password</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="otp" id="p-otp" />
                            <Label htmlFor="p-otp" className="font-normal cursor-pointer">OTP</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Password Field reused logic */}
                      {authType === 'password' ? (
                        <FormField
                          control={phoneForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="animate-in fade-in slide-in-from-top-2">
                              <Label>Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                                <FormControl>
                                  <Input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    className="pl-10 pr-10 h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 transition-colors" 
                                    {...field} 
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                         <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                          <Label>One-Time Password</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <KeyRound className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                              <Input
                                placeholder="Enter OTP"
                                className="pl-10 h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 transition-colors"
                                disabled={!otpSent || isLoading}
                              />
                            </div>
                            <Button 
                              type="button" 
                              variant="outline"
                              className="h-12 px-4 whitespace-nowrap"
                              onClick={handleSendOtp}
                              disabled={isLoading || (otpSent && otpTimer > 0)}
                            >
                              {otpTimer > 0 ? `Resend in ${otpTimer}s` : (otpSent ? "Resend OTP" : "Get OTP")}
                            </Button>
                          </div>
                          {otpSent && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> OTP Sent to your phone</p>}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="space-y-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50/50 dark:bg-gray-900 px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-11 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-gray-700"
                onClick={() => navigate('/school-onboarding')}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Register School
              </Button>
              <Button
                variant="outline"
                className="h-11 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-gray-700"
                onClick={() => navigate('/school-selection')}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Select School
              </Button>
            </div>

            <p className="text-xs text-muted-foreground pt-4">
              © {new Date().getFullYear()} Wellnest Connect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </GridBackground>
  );
}
