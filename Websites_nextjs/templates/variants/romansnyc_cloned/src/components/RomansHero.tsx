'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const RomansHero = () => {
  return (
    <>
      {/* Header Navigation */}
      <header className="romans-header">
        <div className="romans-header-container">
          <a href="#home" className="romans-logo">
            {restaurantData.name}
          </a>
          <nav>
            <ul className="romans-nav">
              <li><a href="#about" className="romans-nav-link">About</a></li>
              <li><a href="#menu" className="romans-nav-link">Menus</a></li>
              <li><a href="#contact" className="romans-nav-link">Contact</a></li>
              <li><a href="#contact" className="romans-nav-link">Work With Us</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="romans-hero">
        <div className="romans-hero-container">
          {/* Left side - Content */}
          <div className="romans-hero-content romans-fade-in">
            <div className="romans-hero-badge">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Fort Greene, Brooklyn
            </div>
            
            <h1 className="romans-heading-1 mb-6">
              {restaurantData.name}
            </h1>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="romans-farm-badge">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
                </svg>
                Farm to Table
              </div>
              <div className="romans-local-badge">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 11H7v8a2 2 0 0 0 4 0v-1h-2v-7zm8 0h-2v8a2 2 0 0 0 4 0v-1h-2v-7z"/>
                </svg>
                Sustainable
              </div>
            </div>
            
            <p className="romans-body-large mb-8">
              {restaurantData.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="romans-button romans-button-primary"
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z" />
                </svg>
                View Menus
              </button>
              <button 
                className="romans-button romans-button-secondary"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Make Reservation
              </button>
            </div>
            
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-200">
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Hours Today</div>
                <div className="text-gray-600">5:30 PM - 10:00 PM</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Phone</div>
                <div className="text-gray-600">{restaurantData.phone}</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Hero Image */}
          <div className="romans-hero-image romans-fade-in">
            <img 
              src={restaurantData.heroImage} 
              alt={restaurantData.name}
              className="w-full h-96 object-cover"
            />
            
            {/* Ingredient callouts overlay */}
            <div className="absolute top-4 right-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg">
              <div className="text-xs font-semibold text-green-700 mb-1">TODAY&apos;S FEATURE</div>
              <div className="text-sm font-medium text-gray-900">Fresh Burrata</div>
              <div className="text-xs text-gray-600">From Hudson Valley</div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg">
              <div className="text-xs font-semibold text-green-700 mb-1">IMPORTED</div>
              <div className="text-sm font-medium text-gray-900">San Marzano</div>
              <div className="text-xs text-gray-600">DOP Tomatoes</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RomansHero;