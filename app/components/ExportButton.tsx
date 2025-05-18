'use client';

import { useState } from 'react';
import Button from './Button';
import { Trip } from '../types';
import { exportTimelineAsImages } from '../utils/exportUtils';

interface ExportButtonProps {
  trip: Trip;
}

export default function ExportButton({ trip }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportTimelineAsImages(trip);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export moodboard. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      icon="download"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? 'Exporting...' : 'Save Moodboard'}
    </Button>
  );
} 