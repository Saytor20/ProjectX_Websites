import { useState, useCallback } from 'react';
import { useEditorContext } from '../EditorApp';

interface BackgroundState {
  isBackgroundPickerOpen: boolean;
  selectedElement: HTMLElement | null;
}

export const useBackgrounds = () => {
  const { state, addToHistory } = useEditorContext();
  const [backgroundState, setBackgroundState] = useState<BackgroundState>({
    isBackgroundPickerOpen: false,
    selectedElement: null,
  });

  // Open background picker
  const openBackgroundPicker = useCallback((element?: HTMLElement) => {
    setBackgroundState(prev => ({
      ...prev,
      isBackgroundPickerOpen: true,
      selectedElement: element || state.selection.lastSelected || null,
    }));
  }, [state.selection.lastSelected]);

  // Close background picker
  const closeBackgroundPicker = useCallback(() => {
    setBackgroundState(prev => ({
      ...prev,
      isBackgroundPickerOpen: false,
      selectedElement: null,
    }));
  }, []);

  // Check if an element can have background styling
  const isBackgroundableElement = useCallback((element: HTMLElement): boolean => {
    // Most elements can have backgrounds, but exclude certain types
    const excludedTags = ['img', 'br', 'hr', 'input', 'button'];
    const tagName = element.tagName.toLowerCase();
    
    if (excludedTags.includes(tagName)) {
      return false;
    }

    // Check if element has sufficient size to make background visible
    const rect = element.getBoundingClientRect();
    return rect.width > 10 && rect.height > 10;
  }, []);

  // Apply background to element
  const applyBackground = useCallback((
    element: HTMLElement,
    backgroundValue: string
  ): boolean => {
    try {
      const previousBackground = getComputedStyle(element).background;
      
      // Create history state
      const beforeState = {
        id: `history-${Date.now()}`,
        elementId: element.id || `element-${Date.now()}`,
        beforeState: {
          position: { x: 0, y: 0 },
          size: { width: element.offsetWidth, height: element.offsetHeight },
          rotation: 0,
          styles: { background: previousBackground },
        },
        afterState: {
          position: { x: 0, y: 0 },
          size: { width: element.offsetWidth, height: element.offsetHeight },
          rotation: 0,
          styles: { background: backgroundValue },
        },
        type: 'background' as const,
        timestamp: Date.now(),
      };

      // Apply the background
      element.style.background = backgroundValue;
      
      // Add to history
      addToHistory(beforeState);

      return true;
    } catch (error) {
      console.error('Failed to apply background:', error);
      return false;
    }
  }, [addToHistory]);

  // Clear background from element
  const clearBackground = useCallback((element: HTMLElement): boolean => {
    return applyBackground(element, 'transparent');
  }, [applyBackground]);

  // Apply solid color background
  const applySolidBackground = useCallback((
    element: HTMLElement,
    color: string
  ): boolean => {
    return applyBackground(element, color);
  }, [applyBackground]);

  // Apply gradient background
  const applyGradientBackground = useCallback((
    element: HTMLElement,
    gradient: string
  ): boolean => {
    return applyBackground(element, gradient);
  }, [applyBackground]);

  // Apply pattern background
  const applyPatternBackground = useCallback((
    element: HTMLElement,
    pattern: string
  ): boolean => {
    return applyBackground(element, `url(${pattern})`);
  }, [applyBackground]);

  // Apply image background
  const applyImageBackground = useCallback((
    element: HTMLElement,
    imageUrl: string,
    options?: {
      size?: string;
      position?: string;
      repeat?: string;
    }
  ): boolean => {
    const {
      size = 'cover',
      position = 'center',
      repeat = 'no-repeat'
    } = options || {};

    const backgroundValue = `url(${imageUrl}) ${position}/${size} ${repeat}`;
    return applyBackground(element, backgroundValue);
  }, [applyBackground]);

  // Get current background of element
  const getCurrentBackground = useCallback((element: HTMLElement): string => {
    return getComputedStyle(element).background || 'transparent';
  }, []);

  // Check if element has a background
  const hasBackground = useCallback((element: HTMLElement): boolean => {
    const background = getCurrentBackground(element);
    return background !== 'transparent' && 
           background !== 'rgba(0, 0, 0, 0)' && 
           background !== 'none';
  }, [getCurrentBackground]);

  // Get all elements that can have backgrounds
  const getBackgroundableElements = useCallback((): HTMLElement[] => {
    const allElements = Array.from(document.querySelectorAll('*')) as HTMLElement[];
    return allElements.filter(isBackgroundableElement);
  }, [isBackgroundableElement]);

  // Parse CSS gradient to extract colors
  const parseGradient = useCallback((gradient: string): string[] => {
    // Simple regex to extract colors from gradient strings
    const colorRegex = /#([a-f0-9]{6}|[a-f0-9]{3})|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/gi;
    const matches = gradient.match(colorRegex);
    return matches || [];
  }, []);

  // Generate random gradient
  const generateRandomGradient = useCallback((): string => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#a55eea', '#26de81', '#fd79a8', '#fdcb6e', '#6c5ce7'
    ];
    
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.floor(Math.random() * 360);
    
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  }, []);

  // Handle keyboard shortcuts for background operations
  const handleBackgroundShortcuts = useCallback((event: KeyboardEvent) => {
    if (!state.isEditMode || !state.selection.lastSelected) {
      return;
    }

    const element = state.selection.lastSelected;
    
    // Ctrl/Cmd + B: Open background picker
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      openBackgroundPicker(element);
    }
    
    // Ctrl/Cmd + Shift + B: Clear background
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'B') {
      event.preventDefault();
      clearBackground(element);
    }
    
    // Ctrl/Cmd + Alt + B: Apply random gradient
    if ((event.ctrlKey || event.metaKey) && event.altKey && event.key === 'b') {
      event.preventDefault();
      const randomGradient = generateRandomGradient();
      applyGradientBackground(element, randomGradient);
    }
  }, [
    state.isEditMode, 
    state.selection.lastSelected, 
    openBackgroundPicker, 
    clearBackground, 
    generateRandomGradient, 
    applyGradientBackground
  ]);

  // Add visual indicators for backgroundable elements
  const addBackgroundIndicators = useCallback(() => {
    if (!state.isEditMode) return;

    const backgroundableElements = getBackgroundableElements();
    backgroundableElements.forEach(element => {
      element.classList.add('backgroundable');
      const currentTitle = element.title;
      element.title = currentTitle ? 
        `${currentTitle} | Ctrl+B for background` : 
        'Ctrl+B for background';
    });
  }, [state.isEditMode, getBackgroundableElements]);

  // Remove visual indicators
  const removeBackgroundIndicators = useCallback(() => {
    const backgroundableElements = document.querySelectorAll('.backgroundable');
    backgroundableElements.forEach(element => {
      element.classList.remove('backgroundable');
      const htmlElement = element as HTMLElement;
      if (htmlElement.title?.includes('Ctrl+B for background')) {
        const cleanTitle = htmlElement.title.replace(' | Ctrl+B for background', '');
        htmlElement.title = cleanTitle === 'Ctrl+B for background' ? '' : cleanTitle;
      }
    });
  }, []);

  return {
    backgroundState,
    openBackgroundPicker,
    closeBackgroundPicker,
    isBackgroundableElement,
    getBackgroundableElements,
    applyBackground,
    clearBackground,
    applySolidBackground,
    applyGradientBackground,
    applyPatternBackground,
    applyImageBackground,
    getCurrentBackground,
    hasBackground,
    parseGradient,
    generateRandomGradient,
    handleBackgroundShortcuts,
    addBackgroundIndicators,
    removeBackgroundIndicators,
  };
};