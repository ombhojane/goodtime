'use client';

import html2canvas from 'html2canvas';
import { Trip } from '../types';

/**
 * Exports a day's section as an image
 */
export async function exportDayAsImage(dayElement: HTMLElement, dayIndex: number): Promise<Blob> {
  try {
    // Set some options to make the image look better
    const canvas = await html2canvas(dayElement, {
      scale: 2, // Higher resolution
      useCORS: true, // Enable cross-origin images
      allowTaint: true,
      backgroundColor: window.getComputedStyle(document.body).backgroundColor || '#ffffff',
      logging: false,
    });
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error exporting day as image:', error);
    throw error;
  }
}

/**
 * Exports the entire trip timeline as a series of images (one per day)
 */
export async function exportTimelineAsImages(trip: Trip): Promise<void> {
  try {
    // Find all timeline day sections
    const daySections = document.querySelectorAll('.timeline-section');
    
    if (daySections.length === 0) {
      throw new Error('No timeline sections found');
    }
    
    // Export each day as an image and download them
    for (let i = 0; i < daySections.length; i++) {
      const daySection = daySections[i] as HTMLElement;
      const dayIndex = i;
      const dayDate = trip.days[i].date;
      const formattedDate = new Date(dayDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      // Allow slight delay for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const blob = await exportDayAsImage(daySection, dayIndex);
      downloadBlob(blob, `${trip.title} - Day ${dayIndex + 1} - ${formattedDate}.png`);
    }
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