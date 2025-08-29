'use client'

import React, { useState } from 'react'
import { BaseComponentProps, GalleryImage } from './types'

export interface GalleryProps extends BaseComponentProps {
  title?: string
  images: GalleryImage[]
  showLightbox?: boolean
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto'
  columns?: number
}

export function Gallery({ 
  title = 'Gallery',
  images = [],
  showLightbox = true,
  aspectRatio = 'square',
  columns = 3,
  className = '',
  variant = 'masonry',
  ...props 
}: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const galleryStyle: React.CSSProperties = {
    padding: '3rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '3rem',
    color: 'var(--gallery-title-color, #333)'
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
    gap: '1rem',
    marginBottom: '2rem'
  }

  const getImageStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      borderRadius: '0.5rem',
      cursor: showLightbox ? 'pointer' : 'default',
      transition: 'transform 0.3s ease',
      objectFit: 'cover'
    }

    switch (aspectRatio) {
      case 'square':
        return { ...baseStyle, height: '250px' }
      case 'landscape':
        return { ...baseStyle, height: '200px' }
      case 'portrait':
        return { ...baseStyle, height: '300px' }
      default:
        return { ...baseStyle, height: 'auto' }
    }
  }

  const lightboxStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '2rem'
  }

  const lightboxImageStyle: React.CSSProperties = {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain',
    borderRadius: '0.5rem'
  }

  const lightboxCloseStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    fontSize: '2rem',
    cursor: 'pointer',
    borderRadius: '50%',
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const navigationStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    fontSize: '2rem',
    cursor: 'pointer',
    borderRadius: '50%',
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const openLightbox = (index: number) => {
    if (showLightbox) {
      setLightboxIndex(index)
    }
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1)
    }
  }

  if (!images || images.length === 0) {
    return (
      <section className={`gallery gallery-${variant} ${className}`} style={galleryStyle} {...props}>
        {title && <h2 style={titleStyle}>{title}</h2>}
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
          Gallery images will be available soon.
        </p>
      </section>
    )
  }

  return (
    <>
      <section 
        className={`gallery gallery-${variant} ${className}`}
        style={galleryStyle}
        {...props}
      >
        {title && <h2 style={titleStyle}>{title}</h2>}
        
        <div style={gridStyle}>
          {images.map((image, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                style={getImageStyle()}
                onClick={() => openLightbox(index)}
                onMouseEnter={(e) => {
                  if (showLightbox) {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (showLightbox) {
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
                loading="lazy"
              />
              {image.caption && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '0 0 0.5rem 0.5rem',
                  fontSize: '0.9rem'
                }}>
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {showLightbox && lightboxIndex !== null && images[lightboxIndex] && (
        <div 
          style={lightboxStyle}
          onClick={closeLightbox}
        >
          <button
            style={lightboxCloseStyle}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ×
          </button>
          
          {images.length > 1 && (
            <>
              <button
                style={{ ...navigationStyle, left: '2rem' }}
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                style={{ ...navigationStyle, right: '2rem' }}
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
          
          <img
            src={images[lightboxIndex]!.url}
            alt={images[lightboxIndex]!.alt || `Gallery image ${lightboxIndex + 1}`}
            style={lightboxImageStyle}
            onClick={(e) => e.stopPropagation()}
          />
          
          {images[lightboxIndex]!.caption && (
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '1.1rem',
              textAlign: 'center',
              maxWidth: '80%'
            }}>
              {images[lightboxIndex]!.caption}
            </div>
          )}
        </div>
      )}
    </>
  )
}
