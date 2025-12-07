import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-youtube';
import { cn } from '@/lib/utils';

interface VideoJSPlayerProps {
  url: string;
  thumbnailUrl?: string;
  title?: string;
  className?: string;
  options?: any;
}

export const VideoJSPlayer = ({ url, thumbnailUrl, title, className, options }: VideoJSPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered');
      
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      const defaultOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        poster: thumbnailUrl,
        sources: [{
          src: url,
          type: url.includes('youtube.com') || url.includes('youtu.be') ? 'video/youtube' : 'video/mp4'
        }],
        techOrder: ['youtube', 'html5'],
        youtube: {
          iv_load_policy: 1,
          modestbranding: 1
        },
        ...options
      };

      playerRef.current = videojs(videoElement, defaultOptions, () => {
        videojs.log('player is ready');
        const player = playerRef.current;

        player.on('waiting', () => {
          videojs.log('player is waiting');
        });

        player.on('dispose', () => {
          videojs.log('player will dispose');
        });
      });
    } else {
      const player = playerRef.current;
      player.src({
        src: url,
        type: url.includes('youtube.com') || url.includes('youtu.be') ? 'video/youtube' : 'video/mp4'
      });
      if (thumbnailUrl) {
        player.poster(thumbnailUrl);
      }
    }
  }, [url, thumbnailUrl, options]);

  // Dispose the player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className={cn("rounded-xl overflow-hidden shadow-2xl", className)}>
      <div ref={videoRef} className="w-full h-full" />
      <style>{`
        .video-js {
          width: 100%;
          height: 100%;
          border-radius: 0.75rem; /* rounded-xl */
          overflow: hidden;
        }
        .video-js .vjs-big-play-button {
          background-color: rgba(255, 0, 0, 0.8); /* YouTube Red */
          border: none;
          border-radius: 50%;
          width: 3em;
          height: 3em;
          line-height: 3em;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        }
        .video-js:hover .vjs-big-play-button {
          background-color: rgba(255, 0, 0, 1);
          transform: translate(-50%, -50%) scale(1.1);
        }
        .video-js .vjs-control-bar {
          background-color: rgba(0, 0, 0, 0.7);
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          display: flex !important;
          opacity: 1 !important;
          visibility: visible !important;
          z-index: 20;
        }
        .video-js .vjs-poster {
          background-size: cover;
          border-radius: 0.75rem;
        }
        /* Ensure the control bar is visible on hover and when paused */
        .video-js.vjs-user-inactive.vjs-playing .vjs-control-bar {
          opacity: 0 !important;
          transition: opacity 1s;
        }
        .video-js.vjs-user-active .vjs-control-bar,
        .video-js.vjs-paused .vjs-control-bar {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

export default VideoJSPlayer;
