'use client';

import useUndo from 'use-undo';
import { useEffect, useCallback } from 'react';

// Updated interface for the new editor system
export interface EditorChange {
  id: string; // Unique ID for the change
  blockId: string; // Which block was changed
  fieldId: string; // Which field was changed
  oldValue: string | number; // Previous value
  newValue: string | number; // New value
  timestamp: number; // When the change was made
}

interface EditorState {
  changes: EditorChange[];
}

interface EditorHistoryReturn {
  changes: EditorChange[];
  undo: () => void;
  redo: () => void;
  addChange: (change: Omit<EditorChange, 'id' | 'timestamp'>) => void;
  save: () => void;
  load: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
}

/**
 * Custom hook for managing editor history with undo/redo functionality
 * Updated for the new minimal editor system
 */
export function useEditorHistory(templateId: string = 'default'): EditorHistoryReturn {
  const storageKey = `editor-changes-${templateId}`;
  
  // Initialize with empty changes
  const [editorState, { set, undo, redo, canUndo, canRedo }] = useUndo<EditorState>({
    changes: []
  });

  // Load saved changes from localStorage on mount
  const load = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const changes = JSON.parse(saved) as EditorChange[];
        set({ changes });
        console.log(`Loaded ${changes.length} editor changes from storage`);
      }
    } catch (error) {
      console.warn('Failed to load editor changes:', error);
    }
  }, [storageKey, set]);

  // Save current changes to localStorage
  const save = useCallback(async () => {
    try {
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(editorState.present.changes));
      console.log(`Saved ${editorState.present.changes.length} editor changes`);
    } catch (error) {
      console.warn('Failed to save editor changes:', error);
    }
  }, [storageKey, editorState.present.changes]);

  // Add a new editor change
  const addChange = useCallback((changeInput: Omit<EditorChange, 'id' | 'timestamp'>) => {
    const change: EditorChange = {
      ...changeInput,
      id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    const newChanges = [...editorState.present.changes, change];
    set({ changes: newChanges });
    
    console.log('Added editor change:', {
      blockId: change.blockId,
      fieldId: change.fieldId,
      oldValue: change.oldValue,
      newValue: change.newValue
    });
  }, [set, editorState.present.changes]);

  // Clear all changes
  const clear = useCallback(() => {
    set({ changes: [] });
    localStorage.removeItem(storageKey);
    console.log('Cleared all editor changes');
  }, [set, storageKey]);

  // Load changes on mount
  useEffect(() => {
    load();
  }, [load]);

  // Auto-save when changes occur (debounced)
  useEffect(() => {
    if (editorState.present.changes.length === 0) return;
    
    const timeoutId = setTimeout(save, 1000); // Debounce saves by 1 second
    return () => clearTimeout(timeoutId);
  }, [save, editorState.present.changes]);

  return {
    changes: editorState.present.changes,
    undo,
    redo,
    addChange,
    save,
    load,
    canUndo,
    canRedo,
    clear
  };
}

/**
 * Apply changes to the DOM (for undo/redo functionality)
 */
export function applyEditorChange(change: EditorChange, isUndo: boolean = false): void {
  try {
    // Find the block element
    const blockElement = document.querySelector(`[data-block="${change.blockId}"]`) as HTMLElement;
    if (!blockElement) {
      console.warn(`Block element not found: ${change.blockId}`);
      return;
    }

    const valueToApply = isUndo ? change.oldValue : change.newValue;
    
    // Apply the change based on field type (simplified approach)
    // In a real implementation, this would use the registry to determine how to apply changes
    
    // For now, we'll handle common cases
    if (change.fieldId.includes('text')) {
      // Text field - find text elements within the block
      const textElements = blockElement.querySelectorAll('h1, h2, h3, p, span, a');
      if (textElements.length > 0) {
        (textElements[0] as HTMLElement).textContent = String(valueToApply);
      }
    } else if (change.fieldId.includes('image')) {
      // Image field - find image elements within the block
      const imgElements = blockElement.querySelectorAll('img');
      if (imgElements.length > 0) {
        (imgElements[0] as HTMLImageElement).src = String(valueToApply);
      }
    } else if (change.fieldId.includes('spacing') || change.fieldId.includes('padding')) {
      // Spacing field - apply CSS custom property
      blockElement.style.setProperty(`--${change.fieldId}`, String(valueToApply));
    } else if (change.fieldId.includes('color')) {
      // Color field - apply CSS custom property
      blockElement.style.setProperty(`--${change.fieldId}`, String(valueToApply));
    }
    
    console.log(`Applied editor change: ${change.fieldId} = ${valueToApply}${isUndo ? ' (undo)' : ''}`);
  } catch (error) {
    console.error('Failed to apply editor change:', error);
  }
}