'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const RomansAbout = () => {
  return (
    <section id="about" className="romans-section">
      <div className="romans-container">
        <div className="romans-section-header">
          <div className="romans-small romans-section-badge">Our Story</div>
          <h2 className="romans-heading-2 romans-section-title">
            Ingredient Driven Italian
          </h2>
          <p className="romans-body-large romans-section-description">
            We feature the highest quality imported Italian ingredients alongside organic meat, 
            dairy, and produce sourced from the Hudson Valley and Tristate area.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left side - Content */}
          <div className="romans-fade-in">
            <h3 className="romans-heading-3 mb-6">
              Commitment to Sustainability
            </h3>
            <div className="romans-body space-y-6">
              <p>
                {restaurantData.description}
              </p>
              <p>
                Through our commitment to sustainability we have forged real and lasting partnerships 
                with our farmers and serve thoughtful and reverent food highlighting these connections 
                and ingredients. Every dish tells the story of its origin, from the sun-soaked fields 
                of Italy to the rolling hills of the Hudson Valley.
              </p>
              <p>
                Our kitchen celebrates both tradition and innovation, honoring time-tested Italian 
                techniques while embracing the bounty of our local terroir. This marriage of old and 
                new creates a dining experience that is both familiar and surprising.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <div className="romans-contact-item">
                <span className="romans-small romans-contact-label">Location</span>
                <div className="romans-contact-value">{restaurantData.address}</div>
              </div>
              <div className="romans-contact-item">
                <span className="romans-small romans-contact-label">Reservations</span>
                <div className="romans-contact-value">{restaurantData.phone}</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="romans-fade-in">
            <div className="relative">
              <img 
                src={restaurantData.aboutImage} 
                alt={`About ${restaurantData.name}`}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              {/* Sustainability badge overlay */}
              <div className="absolute top-4 left-4 bg-green-700 text-white p-3 rounded-lg">
                <div className="text-xs font-semibold mb-1">CERTIFIED</div>
                <div className="text-sm font-medium">Sustainable</div>
                <div className="text-xs opacity-90">Restaurant</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ingredient Sources Grid */}
        <div className="romans-ingredient-grid">
          <div className="romans-ingredient-card">
            <div className="romans-ingredient-icon">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h4 className="romans-heading-4 mb-2">Hudson Valley</h4>
            <p className="romans-body">
              Fresh dairy, organic vegetables, and seasonal produce sourced from local farms 
              within 100 miles of our kitchen.
            </p>
          </div>
          
          <div className="romans-ingredient-card">
            <div className="romans-ingredient-icon">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
              </svg>
            </div>
            <h4 className="romans-heading-4 mb-2">Italian Imports</h4>
            <p className="romans-body">
              DOP certified San Marzano tomatoes, Parmigiano Reggiano, estate olive oils, 
              and artisanal pasta from trusted Italian producers.
            </p>
          </div>
          
          <div className="romans-ingredient-card">
            <div className="romans-ingredient-icon">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11H7v8a2 2 0 0 0 4 0v-1h-2v-7zm8 0h-2v8a2 2 0 0 0 4 0v-1h-2v-7z"/>
              </svg>
            </div>
            <h4 className="romans-heading-4 mb-2">Sustainable Seafood</h4>
            <p className="romans-body">
              Wild-caught fish from responsible fisheries, selected for peak freshness 
              and environmental stewardship.
            </p>
          </div>
          
          <div className="romans-ingredient-card">
            <div className="romans-ingredient-icon">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 7h5v5H5zm7 0h7v2h-7zm0 3h7v2h-7zM5 13h5v5H5zm7 0h7v2h-7zm0 3h7v2h-7z"/>
              </svg>
            </div>
            <h4 className="romans-heading-4 mb-2">Artisan Producers</h4>
            <p className="romans-body">
              Small-batch cheeses, house-made charcuterie, and specialty ingredients 
              from Brooklyn&apos;s finest artisan producers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RomansAbout;