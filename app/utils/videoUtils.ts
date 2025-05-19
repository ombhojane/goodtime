'use client';

import { Trip, MediaItem, Sticker } from '../types';

// Load and prepare an image for canvas drawing
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// Calculate the correct dimensions for covering a target area while maintaining aspect ratio
export const calculateCoverDimensions = (
  sourceWidth: number, 
  sourceHeight: number, 
  targetWidth: number, 
  targetHeight: number
): {width: number, height: number, offsetX: number, offsetY: number} => {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;
  
  let width, height, offsetX = 0, offsetY = 0;
  
  if (sourceRatio > targetRatio) {
    // Source is wider than target
    height = targetHeight;
    width = sourceWidth * (targetHeight / sourceHeight);
    offsetX = (targetWidth - width) / 2;
  } else {
    // Source is taller than target
    width = targetWidth;
    height = sourceHeight * (targetWidth / sourceWidth);
    offsetY = (targetHeight - height) / 2;
  }
  
  return { width, height, offsetX, offsetY };
};

// Create a rounded rectangle path on canvas
export const roundRect = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  radius: number
): void => {
  // For older browsers that don't support roundRect
  if (!ctx.roundRect) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  } else {
    // Use the built-in roundRect for modern browsers
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  }
};

// Draw text with word wrapping
export const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 0
): number => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
      lineCount++;
      
      if (maxLines > 0 && lineCount >= maxLines) {
        // If we've reached max lines and there are more words,
        // add ellipsis to the end of this line
        if (i < words.length - 1) {
          const lastLine = line.trim() + '...';
          ctx.fillText(lastLine, x, currentY);
        } else {
          ctx.fillText(line, x, currentY);
        }
        break;
      }
    } else {
      line = testLine;
    }
  }
  
  // Draw the last line if we didn't hit the max line limit
  if (lineCount < maxLines || maxLines === 0) {
    ctx.fillText(line, x, currentY);
    lineCount++;
  }
  
  return lineCount;
};

// Create a transition effect between frames
export const createTransition = (
  ctx: CanvasRenderingContext2D,
  currentFrame: HTMLCanvasElement,
  nextFrame: HTMLCanvasElement,
  progress: number // 0 to 1
): void => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Basic fade transition
  ctx.globalAlpha = 1 - progress;
  ctx.drawImage(currentFrame, 0, 0);
  
  ctx.globalAlpha = progress;
  ctx.drawImage(nextFrame, 0, 0);
  
  ctx.globalAlpha = 1;
};

// Estimate total export duration based on trip content
export const estimateTotalDuration = (trip: Trip): number => {
  // Day title cards: 2 seconds each
  const dayTitleDuration = trip.days.length * 2000;
  
  // Media items: 5 seconds each
  const itemsCount = trip.days.reduce((total, day) => total + day.items.length, 0);
  const itemsDuration = itemsCount * 5000;
  
  // Ending card: 3 seconds
  const endingDuration = 3000;
  
  return dayTitleDuration + itemsDuration + endingDuration;
}; 