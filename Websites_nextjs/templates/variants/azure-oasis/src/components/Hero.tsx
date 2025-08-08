'use client';
import React from 'react';
import { restaurantData } from '@/data/restaurant';

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden py-[var(--space-2xl)]"
      aria-label="Hero"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -right-24 w-[38rem] h-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(124,77,255,0.25),transparent)]" />
        <div className="absolute -bottom-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(90,200,250,0.22),transparent)]" />
      </div>

      <div className="max-w-[var(--container-max)] mx-auto px-[var(--gutter-x)]">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--color-on-surface)]">
              {restaurantData.name}
            </h1>
            <p className="mt-4 text-[var(--color-on-surface)]/70 text-lg">
              {restaurantData.description}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#menu"
                className="inline-flex items-center px-5 py-3 rounded-xl text-sm font-medium text-[var(--color-on-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                View Menu
              </a>
              {restaurantData.locationUrl && (
                <a
                  href={restaurantData.locationUrl}
                  className="inline-flex items-center px-5 py-3 rounded-xl text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/15 border border-[var(--color-border)] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find Us
                </a>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur-xl">
              <img
                src={restaurantData.heroImage}
                alt="Restaurant showcase"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

