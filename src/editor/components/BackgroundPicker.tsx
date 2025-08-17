'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useEditorContext } from '../EditorApp';

interface BackgroundPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElement?: HTMLElement | null;
}

interface GradientStop {
  id: string;
  color: string;
  position: number; // 0-100
}

interface CustomGradient {
  type: 'linear' | 'radial';
  direction: string; // e.g., '45deg', 'to right', 'circle'
  stops: GradientStop[];
}

const predefinedGradients = [
  'linear-gradient(45deg, #ff6b6b, #feca57)',
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(45deg, #ff9a9e, #fecfef)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
  'linear-gradient(45deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(45deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(45deg, #30cfd0, #91a7ff)',
  'linear-gradient(135deg, #a8caba, #5d4e75)',
];

const predefinedPatterns = [
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="2" cy="2" r="1" fill="%23000" opacity="0.1"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="20" height="20" fill="%23f0f0f0"/><rect x="20" y="20" width="20" height="20" fill="%23f0f0f0"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><path d="M0 0h30v30H0V0zm30 30h30v30H30V30z" fill="%23000" opacity="0.05"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M0 0l10 10 10-10v20L10 10 0 20V0z" fill="%23000" opacity="0.03"/></svg>',
];

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
  isOpen,
  onClose,
  selectedElement
}) => {
  const { addToHistory } = useEditorContext();
  const [activeTab, setActiveTab] = useState<'solid' | 'gradient' | 'pattern' | 'image' | 'custom'>('solid');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [customGradient, setCustomGradient] = useState<CustomGradient>({
    type: 'linear',
    direction: '45deg',
    stops: [
      { id: '1', color: '#ff6b6b', position: 0 },
      { id: '2', color: '#4ecdc4', position: 100 },
    ],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyBackground = useCallback((backgroundValue: string, element?: HTMLElement) => {
    const targetElement = element || selectedElement;
    if (!targetElement) return;

    const previousBackground = targetElement.style.background || targetElement.style.backgroundColor || '';
    
    const beforeState = {
      id: `history-${Date.now()}`,
      elementId: targetElement.id || `element-${Date.now()}`,
      beforeState: {
        position: { x: 0, y: 0 },
        size: { width: targetElement.offsetWidth, height: targetElement.offsetHeight },
        rotation: 0,
        styles: { background: previousBackground },
      },
      afterState: {
        position: { x: 0, y: 0 },
        size: { width: targetElement.offsetWidth, height: targetElement.offsetHeight },
        rotation: 0,
        styles: { background: backgroundValue },
      },
      type: 'background' as const,
      timestamp: Date.now(),
    };

    // Apply the background
    targetElement.style.background = backgroundValue;
    
    // Add to history
    addToHistory(beforeState);
  }, [selectedElement, addToHistory]);

  const generateGradientCSS = useCallback((gradient: CustomGradient): string => {
    const stopsCSS = gradient.stops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    if (gradient.type === 'radial') {
      return `radial-gradient(${gradient.direction}, ${stopsCSS})`;
    }
    return `linear-gradient(${gradient.direction}, ${stopsCSS})`;
  }, []);

  const addGradientStop = useCallback(() => {
    const newStop: GradientStop = {
      id: Date.now().toString(),
      color: '#ff0000',
      position: 50,
    };
    setCustomGradient(prev => ({
      ...prev,
      stops: [...prev.stops, newStop].sort((a, b) => a.position - b.position),
    }));
  }, []);

  const removeGradientStop = useCallback((stopId: string) => {
    setCustomGradient(prev => ({
      ...prev,
      stops: prev.stops.filter(stop => stop.id !== stopId),
    }));
  }, []);

  const updateGradientStop = useCallback((stopId: string, updates: Partial<GradientStop>) => {
    setCustomGradient(prev => ({
      ...prev,
      stops: prev.stops.map(stop => 
        stop.id === stopId ? { ...stop, ...updates } : stop
      ),
    }));
  }, []);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        applyBackground(`url(${result.url}) center/cover no-repeat`);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    }
  }, [applyBackground]);

  const clearBackground = useCallback(() => {
    applyBackground('transparent');
  }, [applyBackground]);

  if (!isOpen || !selectedElement) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="background-picker-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
        }}
      />

      {/* Background Picker Panel */}
      <div
        className="background-picker"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '600px',
          height: '70vh',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="bg-picker-header">
          <h3>Background Options</h3>
          <div className="bg-picker-actions">
            <button className="clear-btn" onClick={clearBackground}>
              Clear
            </button>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-picker-tabs">
          {[
            { id: 'solid', label: '🎨 Solid', icon: '⬜' },
            { id: 'gradient', label: '🌈 Gradient', icon: '📐' },
            { id: 'pattern', label: '🔲 Pattern', icon: '▦' },
            { id: 'image', label: '🖼️ Image', icon: '📷' },
            { id: 'custom', label: '🛠️ Custom', icon: '⚙️' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-picker-content">
          {activeTab === 'solid' && (
            <div className="solid-picker">
              <div className="color-input-group">
                <label>Solid Color:</label>
                <input
                  type="color"
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                  className="color-input"
                />
                <button 
                  className="apply-btn"
                  onClick={() => applyBackground(solidColor)}
                >
                  Apply Color
                </button>
              </div>

              <div className="quick-colors">
                <p>Quick Colors:</p>
                <div className="color-grid">
                  {[
                    '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd',
                    '#6c757d', '#495057', '#343a40', '#212529', '#000000', '#dc3545',
                    '#fd7e14', '#ffc107', '#28a745', '#20c997', '#17a2b8', '#007bff',
                    '#6f42c1', '#e83e8c', '#ff6b6b', '#51cf66', '#339af0', '#845ec2'
                  ].map(color => (
                    <button
                      key={color}
                      className="quick-color"
                      style={{ backgroundColor: color }}
                      onClick={() => applyBackground(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gradient' && (
            <div className="gradient-picker">
              <div className="predefined-gradients">
                <p>Predefined Gradients:</p>
                <div className="gradient-grid">
                  {predefinedGradients.map((gradient, index) => (
                    <button
                      key={index}
                      className="gradient-option"
                      style={{ background: gradient }}
                      onClick={() => applyBackground(gradient)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pattern' && (
            <div className="pattern-picker">
              <p>Background Patterns:</p>
              <div className="pattern-grid">
                {predefinedPatterns.map((pattern, index) => (
                  <button
                    key={index}
                    className="pattern-option"
                    style={{ 
                      backgroundImage: `url(${pattern})`,
                      backgroundColor: '#f8f9fa'
                    }}
                    onClick={() => applyBackground(`url(${pattern})`)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="image-picker">
              <div className="upload-area">
                <p>Upload Background Image:</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <button 
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📁 Choose Image
                </button>
                <p className="upload-note">
                  Supports JPG, PNG, WebP, GIF (max 10MB)
                </p>
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="custom-gradient">
              <div className="gradient-controls">
                <div className="control-group">
                  <label>Type:</label>
                  <select
                    value={customGradient.type}
                    onChange={(e) => setCustomGradient(prev => ({ 
                      ...prev, 
                      type: e.target.value as 'linear' | 'radial' 
                    }))}
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>

                <div className="control-group">
                  <label>Direction:</label>
                  <select
                    value={customGradient.direction}
                    onChange={(e) => setCustomGradient(prev => ({ 
                      ...prev, 
                      direction: e.target.value 
                    }))}
                  >
                    {customGradient.type === 'linear' ? (
                      <>
                        <option value="45deg">45° (Top-left to bottom-right)</option>
                        <option value="90deg">90° (Top to bottom)</option>
                        <option value="135deg">135° (Top-right to bottom-left)</option>
                        <option value="180deg">180° (Left to right)</option>
                        <option value="to right">To right</option>
                        <option value="to bottom">To bottom</option>
                        <option value="to top">To top</option>
                        <option value="to left">To left</option>
                      </>
                    ) : (
                      <>
                        <option value="circle">Circle</option>
                        <option value="ellipse">Ellipse</option>
                        <option value="circle at center">Circle at center</option>
                        <option value="ellipse at center">Ellipse at center</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="gradient-stops">
                <div className="stops-header">
                  <label>Color Stops:</label>
                  <button className="add-stop-btn" onClick={addGradientStop}>
                    + Add Stop
                  </button>
                </div>
                
                {customGradient.stops.map((stop) => (
                  <div key={stop.id} className="gradient-stop">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateGradientStop(stop.id, { color: e.target.value })}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) => updateGradientStop(stop.id, { position: parseInt(e.target.value) })}
                    />
                    <span>{stop.position}%</span>
                    {customGradient.stops.length > 2 && (
                      <button 
                        className="remove-stop-btn"
                        onClick={() => removeGradientStop(stop.id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="gradient-preview">
                <div 
                  className="preview-box"
                  style={{ background: generateGradientCSS(customGradient) }}
                />
                <button 
                  className="apply-btn"
                  onClick={() => applyBackground(generateGradientCSS(customGradient))}
                >
                  Apply Custom Gradient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-picker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 12px 12px 0 0;
        }

        .bg-picker-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .bg-picker-actions {
          display: flex;
          gap: 12px;
        }

        .clear-btn {
          padding: 8px 16px;
          background: #f59e0b;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .clear-btn:hover {
          background: #d97706;
        }

        .close-btn {
          padding: 8px;
          background: #f3f4f6;
          color: #6b7280;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .bg-picker-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .tab-btn {
          flex: 1;
          padding: 12px 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 13px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .tab-btn.active {
          color: #3b82f6;
          background: white;
          border-bottom: 2px solid #3b82f6;
        }

        .tab-btn:hover:not(.active) {
          color: #374151;
          background: #f3f4f6;
        }

        .bg-picker-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .color-input-group {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .color-input {
          width: 50px;
          height: 40px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
        }

        .apply-btn {
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .apply-btn:hover {
          background: #2563eb;
        }

        .quick-colors p, .predefined-gradients p, .pattern-picker p, .upload-area p {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 8px;
        }

        .quick-color {
          width: 32px;
          height: 32px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .quick-color:hover {
          transform: scale(1.1);
          border-color: #3b82f6;
        }

        .gradient-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .gradient-option {
          height: 60px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .gradient-option:hover {
          transform: scale(1.05);
          border-color: #3b82f6;
        }

        .pattern-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .pattern-option {
          height: 80px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .pattern-option:hover {
          transform: scale(1.05);
          border-color: #3b82f6;
        }

        .upload-area {
          text-align: center;
          padding: 40px 20px;
        }

        .upload-btn {
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .upload-btn:hover {
          background: #2563eb;
        }

        .upload-note {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
        }

        .gradient-controls {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .control-group label {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }

        .control-group select {
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
        }

        .stops-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .add-stop-btn {
          padding: 4px 8px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .gradient-stop {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .gradient-stop input[type="color"] {
          width: 30px;
          height: 30px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
        }

        .gradient-stop input[type="range"] {
          flex: 1;
        }

        .gradient-stop span {
          font-size: 12px;
          color: #6b7280;
          min-width: 35px;
        }

        .remove-stop-btn {
          padding: 4px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          width: 20px;
          height: 20px;
        }

        .gradient-preview {
          margin-top: 20px;
          text-align: center;
        }

        .preview-box {
          width: 100%;
          height: 60px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          margin-bottom: 12px;
        }
      `}</style>
    </>
  );
};