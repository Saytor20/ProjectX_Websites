import React from 'react';
import { 
  PluginDefinition, 
  PluginContext, 
  ToolbarItem, 
  InspectorPanel 
} from '../PluginAPI';

/**
 * Icon Library Plugin - Integrate popular icon libraries
 * Demonstrates utility plugin with external resource integration
 */

interface IconConfig {
  library: 'heroicons' | 'feather' | 'lucide' | 'phosphor';
  name: string;
  size: number;
  color: string;
  style?: 'outline' | 'solid' | 'mini'; // for heroicons
  strokeWidth?: number; // for outline icons
}

interface IconLibrary {
  name: string;
  id: string;
  cdnUrl: string;
  icons: IconDefinition[];
}

interface IconDefinition {
  name: string;
  category: string;
  tags: string[];
  svg: string;
}

const iconLibraries: IconLibrary[] = [
  {
    name: 'Heroicons',
    id: 'heroicons',
    cdnUrl: 'https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/outline/',
    icons: [
      {
        name: 'home',
        category: 'general',
        tags: ['house', 'building', 'main'],
        svg: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.25-8.25a1.125 1.125 0 0 1 1.59 0L20.25 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>'
      },
      {
        name: 'heart',
        category: 'general',
        tags: ['love', 'like', 'favorite'],
        svg: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>'
      },
      {
        name: 'star',
        category: 'general',
        tags: ['rating', 'favorite', 'bookmark'],
        svg: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>'
      },
      {
        name: 'phone',
        category: 'communication',
        tags: ['call', 'contact', 'telephone'],
        svg: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>'
      },
      {
        name: 'envelope',
        category: 'communication',
        tags: ['email', 'mail', 'message'],
        svg: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>'
      },
      {
        name: 'clock',
        category: 'time',
        tags: ['time', 'schedule', 'hours'],
        svg: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>'
      },
      {
        name: 'map-pin',
        category: 'location',
        tags: ['location', 'address', 'place'],
        svg: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>'
      },
      {
        name: 'shopping-cart',
        category: 'e-commerce',
        tags: ['cart', 'shopping', 'buy'],
        svg: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>'
      }
    ]
  }
];

const defaultIconConfig: IconConfig = {
  library: 'heroicons',
  name: 'heart',
  size: 24,
  color: 'currentColor',
  style: 'outline',
  strokeWidth: 1.5
};

export const IconPlugin: PluginDefinition = {
  id: 'icon-plugin',
  name: 'Icon Library',
  version: '1.0.0',
  description: 'Add icons from popular libraries (Heroicons, Feather, Lucide, Phosphor)',
  author: 'Restaurant Website Generator Team',
  category: 'component',
  icon: '🎯',
  permissions: ['dom:read', 'dom:write', 'storage:local'],
  
  api: {
    onActivate: async (context: PluginContext) => {
      console.log('Icon Plugin activated');
      
      // Initialize icon storage
      const savedIcons = context.storage.local.get('icons');
      if (!savedIcons) {
        context.storage.local.set('icons', JSON.stringify({}));
      }
      
      // Add icon styles
      addIconStyles();
    },

    onDeactivate: async (context: PluginContext) => {
      console.log('Icon Plugin deactivated');
      removeIconStyles();
    },

    onElementSelected: (element: HTMLElement, context: PluginContext) => {
      // Check if element is an icon
      if (element.classList.contains('icon-plugin-icon')) {
        const iconId = element.getAttribute('data-icon-id');
        if (iconId) {
          loadIconForEditing(iconId, context);
        }
      }
    },

    getToolbarItems: (context: PluginContext): ToolbarItem[] => [
      {
        id: 'add-icon',
        label: 'Add Icon',
        icon: '🎯',
        tooltip: 'Add an icon to the selected element',
        onClick: (context) => showIconPicker(context),
        disabled: context.getSelectedElements().length === 0
      },
      {
        id: 'icon-library',
        label: 'Libraries',
        icon: '📚',
        tooltip: 'Choose icon library',
        type: 'dropdown',
        options: iconLibraries.map(lib => ({
          id: lib.id,
          label: lib.name,
          onClick: (context) => switchIconLibrary(lib.id, context)
        }))
      },
      {
        id: 'remove-icon',
        label: 'Remove Icon',
        icon: '🗑️',
        tooltip: 'Remove icon from selected element',
        onClick: (context) => removeIconFromSelected(context),
        disabled: !hasSelectedIcon(context)
      }
    ],

    getInspectorPanels: (element: HTMLElement, context: PluginContext): InspectorPanel[] => {
      if (!element.classList.contains('icon-plugin-icon')) return [];

      return [
        {
          id: 'icon-config',
          title: 'Icon Settings',
          icon: '🎯',
          priority: 85,
          render: (context) => React.createElement(IconConfigPanel, {
            element,
            context,
            onUpdate: (config: IconConfig) => updateIcon(element, config, context)
          })
        }
      ];
    }
  }
};

/**
 * Icon management functions
 */
function showIconPicker(context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  // Create and show icon picker modal
  const modal = createIconPickerModal(context, (iconConfig: IconConfig) => {
    const element = selectedElements[0];
    addIconToElement(element, iconConfig, context);
    closeModal(modal);
  });
  
  document.body.appendChild(modal);
}

function addIconToElement(element: HTMLElement, config: IconConfig, context: PluginContext): void {
  const iconElement = createIconElement(config);
  
  // Insert icon based on element type
  if (element.children.length === 0) {
    element.appendChild(iconElement);
  } else {
    element.insertBefore(iconElement, element.firstChild);
  }
  
  saveIconConfig(iconElement, config, context);
}

function removeIconFromSelected(context: PluginContext): void {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return;

  const element = selectedElements[0];
  const iconElement = element.querySelector('.icon-plugin-icon');
  if (iconElement) {
    const iconId = iconElement.getAttribute('data-icon-id');
    if (iconId) {
      removeIconConfig(iconId, context);
    }
    iconElement.remove();
  }
}

function hasSelectedIcon(context: PluginContext): boolean {
  const selectedElements = context.getSelectedElements();
  if (selectedElements.length === 0) return false;
  
  return selectedElements[0].querySelector('.icon-plugin-icon') !== null;
}

function createIconElement(config: IconConfig): HTMLElement {
  const iconId = generateIconId();
  const wrapper = document.createElement('span');
  wrapper.className = 'icon-plugin-icon';
  wrapper.setAttribute('data-icon-id', iconId);
  wrapper.setAttribute('data-icon-name', config.name);
  wrapper.setAttribute('data-icon-library', config.library);
  
  const iconSvg = getIconSvg(config);
  wrapper.innerHTML = iconSvg;
  
  applyIconStyles(wrapper, config);
  
  return wrapper;
}

function getIconSvg(config: IconConfig): string {
  const library = iconLibraries.find(lib => lib.id === config.library);
  if (!library) return '';
  
  const icon = library.icons.find(icon => icon.name === config.name);
  if (!icon) return '';
  
  let svg = icon.svg;
  
  // Update SVG attributes based on config
  svg = svg.replace(/stroke-width="[^"]*"/, `stroke-width="${config.strokeWidth || 1.5}"`);
  svg = svg.replace(/stroke="[^"]*"/, `stroke="${config.color}"`);
  svg = svg.replace(/fill="[^"]*"/, config.style === 'solid' ? `fill="${config.color}"` : 'fill="none"');
  
  return svg;
}

function applyIconStyles(element: HTMLElement, config: IconConfig): void {
  Object.assign(element.style, {
    display: 'inline-block',
    width: `${config.size}px`,
    height: `${config.size}px`,
    color: config.color,
    verticalAlign: 'middle'
  });
  
  const svg = element.querySelector('svg');
  if (svg) {
    Object.assign(svg.style, {
      width: '100%',
      height: '100%'
    });
  }
}

function updateIcon(element: HTMLElement, config: IconConfig, context: PluginContext): void {
  const iconId = element.getAttribute('data-icon-id');
  if (!iconId) return;

  // Update the icon
  const iconSvg = getIconSvg(config);
  element.innerHTML = iconSvg;
  applyIconStyles(element, config);
  
  // Update attributes
  element.setAttribute('data-icon-name', config.name);
  element.setAttribute('data-icon-library', config.library);
  
  saveIconConfig(element, config, context);
}

function saveIconConfig(element: HTMLElement, config: IconConfig, context: PluginContext): void {
  const iconId = element.getAttribute('data-icon-id') || generateIconId();
  element.setAttribute('data-icon-id', iconId);
  
  const savedIcons = JSON.parse(context.storage.local.get('icons') || '{}');
  savedIcons[iconId] = config;
  context.storage.local.set('icons', JSON.stringify(savedIcons));
}

function removeIconConfig(iconId: string, context: PluginContext): void {
  const savedIcons = JSON.parse(context.storage.local.get('icons') || '{}');
  delete savedIcons[iconId];
  context.storage.local.set('icons', JSON.stringify(savedIcons));
}

function loadIconForEditing(iconId: string, context: PluginContext): IconConfig | null {
  const savedIcons = JSON.parse(context.storage.local.get('icons') || '{}');
  return savedIcons[iconId] || null;
}

function switchIconLibrary(libraryId: string, context: PluginContext): void {
  // Store the selected library preference
  context.storage.local.set('selectedIconLibrary', libraryId);
}

function generateIconId(): string {
  return `icon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function addIconStyles(): void {
  if (document.getElementById('icon-plugin-styles')) return;

  const style = document.createElement('style');
  style.id = 'icon-plugin-styles';
  style.textContent = `
    .icon-plugin-icon {
      display: inline-block;
      line-height: 1;
      flex-shrink: 0;
    }
    
    .icon-plugin-icon svg {
      display: block;
    }
    
    .icon-plugin-icon:hover {
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }
    
    /* Icon picker modal styles */
    .icon-picker-modal {
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
    
    .icon-picker-content {
      background: white;
      border-radius: 8px;
      padding: 20px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      gap: 10px;
      margin-top: 20px;
    }
    
    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .icon-item:hover {
      background-color: #f5f5f5;
    }
    
    .icon-item.selected {
      background-color: #e3f2fd;
      border-color: #2196f3;
    }
    
    .icon-item svg {
      width: 24px;
      height: 24px;
      margin-bottom: 5px;
    }
    
    .icon-item-name {
      font-size: 10px;
      text-align: center;
      word-break: break-word;
    }
  `;
  
  document.head.appendChild(style);
}

function removeIconStyles(): void {
  const style = document.getElementById('icon-plugin-styles');
  if (style) {
    style.remove();
  }
}

function createIconPickerModal(context: PluginContext, onSelect: (config: IconConfig) => void): HTMLElement {
  const modal = document.createElement('div');
  modal.className = 'icon-picker-modal';
  
  const content = document.createElement('div');
  content.className = 'icon-picker-content';
  
  const header = document.createElement('div');
  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h3>Choose an Icon</h3>
      <button onclick="this.closest('.icon-picker-modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
    </div>
  `;
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search icons...';
  searchInput.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px;';
  
  const iconGrid = document.createElement('div');
  iconGrid.className = 'icon-grid';
  
  const selectedLibrary = context.storage.local.get('selectedIconLibrary') || 'heroicons';
  const library = iconLibraries.find(lib => lib.id === selectedLibrary) || iconLibraries[0];
  
  let selectedIcon: IconDefinition | null = null;
  
  const renderIcons = (filter = '') => {
    iconGrid.innerHTML = '';
    const filteredIcons = library.icons.filter(icon => 
      icon.name.toLowerCase().includes(filter.toLowerCase()) ||
      icon.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );
    
    filteredIcons.forEach(icon => {
      const iconItem = document.createElement('div');
      iconItem.className = 'icon-item';
      iconItem.innerHTML = `
        ${icon.svg}
        <div class="icon-item-name">${icon.name}</div>
      `;
      
      iconItem.onclick = () => {
        document.querySelectorAll('.icon-item').forEach(item => item.classList.remove('selected'));
        iconItem.classList.add('selected');
        selectedIcon = icon;
      };
      
      iconGrid.appendChild(iconItem);
    });
  };
  
  searchInput.oninput = (e) => {
    renderIcons((e.target as HTMLInputElement).value);
  };
  
  const footer = document.createElement('div');
  footer.innerHTML = `
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button onclick="this.closest('.icon-picker-modal').remove()" style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Cancel</button>
      <button id="select-icon-btn" style="padding: 8px 16px; border: none; background: #2196f3; color: white; border-radius: 4px; cursor: pointer;" disabled>Select Icon</button>
    </div>
  `;
  
  const selectBtn = footer.querySelector('#select-icon-btn') as HTMLButtonElement;
  selectBtn.onclick = () => {
    if (selectedIcon) {
      const iconConfig: IconConfig = {
        ...defaultIconConfig,
        library: library.id as any,
        name: selectedIcon.name
      };
      onSelect(iconConfig);
    }
  };
  
  // Enable/disable select button based on selection
  const updateSelectButton = () => {
    selectBtn.disabled = !selectedIcon;
  };
  
  content.appendChild(header);
  content.appendChild(searchInput);
  content.appendChild(iconGrid);
  content.appendChild(footer);
  modal.appendChild(content);
  
  renderIcons();
  
  return modal;
}

function closeModal(modal: HTMLElement): void {
  modal.remove();
}

/**
 * React Icon Configuration Panel
 */
interface IconConfigPanelProps {
  element: HTMLElement;
  context: PluginContext;
  onUpdate: (config: IconConfig) => void;
}

function IconConfigPanel({ element, context, onUpdate }: IconConfigPanelProps) {
  const iconId = element.getAttribute('data-icon-id');
  if (!iconId) return null;

  const currentConfig = loadIconForEditing(iconId, context) || defaultIconConfig;

  const updateConfig = (updates: Partial<IconConfig>) => {
    const newConfig = { ...currentConfig, ...updates };
    onUpdate(newConfig);
  };

  return React.createElement('div', { className: 'icon-config-panel' }, [
    React.createElement('div', { key: 'size', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, `Size: ${currentConfig.size}px`),
      React.createElement('input', {
        key: 'input',
        type: 'range',
        min: 12,
        max: 64,
        value: currentConfig.size,
        onChange: (e: any) => updateConfig({ size: parseInt(e.target.value) }),
        className: 'form-control'
      })
    ]),
    
    React.createElement('div', { key: 'color', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Color'),
      React.createElement('input', {
        key: 'input',
        type: 'color',
        value: currentConfig.color === 'currentColor' ? '#000000' : currentConfig.color,
        onChange: (e: any) => updateConfig({ color: e.target.value }),
        className: 'form-control'
      })
    ]),
    
    currentConfig.library === 'heroicons' && React.createElement('div', { key: 'style', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, 'Style'),
      React.createElement('select', {
        key: 'select',
        value: currentConfig.style || 'outline',
        onChange: (e: any) => updateConfig({ style: e.target.value }),
        className: 'form-control'
      }, [
        React.createElement('option', { key: 'outline', value: 'outline' }, 'Outline'),
        React.createElement('option', { key: 'solid', value: 'solid' }, 'Solid')
      ])
    ]),
    
    (currentConfig.style === 'outline' || !currentConfig.style) && React.createElement('div', { key: 'stroke', className: 'form-group' }, [
      React.createElement('label', { key: 'label' }, `Stroke Width: ${currentConfig.strokeWidth || 1.5}`),
      React.createElement('input', {
        key: 'input',
        type: 'range',
        min: 0.5,
        max: 3,
        step: 0.1,
        value: currentConfig.strokeWidth || 1.5,
        onChange: (e: any) => updateConfig({ strokeWidth: parseFloat(e.target.value) }),
        className: 'form-control'
      })
    ]),
    
    React.createElement('div', { key: 'change', className: 'form-group' }, [
      React.createElement('button', {
        key: 'button',
        onClick: () => showIconPicker(context),
        className: 'btn btn-sm btn-primary',
        style: { width: '100%' }
      }, 'Change Icon')
    ])
  ]);
}