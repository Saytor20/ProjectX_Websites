'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const About = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              About {restaurantData.name}
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 mb-8">
              {restaurantData.description}
            </p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-orange-600">
                Visit Us
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  📍 {restaurantData.address}
                </p>
                <p className="text-gray-600">
                  📞 {restaurantData.phone}
                </p>
                <p className="text-gray-600">
                  ✉️ {restaurantData.email}
                </p>
              </div>
            </div>
          </div>
          <div>
            <img
              src={restaurantData.aboutImage}
              alt={`About ${restaurantData.name}`}
              className="w-full h-auto rounded-lg shadow-lg max-h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;