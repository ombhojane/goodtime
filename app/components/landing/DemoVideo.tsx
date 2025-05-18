'use client';

import { useState } from 'react';
import Button from '../Button';
import Icon from '../Icon';

export default function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayVideo = () => {
    setIsPlaying(true);
  };
  
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create beautiful visual timelines of your adventures in just a few clicks
          </p>
        </div>
        
        <div className="relative rounded-xl overflow-hidden shadow-xl border border-border bg-card aspect-video max-w-4xl mx-auto">
          {!isPlaying ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative w-full h-full">
                {/* Video thumbnail image */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10" />
                <img 
                  src="/images/tokyo-1.jpg" 
                  alt="Video thumbnail" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <button 
                    className="flex items-center justify-center w-20 h-20 bg-primary/90 hover:bg-primary rounded-full text-white transition-all transform hover:scale-105"
                    onClick={handlePlayVideo}
                    aria-label="Play demo video"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                
                {/* Floating UI elements showing app features */}
                <div className="absolute bottom-8 left-8 bg-card shadow-lg rounded-lg p-3 border border-border z-20 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="timeline" size={20} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Drag &amp; Drop</p>
                      <p className="text-xs text-muted-foreground">Reorder your memories easily</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-8 right-8 bg-card shadow-lg rounded-lg p-3 border border-border z-20 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="image" size={20} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Easy Uploads</p>
                      <p className="text-xs text-muted-foreground">Add multiple photos at once</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <iframe 
              className="absolute inset-0 w-full h-full" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="Trip Moodboard Builder Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.open('https://docs.yourdomain.com/tutorials', '_blank')}
            className="inline-flex items-center gap-2"
          >
            <span>View Tutorial</span>
            <Icon name="arrow-right" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
} 