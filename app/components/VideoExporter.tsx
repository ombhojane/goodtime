'use client';

import { useRef, useState, useEffect } from 'react';
import { Trip, MediaItem, Sticker } from '../types';
import Button from './Button';
import Icon from './Icon';
import { 
  roundRect,
  estimateTotalDuration 
} from '../utils/videoUtils';

interface VideoExporterProps {
  trip: Trip;
  onProgress?: (progress: number) => void;
  onComplete?: (videoUrl: string) => void;
}

export default function VideoExporter({ 
  trip, 
  onProgress, 
  onComplete 
}: VideoExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Canvas dimensions - 16:9 aspect ratio in HD
  const canvasWidth = 1280;
  const canvasHeight = 720;

  // Duration per item in milliseconds
  const ITEM_DURATION = 5000;
  
  // Effect to draw a preview frame on the canvas when not exporting
  useEffect(() => {
    if (!isPreviewing || isExporting || !canvasRef.current) return;
    
    // Draw a preview frame
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear and add gradient background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.8)');
    gradient.addColorStop(1, 'rgba(25, 33, 52, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw title
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(trip.title, canvasWidth / 2, canvasHeight / 2 - 60);
    
    // Draw info text
    ctx.font = '24px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Click "Generate Story Video" to begin', canvasWidth / 2, canvasHeight / 2 + 20);
    
    // Draw stats
    const totalDays = trip.days.length;
    const totalImages = trip.days.reduce((acc, day) => acc + day.items.length, 0);
    const estimatedDuration = Math.round(estimateTotalDuration(trip) / 1000);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(`${totalDays} days · ${totalImages} images · Est. ${estimatedDuration}s duration`, 
      canvasWidth / 2, canvasHeight / 2 + 70);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPreviewing, isExporting, trip]);
  
  // Initialize preview when component mounts
  useEffect(() => {
    setIsPreviewing(true);
    return () => setIsPreviewing(false);
  }, []);

  const startExport = async () => {
    if (!canvasRef.current) return;
    
    setIsExporting(true);
    setProgress(0);
    setError(null);
    chunksRef.current = [];

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Setup media recorder to capture the canvas as a video stream
      const stream = canvas.captureStream(30); // 30 FPS
      
      // Check for browser support of various codecs
      const options: MediaRecorderOptions = { mimeType: 'video/mp4', videoBitsPerSecond: 5000000 };
      
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        options.mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
        options.mimeType = 'video/webm;codecs=h264';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options.mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options.mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options.mimeType = 'video/webm';
      }
      
      try {
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: options.mimeType });
          const url = URL.createObjectURL(blob);
          if (onComplete) onComplete(url);
          setIsExporting(false);
          setProgress(100);
          setIsPreviewing(true); // Show preview again after completion
        };
        
        // Start recording
        mediaRecorder.start(100); // Collect data every 100ms
        
        // Process each day and its items
        const totalItems = trip.days.reduce((acc, day) => acc + day.items.length, 0);
        let processedItems = 0;
        
        for (let dayIndex = 0; dayIndex < trip.days.length; dayIndex++) {
          const day = trip.days[dayIndex];
          
          // Draw day title card
          await drawDayTitleScreen(ctx, day.date, dayIndex);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Show day title for 2 seconds
          
          // Process each item in the day
          for (let itemIndex = 0; itemIndex < day.items.length; itemIndex++) {
            const item = day.items[itemIndex];
            
            // Draw the item and its associated stickers/captions
            await drawItem(ctx, item, day.stickers);
            
            // Wait for the item duration
            await new Promise(resolve => setTimeout(resolve, ITEM_DURATION));
            
            // Update progress
            processedItems++;
            const currentProgress = Math.floor((processedItems / totalItems) * 100);
            setProgress(currentProgress);
            if (onProgress) onProgress(currentProgress);
          }
        }
        
        // Draw ending card
        await drawEndingScreen(ctx, trip.title);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Show ending for 3 seconds
        
        // Stop recording
        mediaRecorder.stop();
        
      } catch (err) {
        console.error('Media recorder error:', err);
        throw new Error('Failed to initialize media recorder. Your browser may not support this feature.');
      }
    } catch (err) {
      console.error('Video export error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsExporting(false);
      setIsPreviewing(true); // Show preview again if error occurs
      
      // Clean up if error occurs
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    }
  };

  // Draw the day title screen with animation
  const drawDayTitleScreen = async (ctx: CanvasRenderingContext2D, date: string, dayIndex: number) => {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Improved gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 1)');
    gradient.addColorStop(1, 'rgba(25, 33, 52, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(canvasWidth * 0.2, canvasHeight * 0.3, 150, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(canvasWidth * 0.8, canvasHeight * 0.7, 180, 0, Math.PI * 2);
    ctx.fill();
    
    // Format date
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    
    // Draw day number with animation
    ctx.font = 'bold 140px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Animate the text
    for (let i = 0; i < 15; i++) {
      ctx.clearRect(0, canvasHeight/2 - 150, canvasWidth, 300);
      const scale = 0.5 + (i / 15) * 0.5;
      ctx.font = `bold ${Math.floor(140 * scale)}px Arial, sans-serif`;
      ctx.fillText(`Day ${dayIndex + 1}`, canvasWidth / 2, canvasHeight / 2);
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    
    // Draw date with improved styling
    ctx.shadowBlur = 4;
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(formattedDate, canvasWidth / 2, canvasHeight / 2 + 120);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  // Draw the item (image or video) with stickers and captions
  const drawItem = async (ctx: CanvasRenderingContext2D, item: MediaItem, stickers: Sticker[]) => {
    return new Promise<void>((resolve) => {
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      if (item.type === 'image') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
          // Draw image using object-fit: cover logic
          const imgRatio = img.width / img.height;
          const canvasRatio = canvasWidth / canvasHeight;
          
          let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
          
          if (imgRatio > canvasRatio) {
            // Image is wider than canvas ratio
            drawHeight = canvasHeight;
            drawWidth = img.width * (canvasHeight / img.height);
            offsetX = (canvasWidth - drawWidth) / 2;
          } else {
            // Image is taller than canvas ratio
            drawWidth = canvasWidth;
            drawHeight = img.height * (canvasWidth / img.width);
            offsetY = (canvasHeight - drawHeight) / 2;
          }
          
          // Add a slight blur effect for the background to ensure the image fills the frame
          if (offsetX !== 0 || offsetY !== 0) {
            // Draw a blurred version of the image that fills the entire canvas
            ctx.filter = 'blur(20px)';
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            ctx.filter = 'none';
            
            // Dim the blurred background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          }
          
          // Draw the main image
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          
          // Draw overlay gradient for better text readability
          const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
          gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.1)');
          gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          
          // Draw location if available
          if (item.location?.name) {
            // Add shadow for better visibility
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.font = 'bold 30px Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(item.location.name, 50, 50);
          }
          
          // Draw date in the corner if available
          if (item.timestamp) {
            const dateObj = new Date(item.timestamp);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            });
            
            ctx.font = 'bold 22px Arial, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.textAlign = 'right';
            ctx.fillText(formattedDate, canvasWidth - 50, 50);
          }
          
          // Draw caption if available with improved styling
          if (item.caption) {
            // Background for caption - slightly rounded corners, more elegant
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 5;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            roundRect(ctx, 40, canvasHeight - 160, canvasWidth - 80, 110, 12);
            ctx.fill();
            
            // Reset shadow for text
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // Caption text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 28px Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            // Draw wrapped text
            const maxWidth = canvasWidth - 120;
            const words = item.caption.split(' ');
            let line = '';
            let y = canvasHeight - 140;
            
            for (let i = 0; i < words.length; i++) {
              const testLine = line + words[i] + ' ';
              const metrics = ctx.measureText(testLine);
              
              if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, 70, y);
                line = words[i] + ' ';
                y += 35;
                
                // Limit to 2 lines
                if (y > canvasHeight - 70) {
                  if (i < words.length - 1) {
                    // Add ellipsis if more words remain
                    line = line.trim() + '...';
                  }
                  break;
                }
              } else {
                line = testLine;
              }
            }
            
            ctx.fillText(line, 70, y);
          }
          
          // Draw stickers with improved styling
          const relevantStickers = stickers.filter(s => !s.timestamp || 
            (item.timestamp && Math.abs(new Date(s.timestamp).getTime() - new Date(item.timestamp).getTime()) < 30 * 60 * 1000));
          
          for (const sticker of relevantStickers) {
            // Position sticker based on percentage coordinates
            const x = (sticker.position.x / 100) * canvasWidth;
            const y = (sticker.position.y / 100) * canvasHeight;
            
            // Draw different sticker types
            if (sticker.type === 'emoji') {
              ctx.font = '64px Arial';
              ctx.fillText(sticker.content, x, y);
            } else {
              // Add subtle shadow
              ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
              ctx.shadowBlur = 8;
              
              // Add a background bubble for text stickers
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              const textMetrics = ctx.measureText(sticker.content);
              const bubbleWidth = textMetrics.width + 20;
              const bubbleHeight = 36;
              
              roundRect(ctx, x - bubbleWidth/2, y - bubbleHeight/2, bubbleWidth, bubbleHeight, 18);
              ctx.fill();
              
              // Draw sticker text
              ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
              ctx.font = 'bold 20px Arial, sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(sticker.content, x, y);
              
              // Reset shadow
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
            }
          }
          
          // Let the frame display for a moment
          setTimeout(resolve, 100);
        };
        
        img.onerror = () => {
          console.error('Failed to load image:', item.src);
          ctx.fillStyle = 'rgba(200, 0, 0, 0.5)';
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          ctx.fillStyle = 'white';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Error loading image', canvasWidth / 2, canvasHeight / 2);
          setTimeout(resolve, 100);
        };
        
        img.src = item.src;
      } else {
        // For video items, we'd need a more complex approach
        // This is a simplified placeholder
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Video item (not implemented in this example)', canvasWidth / 2, canvasHeight / 2);
        setTimeout(resolve, 100);
      }
    });
  };

  // Draw ending screen
  const drawEndingScreen = async (ctx: CanvasRenderingContext2D, tripTitle: string) => {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Enhanced gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 1)');
    gradient.addColorStop(0.6, 'rgba(25, 33, 52, 0.95)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 5; i++) {
      const size = 100 + Math.random() * 200;
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add a subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 4;
    roundRect(ctx, 40, 40, canvasWidth - 80, canvasHeight - 80, 20);
    ctx.stroke();
    
    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Trip title with enhanced styling
    ctx.font = 'bold 60px Arial, sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tripTitle, canvasWidth / 2, canvasHeight / 2 - 60);
    
    // "Thank you for watching" text with animation
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    // Animate the text with a fade-in effect
    for (let i = 0; i < 10; i++) {
      const opacity = i / 10;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillText('Thank you for watching', canvasWidth / 2, canvasHeight / 2 + 40);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Reset shadow for footer text
    ctx.shadowBlur = 4;
    
    // Created with text
    ctx.font = '24px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('Created with Travel Story Maker', canvasWidth / 2, canvasHeight - 100);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  return (
    <div className="relative">
      {/* Canvas for video rendering - made visible with styling */}
      <div className="flex flex-col gap-6 items-center">
        <div className="rounded-lg overflow-hidden shadow-lg border border-border">
          <canvas 
            ref={canvasRef} 
            width={canvasWidth} 
            height={canvasHeight} 
            className={`w-full md:w-[640px] h-auto`}
          />
        </div>
        
        {/* UI for export control */}
        <div className="flex flex-col gap-4 w-full md:w-[640px]">
          {!isExporting ? (
            <Button
              variant="primary"
              size="lg"
              onClick={startExport}
              icon="play"
            >
              Generate Video
            </Button>
          ) : (
            <div className="bg-muted/30 p-6 rounded-lg border border-border animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-spin">
                  <Icon name="loader" size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Generating Video...</h4>
                  <p className="text-sm text-muted-foreground">
                    {progress < 25 ? 'Preparing your trip data...' : 
                     progress < 50 ? 'Building day sequences...' : 
                     progress < 75 ? 'Creating video frames...' : 
                     'Finalizing your video...'}
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Creating video</span>
                <span className="font-medium">{progress}%</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md mt-2">
              <div className="font-medium mb-1">Error generating video</div>
              <div className="text-sm">{error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 