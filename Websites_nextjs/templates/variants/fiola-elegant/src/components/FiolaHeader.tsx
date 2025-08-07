'use client';
import { useState } from 'react';
import { restaurantData } from '@/data/restaurant';

const FiolaHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'HOME', href: '#home' },
    { name: 'ABOUT', href: '#about' },
    { name: 'MENU', href: '#menu' },
    { name: 'GALLERY', href: '#gallery' },
    { name: 'CONTACT', href: '#contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-warm-white/95 backdrop-blur-sm border-b border-soft-gray/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-wine-red font-serif">{restaurantData.name}</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-elegant-gray hover:text-wine-red transition-colors duration-200 tracking-wide"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-sm text-elegant-gray">
              <a href={`tel:${restaurantData.phone}`} className="hover:text-wine-red transition-colors">
                {restaurantData.phone}
              </a>
            </div>
            {restaurantData.email && (
              <div className="text-sm text-elegant-gray">
                <a href={`mailto:${restaurantData.email}`} className="hover:text-wine-red transition-colors">
                  {restaurantData.email}
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-elegant-gray hover:text-wine-red p-2"
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
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-warm-white shadow-lg border-t border-soft-gray/20">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-elegant-gray hover:text-wine-red block px-3 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="px-3 py-2 border-t border-soft-gray/30 mt-4">
              <div className="text-sm text-elegant-gray space-y-2">
                <p>
                  <a href={`tel:${restaurantData.phone}`} className="hover:text-wine-red transition-colors">
                    {restaurantData.phone}
                  </a>
                </p>
                {restaurantData.email && (
                  <p>
                    <a href={`mailto:${restaurantData.email}`} className="hover:text-wine-red transition-colors">
                      {restaurantData.email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default FiolaHeader;