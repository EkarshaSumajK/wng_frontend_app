import { useState, useMemo } from 'react';
import { Book, Search, ExternalLink, Video, Music, FileText, Eye, Calendar, User, Tag, ArrowLeft, Sparkles, Filter, Clock, GraduationCap, Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/shared/LoadingState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useResources, useResourceCategories } from '@/hooks/useResources';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CustomYouTubePlayer } from '@/components/shared/CustomYouTubePlayer';

// Helper function to convert YouTube/Vimeo URLs to embed format
const getEmbedUrl = (url: string): string => {
  if (!url) return url;
  
  const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(youtubeRegex);
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  
  const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  return url;
};

const resourceTypeLabels: Record<string, string> = {
  VIDEO: 'Video',
  AUDIO: 'Audio',
  ARTICLE: 'Article',
  RESEARCH_PAPER: 'Research Paper',
  SPECIAL: 'Special Resource',
};

const resourceTypeColors: Record<string, string> = {
  VIDEO: 'bg-blue-100 text-blue-800 border-blue-200',
  video: 'bg-blue-100 text-blue-800 border-blue-200',
  AUDIO: 'bg-purple-100 text-purple-800 border-purple-200',
  audio: 'bg-purple-100 text-purple-800 border-purple-200',
  ARTICLE: 'bg-green-100 text-green-800 border-green-200',
  article: 'bg-green-100 text-green-800 border-green-200',
};

export default function ResourcesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewingResource, setViewingResource] = useState<any>(null);
  const [selectedResourceType, setSelectedResourceType] = useState<string | null>(null);
  const [viewAllType, setViewAllType] = useState<'featured' | null>(null);

  const { data: resources = [], isLoading } = useResources({
    school_id: user?.school_id,
    status: 'PUBLISHED',
    include_global: true
  });

  const { data: categoriesData = [] } = useResourceCategories({
    school_id: user?.school_id,
    include_global: true
  });

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter((resource: any) => {
      const matchesSearch = resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !selectedResourceType || resource.type === selectedResourceType;
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;
      
      // View All Logic
      let matchesViewAll = true;
      
      return matchesSearch && matchesType && matchesCategory && matchesViewAll;
    });
  }, [resources, searchQuery, selectedResourceType, selectedCategory, viewAllType]);

  // Recommended/Featured resources (random selection)
  const featuredResources = useMemo(() => {
    return [...resources].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [resources]);

  const uniqueCategories = useMemo(() => 
    categoriesData.map((c: any) => c.category).filter(Boolean), 
  [categoriesData]);

  const uniqueTypes = useMemo(() => 
    Array.from(new Set(resources.map((r: any) => r.type))).filter(Boolean) as string[], 
  [resources]);

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingState message="Loading resources..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header with modern design */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100/50 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                <Book className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Resource Library
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">Discover intervention guides, videos, and support materials</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {/* Main Content Area */}
      <div className="space-y-12">
        {!selectedResourceType && !viewAllType ? (
          /* Main Dashboard View */
          <div className="space-y-12">
            
            {/* Featured Section */}
            <section className="space-y-4">
               <Carousel opts={{ align: "start" }} className="w-full">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                       <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                         <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                           <Sparkles className="w-5 h-5 text-amber-600" />
                         </div>
                         Featured Resources
                       </h3>
                       <div className="flex items-center gap-2">
                         <CarouselPrevious className="static rounded-sm h-12 w-12 translate-y-0 bg-card dark:bg-card shadow-sm hover:bg-accent dark:hover:bg-accent border-border" />
                         <CarouselNext className="static rounded-sm h-12 w-12 translate-y-0 bg-card dark:bg-card shadow-sm hover:bg-accent dark:hover:bg-accent border-border" />
                       </div>
                    </div>
                    <Button variant="ghost" className="text-primary" onClick={() => setViewAllType('featured')}>View All</Button>
                 </div>
                 <CarouselContent className="-ml-4">
                   {featuredResources.map((resource: any) => (
                     <CarouselItem key={resource.resource_id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                       <div 
                         className="group cursor-pointer space-y-2"
                         onClick={() => setViewingResource(resource)}
                       >
                         {/* Thumbnail - 4:3 aspect ratio */}
                         <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                           {resource.thumbnail_url ? (
                             <img 
                               src={resource.thumbnail_url} 
                               alt={resource.title}
                               className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                             />
                           ) : (
                             <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                               <Sparkles className="w-16 h-16 text-amber-300" />
                             </div>
                           )}
                           
                           {/* Views Count - Bottom Left */}
                           <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-card/90 dark:bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                             <Eye className="w-3.5 h-3.5" />
                             <span>{resource.view_count || 0}</span>
                           </div>
                           
                           {/* Play Button - Bottom Right */}
                           <div className="absolute bottom-3 right-3">
                             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                               <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                             </div>
                           </div>
                           
                           {/* Featured Badge */}
                           <div className="absolute top-3 left-3">
                             <Badge className="bg-amber-500 text-white font-semibold text-xs shadow-md">
                               ★ Featured
                             </Badge>
                           </div>
                         </div>
                         
                         {/* Content */}
                         <div className="space-y-1.5">
                           {/* Category Badge */}
                           <div className="flex items-center gap-2">
                             <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-semibold text-primary bg-primary/10">
                               {resource.category || resourceTypeLabels[resource.type]}
                             </Badge>
                           </div>
                           
                           {/* Title */}
                           <h3 className="font-bold text-sm leading-tight text-foreground group-hover:text-primary line-clamp-2">
                             {resource.title}
                           </h3>
                           
                           {/* Author */}
                           <p className="text-xs text-muted-foreground">
                             {resource.author_name || 'WellNest'}
                           </p>
                           
                           {/* Price & Type */}
                           <div className="flex items-center justify-between pt-1">
                             <span className="text-sm font-bold text-gray-900 dark:text-white">
                               {resource.is_free ? 'Free' : `$${resource.price || 0}`}
                             </span>
                             <span className="text-xs text-muted-foreground">
                               {resourceTypeLabels[resource.type]}
                             </span>
                           </div>
                         </div>
                       </div>
                     </CarouselItem>
                   ))}
                 </CarouselContent>
               </Carousel>
            </section>

            {/* Free Resources Section */}
            <section className="space-y-4">
              <Carousel opts={{ align: "start" }} className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-emerald-600" />
                      </div>
                      Free Resources
                    </h3>
                    <div className="flex items-center gap-2">
                      <CarouselPrevious className="static rounded-sm h-12 w-12 translate-y-0 bg-card dark:bg-card shadow-sm hover:bg-accent dark:hover:bg-accent border-border" />
                      <CarouselNext className="static rounded-sm h-12 w-12 translate-y-0 bg-card dark:bg-card shadow-sm hover:bg-accent dark:hover:bg-accent border-border" />
                    </div>
                  </div>
                </div>
                <CarouselContent className="-ml-4">
                  {resources.filter((r: any) => r.is_free).slice(0, 12).map((resource: any) => (
                    <CarouselItem key={resource.resource_id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div 
                        className="group cursor-pointer space-y-2"
                        onClick={() => setViewingResource(resource)}
                      >
                        {/* Thumbnail - 4:3 aspect ratio */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                          {resource.thumbnail_url ? (
                            <img 
                              src={resource.thumbnail_url} 
                              alt={resource.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-green-100">
                              <Sparkles className="w-16 h-16 text-emerald-300" />
                            </div>
                          )}
                          
                          {/* Views Count - Bottom Left */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{resource.view_count || 0}</span>
                          </div>
                          
                          {/* Play Button - Bottom Right */}
                          <div className="absolute bottom-3 right-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                              <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-1.5">
                          {/* Category Badge */}
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-semibold text-primary bg-primary/10">
                              {resource.category || resourceTypeLabels[resource.type]}
                            </Badge>
                          </div>
                          
                          {/* Title */}
                          <h3 className="font-bold text-sm leading-tight text-foreground group-hover:text-primary line-clamp-2">
                            {resource.title}
                          </h3>
                          
                          {/* Author */}
                          <p className="text-xs text-muted-foreground">
                            {resource.author_name || 'WellNest'}
                          </p>
                          
                          {/* Price & Type */}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-sm font-bold text-emerald-600">
                              Free
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {resourceTypeLabels[resource.type]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </section>

            {/* Premium Resources Section */}
            <section className="space-y-4">
              <Carousel opts={{ align: "start" }} className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      Premium Resources
                    </h3>
                    <div className="flex items-center gap-2">
                      <CarouselPrevious className="static rounded-sm h-12 w-12 translate-y-0 bg-card dark:bg-card shadow-sm hover:bg-accent dark:hover:bg-accent border-border" />
                      <CarouselNext className="static rounded-sm h-12 w-12 translate-y-0 bg-card dark:bg-card shadow-sm hover:bg-accent dark:hover:bg-accent border-border" />
                    </div>
                  </div>
                </div>
                <CarouselContent className="-ml-4">
                  {resources.filter((r: any) => !r.is_free).slice(0, 12).map((resource: any) => (
                    <CarouselItem key={resource.resource_id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div 
                        className="group cursor-pointer space-y-2"
                        onClick={() => setViewingResource(resource)}
                      >
                        {/* Thumbnail - 4:3 aspect ratio */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border-2 border-amber-200">
                          {resource.thumbnail_url ? (
                            <img 
                              src={resource.thumbnail_url} 
                              alt={resource.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                              <Star className="w-16 h-16 text-amber-300" />
                            </div>
                          )}
                          
                          {/* Views Count - Bottom Left */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{resource.view_count || 0}</span>
                          </div>
                          
                          {/* Play Button - Bottom Right */}
                          <div className="absolute bottom-3 right-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                              <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                          
                          {/* Premium Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-xs shadow-md">
                              ★ Premium
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-1.5">
                          {/* Category Badge */}
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-semibold text-amber-600 bg-amber-100">
                              {resource.category || resourceTypeLabels[resource.type]}
                            </Badge>
                          </div>
                          
                          {/* Title */}
                          <h3 className="font-bold text-sm leading-tight text-foreground group-hover:text-amber-600 line-clamp-2">
                            {resource.title}
                          </h3>
                          
                          {/* Author */}
                          <p className="text-xs text-muted-foreground">
                            {resource.author_name || 'WellNest'}
                          </p>
                          
                          {/* Price & Type */}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-sm font-bold text-amber-600">
                              ${resource.price || '0'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {resourceTypeLabels[resource.type]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </section>

            {/* Type Sections */}
            {['VIDEO', 'AUDIO', 'ARTICLE', 'RESEARCH_PAPER', 'SPECIAL'].map((type) => {
              const typeResources = resources.filter((r: any) => r.type === type);
              if (typeResources.length === 0) return null;

              const typeLabel = resourceTypeLabels[type];
              const TypeIcon = type === 'VIDEO' ? Video : 
                              type === 'AUDIO' ? Music : 
                              type === 'ARTICLE' ? FileText :
                              type === 'RESEARCH_PAPER' ? GraduationCap : Star;
                              
              const typeColor = type === 'VIDEO' ? 'text-blue-600' : 
                               type === 'AUDIO' ? 'text-purple-600' : 
                               type === 'ARTICLE' ? 'text-green-600' :
                               type === 'RESEARCH_PAPER' ? 'text-slate-600' : 'text-orange-600';
                               
              const typeBg = type === 'VIDEO' ? 'bg-blue-100' : 
                            type === 'AUDIO' ? 'bg-purple-100' : 
                            type === 'ARTICLE' ? 'bg-green-100' :
                            type === 'RESEARCH_PAPER' ? 'bg-slate-100' : 'bg-orange-100';

              return (
                <section key={type} className="space-y-4">
                  <Carousel opts={{ align: "start" }} className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", typeBg, typeColor)}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-foreground">{typeLabel}s</h2>
                            <p className="text-sm text-muted-foreground">{typeResources.length} resources available</p>
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
                        onClick={() => setSelectedResourceType(type)}
                      >
                        View All
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>

                    <CarouselContent className="-ml-4">
                      {typeResources.slice(0, 10).map((resource: any) => (
                        <CarouselItem key={resource.resource_id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                          <div 
                            className="group cursor-pointer space-y-2"
                            onClick={() => setViewingResource(resource)}
                          >
                            {/* Thumbnail - 4:3 aspect ratio */}
                            <div className={cn(
                              "relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1",
                              typeBg
                            )}>
                              {resource.thumbnail_url ? (
                                <img 
                                  src={resource.thumbnail_url} 
                                  alt={resource.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <TypeIcon className={cn("w-16 h-16", typeColor)} />
                                </div>
                              )}
                              
                              {/* Views Count - Bottom Left */}
                              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                                <Eye className="w-3.5 h-3.5" />
                                <span>{resource.view_count || 0}</span>
                              </div>
                              
                              {/* Play Button - Bottom Right */}
                              <div className="absolute bottom-3 right-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                                  type === 'VIDEO' ? 'bg-blue-600' : 
                                  type === 'AUDIO' ? 'bg-purple-600' : 
                                  type === 'ARTICLE' ? 'bg-green-600' :
                                  type === 'RESEARCH_PAPER' ? 'bg-slate-600' : 'bg-orange-600'
                                )}>
                                  <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                                </div>
                              </div>
                              
                              {/* Type Badge */}
                              <div className="absolute top-3 left-3">
                                <Badge className={cn("text-white font-semibold text-xs shadow-md", 
                                  type === 'VIDEO' ? 'bg-blue-600' : 
                                  type === 'AUDIO' ? 'bg-purple-600' : 
                                  type === 'ARTICLE' ? 'bg-green-600' :
                                  type === 'RESEARCH_PAPER' ? 'bg-slate-600' : 'bg-orange-600'
                                )}>
                                  {typeLabel}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="space-y-1.5">
                              {/* Category Badge */}
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className={cn("text-[10px] px-2 py-0 h-5 font-semibold", typeColor, typeBg)}>
                                  {resource.category || typeLabel}
                                </Badge>
                              </div>
                              
                              {/* Title */}
                              <h3 className={cn("font-bold text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary")}>
                                {resource.title}
                              </h3>
                              
                              {/* Author */}
                              <p className="text-xs text-muted-foreground">
                                {resource.author_name || 'WellNest'}
                              </p>
                              
                              {/* Price & Type */}
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                  {resource.is_free ? 'Free' : `$${resource.price || 0}`}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {typeLabel}
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
          /* Drill-down View */
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSelectedResourceType(null);
                  setViewAllType(null);
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="group hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Browse
              </Button>
              <div className="h-8 w-px bg-border" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                {selectedResourceType === 'VIDEO' && <Video className="w-6 h-6 text-blue-500" />}
                {selectedResourceType === 'AUDIO' && <Music className="w-6 h-6 text-purple-500" />}
                {selectedResourceType === 'ARTICLE' && <FileText className="w-6 h-6 text-green-500" />}
                {selectedResourceType === 'RESEARCH_PAPER' && <GraduationCap className="w-6 h-6 text-slate-500" />}
                {selectedResourceType === 'SPECIAL' && <Star className="w-6 h-6 text-orange-500" />}
                {viewAllType === 'featured' && <Sparkles className="w-6 h-6 text-amber-500" />}
                
                {selectedResourceType ? resourceTypeLabels[selectedResourceType] : 
                 viewAllType === 'featured' ? 'Featured' : ''} Resources
              </h2>
              <Badge variant="secondary" className="ml-2">
                {filteredResources.length} Resources
              </Badge>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <div className="flex gap-2">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Search resources...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>

                {/* Category Filter */}
                <div className="w-[180px] shrink-0">
                  <Select
                    value={selectedCategory || "all"}
                    onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="h-10 w-full">
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
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource: any, index: number) => (
                  <div
                    key={resource.resource_id}
                    className="group cursor-pointer space-y-2"
                    onClick={() => setViewingResource(resource)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Thumbnail - 4:3 aspect ratio */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                      {resource.thumbnail_url ? (
                        <img 
                          src={resource.thumbnail_url} 
                          alt={resource.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={cn(
                          "flex h-full w-full items-center justify-center",
                          resource.type === 'VIDEO' && "bg-blue-50",
                          resource.type === 'AUDIO' && "bg-purple-50",
                          resource.type === 'ARTICLE' && "bg-green-50",
                          resource.type === 'RESEARCH_PAPER' && "bg-slate-50",
                          resource.type === 'SPECIAL' && "bg-orange-50",
                        )}>
                          {resource.type === 'VIDEO' && <Video className="w-12 h-12 text-blue-300" />}
                          {resource.type === 'AUDIO' && <Music className="w-12 h-12 text-purple-300" />}
                          {resource.type === 'ARTICLE' && <FileText className="w-12 h-12 text-green-300" />}
                          {resource.type === 'RESEARCH_PAPER' && <GraduationCap className="w-12 h-12 text-slate-300" />}
                          {resource.type === 'SPECIAL' && <Star className="w-12 h-12 text-orange-300" />}
                        </div>
                      )}
                      
                      {/* Views Count - Bottom Left */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{resource.view_count || 0}</span>
                      </div>
                      
                      {/* Play Button - Bottom Right */}
                      <div className="absolute bottom-3 right-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                          resource.type === 'VIDEO' ? 'bg-blue-600' : 
                          resource.type === 'AUDIO' ? 'bg-purple-600' : 
                          resource.type === 'ARTICLE' ? 'bg-green-600' :
                          resource.type === 'RESEARCH_PAPER' ? 'bg-slate-600' : 'bg-orange-600'
                        )}>
                          <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                      
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={cn("text-white font-semibold text-xs shadow-md", 
                          resource.type === 'VIDEO' ? 'bg-blue-600' : 
                          resource.type === 'AUDIO' ? 'bg-purple-600' : 
                          resource.type === 'ARTICLE' ? 'bg-green-600' :
                          resource.type === 'RESEARCH_PAPER' ? 'bg-slate-600' : 'bg-orange-600'
                        )}>
                          {resourceTypeLabels[resource.type]}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                      {/* Category Badge */}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-semibold text-primary bg-primary/10">
                          {resource.category || resourceTypeLabels[resource.type]}
                        </Badge>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-bold text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary">
                        {resource.title}
                      </h3>
                      
                      {/* Author */}
                      <p className="text-xs text-muted-foreground">
                        {resource.author_name || 'WellNest'}
                      </p>
                      
                      {/* Price & Type */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {resource.is_free ? 'Free' : `$${resource.price || 0}`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {resourceTypeLabels[resource.type]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No resources found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search or filters.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Resource Detail Modal - Enhanced */}
      {viewingResource && (
        <Dialog open={!!viewingResource} onOpenChange={() => setViewingResource(null)}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-4">
            <DialogHeader className="border-b pb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{viewingResource.title}</DialogTitle>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    <Badge className={`${resourceTypeColors[viewingResource.type]} font-semibold`}>
                      {resourceTypeLabels[viewingResource.type]}
                    </Badge>
                    {viewingResource.category && (
                      <Badge variant="secondary" className="capitalize">
                        {viewingResource.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 mt-4 animate-in fade-in duration-500">
              {/* Description */}
              {viewingResource.description && (
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-muted/50 p-3">
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">{viewingResource.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Author & Date */}
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r from-background to-muted/50 p-3">
                  <CardTitle className="text-base">Information</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-semibold">Author:</span>
                    <span className="text-muted-foreground">{viewingResource.author_name || 'WellNest'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-semibold">Published:</span>
                    <span className="text-muted-foreground">
                      {new Date(viewingResource.posted_date || viewingResource.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {viewingResource.tags && viewingResource.tags.length > 0 && (
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-muted/50 p-3">
                    <CardTitle className="text-base">Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex gap-2 flex-wrap">
                      {viewingResource.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Content Display */}
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r from-background to-muted/50 p-3">
                  <CardTitle className="text-base">Content</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="rounded-xl overflow-hidden border-2 border-border shadow-lg bg-background min-h-[500px]">
                    {(viewingResource.type === 'VIDEO' || viewingResource.type === 'video') && viewingResource.video_url && (
                      <CustomYouTubePlayer
                        url={viewingResource.video_url}
                        thumbnailUrl={viewingResource.thumbnail_url}
                        title={viewingResource.title}
                        className="h-[500px] w-full"
                      />
                    )}

                    {(viewingResource.type === 'AUDIO' || viewingResource.type === 'audio') && viewingResource.audio_url && (
                      <div className="flex flex-col items-center justify-center h-[500px] space-y-6 p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                          <Music className="h-16 w-16 text-white" />
                        </div>
                        <audio
                          controls
                          className="w-full max-w-2xl h-16 rounded-xl shadow-lg"
                          src={viewingResource.audio_url}
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}

                    {(viewingResource.type === 'ARTICLE' || viewingResource.type === 'article' || viewingResource.type === 'RESEARCH_PAPER' || viewingResource.type === 'SPECIAL') && viewingResource.article_url && (
                      <div className="flex flex-col items-center justify-center h-[500px] p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                        <div className="max-w-2xl text-center space-y-6">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto shadow-2xl">
                            {viewingResource.type === 'RESEARCH_PAPER' ? (
                              <GraduationCap className="w-12 h-12 text-white" />
                            ) : (
                              <FileText className="w-12 h-12 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">{viewingResource.title}</h3>
                            {viewingResource.description && (
                              <p className="text-muted-foreground mb-4">{viewingResource.description}</p>
                            )}
                            {viewingResource.category && (
                              <Badge className="mb-4">{viewingResource.category}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Click the button below to read the full {viewingResource.type === 'RESEARCH_PAPER' ? 'research paper' : 'article'} in a new tab.
                          </p>
                          <Button
                            size="lg"
                            onClick={() => window.open(viewingResource.article_url, '_blank')}
                            className="shadow-lg"
                          >
                            <ExternalLink className="mr-2 h-5 w-5" />
                            Open {viewingResource.type === 'RESEARCH_PAPER' ? 'Research Paper' : 'Article'}
                          </Button>
                          <div className="pt-4 border-t border-border/50">
                            <p className="text-xs text-muted-foreground">
                              Source: {new URL(viewingResource.article_url).hostname}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Button */}
              <div className="flex gap-3">
                <Button
                  variant="default"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    const url = viewingResource.video_url || viewingResource.audio_url || viewingResource.article_url;
                    if (url) window.open(url, '_blank');
                  }}
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
