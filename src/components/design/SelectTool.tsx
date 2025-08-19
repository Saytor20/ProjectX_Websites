'use client'

import { useState, useEffect, useRef } from 'react'

interface SelectToolProps {
  isActive: boolean
  onElementSelect: (element: HTMLElement) => void
}

export default function SelectTool({ isActive, onElementSelect }: SelectToolProps) {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) {
      setSelectedElement(null)
      removeSelectionBox()
    }
  }, [isActive])

  const removeSelectionBox = () => {
    const existingBox = document.getElementById('selection-box')
    if (existingBox) {
      existingBox.remove()
    }
  }

  const createSelectionBox = (element: HTMLElement) => {
    removeSelectionBox()
    
    const rect = element.getBoundingClientRect()
    const box = document.createElement('div')
    box.id = 'selection-box'
    box.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 2px solid #3498db;
      pointer-events: none;
      z-index: 9999;
    `

    // Add resize handles
    const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w']
    handles.forEach(handle => {
      const handleEl = document.createElement('div')
      handleEl.className = `resize-handle resize-handle-${handle}`
      handleEl.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: #3498db;
        border: 1px solid white;
        pointer-events: auto;
        cursor: ${getCursorForHandle(handle)};
      `
      
      // Position handles
      switch(handle) {
        case 'nw':
          handleEl.style.top = '-4px'
          handleEl.style.left = '-4px'
          break
        case 'ne':
          handleEl.style.top = '-4px'
          handleEl.style.right = '-4px'
          break
        case 'sw':
          handleEl.style.bottom = '-4px'
          handleEl.style.left = '-4px'
          break
        case 'se':
          handleEl.style.bottom = '-4px'
          handleEl.style.right = '-4px'
          break
        case 'n':
          handleEl.style.top = '-4px'
          handleEl.style.left = '50%'
          handleEl.style.transform = 'translateX(-50%)'
          break
        case 's':
          handleEl.style.bottom = '-4px'
          handleEl.style.left = '50%'
          handleEl.style.transform = 'translateX(-50%)'
          break
        case 'e':
          handleEl.style.right = '-4px'
          handleEl.style.top = '50%'
          handleEl.style.transform = 'translateY(-50%)'
          break
        case 'w':
          handleEl.style.left = '-4px'
          handleEl.style.top = '50%'
          handleEl.style.transform = 'translateY(-50%)'
          break
      }

      handleEl.addEventListener('mousedown', (e) => {
        e.stopPropagation()
        startResize(e, handle, element)
      })

      box.appendChild(handleEl)
    })

    document.body.appendChild(box)
  }

  const getCursorForHandle = (handle: string) => {
    switch(handle) {
      case 'nw': case 'se': return 'nwse-resize'
      case 'ne': case 'sw': return 'nesw-resize'
      case 'n': case 's': return 'ns-resize'
      case 'e': case 'w': return 'ew-resize'
      default: return 'move'
    }
  }

  const startResize = (e: MouseEvent, handle: string, element: HTMLElement) => {
    e.preventDefault()
    setIsResizing(true)
    setResizeHandle(handle)
    setStartPos({ x: e.clientX, y: e.clientY })
    
    const rect = element.getBoundingClientRect()
    setStartSize({ width: rect.width, height: rect.height })
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !selectedElement || !resizeHandle) return

    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y
    
    let newWidth = startSize.width
    let newHeight = startSize.height
    let newLeft = selectedElement.offsetLeft
    let newTop = selectedElement.offsetTop

    switch(resizeHandle) {
      case 'se':
        newWidth = startSize.width + deltaX
        newHeight = startSize.height + deltaY
        break
      case 'sw':
        newWidth = startSize.width - deltaX
        newHeight = startSize.height + deltaY
        newLeft = selectedElement.offsetLeft + deltaX
        break
      case 'ne':
        newWidth = startSize.width + deltaX
        newHeight = startSize.height - deltaY
        newTop = selectedElement.offsetTop + deltaY
        break
      case 'nw':
        newWidth = startSize.width - deltaX
        newHeight = startSize.height - deltaY
        newLeft = selectedElement.offsetLeft + deltaX
        newTop = selectedElement.offsetTop + deltaY
        break
      case 'n':
        newHeight = startSize.height - deltaY
        newTop = selectedElement.offsetTop + deltaY
        break
      case 's':
        newHeight = startSize.height + deltaY
        break
      case 'e':
        newWidth = startSize.width + deltaX
        break
      case 'w':
        newWidth = startSize.width - deltaX
        newLeft = selectedElement.offsetLeft + deltaX
        break
    }

    // Apply new dimensions
    if (newWidth > 20) {
      selectedElement.style.width = `${newWidth}px`
      if (resizeHandle.includes('w')) {
        selectedElement.style.left = `${newLeft}px`
      }
    }
    if (newHeight > 20) {
      selectedElement.style.height = `${newHeight}px`
      if (resizeHandle.includes('n')) {
        selectedElement.style.top = `${newTop}px`
      }
    }

    // Update selection box
    createSelectionBox(selectedElement)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    setResizeHandle(null)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleElementClick = (e: React.MouseEvent) => {
    if (!isActive || isResizing) return

    const target = e.target as HTMLElement
    
    // Skip if clicking on design tools or controls
    if (target.closest('.simple-tools') || 
        target.closest('.resize-handle') ||
        target.closest('#selection-box')) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    
    // Make element editable
    if (!target.style.position || target.style.position === 'static') {
      target.style.position = 'relative'
    }
    
    setSelectedElement(target)
    createSelectionBox(target)
    onElementSelect(target)
  }

  if (!isActive) return null

  return (
    <div 
      ref={overlayRef}
      className="select-tool-overlay"
      onClick={handleElementClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: 'default',
        zIndex: 5
      }}
    />
  )
}