'use client';

import { useState, useRef } from 'react';
import Button from '../Button';
import Icon from '../Icon';

export default function DemoVideo() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
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
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-center mb-12">
            Watch how effortlessly your travel moments transform into stunning visual stories
          </p>
        </div>
        
        {/* Simple direct video player */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <video 
            ref={videoRef}
            className="w-full aspect-video rounded-xl" 
            autoPlay
            muted
            loop
            playsInline
            poster="/images/tokyo-1.jpg"
          >
            <source src="/videos/demo.mp4" type="video/mp4" />
            <source src="/videos/demo.webm" type="video/webm" />
            <p className="flex items-center justify-center h-full bg-black text-white p-4">
              Your browser doesn&apos;t support HTML5 video. Here&apos;s a 
              <a href="/videos/demo.mp4" className="text-primary mx-1">link to the video</a> 
              instead.
            </p>
          </video>
          
          {/* Sound toggle button */}
          <button 
            onClick={toggleSound}
            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            <Icon name={isMuted ? "volume-x" : "volume-2"} size={20} />
          </button>
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