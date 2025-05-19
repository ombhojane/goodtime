'use client';

import { useRouter } from 'next/navigation';
import Button from '../Button';
import Icon from '../Icon';
import Image from 'next/image';

export default function CTA() {
  const router = useRouter();
  
  const handleGetStarted = () => {
    router.push('/trips/create');
  };
  
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background/90"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-br from-card/80 to-card backdrop-blur-md border border-border/40 rounded-3xl overflow-hidden shadow-xl">
          <div className="md:grid md:grid-cols-5">
            {/* Left decorative column with interactive elements */}
            <div className="hidden md:block md:col-span-2 relative bg-gradient-to-br from-primary/10 to-sky-500/10 h-full">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-full h-full">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/5" />
                      </pattern>
                      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)" />
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/10" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              </div>
              
              {/* Interactive floating photos */}
              <div className="h-full flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute top-0 left-0 w-40 h-40 transform -translate-x-1/4 -translate-y-1/4">
                    <div className="w-full h-full relative rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg rotate-6 hover:rotate-3 transition-transform duration-500">
                      <Image 
                        src="/images/kyoto-temple.jpg" 
                        alt="Travel memory" 
                        className="object-cover"
                        fill
                        sizes="160px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/30 backdrop-blur-sm rounded px-2 py-1">Kyoto Gardens</div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 right-0 w-48 h-48 transform translate-x-1/4 translate-y-1/4">
                    <div className="w-full h-full relative rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg -rotate-12 hover:-rotate-6 transition-transform duration-500">
                      <Image 
                        src="/images/tokyo-dinner.jpg" 
                        alt="Travel memory" 
                        className="object-cover"
                        fill
                        sizes="192px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/30 backdrop-blur-sm rounded px-2 py-1">Osaka Street Food</div>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 right-1/4 w-36 h-36 transform -translate-y-1/2">
                    <div className="w-full h-full relative rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg rotate-12 hover:rotate-6 transition-transform duration-500">
                      <Image 
                        src="/images/tokyo-1.jpg" 
                        alt="Travel memory" 
                        className="object-cover"
                        fill
                        sizes="144px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/30 backdrop-blur-sm rounded px-2 py-1">Tokyo Skyline</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right content column */}
            <div className="p-8 md:p-14 col-span-3">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                  <span className="mr-2">⚡</span>
                  <span>Limited time offer</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Turn Memories into <span className="relative">
                    <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500">Masterpieces</span>
                    <span className="absolute bottom-1 left-0 right-0 h-3 bg-primary/10 transform -rotate-1 rounded"></span>
                  </span>
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-md">
                  Start your story today and get <span className="font-semibold text-foreground">unlimited storage for 30 days</span>. No credit card required.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 mb-10 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGetStarted}
                    icon="add"
                    className="min-w-[200px] shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform px-8 text-base"
                  >
                    Start Creating
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push('/trips/sample-trip')}
                    className="min-w-[200px] hover:-translate-y-1 transition-transform px-8 text-base group"
                  >
                    <span>See Demo</span>
                    <Icon name="arrow-right" size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
                
                <div className="border-t border-border/50 pt-6 w-full">
                  <p className="text-sm font-medium mb-4">Trusted by travelers worldwide:</p>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg key={star} className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm">4.9/5 (2.3k reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Icon name="check" size={18} className="text-teal-500" />
                      <span className="text-sm">Free storage up to 1GB</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Icon name="check" size={18} className="text-teal-500" />
                      <span className="text-sm">High-quality exports</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Icon name="check" size={18} className="text-teal-500" />
                      <span className="text-sm">Cancel anytime</span>
                    </div>
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