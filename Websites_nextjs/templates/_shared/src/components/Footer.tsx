'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const Footer = () => {
  return (
    <footer className="bg-orange-600 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {restaurantData.name}
            </h3>
            <p className="text-orange-100 mb-4 opacity-80">
              {restaurantData.description}
            </p>
            <div className="flex gap-2">
              <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors">
                <span className="text-sm">📘</span>
              </button>
              <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors">
                <span className="text-sm">📷</span>
              </button>
              <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors">
                <span className="text-sm">🐦</span>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <a
                href="#about"
                className="block text-orange-100 hover:text-white opacity-80 hover:opacity-100 transition-opacity"
              >
                About Us
              </a>
              <a
                href="#menu"
                className="block text-orange-100 hover:text-white opacity-80 hover:opacity-100 transition-opacity"
              >
                Menu
              </a>
              <a
                href="#gallery"
                className="block text-orange-100 hover:text-white opacity-80 hover:opacity-100 transition-opacity"
              >
                Gallery
              </a>
              <a
                href="#contact"
                className="block text-orange-100 hover:text-white opacity-80 hover:opacity-100 transition-opacity"
              >
                Contact
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Contact Info
            </h3>
            <div className="space-y-2 text-orange-100 opacity-80">
              <p>{restaurantData.address}</p>
              <p>{restaurantData.phone}</p>
              <p>{restaurantData.email}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-8 pt-6 text-center">
          <p className="text-orange-100 opacity-60 text-sm">
            © {new Date().getFullYear()} {restaurantData.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;