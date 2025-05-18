'use client';

import { useState } from 'react';
import Button from './Button';
import Icon from './Icon';
import { Trip } from '../types';
import { generateId } from '../utils';
import { useTheme } from '../context/ThemeContext';
import { themes, ThemeColor } from '../themes';

interface TripCreatorProps {
  onTripCreated: (trip: Trip) => void;
  onCancel: () => void;
}

export default function TripCreator({ onTripCreated, onCancel }: TripCreatorProps) {
  const { theme: currentTheme, isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [theme, setTheme] = useState<ThemeColor>('teal');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new trip
    const newTrip: Trip = {
      id: generateId(),
      title: title || 'My Trip',
      startDate,
      endDate,
      days: [],
      theme
    };
    
    // Generate empty days between start and end dates
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Add one day to include the end date
      end.setDate(end.getDate() + 1);
      
      for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        newTrip.days.push({
          date: dateString,
          items: [],
          stickers: []
        });
      }
    }
    
    onTripCreated(newTrip);
  };
  
  return (
    <div className="glass-card rounded-lg shadow-soft dark:shadow-soft-dark p-6 max-w-md mx-auto animate-fade-in border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Create a New Trip</h2>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={onCancel}
          aria-label="Close"
        >
          <Icon name="x" size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Trip Title
          </label>
          <input
            type="text"
            className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-background"
            placeholder="My Amazing Vacation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-background"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                // Set end date to start date if it's not set or is before start date
                if (!endDate || new Date(endDate) < new Date(e.target.value)) {
                  setEndDate(e.target.value);
                }
              }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              End Date
            </label>
            <input
              type="date"
              className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-background"
              min={startDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Theme
          </label>
          <div className="grid grid-cols-5 gap-3">
            {Object.values(themes).map((themeOption) => (
              <button
                key={themeOption.id}
                type="button"
                className={`w-10 h-10 rounded-full transition-transform ${themeOption[isDark ? 'dark' : 'light'].primary} ${
                  theme === themeOption.id ? 'ring-2 ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'
                }`}
                title={themeOption.name}
                onClick={() => setTheme(themeOption.id)}
              >
                {theme === themeOption.id && (
                  <Icon name="check" size={16} className="text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={!title || !startDate || !endDate}
          >
            Create Trip
          </Button>
        </div>
      </form>
    </div>
  );
} 