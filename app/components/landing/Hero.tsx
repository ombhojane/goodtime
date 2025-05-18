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
    <section className="relative bg-gradient-to-b from-background to-background/90">
      {/* Background pattern/decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-teal-300/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-sky-300/30 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 sm:pt-32 sm:pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="block text-foreground">Craft your journey,</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500">
                capture the moments
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Build beautiful visual stories of your travels with our interactive moodboard timeline builder. Organize, design, and share your adventures like never before.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleCreateTrip}
                icon="add"
              >
                Create Your Trip
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleViewDemo}
              >
                View Demo
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative h-[400px] sm:h-[500px] w-full">
              <div className="absolute top-0 right-0 w-[90%] h-[90%] rounded-lg overflow-hidden shadow-2xl">
                <Image 
                  src="/images/tokyo-1.jpg" 
                  alt="Travel mood board" 
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-[70%] h-[70%] rounded-lg overflow-hidden shadow-2xl">
                <Image 
                  src="/images/kyoto-1.jpg" 
                  alt="Trip timeline" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-card shadow-lg rounded-full py-2 px-4 text-sm font-medium border border-border">
              New: AI Photo Organization
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider to next section */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" className="w-full h-auto fill-muted/30">
          <path d="M0,0L60,5.3C120,11,240,21,360,26.7C480,32,600,32,720,29.3C840,27,960,21,1080,16C1200,11,1320,5,1380,2.7L1440,0L1440,60L0,60Z"></path>
        </svg>
      </div>
    </section>
  );
} 