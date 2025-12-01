import { useState, useMemo } from 'react';
import { Search, Calendar, Video, Users, Clock, Award, X, Play, BookOpen, CheckCircle, Eye, ArrowLeft, Share2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useWebinars, useMyWebinarRegistrations, useRegisterWebinar, useUnregisterWebinar } from '@/hooks/useWebinars';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const statusLabels: Record<string, string> = {
  'Featured': 'Featured Webinars',
  'Live': 'Live Webinars',
  'Upcoming': 'Upcoming Webinars',
  'Recorded': 'Recorded Webinars',
};

const statusColors: Record<string, string> = {
  'Featured': 'bg-purple-100 text-purple-800 border-purple-200',
  'Live': 'bg-red-100 text-red-800 border-red-200',
  'Upcoming': 'bg-blue-100 text-blue-800 border-blue-200',
  'Recorded': 'bg-green-100 text-green-800 border-green-200',
};

export default function WebinarsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedWebinar, setSelectedWebinar] = useState<any>(null);
  const [sidebarTab, setSidebarTab] = useState<'live' | 'popular' | 'registered'>('live');

  const { data: webinarsData, isLoading } = useWebinars({});
  const { data: registrationsData } = useMyWebinarRegistrations();
  const registerMutation = useRegisterWebinar();
  const unregisterMutation = useUnregisterWebinar();

  // Get registered webinar IDs
  const registeredWebinarIds = useMemo(() => {
    if (!registrationsData?.registrations) return new Set();
    return new Set(registrationsData.registrations.map((r: any) => r.webinar_id));
  }, [registrationsData]);

  // Transform API data
  const webinars = useMemo(() => {
    if (!webinarsData?.webinars) return [];
    return webinarsData.webinars.map((w: any) => ({
      id: w.webinar_id,
      title: w.title,
      speaker: w.speaker_name,
      speakerTitle: w.speaker_title || '',
      speakerImage: w.speaker_image_url || '',
      thumbnail: w.thumbnail_url || '',
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(w.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' }),
      duration: `${w.duration_minutes} mins`,
      attendees: w.attendee_count,
      category: w.category,
      status: w.status,
      price: w.price > 0 ? w.price : 0,
      originalPrice: w.price > 0 ? Math.round(w.price * 1.25) : 0,
      description: w.description || '',
      topics: w.topics || [],
      level: w.level,
      views: w.views.toString(),
      language: 'English',
    }));
  }, [webinarsData]);

  // Check if registered
  const isRegistered = (webinarId: number) => registeredWebinarIds.has(webinarId);

  // Handle registration
  const handleRegister = async (webinar: any) => {
    try {
      if (isRegistered(webinar.id)) {
        await unregisterMutation.mutateAsync(webinar.id);
        toast.success('Unregistered successfully');
      } else {
        await registerMutation.mutateAsync(webinar.id);
        toast.success('Registered successfully');
      }
    } catch (error) {
      toast.error('Action failed. Please try again.');
    }
  };

  // Filter webinars
  const filteredWebinars = useMemo(() => {
    return webinars.filter((webinar: any) => {
      const matchesSearch = webinar.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           webinar.speaker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           webinar.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(webinar.category);
      const matchesStatus = !selectedStatus || webinar.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [webinars, searchQuery, selectedCategories, selectedStatus]);

  const uniqueCategories = useMemo(() => 
    Array.from(new Set(webinars.map((w: any) => w.category))).filter(Boolean) as string[], 
  [webinars]);

  const uniqueStatuses = ['Live', 'Upcoming', 'Recorded'];

  // Helper function to apply filters
  const applyFilters = (webinarsList: any[]) => {
    return webinarsList.filter((webinar: any) => {
      const matchesSearch = webinar.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           webinar.speaker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           webinar.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(webinar.category);
      return matchesSearch && matchesCategory;
    });
  };

  // Sidebar data - with filters applied
  const liveWebinars = useMemo(() => {
    const filtered = applyFilters(webinars.filter((w: any) => w.status === 'Live'));
    return filtered.slice(0, 5);
  }, [webinars, searchQuery, selectedCategories]);
  
  const popularWebinars = useMemo(() => {
    const filtered = applyFilters(webinars);
    return filtered.sort((a: any, b: any) => parseInt(b.views) - parseInt(a.views)).slice(0, 5);
  }, [webinars, searchQuery, selectedCategories]);
  
  const registeredWebinars = useMemo(() => {
    const filtered = applyFilters(webinars.filter((w: any) => isRegistered(w.id)));
    return filtered.slice(0, 5);
  }, [webinars, registeredWebinarIds, searchQuery, selectedCategories]);
  
  // Featured webinars - top 12 most popular with filters applied
  const featuredWebinars = useMemo(() => {
    const filtered = applyFilters(webinars);
    return filtered.sort((a: any, b: any) => parseInt(b.views) - parseInt(a.views)).slice(0, 12);
  }, [webinars, searchQuery, selectedCategories]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading webinars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100/50 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Webinars & Workshops
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">Learn from top mental health professionals</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search webinars by title, speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-white dark:bg-card border-gray-200 dark:border-border focus:border-primary rounded-xl"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-56">
            <Select
              value={selectedCategories.length > 0 ? selectedCategories[0] : "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedCategories([]);
                } else {
                  setSelectedCategories([value]);
                }
              }}
            >
              <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:border-primary">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedCategories.length > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategories([]);
              }}
              className="h-10 px-4 rounded-xl"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
      {!selectedStatus ? (
        <div className="space-y-12">
          {/* Featured Webinars Section */}
          {featuredWebinars.length > 0 && (
            <section className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-purple-300/3 to-transparent rounded-3xl -z-10" />
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border-2 border-purple-200/30 shadow-xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured Webinars</h2>
                      <p className="text-sm text-muted-foreground mt-1">{featuredWebinars.length} handpicked sessions</p>
                    </div>
                  </div>
                </div>
                
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {featuredWebinars.map((webinar: any) => (
                      <CarouselItem key={webinar.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                        <Card 
                          className="cursor-pointer transition-colors duration-300 hover:border-purple-500 border-2 group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 h-full flex flex-col"
                          onClick={() => setSelectedWebinar(webinar)}
                        >
                          {/* Image Section */}
                          <div className="relative h-36 w-full overflow-hidden bg-gray-100 rounded-t-xl">
                            {webinar.speakerImage ? (
                              <img 
                                src={webinar.speakerImage} 
                                alt={webinar.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <Video className="w-10 h-10" />
                              </div>
                            )}
                            
                            {/* Featured Badge */}
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-semibold text-xs">
                                Featured
                              </Badge>
                            </div>

                            {/* Registered Badge */}
                            {isRegistered(webinar.id) && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-green-600 text-white text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Registered
                                </Badge>
                              </div>
                            )}
                          </div>

                          <CardContent className="flex flex-col p-4 flex-1">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-bold line-clamp-2 flex-1">{webinar.title}</h3>
                              </div>

                              <div className="space-y-0.5">
                                <p className="text-[11px] text-muted-foreground font-medium">
                                  {webinar.date}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  {webinar.duration} • {webinar.language}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t space-y-2">
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span className="truncate">{webinar.speaker}</span>
                              </div>

                              <div className="flex items-baseline gap-2">
                                <span className="text-base font-bold text-gray-900">
                                  {webinar.price === 0 ? 'Free' : `₹${webinar.price.toLocaleString()}`}
                                </span>
                                {webinar.price > 0 && (
                                  <>
                                    <span className="text-[10px] text-gray-400 line-through">
                                      ₹{webinar.originalPrice.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] font-bold text-orange-500">
                                      {Math.round(((webinar.originalPrice - webinar.price) / webinar.originalPrice) * 100)}% OFF
                                    </span>
                                  </>
                                )}
                              </div>
                              
                              <Button variant="outline" size="sm" className="w-full hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-500 transition-colors text-xs h-8">
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 -translate-x-1/2 shadow-lg border-2 border-purple-300/30 bg-white/95 w-12 h-12" />
                  <CarouselNext className="right-0 translate-x-1/2 shadow-lg border-2 border-purple-300/30 bg-white/95 w-12 h-12" />
                </Carousel>
              </div>
            </section>
          )}
          
          {/* Status Sections - Each status gets its own section */}
          {uniqueStatuses.map((status: string) => {
            const statusWebinars = applyFilters(webinars.filter((w: any) => w.status === status));
            
            if (statusWebinars.length === 0) return null;
            
            return (
              <section key={status} className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50/50 to-transparent rounded-3xl -z-10" />
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border-2 border-blue-100 shadow-xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{statusLabels[status]}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{statusWebinars.length} webinars available</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedStatus(status)}
                      className="hidden md:flex items-center gap-2"
                    >
                      View All
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  </div>
                  
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {statusWebinars.slice(0, 12).map((webinar: any) => (
                        <CarouselItem key={webinar.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                          <Card 
                            className="cursor-pointer transition-colors duration-300 hover:border-primary border-2 group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 h-full flex flex-col"
                            onClick={() => setSelectedWebinar(webinar)}
                          >
                            {/* Image Section */}
                            <div className="relative h-36 w-full overflow-hidden bg-gray-100 rounded-t-xl">
                              {webinar.speakerImage ? (
                                <img 
                                  src={webinar.speakerImage} 
                                  alt={webinar.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                  <Video className="w-10 h-10" />
                                </div>
                              )}
                              
                              {/* Status Badge */}
                              <div className="absolute top-2 left-2">
                                <Badge className={`${statusColors[webinar.status]} font-semibold text-xs`}>
                                  {webinar.status === 'Live' ? '● LIVE' : webinar.status}
                                </Badge>
                              </div>

                              {/* Play Button for Recorded */}
                              {webinar.status === 'Recorded' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                    <Play className="w-4 h-4 text-primary ml-0.5" fill="currentColor" />
                                  </div>
                                </div>
                              )}

                              {/* Registered Badge */}
                              {isRegistered(webinar.id) && (
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-green-600 text-white text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Registered
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <CardContent className="flex flex-col p-4 flex-1">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="text-sm font-bold line-clamp-2 flex-1">{webinar.title}</h3>
                                </div>


                                <div className="space-y-0.5">
                                  <p className="text-[11px] text-muted-foreground font-medium">
                                    {webinar.date}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {webinar.duration} • {webinar.language}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-3 pt-3 border-t space-y-2">
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                  <Users className="w-3 h-3" />
                                  <span className="truncate">{webinar.speaker}</span>
                                </div>

                                <div className="flex items-baseline gap-2">
                                  <span className="text-base font-bold text-gray-900 dark:text-white">
                                    {webinar.price === 0 ? 'Free' : `₹${webinar.price.toLocaleString()}`}
                                  </span>
                                  {webinar.price > 0 && (
                                    <>
                                      <span className="text-[10px] text-gray-400 line-through">
                                        ₹{webinar.originalPrice.toLocaleString()}
                                      </span>
                                      <span className="text-[10px] font-bold text-orange-500">
                                        {Math.round(((webinar.originalPrice - webinar.price) / webinar.originalPrice) * 100)}% OFF
                                      </span>
                                    </>
                                  )}
                                </div>
                                
                                <Button variant="outline" size="sm" className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-primary transition-colors text-xs h-8">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0 -translate-x-1/2 shadow-lg border-2 border-blue-200 bg-white/95 w-12 h-12" />
                    <CarouselNext className="right-0 translate-x-1/2 shadow-lg border-2 border-blue-200 bg-white/95 w-12 h-12" />
                  </Carousel>
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Detailed View */
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedStatus(null);
                setSearchQuery("");
              }}
              className="group hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Overview
            </Button>
            <div className="h-8 w-px bg-gray-200" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {statusLabels[selectedStatus]}
            </h2>
            <Badge variant="secondary" className="ml-2">
              {filteredWebinars.length} Webinars
            </Badge>
          </div>

          {/* Filter Bar */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search webinars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-white dark:bg-card border-gray-200 dark:border-border focus:border-primary rounded-xl"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-56">
                <Select
                  value={selectedCategories.length > 0 ? selectedCategories[0] : "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedCategories([]);
                    } else {
                      setSelectedCategories([value]);
                    }
                  }}
                >
                  <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:border-primary">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCategories.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                  }}
                  className="h-10 px-4 rounded-xl"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebinars.length > 0 ? (
              filteredWebinars.map((webinar: any, index: number) => (
                <Card
                  key={webinar.id}
                  className="card-professional cursor-pointer hover:shadow-xl transition-all duration-300 border-2 flex flex-col"
                  onClick={() => setSelectedWebinar(webinar)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100 rounded-t-xl">
                    {webinar.speakerImage ? (
                      <img src={webinar.speakerImage} alt={webinar.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <Video className="w-12 h-12" />
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3">
                      <Badge className={`${statusColors[webinar.status]} font-semibold`}>
                        {webinar.status === 'Live' ? '● LIVE' : webinar.status}
                      </Badge>
                    </div>

                    {isRegistered(webinar.id) && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Registered
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg font-bold line-clamp-2">{webinar.title}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{webinar.category}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 flex-1 flex flex-col">
                    <Separator />
                    <p className="text-sm text-muted-foreground line-clamp-2">{webinar.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{webinar.speaker}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{webinar.date}</span>
                    </div>

                    <div className="mt-auto pt-3 border-t">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {webinar.price === 0 ? 'Free' : `₹${webinar.price.toLocaleString()}`}
                        </span>
                        {webinar.price > 0 && (
                          <>
                            <span className="text-xs text-gray-400 line-through">₹{webinar.originalPrice.toLocaleString()}</span>
                            <span className="text-xs font-bold text-orange-500">
                              {Math.round(((webinar.originalPrice - webinar.price) / webinar.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      <Button variant="outline" size="sm" className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-primary transition-colors">
                        <Eye className="w-3 h-3 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card className="card-professional shadow-lg">
                  <CardContent className="text-center py-12">
                    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Video className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-base text-muted-foreground font-semibold mb-2">
                      No webinars found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 shadow-lg p-6 sticky top-24">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSidebarTab('live')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                  sidebarTab === 'live'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Live
              </button>
              <button
                onClick={() => setSidebarTab('popular')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                  sidebarTab === 'popular'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => setSidebarTab('registered')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                  sidebarTab === 'registered'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Registered
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                {sidebarTab === 'live' ? 'Top Live' : sidebarTab === 'popular' ? 'Most Popular' : 'My Registered'}
              </h3>

              {(sidebarTab === 'live' ? liveWebinars : sidebarTab === 'popular' ? popularWebinars : registeredWebinars).map((webinar: any) => (
                <div
                  key={webinar.id}
                  className="flex gap-3 p-3 rounded-xl border-2 border-gray-100 dark:border-border hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => setSelectedWebinar(webinar)}
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {webinar.speakerImage ? (
                      <img
                        src={webinar.speakerImage}
                        alt={webinar.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Video className="w-8 h-8" />
                      </div>
                    )}
                    {sidebarTab === 'live' && (
                      <div className="absolute top-1 left-1">
                        <Badge className="bg-red-600 text-white text-[10px] px-1.5 py-0.5">
                          ● LIVE
                        </Badge>
                      </div>
                    )}
                    {sidebarTab === 'registered' && (
                      <div className="absolute top-1 left-1">
                        <Badge className="bg-green-600 text-white text-[10px] px-1.5 py-0.5">
                          <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                      {webinar.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {webinar.speaker}
                    </p>
                    {sidebarTab === 'popular' && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        <span>{webinar.views} views</span>
                      </div>
                    )}
                    {sidebarTab === 'registered' && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{webinar.date}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {(sidebarTab === 'live' ? liveWebinars : sidebarTab === 'popular' ? popularWebinars : registeredWebinars).length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No {sidebarTab} webinars available
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>


      {/* Webinar Detail Modal */}
      {selectedWebinar && (
        <Dialog open={!!selectedWebinar} onOpenChange={() => setSelectedWebinar(null)}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{selectedWebinar.title}</DialogTitle>
                  <DialogDescription className="mt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${statusColors[selectedWebinar.status]} font-semibold`}>
                        {selectedWebinar.status}
                      </Badge>
                      <Badge variant="secondary">{selectedWebinar.category}</Badge>
                      {isRegistered(selectedWebinar.id) && (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Registered
                        </Badge>
                      )}
                    </div>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4 animate-in fade-in duration-500">
              {/* Speaker Info */}
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r from-background to-gray-50">
                  <CardTitle className="text-base">Speaker</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-4">
                    {selectedWebinar.speakerImage ? (
                      <img src={selectedWebinar.speakerImage} alt={selectedWebinar.speaker} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-lg">{selectedWebinar.speaker}</p>
                      <p className="text-sm text-muted-foreground">{selectedWebinar.speakerTitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {selectedWebinar.description && (
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-gray-50">
                    <CardTitle className="text-base">About this Session</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedWebinar.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Topics */}
              {selectedWebinar.topics && selectedWebinar.topics.length > 0 && (
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-gray-50">
                    <CardTitle className="text-base">What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {selectedWebinar.topics.map((topic: string, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Session Details */}
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r from-background to-gray-50">
                  <CardTitle className="text-base">Session Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-semibold">Date:</span>
                    <span className="text-muted-foreground">{selectedWebinar.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-semibold">Time:</span>
                    <span className="text-muted-foreground">{selectedWebinar.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-semibold">Duration:</span>
                    <span className="text-muted-foreground">{selectedWebinar.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="font-semibold">Level:</span>
                    <span className="text-muted-foreground">{selectedWebinar.level}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="font-semibold">Views:</span>
                    <span className="text-muted-foreground">{selectedWebinar.views}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {selectedWebinar.price === 0 ? 'Free' : `₹${selectedWebinar.price.toLocaleString()}`}
                    </span>
                    {selectedWebinar.price > 0 && (
                      <span className="text-sm text-gray-500 line-through">₹{selectedWebinar.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                  <Button 
                    size="lg" 
                    className={isRegistered(selectedWebinar.id) ? 'bg-green-600 hover:bg-green-700' : ''}
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
                      'Register Now'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
