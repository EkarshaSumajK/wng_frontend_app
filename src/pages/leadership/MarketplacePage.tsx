import { useState } from "react";
import { Search, MapPin, Star, Calendar, Users, Filter, Phone, Award, Globe, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { BookTherapistModal } from "@/components/modals/BookTherapistModal";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [bookingTherapist, setBookingTherapist] = useState<any>(null);
  
  // Therapist filters
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - Replace with API calls
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

  // Filter therapists based on all criteria
  const filteredTherapists = therapists.filter((therapist) => {
    // Search filter
    const matchesSearch = !searchQuery || 
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Location filter
    const matchesLocation = selectedLocation === "all" || 
      therapist.location.includes(selectedLocation);
    
    // Rating filter
    const matchesRating = selectedRating === "all" || 
      therapist.rating >= parseFloat(selectedRating);
    
    // Language filter
    const matchesLanguage = selectedLanguage === "all" || 
      therapist.languages.includes(selectedLanguage);
    
    // Experience filter
    const experienceYears = parseInt(therapist.experience);
    const matchesExperience = selectedExperience === "all" || 
      (selectedExperience === "15+" && experienceYears >= 15) ||
      (selectedExperience === "10+" && experienceYears >= 10) ||
      (selectedExperience === "5+" && experienceYears >= 5);
    
    // Availability filter
    const matchesAvailability = selectedAvailability === "all" || 
      therapist.availability === selectedAvailability;
    
    return matchesSearch && matchesLocation && matchesRating && 
           matchesLanguage && matchesExperience && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
        <p className="text-muted-foreground">
          Discover therapists, resources, and professional development opportunities
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Main Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search therapists by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2">Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi NCR</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Jaipur">Jaipur</SelectItem>
                      <SelectItem value="Kolkata">Kolkata</SelectItem>
                      <SelectItem value="Nagpur">Nagpur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2">Min Rating</Label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2">Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All Languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Marathi">Marathi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                      <SelectItem value="Kannada">Kannada</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Gujarati">Gujarati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2">Experience</Label>
                  <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Any Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Experience</SelectItem>
                      <SelectItem value="15+">15+ Years</SelectItem>
                      <SelectItem value="10+">10+ Years</SelectItem>
                      <SelectItem value="5+">5+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2">Availability</Label>
                  <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {(searchQuery || selectedLocation !== "all" || selectedRating !== "all" || 
              selectedLanguage !== "all" || selectedExperience !== "all" || selectedAvailability !== "all") && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
                {selectedLocation !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Location: {selectedLocation}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLocation("all")} />
                  </Badge>
                )}
                {selectedRating !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Rating: {selectedRating}+ Stars
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedRating("all")} />
                  </Badge>
                )}
                {selectedLanguage !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Language: {selectedLanguage}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLanguage("all")} />
                  </Badge>
                )}
                {selectedExperience !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Experience: {selectedExperience}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedExperience("all")} />
                  </Badge>
                )}
                {selectedAvailability !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedAvailability}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedAvailability("all")} />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLocation("all");
                    setSelectedRating("all");
                    setSelectedLanguage("all");
                    setSelectedExperience("all");
                    setSelectedAvailability("all");
                  }}
                  className="h-7"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Therapists Section */}
      <div className="space-y-6">

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTherapists.length} of {therapists.length} therapists
          </p>
        </div>

          {filteredTherapists.length > 0 ? (
            filteredTherapists.map((therapist) => (
            <Card key={therapist.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
                      {therapist.image}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{therapist.name}</h3>
                          <p className="text-muted-foreground">{therapist.specialty}</p>
                        </div>
                        <Badge variant={therapist.availability === "Available" ? "default" : "secondary"}>
                          {therapist.availability}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{therapist.rating}</span>
                          <span>({therapist.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{therapist.distance}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Experience</p>
                        <p className="font-medium">{therapist.experience}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{therapist.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Languages</p>
                        <p className="font-medium">{therapist.languages.join(", ")}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => setBookingTherapist(therapist)}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                      <Button variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedTherapist(therapist)}>
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
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
                    setSelectedLocation("all");
                    setSelectedRating("all");
                    setSelectedLanguage("all");
                    setSelectedExperience("all");
                    setSelectedAvailability("all");
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
      </div>

      {/* Therapist Detail Modal */}
      <Dialog open={!!selectedTherapist} onOpenChange={() => setSelectedTherapist(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedTherapist && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {selectedTherapist.image}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedTherapist.name}</DialogTitle>
                    <DialogDescription className="text-lg">{selectedTherapist.specialty}</DialogDescription>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{selectedTherapist.rating}</span>
                        <span className="text-muted-foreground">({selectedTherapist.reviews} reviews)</span>
                      </div>
                      <Badge variant={selectedTherapist.availability === "Available" ? "default" : "secondary"}>
                        {selectedTherapist.availability}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Separator className="my-4" />

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-medium">Experience</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedTherapist.experience}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedTherapist.location}</p>
                    <p className="text-sm text-muted-foreground">{selectedTherapist.distance} away</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-medium">Languages</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedTherapist.languages.join(", ")}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">Consultation Fee</span>
                    </div>
                    <p className="text-lg font-semibold">{selectedTherapist.fee}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedTherapist.name} is a highly experienced {selectedTherapist.specialty.toLowerCase()} with {selectedTherapist.experience} of practice. 
                    Specializing in working with children, adolescents, and families, they provide evidence-based therapeutic interventions 
                    tailored to each individual's needs. Their approach combines cognitive-behavioral therapy, mindfulness techniques, 
                    and family systems therapy to create comprehensive treatment plans.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Anxiety Disorders</Badge>
                    <Badge variant="outline">Depression</Badge>
                    <Badge variant="outline">ADHD</Badge>
                    <Badge variant="outline">Behavioral Issues</Badge>
                    <Badge variant="outline">Academic Stress</Badge>
                    <Badge variant="outline">Family Counseling</Badge>
                    <Badge variant="outline">Trauma Recovery</Badge>
                    <Badge variant="outline">Social Skills</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Qualifications</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Ph.D. in Clinical Psychology, University of Mumbai</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Licensed Clinical Psychologist (RCI Registered)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Certified in Cognitive Behavioral Therapy (CBT)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Member, Indian Association of Clinical Psychologists</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </>
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
