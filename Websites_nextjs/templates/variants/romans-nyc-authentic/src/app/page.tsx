'use client';
import { useEffect, useState } from 'react';
import SimpleHero from '@/components/SimpleHero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0);
    
    // Clear any hash from URL that might cause scrolling
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Community-focused loading animation sequence
    setLoaded(true);
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center z-50"
        style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F5DEB3 100%)' }}
      >
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
          style={{ 
            background: 'linear-gradient(45deg, #8B4513, #D2691E)',
            boxShadow: '0 4px 20px rgba(139, 69, 19, 0.3)'
          }}
        >
          <svg className="w-6 h-6 text-white animate-spin" width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
          </svg>
        </div>
        
        <div 
          className="text-xl font-light text-center mb-4"
          style={{ 
            color: '#8B4513',
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '0.05em'
          }}
        >
          Preparing Fresh Ingredients...
        </div>
        
        <div 
          className="absolute bottom-10 flex items-center gap-2 text-xs uppercase tracking-wide"
          style={{ color: 'rgba(139, 69, 19, 0.7)' }}
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
          </svg>
          <span>Farm to Table • Brooklyn Italian</span>
        </div>
      </div>
    );
  }

  return (
    <main className="rustic-serif community-card" style={{ minHeight: '100vh' }}>
      <SimpleHero />
      <About />
      <Menu />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}