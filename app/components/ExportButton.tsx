'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { Trip } from '../types';
import Icon from './Icon';

interface ExportButtonProps {
  trip: Trip;
}

export default function ExportButton({ trip }: ExportButtonProps) {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleExportVisualStory = () => {
    setIsExporting(true);
    // Navigate to export page with trip ID
    router.push(`/export?tripId=${trip.id}`);
    setIsOpen(false);
  };
  
  const handleGenerateVideo = () => {
    setIsExporting(true);
    // Navigate to export page with trip ID and video flag
    router.push(`/export?tripId=${trip.id}&type=video`);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="primary"
        size="md"
        icon="download"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        title="Export options"
        className="gap-1.5"
      >
        <span>Export</span>
        <Icon name="chevronDown" size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="py-1">
            <button
              onClick={handleExportVisualStory}
              className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors"
            >
              <Icon name="image" size={18} className="text-primary" />
              <div>
                <div className="font-medium">Export Visual Story</div>
                <div className="text-xs text-muted-foreground mt-0.5">Create a shareable image or PDF</div>
              </div>
            </button>
            <button
              onClick={handleGenerateVideo}
              className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors"
            >
              <Icon name="play" size={18} className="text-primary" />
              <div>
                <div className="font-medium">Generate Video</div>
                <div className="text-xs text-muted-foreground mt-0.5">Create a video story of your trip</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 