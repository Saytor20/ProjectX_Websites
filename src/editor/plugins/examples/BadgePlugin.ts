import React from 'react';
import { 
  PluginDefinition, 
  PluginContext, 
  ToolbarItem, 
  InspectorPanel,
  ValidationResult 
} from '../PluginAPI';

/**
 * Badge Plugin - Adds customizable badges and labels to components
 * Demonstrates component plugin capabilities with UI integration
 */

interface BadgeConfig {
  text: string;
  color: string;
  backgroundColor: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size: 'small' | 'medium' | 'large';
  shape: 'rounded' | 'pill' | 'square';
}

const defaultBadgeConfig: BadgeConfig = {
  text: 'New',
  color: '#ffffff',
  backgroundColor: '#ff4444',
  position: 'top-right',
  size: 'medium',
  shape: 'rounded'
};

export const BadgePlugin: PluginDefinition = {
  id: 'badge-plugin',
  name: 'Badge & Labels',
  version: '1.0.0',
  description: 'Add customizable badges and labels to any component',
  author: 'Restaurant Website Generator Team',
  category: 'component',
  icon: '🏷️',
  permissions: ['dom:read', 'dom:write', 'storage:local'],
  
  api: {
    onActivate: async (context: PluginContext) => {
      console.log('Badge Plugin activated');
      
      // Initialize plugin data storage
      const savedBadges = context.storage.local.get('badges');
      if (!savedBadges) {
        context.storage.local.set('badges', JSON.stringify({}));
      }
      
      // Add badge styles to the page
      addBadgeStyles();
    },

    onDeactivate: async (context: PluginContext) => {
      console.log('Badge Plugin deactivated');
      
      // Remove all badges
      removeBadgeStyles();
      removeAllBadges();
    },

    onElementSelected: (element: HTMLElement, context: PluginContext) => {
      // Check if element already has a badge
      const existingBadge = element.querySelector('.badge-plugin-badge');
      if (existingBadge) {
        // Load badge configuration for editing
        const badgeId = existingBadge.getAttribute('data-badge-id');
        if (badgeId) {
          loadBadgeForEditing(badgeId, context);
        }
      }
    },

    getToolbarItems: (context: PluginContext): ToolbarItem[] => [
      {
        id: 'add-badge',
        label: 'Add Badge',
        icon: '🏷️',
        tooltip: 'Add a badge to the selected element',
        onClick: (context) => addBadgeToSelectedElement(context),
        disabled: context.getSelectedElements().length === 0
      },
      {
        id: 'remove-badge',
        label: 'Remove Badge',
        icon: '🗑️',
        tooltip: 'Remove badge from selected element',
        onClick: (context) => removeBadgeFromSelectedElement(context),
        disabled: !hasSelectedElementWithBadge(context)
      }
    ],

    getInspectorPanels: (element: HTMLElement, context: PluginContext): InspectorPanel[] => {
      const badge = element.querySelector('.badge-plugin-badge');
      if (!badge) return [];

      return [
        {
          id: 'badge-config',
          title: 'Badge Settings',
          icon: '🏷️',
          priority: 100,
          render: (context) => React.createElement(BadgeConfigPanel, {
            element,
            context,
            onUpdate: (config: BadgeConfig) => updateBadge(element, config, context)
          })
        }
      ];
    },

    validate: (element: HTMLElement, context: PluginContext): ValidationResult => {
      const badge = element.querySelector('.badge-plugin-badge');
      if (!badge) {
        return { isValid: true };
      }

      const errors = [];
      const warnings = [];

      // Check if badge text is not empty
      const text = badge.textContent?.trim();
      if (!text) {
        errors.push({
          message: 'Badge text should not be empty',
          code: 'EMPTY_BADGE_TEXT',
          element: badge as HTMLElement,
          severity: 'warning' as const
        });
      }

      // Check contrast ratio
      const computedStyle = window.getComputedStyle(badge as Element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      if (!hasGoodContrast(color, backgroundColor)) {
        warnings.push({
          message: 'Badge may have insufficient color contrast',
          code: 'LOW_CONTRAST',
          element: badge as HTMLElement,
          suggestion: 'Consider using darker text on light backgrounds or lighter text on dark backgrounds'
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    }
  }
};

/**
 * Helper functions for badge management
 */
function addBadgeToSelectedElement(context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  const element = selectedElements[0];
  const badgeId = generateBadgeId();
  const badge = createBadgeElement(badgeId, defaultBadgeConfig);
  
  // Position the badge relative to the element
  element.style.position = element.style.position || 'relative';
  element.appendChild(badge);
  
  // Save badge configuration
  saveBadgeConfig(badgeId, defaultBadgeConfig, context);
}

function removeBadgeFromSelectedElement(context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  const element = selectedElements[0];
  const badge = element.querySelector('.badge-plugin-badge');
  if (badge) {
    const badgeId = badge.getAttribute('data-badge-id');
    if (badgeId) {
      removeBadgeConfig(badgeId, context);
    }
    badge.remove();
  }
}

function hasSelectedElementWithBadge(context: PluginContext): boolean {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return false;
  
  return selectedElements[0].querySelector('.badge-plugin-badge') !== null;
}

function createBadgeElement(badgeId: string, config: BadgeConfig): HTMLElement {
  const badge = document.createElement('span');
  badge.className = 'badge-plugin-badge';
  badge.setAttribute('data-badge-id', badgeId);
  badge.textContent = config.text;
  
  applyBadgeStyles(badge, config);
  
  return badge;
}

function applyBadgeStyles(badge: HTMLElement, config: BadgeConfig): void {
  const sizeStyles = {
    small: { padding: '2px 6px', fontSize: '10px' },
    medium: { padding: '4px 8px', fontSize: '12px' },
    large: { padding: '6px 12px', fontSize: '14px' }
  };

  const shapeStyles = {
    rounded: '4px',
    pill: '20px',
    square: '0'
  };

  const positionStyles = {
    'top-left': { top: '-8px', left: '-8px' },
    'top-right': { top: '-8px', right: '-8px' },
    'bottom-left': { bottom: '-8px', left: '-8px' },
    'bottom-right': { bottom: '-8px', right: '-8px' }
  };

  const size = sizeStyles[config.size];
  const position = positionStyles[config.position];

  Object.assign(badge.style, {
    position: 'absolute',
    color: config.color,
    backgroundColor: config.backgroundColor,
    padding: size.padding,
    fontSize: size.fontSize,
    fontWeight: 'bold',
    borderRadius: shapeStyles[config.shape],
    zIndex: '1000',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    pointerEvents: 'none',
    ...position
  });
}

function updateBadge(element: HTMLElement, config: BadgeConfig, context: PluginContext): void {
  const badge = element.querySelector('.badge-plugin-badge') as HTMLElement;
  if (!badge) return;

  const badgeId = badge.getAttribute('data-badge-id');
  if (!badgeId) return;

  badge.textContent = config.text;
  applyBadgeStyles(badge, config);
  saveBadgeConfig(badgeId, config, context);
}

function saveBadgeConfig(badgeId: string, config: BadgeConfig, context: PluginContext): void {
  const savedBadges = JSON.parse(context.storage.local.get('badges') || '{}');
  savedBadges[badgeId] = config;
  context.storage.local.set('badges', JSON.stringify(savedBadges));
}

function removeBadgeConfig(badgeId: string, context: PluginContext): void {
  const savedBadges = JSON.parse(context.storage.local.get('badges') || '{}');
  delete savedBadges[badgeId];
  context.storage.local.set('badges', JSON.stringify(savedBadges));
}

function loadBadgeForEditing(badgeId: string, context: PluginContext): BadgeConfig | null {
  const savedBadges = JSON.parse(context.storage.local.get('badges') || '{}');
  return savedBadges[badgeId] || null;
}

function generateBadgeId(): string {
  return `badge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function addBadgeStyles(): void {
  if (document.getElementById('badge-plugin-styles')) return;

  const style = document.createElement('style');
  style.id = 'badge-plugin-styles';
  style.textContent = `
    .badge-plugin-badge {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
    }
    
    .badge-plugin-badge:hover {
      transform: scale(1.05);
    }
    
    /* Animation for new badges */
    @keyframes badgeAppear {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .badge-plugin-badge {
      animation: badgeAppear 0.3s ease-out;
    }
  `;
  
  document.head.appendChild(style);
}

function removeBadgeStyles(): void {
  const style = document.getElementById('badge-plugin-styles');
  if (style) {
    style.remove();
  }
}

function removeAllBadges(): void {
  const badges = document.querySelectorAll('.badge-plugin-badge');
  badges.forEach(badge => badge.remove());
}

function hasGoodContrast(color: string, backgroundColor: string): boolean {
  // Simplified contrast check - in a real implementation,
  // you would calculate the actual contrast ratio
  // For now, just check if colors are different
  return color !== backgroundColor;
}

/**
 * React component for badge configuration panel
 */
interface BadgeConfigPanelProps {
  element: HTMLElement;
  context: PluginContext;
  onUpdate: (config: BadgeConfig) => void;
}

function BadgeConfigPanel({ element, context, onUpdate }: BadgeConfigPanelProps) {
  const badge = element.querySelector('.badge-plugin-badge');
  if (!badge) return null;

  const badgeId = badge.getAttribute('data-badge-id');
  if (!badgeId) return null;

  const currentConfig = loadBadgeForEditing(badgeId, context) || defaultBadgeConfig;

  return React.createElement('div', { className: 'badge-config-panel' }, [
    React.createElement('div', { key: 'text', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Badge Text'),
      React.createElement('input', {
        key: 'input',
        type: 'text',
        value: currentConfig.text,
        onChange: (e: any) => onUpdate({ ...currentConfig, text: e.target.value }),
        className: 'form-control'
      })
    ]),
    
    React.createElement('div', { key: 'colors', className: 'form-row' }, [
      React.createElement('div', { key: 'color', className: 'form-group' }, [
        React.createElement('label', { key: 'label' }, 'Text Color'),
        React.createElement('input', {
          key: 'input',
          type: 'color',
          value: currentConfig.color,
          onChange: (e: any) => onUpdate({ ...currentConfig, color: e.target.value }),
          className: 'form-control'
        })
      ]),
      React.createElement('div', { key: 'bg', className: 'form-group' }, [
        React.createElement('label', { key: 'label' }, 'Background'),
        React.createElement('input', {
          key: 'input',
          type: 'color',
          value: currentConfig.backgroundColor,
          onChange: (e: any) => onUpdate({ ...currentConfig, backgroundColor: e.target.value }),
          className: 'form-control'
        })
      ])
    ]),
    
    React.createElement('div', { key: 'position', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Position'),
      React.createElement('select', {
        key: 'select',
        value: currentConfig.position,
        onChange: (e: any) => onUpdate({ ...currentConfig, position: e.target.value }),
        className: 'form-control'
      }, [
        React.createElement('option', { key: 'tl', value: 'top-left' }, 'Top Left'),
        React.createElement('option', { key: 'tr', value: 'top-right' }, 'Top Right'),
        React.createElement('option', { key: 'bl', value: 'bottom-left' }, 'Bottom Left'),
        React.createElement('option', { key: 'br', value: 'bottom-right' }, 'Bottom Right')
      ])
    ]),
    
    React.createElement('div', { key: 'size', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Size'),
      React.createElement('select', {
        key: 'select',
        value: currentConfig.size,
        onChange: (e: any) => onUpdate({ ...currentConfig, size: e.target.value }),
        className: 'form-control'
      }, [
        React.createElement('option', { key: 'sm', value: 'small' }, 'Small'),
        React.createElement('option', { key: 'md', value: 'medium' }, 'Medium'),
        React.createElement('option', { key: 'lg', value: 'large' }, 'Large')
      ])
    ]),
    
    React.createElement('div', { key: 'shape', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Shape'),
      React.createElement('select', {
        key: 'select',
        value: currentConfig.shape,
        onChange: (e: any) => onUpdate({ ...currentConfig, shape: e.target.value }),
        className: 'form-control'
      }, [
        React.createElement('option', { key: 'rounded', value: 'rounded' }, 'Rounded'),
        React.createElement('option', { key: 'pill', value: 'pill' }, 'Pill'),
        React.createElement('option', { key: 'square', value: 'square' }, 'Square')
      ])
    ])
  ]);
}