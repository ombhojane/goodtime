'use client';

import Hero from './components/landing/Hero';
import DemoVideo from './components/landing/DemoVideo';
import Features from './components/landing/Features';
import CTA from './components/landing/CTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <DemoVideo />
      <Features />
      <CTA />
    </main>
  );
}
