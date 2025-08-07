'use client';
import { useEffect } from 'react';
import SimpleHero from '@/components/SimpleHero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';

export default function Home() {
  useEffect(() => {
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0);
    
    // Also clear any hash from URL that might cause scrolling
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <main className="min-h-screen">
      <SimpleHero />
      <About />
      <Menu />
      <Gallery />
      <Contact />
    </main>
  );
}