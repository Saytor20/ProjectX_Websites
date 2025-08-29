'use client'

import React from 'react'
import { BaseComponentProps, NavigationItem, BusinessInfo } from './types'

export interface NavbarProps extends BaseComponentProps {
  brand: {
    name: string
    logo?: string
  }
  navigation: NavigationItem[]
  social?: Record<string, string>
  locale?: string
  direction?: 'ltr' | 'rtl'
  editorId?: string
}

export function Navbar({ 
  brand, 
  navigation = [], 
  social = {}, 
  className = '',
  variant = 'modern',
  editorId = '',
  ...props 
}: NavbarProps) {
  // Deterministic ID stamping function for child elements
  const stampId = (suffix: string) => editorId ? `${editorId}:${suffix}` : suffix;
  const navStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: 'var(--navbar-bg, #ffffff)',
    borderBottom: '1px solid var(--navbar-border, #e5e5e5)',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '60px'
  }

  const brandStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'var(--navbar-brand-color, #333)',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  }

  const navListStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  }

  const navLinkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: 'var(--navbar-link-color, #666)',
    fontSize: '1rem',
    transition: 'color 0.2s ease',
    cursor: 'pointer'
  }

  return (
    <nav 
      className={`navbar navbar-${variant} ${className}`}
      style={navStyle}
      {...props}
    >
      {/* Brand */}
      <a href="/" style={brandStyle} data-editor-id={stampId('brand')}>
        {brand.logo && brand.logo.trim() && brand.logo !== 'null' && brand.logo !== 'undefined' && (
          <img 
            src={brand.logo} 
            alt={brand.name}
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            data-editor-id={stampId('logo')}
          />
        )}
        <span data-editor-id={stampId('brand-name')}>{brand.name}</span>
      </a>

      {/* Navigation */}
      <ul style={navListStyle} data-editor-id={stampId('nav-menu')}>
        {navigation.map((item, index) => (
          <li key={index} data-editor-id={stampId(`nav-item-${index}`)}>
            <a 
              href={item.href}
              target={item.target}
              style={navLinkStyle}
              data-editor-id={stampId(`nav-link-${index}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--navbar-link-hover-color, #333)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--navbar-link-color, #666)'
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Social Links */}
      {Object.keys(social).length > 0 && (
        <div style={{ display: 'flex', gap: '1rem' }} data-editor-id={stampId('social')}>
          {Object.entries(social).map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={navLinkStyle}
              title={platform}
              data-editor-id={stampId(`social-${platform}`)}
            >
              {platform === 'facebook' && '📘'}
              {platform === 'instagram' && '📷'}
              {platform === 'twitter' && '🐦'}
              {platform === 'whatsapp' && '💬'}
              {!['facebook', 'instagram', 'twitter', 'whatsapp'].includes(platform) && '🔗'}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}