import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Video, Music, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (resourceData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

export function ResourceModal({ open, onOpenChange, onSubmit, initialData, isEditing = false }: ResourceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    tags: '',
    target_audience: '',
    video_url: '',
    audio_url: '',
    article_url: '',
    thumbnail_url: '',
    status: 'PUBLISHED'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        type: initialData.type || '',
        category: initialData.category || '',
        tags: initialData.tags?.join(', ') || '',
        target_audience: initialData.target_audience?.join(', ') || '',
        video_url: initialData.video_url || '',
        audio_url: initialData.audio_url || '',
        article_url: initialData.article_url || '',
        thumbnail_url: initialData.thumbnail_url || '',
        status: initialData.status || 'PUBLISHED'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: '',
        category: '',
        tags: '',
        target_audience: '',
        video_url: '',
        audio_url: '',
        article_url: '',
        thumbnail_url: '',
        status: 'PUBLISHED'
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const resourceData = {
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type,
      category: formData.category || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      target_audience: formData.target_audience ? formData.target_audience.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      video_url: formData.type === 'VIDEO' ? formData.video_url : undefined,
      audio_url: formData.type === 'AUDIO' ? formData.audio_url : undefined,
      article_url: formData.type === 'ARTICLE' ? formData.article_url : undefined,
      thumbnail_url: formData.thumbnail_url || undefined,
      status: formData.status
    };

    onSubmit(resourceData);
    onOpenChange(false);
  };

  const getUrlField = () => {
    switch (formData.type) {
      case 'VIDEO':
        return (
          <div className="space-y-2">
            <Label htmlFor="video_url">Video URL *</Label>
            <Input
              id="video_url"
              placeholder="https://www.youtube.com/embed/..."
              value={formData.video_url}
              onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use YouTube embed URL or direct video link
            </p>
          </div>
        );
      case 'AUDIO':
        return (
          <div className="space-y-2">
            <Label htmlFor="audio_url">Audio URL *</Label>
            <Input
              id="audio_url"
              placeholder="https://example.com/audio.mp3"
              value={formData.audio_url}
              onChange={(e) => setFormData({...formData, audio_url: e.target.value})}
              required
            />
            <p className="text-xs text-muted-foreground">
              Direct link to audio file (MP3, WAV, etc.)
            </p>
          </div>
        );
      case 'ARTICLE':
        return (
          <div className="space-y-2">
            <Label htmlFor="article_url">Article URL *</Label>
            <Input
              id="article_url"
              placeholder="https://example.com/article"
              value={formData.article_url}
              onChange={(e) => setFormData({...formData, article_url: e.target.value})}
              required
            />
            <p className="text-xs text-muted-foreground">
              Link to article or document
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {isEditing ? 'Edit Resource' : 'Add New Resource'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update resource information' : 'Add a new educational resource for counsellors and students'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Anxiety Management Techniques"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the resource..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Resource Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video
                    </div>
                  </SelectItem>
                  <SelectItem value="AUDIO">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Audio
                    </div>
                  </SelectItem>
                  <SelectItem value="ARTICLE">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Article
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., anxiety, depression"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
          </div>

          {getUrlField()}
          
          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL (Optional)</Label>
            <Input
              id="thumbnail_url"
              placeholder="https://example.com/thumbnail.jpg"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., coping skills, mindfulness, CBT"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target_audience">Target Audience (comma-separated)</Label>
            <Input
              id="target_audience"
              placeholder="e.g., students, parents, teachers"
              value={formData.target_audience}
              onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
              {isEditing ? 'Update Resource' : 'Add Resource'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
