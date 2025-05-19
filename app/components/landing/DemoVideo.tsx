'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import Icon from '../Icon';
import Image from 'next/image';

export default function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  
  // Intersection observer to animate elements when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  const handlePlayVideo = () => {
    setIsPlaying(true);
  };
  
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
            </svg>
            <span>See it in action</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Create. Arrange. <span className="relative">
              <span className="relative z-10">Mesmerize.</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/20 transform -rotate-1 rounded z-0"></span>
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-center">
            Watch how effortlessly your travel moments transform into stunning visual stories
          </p>
        </div>
        
        <div 
          ref={videoRef}
          className="relative rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto opacity-0 translate-y-8 transition-all duration-700 ease-out"
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {!isPlaying ? (
            <div className="relative aspect-video group">
              {/* Video thumbnail with atmospheric overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60 z-10 transition-opacity duration-500 ${isHovered ? 'opacity-30' : 'opacity-60'}`} />
              <div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ 
                transform: isHovered ? 'scale(1.03) rotate(0.5deg)' : 'scale(1) rotate(0deg)'
              }}>
                <Image 
                  src="/images/tokyo-1.jpg" 
                  alt="Create beautiful travel stories" 
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1024px"
                />
              </div>
              
              {/* Interactive play button */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <button 
                  className={`group flex items-center justify-center w-20 h-20 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full text-primary shadow-xl transition-all duration-300 hover:scale-110 ${isHovered ? 'scale-105' : 'scale-100'}`}
                  onClick={handlePlayVideo}
                  aria-label="Play demo video"
                >
                  <svg 
                    className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 4l15 8-15 8V4z" fill="currentColor" />
                  </svg>
                </button>
                <span className={`absolute -bottom-12 text-sm font-medium bg-card px-4 py-2 rounded-full shadow-lg opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}>
                  Play demo (2:15)
                </span>
              </div>
              
              {/* Floating feature cards with motion */}
              <div 
                className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-3 border border-white/20 z-20 hidden md:block transition-transform duration-500"
                style={{ 
                  transform: isHovered ? 'translateY(-10px) rotate(-2deg)' : 'translateY(0) rotate(-3deg)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center">
                    <Icon name="timeline" size={24} className="text-sky-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-black">Magic Layout</p>
                    <p className="text-xs text-gray-700">Auto-arranges your photos perfectly</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="absolute top-8 right-8 bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-3 border border-white/20 z-20 hidden md:block transition-transform duration-500"
                style={{ 
                  transform: isHovered ? 'translateY(10px) rotate(2deg)' : 'translateY(0) rotate(3deg)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Icon name="image" size={24} className="text-teal-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-black">Batch Upload</p>
                    <p className="text-xs text-gray-700">Add hundreds of photos at once</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full relative">
              <iframe 
                className="absolute inset-0 w-full h-full rounded-xl" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1" 
                title="Trip Story Builder Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => window.open('https://docs.yourdomain.com/tutorials', '_blank')}
              className="group inline-flex items-center gap-2 transition-all hover:bg-primary/5"
            >
              <span className="underline decoration-primary/30 decoration-2 underline-offset-4 group-hover:decoration-primary">View full tutorial</span>
              <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
            </Button>
            
            <span className="text-muted-foreground">or</span>
            
            <Button 
              variant="primary" 
              onClick={() => window.location.href = '/trips/create'}
              className="inline-flex items-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform"
            >
              <span>Start creating now</span>
              <Icon name="add" size={18} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 