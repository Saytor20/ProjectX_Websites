import React from 'react';
import { 
  PluginDefinition, 
  PluginContext, 
  ToolbarItem, 
  InspectorPanel 
} from '../PluginAPI';

/**
 * Animation Plugin - Add CSS animations and transitions to elements
 * Demonstrates tool plugin with CSS manipulation capabilities
 */

interface AnimationConfig {
  type: 'entrance' | 'emphasis' | 'exit' | 'transition';
  name: string;
  duration: number; // in milliseconds
  delay: number; // in milliseconds
  easing: string;
  iterations: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  trigger: 'immediate' | 'hover' | 'click' | 'scroll';
}

interface AnimationPreset {
  name: string;
  category: string;
  config: Partial<AnimationConfig>;
  keyframes: string;
}

const animationPresets: AnimationPreset[] = [
  // Entrance animations
  {
    name: 'Fade In',
    category: 'entrance',
    config: { type: 'entrance', duration: 600, easing: 'ease-out' },
    keyframes: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `
  },
  {
    name: 'Slide In Up',
    category: 'entrance',
    config: { type: 'entrance', duration: 600, easing: 'ease-out' },
    keyframes: `
      @keyframes slideInUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `
  },
  {
    name: 'Zoom In',
    category: 'entrance',
    config: { type: 'entrance', duration: 500, easing: 'ease-out' },
    keyframes: `
      @keyframes zoomIn {
        from { transform: scale(0.5); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `
  },
  {
    name: 'Bounce In',
    category: 'entrance',
    config: { type: 'entrance', duration: 1000, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    keyframes: `
      @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); opacity: 1; }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); }
      }
    `
  },
  // Emphasis animations
  {
    name: 'Pulse',
    category: 'emphasis',
    config: { type: 'emphasis', duration: 1000, iterations: 'infinite', easing: 'ease-in-out' },
    keyframes: `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `
  },
  {
    name: 'Shake',
    category: 'emphasis',
    config: { type: 'emphasis', duration: 500, easing: 'ease-in-out' },
    keyframes: `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `
  },
  {
    name: 'Glow',
    category: 'emphasis',
    config: { type: 'emphasis', duration: 2000, iterations: 'infinite', easing: 'ease-in-out' },
    keyframes: `
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
        50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6); }
      }
    `
  },
  // Exit animations
  {
    name: 'Fade Out',
    category: 'exit',
    config: { type: 'exit', duration: 600, easing: 'ease-in', fillMode: 'forwards' },
    keyframes: `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `
  },
  {
    name: 'Slide Out Down',
    category: 'exit',
    config: { type: 'exit', duration: 600, easing: 'ease-in', fillMode: 'forwards' },
    keyframes: `
      @keyframes slideOutDown {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(100%); opacity: 0; }
      }
    `
  }
];

const defaultAnimationConfig: AnimationConfig = {
  type: 'entrance',
  name: 'fadeIn',
  duration: 600,
  delay: 0,
  easing: 'ease-out',
  iterations: 1,
  direction: 'normal',
  fillMode: 'both',
  trigger: 'immediate'
};

export const AnimationPlugin: PluginDefinition = {
  id: 'animation-plugin',
  name: 'CSS Animations',
  version: '1.0.0',
  description: 'Add CSS animations and transitions to elements',
  author: 'Restaurant Website Generator Team',
  category: 'tool',
  icon: '⚡',
  permissions: ['dom:read', 'dom:write', 'storage:local'],
  
  api: {
    onActivate: async (context: PluginContext) => {
      console.log('Animation Plugin activated');
      
      // Initialize animation storage
      const savedAnimations = context.storage.local.get('animations');
      if (!savedAnimations) {
        context.storage.local.set('animations', JSON.stringify({}));
      }
      
      // Add animation keyframes and utilities
      addAnimationStyles();
      setupIntersectionObserver();
    },

    onDeactivate: async (context: PluginContext) => {
      console.log('Animation Plugin deactivated');
      removeAnimationStyles();
      cleanupIntersectionObserver();
    },

    onElementSelected: (element: HTMLElement, context: PluginContext) => {
      // Check if element has animations
      const animationId = element.getAttribute('data-animation-id');
      if (animationId) {
        loadAnimationForEditing(animationId, context);
      }
    },

    getToolbarItems: (context: PluginContext): ToolbarItem[] => [
      {
        id: 'add-animation',
        label: 'Animate',
        icon: '⚡',
        tooltip: 'Add animation to selected element',
        onClick: (context) => showAnimationPicker(context),
        disabled: context.getSelectedElements().length === 0
      },
      {
        id: 'animation-presets',
        label: 'Presets',
        icon: '🎭',
        tooltip: 'Choose from animation presets',
        type: 'dropdown',
        options: [
          {
            id: 'entrance',
            label: 'Entrance',
            onClick: (context) => showAnimationCategory('entrance', context)
          },
          {
            id: 'emphasis',
            label: 'Emphasis',
            onClick: (context) => showAnimationCategory('emphasis', context)
          },
          {
            id: 'exit',
            label: 'Exit',
            onClick: (context) => showAnimationCategory('exit', context)
          }
        ]
      },
      {
        id: 'play-animation',
        label: 'Play',
        icon: '▶️',
        tooltip: 'Play animation on selected element',
        onClick: (context) => playAnimationOnSelected(context),
        disabled: !hasSelectedElementWithAnimation(context)
      },
      {
        id: 'remove-animation',
        label: 'Remove',
        icon: '🗑️',
        tooltip: 'Remove animation from selected element',
        onClick: (context) => removeAnimationFromSelected(context),
        disabled: !hasSelectedElementWithAnimation(context)
      }
    ],

    getInspectorPanels: (element: HTMLElement, context: PluginContext): InspectorPanel[] => {
      const animationId = element.getAttribute('data-animation-id');
      if (!animationId) return [];

      return [
        {
          id: 'animation-config',
          title: 'Animation Settings',
          icon: '⚡',
          priority: 80,
          render: (context) => React.createElement(AnimationConfigPanel, {
            element,
            context,
            onUpdate: (config: AnimationConfig) => updateAnimation(element, config, context)
          })
        }
      ];
    }
  }
};

/**
 * Animation management functions
 */
function showAnimationPicker(context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  // Create animation picker modal
  const modal = createAnimationPickerModal(context, (preset: AnimationPreset) => {
    const element = selectedElements[0];
    const config: AnimationConfig = {
      ...defaultAnimationConfig,
      ...preset.config,
      name: preset.name.toLowerCase().replace(/\s+/g, '')
    };
    applyAnimationToElement(element, config, context);
    closeModal(modal);
  });
  
  document.body.appendChild(modal);
}

function showAnimationCategory(category: string, context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  const categoryPresets = animationPresets.filter(preset => preset.category === category);
  if (categoryPresets.length === 0) return;

  // Apply first preset from category
  const preset = categoryPresets[0];
  const element = selectedElements[0];
  const config: AnimationConfig = {
    ...defaultAnimationConfig,
    ...preset.config,
    name: preset.name.toLowerCase().replace(/\s+/g, '')
  };
  applyAnimationToElement(element, config, context);
}

function playAnimationOnSelected(context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  const element = selectedElements[0];
  const animationId = element.getAttribute('data-animation-id');
  if (!animationId) return;

  playAnimation(element);
}

function removeAnimationFromSelected(context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  const element = selectedElements[0];
  removeAnimationFromElement(element, context);
}

function hasSelectedElementWithAnimation(context: PluginContext): boolean {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return false;
  
  return selectedElements[0].hasAttribute('data-animation-id');
}

function applyAnimationToElement(element: HTMLElement, config: AnimationConfig, context: PluginContext): void {
  const animationId = generateAnimationId();
  element.setAttribute('data-animation-id', animationId);
  element.setAttribute('data-animation-name', config.name);
  element.setAttribute('data-animation-trigger', config.trigger);
  
  // Apply animation styles
  applyAnimationStyles(element, config);
  
  // Save configuration
  saveAnimationConfig(animationId, config, context);
  
  // Set up trigger
  setupAnimationTrigger(element, config);
}

function applyAnimationStyles(element: HTMLElement, config: AnimationConfig): void {
  const animationName = config.name;
  const duration = `${config.duration}ms`;
  const delay = `${config.delay}ms`;
  const easing = config.easing;
  const iterations = typeof config.iterations === 'number' ? config.iterations.toString() : config.iterations;
  const direction = config.direction;
  const fillMode = config.fillMode;

  element.style.animationName = animationName;
  element.style.animationDuration = duration;
  element.style.animationDelay = delay;
  element.style.animationTimingFunction = easing;
  element.style.animationIterationCount = iterations;
  element.style.animationDirection = direction;
  element.style.animationFillMode = fillMode;
  
  // Add animation class for easier targeting
  element.classList.add('animation-plugin-animated');
}

function setupAnimationTrigger(element: HTMLElement, config: AnimationConfig): void {
  switch (config.trigger) {
    case 'immediate':
      // Animation starts immediately
      break;
      
    case 'hover':
      element.style.animationPlayState = 'paused';
      element.addEventListener('mouseenter', () => {
        element.style.animationPlayState = 'running';
      });
      element.addEventListener('mouseleave', () => {
        element.style.animationPlayState = 'paused';
      });
      break;
      
    case 'click':
      element.style.animationPlayState = 'paused';
      element.addEventListener('click', () => {
        playAnimation(element);
      });
      break;
      
    case 'scroll':
      element.style.animationPlayState = 'paused';
      element.classList.add('animation-on-scroll');
      break;
  }
}

function playAnimation(element: HTMLElement): void {
  // Reset and replay animation
  element.style.animation = 'none';
  element.offsetHeight; // Trigger reflow
  
  const config = getElementAnimationConfig(element);
  if (config) {
    applyAnimationStyles(element, config);
  }
}

function updateAnimation(element: HTMLElement, config: AnimationConfig, context: PluginContext): void {
  const animationId = element.getAttribute('data-animation-id');
  if (!animationId) return;

  applyAnimationStyles(element, config);
  setupAnimationTrigger(element, config);
  saveAnimationConfig(animationId, config, context);
}

function removeAnimationFromElement(element: HTMLElement, context: PluginContext): void {
  const animationId = element.getAttribute('data-animation-id');
  if (animationId) {
    removeAnimationConfig(animationId, context);
  }
  
  // Remove animation styles
  element.style.animation = '';
  element.style.animationName = '';
  element.style.animationDuration = '';
  element.style.animationDelay = '';
  element.style.animationTimingFunction = '';
  element.style.animationIterationCount = '';
  element.style.animationDirection = '';
  element.style.animationFillMode = '';
  element.style.animationPlayState = '';
  
  // Remove attributes and classes
  element.removeAttribute('data-animation-id');
  element.removeAttribute('data-animation-name');
  element.removeAttribute('data-animation-trigger');
  element.classList.remove('animation-plugin-animated', 'animation-on-scroll');
}

function getElementAnimationConfig(element: HTMLElement): AnimationConfig | null {
  const animationName = element.getAttribute('data-animation-name');
  const trigger = element.getAttribute('data-animation-trigger') as AnimationConfig['trigger'];
  
  if (!animationName || !trigger) return null;
  
  return {
    type: 'entrance',
    name: animationName,
    duration: parseFloat(element.style.animationDuration) || 600,
    delay: parseFloat(element.style.animationDelay) || 0,
    easing: element.style.animationTimingFunction || 'ease-out',
    iterations: element.style.animationIterationCount === 'infinite' ? 'infinite' : parseInt(element.style.animationIterationCount) || 1,
    direction: element.style.animationDirection as AnimationConfig['direction'] || 'normal',
    fillMode: element.style.animationFillMode as AnimationConfig['fillMode'] || 'both',
    trigger
  };
}

function saveAnimationConfig(animationId: string, config: AnimationConfig, context: PluginContext): void {
  const savedAnimations = JSON.parse(context.storage.local.get('animations') || '{}');
  savedAnimations[animationId] = config;
  context.storage.local.set('animations', JSON.stringify(savedAnimations));
}

function removeAnimationConfig(animationId: string, context: PluginContext): void {
  const savedAnimations = JSON.parse(context.storage.local.get('animations') || '{}');
  delete savedAnimations[animationId];
  context.storage.local.set('animations', JSON.stringify(savedAnimations));
}

function loadAnimationForEditing(animationId: string, context: PluginContext): AnimationConfig | null {
  const savedAnimations = JSON.parse(context.storage.local.get('animations') || '{}');
  return savedAnimations[animationId] || null;
}

function generateAnimationId(): string {
  return `animation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

let intersectionObserver: IntersectionObserver | null = null;

function setupIntersectionObserver(): void {
  if (intersectionObserver) return;
  
  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        if (element.classList.contains('animation-on-scroll')) {
          element.style.animationPlayState = 'running';
        }
      }
    });
  }, { threshold: 0.1 });
  
  // Observe existing scroll-triggered animations
  document.querySelectorAll('.animation-on-scroll').forEach(element => {
    intersectionObserver!.observe(element);
  });
}

function cleanupIntersectionObserver(): void {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
}

function addAnimationStyles(): void {
  if (document.getElementById('animation-plugin-styles')) return;

  const keyframesCSS = animationPresets.map(preset => preset.keyframes).join('\n');
  
  const style = document.createElement('style');
  style.id = 'animation-plugin-styles';
  style.textContent = `
    ${keyframesCSS}
    
    .animation-plugin-animated {
      animation-play-state: running;
    }
    
    .animation-on-scroll {
      animation-play-state: paused;
    }
    
    /* Animation picker modal styles */
    .animation-picker-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    
    .animation-picker-content {
      background: white;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .animation-category {
      margin-bottom: 20px;
    }
    
    .animation-category h4 {
      margin-bottom: 10px;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }
    
    .animation-preset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 10px;
    }
    
    .animation-preset-item {
      padding: 15px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
    }
    
    .animation-preset-item:hover {
      background-color: #f5f5f5;
      border-color: #2196f3;
      transform: translateY(-2px);
    }
    
    .animation-preset-item.selected {
      background-color: #e3f2fd;
      border-color: #2196f3;
    }
  `;
  
  document.head.appendChild(style);
}

function removeAnimationStyles(): void {
  const style = document.getElementById('animation-plugin-styles');
  if (style) {
    style.remove();
  }
}

function createAnimationPickerModal(context: PluginContext, onSelect: (preset: AnimationPreset) => void): HTMLElement {
  const modal = document.createElement('div');
  modal.className = 'animation-picker-modal';
  
  const content = document.createElement('div');
  content.className = 'animation-picker-content';
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h3>Choose Animation</h3>
      <button onclick="this.closest('.animation-picker-modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
    </div>
  `;
  
  // Group presets by category
  const categories = Array.from(new Set(animationPresets.map(p => p.category)));
  
  categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'animation-category';
    
    const categoryTitle = document.createElement('h4');
    categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryDiv.appendChild(categoryTitle);
    
    const presetGrid = document.createElement('div');
    presetGrid.className = 'animation-preset-grid';
    
    const categoryPresets = animationPresets.filter(p => p.category === category);
    categoryPresets.forEach(preset => {
      const presetItem = document.createElement('div');
      presetItem.className = 'animation-preset-item';
      presetItem.textContent = preset.name;
      
      presetItem.onclick = () => {
        onSelect(preset);
      };
      
      presetGrid.appendChild(presetItem);
    });
    
    categoryDiv.appendChild(presetGrid);
    content.appendChild(categoryDiv);
  });
  
  modal.appendChild(content);
  return modal;
}

function closeModal(modal: HTMLElement): void {
  modal.remove();
}

/**
 * React Animation Configuration Panel
 */
interface AnimationConfigPanelProps {
  element: HTMLElement;
  context: PluginContext;
  onUpdate: (config: AnimationConfig) => void;
}

function AnimationConfigPanel({ element, context, onUpdate }: AnimationConfigPanelProps) {
  const animationId = element.getAttribute('data-animation-id');
  if (!animationId) return null;

  const currentConfig = loadAnimationForEditing(animationId, context) || getElementAnimationConfig(element) || defaultAnimationConfig;

  const updateConfig = (updates: Partial<AnimationConfig>) => {
    const newConfig = { ...currentConfig, ...updates };
    onUpdate(newConfig);
  };

  return React.createElement('div', { className: 'animation-config-panel' }, [
    React.createElement('div', { key: 'duration', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, `Duration: ${currentConfig.duration}ms`),
      React.createElement('input', {
        key: 'input',
        type: 'range',
        min: 100,
        max: 3000,
        step: 100,
        value: currentConfig.duration,
        onChange: (e: any) => updateConfig({ duration: parseInt(e.target.value) }),
        className: 'form-control'
      })
    ]),
    
    React.createElement('div', { key: 'delay', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, `Delay: ${currentConfig.delay}ms`),
      React.createElement('input', {
        key: 'input',
        type: 'range',
        min: 0,
        max: 2000,
        step: 100,
        value: currentConfig.delay,
        onChange: (e: any) => updateConfig({ delay: parseInt(e.target.value) }),
        className: 'form-control'
      })
    ]),
    
    React.createElement('div', { key: 'easing', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Easing'),
      React.createElement('select', {
        key: 'select',
        value: currentConfig.easing,
        onChange: (e: any) => updateConfig({ easing: e.target.value }),
        className: 'form-control'
      }, [
        React.createElement('option', { key: 'ease', value: 'ease' }, 'Ease'),
        React.createElement('option', { key: 'ease-in', value: 'ease-in' }, 'Ease In'),
        React.createElement('option', { key: 'ease-out', value: 'ease-out' }, 'Ease Out'),
        React.createElement('option', { key: 'ease-in-out', value: 'ease-in-out' }, 'Ease In Out'),
        React.createElement('option', { key: 'linear', value: 'linear' }, 'Linear'),
        React.createElement('option', { key: 'bounce', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }, 'Bounce')
      ])
    ]),
    
    React.createElement('div', { key: 'iterations', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Iterations'),
      React.createElement('select', {
        key: 'select',
        value: currentConfig.iterations.toString(),
        onChange: (e: any) => updateConfig({ 
          iterations: e.target.value === 'infinite' ? 'infinite' : parseInt(e.target.value) 
        }),
        className: 'form-control'
      }, [
        React.createElement('option', { key: '1', value: '1' }, '1'),
        React.createElement('option', { key: '2', value: '2' }, '2'),
        React.createElement('option', { key: '3', value: '3' }, '3'),
        React.createElement('option', { key: 'infinite', value: 'infinite' }, 'Infinite')
      ])
    ]),
    
    React.createElement('div', { key: 'trigger', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Trigger'),
      React.createElement('select', {
        key: 'select',
        value: currentConfig.trigger,
        onChange: (e: any) => updateConfig({ trigger: e.target.value }),
        className: 'form-control'
      }, [
        React.createElement('option', { key: 'immediate', value: 'immediate' }, 'Immediate'),
        React.createElement('option', { key: 'hover', value: 'hover' }, 'On Hover'),
        React.createElement('option', { key: 'click', value: 'click' }, 'On Click'),
        React.createElement('option', { key: 'scroll', value: 'scroll' }, 'On Scroll')
      ])
    ]),
    
    React.createElement('div', { key: 'controls', className: 'form-group' }, [
      React.createElement('button', {
        key: 'play',
        onClick: () => playAnimation(element),
        className: 'btn btn-sm btn-primary',
        style: { marginRight: '10px' }
      }, 'Play'),
      React.createElement('button', {
        key: 'change',
        onClick: () => showAnimationPicker(context),
        className: 'btn btn-sm btn-secondary'
      }, 'Change Animation')
    ])
  ]);
}