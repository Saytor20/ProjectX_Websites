'use client';
import { useState } from 'react';
import { restaurantData } from '@/data/restaurant';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 shadow-lg border-b-4 border-gradient-sunset">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 coconut-sway">
            <h1 className="text-2xl font-bold tropical-title sunset-gradient-text">{restaurantData.name}</h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#home" className="mango-text hover:coral-text px-3 py-2 text-sm font-medium tropical-text transition-colors ocean-wave">Home</a>
              <a href="#about" className="mango-text hover:coral-text px-3 py-2 text-sm font-medium tropical-text transition-colors ocean-wave">About</a>
              <a href="#menu" className="mango-text hover:coral-text px-3 py-2 text-sm font-medium tropical-text transition-colors ocean-wave">Menu</a>
              <a href="#gallery" className="mango-text hover:coral-text px-3 py-2 text-sm font-medium tropical-text transition-colors ocean-wave">Gallery</a>
              <a href="#contact" className="mango-text hover:coral-text px-3 py-2 text-sm font-medium tropical-text transition-colors ocean-wave">Contact</a>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-orange-600 hover:text-coral-500 p-2 paradise-button"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 sand-texture shadow-lg border-t-2 border-orange-300">
            <a href="#home" className="ocean-text hover:coral-text block px-3 py-2 text-base font-medium tropical-text">Home</a>
            <a href="#about" className="ocean-text hover:coral-text block px-3 py-2 text-base font-medium tropical-text">About</a>
            <a href="#menu" className="ocean-text hover:coral-text block px-3 py-2 text-base font-medium tropical-text">Menu</a>
            <a href="#gallery" className="ocean-text hover:coral-text block px-3 py-2 text-base font-medium tropical-text">Gallery</a>
            <a href="#contact" className="ocean-text hover:coral-text block px-3 py-2 text-base font-medium tropical-text">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
}