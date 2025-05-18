'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from './Button';
import Icon from './Icon';
import { MediaItem, TimelineDay } from '../types';
import { generateId } from '../utils';

interface MediaUploaderProps {
  onUpload: (newItems: MediaItem[], selectedDayIndex?: number) => void;
  days?: TimelineDay[];
}

interface UploadPreview {
  id: string;
  file: File;
  url: string;
  caption: string;
  location: string;
  timestamp: string;
}

export default function MediaUploader({ onUpload, days = [] }: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadPreview[]>([]);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState<number | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  
  // Handle file drop/selection
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Convert files to base64 and create previews
    const newPreviews: UploadPreview[] = [];
    
    for (const file of acceptedFiles) {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
      
      const now = new Date();
      
      // Format date as YYYY-MM-DD
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      // Format time as HH:MM
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      newPreviews.push({
        id: generateId(),
        file,
        url: base64,  // Store base64 data URL instead of object URL
        caption: '',
        location: '',
        timestamp: `${formattedDate}T${hours}:${minutes}:00`
      });
    }
    
    setUploadedFiles(prev => [...prev, ...newPreviews]);
    
    // Select the first image if none is selected
    if (selectedPreviewIndex === null && newPreviews.length > 0) {
      setSelectedPreviewIndex(uploadedFiles.length);
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop
  });
  
  const handleCaptionChange = (index: number, caption: string) => {
    const newUploadedFiles = [...uploadedFiles];
    newUploadedFiles[index].caption = caption;
    setUploadedFiles(newUploadedFiles);
  };
  
  const handleLocationChange = (index: number, location: string) => {
    const newUploadedFiles = [...uploadedFiles];
    newUploadedFiles[index].location = location;
    setUploadedFiles(newUploadedFiles);
  };
  
  const handleTimestampChange = (index: number, timestamp: string) => {
    const newUploadedFiles = [...uploadedFiles];
    newUploadedFiles[index].timestamp = timestamp;
    setUploadedFiles(newUploadedFiles);
  };
  
  const handleRemoveFile = (index: number) => {
    const newUploadedFiles = [...uploadedFiles];
    
    // No need to revoke URLs for base64 strings
    
    newUploadedFiles.splice(index, 1);
    setUploadedFiles(newUploadedFiles);
    
    // Adjust selected index if needed
    if (selectedPreviewIndex !== null) {
      if (selectedPreviewIndex === index) {
        setSelectedPreviewIndex(newUploadedFiles.length > 0 ? 0 : null);
      } else if (selectedPreviewIndex > index) {
        setSelectedPreviewIndex(selectedPreviewIndex - 1);
      }
    }
  };
  
  const handleSelectDay = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
  };
  
  const processUpload = () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const total = uploadedFiles.length;
    let processed = 0;
    
    // Create media items from the uploaded files
    const newItems: MediaItem[] = uploadedFiles.map((preview) => {
      // Increment processed counter and update progress
      processed++;
      setUploadProgress(Math.round((processed / total) * 100));
      
      // If a day is selected, and it has a different date than the preview timestamp,
      // update the timestamp to match the selected day's date but keep the time
      if (selectedDayIndex !== null && days && days[selectedDayIndex]) {
        const selectedDayDate = new Date(days[selectedDayIndex].date);
        const previewDate = new Date(preview.timestamp);
        
        // Keep the time from the preview but use the date from the selected day
        const updatedDate = new Date(selectedDayDate);
        updatedDate.setHours(
          previewDate.getHours(),
          previewDate.getMinutes(),
          previewDate.getSeconds()
        );
        
        preview.timestamp = updatedDate.toISOString();
      }
      
      return {
        id: preview.id,
        src: preview.url,
        type: 'image',
        timestamp: preview.timestamp,
        location: preview.location ? { name: preview.location } : undefined,
        caption: preview.caption || undefined
      };
    });
    
    // Call the onUpload callback with the new items and selected day
    onUpload(newItems, selectedDayIndex !== null ? selectedDayIndex : undefined);
    
    // Clean up
    setUploadedFiles([]);
    setSelectedPreviewIndex(null);
    setSelectedDayIndex(null);
    setIsUploading(false);
  };
  
  return (
    <div className="w-full">
      {isUploading ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-medium">Uploading images...</h3>
            <p className="text-sm text-gray-500">Please wait while we process your files.</p>
          </div>
          
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-500 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
        </div>
      ) : (
        <>
          {/* Image Drop Zone */}
          {uploadedFiles.length === 0 ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-500/5' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              
              <Icon name="upload" size={40} className="mb-4 text-gray-400" />
              
              <div className="mb-4 text-center">
                <h3 className="text-lg font-medium">Drag & drop images here</h3>
                <p className="text-sm text-gray-500">or click to select files</p>
              </div>
              
              <Button
                variant="accent"
                icon="image"
              >
                Select Images
              </Button>
              
              <p className="mt-4 text-xs text-gray-500">
                Supported formats: JPEG, PNG, HEIC
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview and Metadata Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Thumbnails */}
                <div className="md:col-span-1 border rounded-lg p-4 h-fit">
                  <h3 className="font-medium mb-3">Images ({uploadedFiles.length})</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {uploadedFiles.map((file, index) => (
                      <div 
                        key={file.id}
                        className={`flex items-center p-2 rounded-lg cursor-pointer ${
                          selectedPreviewIndex === index ? 'bg-muted ring-1 ring-blue-500' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedPreviewIndex(index)}
                      >
                        <div className="w-14 h-14 relative rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={file.url} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="ml-3 flex-grow">
                          <p className="text-sm font-medium truncate">{file.file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                        <button 
                          className="ml-2 text-gray-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                        >
                          <Icon name="trash" size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Button size="sm" variant="outline" icon="image">Add More</Button>
                    </div>
                  </div>
                </div>
                
                {/* Image Preview and Edit Form */}
                <div className="md:col-span-2 border rounded-lg p-4">
                  {selectedPreviewIndex !== null && uploadedFiles[selectedPreviewIndex] ? (
                    <div>
                      <h3 className="font-medium mb-3">Image Details</h3>
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Image Preview */}
                        <div className="w-full md:w-1/2">
                          <div className="aspect-square relative rounded-lg overflow-hidden">
                            <img 
                              src={uploadedFiles[selectedPreviewIndex].url}
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        {/* Edit Form */}
                        <div className="w-full md:w-1/2 space-y-4">
                          {/* Caption */}
                          <div>
                            <label className="block text-sm font-medium mb-1">Caption</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md bg-background text-foreground"
                              value={uploadedFiles[selectedPreviewIndex].caption}
                              onChange={(e) => handleCaptionChange(selectedPreviewIndex, e.target.value)}
                              placeholder="Add a caption..."
                            />
                          </div>
                          
                          {/* Location */}
                          <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md bg-background text-foreground"
                              value={uploadedFiles[selectedPreviewIndex].location}
                              onChange={(e) => handleLocationChange(selectedPreviewIndex, e.target.value)}
                              placeholder="Add a location..."
                            />
                          </div>
                          
                          {/* Timestamp */}
                          <div>
                            <label className="block text-sm font-medium mb-1">Date & Time</label>
                            <input
                              type="datetime-local"
                              className="w-full p-2 border rounded-md bg-background text-foreground"
                              value={uploadedFiles[selectedPreviewIndex].timestamp.substring(0, 16)}
                              onChange={(e) => handleTimestampChange(selectedPreviewIndex, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      Select an image to edit details
                    </div>
                  )}
                </div>
              </div>
              
              {/* Day Selection Section */}
              {days && days.length > 0 && (
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="font-medium mb-3">Add to Day</h3>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {days.map((day, index) => (
                      <button
                        key={index}
                        className={`px-3 py-2 rounded-md hover:bg-card-hover flex flex-col items-center ${
                          selectedDayIndex === index 
                          ? 'bg-accent/10 dark:bg-accent/20 border-2 border-accent text-foreground' 
                          : 'bg-muted/50 dark:bg-gray-800 border border-border'
                        }`}
                        onClick={() => handleSelectDay(index)}
                      >
                        <span className="font-medium">Day {index + 1}</span>
                        <span className="text-xs text-muted-foreground">{new Date(day.date).toLocaleDateString()}</span>
                      </button>
                    ))}
                  </div>
                  {selectedDayIndex !== null && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Selected: <span className="font-medium text-accent">Day {selectedDayIndex + 1} ({new Date(days[selectedDayIndex].date).toLocaleDateString()})</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedFiles([]);
                    setSelectedPreviewIndex(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  onClick={processUpload}
                  disabled={uploadedFiles.length === 0}
                >
                  {selectedDayIndex !== null
                    ? `Upload to Day ${selectedDayIndex + 1}`
                    : 'Upload Photos'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 