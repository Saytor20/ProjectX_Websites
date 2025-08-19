'use client'

import React from 'react'
import { BaseComponentProps, CTAButton } from './types'

export interface CTAProps extends BaseComponentProps {
  title: string
  description?: string
  primaryButton?: CTAButton
  secondaryButton?: CTAButton
  backgroundType?: 'gradient' | 'solid' | 'image'
  backgroundImage?: string
}

export function CTA({ 
  title,
  description,
  primaryButton,
  secondaryButton,
  backgroundType = 'gradient',
  backgroundImage,
  className = '',
  variant = 'split',
  ...props 
}: CTAProps) {
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (backgroundType) {
      case 'gradient':
        return {
          background: 'var(--cta-gradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%))'
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
          backgroundColor: 'var(--cta-bg, #007bff)'
        }
      default:
        return {}
    }
  }

  const ctaStyle: React.CSSProperties = {
    ...getBackgroundStyle(),
    color: backgroundType === 'solid' && !backgroundImage ? 'var(--cta-text-color, white)' : 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
    position: 'relative',
    margin: '3rem 0'
  }

  const overlayStyle: React.CSSProperties = backgroundImage ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  } : {}

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '600px',
    margin: '0 auto'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--cta-title-size, 2.5rem)',
    fontWeight: 'bold',
    marginBottom: description ? '1rem' : '2rem',
    lineHeight: 1.2
  }

  const descriptionStyle: React.CSSProperties = {
    fontSize: 'var(--cta-description-size, 1.2rem)',
    marginBottom: '2rem',
    opacity: 0.9,
    lineHeight: 1.6
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }

  const primaryButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    backgroundColor: 'var(--cta-primary-button-bg, #ffffff)',
    color: 'var(--cta-primary-button-color, #333)',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block'
  }

  const secondaryButtonStyle: React.CSSProperties = {
    padding: '0.75rem 2rem',
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    border: '2px solid white',
    cursor: 'pointer',
    display: 'inline-block'
  }

  return (
    <section 
      className={`cta cta-${variant} ${className}`}
      style={ctaStyle}
      {...props}
    >
      {backgroundImage && <div style={overlayStyle} />}
      
      <div style={contentStyle}>
        <h2 style={titleStyle}>{title}</h2>
        
        {description && (
          <p style={descriptionStyle}>{description}</p>
        )}
        
        {(primaryButton || secondaryButton) && (
          <div style={buttonContainerStyle}>
            {primaryButton && (
              <a
                href={primaryButton.href}
                target={primaryButton.target}
                style={primaryButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {primaryButton.text}
              </a>
            )}
            
            {secondaryButton && (
              <a
                href={secondaryButton.href}
                target={secondaryButton.target}
                style={secondaryButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.color = 'var(--cta-gradient, #667eea)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'white'
                }}
              >
                {secondaryButton.text}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}