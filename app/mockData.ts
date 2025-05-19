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
  endDate: "2023-07-12",
  location: "Japan",
  description: "An unforgettable journey through Tokyo, Kyoto, and Osaka - exploring ancient temples, bustling city streets, and incredible cuisine.",
  bannerImage: "/images/japan-banner.jpg",
  days: [
    {
      date: "2023-07-10",
      items: [
        {
          id: generateId(),
          src: "/images/tokyo-morning.jpg", 
          type: "image",
          timestamp: "2023-07-10T08:30:00Z",
          location: {
            name: "Narita International Airport, Tokyo"
          },
          caption: "Landed in Tokyo! 🇯🇵 Can't believe I'm finally here after months of planning!"
        },
        {
          id: generateId(),
          src: "/images/tokyo-breakfast.jpg", 
          type: "image",
          timestamp: "2023-07-10T09:45:00Z",
          location: {
            name: "Tsukiji Outer Market, Tokyo"
          },
          caption: "First breakfast in Japan - the freshest sushi I've ever had! 🍣"
        },
        {
          id: generateId(),
          src: "/images/shibuya-crossing.jpg", 
          type: "image",
          timestamp: "2023-07-10T12:30:00Z",
          location: {
            name: "Shibuya Crossing, Tokyo"
          },
          caption: "The famous Shibuya crossing is even busier than I expected. Thousands of people crossing at once! 🚶‍♀️🚶‍♂️"
        },
        {
          id: generateId(),
          src: "/images/harajuku-street.jpg", 
          type: "image",
          timestamp: "2023-07-10T15:00:00Z",
          location: {
            name: "Takeshita Street, Harajuku"
          },
          caption: "Harajuku's Takeshita Street is a colorful sensory overload! So many unique fashion styles and cute shops. 👗✨"
        },
        {
          id: generateId(),
          src: "/images/meiji-shrine.jpg", 
          type: "image",
          timestamp: "2023-07-10T17:15:00Z",
          location: {
            name: "Meiji Shrine, Tokyo"
          },
          caption: "Finding peace at Meiji Shrine - such a contrast from the busy streets just minutes away. 🌳"
        },
        {
          id: generateId(),
          src: "/images/tokyo-dinner.jpg", 
          type: "image",
          timestamp: "2023-07-10T19:30:00Z",
          location: {
            name: "Izakaya, Shinjuku"
          },
          caption: "Dinner at a traditional izakaya in Shinjuku. The yakitori is incredible! 🍢🍻"
        },
        {
          id: generateId(),
          src: "/images/tokyo-night.jpg", 
          type: "image",
          timestamp: "2023-07-10T22:00:00Z",
          location: {
            name: "Shinjuku, Tokyo"
          },
          caption: "Neon lights of Shinjuku at night. Tokyo never sleeps! 🌃"
        }
      ],
      stickers: [
        {
          id: generateId(),
          type: "emoji",
          content: "✈️",
          position: { x: 15, y: 15 },
          style: { rotate: -15, scale: 1.2 }
        },
        {
          id: generateId(),
          type: "emoji",
          content: "🇯🇵",
          position: { x: 85, y: 20 },
          style: { rotate: 0, scale: 1.3 }
        },
        {
          id: generateId(),
          type: "emoji",
          content: "🍣",
          position: { x: 30, y: 40 },
          style: { rotate: 10, scale: 1.2 }
        },
        {
          id: generateId(),
          type: "text",
          content: "First Day!",
          position: { x: 65, y: 85 },
          style: { rotate: -5, scale: 1.1 }
        }
      ]
    },
    {
      date: "2023-07-11",
      items: [
        {
          id: generateId(),
          src: "/images/tokyo-sunrise.jpg",
          type: "image",
          timestamp: "2023-07-11T05:30:00Z",
          location: {
            name: "Tokyo Skytree"
          },
          caption: "Woke up early to see sunrise from Tokyo Skytree. Worth every minute of lost sleep! 🌅"
        },
        {
          id: generateId(),
          src: "/images/asakusa-temple.jpg",
          type: "image",
          timestamp: "2023-07-11T09:00:00Z",
          location: {
            name: "Senso-ji Temple, Asakusa"
          },
          caption: "Morning visit to Senso-ji, Tokyo's oldest temple. The massive red lantern is impressive! ⛩️"
        },
        {
          id: generateId(),
          src: "/images/tokyo-garden.jpg",
          type: "image",
          timestamp: "2023-07-11T11:45:00Z",
          location: {
            name: "Shinjuku Gyoen National Garden"
          },
          caption: "Peaceful walk through Shinjuku Gyoen. The perfect blend of Japanese, French, and English garden styles. 🌸"
        },
        {
          id: generateId(),
          src: "/images/teamlab-borderless.jpg",
          type: "image",
          timestamp: "2023-07-11T14:30:00Z",
          location: {
            name: "teamLab Borderless Museum, Tokyo"
          },
          caption: "Afternoon at teamLab Borderless digital art museum. Mind-blowing interactive light displays! ✨🎨"
        },
        {
          id: generateId(),
          src: "/images/tokyo-station.jpg",
          type: "image",
          timestamp: "2023-07-11T17:00:00Z",
          location: {
            name: "Tokyo Station"
          },
          caption: "Tokyo Station is both a transportation hub and architectural marvel. Getting ready to board the Shinkansen to Kyoto tomorrow! 🚄"
        },
        {
          id: generateId(),
          src: "/images/ramen-dinner.jpg",
          type: "image",
          timestamp: "2023-07-11T19:15:00Z",
          location: {
            name: "Ramen Street, Tokyo Station"
          },
          caption: "Best. Ramen. Ever. The broth has been simmering for 48 hours! 🍜"
        },
        {
          id: generateId(),
          src: "/images/tokyo-tower-night.jpg",
          type: "image",
          timestamp: "2023-07-11T21:30:00Z",
          location: {
            name: "Tokyo Tower"
          },
          caption: "Tokyo Tower lit up at night - even more beautiful than in photos! 🗼✨"
        }
      ],
      stickers: [
        {
          id: generateId(),
          type: "emoji",
          content: "🗼",
          position: { x: 20, y: 75 },
          style: { rotate: 0, scale: 1.4 }
        },
        {
          id: generateId(),
          type: "emoji",
          content: "🍜",
          position: { x: 75, y: 30 },
          style: { rotate: -10, scale: 1.3 }
        },
        {
          id: generateId(),
          type: "text",
          content: "Tokyo Day 2",
          position: { x: 60, y: 15 },
          style: { rotate: 5, scale: 1 }
        },
        {
          id: generateId(),
          type: "emoji",
          content: "🌸",
          position: { x: 15, y: 40 },
          style: { rotate: 0, scale: 1.2 }
        }
      ]
    },
    {
      date: "2023-07-12",
      items: [
        {
          id: generateId(),
          src: "/images/shinkansen.jpg",
          type: "image",
          timestamp: "2023-07-12T07:00:00Z",
          location: {
            name: "Shinkansen Bullet Train"
          },
          caption: "On the Shinkansen to Kyoto! This bullet train is incredibly smooth at 320 km/h. 🚄"
        },
        {
          id: generateId(),
          src: "/images/arashiyama-bamboo.jpg",
          type: "image",
          timestamp: "2023-07-12T10:30:00Z",
          location: {
            name: "Arashiyama Bamboo Grove, Kyoto"
          },
          caption: "Morning walk through the magical Arashiyama Bamboo Grove. The sound of bamboo swaying in the wind is so peaceful. 🎋"
        },
        {
          id: generateId(),
          src: "/images/kyoto-temple.jpg",
          type: "image",
          timestamp: "2023-07-12T12:45:00Z",
          location: {
            name: "Kinkaku-ji (Golden Pavilion), Kyoto"
          },
          caption: "The Golden Pavilion lives up to its name! Stunning reflection on the pond. ✨"
        },
        {
          id: generateId(),
          src: "/images/kyoto-lunch.jpg",
          type: "image",
          timestamp: "2023-07-12T13:30:00Z",
          location: {
            name: "Traditional Restaurant, Kyoto"
          },
          caption: "Traditional Kyoto-style lunch with so many small dishes. Each one is a work of art! 🍱"
        },
        {
          id: generateId(),
          src: "/images/fushimi-inari.jpg",
          type: "image",
          timestamp: "2023-07-12T15:30:00Z",
          location: {
            name: "Fushimi Inari Shrine, Kyoto"
          },
          caption: "The famous path of thousand torii gates at Fushimi Inari Shrine. Walked all the way to the top! 🏮"
        },
        {
          id: generateId(),
          src: "/images/gion-district.jpg",
          type: "image",
          timestamp: "2023-07-12T18:00:00Z",
          location: {
            name: "Gion District, Kyoto"
          },
          caption: "Evening in Gion, Kyoto's famous geisha district. Spotted a maiko (apprentice geisha) walking to an appointment! 👘"
        },
        {
          id: generateId(),
          src: "/images/kyoto-night.jpg",
          type: "image",
          timestamp: "2023-07-12T20:30:00Z",
          location: {
            name: "Pontocho Alley, Kyoto"
          },
          caption: "Dinner at a riverside restaurant on Pontocho Alley. Perfect end to an amazing journey through Japan. 🌙"
        }
      ],
      stickers: [
        {
          id: generateId(),
          type: "emoji",
          content: "⛩️",
          position: { x: 25, y: 25 },
          style: { rotate: 0, scale: 1.5 }
        },
        {
          id: generateId(),
          type: "emoji",
          content: "🏮",
          position: { x: 80, y: 30 },
          style: { rotate: 15, scale: 1.2 }
        },
        {
          id: generateId(),
          type: "text",
          content: "Kyoto Magic",
          position: { x: 50, y: 75 },
          style: { rotate: -5, scale: 1.1 }
        },
        {
          id: generateId(),
          type: "emoji",
          content: "🍵",
          position: { x: 15, y: 60 },
          style: { rotate: 0, scale: 1.3 }
        }
      ]
    }
  ],
  theme: "teal"
}; 