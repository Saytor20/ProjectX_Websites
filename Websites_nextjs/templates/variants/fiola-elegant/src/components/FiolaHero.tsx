'use client';
import { useState } from 'react';
import { restaurantData } from '@/data/restaurant';

const FiolaHero = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-background)] via-[var(--color-surface)] to-[var(--color-surface-elevated)] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${restaurantData.heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter-x)] text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Established Date */}
          <div className="flex justify-center mb-8">
            <div className="bg-[var(--color-primary)]/10 backdrop-blur-sm rounded-full px-6 py-2">
              <p className="text-[var(--color-primary)] font-medium tracking-widest uppercase text-sm">
                Established Restaurant
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
            Welcome to 
            <span className="block italic font-[var(--font-heading)] text-[var(--color-accent)]">
              {restaurantData.name}
            </span>
            <span className="block font-semibold text-3xl md:text-4xl lg:text-5xl mt-4">
              Fine Dining Experience
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-4 max-w-2xl mx-auto leading-relaxed">
            {restaurantData.description}
          </p>

          {/* Location */}
          <p className="text-sm md:text-base text-white/70 mb-12 tracking-widest uppercase">
            {restaurantData.address}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#contact"
              className="inline-block bg-wine-red hover:bg-wine-red/90 text-white px-8 py-3 rounded-lg text-lg font-medium tracking-wide transition-all duration-300 hover:scale-105"
            >
              Make Reservation
            </a>
            
            <button
              onClick={() => setShowMenu(true)}
              className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-wine-red px-8 py-3 rounded-lg text-lg font-medium tracking-wide transition-all duration-300"
            >
              View Menu
            </button>
          </div>

          {/* Menu Modal */}
          {showMenu && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-wine-red">Our Menu</h2>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-elegant-gray mb-4">Featured Items</h3>
                      <div className="space-y-4">
                        {restaurantData.menu.slice(0, 3).map((item, index) => (
                          <div key={index} className="border-b border-gray-200 pb-3">
                            <h4 className="font-medium text-wine-red">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                            <p className="text-wine-red font-medium">${item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-elegant-gray mb-4">Specialties</h3>
                      <div className="space-y-4">
                        {restaurantData.menu.slice(3, 6).map((item, index) => (
                          <div key={index} className="border-b border-gray-200 pb-3">
                            <h4 className="font-medium text-wine-red">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                            <p className="text-wine-red font-medium">${item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <a 
                      href="#menu"
                      className="text-wine-red hover:underline font-medium"
                      onClick={() => setShowMenu(false)}
                    >
                      View Full Menu
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-pulse"></div>
            </div>
            <p className="text-xs text-white/60 mt-2 tracking-widest">SCROLL</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiolaHero;