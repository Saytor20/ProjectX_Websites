import { useState, useCallback } from 'react';
import { useEditorContext } from '../EditorApp';

interface MediaUploadState {
  isMediaPanelOpen: boolean;
  selectedElement: HTMLElement | null;
  isUploading: boolean;
}

export const useMediaUpload = () => {
  const { state, dispatch, addToHistory } = useEditorContext();
  const [mediaState, setMediaState] = useState<MediaUploadState>({
    isMediaPanelOpen: false,
    selectedElement: null,
    isUploading: false,
  });

  // Open media panel
  const openMediaPanel = useCallback((element?: HTMLElement) => {
    setMediaState(prev => ({
      ...prev,
      isMediaPanelOpen: true,
      selectedElement: element || state.selection.lastSelected || null,
    }));
  }, [state.selection.lastSelected]);

  // Close media panel
  const closeMediaPanel = useCallback(() => {
    setMediaState(prev => ({
      ...prev,
      isMediaPanelOpen: false,
      selectedElement: null,
    }));
  }, []);

  // Check if an element can have its image replaced
  const isImageReplaceableElement = useCallback((element: HTMLElement): boolean => {
    // Direct image elements
    if (element.tagName === 'IMG') {
      return true;
    }

    // Elements that contain images
    const hasImageChild = element.querySelector('img') !== null;
    if (hasImageChild) {
      return true;
    }

    // Elements that can have background images
    const canHaveBackground = [
      'div', 'section', 'header', 'footer', 'article',
      'aside', 'main', 'nav', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ].includes(element.tagName.toLowerCase());

    // Check if element has a background image or can accept one
    const hasBackgroundImage = element.style.backgroundImage && 
      element.style.backgroundImage !== 'none';

    return canHaveBackground || hasBackgroundImage;
  }, []);

  // Get all image-replaceable elements
  const getImageReplaceableElements = useCallback((): HTMLElement[] => {
    const allElements = Array.from(document.querySelectorAll('*')) as HTMLElement[];
    return allElements.filter(isImageReplaceableElement);
  }, [isImageReplaceableElement]);

  // Replace image in element
  const replaceImageInElement = useCallback(async (
    element: HTMLElement, 
    imageUrl: string
  ): Promise<boolean> => {
    try {
      let imageElement: HTMLImageElement | null = null;
      let previousSrc = '';
      let isBackgroundImage = false;

      // Find the image to replace
      if (element.tagName === 'IMG') {
        imageElement = element as HTMLImageElement;
        previousSrc = imageElement.src;
      } else {
        imageElement = element.querySelector('img');
        if (imageElement) {
          previousSrc = imageElement.src;
        } else {
          // Use as background image
          isBackgroundImage = true;
          previousSrc = element.style.backgroundImage;
        }
      }

      // Create history state
      const beforeState = {
        id: `history-${Date.now()}`,
        elementId: element.id || `element-${Date.now()}`,
        beforeState: {
          position: { x: 0, y: 0 },
          size: { width: element.offsetWidth, height: element.offsetHeight },
          rotation: 0,
          styles: isBackgroundImage ? { backgroundImage: previousSrc } : {},
          imageSrc: isBackgroundImage ? undefined : previousSrc,
        },
        afterState: {
          position: { x: 0, y: 0 },
          size: { width: element.offsetWidth, height: element.offsetHeight },
          rotation: 0,
          styles: isBackgroundImage ? { backgroundImage: `url(${imageUrl})` } : {},
          imageSrc: isBackgroundImage ? undefined : imageUrl,
        },
        type: 'image' as const,
        timestamp: Date.now(),
      };

      // Apply the image change
      if (isBackgroundImage) {
        element.style.backgroundImage = `url(${imageUrl})`;
        element.style.backgroundSize = element.style.backgroundSize || 'cover';
        element.style.backgroundPosition = element.style.backgroundPosition || 'center';
        element.style.backgroundRepeat = element.style.backgroundRepeat || 'no-repeat';
      } else if (imageElement) {
        imageElement.src = imageUrl;
        // Add alt text if it doesn't exist
        if (!imageElement.alt) {
          imageElement.alt = 'Uploaded image';
        }
      }

      // Add to history
      addToHistory(beforeState);

      // Dispatch image replace action
      dispatch({
        type: 'REPLACE_IMAGE',
        payload: {
          elementId: element.id || `element-${Date.now()}`,
          previousSrc,
          newSrc: imageUrl,
          timestamp: Date.now(),
        },
      });

      return true;
    } catch (error) {
      console.error('Failed to replace image:', error);
      return false;
    }
  }, [addToHistory, dispatch]);

  // Handle click-to-replace functionality
  const handleElementClick = useCallback((event: MouseEvent) => {
    if (!state.isEditMode) return;

    const target = event.target as HTMLElement;
    
    // Check if Ctrl/Cmd + click for image replacement
    if ((event.ctrlKey || event.metaKey) && isImageReplaceableElement(target)) {
      event.preventDefault();
      event.stopPropagation();
      openMediaPanel(target);
    }
  }, [state.isEditMode, isImageReplaceableElement, openMediaPanel]);

  // Upload file directly
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    setMediaState(prev => ({ ...prev, isUploading: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    } finally {
      setMediaState(prev => ({ ...prev, isUploading: false }));
    }
  }, []);

  // Handle drag and drop image replacement
  const handleImageDrop = useCallback(async (
    event: DragEvent,
    targetElement: HTMLElement
  ) => {
    event.preventDefault();

    if (!state.isEditMode || !isImageReplaceableElement(targetElement)) {
      return;
    }

    const files = Array.from(event.dataTransfer?.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Please drop an image file');
      return;
    }

    const file = imageFiles[0];
    const imageUrl = await uploadFile(file);

    if (imageUrl) {
      await replaceImageInElement(targetElement, imageUrl);
    } else {
      alert('Failed to upload image');
    }
  }, [state.isEditMode, isImageReplaceableElement, uploadFile, replaceImageInElement]);

  // Handle paste image
  const handleImagePaste = useCallback(async (event: ClipboardEvent) => {
    if (!state.isEditMode || !state.selection.lastSelected) {
      return;
    }

    const items = Array.from(event.clipboardData?.items || []);
    const imageItems = items.filter(item => item.type.startsWith('image/'));

    if (imageItems.length === 0) {
      return;
    }

    event.preventDefault();

    const file = imageItems[0].getAsFile();
    if (!file) return;

    const targetElement = state.selection.lastSelected;
    if (!isImageReplaceableElement(targetElement)) {
      return;
    }

    const imageUrl = await uploadFile(file);
    if (imageUrl) {
      await replaceImageInElement(targetElement, imageUrl);
    } else {
      alert('Failed to upload pasted image');
    }
  }, [state.isEditMode, state.selection.lastSelected, isImageReplaceableElement, uploadFile, replaceImageInElement]);

  // Add visual indicators for image-replaceable elements
  const addImageReplaceIndicators = useCallback(() => {
    if (!state.isEditMode) return;

    const imageElements = getImageReplaceableElements();
    imageElements.forEach(element => {
      element.classList.add('image-replaceable');
      const currentTitle = element.title;
      element.title = currentTitle ? 
        `${currentTitle} | Ctrl+Click to replace image` : 
        'Ctrl+Click to replace image';
    });
  }, [state.isEditMode, getImageReplaceableElements]);

  // Remove visual indicators
  const removeImageReplaceIndicators = useCallback(() => {
    const imageElements = document.querySelectorAll('.image-replaceable');
    imageElements.forEach(element => {
      element.classList.remove('image-replaceable');
      const htmlElement = element as HTMLElement;
      if (htmlElement.title?.includes('Ctrl+Click to replace image')) {
        const cleanTitle = htmlElement.title.replace(' | Ctrl+Click to replace image', '');
        htmlElement.title = cleanTitle === 'Ctrl+Click to replace image' ? '' : cleanTitle;
      }
    });
  }, []);

  return {
    mediaState,
    openMediaPanel,
    closeMediaPanel,
    isImageReplaceableElement,
    getImageReplaceableElements,
    replaceImageInElement,
    handleElementClick,
    uploadFile,
    handleImageDrop,
    handleImagePaste,
    addImageReplaceIndicators,
    removeImageReplaceIndicators,
  };
};