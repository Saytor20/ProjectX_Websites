'use client'

interface Shape {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  color: string
  borderColor: string
  borderWidth: number
  zIndex?: number
}

interface ShapeRendererProps {
  shapes: Shape[]
  onShapeClick?: (shape: Shape) => void
  selectedShapeId?: string | null
}

export default function ShapeRenderer({ shapes, onShapeClick, selectedShapeId }: ShapeRendererProps) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 100
    }}>
      {shapes.map(shape => (
        <div
          key={shape.id}
          onClick={(e) => {
            e.stopPropagation()
            onShapeClick?.(shape)
          }}
          style={{
            position: 'absolute',
            left: shape.x,
            top: shape.y,
            width: shape.width,
            height: shape.height,
            backgroundColor: shape.type === 'line' ? 'transparent' : shape.color,
            border: shape.type === 'line' ? 'none' : `${shape.borderWidth}px solid ${shape.borderColor}`,
            borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'rectangle' ? '4px' : 0,
            clipPath: shape.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
            cursor: 'pointer',
            pointerEvents: 'auto',
            zIndex: shape.zIndex || 10,
            boxShadow: selectedShapeId === shape.id ? '0 0 0 2px #3498db, 0 0 0 4px rgba(52, 152, 219, 0.3)' : undefined,
            transition: 'box-shadow 0.2s ease'
          }}
        />
      ))}
    </div>
  )
}