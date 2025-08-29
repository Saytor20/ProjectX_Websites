'use client';

import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import Moveable from 'react-moveable';
import Selecto from 'selecto';
import { useEditorHistory } from './history';
import { applyPatchesToDocument, applyPatchesToRoot, applyStylePatch, type StylePatch } from './style-applier';
import { getElementInfo, PropertyPanel, ElementInfo } from './ElementInspector';

interface MoveableEditorProps {
  iframeId?: string;
  shadowRoot?: ShadowRoot;
  skinId: string;
  restaurantId: string;
  activeTool?: 'select' | 'text' | 'color' | 'image' | 'link' | 'shape';
  colorMode?: 'box' | 'font';
  selectedColor?: string;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
}

interface SelectedElement {
  element: HTMLElement;
  editorId: string;
  rect: DOMRect;
  elementInfo?: ElementInfo;
}

export interface MoveableEditorHandle {
  undo: () => void;
  redo: () => void;
  save: () => void;
  getPatches: () => StylePatch[];
  canUndo: () => boolean;
  canRedo: () => boolean;
  applyColor: (color: string, mode: 'box' | 'font') => void;
}

const MoveableEditor = forwardRef<MoveableEditorHandle, MoveableEditorProps>(function MoveableEditor({ iframeId, shadowRoot, skinId, restaurantId, activeTool = 'select', colorMode: propColorMode = 'box', selectedColor: propSelectedColor = '#000000', onHistoryChange }: MoveableEditorProps, ref) {
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [selectedElements, setSelectedElements] = useState<HTMLElement[]>([]); // For multi-select
  const [showPropertyPanel, setShowPropertyPanel] = useState(true);
  const [moveableKey, setMoveableKey] = useState(0); // Force re-render of Moveable
  const moveableRef = useRef<Moveable>(null);
  const selectoRef = useRef<Selecto>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const currentRoot = useRef<Document | ShadowRoot | null>(null);
  const shapeCounter = useRef(0);

  const { patches, undo, redo, addPatch, save, canUndo, canRedo } = useEditorHistory(skinId, restaurantId);

  // Layout adaptor registry mapping editor ID patterns to property writers
  const layoutAdaptors = {
    section: (el: HTMLElement, { width, height }: { width: number; height: number }) => {
      el.style.minHeight = `${height}px`;
      el.style.padding = `${height * 0.1}px ${width * 0.05}px`;
    },
    image: (el: HTMLElement, { width, height }: { width: number; height: number }) => {
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.objectFit = width > height ? 'cover' : 'contain';
    },
    'grid-item': (el: HTMLElement, { width }: { width: number; height: number }) => {
      el.style.setProperty('--grid-basis', `${width}px`);
      el.style.flexBasis = `${width}px`;
    },
    'hero': (el: HTMLElement, { width, height }: { width: number; height: number }) => {
      el.style.minHeight = `${height}px`;
      el.style.width = `${width}px`;
    },
    'button': (el: HTMLElement, { width, height }: { width: number; height: number }) => {
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.minWidth = `${width}px`;
    },
    'navbar': (el: HTMLElement, { width, height }: { width: number; height: number }) => {
      el.style.height = `${height}px`;
      el.style.minHeight = `${height}px`;
    }
  };

  // Apply layout adaptors based on element pattern
  const handleResizeEnd = useCallback((target: HTMLElement, { width, height }: { width: number; height: number }) => {
    const editorId = target.dataset.editorId;
    if (!editorId) return;
    
    // Extract pattern from editor ID (first part before colon)
    const pattern = editorId.split(':')[0];
    const adaptor = layoutAdaptors[pattern as keyof typeof layoutAdaptors];
    
    if (adaptor) {
      adaptor(target, { width, height });
    }
  }, []);

  // Apply color to selected element
  const applyColor = useCallback((color: string, mode: 'box' | 'font') => {
    if (!selectedElement) return;
    
    const { element, editorId } = selectedElement;
    const styleProp = mode === 'box' ? 'background-color' : 'color';
    applyStylePatch(element, { [styleProp]: color });
    addPatch({ id: editorId, styles: { [styleProp]: color } });
  }, [selectedElement, addPatch]);
  
  // Expose imperative API to parent (header buttons)
  useImperativeHandle(ref, () => ({
    undo,
    redo,
    save,
    getPatches: () => patches,
    canUndo: () => canUndo,
    canRedo: () => canRedo,
    applyColor,
  }), [undo, redo, save, patches, canUndo, canRedo, applyColor]);

  // Get iframe reference (keep this simple)
  useEffect(() => {
    if (iframeId) {
      iframeRef.current = document.getElementById(iframeId) as HTMLIFrameElement;
    }
  }, [iframeId]);

  // Apply patches to current root (handled in event listener setup now)
  // Removed duplicate effect to prevent conflicts

  // Notify parent about undo/redo ability changes
  useEffect(() => {
    onHistoryChange?.(canUndo, canRedo);
  }, [canUndo, canRedo, onHistoryChange]);

  // Handle click events in iframe or shadow root based on active tool
  const handleElementClick = useCallback((event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    if (!target) return;
    
    event.preventDefault();
    // Allow editor clicks to pass through - removed stopPropagation()
    
    // Handle different tools
    if (activeTool === 'text') {
      // Text tool - make text editable
      const tagName = target.tagName.toLowerCase();
      if (['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'label', 'a', 'button'].includes(tagName) ||
          (target.textContent?.trim() && target.children.length === 0)) {
        target.contentEditable = 'true';
        target.focus();
        
        const handleBlur = () => {
          target.contentEditable = 'false';
          target.removeEventListener('blur', handleBlur);
        };
        target.addEventListener('blur', handleBlur);
      }
      return;
    }
    
    if (activeTool === 'image' && target.tagName.toLowerCase() === 'img') {
      // Image tool - prompt for new URL
      const newSrc = prompt('Enter new image URL:', (target as HTMLImageElement).src);
      if (newSrc) {
        (target as HTMLImageElement).src = newSrc;
      }
      return;
    }
    
    if (activeTool === 'link' && target.tagName.toLowerCase() === 'a') {
      // Link tool - edit href
      const newHref = prompt('Enter new link URL:', (target as HTMLAnchorElement).href);
      if (newHref) {
        (target as HTMLAnchorElement).href = newHref;
      }
      return;
    }
    
    if (activeTool === 'shape') {
      // Shape tool handled separately with popup
      return;
    }
    
    // For select tool and other cases, do element selection
    if (activeTool === 'select' || activeTool === 'color') {
      let selectedEl = target;
      let editorId: string | null = null;
      
      // First, try to find element with data-editor-id (shapes and components)
      const elementWithId = target.closest('[data-editor-id]') as HTMLElement;
      if (elementWithId) {
        selectedEl = elementWithId;
        editorId = elementWithId.getAttribute('data-editor-id');
      } else {
        // For elements without data-editor-id, create a temporary one
        const tagName = target.tagName.toLowerCase();
        const isDirectSelectable = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                                    'img', 'a', 'button', 'li', 'label', 'div'].includes(tagName);
        
        if (isDirectSelectable) {
          // Generate unique ID for this element
          const timestamp = Date.now();
          editorId = `temp-${tagName}-${timestamp}`;
          target.setAttribute('data-editor-id', editorId);
          selectedEl = target;
        } else {
          console.warn('Element not selectable:', tagName, target);
          return;
        }
      }
      
      if (!editorId || !selectedEl) {
        console.warn('Could not determine editor ID for element');
        return;
      }

      // Validate element is still in DOM and has dimensions
      if (!selectedEl.isConnected) {
        console.warn('Selected element is not connected to DOM');
        return;
      }

      const rect = selectedEl.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        console.warn('Selected element has zero dimensions');
        // Don't return - still allow selection for zero-dimension elements
      }
      
      const rootWindow = shadowRoot ? shadowRoot.ownerDocument!.defaultView : 
        (iframeRef.current?.contentWindow || window);
      
      // Get element info for property panel
      const elementInfo = getElementInfo(selectedEl, rootWindow!);
      
      console.log('✅ Selected element:', editorId, selectedEl.tagName, {
        width: rect.width,
        height: rect.height,
        isConnected: selectedEl.isConnected
      });
      
      setSelectedElement({
        element: selectedEl,
        editorId,
        rect,
        elementInfo
      });
      
      // Force Moveable to re-render with new target
      setMoveableKey(prev => prev + 1);

    }
  }, [shadowRoot, activeTool, addPatch]);

  // Set up event listeners with proper iframe load handling
  useEffect(() => {
    if (!iframeId) return undefined;
    
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (!iframe) return undefined;
    
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 10;
    
    const attachListeners = () => {
      if (!mounted) return;
      
      try {
        const iframeDoc = iframe.contentDocument || (iframe.contentWindow as any)?.document;
        
        if (!iframeDoc) {
          // Retry if document not ready
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(attachListeners, 100);
          }
          return;
        }
        
        // Success - document is accessible
        console.log('✅ Attaching event listeners to iframe document');
        currentRoot.current = iframeDoc;
        
        // Add a small delay to let the iframe fully settle
        setTimeout(() => {
          if (!mounted) return;
          
          // Remove any existing listener
          iframeDoc.removeEventListener('click', handleElementClick);
          // Add new listener
          iframeDoc.addEventListener('click', handleElementClick);
          
          // Initialize Selecto targeting the iframe document with multi-select support
          if (selectoRef.current) {
            selectoRef.current.destroy();
          }
          
          const selecto = new Selecto({
            container: iframeDoc.body,
            selectableTargets: ["[data-editor-id]"],
            hitRate: 0,
            selectByClick: true,
            selectFromInside: false,
            ratio: 0,
            dragCondition: (e: any) => {
              // Only allow drag selection, not for moving elements
              return !e.inputEvent?.target?.closest('[data-editor-id]') || e.inputEvent?.shiftKey;
            }
          });
          
          // Handle Selecto events
          selecto.on("selectEnd", (e) => {
            const targets = e.selected.length ? e.selected : 
              (e.inputEvent?.target?.closest('[data-editor-id]') ? [e.inputEvent.target.closest('[data-editor-id]')] : []);
            
            if (targets.length > 0) {
              setSelectedElements(targets);
              
              // Update Moveable targets
              if (moveableRef.current) {
                moveableRef.current.target = targets;
              }
              
              // For single selection, also set selectedElement for compatibility
              if (targets.length === 1) {
                const target = targets[0] as HTMLElement;
                const editorId = target.getAttribute('data-editor-id') || '';
                const rect = target.getBoundingClientRect();
                const rootWindow = iframeDoc.defaultView || window;
                const elementInfo = getElementInfo(target, rootWindow);
                
                setSelectedElement({
                  element: target,
                  editorId,
                  rect,
                  elementInfo
                });
              } else {
                setSelectedElement(null);
              }
              
              // Force Moveable to re-render
              setMoveableKey(prev => prev + 1);
            }
          });
          
          selectoRef.current = selecto;
          
          // Create shapes container if it doesn't exist
          if (!iframeDoc.getElementById('editor-shapes-container')) {
            const shapesContainer = iframeDoc.createElement('div');
            shapesContainer.id = 'editor-shapes-container';
            shapesContainer.style.position = 'relative';
            shapesContainer.style.zIndex = '1000';
            shapesContainer.style.pointerEvents = 'none';
            iframeDoc.body.appendChild(shapesContainer);
          }
          
          // Also ensure patches are applied
          if (patches.length > 0 && iframeDoc instanceof Document) {
            applyPatchesToRoot(patches, iframeDoc);
          }
        }, 300); // Wait 300ms for iframe to be fully ready
      } catch (error) {
        console.warn('Failed to attach listeners:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(attachListeners, 100);
        }
      }
    };
    
    // Attach timing helper: attach listeners after load and requestAnimationFrame "settle" tick
    const attachWithProperTiming = () => {
      requestAnimationFrame(() => {
        // DOM settled, safe to attach
        attachListeners();
      });
    };
    
    // Attach listeners when iframe loads
    const handleLoad = () => {
      retryCount = 0;
      attachWithProperTiming();
    };
    
    iframe.addEventListener('load', handleLoad);
    
    // Also try immediately in case iframe is already loaded
    if (iframe.contentDocument?.readyState === 'complete' || 
        iframe.contentDocument?.readyState === 'interactive') {
      attachWithProperTiming();
    } else {
      // Start polling for document availability
      attachWithProperTiming();
    }
    
    return () => {
      mounted = false;
      iframe.removeEventListener('load', handleLoad);
      if (currentRoot.current instanceof Document) {
        currentRoot.current.removeEventListener('click', handleElementClick);
      }
      if (selectoRef.current) {
        selectoRef.current.destroy();
        selectoRef.current = null;
      }
    };
  }, [iframeId, handleElementClick, activeTool, patches]);

  // Handle drag/transform
  const handleDrag = useCallback(({ target, transform }: any) => {
    const targets = Array.isArray(target) ? target : [target];
    targets.forEach((t: HTMLElement) => {
      if (t && t.style && t instanceof HTMLElement) {
        t.style.transform = transform;
      }
    });
  }, []);

  // Handle resize
  const handleResize = useCallback(({ target, width, height, drag }: any) => {
    const targets = Array.isArray(target) ? target : [target];
    targets.forEach((t: HTMLElement) => {
      if (t && t.style && t instanceof HTMLElement) {
        t.style.width = `${width}px`;
        t.style.height = `${height}px`;
        t.style.transform = drag.transform;
        
        // Apply layout adaptor immediately
        handleResizeEnd(t, { width, height });
      }
    });
  }, [handleResizeEnd]);

  // Handle drag/resize end - save to history
  const handleActionEnd = useCallback(() => {
    const elementsToSave = selectedElements.length > 0 ? selectedElements : (selectedElement ? [selectedElement.element] : []);
    
    elementsToSave.forEach((element: HTMLElement) => {
      const editorId = element.getAttribute('data-editor-id') || '';
      const styles: Record<string, string> = {};

      // Capture current styles
      if (element.style.transform) {
        styles.transform = element.style.transform;
      }
      if (element.style.width) {
        styles.width = element.style.width;
      }
      if (element.style.height) {
        styles.height = element.style.height;
      }

      if (Object.keys(styles).length > 0 && editorId) {
        addPatch({ id: editorId, styles });
      }
    });
  }, [selectedElement, selectedElements, addPatch]);

  
  // Handle property changes from property panel
  const handlePropertyChange = useCallback((property: string, value: string) => {
    if (!selectedElement) return;
    
    const { element, editorId } = selectedElement;
    
    if (property === 'text') {
      element.textContent = value;
      // Note: Text changes aren't persisted via CSS, need different approach
    } else if (property === 'href' && element instanceof HTMLAnchorElement) {
      element.href = value;
    } else if (property === 'src' && element instanceof HTMLImageElement) {
      element.src = value;
    } else {
      // CSS properties
      applyStylePatch(element, { [property]: value });
      addPatch({ id: editorId, styles: { [property]: value } });
    }
    
    // Update element info
    const rootWindow = shadowRoot ? shadowRoot.ownerDocument!.defaultView : 
      (iframeRef.current?.contentWindow || window);
    const elementInfo = getElementInfo(element, rootWindow!);
    setSelectedElement(prev => prev ? { ...prev, elementInfo } : null);
  }, [selectedElement, addPatch, shadowRoot]);


  // Check if iframe is ready
  const isIframeReady = iframeRef.current?.contentDocument != null;
  
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {/* Toolbar removed; actions controlled from page header */}
      
      {/* Show warning if iframe not ready */}
      {!isIframeReady && activeTool !== 'select' && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg pointer-events-auto">
          ⚠️ Editor loading... Please wait
        </div>
      )}


      {/* Shape Tools Popup */}
      {activeTool === 'shape' && (
        <div style={{
          position: 'fixed',
          top: '120px',
          right: '20px',
          background: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 1001
        }}>
          <button
            onClick={() => {
              if (iframeRef.current?.contentDocument) {
                const doc = iframeRef.current.contentDocument;
                let container = doc.getElementById('editor-shapes-container');
                
                // Create container if it doesn't exist
                if (!container) {
                  container = doc.createElement('div');
                  container.id = 'editor-shapes-container';
                  container.style.position = 'relative';
                  container.style.zIndex = '1000';
                  container.style.pointerEvents = 'none';
                  doc.body.appendChild(container);
                }
                
                const shape = doc.createElement('div');
                shape.setAttribute('data-editor-id', `shape-${++shapeCounter.current}`);
                shape.style.position = 'absolute';
                shape.style.top = '100px';
                shape.style.left = '100px';
                shape.style.width = '100px';
                shape.style.height = '60px';
                shape.style.backgroundColor = '#3b82f6';
                shape.style.borderRadius = '4px';
                shape.style.zIndex = '1001';
                shape.style.cursor = 'move';
                shape.style.pointerEvents = 'auto';
                container.appendChild(shape);
                console.log(`✅ Added rectangle with id: shape-${shapeCounter.current}`);
              }
            }}
            style={{
              padding: '8px 12px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ▭ Rectangle
          </button>
          <button
            onClick={() => {
              if (iframeRef.current?.contentDocument) {
                const doc = iframeRef.current.contentDocument;
                let container = doc.getElementById('editor-shapes-container');
                
                // Create container if it doesn't exist
                if (!container) {
                  container = doc.createElement('div');
                  container.id = 'editor-shapes-container';
                  container.style.position = 'relative';
                  container.style.zIndex = '1000';
                  container.style.pointerEvents = 'none';
                  doc.body.appendChild(container);
                }
                
                const shape = doc.createElement('div');
                shape.setAttribute('data-editor-id', `shape-${++shapeCounter.current}`);
                shape.style.position = 'absolute';
                shape.style.top = '100px';
                shape.style.left = '100px';
                shape.style.width = '80px';
                shape.style.height = '80px';
                shape.style.backgroundColor = '#3b82f6';
                shape.style.borderRadius = '50%';
                shape.style.zIndex = '1001';
                shape.style.cursor = 'move';
                shape.style.pointerEvents = 'auto';
                container.appendChild(shape);
                console.log(`✅ Added circle with id: shape-${shapeCounter.current}`);
              }
            }}
            style={{
              padding: '8px 12px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ● Circle
          </button>
        </div>
      )}

      {/* Moveable Component - render into iframe's DOM */}
      {selectedElement && activeTool === 'select' && isIframeReady && (() => {
        const iframeDoc = iframeRef.current?.contentDocument;
        if (!iframeDoc) return null;
        
        const target = iframeDoc.querySelector(`[data-editor-id="${selectedElement.editorId}"]`) as HTMLElement;
        const container = iframeDoc.body;
        
        // Use iframe's global for instanceof, or fallback to nodeType check
        const win = iframeRef.current?.contentWindow as any;
        const isElem = !!target && (target.nodeType === 1 || (win && target instanceof win.HTMLElement));
        
        if (!target || !container || !isElem || !target.isConnected) {
          console.warn('Moveable target not valid:', {
            hasTarget: !!target,
            hasContainer: !!container,
            isElement: isElem,
            isConnected: target?.isConnected
          });
          return null;
        }
        
        // Double-check target has proper dimensions
        const rect = target.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          console.warn('Target has zero dimensions, skipping Moveable');
          return null;
        }
        
        console.log('✅ Rendering Moveable for:', selectedElement.editorId, target);
        
        try {
          // Get all elements with data-editor-id for snapping guidelines
          const allEditableElements = Array.from(iframeDoc.querySelectorAll("[data-editor-id]")) as HTMLElement[];
          
          return (
            <Moveable
              key={moveableKey}
              ref={moveableRef}
              target={selectedElements.length > 1 ? selectedElements : target}
              container={container}
              rootContainer={container}        // ← render + event roots inside iframe
              portalContainer={container}      // ← portal inside iframe
              draggable={true}
              resizable={true}
              snappable={true}
              elementGuidelines={allEditableElements}
              scrollable={true}
              snapThreshold={5}
              elementSnapDirections={{ top: true, left: true, bottom: true, right: true }}
              keepRatio={false}
              throttleDrag={0}
              throttleResize={0}
              renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
              onDrag={handleDrag}
              onResize={handleResize}
              onDragEnd={handleActionEnd}
              onResizeEnd={handleActionEnd}
              bounds={{"left":0,"top":0,"right":container.scrollWidth || 1200,"bottom":container.scrollHeight || 800}}
              edge={false}
              origin={false}
              padding={{"left":0,"top":0,"right":0,"bottom":0}}
            />
          );
        } catch (error) {
          console.error('Failed to render Moveable:', error);
          return (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg pointer-events-auto">
              ❌ Selection failed. Try clicking a different element.
            </div>
          );
        }
      })()}

      {/* Selection Info - only show for select tool */}
      {selectedElement && activeTool === 'select' && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-sm pointer-events-auto">
          Selected: {selectedElement.editorId}
          <br />
          Tag: {selectedElement.element.tagName.toLowerCase()}
          <br />
          Type: {selectedElement.elementInfo?.type || 'unknown'}
          <br />
          Size: {Math.round(selectedElement.rect.width)} × {Math.round(selectedElement.rect.height)}
        </div>
      )}
      
      {/* Property Panel for context-aware editing - only for select tool */}
      {showPropertyPanel && activeTool === 'select' && selectedElement && (
        <PropertyPanel 
          elementInfo={selectedElement.elementInfo || null}
          onPropertyChange={handlePropertyChange}
        />
      )}
    </div>
  );
});

export default MoveableEditor;
