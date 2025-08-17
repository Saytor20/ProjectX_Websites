'use client';

import { useState, useCallback, useMemo } from 'react';
import { lazy, Suspense, ComponentType } from 'react';

// Dynamic imports for theme components to reduce initial bundle size
const LazyThemeSwitcher = lazy(() => 
  import('../components/ThemeSwitcher').then(module => ({ 
    default: module.ThemeSwitcher 
  }))
);

const LazyThemeCustomizer = lazy(() => 
  import('../components/ThemeCustomizer').then(module => ({ 
    default: module.ThemeCustomizer 
  }))
);

const LazyTokenEditor = lazy(() => 
  import('../components/TokenEditor').then(module => ({ 
    default: module.TokenEditor 
  }))
);

const LazyThemeExporter = lazy(() => 
  import('../components/ThemeExporter').then(module => ({ 
    default: module.ThemeExporter 
  }))
);

const LazyDarkModeGenerator = lazy(() => 
  import('../components/DarkModeGenerator').then(module => ({ 
    default: module.DarkModeGenerator 
  }))
);

// Loading component for theme components
const ThemeComponentLoader = ({ 
  componentName, 
  size = 'default' 
}: { 
  componentName: string; 
  size?: 'small' | 'default' | 'large';
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-3">
        <div className={`animate-spin ${sizeClasses[size]} border-2 border-blue-500 border-t-transparent rounded-full`} />
        <div className="text-sm text-gray-600">
          Loading {componentName}...
        </div>
      </div>
    </div>
  );
};

interface ThemeComponentConfig {
  id: string;
  name: string;
  description: string;
  component: ComponentType<any>;
  preload?: boolean;
  dependencies?: string[];
  estimatedSize?: string;
}

export const useDynamicThemeComponents = () => {
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());
  const [loadingComponents, setLoadingComponents] = useState<Set<string>>(new Set());
  const [componentErrors, setComponentErrors] = useState<Map<string, Error>>(new Map());

  // Theme component configurations
  const componentConfigs: ThemeComponentConfig[] = useMemo(() => [
    {
      id: 'theme-switcher',
      name: 'Theme Switcher',
      description: 'Visual theme gallery with live previews',
      component: LazyThemeSwitcher,
      preload: true,
      estimatedSize: '45KB'
    },
    {
      id: 'theme-customizer',
      name: 'Theme Customizer',
      description: 'Brand color, typography, and spacing controls',
      component: LazyThemeCustomizer,
      dependencies: ['react-colorful', 'chroma-js'],
      estimatedSize: '38KB'
    },
    {
      id: 'token-editor',
      name: 'Token Editor',
      description: 'Advanced token editing with schema validation',
      component: LazyTokenEditor,
      dependencies: ['react-colorful', 'chroma-js'],
      estimatedSize: '42KB'
    },
    {
      id: 'theme-exporter',
      name: 'Theme Exporter',
      description: 'JSON-based theme sharing and backup',
      component: LazyThemeExporter,
      dependencies: ['file-saver', 'jszip'],
      estimatedSize: '35KB'
    },
    {
      id: 'darkmode-generator',
      name: 'Dark Mode Generator',
      description: 'Automatic dark theme variants with contrast validation',
      component: LazyDarkModeGenerator,
      dependencies: ['chroma-js'],
      estimatedSize: '28KB'
    }
  ], []);

  // Preload critical components
  const preloadComponents = useCallback(async () => {
    const criticalComponents = componentConfigs.filter(config => config.preload);
    
    const preloadPromises = criticalComponents.map(async (config) => {
      try {
        setLoadingComponents(prev => new Set(prev).add(config.id));
        
        // Preload the component
        await config.component;
        
        setLoadedComponents(prev => new Set(prev).add(config.id));
      } catch (error) {
        console.error(`Failed to preload ${config.name}:`, error);
        setComponentErrors(prev => new Map(prev).set(config.id, error as Error));
      } finally {
        setLoadingComponents(prev => {
          const newSet = new Set(prev);
          newSet.delete(config.id);
          return newSet;
        });
      }
    });

    await Promise.allSettled(preloadPromises);
  }, [componentConfigs]);

  // Load component on demand
  const loadComponent = useCallback(async (componentId: string) => {
    const config = componentConfigs.find(c => c.id === componentId);
    if (!config || loadedComponents.has(componentId) || loadingComponents.has(componentId)) {
      return;
    }

    try {
      setLoadingComponents(prev => new Set(prev).add(componentId));
      
      // Load dependencies if specified
      if (config.dependencies) {
        console.log(`Loading dependencies for ${config.name}:`, config.dependencies);
      }
      
      // Load the component
      await config.component;
      
      setLoadedComponents(prev => new Set(prev).add(componentId));
      
      // Track component loading for analytics
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('theme-component-loaded', {
          detail: {
            componentId,
            name: config.name,
            estimatedSize: config.estimatedSize,
            timestamp: Date.now()
          }
        }));
      }
    } catch (error) {
      console.error(`Failed to load ${config.name}:`, error);
      setComponentErrors(prev => new Map(prev).set(componentId, error as Error));
    } finally {
      setLoadingComponents(prev => {
        const newSet = new Set(prev);
        newSet.delete(componentId);
        return newSet;
      });
    }
  }, [componentConfigs, loadedComponents, loadingComponents]);

  // Get component with Suspense wrapper
  const getComponent = useCallback((componentId: string, props: any = {}) => {
    const config = componentConfigs.find(c => c.id === componentId);
    if (!config) {
      console.warn(`Unknown component ID: ${componentId}`);
      return null;
    }

    const Component = config.component;
    const error = componentErrors.get(componentId);
    
    if (error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 font-medium">Failed to load {config.name}</div>
          <div className="text-red-600 text-sm mt-1">{error.message}</div>
          <button
            onClick={() => {
              setComponentErrors(prev => {
                const newMap = new Map(prev);
                newMap.delete(componentId);
                return newMap;
              });
              loadComponent(componentId);
            }}
            className="mt-2 text-sm text-red-700 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <Suspense 
        fallback={
          <ThemeComponentLoader 
            componentName={config.name}
            size="default"
          />
        }
      >
        <Component {...props} />
      </Suspense>
    );
  }, [componentConfigs, componentErrors, loadComponent]);

  // Unload component (for memory management)
  const unloadComponent = useCallback((componentId: string) => {
    setLoadedComponents(prev => {
      const newSet = new Set(prev);
      newSet.delete(componentId);
      return newSet;
    });
    
    setComponentErrors(prev => {
      const newMap = new Map(prev);
      newMap.delete(componentId);
      return newMap;
    });
  }, []);

  // Get bundle size information
  const getBundleInfo = useCallback(() => {
    const loadedSize = componentConfigs
      .filter(config => loadedComponents.has(config.id))
      .reduce((total, config) => {
        const size = parseInt(config.estimatedSize?.replace('KB', '') || '0');
        return total + size;
      }, 0);

    const totalSize = componentConfigs.reduce((total, config) => {
      const size = parseInt(config.estimatedSize?.replace('KB', '') || '0');
      return total + size;
    }, 0);

    return {
      loadedSize: `${loadedSize}KB`,
      totalSize: `${totalSize}KB`,
      loadedCount: loadedComponents.size,
      totalCount: componentConfigs.length,
      loadingCount: loadingComponents.size,
      errorCount: componentErrors.size
    };
  }, [componentConfigs, loadedComponents, loadingComponents, componentErrors]);

  // Preload components when in development mode
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Preload critical components in development
      preloadComponents();
    }
  }, [preloadComponents]);

  return {
    // Component management
    loadComponent,
    unloadComponent,
    getComponent,
    preloadComponents,
    
    // State
    loadedComponents: Array.from(loadedComponents),
    loadingComponents: Array.from(loadingComponents),
    componentErrors: Object.fromEntries(componentErrors),
    
    // Configuration
    componentConfigs,
    
    // Bundle info
    getBundleInfo,
    
    // Utilities
    isComponentLoaded: (componentId: string) => loadedComponents.has(componentId),
    isComponentLoading: (componentId: string) => loadingComponents.has(componentId),
    hasComponentError: (componentId: string) => componentErrors.has(componentId),
    
    // Component wrapper helpers
    ThemeSwitcher: (props: any) => getComponent('theme-switcher', props),
    ThemeCustomizer: (props: any) => getComponent('theme-customizer', props),
    TokenEditor: (props: any) => getComponent('token-editor', props),
    ThemeExporter: (props: any) => getComponent('theme-exporter', props),
    DarkModeGenerator: (props: any) => getComponent('darkmode-generator', props)
  };
};