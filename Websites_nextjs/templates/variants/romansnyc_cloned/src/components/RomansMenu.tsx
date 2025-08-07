'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const RomansMenu = () => {
  // Group menu items by category
  const menuCategories = restaurantData.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof restaurantData.menu>);

  return (
    <section id="menu" className="romans-section romans-section-alt">
      <div className="romans-container">
        <div className="romans-section-header">
          <div className="romans-small romans-section-badge">Seasonal Menu</div>
          <h2 className="romans-heading-2 romans-section-title">
            Today&apos;s Offerings
          </h2>
          <p className="romans-body-large romans-section-description">
            Our menu changes with the seasons to showcase the finest ingredients at their peak. 
            Each dish reflects our commitment to quality and sustainability.
          </p>
        </div>
        
        <div className="romans-menu-grid max-w-5xl mx-auto">
          {Object.entries(menuCategories).map(([category, items]) => (
            <div key={category} className="romans-menu-section">
              <div className="romans-menu-section-header">
                <h3 className="romans-heading-3 mb-2">{category}</h3>
                <div className="flex justify-center gap-2">
                  <div className="romans-local-badge">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    Local Ingredients
                  </div>
                </div>
              </div>
              
              <div className="romans-menu-items">
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="romans-menu-item">
                    <div className="romans-menu-item-content">
                      <div className="romans-menu-item-header">
                        <h4 className="romans-menu-item-name">
                          {item.name}
                        </h4>
                        <div className="romans-menu-item-price">
                          ${item.price.toFixed(0)}
                        </div>
                      </div>
                      {item.description && (
                        <p className="romans-menu-item-description">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Sample ingredient badges for demonstration */}
                      <div className="romans-menu-item-badges">
                        {index % 3 === 0 && (
                          <div className="romans-local-badge">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L8.5 8.5L2 12l6.5 3.5L12 22l3.5-6.5L22 12l-6.5-3.5L12 2z"/>
                            </svg>
                            Farm Fresh
                          </div>
                        )}
                        {index % 4 === 0 && (
                          <div className="romans-local-badge">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 11H7v8a2 2 0 0 0 4 0v-1h-2v-7zm8 0h-2v8a2 2 0 0 0 4 0v-1h-2v-7z"/>
                            </svg>
                            DOP
                          </div>
                        )}
                        {index % 5 === 0 && (
                          <div className="romans-local-badge">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
                            </svg>
                            Organic
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Menu Footer */}
        <div className="text-center mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="romans-small mb-2">Menu Philosophy</div>
          <p className="romans-body max-w-2xl mx-auto">
            Our menu reflects the seasons and celebrates the partnerships we&apos;ve built with local farmers 
            and Italian producers. Items may vary based on ingredient availability and seasonal inspiration.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="romans-small">Wine List</div>
              <p className="text-sm text-gray-600">Italian & Natural</p>
            </div>
            <div className="text-center">
              <div className="romans-small">Private Events</div>
              <p className="text-sm text-gray-600">Full Buyouts Available</p>
            </div>
            <div className="text-center">
              <div className="romans-small">Dietary Needs</div>
              <p className="text-sm text-gray-600">We Accommodate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RomansMenu;