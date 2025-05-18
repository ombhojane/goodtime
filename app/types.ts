export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface MediaItem {
  id: string;
  src: string;
  type: "image" | "video";
  timestamp: string;
  location?: {
    latitude?: number;
    longitude?: number;
    name?: string;
  };
  caption?: string;
}

export interface Sticker {
  id: string;
  type: "location" | "category" | "emoji" | "text";
  content: string;
  position: {
    x: number;
    y: number;
  };
  timestamp?: string;
  style?: {
    rotate?: number;
    scale?: number;
  };
}

export interface TimelineDay {
  date: string;
  items: MediaItem[];
  stickers: Sticker[];
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  days: TimelineDay[];
  theme?: string;
  location?: string;
  description?: string;
  bannerImage?: string;
}

export const timeOfDay = (date: Date): TimeOfDay => {
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) return "morning";
  if (hours >= 12 && hours < 17) return "afternoon";
  if (hours >= 17 && hours < 21) return "evening";
  return "night";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}; 