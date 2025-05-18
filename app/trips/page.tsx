'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTripsList } from '../utils/tripService';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { formatDate } from '../types';
import Image from 'next/image';

// Define proper types for the trip objects
interface TripItem {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate: string;
  updatedAt: string;
  trip: {
    days: Array<{
      items: Array<{
        id: string;
        type: string;
        src?: string;
      }>;
    }>;
  };
}

// Helper function to find the first image in a trip
const getFirstTripImage = (trip: TripItem): string | null => {
  if (!trip?.trip?.days) return null;
  
  for (const day of trip.trip.days) {
    if (!day.items) continue;
    
    const image = day.items.find(item => item.type === 'image');
    if (image && image.src) return image.src;
  }
  
  return null;
};

export default function TripsPage() {
  const [trips, setTrips] = useState<TripItem[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    // Load trips on client-side only
    setTrips(getTripsList() as TripItem[]);
  }, []);
  
  const handleCreateTrip = () => {
    router.push('/trips/create');
  };
  
  const handleViewSampleTrip = () => {
    router.push('/trips/sample-trip');
  };
  
  const handleSelectTrip = (slug: string) => {
    router.push(`/trips/${slug}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95 text-foreground">
      {/* Hero Header */}
      <div className="relative bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent z-10" />
        <div className="relative h-64 w-full overflow-hidden">
          <Image 
            src="/images/map-background.png" 
            alt="World map background"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">Your Travel Stories</h1>
          <p className="text-xl text-white/90 max-w-xl text-center">
            Relive your adventures. Create beautiful moodboards of your journeys.
          </p>
          <div className="mt-8">
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateTrip}
              icon="add"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start a New Journey
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
        {/* Your Trips Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Icon name="compass" size={24} className="text-primary" />
              <span>Your Journeys</span>
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateTrip}
              icon="add"
              className="border-primary/30 hover:border-primary"
            >
              New Journey
            </Button>
          </div>
          
          {trips.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 md:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="map" size={48} className="text-primary/70" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Begin Your Adventure</h3>
                <p className="text-muted-foreground max-w-md mb-8">
                  Capture your travel memories in beautiful moodboards that tell your story.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleCreateTrip}
                    icon="add"
                    className="min-w-[180px]"
                  >
                    Create First Journey
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleViewSampleTrip}
                    icon="eye"
                    className="min-w-[180px]"
                  >
                    Explore Sample Trip
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map(trip => {
                const tripImage = getFirstTripImage(trip);
                
                return (
                  <div 
                    key={trip.id} 
                    className="group border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer bg-card relative h-64"
                    onClick={() => handleSelectTrip(trip.slug)}
                  >
                    {tripImage ? (
                      <>
                        <div className="absolute inset-0 z-0">
                          <div className="relative w-full h-full">
                            <Image 
                              src={tripImage} 
                              alt={trip.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                          </div>
                        </div>
                        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                          <div>
                            <div className="font-bold text-xl mb-2 text-white">{trip.title}</div>
                            <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                              <Icon name="calendar" size={16} />
                              <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/70 bg-black/30 py-1.5 px-3 rounded-full">
                              <span className="hidden sm:inline">Updated </span>{new Date(trip.updatedAt).toLocaleDateString()}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                if (e) e.stopPropagation();
                                handleSelectTrip(trip.slug);
                              }}
                              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-primary/20 hover:border-primary/60 group-hover:bg-primary/40"
                            >
                              Explore Trip
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-6 h-full flex flex-col justify-between bg-gradient-to-b from-primary/5 to-transparent">
                        <div>
                          <div className="font-bold text-xl mb-2">{trip.title}</div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                            <Icon name="calendar" size={16} />
                            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground mt-4 bg-muted/40 rounded-lg p-3">
                            <Icon name="image" size={18} className="text-primary/60" />
                            <span className="text-sm">Add your first photo to this journey</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Updated {new Date(trip.updatedAt).toLocaleDateString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              if (e) e.stopPropagation();
                              handleSelectTrip(trip.slug);
                            }}
                            className="hover:bg-primary/10 hover:text-primary"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Add New Journey Card */}
              <div 
                className="group border border-dashed border-primary/30 rounded-xl overflow-hidden cursor-pointer bg-card/50 hover:bg-card relative h-64 flex items-center justify-center transition-all hover:border-primary"
                onClick={handleCreateTrip}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-primary/5 to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="flex flex-col items-center text-center p-6 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon name="add" size={32} className="text-primary/70" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">New Journey</h3>
                  <p className="text-muted-foreground">
                    Start creating your next adventure
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Featured Sample Trip */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Icon name="star" size={24} className="text-yellow-500" />
              <span>Featured Journey</span>
            </h2>
          </div>
          
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={handleViewSampleTrip}>
            <div className="relative h-80 md:h-96 w-full">
              <Image 
                src="/images/tokyo-1.jpg" 
                alt="Sample Trip"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-blue-600/80 text-white text-xs rounded-full backdrop-blur-sm mb-4">
                  Featured Sample
                </span>
                <h3 className="text-3xl font-bold text-white mb-3">Summer in Japan</h3>
                <p className="text-white/90 max-w-lg mb-6">
                  Explore a beautiful 10-day journey through Tokyo, Kyoto, and Osaka. See how to organize your photos, notes, and memories into a stunning moodboard.
                </p>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleViewSampleTrip}
                  icon="compass"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 hover:border-white/40"
                >
                  Explore This Journey
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tips Section */}
        <section className="mt-16 bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Icon name="idea" size={24} className="text-primary" />
            <span>Travel Inspiration</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-primary/5 rounded-lg">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Icon name="camera" size={20} className="text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Capture Moments</h3>
              <p className="text-muted-foreground text-sm">Take photos that tell a story. Focus on details that make each place special and meaningful to you.</p>
            </div>
            
            <div className="p-5 bg-primary/5 rounded-lg">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Icon name="note" size={20} className="text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Journal Your Thoughts</h3>
              <p className="text-muted-foreground text-sm">Add brief notes and reflections. Future you will appreciate remembering how you felt in those moments.</p>
            </div>
            
            <div className="p-5 bg-primary/5 rounded-lg">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Icon name="download" size={20} className="text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Share Your Stories</h3>
              <p className="text-muted-foreground text-sm">Export your journeys as beautiful moodboards to share with friends or print as keepsakes.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8 flex flex-wrap justify-between items-center text-sm text-muted-foreground gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="flex items-center gap-2">
              <Icon name="compass" size={18} className="text-primary" />
              <span className="font-medium text-foreground">Trip Moodboard</span>
            </div>
            <div className="hidden sm:block">•</div>
            <span>Crafting beautiful travel memories</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCreateTrip}
              icon="add"
              className="hover:bg-primary/10 hover:text-primary"
            >
              Start a New Journey
            </Button>
          </div>
        </div>
      </footer>
      
      {/* Add additional styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 