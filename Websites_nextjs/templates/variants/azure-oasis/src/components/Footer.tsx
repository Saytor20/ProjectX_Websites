'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

export default function Footer() {
  return (
    <footer className="mt-[var(--space-2xl)] border-t border-[var(--color-border)]/40 py-8 bg-[var(--color-surface-elevated)]/70 backdrop-blur-xl">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter-x)] text-sm text-[var(--color-on-surface)]/70 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="font-medium text-[var(--color-on-surface)]">
          {restaurantData.name}
        </div>
        <div className="flex gap-4">
          {restaurantData.phone && <a href={`tel:${restaurantData.phone}`} className="hover:text-[var(--color-primary)]">{restaurantData.phone}</a>}
          {restaurantData.address && <span aria-hidden>•</span>}
          {restaurantData.address && <span>{restaurantData.address}</span>}
        </div>
        <div className="opacity-70">© {new Date().getFullYear()} All rights reserved.</div>
      </div>
    </footer>
  );
}

