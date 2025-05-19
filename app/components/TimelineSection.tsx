'use client';

import { useRef } from 'react';
import { MediaItem as MediaItemType, Sticker as StickerType, TimeOfDay, formatDate } from '../types';
import MediaItem from './MediaItem';
import Sticker from './Sticker';
import { getTimeOfDayColor, getTimeOfDayIcon, groupByTimeOfDay } from '../utils';

interface TimelineSectionProps {
  date: string;
  dayIndex: number;
  mediaItems: MediaItemType[];
  stickers: StickerType[];
  onMediaClick?: (item: MediaItemType) => void;
  onStickerMove?: (id: string, position: { x: number; y: number }) => void;
  onStickerDelete?: (id: string) => void;
  onStickerEditCaption?: (id: string, caption: string) => void;
  isEditable?: boolean;
  onSectionClick?: () => void;
  isAddingStickerMode?: boolean;
  onMediaDragStart?: (e: React.DragEvent, item: MediaItemType, dayIndex: number, timeOfDay: TimeOfDay) => void;
  onMediaDrop?: (e: React.DragEvent, targetDayIndex: number, targetTimeOfDay: TimeOfDay) => void;
}

export default function TimelineSection({
  date,
  dayIndex,
  mediaItems,
  stickers,
  onMediaClick,
  onStickerMove,
  onStickerDelete,
  onStickerEditCaption,
  isEditable = true,
  onSectionClick,
  isAddingStickerMode = false,
  onMediaDragStart,
  onMediaDrop
}: TimelineSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Group media items by time of day
  const groupedItems = groupByTimeOfDay(mediaItems);
  
  // Time of day sections to display
  const timeOfDaySections: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];

  // Handle click on the section to add a sticker
  const handleSectionClick = () => {
    if (isAddingStickerMode && onSectionClick) {
      onSectionClick();
    }
  };
  
  // Handle drag events
  const handleMediaDragStart = (e: React.DragEvent, item: MediaItemType, timeOfDay: TimeOfDay) => {
    if (onMediaDragStart && isEditable && !isAddingStickerMode) {
      onMediaDragStart(e, item, dayIndex, timeOfDay);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isEditable && !isAddingStickerMode) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent, timeOfDay: TimeOfDay) => {
    if (onMediaDrop && isEditable && !isAddingStickerMode) {
      e.preventDefault();
      onMediaDrop(e, dayIndex, timeOfDay);
    }
  };
  
  return (
    <div 
      className={`timeline-section min-w-[80vw] md:min-w-[85vw] lg:min-w-[70vw] xl:min-w-[65vw] snap-start p-4 md:p-6 lg:p-8 transition-colors duration-300 ${
        isAddingStickerMode ? 'sticker-add-mode hover:bg-muted/50' : ''
      }`}
      onClick={handleSectionClick}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/20 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
          <span className="font-bold text-primary">{dayIndex + 1}</span>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            {formatDate(date)}
            <div className={`ml-3 px-3 py-1 text-xs font-medium rounded-full bg-muted`}>
              Day {dayIndex + 1}
            </div>
          </h2>
        </div>
      </div>
      
      <div ref={containerRef} className="relative min-h-[400px] transform transition-all">
        {/* Stickers */}
        {stickers.map((sticker) => (
          <Sticker
            key={sticker.id}
            sticker={sticker}
            onMove={onStickerMove}
            onDelete={onStickerDelete}
            onEditCaption={onStickerEditCaption}
            isEditable={isEditable && !isAddingStickerMode}
            containerRef={containerRef}
          />
        ))}
        
        {/* Time of day sections */}
        {timeOfDaySections.map((tod) => {
          const items = groupedItems[tod];
          if (items.length === 0) return null;
          
          return (
            <div 
              key={tod} 
              className="mb-8 last:mb-0 animate-fade-in"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, tod)}
            >
              <div className={`rounded-lg p-4 mb-4 flex items-center ${getTimeOfDayColor(tod)}`}>
                <span className="mr-3">{getTimeOfDayIcon(tod)}</span>
                <h3 className="capitalize font-medium">{tod}</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {items.map((item, index) => (
                  <div key={item.id} className="transform transition-all duration-500" style={{ 
                    transitionDelay: `${index * 50}ms`,
                  }}>
                    <MediaItem
                      item={item}
                      onClick={onMediaClick}
                      draggable={isEditable && !isAddingStickerMode}
                      onDragStart={(e, item) => handleMediaDragStart(e, item, tod)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Empty state */}
        {mediaItems.length === 0 && (
          <div 
            className="flex flex-col items-center justify-center h-[300px] text-muted-foreground border border-dashed border-border rounded-xl bg-muted/5"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'afternoon')}
          >
            <div className="bg-muted/20 rounded-full h-20 w-20 flex items-center justify-center mb-4">
              <span className="text-5xl">📷</span>
            </div>
            <p className="text-xl font-medium mb-2">Awaiting Your Memories</p>
            <p className="text-sm text-muted-foreground">Capture this day&apos;s special moments with photos</p>
            {isEditable && (
              <div className="mt-4">
                <button className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  Upload Photos
                </button>
              </div>
            )}
          </div>
        )}

        {/* Visual indicator for adding sticker mode */}
        {isAddingStickerMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center">
            <div className="bg-card/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg animate-pulse">
              <p className="text-center font-medium flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                <span>Click to Add Sticker Here</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 