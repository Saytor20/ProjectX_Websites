'use client'

import { useState } from 'react'

interface SimpleShapesProps {
  isActive: boolean
  onShapeCreate: (shape: any) => void
}

export default function SimpleShapes({ isActive, onShapeCreate }: SimpleShapesProps) {
  const [selectedShape, setSelectedShape] = useState('rectangle')
  const [showShapeSelector, setShowShapeSelector] = useState(false)

  if (!isActive) return null

  const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'triangle', name: 'Triangle', icon: '🔺' },
    { id: 'line', name: 'Line', icon: '📏' }
  ]

  const handleCanvasClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newShape = {
      id: `shape_${Date.now()}`,
      type: selectedShape,
      x: x - 50,
      y: y - 25,
      width: 100,
      height: 50,
      color: '#3498db',
      borderColor: '#2980b9',
      borderWidth: 2,
      zIndex: Date.now() // Use timestamp for z-index to ensure newer shapes are on top
    }

    onShapeCreate(newShape)
  }

  return (
    <>
      <style jsx>{`
        .shape-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          cursor: crosshair;
          z-index: 10;
        }

        .shape-selector {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          z-index: 100;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .shape-btn {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.2s ease;
        }

        .shape-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.6);
        }

        .shape-btn.active {
          background: var(--figma-accent);
          border-color: var(--figma-accent);
        }

        .instructions {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          text-align: center;
          z-index: 100;
        }
      `}</style>

      <div className="shape-overlay" onClick={handleCanvasClick}>
        {/* Shape Selector */}
        <div className="shape-selector">
          <span style={{ fontSize: '12px', marginRight: '8px' }}>Shape:</span>
          {shapes.map(shape => (
            <button
              key={shape.id}
              className={`shape-btn ${selectedShape === shape.id ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedShape(shape.id)
              }}
              title={shape.name}
            >
              {shape.icon}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="instructions">
          Click anywhere to place a {shapes.find(s => s.id === selectedShape)?.name.toLowerCase()} • Press Escape to exit
        </div>
      </div>
    </>
  )
}