'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const FiolaMenu = () => {
  // Group menu items by category
  const menuCategories = restaurantData.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof restaurantData.menu>);

  return (
    <section id="menu" className="fiola-section" style={{ background: '#FAFAFA' }}>
      <div className="fiola-container">
        <div className="fiola-section-header">
          <div className="fiola-caption mb-4">Our Menu</div>
          <h2 className="fiola-heading-2">
            Seasonal Selections
          </h2>
          <div className="w-16 h-px bg-black mx-auto mt-6"></div>
        </div>
        
        <div className="fiola-menu-grid max-w-4xl mx-auto">
          {Object.entries(menuCategories).map(([category, items]) => (
            <div key={category} className="fiola-menu-category">
              <h3 className="fiola-menu-category-title fiola-heading-3 text-center mb-8">
                {category}
              </h3>
              
              <div className="fiola-menu-items">
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="fiola-menu-item">
                    <div className="fiola-menu-item-info">
                      <h4 className="fiola-menu-item-name">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="fiola-menu-item-description">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="fiola-menu-item-price">
                      ${item.price.toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Menu Note */}
        <div className="text-center mt-12">
          <p className="fiola-caption">
            Menu items may vary based on seasonal availability
          </p>
        </div>
      </div>
    </section>
  );
};

export default FiolaMenu;