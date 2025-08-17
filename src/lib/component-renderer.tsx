/**
 * Component Renderer
 * 
 * Renders React component trees from mapping configurations.
 * Provides sandboxed, secure rendering with error boundaries.
 */

'use client';

import React, { ErrorInfo, ReactElement, ReactNode } from 'react';
import { COMPONENT_REGISTRY, isValidVariant } from '@/components/kit';
import type { ComponentMapping } from '@/components/kit/types';
import type { SiteSchema } from '@/schema/core';

// Error boundary for component rendering
interface ComponentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ComponentErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode; componentName?: string },
  ComponentErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode; componentName?: string }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ComponentErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component rendering error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="component-error" role="alert">
          <h3>Component Error</h3>
          <p>
            Failed to render {this.props.componentName || 'component'}.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Error Details</summary>
              <pre>{this.state.error?.message}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Rendering context
interface RenderingContext {
  siteData: SiteSchema;
  locale: string;
  direction: 'ltr' | 'rtl';
  skinId: string;
  isDevelopment: boolean;
}

// Renderer class
export class ComponentRenderer {
  private context: RenderingContext;
  private renderCount: number;
  private maxRenderDepth: number;

  constructor(
    siteData: SiteSchema, 
    skinId: string, 
    options: {
      maxRenderDepth?: number;
      isDevelopment?: boolean;
    } = {}
  ) {
    this.context = {
      siteData,
      locale: siteData.metadata.locale,
      direction: siteData.metadata.direction,
      skinId,
      isDevelopment: options.isDevelopment || process.env.NODE_ENV === 'development',
    };
    
    this.renderCount = 0;
    this.maxRenderDepth = options.maxRenderDepth || 50;
  }

  // Render component tree from mappings
  renderComponentTree(mappings: ComponentMapping[]): ReactElement[] {
    this.renderCount = 0;
    return this.renderMappings(mappings);
  }

  // Render array of mappings
  private renderMappings(mappings: ComponentMapping[]): ReactElement[] {
    return mappings.map((mapping, index) => 
      this.renderMapping(mapping, `mapping-${index}`)
    ).filter(Boolean) as ReactElement[];
  }

  // Render single mapping
  private renderMapping(mapping: ComponentMapping, key: string): ReactElement | null {
    // Prevent infinite recursion
    if (this.renderCount >= this.maxRenderDepth) {
      console.warn('Maximum render depth exceeded');
      return null;
    }
    this.renderCount++;

    try {
      // Get component from registry
      const Component = COMPONENT_REGISTRY[mapping.as];
      if (!Component) {
        console.warn(`Unknown component: ${mapping.as}`);
        return this.renderUnknownComponent(mapping.as, key);
      }

      // Validate variant
      if (mapping.variant && !isValidVariant(mapping.as, mapping.variant)) {
        console.warn(`Invalid variant "${mapping.variant}" for component "${mapping.as}"`);
      }

      // Process props
      const processedProps = this.processProps(mapping.props || {}, mapping.as);

      // Add base props
      const baseProps = {
        key,
        locale: this.context.locale,
        direction: this.context.direction,
        'data-component': mapping.as,
        'data-skin': this.context.skinId,
        ...processedProps,
      };

      // Add variant if specified
      if (mapping.variant) {
        (baseProps as any).variant = mapping.variant;
      }

      // Render component with error boundary
      return (
        <ComponentErrorBoundary 
          key={key}
          componentName={mapping.as}
          fallback={this.renderErrorFallback(mapping.as)}
        >
          <Component {...(baseProps as any)} />
        </ComponentErrorBoundary>
      );
    } catch (error) {
      console.error(`Failed to render component ${mapping.as}:`, error);
      return this.renderErrorFallback(mapping.as, key);
    }
  }

  // Process component props
  private processProps(props: Record<string, any>, componentName: string): Record<string, any> {
    const processed: Record<string, any> = {};

    for (const [key, value] of Object.entries(props)) {
      try {
        processed[key] = this.processValue(value, key, componentName);
      } catch (error) {
        console.warn(`Failed to process prop ${key} for ${componentName}:`, error);
        processed[key] = null;
      }
    }

    return processed;
  }

  // Process individual prop value
  private processValue(value: any, propName: string, componentName: string): any {
    if (value === null || value === undefined) {
      return value;
    }

    // Handle nested component mappings (for children)
    if (Array.isArray(value) && value.every(item => item?.as)) {
      return this.renderMappings(value as ComponentMapping[]);
    }

    // Handle React elements
    if (React.isValidElement(value)) {
      return value;
    }

    // Handle objects recursively
    if (typeof value === 'object' && value !== null) {
      const processed: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        processed[key] = this.processValue(val, key, componentName);
      }
      return processed;
    }

    // Handle arrays recursively
    if (Array.isArray(value)) {
      return value.map((item, index) => 
        this.processValue(item, `${propName}[${index}]`, componentName)
      );
    }

    // Sanitize strings
    if (typeof value === 'string') {
      return this.sanitizeString(value, propName, componentName);
    }

    return value;
  }

  // Sanitize string values
  private sanitizeString(value: string, propName: string, componentName: string): string {
    // For URL props, validate URLs
    if (propName.toLowerCase().includes('url') || propName.toLowerCase().includes('href')) {
      return this.sanitizeUrl(value);
    }

    // For src props (images), validate image URLs
    if (propName === 'src' || propName === 'image') {
      return this.sanitizeImageUrl(value);
    }

    // For HTML content, basic sanitization is handled by RichText component
    return value;
  }

  // Sanitize URLs
  private sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url, this.context.siteData.seo.canonicalUrl || 'https://example.com');
      
      // Allow only safe protocols
      const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
      if (!safeProtocols.includes(parsed.protocol)) {
        console.warn(`Unsafe URL protocol: ${parsed.protocol}`);
        return '#';
      }

      return parsed.toString();
    } catch {
      // If URL parsing fails, check if it's a relative URL
      if (url.startsWith('/') || url.startsWith('#')) {
        return url;
      }
      
      console.warn(`Invalid URL: ${url}`);
      return '#';
    }
  }

  // Sanitize image URLs
  private sanitizeImageUrl(url: string): string {
    try {
      const parsed = new URL(url, this.context.siteData.seo.canonicalUrl || 'https://example.com');
      
      // Allow only HTTP(S) for images
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        console.warn(`Unsafe image URL protocol: ${parsed.protocol}`);
        return '/placeholder.jpg'; // Default placeholder
      }

      // Check against allowed domains (from Next.js config)
      const allowedDomains = [
        'images.deliveryhero.io',
        'hungerstation.com',
        'localhost',
      ];

      if (!allowedDomains.includes(parsed.hostname)) {
        console.warn(`Image domain not allowed: ${parsed.hostname}`);
        return '/placeholder.jpg';
      }

      return parsed.toString();
    } catch {
      if (url.startsWith('/')) {
        return url; // Local image
      }
      
      console.warn(`Invalid image URL: ${url}`);
      return '/placeholder.jpg';
    }
  }

  // Render fallback for unknown components
  private renderUnknownComponent(componentName: string, key: string): ReactElement {
    return (
      <div 
        key={key}
        className="unknown-component" 
        role="alert"
        data-component={componentName}
        data-skin={this.context.skinId}
      >
        <p>Unknown component: {componentName}</p>
        {this.context.isDevelopment && (
          <p><small>Available components: {Object.keys(COMPONENT_REGISTRY).join(', ')}</small></p>
        )}
      </div>
    );
  }

  // Render error fallback
  private renderErrorFallback(componentName: string, key?: string): ReactElement {
    return (
      <div 
        key={key}
        className="component-error" 
        role="alert"
        data-component={componentName}
        data-skin={this.context.skinId}
      >
        <p>Failed to render component: {componentName}</p>
      </div>
    );
  }

  // Get rendering statistics
  getStats(): { renderCount: number; maxDepth: number; context: RenderingContext } {
    return {
      renderCount: this.renderCount,
      maxDepth: this.maxRenderDepth,
      context: { ...this.context },
    };
  }
}

// Higher-order component for skin wrapping
export function withSkinWrapper(
  WrappedComponent: React.ComponentType<any>,
  skinId: string
) {
  const WithSkinWrapper: React.FC<any> = (props) => (
    <div data-skin={skinId}>
      <WrappedComponent {...props} />
    </div>
  );

  WithSkinWrapper.displayName = `WithSkinWrapper(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithSkinWrapper;
}

// Hook for accessing rendering context
export function useRenderingContext() {
  // In a real implementation, this would use React Context
  // For now, return default values
  return {
    locale: 'en',
    direction: 'ltr' as const,
    skinId: 'default',
    isDevelopment: process.env.NODE_ENV === 'development',
  };
}

// Utility function to render a single component with props
export function renderSingleComponent(
  componentName: keyof typeof COMPONENT_REGISTRY,
  props: Record<string, any>,
  siteData: SiteSchema,
  skinId: string = 'default'
): ReactElement | null {
  const renderer = new ComponentRenderer(siteData, skinId);
  
  const mapping: ComponentMapping = {
    as: componentName,
    props,
  };

  const result = renderer.renderComponentTree([mapping]);
  return result[0] || null;
}