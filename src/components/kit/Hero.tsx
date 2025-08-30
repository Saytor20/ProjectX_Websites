'use client'

import React from 'react'
import { BaseComponentProps, CTAButton } from './types'

export interface HeroProps extends BaseComponentProps {
  title: string
  subtitle?: string
  description?: string
  ctaButton?: CTAButton
  secondaryButton?: CTAButton
  image?: string
  backgroundType?: 'gradient' | 'image' | 'solid' | 'video'
  backgroundImage?: string
  backgroundVideo?: string
  showStats?: boolean
  stats?: Array<{
    label: string
    value: string
  }>
  editorId?: string
}

export function Hero({ 
  title,
  subtitle,
  description,
  ctaButton,
  secondaryButton,
  image,
  backgroundType = 'gradient',
  backgroundImage,
  backgroundVideo,
  showStats = false,
  stats = [],
  className = '',
  variant = 'default',
  editorId = '',
  ...props 
}: HeroProps) {
  // Deterministic ID stamping function for child elements
  const stampId = (suffix: string) => editorId ? `${editorId}:${suffix}` : suffix;
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (backgroundType) {
      case 'gradient':
        return {
          background: 'var(--hero-gradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%))'
        }
      case 'image':
        return {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      case 'solid':
        return {
          backgroundColor: 'var(--hero-bg, #f8f9fa)'
        }
      default:
        return {}
    }
  }

  const heroStyle: React.CSSProperties = {
    ...getBackgroundStyle(),
    color: backgroundType === 'solid' ? 'var(--hero-text-color, #333)' : 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
    position: 'relative',
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const contentStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    zIndex: 1,
    position: 'relative'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--hero-title-size, 3.5rem)',
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: 1.2
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: 'var(--hero-subtitle-size, 1.5rem)',
    marginBottom: '1rem',
    opacity: 0.9
  }

  const descriptionStyle: React.CSSProperties = {
    fontSize: 'var(--hero-description-size, 1.1rem)',
    marginBottom: '2rem',
    opacity: 0.8,
    lineHeight: 1.6
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: showStats ? '3rem' : '0'
  }

  const primaryButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    backgroundColor: 'var(--hero-button-bg, #007bff)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer'
  }

  const secondaryButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    backgroundColor: 'transparent',
    color: backgroundType === 'solid' ? 'var(--hero-text-color, #333)' : 'white',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    border: '2px solid currentColor',
    cursor: 'pointer'
  }

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    marginTop: '2rem',
    flexWrap: 'wrap'
  }

  const statItemStyle: React.CSSProperties = {
    textAlign: 'center',
    minWidth: '100px'
  }

  const statValueStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    display: 'block'
  }

  const statLabelStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    opacity: 0.8,
    marginTop: '0.25rem'
  }

  return (
    <section 
      className={`hero hero-${variant} ${className}`}
      style={heroStyle}
      {...props}
    >
      {backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      <div style={contentStyle} data-editor-id={stampId('content')}>
        <h1 style={titleStyle} data-editor-id={stampId('title')}>{title}</h1>
        
        {subtitle && (
          <h2 style={subtitleStyle} data-editor-id={stampId('subtitle')}>{subtitle}</h2>
        )}
        
        {description && (
          <p style={descriptionStyle} data-editor-id={stampId('description')}>{description}</p>
        )}
        
        {(ctaButton || secondaryButton) && (
          <div style={buttonContainerStyle} data-editor-id={stampId('buttons')}>
            {ctaButton && (
              <a
                href={ctaButton.href}
                target={ctaButton.target}
                style={primaryButtonStyle}
                data-editor-id={stampId('button-primary')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {ctaButton.text}
              </a>
            )}
            
            {secondaryButton && (
              <a
                href={secondaryButton.href}
                target={secondaryButton.target}
                style={secondaryButtonStyle}
                data-editor-id={stampId('button-secondary')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = backgroundType === 'solid' ? 'var(--hero-text-color, #333)' : 'white'
                  e.currentTarget.style.color = backgroundType === 'solid' ? 'white' : 'var(--hero-gradient, #667eea)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = backgroundType === 'solid' ? 'var(--hero-text-color, #333)' : 'white'
                }}
              >
                {secondaryButton.text}
              </a>
            )}
          </div>
        )}
        
        {showStats && stats.length > 0 && (
          <div style={statsStyle}>
            {stats.map((stat, index) => (
              <div key={index} style={statItemStyle}>
                <span style={statValueStyle}>{stat.value}</span>
                <span style={statLabelStyle}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}