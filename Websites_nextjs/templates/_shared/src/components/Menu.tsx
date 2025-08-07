'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';
import { useTheme } from '@/theme/ThemeProvider';

interface MenuProps {
  variant?: 'pictures' | 'clean-list' | 'minimal';
}

const Menu = ({ variant = 'pictures' }: MenuProps) => {
  const theme = useTheme();
  
  // Group menu items by category
  const menuCategories = restaurantData.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof restaurantData.menu>);

  const renderPicturesVariant = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(menuCategories).map(([category, items]) => 
        items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="bg-[var(--color-surface)] rounded-[var(--border-radius)] shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 h-full border border-[var(--color-border)]"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-[var(--border-radius)]"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold text-[var(--color-on-surface)] flex-1 mr-2 leading-tight">
                  {item.name}
                </h4>
                <span className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-3 py-1 rounded-full text-sm font-semibold min-w-max">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <p className="text-[var(--color-on-surface)]/70 text-sm mb-2">
                {item.description}
              </p>
              <span className="inline-block bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-1 rounded text-xs font-medium">
                {category}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderCleanListVariant = () => (
    <div className="space-y-12">
      {Object.entries(menuCategories).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-2xl font-semibold text-center mb-8 text-[var(--color-primary)] font-[var(--font-heading)]">
            {category}
          </h3>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex justify-between items-start p-4 bg-[var(--color-surface)] rounded-[var(--border-radius)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-[var(--color-on-surface)] mb-1">
                    {item.name}
                  </h4>
                  <p className="text-[var(--color-on-surface)]/70 text-sm">
                    {item.description}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <span className="text-xl font-bold text-[var(--color-primary)]">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="menu" className="py-[var(--space-2xl)] bg-[var(--color-surface-elevated)]">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter-x)]">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-[var(--color-on-surface)] font-[var(--font-heading)]">
          Our Menu
        </h2>
        
        {variant === 'pictures' ? renderPicturesVariant() : renderCleanListVariant()}
      </div>
    </section>
  );
};

export default Menu;