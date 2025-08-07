import { useState, useEffect } from 'react';
import { restaurantData } from '@/data/restaurant';

export default function MinimalNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'menu', label: 'Menu', href: '#menu' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Minimal Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              {/* Simple geometric logo */}
              <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white"></div>
              </div>
              <span className="text-lg font-thin text-gray-900 tracking-wide">
                {restaurantData.name}
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Ultra minimal */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300 relative minimal-nav-item"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button - Minimal */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-900 p-2 transition-colors duration-300"
            >
              <div className="w-5 h-5 relative">
                <span className={`absolute w-full h-px bg-current transition-all duration-300 ${
                  isOpen ? 'top-2 rotate-45' : 'top-0'
                }`}></span>
                <span className={`absolute w-full h-px bg-current transition-all duration-300 ${
                  isOpen ? 'opacity-0 top-2' : 'top-2 opacity-100'
                }`}></span>
                <span className={`absolute w-full h-px bg-current transition-all duration-300 ${
                  isOpen ? 'top-2 -rotate-45' : 'top-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel - Minimal */}
        <div className={`md:hidden transition-all duration-300 ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="py-4 space-y-1 border-t border-gray-100">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm text-gray-500 hover:text-gray-900 py-2 transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}