'use client';

import { Trip } from '../types';

// Slugify a title for URL purposes
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

interface StoredTrip {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate: string;
  updatedAt: string;
  trip: Trip;
}

// Array key for all trip metadata in localStorage
const TRIPS_STORAGE_KEY = 'in_the_motion_trips';

// Get trip metadata list
export function getTripsList(): StoredTrip[] {
  if (typeof window === 'undefined') return [];
  
  const tripsData = localStorage.getItem(TRIPS_STORAGE_KEY);
  if (!tripsData) return [];
  
  try {
    return JSON.parse(tripsData);
  } catch (e) {
    console.error('Failed to parse trips data:', e);
    return [];
  }
}

// Get a specific trip by slug
export function getTripBySlug(slug: string): Trip | null {
  const trips = getTripsList();
  const trip = trips.find(t => t.slug === slug);
  return trip ? trip.trip : null;
}

// Get a specific trip by ID
export function getTripById(id: string): Trip | null {
  // First check if it's a sample trip request
  const sampleTripObj = getSampleTrip();
  if (sampleTripObj.id === id) {
    return sampleTripObj;
  }
  
  // If not the sample trip, check localStorage
  const trips = getTripsList();
  const trip = trips.find(t => t.id === id);
  return trip ? trip.trip : null;
}

// Save a trip
export function saveTrip(trip: Trip): string {
  const trips = getTripsList();
  const slug = slugify(trip.title);
  
  // Check if this trip already exists
  const existingIndex = trips.findIndex(t => t.id === trip.id);
  const now = new Date().toISOString();
  
  const storedTrip: StoredTrip = {
    id: trip.id,
    title: trip.title,
    slug,
    startDate: trip.startDate,
    endDate: trip.endDate,
    updatedAt: now,
    trip
  };
  
  if (existingIndex !== -1) {
    // Update existing trip
    trips[existingIndex] = storedTrip;
  } else {
    // Add new trip
    trips.push(storedTrip);
  }
  
  localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  return slug;
}

// Delete a trip
export function deleteTrip(id: string): void {
  const trips = getTripsList();
  const filteredTrips = trips.filter(t => t.id !== id);
  localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(filteredTrips));
}

// Get sample trip (predefined)
import { sampleTrip } from '../mockData'; // We'll create this next

export function getSampleTrip(): Trip {
  // Create a copy of the sample trip
  const sampleTripCopy = { ...sampleTrip };
  
  // Check if we have a stored sample trip ID in sessionStorage
  if (typeof window !== 'undefined') {
    const storedSampleTripId = sessionStorage.getItem('sample_trip_id');
    if (storedSampleTripId) {
      sampleTripCopy.id = storedSampleTripId;
    }
  }
  
  return sampleTripCopy;
} 