'use client';

import { useState, useEffect, useRef } from 'react';
import { Trip, MediaItem, Sticker, TimelineDay } from '../types';
import Button from './Button';
import Icon from './Icon';
import Image from 'next/image';
import { formatDate } from '../types';
import { getTimeOfDayIcon } from '../utils';

interface StoryPlayerProps {
  trip: Trip;
  onClose: () => void;
}

export default function StoryPlayer({ trip, onClose }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentDay = trip.days[currentDayIndex];
  const currentItem = currentDay?.items[currentItemIndex];
  const daysCount = trip.days.length;
  const itemsCount = currentDay?.items.length || 0;
  
  const DISPLAY_DURATION = 5000; // 5 seconds per item

  // Handle playing and pausing the story
  useEffect(() => {
    if (isPlaying) {
      startTimer();
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [isPlaying, currentDayIndex, currentItemIndex]);

  // Handle progress bar
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / DISPLAY_DURATION) * 100;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Reset progress when changing item
  useEffect(() => {
    setProgress(0);
  }, [currentDayIndex, currentItemIndex]);

  const startTimer = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      moveToNextItem();
    }, DISPLAY_DURATION);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const moveToNextItem = () => {
    if (currentItemIndex < itemsCount - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else if (currentDayIndex < daysCount - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
      setCurrentItemIndex(0);
    } else {
      // End of story
      setIsPlaying(false);
    }
  };

  const moveToPreviousItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    } else if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
      setCurrentItemIndex(trip.days[currentDayIndex - 1].items.length - 1);
    }
  };

  // Find stickers that belong to the current item based on timestamp
  const getCurrentStickers = () => {
    if (!currentDay) return [];
    
    // If no timestamp on the item, show all stickers for that day
    if (!currentItem?.timestamp) return currentDay.stickers;
    
    // Find stickers with timestamps close to the current item
    const itemTime = new Date(currentItem.timestamp).getTime();
    const timeWindow = 30 * 60 * 1000; // 30 minutes window
    
    return currentDay.stickers.filter(sticker => {
      if (!sticker.timestamp) return true; // Include stickers without timestamp
      const stickerTime = new Date(sticker.timestamp).getTime();
      return Math.abs(stickerTime - itemTime) <= timeWindow;
    });
  };

  const renderSticker = (sticker: Sticker) => {
    const { type, content, position, style } = sticker;
    
    const stickerStyle = {
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: `rotate(${style?.rotate || 0}deg) scale(${style?.scale || 1})`,
      zIndex: 10,
    };

    return (
      <div
        key={sticker.id}
        className="absolute pointer-events-none transition-all duration-300 animate-fadeIn"
        style={stickerStyle}
      >
        {type === 'emoji' && (
          <div className="text-4xl">{content}</div>
        )}
        {type === 'text' && (
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium text-black">
            {content}
          </div>
        )}
        {type === 'location' && (
          <div className="bg-primary/90 text-white px-3 py-1.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-1">
            <Icon name="location" size={14} />
            {content}
          </div>
        )}
        {type === 'category' && (
          <div className="bg-secondary/90 text-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium">
            {content}
          </div>
        )}
        {sticker.caption && (
          <div className="mt-1 bg-black/70 text-white px-2 py-1 rounded text-xs max-w-[150px] text-center">
            {sticker.caption}
          </div>
        )}
      </div>
    );
  };

  const renderMediaItem = () => {
    if (!currentItem) return null;

    if (currentItem.type === 'image') {
      return (
        <div className="relative w-full h-full">
          <Image
            src={currentItem.src}
            alt={currentItem.caption || 'Trip image'}
            fill
            className="object-cover"
            priority
          />
        </div>
      );
    } else if (currentItem.type === 'video') {
      return (
        <video
          ref={videoRef}
          src={currentItem.src}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          loop
        />
      );
    }
    return null;
  };

  const generateDownloadableVideo = async () => {
    // In a real implementation, this would use a video generation library or service
    // For now, we'll just simulate with an alert
    alert('In a production app, this would generate and download a video of your story.');
    
    // Here's where we'd implement actual video generation
    // This could use canvas recording, WebRTC, or a server-side solution
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div 
        ref={containerRef}
        className="relative w-full max-w-3xl aspect-[9/16] mx-auto overflow-hidden rounded-lg shadow-2xl bg-black"
      >
        {/* Main content */}
        <div className="relative w-full h-full">
          {/* Media item */}
          {renderMediaItem()}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          
          {/* Stickers */}
          {getCurrentStickers().map(renderSticker)}
          
          {/* Day indicator */}
          <div className="absolute top-4 left-0 right-0 flex justify-center">
            <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2">
              <span>{getTimeOfDayIcon(currentItem?.timestamp ? new Date(currentItem.timestamp).getHours() < 12 ? 'morning' : 'afternoon' : 'morning')}</span>
              <span>Day {currentDayIndex + 1}: {formatDate(currentDay?.date || '')}</span>
            </div>
          </div>
          
          {/* Caption */}
          {currentItem?.caption && (
            <div className="absolute bottom-16 left-4 right-4">
              <div className="bg-black/70 backdrop-blur-sm p-4 rounded-lg text-white">
                <p>{currentItem.caption}</p>
                {currentItem.location?.name && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-white/80">
                    <Icon name="location" size={14} />
                    <span>{currentItem.location.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Progress bar */}
          <div className="absolute top-14 left-4 right-4 flex gap-1">
            {trip.days.map((day, dayIndex) => (
              <div key={dayIndex} className="flex-1 flex gap-0.5">
                {day.items.map((_, itemIndex) => {
                  const isActive = dayIndex === currentDayIndex && itemIndex === currentItemIndex;
                  const isPast = 
                    dayIndex < currentDayIndex || 
                    (dayIndex === currentDayIndex && itemIndex < currentItemIndex);
                  
                  return (
                    <div 
                      key={`${dayIndex}-${itemIndex}`} 
                      className="flex-1 h-1 rounded-full overflow-hidden bg-white/30"
                    >
                      <div 
                        className={`h-full bg-white ${isActive ? '' : isPast ? 'w-full' : 'w-0'}`}
                        style={{ width: isActive ? `${progress}%` : isPast ? '100%' : '0%' }}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={moveToPreviousItem}
            className="text-white hover:bg-white/20"
            icon="zoomOut"
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={togglePlay}
              className="rounded-full w-12 h-12 flex items-center justify-center"
              icon={isPlaying ? "close" : "play"}
            >
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={generateDownloadableVideo}
              className="text-white border-white/30 hover:bg-white/20"
              icon="download"
            >
              Save
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
            icon="close"
          >
            Exit
          </Button>
        </div>
      </div>
    </div>
  );
} 