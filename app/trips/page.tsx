'use client';

import { useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getTripsList } from '../utils/tripService';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { formatDate } from '../types';
import Image from 'next/image';

// Helper function to find the first image in a trip
const getFirstTripImage = (trip: any): string | null => {
  if (!trip?.trip?.days) return null;
  
  for (const day of trip.trip.days) {
    if (!day.items) continue;
    
    const image = day.items.find((item: any) => item.type === 'image');
    if (image) return image.src;
  }
  
  return null;
};

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    // Load trips on client-side only
    setTrips(getTripsList());
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500">
            Trip Moodboard Builder
          </h1>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateTrip}
              icon="add"
            >
              Create New Trip
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-xl font-medium mb-4">Your Trips</h2>
            
            {trips.length === 0 ? (
              <div className="text-center p-10 border border-dashed border-border rounded-lg">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Icon name="location" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No trips yet</h3>
                <p className="text-muted-foreground mb-6">Create your first trip or check out our sample trip</p>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="primary"
                    onClick={handleCreateTrip}
                  >
                    Create New Trip
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleViewSampleTrip}
                  >
                    View Sample Trip
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trips.map(trip => {
                  const tripImage = getFirstTripImage(trip);
                  
                  return (
                    <div 
                      key={trip.id} 
                      className="border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-soft-hover transition-all duration-200 cursor-pointer bg-card relative h-56"
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
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                            </div>
                          </div>
                          <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between">
                            <div>
                              <div className="font-medium text-lg mb-1 text-white">{trip.title}</div>
                              <div className="text-white/80 text-sm mb-1">
                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-white/70 bg-black/30 py-1 px-2 rounded-full">
                                Updated {new Date(trip.updatedAt).toLocaleDateString()}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e: MouseEvent<Element>) => {
                                  e.stopPropagation();
                                  handleSelectTrip(trip.slug);
                                }}
                                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                              >
                                Open Trip
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-4 h-full flex flex-col justify-between">
                          <div>
                            <div className="font-medium text-xl mb-2">{trip.title}</div>
                            <div className="text-muted-foreground text-sm mb-3">
                              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mt-2">
                              <Icon name="image" size={16} />
                              <span className="text-xs">No photos yet</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              Updated {new Date(trip.updatedAt).toLocaleDateString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e: MouseEvent<Element>) => {
                                e.stopPropagation();
                                handleSelectTrip(trip.slug);
                              }}
                            >
                              Open
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-medium mb-4">Sample Trip</h2>
            <div className="md:max-w-md">
              <div 
                className="border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-soft-hover transition-all duration-200 cursor-pointer bg-card relative h-56"
                onClick={handleViewSampleTrip}
              >
                <div className="absolute inset-0 z-0">
                  <div className="relative w-full h-full">
                    <Image 
                      src="/images/tokyo-1.jpg" 
                      alt="Sample Trip"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 384px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10" />
                  </div>
                </div>
                <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between">
                  <div>
                    <div className="font-medium text-lg mb-1 text-white">Summer in Japan</div>
                    <div className="text-white/80 text-sm mb-1">
                      Jul 10, 2023 - Jul 20, 2023
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 bg-blue-600/70 text-white rounded-full backdrop-blur-sm">
                      Sample Trip
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e: MouseEvent<Element>) => {
                        e.stopPropagation();
                        handleViewSampleTrip();
                      }}
                      className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                    >
                      View Trip
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card shadow-inner mt-auto border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-sm text-muted-foreground">
          <div>Trip Moodboard Builder</div>
          <div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCreateTrip}
            >
              Create New Trip
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
} 