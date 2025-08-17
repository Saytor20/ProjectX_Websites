import { useEffect, useCallback } from 'react';
import { EditorContext } from '../types';

export const useKeyboardShortcuts = (context: EditorContext) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    const target = event.target as HTMLElement;
    
    // Don't handle shortcuts if user is typing in an input
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    switch (event.key) {
      case 'z':
      case 'Z':
        if (isCtrlOrCmd) {
          event.preventDefault();
          if (event.shiftKey) {
            // Ctrl/Cmd + Shift + Z = Redo
            context.redo();
          } else {
            // Ctrl/Cmd + Z = Undo
            context.undo();
          }
        }
        break;

      case 'y':
      case 'Y':
        if (isCtrlOrCmd) {
          // Ctrl/Cmd + Y = Redo (alternative)
          event.preventDefault();
          context.redo();
        }
        break;

      case 'Delete':
      case 'Backspace':
        if (context.state.selection.elements.length > 0) {
          event.preventDefault();
          // For now, just clear selection. In Phase 2, we'll add element deletion
          context.clearSelection();
        }
        break;

      case 'Escape':
        event.preventDefault();
        context.clearSelection();
        break;

      case 'a':
      case 'A':
        if (isCtrlOrCmd) {
          event.preventDefault();
          // Select all selectable elements
          const selectableElements = document.querySelectorAll(
            '[data-component], .navbar, .hero, .menu-list, .gallery, .hours, .location-map, .cta, .footer, .rich-text, .section'
          );
          context.selectElements(Array.from(selectableElements) as HTMLElement[]);
        }
        break;

      case 'ArrowUp':
        if (context.state.selection.elements.length > 0) {
          event.preventDefault();
          nudgeElements(context.state.selection.elements, 0, event.shiftKey ? -10 : -1);
        }
        break;

      case 'ArrowDown':
        if (context.state.selection.elements.length > 0) {
          event.preventDefault();
          nudgeElements(context.state.selection.elements, 0, event.shiftKey ? 10 : 1);
        }
        break;

      case 'ArrowLeft':
        if (context.state.selection.elements.length > 0) {
          event.preventDefault();
          nudgeElements(context.state.selection.elements, event.shiftKey ? -10 : -1, 0);
        }
        break;

      case 'ArrowRight':
        if (context.state.selection.elements.length > 0) {
          event.preventDefault();
          nudgeElements(context.state.selection.elements, event.shiftKey ? 10 : 1, 0);
        }
        break;

      case 'e':
      case 'E':
        if (isCtrlOrCmd || event.altKey) {
          event.preventDefault();
          context.dispatch({ type: 'TOGGLE_EDIT_MODE' });
        }
        break;

      case 'g':
      case 'G':
        if (event.altKey) {
          event.preventDefault();
          context.dispatch({ type: 'TOGGLE_GRID' });
        }
        break;

      case 'r':
      case 'R':
        if (event.altKey) {
          event.preventDefault();
          context.dispatch({ type: 'TOGGLE_GUIDES' });
        }
        break;
    }
  }, [context]);

  const nudgeElements = (elements: HTMLElement[], deltaX: number, deltaY: number) => {
    elements.forEach(element => {
      const currentTransform = element.style.transform || '';
      const transformMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      
      let currentX = 0;
      let currentY = 0;
      
      if (transformMatch) {
        currentX = parseFloat(transformMatch[1]) || 0;
        currentY = parseFloat(transformMatch[2]) || 0;
      }
      
      const newX = currentX + deltaX;
      const newY = currentY + deltaY;
      
      // Preserve any existing rotation or scale
      const rotateMatch = currentTransform.match(/rotate\([^)]+\)/);
      const scaleMatch = currentTransform.match(/scale\([^)]+\)/);
      
      let newTransform = `translate(${newX}px, ${newY}px)`;
      if (rotateMatch) newTransform += ` ${rotateMatch[0]}`;
      if (scaleMatch) newTransform += ` ${scaleMatch[0]}`;
      
      element.style.transform = newTransform;
    });
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    // Expose methods for programmatic use
    undo: context.undo,
    redo: context.redo,
    selectAll: () => {
      const selectableElements = document.querySelectorAll(
        '[data-component], .navbar, .hero, .menu-list, .gallery, .hours, .location-map, .cta, .footer, .rich-text, .section'
      );
      context.selectElements(Array.from(selectableElements) as HTMLElement[]);
    },
    clearSelection: context.clearSelection,
    nudgeUp: () => nudgeElements(context.state.selection.elements, 0, -1),
    nudgeDown: () => nudgeElements(context.state.selection.elements, 0, 1),
    nudgeLeft: () => nudgeElements(context.state.selection.elements, -1, 0),
    nudgeRight: () => nudgeElements(context.state.selection.elements, 1, 0),
  };
};