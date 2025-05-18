'use client';

import { useState, useRef } from 'react';
import Button from './Button';
import Icon from './Icon';
import { Trip } from '../types';
import { generateId } from '../utils';
import { useTheme } from '../context/ThemeContext';
import { themes, ThemeColor } from '../themes';
import Image from 'next/image';

interface TripCreatorProps {
  onTripCreated: (trip: Trip) => void;
  onCancel: () => void;
}

export default function TripCreator({ onTripCreated, onCancel }: TripCreatorProps) {
  const { theme: currentTheme, isDark } = useTheme();
  const [title, setTitle] = useState('My Amazing Journey');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [theme, setTheme] = useState<ThemeColor>('teal');
  
  // For banner image
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  // Calculate the trip duration
  const calculateDuration = () => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
    
    return diffDays;
  };
  
  const tripDuration = calculateDuration();
  
  // Suggestion data for locations
  const popularDestinations = [
    "Tokyo, Japan", "Paris, France", "New York, USA", "Rome, Italy", 
    "Bali, Indonesia", "Barcelona, Spain", "London, UK", "Sydney, Australia"
  ];
  
  // Handle banner image upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setBannerImage(e.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const triggerBannerUpload = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  };
  
  const handleRemoveBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBannerImage(null);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = '';
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new trip
    const newTrip: Trip = {
      id: generateId(),
      title: title || 'My Journey',
      startDate,
      endDate,
      days: [],
      theme,
      location: location || undefined,
      description: description || undefined,
      bannerImage: bannerImage || undefined
    };
    
    // Generate empty days between start and end dates
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Add one day to include the end date
      end.setDate(end.getDate() + 1);
      
      for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        newTrip.days.push({
          date: dateString,
          items: [],
          stickers: []
        });
      }
    }
    
    onTripCreated(newTrip);
  };

  const handleCancel = () => {
    // Clear any localStorage data to prevent accidental redirects
    localStorage.removeItem('currentTrip');
    onCancel();
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left side: Form */}
        <div className="glass-card rounded-xl shadow-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Design Your Journey</h2>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleCancel}
              aria-label="Close"
            >
              <Icon name="x" size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Give your journey a name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="My Amazing Journey"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Destination
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="location" size={18} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Where are you going?"
                  list="popular-destinations"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <datalist id="popular-destinations">
                  {popularDestinations.map((destination, index) => (
                    <option key={index} value={destination} />
                  ))}
                </datalist>
              </div>
              
              {/* Popular destination pills */}
              <div className="flex flex-wrap gap-2 mt-2">
                {!location && popularDestinations.slice(0, 4).map((destination, index) => (
                  <button
                    key={index}
                    type="button"
                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => setLocation(destination)}
                  >
                    {destination}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                placeholder="What are you looking forward to on this adventure?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            {/* Banner Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cover Image <span className="text-muted-foreground">(optional)</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer group
                  ${bannerImage ? 'border-primary/20' : 'border-border'}
                  ${bannerImage ? 'hover:border-primary/30' : 'hover:border-muted-foreground'}
                  transition-colors
                `}
                onClick={triggerBannerUpload}
              >
                <input
                  type="file"
                  ref={bannerInputRef}
                  onChange={handleBannerUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                {bannerImage ? (
                  <div className="relative h-36 w-full">
                    <Image
                      src={bannerImage}
                      alt="Trip banner"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-black/50 text-white text-xs py-1 px-2 rounded backdrop-blur-sm">
                        Change Image
                      </div>
                    </div>
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                      onClick={handleRemoveBanner}
                    >
                      <Icon name="x" size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-4 h-36">
                    <Icon name="image" size={32} className="text-muted-foreground mb-3" />
                    <p className="text-sm text-center text-muted-foreground">
                      Click to upload a cover image for your trip
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="calendar" size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="date"
                    className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      // Set end date to start date if it's not set or is before start date
                      if (!endDate || new Date(endDate) < new Date(e.target.value)) {
                        setEndDate(e.target.value);
                      }
                    }}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="calendar" size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="date"
                    className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Choose a theme color
              </label>
              <div className="grid grid-cols-5 gap-4">
                {Object.values(themes).map((themeOption) => (
                  <button
                    key={themeOption.id}
                    type="button"
                    className={`relative w-full aspect-square rounded-lg transition-all overflow-hidden
                      ${themeOption[isDark ? 'dark' : 'light'].primary}
                      ${theme === themeOption.id 
                        ? 'ring-2 ring-offset-2 ring-offset-background scale-105' 
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    title={themeOption.name}
                    onClick={() => setTheme(themeOption.id)}
                  >
                    {theme === themeOption.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Icon name="check" size={20} className="text-white drop-shadow-md" />
                      </div>
                    )}
                    <span className="sr-only">{themeOption.name}</span>
                  </button>
                ))}
              </div>
              <div className="text-center mt-2 text-sm">
                <span className="text-muted-foreground">{themes[theme].name}</span>
              </div>
            </div>
            
            {/* Submit/Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                icon="arrowLeft"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!title || !startDate || !endDate}
                className="min-w-[160px]"
                icon="compass"
                iconPosition="right"
              >
                Start Adventure
              </Button>
            </div>
          </form>
        </div>
        
        {/* Right side: Preview */}
        <div className="hidden lg:block">
          {/* Trip Card Preview */}
          <div className="glass-card rounded-xl shadow-lg border border-border overflow-hidden">
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Icon name="eye" size={18} className="text-primary" />
                <span>Journey Preview</span>
              </h2>
            </div>
            
            {/* Banner Preview */}
            <div className="relative h-48 w-full">
              {bannerImage ? (
                <Image
                  src={bannerImage}
                  alt="Trip banner"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Icon name="image" size={30} className="mx-auto mb-2" />
                    <p className="text-sm">Add a cover image to your journey</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-2xl font-bold mb-1 drop-shadow-sm">{title}</h3>
                {location && (
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-1 drop-shadow-sm">
                    <Icon name="location" size={14} />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Trip Details */}
            <div className="p-6">
              {/* Date and Duration */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1.5">
                  <Icon name="calendar" size={16} />
                  <span>TRAVEL DATES</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <div className="text-lg font-medium">
                    {startDate ? formatDate(startDate) : 'Select start date'}
                  </div>
                  <div className="hidden sm:block text-muted-foreground">→</div>
                  <div className="text-lg font-medium">
                    {endDate ? formatDate(endDate) : 'Select end date'}
                  </div>
                </div>
                
                {tripDuration && (
                  <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {tripDuration} {tripDuration === 1 ? 'day' : 'days'}
                  </div>
                )}
              </div>
              
              {/* Description */}
              {description ? (
                <div className="border-t border-border pt-4 mb-4">
                  <p className="text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ) : (
                <div className="border-t border-border pt-4 mb-4">
                  <p className="text-muted-foreground italic">Add a description to tell the story of your journey</p>
                </div>
              )}
              
              {/* Journey Structure */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
                  <Icon name="map" size={16} />
                  <span>JOURNEY STRUCTURE</span>
                </div>
                
                {tripDuration ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-border rounded-lg p-3 bg-muted/30">
                      <div className="text-sm text-muted-foreground mb-1">Timeline</div>
                      <div className="font-medium">{tripDuration} day journey</div>
                    </div>
                    <div className="border border-border rounded-lg p-3 bg-muted/30">
                      <div className="text-sm text-muted-foreground mb-1">Theme</div>
                      <div className="font-medium flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${themes[theme][isDark ? 'dark' : 'light'].primary}`}></div>
                        {themes[theme].name}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Select dates to see your journey structure
                  </div>
                )}
              </div>
              
              {/* What's next information */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Icon name="info" size={16} className="text-primary" />
                  <span>After creating your journey</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  You'll be able to upload photos, add notes, and create a beautiful timeline of your adventure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 