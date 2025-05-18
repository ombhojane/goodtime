'use client';

import { useState, useRef } from 'react';
import { Sticker as StickerType } from '../types';
import Icon from './Icon';

interface StickerProps {
  sticker: StickerType;
  onMove?: (id: string, position: { x: number; y: number }) => void;
  onDelete?: (id: string) => void;
  isEditable?: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function Sticker({ sticker, onMove, onDelete, isEditable = true, containerRef }: StickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const stickerRef = useRef<HTMLDivElement>(null);

  // Determine sticker background based on type
  const getBgColor = () => {
    switch (sticker.type) {
      case 'location':
        return 'bg-blue-100 text-blue-800';
      case 'category':
        return 'bg-green-100 text-green-800';
      case 'emoji':
        return 'bg-transparent';
      case 'text':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSize = () => {
    if (sticker.type === 'emoji') {
      return 'text-3xl';
    }
    return 'px-3 py-1.5 text-sm';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable || !containerRef.current || !stickerRef.current) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const stickerRect = stickerRef.current.getBoundingClientRect();
    
    dragOffset.current = {
      x: e.clientX - stickerRect.left,
      y: e.clientY - stickerRect.top
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate the new position as percentages of the container
      const x = ((e.clientX - containerRect.left - dragOffset.current.x) / containerRect.width) * 100;
      const y = ((e.clientY - containerRect.top - dragOffset.current.y) / containerRect.height) * 100;
      
      // Keep the sticker within bounds (0-100%)
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));
      
      if (stickerRef.current) {
        stickerRef.current.style.left = `${boundedX}%`;
        stickerRef.current.style.top = `${boundedY}%`;
      }
      
      if (onMove) {
        onMove(sticker.id, { x: boundedX, y: boundedY });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(sticker.id);
    }
  };
  
  // Style with rotation and scale if provided
  const transformStyle = {
    transform: `rotate(${sticker.style?.rotate || 0}deg) scale(${sticker.style?.scale || 1})`,
    left: `${sticker.position.x}%`,
    top: `${sticker.position.y}%`,
  };

  return (
    <div
      ref={stickerRef}
      className={`absolute cursor-move select-none ${isDragging ? 'z-50' : 'z-10'}`}
      style={transformStyle}
      onMouseDown={isEditable ? handleMouseDown : undefined}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className={`rounded-md ${getBgColor()} ${getSize()} shadow-sm`}>
        {sticker.content}
      </div>
      
      {/* Delete button */}
      {isEditable && showControls && (
        <button
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
          onClick={handleDelete}
        >
          <Icon name="trash" size={14} />
        </button>
      )}
    </div>
  );
} 