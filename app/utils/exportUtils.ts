'use client';

import html2canvas from 'html2canvas';
import { Trip } from '../types';

/**
 * Exports a day's section as an image
 */
export async function exportDayAsImage(dayElement: HTMLElement): Promise<HTMLCanvasElement> {
  try {
    // Set some options to make the image look better
    const canvas = await html2canvas(dayElement, {
      scale: 2, // Higher resolution
      useCORS: true, // Enable cross-origin images
      allowTaint: true,
      backgroundColor: window.getComputedStyle(document.body).backgroundColor || '#ffffff',
      logging: false,
    });
    
    return canvas;
  } catch (error) {
    console.error('Error exporting day as image:', error);
    throw error;
  }
}

/**
 * Creates a combined canvas from multiple day canvases
 */
export async function createCombinedCanvas(canvases: HTMLCanvasElement[]): Promise<HTMLCanvasElement> {
  if (canvases.length === 0) {
    throw new Error('No canvases to combine');
  }

  // Calculate total height and max width
  const totalHeight = canvases.reduce((sum, canvas) => sum + canvas.height, 0);
  const maxWidth = Math.max(...canvases.map(canvas => canvas.width));

  // Create a new canvas with the combined dimensions
  const combinedCanvas = document.createElement('canvas');
  combinedCanvas.width = maxWidth;
  combinedCanvas.height = totalHeight;
  
  const ctx = combinedCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Draw background
  ctx.fillStyle = window.getComputedStyle(document.body).backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

  // Draw each canvas onto the combined canvas
  let yOffset = 0;
  for (const canvas of canvases) {
    // Center horizontally if the canvas is narrower than the max width
    const xOffset = Math.max(0, (maxWidth - canvas.width) / 2);
    ctx.drawImage(canvas, xOffset, yOffset);
    yOffset += canvas.height;
  }

  return combinedCanvas;
}

/**
 * Exports the entire trip timeline as a single combined image
 */
export async function exportTimelineAsImages(trip: Trip): Promise<void> {
  try {
    // Find all timeline day sections
    const daySections = document.querySelectorAll('.timeline-section');
    
    if (daySections.length === 0) {
      throw new Error('No timeline sections found');
    }
    
    // Convert each day section to a canvas
    const dayCanvases: HTMLCanvasElement[] = [];
    
    for (let i = 0; i < daySections.length; i++) {
      const daySection = daySections[i] as HTMLElement;
      
      // Allow slight delay for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await exportDayAsImage(daySection);
      dayCanvases.push(canvas);
    }
    
    // Combine all day canvases into a single canvas
    const combinedCanvas = await createCombinedCanvas(dayCanvases);
    
    // Convert the combined canvas to a blob and download it
    const blob = await new Promise<Blob>((resolve) => {
      combinedCanvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
    
    // Format the date range for the filename
    const startDate = new Date(trip.startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const endDate = new Date(trip.endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const fileName = `${trip.title} - ${startDate} to ${endDate}.png`;
    downloadBlob(blob, fileName);
  } catch (error) {
    console.error('Error exporting timeline as images:', error);
    throw error;
  }
}

/**
 * Helper function to download a blob as a file
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
  }, 100);
} 