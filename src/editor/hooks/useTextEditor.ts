import { useState, useCallback, useEffect } from 'react';
import { useEditorContext } from '../EditorApp';

interface TextEditingState {
  isEditing: boolean;
  editingElement: HTMLElement | null;
}

export const useTextEditor = () => {
  const { state, dispatch } = useEditorContext();
  const [textEditingState, setTextEditingState] = useState<TextEditingState>({
    isEditing: false,
    editingElement: null,
  });

  // Start text editing on an element
  const startTextEditing = useCallback((element: HTMLElement) => {
    // Check if the element contains editable text
    if (!isTextEditableElement(element)) {
      return false;
    }

    // Add editable attribute to track
    element.setAttribute('data-editable', 'text');
    
    setTextEditingState({
      isEditing: true,
      editingElement: element,
    });

    // Dispatch action to store in editor context
    dispatch({
      type: 'START_TEXT_EDIT',
      payload: element,
    });

    return true;
  }, [dispatch]);

  // End text editing
  const endTextEditing = useCallback(() => {
    if (textEditingState.editingElement) {
      textEditingState.editingElement.removeAttribute('data-editable');
    }

    setTextEditingState({
      isEditing: false,
      editingElement: null,
    });

    dispatch({ type: 'END_TEXT_EDIT' });
  }, [textEditingState.editingElement, dispatch]);

  // Check if an element is text-editable
  const isTextEditableElement = useCallback((element: HTMLElement): boolean => {
    // Check for text content
    const hasTextContent = element.textContent && element.textContent.trim().length > 0;
    
    // Check for common text elements
    const textTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'a', 'button'];
    const isTextTag = textTags.includes(element.tagName.toLowerCase());
    
    // Check for component text elements
    const isComponentText = element.hasAttribute('data-component') && hasTextContent;
    
    // Exclude certain elements
    const excludedTags = ['img', 'video', 'iframe', 'canvas', 'svg'];
    const isExcluded = excludedTags.includes(element.tagName.toLowerCase());
    
    return (isTextTag || isComponentText) && hasTextContent && !isExcluded;
  }, []);

  // Handle double-click to start editing
  const handleDoubleClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    
    // Only handle if we're in edit mode
    if (!state.isEditMode) {
      return;
    }

    // Check if target is text-editable
    if (isTextEditableElement(target)) {
      event.preventDefault();
      event.stopPropagation();
      startTextEditing(target);
    }
  }, [state.isEditMode, isTextEditableElement, startTextEditing]);

  // Set up double-click event listener
  useEffect(() => {
    if (state.isEditMode) {
      document.addEventListener('dblclick', handleDoubleClick);
    }

    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [state.isEditMode, handleDoubleClick]);

  // Handle Enter key to start editing selected element
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!state.isEditMode || textEditingState.isEditing) {
        return;
      }

      if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey) {
        const selectedElement = state.selection.lastSelected;
        if (selectedElement && isTextEditableElement(selectedElement)) {
          event.preventDefault();
          startTextEditing(selectedElement);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isEditMode, state.selection.lastSelected, textEditingState.isEditing, isTextEditableElement, startTextEditing]);

  // Update content of an element
  const updateElementContent = useCallback((element: HTMLElement, newContent: string) => {
    if (!element) return;

    const previousContent = element.innerHTML;
    element.innerHTML = newContent;

    // Dispatch content update action
    dispatch({
      type: 'UPDATE_CONTENT',
      payload: {
        elementId: element.id || `element-${Date.now()}`,
        previousContent,
        newContent,
        timestamp: Date.now(),
      },
    });
  }, [dispatch]);

  // Get all text-editable elements in the document
  const getTextEditableElements = useCallback((): HTMLElement[] => {
    const allElements = Array.from(document.querySelectorAll('*')) as HTMLElement[];
    return allElements.filter(isTextEditableElement);
  }, [isTextEditableElement]);

  // Add text-editing visual indicators
  const addTextEditingIndicators = useCallback(() => {
    if (!state.isEditMode) return;

    const textElements = getTextEditableElements();
    textElements.forEach(element => {
      element.classList.add('text-editable');
      element.title = element.title || 'Double-click to edit text';
    });
  }, [state.isEditMode, getTextEditableElements]);

  // Remove text-editing visual indicators
  const removeTextEditingIndicators = useCallback(() => {
    const textElements = document.querySelectorAll('.text-editable');
    textElements.forEach(element => {
      element.classList.remove('text-editable');
      const htmlElement = element as HTMLElement;
      if (htmlElement.title === 'Double-click to edit text') {
        htmlElement.removeAttribute('title');
      }
    });
  }, []);

  // Update indicators when edit mode changes
  useEffect(() => {
    if (state.isEditMode) {
      addTextEditingIndicators();
    } else {
      removeTextEditingIndicators();
    }

    return () => {
      removeTextEditingIndicators();
    };
  }, [state.isEditMode, addTextEditingIndicators, removeTextEditingIndicators]);

  return {
    textEditingState,
    startTextEditing,
    endTextEditing,
    isTextEditableElement,
    updateElementContent,
    getTextEditableElements,
  };
};