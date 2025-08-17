'use client';

import { useCallback } from 'react';
import { useEditorContext } from '../EditorApp';
import type { 
  HistoryState, 
  TokenUpdate, 
  ThemeCustomization,
  ThemeChange 
} from '../types';
import type { TokenSchema } from '../types/tokens';

interface ThemeHistoryOptions {
  maxUndoStates?: number;
  debounceMs?: number;
}

export const useThemeHistory = (options: ThemeHistoryOptions = {}) => {
  const { state, dispatch, addToHistory } = useEditorContext();
  const { maxUndoStates = 50, debounceMs = 300 } = options;

  // Create a theme change history entry
  const addThemeChangeToHistory = useCallback((
    fromTheme: string,
    toTheme: string,
    type: 'switch' | 'preview' | 'reset' = 'switch'
  ) => {
    const historyState: HistoryState = {
      id: `theme-${type}-${Date.now()}`,
      timestamp: Date.now(),
      type: 'theme',
      elementId: 'theme-system',
      beforeState: {
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        rotation: 0,
        styles: {}
      },
      afterState: {
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        rotation: 0,
        styles: {}
      },
      themeBefore: fromTheme,
      themeAfter: toTheme
    };

    addToHistory(historyState);
  }, [addToHistory]);

  // Create a token update history entry
  const addTokenUpdateToHistory = useCallback((
    tokenUpdate: TokenUpdate,
    previousValue: any,
    fullTokensBefore?: TokenSchema,
    fullTokensAfter?: TokenSchema
  ) => {
    const historyState: HistoryState = {
      id: `tokens-${tokenUpdate.category}-${Date.now()}`,
      timestamp: Date.now(),
      type: 'tokens',
      elementId: `token-${tokenUpdate.category}-${tokenUpdate.key}`,
      beforeState: {
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        rotation: 0,
        styles: {}
      },
      afterState: {
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        rotation: 0,
        styles: {}
      },
      tokensBefore: fullTokensBefore || {
        [tokenUpdate.category]: {
          [tokenUpdate.key]: previousValue
        }
      },
      tokensAfter: fullTokensAfter || {
        [tokenUpdate.category]: {
          [tokenUpdate.key]: tokenUpdate.value
        }
      }
    };

    addToHistory(historyState);
  }, [addToHistory]);

  // Create a theme customization history entry
  const addCustomizationToHistory = useCallback((
    previousCustomization: ThemeCustomization | undefined,
    newCustomization: ThemeCustomization
  ) => {
    const historyState: HistoryState = {
      id: `customization-${Date.now()}`,
      timestamp: Date.now(),
      type: 'theme',
      elementId: 'theme-customization',
      beforeState: {
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        rotation: 0,
        styles: {}
      },
      afterState: {
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        rotation: 0,
        styles: {}
      },
      customizationBefore: previousCustomization,
      customizationAfter: newCustomization
    };

    addToHistory(historyState);
  }, [addToHistory]);

  // Restore theme from history state
  const restoreThemeFromHistory = useCallback(async (historyState: HistoryState) => {
    try {
      // Restore theme switch
      if (historyState.type === 'theme' && historyState.themeBefore) {
        const themeToRestore = historyState.themeBefore;
        
        // Update data-skin attribute
        document.documentElement.setAttribute('data-skin', themeToRestore);
        
        // Reload theme CSS
        const response = await fetch(`/api/themes/switch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeId: themeToRestore })
        });
        
        if (response.ok) {
          // Trigger theme change event
          window.dispatchEvent(new CustomEvent('theme-restored', { 
            detail: { themeId: themeToRestore, fromHistory: true } 
          }));
        }
      }

      // Restore token changes
      if (historyState.type === 'tokens' && historyState.tokensBefore) {
        const response = await fetch('/api/tokens/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            themeId: state.theming.currentTheme,
            tokens: historyState.tokensBefore
          })
        });
        
        if (response.ok) {
          // Apply restored tokens to CSS
          applyTokensToCSS(historyState.tokensBefore);
          
          // Trigger tokens restored event
          window.dispatchEvent(new CustomEvent('tokens-restored', { 
            detail: { tokens: historyState.tokensBefore, fromHistory: true } 
          }));
        }
      }

      // Restore theme customization
      if (historyState.customizationBefore) {
        const response = await fetch('/api/themes/restore-customization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            themeId: state.theming.currentTheme,
            customization: historyState.customizationBefore
          })
        });
        
        if (response.ok) {
          // Apply restored customization
          applyCustomizationToCSS(historyState.customizationBefore);
          
          // Trigger customization restored event
          window.dispatchEvent(new CustomEvent('customization-restored', { 
            detail: { customization: historyState.customizationBefore, fromHistory: true } 
          }));
        }
      }
    } catch (error) {
      console.error('Failed to restore theme from history:', error);
      throw error;
    }
  }, [state.theming.currentTheme]);

  // Apply tokens to CSS custom properties
  const applyTokensToCSS = useCallback((tokens: Record<string, any>) => {
    const root = document.documentElement;
    
    const flattenTokens = (obj: any, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const cssVar = prefix ? `--${prefix}-${key}` : `--${key}`;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flattenTokens(value, prefix ? `${prefix}-${key}` : key);
        } else {
          const cssValue = Array.isArray(value) ? value.join(', ') : String(value);
          root.style.setProperty(cssVar, cssValue);
        }
      });
    };
    
    flattenTokens(tokens);
  }, []);

  // Apply customization to CSS
  const applyCustomizationToCSS = useCallback((customization: ThemeCustomization) => {
    const root = document.documentElement;
    
    // Apply custom tokens
    Object.entries(customization.customTokens).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, String(value));
    });
    
    // Apply component-specific styles
    customization.componentSettings.forEach(setting => {
      if (setting.styles) {
        Object.entries(setting.styles).forEach(([property, value]) => {
          root.style.setProperty(`--component-${setting.componentId}-${property}`, String(value));
        });
      }
    });
  }, []);

  // Enhanced undo that handles theme operations
  const undoThemeOperation = useCallback(async () => {
    const { history } = state;
    
    if (history.currentIndex <= 0) return false;
    
    const currentState = history.states[history.currentIndex - 1];
    
    // Check if this is a theme-related operation
    if (currentState.type === 'theme' || currentState.type === 'tokens') {
      try {
        await restoreThemeFromHistory(currentState);
        
        // Update editor state
        dispatch({ type: 'UNDO' });
        return true;
      } catch (error) {
        console.error('Failed to undo theme operation:', error);
        return false;
      }
    }
    
    // Fall back to standard undo
    dispatch({ type: 'UNDO' });
    return true;
  }, [state, dispatch, restoreThemeFromHistory]);

  // Enhanced redo that handles theme operations
  const redoThemeOperation = useCallback(async () => {
    const { history } = state;
    
    if (history.currentIndex >= history.states.length - 1) return false;
    
    const nextState = history.states[history.currentIndex + 1];
    
    // Check if this is a theme-related operation
    if (nextState.type === 'theme' || nextState.type === 'tokens') {
      try {
        // For redo, we apply the "after" state
        const redoState: HistoryState = {
          ...nextState,
          themeBefore: nextState.themeAfter,
          themeAfter: nextState.themeBefore,
          tokensBefore: nextState.tokensAfter,
          tokensAfter: nextState.tokensBefore,
          customizationBefore: nextState.customizationAfter,
          customizationAfter: nextState.customizationBefore
        };
        
        await restoreThemeFromHistory(redoState);
        
        // Update editor state
        dispatch({ type: 'REDO' });
        return true;
      } catch (error) {
        console.error('Failed to redo theme operation:', error);
        return false;
      }
    }
    
    // Fall back to standard redo
    dispatch({ type: 'REDO' });
    return true;
  }, [state, dispatch, restoreThemeFromHistory]);

  // Get theme-related history entries
  const getThemeHistory = useCallback(() => {
    return state.history.states.filter(
      historyState => historyState.type === 'theme' || historyState.type === 'tokens'
    );
  }, [state.history.states]);

  // Clear theme history (keep only non-theme entries)
  const clearThemeHistory = useCallback(() => {
    const nonThemeStates = state.history.states.filter(
      historyState => historyState.type !== 'theme' && historyState.type !== 'tokens'
    );
    
    // This would need to be implemented in the editor reducer
    // For now, we'll just log the action
    console.log('Clear theme history requested', { remaining: nonThemeStates.length });
  }, [state.history.states]);

  // Create a bulk token update with single history entry
  const createBulkTokenUpdate = useCallback((
    updates: TokenUpdate[],
    previousTokens: TokenSchema,
    newTokens: TokenSchema
  ) => {
    const historyState: HistoryState = {
      id: `bulk-tokens-${Date.now()}`,
      timestamp: Date.now(),
      type: 'tokens',
      elementId: 'bulk-token-update',
      beforeState: {
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        rotation: 0,
        styles: {}
      },
      afterState: {
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        rotation: 0,
        styles: {}
      },
      tokensBefore: previousTokens,
      tokensAfter: newTokens
    };

    addToHistory(historyState);
  }, [addToHistory]);

  return {
    // History management
    addThemeChangeToHistory,
    addTokenUpdateToHistory,
    addCustomizationToHistory,
    createBulkTokenUpdate,
    
    // History navigation
    undoThemeOperation,
    redoThemeOperation,
    
    // History queries
    getThemeHistory,
    clearThemeHistory,
    
    // Restoration utilities
    restoreThemeFromHistory,
    applyTokensToCSS,
    applyCustomizationToCSS,
    
    // State
    canUndo: state.history.currentIndex > 0,
    canRedo: state.history.currentIndex < state.history.states.length - 1,
    historyLength: state.history.states.length,
    themeHistoryLength: getThemeHistory().length
  };
};