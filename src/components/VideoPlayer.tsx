import React from 'react';
import { Platform } from '../types';
import { convertGoogleDriveUrl } from '../utils';

interface VideoPlayerProps {
  url: string;
  platform: Platform;
  title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, platform, title }) => {
  const finalUrl = convertGoogleDriveUrl(url);
  
  // Extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Extract Vimeo ID
  const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Extract TikTok ID
  const getTikTokId = (url: string) => {
    const regExp = /tiktok\.com\/.*\/video\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  if (platform === 'youtube') {
    const id = getYoutubeId(finalUrl);
    const isShorts = finalUrl.includes('/shorts/');
    
    if (id) {
      return (
        <div className={`w-full ${isShorts ? 'max-w-[400px] mx-auto aspect-[9/16]' : 'aspect-video'} rounded-lg overflow-hidden`}>
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
  }

  if (platform === 'vimeo') {
    const id = getVimeoId(finalUrl);
    if (id) {
      return (
        <iframe
          className="w-full aspect-video rounded-lg"
          src={`https://player.vimeo.com/video/${id}?autoplay=1`}
          title={title}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }
  }

  if (platform === 'tiktok') {
    const id = getTikTokId(finalUrl);
    if (id) {
      return (
        <div className="w-full max-w-[400px] mx-auto aspect-[9/16] rounded-lg overflow-hidden bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.tiktok.com/embed/v2/${id}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    // Fallback if ID extraction fails (e.g. shortened URL)
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-900 rounded-lg text-center">
        <p className="mb-4 text-zinc-400">틱톡의 직접 임베드가 제한된 형식이거나 단축 URL입니다. 해당 플랫폼에서 직접 확인해주세요.</p>
        <a 
          href={finalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors"
        >
          틱톡에서 보기
        </a>
      </div>
    );
  }

  if (platform === 'drive') {
    return (
      <video
        className="w-full rounded-lg"
        controls
        autoPlay
        src={finalUrl}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  if (platform === 'instagram') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-900 rounded-lg text-center">
        <p className="mb-4 text-zinc-400">{platform}의 직접 임베드는 제한되어 있습니다. 해당 플랫폼에서 직접 확인해주세요.</p>
        <a 
          href={finalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors"
        >
          {platform}에서 보기
        </a>
      </div>
    );
  }

  return (
    <div className="p-8 bg-zinc-900 rounded-lg text-center">
      <p className="text-zinc-400">지원하지 않는 플랫폼이거나 유효하지 않은 URL입니다.</p>
    </div>
  );
};
