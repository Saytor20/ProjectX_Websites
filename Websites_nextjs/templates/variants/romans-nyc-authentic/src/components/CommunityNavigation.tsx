import { useState, useEffect } from 'react';
import { restaurantData } from '@/data/restaurant';

export default function CommunityNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'Our Story', href: '#about' },
    { id: 'menu', label: 'Menu', href: '#menu' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'contact', label: 'Visit Us', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-orange-200' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Community Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center space-x-3 group">
              {/* Rustic logo icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-medium text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                  {restaurantData.name}
                </h1>
                <p className="text-xs text-orange-600 uppercase tracking-wide font-medium">
                  Brooklyn Italian
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="group relative text-gray-700 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-all duration-300 community-nav-item"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></div>
                  
                  {/* Warm hover background */}
                  <div className="absolute inset-0 bg-orange-50 rounded-md transform scale-0 transition-transform duration-300 group-hover:scale-100"></div>
                </a>
              ))}
              
              {/* Community Join Button */}
              <a
                href="#contact"
                className="group relative overflow-hidden bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 text-sm font-medium transition-all duration-300 rounded-md community-join-btn"
              >
                <span className="relative z-10">Join Our Table</span>
                <div className="absolute inset-0 bg-orange-700 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative text-gray-700 hover:text-orange-600 p-2 transition-colors duration-300"
            >
              <span className="sr-only">Open menu</span>
              <div className="w-6 h-6 relative">
                <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? 'rotate-45 top-2.5' : 'top-1'
                }`}></span>
                <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'top-2.5 opacity-100'
                }`}></span>
                <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? '-rotate-45 top-2.5' : 'top-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <div className={`md:hidden transition-all duration-300 ${
          isOpen 
            ? 'max-h-80 opacity-100' 
            : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="bg-white border-t border-orange-200 px-2 pt-4 pb-6 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 text-base font-medium transition-all duration-300 rounded-md"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-orange-200 mt-4">
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 text-base font-medium transition-all duration-300 rounded-md"
              >
                Join Our Table
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Community accent line */}
      <div className={`h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent transition-opacity duration-300 ${
        scrolled ? 'opacity-100' : 'opacity-0'
      }`}></div>
      
      {/* Sustainability badge */}
      {scrolled && (
        <div className="absolute top-full left-4 bg-green-600 text-white px-3 py-1 text-xs font-medium rounded-b-md sustainability-badge">
          <span className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.51-2.69c1.58-.31 3.62-.65 5.78-1.31 2.4-.73 5.15-1.85 8-3.67V8z"/>
              <path d="M3.5 12.5c.83-.33 1.72-.62 2.68-.87L3.5 5.5v7z"/>
            </svg>
            <span>Farm Fresh Daily</span>
          </span>
        </div>
      )}
    </nav>
  );
}