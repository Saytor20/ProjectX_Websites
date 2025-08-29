'use client';

import React, { useState, useEffect } from 'react';
import { getActiveBlocks, type BlockRegistration } from './registry';

interface OutlineProps {
  selectedBlockId?: string;
  onBlockSelect: (blockId: string, element: HTMLElement) => void;
}

interface ActiveBlock {
  block: BlockRegistration;
  element: HTMLElement;
}

export default function Outline({ selectedBlockId, onBlockSelect }: OutlineProps) {
  const [activeBlocks, setActiveBlocks] = useState<ActiveBlock[]>([]);

  // Refresh active blocks periodically
  useEffect(() => {
    const refreshBlocks = () => {
      const blocks = getActiveBlocks();
      setActiveBlocks(blocks);
    };

    // Initial load
    refreshBlocks();

    // Refresh every 2 seconds to catch DOM changes
    const interval = setInterval(refreshBlocks, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handle block selection
  const handleBlockClick = (block: BlockRegistration, element: HTMLElement) => {
    // Scroll element into view smoothly
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add temporary highlight
    element.style.outline = '2px solid #007bff';
    element.style.outlineOffset = '2px';
    
    setTimeout(() => {
      element.style.outline = '';
      element.style.outlineOffset = '';
    }, 2000);

    onBlockSelect(block.id, element);
  };

  if (activeBlocks.length === 0) {
    return (
      <div className="outline-empty">
        <p>No blocks found. Make sure your template has elements with data-block attributes.</p>
      </div>
    );
  }

  return (
    <div className="outline-container">
      <h3 className="outline-title">Page Blocks</h3>
      <div className="outline-list">
        {activeBlocks.map((activeBlock, index) => {
          const { block, element } = activeBlock;
          const isSelected = selectedBlockId === block.id;
          
          return (
            <div
              key={`${block.id}-${index}`}
              className={`outline-item ${isSelected ? 'outline-item-selected' : ''}`}
              onClick={() => handleBlockClick(block, element)}
            >
              <div className="outline-item-header">
                <span className="outline-item-name">{block.name}</span>
                <span className="outline-item-fields">{block.fields.length} fields</span>
              </div>
              <div className="outline-item-selector">{block.selector}</div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .outline-container {
          padding: 16px;
          border-bottom: 1px solid #e1e5e9;
        }

        .outline-title {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .outline-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .outline-item {
          padding: 12px;
          border: 1px solid #e1e5e9;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          background: #fff;
        }

        .outline-item:hover {
          border-color: #007bff;
          box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
        }

        .outline-item-selected {
          border-color: #007bff;
          background: #f0f8ff;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
        }

        .outline-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .outline-item-name {
          font-weight: 500;
          color: #1f2937;
          font-size: 13px;
        }

        .outline-item-fields {
          font-size: 11px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .outline-item-selector {
          font-size: 11px;
          color: #9ca3af;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        }

        .outline-empty {
          padding: 24px 16px;
          text-align: center;
          color: #6b7280;
          font-size: 13px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}