'use client';

import React, { useState } from 'react';
import { useEditorContext } from '../EditorApp';
import { useMediaUpload } from '../hooks/useMediaUpload';
import { useBackgrounds } from '../hooks/useBackgrounds';
import { useThemes } from '../hooks/useThemes';
import { useThemeHistory } from '../hooks/useThemeHistory';
import { useDynamicThemeComponents } from '../hooks/useDynamicThemeComponents';
import type { TokenSchema, ThemeCustomization, TokenUpdate } from '../types/theme';

export const EditorToolbar: React.FC = () => {
  const { state, dispatch, undo, redo, clearSelection } = useEditorContext();
  const { openMediaPanel } = useMediaUpload();
  const { openBackgroundPicker } = useBackgrounds();
  const { 
    themes, 
    currentTheme, 
    switchTheme, 
    isPreviewMode, 
    previewTheme, 
    endPreview,
    saveCustomTheme,
    exportTheme 
  } = useThemes();
  
  const {
    addThemeChangeToHistory,
    addTokenUpdateToHistory,
    addCustomizationToHistory,
    undoThemeOperation,
    redoThemeOperation,
    canUndo: canUndoTheme,
    canRedo: canRedoTheme,
    themeHistoryLength
  } = useThemeHistory();
  
  const {
    loadComponent,
    getBundleInfo,
    ThemeSwitcher,
    ThemeCustomizer,
    TokenEditor,
    ThemeExporter,
    DarkModeGenerator,
    isComponentLoaded
  } = useDynamicThemeComponents();

  // Phase 3 Theme Controls State
  const [activeThemePanel, setActiveThemePanel] = useState<
    'gallery' | 'customizer' | 'tokens' | 'exporter' | 'darkmode' | null
  >(null);
  const [currentTokens, setCurrentTokens] = useState<TokenSchema>({
    colors: {},
    fonts: {},
    spacing: {},
    typography: {
      scale: 1.25,
      lineHeight: { tight: '1.2', normal: '1.5', relaxed: '1.75', loose: '2' },
      fontWeight: { thin: '100', light: '300', normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800', black: '900' },
      letterSpacing: { tight: '-0.025em', normal: '0', wide: '0.025em', wider: '0.05em', widest: '0.1em' },
      headings: { h1: '2.5rem', h2: '2rem', h3: '1.5rem', h4: '1.25rem', h5: '1.125rem', h6: '1rem' },
      body: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' }
    },
    shadows: {},
    borders: { radius: { none: '0', xs: '0.125rem', sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem', '2xl': '1rem', '3xl': '1.5rem', full: '50%' }, width: { none: '0', thin: '1px', medium: '2px', thick: '4px', '2': '2px', '4': '4px', '8': '8px' }, style: { solid: 'solid', dashed: 'dashed', dotted: 'dotted', double: 'double', groove: 'groove', ridge: 'ridge' } },
    layout: { maxWidth: { xs: '20rem', sm: '24rem', md: '28rem', lg: '32rem', xl: '36rem', '2xl': '42rem', '3xl': '48rem', '4xl': '56rem', '5xl': '64rem', '6xl': '72rem', '7xl': '80rem', full: '100%' }, breakpoints: { xs: '475px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' }, zIndex: { auto: 'auto', behind: '-1', base: '0', docked: '10', dropdown: '1000', sticky: '1100', banner: '1200', overlay: '1300', modal: '1400', popover: '1500', skipLink: '1600', toast: '1700', tooltip: '1800' }, container: { padding: '1rem', maxWidth: '1200px', center: true } },
    animations: { duration: { fast: '150ms', normal: '300ms', slow: '500ms', slower: '1000ms' }, easing: { linear: 'linear', ease: 'ease', easeIn: 'ease-in', easeOut: 'ease-out', easeInOut: 'ease-in-out', bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }, keyframes: { fadeIn: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }', fadeOut: '@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }', slideIn: '@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }', slideOut: '@keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(-100%); } }', pulse: '@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }', bounce: '@keyframes bounce { 0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); } 40%, 43% { transform: translate3d(0,-30px,0); } 70% { transform: translate3d(0,-15px,0); } 90% { transform: translate3d(0,-4px,0); } }', spin: '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }' } },
    semantic: { text: { primary: '#1a1a1a', secondary: '#4a4a4a', muted: '#9ca3af', inverse: '#ffffff', success: '#059669', warning: '#d97706', error: '#dc2626', info: '#2563eb' }, background: { primary: '#ffffff', secondary: '#f9fafb', tertiary: '#f3f4f6', surface: '#ffffff', overlay: 'rgba(0, 0, 0, 0.5)', success: '#ecfdf5', warning: '#fffbeb', error: '#fef2f2', info: '#eff6ff' }, border: { primary: '#d1d5db', secondary: '#e5e7eb', muted: '#f3f4f6', inverse: '#374151', success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' }, interactive: { default: '#6b7280', hover: '#4b5563', active: '#374151', focus: '#2563eb', disabled: '#9ca3af', selected: '#2563eb' } }
  });
  
  // Load current theme tokens on theme change
  React.useEffect(() => {
    const loadThemeTokens = async () => {
      try {
        const response = await fetch(`/skins/${currentTheme}/tokens.json`);
        if (response.ok) {
          const tokens = await response.json();
          setCurrentTokens(tokens);
        }
      } catch (error) {
        console.error('Failed to load theme tokens:', error);
      }
    };
    
    if (currentTheme) {
      loadThemeTokens();
    }
  }, [currentTheme]);

  const canUndo = state.history.currentIndex > 0;
  const canRedo = state.history.currentIndex < state.history.states.length - 1;
  
  // Enhanced undo/redo that handles theme operations
  const handleUndo = async () => {
    const success = await undoThemeOperation();
    if (!success) {
      // Fallback to regular undo if theme undo fails
      undo();
    }
  };
  
  const handleRedo = async () => {
    const success = await redoThemeOperation();
    if (!success) {
      // Fallback to regular redo if theme redo fails
      redo();
    }
  };
  
  // Enhanced theme switching with history tracking
  const handleThemeSwitch = async (newThemeId: string) => {
    const oldThemeId = currentTheme;
    
    try {
      await switchTheme(newThemeId);
      
      // Add theme change to history
      addThemeChangeToHistory(oldThemeId, newThemeId, 'switch');
    } catch (error) {
      console.error('Failed to switch theme:', error);
    }
  };

  const toolbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    zIndex: 10001,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    pointerEvents: 'auto',
  };

  const buttonStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const buttonHoverStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  const separatorStyle: React.CSSProperties = {
    width: '1px',
    height: '20px',
    background: 'rgba(255, 255, 255, 0.3)',
  };

  const statusStyle: React.CSSProperties = {
    fontSize: '11px',
    opacity: 0.8,
  };

  return (
    <div style={toolbarStyle}>
      {/* Edit Mode Toggle */}
      <button
        style={state.isEditMode ? { ...buttonStyle, background: '#007acc' } : buttonStyle}
        onClick={() => dispatch({ type: 'TOGGLE_EDIT_MODE' })}
        title="Toggle Edit Mode (Alt+E)"
      >
        {state.isEditMode ? '✏️ Editing' : '👁️ Preview'}
      </button>

      <div style={separatorStyle} />

      {/* Enhanced Undo/Redo with Theme Support */}
      <button
        style={canUndo ? buttonStyle : disabledButtonStyle}
        onClick={handleUndo}
        disabled={!canUndo}
        title={`Undo (Cmd/Ctrl+Z) - ${themeHistoryLength} theme changes`}
      >
        ↶ Undo
      </button>

      <button
        style={canRedo ? buttonStyle : disabledButtonStyle}
        onClick={handleRedo}
        disabled={!canRedo}
        title="Redo (Cmd/Ctrl+Shift+Z)"
      >
        ↷ Redo
      </button>

      <div style={separatorStyle} />

      {/* View Options */}
      <button
        style={state.showGrid ? { ...buttonStyle, background: '#28a745' } : buttonStyle}
        onClick={() => dispatch({ type: 'TOGGLE_GRID' })}
        title="Toggle Grid (Alt+G)"
      >
        ⊞ Grid
      </button>

      <button
        style={state.showGuides ? { ...buttonStyle, background: '#28a745' } : buttonStyle}
        onClick={() => dispatch({ type: 'TOGGLE_GUIDES' })}
        title="Toggle Guides (Alt+R)"
      >
        📏 Guides
      </button>

      <div style={separatorStyle} />

      {/* Phase 2 Tools */}
      {state.isEditMode && (
        <>
          <button
            style={buttonStyle}
            onClick={() => openMediaPanel()}
            title="Open Media Panel (Ctrl+Shift+M)"
          >
            📷 Media
          </button>

          <button
            style={buttonStyle}
            onClick={() => openBackgroundPicker()}
            title="Background Picker (Ctrl+B)"
          >
            🎨 Background
          </button>

          <div style={separatorStyle} />
        </>
      )}

      {/* Phase 3 Theme Tools */}
      {state.isEditMode && (
        <>
          <button
            style={activeThemePanel === 'gallery' ? { ...buttonStyle, background: '#7c3aed' } : buttonStyle}
            onClick={async () => {
              if (activeThemePanel === 'gallery') {
                setActiveThemePanel(null);
              } else {
                if (!isComponentLoaded('theme-switcher')) {
                  await loadComponent('theme-switcher');
                }
                setActiveThemePanel('gallery');
              }
            }}
            title="Theme Gallery (Ctrl+T)"
          >
            🎭 Themes
          </button>

          <button
            style={activeThemePanel === 'customizer' ? { ...buttonStyle, background: '#7c3aed' } : buttonStyle}
            onClick={async () => {
              if (activeThemePanel === 'customizer') {
                setActiveThemePanel(null);
              } else {
                if (!isComponentLoaded('theme-customizer')) {
                  await loadComponent('theme-customizer');
                }
                setActiveThemePanel('customizer');
              }
            }}
            title="Theme Customizer (Ctrl+Shift+T)"
          >
            ⚙️ Customize
          </button>

          <button
            style={activeThemePanel === 'tokens' ? { ...buttonStyle, background: '#7c3aed' } : buttonStyle}
            onClick={async () => {
              if (activeThemePanel === 'tokens') {
                setActiveThemePanel(null);
              } else {
                if (!isComponentLoaded('token-editor')) {
                  await loadComponent('token-editor');
                }
                setActiveThemePanel('tokens');
              }
            }}
            title="Advanced Token Editor (Ctrl+Shift+K)"
          >
            🔧 Tokens
          </button>

          <button
            style={activeThemePanel === 'darkmode' ? { ...buttonStyle, background: '#7c3aed' } : buttonStyle}
            onClick={async () => {
              if (activeThemePanel === 'darkmode') {
                setActiveThemePanel(null);
              } else {
                if (!isComponentLoaded('darkmode-generator')) {
                  await loadComponent('darkmode-generator');
                }
                setActiveThemePanel('darkmode');
              }
            }}
            title="Dark Mode Generator (Ctrl+D)"
          >
            🌙 Dark Mode
          </button>

          <button
            style={activeThemePanel === 'exporter' ? { ...buttonStyle, background: '#7c3aed' } : buttonStyle}
            onClick={async () => {
              if (activeThemePanel === 'exporter') {
                setActiveThemePanel(null);
              } else {
                if (!isComponentLoaded('theme-exporter')) {
                  await loadComponent('theme-exporter');
                }
                setActiveThemePanel('exporter');
              }
            }}
            title="Export/Import Themes (Ctrl+E)"
          >
            📤 Export
          </button>

          <div style={separatorStyle} />
        </>
      )}

      {/* Preview Mode Indicator */}
      {isPreviewMode && previewTheme && (
        <>
          <span style={{ ...statusStyle, color: '#f59e0b' }}>
            Previewing: {previewTheme}
          </span>
          <button
            style={{ ...buttonStyle, background: '#f59e0b' }}
            onClick={() => endPreview()}
            title="End Theme Preview"
          >
            ✕ End Preview
          </button>
          <div style={separatorStyle} />
        </>
      )}

      {/* Selection Actions */}
      {state.selection.elements.length > 0 && (
        <>
          <span style={statusStyle}>
            {state.selection.elements.length} selected
          </span>
          
          <button
            style={buttonStyle}
            onClick={clearSelection}
            title="Clear Selection (Escape)"
          >
            ✕ Clear
          </button>

          {/* Phase 2 Selection-specific Actions */}
          {state.isEditMode && (
            <>
              <button
                style={buttonStyle}
                onClick={() => openMediaPanel(state.selection.lastSelected)}
                title="Replace Image (Ctrl+Click)"
              >
                🖼️ Replace
              </button>

              <button
                style={buttonStyle}
                onClick={() => openBackgroundPicker(state.selection.lastSelected)}
                title="Change Background"
              >
                🎭 BG
              </button>
            </>
          )}
        </>
      )}

      {/* Status Info */}
      <span style={statusStyle}>
        Phase 3: Theme System | {currentTheme} | History: {state.history.states.length} | Bundle: {getBundleInfo().loadedSize}/{getBundleInfo().totalSize}
      </span>

      {/* Phase 3 Theme Components */}
      <ThemeSwitcher
        isOpen={activeThemePanel === 'gallery'}
        onClose={() => setActiveThemePanel(null)}
        themes={themes}
        currentTheme={currentTheme}
        onThemeSelect={handleThemeSwitch}
        onPreviewTheme={(themeId) => {
          const oldTheme = currentTheme;
          previewTheme(themeId, {});
          addThemeChangeToHistory(oldTheme, themeId, 'preview');
        }}
        showCustomThemes={true}
      />

      <ThemeCustomizer
        isOpen={activeThemePanel === 'customizer'}
        onClose={() => setActiveThemePanel(null)}
        currentTheme={currentTheme}
        onTokenUpdate={(update: TokenUpdate) => {
          // Get previous value for history
          const keyPath = update.key.split('.');
          let current: any = currentTokens;
          
          for (let i = 0; i < keyPath.length - 1; i++) {
            if (!current[keyPath[i]]) current[keyPath[i]] = {};
            current = current[keyPath[i]];
          }
          const previousValue = current[keyPath[keyPath.length - 1]];
          
          // Apply token update immediately
          const newTokens = { ...currentTokens };
          let newCurrent: any = newTokens;
          
          for (let i = 0; i < keyPath.length - 1; i++) {
            if (!newCurrent[keyPath[i]]) newCurrent[keyPath[i]] = {};
            newCurrent = newCurrent[keyPath[i]];
          }
          newCurrent[keyPath[keyPath.length - 1]] = update.value;
          
          setCurrentTokens(newTokens);
          
          // Add to history
          addTokenUpdateToHistory(update, previousValue, currentTokens, newTokens);
        }}
        onSaveCustomTheme={(customization: ThemeCustomization) => {
          // Add customization to history before saving
          addCustomizationToHistory(undefined, customization);
          
          saveCustomTheme(currentTheme, customization, {
            name: customization.name,
            description: customization.description
          });
        }}
      />

      <TokenEditor
        isOpen={activeThemePanel === 'tokens'}
        onClose={() => setActiveThemePanel(null)}
        currentTheme={currentTheme}
        tokens={currentTokens}
        onTokensUpdate={setCurrentTokens}
        onSaveTokens={async () => {
          try {
            const response = await fetch('/api/tokens/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                themeId: currentTheme,
                tokens: currentTokens
              })
            });
            
            if (response.ok) {
              // Trigger hot reload
              window.dispatchEvent(new CustomEvent('tokens-updated', { 
                detail: { themeId: currentTheme, tokens: currentTokens } 
              }));
            }
          } catch (error) {
            console.error('Failed to save tokens:', error);
          }
        }}
      />

      <DarkModeGenerator
        isOpen={activeThemePanel === 'darkmode'}
        onClose={() => setActiveThemePanel(null)}
        lightTokens={currentTokens}
        currentTheme={currentTheme}
        onDarkTokensGenerated={async (darkTokens: TokenSchema) => {
          try {
            const response = await fetch('/api/themes/save-dark-variant', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                baseThemeId: currentTheme,
                darkTokens,
                metadata: {
                  id: `${currentTheme}-dark`,
                  name: `${currentTheme} Dark`,
                  description: `Dark mode variant of ${currentTheme}`,
                  category: 'dark',
                  isDarkMode: true
                }
              })
            });
            
            if (response.ok) {
              alert('Dark mode variant created successfully!');
            }
          } catch (error) {
            console.error('Failed to save dark mode variant:', error);
          }
        }}
      />

      <ThemeExporter
        isOpen={activeThemePanel === 'exporter'}
        onClose={() => setActiveThemePanel(null)}
        currentTheme={currentTheme}
        themeMetadata={themes.find(t => t.metadata.id === currentTheme)?.metadata}
        tokens={currentTokens}
        onImportTheme={(tokens: TokenSchema) => {
          setCurrentTokens(tokens);
        }}
        onCreateThemeFromExport={(exportData: any) => {
          // Create a new theme from imported data
          saveCustomTheme(currentTheme, {
            id: `imported-${Date.now()}`,
            themeId: currentTheme,
            name: exportData.metadata.name || 'Imported Theme',
            description: exportData.metadata.description || 'Imported theme',
            customTokens: exportData.tokens,
            componentSettings: [],
            responsiveSettings: {
              mobile: { hidden: [], styles: {} },
              tablet: { hidden: [], styles: {} },
              desktop: { hidden: [], styles: {} }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, {
            name: exportData.metadata.name || 'Imported Theme',
            description: exportData.metadata.description || 'Imported theme'
          });
        }}
      />
    </div>
  );
};