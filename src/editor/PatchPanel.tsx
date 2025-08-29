'use client';

import React, { useState, useEffect } from 'react';
import { 
  getBlock, 
  applyFieldChange, 
  getFieldValue,
  type EditorField,
  type BlockRegistration
} from './registry';

interface PatchPanelProps {
  selectedBlockId?: string;
  selectedElement?: HTMLElement;
}

export default function PatchPanel({ selectedBlockId, selectedElement }: PatchPanelProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, string | number>>({});
  const [block, setBlock] = useState<BlockRegistration | undefined>();

  // Update block and field values when selection changes
  useEffect(() => {
    if (selectedBlockId && selectedElement) {
      const blockData = getBlock(selectedBlockId);
      setBlock(blockData);

      if (blockData) {
        const values: Record<string, string | number> = {};
        blockData.fields.forEach(field => {
          values[field.id] = getFieldValue(selectedElement, field);
        });
        setFieldValues(values);
      }
    } else {
      setBlock(undefined);
      setFieldValues({});
    }
  }, [selectedBlockId, selectedElement]);

  // Handle field value changes
  const handleFieldChange = (field: EditorField, value: string | number) => {
    if (!selectedElement) return;

    // Update local state
    setFieldValues(prev => ({ ...prev, [field.id]: value }));

    // Apply change to DOM
    applyFieldChange(selectedElement, field, value);
  };

  // Render different field types
  const renderField = (field: EditorField) => {
    const currentValue = fieldValues[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={String(currentValue)}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="field-input"
            placeholder="Enter text..."
          />
        );

      case 'image':
        return (
          <div className="image-field">
            <input
              type="url"
              value={String(currentValue)}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="field-input"
              placeholder="Image URL..."
            />
            {currentValue && (
              <div className="image-preview">
                <img src={String(currentValue)} alt="Preview" />
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <select
            value={String(currentValue)}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="field-select"
          >
            {field.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'spacing':
        const numValue = typeof currentValue === 'number' ? currentValue : parseFloat(String(currentValue)) || 0;
        return (
          <div className="spacing-field">
            <input
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              value={numValue}
              onChange={(e) => handleFieldChange(field, parseFloat(e.target.value))}
              className="field-range"
            />
            <div className="spacing-value">
              {numValue}{field.unit || ''}
            </div>
          </div>
        );

      case 'color':
        return (
          <input
            type="color"
            value={String(currentValue)}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="field-color"
          />
        );

      default:
        return <div className="field-unsupported">Unsupported field type: {field.type}</div>;
    }
  };

  if (!block || !selectedElement) {
    return (
      <div className="patch-panel-empty">
        <h3>Properties</h3>
        <p>Select a block from the outline to edit its properties.</p>
      </div>
    );
  }

  return (
    <div className="patch-panel">
      <div className="patch-panel-header">
        <h3>Properties</h3>
        <div className="selected-block-info">
          <strong>{block.name}</strong>
          <span>{block.fields.length} fields</span>
        </div>
      </div>

      <div className="patch-panel-fields">
        {block.fields.map(field => (
          <div key={field.id} className="field-group">
            <label className="field-label">
              {field.label}
              {field.unit && <span className="field-unit">({field.unit})</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <style jsx>{`
        .patch-panel {
          padding: 16px;
        }

        .patch-panel-empty {
          padding: 24px 16px;
          text-align: center;
          color: #6b7280;
        }

        .patch-panel-empty h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .patch-panel-empty p {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
        }

        .patch-panel-header {
          margin-bottom: 20px;
          border-bottom: 1px solid #e1e5e9;
          padding-bottom: 12px;
        }

        .patch-panel-header h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .selected-block-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .selected-block-info strong {
          color: #1f2937;
        }

        .selected-block-info span {
          color: #6b7280;
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .patch-panel-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .field-unit {
          color: #9ca3af;
          font-weight: 400;
        }

        .field-input, .field-select {
          padding: 8px 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
          transition: border-color 0.15s ease;
        }

        .field-input:focus, .field-select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .field-range {
          width: 100%;
          height: 20px;
          -webkit-appearance: none;
          background: #e5e7eb;
          border-radius: 10px;
          outline: none;
        }

        .field-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #007bff;
          border-radius: 50%;
          cursor: pointer;
        }

        .field-color {
          width: 60px;
          height: 32px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
          padding: 0;
        }

        .spacing-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .spacing-value {
          font-size: 12px;
          color: #6b7280;
          text-align: center;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        }

        .image-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-preview {
          width: 100px;
          height: 60px;
          border: 1px solid #e1e5e9;
          border-radius: 4px;
          overflow: hidden;
          background: #f9fafb;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .field-unsupported {
          padding: 8px 10px;
          background: #fef3cd;
          border: 1px solid #fbbf24;
          border-radius: 4px;
          font-size: 12px;
          color: #92400e;
        }
      `}</style>
    </div>
  );
}