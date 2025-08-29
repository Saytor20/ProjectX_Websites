'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { HexColorPicker } from 'react-colorful'

type Tool = 'select' | 'text' | 'color' | 'image' | 'link' | 'shape'

interface SelectedElement {
  element: HTMLElement
  type: 'text' | 'image' | 'link' | 'button' | 'container' | 'unknown'
  rect: DOMRect
}

interface SimpleEditorProps {
  iframeId: string
  skinId: string
  restaurantId: string
}

export default function SimpleEditor({ iframeId, skinId, restaurantId }: SimpleEditorProps) {
  const [activeTool, setActiveTool] = useState<Tool>('select')
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorMode, setColorMode] = useState<'text' | 'background'>('background')
  const [currentColor, setCurrentColor] = useState('#000000')
  const [iframeDoc, setIframeDoc] = useState<Document | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Wait for iframe to load and get its document
  useEffect(() => {
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement
    if (!iframe) return undefined

    const checkIframe = () => {
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        setIframeDoc(iframe.contentDocument)
        console.log('✅ Iframe document ready')
      } else {
        setTimeout(checkIframe, 100)
      }
    }

    iframe.addEventListener('load', checkIframe)
    checkIframe() // Check immediately in case already loaded

    return () => iframe.removeEventListener('load', checkIframe)
  }, [iframeId])

  // Detect element type
  const detectElementType = (element: HTMLElement): SelectedElement['type'] => {
    const tag = element.tagName.toLowerCase()
    if (tag === 'img') return 'image'
    if (tag === 'a') return 'link'
    if (tag === 'button') return 'button'
    if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'li', 'label'].includes(tag)) return 'text'
    if (element.children.length === 0 && element.textContent?.trim()) return 'text'
    return 'container'
  }

  // Handle element selection and tool actions
  const handleIframeClick = useCallback((e: MouseEvent) => {
    if (!iframeDoc) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const target = e.target as HTMLElement
    if (!target) return

    // For select tool, select the clicked element
    if (activeTool === 'select') {
      const rect = target.getBoundingClientRect()
      setSelectedElement({
        element: target,
        type: detectElementType(target),
        rect
      })
      console.log('Selected element:', target.tagName, target.className)
    }
    
    // For text tool, make text editable
    else if (activeTool === 'text') {
      const type = detectElementType(target)
      if (type === 'text' || type === 'link' || type === 'button') {
        target.contentEditable = 'true'
        target.focus()
        
        // Save on blur
        const handleBlur = () => {
          target.contentEditable = 'false'
          target.removeEventListener('blur', handleBlur)
          console.log('Text edited:', target.textContent)
        }
        target.addEventListener('blur', handleBlur)
      }
    }
    
    // For image tool, prompt for new URL
    else if (activeTool === 'image' && target.tagName.toLowerCase() === 'img') {
      const newSrc = prompt('Enter new image URL:', (target as HTMLImageElement).src)
      if (newSrc) {
        (target as HTMLImageElement).src = newSrc
        console.log('Image updated:', newSrc)
      }
    }
    
    // For link tool, edit href
    else if (activeTool === 'link' && target.tagName.toLowerCase() === 'a') {
      const newHref = prompt('Enter new link URL:', (target as HTMLAnchorElement).href)
      if (newHref) {
        (target as HTMLAnchorElement).href = newHref
        console.log('Link updated:', newHref)
      }
    }
    
    // For color tool, show color picker
    else if (activeTool === 'color') {
      setSelectedElement({
        element: target,
        type: detectElementType(target),
        rect: target.getBoundingClientRect()
      })
      setShowColorPicker(true)
    }
  }, [activeTool, iframeDoc])

  // Add click listener to iframe
  useEffect(() => {
    if (!iframeDoc) return () => {}

    iframeDoc.addEventListener('click', handleIframeClick, true)
    
    return () => {
      iframeDoc.removeEventListener('click', handleIframeClick, true)
    }
  }, [iframeDoc, handleIframeClick])

  // Handle color change
  const handleColorChange = (color: string) => {
    if (!selectedElement) return

    if (colorMode === 'background') {
      selectedElement.element.style.backgroundColor = color
    } else {
      selectedElement.element.style.color = color
    }
    setCurrentColor(color)
    console.log(`Color changed to ${color} (${colorMode})`)
  }

  // Add shape to iframe
  const addShape = (type: 'rectangle' | 'circle' | 'line') => {
    if (!iframeDoc) return

    const shape = iframeDoc.createElement('div')
    const shapeId = `shape-${Date.now()}`
    shape.id = shapeId
    shape.style.position = 'absolute'
    shape.style.top = '50px'
    shape.style.left = '50px'
    shape.style.backgroundColor = '#3b82f6'
    shape.style.cursor = 'move'
    shape.style.zIndex = '1000'

    if (type === 'rectangle') {
      shape.style.width = '100px'
      shape.style.height = '60px'
      shape.style.borderRadius = '4px'
    } else if (type === 'circle') {
      shape.style.width = '80px'
      shape.style.height = '80px'
      shape.style.borderRadius = '50%'
    } else if (type === 'line') {
      shape.style.width = '120px'
      shape.style.height = '2px'
      shape.style.borderRadius = '0'
    }

    // Add to body of iframe
    iframeDoc.body.appendChild(shape)
    console.log(`Added ${type} shape:`, shapeId)
  }

  // Render selection outline and resize handles
  useEffect(() => {
    if (!selectedElement || !iframeDoc || activeTool !== 'select') {
      // Remove existing outline
      const existingOutline = iframeDoc?.getElementById('editor-selection-outline')
      if (existingOutline) existingOutline.remove()
      return () => {}
    }

    // Remove existing outline
    const existingOutline = iframeDoc.getElementById('editor-selection-outline')
    if (existingOutline) existingOutline.remove()

    // Create selection outline with resize handles
    const outline = iframeDoc.createElement('div')
    outline.id = 'editor-selection-outline'
    outline.style.position = 'absolute'
    outline.style.border = '2px solid #3b82f6'
    outline.style.pointerEvents = 'none'
    outline.style.zIndex = '9999'
    
    // Get element position relative to iframe
    const rect = selectedElement.element.getBoundingClientRect()
    const iframeRect = (document.getElementById(iframeId) as HTMLIFrameElement)?.getBoundingClientRect()
    
    if (iframeRect) {
      outline.style.left = `${rect.left - iframeRect.left}px`
      outline.style.top = `${rect.top - iframeRect.top}px`
      outline.style.width = `${rect.width}px`
      outline.style.height = `${rect.height}px`
    }

    // Add resize handles (8 handles around the selection)
    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
    handles.forEach(position => {
      const handle = iframeDoc.createElement('div')
      handle.className = `resize-handle ${position}`
      handle.style.position = 'absolute'
      handle.style.width = '8px'
      handle.style.height = '8px'
      handle.style.backgroundColor = '#3b82f6'
      handle.style.border = '1px solid white'
      handle.style.pointerEvents = 'auto'
      handle.style.cursor = position.includes('n') || position.includes('s') 
        ? (position.includes('w') || position.includes('e') ? 'nw-resize' : 'ns-resize')
        : 'ew-resize'

      // Position handles around the outline
      if (position.includes('n')) handle.style.top = '-5px'
      if (position.includes('s')) handle.style.bottom = '-5px'
      if (position.includes('w')) handle.style.left = '-5px'
      if (position.includes('e')) handle.style.right = '-5px'
      if (position === 'n' || position === 's') handle.style.left = '50%'
      if (position === 'e' || position === 'w') handle.style.top = '50%'

      outline.appendChild(handle)
    })

    // Add to iframe body
    iframeDoc.body.appendChild(outline)

    return () => {
      const outline = iframeDoc?.getElementById('editor-selection-outline')
      if (outline) outline.remove()
    }
  }, [selectedElement, iframeDoc, activeTool, iframeId])

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      padding: '12px',
      display: 'flex',
      gap: '8px',
      zIndex: 1000,
      border: '1px solid #e5e7eb'
    }}>
      {/* Tool Buttons */}
      {(['select', 'text', 'color', 'image', 'link', 'shape'] as Tool[]).map(tool => (
        <button
          key={tool}
          onClick={() => {
            setActiveTool(tool)
            if (tool !== 'color') setShowColorPicker(false)
            if (tool === 'color' && selectedElement) setShowColorPicker(true)
          }}
          style={{
            padding: '8px 12px',
            background: activeTool === tool ? '#3b82f6' : '#f3f4f6',
            color: activeTool === tool ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeTool === tool ? '600' : '400'
          }}
        >
          {tool === 'select' && '👆 Select'}
          {tool === 'text' && '📝 Text'}
          {tool === 'color' && '🎨 Color'}
          {tool === 'image' && '🖼️ Image'}
          {tool === 'link' && '🔗 Link'}
          {tool === 'shape' && '📐 Shape'}
        </button>
      ))}

      {/* Color Picker */}
      {showColorPicker && (
        <div style={{
          position: 'absolute',
          bottom: '60px',
          right: '0',
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ marginBottom: '12px', fontSize: '12px', fontWeight: '600' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <input
                type="radio"
                checked={colorMode === 'background'}
                onChange={() => setColorMode('background')}
              />
              Background Color
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                checked={colorMode === 'text'}
                onChange={() => setColorMode('text')}
              />
              Text Color
            </label>
          </div>
          <HexColorPicker color={currentColor} onChange={handleColorChange} />
          <button
            onClick={() => setShowColorPicker(false)}
            style={{
              marginTop: '12px',
              padding: '6px 12px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              width: '100%'
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Shape Tools */}
      {activeTool === 'shape' && (
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '0',
          background: 'white',
          padding: '12px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => addShape('rectangle')}
            style={{
              padding: '8px 12px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ▭ Rectangle
          </button>
          <button
            onClick={() => addShape('circle')}
            style={{
              padding: '8px 12px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ● Circle
          </button>
          <button
            onClick={() => addShape('line')}
            style={{
              padding: '8px 12px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ― Line
          </button>
        </div>
      )}

      {/* Selected Element Info */}
      {selectedElement && (
        <div style={{
          position: 'absolute',
          bottom: '60px',
          right: activeTool === 'color' && showColorPicker ? '280px' : '0',
          background: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: '12px',
          border: '1px solid #e5e7eb',
          minWidth: '160px'
        }}>
          <div><strong>Selected:</strong> {selectedElement.element.tagName.toLowerCase()}</div>
          <div><strong>Type:</strong> {selectedElement.type}</div>
          <div><strong>Size:</strong> {Math.round(selectedElement.rect.width)} × {Math.round(selectedElement.rect.height)}</div>
          {selectedElement.element.className && (
            <div><strong>Class:</strong> {selectedElement.element.className}</div>
          )}
        </div>
      )}

      {/* Connection Status */}
      <div style={{
        position: 'absolute',
        top: '-30px',
        left: '0',
        fontSize: '10px',
        color: iframeDoc ? '#10b981' : '#ef4444',
        fontWeight: '600'
      }}>
        {iframeDoc ? '🟢 Connected' : '🔴 Connecting...'}
      </div>
    </div>
  )
}