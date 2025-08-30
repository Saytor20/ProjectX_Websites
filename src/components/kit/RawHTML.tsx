import React from 'react'

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
  
  // Basic HTML content - template packages handle their own security
  const sanitizedHTML = content
  
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