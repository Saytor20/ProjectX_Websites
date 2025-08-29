'use client'

import React from 'react'

export interface ElementInfo {
  element: HTMLElement
  type: 'text' | 'image' | 'link' | 'button' | 'container' | 'unknown'
  editable: {
    text?: boolean
    href?: boolean
    src?: boolean
    backgroundColor?: boolean
    color?: boolean
  }
  currentValues: {
    text?: string
    href?: string
    src?: string
    backgroundColor?: string
    color?: string
  }
}

export function detectElementType(element: HTMLElement): ElementInfo['type'] {
  const tagName = element.tagName.toLowerCase()
  
  // Direct tag matches
  if (tagName === 'img') return 'image'
  if (tagName === 'a') return 'link'
  if (tagName === 'button') return 'button'
  
  // Check if it's primarily text
  if (tagName === 'p' || tagName === 'span' || tagName === 'h1' || 
      tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || 
      tagName === 'h5' || tagName === 'h6' || tagName === 'li') {
    return 'text'
  }
  
  // Check if container has only text content
  const hasOnlyText = element.children.length === 0 && element.textContent?.trim()
  if (hasOnlyText) return 'text'
  
  // Otherwise it's a container
  if (tagName === 'div' || tagName === 'section' || tagName === 'article') {
    return 'container'
  }
  
  return 'unknown'
}

export function getElementInfo(element: HTMLElement, window: Window): ElementInfo {
  const type = detectElementType(element)
  const computedStyle = window.getComputedStyle(element)
  
  const info: ElementInfo = {
    element,
    type,
    editable: {},
    currentValues: {}
  }
  
  // Set editable properties based on type
  switch (type) {
    case 'text':
      info.editable.text = true
      info.editable.color = true
      info.editable.backgroundColor = true
      info.currentValues.text = element.textContent || ''
      info.currentValues.color = computedStyle.color
      info.currentValues.backgroundColor = computedStyle.backgroundColor
      break
      
    case 'image':
      info.editable.src = true
      info.currentValues.src = (element as HTMLImageElement).src
      break
      
    case 'link':
      info.editable.text = true
      info.editable.href = true
      info.editable.color = true
      info.editable.backgroundColor = true
      info.currentValues.text = element.textContent || ''
      info.currentValues.href = (element as HTMLAnchorElement).href
      info.currentValues.color = computedStyle.color
      info.currentValues.backgroundColor = computedStyle.backgroundColor
      break
      
    case 'button':
      info.editable.text = true
      info.editable.color = true
      info.editable.backgroundColor = true
      info.currentValues.text = element.textContent || ''
      info.currentValues.color = computedStyle.color
      info.currentValues.backgroundColor = computedStyle.backgroundColor
      break
      
    case 'container':
      info.editable.backgroundColor = true
      info.currentValues.backgroundColor = computedStyle.backgroundColor
      break
  }
  
  return info
}

interface PropertyPanelProps {
  elementInfo: ElementInfo | null
  onPropertyChange: (property: string, value: string) => void
}

export function PropertyPanel({ elementInfo, onPropertyChange }: PropertyPanelProps) {
  if (!elementInfo) return null
  
  return (
    <div className="property-panel" style={{
      position: 'fixed',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '250px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
        Element Properties ({elementInfo.type})
      </h3>
      
      {elementInfo.editable.text && (
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Text:</label>
          <input
            type="text"
            value={elementInfo.currentValues.text || ''}
            onChange={(e) => onPropertyChange('text', e.target.value)}
            style={{
              width: '100%',
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
        </div>
      )}
      
      {elementInfo.editable.href && (
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Link URL:</label>
          <input
            type="text"
            value={elementInfo.currentValues.href || ''}
            onChange={(e) => onPropertyChange('href', e.target.value)}
            style={{
              width: '100%',
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
        </div>
      )}
      
      {elementInfo.editable.src && (
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Image URL:</label>
          <input
            type="text"
            value={elementInfo.currentValues.src || ''}
            onChange={(e) => onPropertyChange('src', e.target.value)}
            style={{
              width: '100%',
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
        </div>
      )}
      
      {elementInfo.editable.color && (
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Text Color:</label>
          <input
            type="color"
            value={rgbToHex(elementInfo.currentValues.color || '#000000')}
            onChange={(e) => onPropertyChange('color', e.target.value)}
            style={{
              width: '100%',
              height: '30px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>
      )}
      
      {elementInfo.editable.backgroundColor && (
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Background:</label>
          <input
            type="color"
            value={rgbToHex(elementInfo.currentValues.backgroundColor || '#ffffff')}
            onChange={(e) => onPropertyChange('background-color', e.target.value)}
            style={{
              width: '100%',
              height: '30px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>
      )}
    </div>
  )
}

function rgbToHex(color: string): string {
  // If already hex, return it
  if (color.startsWith('#')) return color
  
  // Parse rgb/rgba
  const rgb = color.match(/\d+/g)
  if (!rgb || rgb.length < 3) return '#000000'
  
  const hex = '#' + rgb.slice(0, 3).map(x => {
    const h = parseInt(x).toString(16)
    return h.length === 1 ? '0' + h : h
  }).join('')
  
  return hex
}