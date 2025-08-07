'use client';
import React, { useEffect, useState } from 'react';
import SimpleHero from '@/components/SimpleHero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simple loading sequence without Material-UI
    setShowContent(true);
  }, []);

  if (!showContent) {
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center z-50"
        style={{ background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)' }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white animate-spin" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div 
          className="text-2xl font-light text-center mb-4"
          style={{ 
            color: '#C9A961',
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '0.1em'
          }}
        >
          Preparing Your Experience...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ fontFamily: 'Playfair Display, serif' }}>
      <SimpleHero />
      <About />
      <Menu />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}