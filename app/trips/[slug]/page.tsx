'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../components/Header';
import Timeline from '../../components/Timeline';
import MediaUploader from '../../components/MediaUploader';
import Button from '../../components/Button';
import ExportButton from '../../components/ExportButton';
import Link from 'next/link';
import { MediaItem, Trip } from '../../types';
import { getTripBySlug, saveTrip, deleteTrip } from '../../utils/tripService';
import Image from 'next/image';
import Icon from '../../components/Icon';

// Helper function to find the best cover image for a trip
const getTripCoverImage = (trip: Trip | null): string | null => {
  if (!trip) return null;
  
  // First check if there's an explicitly set banner image
  if (trip.bannerImage) {
    return trip.bannerImage;
  }
  
  // Fall back to finding the first image in trip days
  if (trip.days) {
    for (const day of trip.days) {
      if (!day.items) continue;
      
      const image = day.items.find(item => item.type === 'image');
      if (image) return image.src;
    }
  }
  
  return null;
};

export default function TripPage() {
  const router = useRouter();
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isUploaderVisible, setIsUploaderVisible] = useState(false);
  const slug = params?.slug as string;
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const loadedTrip = getTripBySlug(slug);
      if (loadedTrip) {
        setTrip(loadedTrip);
        setCoverImage(getTripCoverImage(loadedTrip));
        
        // Debug the loaded trip to verify banner image
        console.log('Loaded trip:', { 
          title: loadedTrip.title,
          hasBanner: !!loadedTrip.bannerImage,
          bannerImage: loadedTrip.bannerImage?.substring(0, 50) + '...' // Preview first 50 chars
        });
      } else {
        // If trip doesn't exist, redirect to trips page
        router.push('/trips');
      }
    }
  }, [slug, router]);

  const handleTripUpdate = (updatedTrip: Trip) => {
    setTrip(updatedTrip);
    saveTrip(updatedTrip);
  };

  const handleDeleteTrip = () => {
    if (!trip) return;

    if (confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      deleteTrip(trip.id);
      router.push('/trips');
    }
  };

  const handleUpload = (newItems: MediaItem[], selectedDayIndex?: number) => {
    if (!trip) return;

    const updatedTrip = { ...trip };

    if (selectedDayIndex !== undefined && selectedDayIndex !== null) {
      // Add all items directly to the selected day
      updatedTrip.days[selectedDayIndex].items = [
        ...updatedTrip.days[selectedDayIndex].items,
        ...newItems
      ];
    } else {
      // Group images by date based on their timestamp when no day is selected
      const itemsByDate = new Map<string, MediaItem[]>();

      newItems.forEach(item => {
        const date = item.timestamp.split('T')[0];
        if (!itemsByDate.has(date)) {
          itemsByDate.set(date, []);
        }
        itemsByDate.get(date)?.push(item);
      });

      // Update the trip with new items
      itemsByDate.forEach((items, date) => {
        // Find the day for this date
        const dayIndex = updatedTrip.days.findIndex(day => day.date === date);

        if (dayIndex !== -1) {
          // Add items to an existing day
          updatedTrip.days[dayIndex].items = [
            ...updatedTrip.days[dayIndex].items,
            ...items
          ];
        } else {
          // Create a new day if this date doesn't exist yet
          const newDay = {
            date,
            items,
            stickers: []
          };

          updatedTrip.days.push(newDay);

          // Sort days by date
          updatedTrip.days.sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        }
      });
    }

    // Update trip state and save
    handleTripUpdate(updatedTrip);
    setIsUploaderVisible(false);
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <div className="mb-4">Loading trip...</div>
          <Link href="/trips" className="text-primary hover:underline">
            Back to All Trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Bar */}
      <div className="bg-card border-b border-border backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Link href="/trips" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors group">
            <span className="bg-muted/50 p-1.5 rounded-full group-hover:bg-primary/10">
              <Icon name="arrowLeft" size={16} />
            </span>
            <span>Back to Journey Collection</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteTrip}
              title="Delete this journey"
              icon="trash"
              className="text-muted-foreground hover:text-red-500"
            >
              Delete Journey
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Trip Header */}
      <div className="relative">
        {coverImage ? (
          <div className="relative h-56 md:h-72 lg:h-80 w-full overflow-hidden">
            <Image
              src={coverImage}
              alt={trip.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
            <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 py-8">
              <div className="text-white space-y-3 max-w-3xl">
                {trip.location && (
                  <div className="flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                    <Icon name="location" size={16} />
                    <span>{trip.location}</span>
                  </div>
                )}
                <h1 className="text-3xl md:text-5xl font-bold drop-shadow-sm">{trip.title}</h1>
                {trip.description && (
                  <p className="text-white/90 md:text-lg max-w-2xl">
                    {trip.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm md:text-base">
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Icon name="calendar" size={16} />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })} - {new Date(trip.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Icon name="calendar" size={16} />
                    <span>{trip.days.length} {trip.days.length === 1 ? 'day' : 'days'}</span>
                  </div>
                  {trip.theme && (
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className={`w-3 h-3 rounded-full bg-${trip.theme}-500`}></span>
                      <span>{trip.theme.charAt(0).toUpperCase() + trip.theme.slice(1)} theme</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`bg-gradient-to-r from-${trip.theme || 'teal'}-500 to-${trip.theme || 'sky'}-600`}>
            <div className="max-w-7xl mx-auto px-4 py-16 text-white">
              <div className="space-y-3 max-w-3xl">
                {trip.location && (
                  <div className="flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                    <Icon name="location" size={16} />
                    <span>{trip.location}</span>
                  </div>
                )}
                <h1 className="text-3xl md:text-5xl font-bold">{trip.title}</h1>
                {trip.description && (
                  <p className="text-white/90 md:text-lg max-w-2xl">
                    {trip.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm md:text-base">
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Icon name="calendar" size={16} />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })} - {new Date(trip.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Icon name="calendar" size={16} />
                    <span>{trip.days.length} {trip.days.length === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-hidden">
        {/* Controls */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="border-b border-border pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="map" size={24} className="text-primary" />
                <span>Travel Story</span>
              </h2>
              <p className="text-muted-foreground">Your adventure unfolds day by day</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsUploaderVisible(!isUploaderVisible)}
                icon="camera"
                className="border-primary/30 hover:border-primary hover:bg-primary/5"
              >
                Add Photos
              </Button>
              <ExportButton trip={trip} />
            </div>
          </div>
        </div>

        {/* Media Uploader */}
        {isUploaderVisible && (
          <div className="fixed inset-0 bg-background/90 dark:bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 bg-background border border-border rounded-xl shadow-lg my-8 animate-fade-in">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Icon name="camera" size={24} className="text-primary" />
                  <span>Capture Your Memories</span>
                </h3>
                <button 
                  className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
                  onClick={() => setIsUploaderVisible(false)}
                >
                  <Icon name="x" size={20} />
                </button>
              </div>
              <p className="text-muted-foreground mb-6">Add photos to your journey timeline. They'll be organized by date automatically.</p>
              <MediaUploader onUpload={handleUpload} days={trip.days} />
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="w-full overflow-x-hidden pb-12">
          <Timeline trip={trip} onUpdate={handleTripUpdate} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card shadow-inner mt-auto border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center gap-2">
            <Icon name="compass" size={18} className="text-primary" />
            <span className="font-medium text-foreground">Trip Memory Canvas</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/trips/create" className="text-primary hover:underline flex items-center gap-1.5">
              <Icon name="add" size={16} />
              <span>New Journey</span>
            </Link>
            <Link href="/trips" className="text-primary hover:underline flex items-center gap-1.5">
              <Icon name="map" size={16} />
              <span>All Journeys</span>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              icon="arrowUp"
              className="ml-2"
            >
              Back to Top
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
} 