'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trip } from '../../types';
import TripCreator from '../../components/TripCreator';
import Link from 'next/link';
import { saveTrip } from '../../utils/tripService';

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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto p-4 flex items-center">
          <Link href="/trips" className="text-muted-foreground hover:text-foreground font-medium">
            ← Back to Trips
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <TripCreator
          onTripCreated={handleTripCreated}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
} 