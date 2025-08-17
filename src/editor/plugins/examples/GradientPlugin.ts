import React from 'react';
import { 
  PluginDefinition, 
  PluginContext, 
  ToolbarItem, 
  InspectorPanel 
} from '../PluginAPI';

/**
 * Gradient Plugin - Advanced gradient creation with multi-stop controls
 * Demonstrates theme plugin capabilities with advanced CSS generation
 */

interface GradientStop {
  color: string;
  position: number; // 0-100
}

interface GradientConfig {
  type: 'linear' | 'radial' | 'conic';
  angle?: number; // for linear gradients (0-360 degrees)
  shape?: 'circle' | 'ellipse'; // for radial gradients
  position?: { x: number; y: number }; // center position for radial/conic
  stops: GradientStop[];
  repeat?: boolean;
}

const defaultGradientConfig: GradientConfig = {
  type: 'linear',
  angle: 45,
  stops: [
    { color: '#ff7a42', position: 0 },
    { color: '#ffedea', position: 100 }
  ]
};

const presetGradients: { name: string; config: GradientConfig }[] = [
  {
    name: 'Sunset',
    config: {
      type: 'linear',
      angle: 45,
      stops: [
        { color: '#ff6b6b', position: 0 },
        { color: '#ffa726', position: 50 },
        { color: '#ffcc02', position: 100 }
      ]
    }
  },
  {
    name: 'Ocean',
    config: {
      type: 'linear',
      angle: 180,
      stops: [
        { color: '#00b4db', position: 0 },
        { color: '#0083b0', position: 100 }
      ]
    }
  },
  {
    name: 'Forest',
    config: {
      type: 'radial',
      shape: 'circle',
      position: { x: 50, y: 50 },
      stops: [
        { color: '#8BC34A', position: 0 },
        { color: '#4CAF50', position: 50 },
        { color: '#2E7D32', position: 100 }
      ]
    }
  },
  {
    name: 'Aurora',
    config: {
      type: 'conic',
      position: { x: 50, y: 50 },
      stops: [
        { color: '#00c3f7', position: 0 },
        { color: '#9d50bb', position: 25 },
        { color: '#6fba82', position: 50 },
        { color: '#f9ca24', position: 75 },
        { color: '#00c3f7', position: 100 }
      ]
    }
  }
];

export const GradientPlugin: PluginDefinition = {
  id: 'gradient-plugin',
  name: 'Advanced Gradients',
  version: '1.0.0',
  description: 'Create complex gradients with multi-stop controls and presets',
  author: 'Restaurant Website Generator Team',
  category: 'theme',
  icon: '🎨',
  permissions: ['dom:read', 'dom:write', 'theme:read', 'theme:write', 'storage:local'],
  
  api: {
    onActivate: async (context: PluginContext) => {
      console.log('Gradient Plugin activated');
      
      // Initialize gradient storage
      const savedGradients = context.storage.local.get('gradients');
      if (!savedGradients) {
        context.storage.local.set('gradients', JSON.stringify({}));
      }
      
      // Add gradient utility styles
      addGradientUtilities();
    },

    onDeactivate: async (context: PluginContext) => {
      console.log('Gradient Plugin deactivated');
      removeGradientUtilities();
    },

    onElementSelected: (element: HTMLElement, context: PluginContext) => {
      // Check if element has a gradient background
      const computedStyle = window.getComputedStyle(element);
      const background = computedStyle.backgroundImage;
      
      if (background.includes('gradient')) {
        // Parse existing gradient for editing
        const gradientConfig = parseGradientFromCSS(background);
        if (gradientConfig) {
          saveElementGradient(element, gradientConfig, context);
        }
      }
    },

    getToolbarItems: (context: PluginContext): ToolbarItem[] => [
      {
        id: 'apply-gradient',
        label: 'Apply Gradient',
        icon: '🎨',
        tooltip: 'Apply a gradient background to selected element',
        onClick: (context) => applyGradientToSelected(context),
        disabled: context.getSelectedElements().length === 0
      },
      {
        id: 'gradient-presets',
        label: 'Presets',
        icon: '🎭',
        tooltip: 'Choose from gradient presets',
        type: 'dropdown',
        options: presetGradients.map(preset => ({
          id: preset.name.toLowerCase(),
          label: preset.name,
          onClick: (context) => applyPresetGradient(preset.config, context)
        }))
      },
      {
        id: 'remove-gradient',
        label: 'Remove Gradient',
        icon: '🗑️',
        tooltip: 'Remove gradient from selected element',
        onClick: (context) => removeGradientFromSelected(context),
        disabled: !hasSelectedElementWithGradient(context)
      }
    ],

    getInspectorPanels: (element: HTMLElement, context: PluginContext): InspectorPanel[] => {
      const hasGradient = hasElementGradient(element);
      if (!hasGradient) return [];

      return [
        {
          id: 'gradient-config',
          title: 'Gradient Editor',
          icon: '🎨',
          priority: 90,
          render: (context) => React.createElement(GradientEditor, {
            element,
            context,
            onUpdate: (config: GradientConfig) => updateElementGradient(element, config, context)
          })
        }
      ];
    },

    generateTokens: (baseTokens: any, context: PluginContext) => {
      // Add gradient tokens to the theme system
      const gradientTokens = {
        gradients: {
          primary: generateCSSGradient(defaultGradientConfig),
          sunset: generateCSSGradient(presetGradients[0].config),
          ocean: generateCSSGradient(presetGradients[1].config),
          forest: generateCSSGradient(presetGradients[2].config),
          aurora: generateCSSGradient(presetGradients[3].config)
        }
      };

      return {
        ...baseTokens,
        ...gradientTokens
      };
    }
  }
};

/**
 * Gradient management functions
 */
function applyGradientToSelected(context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  const element = selectedElements[0];
  applyGradientToElement(element, defaultGradientConfig, context);
}

function applyPresetGradient(config: GradientConfig, context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  const element = selectedElements[0];
  applyGradientToElement(element, config, context);
}

function removeGradientFromSelected(context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  const element = selectedElements[0];
  element.style.backgroundImage = '';
  removeElementGradient(element, context);
}

function hasSelectedElementWithGradient(context: PluginContext): boolean {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return false;
  
  return hasElementGradient(selectedElements[0]);
}

function hasElementGradient(element: HTMLElement): boolean {
  const computedStyle = window.getComputedStyle(element);
  const background = computedStyle.backgroundImage;
  return background.includes('gradient');
}

function applyGradientToElement(element: HTMLElement, config: GradientConfig, context: PluginContext): void {
  const cssGradient = generateCSSGradient(config);
  element.style.backgroundImage = cssGradient;
  saveElementGradient(element, config, context);
}

function updateElementGradient(element: HTMLElement, config: GradientConfig, context: PluginContext): void {
  applyGradientToElement(element, config, context);
}

function generateCSSGradient(config: GradientConfig): string {
  const stops = config.stops
    .sort((a, b) => a.position - b.position)
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  switch (config.type) {
    case 'linear':
      const angle = config.angle ?? 0;
      const prefix = config.repeat ? 'repeating-linear-gradient' : 'linear-gradient';
      return `${prefix}(${angle}deg, ${stops})`;
      
    case 'radial':
      const shape = config.shape ?? 'circle';
      const posX = config.position?.x ?? 50;
      const posY = config.position?.y ?? 50;
      const radialPrefix = config.repeat ? 'repeating-radial-gradient' : 'radial-gradient';
      return `${radialPrefix}(${shape} at ${posX}% ${posY}%, ${stops})`;
      
    case 'conic':
      const conicPosX = config.position?.x ?? 50;
      const conicPosY = config.position?.y ?? 50;
      const conicPrefix = config.repeat ? 'repeating-conic-gradient' : 'conic-gradient';
      return `${conicPrefix}(at ${conicPosX}% ${conicPosY}%, ${stops})`;
      
    default:
      return `linear-gradient(45deg, ${stops})`;
  }
}

function parseGradientFromCSS(cssGradient: string): GradientConfig | null {
  // Simplified parser - in a real implementation, you'd use a proper CSS parser
  try {
    if (cssGradient.includes('linear-gradient')) {
      const match = cssGradient.match(/linear-gradient\((.+)\)/);
      if (match) {
        return parseLinearGradient(match[1]);
      }
    } else if (cssGradient.includes('radial-gradient')) {
      const match = cssGradient.match(/radial-gradient\((.+)\)/);
      if (match) {
        return parseRadialGradient(match[1]);
      }
    } else if (cssGradient.includes('conic-gradient')) {
      const match = cssGradient.match(/conic-gradient\((.+)\)/);
      if (match) {
        return parseConicGradient(match[1]);
      }
    }
  } catch (error) {
    console.warn('Failed to parse gradient:', error);
  }
  
  return null;
}

function parseLinearGradient(content: string): GradientConfig {
  // Simplified parsing - extract angle and color stops
  const parts = content.split(',').map(p => p.trim());
  const angle = parseInt(parts[0]) || 45;
  const stops = parseColorStops(parts.slice(1));
  
  return {
    type: 'linear',
    angle,
    stops
  };
}

function parseRadialGradient(content: string): GradientConfig {
  // Simplified parsing for radial gradients
  const stops = parseColorStops(content.split(',').slice(1));
  
  return {
    type: 'radial',
    shape: 'circle',
    position: { x: 50, y: 50 },
    stops
  };
}

function parseConicGradient(content: string): GradientConfig {
  // Simplified parsing for conic gradients
  const stops = parseColorStops(content.split(',').slice(1));
  
  return {
    type: 'conic',
    position: { x: 50, y: 50 },
    stops
  };
}

function parseColorStops(stopStrings: string[]): GradientStop[] {
  return stopStrings.map((stop, index) => {
    const trimmed = stop.trim();
    const colorMatch = trimmed.match(/^(#[0-9a-f]{6}|#[0-9a-f]{3}|rgb\(.+\)|rgba\(.+\)|[a-z]+)/i);
    const positionMatch = trimmed.match(/(\d+)%/);
    
    return {
      color: colorMatch ? colorMatch[1] : '#000000',
      position: positionMatch ? parseInt(positionMatch[1]) : (index * 100 / (stopStrings.length - 1))
    };
  });
}

function saveElementGradient(element: HTMLElement, config: GradientConfig, context: PluginContext): void {
  const elementId = element.id || generateElementId(element);
  const savedGradients = JSON.parse(context.storage.local.get('gradients') || '{}');
  savedGradients[elementId] = config;
  context.storage.local.set('gradients', JSON.stringify(savedGradients));
}

function removeElementGradient(element: HTMLElement, context: PluginContext): void {
  const elementId = element.id;
  if (!elementId) return;

  const savedGradients = JSON.parse(context.storage.local.get('gradients') || '{}');
  delete savedGradients[elementId];
  context.storage.local.set('gradients', JSON.stringify(savedGradients));
}

function generateElementId(element: HTMLElement): string {
  if (element.id) return element.id;
  
  // Generate a unique ID based on element characteristics
  const tagName = element.tagName.toLowerCase();
  const className = element.className;
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  
  return `${tagName}-${className}-${timestamp}-${random}`;
}

function addGradientUtilities(): void {
  if (document.getElementById('gradient-plugin-styles')) return;

  const style = document.createElement('style');
  style.id = 'gradient-plugin-styles';
  style.textContent = `
    /* Gradient animation utilities */
    .gradient-animate {
      background-size: 200% 200%;
      animation: gradientShift 4s ease infinite;
    }
    
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* Gradient overlay utilities */
    .gradient-overlay::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 1;
    }
    
    .gradient-text {
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
  `;
  
  document.head.appendChild(style);
}

function removeGradientUtilities(): void {
  const style = document.getElementById('gradient-plugin-styles');
  if (style) {
    style.remove();
  }
}

/**
 * React Gradient Editor Component
 */
interface GradientEditorProps {
  element: HTMLElement;
  context: PluginContext;
  onUpdate: (config: GradientConfig) => void;
}

function GradientEditor({ element, context, onUpdate }: GradientEditorProps) {
  const elementId = element.id || generateElementId(element);
  const savedGradients = JSON.parse(context.storage.local.get('gradients') || '{}');
  const currentConfig = savedGradients[elementId] || defaultGradientConfig;

  const updateConfig = (updates: Partial<GradientConfig>) => {
    const newConfig = { ...currentConfig, ...updates };
    onUpdate(newConfig);
  };

  const addStop = () => {
    const newStop: GradientStop = {
      color: '#ffffff',
      position: 50
    };
    const newStops = [...currentConfig.stops, newStop].sort((a, b) => a.position - b.position);
    updateConfig({ stops: newStops });
  };

  const removeStop = (index: number) => {
    if (currentConfig.stops.length <= 2) return; // Keep at least 2 stops
    const newStops = currentConfig.stops.filter((_, i) => i !== index);
    updateConfig({ stops: newStops });
  };

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    const newStops = currentConfig.stops.map((stop, i) => 
      i === index ? { ...stop, ...updates } : stop
    );
    updateConfig({ stops: newStops });
  };

  return React.createElement('div', { className: 'gradient-editor' }, [
    // Gradient type selector
    React.createElement('div', { key: 'type', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Gradient Type'),
      React.createElement('select', {
        key: 'select',
        value: currentConfig.type,
        onChange: (e: any) => updateConfig({ type: e.target.value }),
        className: 'form-control'
      }, [
        React.createElement('option', { key: 'linear', value: 'linear' }, 'Linear'),
        React.createElement('option', { key: 'radial', value: 'radial' }, 'Radial'),
        React.createElement('option', { key: 'conic', value: 'conic' }, 'Conic')
      ])
    ]),

    // Angle control for linear gradients
    currentConfig.type === 'linear' && React.createElement('div', { key: 'angle', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, `Angle: ${currentConfig.angle || 0}°`),
      React.createElement('input', {
        key: 'input',
        type: 'range',
        min: 0,
        max: 360,
        value: currentConfig.angle || 0,
        onChange: (e: any) => updateConfig({ angle: parseInt(e.target.value) }),
        className: 'form-control'
      })
    ]),

    // Shape control for radial gradients
    currentConfig.type === 'radial' && React.createElement('div', { key: 'shape', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Shape'),
      React.createElement('select', {
        key: 'select',
        value: currentConfig.shape || 'circle',
        onChange: (e: any) => updateConfig({ shape: e.target.value }),
        className: 'form-control'
      }, [
        React.createElement('option', { key: 'circle', value: 'circle' }, 'Circle'),
        React.createElement('option', { key: 'ellipse', value: 'ellipse' }, 'Ellipse')
      ])
    ]),

    // Color stops
    React.createElement('div', { key: 'stops', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Color Stops'),
      React.createElement('div', { key: 'stops-list', className: 'gradient-stops' }, 
        currentConfig.stops.map((stop, index) =>
          React.createElement('div', { key: index, className: 'gradient-stop' }, [
            React.createElement('input', {
              key: 'color',
              type: 'color',
              value: stop.color,
              onChange: (e: any) => updateStop(index, { color: e.target.value }),
              className: 'form-control-sm'
            }),
            React.createElement('input', {
              key: 'position',
              type: 'range',
              min: 0,
              max: 100,
              value: stop.position,
              onChange: (e: any) => updateStop(index, { position: parseInt(e.target.value) }),
              className: 'form-control-sm'
            }),
            React.createElement('span', { key: 'percent' }, `${stop.position}%`),
            currentConfig.stops.length > 2 && React.createElement('button', {
              key: 'remove',
              onClick: () => removeStop(index),
              className: 'btn btn-sm btn-danger',
              title: 'Remove stop'
            }, '×')
          ])
        )
      ),
      React.createElement('button', {
        key: 'add-stop',
        onClick: addStop,
        className: 'btn btn-sm btn-primary'
      }, 'Add Color Stop')
    ]),

    // Gradient preview
    React.createElement('div', { key: 'preview', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Preview'),
      React.createElement('div', {
        key: 'preview-box',
        className: 'gradient-preview',
        style: {
          width: '100%',
          height: '60px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          backgroundImage: generateCSSGradient(currentConfig)
        }
      })
    ])
  ]);
}