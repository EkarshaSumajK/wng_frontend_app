import { useState, useEffect } from "react";
import { Building2, ArrowRight, Loader2, Plus, Sparkles, Search, MapPin, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { AnimatedBackground } from "@/components/ui/animated-background";

interface SchoolData {
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <div className="text-center relative z-10 animate-pulse">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <AnimatedBackground />

      <div className={`w-full max-w-5xl relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Enhanced Header */}
        <div className="text-center mb-10 space-y-6">
          <div className="inline-flex items-center gap-3 mb-2 group cursor-default">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary transform group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient">
              WellNest Group
            </h1>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              Select Your School
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Choose the school you want to access or create a new one
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center animate-in slide-in-from-top duration-300 backdrop-blur-sm">
            <p className="text-destructive font-medium">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchSchools}
              className="mt-3 hover:bg-destructive/5 border-destructive/20 text-destructive hover:text-destructive"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Search and Create Section */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          {schools.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                <Input
                  type="text"
                  placeholder="Search by school name, city, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-14 text-base rounded-full border-2 bg-background/80 backdrop-blur-xl focus-visible:ring-primary/50 shadow-lg transition-all duration-300 relative z-0"
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
              className="group gap-2 border-dashed border-2 border-primary/50 hover:border-primary hover:bg-primary/5 transition-all duration-300 shadow-sm hover:shadow-md rounded-xl h-12 px-8"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span className="font-semibold">Create New School</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
            </Button>
          </div>
        </div>

        {/* School Cards */}
        {schools.length === 0 && !error ? (
          <Card className="card-glass border-dashed border-2 text-center py-12">
            <CardContent>
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <School className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No schools available</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are no schools registered in the system yet. Be the first to create one!
              </p>
              <Button onClick={() => navigate('/school-onboarding')}>
                Create First School
              </Button>
            </CardContent>
          </Card>
        ) : filteredSchools.length === 0 ? (
          <Card className="card-glass border-dashed border-2 text-center py-12">
            <CardContent>
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No schools found</h3>
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
                className={`card-premium cursor-pointer group relative overflow-hidden ${
                  selectedSchool === school.school_id ? 'ring-2 ring-primary shadow-primary' : ''
                }`}
                onClick={() => handleSchoolSelect(school.school_id)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {school.name}
                      </CardTitle>
                      
                      {/* Fixed: Replaced CardDescription with div to prevent hydration error */}
                      {(school.address || school.city || school.state) && (
                        <div className="text-sm text-muted-foreground space-y-1.5">
                          {school.address && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary/70" />
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
                    
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-secondary rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-300 group-hover:border-primary/30">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 relative z-10">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-4" />
                  <Button 
                    className="w-full group/btn relative overflow-hidden rounded-xl"
                    variant={selectedSchool === school.school_id ? "default" : "secondary"}
                  >
                    <span className="relative z-10 flex items-center justify-center font-semibold">
                      Select School
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Enhanced Footer */}
        <div className="mt-12 space-y-6">
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors hover:bg-primary/5 rounded-full px-6"
            >
              ← Back to Login
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
            <Sparkles className="w-3 h-3" />
            <p>Trusted by schools nationwide for student mental health support</p>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
