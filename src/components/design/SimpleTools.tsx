'use client'

import { useState } from 'react'

interface SimpleToolsProps {
  onToolSelect: (tool: string) => void
  selectedTool: string
}

export default function SimpleTools({ onToolSelect, selectedTool }: SimpleToolsProps) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#3498db')

  const tools = [
    {
      id: 'select',
      name: 'Select',
      icon: '👆',
      description: 'Click & resize'
    },
    {
      id: 'colors',
      name: 'Colors',
      icon: '🎨',
      description: 'Change colors'
    },
    {
      id: 'shapes',
      name: 'Shapes',
      icon: '📐',
      description: 'Add shapes'
    },
    {
      id: 'pictures',
      name: 'Pictures',
      icon: '🖼️',
      description: 'Add images'
    },
    {
      id: 'links',
      name: 'Links',
      icon: '🔗',
      description: 'Add links'
    },
    {
      id: 'text',
      name: 'Text',
      icon: '📝',
      description: 'Edit text'
    }
  ]

  const handleToolClick = (toolId: string) => {
    if (toolId === 'colors') {
      setColorPickerOpen(!colorPickerOpen)
    } else {
      setColorPickerOpen(false)
      onToolSelect(toolId)
    }
  }

  return (
    <div className="simple-tools">
      <style jsx>{`
        .simple-tools {
          padding: 20px;
          background: var(--figma-surface);
          border-radius: 12px;
          margin: 16px;
        }

        .tools-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--figma-text);
          margin-bottom: 20px;
          text-align: center;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .tool-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 16px;
          background: var(--figma-surface-light);
          border: 2px solid var(--figma-border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 80px;
          text-align: center;
        }

        .tool-box:hover {
          background: var(--figma-accent);
          border-color: var(--figma-accent);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(31, 111, 235, 0.3);
        }

        .tool-box.active {
          background: var(--figma-accent);
          border-color: var(--figma-accent);
          color: white;
        }

        .tool-icon {
          font-size: 24px;
          margin-bottom: 6px;
        }

        .tool-name {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .tool-desc {
          font-size: 10px;
          opacity: 0.8;
          line-height: 1.2;
        }

        .color-picker-popup {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: white;
          border: 1px solid var(--figma-border);
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          margin-top: 8px;
        }

        .color-picker-popup::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          background: white;
          border: 1px solid var(--figma-border);
          border-bottom: none;
          border-right: none;
          transform: translateX(-50%) rotate(45deg);
        }

        .color-input {
          width: 60px;
          height: 60px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 12px;
        }

        .color-presets {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }

        .color-preset {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .color-preset:hover {
          transform: scale(1.1);
          border-color: var(--figma-accent);
        }

        .apply-color-btn {
          width: 100%;
          padding: 8px 16px;
          background: var(--figma-primary);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .apply-color-btn:hover {
          background: var(--figma-primary-hover);
        }

        .instructions {
          background: rgba(31, 111, 235, 0.1);
          border: 1px solid rgba(31, 111, 235, 0.2);
          border-radius: 8px;
          padding: 12px;
          font-size: 11px;
          color: var(--figma-text-muted);
          text-align: center;
          line-height: 1.4;
        }
      `}</style>

      <h3 className="tools-title">Design Tools</h3>
      
      <div className="tools-grid">
        {tools.map(tool => (
          <div
            key={tool.id}
            className={`tool-box ${selectedTool === tool.id ? 'active' : ''}`}
            onClick={() => handleToolClick(tool.id)}
            style={{ position: 'relative' }}
          >
            <div className="tool-icon">{tool.icon}</div>
            <div className="tool-name">{tool.name}</div>
            <div className="tool-desc">{tool.description}</div>
            
            {/* Color Picker Popup */}
            {tool.id === 'colors' && colorPickerOpen && (
              <div className="color-picker-popup">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="color-input"
                />
                
                <div className="color-presets">
                  {['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#95a5a6'].map(color => (
                    <div
                      key={color}
                      className="color-preset"
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedColor(color)
                      }}
                    />
                  ))}
                </div>
                
                <button 
                  className="apply-color-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Apply color to selected element
                    console.log('Applying color:', selectedColor)
                    setColorPickerOpen(false)
                  }}
                >
                  Apply Color
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="instructions">
        {selectedTool === 'colors' && 'Click on any element, then choose a color to apply'}
        {selectedTool === 'shapes' && 'Click and drag on the canvas to draw shapes'}
        {selectedTool === 'pictures' && 'Click to browse for images or enter a URL'}
        {selectedTool === 'links' && 'Click on text to add or edit links'}
        {selectedTool === 'upload' && 'Drag and drop images or click to browse'}
        {selectedTool === 'text' && 'Click on any text to edit it directly'}
        {!selectedTool && 'Select a tool above to start editing your website'}
      </div>
    </div>
  )
}