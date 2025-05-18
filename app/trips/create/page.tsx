'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trip } from '../../types';
import TripCreator from '../../components/TripCreator';
import Link from 'next/link';
import { saveTrip } from '../../utils/tripService';
import Icon from '../../components/Icon';
import Image from 'next/image';

export default function CreateTripPage() {
  const router = useRouter();
  
  const handleTripCreated = (newTrip: Trip) => {
    // Save the trip and get its slug for navigation
    const tripSlug = saveTrip(newTrip);
    router.push(`/trips/${tripSlug}`);
  };
  
  const handleCancel = () => {
    router.push('/trips');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95 text-foreground">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-10"></div>
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src="/images/travel-map.jpg"
            alt="Travel planning background"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <Link href="/trips" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
              <Icon name="arrowLeft" size={16} />
              <span>Back to Trips</span>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Start Your Journey</h1>
            <p className="text-white/80 max-w-lg mx-auto">Create your travel plan and collect memories that will last a lifetime</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 -mt-10 relative z-30">
        <div className="max-w-6xl mx-auto">
          <TripCreator
            onTripCreated={handleTripCreated}
            onCancel={handleCancel}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="compass" size={16} className="text-primary" />
            <span className="font-medium text-foreground">Trip Moodboard</span>
          </div>
        </div>
      </footer>
    </div>
  );
} 