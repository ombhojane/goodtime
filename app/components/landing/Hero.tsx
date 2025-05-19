'use client';

import { useRouter } from 'next/navigation';
import Button from '../Button';
import Image from 'next/image';

export default function Hero() {
  const router = useRouter();
  
  const handleCreateTrip = () => {
    router.push('/trips/create');
  };
  
  const handleViewDemo = () => {
    router.push('/trips/sample-trip');
  };
  
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Immersive background with animated elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-400/5 to-sky-500/5"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-sky-400/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 40 10 M 10 0 L 10 40" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
              <span className="mr-2">✨</span>
              <span>Reimagine your travel memories</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Your <span className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500">journey</span>
                <span className="absolute -bottom-2 left-0 right-0 h-4 bg-primary/10 transform -rotate-1 rounded"></span>
              </span><br />
              brought to <span className="animate-pulse">life</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Don&apos;t just document. <span className="font-semibold">Create, curate, and captivate</span> with immersive visual stories that make memories unforgettable.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleCreateTrip}
                icon="add"
                className="shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform"
              >
                Start Creating
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleViewDemo}
                className="hover:-translate-y-1 transition-transform"
              >
                See Magic in Action
              </Button>
            </div>
            
            {/* Social proof */}
            <div className="mt-12 flex items-center justify-center lg:justify-start">
              <div className="flex -space-x-3 mr-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-xs font-medium">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">1,000+</span> travel stories created this week</p>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            {/* 3D-style image composition */}
            <div className="relative h-[500px] w-full perspective-1000">
              <div className="absolute top-0 right-0 w-[80%] h-[60%] rounded-xl overflow-hidden shadow-2xl transform rotate-2 transition-transform hover:rotate-1 hover:scale-105 z-20">
                <Image 
                  src="/images/tokyo-1.jpg" 
                  alt="Travel mood board" 
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-lg px-3 py-2 text-sm font-medium text-black">
                  Day 3: Tokyo, Japan
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-[70%] h-[65%] rounded-xl overflow-hidden shadow-2xl transform -rotate-3 transition-transform hover:rotate-0 hover:scale-105 z-10">
                <Image 
                  src="/images/kyoto-1.jpg" 
                  alt="Trip timeline" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-lg px-3 py-2 text-sm font-medium text-black">
                  Day 5: Kyoto, Japan
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/20 rounded-full blur-xl z-0"></div>
              <div className="absolute -bottom-6 right-12 w-32 h-6 bg-black/10 rounded-full blur-md z-0"></div>
            </div>
            
            {/* Floating label */}
            <div className="absolute -top-6 -right-4 bg-card shadow-lg rounded-full py-2 px-4 text-sm font-medium border border-border animate-bounce z-30">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                New: AI Memory Curator
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 