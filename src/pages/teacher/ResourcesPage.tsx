import { useState, useMemo } from "react";
import { Book, Search, Filter, ExternalLink, Video, Music, FileText, Eye, Calendar, User, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FilterSection } from "@/components/shared/FilterSection";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useAuth } from "@/contexts/AuthContext";
import { useResources, useResourceCategories } from "@/hooks/useResources";

// Helper function to convert YouTube/Vimeo URLs to embed format
const getEmbedUrl = (url: string): string => {
  if (!url) return url;
  
  // YouTube URL patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  
  // Vimeo URL patterns
  const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  return url;
};

export default function ResourcesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [viewingResource, setViewingResource] = useState<any>(null);
  
  // Fetch resources with filtering
  const { data: allResources = [], isLoading } = useResources({
    school_id: user?.school_id,
    status: 'PUBLISHED',
    include_global: true
  });

  // Client-side filtering
  const resources = useMemo(() => {
    return allResources.filter((resource: any) => {
      const matchesSearch = !searchTerm || 
        resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategories.length === 0 || (resource.category && selectedCategories.includes(resource.category));
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(resource.type?.toUpperCase());
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [allResources, searchTerm, selectedCategories, selectedTypes]);

  // Fetch categories and extract unique ones
  const { data: categoriesData = [] } = useResourceCategories({
    school_id: user?.school_id,
    include_global: true
  });

  const uniqueCategories = useMemo(() => {
    return categoriesData.map((cat: any) => cat.category).sort();
  }, [categoriesData]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
      case 'VIDEO':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
      case 'VIDEO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'audio':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'article':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 relative">
      <AnimatedBackground />
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
            <p className="text-base md:text-lg text-muted-foreground ml-13">
              Discover intervention guides, videos, and support materials
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-gray-900">Filters</h3>
            </div>
            
            <FilterSection 
              title="Type" 
              options={['VIDEO', 'audio', 'article']} 
              selected={selectedTypes} 
              setSelected={setSelectedTypes} 
            />

            {uniqueCategories.length > 0 && (
              <div className="mt-6">
                <FilterSection 
                  title="Category" 
                  options={uniqueCategories} 
                  selected={selectedCategories} 
                  setSelected={setSelectedCategories} 
                />
              </div>
            )}

            <Button 
              variant="outline" 
              className="w-full mt-6 text-gray-500 hover:text-primary border-dashed"
              onClick={() => {
                setSelectedTypes([]);
                setSelectedCategories([]);
                setSearchTerm('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-white border-gray-200 focus:border-primary rounded-xl"
            />
          </div>

          {/* Resources Grid */}
          {isLoading ? (
            <Card className="border-2">
              <CardContent className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground font-medium">Loading resources...</p>
              </CardContent>
            </Card>
          ) : resources.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Browse Resources</h2>
                <Badge variant="secondary" className="text-sm">
                  {resources.length} {resources.length === 1 ? 'Resource' : 'Resources'}
                </Badge>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resources.map((resource: any, index) => {
              const getSpineColor = (type: string) => {
                switch (type) {
                  case 'VIDEO':
                  case 'video':
                    return 'bg-gradient-to-b from-blue-600 to-blue-800';
                  case 'audio':
                    return 'bg-gradient-to-b from-purple-600 to-purple-800';
                  case 'article':
                    return 'bg-gradient-to-b from-green-600 to-green-800';
                  default:
                    return 'bg-gradient-to-b from-gray-600 to-gray-800';
                }
              };

              return (
                <div
                  key={resource.resource_id}
                  className="group cursor-pointer"
                  onClick={() => setViewingResource(resource)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card Container */}
                  <div className="relative h-96 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    {/* Card */}
                    <Card className="h-full border-2 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 group-hover:shadow-3xl bg-gradient-to-br from-background to-muted/30">
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-primary/50" />
                      </div>

                      <div className="relative h-full flex flex-col p-5">
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className={`${getTypeColor(resource.type)} text-xs shadow-lg`}>
                            {resource.type}
                          </Badge>
                        </div>

                        <div className="flex-1 flex flex-col justify-center mb-4 pr-8">
                          <h3 className="text-lg font-bold leading-tight mb-3 line-clamp-3 group-hover:text-primary transition-colors">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                            {resource.description || 'No description available'}
                          </p>
                        </div>

                        {resource.category && (
                          <div className="mb-3">
                            <Badge variant="secondary" className="capitalize text-xs font-semibold">
                              {resource.category}
                            </Badge>
                          </div>
                        )}

                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap mb-3">
                            {resource.tags.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                                #{tag}
                              </Badge>
                            ))}
                            {resource.tags.length > 3 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                +{resource.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="border-t pt-3 mt-auto space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span className="font-medium truncate">{resource.author_name || 'WellNest'}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(resource.posted_date || resource.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          </div>

                          <div className="flex gap-1.5 pt-2">
                            {(resource.video_url || resource.audio_url || resource.article_url) && (
                              <Button
                                size="sm"
                                variant="default"
                                className="flex-1 h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingResource(resource);
                                }}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                Open
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                    </Card>

                    <div className="absolute -bottom-2 left-2 right-2 h-2 bg-black/20 blur-md rounded-full transform group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || selectedTypes.length > 0 || selectedCategories.length > 0
                ? 'No resources found matching your criteria'
                : 'No resources available'}
            </p>
          </CardContent>
        </Card>
      )}
        </div>
      </div>

      {/* Resource Detail View Modal - Open Book Style */}
      <Dialog open={!!viewingResource} onOpenChange={(open) => !open && setViewingResource(null)}>
        <DialogContent className="max-w-[95vw] h-[95vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
          <div className="flex-1 flex overflow-hidden">
            {/* Left Page - Book Info */}
            <div className="w-1/3 border-r-4 border-border flex flex-col bg-gradient-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden shadow-2xl">
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-r from-transparent via-muted/30 to-muted/50" />
              <div className="absolute right-0 top-0 bottom-0 w-px bg-border" />
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="space-y-4">
                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl mx-auto ${
                    viewingResource?.type === 'VIDEO' || viewingResource?.type === 'video'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
                      : viewingResource?.type === 'audio'
                      ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                      : 'bg-gradient-to-br from-green-500 to-green-700'
                  }`}>
                    {(viewingResource?.type === 'VIDEO' || viewingResource?.type === 'video') && <Video className="w-12 h-12 text-white" />}
                    {viewingResource?.type === 'audio' && <Music className="w-12 h-12 text-white" />}
                    {viewingResource?.type === 'article' && <FileText className="w-12 h-12 text-white" />}
                  </div>

                  <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold leading-tight text-foreground">
                      {viewingResource?.title}
                    </h2>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <Badge className={`text-sm shadow-md ${
                        viewingResource?.type === 'VIDEO' || viewingResource?.type === 'video'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : viewingResource?.type === 'audio'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}>
                        {viewingResource?.type}
                      </Badge>
                      {viewingResource?.category && (
                        <Badge variant="secondary" className="text-sm capitalize font-semibold shadow-md">
                          {viewingResource.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-border" />

                {viewingResource?.description && (
                  <div className="space-y-3 bg-muted/50 p-4 rounded-lg border border-border">
                    <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                      <Book className="w-5 h-5 text-primary" />
                      About
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {viewingResource.description}
                    </p>
                  </div>
                )}

                <div className="space-y-3 bg-muted/50 p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">Author:</span>
                    <span className="text-muted-foreground">{viewingResource?.author_name || 'WellNest'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">Published:</span>
                    <span className="text-muted-foreground">
                      {viewingResource?.posted_date 
                        ? new Date(viewingResource.posted_date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {viewingResource?.tags && viewingResource.tags.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
                      <Tag className="w-4 h-4 text-primary" />
                      Tags
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {viewingResource.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center text-xs font-medium text-muted-foreground pt-4 border-t border-border">
                  — Page 1 —
                </div>
              </div>
            </div>

            {/* Right Page - Content Display */}
            <div className="flex-1 flex flex-col bg-gradient-to-br from-muted/20 via-background to-muted/30 relative shadow-2xl">
              <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,currentColor_2px,currentColor_3px)]" />
              
              <div className="flex-1 overflow-hidden p-8">
                <div className="h-full rounded-xl overflow-hidden border-2 border-border shadow-2xl bg-background">
                  {(viewingResource?.type === 'VIDEO' || viewingResource?.type === 'video') && viewingResource?.video_url && (
                    <iframe
                      src={getEmbedUrl(viewingResource.video_url)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={viewingResource.title}
                    />
                  )}

                  {viewingResource?.type === 'audio' && viewingResource?.audio_url && (
                    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
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

                  {viewingResource?.type === 'article' && viewingResource?.article_url && (
                    <iframe
                      src={viewingResource.article_url}
                      className="w-full h-full"
                      title={viewingResource.title}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                  )}
                </div>

                <div className="text-center text-xs font-medium text-muted-foreground pt-4 border-t border-border">
                  — Page 2 —
                </div>
              </div>

              <div className="border-t-2 border-border bg-muted/30 p-6">
                <div className="flex gap-3">
                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
                    onClick={() => {
                      const url = viewingResource?.video_url || viewingResource?.audio_url || viewingResource?.article_url;
                      if (url) window.open(url, '_blank');
                    }}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
