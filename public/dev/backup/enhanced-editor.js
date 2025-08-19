// Enhanced Visual Editor - Complete UX Redesign
// Features: Drag & Drop, Image Upload, Background Selection, Skin Switching

// Prevent duplicate class declaration
if (typeof window !== 'undefined' && !window.EnhancedEditor) {
  
class EnhancedEditor {
  constructor() {
    this.state = {
      isActive: false,
      selectedElement: null,
      dragState: null,
      currentSkin: null,
      uploadedImages: new Map(),
      backgrounds: [],
      templates: [],
      editableElements: new Set()
    };

    // History system for undo/redo
    this.history = {
      states: [],
      currentIndex: -1,
      maxStates: 50
    };

    // Clipboard for copy/paste
    this.clipboard = null;

    this.dragHandlers = {
      isDragging: false,
      startX: 0,
      startY: 0,
      startRect: null,
      handleType: null
    };

    this.init();
    this.bindKeyboardShortcuts();
  }

  async init() {
    if (typeof window === 'undefined') return;

    await this.loadTemplatesAndBackgrounds();
    this.createEditorInterface();
    this.bindEvents();
    this.setupImageUpload();
    this.enableElementDetection();
  }

  async loadTemplatesAndBackgrounds() {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      
      if (data.success) {
        this.state.templates = data.templates;
        this.state.backgrounds = data.backgroundOptions;
      }
    } catch (error) {
      console.warn('Failed to load templates and backgrounds:', error);
    }
  }

  createEditorInterface() {
    // Create modern editor interface with proper layout
    this.createTopToolbar();
    this.createLeftSidebar();
    this.createRightSidebar();
    this.createFloatingControls();
  }

  createTopToolbar() {
    this.topToolbar = document.createElement('div');
    this.topToolbar.className = 'editor-top-toolbar';
    this.topToolbar.innerHTML = `
      <div class="toolbar-left">
        <div class="editor-logo">
          <span class="logo-icon">🎨</span>
          <span class="logo-text">Visual Editor</span>
        </div>
        <div class="toolbar-divider"></div>
        <button class="toolbar-btn editor-toggle ${this.state.isActive ? 'active' : ''}" data-action="toggle">
          <span class="btn-icon">${this.state.isActive ? '🔒' : '✏️'}</span>
          <span class="btn-text">${this.state.isActive ? 'Lock' : 'Edit'}</span>
        </button>
      </div>
      
      <div class="toolbar-center">
        <div class="theme-selector">
          <label class="theme-label">Theme:</label>
          <div class="theme-dropdown">
            <button class="theme-current" data-action="toggle-themes">
              <span class="theme-preview"></span>
              <span class="theme-name">Select Theme</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="theme-options" style="display: none;">
              ${this.renderThemeOptions()}
            </div>
          </div>
        </div>
      </div>
      
      <div class="toolbar-right">
        <button class="toolbar-btn" data-action="undo" disabled title="Undo (Ctrl+Z)">
          <span class="btn-icon">↶</span>
        </button>
        <button class="toolbar-btn" data-action="redo" disabled title="Redo (Ctrl+Y)">
          <span class="btn-icon">↷</span>
        </button>
        <div class="toolbar-divider"></div>
        <button class="toolbar-btn btn-primary" data-action="save-changes">
          <span class="btn-icon">💾</span>
          <span class="btn-text">Save</span>
        </button>
        <button class="toolbar-btn btn-secondary" data-action="close">
          <span class="btn-icon">×</span>
        </button>
      </div>
    `;
    
    document.body.appendChild(this.topToolbar);
  }

  createLeftSidebar() {
    this.leftSidebar = document.createElement('div');
    this.leftSidebar.className = 'editor-left-sidebar';
    this.leftSidebar.innerHTML = `
      <div class="sidebar-header">
        <h4>Add Elements</h4>
      </div>
      
      <div class="sidebar-content">
        <!-- Symbols Section -->
        <div class="element-category">
          <div class="category-header" data-category="symbols">
            <span class="category-toggle">▼</span>
            <span class="category-title">⭐ Symbols & Icons</span>
          </div>
          <div class="category-content" data-category="symbols">
            <div class="element-grid">
              <button class="add-element-btn" data-element="star" title="Add star icon">⭐</button>
              <button class="add-element-btn" data-element="heart" title="Add heart icon">❤️</button>
              <button class="add-element-btn" data-element="arrow" title="Add arrow icon">➡️</button>
              <button class="add-element-btn" data-element="check" title="Add check icon">✅</button>
              <button class="add-element-btn" data-element="phone" title="Add phone icon">📞</button>
              <button class="add-element-btn" data-element="email" title="Add email icon">📧</button>
            </div>
          </div>
        </div>
        
        <!-- Menu Section -->
        <div class="element-category">
          <div class="category-header" data-category="menu">
            <span class="category-toggle">▼</span>
            <span class="category-title">🍽️ Menu Items</span>
          </div>
          <div class="category-content" data-category="menu">
            <div class="element-grid">
              <button class="add-element-btn" data-element="menu-item" title="Menu item with price">📄 Item</button>
              <button class="add-element-btn" data-element="menu-category" title="Menu category header">📋 Category</button>
              <button class="add-element-btn" data-element="special-offer" title="Special offer banner">🎯 Special</button>
              <button class="add-element-btn" data-element="price-list" title="Price list table">💰 Prices</button>
            </div>
          </div>
        </div>
        
        <!-- Content Section -->
        <div class="element-category">
          <div class="category-header" data-category="content">
            <span class="category-toggle">▼</span>
            <span class="category-title">📝 Content</span>
          </div>
          <div class="category-content" data-category="content">
            <div class="element-grid">
              <button class="add-element-btn" data-element="text" title="Text block">📝 Text</button>
              <button class="add-element-btn" data-element="heading" title="Heading">📰 Heading</button>
              <button class="add-element-btn" data-element="button" title="Button">🔘 Button</button>
              <button class="add-element-btn" data-element="image" title="Image placeholder">🖼️ Image</button>
            </div>
          </div>
        </div>
        
        <!-- Layout Section -->
        <div class="element-category">
          <div class="category-header" data-category="layout">
            <span class="category-toggle">▼</span>
            <span class="category-title">📐 Layout</span>
          </div>
          <div class="category-content" data-category="layout">
            <div class="element-grid">
              <button class="add-element-btn" data-element="container" title="Container box">📦 Container</button>
              <button class="add-element-btn" data-element="section" title="Section divider">📄 Section</button>
              <button class="add-element-btn" data-element="divider" title="Horizontal divider">➖ Divider</button>
              <button class="add-element-btn" data-element="spacer" title="Empty spacer">⬜ Spacer</button>
            </div>
          </div>
        </div>

        <!-- Plugins Section -->
        <div class="element-category">
          <div class="category-header" data-category="plugins">
            <span class="category-toggle">▼</span>
            <span class="category-title">🔌 Plugins</span>
          </div>
          <div class="category-content" data-category="plugins">
            <div class="element-grid">
              <button class="add-element-btn" data-element="contact-form" title="Contact form">📨 Contact</button>
              <button class="add-element-btn" data-element="gallery" title="Photo gallery">🖼️ Gallery</button>
              <button class="add-element-btn" data-element="map" title="Location map">🗺️ Map</button>
              <button class="add-element-btn" data-element="reviews" title="Customer reviews">⭐ Reviews</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.leftSidebar);
  }

  createRightSidebar() {
    this.rightSidebar = document.createElement('div');
    this.rightSidebar.className = 'editor-right-sidebar';
    this.rightSidebar.innerHTML = `
      <div class="sidebar-header">
        <h4>Properties</h4>
      </div>
      
      <div class="sidebar-content">
        <div class="no-selection-message">
          <div class="message-icon">👆</div>
          <p>Select an element to edit its properties</p>
        </div>
        
        <div class="element-properties-panel" style="display: none;">
          <!-- Properties will be populated when element is selected -->
        </div>
      </div>
    `;
    
    document.body.appendChild(this.rightSidebar);
  }

  createFloatingControls() {
    this.floatingControls = document.createElement('div');
    this.floatingControls.className = 'editor-floating-controls';
    this.floatingControls.innerHTML = `
      <button class="floating-btn" data-action="toggle-left-sidebar" title="Toggle Elements Panel">
        <span class="btn-icon">📋</span>
      </button>
      <button class="floating-btn" data-action="toggle-right-sidebar" title="Toggle Properties Panel">  
        <span class="btn-icon">🔧</span>
      </button>
      <button class="floating-btn" data-action="zoom-fit" title="Fit to Screen">
        <span class="btn-icon">🔍</span>
      </button>
    `;
    
    document.body.appendChild(this.floatingControls);
  }

  renderThemeOptions() {
    if (!this.state.templates.length) {
      return '<div class="theme-loading">Loading themes...</div>';
    }

    // Organize templates into Static and Premium categories
    const staticThemes = this.state.templates.filter(t => t.category === 'static' || t.type === 'skin');
    const premiumThemes = this.state.templates.filter(t => t.category === 'premium');

    return `
      <div class="theme-category">
        <div class="theme-category-header">Static Themes</div>
        <div class="theme-grid">
          ${staticThemes.map(theme => `
            <div class="theme-option" data-theme-id="${theme.id}" data-theme-type="static">
              <div class="theme-preview-img" style="background: ${this.getThemePreviewColor(theme)};">
                <span class="theme-preview-text">${theme.name.charAt(0)}</span>
              </div>
              <div class="theme-info">
                <div class="theme-name">${theme.name}</div>
                <div class="theme-type">Static</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      ${premiumThemes.length ? `
        <div class="theme-category">
          <div class="theme-category-header">Premium Themes</div>
          <div class="theme-grid">
            ${premiumThemes.map(theme => `
              <div class="theme-option premium" data-theme-id="${theme.id}" data-theme-type="premium">
                <div class="theme-preview-img" style="background: ${this.getThemePreviewColor(theme)};">
                  <span class="theme-preview-text">${theme.name.charAt(0)}</span>
                  <span class="premium-badge">✨</span>
                </div>
                <div class="theme-info">
                  <div class="theme-name">${theme.name}</div>
                  <div class="theme-type">Premium</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }

  getThemePreviewColor(theme) {
    // Generate a preview color based on theme name
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];
    const index = theme.name.length % colors.length;
    return `linear-gradient(135deg, ${colors[index]}, ${colors[(index + 1) % colors.length]})`;
  }


  // Apply the new modern editor styles
  applyEditorStyles() {
    if (document.getElementById('enhanced-editor-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'enhanced-editor-styles';
    styles.textContent = this.getModernEditorStyles();
    document.head.appendChild(styles);
  }

  bindEvents() {
    // Toolbar actions
    this.topToolbar.addEventListener('click', (e) => {
      const actionElement = e.target.closest('[data-action]');
      const action = actionElement ? actionElement.dataset.action : null;
      switch (action) {
        case 'toggle':
          this.toggleEditor();
          break;
        case 'close':
          this.closeEditor();
          break;
        case 'save-changes':
          this.saveChanges();
          break;
        case 'undo':
          this.undo();
          break;
        case 'redo':
          this.redo();
          break;
        case 'toggle-themes':
          this.toggleThemeDropdown();
          break;
      }
    });

    // Theme selection
    this.topToolbar.addEventListener('click', (e) => {
      const themeOption = e.target.closest('.theme-option');
      if (themeOption) {
        this.selectTheme(themeOption.dataset.themeId, themeOption.dataset.themeType);
      }
    });

    // Floating controls
    this.floatingControls.addEventListener('click', (e) => {
      const actionElement = e.target.closest('[data-action]');
      const action = actionElement ? actionElement.dataset.action : null;
      switch (action) {
        case 'toggle-left-sidebar':
          this.toggleLeftSidebar();
          break;
        case 'toggle-right-sidebar':
          this.toggleRightSidebar();
          break;
        case 'zoom-fit':
          this.zoomToFit();
          break;
      }
    });

    // Left sidebar - category collapse/expand handlers
    this.leftSidebar.addEventListener('click', (e) => {
      if (e.target.closest('.category-header')) {
        const header = e.target.closest('.category-header');
        const category = header.dataset.category;
        const content = this.leftSidebar.querySelector(`.category-content[data-category="${category}"]`);
        const toggle = header.querySelector('.category-toggle');
        
        if (content.style.display === 'none') {
          content.style.display = 'block';
          toggle.textContent = '▼';
        } else {
          content.style.display = 'none';
          toggle.textContent = '▶';
        }
      }
    });

    // Left sidebar - add element handlers
    this.leftSidebar.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-element-btn')) {
        const elementType = e.target.dataset.element;
        this.addNewElement(elementType);
      }
    });

    // Global click handler for element selection
    document.addEventListener('click', (e) => {
      if (this.state.isActive && 
          !e.target.closest('.editor-top-toolbar') && 
          !e.target.closest('.editor-left-sidebar') && 
          !e.target.closest('.editor-right-sidebar') && 
          !e.target.closest('.editor-floating-controls')) {
        this.selectElement(e.target);
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Drag and drop handlers
    document.addEventListener('mousedown', this.handleDragStart.bind(this));
    document.addEventListener('mousemove', this.handleDrag.bind(this));
    document.addEventListener('mouseup', this.handleDragEnd.bind(this));
  }

  setupImageUpload() {
    const imageInput = this.editorPanel.querySelector('.image-input');
    const uploadArea = this.editorPanel.querySelector('.upload-area');

    imageInput.addEventListener('change', (e) => {
      this.handleImageFiles(e.target.files);
    });

    // Drag and drop for upload area
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      this.handleImageFiles(e.dataTransfer.files);
    });

    this.loadUploadedImages();
  }

  async handleImageFiles(files) {
    for (const file of files) {
      await this.uploadImage(file);
    }
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('targetElement', '');

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        this.state.uploadedImages.set(result.filename, result);
        this.updateImageGallery();
        this.showStatus(`Image "${file.name}" uploaded successfully`, 'success');
      } else {
        this.showStatus(`Failed to upload "${file.name}": ${result.error}`, 'error');
      }
    } catch (error) {
      this.showStatus(`Upload error: ${error.message}`, 'error');
    }
  }

  async loadUploadedImages() {
    try {
      const response = await fetch('/api/upload/image');
      const data = await response.json();
      
      if (data.success) {
        data.images.forEach(img => {
          this.state.uploadedImages.set(img.filename, img);
        });
        this.updateImageGallery();
      }
    } catch (error) {
      console.warn('Failed to load uploaded images:', error);
    }
  }

  updateImageGallery() {
    const gallery = this.editorPanel.querySelector('.image-gallery');
    if (!gallery) return;

    gallery.innerHTML = Array.from(this.state.uploadedImages.values()).map(img => `
      <div class="gallery-item" data-filename="${img.filename}">
        <img src="${img.url}" alt="${img.originalName || img.filename}" />
        <div class="gallery-item-actions">
          <button class="btn-use-image" data-url="${img.url}">Use</button>
          <button class="btn-delete-image" data-filename="${img.filename}">🗑️</button>
        </div>
        <span class="gallery-item-name">${img.originalName || img.filename}</span>
      </div>
    `).join('');

    // Bind gallery actions
    gallery.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-use-image')) {
        this.useImageForReplacement(e.target.dataset.url);
      } else if (e.target.classList.contains('btn-delete-image')) {
        this.deleteImage(e.target.dataset.filename);
      }
    });
  }

  async deleteImage(filename) {
    try {
      const response = await fetch(`/api/upload/image?filename=${filename}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        this.state.uploadedImages.delete(filename);
        this.updateImageGallery();
        this.showStatus(`Image deleted successfully`, 'success');
      } else {
        this.showStatus(`Failed to delete image: ${result.error}`, 'error');
      }
    } catch (error) {
      this.showStatus(`Delete error: ${error.message}`, 'error');
    }
  }

  useImageForReplacement(imageUrl) {
    this.enterImageReplaceMode(imageUrl);
  }

  enterImageReplaceMode(imageUrl) {
    this.state.replaceImageUrl = imageUrl;
    document.body.style.cursor = 'crosshair';
    this.showStatus('Click on any image to replace it', 'info');
    
    // Show replace mode UI
    const replaceMode = this.editorPanel.querySelector('.image-replacement-mode');
    replaceMode.style.display = 'block';
    
    // Add click handler for image replacement
    this.imageReplaceHandler = (e) => {
      if (e.target.tagName === 'IMG' && !e.target.closest('.enhanced-editor-panel')) {
        e.target.src = imageUrl;
        this.exitImageReplaceMode();
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    document.addEventListener('click', this.imageReplaceHandler, true);
    
    // Exit replace mode button
    const exitBtn = this.editorPanel.querySelector('.btn-exit-replace-mode');
    exitBtn.onclick = () => this.exitImageReplaceMode();
  }

  exitImageReplaceMode() {
    document.body.style.cursor = '';
    this.state.replaceImageUrl = null;
    this.showStatus('Image replace mode disabled', 'info');
    
    const replaceMode = this.editorPanel.querySelector('.image-replacement-mode');
    replaceMode.style.display = 'none';
    
    if (this.imageReplaceHandler) {
      document.removeEventListener('click', this.imageReplaceHandler, true);
      this.imageReplaceHandler = null;
    }
  }

  enableElementDetection() {
    // Find all editable elements
    const editableSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'div', 'section', 'article',
      'img', 'button', 'a',
      '.hero', '.menu-list', '.gallery',
      '.navbar', '.footer'
    ];

    editableSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.closest('.enhanced-editor-panel')) {
          this.state.editableElements.add(el);
          el.classList.add('editor-hoverable');
        }
      });
    });

    this.updateEditableCount();
  }

  selectElement(element) {
    if (!this.state.isActive) return;
    
    // Clear previous selection
    this.clearSelection();
    
    this.state.selectedElement = element;
    element.classList.add('editor-selected');
    
    // Show element properties
    this.showElementProperties(element);
    
    // Create drag handles
    this.createDragHandles(element);
  }

  clearSelection() {
    if (this.state.selectedElement) {
      this.state.selectedElement.classList.remove('editor-selected');
      this.state.selectedElement = null;
    }
    
    this.clearDragHandles();
    this.hideElementProperties();
  }

  showElementProperties(element) {
    const propertiesPanel = this.rightSidebar.querySelector('.element-properties-panel');
    const noSelectionMessage = this.rightSidebar.querySelector('.no-selection-message');
    
    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    propertiesPanel.innerHTML = `
      <div class="property-grid">
        <div class="property-item">
          <label>Tag:</label>
          <span class="property-value">${element.tagName.toLowerCase()}</span>
        </div>
        <div class="property-item">
          <label>Classes:</label>
          <span class="property-value">${element.className || 'none'}</span>
        </div>
        <div class="property-item">
          <label>Size:</label>
          <span class="property-value">${Math.round(rect.width)}×${Math.round(rect.height)}px</span>
        </div>
        
        <div class="property-controls">
          <div class="control-group">
            <label>Background:</label>
            <input type="color" class="element-bg-color" 
                   value="${this.rgbToHex(computedStyle.backgroundColor)}" 
                   data-property="backgroundColor">
          </div>
          
          <div class="control-group">
            <label>Text Color:</label>
            <input type="color" class="element-text-color" 
                   value="${this.rgbToHex(computedStyle.color)}" 
                   data-property="color">
          </div>
          
          <div class="control-group">
            <label>Font Size:</label>
            <input type="range" min="8" max="72" 
                   value="${parseInt(computedStyle.fontSize)}" 
                   data-property="fontSize" class="font-size-slider">
            <span class="font-size-display">${computedStyle.fontSize}</span>
          </div>
          
          <div class="control-group">
            <label>Border Radius:</label>
            <input type="range" min="0" max="50" 
                   value="${parseInt(computedStyle.borderRadius) || 0}" 
                   data-property="borderRadius" class="border-radius-slider">
            <span class="border-radius-display">${computedStyle.borderRadius}</span>
          </div>
          
          <div class="control-group">
            <label>Opacity:</label>
            <input type="range" min="0" max="100" 
                   value="${Math.round(parseFloat(computedStyle.opacity) * 100)}" 
                   data-property="opacity" class="opacity-slider">
            <span class="opacity-display">${Math.round(parseFloat(computedStyle.opacity) * 100)}%</span>
          </div>
          
          <div class="control-group">
            <label>Shape:</label>
            <div class="shape-options">
              <button class="shape-btn" data-shape="square" title="Square corners">⬜</button>
              <button class="shape-btn" data-shape="rounded" title="Rounded corners">⬜</button>
              <button class="shape-btn" data-shape="circle" title="Circle">⚫</button>
            </div>
          </div>
          
          <div class="control-group">
            <label>Auto-Resize:</label>
            <div class="resize-options">
              <button class="resize-btn" data-resize="fit-content" title="Fit to content">📏 Fit Content</button>
              <button class="resize-btn" data-resize="preview" title="Preview resize">👁️ Preview</button>
            </div>
          </div>
          
          <div class="control-group">
            <label>Actions:</label>
            <div class="element-actions">
              <button class="action-btn" data-action="copy-element" title="Copy element">📄 Copy</button>
              <button class="action-btn" data-action="paste-element" title="Paste element">📋 Paste</button>
              <button class="action-btn" data-action="duplicate-element" title="Duplicate element">📑 Duplicate</button>
            </div>
          </div>
          
          <div class="control-group">
            <label>Replace with:</label>
            <div class="replace-options">
              <select class="plugin-select">
                <option value="">Choose plugin...</option>
                <option value="contact-form">📨 Contact Form</option>
                <option value="gallery">🖼️ Image Gallery</option>
                <option value="map">🗺️ Location Map</option>
                <option value="reviews">⭐ Reviews</option>
              </select>
              <button class="replace-btn" data-action="replace-with-plugin">Replace</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Bind property controls
    propertiesPanel.addEventListener('input', (e) => {
      this.handlePropertyChange(e, element);
    });
    
    // Bind shape options
    propertiesPanel.addEventListener('click', (e) => {
      if (e.target.classList.contains('shape-btn')) {
        this.applyShape(element, e.target.dataset.shape);
      } else if (e.target.classList.contains('resize-btn')) {
        this.handleAutoResize(element, e.target.dataset.resize);
      } else if (e.target.classList.contains('replace-btn')) {
        const select = propertiesPanel.querySelector('.plugin-select');
        if (select.value) {
          this.replaceWithPlugin(element, select.value);
        }
      } else if (e.target.classList.contains('action-btn')) {
        const action = e.target.dataset.action;
        switch (action) {
          case 'copy-element':
            this.copyElement(element);
            break;
          case 'paste-element':
            this.pasteElement();
            break;
          case 'duplicate-element':
            this.duplicateElement(element);
            break;
        }
      }
    });
    
    // Show properties panel and hide no selection message
    noSelectionMessage.style.display = 'none';
    propertiesPanel.style.display = 'block';
  }

  handlePropertyChange(e, element) {
    // Save state before making changes
    this.saveToHistory();
    
    const property = e.target.dataset.property;
    let value = e.target.value;
    
    switch (property) {
      case 'fontSize':
        value += 'px';
        e.target.nextElementSibling.textContent = value;
        break;
      case 'borderRadius':
        value += 'px';
        e.target.nextElementSibling.textContent = value;
        break;
      case 'opacity':
        const opacityValue = parseInt(value) / 100;
        element.style[property] = opacityValue;
        e.target.nextElementSibling.textContent = value + '%';
        return;
    }
    
    element.style[property] = value;
  }

  hideElementProperties() {
    const propertiesPanel = this.rightSidebar.querySelector('.element-properties-panel');
    const noSelectionMessage = this.rightSidebar.querySelector('.no-selection-message');
    
    propertiesPanel.style.display = 'none';
    noSelectionMessage.style.display = 'block';
  }

  createDragHandles(element) {
    this.clearDragHandles();
    
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const scrollLeft = window.pageXOffset;
    
    // 8-point resize handles: 4 corners + 4 middle edges
    const handles = [
      // Corners
      { type: 'nw', x: rect.left + scrollLeft - 4, y: rect.top + scrollTop - 4, cursor: 'nw-resize' },
      { type: 'ne', x: rect.right + scrollLeft - 4, y: rect.top + scrollTop - 4, cursor: 'ne-resize' },
      { type: 'sw', x: rect.left + scrollLeft - 4, y: rect.bottom + scrollTop - 4, cursor: 'sw-resize' },
      { type: 'se', x: rect.right + scrollLeft - 4, y: rect.bottom + scrollTop - 4, cursor: 'se-resize' },
      // Edges
      { type: 'n', x: rect.left + scrollLeft + rect.width/2 - 4, y: rect.top + scrollTop - 4, cursor: 'n-resize' },
      { type: 's', x: rect.left + scrollLeft + rect.width/2 - 4, y: rect.bottom + scrollTop - 4, cursor: 's-resize' },
      { type: 'w', x: rect.left + scrollLeft - 4, y: rect.top + scrollTop + rect.height/2 - 4, cursor: 'w-resize' },
      { type: 'e', x: rect.right + scrollLeft - 4, y: rect.top + scrollTop + rect.height/2 - 4, cursor: 'e-resize' }
    ];
    
    handles.forEach(handle => {
      const handleEl = document.createElement('div');
      handleEl.className = `drag-handle drag-handle-${handle.type}`;
      handleEl.style.left = `${handle.x}px`;
      handleEl.style.top = `${handle.y}px`;
      handleEl.style.cursor = handle.cursor;
      handleEl.dataset.handleType = handle.type;
      handleEl.title = `Resize ${handle.type.toUpperCase()}`;
      
      document.body.appendChild(handleEl);
    });
    
    // Add visual overlay to show selected element bounds
    const overlay = document.createElement('div');
    overlay.className = 'element-selection-overlay';
    overlay.style.cssText = `
      position: absolute;
      left: ${rect.left + scrollLeft}px;
      top: ${rect.top + scrollTop}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 2px solid #667eea;
      background: rgba(102, 126, 234, 0.1);
      pointer-events: none;
      z-index: 9998;
      border-radius: 4px;
    `;
    document.body.appendChild(overlay);
  }

  clearDragHandles() {
    document.querySelectorAll('.drag-handle').forEach(handle => handle.remove());
    document.querySelectorAll('.element-selection-overlay').forEach(overlay => overlay.remove());
  }

  handleDragStart(e) {
    const handle = e.target.closest('.drag-handle');
    if (!handle || !this.state.selectedElement) return;
    
    this.dragHandlers.isDragging = true;
    this.dragHandlers.startX = e.clientX;
    this.dragHandlers.startY = e.clientY;
    this.dragHandlers.handleType = handle.dataset.handleType;
    this.dragHandlers.startRect = this.state.selectedElement.getBoundingClientRect();
    
    e.preventDefault();
  }

  handleDrag(e) {
    if (!this.dragHandlers.isDragging) return;
    
    const deltaX = e.clientX - this.dragHandlers.startX;
    const deltaY = e.clientY - this.dragHandlers.startY;
    
    this.updateElementSize(deltaX, deltaY);
    this.createDragHandles(this.state.selectedElement);
  }

  handleDragEnd() {
    if (this.dragHandlers.isDragging) {
      // Save state after drag/resize operation
      this.saveToHistory();
    }
    
    this.dragHandlers.isDragging = false;
    this.dragHandlers.handleType = null;
    this.dragHandlers.startRect = null;
  }

  updateElementSize(deltaX, deltaY) {
    const element = this.state.selectedElement;
    const handleType = this.dragHandlers.handleType;
    const startRect = this.dragHandlers.startRect;
    
    let newWidth = startRect.width;
    let newHeight = startRect.height;
    let newLeft = 0;
    let newTop = 0;
    
    // Calculate new dimensions based on handle type
    switch (handleType) {
      // Corner handles
      case 'se':
        newWidth = startRect.width + deltaX;
        newHeight = startRect.height + deltaY;
        break;
      case 'sw':
        newWidth = startRect.width - deltaX;
        newHeight = startRect.height + deltaY;
        newLeft = deltaX;
        break;
      case 'ne':
        newWidth = startRect.width + deltaX;
        newHeight = startRect.height - deltaY;
        newTop = deltaY;
        break;
      case 'nw':
        newWidth = startRect.width - deltaX;
        newHeight = startRect.height - deltaY;
        newLeft = deltaX;
        newTop = deltaY;
        break;
      // Edge handles
      case 'n':
        newHeight = startRect.height - deltaY;
        newTop = deltaY;
        break;
      case 's':
        newHeight = startRect.height + deltaY;
        break;
      case 'w':
        newWidth = startRect.width - deltaX;
        newLeft = deltaX;
        break;
      case 'e':
        newWidth = startRect.width + deltaX;
        break;
    }
    
    // Apply minimum size constraints
    const minWidth = 20;
    const minHeight = 20;
    
    if (newWidth >= minWidth) {
      element.style.width = `${newWidth}px`;
      if (newLeft !== 0) {
        const currentLeft = parseInt(element.style.left) || 0;
        element.style.left = `${currentLeft + newLeft}px`;
        element.style.position = 'relative';
      }
    }
    
    if (newHeight >= minHeight) {
      element.style.height = `${newHeight}px`;
      if (newTop !== 0) {
        const currentTop = parseInt(element.style.top) || 0;
        element.style.top = `${currentTop + newTop}px`;
        element.style.position = 'relative';
      }
    }
  }

  switchTab(tabName) {
    // Update tab buttons
    this.editorPanel.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    this.editorPanel.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.dataset.tab === tabName);
    });
  }

  toggleEditor() {
    this.state.isActive = !this.state.isActive;
    
    // Update toolbar button
    const toggleBtn = this.topToolbar.querySelector('.editor-toggle');
    const btnIcon = toggleBtn.querySelector('.btn-icon');
    const btnText = toggleBtn.querySelector('.btn-text');
    
    btnIcon.textContent = this.state.isActive ? '🔒' : '✏️';
    btnText.textContent = this.state.isActive ? 'Lock' : 'Edit';
    toggleBtn.classList.toggle('active', this.state.isActive);
    
    // Show/hide interface elements
    this.leftSidebar.style.display = this.state.isActive ? 'flex' : 'none';
    this.rightSidebar.style.display = this.state.isActive ? 'flex' : 'none';
    this.floatingControls.style.display = this.state.isActive ? 'flex' : 'none';
    
    if (this.state.isActive) {
      // Save initial state when starting edit mode
      this.saveToHistory();
      this.applyEditorStyles();
    } else {
      this.clearSelection();
    }
    
    document.body.classList.toggle('editor-active', this.state.isActive);
  }

  selectTemplate(templateId, templateType) {
    this.state.currentSkin = templateId;
    
    // Update visual selection
    this.editorPanel.querySelectorAll('.skin-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.templateId === templateId);
    });
    
    if (templateType === 'skin') {
      // Load skin CSS
      this.loadSkinCSS(templateId);
    } else {
      // Handle standalone template
      this.handleStandaloneTemplate(templateId);
    }
    
    this.showStatus(`Template "${templateId}" selected`, 'success');
  }

  loadSkinCSS(skinId) {
    // Remove existing skin CSS
    const existingLink = document.getElementById('editor-skin-css');
    if (existingLink) existingLink.remove();
    
    // Add new skin CSS
    const link = document.createElement('link');
    link.id = 'editor-skin-css';
    link.rel = 'stylesheet';
    link.href = `/api/skins/${skinId}/css`;
    document.head.appendChild(link);
    
    // Update data-skin attribute
    document.body.setAttribute('data-skin', skinId);
  }

  async handleStandaloneTemplate(templateId) {
    try {
      const response = await fetch('/api/templates/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          restaurantData: window.restaurantData || {}
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show standalone preview
        this.showStandalonePreview(result.previewHTML);
      }
    } catch (error) {
      console.error('Failed to load standalone template preview:', error);
    }
  }

  showStandalonePreview(previewHTML) {
    let previewContainer = document.getElementById('standalone-preview-container');
    
    if (!previewContainer) {
      previewContainer = document.createElement('div');
      previewContainer.id = 'standalone-preview-container';
      previewContainer.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        width: 400px;
        max-height: 600px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        z-index: 9999;
        overflow: auto;
        padding: 1rem;
      `;
      document.body.appendChild(previewContainer);
    }
    
    previewContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h4>📱 Template Preview</h4>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none; border: none; font-size: 1.5rem; cursor: pointer;
        ">×</button>
      </div>
      ${previewHTML}
    `;
  }

  applyBackground(backgroundId) {
    const background = this.state.backgrounds.find(bg => bg.id === backgroundId);
    if (!background) return;
    
    this.applyCustomBackground(background.type, background.value, background.size);
    this.showStatus(`Background "${background.name}" applied`, 'success');
  }

  applyCustomBackground(type, value, size) {
    const previewArea = document.querySelector('.preview-mode, [data-skin]') || document.body;
    
    switch (type) {
      case 'solid':
        previewArea.style.background = value;
        break;
      case 'gradient':
        previewArea.style.background = value;
        break;
      case 'pattern':
        previewArea.style.background = value;
        if (size) previewArea.style.backgroundSize = size;
        break;
      case 'image':
        previewArea.style.background = `url('${value}') center/cover`;
        break;
    }
  }

  triggerImageUpload() {
    const imageInput = this.editorPanel.querySelector('.image-input');
    imageInput.click();
  }

  enableDragMode() {
    this.showStatus('Drag mode enabled - Click and drag elements to move them', 'info');
    // Implementation for drag mode
  }

  enableResizeMode() {
    this.showStatus('Resize mode enabled - Use handles to resize elements', 'info');
    // Implementation for resize mode
  }

  resetLayout() {
    if (confirm('Reset all layout changes? This cannot be undone.')) {
      location.reload();
    }
  }

  saveChanges() {
    // Collect all modifications
    const changes = {
      timestamp: new Date().toISOString(),
      skin: this.state.currentSkin,
      modifications: []
    };
    
    // Save to localStorage for now
    localStorage.setItem('editor-changes', JSON.stringify(changes));
    this.showStatus('Changes saved successfully', 'success');
  }

  resetAll() {
    if (confirm('Reset all changes? This will reload the page.')) {
      localStorage.removeItem('editor-changes');
      location.reload();
    }
  }

  // New Interface Methods
  toggleThemeDropdown() {
    const themeOptions = this.topToolbar.querySelector('.theme-options');
    const isVisible = themeOptions.style.display !== 'none';
    themeOptions.style.display = isVisible ? 'none' : 'block';
  }

  selectTheme(themeId, themeType) {
    this.state.currentSkin = themeId;
    
    // Update theme selector display
    const themeCurrent = this.topToolbar.querySelector('.theme-current');
    const themeName = themeCurrent.querySelector('.theme-name');
    const themePreview = themeCurrent.querySelector('.theme-preview');
    
    const selectedTheme = this.state.templates.find(t => t.id === themeId);
    if (selectedTheme) {
      themeName.textContent = selectedTheme.name;
      themePreview.style.background = this.getThemePreviewColor(selectedTheme);
    }
    
    // Hide dropdown
    this.toggleThemeDropdown();
    
    // Apply theme
    this.loadSkinCSS(themeId);
    this.showStatus(`Theme "${selectedTheme ? selectedTheme.name : 'Unknown'}" applied`, 'success');
  }

  toggleLeftSidebar() {
    this.leftSidebar.classList.toggle('collapsed');
  }

  toggleRightSidebar() {
    this.rightSidebar.classList.toggle('collapsed');
  }

  zoomToFit() {
    // Simple zoom to fit implementation
    document.body.style.zoom = '1';
    window.scrollTo(0, 0);
    this.showStatus('Zoomed to fit', 'info');
  }

  // History Management
  saveToHistory() {
    const currentState = this.captureCurrentState();
    
    // Remove any states after current index (when undoing and making new changes)
    this.history.states = this.history.states.slice(0, this.history.currentIndex + 1);
    
    // Add new state
    this.history.states.push(currentState);
    this.history.currentIndex++;
    
    // Limit history size
    if (this.history.states.length > this.history.maxStates) {
      this.history.states.shift();
      this.history.currentIndex--;
    }
    
    this.updateHistoryButtons();
  }

  captureCurrentState() {
    const elements = Array.from(document.querySelectorAll('*')).filter(el => 
      !el.closest('.enhanced-editor-panel') && 
      !el.classList.contains('drag-handle') && 
      !el.classList.contains('element-selection-overlay')
    );
    
    return {
      timestamp: Date.now(),
      elements: elements.map(el => ({
        xpath: this.getElementXPath(el),
        styles: el.style.cssText,
        innerHTML: el.innerHTML,
        className: el.className
      })),
      bodyStyle: document.body.style.cssText
    };
  }

  restoreState(state) {
    if (!state) return;
    
    // Clear current selection
    this.clearSelection();
    
    // Restore body styles
    document.body.style.cssText = state.bodyStyle;
    
    // Restore elements
    state.elements.forEach(elementData => {
      const element = this.getElementByXPath(elementData.xpath);
      if (element) {
        element.style.cssText = elementData.styles;
        element.innerHTML = elementData.innerHTML;
        element.className = elementData.className;
      }
    });
    
    this.updateHistoryButtons();
  }

  undo() {
    if (this.history.currentIndex > 0) {
      this.history.currentIndex--;
      const state = this.history.states[this.history.currentIndex];
      this.restoreState(state);
      this.showStatus('Undid last action', 'info');
    }
  }

  redo() {
    if (this.history.currentIndex < this.history.states.length - 1) {
      this.history.currentIndex++;
      const state = this.history.states[this.history.currentIndex];
      this.restoreState(state);
      this.showStatus('Redid action', 'info');
    }
  }

  updateHistoryButtons() {
    const undoBtn = this.topToolbar.querySelector('[data-action="undo"]');
    const redoBtn = this.topToolbar.querySelector('[data-action="redo"]');
    
    if (undoBtn) {
      undoBtn.disabled = this.history.currentIndex <= 0;
      undoBtn.style.opacity = undoBtn.disabled ? '0.5' : '1';
    }
    
    if (redoBtn) {
      redoBtn.disabled = this.history.currentIndex >= this.history.states.length - 1;
      redoBtn.style.opacity = redoBtn.disabled ? '0.5' : '1';
    }
  }

  closeEditor() {
    this.state.isActive = false;
    document.body.classList.remove('editor-active');
    
    // Remove all interface elements
    if (this.topToolbar) this.topToolbar.remove();
    if (this.leftSidebar) this.leftSidebar.remove();
    if (this.rightSidebar) this.rightSidebar.remove();
    if (this.floatingControls) this.floatingControls.remove();
    
    this.clearSelection();
    
    // Remove styles
    const styles = document.getElementById('enhanced-editor-styles');
    if (styles) styles.remove();
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (!this.state.isActive) return;
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        if (this.state.selectedElement) {
          this.copyElement(this.state.selectedElement);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        this.pasteElement();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (this.state.selectedElement) {
          this.duplicateElement(this.state.selectedElement);
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.state.selectedElement && e.target === document.body) {
          e.preventDefault();
          this.deleteElement(this.state.selectedElement);
        }
      }
    });
  }

  getElementXPath(element) {
    const paths = [];
    let currentElement = element;
    
    while (currentElement && currentElement !== document.body) {
      let index = 0;
      let sibling = currentElement.previousSibling;
      
      while (sibling) {
        if (sibling.nodeType === 1 && sibling.tagName === currentElement.tagName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }
      
      const tagName = currentElement.tagName.toLowerCase();
      const pathIndex = index > 0 ? `[${index + 1}]` : '';
      paths.unshift(`${tagName}${pathIndex}`);
      
      currentElement = currentElement.parentElement;
    }
    
    return '/' + paths.join('/');
  }

  getElementByXPath(xpath) {
    try {
      const result = document.evaluate(xpath, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      return result.singleNodeValue;
    } catch (error) {
      console.warn('XPath evaluation failed:', error);
      return null;
    }
  }

  // Shape and Auto-Resize Methods
  applyShape(element, shape) {
    this.saveToHistory();
    
    switch (shape) {
      case 'square':
        element.style.borderRadius = '0';
        break;
      case 'rounded':
        element.style.borderRadius = '8px';
        break;
      case 'circle':
        const size = Math.min(element.offsetWidth, element.offsetHeight);
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.borderRadius = '50%';
        break;
    }
    
    this.createDragHandles(element);
    this.showStatus(`Applied ${shape} shape`, 'success');
  }

  handleAutoResize(element, mode) {
    switch (mode) {
      case 'fit-content':
        this.autoResizeToContent(element);
        break;
      case 'preview':
        this.previewAutoResize(element);
        break;
    }
  }

  autoResizeToContent(element) {
    this.saveToHistory();
    
    // Store original styles
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;
    const originalPadding = element.style.padding;
    
    // Reset to auto to measure content
    element.style.width = 'auto';
    element.style.height = 'auto';
    element.style.padding = '1rem';
    
    const rect = element.getBoundingClientRect();
    
    // Apply new dimensions with some padding
    const newWidth = Math.max(100, rect.width + 20);
    const newHeight = Math.max(50, rect.height + 20);
    
    element.style.width = `${newWidth}px`;
    element.style.height = `${newHeight}px`;
    
    this.createDragHandles(element);
    this.showStatus(`Auto-resized to ${newWidth}×${newHeight}px`, 'success');
  }

  previewAutoResize(element) {
    // Create preview overlay
    const overlay = document.createElement('div');
    overlay.className = 'resize-preview-overlay';
    
    // Calculate what the new size would be
    const tempElement = element.cloneNode(true);
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.style.width = 'auto';
    tempElement.style.height = 'auto';
    tempElement.style.padding = '1rem';
    document.body.appendChild(tempElement);
    
    const tempRect = tempElement.getBoundingClientRect();
    const newWidth = Math.max(100, tempRect.width + 20);
    const newHeight = Math.max(50, tempRect.height + 20);
    
    document.body.removeChild(tempElement);
    
    // Show preview
    const rect = element.getBoundingClientRect();
    overlay.style.cssText = `
      position: absolute;
      left: ${rect.left + window.pageXOffset}px;
      top: ${rect.top + window.pageYOffset}px;
      width: ${newWidth}px;
      height: ${newHeight}px;
      border: 2px dashed #f59e0b;
      background: rgba(245, 158, 11, 0.1);
      z-index: 9999;
      pointer-events: none;
    `;
    
    document.body.appendChild(overlay);
    
    // Create confirmation dialog
    const confirmed = confirm(`Resize element to ${newWidth}×${newHeight}px?`);
    overlay.remove();
    
    if (confirmed) {
      this.autoResizeToContent(element);
    }
  }

  replaceWithPlugin(element, pluginType) {
    this.saveToHistory();
    
    let pluginHTML = '';
    
    switch(pluginType) {
      case 'contact-form':
        pluginHTML = `
          <div style="max-width: 400px; padding: 30px; background: white; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 20px 0; color: #1f2937;">Contact Us</h3>
            <form style="display: flex; flex-direction: column; gap: 15px;">
              <input type="text" placeholder="Your Name" style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;">
              <input type="email" placeholder="Your Email" style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;">
              <textarea placeholder="Your Message" rows="4" style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical;"></textarea>
              <button type="submit" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Send Message</button>
            </form>
          </div>
        `;
        break;
        
      case 'gallery':
        pluginHTML = `
          <div style="padding: 20px;">
            <h3 style="margin: 0 0 20px 0; text-align: center; color: #1f2937;">Photo Gallery</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
              <div style="aspect-ratio: 1; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">📷</div>
              <div style="aspect-ratio: 1; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">📷</div>
              <div style="aspect-ratio: 1; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">📷</div>
              <div style="aspect-ratio: 1; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">📷</div>
            </div>
          </div>
        `;
        break;
        
      case 'map':
        pluginHTML = `
          <div style="padding: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937;">📍 Find Us</h3>
            <div style="background: #f3f4f6; height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; margin-bottom: 15px;">
              🗺️ Interactive Map Here
            </div>
            <p style="margin: 0; color: #6b7280;">123 Restaurant Street, Food City, FC 12345</p>
          </div>
        `;
        break;
        
      case 'reviews':
        pluginHTML = `
          <div style="padding: 20px;">
            <h3 style="margin: 0 0 20px 0; text-align: center; color: #1f2937;">Customer Reviews</h3>
            <div style="display: flex; flex-direction: column; gap: 15px;">
              <div style="padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #1f2937;">John D.</span>
                  <span style="color: #fbbf24;">⭐⭐⭐⭐⭐</span>
                </div>
                <p style="margin: 0; color: #6b7280;">"Amazing food and great service! Highly recommended."</p>
              </div>
            </div>
          </div>
        `;
        break;
    }
    
    if (pluginHTML) {
      element.innerHTML = pluginHTML;
      element.dataset.plugin = pluginType;
      this.showStatus(`Replaced with ${pluginType.replace('-', ' ')} plugin`, 'success');
      this.selectElement(element);
    }
  }

  addNewElement(elementType) {
    this.saveToHistory();
    let newElement;
    
    switch(elementType) {
      // Symbols & Icons
      case 'star':
        newElement = document.createElement('div');
        newElement.innerHTML = '⭐';
        newElement.style.cssText = 'font-size: 48px; padding: 20px; margin: 10px; display: inline-block; text-align: center;';
        break;
        
      case 'heart':
        newElement = document.createElement('div');
        newElement.innerHTML = '❤️';
        newElement.style.cssText = 'font-size: 48px; padding: 20px; margin: 10px; display: inline-block; text-align: center;';
        break;
        
      case 'arrow':
        newElement = document.createElement('div');
        newElement.innerHTML = '➡️';
        newElement.style.cssText = 'font-size: 48px; padding: 20px; margin: 10px; display: inline-block; text-align: center;';
        break;
        
      case 'check':
        newElement = document.createElement('div');
        newElement.innerHTML = '✅';
        newElement.style.cssText = 'font-size: 48px; padding: 20px; margin: 10px; display: inline-block; text-align: center;';
        break;
        
      case 'phone':
        newElement = document.createElement('div');
        newElement.innerHTML = '📞';
        newElement.style.cssText = 'font-size: 48px; padding: 20px; margin: 10px; display: inline-block; text-align: center;';
        break;
        
      case 'email':
        newElement = document.createElement('div');
        newElement.innerHTML = '📧';
        newElement.style.cssText = 'font-size: 48px; padding: 20px; margin: 10px; display: inline-block; text-align: center;';
        break;

      // Menu Items
      case 'menu-item':
        newElement = document.createElement('div');
        newElement.innerHTML = `
          <div style="padding: 20px; border: 2px dashed #d1d5db; border-radius: 8px; max-width: 400px;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">Delicious Dish</h3>
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Fresh ingredients prepared with love and expertise...</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: bold; color: #3b82f6; font-size: 18px;">$12.99</span>
              <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #6b7280;">Popular</span>
            </div>
          </div>
        `;
        newElement.style.cssText = 'margin: 10px; display: inline-block;';
        break;
        
      case 'menu-category':
        newElement = document.createElement('div');
        newElement.innerHTML = `
          <div style="text-align: center; padding: 20px; margin: 20px 0;">
            <h2 style="margin: 0; color: #1f2937; font-size: 28px; border-bottom: 3px solid #3b82f6; display: inline-block; padding-bottom: 10px;">Main Courses</h2>
          </div>
        `;
        break;
        
      case 'special-offer':
        newElement = document.createElement('div');
        newElement.innerHTML = `
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 24px;">🎯 Special Offer!</h3>
            <p style="margin: 0 0 15px 0; font-size: 18px;">Get 20% off your first order</p>
            <button style="background: white; color: #3b82f6; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer;">Claim Now</button>
          </div>
        `;
        break;
        
      case 'price-list':
        newElement = document.createElement('div');
        newElement.innerHTML = `
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937;">💰 Price List</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; font-weight: bold;">Item</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold;">Price</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0;">Sample Item 1</td>
                <td style="padding: 8px 0; text-align: right;">$12.99</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Sample Item 2</td>
                <td style="padding: 8px 0; text-align: right;">$15.99</td>
              </tr>
            </table>
          </div>
        `;
        break;

      // Content Elements
      case 'text':
        newElement = document.createElement('div');
        newElement.textContent = 'New text content. Click to edit this text.';
        newElement.style.cssText = 'padding: 20px; background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; margin: 10px; line-height: 1.6;';
        break;
        
      case 'heading':
        newElement = document.createElement('h2');
        newElement.textContent = 'New Heading';
        newElement.style.cssText = 'margin: 20px 10px; color: #1f2937; font-size: 32px; font-weight: bold;';
        break;
        
      case 'button':
        newElement = document.createElement('button');
        newElement.textContent = 'Click Me';
        newElement.style.cssText = 'padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 10px; font-weight: bold; font-size: 16px;';
        break;
        
      case 'image':
        newElement = document.createElement('div');
        newElement.innerHTML = `
          <div style="width: 300px; height: 200px; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 48px;">
            🖼️
          </div>
        `;
        newElement.style.cssText = 'margin: 10px; display: inline-block;';
        break;

      // Layout Elements
      case 'container':
        newElement = document.createElement('div');
        newElement.innerHTML = '<p style="margin: 0; color: #6b7280; text-align: center;">📦 Container - Add content here</p>';
        newElement.style.cssText = 'padding: 40px; background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; margin: 20px; min-height: 100px;';
        break;
        
      case 'section':
        newElement = document.createElement('section');
        newElement.innerHTML = `
          <div style="text-align: center; padding: 60px 20px; background: #f8fafc; margin: 20px 0;">
            <h2 style="margin: 0 0 20px 0; color: #1f2937;">New Section</h2>
            <p style="margin: 0; color: #6b7280;">Add your content here...</p>
          </div>
        `;
        break;
        
      case 'divider':
        newElement = document.createElement('hr');
        newElement.style.cssText = 'border: none; height: 2px; background: linear-gradient(to right, transparent, #d1d5db, transparent); margin: 30px 0;';
        break;
        
      case 'spacer':
        newElement = document.createElement('div');
        newElement.innerHTML = '<span style="color: #d1d5db; font-size: 12px;">⬜ Spacer</span>';
        newElement.style.cssText = 'height: 60px; margin: 10px; display: flex; align-items: center; justify-content: center; border: 1px dashed #e5e7eb; border-radius: 4px;';
        break;

      // Plugin Elements
      case 'contact-form':
        newElement = document.createElement('div');
        newElement.innerHTML = `
          <div style="max-width: 400px; padding: 30px; background: white; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 20px 0; color: #1f2937;">Contact Us</h3>
            <form style="display: flex; flex-direction: column; gap: 15px;">
              <input type="text" placeholder="Your Name" style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;">
              <input type="email" placeholder="Your Email" style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;">
              <textarea placeholder="Your Message" rows="4" style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical;"></textarea>
              <button type="submit" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Send Message</button>
            </form>
          </div>
        `;
        newElement.style.cssText = 'margin: 10px; display: inline-block;';
        newElement.dataset.plugin = 'contact-form';
        break;
        
      case 'gallery':
        newElement = document.createElement('div');
        newElement.innerHTML = `
          <div style="padding: 20px;">
            <h3 style="margin: 0 0 20px 0; text-align: center; color: #1f2937;">Photo Gallery</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
              <div style="aspect-ratio: 1; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">📷</div>
              <div style="aspect-ratio: 1; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">📷</div>
              <div style="aspect-ratio: 1; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">📷</div>
              <div style="aspect-ratio: 1; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">📷</div>
            </div>
          </div>
        `;
        newElement.style.cssText = 'margin: 10px; display: inline-block;';
        newElement.dataset.plugin = 'gallery';
        break;
        
      case 'map':
        newElement = document.createElement('div');
        newElement.innerHTML = `
          <div style="padding: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937;">📍 Find Us</h3>
            <div style="background: #f3f4f6; height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; margin-bottom: 15px;">
              🗺️ Interactive Map Here
            </div>
            <p style="margin: 0; color: #6b7280;">123 Restaurant Street, Food City, FC 12345</p>
          </div>
        `;
        newElement.style.cssText = 'margin: 10px; display: inline-block;';
        newElement.dataset.plugin = 'map';
        break;
        
      case 'reviews':
        newElement = document.createElement('div');
        newElement.innerHTML = `
          <div style="padding: 20px;">
            <h3 style="margin: 0 0 20px 0; text-align: center; color: #1f2937;">Customer Reviews</h3>
            <div style="display: flex; flex-direction: column; gap: 15px;">
              <div style="padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #1f2937;">John D.</span>
                  <span style="color: #fbbf24;">⭐⭐⭐⭐⭐</span>
                </div>
                <p style="margin: 0; color: #6b7280;">"Amazing food and great service! Highly recommended."</p>
              </div>
            </div>
          </div>
        `;
        newElement.style.cssText = 'margin: 10px; display: inline-block;';
        newElement.dataset.plugin = 'reviews';
        break;
        
      default:
        newElement = document.createElement('div');
        newElement.textContent = `New ${elementType} element`;
        newElement.style.cssText = 'padding: 20px; border: 2px dashed #d1d5db; border-radius: 8px; margin: 10px; display: inline-block;';
    }
    
    // Add to page
    if (this.state.selectedElement && this.state.selectedElement.parentNode) {
      this.state.selectedElement.parentNode.insertBefore(newElement, this.state.selectedElement.nextSibling);
    } else {
      document.body.appendChild(newElement);
    }
    
    // Auto-select the new element
    this.selectElement(newElement);
    this.showStatus(`✅ Added ${elementType.replace('-', ' ')} element`, 'success');
  }

  // Copy/Paste and Element Management
  copyElement(element) {
    this.clipboard = {
      outerHTML: element.outerHTML,
      styles: element.style.cssText,
      className: element.className
    };
    this.showStatus('Element copied to clipboard', 'success');
    
    // Update paste button state
    const pasteBtn = this.editorPanel.querySelector('[data-action="paste-element"]');
    if (pasteBtn) {
      pasteBtn.disabled = false;
      pasteBtn.style.opacity = '1';
    }
  }

  pasteElement() {
    if (!this.clipboard) {
      this.showStatus('Nothing to paste', 'error');
      return;
    }
    
    this.saveToHistory();
    
    // Create element from clipboard
    const temp = document.createElement('div');
    temp.innerHTML = this.clipboard.outerHTML;
    const newElement = temp.firstElementChild;
    
    // Add to page
    if (this.state.selectedElement && this.state.selectedElement.parentNode) {
      this.state.selectedElement.parentNode.insertBefore(newElement, this.state.selectedElement.nextSibling);
    } else {
      document.body.appendChild(newElement);
    }
    
    // Select the pasted element
    this.selectElement(newElement);
    this.showStatus('Element pasted successfully', 'success');
  }

  duplicateElement(element) {
    this.saveToHistory();
    
    // Clone the element
    const duplicate = element.cloneNode(true);
    
    // Clear any editor-specific classes
    duplicate.classList.remove('editor-selected', 'editor-hoverable');
    
    // Insert after the original element
    element.parentNode.insertBefore(duplicate, element.nextSibling);
    
    // Select the duplicate
    this.selectElement(duplicate);
    this.showStatus('Element duplicated successfully', 'success');
  }

  deleteElement(element) {
    if (confirm('Delete this element?')) {
      this.saveToHistory();
      element.remove();
      this.clearSelection();
      this.showStatus('Element deleted', 'info');
    }
  }

  updateEditableCount() {
    const countSpan = this.editorPanel.querySelector('.editable-count');
    if (countSpan) {
      countSpan.textContent = this.state.editableElements.size;
    }
  }

  showStatus(message, type = 'info') {
    const statusSpan = this.editorPanel.querySelector('.editor-status');
    statusSpan.textContent = message;
    statusSpan.className = `editor-status ${type}`;
    
    setTimeout(() => {
      statusSpan.textContent = this.state.isActive ? 'Edit Mode' : 'Ready';
      statusSpan.className = 'editor-status';
    }, 3000);
  }

  closeEditor() {
    this.editorPanel.remove();
    this.clearSelection();
    this.exitImageReplaceMode();
    document.body.classList.remove('editor-active');
  }

  rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent') return '#000000';
    
    const match = rgb.match(/\d+/g);
    if (!match) return '#000000';
    
    return '#' + match.slice(0, 3).map(x => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  getModernEditorStyles() {
    return `
      /* Modern Visual Editor Interface */
      :root {
        --editor-bg: #ffffff;
        --editor-border: #e1e5e9;
        --editor-text: #1f2937;
        --editor-text-secondary: #6b7280;
        --editor-primary: #667eea;
        --editor-primary-hover: #5a67d8;
        --editor-secondary: #f3f4f6;
        --editor-success: #10b981;
        --editor-warning: #f59e0b;
        --editor-error: #ef4444;
        --editor-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        --editor-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
        --editor-radius: 8px;
        --editor-radius-lg: 12px;
        --editor-spacing-xs: 0.25rem;
        --editor-spacing-sm: 0.5rem;
        --editor-spacing-md: 1rem;
        --editor-spacing-lg: 1.5rem;
        --editor-spacing-xl: 2rem;
      }

      /* Top Toolbar */
      .editor-top-toolbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 64px;
        background: var(--editor-bg);
        border-bottom: 1px solid var(--editor-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--editor-spacing-lg);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        box-shadow: var(--editor-shadow);
      }

      .toolbar-left,
      .toolbar-center,
      .toolbar-right {
        display: flex;
        align-items: center;
        gap: var(--editor-spacing-md);
      }

      .editor-logo {
        display: flex;
        align-items: center;
        gap: var(--editor-spacing-sm);
        font-weight: 600;
        color: var(--editor-text);
      }

      .logo-icon {
        font-size: 1.5rem;
      }

      .toolbar-divider {
        width: 1px;
        height: 24px;
        background: var(--editor-border);
      }

      .toolbar-btn {
        display: flex;
        align-items: center;
        gap: var(--editor-spacing-xs);
        padding: var(--editor-spacing-sm) var(--editor-spacing-md);
        background: transparent;
        border: 1px solid var(--editor-border);
        border-radius: var(--editor-radius);
        color: var(--editor-text);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .toolbar-btn:hover {
        background: var(--editor-secondary);
        border-color: var(--editor-primary);
      }

      .toolbar-btn.active {
        background: var(--editor-primary);
        color: white;
        border-color: var(--editor-primary);
      }

      .toolbar-btn.btn-primary {
        background: var(--editor-primary);
        color: white;
        border-color: var(--editor-primary);
      }

      .toolbar-btn.btn-primary:hover {
        background: var(--editor-primary-hover);
      }

      .toolbar-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Theme Selector */
      .theme-selector {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--editor-spacing-sm);
      }

      .theme-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--editor-text);
      }

      .theme-dropdown {
        position: relative;
      }

      .theme-current {
        display: flex;
        align-items: center;
        gap: var(--editor-spacing-sm);
        padding: var(--editor-spacing-sm) var(--editor-spacing-md);
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: var(--editor-radius);
        cursor: pointer;
        min-width: 200px;
        transition: all 0.2s ease;
      }

      .theme-current:hover {
        border-color: var(--editor-primary);
      }

      .theme-preview {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        background: linear-gradient(135deg, #667eea, #764ba2);
      }

      .theme-name {
        flex: 1;
        text-align: left;
        font-size: 0.875rem;
      }

      .dropdown-arrow {
        font-size: 0.75rem;
        color: var(--editor-text-secondary);
      }

      .theme-options {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: var(--editor-radius);
        box-shadow: var(--editor-shadow-lg);
        max-height: 400px;
        overflow-y: auto;
        z-index: 10001;
        margin-top: 4px;
      }

      .theme-category {
        padding: var(--editor-spacing-md);
        border-bottom: 1px solid var(--editor-border);
      }

      .theme-category:last-child {
        border-bottom: none;
      }

      .theme-category-header {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--editor-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--editor-spacing-sm);
      }

      .theme-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--editor-spacing-sm);
      }

      .theme-option {
        display: flex;
        align-items: center;
        gap: var(--editor-spacing-sm);
        padding: var(--editor-spacing-sm);
        border: 1px solid var(--editor-border);
        border-radius: var(--editor-radius);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .theme-option:hover {
        border-color: var(--editor-primary);
        background: var(--editor-secondary);
      }

      .theme-option.premium {
        border-color: var(--editor-warning);
      }

      .theme-preview-img {
        position: relative;
        width: 32px;
        height: 32px;
        border-radius: var(--editor-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 0.875rem;
      }

      .premium-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        font-size: 0.75rem;
      }

      .theme-info {
        flex: 1;
      }

      .theme-info .theme-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--editor-text);
        margin: 0;
      }

      .theme-info .theme-type {
        font-size: 0.75rem;
        color: var(--editor-text-secondary);
        margin: 0;
      }

      /* Left Sidebar */
      .editor-left-sidebar {
        position: fixed;
        top: 64px;
        left: 0;
        width: 280px;
        height: calc(100vh - 64px);
        background: var(--editor-bg);
        border-right: 1px solid var(--editor-border);
        display: none;
        flex-direction: column;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .editor-left-sidebar.collapsed {
        width: 60px;
      }

      /* Right Sidebar */
      .editor-right-sidebar {
        position: fixed;
        top: 64px;
        right: 0;
        width: 320px;
        height: calc(100vh - 64px);
        background: var(--editor-bg);
        border-left: 1px solid var(--editor-border);
        display: none;
        flex-direction: column;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .editor-right-sidebar.collapsed {
        width: 60px;
      }

      .sidebar-header {
        padding: var(--editor-spacing-lg);
        border-bottom: 1px solid var(--editor-border);
        background: var(--editor-secondary);
      }

      .sidebar-header h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--editor-text);
      }

      .sidebar-content {
        flex: 1;
        overflow-y: auto;
        padding: var(--editor-spacing-md);
      }

      /* Element Categories */
      .element-category {
        margin-bottom: var(--editor-spacing-md);
        border: 1px solid var(--editor-border);
        border-radius: var(--editor-radius);
        overflow: hidden;
      }

      .category-header {
        background: var(--editor-secondary);
        padding: var(--editor-spacing-md);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--editor-spacing-sm);
        font-weight: 500;
        color: var(--editor-text);
        transition: background 0.2s ease;
      }

      .category-header:hover {
        background: #e5e7eb;
      }

      .category-toggle {
        font-size: 0.75rem;
        transition: transform 0.2s ease;
      }

      .category-title {
        font-size: 0.875rem;
      }

      .category-content {
        padding: var(--editor-spacing-md);
        background: var(--editor-bg);
      }

      .element-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--editor-spacing-sm);
      }

      .add-element-btn {
        padding: var(--editor-spacing-md) var(--editor-spacing-sm);
        background: var(--editor-secondary);
        border: 1px solid var(--editor-border);
        border-radius: var(--editor-radius);
        cursor: pointer;
        font-size: 0.75rem;
        text-align: center;
        transition: all 0.2s ease;
        color: var(--editor-text);
      }

      .add-element-btn:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
        box-shadow: var(--editor-shadow);
      }

      .add-element-btn:active {
        background: var(--editor-primary);
        color: white;
        transform: translateY(0);
      }

      /* Properties Panel */
      .no-selection-message {
        text-align: center;
        padding: var(--editor-spacing-xl);
        color: var(--editor-text-secondary);
      }

      .message-icon {
        font-size: 3rem;
        margin-bottom: var(--editor-spacing-md);
      }

      .element-properties-panel {
        padding: var(--editor-spacing-md);
      }

      /* Floating Controls */
      .editor-floating-controls {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: none;
        flex-direction: column;
        gap: var(--editor-spacing-sm);
        z-index: 9998;
      }

      .floating-btn {
        width: 48px;
        height: 48px;
        background: var(--editor-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: var(--editor-shadow);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .floating-btn:hover {
        background: var(--editor-primary-hover);
        transform: scale(1.1);
      }

      /* Element selection and drag handles */
      .editor-hoverable:hover {
        outline: 2px dashed var(--editor-primary) !important;
        outline-offset: 2px;
      }

      .editor-selected {
        outline: 2px solid var(--editor-primary) !important;
        outline-offset: 2px;
        position: relative;
      }

      .drag-handle {
        position: absolute;
        width: 10px;
        height: 10px;
        background: var(--editor-primary);
        border: 2px solid white;
        border-radius: 50%;
        z-index: 10001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
      }

      .drag-handle:hover {
        background: var(--editor-primary-hover);
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }

      .element-selection-overlay {
        pointer-events: none;
        transition: all 0.1s ease;
      }

      /* Body states */
      body.editor-active {
        padding-top: 64px;
      }

      body.editor-active * {
        user-select: none;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .editor-left-sidebar,
        .editor-right-sidebar {
          width: 100%;
          height: auto;
          position: relative;
          top: 0;
        }
        
        .toolbar-center {
          display: none;
        }
      }
    `;
  }
      
      .editor-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .editor-title h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
      }
      
      .editor-status {
        font-size: 0.85rem;
        opacity: 0.9;
      }
      
      .editor-status.success { color: #4ade80; }
      .editor-status.error { color: #f87171; }
      .editor-status.info { color: #60a5fa; }
      
      .editor-controls {
        display: flex;
        gap: 0.5rem;
      }
      
      .editor-toggle {
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.3s ease;
      }
      
      .editor-toggle:hover {
        background: rgba(255,255,255,0.3);
      }
      
      .editor-toggle.active {
        background: #4ade80;
        border-color: #4ade80;
      }
      
      .editor-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }
      
      .editor-close:hover {
        background: rgba(255,255,255,0.2);
      }
      
      .editor-tabs {
        display: flex;
        background: #f8f9fa;
        border-bottom: 1px solid #e1e5e9;
      }
      
      .tab-btn {
        flex: 1;
        background: none;
        border: none;
        padding: 0.75rem 0.5rem;
        cursor: pointer;
        font-size: 0.8rem;
        color: #6b7280;
        transition: all 0.3s ease;
      }
      
      .tab-btn:hover {
        background: #e5e7eb;
        color: #374151;
      }
      
      .tab-btn.active {
        background: white;
        color: #667eea;
        font-weight: 600;
        border-bottom: 2px solid #667eea;
      }
      
      .editor-content {
        max-height: 60vh;
        overflow-y: auto;
        padding: 1rem;
      }
      
      .tab-content {
        display: none;
      }
      
      .tab-content.active {
        display: block;
      }
      
      .skin-grid {
        display: grid;
        gap: 0.75rem;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .skin-option {
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        padding: 0.75rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .skin-option:hover {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
      }
      
      .skin-option.selected {
        border-color: #667eea;
        background: #f0f4ff;
      }
      
      .skin-info h5 {
        margin: 0.5rem 0 0.25rem 0;
        font-size: 0.9rem;
        color: #374151;
      }
      
      .skin-type {
        font-size: 0.75rem;
        color: #667eea;
        font-weight: 600;
        text-transform: uppercase;
        margin: 0;
      }
      
      .skin-description {
        font-size: 0.8rem;
        color: #6b7280;
        margin: 0.25rem 0;
      }
      
      .skin-features {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0 0;
      }
      
      .skin-features li {
        font-size: 0.75rem;
        color: #059669;
        margin: 0.25rem 0;
      }
      
      .tool-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .tool-btn {
        background: #f8f9fa;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 0.75rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
      }
      
      .tool-btn:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
      }
      
      .tool-icon {
        display: block;
        font-size: 1.2rem;
        margin-bottom: 0.25rem;
      }
      
      .tool-label {
        font-size: 0.8rem;
        color: #374151;
      }
      
      .upload-area {
        border: 2px dashed #d1d5db;
        border-radius: 8px;
        padding: 2rem 1rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 1rem;
      }
      
      .upload-area:hover,
      .upload-area.drag-over {
        border-color: #667eea;
        background: #f0f4ff;
      }
      
      .upload-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      
      .image-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 0.5rem;
        max-height: 200px;
        overflow-y: auto;
      }
      
      .gallery-item {
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        background: #f8f9fa;
      }
      
      .gallery-item img {
        width: 100%;
        height: 60px;
        object-fit: cover;
        display: block;
      }
      
      .gallery-item-actions {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: space-between;
        padding: 0.25rem;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .gallery-item:hover .gallery-item-actions {
        opacity: 1;
      }
      
      .btn-use-image,
      .btn-delete-image {
        background: rgba(255,255,255,0.9);
        border: none;
        border-radius: 3px;
        padding: 0.25rem 0.5rem;
        font-size: 0.7rem;
        cursor: pointer;
      }
      
      .btn-delete-image {
        background: rgba(239, 68, 68, 0.9);
        color: white;
      }
      
      .gallery-item-name {
        font-size: 0.7rem;
        color: #6b7280;
        padding: 0.25rem;
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      
      .background-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .background-option {
        text-align: center;
        cursor: pointer;
        border-radius: 6px;
        overflow: hidden;
        border: 2px solid #e5e7eb;
        transition: all 0.3s ease;
      }
      
      .background-option:hover {
        border-color: #667eea;
        transform: scale(1.05);
      }
      
      .bg-preview {
        height: 60px;
        width: 100%;
      }
      
      .bg-name {
        font-size: 0.75rem;
        color: #374151;
        padding: 0.5rem;
        display: block;
      }
      
      .custom-bg-controls {
        display: grid;
        gap: 0.75rem;
      }
      
      .control-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .control-group label {
        font-size: 0.85rem;
        color: #374151;
        min-width: 60px;
      }
      
      .control-group input,
      .control-group button,
      .control-group select {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 0.8rem;
      }
      
      .shape-options,
      .resize-options,
      .replace-options,
      .element-actions {
        display: flex;
        gap: 0.5rem;
        flex: 1;
      }
      
      .shape-btn,
      .resize-btn,
      .action-btn {
        padding: 0.4rem 0.6rem;
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.75rem;
        transition: all 0.2s ease;
      }
      
      .shape-btn:hover,
      .resize-btn:hover,
      .action-btn:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
      }
      
      .shape-btn:active,
      .resize-btn:active,
      .action-btn:active {
        background: #667eea;
        color: white;
      }
      
      .action-btn:disabled {
        background: #f9fafb;
        color: #d1d5db;
        cursor: not-allowed;
        opacity: 0.5;
      }
      
      .plugin-select {
        flex: 2;
        font-size: 0.75rem;
      }
      
      .replace-btn {
        background: #ef4444;
        color: white;
        border-color: #ef4444;
        font-size: 0.75rem;
        padding: 0.4rem 0.8rem;
      }
      
      .replace-btn:hover {
        background: #dc2626;
      }
      
      .property-grid {
        display: grid;
        gap: 0.75rem;
      }
      
      .property-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: #f8f9fa;
        border-radius: 4px;
      }
      
      .property-item label {
        font-weight: 600;
        color: #374151;
        font-size: 0.8rem;
      }
      
      .property-value {
        font-size: 0.8rem;
        color: #6b7280;
        font-family: monospace;
      }
      
      .property-controls {
        display: grid;
        gap: 0.5rem;
      }
      
      /* Element Categories */
      .element-category {
        margin-bottom: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        overflow: hidden;
      }
      
      .category-header {
        background: #f8f9fa;
        padding: 0.75rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: #374151;
        transition: background 0.2s ease;
      }
      
      .category-header:hover {
        background: #e5e7eb;
      }
      
      .category-toggle {
        font-size: 0.8rem;
        transition: transform 0.2s ease;
      }
      
      .category-title {
        font-size: 0.85rem;
      }
      
      .category-content {
        padding: 0.75rem;
        background: white;
      }
      
      .element-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
      }
      
      .add-element-btn {
        padding: 0.75rem 0.5rem;
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.75rem;
        text-align: center;
        transition: all 0.2s ease;
        color: #374151;
      }
      
      .add-element-btn:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .add-element-btn:active {
        background: #667eea;
        color: white;
        transform: translateY(0);
      }
      
      .editor-footer {
        border-top: 1px solid #e5e7eb;
        padding: 1rem;
        background: #f8f9fa;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .editor-stats {
        font-size: 0.75rem;
        color: #6b7280;
      }
      
      .stat {
        margin-right: 1rem;
      }
      
      .editor-actions {
        display: flex;
        gap: 0.5rem;
      }
      
      .btn-primary,
      .btn-secondary,
      .btn-undo,
      .btn-redo {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid;
      }
      
      .btn-primary {
        background: #667eea;
        color: white;
        border: 1px solid #667eea;
      }
      
      .btn-primary:hover {
        background: #5a67d8;
        transform: translateY(-1px);
      }
      
      .btn-secondary {
        background: white;
        color: #374151;
        border: 1px solid #d1d5db;
      }
      
      .btn-secondary:hover {
        background: #f3f4f6;
      }
      
      .btn-undo,
      .btn-redo {
        background: #f59e0b;
        color: white;
        border-color: #f59e0b;
        padding: 0.4rem 0.8rem;
        font-size: 0.75rem;
      }
      
      .btn-undo:hover:not(:disabled),
      .btn-redo:hover:not(:disabled) {
        background: #d97706;
        transform: translateY(-1px);
      }
      
      .btn-undo:disabled,
      .btn-redo:disabled {
        background: #d1d5db;
        color: #6b7280;
        border-color: #d1d5db;
        cursor: not-allowed;
        transform: none;
      }
      
      /* Element selection and drag handles */
      .editor-hoverable:hover {
        outline: 2px dashed #667eea !important;
        outline-offset: 2px;
      }
      
      .editor-selected {
        outline: 2px solid #667eea !important;
        outline-offset: 2px;
        position: relative;
      }
      
      .drag-handle {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #667eea;
        border: 2px solid white;
        border-radius: 50%;
        z-index: 10001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
      }
      
      .drag-handle:hover {
        background: #5a67d8;
        transform: scale(1.2);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
      
      /* Handle-specific cursors are set via JavaScript */
      .drag-handle-nw { cursor: nw-resize; }
      .drag-handle-ne { cursor: ne-resize; }
      .drag-handle-sw { cursor: sw-resize; }
      .drag-handle-se { cursor: se-resize; }
      .drag-handle-n { cursor: n-resize; }
      .drag-handle-s { cursor: s-resize; }
      .drag-handle-w { cursor: w-resize; }
      .drag-handle-e { cursor: e-resize; }
      
      .element-selection-overlay {
        pointer-events: none;
        transition: all 0.1s ease;
      }
      
      /* Body states */
      body.editor-active {
        cursor: crosshair;
      }
      
      body.editor-active * {
        user-select: none;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .enhanced-editor-panel {
          width: calc(100vw - 40px);
          left: 20px;
          right: 20px;
        }
        
        .tool-grid {
          grid-template-columns: 1fr;
        }
        
        .background-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
}

// Initialize Enhanced Editor
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // Add editor activation button to page
    const activateBtn = document.createElement('button');
    activateBtn.innerHTML = '🎨 Open Visual Editor';
    activateBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      z-index: 9999;
      transition: all 0.3s ease;
    `;
    
    activateBtn.addEventListener('mouseenter', () => {
      activateBtn.style.transform = 'translateY(-2px)';
      activateBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
    });
    
    activateBtn.addEventListener('mouseleave', () => {
      activateBtn.style.transform = 'translateY(0)';
      activateBtn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
    });
    
    activateBtn.addEventListener('click', () => {
      if (!window.enhancedEditor) {
        window.enhancedEditor = new EnhancedEditor();
      }
      activateBtn.style.display = 'none';
    });
    
    document.body.appendChild(activateBtn);
  });
}

// Make the class available on window and close the conditional block
window.EnhancedEditor = EnhancedEditor;

} // End of conditional block to prevent duplicate declaration