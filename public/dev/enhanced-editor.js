// Enhanced Visual Editor - Complete UX Redesign
// Features: Drag & Drop, Image Upload, Background Selection, Skin Switching

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

    this.dragHandlers = {
      isDragging: false,
      startX: 0,
      startY: 0,
      startRect: null,
      handleType: null
    };

    this.init();
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
    // Create main editor panel
    this.editorPanel = document.createElement('div');
    this.editorPanel.className = 'enhanced-editor-panel';
    this.editorPanel.innerHTML = `
      <div class="editor-header">
        <div class="editor-title">
          <h3>🎨 Visual Editor</h3>
          <span class="editor-status">Ready</span>
        </div>
        <div class="editor-controls">
          <button class="editor-toggle ${this.state.isActive ? 'active' : ''}" data-action="toggle">
            ${this.state.isActive ? '🔒 Lock' : '✏️ Edit'}
          </button>
          <button class="editor-close" data-action="close">×</button>
        </div>
      </div>

      <div class="editor-tabs">
        <button class="tab-btn active" data-tab="design">🎨 Design</button>
        <button class="tab-btn" data-tab="layout">📐 Layout</button>
        <button class="tab-btn" data-tab="images">🖼️ Images</button>
        <button class="tab-btn" data-tab="backgrounds">🌈 Backgrounds</button>
      </div>

      <div class="editor-content">
        <!-- Design Tab -->
        <div class="tab-content active" data-tab="design">
          <div class="skin-selector-section">
            <label>Template/Skin:</label>
            <div class="skin-grid">
              ${this.renderSkinOptions()}
            </div>
          </div>
          
          <div class="element-editor" style="display: none;">
            <h4>Selected Element</h4>
            <div class="element-properties"></div>
          </div>
        </div>

        <!-- Layout Tab -->
        <div class="tab-content" data-tab="layout">
          <div class="layout-tools">
            <h4>🔧 Layout Tools</h4>
            <div class="tool-grid">
              <button class="tool-btn" data-action="enable-drag-mode">
                <span class="tool-icon">↔️</span>
                <span class="tool-label">Drag Elements</span>
              </button>
              <button class="tool-btn" data-action="enable-resize-mode">
                <span class="tool-icon">🔄</span>
                <span class="tool-label">Resize Elements</span>
              </button>
              <button class="tool-btn" data-action="reset-layout">
                <span class="tool-icon">🔄</span>
                <span class="tool-label">Reset Layout</span>
              </button>
            </div>
          </div>
          
          <div class="spacing-controls">
            <h4>📏 Spacing</h4>
            <div class="spacing-sliders">
              <div class="slider-group">
                <label>Margin:</label>
                <input type="range" min="0" max="50" value="0" data-property="margin">
              </div>
              <div class="slider-group">
                <label>Padding:</label>
                <input type="range" min="0" max="50" value="0" data-property="padding">
              </div>
            </div>
          </div>
        </div>

        <!-- Images Tab -->
        <div class="tab-content" data-tab="images">
          <div class="image-upload-section">
            <h4>📤 Upload Images</h4>
            <div class="upload-area" data-action="trigger-upload">
              <div class="upload-icon">📷</div>
              <p>Click or drag images here</p>
              <small>JPEG, PNG, WebP, GIF up to 5MB</small>
            </div>
            <input type="file" class="image-input" accept="image/*" multiple style="display: none;">
          </div>
          
          <div class="uploaded-images">
            <h4>🖼️ Your Images</h4>
            <div class="image-gallery"></div>
          </div>
          
          <div class="image-replacement-mode" style="display: none;">
            <h4>🔄 Replace Image Mode</h4>
            <p>Click on any image in the preview to replace it</p>
            <button class="btn-exit-replace-mode">Exit Replace Mode</button>
          </div>
        </div>

        <!-- Backgrounds Tab -->
        <div class="tab-content" data-tab="backgrounds">
          <div class="background-section">
            <h4>🌈 Background Options</h4>
            <div class="background-grid">
              ${this.renderBackgroundOptions()}
            </div>
          </div>
          
          <div class="custom-background">
            <h4>🎨 Custom Background</h4>
            <div class="custom-bg-controls">
              <div class="control-group">
                <label>Color:</label>
                <input type="color" class="bg-color-picker" value="#f8f9fa">
              </div>
              <div class="control-group">
                <label>Gradient:</label>
                <button class="gradient-btn" data-action="create-gradient">Create Gradient</button>
              </div>
              <div class="control-group">
                <label>Image URL:</label>
                <input type="url" class="bg-image-url" placeholder="https://...">
                <button class="apply-bg-url">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="editor-footer">
        <div class="editor-stats">
          <span class="stat">Elements: <span class="editable-count">0</span></span>
          <span class="stat">Modified: <span class="modified-count">0</span></span>
        </div>
        <div class="editor-actions">
          <button class="btn-secondary" data-action="reset-all">Reset All</button>
          <button class="btn-primary" data-action="save-changes">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.editorPanel);
    this.applyEditorStyles();
  }

  renderSkinOptions() {
    if (!this.state.templates.length) {
      return '<p class="no-templates">Loading templates...</p>';
    }

    return this.state.templates.map(template => `
      <div class="skin-option ${template.type}" data-template-id="${template.id}" data-template-type="${template.type}">
        <div class="skin-preview-container">
          ${template.type === 'skin' ? template.preview : '<div class="standalone-preview-placeholder">📱 Standalone Template</div>'}
        </div>
        <div class="skin-info">
          <h5>${template.name}</h5>
          <p class="skin-type">${template.type}</p>
          <p class="skin-description">${template.description}</p>
          <ul class="skin-features">
            ${template.features.slice(0, 2).map(feature => `<li>✓ ${feature}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }

  renderBackgroundOptions() {
    return this.state.backgrounds.map(bg => `
      <div class="background-option" data-bg-id="${bg.id}" data-bg-type="${bg.type}">
        <div class="bg-preview" style="${this.getBackgroundStyle(bg)}"></div>
        <span class="bg-name">${bg.name}</span>
      </div>
    `).join('');
  }

  getBackgroundStyle(bg) {
    switch (bg.type) {
      case 'solid':
        return `background: ${bg.value};`;
      case 'gradient':
        return `background: ${bg.value};`;
      case 'pattern':
        return `background: ${bg.value}; background-size: ${bg.size || '20px 20px'};`;
      case 'image':
        return `background: url('${bg.value}') center/cover;`;
      default:
        return `background: ${bg.value};`;
    }
  }

  bindEvents() {
    // Tab switching
    this.editorPanel.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-btn')) {
        this.switchTab(e.target.dataset.tab);
      }
    });

    // Main actions
    this.editorPanel.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      switch (action) {
        case 'toggle':
          this.toggleEditor();
          break;
        case 'close':
          this.closeEditor();
          break;
        case 'trigger-upload':
          this.triggerImageUpload();
          break;
        case 'enable-drag-mode':
          this.enableDragMode();
          break;
        case 'enable-resize-mode':
          this.enableResizeMode();
          break;
        case 'reset-layout':
          this.resetLayout();
          break;
        case 'save-changes':
          this.saveChanges();
          break;
        case 'reset-all':
          this.resetAll();
          break;
        case 'create-gradient':
          this.openGradientBuilder();
          break;
      }
    });

    // Template selection
    this.editorPanel.addEventListener('click', (e) => {
      const templateOption = e.target.closest('.skin-option');
      if (templateOption) {
        this.selectTemplate(templateOption.dataset.templateId, templateOption.dataset.templateType);
      }
    });

    // Background selection
    this.editorPanel.addEventListener('click', (e) => {
      const bgOption = e.target.closest('.background-option');
      if (bgOption) {
        this.applyBackground(bgOption.dataset.bgId);
      }
    });

    // Background color picker
    this.editorPanel.addEventListener('change', (e) => {
      if (e.target.classList.contains('bg-color-picker')) {
        this.applyCustomBackground('solid', e.target.value);
      }
    });

    // Apply background URL
    this.editorPanel.addEventListener('click', (e) => {
      if (e.target.classList.contains('apply-bg-url')) {
        const urlInput = this.editorPanel.querySelector('.bg-image-url');
        if (urlInput.value) {
          this.applyCustomBackground('image', urlInput.value);
        }
      }
    });

    // Global click handler for element selection
    document.addEventListener('click', (e) => {
      if (this.state.isActive && !e.target.closest('.enhanced-editor-panel')) {
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
    const propertiesPanel = this.editorPanel.querySelector('.element-properties');
    const elementEditor = this.editorPanel.querySelector('.element-editor');
    
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
        </div>
      </div>
    `;
    
    // Bind property controls
    propertiesPanel.addEventListener('input', (e) => {
      this.handlePropertyChange(e, element);
    });
    
    elementEditor.style.display = 'block';
  }

  handlePropertyChange(e, element) {
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
    const elementEditor = this.editorPanel.querySelector('.element-editor');
    elementEditor.style.display = 'none';
  }

  createDragHandles(element) {
    this.clearDragHandles();
    
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const scrollLeft = window.pageXOffset;
    
    const handles = [
      { type: 'nw', x: rect.left + scrollLeft - 4, y: rect.top + scrollTop - 4 },
      { type: 'ne', x: rect.right + scrollLeft - 4, y: rect.top + scrollTop - 4 },
      { type: 'sw', x: rect.left + scrollLeft - 4, y: rect.bottom + scrollTop - 4 },
      { type: 'se', x: rect.right + scrollLeft - 4, y: rect.bottom + scrollTop - 4 }
    ];
    
    handles.forEach(handle => {
      const handleEl = document.createElement('div');
      handleEl.className = `drag-handle drag-handle-${handle.type}`;
      handleEl.style.left = `${handle.x}px`;
      handleEl.style.top = `${handle.y}px`;
      handleEl.dataset.handleType = handle.type;
      
      document.body.appendChild(handleEl);
    });
  }

  clearDragHandles() {
    document.querySelectorAll('.drag-handle').forEach(handle => handle.remove());
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
    
    switch (handleType) {
      case 'se':
        newWidth = startRect.width + deltaX;
        newHeight = startRect.height + deltaY;
        break;
      case 'sw':
        newWidth = startRect.width - deltaX;
        newHeight = startRect.height + deltaY;
        break;
      case 'ne':
        newWidth = startRect.width + deltaX;
        newHeight = startRect.height - deltaY;
        break;
      case 'nw':
        newWidth = startRect.width - deltaX;
        newHeight = startRect.height - deltaY;
        break;
    }
    
    if (newWidth > 20) element.style.width = `${newWidth}px`;
    if (newHeight > 20) element.style.height = `${newHeight}px`;
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
    
    const toggleBtn = this.editorPanel.querySelector('.editor-toggle');
    const statusSpan = this.editorPanel.querySelector('.editor-status');
    
    toggleBtn.textContent = this.state.isActive ? '🔒 Lock' : '✏️ Edit';
    toggleBtn.classList.toggle('active', this.state.isActive);
    statusSpan.textContent = this.state.isActive ? 'Edit Mode' : 'Locked';
    
    if (!this.state.isActive) {
      this.clearSelection();
      this.exitImageReplaceMode();
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

  openGradientBuilder() {
    // Simple gradient builder
    const gradient1 = prompt('Enter first color (hex):', '#667eea');
    const gradient2 = prompt('Enter second color (hex):', '#764ba2');
    
    if (gradient1 && gradient2) {
      const gradientValue = `linear-gradient(135deg, ${gradient1} 0%, ${gradient2} 100%)`;
      this.applyCustomBackground('gradient', gradientValue);
      this.showStatus('Custom gradient applied', 'success');
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

  applyEditorStyles() {
    if (document.getElementById('enhanced-editor-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'enhanced-editor-styles';
    styles.textContent = `
      /* Enhanced Editor Styles */
      .enhanced-editor-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        max-height: 90vh;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        overflow: hidden;
        border: 1px solid #e1e5e9;
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
      .control-group button {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 0.8rem;
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
      .btn-secondary {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
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
        width: 8px;
        height: 8px;
        background: #667eea;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10001;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .drag-handle-nw,
      .drag-handle-se {
        cursor: nw-resize;
      }
      
      .drag-handle-ne,
      .drag-handle-sw {
        cursor: ne-resize;
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