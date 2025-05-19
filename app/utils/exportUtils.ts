'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Trip } from '../types';

/**
 * Exports a day's section as an image
 */
export async function exportDayAsImage(dayElement: HTMLElement): Promise<HTMLCanvasElement> {
  try {
    // Create a clone of the element to avoid modifying the original DOM
    const elementClone = dayElement.cloneNode(true) as HTMLElement;
    document.body.appendChild(elementClone);
    elementClone.style.position = 'absolute';
    elementClone.style.top = '-9999px';
    elementClone.style.width = `${dayElement.offsetWidth}px`;
    
    // Set the background color to dark grey
    elementClone.style.backgroundColor = '#111827'; // Dark grey background
    elementClone.style.color = '#ffffff'; // White text for dark background
    elementClone.style.padding = '24px'; // Add some padding
    
    // Apply fixes to ensure proper rendering in the exported image
    
    // Fix for time-of-day headers - Use stronger colors with better contrast
    const timeOfDayHeaders = elementClone.querySelectorAll('[class*="bg-amber"], [class*="bg-blue"], [class*="bg-orange"], [class*="bg-indigo"]');
    timeOfDayHeaders.forEach((header) => {
      const element = header as HTMLElement;
      // Override background with more vibrant colors for better visibility
      if (element.className.includes('bg-amber')) {
        element.style.backgroundColor = '#f59e0b'; // amber-500 for more contrast
        element.style.color = '#ffffff'; // white text for contrast
      } else if (element.className.includes('bg-blue')) {
        element.style.backgroundColor = '#3b82f6'; // blue-500 for more contrast
        element.style.color = '#ffffff'; // white text for contrast
      } else if (element.className.includes('bg-orange')) {
        element.style.backgroundColor = '#f97316'; // orange-500 for more contrast
        element.style.color = '#ffffff'; // white text for contrast
      } else if (element.className.includes('bg-indigo')) {
        element.style.backgroundColor = '#6366f1'; // indigo-500 for more contrast
        element.style.color = '#ffffff'; // white text for contrast
      }
    });
    
    // Specifically style the night header for better visibility on dark background
    const nightHeaders = elementClone.querySelectorAll('[class*="night"]');
    nightHeaders.forEach((header) => {
      const nightHeader = header as HTMLElement;
      // Use a more vibrant color for night header on dark background
      if (nightHeader.textContent?.toLowerCase().includes('night')) {
        nightHeader.style.backgroundColor = '#4f46e5'; // indigo-600
        nightHeader.style.color = '#ffffff';
        nightHeader.style.padding = '16px';
        nightHeader.style.borderRadius = '8px';
      }
    });
    
    // Fix for media items - Ensure images are clear and have proper contrast against dark background
    const mediaItems = elementClone.querySelectorAll('.glass-card');
    mediaItems.forEach((item) => {
      const mediaItem = item as HTMLElement;
      
      // Adjust card styling for dark background
      mediaItem.style.backgroundColor = '#1f2937'; // Slightly lighter dark grey
      mediaItem.style.borderColor = '#374151'; // Border visible on dark background
      mediaItem.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.5)'; // Stronger shadow for depth on dark background
      
      // Don't remove overlays that add visual style, just ensure they're not too dark
      const overlays = mediaItem.querySelectorAll('.absolute.inset-0');
      overlays.forEach((overlay) => {
        const overlayElement = overlay as HTMLElement;
        // Instead of removing, just adjust opacity to maintain some styling
        if (overlayElement.className.includes('from-transparent') || 
            overlayElement.className.includes('to-black')) {
          overlayElement.style.opacity = '0.15'; // Reduced opacity instead of removal
        }
      });
      
      // Ensure image visibility with proper contrast
      const images = mediaItem.querySelectorAll('img');
      images.forEach((img) => {
        const imgElement = img as HTMLImageElement;
        imgElement.style.opacity = '1';
        imgElement.style.filter = 'contrast(1.1) brightness(1.05)'; // Slightly boost contrast
      });
      
      // Adjust text colors for visibility on dark background
      const textElements = mediaItem.querySelectorAll('p, span');
      textElements.forEach((textEl) => {
        const textElement = textEl as HTMLElement;
        // Keep caption text visible against dark background
        if (textElement.textContent?.includes('No caption') || textElement.className.includes('muted')) {
          textElement.style.color = '#9ca3af'; // grey-400 for better visibility on dark
        } else {
          textElement.style.color = '#ffffff'; // White text for other content
        }
      });
    });
    
    // Enhance time indicator badges for better visibility on dark background
    const timeIndicators = elementClone.querySelectorAll('[class*="absolute top-3 right-3"]');
    timeIndicators.forEach((indicator) => {
      const timeElement = indicator as HTMLElement;
      timeElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      timeElement.style.color = '#111827'; // Dark text
      timeElement.style.fontWeight = '600'; // Semi-bold
      timeElement.style.opacity = '1';
      timeElement.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,0.3)';
    });
    
    // Fix for icons and text to ensure they're visible on dark background
    const allText = elementClone.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6');
    allText.forEach((textElement) => {
      const element = textElement as HTMLElement;
      if (element.className.includes('text-muted')) {
        element.style.color = '#9ca3af'; // grey-400 for better visibility on dark
      } else if (!element.style.color) {
        element.style.color = '#ffffff'; // Default to white text
      }
    });

    // Set some options to make the image look better
    const canvas = await html2canvas(elementClone, {
      scale: 2, // Higher resolution
      useCORS: true, // Enable cross-origin images
      allowTaint: true,
      backgroundColor: '#111827', // Dark grey background
      logging: false,
      removeContainer: false, // We'll handle removal ourselves
    });
    
    // Clean up the cloned element
    document.body.removeChild(elementClone);
    
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

  // Draw dark grey background
  ctx.fillStyle = '#111827'; // Dark grey background to match the individual canvases
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
 * @param trip The trip to export
 * @param onProgress Optional callback for progress updates (0-100)
 */
export async function exportTimelineAsImages(
  trip: Trip,
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    // Find all timeline day sections
    const daySections = document.querySelectorAll('.timeline-section');
    
    if (daySections.length === 0) {
      throw new Error('No timeline sections found');
    }
    
    // Update initial progress
    if (onProgress) onProgress(10);
    
    // Convert each day section to a canvas
    const dayCanvases: HTMLCanvasElement[] = [];
    
    for (let i = 0; i < daySections.length; i++) {
      const daySection = daySections[i] as HTMLElement;
      
      // Allow slight delay for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Update progress during rendering phase
      if (onProgress) {
        const preparationProgress = 10;
        const renderingProgress = 60;
        const progressPerDay = renderingProgress / daySections.length;
        onProgress(preparationProgress + Math.floor(progressPerDay * (i + 1)));
      }
      
      const canvas = await exportDayAsImage(daySection);
      dayCanvases.push(canvas);
    }
    
    // Update progress for combination phase
    if (onProgress) onProgress(70);
    
    // Combine all day canvases into a single canvas
    const combinedCanvas = await createCombinedCanvas(dayCanvases);
    
    // Update progress for image processing
    if (onProgress) onProgress(80);
    
    // Convert the combined canvas to a blob and download it
    const blob = await new Promise<Blob>((resolve) => {
      combinedCanvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
    
    // Update progress before download
    if (onProgress) onProgress(90);
    
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
    
    // Final progress update
    if (onProgress) onProgress(100);
  } catch (error) {
    console.error('Error exporting timeline as images:', error);
    throw error;
  }
}

/**
 * Exports the entire trip timeline as a PDF document
 * @param trip The trip to export
 * @param onProgress Optional callback for progress updates (0-100)
 */
export async function exportTimelineAsPDF(
  trip: Trip,
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    // Find all timeline day sections
    const daySections = document.querySelectorAll('.timeline-section');
    
    if (daySections.length === 0) {
      throw new Error('No timeline sections found');
    }
    
    // Convert each day section to a canvas
    const dayCanvases: HTMLCanvasElement[] = [];
    
    // Update progress for preparation phase
    if (onProgress) onProgress(10);
    
    for (let i = 0; i < daySections.length; i++) {
      try {
        const daySection = daySections[i] as HTMLElement;
        
        // Allow slight delay for rendering
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Use our improved exportDayAsImage function to ensure consistent rendering
        const canvas = await exportDayAsImage(daySection);
        dayCanvases.push(canvas);
        
        // Update progress for each day
        if (onProgress) {
          const preparationProgress = 10;
          const renderingProgress = 60;
          const progressPerDay = renderingProgress / daySections.length;
          onProgress(preparationProgress + Math.floor(progressPerDay * (i + 1)));
        }
      } catch (error) {
        console.error(`Error rendering day ${i + 1}:`, error);
        // Continue with other days even if one fails
      }
    }
    
    if (dayCanvases.length === 0) {
      throw new Error('Failed to render any days of the trip');
    }
    
    // Update progress for PDF creation
    if (onProgress) onProgress(70);
    
    // Create a new PDF document
    // Use A4 size with portrait orientation
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text(trip.title, pageWidth / 2, 15, { align: 'center' });
    
    // Add date range
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
    
    pdf.setFontSize(12);
    pdf.text(`${startDate} to ${endDate}`, pageWidth / 2, 22, { align: 'center' });
    
    // Update progress for PDF population
    if (onProgress) onProgress(80);
    
    // Add each day canvas to the PDF
    let yOffset = 30; // Starting position after the title
    
    for (let i = 0; i < dayCanvases.length; i++) {
      const canvas = dayCanvases[i];
      
      // Calculate image dimensions to fit on the page while maintaining aspect ratio
      const imgWidth = pageWidth - 20; // 10mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if this image fits on the current page
      if (i > 0 && yOffset + imgHeight > pageHeight - 10) {
        // Add a new page if it doesn't fit
        pdf.addPage();
        yOffset = 10; // Reset y position on new page
      }
      
      // Convert canvas to image data URL
      const imgData = canvas.toDataURL('image/png');
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
      
      // Update y position for next image
      yOffset += imgHeight + 10; // Add 10mm spacing between images
      
      // Update progress during PDF generation
      if (onProgress) {
        const pdfCreationProgress = 80;
        const pdfPopulationProgress = 15;
        const progressPerImage = pdfPopulationProgress / dayCanvases.length;
        onProgress(pdfCreationProgress + Math.floor(progressPerImage * (i + 1)));
      }
    }
    
    // Format the date range for the filename
    const fileName = `${trip.title} - ${startDate} to ${endDate}.pdf`;
    
    // Final progress update
    if (onProgress) onProgress(95);
    
    // Save and download the PDF
    pdf.save(fileName);
    
    // Complete progress
    if (onProgress) onProgress(100);
    
  } catch (error) {
    console.error('Error exporting timeline as PDF:', error);
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