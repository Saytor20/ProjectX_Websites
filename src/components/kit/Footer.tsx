'use client'

import React from 'react'
import { BaseComponentProps, BusinessInfo, Location } from './types'

export interface FooterProps extends BaseComponentProps {
  business: BusinessInfo
  locations: Location[]
  social?: Record<string, string>
  showNewsletter?: boolean
  showSocial?: boolean
  copyrightText?: string
  locale?: string
  direction?: 'ltr' | 'rtl'
}

export function Footer({ 
  business,
  locations = [],
  social = {},
  showNewsletter = false,
  showSocial = true,
  copyrightText = 'All rights reserved.',
  locale = 'en',
  direction = 'ltr',
  className = '',
  variant = 'modern',
  ...props 
}: FooterProps) {
  const footerStyle: React.CSSProperties = {
    backgroundColor: 'var(--footer-bg, #2c3e50)',
    color: 'var(--footer-text, #ffffff)',
    padding: '3rem 2rem 1rem',
    marginTop: '4rem'
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: variant === 'minimal' ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  }

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: 'var(--footer-heading, #ffffff)'
  }

  const linkStyle: React.CSSProperties = {
    color: 'var(--footer-link, #bdc3c7)',
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  }

  const socialStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  }

  const socialLinkStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.5rem',
    backgroundColor: 'var(--footer-social-bg, rgba(255,255,255,0.1))',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    color: 'inherit',
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '30px'
  }

  const copyrightStyle: React.CSSProperties = {
    borderTop: '1px solid var(--footer-border, rgba(255,255,255,0.1))',
    paddingTop: '1rem',
    textAlign: 'center',
    color: 'var(--footer-copyright, #95a5a6)',
    fontSize: '0.9rem'
  }

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      facebook: '📘',
      instagram: '📷',
      twitter: '🐦',
      whatsapp: '💬',
      linkedin: '💼',
      youtube: '📺',
      tiktok: '🎵'
    }
    return icons[platform.toLowerCase()] || '🔗'
  }

  return (
    <footer 
      className={`footer footer-${variant} ${className}`}
      style={footerStyle}
      {...props}
    >
      <div style={containerStyle}>
        {/* Business Info Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>{business.name}</h3>
          {business.description && (
            <p style={{ 
              color: 'var(--footer-text, #bdc3c7)', 
              lineHeight: 1.6,
              margin: 0 
            }}>
              {business.description}
            </p>
          )}
          {business.tagline && (
            <p style={{ 
              color: 'var(--footer-tagline, #95a5a6)', 
              fontStyle: 'italic',
              margin: 0 
            }}>
              {business.tagline}
            </p>
          )}
        </div>

        {/* Contact Section */}
        {locations.length > 0 && variant !== 'minimal' && (
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Contact</h3>
            {locations[0].address && (
              <div style={{ color: 'var(--footer-text, #bdc3c7)' }}>
                <div style={{ marginBottom: '0.5rem' }}>📍 {locations[0].address}</div>
              </div>
            )}
            {locations[0].phone && (
              <div style={{ color: 'var(--footer-text, #bdc3c7)' }}>
                📞 <a 
                  href={`tel:${locations[0].phone}`} 
                  style={linkStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--footer-link-hover, #ffffff)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--footer-link, #bdc3c7)'
                  }}
                >
                  {locations[0].phone}
                </a>
              </div>
            )}
            {locations[0].hours && (
              <div style={{ color: 'var(--footer-text, #bdc3c7)' }}>
                🕒 {locations[0].hours}
              </div>
            )}
          </div>
        )}

        {/* Quick Links Section */}
        {variant !== 'minimal' && (
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Quick Links</h3>
            <a 
              href="#home" 
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--footer-link-hover, #ffffff)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--footer-link, #bdc3c7)'
              }}
            >
              Home
            </a>
            <a 
              href="#menu" 
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--footer-link-hover, #ffffff)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--footer-link, #bdc3c7)'
              }}
            >
              Menu
            </a>
            <a 
              href="#contact" 
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--footer-link-hover, #ffffff)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--footer-link, #bdc3c7)'
              }}
            >
              Contact
            </a>
          </div>
        )}

        {/* Newsletter Section */}
        {showNewsletter && variant !== 'minimal' && (
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Stay Updated</h3>
            <p style={{ color: 'var(--footer-text, #bdc3c7)', margin: 0 }}>
              Subscribe to get updates on new menu items and special offers.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--footer-button-bg, #007bff)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Social Media Links */}
      {showSocial && Object.keys(social).length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={socialStyle} className="social-links">
            {Object.entries(social).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={socialLinkStyle}
                title={platform}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--footer-social-hover-bg, rgba(255,255,255,0.2))'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--footer-social-bg, rgba(255,255,255,0.1))'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {getSocialIcon(platform)}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Copyright */}
      <div style={copyrightStyle}>
        © {new Date().getFullYear()} {business.name}. {copyrightText}
      </div>
    </footer>
  )
}