/**
 * RichText Component
 * 
 * Safely renders HTML content with sanitization.
 * Supports different text variants and RTL layouts.
 */

'use client';

import React, { useMemo } from 'react';
import { RichTextProps } from './types';

// HTML sanitization function
const sanitizeHTML = (html: string): string => {
  // In production, use a proper HTML sanitization library like DOMPurify
  // For now, implement basic sanitization
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, ''); // onclick, onmouseover, etc.
  sanitized = sanitized.replace(/\s*javascript\s*:/gi, ''); // javascript: urls
  
  // Remove iframe, object, embed tags
  sanitized = sanitized.replace(/<(iframe|object|embed)[^>]*>.*?<\/\1>/gi, '');
  
  // Remove style tags (but keep style attributes for now)
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  return sanitized;
};

export const RichText: React.FC<RichTextProps> = ({
  content,
  variant = 'body',
  sanitize = true,
  allowedTags = [
    'p', 'div', 'span', 'br', 'strong', 'b', 'em', 'i', 'u', 
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 
    'a', 'img',
    'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
  className = '',
  'data-testid': testId = 'rich-text',
  locale = 'en',
  direction = 'ltr',
}) => {
  // Process and sanitize content
  const processedContent = useMemo(() => {
    if (!content) return '';
    
    let processed = content;
    
    // Sanitize if enabled (always true in production)
    if (sanitize) {
      processed = sanitizeHTML(processed);
      
      // Further restrict to allowed tags if specified
      if (allowedTags.length > 0) {
        const allowedPattern = allowedTags.join('|');
        const tagRegex = new RegExp(`<(?!\/?(?:${allowedPattern})\s*\/?>)[^>]+>`, 'gi');
        processed = processed.replace(tagRegex, '');
      }
    }
    
    // Process RTL content
    if (direction === 'rtl') {
      // Add RTL direction to block elements if not present
      processed = processed.replace(
        /<(p|div|h[1-6]|blockquote)(?![^>]*\sdir=)/gi,
        '<$1 dir="rtl"'
      );
    }
    
    return processed;
  }, [content, sanitize, allowedTags, direction]);

  // Handle empty content
  if (!processedContent.trim()) {
    return null;
  }

  const richTextClasses = [
    'rich-text',
    `rich-text--${variant}`,
    `rich-text--${direction}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={richTextClasses}
      data-testid={testId}
      dir={direction}
      dangerouslySetInnerHTML={{ __html: processedContent }}
      role={variant === 'lead' ? 'complementary' : undefined}
      aria-label={variant === 'caption' ? (
        locale === 'ar' ? 'تسمية توضيحية' : 'Caption'
      ) : undefined}
    />
  );
};

// Specialized variants
export const LeadText: React.FC<Omit<RichTextProps, 'variant'>> = (props) => (
  <RichText {...props} variant="lead" />
);

export const CaptionText: React.FC<Omit<RichTextProps, 'variant'>> = (props) => (
  <RichText {...props} variant="caption" />
);

// Utility function to convert plain text to rich text with basic formatting
export const textToRichText = (text: string, options: {
  preserveLineBreaks?: boolean;
  autoLink?: boolean;
} = {}): string => {
  const { preserveLineBreaks = true, autoLink = false } = options;
  
  let processed = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  if (preserveLineBreaks) {
    processed = processed.replace(/\n/g, '<br>');
  }
  
  if (autoLink) {
    // Simple URL detection and linking
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    processed = processed.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Email detection
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    processed = processed.replace(emailRegex, '<a href="mailto:$1">$1</a>');
  }
  
  return processed;
};

// Utility function to strip HTML tags and get plain text
export const richTextToPlainText = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
};

// Utility function to truncate rich text content
export const truncateRichText = (html: string, maxLength: number, suffix: string = '...'): string => {
  const plainText = richTextToPlainText(html);
  
  if (plainText.length <= maxLength) {
    return html;
  }
  
  const truncated = plainText.substring(0, maxLength - suffix.length);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // Try to break at word boundary
  const finalText = lastSpaceIndex > maxLength * 0.8 ? 
    truncated.substring(0, lastSpaceIndex) : 
    truncated;
  
  return textToRichText(finalText + suffix);
};