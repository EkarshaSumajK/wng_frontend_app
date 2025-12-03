import { useState, useEffect } from "react";
import { Building2, ArrowRight, Plus, Search, MapPin, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { GridBackground } from "@/components/ui/grid-background";
import { LoadingState } from "@/components/shared/LoadingState";

interface SchoolData {
  school_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  email?: string;
  phone?: string;
  needs_data_onboarding?: boolean;
  logo_url?: string;
}

export default function SchoolSelection() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolData[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    fetchSchools();
  }, []);

  // Filter schools based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSchools(schools);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = schools.filter(school => 
        school.name.toLowerCase().includes(query) ||
        school.city?.toLowerCase().includes(query) ||
        school.state?.toLowerCase().includes(query) ||
        school.address?.toLowerCase().includes(query)
      );
      setFilteredSchools(filtered);
    }
  }, [searchQuery, schools]);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<SchoolData[]>('/schools');
      setSchools(data);
      setFilteredSchools(data);
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
        needs_data_onboarding: school.needs_data_onboarding,
        logo_url: school.logo_url
      };
      
      localStorage.setItem('selected_school', JSON.stringify(schoolData));
      
      // Check if school needs data onboarding (new schools only)
      const needsOnboarding = school.needs_data_onboarding === true;
      
      if (needsOnboarding) {
        navigate('/data-onboarding');
      } else {
        navigate('/role-selection');
      }
    }
  };

  if (isLoading) {
    return (
      <GridBackground className="flex items-center justify-center">
        <LoadingState message="Loading schools..." />
      </GridBackground>
    );
  }

  return (
    <GridBackground className="p-4 sm:p-6">
      <div className={`w-full max-w-5xl relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mx-auto`}>
        {/* Enhanced Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/50 text-primary mb-2 shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Select Your School
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Choose the school you want to access or create a new one
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center animate-in slide-in-from-top duration-300">
            <p className="text-destructive font-medium">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchSchools}
              className="mt-3 hover:bg-destructive/10 border-destructive/20 text-destructive hover:text-destructive"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Search and Create Section */}
        <div className="mb-10 space-y-6">
          {/* Search Bar */}
          {schools.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                <Input
                  type="text"
                  placeholder="Search by school name, city, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-14 text-base rounded-full border-border bg-background/50 backdrop-blur-sm shadow-lg shadow-black/5 focus:ring-2 focus:ring-primary transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10 p-1 hover:bg-muted rounded-full"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-3 text-center font-medium animate-in fade-in">
                  Found <span className="text-primary font-bold">{filteredSchools.length}</span> school{filteredSchools.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Create New School Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/school-onboarding')}
              className="group gap-2 border-dashed border-2 border-primary/20 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 h-12 px-8 rounded-xl text-primary"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-semibold">Create New School</span>
            </Button>
          </div>
        </div>

        {/* School Cards */}
        {schools.length === 0 && !error ? (
          <Card className="border-none shadow-xl bg-card text-center py-12 max-w-2xl mx-auto">
            <CardContent>
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <School className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">No schools available</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are no schools registered in the system yet. Be the first to create one!
              </p>
              <Button onClick={() => navigate('/school-onboarding')} className="h-11 px-8">
                Create First School
              </Button>
            </CardContent>
          </Card>
        ) : filteredSchools.length === 0 ? (
          <Card className="border-none shadow-xl bg-card text-center py-12 max-w-2xl mx-auto">
            <CardContent>
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">No schools found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any schools matching "{searchQuery}". Try a different search term or create a new school.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school, index) => (
              <Card 
                key={school.school_id}
                className={`border-none shadow-lg hover:shadow-xl bg-card cursor-pointer group transition-all duration-300 hover:-translate-y-1 ${
                  selectedSchool === school.school_id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSchoolSelect(school.school_id)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                        {school.name}
                      </CardTitle>
                      
                      {(school.address || school.city || school.state) && (
                        <div className="text-sm text-muted-foreground space-y-1.5">
                          {school.address && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                              <span className="line-clamp-1 font-medium">{school.address}</span>
                            </div>
                          )}
                          {(school.city || school.state) && (
                            <div className="flex items-start gap-2">
                              <div className="w-3.5 h-3.5 flex-shrink-0" /> {/* Spacer for alignment */}
                              <span className="text-xs">
                                {school.city}{school.city && school.state ? ', ' : ''}{school.state}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                    <div className="flex-shrink-0">
                      {school.logo_url ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-border/50 flex items-center justify-center">
                          <img src={school.logo_url} alt={school.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center group-hover:bg-secondary transition-colors">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="h-px w-full bg-border mb-4" />
                  <Button 
                    className="w-full h-11 rounded-lg font-medium"
                    variant={selectedSchool === school.school_id ? "default" : "secondary"}
                  >
                    Select School
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-full px-6 h-10"
          >
            ← Back to Login
          </Button>
        </div>
      </div>
    </GridBackground>
  );
}
