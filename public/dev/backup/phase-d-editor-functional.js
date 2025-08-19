// Functional Visual Editor - Phase D Complete Implementation
// All features working: drag handles, token editor, component mapping, on-demand commands

class FunctionalVisualEditor {
  constructor() {
    this.state = {
      editMode: false,
      selectedElement: null,
      dragHandles: [],
      tokenEditorOpen: false,
      componentMapperOpen: false,
      currentSkin: 'cafert-modern',
      tokens: null,
      isLoading: false
    };

    this.dragState = {
      isDragging: false,
      startX: 0,
      startY: 0,
      handleType: null,
      originalRect: null,
      originalStyles: null
    };

    // Performance optimization variables
    this.debounceTimers = {};
    this.throttleTimers = {};
    this.animationFrame = null;

    // Bind methods
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleElementClick = this.handleElementClick.bind(this);

    this.init();
  }
  
  // Performance helper methods
  debounce(func, delay, key) {
    clearTimeout(this.debounceTimers[key]);
    this.debounceTimers[key] = setTimeout(func, delay);
  }
  
  throttle(func, delay, key) {
    if (!this.throttleTimers[key]) {
      this.throttleTimers[key] = true;
      setTimeout(() => {
        func();
        this.throttleTimers[key] = false;
      }, delay);
    }
  }
  
  requestFrame(func) {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.animationFrame = requestAnimationFrame(func);
  }

  init() {
    if (typeof window === 'undefined') return;
    
    // Cleanup existing instance if any
    this.cleanup();

    this.createEditorElements();
    this.bindEvents();
    this.loadCurrentTokens();
    this.detectCurrentSkin();
  }
  
  cleanup() {
    // Remove existing editor panel
    const existingPanel = document.querySelector('.visual-editor-panel');
    if (existingPanel) {
      existingPanel.remove();
    }
    
    // Remove existing modals
    const existingTokenEditor = document.querySelector('.token-editor-modal');
    if (existingTokenEditor) {
      existingTokenEditor.remove();
    }
    
    const existingComponentMapper = document.querySelector('.component-mapper-modal');
    if (existingComponentMapper) {
      existingComponentMapper.remove();
    }
    
    const existingSitePreview = document.querySelector('.site-preview-modal');
    if (existingSitePreview) {
      existingSitePreview.remove();
    }
    
    // Clear drag handles
    document.querySelectorAll('.drag-handle').forEach(handle => handle.remove());
    
    // Clear selections
    document.querySelectorAll('.editor-selected').forEach(el => {
      el.classList.remove('editor-selected');
    });
    
    // Remove global event listeners
    document.removeEventListener('click', this.handleElementClick, true);
    document.removeEventListener('mousedown', this.handleDragStart);
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);
  }

  detectCurrentSkin() {
    // Try to detect current skin from body data attribute
    const bodyDataSkin = document.body.getAttribute('data-skin');
    if (bodyDataSkin) {
      this.state.currentSkin = bodyDataSkin;
      const skinSelector = this.editorPanel.querySelector('.skin-selector');
      if (skinSelector) {
        skinSelector.value = bodyDataSkin;
      }
    }
  }

  createEditorElements() {
    // Prevent multiple instances
    if (document.querySelector('.visual-editor-panel')) {
      return;
    }
    
    // Create editor panel with enhanced functionality
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
        <!-- Template Selection -->
        <div class="editor-section">
          <h4>🎨 Template</h4>
          <select class="skin-selector">
            <option value="cafert-modern">Cafert Modern</option>
            <option value="bistly-modern">Bistly Modern</option>
            <option value="conbiz-premium">Conbiz Premium</option>
            <option value="foodera-modern">Foodera Modern</option>
            <option value="mehu-fresh">Mehu Fresh</option>
            <option value="quantum-nexus">Quantum Nexus</option>
          </select>
        </div>
        
        <!-- Shape Creation -->
        <div class="editor-section">
          <h4>🔷 Add Elements</h4>
          <div class="shape-grid">
            <button class="shape-create-btn" data-shape="rectangle">⬜ Box</button>
            <button class="shape-create-btn" data-shape="circle">⭕ Circle</button>
            <button class="shape-create-btn" data-shape="text">📝 Text</button>
            <button class="shape-create-btn" data-shape="image">🖼️ Image</button>
          </div>
          <div class="shape-controls">
            <div class="control-row">
              <label>Color:</label>
              <input type="color" id="new-shape-color" value="#ff6b35">
            </div>
            <div class="control-row">
              <label>Size:</label>
              <input type="range" id="new-shape-size" min="50" max="300" value="100">
              <span id="new-shape-size-value">100px</span>
            </div>
          </div>
          <input type="file" id="image-upload" accept="image/*" style="display: none;">
        </div>
        
        <!-- Hidden file input for element image uploads -->
        <input type="file" id="element-image-upload" accept="image/*" style="display: none;">
        
        <!-- Element Editor (shows when element selected) -->
        <div class="editor-section element-editor" style="display: none;">
          <h4>✏️ Edit Selected</h4>
          <div class="editing-controls">
            <div class="control-row">
              <button class="edit-btn" data-action="edit-text">📝 Edit Text</button>
              <input type="color" class="inline-color-picker" data-property="color" title="Text Color">
            </div>
            <div class="control-row">
              <label>Background:</label>
              <input type="color" class="inline-color-picker" data-property="backgroundColor" title="Background">
              <button class="edit-btn small" data-action="remove-background">🚫</button>
            </div>
            <div class="control-row">
              <label>Size:</label>
              <input type="range" class="inline-slider" data-property="fontSize" min="8" max="72">
              <span class="inline-value">16px</span>
            </div>
            <div class="control-row">
              <label>W:</label>
              <input type="number" class="inline-input" data-property="width" min="10" max="2000">
              <label>H:</label>
              <input type="number" class="inline-input" data-property="height" min="10" max="2000">
            </div>
            <div class="control-row">
              <button class="edit-btn" data-action="upload-image">🖼️ Set Image</button>
              <button class="edit-btn" data-action="remove-image">🚫 Remove Image</button>
            </div>
            <div class="control-row">
              <button class="edit-btn" data-action="duplicate-element">📋 Copy</button>
              <button class="edit-btn danger" data-action="delete-element">🗑️ Delete</button>
            </div>
          </div>
        </div>
        
        <!-- Selected Element Info Panel -->
        <div class="editor-section selected-element-info" style="display: none;">
          <h4>🔍 Element Properties</h4>
          <div class="element-properties">
            <!-- Properties will be populated here -->
          </div>
        </div>
        
        <!-- Advanced Tools -->
        <div class="editor-section">
          <h4>🛠️ Tools</h4>
          <button class="editor-btn" data-action="open-token-editor">
            🎨 Design Tokens
          </button>
          <button class="editor-btn" data-action="open-component-mapper">
            🧩 Components
          </button>
          <button class="editor-btn" data-action="preview-sites">
            👁️ Preview Sites
          </button>
          <button class="editor-btn" data-action="export-changes">
            💾 Export
          </button>
        </div>
      </div>
      
      <div class="editor-status">
        <div class="status-message">🚀 Ready to edit - Click "Enable Edit Mode" to start</div>
        <div class="loading-indicator" style="display: none;">⏳ Processing...</div>
      </div>
      
      <!-- User Guide Section -->
      <div class="editor-section user-guide" style="border-top: 2px solid #e2e8f0; margin-top: 16px;">
        <h4>📚 Quick Guide</h4>
        <div class="guide-content" style="font-size: 11px; color: #718096;">
          <p><strong>Getting Started:</strong></p>
          <ol style="margin: 4px 0; padding-left: 16px;">
            <li>Click "Enable Edit Mode"</li>
            <li>Click any element to select it</li>
            <li>Use controls above to edit</li>
            <li>Drag handles to resize</li>
          </ol>
          <p><strong>Quick Actions:</strong></p>
          <ul style="margin: 4px 0; padding-left: 16px;">
            <li>Double-click text to edit directly</li>
            <li>Use "Add Elements" to create shapes</li>
            <li>Preview generated sites with "👁️ Preview Sites"</li>
          </ul>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.editorPanel);

    // Create enhanced modals
    this.createFunctionalTokenEditor();
    this.createFunctionalComponentMapper();
    this.createSitePreviewModal();
  }

  createFunctionalTokenEditor() {
    this.tokenEditor = document.createElement('div');
    this.tokenEditor.className = 'token-editor-modal';
    this.tokenEditor.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Design Token Editor - ${this.state.currentSkin}</h3>
          <button class="modal-close" data-action="close-token-editor">×</button>
        </div>
        
        <div class="token-categories">
          <div class="token-category" data-category="colors">
            <h4>Colors</h4>
            <div class="token-controls" id="color-controls">
              <div class="loading-message">Loading tokens...</div>
            </div>
          </div>
          
          <div class="token-category" data-category="typography">
            <h4>Typography</h4>
            <div class="token-controls" id="typography-controls">
              <div class="loading-message">Loading tokens...</div>
            </div>
          </div>
          
          <div class="token-category" data-category="spacing">
            <h4>Spacing</h4>
            <div class="token-controls" id="spacing-controls">
              <div class="loading-message">Loading tokens...</div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <div class="live-editing-indicator">
            <span class="live-dot"></span>
            <span>Live Editing - Changes apply automatically</span>
          </div>
          <button class="btn-secondary" data-action="reset-tokens">Reset All</button>
          <button class="btn-secondary" data-action="reload-tokens">Reload from File</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.tokenEditor);
  }

  createFunctionalComponentMapper() {
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
            <h4>Page Elements</h4>
            <div class="preview-area" id="element-list">
              <p>Enable Edit Mode and click elements to see them here</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.componentMapper);
  }

  createSitePreviewModal() {
    this.sitePreview = document.createElement('div');
    this.sitePreview.className = 'site-preview-modal';
    this.sitePreview.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Generated Sites Preview</h3>
          <button class="modal-close" data-action="close-site-preview">×</button>
        </div>
        
        <div class="site-preview-content">
          <div class="site-list">
            <h4>Available Sites</h4>
            <div class="loading-message">Loading sites...</div>
          </div>
          
          <div class="site-iframe-container">
            <h4>Preview</h4>
            <div class="preview-placeholder">
              <p>Select a site to preview</p>
            </div>
            <iframe class="site-iframe" style="display: none;" frameborder="0"></iframe>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.sitePreview);
  }

  createEditingToolbar() {
    this.editingToolbar = document.createElement('div');
    this.editingToolbar.className = 'editing-toolbar';
    this.editingToolbar.innerHTML = `
      <div class="toolbar-header">
        <span class="toolbar-title">✏️ Element Editor</span>
        <button class="toolbar-close" onclick="this.parentElement.parentElement.style.display='none'">×</button>
      </div>
      
      <div class="toolbar-content">
        <div class="toolbar-section">
          <h4>Text</h4>
          <div class="toolbar-row">
            <button class="toolbar-btn" data-action="edit-text">📝 Edit Text</button>
            <input type="color" class="color-picker" data-property="color" title="Text Color">
          </div>
          <div class="toolbar-row">
            <label>Size:</label>
            <input type="range" class="size-slider" data-property="fontSize" min="8" max="72" title="Font Size">
            <span class="size-value">16px</span>
          </div>
        </div>
        
        <div class="toolbar-section">
          <h4>Background</h4>
          <div class="toolbar-row">
            <input type="color" class="color-picker" data-property="backgroundColor" title="Background Color">
            <button class="toolbar-btn" data-action="remove-background">🚫 Remove</button>
          </div>
        </div>
        
        <div class="toolbar-section">
          <h4>Size & Position</h4>
          <div class="toolbar-row">
            <label>W:</label>
            <input type="number" class="dimension-input" data-property="width" min="10" max="2000">
            <label>H:</label>
            <input type="number" class="dimension-input" data-property="height" min="10" max="2000">
          </div>
        </div>
        
        <div class="toolbar-section">
          <h4>Actions</h4>
          <div class="toolbar-row">
            <button class="toolbar-btn" data-action="duplicate-element">📋 Duplicate</button>
            <button class="toolbar-btn" data-action="delete-element">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.editingToolbar);
  }

  createShapeTools() {
    this.shapeTools = document.createElement('div');
    this.shapeTools.className = 'shape-tools';
    this.shapeTools.innerHTML = `
      <div class="shape-header">
        <span class="shape-title">🔷 Add Shapes</span>
        <button class="shape-toggle" data-action="toggle-shapes">+</button>
      </div>
      
      <div class="shape-content" style="display: none;">
        <div class="shape-section">
          <h4>Create New Shape</h4>
          <div class="shape-buttons">
            <button class="shape-btn" data-shape="rectangle">⬜ Rectangle</button>
            <button class="shape-btn" data-shape="circle">⭕ Circle</button>
            <button class="shape-btn" data-shape="text">📝 Text Box</button>
          </div>
          
          <div class="shape-options">
            <label>Color:</label>
            <input type="color" id="shape-color" value="#ff6b35">
            <label>Size:</label>
            <input type="range" id="shape-size" min="50" max="300" value="100">
            <span id="shape-size-value">100px</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.shapeTools);
    
    // Bind shape tool events
    this.bindShapeEvents();
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
        case 'preview-sites':
          this.openSitePreview();
          break;
        case 'export-changes':
          this.exportChanges();
          break;
        case 'run-tokens-build':
          this.runCommand('tokens:build');
          break;
        case 'run-skins-build':
          this.runCommand('skins:build');
          break;
        case 'run-safety-check':
          this.runCommand('safety:check');
          break;
        case 'run-validate':
          this.runCommand('validate');
          break;
      }
    });

    // Integrated shape creation events
    this.editorPanel.querySelectorAll('.shape-create-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const shapeType = e.target.dataset.shape;
        this.createIntegratedShape(shapeType);
      });
    });

    // Shape size slider
    const sizeSlider = document.getElementById('new-shape-size');
    const sizeValue = document.getElementById('new-shape-size-value');
    if (sizeSlider && sizeValue) {
      sizeSlider.addEventListener('input', (e) => {
        sizeValue.textContent = e.target.value + 'px';
      });
    }

    // Image upload for new shapes
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
      imageUpload.addEventListener('change', (e) => {
        this.handleImageUpload(e, 'new');
      });
    }

    // Image upload for existing elements
    const elementImageUpload = document.getElementById('element-image-upload');
    if (elementImageUpload) {
      elementImageUpload.addEventListener('change', (e) => {
        this.handleImageUpload(e, 'existing');
      });
    }

    // Skin selector
    const skinSelector = this.editorPanel.querySelector('.skin-selector');
    
    // Set current skin in selector
    skinSelector.value = this.state.currentSkin;
    
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
        // apply-tokens removed - now using real-time updates
        case 'reset-tokens':
          this.resetTokens();
          break;
        case 'reload-tokens':
          this.loadCurrentTokens();
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

    // Site preview events
    this.sitePreview.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      const site = e.target.dataset.site;
      
      if (action === 'close-site-preview') {
        this.closeSitePreview();
      } else if (site) {
        this.previewSite(site);
      }
    });

    // Global drag events
    document.addEventListener('mousedown', this.handleDragStart);
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleDragEnd);

    // Prevent default drag behavior on images and other elements
    document.addEventListener('dragstart', (e) => {
      if (this.state.editMode) {
        e.preventDefault();
      }
    });
    
    // Add double-click to edit functionality
    document.addEventListener('dblclick', (e) => {
      if (this.state.editMode && !e.target.closest('.visual-editor-panel')) {
        e.preventDefault();
        e.stopPropagation();
        this.selectElement(e.target);
        
        // Auto-enable text editing for text elements
        if (e.target.textContent && e.target.textContent.trim()) {
          setTimeout(() => {
            this.enableTextEditing(e.target);
          }, 100);
        }
      }
    });
  }

  toggleEditMode() {
    this.state.editMode = !this.state.editMode;
    const toggleBtn = this.editorPanel.querySelector('.editor-toggle');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    
    if (this.state.editMode) {
      toggleText.textContent = 'Disable Edit Mode';
      toggleBtn.classList.add('active');
      this.enableElementSelection();
      this.showEditModeIndicator();
    } else {
      toggleText.textContent = 'Enable Edit Mode';
      toggleBtn.classList.remove('active');
      this.disableElementSelection();
      this.hideEditModeIndicator();
    }
  }

  enableElementSelection() {
    document.addEventListener('click', this.handleElementClick, true);
    document.body.style.cursor = 'crosshair';
    
    // Add edit mode overlay for better visual feedback
    this.createEditModeOverlay();
    
    // Add visual indicator
    this.showStatusMessage('✨ Edit Mode Active - Click any element to start editing', 'info');
  }

  disableElementSelection() {
    document.removeEventListener('click', this.handleElementClick, true);
    document.body.style.cursor = '';
    this.clearSelection();
    this.removeEditModeOverlay();
    this.showStatusMessage('🔒 Edit Mode Disabled', 'success');
  }
  
  createEditModeOverlay() {
    // Remove existing overlay
    this.removeEditModeOverlay();
    
    const overlay = document.createElement('div');
    overlay.className = 'edit-mode-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(66, 153, 225, 0.03);
      pointer-events: none;
      z-index: 9998;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(overlay);
  }
  
  removeEditModeOverlay() {
    const overlay = document.querySelector('.edit-mode-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  handleElementClick(e) {
    if (!this.state.editMode) return;
    
    // Don't select editor elements
    if (e.target.closest('.visual-editor-panel') || 
        e.target.closest('.token-editor-modal') || 
        e.target.closest('.component-mapper-modal') ||
        e.target.closest('.drag-handle')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    this.selectElement(e.target);
  }

  selectElement(element) {
    if (!element) {
      console.warn('Cannot select null element');
      return;
    }
    
    this.clearSelection();
    this.state.selectedElement = element;
    
    // Highlight selected element
    element.classList.add('editor-selected');
    
    try {
      // Create functional drag handles
      this.createFunctionalDragHandles(element);
      
      // Show integrated element editor in sidebar
      this.showIntegratedElementEditor(element);
      
      // Show element info with functional controls
      this.showFunctionalElementInfo(element);
      
      this.showStatusMessage(`Selected: ${element.tagName.toLowerCase()}`, 'success');
    } catch (error) {
      console.error('Error in selectElement:', error);
      this.showStatusMessage('Error selecting element', 'error');
    }
  }

  createFunctionalDragHandles(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const scrollLeft = window.pageXOffset;
    
    this.clearDragHandles();
    
    // Store original styles
    this.dragState.originalStyles = {
      width: element.style.width || getComputedStyle(element).width,
      height: element.style.height || getComputedStyle(element).height,
      minWidth: element.style.minWidth || getComputedStyle(element).minWidth,
      minHeight: element.style.minHeight || getComputedStyle(element).minHeight
    };
    
    const handles = [
      { type: 'nw', x: rect.left + scrollLeft, y: rect.top + scrollTop, cursor: 'nw-resize' },
      { type: 'n', x: rect.left + rect.width/2 + scrollLeft, y: rect.top + scrollTop, cursor: 'n-resize' },
      { type: 'ne', x: rect.right + scrollLeft, y: rect.top + scrollTop, cursor: 'ne-resize' },
      { type: 'e', x: rect.right + scrollLeft, y: rect.top + rect.height/2 + scrollTop, cursor: 'e-resize' },
      { type: 'se', x: rect.right + scrollLeft, y: rect.bottom + scrollTop, cursor: 'se-resize' },
      { type: 's', x: rect.left + rect.width/2 + scrollLeft, y: rect.bottom + scrollTop, cursor: 's-resize' },
      { type: 'sw', x: rect.left + scrollLeft, y: rect.bottom + scrollTop, cursor: 'sw-resize' },
      { type: 'w', x: rect.left + scrollLeft, y: rect.top + rect.height/2 + scrollTop, cursor: 'w-resize' }
    ];
    
    handles.forEach(handle => {
      const handleEl = document.createElement('div');
      handleEl.className = `drag-handle drag-handle-${handle.type}`;
      handleEl.style.left = `${handle.x - 4}px`;
      handleEl.style.top = `${handle.y - 4}px`;
      handleEl.style.cursor = handle.cursor;
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
    
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }

  handleDrag(e) {
    if (!this.dragState.isDragging || !this.state.selectedElement) return;
    
    // Use requestAnimationFrame for smooth drag operations
    this.requestFrame(() => {
      const deltaX = e.clientX - this.dragState.startX;
      const deltaY = e.clientY - this.dragState.startY;
      
      this.updateElementDimensions(deltaX, deltaY);
      
      // Throttle handle position updates for better performance
      this.throttle(() => {
        this.createFunctionalDragHandles(this.state.selectedElement);
      }, 16, 'dragHandles'); // ~60fps
      
      // Debounce element info updates
      this.debounce(() => {
        this.updateElementInfo();
      }, 100, 'elementInfo');
    });
  }

  handleDragEnd(e) {
    if (!this.dragState.isDragging) return;
    
    this.dragState.isDragging = false;
    this.dragState.handleType = null;
    this.dragState.originalRect = null;
    
    document.body.style.userSelect = '';
    
    if (this.state.selectedElement) {
      this.showStatusMessage('Element resized successfully', 'success');
    }
  }

  updateElementDimensions(deltaX, deltaY) {
    const element = this.state.selectedElement;
    const handleType = this.dragState.handleType;
    const rect = this.dragState.originalRect;
    
    let newWidth = rect.width;
    let newHeight = rect.height;
    
    // Calculate new dimensions based on handle type
    switch (handleType) {
      case 'e':
      case 'ne':
      case 'se':
        newWidth = Math.max(20, rect.width + deltaX);
        break;
      case 'w':
      case 'nw':
      case 'sw':
        newWidth = Math.max(20, rect.width - deltaX);
        break;
    }
    
    switch (handleType) {
      case 's':
      case 'se':
      case 'sw':
        newHeight = Math.max(20, rect.height + deltaY);
        break;
      case 'n':
      case 'ne':
      case 'nw':
        newHeight = Math.max(20, rect.height - deltaY);
        break;
    }
    
    // Apply new dimensions
    element.style.width = `${newWidth}px`;
    element.style.height = `${newHeight}px`;
    element.style.minWidth = 'auto';
    element.style.minHeight = 'auto';
  }

  showFunctionalElementInfo(element) {
    if (!this.editorPanel) {
      console.warn('Editor panel not found');
      return;
    }
    
    const infoPanel = this.editorPanel.querySelector('.selected-element-info');
    if (!infoPanel) {
      console.warn('Info panel not found in editor');
      return;
    }
    
    const propertiesDiv = infoPanel.querySelector('.element-properties');
    if (!propertiesDiv) {
      console.warn('Properties div not found in info panel');
      return;
    }
    
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
        <span class="dimensions-display">${Math.round(rect.width)}px × ${Math.round(rect.height)}px</span>
      </div>
      
      <div class="property-group">
        <h5>Layout & Position</h5>
        <div class="property">
          <label>Position:</label>
          <select data-property="position" class="property-input">
            <option value="static" ${computedStyle.position === 'static' ? 'selected' : ''}>Static</option>
            <option value="relative" ${computedStyle.position === 'relative' ? 'selected' : ''}>Relative</option>
            <option value="absolute" ${computedStyle.position === 'absolute' ? 'selected' : ''}>Absolute</option>
            <option value="fixed" ${computedStyle.position === 'fixed' ? 'selected' : ''}>Fixed</option>
          </select>
        </div>
        <div class="property">
          <label>Z-Index:</label>
          <input type="number" min="0" max="9999" value="${computedStyle.zIndex === 'auto' ? '1' : computedStyle.zIndex}" 
                 data-property="zIndex" class="property-input">
        </div>
        <div class="property">
          <label>Display:</label>
          <select data-property="display" class="property-input">
            <option value="block" ${computedStyle.display === 'block' ? 'selected' : ''}>Block</option>
            <option value="inline-block" ${computedStyle.display === 'inline-block' ? 'selected' : ''}>Inline Block</option>
            <option value="flex" ${computedStyle.display === 'flex' ? 'selected' : ''}>Flex</option>
            <option value="grid" ${computedStyle.display === 'grid' ? 'selected' : ''}>Grid</option>
            <option value="inline" ${computedStyle.display === 'inline' ? 'selected' : ''}>Inline</option>
          </select>
        </div>
      </div>
      
      <div class="property-group">
        <h5>Colors</h5>
        <div class="property">
          <label>Background:</label>
          <input type="color" value="${this.rgbToHex(computedStyle.backgroundColor)}" 
                 data-property="backgroundColor" class="property-input">
        </div>
        <div class="property">
          <label>Text Color:</label>
          <input type="color" value="${this.rgbToHex(computedStyle.color)}" 
                 data-property="color" class="property-input">
        </div>
        <div class="property">
          <label>Opacity:</label>
          <input type="range" min="0" max="1" step="0.1" value="${computedStyle.opacity}" 
                 data-property="opacity" class="property-input">
          <span class="value-display">${computedStyle.opacity}</span>
        </div>
      </div>
      
      <div class="property-group">
        <h5>Typography</h5>
        <div class="property">
          <label>Font Size:</label>
          <input type="range" min="8" max="72" value="${parseInt(computedStyle.fontSize)}" 
                 data-property="fontSize" class="property-input">
          <span class="value-display">${computedStyle.fontSize}</span>
        </div>
        <div class="property">
          <label>Font Weight:</label>
          <select data-property="fontWeight" class="property-input">
            <option value="300" ${computedStyle.fontWeight === '300' ? 'selected' : ''}>Light</option>
            <option value="400" ${computedStyle.fontWeight === '400' ? 'selected' : ''}>Normal</option>
            <option value="600" ${computedStyle.fontWeight === '600' ? 'selected' : ''}>Semi Bold</option>
            <option value="700" ${computedStyle.fontWeight === '700' ? 'selected' : ''}>Bold</option>
          </select>
        </div>
        <div class="property">
          <label>Text Align:</label>
          <select data-property="textAlign" class="property-input">
            <option value="left" ${computedStyle.textAlign === 'left' ? 'selected' : ''}>Left</option>
            <option value="center" ${computedStyle.textAlign === 'center' ? 'selected' : ''}>Center</option>
            <option value="right" ${computedStyle.textAlign === 'right' ? 'selected' : ''}>Right</option>
            <option value="justify" ${computedStyle.textAlign === 'justify' ? 'selected' : ''}>Justify</option>
          </select>
        </div>
      </div>
      
      <div class="property-group">
        <h5>Spacing</h5>
        <div class="property">
          <label>Padding:</label>
          <input type="range" min="0" max="50" value="${parseInt(computedStyle.paddingTop)}" 
                 data-property="padding" class="property-input">
          <span class="value-display">${computedStyle.paddingTop}</span>
        </div>
        <div class="property">
          <label>Margin:</label>
          <input type="range" min="0" max="50" value="${parseInt(computedStyle.marginTop)}" 
                 data-property="margin" class="property-input">
          <span class="value-display">${computedStyle.marginTop}</span>
        </div>
      </div>
      
      <div class="property-group">
        <h5>Advanced</h5>
        <div class="property">
          <button class="btn-secondary btn-small" onclick="window.functionalVisualEditor.enablePositionMode()">
            📍 Enable Position Mode
          </button>
        </div>
        <div class="property">
          <button class="btn-secondary btn-small" onclick="window.functionalVisualEditor.duplicateElement()">
            📋 Duplicate Element
          </button>
        </div>
        <div class="property">
          <button class="btn-secondary btn-small" onclick="window.functionalVisualEditor.bringToFront()">
            ⬆️ Bring to Front
          </button>
        </div>
      </div>
    `;
    
    // Bind property change events
    propertiesDiv.addEventListener('input', (e) => {
      if (e.target.classList.contains('property-input')) {
        this.updateElementProperty(e.target);
      }
    });
    
    propertiesDiv.addEventListener('change', (e) => {
      if (e.target.classList.contains('property-input')) {
        this.updateElementProperty(e.target);
      }
    });
    
    infoPanel.style.display = 'block';
  }

  enablePositionMode() {
    if (!this.state.selectedElement) return;
    
    this.state.positionMode = true;
    const element = this.state.selectedElement;
    
    // Make element absolutely positioned if it isn't already
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }
    
    // Create a move handle in the center
    this.createMoveHandle(element);
    
    this.showStatusMessage('Position Mode: Click and drag to move element', 'info');
  }

  createMoveHandle(element) {
    // Remove existing move handle
    const existingHandle = document.querySelector('.move-handle');
    if (existingHandle) existingHandle.remove();
    
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const scrollLeft = window.pageXOffset;
    
    const moveHandle = document.createElement('div');
    moveHandle.className = 'move-handle';
    moveHandle.style.left = `${rect.left + rect.width/2 + scrollLeft - 12}px`;
    moveHandle.style.top = `${rect.top + rect.height/2 + scrollTop - 12}px`;
    moveHandle.innerHTML = '✋';
    
    document.body.appendChild(moveHandle);
    
    // Bind drag events for moving
    moveHandle.addEventListener('mousedown', (e) => {
      this.startMoveOperation(e, element);
    });
  }

  startMoveOperation(e, element) {
    this.dragState.isMoving = true;
    this.dragState.startX = e.clientX;
    this.dragState.startY = e.clientY;
    this.dragState.originalRect = element.getBoundingClientRect();
    
    document.addEventListener('mousemove', this.handleMoveOperation);
    document.addEventListener('mouseup', this.endMoveOperation);
    
    e.preventDefault();
  }

  handleMoveOperation = (e) => {
    if (!this.dragState.isMoving || !this.state.selectedElement) return;
    
    const deltaX = e.clientX - this.dragState.startX;
    const deltaY = e.clientY - this.dragState.startY;
    
    const element = this.state.selectedElement;
    const rect = this.dragState.originalRect;
    
    // Update element position
    element.style.position = 'absolute';
    element.style.left = `${rect.left + deltaX}px`;
    element.style.top = `${rect.top + deltaY}px`;
    element.style.zIndex = '1000'; // Bring to front while moving
    
    // Update move handle position
    const moveHandle = document.querySelector('.move-handle');
    if (moveHandle) {
      moveHandle.style.left = `${rect.left + rect.width/2 + deltaX - 12}px`;
      moveHandle.style.top = `${rect.top + rect.height/2 + deltaY - 12}px`;
    }
  }

  endMoveOperation = (e) => {
    this.dragState.isMoving = false;
    
    document.removeEventListener('mousemove', this.handleMoveOperation);
    document.removeEventListener('mouseup', this.endMoveOperation);
    
    this.showStatusMessage('Element moved successfully', 'success');
    this.updateElementInfo();
  }

  duplicateElement() {
    if (!this.state.selectedElement) return;
    
    const element = this.state.selectedElement;
    const clone = element.cloneNode(true);
    
    // Offset the clone slightly
    clone.style.position = 'absolute';
    clone.style.left = (parseInt(element.style.left) || 0) + 20 + 'px';
    clone.style.top = (parseInt(element.style.top) || 0) + 20 + 'px';
    clone.style.zIndex = '999';
    
    // Remove any existing selection classes
    clone.classList.remove('editor-selected');
    
    // Insert clone after original
    element.parentNode.insertBefore(clone, element.nextSibling);
    
    this.showStatusMessage('Element duplicated successfully', 'success');
  }

  bringToFront() {
    if (!this.state.selectedElement) return;
    
    // Find highest z-index on page
    const allElements = document.querySelectorAll('*');
    let maxZ = 0;
    
    allElements.forEach(el => {
      const z = parseInt(getComputedStyle(el).zIndex);
      if (!isNaN(z) && z > maxZ) {
        maxZ = z;
      }
    });
    
    this.state.selectedElement.style.zIndex = maxZ + 1;
    this.showStatusMessage(`Element brought to front (z-index: ${maxZ + 1})`, 'success');
  }

  updateElementProperty(input) {
    const element = this.state.selectedElement;
    const property = input.dataset.property;
    let value = input.value;
    
    switch (property) {
      case 'fontSize':
      case 'padding':
      case 'margin':
        value += 'px';
        break;
    }
    
    element.style[property] = value;
    
    // Update display value
    const valueDisplay = input.parentNode.querySelector('.value-display');
    if (valueDisplay) {
      valueDisplay.textContent = value;
    }
    
    // Update dimensions display if it's a size change
    this.updateElementInfo();
  }

  updateElementInfo() {
    if (!this.state.selectedElement) return;
    
    const rect = this.state.selectedElement.getBoundingClientRect();
    const dimensionsDisplay = this.editorPanel.querySelector('.dimensions-display');
    if (dimensionsDisplay) {
      dimensionsDisplay.textContent = `${Math.round(rect.width)}px × ${Math.round(rect.height)}px`;
    }
  }

  clearSelection() {
    if (this.state.selectedElement) {
      this.state.selectedElement.classList.remove('editor-selected');
      this.state.selectedElement = null;
    }
    this.clearDragHandles();
    
    // Clear move handle
    const moveHandle = document.querySelector('.move-handle');
    if (moveHandle) moveHandle.remove();
    
    // Clear position mode
    this.state.positionMode = false;
    
    const infoPanel = this.editorPanel.querySelector('.selected-element-info');
    infoPanel.style.display = 'none';
  }

  clearDragHandles() {
    this.state.dragHandles.forEach(handle => handle.remove());
    this.state.dragHandles = [];
  }

  async loadCurrentTokens() {
    try {
      this.showStatusMessage('Loading tokens...', 'info');
      const response = await fetch(`/api/tokens/update?skin=${this.state.currentSkin}`);
      
      if (response.ok) {
        const data = await response.json();
        this.state.tokens = data.tokens;
        this.showStatusMessage('Tokens loaded successfully', 'success');
        
        if (this.state.tokenEditorOpen) {
          this.populateTokenEditor();
        }
      } else {
        throw new Error(`Failed to load tokens: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to load tokens:', error);
      this.showStatusMessage('Failed to load tokens', 'error');
      // Fallback to default tokens
      this.state.tokens = { colors: {}, typography: {}, spacing: {} };
    }
  }

  openTokenEditor() {
    this.state.tokenEditorOpen = true;
    this.tokenEditor.style.display = 'flex';
    
    // Update header with current skin
    const header = this.tokenEditor.querySelector('.modal-header h3');
    header.textContent = `Design Token Editor - ${this.state.currentSkin}`;
    
    this.populateTokenEditor();
  }

  closeTokenEditor() {
    this.state.tokenEditorOpen = false;
    this.tokenEditor.style.display = 'none';
  }

  populateTokenEditor() {
    if (!this.state.tokens) {
      this.loadCurrentTokens();
      return;
    }
    
    // Populate color controls
    this.populateColorControls();
    this.populateTypographyControls();
    this.populateSpacingControls();
  }

  populateColorControls() {
    const colorControls = document.getElementById('color-controls');
    const colors = this.state.tokens.colors || {};
    
    colorControls.innerHTML = '';
    
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb'))) {
        const control = document.createElement('div');
        control.className = 'token-control';
        control.innerHTML = `
          <label>${key}:</label>
          <input type="color" value="${this.normalizeColor(value)}" data-token="colors.${key}" data-live="true">
          <span class="token-value">${value}</span>
        `;
        colorControls.appendChild(control);
        
        // Add real-time event listener
        const colorInput = control.querySelector('input[type="color"]');
        const tokenValue = control.querySelector('.token-value');
        colorInput.addEventListener('input', (e) => {
          const newValue = e.target.value;
          tokenValue.textContent = newValue;
          
          // Immediate visual update
          this.updateCSSVariable(`--color-${key}`, newValue);
          
          // Debounced save to prevent excessive API calls
          this.debounce(() => {
            this.updateTokenValue(`colors.${key}`, newValue);
          }, 300, `token-${key}`);
        });
      } else if (typeof value === 'object') {
        // Handle nested color objects like text.primary
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue === 'string' && (subValue.startsWith('#') || subValue.startsWith('rgb'))) {
            const control = document.createElement('div');
            control.className = 'token-control';
            control.innerHTML = `
              <label>${key}.${subKey}:</label>
              <input type="color" value="${this.normalizeColor(subValue)}" data-token="colors.${key}.${subKey}" data-live="true">
              <span class="token-value">${subValue}</span>
            `;
            colorControls.appendChild(control);
            
            // Add real-time event listener
            const colorInput = control.querySelector('input[type="color"]');
            const tokenValue = control.querySelector('.token-value');
            colorInput.addEventListener('input', (e) => {
              const newValue = e.target.value;
              tokenValue.textContent = newValue;
              this.updateCSSVariable(`--color-${key}-${subKey}`, newValue);
              this.updateTokenValue(`colors.${key}.${subKey}`, newValue);
            });
          }
        });
      }
    });
    
    if (colorControls.children.length === 0) {
      colorControls.innerHTML = '<p>No color tokens found</p>';
    }
  }

  populateTypographyControls() {
    const typographyControls = document.getElementById('typography-controls');
    const typography = this.state.tokens.typography || {};
    
    typographyControls.innerHTML = '';
    
    // Handle font families
    if (typography.fontFamily) {
      Object.entries(typography.fontFamily).forEach(([key, value]) => {
        const fontValue = Array.isArray(value) ? value[0] : value;
        const control = document.createElement('div');
        control.className = 'token-control';
        control.innerHTML = `
          <label>font.${key}:</label>
          <input type="text" value="${fontValue}" data-token="typography.fontFamily.${key}">
        `;
        typographyControls.appendChild(control);
      });
    }
    
    // Handle font sizes
    if (typography.fontSize) {
      Object.entries(typography.fontSize).forEach(([key, value]) => {
        const control = document.createElement('div');
        control.className = 'token-control';
        control.innerHTML = `
          <label>size.${key}:</label>
          <input type="text" value="${value}" data-token="typography.fontSize.${key}">
        `;
        typographyControls.appendChild(control);
      });
    }
    
    if (typographyControls.children.length === 0) {
      typographyControls.innerHTML = '<p>No typography tokens found</p>';
    }
  }

  populateSpacingControls() {
    const spacingControls = document.getElementById('spacing-controls');
    const spacing = this.state.tokens.spacing || {};
    
    spacingControls.innerHTML = '';
    
    Object.entries(spacing).forEach(([key, value]) => {
      const control = document.createElement('div');
      control.className = 'token-control';
      control.innerHTML = `
        <label>${key}:</label>
        <input type="text" value="${value}" data-token="spacing.${key}">
      `;
      spacingControls.appendChild(control);
    });
    
    if (spacingControls.children.length === 0) {
      spacingControls.innerHTML = '<p>No spacing tokens found</p>';
    }
  }

  async applyTokenChanges() {
    const inputs = this.tokenEditor.querySelectorAll('input[data-token]');
    const updatedTokens = JSON.parse(JSON.stringify(this.state.tokens)); // Deep clone
    
    inputs.forEach(input => {
      const tokenPath = input.dataset.token.split('.');
      const value = input.value;
      
      // Navigate to the correct nested object
      let current = updatedTokens;
      for (let i = 0; i < tokenPath.length - 1; i++) {
        if (!current[tokenPath[i]]) {
          current[tokenPath[i]] = {};
        }
        current = current[tokenPath[i]];
      }
      current[tokenPath[tokenPath.length - 1]] = value;
      
      // Update the display value
      const valueDisplay = input.parentNode.querySelector('.token-value');
      if (valueDisplay) {
        valueDisplay.textContent = value;
      }
    });
    
    try {
      this.showStatusMessage('Applying token changes...', 'info');
      
      const response = await fetch('/api/tokens/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skin: this.state.currentSkin,
          tokens: updatedTokens
        })
      });
      
      if (response.ok) {
        this.state.tokens = updatedTokens;
        this.showStatusMessage('Tokens updated successfully! Hot reload will apply changes.', 'success');
        
        // Auto-close token editor after successful update
        setTimeout(() => {
          this.closeTokenEditor();
        }, 2000);
      } else {
        throw new Error(`Failed to update tokens: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to apply token changes:', error);
      this.showStatusMessage('Failed to apply token changes', 'error');
    }
  }

  resetTokens() {
    this.loadCurrentTokens();
    this.showStatusMessage('Tokens reset to saved values', 'info');
  }

  switchSkin(skinName) {
    this.state.currentSkin = skinName;
    
    // Update body data attribute
    document.body.setAttribute('data-skin', skinName);
    
    // Reload tokens for new skin
    this.loadCurrentTokens();
    
    // Clear current selection
    this.clearSelection();
    
    this.showStatusMessage(`Switched to ${skinName}`, 'success');
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
      <div class="component-actions">
        <button class="btn-secondary" onclick="window.functionalVisualEditor.highlightComponentElements('${componentName}')">
          Highlight ${componentName} Elements
        </button>
      </div>
    `;
  }

  highlightComponentElements(componentName) {
    // Clear previous highlights
    document.querySelectorAll('.component-highlight').forEach(el => {
      el.classList.remove('component-highlight');
    });

    // Map component names to likely CSS selectors
    const componentSelectors = {
      'Navbar': 'nav, .navbar, .navigation, header nav',
      'Hero': '.hero, .banner, .hero-section, .jumbotron',
      'MenuList': '.menu, .menu-list, .menu-items, .food-menu',
      'Gallery': '.gallery, .photos, .images, .image-gallery',
      'Hours': '.hours, .opening-hours, .business-hours',
      'LocationMap': '.location, .map, .address, .contact-info',
      'CTA': '.cta, .call-to-action, .action-button',
      'Footer': 'footer, .footer',
      'RichText': '.content, .text-content, .description',
      'Section': 'section, .section'
    };

    const selectors = componentSelectors[componentName];
    if (selectors) {
      const elements = document.querySelectorAll(selectors);
      elements.forEach(el => {
        el.classList.add('component-highlight');
        el.setAttribute('data-component', componentName);
      });
      
      this.showStatusMessage(`Highlighted ${elements.length} ${componentName} elements`, 'success');
      this.closeComponentMapper();
    }
  }

  openComponentMapper() {
    this.state.componentMapperOpen = true;
    this.componentMapper.style.display = 'flex';
    this.updateElementList();
  }

  closeComponentMapper() {
    this.state.componentMapperOpen = false;
    this.componentMapper.style.display = 'none';
  }

  openSitePreview() {
    this.sitePreview.style.display = 'flex';
    this.loadAvailableSites();
  }

  closeSitePreview() {
    this.sitePreview.style.display = 'none';
  }

  async loadAvailableSites() {
    try {
      const response = await fetch('/api/sites/list');
      if (response.ok) {
        const sites = await response.json();
        this.populateSiteList(sites);
      } else {
        throw new Error('Failed to load sites');
      }
    } catch (error) {
      console.error('Error loading sites:', error);
      const siteList = this.sitePreview.querySelector('.site-list');
      siteList.innerHTML = `
        <h4>Available Sites</h4>
        <p class="error">Failed to load sites. Please check if any sites have been generated.</p>
      `;
    }
  }

  populateSiteList(sites) {
    const siteList = this.sitePreview.querySelector('.site-list');
    
    if (sites.length === 0) {
      siteList.innerHTML = `
        <h4>Available Sites</h4>
        <p>No generated sites found. Generate some sites first to preview them.</p>
      `;
      return;
    }

    let siteItems = sites.map(site => `
      <div class="site-item" data-site="${site}">
        <span class="site-name">${site}</span>
        <button class="btn-micro" data-site="${site}">Preview</button>
      </div>
    `).join('');

    siteList.innerHTML = `
      <h4>Available Sites (${sites.length})</h4>
      ${siteItems}
    `;
  }

  previewSite(siteName) {
    const iframe = this.sitePreview.querySelector('.site-iframe');
    const placeholder = this.sitePreview.querySelector('.preview-placeholder');
    
    // Show loading
    placeholder.style.display = 'block';
    placeholder.innerHTML = '<p>Loading preview...</p>';
    iframe.style.display = 'none';
    
    // Set iframe source
    iframe.src = `/api/preview?site=${encodeURIComponent(siteName)}`;
    
    // Handle iframe load
    iframe.onload = () => {
      placeholder.style.display = 'none';
      iframe.style.display = 'block';
    };
    
    iframe.onerror = () => {
      placeholder.innerHTML = '<p>Failed to load preview</p>';
    };
  }

  updateElementList() {
    const elementList = document.getElementById('element-list');
    const allElements = document.querySelectorAll('body *:not(.visual-editor-panel):not(.token-editor-modal):not(.component-mapper-modal):not(.drag-handle):not(script):not(style)');
    
    elementList.innerHTML = '<h5>Page Elements</h5>';
    
    const elementMap = new Map();
    allElements.forEach((el, index) => {
      const tagName = el.tagName.toLowerCase();
      // Safely handle className - it might be a string, DOMTokenList, or undefined
      let className = '';
      if (el.className) {
        if (typeof el.className === 'string') {
          className = el.className;
        } else if (el.className.toString) {
          className = el.className.toString();
        }
      }
      
      const text = (el.textContent && el.textContent.trim().substring(0, 30)) || '';
      const firstClass = className && className.includes(' ') ? className.split(' ')[0] : className;
      const key = `${tagName}${firstClass ? '.' + firstClass : ''}`;
      
      if (!elementMap.has(key)) {
        elementMap.set(key, []);
      }
      elementMap.get(key).push({ element: el, text });
    });
    
    elementMap.forEach((elementData, key) => {
      const item = document.createElement('div');
      item.className = 'element-item';
      // Escape the key for use in onclick attributes
      const escapedKey = key.replace(/'/g, "\\'");
      item.innerHTML = `
        <div class="element-header">${key} (${elementData.length})</div>
        <div class="element-actions">
          <button class="btn-micro" onclick="window.functionalVisualEditor.selectElementFromMapper('${escapedKey}', 0)">Select First</button>
          <button class="btn-micro" onclick="window.functionalVisualEditor.highlightElementGroup('${escapedKey}')">Highlight All</button>
        </div>
      `;
      elementList.appendChild(item);
      
      // Show individual elements if there are multiple
      if (elementData.length > 1) {
        elementData.forEach((data, index) => {
          const subItem = document.createElement('div');
          subItem.className = 'element-sub-item';
          // Escape text content for HTML
          const escapedText = (data.text || 'No text').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          subItem.innerHTML = `
            <span class="element-text">${escapedText}</span>
            <button class="btn-micro" onclick="window.functionalVisualEditor.selectElementFromMapper('${escapedKey}', ${index})">Select</button>
          `;
          elementList.appendChild(subItem);
        });
      }
    });
  }

  selectElementFromMapper(key, index) {
    const allElements = document.querySelectorAll('body *:not(.visual-editor-panel):not(.token-editor-modal):not(.component-mapper-modal):not(.drag-handle):not(script):not(style)');
    const elementMap = new Map();
    
    allElements.forEach((el) => {
      const tagName = el.tagName.toLowerCase();
      // Safely handle className
      let className = '';
      if (el.className) {
        if (typeof el.className === 'string') {
          className = el.className;
        } else if (el.className.toString) {
          className = el.className.toString();
        }
      }
      
      const firstClass = className && className.includes(' ') ? className.split(' ')[0] : className;
      const elementKey = `${tagName}${firstClass ? '.' + firstClass : ''}`;
      
      if (!elementMap.has(elementKey)) {
        elementMap.set(elementKey, []);
      }
      elementMap.get(elementKey).push(el);
    });
    
    const elements = elementMap.get(key);
    if (elements && elements[index]) {
      this.selectElement(elements[index]);
      this.closeComponentMapper();
      
      // Scroll element into view
      elements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  highlightElementGroup(key) {
    // Clear previous highlights
    document.querySelectorAll('.group-highlight').forEach(el => {
      el.classList.remove('group-highlight');
    });

    const allElements = document.querySelectorAll('body *:not(.visual-editor-panel):not(.token-editor-modal):not(.component-mapper-modal):not(.drag-handle):not(script):not(style)');
    const elementMap = new Map();
    
    allElements.forEach((el) => {
      const tagName = el.tagName.toLowerCase();
      // Safely handle className
      let className = '';
      if (el.className) {
        if (typeof el.className === 'string') {
          className = el.className;
        } else if (el.className.toString) {
          className = el.className.toString();
        }
      }
      
      const firstClass = className && className.includes(' ') ? className.split(' ')[0] : className;
      const elementKey = `${tagName}${firstClass ? '.' + firstClass : ''}`;
      
      if (!elementMap.has(elementKey)) {
        elementMap.set(elementKey, []);
      }
      elementMap.get(elementKey).push(el);
    });
    
    const elements = elementMap.get(key);
    if (elements) {
      elements.forEach(el => {
        el.classList.add('group-highlight');
      });
      this.showStatusMessage(`Highlighted ${elements.length} ${key} elements`, 'success');
    }
  }

  async runCommand(command) {
    this.showStatusMessage(`Running ${command}...`, 'info');
    this.setLoading(true);
    
    try {
      const response = await fetch('/api/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        this.showStatusMessage(`${command} completed successfully`, 'success');
        
        // Show output in console for debugging
        console.log(`Command ${command} output:`, result.output);
        
        // Special handling for different commands
        if (command === 'tokens:build' || command === 'skins:build') {
          // If tokens or skins were rebuilt, reload current skin data
          setTimeout(() => {
            this.loadCurrentTokens();
          }, 1000);
        }
      } else {
        throw new Error(result.error || 'Command failed');
      }
    } catch (error) {
      console.error(`Command ${command} failed:`, error);
      this.showStatusMessage(`Command ${command} failed: ${error.message}`, 'error');
    } finally {
      this.setLoading(false);
    }
  }

  async simulateCommand(message, delay) {
    this.showStatusMessage(message, 'info');
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  exportChanges() {
    const changes = {
      skin: this.state.currentSkin,
      tokens: this.state.tokens,
      timestamp: new Date().toISOString(),
      selectedElement: this.state.selectedElement ? {
        tagName: this.state.selectedElement.tagName,
        className: this.state.selectedElement.className,
        styles: this.state.selectedElement.style.cssText
      } : null
    };
    
    const blob = new Blob([JSON.stringify(changes, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.state.currentSkin}-changes-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showStatusMessage('Changes exported successfully', 'success');
  }

  // Utility methods
  normalizeColor(color) {
    if (color.startsWith('#')) return color;
    
    // Convert rgb() to hex
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    return ctx.fillStyle;
  }

  rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#000000';
    
    const match = rgb.match(/\d+/g);
    if (!match) return '#000000';
    
    return '#' + match.slice(0, 3).map(x => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  showStatusMessage(message, type = 'info') {
    const statusElement = this.editorPanel.querySelector('.status-message');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = `status-message ${type}`;
      
      // Auto-clear after 5 seconds for success messages
      if (type === 'success') {
        setTimeout(() => {
          statusElement.textContent = 'Ready';
          statusElement.className = 'status-message';
        }, 5000);
      }
    }
  }

  setLoading(loading) {
    this.state.isLoading = loading;
    const loadingIndicator = this.editorPanel.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = loading ? 'block' : 'none';
    }
  }

  showEditModeIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'edit-mode-indicator';
    indicator.textContent = 'EDIT MODE ACTIVE - Click elements to select, drag handles to resize';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.remove();
      }
    }, 5000);
  }

  hideEditModeIndicator() {
    const indicator = document.querySelector('.edit-mode-indicator');
    if (indicator) indicator.remove();
  }

  // Real-time CSS variable updates
  updateCSSVariable(property, value) {
    // Update CSS custom property immediately
    document.documentElement.style.setProperty(property, value);
    
    // Also try updating in :root for broader compatibility
    const style = document.createElement('style');
    style.textContent = `:root { ${property}: ${value} !important; }`;
    style.id = `dynamic-${property.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    // Remove existing dynamic style for this property
    const existingStyle = document.getElementById(style.id);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    
    console.log(`Updated CSS variable: ${property} = ${value}`);
  }

  updateTokenValue(path, value) {
    // Update the token in memory
    const pathParts = path.split('.');
    let current = this.state.tokens;
    
    // Navigate to the correct nested object
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    // Update the final value
    current[pathParts[pathParts.length - 1]] = value;
    
    // Auto-save after a short delay
    clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = setTimeout(() => {
      this.saveTokenChanges();
    }, 1000);
  }

  async saveTokenChanges() {
    if (!this.state.tokens) return;
    
    try {
      const response = await fetch('/api/tokens/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skin: this.state.currentSkin,
          tokens: this.state.tokens
        })
      });
      
      if (response.ok) {
        this.showStatusMessage('✅ Changes saved automatically', 'success');
      } else {
        this.showStatusMessage('❌ Failed to save changes', 'error');
      }
    } catch (error) {
      console.error('Save error:', error);
      this.showStatusMessage('❌ Network error while saving', 'error');
    }
  }

  // ============ INTEGRATED EDITING FUNCTIONALITY ============

  showIntegratedElementEditor(element) {
    const elementEditor = this.editorPanel.querySelector('.element-editor');
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    // Show the element editor section
    elementEditor.style.display = 'block';
    
    // Update all the controls with current element values
    const textColorPicker = elementEditor.querySelector('[data-property="color"]');
    const bgColorPicker = elementEditor.querySelector('[data-property="backgroundColor"]');
    const fontSizeSlider = elementEditor.querySelector('[data-property="fontSize"]');
    const sizeValue = elementEditor.querySelector('.inline-value');
    const widthInput = elementEditor.querySelector('[data-property="width"]');
    const heightInput = elementEditor.querySelector('[data-property="height"]');
    
    // Set current values
    if (textColorPicker) {
      textColorPicker.value = this.rgbToHex(computedStyle.color);
    }
    if (bgColorPicker) {
      bgColorPicker.value = this.rgbToHex(computedStyle.backgroundColor);
    }
    if (fontSizeSlider) {
      const fontSize = parseInt(computedStyle.fontSize);
      fontSizeSlider.value = fontSize;
      if (sizeValue) sizeValue.textContent = `${fontSize}px`;
    }
    if (widthInput) {
      widthInput.value = Math.round(rect.width);
    }
    if (heightInput) {
      heightInput.value = Math.round(rect.height);
    }
    
    // Bind real-time events to the integrated controls
    try {
      this.bindIntegratedEditorEvents(element, elementEditor);
    } catch (error) {
      console.error('Error binding integrated editor events:', error);
    }
  }

  bindIntegratedEditorEvents(element, elementEditor) {
    if (!element || !elementEditor) {
      console.warn('Missing element or elementEditor for binding events');
      return;
    }
    
    // Clear previous event listeners by cloning the element editor
    const newElementEditor = elementEditor.cloneNode(true);
    if (elementEditor.parentNode) {
      elementEditor.parentNode.replaceChild(newElementEditor, elementEditor);
    }
    
    // Real-time property updates
    newElementEditor.querySelectorAll('.inline-color-picker').forEach(picker => {
      picker.addEventListener('input', (e) => {
        const property = e.target.dataset.property;
        element.style[property] = e.target.value;
      });
    });
    
    newElementEditor.querySelectorAll('.inline-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const property = e.target.dataset.property;
        const value = e.target.value + 'px';
        element.style[property] = value;
        
        const sizeValue = newElementEditor.querySelector('.inline-value');
        if (sizeValue) sizeValue.textContent = value;
      });
    });
    
    newElementEditor.querySelectorAll('.inline-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const property = e.target.dataset.property;
        const value = e.target.value + 'px';
        element.style[property] = value;
        
        // Update drag handles after size change
        this.createFunctionalDragHandles(element);
      });
    });
    
    // Action buttons
    newElementEditor.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      switch (action) {
        case 'edit-text':
          this.enableTextEditing(element);
          break;
        case 'remove-background':
          element.style.backgroundColor = 'transparent';
          break;
        case 'duplicate-element':
          this.duplicateElement(element);
          break;
        case 'delete-element':
          this.deleteElement(element);
          break;
        case 'upload-image':
          this.triggerImageUpload('existing');
          break;
        case 'remove-image':
          this.removeElementImage(element);
          break;
      }
    });
  }

  createIntegratedShape(type) {
    try {
      const colorInput = document.getElementById('new-shape-color');
      const sizeInput = document.getElementById('new-shape-size');
      
      if (!colorInput || !sizeInput) {
        throw new Error('Shape controls not found');
      }
      
      const color = colorInput.value;
      const size = sizeInput.value + 'px';
    
      const shape = document.createElement('div');
      shape.className = 'custom-shape';
      shape.style.position = 'absolute';
      shape.style.left = '100px';
      shape.style.top = '100px';
      shape.style.width = size;
      shape.style.height = size;
      shape.style.backgroundColor = color;
      shape.style.zIndex = '1000';
      shape.style.cursor = 'move';
      
      switch (type) {
        case 'rectangle':
          // Already set above
          break;
        case 'circle':
          shape.style.borderRadius = '50%';
          break;
        case 'text':
          shape.style.backgroundColor = 'transparent';
          shape.style.border = `2px solid ${color}`;
          shape.style.color = color;
          shape.style.display = 'flex';
          shape.style.alignItems = 'center';
          shape.style.justifyContent = 'center';
          shape.style.fontFamily = 'Arial, sans-serif';
          shape.style.fontSize = '16px';
          shape.textContent = 'Edit me';
          shape.contentEditable = true;
          break;
        case 'image':
          this.triggerImageUpload('new');
          return; // Exit early for image shapes
      }
      
      // Add to page
      document.body.appendChild(shape);
      
      // Make it draggable and selectable
      this.makeShapeDraggable(shape);
      this.selectElement(shape);
      
      this.showStatusMessage(`✨ ${type} created`, 'success');
    } catch (error) {
      console.error(`Error creating ${type} shape:`, error);
      this.showStatusMessage(`Failed to create ${type}`, 'error');
    }
  }

  clearSelection() {
    if (this.state.selectedElement) {
      this.state.selectedElement.classList.remove('editor-selected');
      this.state.selectedElement = null;
    }
    
    this.clearDragHandles();
    
    // Clear move handle
    const moveHandle = document.querySelector('.move-handle');
    if (moveHandle) moveHandle.remove();
    
    // Clear position mode
    this.state.positionMode = false;
    
    // Hide the integrated element editor
    if (this.editorPanel) {
      const elementEditor = this.editorPanel.querySelector('.element-editor');
      if (elementEditor) {
        elementEditor.style.display = 'none';
      }
      
      const infoPanel = this.editorPanel.querySelector('.selected-element-info');
      if (infoPanel) {
        infoPanel.style.display = 'none';
      }
    }
    
    // Hide external editing toolbar if it exists
    if (this.editingToolbar) {
      this.editingToolbar.style.display = 'none';
    }
  }

  showEditingToolbar(element) {
    const toolbar = this.editingToolbar;
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    // Position toolbar near the selected element
    toolbar.style.position = 'fixed';
    toolbar.style.left = `${Math.min(rect.right + 20, window.innerWidth - 320)}px`;
    toolbar.style.top = `${Math.max(rect.top, 20)}px`;
    toolbar.style.display = 'block';
    
    // Update toolbar values to match current element
    const textColorPicker = toolbar.querySelector('[data-property="color"]');
    const bgColorPicker = toolbar.querySelector('[data-property="backgroundColor"]');
    const fontSizeSlider = toolbar.querySelector('[data-property="fontSize"]');
    const sizeValue = toolbar.querySelector('.size-value');
    const widthInput = toolbar.querySelector('[data-property="width"]');
    const heightInput = toolbar.querySelector('[data-property="height"]');
    
    // Set current values
    if (textColorPicker) {
      textColorPicker.value = this.rgbToHex(computedStyle.color);
    }
    if (bgColorPicker) {
      bgColorPicker.value = this.rgbToHex(computedStyle.backgroundColor);
    }
    if (fontSizeSlider) {
      const fontSize = parseInt(computedStyle.fontSize);
      fontSizeSlider.value = fontSize;
      if (sizeValue) sizeValue.textContent = `${fontSize}px`;
    }
    if (widthInput) {
      widthInput.value = Math.round(rect.width);
    }
    if (heightInput) {
      heightInput.value = Math.round(rect.height);
    }
    
    // Bind real-time events to toolbar
    this.bindToolbarEvents(element);
  }

  bindToolbarEvents(element) {
    const toolbar = this.editingToolbar;
    
    // Real-time property updates
    toolbar.querySelectorAll('.color-picker').forEach(picker => {
      picker.addEventListener('input', (e) => {
        const property = e.target.dataset.property;
        element.style[property] = e.target.value;
      });
    });
    
    toolbar.querySelectorAll('.size-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const property = e.target.dataset.property;
        const value = e.target.value + 'px';
        element.style[property] = value;
        
        const sizeValue = toolbar.querySelector('.size-value');
        if (sizeValue) sizeValue.textContent = value;
      });
    });
    
    toolbar.querySelectorAll('.dimension-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const property = e.target.dataset.property;
        const value = e.target.value + 'px';
        element.style[property] = value;
        
        // Update drag handles after size change
        this.createFunctionalDragHandles(element);
      });
    });
    
    // Action buttons
    toolbar.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      switch (action) {
        case 'edit-text':
          this.enableTextEditing(element);
          break;
        case 'remove-background':
          element.style.backgroundColor = 'transparent';
          break;
        case 'duplicate-element':
          this.duplicateElement(element);
          break;
        case 'delete-element':
          this.deleteElement(element);
          break;
      }
    });
  }

  enableTextEditing(element) {
    // Make element editable
    element.contentEditable = true;
    element.focus();
    
    // Add editing styles
    element.style.outline = '2px dashed #ff6b35';
    element.style.cursor = 'text';
    
    // Listen for finish editing
    const finishEditing = () => {
      element.contentEditable = false;
      element.style.outline = '';
      element.style.cursor = '';
      this.showStatusMessage('✅ Text updated', 'success');
    };
    
    element.addEventListener('blur', finishEditing, { once: true });
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        finishEditing();
      }
      if (e.key === 'Escape') {
        finishEditing();
      }
    }, { once: true });
    
    this.showStatusMessage('✏️ Text editing mode - Press Enter or click elsewhere to finish', 'info');
  }

  duplicateElement(element) {
    const clone = element.cloneNode(true);
    clone.classList.remove('editor-selected');
    
    // Position slightly offset
    const rect = element.getBoundingClientRect();
    clone.style.position = 'absolute';
    clone.style.left = (rect.left + 20) + 'px';
    clone.style.top = (rect.top + 20) + 'px';
    clone.style.zIndex = '1000';
    
    element.parentNode.insertBefore(clone, element.nextSibling);
    this.selectElement(clone);
    this.showStatusMessage('📋 Element duplicated', 'success');
  }

  deleteElement(element) {
    if (confirm('Delete this element?')) {
      element.remove();
      this.clearSelection();
      this.showStatusMessage('🗑️ Element deleted', 'success');
    }
  }

  bindShapeEvents() {
    const shapeTools = this.shapeTools;
    
    // Toggle shape panel
    shapeTools.querySelector('.shape-toggle').addEventListener('click', () => {
      const content = shapeTools.querySelector('.shape-content');
      const isVisible = content.style.display !== 'none';
      content.style.display = isVisible ? 'none' : 'block';
      
      const toggle = shapeTools.querySelector('.shape-toggle');
      toggle.textContent = isVisible ? '+' : '×';
    });
    
    // Shape size slider
    const sizeSlider = document.getElementById('shape-size');
    const sizeValue = document.getElementById('shape-size-value');
    sizeSlider.addEventListener('input', (e) => {
      sizeValue.textContent = e.target.value + 'px';
    });
    
    // Shape creation buttons
    shapeTools.querySelectorAll('.shape-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const shapeType = e.target.dataset.shape;
        this.createShape(shapeType);
      });
    });
  }

  createShape(type) {
    const color = document.getElementById('shape-color').value;
    const size = document.getElementById('shape-size').value + 'px';
    
    const shape = document.createElement('div');
    shape.className = 'custom-shape';
    shape.style.position = 'absolute';
    shape.style.left = '100px';
    shape.style.top = '100px';
    shape.style.width = size;
    shape.style.height = size;
    shape.style.backgroundColor = color;
    shape.style.zIndex = '1000';
    shape.style.cursor = 'move';
    
    switch (type) {
      case 'rectangle':
        // Already set above
        break;
      case 'circle':
        shape.style.borderRadius = '50%';
        break;
      case 'text':
        shape.style.backgroundColor = 'transparent';
        shape.style.border = `2px solid ${color}`;
        shape.style.color = color;
        shape.style.display = 'flex';
        shape.style.alignItems = 'center';
        shape.style.justifyContent = 'center';
        shape.style.fontFamily = 'Arial, sans-serif';
        shape.style.fontSize = '16px';
        shape.textContent = 'Edit me';
        shape.contentEditable = true;
        break;
    }
    
    // Add to page
    document.body.appendChild(shape);
    
    // Make it draggable and selectable
    this.makeShapeDraggable(shape);
    this.selectElement(shape);
    
    this.showStatusMessage(`✨ ${type} created`, 'success');
  }

  makeShapeDraggable(element) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    element.addEventListener('mousedown', (e) => {
      if (e.target.contentEditable === 'true') return; // Don't drag while editing text
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(element.style.left);
      startTop = parseInt(element.style.top);
      
      element.style.cursor = 'grabbing';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      element.style.left = (startLeft + deltaX) + 'px';
      element.style.top = (startTop + deltaY) + 'px';
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = 'move';
      }
    });
  }

  // Image upload functionality
  handleImageUpload(event, type) {
    try {
      const file = event.target.files[0];
      if (!file) {
        console.warn('No file selected for upload');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showStatusMessage('Please select a valid image file', 'error');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showStatusMessage('Image file too large. Please select a file under 5MB', 'error');
        return;
      }

      this.showStatusMessage('Processing image...', 'info');

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imageUrl = e.target.result;
          
          if (!imageUrl) {
            throw new Error('Failed to read image file');
          }
          
          if (type === 'new') {
            this.createImageShape(imageUrl);
          } else if (type === 'existing' && this.state.selectedElement) {
            this.setElementImage(this.state.selectedElement, imageUrl);
          } else {
            throw new Error('No element selected for image upload');
          }
          
          // Clear the file input
          event.target.value = '';
        } catch (error) {
          console.error('Error processing image:', error);
          this.showStatusMessage('Failed to process image', 'error');
        }
      };
      
      reader.onerror = () => {
        console.error('FileReader error');
        this.showStatusMessage('Failed to read image file', 'error');
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      this.showStatusMessage('Image upload failed', 'error');
    }
  }

  triggerImageUpload(type) {
    const uploadId = type === 'new' ? 'image-upload' : 'element-image-upload';
    const uploadInput = document.getElementById(uploadId);
    if (uploadInput) {
      uploadInput.click();
    }
  }

  createImageShape(imageUrl) {
    const shape = document.createElement('div');
    shape.className = 'custom-shape image-shape';
    shape.style.position = 'absolute';
    shape.style.left = '100px';
    shape.style.top = '100px';
    shape.style.width = '200px';
    shape.style.height = '200px';
    shape.style.backgroundImage = `url(${imageUrl})`;
    shape.style.backgroundSize = 'cover';
    shape.style.backgroundPosition = 'center';
    shape.style.backgroundRepeat = 'no-repeat';
    shape.style.border = '2px solid #ddd';
    shape.style.borderRadius = '8px';
    shape.style.zIndex = '1000';
    shape.style.cursor = 'move';
    
    // Add to page
    document.body.appendChild(shape);
    
    // Make it draggable and selectable
    this.makeShapeDraggable(shape);
    this.selectElement(shape);
    
    this.showStatusMessage('✨ Image shape created', 'success');
  }

  setElementImage(element, imageUrl) {
    // Set the image as background
    element.style.backgroundImage = `url(${imageUrl})`;
    element.style.backgroundSize = 'cover';
    element.style.backgroundPosition = 'center';
    element.style.backgroundRepeat = 'no-repeat';
    
    // Add a class to track that this element has an image
    element.classList.add('has-background-image');
    
    this.showStatusMessage('🖼️ Image set successfully', 'success');
    
    // Refresh the element editor to show updated controls
    this.showIntegratedElementEditor(element);
  }

  removeElementImage(element) {
    // Remove background image properties
    element.style.backgroundImage = 'none';
    element.style.backgroundSize = '';
    element.style.backgroundPosition = '';
    element.style.backgroundRepeat = '';
    
    // Remove the tracking class
    element.classList.remove('has-background-image');
    
    this.showStatusMessage('🚫 Image removed', 'success');
    
    // Refresh the element editor to show updated controls
    this.showIntegratedElementEditor(element);
  }
}

// Initialize the functional visual editor
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // Wait for the page to fully load before initializing
    setTimeout(() => {
      window.functionalVisualEditor = new FunctionalVisualEditor();
      console.log('Functional Visual Editor initialized');
    }, 1000);
  });
}