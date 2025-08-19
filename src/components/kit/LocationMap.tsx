'use client'

import React from 'react'
import { BaseComponentProps, Location } from './types'

export interface LocationMapProps extends BaseComponentProps {
  title?: string
  location: Location
  height?: string
  showMarker?: boolean
  showInfo?: boolean
}

export function LocationMap({ 
  title,
  location,
  height = '400px',
  showMarker = true,
  showInfo = true,
  className = '',
  variant = 'interactive',
  ...props 
}: LocationMapProps) {
  const containerStyle: React.CSSProperties = {
    padding: '2rem',
    backgroundColor: 'var(--location-bg, #ffffff)',
    borderRadius: '0.5rem',
    boxShadow: variant === 'interactive' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
    border: variant === 'minimal' ? '1px solid #eee' : 'none'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: 'var(--location-title-color, #333)',
    textAlign: 'center'
  }

  const mapStyle: React.CSSProperties = {
    width: '100%',
    height: height,
    borderRadius: '0.5rem',
    border: '1px solid #ddd',
    marginBottom: showInfo ? '1rem' : '0'
  }

  const infoStyle: React.CSSProperties = {
    backgroundColor: 'var(--location-info-bg, #f8f9fa)',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginTop: '1rem'
  }

  const addressStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    color: 'var(--location-address-color, #333)',
    marginBottom: '0.5rem',
    fontWeight: 'bold'
  }

  const contactStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: 'var(--location-contact-color, #666)',
    marginBottom: '0.25rem'
  }

  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'var(--location-button-bg, #007bff)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.25rem',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease'
  }

  // Generate Google Maps embed URL
  const getMapsEmbedUrl = () => {
    if (location.coordinates) {
      return `https://www.google.com/maps/embed/v1/place?key=DEMO_KEY&q=${location.coordinates.lat},${location.coordinates.lng}&zoom=15`
    } else {
      const query = encodeURIComponent(location.address)
      return `https://www.google.com/maps/embed/v1/place?key=DEMO_KEY&q=${query}&zoom=15`
    }
  }

  // Generate Google Maps link for directions
  const getMapsDirectionsUrl = () => {
    if (location.mapsUrl) {
      return location.mapsUrl
    }
    
    const query = encodeURIComponent(location.address)
    return `https://www.google.com/maps/search/?api=1&query=${query}`
  }

  if (!location) {
    return (
      <section className={`location-map location-map-${variant} ${className}`} style={containerStyle} {...props}>
        {title && <h3 style={titleStyle}>{title}</h3>}
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
          Location information will be available soon.
        </p>
      </section>
    )
  }

  return (
    <section 
      className={`location-map location-map-${variant} ${className}`}
      style={containerStyle}
      {...props}
    >
      {title && <h3 style={titleStyle}>{title}</h3>}
      
      {/* Map Placeholder - In production, use Google Maps API */}
      <div 
        style={mapStyle}
        title="Interactive map"
      >
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.5rem',
          color: '#666',
          fontSize: '1.1rem',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {location.address}
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              Interactive map will load here
            </div>
          </div>
        </div>
      </div>
      
      {showInfo && (
        <div style={infoStyle}>
          <div style={addressStyle}>
            📍 {location.address}
          </div>
          
          {location.phone && (
            <div style={contactStyle}>
              📞 <a href={`tel:${location.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {location.phone}
              </a>
            </div>
          )}
          
          {location.hours && (
            <div style={contactStyle}>
              🕒 {location.hours}
            </div>
          )}
          
          <a
            href={getMapsDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--location-button-hover-bg, #0056b3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--location-button-bg, #007bff)'
            }}
          >
            Get Directions
          </a>
        </div>
      )}
    </section>
  )
}