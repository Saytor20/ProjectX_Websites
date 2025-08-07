'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const FiolaHero = () => {
  return (
    <div className="fiola-hero">
      {/* Minimal Navigation */}
      <nav className="fiola-navigation">
        <div className="fiola-nav-container">
          <a href="#home" className="fiola-logo">
            {restaurantData.name}
          </a>
          <ul className="fiola-nav-menu">
            <li><a href="#about" className="fiola-nav-link">About</a></li>
            <li><a href="#menu" className="fiola-nav-link">Menu</a></li>
            <li><a href="#contact" className="fiola-nav-link">Reservations</a></li>
          </ul>
        </div>
      </nav>

      {/* Full-screen Hero Background */}
      <div 
        className="fiola-hero-background"
        style={{
          backgroundImage: `url(${restaurantData.heroImage})`
        }}
      ></div>
      <div className="fiola-hero-overlay"></div>
      
      {/* Centered Hero Content */}
      <div className="fiola-hero-content">
        <div 
          className="fiola-heading-1 mb-6"
          style={{ color: 'white' }}
        >
          {restaurantData.name}
        </div>
        
        <div className="w-24 h-px bg-white mx-auto mb-6 opacity-60"></div>
        
        <p 
          className="fiola-body text-lg max-w-2xl mx-auto mb-8"
          style={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.125rem'
          }}
        >
          {restaurantData.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            className="px-8 py-3 bg-white text-black font-medium uppercase tracking-wider text-sm transition-all duration-300 hover:bg-opacity-90"
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Menu
          </button>
          <button 
            className="px-8 py-3 border border-white text-white font-medium uppercase tracking-wider text-sm transition-all duration-300 hover:bg-white hover:text-black"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Reservations
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div 
        className="fiola-scroll-indicator"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span>Scroll</span>
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};

export default FiolaHero;