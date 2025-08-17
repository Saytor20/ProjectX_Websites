'use client';

import React, { useEffect, useReducer, useRef, createContext, useContext } from 'react';
import { EditorContext, EditorState, EditorAction, HistoryState } from './types';
import { getFeatureFlags } from '../lib/feature-flags';
import { EditorToolbar } from './components/EditorToolbar';
import { EditorInspector } from './components/EditorInspector';
import { useMoveable } from './hooks/useMoveable';
import { useSelecto } from './hooks/useSelecto';
import { useGuides } from './hooks/useGuides';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTextEditor } from './hooks/useTextEditor';
import { useMediaUpload } from './hooks/useMediaUpload';
import { useBackgrounds } from './hooks/useBackgrounds';
import { InlineTextEditor } from './components/InlineTextEditor';
// import { MediaPanel } from './components/MediaPanel'; // Temporarily commented out for build test
import { BackgroundPicker } from './components/BackgroundPicker';
import { ThemeSwitcher } from './components/ThemeSwitcher';

const initialState: EditorState = {
  selection: { elements: [] },
  isEditMode: false,
  showGuides: true,
  showGrid: false,
  history: {
    states: [],
    currentIndex: -1,
    maxStates: 50
  },
  textEditing: {
    isEditing: false,
    element: null
  },
  theming: {
    currentTheme: 'cafert-modern',
    availableThemes: [],
    isCustomizing: false,
    customTokens: {},
    previewMode: false,
    isDarkMode: false,
    responsivePreview: 'desktop',
    isThemeSwitcherOpen: false,
    isThemeCustomizerOpen: false
  }
};

const EditorContextInstance = createContext<EditorContext | null>(null);

export const useEditorContext = () => {
  const context = useContext(EditorContextInstance);
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider');
  }
  return context;
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_SELECTION':
      return {
        ...state,
        selection: {
          elements: action.payload,
          lastSelected: action.payload[action.payload.length - 1]
        }
      };
    
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selection: { elements: [] }
      };
    
    case 'TOGGLE_EDIT_MODE':
      return {
        ...state,
        isEditMode: !state.isEditMode
      };
    
    case 'TOGGLE_GUIDES':
      return {
        ...state,
        showGuides: !state.showGuides
      };
    
    case 'TOGGLE_GRID':
      return {
        ...state,
        showGrid: !state.showGrid
      };
    
    case 'ADD_HISTORY':
      const newStates = state.history.states.slice(0, state.history.currentIndex + 1);
      newStates.push(action.payload);
      
      if (newStates.length > state.history.maxStates) {
        newStates.shift();
      }
      
      return {
        ...state,
        history: {
          ...state.history,
          states: newStates,
          currentIndex: newStates.length - 1
        }
      };
    
    case 'UNDO':
      if (state.history.currentIndex > 0) {
        return {
          ...state,
          history: {
            ...state.history,
            currentIndex: state.history.currentIndex - 1
          }
        };
      }
      return state;
    
    case 'REDO':
      if (state.history.currentIndex < state.history.states.length - 1) {
        return {
          ...state,
          history: {
            ...state.history,
            currentIndex: state.history.currentIndex + 1
          }
        };
      }
      return state;
    
    case 'START_TEXT_EDIT':
      return {
        ...state,
        textEditing: {
          isEditing: true,
          element: action.payload
        }
      };
    
    case 'END_TEXT_EDIT':
      return {
        ...state,
        textEditing: {
          isEditing: false,
          element: null
        }
      };
    
    case 'UPDATE_CONTENT':
      // Content updates are handled in the text editor component
      return state;
    
    case 'REPLACE_IMAGE':
      // Image updates will be handled in the media panel component
      return state;
    
    // Phase 3: Theme actions
    case 'SET_THEME':
      return {
        ...state,
        theming: {
          ...state.theming,
          currentTheme: action.payload.themeId,
          previewMode: false
        }
      };
    
    case 'UPDATE_THEME_TOKENS':
      return {
        ...state,
        theming: {
          ...state.theming,
          customTokens: {
            ...state.theming.customTokens,
            [action.payload.category]: {
              ...state.theming.customTokens[action.payload.category],
              [action.payload.key]: action.payload.value
            }
          }
        }
      };
    
    case 'RESET_THEME':
      return {
        ...state,
        theming: {
          ...state.theming,
          currentTheme: action.payload,
          customTokens: {},
          isCustomizing: false,
          previewMode: false
        }
      };
    
    case 'START_THEME_CUSTOMIZATION':
      return {
        ...state,
        theming: {
          ...state.theming,
          isCustomizing: true,
          isThemeCustomizerOpen: true
        }
      };
    
    case 'END_THEME_CUSTOMIZATION':
      return {
        ...state,
        theming: {
          ...state.theming,
          isCustomizing: false,
          isThemeCustomizerOpen: false
        }
      };
    
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        theming: {
          ...state.theming,
          isDarkMode: !state.theming.isDarkMode
        }
      };
    
    case 'SET_RESPONSIVE_PREVIEW':
      return {
        ...state,
        theming: {
          ...state.theming,
          responsivePreview: action.payload
        }
      };
    
    case 'TOGGLE_THEME_SWITCHER':
      return {
        ...state,
        theming: {
          ...state.theming,
          isThemeSwitcherOpen: !state.theming.isThemeSwitcherOpen
        }
      };
    
    case 'TOGGLE_THEME_CUSTOMIZER':
      return {
        ...state,
        theming: {
          ...state.theming,
          isThemeCustomizerOpen: !state.theming.isThemeCustomizerOpen
        }
      };
    
    case 'SET_AVAILABLE_THEMES':
      return {
        ...state,
        theming: {
          ...state.theming,
          availableThemes: action.payload
        }
      };
    
    case 'SAVE_CUSTOM_THEME':
    case 'DELETE_CUSTOM_THEME':
      // These will trigger a refresh of available themes
      return state;
    
    default:
      return state;
  }
}

interface EditorAppProps {
  className?: string;
}

export const EditorApp: React.FC<EditorAppProps> = ({ className = '' }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const containerRef = useRef<HTMLDivElement>(null);
  const featureFlags = getFeatureFlags();

  // Only render if visual editor v2 is enabled
  if (!featureFlags.VISUAL_EDITOR_V2) {
    return null;
  }

  const selectElements = (elements: HTMLElement[]) => {
    dispatch({ type: 'SET_SELECTION', payload: elements });
  };

  const clearSelection = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
    const currentState = state.history.states[state.history.currentIndex - 1];
    if (currentState) {
      applyHistoryState(currentState, 'undo');
    }
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
    const currentState = state.history.states[state.history.currentIndex + 1];
    if (currentState) {
      applyHistoryState(currentState, 'redo');
    }
  };

  const addToHistory = (historyState: HistoryState) => {
    dispatch({ type: 'ADD_HISTORY', payload: historyState });
  };

  const applyHistoryState = (historyState: HistoryState, direction: 'undo' | 'redo') => {
    const element = document.getElementById(historyState.elementId);
    if (element) {
      const targetState = direction === 'undo' ? historyState.beforeState : historyState.afterState;
      
      // Apply position
      element.style.transform = `translate(${targetState.position.x}px, ${targetState.position.y}px) rotate(${targetState.rotation}deg)`;
      
      // Apply size
      element.style.width = `${targetState.size.width}px`;
      element.style.height = `${targetState.size.height}px`;
      
      // Apply other styles
      Object.entries(targetState.styles).forEach(([property, value]) => {
        (element.style as any)[property] = value;
      });
    }
  };

  const editorContext: EditorContext = {
    state,
    dispatch,
    selectElements,
    clearSelection,
    undo,
    redo,
    addToHistory
  };

  // Initialize interaction hooks
  const { moveableRef } = useMoveable(state.selection.elements, editorContext);
  const { selectoRef } = useSelecto(containerRef, editorContext);
  const { guidesRef } = useGuides(state.showGuides);
  
  // Initialize text editing
  const { textEditingState, endTextEditing } = useTextEditor();
  
  // Initialize media upload
  const { 
    mediaState, 
    // closeMediaPanel, // Temporarily commented out for build test 
    replaceImageInElement,
    addImageReplaceIndicators,
    removeImageReplaceIndicators 
  } = useMediaUpload();
  
  // Initialize backgrounds
  const { 
    backgroundState, 
    closeBackgroundPicker,
    addBackgroundIndicators,
    removeBackgroundIndicators 
  } = useBackgrounds();
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts(editorContext);

  useEffect(() => {
    // Add global editor class to body for styling
    if (state.isEditMode) {
      document.body.classList.add('editor-active');
      addImageReplaceIndicators();
      addBackgroundIndicators();
    } else {
      document.body.classList.remove('editor-active');
      removeImageReplaceIndicators();
      removeBackgroundIndicators();
    }

    return () => {
      document.body.classList.remove('editor-active');
      removeImageReplaceIndicators();
      removeBackgroundIndicators();
    };
  }, [
    state.isEditMode,
    addImageReplaceIndicators,
    removeImageReplaceIndicators,
    addBackgroundIndicators,
    removeBackgroundIndicators
  ]);

  return (
    <EditorContextInstance.Provider value={editorContext}>
      <div 
        ref={containerRef}
        className={`editor-app ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: state.isEditMode ? 'auto' : 'none',
          zIndex: 9999
        }}
      >
        {/* Grid overlay */}
        {state.showGrid && (
          <div 
            className="editor-grid"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Guides container */}
        <div ref={guidesRef} className="editor-guides" />

        {/* Selecto container */}
        <div ref={selectoRef} />

        {/* Moveable container */}
        <div ref={moveableRef} />

        {/* Toolbar */}
        <EditorToolbar />

        {/* Inspector Panel */}
        {state.selection.elements.length > 0 && (
          <EditorInspector />
        )}

        {/* Text Editor */}
        {textEditingState.isEditing && textEditingState.editingElement && (
          <InlineTextEditor
            element={textEditingState.editingElement}
            onClose={endTextEditing}
          />
        )}

        {/* Media Panel */}
        {/* <MediaPanel
          isOpen={mediaState.isMediaPanelOpen}
          onClose={closeMediaPanel}
          selectedElement={mediaState.selectedElement}
          onImageSelect={(imageUrl) => {
            if (mediaState.selectedElement) {
              replaceImageInElement(mediaState.selectedElement, imageUrl);
            }
          }}
        /> */}

        {/* Background Picker */}
        <BackgroundPicker
          isOpen={backgroundState.isBackgroundPickerOpen}
          onClose={closeBackgroundPicker}
          selectedElement={backgroundState.selectedElement}
        />

        {/* Theme Switcher */}
        <ThemeSwitcher
          isOpen={state.theming.isThemeSwitcherOpen}
          onClose={() => dispatch({ type: 'TOGGLE_THEME_SWITCHER' })}
          currentTheme={state.theming.currentTheme}
          onThemeChange={(themeId) => {
            dispatch({ 
              type: 'SET_THEME', 
              payload: { 
                type: 'switch',
                themeId,
                timestamp: Date.now()
              } 
            });
          }}
        />
      </div>
    </EditorContextInstance.Provider>
  );
};