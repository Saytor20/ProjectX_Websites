'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const SimpleHero = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center text-white"
      style={{
        background: `linear-gradient(rgba(15, 15, 15, 0.7), rgba(15, 15, 15, 0.7)), url(${restaurantData.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 text-center">
        {/* Michelin Star Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-6">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        
        {/* Restaurant Name */}
        <h1 
          className="text-5xl md:text-7xl font-light mb-4"
          style={{ 
            fontFamily: 'Playfair Display, serif',
            color: '#F4F4F2',
            letterSpacing: '-0.02em'
          }}
        >
          {restaurantData.name}
        </h1>
        
        {/* Description */}
        <p 
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          style={{ 
            color: '#C9A961',
            lineHeight: '1.6'
          }}
        >
          {restaurantData.description}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="px-8 py-4 text-black font-semibold uppercase tracking-wider transition-all duration-300 hover:transform hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #C9A961 0%, #F4D03F 100%)',
              borderRadius: '2px',
              boxShadow: '0 4px 15px rgba(201, 169, 97, 0.3)'
            }}
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Menu
          </button>
          <button 
            className="px-8 py-4 border-2 font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-opacity-10"
            style={{
              borderColor: '#C9A961',
              color: '#C9A961',
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
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default SimpleHero;