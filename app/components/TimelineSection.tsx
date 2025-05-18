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
      className={`timeline-section min-w-[95vw] md:min-w-[85vw] lg:min-w-[70vw] snap-start p-6 ${
        isAddingStickerMode ? 'sticker-add-mode hover:bg-muted/50' : ''
      }`}
      onClick={handleSectionClick}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4">{formatDate(date)} <span className="text-sm font-normal text-muted-foreground">Day {dayIndex + 1}</span></h2>
      
      <div ref={containerRef} className="relative min-h-[400px]">
        {/* Stickers */}
        {stickers.map((sticker) => (
          <Sticker
            key={sticker.id}
            sticker={sticker}
            onMove={onStickerMove}
            onDelete={onStickerDelete}
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
              className="mb-8 last:mb-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, tod)}
            >
              <div className={`rounded-lg p-4 mb-3 flex items-center ${getTimeOfDayColor(tod)}`}>
                <span className="mr-2">{getTimeOfDayIcon(tod)}</span>
                <h3 className="capitalize font-medium">{tod}</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map((item) => (
                  <MediaItem
                    key={item.id}
                    item={item}
                    onClick={onMediaClick}
                    draggable={isEditable && !isAddingStickerMode}
                    onDragStart={(e, item) => handleMediaDragStart(e, item, tod)}
                  />
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Empty state */}
        {mediaItems.length === 0 && (
          <div 
            className="flex flex-col items-center justify-center h-[300px] text-gray-400"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'afternoon')}
          >
            <span className="text-6xl mb-4">📷</span>
            <p className="text-lg">No photos for this day</p>
            <p className="text-sm">Add some memories to get started!</p>
          </div>
        )}

        {/* Visual indicator for adding sticker mode */}
        {isAddingStickerMode && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent pointer-events-none border-2 border-dashed border-blue-500/50 rounded-lg flex items-center justify-center">
            <div className="bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-soft animate-pulse">
              <p className="text-center font-medium">Click here to add sticker</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 