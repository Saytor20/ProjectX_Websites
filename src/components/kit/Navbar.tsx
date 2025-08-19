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
}

export function Navbar({ 
  brand, 
  navigation = [], 
  social = {}, 
  className = '',
  variant = 'modern',
  ...props 
}: NavbarProps) {
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
      <a href="/" style={brandStyle}>
        {brand.logo && (
          <img 
            src={brand.logo} 
            alt={brand.name}
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
        )}
        <span>{brand.name}</span>
      </a>

      {/* Navigation */}
      <ul style={navListStyle}>
        {navigation.map((item, index) => (
          <li key={index}>
            <a 
              href={item.href}
              target={item.target}
              style={navLinkStyle}
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
        <div style={{ display: 'flex', gap: '1rem' }}>
          {Object.entries(social).map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={navLinkStyle}
              title={platform}
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