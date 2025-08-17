import React from 'react';
import { 
  PluginDefinition, 
  PluginContext, 
  ToolbarItem, 
  InspectorPanel,
  ValidationResult
} from '../PluginAPI';

/**
 * SEO Plugin - Meta tags, OpenGraph, and SEO optimization tools
 * Demonstrates validation plugin with comprehensive SEO analysis
 */

interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  canonical?: string;
  robots?: string;
  viewport?: string;
  language?: string;
  structuredData?: any;
}

interface SEORule {
  id: string;
  name: string;
  description: string;
  check: (config: SEOConfig, context: PluginContext) => SEORuleResult;
  severity: 'error' | 'warning' | 'info';
  category: 'basic' | 'advanced' | 'social' | 'technical';
}

interface SEORuleResult {
  passed: boolean;
  message: string;
  suggestion?: string;
  value?: string;
}

const defaultSEOConfig: SEOConfig = {
  title: '',
  description: '',
  keywords: [],
  author: '',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  language: 'en'
};

const seoRules: SEORule[] = [
  // Basic SEO Rules
  {
    id: 'title-exists',
    name: 'Page Title',
    description: 'Page must have a title tag',
    severity: 'error',
    category: 'basic',
    check: (config) => ({
      passed: config.title.length > 0,
      message: config.title.length > 0 ? 'Page has a title' : 'Page is missing a title',
      suggestion: 'Add a descriptive title for your page',
      value: config.title
    })
  },
  {
    id: 'title-length',
    name: 'Title Length',
    description: 'Title should be between 30-60 characters',
    severity: 'warning',
    category: 'basic',
    check: (config) => {
      const length = config.title.length;
      const optimal = length >= 30 && length <= 60;
      return {
        passed: optimal,
        message: optimal ? 'Title length is optimal' : `Title is ${length} characters`,
        suggestion: length < 30 ? 'Consider making the title longer' : 'Consider making the title shorter',
        value: `${length} characters`
      };
    }
  },
  {
    id: 'description-exists',
    name: 'Meta Description',
    description: 'Page must have a meta description',
    severity: 'error',
    category: 'basic',
    check: (config) => ({
      passed: config.description.length > 0,
      message: config.description.length > 0 ? 'Page has a meta description' : 'Page is missing a meta description',
      suggestion: 'Add a compelling description for your page',
      value: config.description
    })
  },
  {
    id: 'description-length',
    name: 'Description Length',
    description: 'Description should be between 120-160 characters',
    severity: 'warning',
    category: 'basic',
    check: (config) => {
      const length = config.description.length;
      const optimal = length >= 120 && length <= 160;
      return {
        passed: optimal,
        message: optimal ? 'Description length is optimal' : `Description is ${length} characters`,
        suggestion: length < 120 ? 'Consider making the description longer' : 'Consider making the description shorter',
        value: `${length} characters`
      };
    }
  },
  {
    id: 'keywords-exist',
    name: 'Meta Keywords',
    description: 'Page should have relevant keywords',
    severity: 'info',
    category: 'basic',
    check: (config) => ({
      passed: config.keywords.length > 0,
      message: config.keywords.length > 0 ? `Page has ${config.keywords.length} keywords` : 'Page has no keywords',
      suggestion: 'Add relevant keywords for your content',
      value: config.keywords.join(', ')
    })
  },
  // Social Media / OpenGraph Rules
  {
    id: 'og-title',
    name: 'OpenGraph Title',
    description: 'OpenGraph title for social media sharing',
    severity: 'warning',
    category: 'social',
    check: (config) => ({
      passed: !!config.ogTitle,
      message: config.ogTitle ? 'OpenGraph title is set' : 'OpenGraph title is missing',
      suggestion: 'Add an OpenGraph title for better social media sharing',
      value: config.ogTitle || ''
    })
  },
  {
    id: 'og-description',
    name: 'OpenGraph Description',
    description: 'OpenGraph description for social media sharing',
    severity: 'warning',
    category: 'social',
    check: (config) => ({
      passed: !!config.ogDescription,
      message: config.ogDescription ? 'OpenGraph description is set' : 'OpenGraph description is missing',
      suggestion: 'Add an OpenGraph description for better social media sharing',
      value: config.ogDescription || ''
    })
  },
  {
    id: 'og-image',
    name: 'OpenGraph Image',
    description: 'OpenGraph image for social media sharing',
    severity: 'warning',
    category: 'social',
    check: (config) => ({
      passed: !!config.ogImage,
      message: config.ogImage ? 'OpenGraph image is set' : 'OpenGraph image is missing',
      suggestion: 'Add an OpenGraph image (recommended: 1200x630px)',
      value: config.ogImage || ''
    })
  },
  // Technical SEO Rules
  {
    id: 'canonical-url',
    name: 'Canonical URL',
    description: 'Canonical URL to prevent duplicate content',
    severity: 'info',
    category: 'technical',
    check: (config) => ({
      passed: !!config.canonical,
      message: config.canonical ? 'Canonical URL is set' : 'Canonical URL is not set',
      suggestion: 'Add a canonical URL to prevent duplicate content issues',
      value: config.canonical || ''
    })
  },
  {
    id: 'robots-directive',
    name: 'Robots Directive',
    description: 'Robots meta tag directive',
    severity: 'info',
    category: 'technical',
    check: (config) => ({
      passed: !!config.robots,
      message: config.robots ? 'Robots directive is set' : 'Robots directive is not set',
      suggestion: 'Set robots directive (e.g., "index, follow")',
      value: config.robots || ''
    })
  },
  {
    id: 'viewport-meta',
    name: 'Viewport Meta',
    description: 'Viewport meta tag for mobile optimization',
    severity: 'warning',
    category: 'technical',
    check: (config) => ({
      passed: !!config.viewport,
      message: config.viewport ? 'Viewport meta is set' : 'Viewport meta is missing',
      suggestion: 'Add viewport meta tag for mobile optimization',
      value: config.viewport || ''
    })
  }
];

export const SEOPlugin: PluginDefinition = {
  id: 'seo-plugin',
  name: 'SEO Optimizer',
  version: '1.0.0',
  description: 'Comprehensive SEO analysis and optimization tools',
  author: 'Restaurant Website Generator Team',
  category: 'validation',
  icon: '🔍',
  permissions: ['dom:read', 'dom:write', 'storage:local'],
  
  api: {
    onActivate: async (context: PluginContext) => {
      console.log('SEO Plugin activated');
      
      // Initialize SEO storage
      const savedSEO = context.storage.local.get('seo-config');
      if (!savedSEO) {
        context.storage.local.set('seo-config', JSON.stringify(defaultSEOConfig));
      }
      
      // Analyze current page SEO
      const currentConfig = extractCurrentSEO();
      if (currentConfig) {
        context.storage.local.set('seo-config', JSON.stringify(currentConfig));
      }
    },

    onDeactivate: async (context: PluginContext) => {
      console.log('SEO Plugin deactivated');
    },

    getToolbarItems: (context: PluginContext): ToolbarItem[] => [
      {
        id: 'seo-analysis',
        label: 'SEO Analysis',
        icon: '🔍',
        tooltip: 'Run comprehensive SEO analysis',
        onClick: (context) => runSEOAnalysis(context)
      },
      {
        id: 'edit-seo',
        label: 'Edit SEO',
        icon: '✏️',
        tooltip: 'Edit page SEO settings',
        onClick: (context) => showSEOEditor(context)
      },
      {
        id: 'seo-preview',
        label: 'Preview',
        icon: '👁️',
        tooltip: 'Preview how page appears in search results',
        onClick: (context) => showSEOPreview(context)
      },
      {
        id: 'generate-meta',
        label: 'Auto-Generate',
        icon: '⚡',
        tooltip: 'Auto-generate SEO meta tags from content',
        onClick: (context) => autoGenerateSEO(context)
      }
    ],

    getInspectorPanels: (element: HTMLElement, context: PluginContext): InspectorPanel[] => [
      {
        id: 'seo-panel',
        title: 'SEO Settings',
        icon: '🔍',
        priority: 95,
        render: (context) => React.createElement(SEOPanel, {
          context,
          onUpdate: (config: SEOConfig) => updateSEOConfig(config, context)
        })
      }
    ],

    validate: (element: HTMLElement, context: PluginContext): ValidationResult => {
      const seoConfig = getSEOConfig(context);
      const results = seoRules.map(rule => ({
        rule,
        result: rule.check(seoConfig, context)
      }));

      const errors = results
        .filter(r => r.rule.severity === 'error' && !r.result.passed)
        .map(r => ({
          message: r.result.message,
          code: r.rule.id,
          element,
          severity: 'error' as const
        }));

      const warnings = results
        .filter(r => r.rule.severity === 'warning' && !r.result.passed)
        .map(r => ({
          message: r.result.message,
          code: r.rule.id,
          element,
          suggestion: r.result.suggestion
        }));

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    }
  }
};

/**
 * SEO management functions
 */
function runSEOAnalysis(context: PluginContext): void {
  const modal = createSEOAnalysisModal(context);
  document.body.appendChild(modal);
}

function showSEOEditor(context: PluginContext): void {
  const modal = createSEOEditorModal(context);
  document.body.appendChild(modal);
}

function showSEOPreview(context: PluginContext): void {
  const modal = createSEOPreviewModal(context);
  document.body.appendChild(modal);
}

function autoGenerateSEO(context: PluginContext): void {
  const generatedConfig = generateSEOFromContent();
  updateSEOConfig(generatedConfig, context);
  
  // Show success message
  showNotification('SEO meta tags generated automatically from page content!');
}

function getSEOConfig(context: PluginContext): SEOConfig {
  const saved = context.storage.local.get('seo-config');
  return saved ? JSON.parse(saved) : defaultSEOConfig;
}

function updateSEOConfig(config: SEOConfig, context: PluginContext): void {
  context.storage.local.set('seo-config', JSON.stringify(config));
  applyMetaTags(config);
}

function extractCurrentSEO(): SEOConfig | null {
  try {
    const title = document.title || '';
    const descriptionMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    const keywordsMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    const authorMeta = document.querySelector('meta[name="author"]') as HTMLMetaElement;
    const ogTitleMeta = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    const ogDescMeta = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    const ogImageMeta = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    const robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    const viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;

    return {
      title,
      description: descriptionMeta?.content || '',
      keywords: keywordsMeta?.content.split(',').map(k => k.trim()) || [],
      author: authorMeta?.content || '',
      ogTitle: ogTitleMeta?.content || '',
      ogDescription: ogDescMeta?.content || '',
      ogImage: ogImageMeta?.content || '',
      canonical: canonicalLink?.href || '',
      robots: robotsMeta?.content || 'index, follow',
      viewport: viewportMeta?.content || 'width=device-width, initial-scale=1',
      language: document.documentElement.lang || 'en'
    };
  } catch (error) {
    console.warn('Failed to extract current SEO:', error);
    return null;
  }
}

function generateSEOFromContent(): SEOConfig {
  // Extract content from page
  const h1 = document.querySelector('h1');
  const firstParagraph = document.querySelector('p');
  const images = document.querySelectorAll('img');
  
  let title = '';
  let description = '';
  let keywords: string[] = [];
  let ogImage = '';

  // Generate title from h1 or page content
  if (h1) {
    title = h1.textContent?.trim() || '';
  } else {
    title = document.title || 'Restaurant Website';
  }

  // Generate description from first paragraph
  if (firstParagraph) {
    description = firstParagraph.textContent?.trim().substring(0, 155) || '';
  }

  // Extract keywords from headings and prominent text
  const headings = document.querySelectorAll('h1, h2, h3');
  headings.forEach(heading => {
    const text = heading.textContent?.trim();
    if (text) {
      keywords.push(...text.split(' ').filter(word => word.length > 3));
    }
  });

  // Use first suitable image as og:image
  for (const img of Array.from(images)) {
    const src = (img as HTMLImageElement).src;
    if (src && !src.includes('icon') && !src.includes('logo')) {
      ogImage = src;
      break;
    }
  }

  // Remove duplicates and limit keywords
  keywords = Array.from(new Set(keywords)).slice(0, 10);

  return {
    title,
    description,
    keywords,
    author: '',
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType: 'website',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1',
    language: 'en'
  };
}

function applyMetaTags(config: SEOConfig): void {
  // Update document title
  document.title = config.title;

  // Helper function to update or create meta tag
  const updateMetaTag = (selector: string, content: string) => {
    let meta = document.querySelector(selector) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      if (selector.includes('name=')) {
        meta.name = selector.match(/name="([^"]*)"/)![1];
      } else if (selector.includes('property=')) {
        meta.setAttribute('property', selector.match(/property="([^"]*)"/)![1]);
      }
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  // Update basic meta tags
  updateMetaTag('meta[name="description"]', config.description);
  updateMetaTag('meta[name="keywords"]', config.keywords.join(', '));
  updateMetaTag('meta[name="author"]', config.author);
  updateMetaTag('meta[name="robots"]', config.robots || 'index, follow');
  updateMetaTag('meta[name="viewport"]', config.viewport || 'width=device-width, initial-scale=1');

  // Update OpenGraph tags
  if (config.ogTitle) {
    updateMetaTag('meta[property="og:title"]', config.ogTitle);
  }
  if (config.ogDescription) {
    updateMetaTag('meta[property="og:description"]', config.ogDescription);
  }
  if (config.ogImage) {
    updateMetaTag('meta[property="og:image"]', config.ogImage);
  }
  if (config.ogType) {
    updateMetaTag('meta[property="og:type"]', config.ogType);
  }

  // Update Twitter Card tags
  if (config.twitterCard) {
    updateMetaTag('meta[name="twitter:card"]', config.twitterCard);
  }
  if (config.twitterSite) {
    updateMetaTag('meta[name="twitter:site"]', config.twitterSite);
  }

  // Update canonical link
  if (config.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = config.canonical;
  }

  // Update language
  if (config.language) {
    document.documentElement.lang = config.language;
  }
}

function createSEOAnalysisModal(context: PluginContext): HTMLElement {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); display: flex; align-items: center;
    justify-content: center; z-index: 10000;
  `;

  const seoConfig = getSEOConfig(context);
  const results = seoRules.map(rule => ({
    rule,
    result: rule.check(seoConfig, context)
  }));

  const content = document.createElement('div');
  content.style.cssText = `
    background: white; border-radius: 8px; padding: 20px;
    width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto;
  `;

  const categories = Array.from(new Set(seoRules.map(r => r.category)));
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h3>SEO Analysis Report</h3>
      <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
              style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
    </div>
    
    ${categories.map(category => {
      const categoryResults = results.filter(r => r.rule.category === category);
      const passed = categoryResults.filter(r => r.result.passed).length;
      const total = categoryResults.length;
      
      return `
        <div style="margin-bottom: 30px;">
          <h4 style="margin-bottom: 15px; text-transform: capitalize; 
                     border-bottom: 2px solid #eee; padding-bottom: 5px;">
            ${category} SEO (${passed}/${total} passed)
          </h4>
          ${categoryResults.map(({ rule, result }) => `
            <div style="display: flex; align-items: center; margin-bottom: 10px; 
                        padding: 10px; border-radius: 4px; 
                        background: ${result.passed ? '#f0f9ff' : rule.severity === 'error' ? '#fef2f2' : '#fffbeb'};">
              <span style="margin-right: 10px; font-size: 20px;">
                ${result.passed ? '✅' : rule.severity === 'error' ? '❌' : '⚠️'}
              </span>
              <div style="flex: 1;">
                <div style="font-weight: bold; margin-bottom: 5px;">${rule.name}</div>
                <div style="color: #666; margin-bottom: 5px;">${result.message}</div>
                ${result.suggestion ? `<div style="color: #888; font-size: 12px;">💡 ${result.suggestion}</div>` : ''}
                ${result.value ? `<div style="color: #333; font-size: 12px; margin-top: 5px;"><strong>Current:</strong> ${result.value}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('')}
    
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button onclick="this.closest('[style*=\"position: fixed\"]').remove()"
              style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
        Close
      </button>
    </div>
  `;

  modal.appendChild(content);
  return modal;
}

function createSEOEditorModal(context: PluginContext): HTMLElement {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); display: flex; align-items: center;
    justify-content: center; z-index: 10000;
  `;

  const currentConfig = getSEOConfig(context);
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white; border-radius: 8px; padding: 20px;
    width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto;
  `;

  const form = document.createElement('form');
  form.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h3>Edit SEO Settings</h3>
      <button type="button" onclick="this.closest('[style*=\"position: fixed\"]').remove()"
              style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
    </div>
    
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">Page Title</label>
      <input type="text" name="title" value="${currentConfig.title}" 
             style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      <small style="color: #666;">Recommended: 30-60 characters</small>
    </div>
    
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">Meta Description</label>
      <textarea name="description" rows="3" 
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">${currentConfig.description}</textarea>
      <small style="color: #666;">Recommended: 120-160 characters</small>
    </div>
    
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">Keywords (comma-separated)</label>
      <input type="text" name="keywords" value="${currentConfig.keywords.join(', ')}"
             style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
    </div>
    
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">OpenGraph Image URL</label>
      <input type="url" name="ogImage" value="${currentConfig.ogImage || ''}"
             style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
    </div>
    
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button type="button" onclick="this.closest('[style*=\"position: fixed\"]').remove()"
              style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
        Cancel
      </button>
      <button type="submit"
              style="padding: 8px 16px; border: none; background: #2196f3; color: white; border-radius: 4px; cursor: pointer;">
        Save Changes
      </button>
    </div>
  `;

  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newConfig: SEOConfig = {
      ...currentConfig,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      keywords: (formData.get('keywords') as string).split(',').map(k => k.trim()).filter(k => k),
      ogImage: formData.get('ogImage') as string,
      ogTitle: formData.get('title') as string,
      ogDescription: formData.get('description') as string
    };
    
    updateSEOConfig(newConfig, context);
    modal.remove();
    showNotification('SEO settings updated successfully!');
  };

  content.appendChild(form);
  modal.appendChild(content);
  return modal;
}

function createSEOPreviewModal(context: PluginContext): HTMLElement {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); display: flex; align-items: center;
    justify-content: center; z-index: 10000;
  `;

  const config = getSEOConfig(context);
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white; border-radius: 8px; padding: 20px;
    width: 90%; max-width: 500px;
  `;

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h3>Search Result Preview</h3>
      <button onclick="this.closest('[style*=\"position: fixed\"]').remove()"
              style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
    </div>
    
    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: #fafafa;">
      <div style="color: #1a0dab; font-size: 18px; margin-bottom: 5px; text-decoration: underline; cursor: pointer;">
        ${config.title || 'Your Page Title'}
      </div>
      <div style="color: #006621; font-size: 14px; margin-bottom: 5px;">
        ${window.location.origin}${window.location.pathname}
      </div>
      <div style="color: #545454; font-size: 14px; line-height: 1.4;">
        ${config.description || 'Your meta description will appear here...'}
      </div>
    </div>
    
    <div style="margin-top: 20px;">
      <h4>Social Media Preview</h4>
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-top: 10px;">
        ${config.ogImage ? `<img src="${config.ogImage}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">` : ''}
        <div style="font-weight: bold; margin-bottom: 5px;">
          ${config.ogTitle || config.title || 'Your Page Title'}
        </div>
        <div style="color: #666; font-size: 14px; margin-bottom: 5px;">
          ${config.ogDescription || config.description || 'Your description...'}
        </div>
        <div style="color: #999; font-size: 12px;">
          ${window.location.hostname}
        </div>
      </div>
    </div>
    
    <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
      <button onclick="this.closest('[style*=\"position: fixed\"]').remove()"
              style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
        Close
      </button>
    </div>
  `;

  modal.appendChild(content);
  return modal;
}

function showNotification(message: string): void {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #4caf50;
    color: white; padding: 15px 20px; border-radius: 4px; z-index: 10001;
    font-weight: bold; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * React SEO Panel Component
 */
interface SEOPanelProps {
  context: PluginContext;
  onUpdate: (config: SEOConfig) => void;
}

function SEOPanel({ context, onUpdate }: SEOPanelProps) {
  const currentConfig = getSEOConfig(context);
  const analysis = seoRules.map(rule => ({
    rule,
    result: rule.check(currentConfig, context)
  }));

  const score = analysis.filter(a => a.result.passed).length;
  const total = analysis.length;
  const percentage = Math.round((score / total) * 100);

  return React.createElement('div', { className: 'seo-panel' }, [
    React.createElement('div', { key: 'score', style: { marginBottom: '15px', textAlign: 'center' } }, [
      React.createElement('div', { key: 'circle', style: { 
        width: '60px', height: '60px', borderRadius: '50%', 
        background: `conic-gradient(#4caf50 ${percentage * 3.6}deg, #eee 0deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 10px'
      }}, [
        React.createElement('div', { key: 'text', style: { 
          background: 'white', borderRadius: '50%', width: '45px', height: '45px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '14px'
        }}, `${percentage}%`)
      ]),
      React.createElement('div', { key: 'label' }, `SEO Score: ${score}/${total}`)
    ]),
    
    React.createElement('div', { key: 'actions', style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } }, [
      React.createElement('button', {
        key: 'analysis',
        onClick: () => runSEOAnalysis(context),
        className: 'btn btn-sm btn-primary',
        style: { flex: '1' }
      }, 'Full Analysis'),
      React.createElement('button', {
        key: 'edit',
        onClick: () => showSEOEditor(context),
        className: 'btn btn-sm btn-secondary',
        style: { flex: '1' }
      }, 'Edit SEO')
    ]),
    
    React.createElement('div', { key: 'quick-issues', style: { marginTop: '15px' } }, [
      React.createElement('h5', { key: 'title' }, 'Quick Issues'),
      React.createElement('div', { key: 'issues' }, 
        analysis
          .filter(a => !a.result.passed && a.rule.severity !== 'info')
          .slice(0, 3)
          .map((a, index) => 
            React.createElement('div', { 
              key: index, 
              style: { 
                fontSize: '12px', 
                padding: '5px', 
                background: a.rule.severity === 'error' ? '#fef2f2' : '#fffbeb',
                borderRadius: '3px',
                marginBottom: '5px'
              }
            }, `${a.rule.severity === 'error' ? '❌' : '⚠️'} ${a.result.message}`)
          )
      )
    ])
  ]);
}