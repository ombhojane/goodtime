'use client';

import { useRouter } from 'next/navigation';
import Button from '../Button';
import Icon from '../Icon';

export default function CTA() {
  const router = useRouter();
  
  const handleGetStarted = () => {
    router.push('/trips/create');
  };
  
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-sky-500/5 to-background"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="md:grid md:grid-cols-5">
            {/* Left decorative column with pattern */}
            <div className="hidden md:block md:col-span-2 relative bg-gradient-to-br from-teal-500/20 to-sky-500/20">
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="3" r="1.5" fill="currentColor" className="text-white/10" />
                  </pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
                </svg>
              </div>
              
              {/* Images floating over the pattern */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-lg shadow-lg overflow-hidden border-4 border-white/20 rotate-6">
                <img src="/images/kyoto-1.jpg" alt="Travel memory" className="w-full h-full object-cover" />
              </div>
              
              <div className="absolute top-2/3 left-3/4 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-lg shadow-lg overflow-hidden border-4 border-white/20 -rotate-12">
                <img src="/images/osaka-1.jpg" alt="Travel memory" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Right content column */}
            <div className="p-8 md:p-12 col-span-3">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Start Creating Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500">Travel Story</span> Today
                </h2>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                  Bring your travel memories to life with our beautiful timeline maker. It's free to get started!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGetStarted}
                    icon="add"
                    className="min-w-[160px]"
                  >
                    Get Started
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push('/trips/sample-trip')}
                    className="min-w-[160px]"
                  >
                    View Demo
                  </Button>
                </div>
                
                <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Icon name="check" size={20} className="text-teal-500" />
                    <span className="text-sm">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="check" size={20} className="text-teal-500" />
                    <span className="text-sm">Free storage up to 500MB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="check" size={20} className="text-teal-500" />
                    <span className="text-sm">Export to PNG & PDF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 