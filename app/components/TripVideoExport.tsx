'use client';

import { useState } from 'react';
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
  const [showExporter, setShowExporter] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  
  const handleToggleStoryPlayer = () => {
    setShowStoryPlayer(!showStoryPlayer);
  };
  
  const handleToggleExporter = () => {
    setShowExporter(!showExporter);
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
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleStoryPlayer}
            icon="timeline"
          >
            Preview
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleToggleExporter}
            icon="download"
          >
            Create Video
          </Button>
        </div>
      </div>
      
      {/* Feature preview */}
      {!showExporter && !videoUrl && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-0.5"></div>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Story Player</h4>
                <p className="text-sm text-muted-foreground">
                  Generate a video slideshow from your trip content
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Share your memories</span>
              <span className="text-xl">→</span>
            </div>
          </div>
          <button 
            onClick={handleToggleExporter}
            className="w-full relative overflow-hidden group"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="bg-primary text-white rounded-full p-4">
                <Icon name="play" size={32} />
              </div>
            </div>
            <img 
              src={getFirstTripImage()} 
              alt="Trip Preview"
              className="w-full h-60 object-cover"
            />
          </button>
        </div>
      )}
      
      {/* Video preview if available */}
      {videoUrl && (
        <div>
          <div className="rounded-lg overflow-hidden bg-black my-4 shadow-lg border border-border">
            <video
              src={videoUrl}
              controls
              className="w-full h-full max-h-[500px]"
              poster={getFirstTripImage()}
              playsInline
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Your video has been created successfully! Click download to save it to your device.
            </p>
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
      
      {/* Exporter panel */}
      {showExporter && (
        <div className="mt-4">
          <VideoExporter
            trip={trip}
            onProgress={handleVideoProgress}
            onComplete={handleVideoComplete}
          />
          {exportProgress > 0 && exportProgress < 100 && (
            <p className="text-sm text-muted-foreground mt-2">
              Creating your story video... ({exportProgress}%)
            </p>
          )}
        </div>
      )}
      
      {/* Story Player Modal */}
      {showStoryPlayer && (
        <StoryPlayer
          trip={trip}
          onClose={handleToggleStoryPlayer}
        />
      )}
    </div>
  );
} 