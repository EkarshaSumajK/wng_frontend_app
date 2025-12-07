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
      <div className="bg-card/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl border-2 border-border/50 shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search webinars by title, speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-card border-border focus:border-primary rounded-xl"
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
              <SelectTrigger className="h-10 rounded-xl border-border focus:border-primary">
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
       <p className="text-xs text-muted-foreground flex items-center gap-1.5 ml-2">
                      <span className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </span>
                      Badge shows you are registered to the Webinar
                    </p>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
      {!selectedStatus ? (
        <div className="space-y-12">
          {/* Featured Webinars Section */}
          {featuredWebinars.length > 0 && (
            <section className="space-y-4">
              <Carousel opts={{ align: "start" }} className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      Featured Webinars
                    </h3>
                    <div className="flex items-center gap-2">
                      <CarouselPrevious className="static rounded-sm h-12 w-12 translate-y-0 bg-card dark:bg-card shadow-sm hover:bg-accent dark:hover:bg-accent border-border" />
                      <CarouselNext className="static rounded-sm h-12 w-12 translate-y-0 bg-card dark:bg-card shadow-sm hover:bg-accent dark:hover:bg-accent border-border" />
                    </div>
                    {/* Legend for registered badge */}
                   
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:bg-purple-50"
                    onClick={() => setSelectedStatus('Featured')}
                  >
                    View All
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </div>
                <CarouselContent className="-ml-4">
                  {featuredWebinars.map((webinar: any) => (
                    <CarouselItem key={webinar.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div 
                        className="group cursor-pointer space-y-2"
                        onClick={() => setSelectedWebinar(webinar)}
                      >
                        {/* Thumbnail - 4:3 aspect ratio */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                          {webinar.speakerImage ? (
                            <img 
                              src={webinar.speakerImage} 
                              alt={webinar.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                              <Video className="w-16 h-16 text-purple-300" />
                            </div>
                          )}
                          
                          {/* Views Count - Bottom Left */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-card/90 dark:bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{webinar.views}</span>
                          </div>
                          
                          {/* Play Button - Bottom Right */}
                          <div className="absolute bottom-3 right-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                              <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                          
                          {/* Registered Badge - Minimal */}
                          {isRegistered(webinar.id) && (
                            <div className="absolute top-3 right-3" title="Registered">
                              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center shadow-md cursor-help">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-1.5">
                          {/* Language & Category Pills */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              {webinar.language}
                            </span>
                            <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-semibold text-primary bg-primary/10">
                              {webinar.category}
                            </Badge>
                          </div>
                          
                          {/* Title */}
                          <h3 className="font-bold text-sm leading-tight text-foreground group-hover:text-primary line-clamp-2">
                            {webinar.title}
                          </h3>
                          
                          {/* Speaker */}
                          <p className="text-xs text-muted-foreground">
                            {webinar.speaker}
                          </p>
                          
                          {/* Price & Duration */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm font-bold text-foreground">
                                {webinar.price === 0 ? 'Free' : `₹${webinar.price.toLocaleString()}`}
                              </span>
                              {webinar.price > 0 && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  ₹{webinar.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {webinar.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </section>
          )}
          
          {/* Status Sections - Each status gets its own section */}
          {uniqueStatuses.map((status: string) => {
            const statusWebinars = applyFilters(webinars.filter((w: any) => w.status === status));
            
            if (statusWebinars.length === 0) return null;

            const statusColor = status === 'Live' ? 'text-red-600' : 
                               status === 'Upcoming' ? 'text-blue-600' : 'text-green-600';
            const statusBg = status === 'Live' ? 'bg-red-100' : 
                            status === 'Upcoming' ? 'bg-blue-100' : 'bg-green-100';
            
            return (
              <section key={status} className="space-y-4">
                <Carousel opts={{ align: "start" }} className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${statusBg} ${statusColor}`}>
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">{statusLabels[status]}</h2>
                          <p className="text-sm text-muted-foreground">{statusWebinars.length} webinars available</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CarouselPrevious className="static rounded-sm h-12 w-12 translate-y-0 bg-card dark:bg-card shadow-sm hover:bg-accent dark:hover:bg-accent border-border" />
                        <CarouselNext className="static rounded-sm h-12 w-12 translate-y-0 bg-card dark:bg-card shadow-sm hover:bg-accent dark:hover:bg-accent border-border" />
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:bg-blue-50"
                      onClick={() => setSelectedStatus(status)}
                    >
                      View All
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  </div>

                  <CarouselContent className="-ml-4">
                    {statusWebinars.slice(0, 10).map((webinar: any) => (
                      <CarouselItem key={webinar.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                        <div 
                          className="group cursor-pointer space-y-2"
                          onClick={() => setSelectedWebinar(webinar)}
                        >
                          {/* Thumbnail - 4:3 aspect ratio */}
                          <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br ${statusBg} shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
                            {webinar.speakerImage ? (
                              <img 
                                src={webinar.speakerImage} 
                                alt={webinar.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${statusBg}`}>
                                <Video className={`w-16 h-16 ${statusColor} opacity-50`} />
                              </div>
                            )}
                            
                            {/* Views Count - Bottom Left */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-card/90 dark:bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{webinar.views}</span>
                            </div>
                            
                            {/* Play Button - Bottom Right */}
                            <div className="absolute bottom-3 right-3">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                              </div>
                            </div>
                            
                            {/* Status Badge - Top Left */}
                            {webinar.status === 'Live' && (
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-red-600 text-white font-semibold text-xs animate-pulse">
                                  ● LIVE
                                </Badge>
                              </div>
                            )}
                            
                            {/* Registered Badge - Minimal */}
                            {isRegistered(webinar.id) && (
                              <div className="absolute top-3 right-3" title="Registered">
                                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center shadow-md cursor-help">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="space-y-1.5">
                            {/* Language & Category Pills */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                {webinar.language}
                              </span>
                              <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-semibold text-primary bg-primary/10">
                                {webinar.category}
                              </Badge>
                            </div>
                            
                            {/* Title */}
                            <h3 className="font-bold text-sm leading-tight text-foreground group-hover:text-primary line-clamp-2">
                              {webinar.title}
                            </h3>
                            
                            {/* Speaker */}
                            <p className="text-xs text-muted-foreground">
                              {webinar.speaker}
                            </p>
                            
                            {/* Price & Duration */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-baseline gap-2">
                                <span className="text-sm font-bold text-foreground">
                                  {webinar.price === 0 ? 'Free' : `₹${webinar.price.toLocaleString()}`}
                                </span>
                                {webinar.price > 0 && (
                                  <span className="text-[10px] text-gray-400 line-through">
                                    ₹{webinar.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {webinar.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
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
          <div className="bg-card/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl border-2 border-border/50 shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search webinars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-card border-border focus:border-primary rounded-xl"
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
                  <SelectTrigger className="h-10 rounded-xl border-border focus:border-primary">
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
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
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

                  <CardContent className="space-y-2 flex-1 flex flex-col">
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

                    <div className="mt-auto pt-2 border-t">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-lg font-bold text-foreground">
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

                      <Button variant="outline" size="sm" className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-primary transition-colors text-xs h-7">
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
          <div className="bg-card/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl border-2 border-border/50 shadow-lg p-6 sticky top-24">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSidebarTab('live')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                  sidebarTab === 'live'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Live
              </button>
              <button
                onClick={() => setSidebarTab('popular')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                  sidebarTab === 'popular'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => setSidebarTab('registered')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                  sidebarTab === 'registered'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Registered
              </button>
            </div>

            {/* Sidebar Content - Scrollable */}
            <div className="space-y-3 min-h-[90vh] max-h-[90vh] overflow-y-auto pr-1 scrollbar-thin">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide sticky top-0 bg-card/80 dark:bg-card/80 backdrop-blur-sm py-2 -mt-2">
                {sidebarTab === 'live' ? 'Top Live' : sidebarTab === 'popular' ? 'Most Popular' : 'My Registered'}
              </h3>

              {(sidebarTab === 'live' ? liveWebinars : sidebarTab === 'popular' ? popularWebinars : registeredWebinars).map((webinar: any) => (
                <div
                  key={webinar.id}
                  className="group cursor-pointer space-y-2"
                  onClick={() => setSelectedWebinar(webinar)}
                >
                  {/* Thumbnail - Similar to main cards */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5">
                    {webinar.speakerImage ? (
                      <img
                        src={webinar.speakerImage}
                        alt={webinar.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-10 h-10 text-blue-300" />
                      </div>
                    )}
                    
                    {/* Views Count - Bottom Left */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-card/90 dark:bg-card/90 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm backdrop-blur-sm">
                      <Eye className="w-3 h-3" />
                      <span>{webinar.views}</span>
                    </div>
                    
                    {/* Play Button - Bottom Right */}
                    <div className="absolute bottom-2 right-2">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                        <Play className="w-3 h-3 text-white ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    
                    {/* Status Badge - Top Left */}
                    {sidebarTab === 'live' && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 animate-pulse">
                          ● LIVE
                        </Badge>
                      </div>
                    )}
                    
                    {/* Registered Badge - Top Right */}
                    {isRegistered(webinar.id) && (
                      <div className="absolute top-2 right-2" title="Registered">
                        <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center shadow-sm">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-1">
                    {/* Language & Category */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {webinar.language}
                      </span>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-semibold text-primary bg-primary/10">
                        {webinar.category}
                      </Badge>
                    </div>
                    
                    {/* Title */}
                    <h4 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {webinar.title}
                    </h4>
                    
                    {/* Speaker */}
                    <p className="text-[10px] text-muted-foreground truncate">
                      {webinar.speaker}
                    </p>
                    
                    {/* Price & Duration */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {webinar.price === 0 ? 'Free' : `₹${webinar.price.toLocaleString()}`}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {webinar.duration}
                      </span>
                    </div>
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
                    <span className="text-3xl font-bold text-foreground">
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
