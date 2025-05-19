'use client';

import { useState } from 'react';
import { MediaItem as MediaItemType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { timeOfDay } from '../types';
import Image from 'next/image';

interface MediaItemProps {
  item: MediaItemType;
  onClick?: (item: MediaItemType) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, item: MediaItemType) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, item: MediaItemType) => void;
}

export default function MediaItem({ 
  item, 
  onClick, 
  draggable = true,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}: MediaItemProps) {
  const { isDark } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const time = item.timestamp ? timeOfDay(new Date(item.timestamp)) : 'afternoon';
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle dragging
  const handleDragStart = (e: React.DragEvent) => {
    if (draggable && onDragStart) {
      setIsDragging(true);
      // Set the drag data as the media item ID and day ID
      e.dataTransfer.setData('application/json', JSON.stringify({
        mediaItemId: item.id,
        type: 'mediaItem'
      }));
      e.dataTransfer.effectAllowed = 'move';
      onDragStart(e, item);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    if (onDragEnd) onDragEnd(e);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (onDragOver) {
      e.preventDefault();
      onDragOver(e);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (onDrop) {
      e.preventDefault();
      onDrop(e, item);
    }
  };

  // Format the time for display
  const formattedTime = new Date(item.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div 
      className={`glass-card rounded-xl overflow-hidden shadow-md border border-border transform transition-all duration-300 
        hover:shadow-xl p-1 ${isDragging ? 'opacity-50 scale-95' : 'hover:scale-[1.02] hover:-translate-y-1'}`}
      onClick={() => onClick && onClick(item)}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        {item.type === 'image' && (
          <div className="w-full h-full bg-muted overflow-hidden group">
            <Image
              src={imageError ? '/fallback-image.png' : item.src}
              alt={item.caption || 'Travel memory'}
              width={640}
              height={480}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={handleImageError}
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        
        {item.type === 'video' && (
          <div className="relative w-full h-full">
            <video 
              src={item.src} 
              className="w-full h-full object-cover"
              controls
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 rounded-full p-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>
        )}
        
        {/* Time indicator badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full 
          ${isDark ? 'bg-gray-800/80' : 'bg-white/80'} 
          backdrop-blur-sm text-xs font-medium shadow-sm`}
        >
          {formattedTime}
        </div>
      </div>
      
      <div className="p-4">
        {item.caption ? (
          <p className="text-sm mb-2 line-clamp-2">{item.caption}</p>
        ) : (
          <p className="text-sm mb-2 text-muted-foreground italic">No caption</p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.location?.name || 'Location'}
          </div>
          
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50">
            <span className={`w-2 h-2 rounded-full ${
              time === 'morning' ? 'bg-amber-400' :
              time === 'afternoon' ? 'bg-sky-400' :
              time === 'evening' ? 'bg-orange-400' : 'bg-indigo-400'
            }`}></span>
            <span className="capitalize">{time}</span>
          </div>
        </div>
        
        {draggable && (
          <div className="w-full flex justify-center mt-3">
            <div className="w-8 h-1 rounded-full bg-muted-foreground/30"></div>
          </div>
        )}
      </div>
    </div>
  );
} 