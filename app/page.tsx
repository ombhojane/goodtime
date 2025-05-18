'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Timeline from './components/Timeline';
import MediaUploader from './components/MediaUploader';
import TripCreator from './components/TripCreator';
import Button from './components/Button';
import ExportButton from './components/ExportButton';
import { Trip, MediaItem, formatDate } from './types';
import { generateId } from './utils';

// Sample trip data directly in the component
const sampleTrip: Trip = {
  id: generateId(),
  title: "Summer in Japan",
  startDate: "2023-07-10",
  endDate: "2023-07-20",
  days: [
    {
      date: "2023-07-10",
      items: [
        {
          id: generateId(),
          src: "/images/tokyo-1.jpg", // User will add their own images
          type: "image",
          timestamp: "2023-07-10T09:30:00Z",
          location: {
            name: "Shibuya Crossing, Tokyo"
          },
          caption: "Arrived in Tokyo! The famous Shibuya crossing is even busier than I expected."
        }
      ],
      stickers: [
        {
          id: generateId(),
          type: "emoji",
          content: "✈️",
          position: { x: 20, y: 30 },
          style: { rotate: -15, scale: 1.2 }
        }
      ]
    },
    {
      date: "2023-07-12",
      items: [
        {
          id: generateId(),
          src: "/images/kyoto-1.jpg", // User will add their own images
          type: "image",
          timestamp: "2023-07-12T14:20:00Z",
          location: {
            name: "Fushimi Inari Shrine, Kyoto"
          },
          caption: "The path of a thousand torii gates was breathtaking!"
        }
      ],
      stickers: [
        {
          id: generateId(),
          type: "text",
          content: "Kyoto Vibes",
          position: { x: 70, y: 50 },
          style: { rotate: 5, scale: 1 }
        }
      ]
    },
    {
      date: "2023-07-15",
      items: [
        {
          id: generateId(),
          src: "/images/osaka-1.jpg", // User will add their own images
          type: "image",
          timestamp: "2023-07-15T20:00:00Z",
          location: {
            name: "Dotonbori, Osaka"
          },
          caption: "Amazing street food in Osaka's food district!"
        }
      ],
      stickers: [
        {
          id: generateId(),
          type: "emoji",
          content: "🍜",
          position: { x: 80, y: 20 },
          style: { rotate: 0, scale: 1.5 }
        }
      ]
    }
  ],
  theme: "teal"
};

export default function Home() {
  const { theme, isDark } = useTheme();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isUploaderVisible, setIsUploaderVisible] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  // Use sample trip when no trip is created yet (for demo purposes)
  useEffect(() => {
    const savedTrip = localStorage.getItem('currentTrip');
    if (savedTrip) {
      setTrip(JSON.parse(savedTrip));
    }
  }, []);

  const handleTripUpdate = (updatedTrip: Trip) => {
    setTrip(updatedTrip);
    localStorage.setItem('currentTrip', JSON.stringify(updatedTrip));
  };

  const handleTripCreate = (newTrip: Trip) => {
    setTrip(newTrip);
    setIsCreatingTrip(false);
    localStorage.setItem('currentTrip', JSON.stringify(newTrip));
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

    // Update trip state
    handleTripUpdate(updatedTrip);
    setIsUploaderVisible(false);
  };

  // If no trip exists, show the trip creator
  if (!trip && !isCreatingTrip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center mb-8 max-w-lg">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500">Trip Moodboard Builder</h1>
          <p className="text-muted-foreground mb-6">
            Create visual timelines of your trips with photos, stickers, and memories.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsCreatingTrip(true)}
            >
              Create New Trip
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setTrip(sampleTrip);
                localStorage.setItem('currentTrip', JSON.stringify(sampleTrip));
              }}
            >
              See Demo Trip
            </Button>
          </div>
        </div>
        
        {/* Preview Image */}
        <div className="relative w-full max-w-3xl h-64 rounded-xl overflow-hidden shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-sky-500/20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg font-medium">Trip Timeline Preview</p>
          </div>
        </div>
      </div>
    );
  }

  // Show the trip creator form
  if (isCreatingTrip) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <TripCreator
          onTripCreated={handleTripCreate}
          onCancel={() => setIsCreatingTrip(false)}
        />
      </div>
    );
  }

  // Show the main trip interface
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header trip={trip!} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Controls */}
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Trip Timeline</h2>

          <div className="flex gap-2">
            <ExportButton trip={trip!} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploaderVisible(!isUploaderVisible)}
              icon="upload"
            >
              Upload Photos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("Create a new trip? This will clear your current trip.")) {
                  setIsCreatingTrip(true);
                }
              }}
            >
              New Trip
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
              <MediaUploader onUpload={handleUpload} days={trip!.days} />
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-4">
          <Timeline trip={trip!} onUpdate={handleTripUpdate} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card shadow-inner mt-auto border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-sm text-muted-foreground">
          <div>Trip Moodboard Builder</div>
          <div>
            {trip?.days.length} days • {trip?.title} • {trip ? formatDate(trip.startDate) : ''}
          </div>
        </div>
      </footer>
    </div>
  );
}
