'use client';
import { useState } from 'react';
import { restaurantData } from '@/data/restaurant';

const BBQHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'MENU', href: '#menu' },
    { name: 'ABOUT', href: '#about' },
    { name: 'GALLERY', href: '#gallery' },
    { name: 'CONTACT', href: '#contact' }
  ];

  return (
    <header className="bg-bbq-dark text-bbq-cream sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-bbq-cream uppercase tracking-wide">
              {restaurantData.name}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className="text-bbq-cream hover:text-bbq-pink transition-colors font-medium uppercase tracking-wide"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Contact & Takeout Button */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-bbq-cream">
              <a href={`tel:${restaurantData.phone}`} className="hover:text-bbq-pink transition-colors">
                {restaurantData.phone}
              </a>
            </div>
            <a 
              href="#contact"
              className="bg-bbq-pink hover:bg-bbq-pink/90 text-white px-6 py-2 rounded-lg uppercase font-bold tracking-wide transition-all duration-300 hover:scale-105"
            >
              Order Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-bbq-cream hover:text-bbq-pink transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-bbq-brown">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="text-bbq-cream hover:text-bbq-pink transition-colors font-medium uppercase tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-4 pt-4">
                <div className="text-sm text-bbq-cream">
                  <a href={`tel:${restaurantData.phone}`} className="hover:text-bbq-pink transition-colors">
                    {restaurantData.phone}
                  </a>
                </div>
                {restaurantData.email && (
                  <div className="text-sm text-bbq-cream">
                    <a href={`mailto:${restaurantData.email}`} className="hover:text-bbq-pink transition-colors">
                      {restaurantData.email}
                    </a>
                  </div>
                )}
              </div>
              <a 
                href="#contact"
                className="bg-bbq-pink hover:bg-bbq-pink/90 text-white w-fit px-6 py-2 rounded-lg uppercase font-bold tracking-wide transition-all duration-300 hover:scale-105"
              >
                Order Now
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default BBQHeader;