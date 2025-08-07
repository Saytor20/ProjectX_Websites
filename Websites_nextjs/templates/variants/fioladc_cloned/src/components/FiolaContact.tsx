'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const FiolaContact = () => {
  return (
    <section id="contact" className="fiola-section">
      <div className="fiola-container">
        <div className="fiola-section-header">
          <div className="fiola-caption mb-4">Reservations</div>
          <h2 className="fiola-heading-2">
            Join Us for Dinner
          </h2>
          <div className="w-16 h-px bg-black mx-auto mt-6"></div>
        </div>
        
        <div className="fiola-contact-grid max-w-4xl mx-auto">
          {/* Left side - Contact Information */}
          <div className="space-y-8">
            <div className="fiola-contact-item">
              <span className="fiola-caption block mb-3">Location</span>
              <div className="fiola-contact-value text-lg">
                {restaurantData.address}
              </div>
            </div>
            
            <div className="fiola-contact-item">
              <span className="fiola-caption block mb-3">Reservations</span>
              <div className="fiola-contact-value text-lg">
                {restaurantData.phone}
              </div>
            </div>
            
            <div className="fiola-contact-item">
              <span className="fiola-caption block mb-3">Email</span>
              <div className="fiola-contact-value text-lg">
                {restaurantData.email}
              </div>
            </div>
            
            <div className="fiola-contact-item">
              <span className="fiola-caption block mb-3">Dinner Hours</span>
              <div className="fiola-contact-value space-y-1">
                <div>Tuesday - Thursday: 5:30 PM - 10:00 PM</div>
                <div>Friday - Saturday: 5:30 PM - 11:00 PM</div>
                <div>Sunday: 5:30 PM - 9:00 PM</div>
                <div className="text-sm text-gray-600 mt-2">Closed Mondays</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Reservation Form */}
          <div className="fiola-card">
            <h3 className="fiola-heading-3 mb-6 text-center">Make a Reservation</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="fiola-caption block mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                    required 
                  />
                </div>
                <div>
                  <label className="fiola-caption block mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="fiola-caption block mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                  required 
                />
              </div>
              
              <div>
                <label className="fiola-caption block mb-2">Phone</label>
                <input 
                  type="tel" 
                  className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="fiola-caption block mb-2">Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                    required 
                  />
                </div>
                <div>
                  <label className="fiola-caption block mb-2">Time</label>
                  <select 
                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                    required
                  >
                    <option value="">Select Time</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="fiola-caption block mb-2">Party Size</label>
                <select 
                  className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors"
                  required
                >
                  <option value="">Select Party Size</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="7">7+ Guests</option>
                </select>
              </div>
              
              <div>
                <label className="fiola-caption block mb-2">Special Requests</label>
                <textarea 
                  rows={3}
                  className="w-full p-3 border border-gray-200 focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="Dietary restrictions, special occasions, etc."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full py-3 bg-black text-white font-medium uppercase tracking-wider text-sm transition-all duration-300 hover:bg-gray-800"
              >
                Request Reservation
              </button>
            </form>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Reservations will be confirmed within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiolaContact;