'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/trips');
  }, [router]);
  
  // Display a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500">
          Trip Moodboard Builder
        </h1>
        <div className="mb-4">Redirecting to app...</div>
      </div>
    </div>
  );
}
