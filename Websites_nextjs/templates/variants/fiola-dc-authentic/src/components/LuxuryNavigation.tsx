import { useState, useEffect } from 'react';
import { restaurantData } from '@/data/restaurant';

export default function LuxuryNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'menu', label: 'Menu', href: '#menu' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'contact', label: 'Reservations', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-black/95 backdrop-blur-md shadow-2xl border-b border-amber-400/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Premium Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center space-x-3 group">
              {/* Michelin Star Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-thin text-white tracking-wide group-hover:text-amber-400 transition-colors duration-300">
                  {restaurantData.name}
                </h1>
                <p className="text-xs text-amber-400 uppercase tracking-[0.2em]">
                  Michelin Starred
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
                  className="group relative text-white hover:text-amber-400 px-4 py-2 text-sm font-medium transition-all duration-300 luxury-nav-item"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></div>
                  
                  {/* Premium glow effect */}
                  <div className="absolute inset-0 bg-amber-400/5 rounded-sm transform scale-0 transition-transform duration-300 group-hover:scale-100"></div>
                </a>
              ))}
              
              {/* Premium Reserve Button */}
              <a
                href="#contact"
                className="group relative overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 text-black px-6 py-2 text-sm font-medium transition-all duration-300 luxury-reserve-btn"
              >
                <span className="relative z-10">Reserve Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative text-white hover:text-amber-400 p-2 transition-colors duration-300 group"
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
        <div className={`md:hidden transition-all duration-500 ${
          isOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="bg-black/95 backdrop-blur-md border-t border-amber-400/20 px-2 pt-4 pb-6 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-amber-400 hover:bg-amber-400/5 px-4 py-3 text-base font-medium transition-all duration-300 rounded-sm"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-amber-400/20 mt-4">
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-gradient-to-r from-amber-400 to-amber-500 text-black px-4 py-3 text-base font-medium transition-all duration-300 rounded-sm"
              >
                Reserve Now
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium accent line */}
      <div className={`h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent transition-opacity duration-500 ${
        scrolled ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </nav>
  );
}