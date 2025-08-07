'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const SimpleHero = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center"
      style={{
        background: `linear-gradient(rgba(139, 69, 19, 0.3), rgba(139, 69, 19, 0.3)), url(${restaurantData.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#2C1810'
      }}
    >
      <div className="container mx-auto px-4 text-center">
        {/* Brooklyn Location Badge */}
        <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Fort Greene, Brooklyn
        </div>
        
        {/* Restaurant Name */}
        <h1 
          className="text-5xl md:text-7xl font-light mb-4"
          style={{ 
            fontFamily: 'Playfair Display, serif',
            color: '#2C1810',
            letterSpacing: '-0.01em'
          }}
        >
          {restaurantData.name}
        </h1>
        
        {/* Farm-to-Table Badge */}
        <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
          </svg>
          Farm to Table • Sustainable Ingredients
        </div>
        
        {/* Description */}
        <p 
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          style={{ 
            color: '#8B4513',
            lineHeight: '1.6'
          }}
        >
          {restaurantData.description}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="px-8 py-4 text-white font-semibold uppercase tracking-wider transition-all duration-300 hover:transform hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)'
            }}
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Menu
          </button>
          <button 
            className="px-8 py-4 border-2 font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-opacity-10"
            style={{
              borderColor: '#8B4513',
              color: '#8B4513',
              backgroundColor: 'transparent'
            }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Reserve Table
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        style={{ color: '#8B4513' }}
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default SimpleHero;