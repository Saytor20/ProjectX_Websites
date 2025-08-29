import React from 'react'
import { sanitizeHTML } from '@/lib/html-sanitizer'

export interface RawHTMLProps {
  id: string
  html?: string
  htmlPath?: string
  className?: string
  variant?: string
  theme?: any
  data?: any
}

export function RawHTML({ 
  id, 
  html, 
  htmlPath, 
  className = '',
  ...props 
}: RawHTMLProps) {
  // For now, we'll work with direct HTML content
  // In the future, htmlPath could load from static files
  const content = html || ''
  
  if (!content) {
    return (
      <div className={`raw-html-placeholder ${className}`} data-component="RawHTML">
        <p>RawHTML: No content provided</p>
      </div>
    )
  }
  
  // Sanitize the HTML content
  const sanitizedHTML = sanitizeHTML(content, {
    removeScripts: true,
    allowedTags: [
      // Basic structure
      'div', 'span', 'section', 'article', 'header', 'footer', 'main', 'nav',
      // Typography
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
      'strong', 'em', 'i', 'b', 'u', 'small', 'mark',
      // Lists
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      // Media
      'img', 'figure', 'figcaption',
      // Links
      'a',
      // Tables
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
      // Forms (for restaurant booking/contact)
      'form', 'input', 'button', 'textarea', 'select', 'option',
      // Quotes and code
      'blockquote', 'cite', 'q', 'code', 'pre'
    ]
  })
  
  return (
    <div 
      className={`raw-html-content ${className}`}
      data-component="RawHTML"
      data-raw-html-id={id}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}

// Export for component registry
export default RawHTML