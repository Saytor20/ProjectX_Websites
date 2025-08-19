import React from 'react'
import { BaseComponentProps } from './types'

export interface SectionProps extends BaseComponentProps {
  children: React.ReactNode
  backgroundColor?: string
  backgroundImage?: string
  padding?: string
  maxWidth?: string
  textAlign?: 'left' | 'center' | 'right'
}

export function Section({ 
  children,
  backgroundColor,
  backgroundImage,
  padding = '3rem 2rem',
  maxWidth = '1200px',
  textAlign = 'left',
  className = '',
  variant = 'default',
  style,
  ...props 
}: SectionProps) {
  const sectionStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || 'var(--section-bg, transparent)',
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: backgroundImage ? 'cover' : undefined,
    backgroundPosition: backgroundImage ? 'center' : undefined,
    backgroundRepeat: backgroundImage ? 'no-repeat' : undefined,
    padding: padding,
    textAlign: textAlign,
    position: 'relative',
    ...style
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: maxWidth,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1
  }

  return (
    <section 
      className={`section section-${variant} ${className}`}
      style={sectionStyle}
      {...props}
    >
      <div style={containerStyle}>
        {children}
      </div>
    </section>
  )
}