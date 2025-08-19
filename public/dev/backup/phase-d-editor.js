// Development Visual Editor - Phase D Features
// Enhanced visual editing with drag handles, token editor, and component mapping

class VisualEditor {
  constructor() {
    this.state = {
      editMode: false,
      selectedElement: null,
      dragHandles: [],
      tokenEditorOpen: false,
      componentMapperOpen: false,
      currentSkin: 'cafert-modern',
      tokens: null
    };

    this.dragState = {
      isDragging: false,
      startX: 0,
      startY: 0,
      handleType: null,
      originalRect: null
    };

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleElementClick = this.handleElementClick.bind(this);

    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    this.createEditorElements();
    this.bindEvents();
    this.loadCurrentTokens();
  }

  createEditorElements() {
    // Create editor panel
    this.editorPanel = document.createElement('div');
    this.editorPanel.className = 'visual-editor-panel';
    this.editorPanel.innerHTML = `
      <div class="editor-header">
        <h3>Visual Design Editor</h3>
        <button class="editor-toggle" data-action="toggle-edit">
          <span class="toggle-text">Enable Edit Mode</span>
        </button>
      </div>
      
      <div class="editor-controls">
        <div class="control-group">
          <label>Current Skin:</label>
          <select class="skin-selector">
            <option value="cafert-modern">Cafert Modern</option>
            <option value="bistly-modern">Bistly Modern</option>
            <option value="conbiz-premium">Conbiz Premium</option>
            <option value="foodera-modern">Foodera Modern</option>
            <option value="mehu-fresh">Mehu Fresh</option>
            <option value="quantum-nexus">Quantum Nexus</option>
          </select>
        </div>
        
        <button class="editor-btn" data-action="open-token-editor">
          🎨 Edit Design Tokens
        </button>
        
        <button class="editor-btn" data-action="open-component-mapper">
          🧩 Component Mapping
        </button>
        
        <button class="editor-btn" data-action="export-changes">
          💾 Export Changes
        </button>
      </div>
      
      <div class="selected-element-info" style="display: none;">
        <h4>Selected Element</h4>
        <div class="element-properties"></div>
      </div>
    `;
    
    document.body.appendChild(this.editorPanel);

    // Create token editor modal
    this.createTokenEditor();
    
    // Create component mapper modal
    this.createComponentMapper();
  }

  createTokenEditor() {
    this.tokenEditor = document.createElement('div');
    this.tokenEditor.className = 'token-editor-modal';
    this.tokenEditor.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Design Token Editor</h3>
          <button class="modal-close" data-action="close-token-editor">×</button>
        </div>
        
        <div class="token-categories">
          <div class="token-category" data-category="colors">
            <h4>Colors</h4>
            <div class="token-controls" id="color-controls"></div>
          </div>
          
          <div class="token-category" data-category="typography">
            <h4>Typography</h4>
            <div class="token-controls" id="typography-controls"></div>
          </div>
          
          <div class="token-category" data-category="spacing">
            <h4>Spacing</h4>
            <div class="token-controls" id="spacing-controls"></div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn-primary" data-action="apply-tokens">Apply Changes</button>
          <button class="btn-secondary" data-action="reset-tokens">Reset</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.tokenEditor);
  }

  createComponentMapper() {
    this.componentMapper = document.createElement('div');
    this.componentMapper.className = 'component-mapper-modal';
    this.componentMapper.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Component Mapping</h3>
          <button class="modal-close" data-action="close-component-mapper">×</button>
        </div>
        
        <div class="mapping-interface">
          <div class="component-list">
            <h4>Available Components</h4>
            <div class="component-items">
              <div class="component-item" data-component="Navbar">📱 Navbar</div>
              <div class="component-item" data-component="Hero">🎯 Hero</div>
              <div class="component-item" data-component="MenuList">📋 Menu List</div>
              <div class="component-item" data-component="Gallery">🖼️ Gallery</div>
              <div class="component-item" data-component="Hours">⏰ Hours</div>
              <div class="component-item" data-component="LocationMap">📍 Location</div>
              <div class="component-item" data-component="CTA">🎯 Call to Action</div>
              <div class="component-item" data-component="Footer">📄 Footer</div>
              <div class="component-item" data-component="RichText">📝 Rich Text</div>
              <div class="component-item" data-component="Section">📦 Section</div>
            </div>
          </div>
          
          <div class="mapping-preview">
            <h4>Component Preview</h4>
            <div class="preview-area">
              <p>Select a component to see its mapping options</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.componentMapper);
  }

  bindEvents() {
    // Editor panel events
    this.editorPanel.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      switch (action) {
        case 'toggle-edit':
          this.toggleEditMode();
          break;
        case 'open-token-editor':
          this.openTokenEditor();
          break;
        case 'open-component-mapper':
          this.openComponentMapper();
          break;
        case 'export-changes':
          this.exportChanges();
          break;
      }
    });

    // Skin selector
    const skinSelector = this.editorPanel.querySelector('.skin-selector');
    skinSelector.addEventListener('change', (e) => {
      this.switchSkin(e.target.value);
    });

    // Token editor events
    this.tokenEditor.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      switch (action) {
        case 'close-token-editor':
          this.closeTokenEditor();
          break;
        case 'apply-tokens':
          this.applyTokenChanges();
          break;
        case 'reset-tokens':
          this.resetTokens();
          break;
      }
    });

    // Component mapper events
    this.componentMapper.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      const component = e.target.dataset.component;
      
      if (action === 'close-component-mapper') {
        this.closeComponentMapper();
      } else if (component) {
        this.selectComponent(component);
      }
    });

    // Global mouse events for drag functionality
    document.addEventListener('mousedown', this.handleDragStart);
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleDragEnd);
  }

  toggleEditMode() {
    this.state.editMode = !this.state.editMode;
    const toggleBtn = this.editorPanel.querySelector('.editor-toggle');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    
    if (this.state.editMode) {
      toggleText.textContent = 'Disable Edit Mode';
      toggleBtn.classList.add('active');
      this.enableElementSelection();
      this.showEditModeOverlay();
    } else {
      toggleText.textContent = 'Enable Edit Mode';
      toggleBtn.classList.remove('active');
      this.disableElementSelection();
      this.hideEditModeOverlay();
    }
  }

  enableElementSelection() {
    document.addEventListener('click', this.handleElementClick);
    document.body.style.cursor = 'crosshair';
    
    // Add visual indicator that edit mode is active
    const indicator = document.createElement('div');
    indicator.className = 'edit-mode-indicator';
    indicator.textContent = 'EDIT MODE ACTIVE - Click elements to select';
    document.body.appendChild(indicator);
  }

  disableElementSelection() {
    document.removeEventListener('click', this.handleElementClick);
    document.body.style.cursor = '';
    this.clearSelection();
    
    const indicator = document.querySelector('.edit-mode-indicator');
    if (indicator) indicator.remove();
  }

  handleElementClick(e) {
    if (!this.state.editMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Don't select editor elements
    if (e.target.closest('.visual-editor-panel') || 
        e.target.closest('.token-editor-modal') || 
        e.target.closest('.component-mapper-modal')) {
      return;
    }
    
    this.selectElement(e.target);
  }

  selectElement(element) {
    this.clearSelection();
    this.state.selectedElement = element;
    
    // Highlight selected element
    element.classList.add('editor-selected');
    
    // Create drag handles
    this.createDragHandles(element);
    
    // Show element info
    this.showElementInfo(element);
  }

  createDragHandles(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const scrollLeft = window.pageXOffset;
    
    // Clear existing handles
    this.clearDragHandles();
    
    // Handle positions (corners and midpoints)
    const handles = [
      { type: 'nw', x: rect.left + scrollLeft, y: rect.top + scrollTop },
      { type: 'n', x: rect.left + rect.width/2 + scrollLeft, y: rect.top + scrollTop },
      { type: 'ne', x: rect.right + scrollLeft, y: rect.top + scrollTop },
      { type: 'e', x: rect.right + scrollLeft, y: rect.top + rect.height/2 + scrollTop },
      { type: 'se', x: rect.right + scrollLeft, y: rect.bottom + scrollTop },
      { type: 's', x: rect.left + rect.width/2 + scrollLeft, y: rect.bottom + scrollTop },
      { type: 'sw', x: rect.left + scrollLeft, y: rect.bottom + scrollTop },
      { type: 'w', x: rect.left + scrollLeft, y: rect.top + rect.height/2 + scrollTop }
    ];
    
    handles.forEach(handle => {
      const handleEl = document.createElement('div');
      handleEl.className = `drag-handle drag-handle-${handle.type}`;
      handleEl.style.left = `${handle.x - 4}px`;
      handleEl.style.top = `${handle.y - 4}px`;
      handleEl.dataset.handleType = handle.type;
      
      document.body.appendChild(handleEl);
      this.state.dragHandles.push(handleEl);
    });
  }

  handleDragStart(e) {
    const handle = e.target.closest('.drag-handle');
    if (!handle || !this.state.selectedElement) return;
    
    this.dragState.isDragging = true;
    this.dragState.startX = e.clientX;
    this.dragState.startY = e.clientY;
    this.dragState.handleType = handle.dataset.handleType;
    this.dragState.originalRect = this.state.selectedElement.getBoundingClientRect();
    
    e.preventDefault();
  }

  handleDrag(e) {
    if (!this.dragState.isDragging) return;
    
    const deltaX = e.clientX - this.dragState.startX;
    const deltaY = e.clientY - this.dragState.startY;
    
    // Update element dimensions based on handle type
    this.updateElementDimensions(deltaX, deltaY);
    
    // Update drag handles positions
    this.createDragHandles(this.state.selectedElement);
  }

  handleDragEnd(e) {
    if (!this.dragState.isDragging) return;
    
    this.dragState.isDragging = false;
    this.dragState.handleType = null;
    this.dragState.originalRect = null;
  }

  updateElementDimensions(deltaX, deltaY) {
    const element = this.state.selectedElement;
    const handleType = this.dragState.handleType;
    const rect = this.dragState.originalRect;
    
    let newWidth = rect.width;
    let newHeight = rect.height;
    
    switch (handleType) {
      case 'e':
      case 'ne':
      case 'se':
        newWidth = rect.width + deltaX;
        break;
      case 'w':
      case 'nw':
      case 'sw':
        newWidth = rect.width - deltaX;
        break;
    }
    
    switch (handleType) {
      case 's':
      case 'se':
      case 'sw':
        newHeight = rect.height + deltaY;
        break;
      case 'n':
      case 'ne':
      case 'nw':
        newHeight = rect.height - deltaY;
        break;
    }
    
    // Apply new dimensions
    if (newWidth > 20) element.style.width = `${newWidth}px`;
    if (newHeight > 20) element.style.height = `${newHeight}px`;
  }

  showElementInfo(element) {
    const infoPanel = this.editorPanel.querySelector('.selected-element-info');
    const propertiesDiv = infoPanel.querySelector('.element-properties');
    
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    propertiesDiv.innerHTML = `
      <div class="property">
        <label>Tag:</label>
        <span>${element.tagName.toLowerCase()}</span>
      </div>
      <div class="property">
        <label>Classes:</label>
        <span>${element.className || 'none'}</span>
      </div>
      <div class="property">
        <label>Dimensions:</label>
        <span>${Math.round(rect.width)}px × ${Math.round(rect.height)}px</span>
      </div>
      <div class="property">
        <label>Position:</label>
        <span>${Math.round(rect.left)}px, ${Math.round(rect.top)}px</span>
      </div>
      <div class="property">
        <label>Background:</label>
        <input type="color" value="${this.rgbToHex(computedStyle.backgroundColor)}" 
               data-property="backgroundColor">
      </div>
      <div class="property">
        <label>Color:</label>
        <input type="color" value="${this.rgbToHex(computedStyle.color)}" 
               data-property="color">
      </div>
      <div class="property">
        <label>Font Size:</label>
        <input type="range" min="8" max="72" value="${parseInt(computedStyle.fontSize)}" 
               data-property="fontSize">
        <span>${computedStyle.fontSize}</span>
      </div>
    `;
    
    // Bind property change events
    propertiesDiv.addEventListener('input', (e) => {
      const property = e.target.dataset.property;
      if (property) {
        let value = e.target.value;
        if (property === 'fontSize') value += 'px';
        element.style[property] = value;
      }
    });
    
    infoPanel.style.display = 'block';
  }

  clearSelection() {
    if (this.state.selectedElement) {
      this.state.selectedElement.classList.remove('editor-selected');
      this.state.selectedElement = null;
    }
    this.clearDragHandles();
    
    const infoPanel = this.editorPanel.querySelector('.selected-element-info');
    infoPanel.style.display = 'none';
  }

  clearDragHandles() {
    this.state.dragHandles.forEach(handle => handle.remove());
    this.state.dragHandles = [];
  }

  async loadCurrentTokens() {
    try {
      const response = await fetch(`/skins/${this.state.currentSkin}/tokens.json`);
      this.state.tokens = await response.json();
    } catch (error) {
      console.warn('Could not load tokens:', error);
      this.state.tokens = {};
    }
  }

  openTokenEditor() {
    this.state.tokenEditorOpen = true;
    this.tokenEditor.style.display = 'flex';
    this.populateTokenEditor();
  }

  closeTokenEditor() {
    this.state.tokenEditorOpen = false;
    this.tokenEditor.style.display = 'none';
  }

  populateTokenEditor() {
    if (!this.state.tokens) return;
    
    // Populate color controls
    const colorControls = document.getElementById('color-controls');
    if (this.state.tokens.colors) {
      colorControls.innerHTML = '';
      Object.entries(this.state.tokens.colors).forEach(([key, value]) => {
        if (typeof value === 'string' && value.startsWith('#')) {
          const control = document.createElement('div');
          control.className = 'token-control';
          control.innerHTML = `
            <label>${key}:</label>
            <input type="color" value="${value}" data-token="colors.${key}">
            <span class="token-value">${value}</span>
          `;
          colorControls.appendChild(control);
        }
      });
    }
    
    // Populate typography controls
    const typographyControls = document.getElementById('typography-controls');
    if (this.state.tokens.fonts) {
      typographyControls.innerHTML = '';
      Object.entries(this.state.tokens.fonts).forEach(([key, value]) => {
        const control = document.createElement('div');
        control.className = 'token-control';
        control.innerHTML = `
          <label>${key}:</label>
          <input type="text" value="${value}" data-token="fonts.${key}">
        `;
        typographyControls.appendChild(control);
      });
    }
    
    // Populate spacing controls
    const spacingControls = document.getElementById('spacing-controls');
    if (this.state.tokens.spacing) {
      spacingControls.innerHTML = '';
      Object.entries(this.state.tokens.spacing).forEach(([key, value]) => {
        const control = document.createElement('div');
        control.className = 'token-control';
        control.innerHTML = `
          <label>${key}:</label>
          <input type="text" value="${value}" data-token="spacing.${key}">
        `;
        spacingControls.appendChild(control);
      });
    }
  }

  applyTokenChanges() {
    const inputs = this.tokenEditor.querySelectorAll('input[data-token]');
    const changes = {};
    
    inputs.forEach(input => {
      const tokenPath = input.dataset.token.split('.');
      const value = input.value;
      
      if (!changes[tokenPath[0]]) changes[tokenPath[0]] = {};
      changes[tokenPath[0]][tokenPath[1]] = value;
    });
    
    // Update tokens object
    Object.assign(this.state.tokens, changes);
    
    // Save changes and rebuild
    this.saveTokenChanges(changes);
  }

  async saveTokenChanges(changes) {
    try {
      // Update the tokens.json file via API
      const response = await fetch('/api/tokens/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skin: this.state.currentSkin,
          tokens: this.state.tokens
        })
      });
      
      if (response.ok) {
        console.log('Tokens updated successfully');
        // Trigger hot reload would happen automatically via watcher
      }
    } catch (error) {
      console.error('Failed to save token changes:', error);
    }
  }

  openComponentMapper() {
    this.state.componentMapperOpen = true;
    this.componentMapper.style.display = 'flex';
  }

  closeComponentMapper() {
    this.state.componentMapperOpen = false;
    this.componentMapper.style.display = 'none';
  }

  selectComponent(componentName) {
    const previewArea = this.componentMapper.querySelector('.preview-area');
    previewArea.innerHTML = `
      <h5>${componentName} Component</h5>
      <p>Component mapping for ${componentName} will show here.</p>
      <div class="component-props">
        <h6>Available Props:</h6>
        <ul>
          <li>id: string</li>
          <li>variant?: string</li>
          <li>theme?: ThemeVariant</li>
          <li>layout?: LayoutOptions</li>
          <li>data: ComponentData</li>
          <li>className?: string</li>
        </ul>
      </div>
    `;
  }

  switchSkin(skinName) {
    this.state.currentSkin = skinName;
    this.loadCurrentTokens();
    
    // Update the data-skin attribute on the body
    document.body.setAttribute('data-skin', skinName);
  }

  exportChanges() {
    const changes = {
      skin: this.state.currentSkin,
      tokens: this.state.tokens,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(changes, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.state.currentSkin}-changes.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  showEditModeOverlay() {
    // Visual overlay to indicate edit mode is active
    const overlay = document.createElement('div');
    overlay.className = 'edit-mode-overlay';
    document.body.appendChild(overlay);
  }

  hideEditModeOverlay() {
    const overlay = document.querySelector('.edit-mode-overlay');
    if (overlay) overlay.remove();
  }

  rgbToHex(rgb) {
    // Convert rgb() to hex format
    if (!rgb || rgb === 'transparent') return '#000000';
    
    const match = rgb.match(/\d+/g);
    if (!match) return '#000000';
    
    return '#' + match.slice(0, 3).map(x => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
}

// Initialize Phase D Visual Editor
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.visualEditor = new VisualEditor();
  });
}