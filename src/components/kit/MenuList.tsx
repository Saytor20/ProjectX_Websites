'use client'

import React, { useState } from 'react'
import { BaseComponentProps, MenuSection, MenuItem } from './types'

export interface MenuListProps extends BaseComponentProps {
  title?: string
  sections: MenuSection[]
  currency?: string
  showImages?: boolean
  showDescriptions?: boolean
  locale?: string
}

export function MenuList({ 
  title = 'Menu',
  sections = [],
  currency = 'SAR',
  showImages = true,
  showDescriptions = true,
  locale = 'en',
  className = '',
  variant = 'accordion',
  ...props 
}: MenuListProps) {
  const [activeSection, setActiveSection] = useState<number | null>(0)

  const menuStyle: React.CSSProperties = {
    padding: '3rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '3rem',
    color: 'var(--menu-title-color, #333)'
  }

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'var(--menu-section-color, #007bff)',
    borderBottom: '2px solid var(--menu-section-color, #007bff)',
    paddingBottom: '0.5rem',
    marginBottom: '1.5rem',
    cursor: variant === 'accordion' ? 'pointer' : 'default',
    transition: 'color 0.2s ease'
  }

  const itemsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: variant === 'simple-list' 
      ? '1fr' 
      : 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  }

  const itemStyle: React.CSSProperties = {
    backgroundColor: 'var(--menu-item-bg, #ffffff)',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    border: variant === 'simple-list' ? '1px solid #eee' : 'none'
  }

  const itemHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: showDescriptions ? '0.75rem' : '0',
    gap: '1rem'
  }

  const itemNameStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'var(--menu-item-name-color, #333)',
    margin: 0,
    flex: 1
  }

  const itemPriceStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'var(--menu-item-price-color, #007bff)',
    whiteSpace: 'nowrap'
  }

  const itemDescriptionStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    color: 'var(--menu-item-description-color, #666)',
    lineHeight: 1.5,
    margin: 0
  }

  const formatPrice = (price: string | number) => {
    if (!price) return 'Price on request'
    return `${price} ${currency}`
  }

  const renderMenuItem = (item: MenuItem, index: number) => (
    <div
      key={index}
      style={itemStyle}
      onMouseEnter={(e) => {
        if (variant !== 'simple-list') {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (variant !== 'simple-list') {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
        }
      }}
    >
      {showImages && item.image && (
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '0.25rem',
            marginBottom: '1rem'
          }}
        />
      )}
      
      <div style={itemHeaderStyle}>
        <h4 style={itemNameStyle}>{item.name}</h4>
        <span style={itemPriceStyle}>{formatPrice(item.price)}</span>
      </div>
      
      {showDescriptions && item.description && (
        <p style={itemDescriptionStyle}>{item.description}</p>
      )}
    </div>
  )

  const renderSection = (section: MenuSection, index: number) => {
    const isActive = variant !== 'accordion' || activeSection === index
    
    return (
      <div key={index} style={{ marginBottom: '3rem' }}>
        <h3
          style={sectionHeaderStyle}
          onClick={() => {
            if (variant === 'accordion') {
              setActiveSection(activeSection === index ? null : index)
            }
          }}
          onMouseEnter={(e) => {
            if (variant === 'accordion') {
              e.currentTarget.style.color = 'var(--menu-section-hover-color, #0056b3)'
            }
          }}
          onMouseLeave={(e) => {
            if (variant === 'accordion') {
              e.currentTarget.style.color = 'var(--menu-section-color, #007bff)'
            }
          }}
        >
          {section.name}
          {variant === 'accordion' && (
            <span style={{ marginLeft: '0.5rem', fontSize: '1rem' }}>
              {isActive ? '▼' : '▶'}
            </span>
          )}
        </h3>
        
        {section.description && (
          <p style={{
            color: '#666',
            fontSize: '1rem',
            marginBottom: '1.5rem',
            fontStyle: 'italic'
          }}>
            {section.description}
          </p>
        )}
        
        {isActive && (
          <div style={itemsGridStyle}>
            {section.items.map((item, itemIndex) => renderMenuItem(item, itemIndex))}
          </div>
        )}
      </div>
    )
  }

  if (!sections || sections.length === 0) {
    return (
      <section className={`menu-list menu-list-${variant} ${className}`} style={menuStyle} {...props}>
        {title && <h2 style={titleStyle}>{title}</h2>}
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
          Menu items will be available soon.
        </p>
      </section>
    )
  }

  return (
    <section 
      className={`menu-list menu-list-${variant} ${className}`}
      style={menuStyle}
      {...props}
    >
      {title && <h2 style={titleStyle}>{title}</h2>}
      
      {sections.map((section, index) => renderSection(section, index))}
    </section>
  )
}