'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const FiolaAbout = () => {
  return (
    <section id="about" className="fiola-section">
      <div className="fiola-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="fiola-fade-in">
            <div className="fiola-caption mb-4">Our Story</div>
            <h2 className="fiola-heading-2 mb-6">
              Culinary Excellence Refined
            </h2>
            <div className="fiola-body mb-8">
              <p className="mb-6">
                {restaurantData.description}
              </p>
              <p className="mb-6">
                Our commitment to excellence extends beyond the plate, creating an atmosphere 
                where every detail contributes to an unforgettable dining experience. From 
                our carefully curated wine selection to our impeccable service, we ensure 
                that each visit is a celebration of culinary artistry.
              </p>
              <p>
                Located in the heart of the city, we invite you to join us for an evening 
                of exceptional cuisine, where tradition meets innovation in perfect harmony.
              </p>
            </div>
            
            {/* Restaurant Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <div className="fiola-contact-item">
                <span className="fiola-caption block mb-2">Address</span>
                <span className="fiola-contact-value">{restaurantData.address}</span>
              </div>
              <div className="fiola-contact-item">
                <span className="fiola-caption block mb-2">Phone</span>
                <span className="fiola-contact-value">{restaurantData.phone}</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="fiola-fade-in">
            <div className="relative">
              <img 
                src={restaurantData.aboutImage} 
                alt={`About ${restaurantData.name}`}
                className="w-full h-96 object-cover"
                style={{ filter: 'grayscale(10%)' }}
              />
              <div className="absolute inset-0 border border-gray-200 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiolaAbout;