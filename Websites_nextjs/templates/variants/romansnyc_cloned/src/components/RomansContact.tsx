'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const RomansContact = () => {
  return (
    <section id="contact" className="romans-section">
      <div className="romans-container">
        <div className="romans-section-header">
          <div className="romans-small romans-section-badge">Visit Us</div>
          <h2 className="romans-heading-2 romans-section-title">
            Join Our Community
          </h2>
          <p className="romans-body-large romans-section-description">
            Experience ingredient-driven Italian cuisine in the heart of Fort Greene. 
            Reservations recommended for dinner service.
          </p>
        </div>
        
        <div className="romans-contact-grid max-w-5xl mx-auto">
          {/* Left side - Contact Information */}
          <div className="space-y-8">
            <div className="romans-contact-item">
              <span className="romans-small romans-contact-label">Address</span>
              <div className="romans-contact-value">
                {restaurantData.address}
              </div>
              <p className="romans-body mt-2">
                Located in the heart of Fort Greene, Brooklyn. Accessible via the B, Q, R trains 
                at DeKalb Avenue or the G train at Fulton-Lafayette.
              </p>
            </div>
            
            <div className="romans-contact-item">
              <span className="romans-small romans-contact-label">Reservations</span>
              <div className="romans-contact-value">
                {restaurantData.phone}
              </div>
              <p className="romans-body mt-2">
                Call us for reservations or inquiries about private events. 
                Walk-ins welcome at the bar, subject to availability.
              </p>
            </div>
            
            <div className="romans-contact-item">
              <span className="romans-small romans-contact-label">Email</span>
              <div className="romans-contact-value">
                {restaurantData.email}
              </div>
            </div>
            
            <div className="romans-contact-item">
              <span className="romans-small romans-contact-label">Dinner Hours</span>
              <div className="romans-contact-value space-y-2">
                <div className="flex justify-between">
                  <span>Tuesday - Thursday</span>
                  <span>5:30 PM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday - Saturday</span>
                  <span>5:30 PM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>5:00 PM - 9:00 PM</span>
                </div>
                <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                  Closed Mondays • Kitchen closes 30 minutes before listed time
                </div>
              </div>
            </div>
            
            <div className="romans-contact-item">
              <span className="romans-small romans-contact-label">Private Events</span>
              <div className="romans-contact-value">
                Full restaurant buyouts available
              </div>
              <p className="romans-body mt-2">
                Perfect for celebrations, corporate events, and special occasions. 
                Contact us to discuss your event needs and customized menu options.
              </p>
            </div>
          </div>
          
          {/* Right side - Contact Form */}
          <div className="romans-card">
            <h3 className="romans-heading-3 mb-6">Get in Touch</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="romans-form-group">
                  <label className="romans-form-label">First Name</label>
                  <input 
                    type="text" 
                    className="romans-form-input"
                    required 
                  />
                </div>
                <div className="romans-form-group">
                  <label className="romans-form-label">Last Name</label>
                  <input 
                    type="text" 
                    className="romans-form-input"
                    required 
                  />
                </div>
              </div>
              
              <div className="romans-form-group">
                <label className="romans-form-label">Email</label>
                <input 
                  type="email" 
                  className="romans-form-input"
                  required 
                />
              </div>
              
              <div className="romans-form-group">
                <label className="romans-form-label">Phone</label>
                <input 
                  type="tel" 
                  className="romans-form-input"
                />
              </div>
              
              <div className="romans-form-group">
                <label className="romans-form-label">Inquiry Type</label>
                <select className="romans-form-input" required>
                  <option value="">Select inquiry type</option>
                  <option value="reservation">Dinner Reservation</option>
                  <option value="private-event">Private Event</option>
                  <option value="catering">Catering Inquiry</option>
                  <option value="press">Press & Media</option>
                  <option value="general">General Question</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div className="romans-form-group">
                <label className="romans-form-label">Preferred Date</label>
                <input 
                  type="date" 
                  className="romans-form-input"
                />
              </div>
              
              <div className="romans-form-group">
                <label className="romans-form-label">Party Size</label>
                <select className="romans-form-input">
                  <option value="">Select party size</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="7-10">7-10 Guests</option>
                  <option value="10+">10+ Guests (Private Event)</option>
                </select>
              </div>
              
              <div className="romans-form-group">
                <label className="romans-form-label">Message</label>
                <textarea 
                  rows={4}
                  className="romans-form-input romans-form-textarea"
                  placeholder="Tell us about your dietary restrictions, special occasion, event details, or any other information..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="romans-button romans-button-primary w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </button>
            </form>
            
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <div>
                  <div className="text-sm font-semibold text-green-800">Neighborhood Commitment</div>
                  <div className="text-sm text-green-700">
                    We respond to all inquiries within 24 hours. For same-day reservations, 
                    please call us directly.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RomansContact;