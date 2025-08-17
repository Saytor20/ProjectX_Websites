'use client';

import { useState, useEffect, useCallback } from 'react';
import type { 
  ThemeMetadata, 
  ThemeGalleryItem, 
  ThemeSearchFilters,
  ThemePreviewConfig,
  ThemeCustomization,
  ThemeValidationResult 
} from '../types/theme';

interface ThemesState {
  themes: ThemeGalleryItem[];
  customThemes: ThemeGalleryItem[];
  isLoading: boolean;
  error: string | null;
  currentTheme: string;
  isPreviewMode: boolean;
  previewTheme: string | null;
}

const initialState: ThemesState = {
  themes: [],
  customThemes: [],
  isLoading: false,
  error: null,
  currentTheme: '',
  isPreviewMode: false,
  previewTheme: null
};

const initialSearchFilters: ThemeSearchFilters = {
  categories: [],
  tags: [],
  features: [],
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc'
};

export const useThemes = () => {
  const [state, setState] = useState<ThemesState>(initialState);
  const [searchFilters, setSearchFilters] = useState<ThemeSearchFilters>(initialSearchFilters);

  // Load themes from API
  const loadThemes = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/themes/list');
      if (!response.ok) {
        throw new Error('Failed to load themes');
      }
      
      const data = await response.json();
      const themeItems: ThemeGalleryItem[] = data.themes.map((theme: ThemeMetadata) => ({
        metadata: theme,
        preview: {
          thumbnailUrl: `/skins/${theme.id}/preview.jpg`,
          heroImageUrl: `/skins/${theme.id}/hero-preview.jpg`,
          mobilePreviewUrl: `/skins/${theme.id}/mobile-preview.jpg`
        },
        isActive: false,
        isCustomized: false
      }));
      
      setState(prev => ({ 
        ...prev, 
        themes: themeItems,
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load themes',
        isLoading: false 
      }));
    }
  }, []);

  // Get current theme from document data-skin attribute
  const getCurrentTheme = useCallback(() => {
    const htmlElement = document.documentElement;
    const currentSkin = htmlElement.getAttribute('data-skin') || 'cafert-modern';
    setState(prev => ({ ...prev, currentTheme: currentSkin }));
    return currentSkin;
  }, []);

  // Switch theme by updating data-skin attribute and reloading CSS
  const switchTheme = useCallback(async (themeId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Call API to switch theme
      const response = await fetch('/api/themes/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to switch theme');
      }
      
      // Update data-skin attribute
      document.documentElement.setAttribute('data-skin', themeId);
      
      // Reload CSS for new theme
      await reloadThemeCSS(themeId);
      
      setState(prev => ({ 
        ...prev, 
        currentTheme: themeId,
        isLoading: false,
        themes: prev.themes.map(theme => ({
          ...theme,
          isActive: theme.metadata.id === themeId
        }))
      }));
      
      // Trigger hot reload event
      window.dispatchEvent(new CustomEvent('theme-changed', { 
        detail: { themeId } 
      }));
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to switch theme',
        isLoading: false 
      }));
    }
  }, []);

  // Reload theme CSS
  const reloadThemeCSS = useCallback(async (themeId: string) => {
    const existingLink = document.querySelector(`link[data-theme="${themeId}"]`);
    const newLink = document.createElement('link');
    
    newLink.rel = 'stylesheet';
    newLink.href = `/skins/${themeId}/skin.css?v=${Date.now()}`;
    newLink.setAttribute('data-theme', themeId);
    
    if (existingLink) {
      existingLink.parentNode?.replaceChild(newLink, existingLink);
    } else {
      document.head.appendChild(newLink);
    }
    
    // Wait for CSS to load
    return new Promise((resolve, reject) => {
      newLink.onload = resolve;
      newLink.onerror = reject;
    });
  }, []);

  // Preview theme temporarily
  const previewTheme = useCallback(async (themeId: string, config: ThemePreviewConfig) => {
    try {
      setState(prev => ({ 
        ...prev, 
        isPreviewMode: true, 
        previewTheme: themeId 
      }));
      
      // Store current theme for restoration
      const originalTheme = getCurrentTheme();
      sessionStorage.setItem('preview-original-theme', originalTheme);
      
      // Apply preview theme
      document.documentElement.setAttribute('data-skin', themeId);
      await reloadThemeCSS(themeId);
      
      // Apply customizations if provided
      if (config.customizations) {
        await applyThemeCustomizations(config.customizations);
      }
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to preview theme',
        isPreviewMode: false,
        previewTheme: null
      }));
    }
  }, [getCurrentTheme]);

  // End theme preview and restore original
  const endPreview = useCallback(async () => {
    try {
      const originalTheme = sessionStorage.getItem('preview-original-theme');
      if (originalTheme) {
        document.documentElement.setAttribute('data-skin', originalTheme);
        await reloadThemeCSS(originalTheme);
        sessionStorage.removeItem('preview-original-theme');
      }
      
      setState(prev => ({ 
        ...prev, 
        isPreviewMode: false, 
        previewTheme: null 
      }));
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to end preview'
      }));
    }
  }, []);

  // Apply theme customizations
  const applyThemeCustomizations = useCallback(async (customizations: ThemeCustomization) => {
    try {
      const response = await fetch('/api/themes/customize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customizations)
      });
      
      if (!response.ok) {
        throw new Error('Failed to apply customizations');
      }
      
      // Apply custom CSS variables
      const root = document.documentElement;
      Object.entries(customizations.customTokens).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
      
    } catch (error) {
      console.error('Failed to apply theme customizations:', error);
    }
  }, []);

  // Save custom theme
  const saveCustomTheme = useCallback(async (
    baseThemeId: string, 
    customizations: ThemeCustomization,
    metadata: Partial<ThemeMetadata>
  ) => {
    try {
      const response = await fetch('/api/themes/save-custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseThemeId,
          customizations,
          metadata
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save custom theme');
      }
      
      const savedTheme = await response.json();
      
      setState(prev => ({
        ...prev,
        customThemes: [...prev.customThemes, {
          metadata: savedTheme.metadata,
          preview: {
            thumbnailUrl: savedTheme.preview?.thumbnailUrl || `/skins/${baseThemeId}/preview.jpg`
          },
          isActive: false,
          isCustomized: true,
          customizations
        }]
      }));
      
      return savedTheme;
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to save custom theme'
      }));
      throw error;
    }
  }, []);

  // Delete custom theme
  const deleteCustomTheme = useCallback(async (themeId: string) => {
    try {
      const response = await fetch(`/api/themes/${themeId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete theme');
      }
      
      setState(prev => ({
        ...prev,
        customThemes: prev.customThemes.filter(theme => theme.metadata.id !== themeId)
      }));
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to delete theme'
      }));
      throw error;
    }
  }, []);

  // Export theme
  const exportTheme = useCallback(async (themeId: string) => {
    try {
      const response = await fetch(`/api/themes/${themeId}/export`);
      if (!response.ok) {
        throw new Error('Failed to export theme');
      }
      
      const themeData = await response.json();
      
      // Download as JSON file
      const blob = new Blob([JSON.stringify(themeData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${themeId}-theme.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to export theme'
      }));
      throw error;
    }
  }, []);

  // Import theme
  const importTheme = useCallback(async (themeFile: File) => {
    try {
      const fileContent = await themeFile.text();
      const themeData = JSON.parse(fileContent);
      
      const response = await fetch('/api/themes/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to import theme');
      }
      
      const result = await response.json();
      
      if (result.success) {
        await loadThemes(); // Reload themes to include imported one
        return result;
      } else {
        throw new Error(result.error || 'Import failed');
      }
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to import theme'
      }));
      throw error;
    }
  }, [loadThemes]);

  // Validate theme
  const validateTheme = useCallback(async (themeId: string): Promise<ThemeValidationResult> => {
    try {
      const response = await fetch(`/api/themes/${themeId}/validate`);
      if (!response.ok) {
        throw new Error('Failed to validate theme');
      }
      
      return await response.json();
      
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Validation failed');
    }
  }, []);

  // Update search filters
  const updateSearchFilters = useCallback((filters: Partial<ThemeSearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadThemes();
    getCurrentTheme();
  }, [loadThemes, getCurrentTheme]);

  // Update active theme when current theme changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      themes: prev.themes.map(theme => ({
        ...theme,
        isActive: theme.metadata.id === state.currentTheme
      }))
    }));
  }, [state.currentTheme]);

  return {
    // State
    themes: [...state.themes, ...state.customThemes],
    builtInThemes: state.themes,
    customThemes: state.customThemes,
    isLoading: state.isLoading,
    error: state.error,
    currentTheme: state.currentTheme,
    isPreviewMode: state.isPreviewMode,
    previewTheme: state.previewTheme,
    searchFilters,
    
    // Actions
    loadThemes,
    switchTheme,
    previewTheme,
    endPreview,
    saveCustomTheme,
    deleteCustomTheme,
    exportTheme,
    importTheme,
    validateTheme,
    updateSearchFilters,
    clearError,
    
    // Utilities
    getCurrentTheme,
    reloadThemeCSS,
    applyThemeCustomizations
  };
};