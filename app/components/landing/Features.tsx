'use client';

import Icon from '../Icon';

const features = [
  {
    icon: 'timeline',
    title: 'Visual Timeline',
    description: 'Create a visual timeline of your journey with photos arranged chronologically.',
  },
  {
    icon: 'image',
    title: 'Smart Photo Organization',
    description: 'Upload multiple photos at once. Our app arranges them by date automatically.',
  },
  {
    icon: 'sticker',
    title: 'Custom Stickers',
    description: 'Add fun stickers, text, and emojis to highlight special moments.',
  },
  {
    icon: 'palette',
    title: 'Theme Options',
    description: 'Customize your moodboard with different color themes and styles.',
  },
  {
    icon: 'download',
    title: 'Export & Share',
    description: 'Export your trip moodboard as images and share with friends and family.',
  },
  {
    icon: 'sun',
    title: 'Dark & Light Mode',
    description: 'Switch between dark and light mode for comfortable viewing any time of day.',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-background relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build beautiful trip memories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <Icon name={feature.icon} size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-muted/40 border border-border rounded-xl p-8 md:p-12 text-center md:text-left">
          <div className="md:flex items-center justify-between">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-400 mb-4">
                Coming Soon
              </span>
              <h3 className="text-2xl font-bold mb-2">AI-Powered Memories</h3>
              <p className="text-muted-foreground max-w-md mb-6 md:mb-0">
                Our new AI feature will automatically generate captions and tag locations based on your photos.
              </p>
            </div>
            
            <div className="inline-flex h-14 overflow-hidden rounded-lg">
              <div className="bg-primary/10 px-4 flex items-center justify-center">
                <Icon name="category" size={20} className="text-primary" />
              </div>
              <input 
                type="email"
                placeholder="Enter email for early access"
                className="bg-background px-4 py-2 text-sm focus:outline-none w-64"
              />
              <button className="bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="hidden lg:block absolute top-40 -left-6 w-12 h-12 rounded-full bg-teal-500/10"></div>
      <div className="hidden lg:block absolute top-60 -right-6 w-24 h-24 rounded-full bg-sky-500/10"></div>
    </section>
  );
} 