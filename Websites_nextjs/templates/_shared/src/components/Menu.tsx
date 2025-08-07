'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

const Menu = () => {
  // Group menu items by category
  const menuCategories = restaurantData.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof restaurantData.menu>);

  return (
    <section id="menu" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
          Our Menu
        </h2>
        
        {Object.entries(menuCategories).map(([category, items]) => (
          <div key={category} className="mb-12">
            <h3 className="text-2xl font-medium text-center mb-8 text-orange-600">
              {category}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 h-full"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-gray-800 flex-1 mr-2 leading-tight">
                        {item.name}
                      </h4>
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold min-w-max">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mt-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;