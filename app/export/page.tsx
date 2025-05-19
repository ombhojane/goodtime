'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trip } from '../types';
import { getTripById } from '../utils/tripService';
import { exportTimelineAsImages, exportTimelineAsPDF } from '../utils/exportUtils';
import Button from '../components/Button';
import Timeline from '../components/Timeline';
import Link from 'next/link';
import Icon from '../components/Icon';
import Image from 'next/image';
import TripVideoExport from '../components/TripVideoExport';

// Loading component for Suspense fallback
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <div className="mb-4">Loading your journey...</div>
      </div>
    </div>
  );
}

// Main component content that uses useSearchParams
function ExportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [exportFormat, setExportFormat] = useState<'image' | 'pdf'>('image');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isVideoExport, setIsVideoExport] = useState(false);

  useEffect(() => {
    const tripId = searchParams?.get('tripId');
    if (!tripId) {
      router.push('/trips');
      return;
    }

    const tripData = getTripById(tripId);
    if (!tripData) {
      router.push('/trips');
      return;
    }

    setTrip(tripData);
    
    // Check if this is a video export
    const exportType = searchParams?.get('type');
    if (exportType === 'video') {
      setIsVideoExport(true);
    }
  }, [searchParams, router]);
  
  // Show confetti when export is complete
  useEffect(() => {
    if (exportProgress === 100) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [exportProgress]);

  const handleExport = async () => {
    if (!trip) return;

    try {
      setIsExporting(true);
      setExportProgress(10);
      setExportStatus('Preparing your memories...');

      // Create progress handler
      const updateProgress = (progress: number) => {
        setExportProgress(progress);
        
        // Update status based on progress
        if (progress < 30) {
          setExportStatus('Gathering your travel moments...');
        } else if (progress < 70) {
          setExportStatus('Crafting your story...');
        } else if (progress < 95) {
          setExportStatus(exportFormat === 'image' 
            ? 'Adding final touches to your masterpiece...' 
            : 'Creating pages of memories...');
        } else {
          setExportStatus(exportFormat === 'image' 
            ? 'Your travel story is ready to share!' 
            : 'Your travel book is ready!');
        }
      };

      if (exportFormat === 'image') {
        // Use the progress callback for image export too
        await exportTimelineAsImages(trip, updateProgress);
      } else {
        // For PDF, we continue using the progress callback
        await exportTimelineAsPDF(trip, updateProgress);
      }

      // Keep the completion message visible for a moment
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportStatus('');
      }, 5000);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('We couldn\'t package your travel memories. Let\'s try again!');
      setIsExporting(false);
      setExportProgress(0);
      setExportStatus('Something went wrong with your travel story');
    }
  };

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <div className="mb-4">Finding your journey...</div>
          <Link href="/trips" className="text-primary hover:underline">
            Back to Your Adventures
          </Link>
        </div>
      </div>
    );
  }

  // Find a cover image from the trip
  const getCoverImage = () => {
    for (const day of trip.days) {
      const image = day.items.find(item => item.type === 'image');
      if (image) return image.src;
    }
    return '/images/default-cover.jpg';
  };
  
  const coverImage = getCoverImage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90 text-foreground">
      {/* Hero header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-10" />
        <div className="relative h-64 w-full overflow-hidden">
          <Image 
            src={coverImage} 
            alt="Trip memories"
            fill
            className="object-cover opacity-80"
            priority
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">Preserve Your Journey</h1>
          <p className="text-lg text-white/90 max-w-xl text-center px-4">
            Turn your {trip.title} adventure into a keepsake you can revisit anytime
          </p>
        </div>
        <div className="absolute top-4 left-4 z-30">
                    <Link    href="/trips"            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm"          >
            <Icon name="arrowLeft" size={16} />
            <span>Back to Trip</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto p-6 md:p-8">
        {isVideoExport ? (
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="play" size={24} className="text-primary" />
                <span>Create Video Story</span>
              </h2>
              <p className="text-muted-foreground">Generate a beautiful video from your trip memories</p>
            </div>
            
            <TripVideoExport trip={trip} />
            
            <div className="mt-8 flex justify-center">
              <Link 
                href={`/trips/${trip.id}`}
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Icon name="arrowLeft" size={16} />
                <span>Return to Trip</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Side: Export Options */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border">
                  <h2 className="text-2xl font-bold">How will you remember this journey?</h2>
                  <p className="text-muted-foreground mt-2">Choose your perfect memento format</p>
                </div>
                
                <div className="p-6">
                  {/* Format Selection */}
                  <div className="space-y-4">
                    <label className={`
                      relative block p-4 rounded-xl transition-all cursor-pointer
                      ${exportFormat === 'image' 
                        ? 'bg-primary/10 border-2 border-primary ring-1 ring-primary'
                        : 'border border-border hover:border-primary/50'}
                    `}>
                      <input
                        type="radio"
                        name="format"
                        className="sr-only"
                        checked={exportFormat === 'image'}
                        onChange={() => setExportFormat('image')}
                      />
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Icon name="image" size={28} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-lg">Story Canvas</span>
                            {exportFormat === 'image' && (
                              <Icon name="check" size={20} className="text-primary" />
                            )}
                          </div>
                          <p className="text-sm mt-1 text-muted-foreground">One beautiful image that tells your whole trip story</p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-primary/80">
                            <Icon name="star" size={14} />
                            <span>Perfect for social media</span>
                          </div>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`
                      relative block p-4 rounded-xl transition-all cursor-pointer
                      ${exportFormat === 'pdf' 
                        ? 'bg-primary/10 border-2 border-primary ring-1 ring-primary'
                        : 'border border-border hover:border-primary/50'}
                    `}>
                      <input
                        type="radio"
                        name="format"
                        className="sr-only"
                        checked={exportFormat === 'pdf'}
                        onChange={() => setExportFormat('pdf')}
                      />
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Icon name="download" size={28} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-lg">Travel Book</span>
                            {exportFormat === 'pdf' && (
                              <Icon name="check" size={20} className="text-primary" />
                            )}
                          </div>
                          <p className="text-sm mt-1 text-muted-foreground">Multi-page document showcasing each day&apos;s adventures</p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-primary/80">
                            <Icon name="printer" size={14} />
                            <span>Great for printing and sharing via email</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  {/* Export button */}
                  <div className="mt-8">
                  <Button 
                    variant={isExporting ? "outline" : "primary"}
                    onClick={handleExport}
                    disabled={isExporting}
                    icon={isExporting ? "loader" : exportFormat === 'image' ? 'image' : 'download'}
                    className={`w-full py-6 text-lg ${isExporting ? '' : 'animate-pulse-slow hover:animate-none'}`}
                  >
                    {isExporting 
                      ? 'Creating your memento...' 
                      : exportFormat === 'image' 
                                              ? 'Create Your Visual Story' 
                      : 'Create Your Travel Book'}
                  </Button>
                  
                  {/* Progress bar & status */}
                  {isExporting && (
                    <div className="mt-6 space-y-3">
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500 ease-out"
                          style={{ width: `${exportProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-center font-medium">
                        {exportStatus}
                      </p>
                    </div>
                  )}
                  
                  {/* Completed feedback */}
                  {showConfetti && (
                    <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-xl animate-fade-in">
                      <div className="flex gap-3 items-center">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <Icon name="check" size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Your journey is ready!</p>
                          <p className="text-sm text-muted-foreground">Check your downloads folder</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side: Preview */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Preview Your Memories</h2>
                  <p className="text-muted-foreground mt-1">This is how your journey will be preserved</p>
                </div>
                <div className="hidden md:block">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    exportFormat === 'image' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }`}>
                    {exportFormat === 'image' ? 'Story Canvas' : 'Travel Book'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="bg-gradient-to-b from-muted/30 to-transparent backdrop-blur-sm border border-border rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h1 className="text-3xl font-bold">{trip.title}</h1>
                    <p className="text-muted-foreground mt-1">
                      {new Date(trip.startDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })} - {new Date(trip.endDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div 
                    ref={timelineRef}
                    className="max-h-[500px] overflow-y-auto relative"
                  >
                    <div className="timeline-preview p-4">
                      <Timeline trip={trip} onUpdate={() => {}} isReadOnly={true} />
                    </div>
                    
                    {/* Blur overlay to indicate there's more content */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon name="info" size={14} />
                    <span>Your {exportFormat === 'image' ? 'image' : 'PDF'} will include all photos and notes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex flex-wrap justify-between items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">In the Motion</span>
            <span>•</span>
            <span>Preserve your travel memories forever</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={`/trips/${trip.id}`} className="text-primary hover:underline">
              Back to Journey
            </Link>
          </div>
        </div>
      </footer>
      
      {/* Confetti effect on completion */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute -top-10 left-0 w-full animate-fall-slow opacity-20">
            <div className="absolute top-0 left-1/4 w-1 h-1 bg-primary rounded-full"></div>
            <div className="absolute top-0 left-1/3 w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            <div className="absolute top-0 left-2/3 w-1 h-1 bg-green-500 rounded-full"></div>
            <div className="absolute top-0 left-3/4 w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
          <div className="absolute -top-14 left-0 w-full animate-fall-medium opacity-30">
            <div className="absolute top-0 left-1/5 w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
            <div className="absolute top-0 left-2/5 w-1 h-1 bg-teal-400 rounded-full"></div>
            <div className="absolute top-0 left-3/5 w-2 h-2 bg-primary rounded-full"></div>
            <div className="absolute top-0 left-4/5 w-1 h-1 bg-orange-500 rounded-full"></div>
          </div>
          <div className="absolute -top-20 left-0 w-full animate-fall-fast opacity-20">
            <div className="absolute top-0 left-1/6 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="absolute top-0 left-1/3 w-1 h-1 bg-yellow-500 rounded-full"></div>
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
            <div className="absolute top-0 left-2/3 w-2 h-2 bg-pink-400 rounded-full"></div>
            <div className="absolute top-0 left-5/6 w-1 h-1 bg-green-500 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Add additional styles to the main CSS file or include here */}
      <style jsx global>{`
        @keyframes fall-slow {
          0% { transform: translateY(-5vh); }
          100% { transform: translateY(105vh); }
        }
        @keyframes fall-medium {
          0% { transform: translateY(-5vh); }
          100% { transform: translateY(105vh); }
        }
        @keyframes fall-fast {
          0% { transform: translateY(-5vh); }
          100% { transform: translateY(105vh); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-fall-slow {
          animation: fall-slow 7s linear infinite;
        }
        .animate-fall-medium {
          animation: fall-medium 5s linear infinite;
        }
        .animate-fall-fast {
          animation: fall-fast 3s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Main export page component with Suspense boundary
export default function ExportPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExportContent />
    </Suspense>
  );
} 