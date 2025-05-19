'use client';

import Icon from '../Icon';
import { useState } from 'react';

const features = [
  {
    icon: 'timeline',
    title: 'Visual Storytelling',
    description: 'Transform scattered photos into immersive visual narratives that flow naturally.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: 'image',
    title: 'Instant Organization',
    description: 'Upload once, organized forever. Smart AI arranges your memories chronologically.',
    color: 'from-sky-500 to-blue-500',
  },
  {
    icon: 'sticker',
    title: 'Emotional Markers',
    description: 'Highlight peak moments with custom stickers that bring your feelings to life.',
    color: 'from-teal-500 to-green-500',
  },
  {
    icon: 'palette',
    title: 'Your Signature Style',
    description: 'Match your aesthetic with beautiful themes that reflect your personality.',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    icon: 'download',
    title: 'Print & Share',
    description: 'From screen to keepsake. Create tangible memories to display and gift.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: 'sun',
    title: 'Perfect Viewing',
    description: 'Light or dark mode ensures your story looks stunning, day or night.',
    color: 'from-indigo-500 to-blue-500',
  },
];

export default function Features() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      {/* Animated background blob that moves toward hovered feature */}
      {hoveredFeature !== null && (
        <div 
          className="absolute w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl transition-all duration-500 ease-out"
          style={{ 
            top: `calc(${Math.floor(hoveredFeature / 3) * 50 + 25}% - 200px)`,
            left: `calc(${hoveredFeature % 3 * 33 + 16}% - 200px)`,
          }}
        ></div>
      )}
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            The tools you need, none you don't
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Experience the difference</h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Unique features designed to turn ordinary trips into extraordinary stories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-border bg-card relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <Icon name={feature.icon} size={28} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl"></div>
          
          <div className="relative overflow-hidden rounded-3xl border border-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="px-8 py-12 md:p-12 relative">
              <div className="md:flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-400 mb-6">
                    <span className="mr-1.5">⚡</span>
                    <span>Coming this month</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-3">AI Memory Curation</h3>
                  <p className="text-muted-foreground max-w-md mb-6 md:mb-0">
                    Let AI suggest the best moments from your trip. Smart captions, location tagging, and perfect arrangement — automagically.
                  </p>
                </div>
                
                <div className="inline-flex h-14 overflow-hidden rounded-xl shadow-lg">
                  <div className="bg-primary/15 px-4 flex items-center justify-center">
                    <Icon name="category" size={20} className="text-primary" />
                  </div>
                  <input 
                    type="email"
                    placeholder="Email for early access"
                    className="bg-background px-4 py-2 text-sm focus:outline-none w-56 md:w-64"
                  />
                  <button className="bg-primary text-white px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                    Get Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="hidden lg:block absolute top-40 -left-6 w-24 h-24 rounded-full bg-violet-500/10 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="hidden lg:block absolute top-1/2 -right-6 w-32 h-32 rounded-full bg-teal-500/10 animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
    </section>
  );
} 