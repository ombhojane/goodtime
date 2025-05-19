'use client';

import { useState, useEffect } from 'react';
import { Trip } from '../types';
import Button from './Button';
import StoryPlayer from './StoryPlayer';
import VideoExporter from './VideoExporter';
import Icon from './Icon';

interface TripVideoExportProps {
  trip: Trip;
}

export default function TripVideoExport({ trip }: TripVideoExportProps) {
  const [showStoryPlayer, setShowStoryPlayer] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  
  const handleToggleStoryPlayer = () => {
    setShowStoryPlayer(!showStoryPlayer);
  };
  
  const handleStartNewVideo = () => {
    setVideoUrl(null);
    setExportProgress(0);
  };
  
  const handleVideoComplete = (url: string) => {
    setVideoUrl(url);
  };
  
  const handleVideoProgress = (progress: number) => {
    setExportProgress(progress);
  };
  
  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    
    // Create a temporary link to fetch the blob
    const xhr = new XMLHttpRequest();
    xhr.open('GET', videoUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      if (this.status === 200) {
        const blob = this.response;
        const fileExtension = blob.type.includes('mp4') ? 'mp4' : 'webm';
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `${trip.title.replace(/\s+/g, '-').toLowerCase()}-story.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    xhr.send();
  };
  
  const getFirstTripImage = (): string => {
    // First check if there's a banner image
    if (trip.bannerImage) {
      return trip.bannerImage;
    }
    
    // Otherwise find the first image in the trip
    for (const day of trip.days) {
      if (day.items.length > 0) {
        const image = day.items.find(item => item.type === 'image');
        if (image && image.src) {
          return image.src;
        }
      }
    }
    
    // Fallback to a default image if none found
    return '/images/default-preview.jpg';
  };
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">Trip Story Video</h3>
          <p className="text-muted-foreground">Create a beautiful video summary of your entire journey</p>
        </div>
        
        {videoUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartNewVideo}
            icon="refresh"
          >
            Create New Video
          </Button>
        )}
      </div>
      
      {/* Video generation or preview */}
      {!videoUrl ? (
        <VideoExporter
          trip={trip}
          onProgress={handleVideoProgress}
          onComplete={handleVideoComplete}
        />
      ) : (
        <div>
          <div className="rounded-lg overflow-hidden bg-black shadow-lg border border-border">
            <video
              src={videoUrl}
              controls
              className="w-full h-full max-h-[500px]"
              poster={getFirstTripImage()}
              playsInline
              autoPlay
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Your video is ready! You can download it or create a new one.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tip: Share this video on social media to showcase your journey
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadVideo}
              icon="download"
            >
              Download Video
            </Button>
          </div>
        </div>
      )}
      
      {/* Story Player Modal - only shown when explicitly requested */}
      {showStoryPlayer && (
        <StoryPlayer
          trip={trip}
          onClose={handleToggleStoryPlayer}
        />
      )}
    </div>
  );
} 