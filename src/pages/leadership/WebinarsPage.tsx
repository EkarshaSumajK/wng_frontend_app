import { useState, useMemo } from 'react';
import { Search, Calendar, Video, Users, Clock, Award, Play, CheckCircle, Eye, ArrowLeft, Share2, BarChart3, TrendingUp, ChevronRight, Loader2, School, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useWebinars, useMyWebinarRegistrations, useRegisterWebinar, useUnregisterWebinar } from '@/hooks/useWebinars';
import { useClasses } from '@/hooks/useClasses';
import { useRegisteredAnalytics } from '@/hooks/useWebinarAnalytics';
import { WebinarAnalyticsDashboard } from '@/components/shared/WebinarAnalyticsDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { RegisteredWebinarItem } from '@/services/webinarAnalytics';

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

const ANALYTICS_COLORS = {
  gradient: ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"],
};

const analyticsStatusColors: Record<string, string> = {
  Upcoming: "bg-blue-100 text-blue-700",
  Live: "bg-red-100 text-red-700",
  Recorded: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-100 text-gray-700",
};

export default function WebinarsPage() {
  const { user } = useAuth();
  const [mainTab, setMainTab] = useState<'browse' | 'analytics'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedWebinar, setSelectedWebinar] = useState<any>(null);
  const [sidebarTab, setSidebarTab] = useState<'live' | 'popular' | 'registered'>('live');
  
  // Registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [webinarToRegister, setWebinarToRegister] = useState<any>(null);
  const [registrationType, setRegistrationType] = useState<'school' | 'class'>('school');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  
  // Analytics state
  const [analyticsSearchQuery, setAnalyticsSearchQuery] = useState('');
  const [analyticsStatusFilter, setAnalyticsStatusFilter] = useState<string>('all');
  const [analyticsDaysFilter, setAnalyticsDaysFilter] = useState('30');
  const [selectedAnalyticsWebinarId, setSelectedAnalyticsWebinarId] = useState<string | null>(null);

  const { data: webinarsData, isLoading } = useWebinars({});
  const { data: registrationsData } = useMyWebinarRegistrations();
  const registerMutation = useRegisterWebinar();
  const unregisterMutation = useUnregisterWebinar();
  
  // Fetch classes for registration modal
  const { data: classesData } = useClasses({ school_id: user?.school_id });

  // Analytics hooks - uses /analytics/webinars/registered endpoint for registered webinars only
  const analyticsDays = parseInt(analyticsDaysFilter);
  const { data: registeredAnalyticsData, isLoading: analyticsWebinarsLoading } = useRegisteredAnalytics(
    user?.school_id,
    analyticsDays
  );

  // Summary data from registered analytics
  const summaryData = registeredAnalyticsData?.summary;
  const summaryLoading = analyticsWebinarsLoading;

  // Filter registered webinars by search and status
  const filteredAnalyticsWebinars = useMemo(() => {
    if (!registeredAnalyticsData?.webinars) return [];
    return registeredAnalyticsData.webinars.filter((webinar) => {
      const matchesSearch = 
        (webinar.title?.toLowerCase() || '').includes(analyticsSearchQuery.toLowerCase()) ||
        (webinar.speaker_name?.toLowerCase() || '').includes(analyticsSearchQuery.toLowerCase());
      const matchesStatus = analyticsStatusFilter === 'all' || webinar.status === analyticsStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [registeredAnalyticsData, analyticsSearchQuery, analyticsStatusFilter]);

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

  // Open registration modal
  const openRegistrationModal = (webinar: any) => {
    setWebinarToRegister(webinar);
    setRegistrationType('school');
    setSelectedClassIds([]);
    setShowRegistrationModal(true);
  };

  // Handle registration with type selection
  const handleRegister = async (webinar: any) => {
    if (isRegistered(webinar.id)) {
      // Unregister directly
      try {
        await unregisterMutation.mutateAsync(webinar.id);
        toast.success('Unregistered successfully');
      } catch (error) {
        toast.error('Failed to unregister. Please try again.');
      }
    } else {
      // Open modal for registration type selection
      openRegistrationModal(webinar);
    }
  };

  // Confirm registration with selected type
  const confirmRegistration = async () => {
    if (!webinarToRegister) return;
    
    try {
      await registerMutation.mutateAsync({
        webinarId: webinarToRegister.id,
        request: {
          registration_type: registrationType,
          class_ids: registrationType === 'class' ? selectedClassIds : undefined,
          notify_students: true,
        },
      });
      
      const message = registrationType === 'school' 
        ? 'Registered for entire school successfully!' 
        : `Registered for ${selectedClassIds.length} class(es) successfully!`;
      toast.success(message);
      
      setShowRegistrationModal(false);
      setWebinarToRegister(null);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  // Toggle class selection
  const toggleClassSelection = (classId: string) => {
    setSelectedClassIds(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  // Check if user has any registered webinars (for showing analytics tab)
  const hasRegisteredWebinars = useMemo(() => {
    return (registrationsData?.registrations?.length || 0) > 0;
  }, [registrationsData]);

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

  // Render analytics detail view
  if (selectedAnalyticsWebinarId) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Button
          variant="outline"
          onClick={() => setSelectedAnalyticsWebinarId(null)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analytics
        </Button>
        <WebinarAnalyticsDashboard webinarId={selectedAnalyticsWebinarId} />
      </div>
    );
  }

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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
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

      {/* Main Tabs */}
      <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as 'browse' | 'analytics')} className="w-full">
        <TabsList className={`grid w-full max-w-md h-12 p-1 bg-muted/50 backdrop-blur-sm rounded-xl mb-6 ${hasRegisteredWebinars ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <TabsTrigger value="browse" className="rounded-lg gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            <Video className="w-4 h-4" />
            Browse
          </TabsTrigger>
          {hasRegisteredWebinars && (
            <TabsTrigger value="analytics" className="rounded-lg gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          )}
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
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
              <div className="bg-card/80 dark:bg-card/80 backdrop-blur-sm rounded-3xl border-2 border-purple-200/30 shadow-xl p-8 space-y-6">
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
                              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
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
                              
                              <Button variant="outline" size="sm" className="w-full hover:bg-purple-50 hover:border-purple-500 transition-colors text-xs h-8">
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 -translate-x-1/2 shadow-lg border-2 border-purple-300/30 bg-card/95 dark:bg-card/95 w-12 h-12" />
                  <CarouselNext className="right-0 translate-x-1/2 shadow-lg border-2 border-purple-300/30 bg-card/95 dark:bg-card/95 w-12 h-12" />
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-3xl -z-10" />
                <div className="bg-card/80 dark:bg-card/80 backdrop-blur-sm rounded-3xl border-2 border-primary/10 shadow-xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
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
                                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
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
                                  <div className="w-10 h-10 rounded-full bg-card/90 dark:bg-card/90 flex items-center justify-center shadow-lg">
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
                                
                                <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:border-primary transition-colors text-xs h-8">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0 -translate-x-1/2 shadow-lg border-2 border-primary/20 bg-card/95 dark:bg-card/95 w-12 h-12" />
                    <CarouselNext className="right-0 translate-x-1/2 shadow-lg border-2 border-primary/20 bg-card/95 dark:bg-card/95 w-12 h-12" />
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
              className="group hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Overview
            </Button>
            <div className="h-8 w-px bg-border" />
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

                      <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:border-primary transition-colors">
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
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => setSidebarTab('registered')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${
                  sidebarTab === 'registered'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Registered
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                {sidebarTab === 'live' ? 'Top Live' : sidebarTab === 'popular' ? 'Most Popular' : 'My Registered'}
              </h3>

              {(sidebarTab === 'live' ? liveWebinars : sidebarTab === 'popular' ? popularWebinars : registeredWebinars).map((webinar: any) => (
                <div
                  key={webinar.id}
                  className="flex gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => setSelectedWebinar(webinar)}
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
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
                <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                  <CardTitle className="text-base">Speaker</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-4">
                    {selectedWebinar.speakerImage ? (
                      <img src={selectedWebinar.speakerImage} alt={selectedWebinar.speaker} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
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
                  <CardHeader className="bg-gradient-to-r from-background to-muted/20">
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
                  <CardHeader className="bg-gradient-to-r from-background to-muted/20">
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
                <CardHeader className="bg-gradient-to-r from-background to-muted/20">
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
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
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
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Summary Stats */}
          {summaryLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : summaryData ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-violet-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Registered Webinars</p>
                      <p className="text-3xl font-bold text-violet-600">
                        {registeredAnalyticsData?.total_registered_webinars || 0}
                      </p>
                    </div>
                    <Video className="w-8 h-8 text-violet-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Invited</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {summaryData.total_students_invited || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Attendance Rate</p>
                      <p className="text-3xl font-bold text-green-600">
                        {(summaryData.overall_attendance_rate || 0).toFixed(1)}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                  <Progress
                    value={summaryData.overall_attendance_rate || 0}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Watch Time</p>
                      <p className="text-3xl font-bold text-amber-600">
                        {(summaryData.avg_watch_time || 0).toFixed(0)} min
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-amber-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No registered webinars yet</p>
                <p className="text-sm text-muted-foreground">Register for webinars in the Browse tab to see analytics</p>
              </CardContent>
            </Card>
          )}

          {/* Webinar List - Only show if there are registered webinars */}
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search webinars..."
                value={analyticsSearchQuery}
                onChange={(e) => setAnalyticsSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={analyticsStatusFilter} onValueChange={setAnalyticsStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Recorded">Recorded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={analyticsDaysFilter} onValueChange={setAnalyticsDaysFilter}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="px-3 py-1">
              {filteredAnalyticsWebinars.length} webinars
            </Badge>
          </div>

          {/* Webinar List */}
          {analyticsWebinarsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAnalyticsWebinars.length > 0 ? (
                filteredAnalyticsWebinars.map((webinar, index) => (
                  <Card
                    key={webinar.webinar_id}
                    className="cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
                    onClick={() => setSelectedAnalyticsWebinarId(webinar.webinar_id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform"
                            style={{
                              backgroundColor:
                                ANALYTICS_COLORS.gradient[index % ANALYTICS_COLORS.gradient.length],
                            }}
                          >
                            <Video className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{webinar.title}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {webinar.speaker_name}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={analyticsStatusColors[webinar.status || ""] || "bg-gray-100"}>
                          {webinar.status || "Unknown"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {webinar.registration_type === 'school' ? 'School-wide' : 'Class-wise'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="text-xl font-bold text-primary">
                            {webinar.analytics.attendance_rate.toFixed(0)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Attendance</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="text-xl font-bold text-cyan-600">
                            {webinar.analytics.avg_watch_time.toFixed(0)} min
                          </p>
                          <p className="text-xs text-muted-foreground">Avg Watch</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {webinar.analytics.total_attended}/{webinar.analytics.total_invited}
                        </span>
                        {webinar.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(webinar.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {/* Show registered classes */}
                      {webinar.classes_registered && webinar.classes_registered.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-1">Registered for:</p>
                          <div className="flex flex-wrap gap-1">
                            {webinar.classes_registered.slice(0, 3).map((cls, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {cls}
                              </Badge>
                            ))}
                            {webinar.classes_registered.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{webinar.classes_registered.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Video className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      No registered webinars found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Register for webinars in the Browse tab
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Registration Modal */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              Register for Webinar
            </DialogTitle>
            <DialogDescription>
              {webinarToRegister?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Registration Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Registration Type</Label>
              <RadioGroup
                value={registrationType}
                onValueChange={(value) => {
                  setRegistrationType(value as 'school' | 'class');
                  if (value === 'school') {
                    setSelectedClassIds([]);
                  }
                }}
                className="grid grid-cols-2 gap-4"
              >
                <div className={`relative flex items-center space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${registrationType === 'school' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <RadioGroupItem value="school" id="school" />
                  <Label htmlFor="school" className="flex items-center gap-2 cursor-pointer">
                    <School className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">School-wide</p>
                      <p className="text-xs text-muted-foreground">All students</p>
                    </div>
                  </Label>
                </div>
                <div className={`relative flex items-center space-x-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${registrationType === 'class' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <RadioGroupItem value="class" id="class" />
                  <Label htmlFor="class" className="flex items-center gap-2 cursor-pointer">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Class-wise</p>
                      <p className="text-xs text-muted-foreground">Select classes</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Class Selection (only when class-wise is selected) */}
            {registrationType === 'class' && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Select Classes</Label>
                <div className="max-h-48 overflow-y-auto space-y-2 border rounded-xl p-3 bg-muted/30">
                  {classesData && classesData.length > 0 ? (
                    classesData.map((cls: any) => (
                      <div
                        key={cls.class_id}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                          selectedClassIds.includes(cls.class_id)
                            ? 'bg-primary/10 border border-primary'
                            : 'bg-card hover:bg-muted border border-transparent'
                        }`}
                        onClick={() => toggleClassSelection(cls.class_id)}
                      >
                        <Checkbox
                          checked={selectedClassIds.includes(cls.class_id)}
                          onCheckedChange={() => toggleClassSelection(cls.class_id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{cls.name}</p>
                          {cls.grade && cls.section && (
                            <p className="text-xs text-muted-foreground">
                              Grade {cls.grade} - Section {cls.section}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No classes available
                    </p>
                  )}
                </div>
                {selectedClassIds.length > 0 && (
                  <p className="text-sm text-primary font-medium">
                    {selectedClassIds.length} class(es) selected
                  </p>
                )}
              </div>
            )}

            {/* Summary */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Registration Type:</span>
                <Badge variant="secondary">
                  {registrationType === 'school' ? 'School-wide' : 'Class-wise'}
                </Badge>
              </div>
              {registrationType === 'class' && selectedClassIds.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Classes Selected:</span>
                  <span className="font-semibold">{selectedClassIds.length}</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRegistrationModal(false);
                setWebinarToRegister(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRegistration}
              disabled={
                registerMutation.isPending ||
                (registrationType === 'class' && selectedClassIds.length === 0)
              }
              className="gap-2"
            >
              {registerMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirm Registration
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
