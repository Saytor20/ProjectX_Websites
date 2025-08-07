'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-primary)] text-[var(--color-on-primary)] py-[var(--space-2xl)] mt-[var(--space-2xl)]">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter-x)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {restaurantData.name}
            </h3>
            <p className="text-[var(--color-on-primary)]/80 mb-4">
              {restaurantData.description}
            </p>
            <div className="flex gap-2">
              {restaurantData.social?.facebook && (
                <a 
                  href={restaurantData.social.facebook}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  aria-label="Facebook"
                >
                  <span className="text-sm">📘</span>
                </a>
              )}
              {restaurantData.social?.instagram && (
                <a 
                  href={restaurantData.social.instagram}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-sm">📷</span>
                </a>
              )}
              {restaurantData.social?.twitter && (
                <a 
                  href={restaurantData.social.twitter}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  aria-label="Twitter"
                >
                  <span className="text-sm">🐦</span>
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <a
                href="#about"
                className="block text-[var(--color-on-primary)]/80 hover:text-[var(--color-on-primary)] transition-opacity"
              >
                About Us
              </a>
              <a
                href="#menu"
                className="block text-[var(--color-on-primary)]/80 hover:text-[var(--color-on-primary)] transition-opacity"
              >
                Menu
              </a>
              <a
                href="#gallery"
                className="block text-[var(--color-on-primary)]/80 hover:text-[var(--color-on-primary)] transition-opacity"
              >
                Gallery
              </a>
              <a
                href="#contact"
                className="block text-[var(--color-on-primary)]/80 hover:text-[var(--color-on-primary)] transition-opacity"
              >
                Contact
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Contact Info
            </h3>
            <div className="space-y-2 text-[var(--color-on-primary)]/80">
              <p>{restaurantData.address}</p>
              <p>
                <a href={`tel:${restaurantData.phone}`} className="hover:text-[var(--color-on-primary)] transition-colors">
                  {restaurantData.phone}
                </a>
              </p>
              {restaurantData.email && (
                <p>
                  <a href={`mailto:${restaurantData.email}`} className="hover:text-[var(--color-on-primary)] transition-colors">
                    {restaurantData.email}
                  </a>
                </p>
              )}
              {restaurantData.locationUrl && (
                <p>
                  <a href={restaurantData.locationUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-on-primary)] transition-colors">
                    📍 View on Map
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-[var(--color-on-primary)]/60 text-sm">
            © {new Date().getFullYear()} {restaurantData.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;