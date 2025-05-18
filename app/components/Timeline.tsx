'use client';

import { useRef, useState } from 'react';
import { Trip, MediaItem, Sticker, TimeOfDay } from '../types';
import TimelineSection from './TimelineSection';
import Icon from './Icon';
import Button from './Button';
import { generateId } from '../utils';

interface TimelineProps {
  trip: Trip;
  onUpdate?: (trip: Trip) => void;
  isEditable?: boolean;
}

export default function Timeline({ trip, onUpdate, isEditable = true }: TimelineProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isAddingStickerMode, setIsAddingStickerMode] = useState(false);
  const [stickerType, setStickerType] = useState<'emoji' | 'text' | 'location' | 'category'>('emoji');
  const [stickerContent, setStickerContent] = useState('');
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{
    item: MediaItem,
    sourceDayIndex: number,
    sourceTimeOfDay: TimeOfDay
  } | null>(null);
  const [showUploadDaySelector, setShowUploadDaySelector] = useState(false);
  const [selectedUploadDay, setSelectedUploadDay] = useState<number | null>(null);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      timelineRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
  };
  
  const handleStickerMove = (dayIndex: number, stickerId: string, position: { x: number, y: number }) => {
    if (!onUpdate) return;
    
    const updatedTrip = { ...trip };
    const stickerIndex = updatedTrip.days[dayIndex].stickers.findIndex(s => s.id === stickerId);
    
    if (stickerIndex !== -1) {
      updatedTrip.days[dayIndex].stickers[stickerIndex] = {
        ...updatedTrip.days[dayIndex].stickers[stickerIndex],
        position
      };
      
      onUpdate(updatedTrip);
    }
  };
  
  const handleStickerDelete = (dayIndex: number, stickerId: string) => {
    if (!onUpdate) return;
    
    const updatedTrip = { ...trip };
    updatedTrip.days[dayIndex].stickers = updatedTrip.days[dayIndex].stickers.filter(s => s.id !== stickerId);
    
    onUpdate(updatedTrip);
  };
  
  const handleAddSticker = (dayIndex: number, type: 'emoji' | 'text' | 'location' | 'category', content: string) => {
    if (!onUpdate) return;
    
    const newSticker: Sticker = {
      id: generateId(),
      type,
      content,
      position: { x: 50, y: 50 },
      style: {
        rotate: Math.floor(Math.random() * 20) - 10,
        scale: Math.random() * 0.3 + 0.9
      }
    };
    
    const updatedTrip = { ...trip };
    updatedTrip.days[dayIndex].stickers.push(newSticker);
    
    onUpdate(updatedTrip);
    setIsAddingStickerMode(false);
    setStickerContent('');
  };
  
  // Handle drag-and-drop functionality
  const handleMediaDragStart = (e: React.DragEvent, item: MediaItem, dayIndex: number, timeOfDay: TimeOfDay) => {
    setIsDraggingMedia(true);
    setDraggedItem({
      item,
      sourceDayIndex: dayIndex,
      sourceTimeOfDay: timeOfDay
    });
  };
  
  const handleMediaDrop = (e: React.DragEvent, targetDayIndex: number, targetTimeOfDay: TimeOfDay) => {
    e.preventDefault();
    
    if (!draggedItem || !onUpdate) return;
    
    const { item, sourceDayIndex } = draggedItem;
    const updatedTrip = { ...trip };
    
    // If dropped in the same day but different time of day, update the timestamp to match the new time
    if (sourceDayIndex === targetDayIndex) {
      // Remove from original position
      updatedTrip.days[sourceDayIndex].items = updatedTrip.days[sourceDayIndex].items.filter(i => i.id !== item.id);
      
      // Update timestamp for new time of day
      const currentDate = new Date(item.timestamp);
      const hours = targetTimeOfDay === 'morning' ? 9 : 
                    targetTimeOfDay === 'afternoon' ? 14 : 
                    targetTimeOfDay === 'evening' ? 19 : 22;
      
      currentDate.setHours(hours);
      
      const updatedItem = {
        ...item,
        timestamp: currentDate.toISOString()
      };
      
      // Add to new position
      updatedTrip.days[targetDayIndex].items.push(updatedItem);
    } else {
      // Moving to a different day
      // Remove from original day
      updatedTrip.days[sourceDayIndex].items = updatedTrip.days[sourceDayIndex].items.filter(i => i.id !== item.id);
      
      // Update date and time for new day
      const targetDate = new Date(updatedTrip.days[targetDayIndex].date);
      const currentDate = new Date(item.timestamp);
      
      // Keep the same time but change the date
      targetDate.setHours(currentDate.getHours(), currentDate.getMinutes());
      
      // If specific time of day was targeted, update the hours
      if (targetTimeOfDay) {
        const hours = targetTimeOfDay === 'morning' ? 9 : 
                      targetTimeOfDay === 'afternoon' ? 14 : 
                      targetTimeOfDay === 'evening' ? 19 : 22;
        targetDate.setHours(hours);
      }
      
      const updatedItem = {
        ...item,
        timestamp: targetDate.toISOString()
      };
      
      // Add to target day
      updatedTrip.days[targetDayIndex].items.push(updatedItem);
    }
    
    // Clear drag state
    setIsDraggingMedia(false);
    setDraggedItem(null);
    
    // Update trip
    onUpdate(updatedTrip);
  };
  
  // Handle adding a media item to a specific day
  const handleSelectUploadDay = (dayIndex: number) => {
    setSelectedUploadDay(dayIndex);
  };
  
  const toggleUploadDaySelector = () => {
    setShowUploadDaySelector(!showUploadDaySelector);
  };
  
  const emojiOptions = ["😍", "🥰", "🌄", "🏖️", "🍽️", "🥂", "🚗", "✈️", "🏨", "🎡"];
  const locationOptions = ["Beach", "Hotel", "Restaurant", "Cafe", "Museum"];
  const categoryOptions = ["Food", "Travel", "Accommodation", "Sightseeing", "Activity"];
  
  const handleMediaUpload = (newItems: MediaItem[], selectedDayIndex?: number) => {
    if (!onUpdate) return;
    
    const updatedTrip = { ...trip };
    
    if (selectedDayIndex !== undefined && selectedDayIndex !== null) {
      // Add items to the selected day
      updatedTrip.days[selectedDayIndex].items = [
        ...updatedTrip.days[selectedDayIndex].items,
        ...newItems
      ];
    } else {
      // If no day selected, sort media by date and add to appropriate days
      newItems.forEach(item => {
        const itemDate = new Date(item.timestamp);
        
        // Find day that contains this date
        const dayIndex = updatedTrip.days.findIndex(day => {
          const dayDate = new Date(day.date);
          return (
            dayDate.getFullYear() === itemDate.getFullYear() &&
            dayDate.getMonth() === itemDate.getMonth() &&
            dayDate.getDate() === itemDate.getDate()
          );
        });
        
        if (dayIndex !== -1) {
          updatedTrip.days[dayIndex].items.push(item);
        } else {
          // If no matching day, add to first day as fallback
          if (updatedTrip.days.length > 0) {
            updatedTrip.days[0].items.push(item);
          }
        }
      });
    }
    
    onUpdate(updatedTrip);
  };
  
  // Handler for updating the caption of selected media
  const handleCaptionChange = (caption: string) => {
    if (!selectedMedia || !onUpdate) return;
    
    // Create updated media item with new caption
    const updatedMedia = {
      ...selectedMedia,
      caption
    };
    
    // Find the day and item index to update
    const updatedTrip = { ...trip };
    let found = false;
    
    for (let dayIndex = 0; dayIndex < updatedTrip.days.length; dayIndex++) {
      const mediaIndex = updatedTrip.days[dayIndex].items.findIndex(item => item.id === selectedMedia.id);
      
      if (mediaIndex !== -1) {
        // Update the media item
        updatedTrip.days[dayIndex].items[mediaIndex] = updatedMedia;
        found = true;
        break;
      }
    }
    
    if (found) {
      // Update the trip state
      onUpdate(updatedTrip);
      // Update the selected media state
      setSelectedMedia(updatedMedia);
    }
  };
  
  // Handler for deleting the selected media item
  const handleDeleteMedia = () => {
    if (!selectedMedia || !onUpdate) return;
    
    // Find and remove the media item from the trip
    const updatedTrip = { ...trip };
    let found = false;
    
    for (let dayIndex = 0; dayIndex < updatedTrip.days.length; dayIndex++) {
      const initialLength = updatedTrip.days[dayIndex].items.length;
      updatedTrip.days[dayIndex].items = updatedTrip.days[dayIndex].items.filter(item => item.id !== selectedMedia.id);
      
      if (updatedTrip.days[dayIndex].items.length < initialLength) {
        found = true;
        break;
      }
    }
    
    if (found) {
      // Update the trip state
      onUpdate(updatedTrip);
      // Close the media dialog
      setSelectedMedia(null);
    }
  };
  
  return (
    <div className="w-full">
      {/* Timeline controls */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon="zoomOut"
            onClick={() => handleScroll('left')}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon="zoomIn"
            iconPosition="right"
            onClick={() => handleScroll('right')}
          >
            Next
          </Button>
        </div>
        
        {isEditable && (
          <div className="flex gap-2">
            <Button
              variant={isAddingStickerMode ? 'accent' : 'outline'}
              size="sm"
              icon="sticker"
              onClick={() => setIsAddingStickerMode(!isAddingStickerMode)}
            >
              Add Sticker
            </Button>
          </div>
        )}
      </div>

      {/* Sticker selector */}
      {isAddingStickerMode && isEditable && (
        <div className="bg-muted rounded-lg p-4 mb-4 mx-4 animate-fade-in">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Select sticker type:</h3>
            <div className="flex gap-2">
              {['emoji', 'text', 'location', 'category'].map((type) => (
                <Button
                  key={type}
                  variant={stickerType === type ? 'accent' : 'outline'}
                  size="sm"
                  icon={type as string}
                  onClick={() => setStickerType(type as any)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            {stickerType === 'emoji' && (
              <div>
                <h3 className="text-sm font-medium mb-2">Select emoji:</h3>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      className={`text-2xl p-2 rounded-md hover:bg-white/50 ${stickerContent === emoji ? 'bg-white ring-2 ring-blue-500' : ''}`}
                      onClick={() => setStickerContent(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {stickerType === 'text' && (
              <div>
                <h3 className="text-sm font-medium mb-2">Enter text:</h3>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={stickerContent}
                  onChange={(e) => setStickerContent(e.target.value)}
                  placeholder="Enter note text..."
                />
              </div>
            )}
            
            {stickerType === 'location' && (
              <div>
                <h3 className="text-sm font-medium mb-2">Select location:</h3>
                <div className="flex flex-wrap gap-2">
                  {locationOptions.map((location) => (
                    <button
                      key={location}
                      className={`px-3 py-2 rounded-md text-sm hover:bg-white/50 ${
                        stickerContent === location ? 'bg-white ring-2 ring-blue-500' : 'bg-blue-100'
                      }`}
                      onClick={() => setStickerContent(location)}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {stickerType === 'category' && (
              <div>
                <h3 className="text-sm font-medium mb-2">Select category:</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      className={`px-3 py-2 rounded-md text-sm hover:bg-white/50 ${
                        stickerContent === category ? 'bg-white ring-2 ring-blue-500' : 'bg-green-100'
                      }`}
                      onClick={() => setStickerContent(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Click on a day to add the sticker</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddingStickerMode(false);
                setStickerContent('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Timeline scroll container */}
      <div 
        ref={timelineRef}
        className={`timeline-container hide-scrollbar overflow-x-auto flex snap-x snap-mandatory ${isDraggingMedia ? 'bg-muted/30' : ''}`}
      >
        {trip.days.map((day, index) => (
          <TimelineSection
            key={day.date}
            date={day.date}
            dayIndex={index}
            mediaItems={day.items}
            stickers={day.stickers}
            onMediaClick={handleMediaClick}
            onStickerMove={(id, position) => handleStickerMove(index, id, position)}
            onStickerDelete={(id) => handleStickerDelete(index, id)}
            isEditable={isEditable}
            isAddingStickerMode={isAddingStickerMode && !!stickerContent}
            onSectionClick={() => handleAddSticker(index, stickerType, stickerContent)}
            onMediaDragStart={handleMediaDragStart}
            onMediaDrop={handleMediaDrop}
          />
        ))}
      </div>
      
      {/* Add sticker overlay */}
      {isAddingStickerMode && stickerContent && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-card p-4 rounded-lg shadow-lg animate-fade-in border border-border">
          <div className="flex items-center gap-4">
            <div className="text-2xl">{stickerType === 'emoji' ? stickerContent : '📌'}</div>
            <div className="text-sm">
              <p className="font-medium">Ready to place sticker</p>
              <p className="text-muted-foreground">Click on any day section to add</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Drag-and-drop helper overlay */}
      {isDraggingMedia && draggedItem && (
                  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-card p-4 rounded-lg shadow-lg animate-fade-in border border-blue-500 z-50">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🖼️</div>
            <div className="text-sm">
              <p className="font-medium">Moving photo</p>
              <p className="text-muted-foreground">Drop on any day or time section</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected media details */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium">Photo Details</h3>
              <div className="flex gap-2">
                {isEditable && (
                  <button
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100/10"
                    onClick={handleDeleteMedia}
                    title="Delete photo"
                  >
                    <Icon name="trash" size={20} />
                  </button>
                )}
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100/10"
                  onClick={() => setSelectedMedia(null)}
                  title="Close"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-square">
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.caption || ''}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              
              <div className="flex flex-col">
                <div className="mb-4">
                  <h4 className="text-sm text-gray-500 mb-1">Timestamp</h4>
                  <p>{new Date(selectedMedia.timestamp).toLocaleString()}</p>
                </div>
                
                {selectedMedia.location?.name && (
                  <div className="mb-4">
                    <h4 className="text-sm text-gray-500 mb-1">Location</h4>
                    <p className="flex items-center">
                      <Icon name="location" size={16} className="mr-1 text-blue-500" />
                      {selectedMedia.location.name}
                    </p>
                  </div>
                )}
                
                <div className="mb-4">
                  <h4 className="text-sm text-gray-500 mb-1">Caption</h4>
                  {isEditable ? (
                    <textarea
                      className="w-full p-2 border rounded-md bg-background text-foreground"
                      value={selectedMedia.caption || ''}
                      placeholder="Add a caption..."
                      rows={3}
                      onChange={(e) => handleCaptionChange(e.target.value)}
                    />
                  ) : (
                    <p>{selectedMedia.caption || 'No caption'}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end gap-2">
              {isEditable && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedMedia(null)}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant={isEditable ? "accent" : "outline"}
                onClick={() => setSelectedMedia(null)}
              >
                {isEditable ? "Save" : "Close"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 