import { useState, useMemo } from 'react';
import { Book, Search, ExternalLink, Video, Music, FileText, Eye, Calendar, User, Tag, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useResources, useResourceCategories } from '@/hooks/useResources';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  video: 'Video',
  AUDIO: 'Audio',
  audio: 'Audio',
  ARTICLE: 'Article',
  article: 'Article',
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
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(resource.type);
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [resources, searchQuery, selectedTypes, selectedCategory]);

  const uniqueCategories = useMemo(() => 
    categoriesData.map((c: any) => c.category).filter(Boolean), 
  [categoriesData]);

  const uniqueTypes = useMemo(() => 
    Array.from(new Set(resources.map((r: any) => r.type))).filter(Boolean) as string[], 
  [resources]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header with modern design */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Book className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Resource Library
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground ml-13">Discover intervention guides, videos, and support materials</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedCategory ? (
        <div className="space-y-12">
          {/* Category Sections - Each category gets its own section */}
          {uniqueCategories.map((category: string, catIndex: number) => {
            const categoryResources = resources.filter((r: any) => r.category === category);
            
            if (categoryResources.length === 0) return null;
            
            return (
              <section key={category} className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-3xl -z-10" />
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border-2 border-primary/10 shadow-xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                        <Book className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent capitalize">{category}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{categoryResources.length} resources available</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCategory(category)}
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
                      {categoryResources.slice(0, 12).map((resource: any) => (
                        <CarouselItem key={resource.resource_id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                          <Card 
                            className="cursor-pointer transition-colors duration-300 hover:border-primary border-2 group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 h-full"
                            onClick={() => setViewingResource(resource)}
                          >
                            <CardContent className="flex flex-col p-6 h-full">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="text-base font-bold line-clamp-2 flex-1">{resource.title}</h3>
                                  <Badge className={`${resourceTypeColors[resource.type] || 'bg-gray-100 text-gray-800'} text-xs shrink-0`}>
                                    {resourceTypeLabels[resource.type] || resource.type}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  {resource.description || 'No description available'}
                                </p>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <User className="w-3 h-3" />
                                  <span className="truncate">{resource.author_name || 'WellNest'}</span>
                                </div>
                                
                                <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:border-primary transition-colors">
                                  <Eye className="w-3 h-3 mr-2" />
                                  View Resource
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0 -translate-x-1/2 shadow-lg border-2 border-primary/20 bg-white/95 w-12 h-12" />
                    <CarouselNext className="right-0 translate-x-1/2 shadow-lg border-2 border-primary/20 bg-white/95 w-12 h-12" />
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
                setSelectedCategory(null);
                setSearchQuery("");
              }}
              className="group hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Categories
            </Button>
            <div className="h-8 w-px bg-gray-200" />
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {selectedCategory} Resources
            </h2>
            <Badge variant="secondary" className="ml-2">
              {filteredResources.length} Resources
            </Badge>
          </div>

          {/* Filter Bar */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-white border-gray-200 focus:border-primary rounded-xl"
                />
              </div>

              {/* Resource Type Filter */}
              <div className="w-full md:w-56">
                <Select
                  value={selectedTypes.length > 0 ? selectedTypes[0] : "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedTypes([]);
                    } else {
                      setSelectedTypes([value]);
                    }
                  }}
                >
                  <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:border-primary">
                    <SelectValue placeholder="Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {resourceTypeLabels[type] || type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedTypes.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTypes([]);
                  }}
                  className="h-10 px-4 rounded-xl"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource: any, index: number) => (
                <Card
                  key={resource.resource_id}
                  className="card-professional cursor-pointer hover:shadow-xl transition-all duration-300 border-2"
                  onClick={() => setViewingResource(resource)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <CardTitle className="text-lg font-bold line-clamp-2">{resource.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${resourceTypeColors[resource.type] || 'bg-gray-100 text-gray-800'} font-semibold`}>
                        {resourceTypeLabels[resource.type] || resource.type}
                      </Badge>
                      {resource.category && (
                        <Badge variant="secondary" className="capitalize">
                          {resource.category}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Separator />
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {resource.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{resource.author_name || 'WellNest'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(resource.posted_date || resource.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>

                    <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:border-primary transition-colors">
                      <Eye className="w-3 h-3 mr-2" />
                      View Resource
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card className="card-professional shadow-lg">
                  <CardContent className="text-center py-12">
                    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Book className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-base text-muted-foreground font-semibold mb-2">
                      No resources found
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

      {/* Resource Detail Modal - Enhanced */}
      {viewingResource && (
        <Dialog open={!!viewingResource} onOpenChange={() => setViewingResource(null)}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{viewingResource.title}</DialogTitle>
                  <DialogDescription className="mt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${resourceTypeColors[viewingResource.type]} font-semibold`}>
                        {resourceTypeLabels[viewingResource.type]}
                      </Badge>
                      {viewingResource.category && (
                        <Badge variant="secondary" className="capitalize">
                          {viewingResource.category}
                        </Badge>
                      )}
                    </div>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4 animate-in fade-in duration-500">
              {/* Description */}
              {viewingResource.description && (
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{viewingResource.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Author & Date */}
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                  <CardTitle className="text-base">Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
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
                  <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                    <CardTitle className="text-base">Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
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
                <CardHeader className="bg-gradient-to-r from-background to-muted/20">
                  <CardTitle className="text-base">Content</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="rounded-xl overflow-hidden border-2 border-border shadow-lg bg-background min-h-[500px]">
                    {(viewingResource.type === 'VIDEO' || viewingResource.type === 'video') && viewingResource.video_url && (
                      <iframe
                        src={getEmbedUrl(viewingResource.video_url)}
                        className="w-full h-[500px]"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={viewingResource.title}
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

                    {(viewingResource.type === 'ARTICLE' || viewingResource.type === 'article') && viewingResource.article_url && (
                      <iframe
                        src={viewingResource.article_url}
                        className="w-full h-[500px]"
                        title={viewingResource.title}
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                      />
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
