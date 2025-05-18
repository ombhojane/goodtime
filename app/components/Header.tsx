'use client';

import { useState } from 'react';
import { Trip, formatDate } from '../types';
import { useTheme } from '../context/ThemeContext';
import { themes, ThemeColor } from '../themes';
import Icon from './Icon';

interface HeaderProps {
  trip: Trip;
}

export default function Header({ trip }: HeaderProps) {
  const { theme, setTheme, isDark, toggleDarkMode } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  return (
    <div className="w-full glass-card shadow-sm border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {trip.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className={`flex items-center rounded-full p-1.5 ${themes[theme][isDark ? 'dark' : 'light'].primary} text-white transition-all hover:shadow-md`}
            >
              <Icon name="palette" size={18} />
            </button>
            
            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card shadow-soft dark:shadow-soft-dark rounded-lg border border-border overflow-hidden z-20">
                <div className="p-2">
                  {Object.values(themes).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-md ${
                        theme === t.id ? 'bg-muted' : ''
                      } hover:bg-muted transition-colors`}
                    >
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${t[isDark ? 'dark' : 'light'].primary}`}></span>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <Icon name={isDark ? "sun" : "moon"} size={18} />
          </button>
          
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            {trip.days.length} Days
          </span>
        </div>
      </div>
    </div>
  );
} 