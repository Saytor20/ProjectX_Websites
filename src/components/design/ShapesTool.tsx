'use client'

import { useState, useRef, useEffect } from 'react'

interface Shape {
  id: string
  type: 'rectangle' | 'circle' | 'line' | 'triangle'
  x: number
  y: number
  width: number
  height: number
  color: string
  borderColor: string
  borderWidth: number
  rotation: number
}

interface ShapesToolProps {
  isActive: boolean
  selectedShape: string
  onShapeCreate: (shape: Shape) => void
  onShapeSelect: (shape: Shape | null) => void
  shapes: Shape[]
}

export default function ShapesTool({ 
  isActive, 
  selectedShape, 
  onShapeCreate, 
  onShapeSelect,
  shapes 
}: ShapesToolProps) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [currentShape, setCurrentShape] = useState<Shape | null>(null)
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) {
      setIsDrawing(false)
      setCurrentShape(null)
      setSelectedShapeId(null)
    }
  }, [isActive])

  const generateShapeId = () => `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive || !selectedShape) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setStartPoint({ x, y })

    const newShape: Shape = {
      id: generateShapeId(),
      type: selectedShape as Shape['type'],
      x,
      y,
      width: 0,
      height: 0,
      color: '#3498db',
      borderColor: '#2980b9',
      borderWidth: 2,
      rotation: 0
    }

    setCurrentShape(newShape)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentShape) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const width = Math.abs(x - startPoint.x)
    const height = Math.abs(y - startPoint.y)
    const newX = Math.min(x, startPoint.x)
    const newY = Math.min(y, startPoint.y)

    setCurrentShape({
      ...currentShape,
      x: newX,
      y: newY,
      width,
      height
    })
  }

  const handleMouseUp = () => {
    if (!isDrawing || !currentShape) return

    setIsDrawing(false)

    // Only create the shape if it has meaningful dimensions
    if (currentShape.width > 5 && currentShape.height > 5) {
      onShapeCreate(currentShape)
    }

    setCurrentShape(null)
  }

  const handleShapeClick = (shape: Shape, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedShapeId(shape.id)
    onShapeSelect(shape)
  }

  const renderShape = (shape: Shape, isPreview = false) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: shape.x,
      top: shape.y,
      width: shape.width,
      height: shape.height,
      backgroundColor: shape.type === 'line' ? 'transparent' : shape.color,
      border: `${shape.borderWidth}px solid ${shape.borderColor}`,
      transform: `rotate(${shape.rotation}deg)`,
      cursor: isActive ? 'pointer' : 'default',
      opacity: isPreview ? 0.7 : 1,
      pointerEvents: isPreview ? 'none' : 'auto',
      zIndex: isPreview ? 999 : 10
    }

    switch (shape.type) {
      case 'circle':
        style.borderRadius = '50%'
        break
      case 'line':
        style.height = shape.borderWidth
        style.backgroundColor = shape.borderColor
        style.border = 'none'
        break
      case 'triangle':
        style.backgroundColor = 'transparent'
        style.border = 'none'
        style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'
        style.backgroundColor = shape.color
        break
      default: // rectangle
        style.borderRadius = '4px'
    }

    // Add selection highlight
    if (selectedShapeId === shape.id && !isPreview) {
      style.boxShadow = '0 0 0 2px #3498db, 0 0 0 4px rgba(52, 152, 219, 0.3)'
    }

    return (
      <div
        key={shape.id}
        style={style}
        onClick={(e) => handleShapeClick(shape, e)}
        title={`${shape.type} (${Math.round(shape.width)}×${Math.round(shape.height)})`}
      />
    )
  }

  if (!isActive) return null

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: selectedShape ? 'crosshair' : 'default',
        zIndex: 5
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Render existing shapes */}
      {shapes.map(shape => renderShape(shape))}
      
      {/* Render preview shape while drawing */}
      {currentShape && renderShape(currentShape, true)}
      
      {/* Shape creation guide */}
      {selectedShape && !isDrawing && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          Click and drag to create {selectedShape}
        </div>
      )}
      
      {/* Shape info tooltip */}
      {selectedShapeId && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          Selected: {shapes.find(s => s.id === selectedShapeId)?.type || 'none'}
        </div>
      )}
    </div>
  )
}