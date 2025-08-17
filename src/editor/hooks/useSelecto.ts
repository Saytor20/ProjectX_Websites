import { useEffect, useRef } from 'react';
import Selecto from 'selecto';
import { EditorContext, SelectoOptions } from '../types';
import { getFeatureFlags } from '../../lib/feature-flags';

const SELECTABLE_COMPONENTS = [
  '[data-component="navbar"]',
  '[data-component="hero"]',
  '[data-component="menu-list"]', 
  '[data-component="gallery"]',
  '[data-component="hours"]',
  '[data-component="location-map"]',
  '[data-component="cta"]',
  '[data-component="footer"]',
  '[data-component="rich-text"]',
  '[data-component="section"]',
  // Also allow selection of any element with these classes
  '.navbar', '.hero', '.menu-list', '.gallery', '.hours', 
  '.location-map', '.cta', '.footer', '.rich-text', '.section'
];

const defaultOptions: SelectoOptions = {
  selectableTargets: SELECTABLE_COMPONENTS,
  selectByClick: true,
  selectFromInside: true,
  continueSelect: false,
  toggleContinueSelect: ['shift'],
  keyContainer: typeof window !== 'undefined' ? window.document.body : null,
};

export const useSelecto = (containerRef: React.RefObject<HTMLDivElement>, context: EditorContext) => {
  const selectoRef = useRef<HTMLDivElement>(null);
  const selectoInstance = useRef<Selecto | null>(null);
  const featureFlags = getFeatureFlags();

  useEffect(() => {
    if (!featureFlags.SELECTO_MULTISELECT || !selectoRef.current || !containerRef.current) {
      return;
    }

    // Cleanup previous instance
    if (selectoInstance.current) {
      selectoInstance.current.destroy();
    }

    // Create new selecto instance
    selectoInstance.current = new Selecto({
      container: containerRef.current,
      selectableTargets: defaultOptions.selectableTargets,
      selectByClick: defaultOptions.selectByClick,
      selectFromInside: defaultOptions.selectFromInside,
      continueSelect: defaultOptions.continueSelect,
      toggleContinueSelect: defaultOptions.toggleContinueSelect,
      keyContainer: defaultOptions.keyContainer,
      dragContainer: containerRef.current,
      hitRate: 0,
      ratio: 0,
    });

    // Selection start
    selectoInstance.current.on('selectStart', (e) => {
      // Clear previous selection if not holding shift
      if (!e.inputEvent.shiftKey) {
        context.clearSelection();
      }
    });

    // Selection
    selectoInstance.current.on('select', (e) => {
      const selectedElements = e.selected as HTMLElement[];
      
      // Filter to ensure only valid component elements are selected
      const validElements = selectedElements.filter(el => {
        return SELECTABLE_COMPONENTS.some(selector => {
          try {
            return el.matches(selector.replace(/[\[\]"]/g, match => {
              if (match === '[') return '\\[';
              if (match === ']') return '\\]';
              if (match === '"') return '\\"';
              return match;
            }));
          } catch {
            return false;
          }
        });
      });

      if (validElements.length > 0) {
        context.selectElements(validElements);
      }
    });

    // Selection end
    selectoInstance.current.on('selectEnd', (e) => {
      const selectedElements = e.selected as HTMLElement[];
      
      if (selectedElements.length === 0) {
        context.clearSelection();
      }
    });

    // Click selection
    selectoInstance.current.on('keydown', (e) => {
      // Handle escape key to clear selection
      if (e.inputEvent.key === 'Escape') {
        context.clearSelection();
      }
    });

    return () => {
      if (selectoInstance.current) {
        selectoInstance.current.destroy();
        selectoInstance.current = null;
      }
    };
  }, [containerRef, context, featureFlags.SELECTO_MULTISELECT]);

  // Method to programmatically set selection
  const setSelection = (elements: HTMLElement[]) => {
    if (selectoInstance.current) {
      selectoInstance.current.setSelectedTargets(elements);
    }
  };

  // Method to add to selection
  const addToSelection = (elements: HTMLElement[]) => {
    if (selectoInstance.current) {
      const currentSelected = selectoInstance.current.getSelectedTargets();
      const newSelection = [...currentSelected, ...elements];
      selectoInstance.current.setSelectedTargets(newSelection);
    }
  };

  // Method to remove from selection
  const removeFromSelection = (elements: HTMLElement[]) => {
    if (selectoInstance.current) {
      const currentSelected = selectoInstance.current.getSelectedTargets();
      const newSelection = currentSelected.filter(el => !elements.includes(el));
      selectoInstance.current.setSelectedTargets(newSelection);
    }
  };

  return { 
    selectoRef,
    setSelection,
    addToSelection,
    removeFromSelection
  };
};