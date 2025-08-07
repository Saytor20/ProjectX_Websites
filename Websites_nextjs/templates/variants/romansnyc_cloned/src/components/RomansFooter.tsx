'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const RomansFooter = () => {
  return (
    <footer className="romans-footer">
      <div className="romans-container">
        <div className="romans-footer-content">
          <div className="romans-footer-logo">
            {restaurantData.name}
          </div>
          
          <div className="flex justify-center gap-3 mb-6">
            <div className="romans-farm-badge">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
              </svg>
              Farm to Table
            </div>
            <div className="romans-local-badge" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Fort Greene, Brooklyn
            </div>
          </div>
          
          <div className="romans-footer-description">
            An ingredient-driven neighborhood Italian restaurant featuring the highest quality 
            imported Italian ingredients alongside organic meat, dairy, and produce sourced 
            from the Hudson Valley and Tristate area.
          </div>
          
          <div className="romans-footer-social">
            <a 
              href="#" 
              className="romans-footer-social-link"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            
            <a 
              href="#" 
              className="romans-footer-social-link"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            <a 
              href="#" 
              className="romans-footer-social-link"
              aria-label="TripAdvisor"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.73 0-.43-.35-.78-.78-.78-.25 0-.48.12-.62.32-.85.3-1.76.46-2.7.46-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6c0 .94-.21 1.85-.6 2.7-.2.14-.32.37-.32.62 0 .43.35.78.78.78.33 0 .62-.19.73-.49.39-1.07.6-2.22.6-3.41C22 6.48 17.52 2 12 2zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
              </svg>
            </a>
            
            <a 
              href="#" 
              className="romans-footer-social-link"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          
          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto mt-8 mb-8">
            <div>
              <h4 className="font-semibold mb-3">Restaurant</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#menu" className="hover:opacity-100 transition-opacity">Menus</a></li>
                <li><a href="#about" className="hover:opacity-100 transition-opacity">Our Story</a></li>
                <li><a href="#contact" className="hover:opacity-100 transition-opacity">Reservations</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Gift Cards</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Private Events</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#contact" className="hover:opacity-100 transition-opacity">Full Buyouts</a></li>
                <li><a href="#contact" className="hover:opacity-100 transition-opacity">Catering</a></li>
                <li><a href="#contact" className="hover:opacity-100 transition-opacity">Wine Dinners</a></li>
                <li><a href="#contact" className="hover:opacity-100 transition-opacity">Corporate Events</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Community</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Local Farmers</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Sustainability</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Brooklyn Partners</a></li>
                <li><a href="#contact" className="hover:opacity-100 transition-opacity">Work With Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#contact" className="hover:opacity-100 transition-opacity">Press & Media</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Newsletter</a></li>
                <li><a href="#contact" className="hover:opacity-100 transition-opacity">Feedback</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Accessibility</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="romans-footer-bottom">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} {restaurantData.name}. All rights reserved.</p>
            <div className="flex gap-4 text-sm">
              <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RomansFooter;