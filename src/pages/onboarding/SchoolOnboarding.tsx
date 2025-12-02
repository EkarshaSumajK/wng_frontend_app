import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Check, Mail, MapPin, Phone, User, ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiClient } from "@/services/api";

interface SchoolOnboardingData {
  schoolName: string;
  schoolType: string;
  establishedYear: string;
  websiteUrl: string;
  schoolEmail: string;
  schoolPhone: string;
  registrationNumber: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  contactPersonDesignation: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  termsAccepted: boolean;
}

export default function SchoolOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SchoolOnboardingData, string>>>({});
  
  const totalSteps = 4;
  
  const [formData, setFormData] = useState<SchoolOnboardingData>({
    schoolName: "",
    schoolType: "",
    establishedYear: new Date().getFullYear().toString(),
    websiteUrl: "",
    schoolEmail: "",
    schoolPhone: "",
    registrationNumber: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    contactPersonDesignation: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    termsAccepted: false,
  });

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof SchoolOnboardingData, string>> = {};

    if (step === 1) {
      // School Information validation
      if (formData.schoolName.length < 3) {
        newErrors.schoolName = "School name must be at least 3 characters";
      }
      if (!formData.schoolType) {
        newErrors.schoolType = "Please select school type";
      }
      if (!/^\S+@\S+$/.test(formData.schoolEmail)) {
        newErrors.schoolEmail = "Invalid email";
      }
      if (!/^[0-9]{10}$/.test(formData.schoolPhone)) {
        newErrors.schoolPhone = "Phone must be 10 digits";
      }
      if (formData.registrationNumber.length < 3) {
        newErrors.registrationNumber = "Registration number required";
      }
    } else if (step === 2) {
      // Contact Person validation
      if (formData.contactPersonName.length < 3) {
        newErrors.contactPersonName = "Name must be at least 3 characters";
      }
      if (!/^\S+@\S+$/.test(formData.contactPersonEmail)) {
        newErrors.contactPersonEmail = "Invalid email";
      }
      if (!/^[0-9]{10}$/.test(formData.contactPersonPhone)) {
        newErrors.contactPersonPhone = "Phone must be 10 digits";
      }
    } else if (step === 3) {
      // Address validation
      if (formData.address.length < 10) {
        newErrors.address = "Address must be at least 10 characters";
      }
      if (formData.city.length < 2) {
        newErrors.city = "City required";
      }
      if (!formData.state) {
        newErrors.state = "Please select a state";
      }
      if (!/^[0-9]{6}$/.test(formData.zipCode)) {
        newErrors.zipCode = "PIN code must be 6 digits";
      }
    } else if (step === 4) {
      // Terms validation
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = "You must accept the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post('/schools/onboarding', formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ schoolName: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof SchoolOnboardingData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-secondary/30 flex items-center justify-center p-6">
        <Card className="card-professional max-w-2xl w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Application Submitted Successfully!</h2>
                <p className="text-muted-foreground text-lg">
                  Thank you for your interest in registering your school.
                </p>
                <p className="text-muted-foreground">
                  We have received your application and will review it shortly. 
                  You will receive a confirmation email at{" "}
                  <span className="font-semibold">{formData.schoolEmail}</span>
                </p>
              </div>

              <div className="bg-secondary/50 border border-primary/20 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2">Next Step: Upload Your School Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Save time by bulk uploading your staff, students, parents, and classes using Excel files. 
                  The system will automatically connect parents to students based on email matching.
                </p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Upload teachers, counsellors, and staff</span>
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Upload students with automatic parent linking</span>
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Upload classes and assign teachers</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={() => navigate('/data-onboarding')} size="lg" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload School Data
                </Button>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Skip & Go to Login
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                Your principal account has been created. You can login with:
                <br />
                <span className="font-semibold">{formData.contactPersonEmail}</span>
                <br />
                Password: <span className="font-mono">Welcome123!</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-secondary/30 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card className="card-professional">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl">School Onboarding</CardTitle>
                <CardDescription className="text-base">
                  Wellnest Connect - Mental Health Support Platform
                </CardDescription>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-3">
                <span className={`text-xs ${currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>School Info</span>
                <span className={`text-xs ${currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Contact Person</span>
                <span className={`text-xs ${currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Address</span>
                <span className={`text-xs ${currentStep >= 4 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Review</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/login')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Button>

        {/* Welcome Message */}
        <Card className="bg-secondary/50 border-primary/20">
          <CardContent className="pt-6">
            <p className="font-medium mb-2">Welcome! 👋</p>
            <p className="text-sm text-muted-foreground">
              Please fill out this form to register your school with Wellnest Connect. 
              All fields marked with <span className="text-destructive">*</span> are required.
            </p>
          </CardContent>
        </Card>

        {/* Form */}
        <div className="space-y-8">
          {/* Step 1: School Information */}
          {currentStep === 1 && (
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-secondary-foreground" />
                </div>
                <CardTitle>School Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  placeholder="Enter school name"
                  value={formData.schoolName}
                  onChange={(e) => handleInputChange('schoolName', e.target.value)}
                />
                {errors.schoolName && (
                  <p className="text-sm text-destructive mt-1">{errors.schoolName}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schoolType">School Type *</Label>
                  <Select
                    value={formData.schoolType}
                    onValueChange={(value) => handleInputChange('schoolType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public School</SelectItem>
                      <SelectItem value="private">Private School</SelectItem>
                      <SelectItem value="charter">Charter School</SelectItem>
                      <SelectItem value="magnet">Magnet School</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.schoolType && (
                    <p className="text-sm text-destructive mt-1">{errors.schoolType}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="establishedYear">Established Year *</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.establishedYear}
                    onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://www.yourschool.com"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schoolEmail">School Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="schoolEmail"
                      type="email"
                      placeholder="school@example.com"
                      className="pl-10"
                      value={formData.schoolEmail}
                      onChange={(e) => handleInputChange('schoolEmail', e.target.value)}
                    />
                  </div>
                  {errors.schoolEmail && (
                    <p className="text-sm text-destructive mt-1">{errors.schoolEmail}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="schoolPhone">School Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="schoolPhone"
                      type="tel"
                      placeholder="1234567890"
                      maxLength={10}
                      className="pl-10"
                      value={formData.schoolPhone}
                      onChange={(e) => handleInputChange('schoolPhone', e.target.value)}
                    />
                  </div>
                  {errors.schoolPhone && (
                    <p className="text-sm text-destructive mt-1">{errors.schoolPhone}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="registrationNumber">School Registration Number *</Label>
                <Input
                  id="registrationNumber"
                  placeholder="Enter registration number"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                />
                {errors.registrationNumber && (
                  <p className="text-sm text-destructive mt-1">{errors.registrationNumber}</p>
                )}
              </div>
            </CardContent>
          </Card>
          )}

          {/* Step 2: Contact Person Information */}
          {currentStep === 2 && (
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary-foreground" />
                </div>
                <CardTitle>Contact Person Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPersonName">Full Name *</Label>
                  <Input
                    id="contactPersonName"
                    placeholder="Enter full name"
                    value={formData.contactPersonName}
                    onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                  />
                  {errors.contactPersonName && (
                    <p className="text-sm text-destructive mt-1">{errors.contactPersonName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactPersonDesignation">Designation *</Label>
                  <Input
                    id="contactPersonDesignation"
                    placeholder="e.g., Principal, Administrator"
                    value={formData.contactPersonDesignation}
                    onChange={(e) => handleInputChange('contactPersonDesignation', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPersonEmail">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="contactPersonEmail"
                      type="email"
                      placeholder="contact@example.com"
                      className="pl-10"
                      value={formData.contactPersonEmail}
                      onChange={(e) => handleInputChange('contactPersonEmail', e.target.value)}
                    />
                  </div>
                  {errors.contactPersonEmail && (
                    <p className="text-sm text-destructive mt-1">{errors.contactPersonEmail}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactPersonPhone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="contactPersonPhone"
                      type="tel"
                      placeholder="1234567890"
                      maxLength={10}
                      className="pl-10"
                      value={formData.contactPersonPhone}
                      onChange={(e) => handleInputChange('contactPersonPhone', e.target.value)}
                    />
                  </div>
                  {errors.contactPersonPhone && (
                    <p className="text-sm text-destructive mt-1">{errors.contactPersonPhone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Step 3: Address Information */}
          {currentStep === 3 && (
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-secondary-foreground" />
                </div>
                <CardTitle>Address Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address"
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                {errors.address && (
                  <p className="text-sm text-destructive mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange('state', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AN">Andaman and Nicobar Islands</SelectItem>
                      <SelectItem value="AP">Andhra Pradesh</SelectItem>
                      <SelectItem value="AR">Arunachal Pradesh</SelectItem>
                      <SelectItem value="AS">Assam</SelectItem>
                      <SelectItem value="BR">Bihar</SelectItem>
                      <SelectItem value="CH">Chandigarh</SelectItem>
                      <SelectItem value="CT">Chhattisgarh</SelectItem>
                      <SelectItem value="DN">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                      <SelectItem value="DL">Delhi</SelectItem>
                      <SelectItem value="GA">Goa</SelectItem>
                      <SelectItem value="GJ">Gujarat</SelectItem>
                      <SelectItem value="HR">Haryana</SelectItem>
                      <SelectItem value="HP">Himachal Pradesh</SelectItem>
                      <SelectItem value="JK">Jammu and Kashmir</SelectItem>
                      <SelectItem value="JH">Jharkhand</SelectItem>
                      <SelectItem value="KA">Karnataka</SelectItem>
                      <SelectItem value="KL">Kerala</SelectItem>
                      <SelectItem value="LA">Ladakh</SelectItem>
                      <SelectItem value="LD">Lakshadweep</SelectItem>
                      <SelectItem value="MP">Madhya Pradesh</SelectItem>
                      <SelectItem value="MH">Maharashtra</SelectItem>
                      <SelectItem value="MN">Manipur</SelectItem>
                      <SelectItem value="ML">Meghalaya</SelectItem>
                      <SelectItem value="MZ">Mizoram</SelectItem>
                      <SelectItem value="NL">Nagaland</SelectItem>
                      <SelectItem value="OR">Odisha</SelectItem>
                      <SelectItem value="PY">Puducherry</SelectItem>
                      <SelectItem value="PB">Punjab</SelectItem>
                      <SelectItem value="RJ">Rajasthan</SelectItem>
                      <SelectItem value="SK">Sikkim</SelectItem>
                      <SelectItem value="TN">Tamil Nadu</SelectItem>
                      <SelectItem value="TG">Telangana</SelectItem>
                      <SelectItem value="TR">Tripura</SelectItem>
                      <SelectItem value="UP">Uttar Pradesh</SelectItem>
                      <SelectItem value="UT">Uttarakhand</SelectItem>
                      <SelectItem value="WB">West Bengal</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-sm text-destructive mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="zipCode">PIN Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="110001"
                    maxLength={6}
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-destructive mt-1">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Step 4: Review and Terms */}
          {currentStep === 4 && (
          <>
          {/* Review Summary */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>Review Your Information</CardTitle>
              <CardDescription>Please review all details before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* School Info Summary */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  School Information
                </h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">School Name:</span>
                    <p className="font-medium">{formData.schoolName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium capitalize">{formData.schoolType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{formData.schoolEmail}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{formData.schoolPhone}</p>
                  </div>
                </div>
              </div>

              {/* Contact Person Summary */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Person
                </h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{formData.contactPersonName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Designation:</span>
                    <p className="font-medium">{formData.contactPersonDesignation}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{formData.contactPersonEmail}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{formData.contactPersonPhone}</p>
                  </div>
                </div>
              </div>

              {/* Address Summary */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </h3>
                <div className="text-sm">
                  <p className="font-medium">{formData.address}</p>
                  <p className="text-muted-foreground">{formData.city}, {formData.state} - {formData.zipCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card className="card-professional">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="termsAccepted" className="text-sm font-normal cursor-pointer">
                    I accept the{" "}
                    <a href="#" className="text-primary hover:underline">
                      terms and conditions
                    </a>{" "}
                    and confirm that all information provided is accurate
                  </Label>
                  {errors.termsAccepted && (
                    <p className="text-sm text-destructive">{errors.termsAccepted}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          For any queries, contact us at support@wellnestconnect.com
        </p>
      </div>
    </div>
  );
}
