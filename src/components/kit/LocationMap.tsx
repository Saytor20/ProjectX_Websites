/**
 * LocationMap Component
 * 
 * Displays restaurant location with Google Maps integration.
 * Supports multiple variants and accessibility features.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { LocationMapProps } from './types';

export const LocationMap: React.FC<LocationMapProps> = ({
  address,
  coordinates,
  zoom = 15,
  variant = 'embedded',
  showDirections = true,
  apiKey,
  className = '',
  'data-testid': testId = 'location-map',
  locale = 'en',
  direction = 'ltr',
}) => {
  const [mapError, setMapError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate Google Maps URLs
  const getGoogleMapsUrl = useCallback((type: 'embed' | 'directions' | 'view' = 'view') => {
    const baseUrl = 'https://www.google.com/maps';
    
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      const coordString = `${latitude},${longitude}`;
      
      switch (type) {
        case 'embed':
          return `${baseUrl}/embed/v1/place?key=${apiKey}&q=${coordString}&zoom=${zoom}&language=${locale}`;
        case 'directions':
          return `${baseUrl}/dir/?api=1&destination=${coordString}`;
        case 'view':
        default:
          return `${baseUrl}/@${coordString},${zoom}z`;
      }
    } else {
      const encodedAddress = encodeURIComponent(address);
      
      switch (type) {
        case 'embed':
          return `${baseUrl}/embed/v1/place?key=${apiKey}&q=${encodedAddress}&zoom=${zoom}&language=${locale}`;
        case 'directions':
          return `${baseUrl}/dir/?api=1&destination=${encodedAddress}`;
        case 'view':
        default:
          return `${baseUrl}/search/${encodedAddress}`;
      }
    }
  }, [address, coordinates, zoom, apiKey, locale]);

  // Handle directions click
  const openDirections = useCallback(() => {
    const directionsUrl = getGoogleMapsUrl('directions');
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  }, [getGoogleMapsUrl]);

  // Handle map modal
  const openMapModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeMapModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Handle iframe load error
  const handleIframeError = useCallback(() => {
    setMapError(locale === 'ar' ? 'تعذر تحميل الخريطة' : 'Failed to load map');
  }, [locale]);

  const mapClasses = [
    'location-map',
    `location-map--${variant}`,
    `location-map--${direction}`,
    mapError && 'location-map--error',
    className,
  ].filter(Boolean).join(' ');

  // Static map fallback
  const renderStaticMap = () => (
    <div className="location-map__static">
      <div className="location-map__static-content">
        <div className="location-map__icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div className="location-map__address">
          <address>{address}</address>
        </div>
        <button
          className="location-map__view-button"
          onClick={() => window.open(getGoogleMapsUrl('view'), '_blank', 'noopener,noreferrer')}
          type="button"
        >
          {locale === 'ar' ? 'عرض على الخريطة' : 'View on Map'}
        </button>
      </div>
    </div>
  );

  // Embedded map
  const renderEmbeddedMap = () => {
    if (!apiKey) {
      return renderStaticMap();
    }

    return (
      <div className="location-map__embedded">
        <iframe
          src={getGoogleMapsUrl('embed')}
          className="location-map__iframe"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={locale === 'ar' ? `خريطة موقع ${address}` : `Map of ${address}`}
          onError={handleIframeError}
          data-testid="map-iframe"
        />
        
        {mapError && (
          <div className="location-map__error">
            <p>{mapError}</p>
            {renderStaticMap()}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div 
        className={mapClasses}
        data-testid={testId}
        dir={direction}
      >
        {/* Map content based on variant */}
        {variant === 'static' ? renderStaticMap() : renderEmbeddedMap()}
        
        {/* Map controls */}
        {variant !== 'static' && !mapError && (
          <div className="location-map__controls">
            {showDirections && (
              <button
                className="location-map__directions-button"
                onClick={openDirections}
                type="button"
                aria-label={locale === 'ar' ? 'الحصول على الاتجاهات' : 'Get directions'}
                data-testid="directions-button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                {locale === 'ar' ? 'الاتجاهات' : 'Directions'}
              </button>
            )}
            
            {variant === 'popup' && (
              <button
                className="location-map__fullscreen-button"
                onClick={openMapModal}
                type="button"
                aria-label={locale === 'ar' ? 'عرض الخريطة بحجم كامل' : 'View full screen map'}
                data-testid="fullscreen-button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                {locale === 'ar' ? 'ملء الشاشة' : 'Full Screen'}
              </button>
            )}
          </div>
        )}

        {/* Address information */}
        <div className="location-map__info">
          <address className="location-map__address">
            {address}
          </address>
          
          {coordinates && (
            <div className="location-map__coordinates" aria-label={locale === 'ar' ? 'الإحداثيات' : 'Coordinates'}>
              <small>
                {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Full screen modal */}
      {variant === 'popup' && isModalOpen && (
        <div 
          className="location-map__modal"
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'ar' ? 'خريطة بحجم كامل' : 'Full screen map'}
          data-testid="map-modal"
        >
          <div className="location-map__modal-backdrop" onClick={closeMapModal} />
          
          <div className="location-map__modal-content">
            <div className="location-map__modal-header">
              <h3 className="location-map__modal-title">{address}</h3>
              <button
                className="location-map__modal-close"
                onClick={closeMapModal}
                aria-label={locale === 'ar' ? 'إغلاق الخريطة' : 'Close map'}
                data-testid="modal-close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="location-map__modal-map">
              {apiKey ? (
                <iframe
                  src={getGoogleMapsUrl('embed')}
                  className="location-map__modal-iframe"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={locale === 'ar' ? `خريطة موقع ${address}` : `Map of ${address}`}
                />
              ) : (
                renderStaticMap()
              )}
            </div>
            
            <div className="location-map__modal-footer">
              {showDirections && (
                <button
                  className="location-map__modal-directions"
                  onClick={openDirections}
                  type="button"
                >
                  {locale === 'ar' ? 'الحصول على الاتجاهات' : 'Get Directions'}
                </button>
              )}
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
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": address,
            },
            ...(coordinates && {
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": coordinates.latitude,
                "longitude": coordinates.longitude,
              }
            }),
            "hasMap": getGoogleMapsUrl('view'),
          })
        }}
      />
    </>
  );
};