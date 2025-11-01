import { useState } from "react";
import { Book, Download, Search, Filter, Star, ExternalLink, Video, Music, FileText, Trash2, Eye, X, Plus, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ResourceModal } from "@/components/modals/ResourceModal";
import { useAuth } from "@/contexts/AuthContext";
import { useResources, useResourceCategories, useResourceStats, useDeleteResource, useCreateResource, useUpdateResource } from "@/hooks/useResources";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [viewingResource, setViewingResource] = useState<any>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  
  // Fetch resources
  const { data: resources = [], isLoading } = useResources({
    school_id: user?.school_id,
    category: selectedCategory || undefined,
    type: selectedType || undefined,
    search: searchTerm || undefined,
    status: 'PUBLISHED',
    include_global: true
  });

  // Fetch categories
  const { data: categoriesData = [] } = useResourceCategories({
    school_id: user?.school_id,
    include_global: true
  });

  // Fetch stats
  const { data: stats } = useResourceStats({
    school_id: user?.school_id,
    include_global: true
  });

  // Mutations
  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const deleteResource = useDeleteResource();

  const handleCreateResource = (resourceData: any) => {
    createResource.mutate({
      ...resourceData,
      author_id: user?.id,
      author_name: (user as any)?.display_name || user?.email || 'Unknown',
      school_id: user?.school_id
    });
    setShowResourceModal(false);
  };

  const handleUpdateResource = (resourceData: any) => {
    if (editingResource) {
      updateResource.mutate({
        id: editingResource.resource_id,
        data: resourceData
      });
      setEditingResource(null);
      setShowResourceModal(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteResource.mutate(id);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground">Access intervention guides and support materials</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Resources"
          value={stats?.total_resources?.toString() || '0'}
          icon={Book}
        />
        <StatCard
          title="Videos"
          value={stats?.by_type?.videos?.toString() || '0'}
          icon={Video}
        />
        <StatCard
          title="Audio"
          value={stats?.by_type?.audio?.toString() || '0'}
          icon={Music}
          variant="success"
        />
        <StatCard
          title="Articles"
          value={stats?.by_type?.articles?.toString() || '0'}
          icon={FileText}
          variant="warning"
        />
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          {/* Type Filter */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Type</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedType === '' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType('')}
              >
                All Types
              </Button>
              <Button
                variant={selectedType === 'VIDEO' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType('VIDEO')}
              >
                <Video className="h-4 w-4 mr-2" />
                Videos
              </Button>
              <Button
                variant={selectedType === 'audio' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType('audio')}
              >
                <Music className="h-4 w-4 mr-2" />
                Audio
              </Button>
              <Button
                variant={selectedType === 'article' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType('article')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Articles
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <p className="text-sm font-medium mb-2">Category</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === '' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
              {categoriesData.map((cat: any) => (
                <Button
                  key={cat.category}
                  variant={selectedCategory === cat.category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.category)}
                  className="capitalize"
                >
                  {cat.category} ({cat.count})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Loading resources...</p>
          </CardContent>
        </Card>
      ) : resources.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource: any) => (
            <Card key={resource.resource_id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(resource.type)}
                  </div>
                </div>
                <CardDescription className="line-clamp-3">
                  {resource.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getTypeColor(resource.type)}>
                    {resource.type}
                  </Badge>
                  {resource.category && (
                    <Badge variant="outline" className="capitalize">
                      {resource.category}
                    </Badge>
                  )}
                </div>
                
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {resource.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{resource.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>Posted: {new Date(resource.posted_date || resource.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  {(resource.video_url || resource.audio_url || resource.article_url) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setViewingResource(resource)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  )}
                  {user?.school_id === resource.school_id && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingResource(resource);
                          setShowResourceModal(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(resource.resource_id, resource.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No resources found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Resource Detail View Modal */}
      <Dialog open={!!viewingResource} onOpenChange={(open) => !open && setViewingResource(null)}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingResource?.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getTypeColor(viewingResource?.type)}>
                {viewingResource?.type}
              </Badge>
              {viewingResource?.category && (
                <Badge variant="outline">{viewingResource.category}</Badge>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {viewingResource?.type === 'VIDEO' && viewingResource?.video_url && (
              <iframe
                src={getEmbedUrl(viewingResource.video_url)}
                className="w-full h-full rounded-lg border"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={viewingResource.title}
              />
            )}

            {viewingResource?.type === 'audio' && viewingResource?.audio_url && (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Music className="h-24 w-24 text-muted-foreground" />
                <audio
                  controls
                  className="w-full max-w-2xl"
                  src={viewingResource.audio_url}
                >
                  Your browser does not support the audio element.
                </audio>
                {viewingResource.description && (
                  <div className="max-w-2xl w-full p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{viewingResource.description}</p>
                  </div>
                )}
              </div>
            )}

            {viewingResource?.type === 'article' && viewingResource?.article_url && (
              <iframe
                src={viewingResource.article_url}
                className="w-full h-full rounded-lg border"
                title={viewingResource.title}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            )}
          </div>

          <div className="border-t pt-4 space-y-3">
            {viewingResource?.description && (
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{viewingResource.description}</p>
              </div>
            )}

            {viewingResource?.tags && viewingResource.tags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex gap-2 flex-wrap">
                  {viewingResource.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Posted: {viewingResource?.posted_date ? new Date(viewingResource.posted_date).toLocaleDateString() : 'N/A'}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const url = viewingResource?.video_url || viewingResource?.audio_url || viewingResource?.article_url;
                  if (url) window.open(url, '_blank');
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </Button>
              {user?.school_id === viewingResource?.school_id && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(viewingResource.resource_id, viewingResource.title);
                    setViewingResource(null);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Resource Modal */}
      <ResourceModal
        open={showResourceModal}
        onOpenChange={(open) => {
          setShowResourceModal(open);
          if (!open) setEditingResource(null);
        }}
        onSubmit={editingResource ? handleUpdateResource : handleCreateResource}
        initialData={editingResource}
        isEditing={!!editingResource}
      />
    </div>
  );
}
