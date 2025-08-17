/**
 * Hero Component
 * 
 * Main banner section with multiple variants.
 * Supports background images, CTAs, and responsive design.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroProps } from './types';

export const Hero: React.FC<HeroProps> = ({
  variant,
  title,
  subtitle,
  description,
  image,
  imageAlt,
  ctaText,
  ctaHref,
  backgroundImage,
  className = '',
  'data-testid': testId = 'hero',
  locale = 'en',
  direction = 'ltr',
}) => {
  const heroClasses = [
    'hero',
    `hero--${variant}`,
    `hero--${direction}`,
    backgroundImage && 'hero--has-bg',
    className,
  ].filter(Boolean).join(' ');

  const renderContent = () => (
    <div className="hero__content">
      <div className="hero__text">
        {subtitle && (
          <p className="hero__subtitle" data-testid="hero-subtitle">
            {subtitle}
          </p>
        )}
        
        <h1 className="hero__title" data-testid="hero-title">
          {title}
        </h1>
        
        {description && (
          <div className="hero__description" data-testid="hero-description">
            <p>{description}</p>
          </div>
        )}
        
        {ctaText && ctaHref && (
          <div className="hero__cta">
            <Link 
              href={ctaHref}
              className="hero__cta-button"
              data-testid="hero-cta"
            >
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const renderImage = () => {
    if (!image) return null;
    
    return (
      <div className="hero__image" data-testid="hero-image">
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          priority
          sizes={variant === 'fullscreen' ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
          style={{ objectFit: 'cover' }}
        />
      </div>
    );
  };

  // Background image style
  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  return (
    <section 
      className={heroClasses}
      data-testid={testId}
      data-component="hero"
      dir={direction}
      style={backgroundStyle}
      role="banner"
      aria-labelledby="hero-title"
    >
      <div className="hero__container">
        {variant === 'image-left' && (
          <>
            {renderImage()}
            {renderContent()}
          </>
        )}
        
        {variant === 'minimal' && renderContent()}
        
        {variant === 'gradient' && (
          <>
            <div className="hero__gradient" aria-hidden="true" />
            {renderContent()}
            {renderImage()}
          </>
        )}
        
        {variant === 'fullscreen' && (
          <>
            {renderImage()}
            <div className="hero__overlay" aria-hidden="true" />
            {renderContent()}
          </>
        )}
      </div>
      
      {/* Scroll indicator for fullscreen variant */}
      {variant === 'fullscreen' && (
        <div className="hero__scroll-indicator" aria-hidden="true">
          <button
            className="hero__scroll-button"
            onClick={() => {
              const nextSection = document.querySelector('section:not([role="banner"])');
              nextSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label={locale === 'ar' ? 'تمرير للأسفل' : 'Scroll down'}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M7 13l3 3 3-3" />
              <path d="M7 6l3 3 3-3" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPageElement",
            "name": "Hero Section",
            "description": description || subtitle || title,
            "image": image || backgroundImage,
          })
        }}
      />
    </section>
  );
};