import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Star, Filter, Phone, CheckCircle, X, Users, Award, Loader2, Clock, Briefcase, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookTherapistModal } from "@/components/modals/BookTherapistModal";
import { BookingDetailModal } from "@/components/modals/BookingDetailModal";
import { marketplaceApi, Therapist } from "@/services/marketplace";
import { ProfileCard } from "@/components/ui/profile-card";
import { TherapistDetailModal } from "@/components/modals/TherapistDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function MarketplacePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [bookingTherapist, setBookingTherapist] = useState<Therapist | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        // Fetch all therapists (limit 1000) for client-side filtering
        const data = await marketplaceApi.getTherapists({ limit: 1000 });
        setTherapists(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching therapists:", err);
        setError("Failed to load therapists. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);





  const filteredTherapists = useMemo(() => {
    return therapists.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = locationFilter === "all" || t.location.includes(locationFilter);
      const matchesRating = ratingFilter === "all" || t.rating >= parseFloat(ratingFilter);
      const matchesLanguage = languageFilter === "all" || t.languages.some(l => l === languageFilter);
      const matchesAvailability = availabilityFilter === "all" || t.availability === availabilityFilter;

      return matchesSearch && matchesLocation && matchesRating && matchesLanguage && matchesAvailability;
    });
  }, [therapists, searchQuery, locationFilter, ratingFilter, languageFilter, availabilityFilter]);

  const getDoctorImage = (id: string | number) => {
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
    
    let index = 0;
    if (typeof id === 'number') {
      index = id;
    } else if (typeof id === 'string') {
      // Simple hash for string
      for (let i = 0; i < id.length; i++) {
        index += id.charCodeAt(i);
      }
    }
    
    return images[index % images.length];
  };

  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    therapists.forEach((therapist) => {
      therapist.languages?.forEach((lang) => {
        if (lang) {
          langs.add(lang);
        }
      });
    });
    return Array.from(langs).sort((a, b) => a.localeCompare(b));
  }, [therapists]);

  const topRatedTherapists = useMemo(
    () =>
      [...filteredTherapists]
        .filter((t) => t.rating >= 4.7)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 12),
    [filteredTherapists]
  );

  const availableNowTherapists = useMemo(
    () => filteredTherapists.filter((t) => t.availability === "Available").slice(0, 12),
    [filteredTherapists]
  );

  const multilingualTherapists = useMemo(
    () => filteredTherapists.filter((t) => (t.languages?.length ?? 0) >= 2).slice(0, 12),
    [filteredTherapists]
  );

  const showcaseSections = useMemo(
    () =>
      [
        {
          key: "top-rated",
          title: "Top Rated Specialists",
          description: "Handpicked therapists with 4.7+ ratings.",
          accent: "from-amber-500 to-orange-400",
          icon: Star,
          data: topRatedTherapists,
        },
        {
          key: "available-now",
          title: "Available This Week",
          description: "Therapists with open slots right now.",
          accent: "from-emerald-500 to-green-400",
          icon: Clock,
          data: availableNowTherapists,
        },
        {
          key: "multilingual",
          title: "Multilingual Experts",
          description: "Therapists who can support multiple languages.",
          accent: "from-sky-500 to-blue-500",
          icon: Users,
          data: multilingualTherapists,
        },
      ].filter((section) => section.data.length > 0),
    [topRatedTherapists, availableNowTherapists, multilingualTherapists]
  );

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const expandedSectionData =
    showcaseSections.find((section) => section.key === expandedSection)?.data ?? [];

  const [viewMode, setViewMode] = useState<"sections" | "all" | "bookings">("sections");
  const [currentPage, setCurrentPage] = useState(1);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const pageSize = 16;
  const totalPages = Math.max(1, Math.ceil(filteredTherapists.length / pageSize));
  const paginatedTherapists = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTherapists.slice(start, start + pageSize);
  }, [filteredTherapists, currentPage]);

  // Effect to fetch bookings when tab is selected
  useEffect(() => {
    if (viewMode === "bookings") {
      fetchMyBookings();
    }
  }, [viewMode]);

  const fetchMyBookings = async () => {
    if (!user) return;
    try {
      const response = await marketplaceApi.getMyBookings(user.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMyBookings((response as any).bookings || []);
    } catch (err) {

      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading && therapists.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Therapist Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Connect with top-rated mental health professionals.
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-xl border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by name or specialty..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
             <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">4.5+</SelectItem>
                <SelectItem value="4.0">4.0+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {availableLanguages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Limited">Limited</SelectItem>
              </SelectContent>
            </Select>
            
            {(locationFilter !== "all" || ratingFilter !== "all" || availabilityFilter !== "all" || languageFilter !== "all" || searchQuery) && (
               <Button variant="ghost" size="icon" onClick={() => {
                 setLocationFilter("all");
                 setRatingFilter("all");
                 setAvailabilityFilter("all");
                 setLanguageFilter("all");
                 setSearchQuery("");
               }}>
                 <X className="h-4 w-4" />
               </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "sections" ? "default" : "outline"}
            onClick={() => setViewMode("sections")}
          >
            Curated Sections
          </Button>
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            onClick={() => {
              setViewMode("all");
              setCurrentPage(1);
            }}
          >
            All Therapists
          </Button>

          <Button
            variant={viewMode === "bookings" ? "default" : "outline"}
            onClick={() => setViewMode("bookings")}
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            My Bookings
          </Button>
        </div>
      </div>



      {viewMode === "bookings" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">My Bookings</h2>
              <p className="text-muted-foreground text-sm">
                Your scheduled appointments with therapists.
              </p>
            </div>
          </div>

          {myBookings.length === 0 ? (
            <div className="text-center py-12 border rounded-2xl bg-muted/10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No bookings yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                Book a session with a therapist to see it here.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setViewMode("all")}>
                Browse Therapists
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((booking) => (
                <div 
                  key={booking.booking_id} 
                  className="bg-card rounded-xl border shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={booking.status === 'Confirmed' || booking.status === 'Requested' ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200' : 'bg-secondary text-secondary-foreground'}>
                        {booking.status === 'Confirmed' || booking.status === 'Requested' ? 'Booked' : booking.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(booking.appointment_date).toLocaleDateString()} at {booking.appointment_time}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg">
                      {booking.therapist ? `Session with ${booking.therapist.name}` : "Therapy Session"}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {booking.notes || "No notes"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="outline" size="sm" onClick={(e) => {
                       e.stopPropagation();
                       // TODO: Implement reschedule
                     }}>
                       Reschedule
                     </Button>
                     <Button variant="destructive" size="sm" onClick={(e) => {
                       e.stopPropagation();
                       // TODO: Implement cancel
                     }}>
                       Cancel
                     </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === "sections" && showcaseSections.length > 0 && (
        <div className="space-y-10">
          {showcaseSections.map(({ key, title, description, accent, icon: Icon, data }) => {
            const isExpanded = expandedSection === key;
            const displayedTherapists = isExpanded ? data : data.slice(0, 8);

            return (
            <section key={key} className="space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} text-white flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <p className="text-muted-foreground text-sm">{description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="px-4 py-1 text-sm">
                  {data.length} specialists
                </Badge>
              </div>

              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="-ml-3 md:-ml-4">
                  {displayedTherapists.map((therapist) => (
                    <CarouselItem
                      key={`${key}-${therapist.id}`}
                      className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <ProfileCard
                        therapist={therapist}
                        onClick={() => setSelectedTherapist(therapist)}
                        getDoctorImage={getDoctorImage}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-x-1/2 shadow-md bg-white/95 dark:bg-gray-800/95 w-14 h-14 text-lg" />
                <CarouselNext className="right-0 translate-x-1/2 shadow-md bg-white/95 dark:bg-gray-800/95 w-14 h-14 text-lg" />
              </Carousel>
            </section>
          )})}
        </div>
      )}

      {viewMode === "sections" && showcaseSections.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No therapists found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      )}

      {viewMode === "all" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">All Therapists</h2>
              <p className="text-muted-foreground text-sm">
                {filteredTherapists.length > 0
                  ? <>
                      Showing {(currentPage - 1) * pageSize + 1}-
                      {Math.min(currentPage * pageSize, filteredTherapists.length)} of {filteredTherapists.length} specialists
                    </>
                  : "No therapists match your filters."}
              </p>
            </div>
            {filteredTherapists.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  ‹
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  ›
                </Button>
              </div>
            )}
          </div>

          {filteredTherapists.length === 0 ? (
            <div className="text-center py-12 border rounded-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No therapists found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedTherapists.map((therapist) => (
                <ProfileCard
                  key={`grid-${therapist.id}`}
                  therapist={therapist}
                  onClick={() => setSelectedTherapist(therapist)}
                  getDoctorImage={getDoctorImage}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      <TherapistDetailModal 
        therapist={selectedTherapist}
        open={!!selectedTherapist}
        onOpenChange={(open) => !open && setSelectedTherapist(null)}
        onBook={(therapist) => {
          setBookingTherapist(therapist);
          setSelectedTherapist(null);
        }}
        getDoctorImage={getDoctorImage}
      />

      <BookTherapistModal
        open={!!bookingTherapist}
        onOpenChange={(open) => !open && setBookingTherapist(null)}
        therapist={bookingTherapist}
        onSuccess={() => {
          fetchMyBookings();
          setViewMode("bookings");
        }}
      />

      <BookingDetailModal
        booking={selectedBooking}
        open={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
        onCancel={(id) => {

          // TODO: Implement cancel API
        }}
        onReschedule={(id) => {

          // TODO: Implement reschedule API
        }}
      />
    </div>
  );
}
