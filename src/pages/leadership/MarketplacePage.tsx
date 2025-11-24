import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Calendar, Users, Filter, Phone, Award, Globe, X, Heart, Share2, ChevronRight, CheckCircle, ChevronLeft, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { BookTherapistModal } from "@/components/modals/BookTherapistModal";
import { FilterSection } from "@/components/shared/FilterSection";

export default function MarketplacePage() {
// Removed legacy showFilters state; using multi-select filters via sidebar
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [bookingTherapist, setBookingTherapist] = useState<any>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [activeTab, setActiveTab] = useState<"all" | "recommended" | "favorites">("all");
  
  // Therapist filters - converted to arrays for multi-select
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Mock data - Replace with API calls
  // Filter option arrays for sidebar
  const locationOptions = ['Mumbai','Delhi','Bangalore','Pune','Ahmedabad','Hyderabad','Chennai','Jaipur','Kolkata','Nagpur'];
  const ratingOptions = ['4.5','4.0','3.5'];
  const languageOptions = ['English','Hindi','Marathi','Tamil','Telugu','Kannada','Bengali','Gujarati'];
  const experienceOptions = ['15+','10+','5+'];
  const availabilityOptions = ['Available','Limited'];
  const therapists = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialty: "Child & Adolescent Psychology",
      rating: 4.8,
      reviews: 127,
      location: "Mumbai, Maharashtra",
      distance: "2.5 km",
      experience: "15 years",
      languages: ["English", "Hindi", "Marathi"],
      availability: "Available",
      fee: "₹2,000 - ₹3,000",
      image: "PS",
      isRecommended: true,
      isFavorite: true,
    },
    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      specialty: "Clinical Psychologist",
      rating: 4.9,
      reviews: 203,
      location: "Delhi NCR",
      distance: "5.2 km",
      experience: "20 years",
      languages: ["English", "Hindi"],
      availability: "Available",
      fee: "₹2,500 - ₹4,000",
      image: "RK",
      isRecommended: true,
      isFavorite: false,
    },
    {
      id: 3,
      name: "Dr. Anita Desai",
      specialty: "School Counseling Specialist",
      rating: 4.7,
      reviews: 89,
      location: "Bangalore, Karnataka",
      distance: "3.8 km",
      experience: "12 years",
      languages: ["English", "Hindi", "Kannada"],
      availability: "Limited",
      fee: "₹1,800 - ₹2,500",
      image: "AD",
      isRecommended: false,
      isFavorite: true,
    },
    {
      id: 4,
      name: "Dr. Vikram Mehta",
      specialty: "Educational Psychologist",
      rating: 4.6,
      reviews: 156,
      location: "Pune, Maharashtra",
      distance: "4.1 km",
      experience: "18 years",
      languages: ["English", "Hindi", "Marathi"],
      availability: "Available",
      fee: "₹2,200 - ₹3,500",
      image: "VM",
      isRecommended: true,
      isFavorite: false,
    },
    {
      id: 5,
      name: "Dr. Sneha Patel",
      specialty: "Trauma & PTSD Specialist",
      rating: 4.9,
      reviews: 178,
      location: "Ahmedabad, Gujarat",
      distance: "6.3 km",
      experience: "14 years",
      languages: ["English", "Hindi", "Gujarati"],
      availability: "Available",
      fee: "₹2,800 - ₹4,200",
      image: "SP",
      isRecommended: false,
      isFavorite: true,
    },
    {
      id: 6,
      name: "Dr. Arjun Reddy",
      specialty: "Behavioral Therapy Specialist",
      rating: 4.5,
      reviews: 94,
      location: "Hyderabad, Telangana",
      distance: "7.8 km",
      experience: "11 years",
      languages: ["English", "Hindi", "Telugu"],
      availability: "Limited",
      fee: "₹1,500 - ₹2,800",
      image: "AR",
    },
    {
      id: 7,
      name: "Dr. Meera Iyer",
      specialty: "Family & Relationship Counselor",
      rating: 4.8,
      reviews: 142,
      location: "Chennai, Tamil Nadu",
      distance: "3.2 km",
      experience: "16 years",
      languages: ["English", "Hindi", "Tamil"],
      availability: "Available",
      fee: "₹2,100 - ₹3,200",
      image: "MI",
    },
    {
      id: 8,
      name: "Dr. Kabir Singh",
      specialty: "Anxiety & Depression Specialist",
      rating: 4.7,
      reviews: 211,
      location: "Jaipur, Rajasthan",
      distance: "5.9 km",
      experience: "19 years",
      languages: ["English", "Hindi"],
      availability: "Available",
      fee: "₹2,400 - ₹3,800",
      image: "KS",
    },
    {
      id: 9,
      name: "Dr. Nisha Gupta",
      specialty: "Learning Disabilities Expert",
      rating: 4.6,
      reviews: 103,
      location: "Kolkata, West Bengal",
      distance: "4.7 km",
      experience: "13 years",
      languages: ["English", "Hindi", "Bengali"],
      availability: "Available",
      fee: "₹1,900 - ₹2,900",
      image: "NG",
    },
    {
      id: 10,
      name: "Dr. Sameer Joshi",
      specialty: "Adolescent Mental Health",
      rating: 4.8,
      reviews: 167,
      location: "Nagpur, Maharashtra",
      distance: "8.1 km",
      experience: "17 years",
      languages: ["English", "Hindi", "Marathi"],
      availability: "Limited",
      fee: "₹2,300 - ₹3,600",
      image: "SJ",
    },
  ];

  // Filter therapists based on all criteria - using useMemo for performance
  const filteredTherapists = useMemo(() => {
    return therapists.filter((therapist) => {
      // Search filter
      const matchesSearch = !searchQuery || 
        therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Location filter - multi-select
      const matchesLocation = selectedLocations.length === 0 || 
        selectedLocations.some(loc => therapist.location.includes(loc));
      
      // Rating filter - multi-select
      const matchesRating = selectedRatings.length === 0 || 
        selectedRatings.some(rating => therapist.rating >= parseFloat(rating));
      
      // Language filter - multi-select
      const matchesLanguage = selectedLanguages.length === 0 || 
        selectedLanguages.some(lang => therapist.languages.includes(lang));
      
      // Experience filter - multi-select
      const experienceYears = parseInt(therapist.experience);
      const matchesExperience = selectedExperiences.length === 0 || 
        selectedExperiences.some(exp => {
          if (exp === "15+") return experienceYears >= 15;
          if (exp === "10+") return experienceYears >= 10;
          if (exp === "5+") return experienceYears >= 5;
          return false;
        });
      
      // Availability filter - multi-select
      const matchesAvailability = selectedAvailabilities.length === 0 || 
        selectedAvailabilities.includes(therapist.availability);
      
      // Tab filter
      const matchesTab = 
        activeTab === 'all' || 
        (activeTab === 'recommended' && therapist.isRecommended) ||
        (activeTab === 'favorites' && therapist.isFavorite);

      return matchesSearch && matchesLocation && matchesRating && 
             matchesLanguage && matchesExperience && matchesAvailability && matchesTab;
    });
  }, [therapists, searchQuery, selectedLocations, selectedRatings, selectedLanguages, selectedExperiences, selectedAvailabilities, activeTab]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTherapists.length / itemsPerPage);
  const currentTherapists = filteredTherapists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filteredTherapists.length]);

  // Random doctor/therapist images
  const getDoctorImage = (id: number) => {
    const images = [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    ];
    return images[id % images.length];
  };

  return (
    <div className="space-y-8 relative">
      <AnimatedBackground />
      
      {/* Enhanced Header */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
        <div>
          <div className="flex items-center gap-3 mb-2">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Users className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Therapist Marketplace
            </h1>
          </div>
          <p className="text-base md:text-lg text-muted-foreground ml-15">
            Discover therapists, resources, and professional development opportunities
          </p>
        </div>
      </motion.div>

            {/* Top Bar: Sort & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search therapists by name or specialty..."
                  className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-xl">
                    <SelectValue placeholder="Relevance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="rating">Rating: High to Low</SelectItem>
                    <SelectItem value="experience">Experience: High to Low</SelectItem>
                    <SelectItem value="fee_low">Fee: Low to High</SelectItem>
                    <SelectItem value="fee_high">Fee: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded-md ${activeTab === "all" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
                onClick={() => setActiveTab("all")}
              >
                All Therapists
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === "recommended" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
                onClick={() => setActiveTab("recommended")}
              >
                Recommended
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === "favorites" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
                onClick={() => setActiveTab("favorites")}
              >
                Favorites
              </button>
            </div>

<div className="flex flex-col lg:flex-row gap-8">
  {/* Sidebar Filters */}
  {/* Sidebar Filters */}
  <aside className="w-full lg:w-72 flex-shrink-0">
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 shadow-sm h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedLocations([]);
            setSelectedRatings([]);
            setSelectedLanguages([]);
            setSelectedExperiences([]);
            setSelectedAvailabilities([]);
            setSearchQuery("");
          }}
          className="h-8 text-muted-foreground hover:text-primary"
        >
          Clear All
        </Button>
      </div>
      
      <div className="space-y-1">
        <FilterSection
          title="Location"
          options={locationOptions}
          selected={selectedLocations}
          setSelected={setSelectedLocations}
        />
        <FilterSection
          title="Rating"
          options={ratingOptions}
          selected={selectedRatings}
          setSelected={setSelectedRatings}
        />
        <FilterSection
          title="Language"
          options={languageOptions}
          selected={selectedLanguages}
          setSelected={setSelectedLanguages}
        />
        <FilterSection
          title="Experience"
          options={experienceOptions}
          selected={selectedExperiences}
          setSelected={setSelectedExperiences}
        />
        <FilterSection
          title="Availability"
          options={availabilityOptions}
          selected={selectedAvailabilities}
          setSelected={setSelectedAvailabilities}
        />
      </div>
    </div>
  </aside>

  {/* Main Content */}
  <div className="flex-1">
    {/* Active Filters Display */}
    {(searchQuery || selectedLocations.length > 0 || selectedRatings.length > 0 || selectedLanguages.length > 0 || selectedExperiences.length > 0 || selectedAvailabilities.length > 0) && (
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="text-sm text-muted-foreground">Active filters:</span>
        {searchQuery && (
          <Badge variant="secondary" className="gap-1">
            Search: {searchQuery}
            <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
          </Badge>
        )}
        {selectedLocations.map((loc) => (
          <Badge key={loc} variant="secondary" className="gap-1">
            Location: {loc}
            <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLocations(selectedLocations.filter((l) => l !== loc))} />
          </Badge>
        ))}
        {selectedRatings.map((r) => (
          <Badge key={r} variant="secondary" className="gap-1">
            Rating: {r}+ Stars
            <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedRatings(selectedRatings.filter((v) => v !== r))} />
          </Badge>
        ))}
        {selectedLanguages.map((lang) => (
          <Badge key={lang} variant="secondary" className="gap-1">
            Language: {lang}
            <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLanguages(selectedLanguages.filter((l) => l !== lang))} />
          </Badge>
        ))}
        {selectedExperiences.map((exp) => (
          <Badge key={exp} variant="secondary" className="gap-1">
            Experience: {exp}
            <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedExperiences(selectedExperiences.filter((e) => e !== exp))} />
          </Badge>
        ))}
        {selectedAvailabilities.map((av) => (
          <Badge key={av} variant="secondary" className="gap-1">
            {av}
            <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAvailabilities(selectedAvailabilities.filter((a) => a !== av))} />
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setSelectedLocations([]);
            setSelectedRatings([]);
            setSelectedLanguages([]);
            setSelectedExperiences([]);
            setSelectedAvailabilities([]);
          }}
          className="h-7"
        >
          Clear All
        </Button>
      </div>
    )}


      {/* Therapists Section - Enhanced Grid */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Results Count */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Therapists</h2>
          <p className="text-sm text-muted-foreground">
            Showing {filteredTherapists.length} of {therapists.length} therapists
          </p>
        </div>

        {filteredTherapists.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentTherapists.map((therapist, index) => (
                <motion.div
                  key={therapist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card 
                    className="group relative overflow-visible border-0 shadow-none bg-transparent cursor-pointer h-full"
                    onClick={() => setSelectedTherapist(therapist)}
                  >
                    <div className="relative h-full flex flex-col">
                      {/* Image Section */}
                      <div className="relative z-10 w-full h-64 flex-shrink-0 flex items-end justify-center overflow-hidden rounded-t-3xl bg-gray-50">
                        <img 
                          src={getDoctorImage(therapist.id)} 
                          alt={therapist.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"><span class="text-4xl font-bold text-primary">${therapist.image}</span></div>`;
                            }
                          }}
                        />
                      </div>

                      {/* Info Box */}
                      <div className="relative z-20 flex-1 w-full -mt-4 bg-[#1e293b] rounded-2xl p-6 pt-8 text-center shadow-xl flex flex-col justify-between transition-transform duration-300 group-hover:-translate-y-1">
                        {/* Floating Badge */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-white text-gray-900 hover:bg-white border-0 px-3 py-1 shadow-sm text-xs font-bold whitespace-nowrap">
                            {therapist.experience} Exp • {therapist.rating} ★
                          </Badge>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-white mt-2 mb-1 line-clamp-1">{therapist.name}</h3>
                          <p className="text-gray-400 text-sm font-medium mb-4 line-clamp-1">{therapist.specialty}</p>
                        </div>
                        
                        <div className="flex justify-center gap-2 flex-wrap">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wide">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Verified
                          </div>
                          {therapist.availability === 'Available' && (
                             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wide">
                              Available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-full w-10 h-10 border-gray-200 hover:bg-gray-100 hover:text-primary"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-bold ${
                        currentPage === page 
                          ? "bg-primary text-white shadow-lg shadow-primary/25" 
                          : "text-gray-500 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-full w-10 h-10 border-gray-200 hover:bg-gray-100 hover:text-primary"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No therapists found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLocations([]);
                  setSelectedRatings([]);
                  setSelectedLanguages([]);
                  setSelectedExperiences([]);
                  setSelectedAvailabilities([]);
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  </div>

      {/* Enhanced Therapist Detail Modal */}
      <Dialog open={!!selectedTherapist} onOpenChange={() => setSelectedTherapist(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-0 [&>button]:hidden">
          {selectedTherapist && (
            <div className="flex flex-col h-[90vh]">
              {/* Modal Header Image */}
              <div className="relative h-64 sm:h-80 flex-shrink-0">
                <img 
                  src={getDoctorImage(selectedTherapist.id)} 
                  alt={selectedTherapist.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={() => setSelectedTherapist(null)}
                >
                  <X className="w-6 h-6" />
                </Button>

                {/* Verified Badge - Top Left */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="flex items-center gap-2 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-bold">Wellness Verified</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <Badge className="mb-4 bg-white/20 backdrop-blur-sm border-white/30 text-white px-3 py-1 text-sm hover:bg-white/30">
                    {selectedTherapist.specialty}
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
                    {selectedTherapist.name}
                  </h2>
                  
                  <div className="flex items-center gap-4 mt-4 text-white/80">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">{selectedTherapist.rating}</span>
                      <span className="text-sm">({selectedTherapist.reviews} reviews)</span>
                    </div>
                    <div className="h-4 w-px bg-white/30" />
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span className="font-bold text-white">{selectedTherapist.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto bg-white">
                <div className="p-8 grid gap-12 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        About
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {selectedTherapist.name} is a highly experienced {selectedTherapist.specialty.toLowerCase()} with {selectedTherapist.experience} of practice. 
                        Specializing in working with children, adolescents, and families, they provide evidence-based therapeutic interventions 
                        tailored to each individual's needs. Their approach combines cognitive-behavioral therapy, mindfulness techniques, 
                        and family systems therapy to create comprehensive treatment plans.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Areas of Expertise
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {["Anxiety Disorders", "Depression", "ADHD", "Behavioral Issues", "Academic Stress", "Family Counseling", "Trauma Recovery", "Social Skills"].map((topic, index) => (
                          <div key={index} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700 font-medium">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar in Modal */}
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4">Quick Stats</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500">Experience</span>
                          <span className="font-medium text-gray-900">{selectedTherapist.experience}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500">Languages</span>
                          <span className="font-medium text-gray-900 text-right">{selectedTherapist.languages.join(", ")}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500">Availability</span>
                          <span className={`font-medium ${selectedTherapist.availability === 'Available' ? 'text-green-600' : 'text-orange-600'}`}>
                            {selectedTherapist.availability}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-2">Consultation Fee</h4>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-bold text-blue-900">{selectedTherapist.fee}</span>
                        <span className="text-sm text-blue-700">/ session</span>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-blue-800 text-sm">
                          <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Licensed Clinical Psychologist</span>
                        </li>
                        <li className="flex items-start gap-2 text-blue-800 text-sm">
                          <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>RCI Registered</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-between flex-shrink-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex gap-3 w-full sm:w-auto">
                   <Button variant="outline" size="lg" className="rounded-xl border-gray-300 hover:bg-gray-50">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact
                  </Button>
                  <Button 
                    size="lg" 
                    className="rounded-xl px-8 font-bold text-lg shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
                    onClick={() => {
                      setBookingTherapist(selectedTherapist);
                      setSelectedTherapist(null);
                    }}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </Button>
                </div>
                <div className="hidden sm:flex gap-2">
                   <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                      <Heart className="w-5 h-5 text-gray-500" />
                   </Button>
                   <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                      <Share2 className="w-5 h-5 text-gray-500" />
                   </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <BookTherapistModal
        open={!!bookingTherapist}
        onOpenChange={(open) => !open && setBookingTherapist(null)}
        therapist={bookingTherapist}
      />
    </div>
  );
}
