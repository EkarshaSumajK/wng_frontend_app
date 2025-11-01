import { useState, useEffect } from "react";
import { Building2, ArrowRight, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/services/api";
import { useNavigate } from "react-router-dom";

interface School {
  school_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  email?: string;
  phone?: string;
  needs_data_onboarding?: boolean;
}

export default function SchoolSelection() {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<School[]>('/schools');
      setSchools(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schools');
      console.error('Failed to fetch schools:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchoolSelect = (schoolId: string) => {
    setSelectedSchool(schoolId);
    // Store selected school in localStorage
    const school = schools.find(s => s.school_id === schoolId);
    if (school) {
      // Clear any existing school data first
      localStorage.removeItem('selected_school');
      
      // Store new school data with all fields
      const schoolData = {
        school_id: school.school_id,
        name: school.name,
        address: school.address,
        city: school.city,
        state: school.state,
        email: school.email,
        phone: school.phone,
        needs_data_onboarding: school.needs_data_onboarding
      };
      
      localStorage.setItem('selected_school', JSON.stringify(schoolData));
      console.log('SchoolSelection: Stored school data:', schoolData);
      
      // Check if school needs data onboarding (new schools only)
      const needsOnboarding = school.needs_data_onboarding === true;
      console.log('SchoolSelection: needs_data_onboarding =', needsOnboarding);
      
      if (needsOnboarding) {
        navigate('/data-onboarding');
      } else {
        navigate('/role-selection');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-secondary/30 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              WellNest Group
            </h1>
          </div>
          
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Select Your School
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the school you want to access
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-center">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchSchools}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Create New School Button */}
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/school-onboarding')}
            className="gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5"
          >
            <Plus className="w-5 h-5" />
            Create New School
          </Button>
        </div>

        {/* School Cards */}
        {schools.length === 0 && !error ? (
          <Card className="card-professional">
            <CardContent className="pt-6 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No schools available</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click "Create New School" above to register your school
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {schools.map((school) => (
              <Card 
                key={school.school_id}
                className={`card-professional cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedSchool === school.school_id ? 'ring-2 ring-primary shadow-professional-lg' : ''
                }`}
                onClick={() => handleSchoolSelect(school.school_id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{school.name}</CardTitle>
                      {(school.address || school.city || school.state) && (
                        <CardDescription>
                          {school.address && <div>{school.address}</div>}
                          {(school.city || school.state) && (
                            <div>
                              {school.city}{school.city && school.state ? ', ' : ''}{school.state}
                            </div>
                          )}
                        </CardDescription>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0 ml-4">
                      <Building2 className="w-6 h-6 text-secondary-foreground" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Button 
                    className="w-full"
                    variant={selectedSchool === school.school_id ? "default" : "outline"}
                  >
                    Select School
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Secure • WCAG 2.1 AA Compliant • Privacy-First Design</p>
        </div>
      </div>
    </div>
  );
}
