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
  if (!trip?.days) return null;
  
  for (const day of trip.days) {
    if (!day.items) continue;
    
    const image = day.items.find(item => item.type === 'image');
    if (image) return image.src;
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
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Link href="/trips" className="text-muted-foreground hover:text-foreground font-medium">
            ← Back to Trips
          </Link>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteTrip}
              title="Delete this trip"
              icon="trash"
            >
              Delete Trip
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Trip Header */}
      <div className="relative">
        {coverImage ? (
          <div className="relative h-48 md:h-64 w-full overflow-hidden">
            <Image
              src={coverImage}
              alt={trip.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
            <div className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-4 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{trip.title}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Icon name="location" size={18} />
                  <span>{trip.days.length} days</span>
                </div>
                <span>•</span>
                <div>
                  {new Date(trip.startDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} - {new Date(trip.endDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-teal-500 to-sky-500">
            <div className="max-w-7xl mx-auto px-4 py-12 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{trip.title}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Icon name="location" size={18} />
                  <span>{trip.days.length} days</span>
                </div>
                <span>•</span>
                <div>
                  {new Date(trip.startDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} - {new Date(trip.endDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Controls */}
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Trip Timeline</h2>

          <div className="flex gap-2">
            <ExportButton trip={trip} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploaderVisible(!isUploaderVisible)}
              icon="upload"
            >
              Upload Photos
            </Button>
          </div>
        </div>

        {/* Media Uploader */}
        {isUploaderVisible && (
          <div className="fixed inset-0 bg-background/90 dark:bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 bg-background border border-border rounded-lg shadow-lg my-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Upload Photos</h3>
                <button 
                  className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
                  onClick={() => setIsUploaderVisible(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <MediaUploader onUpload={handleUpload} days={trip.days} />
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-4">
          <Timeline trip={trip} onUpdate={handleTripUpdate} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card shadow-inner mt-auto border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-sm text-muted-foreground">
          <div>Trip Moodboard Builder</div>
          <div className="flex items-center gap-4">
            <Link href="/trips/create" className="text-primary hover:underline">
              Create New Trip
            </Link>
            <Link href="/trips" className="text-primary hover:underline">
              All Trips
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 