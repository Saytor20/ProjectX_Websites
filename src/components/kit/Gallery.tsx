/**
 * Gallery Component
 * 
 * Image gallery with multiple layout variants and accessibility features.
 * Supports lightbox, responsive grids, and lazy loading.
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { GalleryProps, GalleryImageItem } from './types';

export const Gallery: React.FC<GalleryProps> = ({
  images,
  variant = 'grid',
  columns = 3,
  aspectRatio = 'square',
  className = '',
  'data-testid': testId = 'gallery',
  locale = 'en',
  direction = 'ltr',
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle keyboard navigation in lightbox
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!lightboxOpen) return;

    switch (event.key) {
      case 'Escape':
        setLightboxOpen(false);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        setCurrentImageIndex(prev => 
          prev > 0 ? prev - 1 : images.length - 1
        );
        break;
      case 'ArrowRight':
        event.preventDefault();
        setCurrentImageIndex(prev => 
          prev < images.length - 1 ? prev + 1 : 0
        );
        break;
    }
  }, [lightboxOpen, images.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Disable body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return prev < images.length - 1 ? prev + 1 : 0;
      } else {
        return prev > 0 ? prev - 1 : images.length - 1;
      }
    });
  }, [images.length]);

  const galleryClasses = [
    'gallery',
    `gallery--${variant}`,
    `gallery--${direction}`,
    `gallery--columns-${columns}`,
    `gallery--${aspectRatio}`,
    className,
  ].filter(Boolean).join(' ');

  // Carousel variant
  if (variant === 'carousel') {
    const itemsToShow = Math.min(columns, images.length);
    const maxSlide = Math.max(0, images.length - itemsToShow);
    
    return (
      <div 
        className={galleryClasses}
        data-testid={testId}
        dir={direction}
        role="region"
        aria-label={locale === 'ar' ? 'معرض الصور' : 'Image gallery'}
      >
        <div className="gallery__carousel">
          <div 
            className="gallery__carousel-track"
            style={{ 
              transform: `translateX(-${currentSlide * (100 / itemsToShow)}%)`,
              width: `${(images.length / itemsToShow) * 100}%`
            }}
          >
            {images.map((image, index) => {
              const caption = (locale === 'ar' && image.captionAr) ? image.captionAr : image.caption;
              
              return (
                <div
                  key={index}
                  className="gallery__carousel-slide"
                  style={{ width: `${100 / images.length}%` }}
                >
                  <button
                    className="gallery__image-button"
                    onClick={() => openLightbox(index)}
                    aria-label={`${locale === 'ar' ? 'عرض الصورة' : 'View image'} ${index + 1}: ${image.alt}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes={`${100 / itemsToShow}vw`}
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </button>
                  {caption && (
                    <p className="gallery__image-caption">{caption}</p>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Carousel controls */}
          {images.length > itemsToShow && (
            <>
              <button
                className="gallery__carousel-button gallery__carousel-button--prev"
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                aria-label={locale === 'ar' ? 'الصورة السابقة' : 'Previous images'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={direction === 'rtl' ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
                </svg>
              </button>
              
              <button
                className="gallery__carousel-button gallery__carousel-button--next"
                onClick={() => setCurrentSlide(Math.min(maxSlide, currentSlide + 1))}
                disabled={currentSlide >= maxSlide}
                aria-label={locale === 'ar' ? 'الصورة التالية' : 'Next images'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={direction === 'rtl' ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Grid, Masonry, and Lightbox variants
  return (
    <>
      <div 
        className={galleryClasses}
        data-testid={testId}
        dir={direction}
        role="region"
        aria-label={locale === 'ar' ? 'معرض الصور' : 'Image gallery'}
      >
        <div className="gallery__grid">
          {images.map((image, index) => {
            const caption = (locale === 'ar' && image.captionAr) ? image.captionAr : image.caption;
            
            return (
              <figure 
                key={index} 
                className="gallery__item"
                data-testid={`gallery-item-${index}`}
              >
                <button
                  className="gallery__image-button"
                  onClick={() => variant === 'lightbox' ? openLightbox(index) : undefined}
                  aria-label={`${locale === 'ar' ? 'عرض الصورة' : 'View image'} ${index + 1}: ${image.alt}`}
                  disabled={variant !== 'lightbox'}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes={`(max-width: 768px) 50vw, ${100 / columns}vw`}
                    style={{ objectFit: 'cover' }}
                    loading={index < 6 ? 'eager' : 'lazy'}
                  />
                  
                  {variant === 'lightbox' && (
                    <div className="gallery__overlay" aria-hidden="true">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  )}
                </button>
                
                {caption && (
                  <figcaption className="gallery__image-caption">
                    {caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>

      {/* Lightbox modal */}
      {variant === 'lightbox' && lightboxOpen && (
        <div 
          className="gallery__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'ar' ? 'مشاهد الصورة بحجم كامل' : 'Full size image viewer'}
          data-testid="gallery-lightbox"
        >
          <div className="gallery__lightbox-backdrop" onClick={closeLightbox} />
          
          <div className="gallery__lightbox-content">
            <button
              className="gallery__lightbox-close"
              onClick={closeLightbox}
              aria-label={locale === 'ar' ? 'إغلاق المشاهد' : 'Close viewer'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            <div className="gallery__lightbox-image">
              <Image
                src={images[currentImageIndex]?.url}
                alt={images[currentImageIndex]?.alt}
                fill
                sizes="100vw"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            
            {images[currentImageIndex]?.caption && (
              <div className="gallery__lightbox-caption">
                {(locale === 'ar' && images[currentImageIndex]?.captionAr) ? 
                  images[currentImageIndex]?.captionAr : 
                  images[currentImageIndex]?.caption
                }
              </div>
            )}
            
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  className="gallery__lightbox-nav gallery__lightbox-nav--prev"
                  onClick={() => navigateImage('prev')}
                  aria-label={locale === 'ar' ? 'الصورة السابقة' : 'Previous image'}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={direction === 'rtl' ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
                  </svg>
                </button>
                
                <button
                  className="gallery__lightbox-nav gallery__lightbox-nav--next"
                  onClick={() => navigateImage('next')}
                  aria-label={locale === 'ar' ? 'الصورة التالية' : 'Next image'}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={direction === 'rtl' ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image counter */}
            <div className="gallery__lightbox-counter">
              {currentImageIndex + 1} {locale === 'ar' ? 'من' : 'of'} {images.length}
            </div>
          </div>
        </div>
      )}

      {/* JSON-LD structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "image": images.map(image => ({
              "@type": "ImageObject",
              "url": image.url,
              "description": image.alt,
              "caption": image.caption,
            }))
          })
        }}
      />
    </>
  );
};