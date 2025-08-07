'use client';
import React, { useEffect, useState } from 'react';
import RomansHero from '@/components/RomansHero';
import RomansAbout from '@/components/RomansAbout';
import RomansMenu from '@/components/RomansMenu';
import RomansContact from '@/components/RomansContact';
import RomansFooter from '@/components/RomansFooter';

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Community-focused loading sequence
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center z-50"
        style={{ 
          background: 'linear-gradient(135deg, #F8F6F0 0%, #E8D5B7 100%)',
          fontFamily: 'DM Serif Display, serif'
        }}
      >
        {/* Farm-to-table loading animation */}
        <div className="mb-8">
          <div 
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
            style={{ 
              borderColor: '#4A5D23',
              borderTopColor: 'transparent'
            }}
          ></div>
        </div>
        
        <div 
          className="text-3xl font-normal mb-4"
          style={{ 
            color: '#2B1810',
            letterSpacing: '-0.005em'
          }}
        >
          Neighborhood Italian
        </div>
        
        <div 
          className="inline-flex items-center gap-2 bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold mb-6"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
          </svg>
          <span>Farm to Table</span>
        </div>
        
        <div 
          className="text-sm uppercase tracking-widest"
          style={{ 
            color: '#5D4E42',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.1em'
          }}
        >
          Sourcing Fresh Ingredients
        </div>
      </div>
    );
  }

  return (
    <main className="romans-neighborhood">
      <RomansHero />
      <RomansAbout />
      <RomansMenu />
      <RomansContact />
      <RomansFooter />
    </main>
  );
}