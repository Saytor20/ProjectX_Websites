'use client';
import { useState } from 'react';
import { restaurantData } from '@/data/restaurant';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{restaurantData.name}</h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#home" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium tracking-wide transition-colors">Home</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium tracking-wide transition-colors">About</a>
              <a href="#menu" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium tracking-wide transition-colors">Menu</a>
              <a href="#gallery" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium tracking-wide transition-colors">Gallery</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium tracking-wide transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 transition-colors"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg border-t border-gray-100">
            <a href="#home" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors">Home</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors">About</a>
            <a href="#menu" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors">Menu</a>
            <a href="#gallery" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors">Gallery</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
}