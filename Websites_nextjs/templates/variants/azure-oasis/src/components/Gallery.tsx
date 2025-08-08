'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

export default function Gallery() {
  const images = restaurantData.gallery || [];

  if (!images.length) return null;

  return (
    <section className="py-[var(--space-2xl)]" aria-label="Photo gallery">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter-x)]">
        <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-on-surface)] text-center mb-10">
          Gallery
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, idx) => (
            <figure
              key={`${src}-${idx}`}
              className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <img
                src={src}
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-40 md:h-48 object-cover"
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

