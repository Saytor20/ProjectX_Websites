import React from 'react'
import { BaseComponentProps } from './types'

export interface HoursProps extends BaseComponentProps {
  title?: string
  hours: string
  timezone?: string
  showStatus?: boolean
  locale?: string
}

export function Hours({ 
  title = 'Hours',
  hours,
  timezone = 'Asia/Riyadh',
  showStatus = true,
  locale = 'en',
  className = '',
  variant = 'card',
  ...props 
}: HoursProps) {
  const hoursStyle: React.CSSProperties = {
    padding: '2rem',
    backgroundColor: 'var(--hours-bg, #ffffff)',
    borderRadius: '0.5rem',
    boxShadow: variant === 'card' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
    border: variant === 'simple' ? '1px solid #eee' : 'none',
    maxWidth: '400px',
    margin: '0 auto'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: 'var(--hours-title-color, #333)',
    textAlign: 'center'
  }

  const hoursTextStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    color: 'var(--hours-text-color, #666)',
    lineHeight: 1.6,
    textAlign: 'center',
    whiteSpace: 'pre-line'
  }

  const statusStyle: React.CSSProperties = {
    marginTop: '1rem',
    padding: '0.5rem',
    backgroundColor: 'var(--hours-status-bg, #e8f5e9)',
    color: 'var(--hours-status-color, #2e7d32)',
    borderRadius: '0.25rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  }

  const getCurrentStatus = () => {
    // Simple status - in a real app, you'd parse hours and check current time
    const now = new Date()
    const currentHour = now.getHours()
    
    // Basic business hours assumption (9 AM - 9 PM)
    if (currentHour >= 9 && currentHour < 21) {
      return { text: 'Open Now', color: '#2e7d32', bg: '#e8f5e9' }
    } else {
      return { text: 'Closed', color: '#d32f2f', bg: '#ffebee' }
    }
  }

  const status = showStatus ? getCurrentStatus() : null

  if (!hours) {
    return (
      <section className={`hours hours-${variant} ${className}`} style={hoursStyle} {...props}>
        {title && <h3 style={titleStyle}>{title}</h3>}
        <p style={hoursTextStyle}>Hours information will be available soon.</p>
      </section>
    )
  }

  return (
    <section 
      className={`hours hours-${variant} ${className}`}
      style={hoursStyle}
      {...props}
    >
      {title && <h3 style={titleStyle}>{title}</h3>}
      
      <div style={hoursTextStyle}>
        {hours}
      </div>
      
      {status && (
        <div style={{
          ...statusStyle,
          backgroundColor: status.bg,
          color: status.color
        }}>
          {status.text}
        </div>
      )}
      
      {timezone && (
        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.8rem',
          color: '#999',
          textAlign: 'center'
        }}>
          {timezone}
        </div>
      )}
    </section>
  )
}