// Simple Visual Editor - Clean, Functional, User-Friendly
// Only essential features: move, resize, edit text, change colors, add images

console.log('🔄 Loading Simple Editor script...');

(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.SimpleEditor) {
    console.log('⚠️ Simple Editor already loaded');
    return;
  }

  class SimpleEditor {
    constructor() {
      this.isActive = false;
      this.selectedElement = null;
      this.dragState = null;
      this.resizeState = null;
      this.templates = [];
      this.currentTemplate = null;
      
      this.init();
    }

    init() {
      this.createEditorUI();
      this.bindEvents();
      this.loadTemplates();
    }

    createEditorUI() {
      // Create floating editor button
      const editorButton = document.createElement('button');
      editorButton.id = 'simple-editor-toggle';
      editorButton.innerHTML = '✏️ Edit';
      editorButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        padding: 12px 24px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
      `;
      
      editorButton.onmouseover = () => {
        editorButton.style.transform = 'scale(1.05)';
        editorButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
      };
      
      editorButton.onmouseout = () => {
        editorButton.style.transform = 'scale(1)';
        editorButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      };

      // Create editor panel
      const editorPanel = document.createElement('div');
      editorPanel.id = 'simple-editor-panel';
      editorPanel.style.cssText = `
        position: fixed;
        top: 0;
        left: -320px;
        width: 300px;
        height: 100vh;
        background: white;
        box-shadow: 2px 0 12px rgba(0,0,0,0.1);
        z-index: 9999;
        transition: left 0.3s ease;
        overflow-y: auto;
        padding: 20px;
      `;

      editorPanel.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 20px; color: #1f2937;">🎨 Simple Editor</h3>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Click elements to edit them</p>
        </div>

        <div id="editor-tools" style="display: none;">
          <div style="margin-bottom: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #374151;">Selected Element</h4>
            <div id="element-info" style="font-size: 12px; color: #6b7280;"></div>
            <div style="margin-top: 8px;">
              <button id="auto-resize-btn" style="padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
                📐 Auto-Resize
              </button>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #374151;">Text Content</label>
            <textarea id="text-editor" style="width: 100%; height: 60px; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;"></textarea>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #374151;">Background Color</label>
            <div style="display: flex; gap: 8px;">
              <input type="color" id="bg-color-picker" value="#ffffff" style="width: 50px; height: 36px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer;">
              <input type="text" id="bg-color-text" placeholder="#ffffff" style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
              <button id="clear-bg-btn" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">Clear</button>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #374151;">Text Color</label>
            <div style="display: flex; gap: 8px;">
              <input type="color" id="text-color-picker" value="#000000" style="width: 50px; height: 36px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer;">
              <input type="text" id="text-color-text" placeholder="#000000" style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #374151;">Font Size</label>
            <input type="range" id="font-size-slider" min="10" max="72" value="16" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280;">
              <span>10px</span>
              <span id="font-size-value">16px</span>
              <span>72px</span>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #374151;">Image Upload</label>
            <div style="display: flex; gap: 8px;">
              <input type="file" id="image-file-input" accept="image/*" style="display: none;">
              <button id="upload-image-btn" style="flex: 1; padding: 10px; background: #10b981; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer;">
                📁 Upload Image
              </button>
              <button id="url-image-btn" style="flex: 1; padding: 10px; background: #8b5cf6; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer;">
                🔗 URL Image
              </button>
            </div>
          </div>

          <button id="remove-element-btn" style="width: 100%; padding: 10px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer; margin-bottom: 15px;">
            🗑️ Remove Element
          </button>
        </div>

        <div style="padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #374151;">🧩 Add Elements</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
            <button class="add-element-btn" data-element="text" style="padding: 8px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 12px;">📝 Text</button>
            <button class="add-element-btn" data-element="button" style="padding: 8px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 12px;">🔘 Button</button>
            <button class="add-element-btn" data-element="social" style="padding: 8px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 12px;">📱 Social</button>
            <button class="add-element-btn" data-element="menu" style="padding: 8px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 12px;">🍽️ Menu</button>
            <button class="add-element-btn" data-element="box" style="padding: 8px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 12px;">⬜ Box</button>
            <button class="add-element-btn" data-element="icon" style="padding: 8px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 12px;">⭐ Icon</button>
          </div>
        </div>

        <div style="padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #374151;">🔌 Simple Plugins</h4>
          <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 15px;">
            <button class="plugin-btn" data-plugin="contact-form" style="padding: 10px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 13px; text-align: left;">📨 Contact Form</button>
            <button class="plugin-btn" data-plugin="gallery" style="padding: 10px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 13px; text-align: left;">🖼️ Image Gallery</button>
            <button class="plugin-btn" data-plugin="map" style="padding: 10px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 13px; text-align: left;">🗺️ Location Map</button>
            <button class="plugin-btn" data-plugin="reviews" style="padding: 10px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 13px; text-align: left;">⭐ Reviews</button>
          </div>
        </div>

        <div style="padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #374151;">🌈 Page Background</h4>
          <div style="display: flex; gap: 8px; margin-bottom: 10px;">
            <button class="bg-preset" data-bg="white" style="width: 40px; height: 40px; background: white; border: 2px solid #d1d5db; border-radius: 6px; cursor: pointer;"></button>
            <button class="bg-preset" data-bg="#f3f4f6" style="width: 40px; height: 40px; background: #f3f4f6; border: 2px solid #d1d5db; border-radius: 6px; cursor: pointer;"></button>
            <button class="bg-preset" data-bg="#1f2937" style="width: 40px; height: 40px; background: #1f2937; border: 2px solid #d1d5db; border-radius: 6px; cursor: pointer;"></button>
            <button class="bg-preset" data-bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: 2px solid #d1d5db; border-radius: 6px; cursor: pointer;"></button>
          </div>
          <input type="color" id="page-bg-color" value="#ffffff" style="width: 100%; height: 36px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer;">
        </div>

        <div style="margin-top: 20px;">
          <button id="save-changes-btn" style="width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer;">
            💾 Save Changes
          </button>
        </div>
      `;

      document.body.appendChild(editorButton);
      document.body.appendChild(editorPanel);

      // Store references
      this.editorButton = editorButton;
      this.editorPanel = editorPanel;
    }

    bindEvents() {
      // Toggle editor
      this.editorButton.addEventListener('click', () => this.toggleEditor());

      // Element selection
      document.addEventListener('click', (e) => {
        if (!this.isActive) return;
        if (e.target.closest('#simple-editor-panel') || e.target.closest('#simple-editor-toggle')) return;
        
        e.preventDefault();
        e.stopPropagation();
        this.selectElement(e.target);
      });

      // Text editor
      const textEditor = document.getElementById('text-editor');
      if (textEditor) textEditor.addEventListener('input', (e) => {
        if (this.selectedElement) {
          this.selectedElement.textContent = e.target.value;
        }
      });

      // Color pickers
      const bgColorPicker = document.getElementById('bg-color-picker');
      const bgColorText = document.getElementById('bg-color-text');
      
      if (bgColorPicker) bgColorPicker.addEventListener('input', (e) => {
        if (this.selectedElement) {
          this.selectedElement.style.backgroundColor = e.target.value;
          if (bgColorText) bgColorText.value = e.target.value;
        }
      });

      if (bgColorText) bgColorText.addEventListener('input', (e) => {
        if (this.selectedElement && e.target.value) {
          this.selectedElement.style.backgroundColor = e.target.value;
          if (bgColorPicker) bgColorPicker.value = e.target.value;
        }
      });

      // Clear background button
      const clearBgBtn = document.getElementById('clear-bg-btn');
      if (clearBgBtn) clearBgBtn.addEventListener('click', () => {
        if (this.selectedElement) {
          this.selectedElement.style.backgroundColor = '';
          this.selectedElement.style.backgroundImage = '';
          if (bgColorPicker) bgColorPicker.value = '#ffffff';
          if (bgColorText) bgColorText.value = '';
        }
      });

      const textColorPicker = document.getElementById('text-color-picker');
      const textColorText = document.getElementById('text-color-text');
      if (textColorPicker) textColorPicker.addEventListener('input', (e) => {
        if (this.selectedElement) {
          this.selectedElement.style.color = e.target.value;
          if (textColorText) textColorText.value = e.target.value;
        }
      });

      // Font size slider
      const fontSizeSlider = document.getElementById('font-size-slider');
      const fontSizeValue = document.getElementById('font-size-value');
      if (fontSizeSlider) fontSizeSlider.addEventListener('input', (e) => {
        const size = e.target.value + 'px';
        fontSizeValue.textContent = size;
        if (this.selectedElement) {
          this.selectedElement.style.fontSize = size;
        }
      });

      // Padding slider
      const paddingSlider = document.getElementById('padding-slider');
      const paddingValue = document.getElementById('padding-value');
      if (paddingSlider) paddingSlider.addEventListener('input', (e) => {
        const padding = e.target.value + 'px';
        paddingValue.textContent = padding;
        if (this.selectedElement) {
          this.selectedElement.style.padding = padding;
        }
      });

      // Page background
      const pageBgColor = document.getElementById('page-bg-color');
      if (pageBgColor) pageBgColor.addEventListener('input', (e) => {
        document.body.style.background = e.target.value;
      });

      // Background presets
      document.querySelectorAll('.bg-preset').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const bg = e.target.dataset.bg;
          document.body.style.background = bg;
        });
      });

      // Auto-resize button
      const autoResizeBtn = document.getElementById('auto-resize-btn');
      if (autoResizeBtn) autoResizeBtn.addEventListener('click', () => {
        if (this.selectedElement) {
          this.autoResizeElement(this.selectedElement);
        }
      });

      // Image upload from file
      const imageFileInput = document.getElementById('image-file-input');
      const uploadImageBtn = document.getElementById('upload-image-btn');
      if (uploadImageBtn) uploadImageBtn.addEventListener('click', () => {
        if (imageFileInput) imageFileInput.click();
      });

      if (imageFileInput) imageFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && this.selectedElement) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target.result;
            if (this.selectedElement.tagName === 'IMG') {
              this.selectedElement.src = dataUrl;
            } else {
              this.selectedElement.style.backgroundImage = `url(${dataUrl})`;
              this.selectedElement.style.backgroundSize = 'cover';
              this.selectedElement.style.backgroundPosition = 'center';
            }
          };
          reader.readAsDataURL(file);
        }
      });

      // Image URL button
      const urlImageBtn = document.getElementById('url-image-btn');
      if (urlImageBtn) urlImageBtn.addEventListener('click', () => {
        const url = prompt('Enter image URL:');
        if (url && this.selectedElement) {
          if (this.selectedElement.tagName === 'IMG') {
            this.selectedElement.src = url;
          } else {
            this.selectedElement.style.backgroundImage = `url(${url})`;
            this.selectedElement.style.backgroundSize = 'cover';
            this.selectedElement.style.backgroundPosition = 'center';
          }
        }
      });

      // Remove element
      const removeElementBtn = document.getElementById('remove-element-btn');
      if (removeElementBtn) removeElementBtn.addEventListener('click', () => {
        if (this.selectedElement && confirm('Remove this element?')) {
          this.selectedElement.remove();
          this.selectedElement = null;
          this.hideElementTools();
        }
      });

      // Add element buttons
      document.querySelectorAll('.add-element-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const elementType = e.target.dataset.element;
          this.addNewElement(elementType);
        });
      });

      // Plugin buttons
      document.querySelectorAll('.plugin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const pluginType = e.target.dataset.plugin;
          this.addPlugin(pluginType);
        });
      });

      // Save changes
      const saveChangesBtn = document.getElementById('save-changes-btn');
      if (saveChangesBtn) saveChangesBtn.addEventListener('click', () => {
        this.saveChanges();
      });

      // Enable drag and drop
      this.enableDragAndDrop();
    }

    enableDragAndDrop() {
      let draggedElement = null;
      let offsetX = 0;
      let offsetY = 0;

      document.addEventListener('mousedown', (e) => {
        if (!this.isActive) return;
        if (e.target.closest('#simple-editor-panel')) return;
        
        const element = e.target;
        if (!element) return;

        // Check if it's a resize handle
        const rect = element.getBoundingClientRect();
        const isNearEdge = (
          e.clientX - rect.left < 10 || 
          rect.right - e.clientX < 10 ||
          e.clientY - rect.top < 10 ||
          rect.bottom - e.clientY < 10
        );

        if (isNearEdge && e.shiftKey) {
          // Resize mode
          this.startResize(element, e);
        } else if (e.altKey) {
          // Drag mode
          draggedElement = element;
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          
          element.style.position = 'relative';
          element.style.cursor = 'move';
          element.style.opacity = '0.8';
          
          e.preventDefault();
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (draggedElement && this.isActive) {
          const x = e.clientX - offsetX - draggedElement.parentElement.getBoundingClientRect().left;
          const y = e.clientY - offsetY - draggedElement.parentElement.getBoundingClientRect().top;
          
          draggedElement.style.left = x + 'px';
          draggedElement.style.top = y + 'px';
        }
      });

      document.addEventListener('mouseup', () => {
        if (draggedElement) {
          draggedElement.style.cursor = '';
          draggedElement.style.opacity = '';
          draggedElement = null;
        }
      });
    }

    startResize(element, e) {
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = element.offsetWidth;
      const startHeight = element.offsetHeight;

      const doResize = (e) => {
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        
        element.style.width = Math.max(50, newWidth) + 'px';
        element.style.height = Math.max(30, newHeight) + 'px';
      };

      const stopResize = () => {
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
      };

      document.addEventListener('mousemove', doResize);
      document.addEventListener('mouseup', stopResize);
    }

    toggleEditor() {
      this.isActive = !this.isActive;
      
      if (this.isActive) {
        this.editorPanel.style.left = '0';
        this.editorButton.innerHTML = '✖️ Close';
        this.editorButton.style.background = '#ef4444';
        this.addEditableOutlines();
        this.showHelp();
      } else {
        this.editorPanel.style.left = '-320px';
        this.editorButton.innerHTML = '✏️ Edit';
        this.editorButton.style.background = '#3b82f6';
        this.removeEditableOutlines();
        this.hideElementTools();
      }
    }

    showHelp() {
      const helpToast = document.createElement('div');
      helpToast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1f2937;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10001;
        animation: slideDown 0.3s ease;
        max-width: 400px;
        text-align: center;
        font-size: 14px;
      `;
      helpToast.innerHTML = `
        <strong>Editor Active!</strong><br>
        Click any element to edit • Alt+Drag to move • Shift+Drag edges to resize
      `;
      
      document.body.appendChild(helpToast);
      
      setTimeout(() => {
        helpToast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => helpToast.remove(), 300);
      }, 3000);
    }

    addEditableOutlines() {
      const style = document.createElement('style');
      style.id = 'editor-outlines';
      style.innerHTML = `
        body.editor-active * {
          outline: 1px dashed rgba(59, 130, 246, 0.3);
          outline-offset: -1px;
          transition: outline 0.2s ease;
        }
        body.editor-active *:hover {
          outline: 2px solid rgba(59, 130, 246, 0.8);
          cursor: pointer;
        }
        .editor-selected {
          outline: 3px solid #3b82f6 !important;
          outline-offset: -3px !important;
        }
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(0); opacity: 1; }
          to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      document.body.classList.add('editor-active');
    }

    removeEditableOutlines() {
      const editorOutlines = document.getElementById('editor-outlines');
      if (editorOutlines) editorOutlines.remove();
      document.body.classList.remove('editor-active');
      document.querySelectorAll('.editor-selected').forEach(el => {
        el.classList.remove('editor-selected');
      });
    }

    selectElement(element) {
      // Clear previous selection
      document.querySelectorAll('.editor-selected').forEach(el => {
        el.classList.remove('editor-selected');
      });

      // Select new element
      this.selectedElement = element;
      element.classList.add('editor-selected');

      // Update tools
      this.showElementTools(element);
    }

    showElementTools(element) {
      const tools = document.getElementById('editor-tools');
      const info = document.getElementById('element-info');
      
      tools.style.display = 'block';
      info.innerHTML = `
        <strong>Type:</strong> ${element.tagName.toLowerCase()}<br>
        <strong>Class:</strong> ${element.className || 'none'}<br>
        <strong>Size:</strong> ${element.offsetWidth}×${element.offsetHeight}px
      `;

      // Update form fields
      const textEditor = document.getElementById('text-editor');
      const bgColorPicker = document.getElementById('bg-color-picker');
      const bgColorText = document.getElementById('bg-color-text');
      const textColorPicker = document.getElementById('text-color-picker');
      const textColorText = document.getElementById('text-color-text');
      
      if (textEditor) textEditor.value = element.textContent || '';
      
      // Handle background color properly
      const computedBgColor = getComputedStyle(element).backgroundColor;
      const bgColorHex = this.rgbToHex(computedBgColor);
      if (bgColorPicker) bgColorPicker.value = bgColorHex;
      if (bgColorText) bgColorText.value = bgColorHex;
      
      // Handle text color
      const computedTextColor = getComputedStyle(element).color;
      const textColorHex = this.rgbToHex(computedTextColor);
      if (textColorPicker) textColorPicker.value = textColorHex;
      if (textColorText) textColorText.value = textColorHex;
      
      // Font size
      const fontSize = parseInt(getComputedStyle(element).fontSize) || 16;
      const fontSizeSlider = document.getElementById('font-size-slider');
      const fontSizeValue = document.getElementById('font-size-value');
      if (fontSizeSlider) fontSizeSlider.value = fontSize;
      if (fontSizeValue) fontSizeValue.textContent = fontSize + 'px';
    }

    hideElementTools() {
      document.getElementById('editor-tools').style.display = 'none';
    }

    rgbToHex(rgb) {
      if (!rgb || rgb === 'transparent') return '#ffffff';
      const result = rgb.match(/\d+/g);
      if (!result) return '#ffffff';
      return '#' + result.slice(0, 3).map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    }

    async loadTemplates() {
      try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        if (data.success) {
          this.templates = data.templates || [];
        }
      } catch (error) {
        console.warn('Could not load templates:', error);
      }
    }

    autoResizeElement(element) {
      // Auto-resize element to fit content with proper padding
      const originalWidth = element.style.width;
      const originalHeight = element.style.height;
      
      element.style.width = 'auto';
      element.style.height = 'auto';
      
      const rect = element.getBoundingClientRect();
      const computedStyle = getComputedStyle(element);
      
      // Add some padding based on content
      const padding = Math.max(20, Math.min(40, rect.width * 0.1));
      element.style.padding = `${padding}px`;
      
      // Set minimum dimensions
      const minWidth = Math.max(100, rect.width + padding * 2);
      const minHeight = Math.max(50, rect.height + padding * 2);
      
      element.style.width = minWidth + 'px';
      element.style.height = minHeight + 'px';
      
      // Show feedback
      this.showToast(`✅ Element auto-resized to ${minWidth}×${minHeight}px`);
    }

    addNewElement(elementType) {
      let newElement;
      
      switch(elementType) {
        case 'text':
          newElement = document.createElement('div');
          newElement.textContent = 'New Text Element';
          newElement.style.cssText = 'padding: 20px; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; margin: 10px; display: inline-block;';
          break;
          
        case 'button':
          newElement = document.createElement('button');
          newElement.textContent = 'New Button';
          newElement.style.cssText = 'padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 10px; font-weight: bold;';
          break;
          
        case 'social':
          newElement = document.createElement('div');
          newElement.innerHTML = `
            <div style="display: flex; gap: 10px; padding: 20px;">
              <a href="#" style="width: 40px; height: 40px; background: #1877f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; color: white; font-weight: bold;">f</a>
              <a href="#" style="width: 40px; height: 40px; background: #1da1f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; color: white; font-weight: bold;">t</a>
              <a href="#" style="width: 40px; height: 40px; background: #e4405f; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; color: white; font-weight: bold;">i</a>
            </div>
          `;
          newElement.style.cssText = 'border: 2px dashed #d1d5db; border-radius: 8px; margin: 10px; display: inline-block;';
          break;
          
        case 'menu':
          newElement = document.createElement('div');
          newElement.innerHTML = `
            <div style="padding: 20px; border: 2px dashed #d1d5db; border-radius: 8px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937;">Menu Item</h3>
              <p style="margin: 0 0 10px 0; color: #6b7280;">Delicious food description goes here...</p>
              <span style="font-weight: bold; color: #3b82f6;">$12.99</span>
            </div>
          `;
          newElement.style.cssText = 'margin: 10px; display: inline-block; max-width: 300px;';
          break;
          
        case 'box':
          newElement = document.createElement('div');
          newElement.textContent = 'New Box';
          newElement.style.cssText = 'width: 200px; height: 100px; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; margin: 10px; display: flex; align-items: center; justify-content: center; color: #6b7280;';
          break;
          
        case 'icon':
          newElement = document.createElement('div');
          newElement.innerHTML = '⭐';
          newElement.style.cssText = 'font-size: 48px; padding: 20px; margin: 10px; display: inline-block; border: 2px dashed #d1d5db; border-radius: 8px; text-align: center;';
          break;
          
        default:
          newElement = document.createElement('div');
          newElement.textContent = 'New Element';
          newElement.style.cssText = 'padding: 20px; border: 2px dashed #d1d5db; border-radius: 8px; margin: 10px; display: inline-block;';
      }
      
      // Add to page
      if (this.selectedElement && this.selectedElement.parentNode) {
        this.selectedElement.parentNode.insertBefore(newElement, this.selectedElement.nextSibling);
      } else {
        document.body.appendChild(newElement);
      }
      
      // Auto-select the new element
      this.selectElement(newElement);
      this.showToast(`✅ Added new ${elementType} element`);
    }

    addPlugin(pluginType) {
      let pluginElement;
      
      switch(pluginType) {
        case 'contact-form':
          pluginElement = document.createElement('div');
          pluginElement.innerHTML = `
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
          pluginElement = document.createElement('div');
          pluginElement.innerHTML = `
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
          pluginElement = document.createElement('div');
          pluginElement.innerHTML = `
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
          pluginElement = document.createElement('div');
          pluginElement.innerHTML = `
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
                <div style="padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <span style="font-weight: bold; color: #1f2937;">Sarah M.</span>
                    <span style="color: #fbbf24;">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p style="margin: 0; color: #6b7280;">"Best restaurant in town! Will definitely come back."</p>
                </div>
              </div>
            </div>
          `;
          break;
          
        default:
          pluginElement = document.createElement('div');
          pluginElement.innerHTML = `<div style="padding: 20px; border: 2px dashed #d1d5db; border-radius: 8px;">Plugin: ${pluginType}</div>`;
      }
      
      pluginElement.style.margin = '20px';
      pluginElement.dataset.plugin = pluginType;
      
      // Add to page
      if (this.selectedElement && this.selectedElement.parentNode) {
        this.selectedElement.parentNode.insertBefore(pluginElement, this.selectedElement.nextSibling);
      } else {
        document.body.appendChild(pluginElement);
      }
      
      // Auto-select the new plugin
      this.selectElement(pluginElement);
      this.showToast(`✅ Added ${pluginType.replace('-', ' ')} plugin`);
    }

    showToast(message, duration = 2000) {
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: #1f2937;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10001;
        font-weight: bold;
        max-width: 300px;
        animation: slideIn 0.3s ease;
      `;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    saveChanges() {
      const changes = {
        timestamp: new Date().toISOString(),
        elements: [],
        pageBackground: getComputedStyle(document.body).background
      };

      document.querySelectorAll('.editor-selected').forEach(el => {
        changes.elements.push({
          tagName: el.tagName,
          className: el.className,
          styles: {
            color: el.style.color,
            backgroundColor: el.style.backgroundColor,
            fontSize: el.style.fontSize,
            padding: el.style.padding,
            position: el.style.position,
            left: el.style.left,
            top: el.style.top,
            width: el.style.width,
            height: el.style.height
          },
          content: el.textContent
        });
      });

      // Save to localStorage
      localStorage.setItem('editor-changes', JSON.stringify(changes));
      
      // Show success message
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10001;
        font-weight: bold;
      `;
      toast.textContent = '✅ Changes saved!';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.remove(), 2000);
    }
  }

  // Initialize editor when DOM is ready
  function initEditor() {
    window.SimpleEditor = SimpleEditor;
    window.simpleEditor = new SimpleEditor();
    console.log('✅ Simple Editor loaded! Look for the Edit button in the bottom-right corner.');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditor);
  } else {
    // DOM already loaded
    initEditor();
  }
})();