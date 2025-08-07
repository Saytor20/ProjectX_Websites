'use client';
import React, { useEffect, useState } from 'react';
import FiolaHero from '@/components/FiolaHero';
import FiolaAbout from '@/components/FiolaAbout';
import FiolaMenu from '@/components/FiolaMenu';
import FiolaContact from '@/components/FiolaContact';
import FiolaFooter from '@/components/FiolaFooter';

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Sophisticated loading sequence
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center z-50"
        style={{ 
          background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
          fontFamily: 'Playfair Display, serif'
        }}
      >
        <div 
          className="text-4xl font-light mb-6"
          style={{ 
            color: '#000000',
            letterSpacing: '0.02em'
          }}
        >
          Restaurant
        </div>
        
        <div className="w-16 h-px bg-black mb-6"></div>
        
        <div 
          className="text-sm uppercase tracking-widest"
          style={{ 
            color: '#666666',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.15em'
          }}
        >
          Preparing Experience
        </div>
        
        {/* Minimal loading animation */}
        <div className="mt-8 flex space-x-1">
          <div 
            className="w-1 h-1 bg-black rounded-full animate-pulse"
            style={{ animationDelay: '0s', animationDuration: '1.4s' }}
          ></div>
          <div 
            className="w-1 h-1 bg-black rounded-full animate-pulse"
            style={{ animationDelay: '0.2s', animationDuration: '1.4s' }}
          ></div>
          <div 
            className="w-1 h-1 bg-black rounded-full animate-pulse"
            style={{ animationDelay: '0.4s', animationDuration: '1.4s' }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <main className="fiola-minimalist">
      <FiolaHero />
      <FiolaAbout />
      <FiolaMenu />
      <FiolaContact />
      <FiolaFooter />
    </main>
  );
}