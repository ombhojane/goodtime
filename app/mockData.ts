// This file is kept for reference only.
// All mock data has been moved directly into components per the latest requirements.
// Sample data is now in page.tsx 

'use client';

import { Trip } from './types';
import { generateId } from './utils';

// Sample trip data for demo purposes
export const sampleTrip: Trip = {
  id: generateId(),
  title: "Summer in Japan",
  startDate: "2023-07-10",
  endDate: "2023-07-20",
  days: [
    {
      date: "2023-07-10",
      items: [
        {
          id: generateId(),
          src: "/images/tokyo-1.jpg", 
          type: "image",
          timestamp: "2023-07-10T09:30:00Z",
          location: {
            name: "Shibuya Crossing, Tokyo"
          },
          caption: "Arrived in Tokyo! The famous Shibuya crossing is even busier than I expected."
        }
      ],
      stickers: [
        {
          id: generateId(),
          type: "emoji",
          content: "✈️",
          position: { x: 20, y: 30 },
          style: { rotate: -15, scale: 1.2 }
        }
      ]
    },
    {
      date: "2023-07-12",
      items: [
        {
          id: generateId(),
          src: "/images/kyoto-1.jpg",
          type: "image",
          timestamp: "2023-07-12T14:20:00Z",
          location: {
            name: "Fushimi Inari Shrine, Kyoto"
          },
          caption: "The path of a thousand torii gates was breathtaking!"
        }
      ],
      stickers: [
        {
          id: generateId(),
          type: "text",
          content: "Kyoto Vibes",
          position: { x: 70, y: 50 },
          style: { rotate: 5, scale: 1 }
        }
      ]
    },
    {
      date: "2023-07-15",
      items: [
        {
          id: generateId(),
          src: "/images/osaka-1.jpg",
          type: "image",
          timestamp: "2023-07-15T20:00:00Z",
          location: {
            name: "Dotonbori, Osaka"
          },
          caption: "Amazing street food in Osaka's food district!"
        }
      ],
      stickers: [
        {
          id: generateId(),
          type: "emoji",
          content: "🍜",
          position: { x: 80, y: 20 },
          style: { rotate: 0, scale: 1.5 }
        }
      ]
    }
  ],
  theme: "teal"
}; 