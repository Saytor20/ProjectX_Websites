'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

type MenuItem = typeof restaurantData.menu[number];

export default function MenuSection() {
  const grouped: Record<string, MenuItem[]> = restaurantData.menu.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <section id="menu" className="py-[var(--space-2xl)]">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter-x)]">
        <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-on-surface)] text-center mb-10">
          Our Menu
        </h2>

        <div className="grid gap-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xl md:text-2xl font-medium text-[var(--color-primary)] mb-4">
                {category}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm hover:shadow-md transition-shadow backdrop-blur-xl"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-44 object-cover rounded-t-2xl"
                        loading="lazy"
                      />
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-lg font-semibold text-[var(--color-on-surface)] leading-snug">
                          {item.name}
                        </h4>
                        <span className="text-sm font-semibold text-[var(--color-on-primary)] bg-[var(--color-primary)] rounded-full px-3 py-1 min-w-max">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mt-2 text-sm text-[var(--color-on-surface)]/70">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

