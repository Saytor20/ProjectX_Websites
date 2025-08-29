'use client';

import useUndo from 'use-undo';
import { useEffect, useCallback } from 'react';
import type { StylePatch } from './style-applier';

interface EditorState {
  patches: StylePatch[];
}

interface EditorHistoryReturn {
  patches: StylePatch[];
  undo: () => void;
  redo: () => void;
  addPatch: (patch: StylePatch) => void;
  save: () => void;
  load: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Custom hook for managing editor history with undo/redo functionality
 */
export function useEditorHistory(skinId: string, restaurantId: string): EditorHistoryReturn {
  const storageKey = `editor-patches-${skinId}-${restaurantId}`;
  
  // Initialize with empty patches
  const [editorState, { set, undo, redo, canUndo, canRedo }] = useUndo<EditorState>({
    patches: []
  });

  // Load saved patches from localStorage on mount
  const load = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const patches = JSON.parse(saved) as StylePatch[];
        set({ patches });
      }
    } catch (error) {
      console.warn('Failed to load editor patches:', error);
    }
  }, [storageKey, set]);

  // Save current patches to localStorage and API
  const save = useCallback(async () => {
    try {
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(editorState.present.patches));
      
      // Save to API
      const response = await fetch(`/api/overrides/${skinId}/${restaurantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patches: editorState.present.patches }),
      });
      
      if (response.ok) {
        console.log('✅ Changes saved successfully');
      } else {
        console.warn('Failed to save to API:', response.statusText);
      }
    } catch (error) {
      console.warn('Failed to save editor patches:', error);
    }
  }, [storageKey, editorState.present.patches, skinId, restaurantId]);

  // Add or update a style patch
  const addPatch = useCallback((patch: StylePatch) => {
    const newPatches = [...editorState.present.patches];
    const existingIndex = newPatches.findIndex(p => p.id === patch.id);
    
    if (existingIndex >= 0) {
      // Update existing patch
      newPatches[existingIndex] = patch;
    } else {
      // Add new patch
      newPatches.push(patch);
    }
    
    set({ patches: newPatches });
  }, [set, editorState.present.patches]);

  // Load patches on mount
  useEffect(() => {
    load();
  }, [load]);

  // Auto-save when patches change
  useEffect(() => {
    const timeoutId = setTimeout(save, 500); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [save, editorState.present.patches]);

  return {
    patches: editorState.present.patches,
    undo,
    redo,
    addPatch,
    save,
    load,
    canUndo,
    canRedo
  };
}