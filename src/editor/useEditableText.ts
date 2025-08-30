'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseEditableTextOptions {
  debounceMs?: number;
  onTextChange?: (newText: string, element: HTMLElement) => void;
  placeholder?: string;
}

interface EditableTextControls {
  enableEditing: (element: HTMLElement) => void;
  disableEditing: (element: HTMLElement) => void;
  saveChanges: () => void;
}

export function useEditableText({
  debounceMs = 300,
  onTextChange,
  placeholder = 'Click to edit...'
}: UseEditableTextOptions = {}): EditableTextControls {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const editableElementsRef = useRef<Map<HTMLElement, string>>(new Map());
  const originalValuesRef = useRef<Map<HTMLElement, string>>(new Map());

  // Debounced change handler
  const handleTextChange = useCallback((element: HTMLElement, newText: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      onTextChange?.(newText, element);
    }, debounceMs);
  }, [debounceMs, onTextChange]);

  // Input event handler
  const handleInput = useCallback((event: Event) => {
    const element = event.target as HTMLElement;
    if (!element || !editableElementsRef.current.has(element)) return;

    const newText = element.textContent || '';
    editableElementsRef.current.set(element, newText);
    handleTextChange(element, newText);
  }, [handleTextChange]);

  // Paste event handler to clean up pasted content
  const handlePaste = useCallback((event: ClipboardEvent) => {
    event.preventDefault();
    const element = event.target as HTMLElement;
    
    if (!element || !editableElementsRef.current.has(element)) return;

    // Get plain text from clipboard
    const text = event.clipboardData?.getData('text/plain') || '';
    
    // Insert text at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Trigger change handler
    const newText = element.textContent || '';
    editableElementsRef.current.set(element, newText);
    handleTextChange(element, newText);
  }, [handleTextChange]);

  // Keydown handler for special keys
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const element = event.target as HTMLElement;
    if (!element || !editableElementsRef.current.has(element)) return;

    // Enter key: prevent default in most cases (unless Shift is held)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      element.blur(); // Exit editing mode
    }

    // Escape key: cancel editing
    if (event.key === 'Escape') {
      event.preventDefault();
      const originalValue = originalValuesRef.current.get(element) || '';
      element.textContent = originalValue;
      element.blur();
    }
  }, []);

  // Focus handler to select all text
  const handleFocus = useCallback((event: FocusEvent) => {
    const element = event.target as HTMLElement;
    if (!element || !editableElementsRef.current.has(element)) return;

    // Select all text when focusing
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  // Enable editing on an element
  const enableEditing = useCallback((element: HTMLElement) => {
    if (editableElementsRef.current.has(element)) return;

    // Store original value
    const originalText = element.textContent || '';
    originalValuesRef.current.set(element, originalText);
    editableElementsRef.current.set(element, originalText);

    // Set up editable attributes
    element.setAttribute('contenteditable', 'true');
    element.style.cursor = 'text';
    element.style.outline = '1px dashed #007bff';
    element.style.outlineOffset = '2px';

    // Add placeholder if empty
    if (!originalText.trim()) {
      element.textContent = placeholder;
      element.style.color = '#9ca3af';
      element.style.fontStyle = 'italic';
    }

    // Add event listeners
    element.addEventListener('input', handleInput);
    element.addEventListener('paste', handlePaste);
    element.addEventListener('keydown', handleKeyDown);
    element.addEventListener('focus', handleFocus);

    // Handle placeholder behavior
    const handleFocusIn = () => {
      if (element.textContent === placeholder) {
        element.textContent = '';
        element.style.color = '';
        element.style.fontStyle = '';
      }
    };

    const handleBlur = () => {
      if (!element.textContent?.trim()) {
        element.textContent = placeholder;
        element.style.color = '#9ca3af';
        element.style.fontStyle = 'italic';
      }
    };

    element.addEventListener('focusin', handleFocusIn);
    element.addEventListener('blur', handleBlur);

    // Store cleanup functions
    (element as any).__editableCleanup = () => {
      element.removeEventListener('input', handleInput);
      element.removeEventListener('paste', handlePaste);
      element.removeEventListener('keydown', handleKeyDown);
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('focusin', handleFocusIn);
      element.removeEventListener('blur', handleBlur);
    };

    console.log('Enabled editing on:', element.tagName, element.textContent?.slice(0, 30));
  }, [handleInput, handlePaste, handleKeyDown, handleFocus, placeholder]);

  // Disable editing on an element
  const disableEditing = useCallback((element: HTMLElement) => {
    if (!editableElementsRef.current.has(element)) return;

    // Clean up
    if ((element as any).__editableCleanup) {
      (element as any).__editableCleanup();
      delete (element as any).__editableCleanup;
    }

    // Remove editable attributes
    element.removeAttribute('contenteditable');
    element.style.cursor = '';
    element.style.outline = '';
    element.style.outlineOffset = '';

    // Remove placeholder if present
    if (element.textContent === placeholder) {
      element.textContent = '';
      element.style.color = '';
      element.style.fontStyle = '';
    }

    // Clean up refs
    editableElementsRef.current.delete(element);
    originalValuesRef.current.delete(element);

    console.log('Disabled editing on:', element.tagName);
  }, [placeholder]);

  // Save all current changes
  const saveChanges = useCallback(() => {
    editableElementsRef.current.forEach((currentText, element) => {
      const originalText = originalValuesRef.current.get(element) || '';
      if (currentText !== originalText) {
        onTextChange?.(currentText, element);
        originalValuesRef.current.set(element, currentText);
      }
    });
  }, [onTextChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      // Clean up all editable elements
      editableElementsRef.current.forEach((_, element) => {
        if ((element as any).__editableCleanup) {
          (element as any).__editableCleanup();
        }
      });
    };
  }, []);

  return {
    enableEditing,
    disableEditing,
    saveChanges
  };
}