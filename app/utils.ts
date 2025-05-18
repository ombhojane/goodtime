import { MediaItem, Sticker, TimeOfDay, timeOfDay } from "./types";

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Extract EXIF data from image files (mock implementation)
export const extractExifData = (file: File): Promise<{timestamp?: string, location?: {latitude?: number, longitude?: number}}> => {
  return new Promise((resolve) => {
    // In a real app, we would extract EXIF data here
    // For our mock, we'll return random data
    const now = new Date();
    const randomPastDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Random time in the last week
    
    resolve({
      timestamp: randomPastDate.toISOString(),
      location: {
        latitude: (Math.random() * 180) - 90,
        longitude: (Math.random() * 360) - 180
      }
    });
  });
};

// Get color based on time of day
export const getTimeOfDayColor = (tod: TimeOfDay): string => {
  switch (tod) {
    case "morning":
      return "bg-amber-100 dark:bg-amber-950";
    case "afternoon":
      return "bg-blue-100 dark:bg-blue-950";
    case "evening":
      return "bg-orange-100 dark:bg-orange-950";
    case "night":
      return "bg-indigo-100 dark:bg-indigo-950";
    default:
      return "bg-gray-100 dark:bg-gray-900";
  }
};

// Get icon based on time of day
export const getTimeOfDayIcon = (tod: TimeOfDay): string => {
  switch (tod) {
    case "morning":
      return "☀️";
    case "afternoon":
      return "🌤️";
    case "evening":
      return "🌇";
    case "night":
      return "🌙";
    default:
      return "⏰";
  }
};

// Sort media items by timestamp
export const sortByTimestamp = (items: MediaItem[]): MediaItem[] => {
  return [...items].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Group media items by time of day
export const groupByTimeOfDay = (items: MediaItem[]): Record<TimeOfDay, MediaItem[]> => {
  const groups: Record<TimeOfDay, MediaItem[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    night: []
  };
  
  items.forEach(item => {
    const date = new Date(item.timestamp);
    const tod = timeOfDay(date);
    groups[tod].push(item);
  });
  
  return groups;
};

// Get stickers for a specific time range
export const getStickersForTimeRange = (
  stickers: Sticker[],
  startTime: string,
  endTime: string
): Sticker[] => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  
  return stickers.filter(sticker => {
    if (!sticker.timestamp) return true; // Include stickers without timestamp
    const stickerTime = new Date(sticker.timestamp).getTime();
    return stickerTime >= start && stickerTime <= end;
  });
};

// Format time (HH:MM)
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}; 