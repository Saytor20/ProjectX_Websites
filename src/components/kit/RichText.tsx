import React from 'react'
import { BaseComponentProps } from './types'

export interface RichTextProps extends BaseComponentProps {
  content: string
  htmlContent?: string
  textAlign?: 'left' | 'center' | 'right'
  fontSize?: string
  color?: string
}

export function RichText({ 
  content,
  htmlContent,
  textAlign = 'left',
  fontSize = '1rem',
  color,
  className = '',
  variant = 'default',
  ...props 
}: RichTextProps) {
  const containerStyle: React.CSSProperties = {
    textAlign: textAlign,
    fontSize: fontSize,
    color: color || 'var(--richtext-color, #333)',
    lineHeight: 1.6,
    padding: '1rem 0'
  }

  const processContent = (text: string) => {
    // Simple markdown-like processing
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />')
  }

  if (htmlContent) {
    return (
      <div 
        className={`richtext richtext-${variant} ${className}`}
        style={containerStyle}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        {...props}
      />
    )
  }

  return (
    <div 
      className={`richtext richtext-${variant} ${className}`}
      style={containerStyle}
      dangerouslySetInnerHTML={{ __html: processContent(content) }}
      {...props}
    />
  )
}