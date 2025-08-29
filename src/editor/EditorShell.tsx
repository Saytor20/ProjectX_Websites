'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Outline from './Outline';
import PatchPanel from './PatchPanel';
import { useEditorHistory, applyEditorChange, type EditorChange } from './history';
import { useEditableText } from './useEditableText';
import { getBlock, applyFieldChange, getFieldValue } from './registry';

export default function EditorShell() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string>();
  const [selectedElement, setSelectedElement] = useState<HTMLElement>();
  const editorRef = useRef<HTMLDivElement>(null);

  const { changes, undo, redo, addChange, canUndo, canRedo, clear } = useEditorHistory();

  // Handle text editing changes
  const handleTextChange = useCallback((newText: string, element: HTMLElement) => {
    if (!selectedBlockId || !selectedElement) return;

    const block = getBlock(selectedBlockId);
    if (!block) return;

    // Find which field this text belongs to
    const textField = block.fields.find(field => {
      if (field.type !== 'text') return false;
      
      const targetElement = field.selector 
        ? selectedElement.querySelector(field.selector) as HTMLElement || selectedElement
        : selectedElement;
      
      return targetElement === element;
    });

    if (textField) {
      const oldValue = getFieldValue(selectedElement, textField);
      
      // Only add change if value actually changed
      if (oldValue !== newText) {
        addChange({
          blockId: selectedBlockId,
          fieldId: textField.id,
          oldValue: String(oldValue),
          newValue: newText
        });
      }
    }
  }, [selectedBlockId, selectedElement, addChange]);

  const { enableEditing, disableEditing, saveChanges } = useEditableText({
    debounceMs: 500,
    onTextChange: handleTextChange
  });

  // Handle block selection
  const handleBlockSelect = useCallback((blockId: string, element: HTMLElement) => {
    // Disable editing on previously selected element
    if (selectedElement) {
      disableEditing(selectedElement);
    }

    setSelectedBlockId(blockId);
    setSelectedElement(element);

    // Enable text editing on new selection
    const block = getBlock(blockId);
    if (block) {
      block.fields.forEach(field => {
        if (field.type === 'text') {
          const targetElement = field.selector 
            ? element.querySelector(field.selector) as HTMLElement || element
            : element;
          
          if (targetElement) {
            enableEditing(targetElement);
          }
        }
      });
    }
  }, [selectedElement, disableEditing, enableEditing]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt+E to toggle editor
      if (event.altKey && event.key === 'e') {
        event.preventDefault();
        setIsVisible(prev => !prev);
        return;
      }

      // Only handle other shortcuts if editor is visible
      if (!isVisible) return;

      // Escape to close editor
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsVisible(false);
        return;
      }

      // Ctrl/Cmd+Z for undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          const lastChange = changes[changes.length - 1];
          undo();
          if (lastChange) {
            applyEditorChange(lastChange, true);
          }
        }
        return;
      }

      // Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y for redo
      if (((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) ||
          ((event.ctrlKey || event.metaKey) && event.key === 'y')) {
        event.preventDefault();
        if (canRedo) {
          redo();
          // Note: Applying redo change would require more complex state tracking
        }
        return;
      }

      // Ctrl/Cmd+S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveChanges();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, canUndo, canRedo, undo, redo, changes, saveChanges]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (selectedElement) {
        disableEditing(selectedElement);
      }
    };
  }, [selectedElement, disableEditing]);

  // Don't render in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (!isVisible) {
    return (
      <div className="editor-toggle">
        <button 
          onClick={() => setIsVisible(true)}
          className="editor-toggle-btn"
          title="Open Editor (Alt+E)"
        >
          ✏️
        </button>

        <style jsx>{`
          .editor-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
          }

          .editor-toggle-btn {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            background: #007bff;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
            transition: all 0.2s ease;
          }

          .editor-toggle-btn:hover {
            background: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
          }

          .editor-toggle-btn:active {
            transform: translateY(0);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div ref={editorRef} className="editor-shell">
        <div className="editor-header">
          <div className="editor-title">
            <h2>Page Editor</h2>
            <div className="editor-status">
              {changes.length} change{changes.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="editor-controls">
            <button 
              onClick={undo} 
              disabled={!canUndo}
              className="editor-btn"
              title="Undo (Ctrl+Z)"
            >
              ↶
            </button>
            <button 
              onClick={redo} 
              disabled={!canRedo}
              className="editor-btn"
              title="Redo (Ctrl+Shift+Z)"
            >
              ↷
            </button>
            <button 
              onClick={clear} 
              className="editor-btn editor-btn-danger"
              title="Clear All Changes"
            >
              🗑️
            </button>
            <button 
              onClick={() => setIsVisible(false)} 
              className="editor-btn"
              title="Close Editor (Escape)"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="editor-content">
          <div className="editor-panel">
            <Outline 
              selectedBlockId={selectedBlockId}
              onBlockSelect={handleBlockSelect}
            />
          </div>

          <div className="editor-panel">
            <PatchPanel 
              selectedBlockId={selectedBlockId}
              selectedElement={selectedElement}
            />
          </div>
        </div>

        <div className="editor-help">
          <div className="editor-help-shortcuts">
            <strong>Shortcuts:</strong>
            <span>Alt+E: Toggle</span>
            <span>Ctrl+Z: Undo</span>
            <span>Ctrl+Y: Redo</span>
            <span>Esc: Close</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .editor-shell {
          position: fixed;
          top: 0;
          left: 0;
          width: 360px;
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e1e5e9;
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', system-ui, sans-serif;
          font-size: 13px;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e1e5e9;
          background: #f8f9fa;
          flex-shrink: 0;
        }

        .editor-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .editor-title h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .editor-status {
          background: #e5f3ff;
          color: #0066cc;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .editor-controls {
          display: flex;
          gap: 4px;
        }

        .editor-btn {
          width: 28px;
          height: 28px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.15s ease;
        }

        .editor-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .editor-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .editor-btn-danger:hover:not(:disabled) {
          background: #fef2f2;
          border-color: #f87171;
          color: #dc2626;
        }

        .editor-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .editor-panel {
          flex-shrink: 0;
          overflow-y: auto;
        }

        .editor-panel:last-child {
          flex: 1;
        }

        .editor-help {
          padding: 12px 16px;
          border-top: 1px solid #e1e5e9;
          background: #f8f9fa;
          flex-shrink: 0;
        }

        .editor-help-shortcuts {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 12px;
          font-size: 11px;
          color: #6b7280;
        }

        .editor-help-shortcuts strong {
          color: #374151;
        }

        .editor-help-shortcuts span {
          background: #ffffff;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        }

        /* Add visual indicator when editor is active */
        .editor-shell::after {
          content: '';
          position: absolute;
          top: 0;
          right: -4px;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #007bff, #0056b3);
        }
      `}</style>
    </>
  );
}