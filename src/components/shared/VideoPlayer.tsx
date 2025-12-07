import { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  url: string;
  thumbnailUrl?: string;
  title: string;
  className?: string;
}

export function VideoPlayer({ url, thumbnailUrl, title, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }
    
    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    
    return null;
  };

  const embedUrl = getEmbedUrl(url);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(true);
  };

  return (
    <div className={cn("relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10", className)}>
      {!isPlaying ? (
        <div className="group relative w-full h-full cursor-pointer" onClick={handlePlay}>
          {/* Thumbnail */}
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
              <Play className="w-20 h-20 text-white/20" />
            </div>
          )}

          {/* YouTube-style Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

          {/* YouTube-style Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative group/btn">
              <div className="w-[68px] h-[48px] bg-[#FF0000] rounded-[12px] flex items-center justify-center transition-transform duration-200 group-hover/btn:scale-110 shadow-lg">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
          </div>

          {/* Title Overlay */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
            <h3 className="text-white font-medium text-lg md:text-xl line-clamp-1 drop-shadow-md pr-12">
              {title}
            </h3>
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-0">
              <Loader2 className="w-10 h-10 text-[#FF0000] animate-spin" />
            </div>
          )}
          
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full absolute inset-0 z-10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <video 
              src={url} 
              controls 
              autoPlay 
              className="w-full h-full"
              onLoadedData={() => setIsLoading(false)}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
    </div>
  );
}
