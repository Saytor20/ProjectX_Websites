'use client';
import { restaurantData } from '@/data/restaurant';

const BBQFooter = () => {
  return (
    <footer className="bg-bbq-dark text-bbq-cream py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <h3 className="text-2xl font-bold uppercase tracking-wide text-bbq-pink mb-4">
              {restaurantData.name}
            </h3>
            <p className="text-bbq-cream/80 mb-4 leading-relaxed">
              {restaurantData.description}
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <a href={`tel:${restaurantData.phone}`} className="hover:text-bbq-pink transition-colors">
                  {restaurantData.phone}
                </a>
              </p>
              {restaurantData.email && (
                <p className="text-sm">
                  <a href={`mailto:${restaurantData.email}`} className="hover:text-bbq-pink transition-colors">
                    {restaurantData.email}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold uppercase tracking-wide text-bbq-cream mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#menu" className="text-bbq-cream/80 hover:text-bbq-pink transition-colors uppercase text-sm tracking-wide">
                  Menu
                </a>
              </li>
              <li>
                <a href="#about" className="text-bbq-cream/80 hover:text-bbq-pink transition-colors uppercase text-sm tracking-wide">
                  About
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-bbq-cream/80 hover:text-bbq-pink transition-colors uppercase text-sm tracking-wide">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#contact" className="text-bbq-cream/80 hover:text-bbq-pink transition-colors uppercase text-sm tracking-wide">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-xl font-bold uppercase tracking-wide text-bbq-cream mb-4">
              Location
            </h4>
            <p className="text-bbq-cream/80 text-sm leading-relaxed">
              {restaurantData.address}
            </p>
            {restaurantData.website && (
              <p className="text-sm mt-2">
                <a href={restaurantData.website} target="_blank" rel="noopener noreferrer" className="text-bbq-pink hover:text-bbq-pink/80 transition-colors">
                  Visit Our Website
                </a>
              </p>
            )}
          </div>

          {/* Hours & CTA */}
          <div>
            <h4 className="text-xl font-bold uppercase tracking-wide text-bbq-cream mb-4">
              Visit Us
            </h4>
            <div className="space-y-4">
              <div className="text-bbq-cream/80 text-sm">
                <p className="font-semibold text-bbq-cream">Hours:</p>
                <p>Daily: 11:00 AM - 10:00 PM</p>
              </div>
              <a 
                href="#contact"
                className="inline-block bg-bbq-pink hover:bg-bbq-pink/90 text-white px-6 py-3 rounded-lg uppercase font-bold tracking-wide text-sm transition-all duration-300 hover:scale-105"
              >
                Make Reservation
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bbq-brown mt-12 pt-8 text-center">
          <p className="text-bbq-cream/60 text-sm">
            © 2024 {restaurantData.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BBQFooter;