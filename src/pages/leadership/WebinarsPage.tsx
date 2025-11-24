import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Video, Users, Clock, Award, X, Play, BookOpen, Star, Heart, Share2, ChevronRight, TrendingUp, CheckCircle, Eye, Filter, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useWebinars, useMyWebinarRegistrations, useRegisterWebinar, useUnregisterWebinar } from "@/hooks/useWebinars";
import { toast } from "sonner";

// Webinar Card Component (Moved outside to prevent re-renders/flickering)
const WebinarCard = ({ webinar, showPlayButton = false, isRegistered, onClick }: { webinar: any; showPlayButton?: boolean; isRegistered: boolean; onClick: (w: any) => void }) => {
  // Mock data for styling if not present in webinar object
  const originalPrice = webinar.originalPrice || 2499;
  const currentPrice = webinar.price === "Free" ? 0 : (typeof webinar.price === 'number' ? webinar.price : 1999);
  const discount = currentPrice === 0 ? 100 : Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card 
        className="group relative overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full rounded-2xl bg-white flex flex-col"
        onClick={() => onClick(webinar)}
      >
        {/* Image Section */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-100">
          {webinar.speakerImage ? (
            <img 
              src={webinar.speakerImage} 
              alt={webinar.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <Video className="w-12 h-12" />
            </div>
          )}
          
          {/* Status Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant="secondary" 
              className={`
                px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md shadow-sm border-0
                ${webinar.status === 'Live' ? 'bg-white text-red-600' : 'bg-white text-gray-800'}
              `}
            >
              {webinar.status === 'Live' ? '● LIVE' : webinar.status}
            </Badge>
          </div>

          {/* Play Button Overlay (for Recorded) */}
          {showPlayButton && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-primary ml-1" fill="currentColor" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category/Tag */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">
              {webinar.category || "WEBINAR"}
            </span>
            {isRegistered && (
              <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase tracking-wider ml-auto">
                <CheckCircle className="w-3 h-3" />
                <span>Registered</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {webinar.title}
          </h3>

          {/* Meta Info */}
          <div className="space-y-1 mb-4">
            <p className="text-xs text-gray-500 font-medium">
              Started on {new Date(webinar.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            </p>
            <p className="text-xs text-gray-500">
              {webinar.duration || "60 mins"} • {webinar.language || "English"}
            </p>
          </div>

          {/* Footer: Price & Offer */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {currentPrice === 0 ? "Free" : `₹${currentPrice.toLocaleString()}`}
              </span>
              {currentPrice > 0 && (
                <>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-orange-500">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function WebinarsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  
  // Modal & UI States
  const [selectedWebinar, setSelectedWebinar] = useState<any>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [therapistSearch, setTherapistSearch] = useState("");
  const [therapistCategory, setTherapistCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "registered" | "trending">("all");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Therapist View State
  const [showAllTherapists, setShowAllTherapists] = useState(false);

  // Debounce search input to avoid too many renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch webinars data from API (without search parameter - we filter client-side)
  const { data: webinarsData, isLoading: webinarsLoading } = useWebinars({});

  // Fetch user's registrations
  const { data: registrationsData, isLoading: registrationsLoading } = useMyWebinarRegistrations();
  const registerMutation = useRegisterWebinar();
  const unregisterMutation = useUnregisterWebinar();

  // Get registered webinar IDs for easy lookup
  const registeredWebinarIds = useMemo(() => {
    if (!registrationsData?.registrations) return new Set();
    return new Set(registrationsData.registrations.map((r: any) => r.webinar_id));
  }, [registrationsData]);

  // Transform API data to match existing component structure
  const webinars = useMemo(() => {
    if (!webinarsData?.webinars) return [];
    return webinarsData.webinars.map((w: any) => ({
      id: w.webinar_id,
      title: w.title,
      speaker: w.speaker_name,
      speakerTitle: w.speaker_title || "",
      speakerImage: w.speaker_image_url || "",
      thumbnail: w.thumbnail_url || "",
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(w.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }),
      duration: `${w.duration_minutes} mins`,
      attendees: w.attendee_count,
      category: w.category,
      status: w.status,
      price: w.price > 0 ? w.price : 0,
      originalPrice: w.price > 0 ? Math.round(w.price * 1.25) : 0, // Mock original price
      description: w.description || "",
      topics: w.topics || [],
      level: w.level,
      views: w.views.toString(),
      language: "English", // Mock language
    }));
  }, [webinarsData]);

  // Handle registration
  const handleRegister = async (webinar: any) => {
    try {
      if (isRegistered(webinar.id)) {
        await unregisterMutation.mutateAsync(webinar.id);
        toast.success("Unregistered successfully");
      } else {
        await registerMutation.mutateAsync(webinar.id);
        toast.success("Registered successfully");
      }
    } catch (error) {
      toast.error("Action failed. Please try again.");
    }
  };

  // Categorize webinars
  const registeredWebinars = useMemo(() => {
    if (!webinarsData?.webinars || !registrationsData?.registrations) return [];
    const registeredIds = new Set(registrationsData.registrations.map((r: any) => r.webinar_id));
    return webinars.filter((w: any) => registeredIds.has(w.id));
  }, [webinars, registrationsData]);

  // Mock data for trending and watched webinars
  const trendingWebinars = webinars.slice(0, 6);
  const watchedWebinars = webinars.slice(2, 8);

  // Check if webinar is registered
  const isRegistered = (webinarId: number) => registeredWebinarIds.has(webinarId);

  // Extract unique filter options from data
  const uniqueCategories = useMemo(() => Array.from(new Set(webinars.map((w: any) => w.category))).filter(Boolean) as string[], [webinars]);
  const uniqueStatuses = useMemo(() => Array.from(new Set(webinars.map((w: any) => w.status))).filter(Boolean) as string[], [webinars]);
  const uniqueLevels = useMemo(() => Array.from(new Set(webinars.map((w: any) => w.level))).filter(Boolean) as string[], [webinars]);
  const uniqueLanguages = useMemo(() => Array.from(new Set(webinars.map((w: any) => w.language))).filter(Boolean) as string[], [webinars]);

  // Determine which webinars to display based on active tab, filters, sorting, and pagination
  const displayedWebinars = useMemo(() => {
    // 1. Select Base List
    let baseList = webinars;
    if (activeTab === "registered") {
      baseList = registeredWebinars;
    } else if (activeTab === "trending") {
      baseList = trendingWebinars;
    }

    // 2. Apply Filters (Search & Sidebar)
    let filtered = baseList.filter((webinar: any) => {
      const matchesSearch = 
        webinar.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        webinar.speaker.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        webinar.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(webinar.category);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(webinar.status);
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(webinar.level);
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(webinar.language);

      return matchesSearch && matchesCategory && matchesStatus && matchesLevel && matchesLanguage;
    });

    // 3. Apply Sorting
    if (sortBy === "newest") {
      filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "price_low") {
      filtered.sort((a: any, b: any) => a.price - b.price);
    } else if (sortBy === "price_high") {
      filtered.sort((a: any, b: any) => b.price - a.price);
    }
    // "relevance" keeps original order

    return filtered;
  }, [activeTab, webinars, registeredWebinars, trendingWebinars, debouncedSearch, selectedCategories, selectedStatuses, selectedLevels, selectedLanguages, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(displayedWebinars.length / itemsPerPage);
  const paginatedWebinars = displayedWebinars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters/tabs change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedSearch, selectedCategories, selectedStatuses, selectedLevels, selectedLanguages, sortBy]);

  // Filter Component
  const FilterSection = ({ title, options, selected, setSelected }: { title: string, options: string[], selected: string[], setSelected: (val: string[]) => void }) => (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-2 cursor-pointer group">
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h4>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200" />
      </div>
      <div className="space-y-2 mt-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${title}-${option}`}
              checked={selected.includes(option)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelected([...selected, option]);
                } else {
                  setSelected(selected.filter(item => item !== option));
                }
              }}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor={`${title}-${option}`}
              className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Webinars & Workshops</h1>
          <p className="text-gray-500">Learn from top mental health professionals</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                {(selectedCategories.length > 0 || selectedStatuses.length > 0 || selectedLevels.length > 0 || selectedLanguages.length > 0) && (
                  <button 
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedStatuses([]);
                      setSelectedLevels([]);
                      setSelectedLanguages([]);
                    }}
                    className="text-xs text-red-500 font-bold uppercase hover:text-red-600"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <FilterSection 
                title="Status" 
                options={uniqueStatuses} 
                selected={selectedStatuses} 
                setSelected={setSelectedStatuses} 
              />
              <FilterSection 
                title="Category" 
                options={uniqueCategories} 
                selected={selectedCategories} 
                setSelected={setSelectedCategories} 
              />
              <FilterSection 
                title="Level" 
                options={uniqueLevels} 
                selected={selectedLevels} 
                setSelected={setSelectedLevels} 
              />
              <FilterSection 
                title="Language" 
                options={uniqueLanguages} 
                selected={selectedLanguages} 
                setSelected={setSelectedLanguages} 
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar: Sort & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search webinars, topics, speakers..."
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
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
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
                All
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === "registered" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
                onClick={() => setActiveTab("registered")}
              >
                Registered
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === "trending" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
                onClick={() => setActiveTab("trending")}
              >
                Trending
              </button>
            </div>
            {/* Webinars Grid */}
            {webinarsLoading ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[28rem] rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : paginatedWebinars.length > 0 ? (
              <>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedWebinars.map((webinar: any) => (
                    <WebinarCard 
                      key={webinar.id} 
                      webinar={webinar} 
                      showPlayButton={webinar.status === "Recorded"} 
                      isRegistered={isRegistered(webinar.id)}
                      onClick={setSelectedWebinar}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="rounded-full w-10 h-10 border-gray-200 hover:bg-gray-50 hover:text-primary"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                            currentPage === page
                              ? "bg-primary text-white shadow-lg shadow-primary/25 scale-110"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="rounded-full w-10 h-10 border-gray-200 hover:bg-gray-50 hover:text-primary"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No webinars found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
                <Button 
                  variant="link" 
                  className="mt-2 text-primary"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                    setSelectedStatuses([]);
                    setSelectedLevels([]);
                    setSelectedLanguages([]);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Featured Therapists Section (Below Grid) */}
            {!webinarsLoading && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Featured Therapists</h2>
                  <div 
                    className="flex items-center text-primary hover:text-primary/80 cursor-pointer text-sm font-bold transition-colors"
                    onClick={() => setShowAllTherapists(!showAllTherapists)}
                  >
                    {showAllTherapists ? "Show Less" : "View All"} <ChevronRight className={`w-4 h-4 ml-1 transition-transform duration-300 ${showAllTherapists ? "rotate-90" : ""}`} />
                  </div>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {webinars.slice(0, showAllTherapists ? undefined : 4).map((webinar: any, index: number) => (
                    <motion.div
                      key={webinar.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card 
                        className="group relative overflow-visible border-0 shadow-none bg-transparent cursor-pointer h-full"
                        onClick={() => setSelectedTherapist(webinar)}
                      >
                        <div className="relative h-full flex flex-col">
                          {/* Image Section */}
                          <div className="relative z-10 w-full h-64 flex-shrink-0 flex items-end justify-center overflow-hidden rounded-t-3xl bg-gray-50">
                            {webinar.speakerImage ? (
                              <img 
                                src={webinar.speakerImage} 
                                alt={webinar.speaker}
                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Users className="w-20 h-20" />
                              </div>
                            )}
                          </div>

                          {/* Info Box */}
                          <div className="relative z-20 flex-1 w-full -mt-4 bg-[#1e293b] rounded-2xl p-6 pt-8 text-center shadow-xl flex flex-col justify-between">
                            {/* Floating Badge */}
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-white text-gray-900 hover:bg-white border-0 px-3 py-1 shadow-sm text-xs font-bold">
                                {Math.floor(Math.random() * 10) + 5}+ years exp
                              </Badge>
                            </div>

                            <div>
                              <h3 className="text-xl font-bold text-white mt-2 mb-1 line-clamp-1">{webinar.speaker}</h3>
                              <p className="text-gray-400 text-sm font-medium mb-4 line-clamp-2">{webinar.speakerTitle}</p>
                            </div>
                            
                            <div className="flex justify-center">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wide">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Wellness Verified
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Webinar Detail Modal */}
      <Dialog open={!!selectedWebinar} onOpenChange={(open) => !open && setSelectedWebinar(null)}>

        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-0 [&>button]:hidden">
          {selectedWebinar && (
            <div className="flex flex-col h-[90vh]">
              {/* Modal Header Image */}
              <div className="relative h-64 sm:h-80 flex-shrink-0">
                {selectedWebinar.thumbnail ? (
                  <img 
                    src={selectedWebinar.thumbnail} 
                    alt={selectedWebinar.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <Video className="w-20 h-20 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={() => setSelectedWebinar(null)}
                >
                  <X className="w-6 h-6" />
                </Button>

                {/* Views Badge - Top Left */}
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-black/80 text-white backdrop-blur-sm rounded-full shadow-lg border-0 text-sm px-3 py-1.5">
                    <Eye className="w-4 h-4 mr-1.5" />
                    {selectedWebinar.views} views
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <Badge className="mb-4 bg-primary text-primary-foreground border-0 px-3 py-1 text-sm">
                    {selectedWebinar.category}
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    {selectedWebinar.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border border-white/30">
                        {selectedWebinar.speakerImage ? (
                          <img src={selectedWebinar.speakerImage} alt={selectedWebinar.speaker} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                            {selectedWebinar.speaker.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{selectedWebinar.speaker}</p>
                        <p className="text-xs text-white/70">{selectedWebinar.speakerTitle}</p>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-white/20" />
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-white/70 uppercase tracking-wider font-bold">Date</p>
                        <p className="font-medium">{selectedWebinar.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-white/70 uppercase tracking-wider font-bold">Time</p>
                        <p className="font-medium">{selectedWebinar.time}</p>
                      </div>
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
                        <BookOpen className="w-5 h-5 text-primary" />
                        About this Session
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {selectedWebinar.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        What You'll Learn
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {selectedWebinar.topics.map((topic: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-gray-700 font-medium leading-snug">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar in Modal */}
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4">Session Details</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500">Duration</span>
                          <span className="font-medium text-gray-900">{selectedWebinar.duration}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500">Language</span>
                          <span className="font-medium text-gray-900">English</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500">Level</span>
                          <span className="font-medium text-gray-900">{selectedWebinar.level}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500">Certificate</span>
                          <span className="font-medium text-gray-900">Yes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-between flex-shrink-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {selectedWebinar.price === "Free" ? "Free" : selectedWebinar.price}
                  </span>
                  {selectedWebinar.price !== "Free" && (
                    <span className="text-sm text-gray-500 line-through">₹2,499</span>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" size="lg" className="rounded-xl border-gray-300 hover:bg-gray-50">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                  <Button 
                    size="lg" 
                    className={`rounded-xl px-8 font-bold text-lg shadow-lg shadow-primary/20 ${
                      isRegistered(selectedWebinar.id) 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    onClick={() => handleRegister(selectedWebinar)}
                    disabled={registerMutation.isPending || unregisterMutation.isPending}
                  >
                    {registerMutation.isPending || unregisterMutation.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : isRegistered(selectedWebinar.id) ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Registered
                      </>
                    ) : (
                      "Register Now"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Therapist Detail Modal */}
      {/* Therapist Detail Modal */}
      <Dialog open={!!selectedTherapist} onOpenChange={(open) => !open && setSelectedTherapist(null)}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 gap-0 [&>button]:hidden">
          {selectedTherapist && (
            <div className="flex flex-col h-[90vh]">
              {/* Modal Header Image */}
              <div className="relative h-64 sm:h-80 flex-shrink-0">
                {selectedTherapist.speakerImage ? (
                  <img 
                    src={selectedTherapist.speakerImage} 
                    alt={selectedTherapist.speaker}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-9xl font-bold text-primary/20">
                      {selectedTherapist.speaker?.charAt(0) || 'T'}
                    </span>
                  </div>
                )}
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
                    {selectedTherapist.category}
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
                    {selectedTherapist.speaker}
                  </h2>
                  <p className="text-xl text-white/90 font-medium">{selectedTherapist.speakerTitle}</p>
                  
                  <div className="flex items-center gap-4 mt-4 text-white/80">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">4.9</span>
                      <span className="text-sm">(120+ reviews)</span>
                    </div>
                    <div className="h-4 w-px bg-white/30" />
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span className="font-bold text-white">{selectedTherapist.attendees}+</span>
                      <span className="text-sm">Students Mentored</span>
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
                        {selectedTherapist.speaker} is a highly experienced {selectedTherapist.speakerTitle.toLowerCase()} specializing in {selectedTherapist.category.toLowerCase()}. 
                        With years of experience working with students and educational institutions, they bring evidence-based practices and compassionate care to every session.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Specializations
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedTherapist.topics.map((topic: string, index: number) => (
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
                          <span className="font-medium text-gray-900">{Math.floor(Math.random() * 10) + 5}+ Years</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500">Webinars</span>
                          <span className="font-medium text-gray-900">{Math.floor(Math.random() * 20) + 5}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                          <span className="text-gray-500">Language</span>
                          <span className="font-medium text-gray-900">English, Hindi</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-2">Credentials</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-blue-800 text-sm">
                          <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Licensed Clinical Psychologist</span>
                        </li>
                        <li className="flex items-start gap-2 text-blue-800 text-sm">
                          <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>M.Phil in Clinical Psychology</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-between flex-shrink-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Next Available Slot</span>
                  <span className="text-lg font-bold text-gray-900">Tomorrow, 10:00 AM</span>
                </div>
                {/* Buttons removed as per request */}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
}
