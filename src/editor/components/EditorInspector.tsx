'use client';

import React, { useState, useEffect } from 'react';
import { useEditorContext } from '../EditorApp';

export const EditorInspector: React.FC = () => {
  const { state } = useEditorContext();
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [elementInfo, setElementInfo] = useState<{
    tagName: string;
    className: string;
    id: string;
    component: string;
  } | null>(null);

  const selectedElement = state.selection.lastSelected;

  useEffect(() => {
    if (selectedElement) {
      const rect = selectedElement.getBoundingClientRect();
      setPosition({
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });

      setElementInfo({
        tagName: selectedElement.tagName.toLowerCase(),
        className: selectedElement.className,
        id: selectedElement.id,
        component: selectedElement.getAttribute('data-component') || 'unknown',
      });
    }
  }, [selectedElement]);

  if (!selectedElement || !elementInfo) {
    return null;
  }

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    top: '80px',
    right: '20px',
    width: '280px',
    background: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    zIndex: 10001,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    pointerEvents: 'auto',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#007acc',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    paddingBottom: '8px',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '12px',
  };

  const labelStyle: React.CSSProperties = {
    color: '#ccc',
    fontSize: '11px',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const valueStyle: React.CSSProperties = {
    color: 'white',
    fontSize: '12px',
    fontFamily: 'monospace',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
    wordBreak: 'break-all',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    width: '100%',
  };

  const handlePositionChange = (property: 'x' | 'y' | 'width' | 'height', value: string) => {
    const numValue = parseInt(value) || 0;
    
    if (property === 'x' || property === 'y') {
      const currentTransform = selectedElement.style.transform || '';
      const transformMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      
      let currentX = position.x;
      let currentY = position.y;
      
      if (transformMatch) {
        currentX = parseFloat(transformMatch[1]) || position.x;
        currentY = parseFloat(transformMatch[2]) || position.y;
      }
      
      const newX = property === 'x' ? numValue : currentX;
      const newY = property === 'y' ? numValue : currentY;
      
      // Preserve rotation
      const rotateMatch = currentTransform.match(/rotate\([^)]+\)/);
      let newTransform = `translate(${newX}px, ${newY}px)`;
      if (rotateMatch) newTransform += ` ${rotateMatch[0]}`;
      
      selectedElement.style.transform = newTransform;
    } else if (property === 'width' || property === 'height') {
      selectedElement.style[property] = `${numValue}px`;
    }

    // Update position state
    setPosition(prev => ({
      ...prev,
      [property]: numValue
    }));
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        Inspector
      </div>

      {/* Element Info */}
      <div style={sectionStyle}>
        <div style={labelStyle}>Element</div>
        <div style={valueStyle}>
          &lt;{elementInfo.tagName}&gt; {elementInfo.component}
        </div>
      </div>

      {/* Position & Size */}
      <div style={sectionStyle}>
        <div style={labelStyle}>Position & Size</div>
        <div style={gridStyle}>
          <div>
            <div style={labelStyle}>X</div>
            <input
              style={inputStyle}
              type="number"
              value={position.x}
              onChange={(e) => handlePositionChange('x', e.target.value)}
            />
          </div>
          <div>
            <div style={labelStyle}>Y</div>
            <input
              style={inputStyle}
              type="number"
              value={position.y}
              onChange={(e) => handlePositionChange('y', e.target.value)}
            />
          </div>
          <div>
            <div style={labelStyle}>Width</div>
            <input
              style={inputStyle}
              type="number"
              value={position.width}
              onChange={(e) => handlePositionChange('width', e.target.value)}
            />
          </div>
          <div>
            <div style={labelStyle}>Height</div>
            <input
              style={inputStyle}
              type="number"
              value={position.height}
              onChange={(e) => handlePositionChange('height', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Element ID */}
      {elementInfo.id && (
        <div style={sectionStyle}>
          <div style={labelStyle}>ID</div>
          <div style={valueStyle}>{elementInfo.id}</div>
        </div>
      )}

      {/* Classes */}
      {elementInfo.className && (
        <div style={sectionStyle}>
          <div style={labelStyle}>Classes</div>
          <div style={valueStyle}>
            {elementInfo.className.split(' ').filter(c => c).join(', ')}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={sectionStyle}>
        <div style={labelStyle}>Quick Actions</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              cursor: 'pointer',
            }}
            onClick={() => {
              selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          >
            📍 Scroll to
          </button>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              cursor: 'pointer',
            }}
            onClick={() => {
              console.log('Selected element:', selectedElement);
            }}
          >
            🔍 Log to Console
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div style={sectionStyle}>
        <div style={labelStyle}>Shortcuts</div>
        <div style={{ fontSize: '10px', color: '#ccc', lineHeight: '1.4' }}>
          • Arrow keys: Move 1px<br />
          • Shift + Arrow: Move 10px<br />
          • Cmd/Ctrl + Z: Undo<br />
          • Escape: Clear selection
        </div>
      </div>
    </div>
  );
};