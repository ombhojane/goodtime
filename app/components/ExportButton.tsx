'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { Trip } from '../types';

interface ExportButtonProps {
  trip: Trip;
}

export default function ExportButton({ trip }: ExportButtonProps) {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    // Navigate to export page with trip ID
    router.push(`/export?tripId=${trip.id}`);
  };
  
  return (
    <Button
      variant="primary"
      size="sm"
      icon="download"
      onClick={handleExport}
      disabled={isExporting}
      title="Export your trip moodboard"
    >
      Export Moodboard
    </Button>
  );
} 