import { useState } from 'react';
import { restaurantData } from '@/data/restaurant';

export default function CyberpunkNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: '[HOME]', href: '#home' },
    { id: 'about', label: '[PROFILE]', href: '#about' },
    { id: 'menu', label: '[DATABASE]', href: '#menu' },
    { id: 'gallery', label: '[ARCHIVE]', href: '#gallery' },
    { id: 'contact', label: '[CONNECT]', href: '#contact' },
  ];

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-cyan-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-sm animate-pulse"></div>
                <div>
                  <h1 className="text-xl font-mono font-bold text-white">
                    {restaurantData.name}
                  </h1>
                  <div className="text-xs text-cyan-400 font-mono">
                    [NEURAL_DINING_SYSTEM]
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveSection(item.id)}
                    className={`relative px-4 py-2 text-sm font-mono transition-all duration-300 group ${
                      activeSection === item.id
                        ? 'text-cyan-400'
                        : 'text-gray-300 hover:text-cyan-400'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <div 
                      className={`absolute inset-0 bg-cyan-400/10 border border-cyan-400/30 transform transition-all duration-300 ${
                        activeSection === item.id ? 'scale-100' : 'scale-0 group-hover:scale-100'
                      }`}
                    ></div>
                    {/* Scanning effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700`}></div>
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 bg-transparent border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-colors cyber-button"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center mx-auto">
                  <span className={`block w-4 h-0.5 bg-current transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-0.5' : ''}`}></span>
                  <span className={`block w-4 h-0.5 bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} style={{ marginTop: '2px' }}></span>
                  <span className={`block w-4 h-0.5 bg-current transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-0.5' : ''}`} style={{ marginTop: '2px' }}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="bg-black/95 border-t border-cyan-400/30">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsOpen(false);
                }}
                className={`block px-4 py-3 text-base font-mono border-b border-gray-800/50 transition-colors ${
                  activeSection === item.id
                    ? 'text-cyan-400 bg-cyan-400/5'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* System Status Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-black/60 backdrop-blur-sm border-b border-cyan-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-8 text-xs font-mono text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="text-green-400">[ONLINE]</span>
              <span>SYS_TEMP: 36°C</span>
              <span>UPTIME: 99.9%</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-cyan-400 animate-pulse">●</span>
              <span>NEURAL_LINK_ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}