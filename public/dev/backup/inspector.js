// Development Inspector Overlay - Phase A (Browser Version)
// Alt+D: Element outlines, Alt+G: Grid overlay

class DevInspector {
  constructor() {
    this.state = {
      elementOutlines: false,
      gridOverlay: false,
      currentElement: null
    };

    this.overlayContainer = null;
    this.gridOverlay = null;
    this.statusBar = null;
    this.hotkeyIndicator = null;

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);

    this.init();
  }

  init() {
    if (typeof window === 'undefined') {
      return;
    }

    this.createOverlayElements();
    this.bindKeyboardEvents();
    this.showInitialHotkeys();
  }

  createOverlayElements() {
    // Main overlay container
    this.overlayContainer = document.createElement('div');
    this.overlayContainer.className = 'dev-inspector-overlay';
    document.body.appendChild(this.overlayContainer);

    // Grid overlay
    this.gridOverlay = document.createElement('div');
    this.gridOverlay.className = 'dev-grid-overlay';
    document.body.appendChild(this.gridOverlay);

    // Status bar
    this.statusBar = document.createElement('div');
    this.statusBar.className = 'dev-status-bar';
    this.statusBar.innerHTML = `
      <span>DEV MODE: Alt+D (Element Inspector) | Alt+G (Grid) | Hover elements for dimensions</span>
    `;
    document.body.appendChild(this.statusBar);

    // Hotkey indicator
    this.hotkeyIndicator = document.createElement('div');
    this.hotkeyIndicator.className = 'dev-hotkey-indicator';
    this.hotkeyIndicator.innerHTML = `
      Alt+D: Inspector<br>
      Alt+G: Grid
    `;
    document.body.appendChild(this.hotkeyIndicator);
  }

  bindKeyboardEvents() {
    document.addEventListener('keydown', (event) => {
      if (event.altKey && event.code === 'KeyD') {
        event.preventDefault();
        this.toggleElementOutlines();
      } else if (event.altKey && event.code === 'KeyG') {
        event.preventDefault();
        this.toggleGridOverlay();
      }
    });
  }

  showInitialHotkeys() {
    if (this.hotkeyIndicator) {
      this.hotkeyIndicator.classList.add('show');
      setTimeout(() => {
        if (this.hotkeyIndicator) {
          this.hotkeyIndicator.classList.remove('show');
        }
      }, 3000);
    }
  }

  toggleElementOutlines() {
    this.state.elementOutlines = !this.state.elementOutlines;
    
    if (this.state.elementOutlines) {
      this.enableElementInspection();
      if (this.statusBar) this.statusBar.classList.add('active');
    } else {
      this.disableElementInspection();
      if (this.statusBar) this.statusBar.classList.remove('active');
    }

    if (this.overlayContainer) {
      this.overlayContainer.classList.toggle('active', this.state.elementOutlines);
    }
  }

  toggleGridOverlay() {
    this.state.gridOverlay = !this.state.gridOverlay;
    if (this.gridOverlay) {
      this.gridOverlay.classList.toggle('active', this.state.gridOverlay);
    }
  }

  enableElementInspection() {
    document.addEventListener('mouseover', this.handleMouseOver);
    document.addEventListener('mouseout', this.handleMouseOut);
    document.addEventListener('click', this.handleElementClick);
    
    // Show helpful tip
    this.showInspectorTip();
  }

  disableElementInspection() {
    document.removeEventListener('mouseover', this.handleMouseOver);
    document.removeEventListener('mouseout', this.handleMouseOut);
    document.removeEventListener('click', this.handleElementClick);
    this.clearCurrentOutline();
    this.hideInspectorTip();
    this.clearPersistentSelection();
  }

  handleMouseOver(event) {
    const target = event.target;
    
    // Skip inspector elements and editor panels
    if (target.classList.contains('dev-inspector-overlay') || 
        target.closest('.dev-inspector-overlay') ||
        target.classList.contains('dev-grid-overlay') ||
        target.classList.contains('dev-status-bar') ||
        target.classList.contains('dev-hotkey-indicator') ||
        target.closest('.visual-editor-panel') ||
        target.closest('.token-editor-modal') ||
        target.closest('.component-mapper-modal')) {
      return;
    }

    this.highlightElement(target);
  }

  handleMouseOut() {
    this.clearCurrentOutline();
  }

  highlightElement(element) {
    this.clearCurrentOutline();
    this.state.currentElement = element;

    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Create outline
    const outline = document.createElement('div');
    outline.className = 'dev-element-outline';
    outline.style.left = `${rect.left + scrollX}px`;
    outline.style.top = `${rect.top + scrollY}px`;
    outline.style.width = `${rect.width}px`;
    outline.style.height = `${rect.height}px`;

    // Create dimension tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'dev-dimension-tooltip';
    tooltip.textContent = `${Math.round(rect.width)}×${Math.round(rect.height)}px`;
    tooltip.style.left = `${rect.left + scrollX + rect.width / 2}px`;
    tooltip.style.top = `${rect.top + scrollY}px`;

    if (this.overlayContainer) {
      this.overlayContainer.appendChild(outline);
      this.overlayContainer.appendChild(tooltip);
    }

    // Update status bar
    if (this.statusBar) {
      const tagName = element.tagName.toLowerCase();
      const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
      const id = element.id ? `#${element.id}` : '';
      
      this.statusBar.innerHTML = `
        <span>
          ${tagName}${id}${className} | 
          ${Math.round(rect.width)}×${Math.round(rect.height)}px | 
          Position: ${Math.round(rect.left + scrollX)}, ${Math.round(rect.top + scrollY)}
        </span>
      `;
    }
  }

  clearCurrentOutline() {
    if (this.overlayContainer) {
      this.overlayContainer.innerHTML = '';
    }
    this.state.currentElement = null;
  }

  handleElementClick = (event) => {
    const target = event.target;
    
    // Skip inspector elements and editor panels
    if (target.classList.contains('dev-inspector-overlay') || 
        target.closest('.dev-inspector-overlay') ||
        target.classList.contains('dev-grid-overlay') ||
        target.classList.contains('dev-status-bar') ||
        target.classList.contains('dev-hotkey-indicator') ||
        target.closest('.visual-editor-panel') ||
        target.closest('.token-editor-modal') ||
        target.closest('.component-mapper-modal')) {
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    
    // Persistent selection
    this.selectElementPersistent(target);
  }

  selectElementPersistent(element) {
    // Clear any previous persistent selection
    this.clearPersistentSelection();
    
    // Add persistent selection
    element.classList.add('dev-element-selected');
    this.state.currentElement = element;
    
    // Show detailed info with enhanced styling
    this.showDetailedElementInfo(element);
  }

  clearPersistentSelection() {
    document.querySelectorAll('.dev-element-selected').forEach(el => {
      el.classList.remove('dev-element-selected');
    });
  }

  showDetailedElementInfo(element) {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    // Create or update detailed info panel
    let detailPanel = document.querySelector('.dev-detail-panel');
    if (!detailPanel) {
      detailPanel = document.createElement('div');
      detailPanel.className = 'dev-detail-panel';
      document.body.appendChild(detailPanel);
    }
    
    detailPanel.innerHTML = `
      <div class="dev-detail-header">
        <h3>🎯 Selected Element</h3>
        <button onclick="this.parentElement.parentElement.remove()" class="dev-detail-close">×</button>
      </div>
      <div class="dev-detail-content">
        <div class="dev-detail-item">
          <label>Tag:</label>
          <span class="dev-detail-value">${element.tagName.toLowerCase()}</span>
        </div>
        <div class="dev-detail-item">
          <label>Classes:</label>
          <span class="dev-detail-value">${element.className || 'none'}</span>
        </div>
        <div class="dev-detail-item">
          <label>ID:</label>
          <span class="dev-detail-value">${element.id || 'none'}</span>
        </div>
        <div class="dev-detail-item">
          <label>Dimensions:</label>
          <span class="dev-detail-value">${Math.round(rect.width)} × ${Math.round(rect.height)}px</span>
        </div>
        <div class="dev-detail-item">
          <label>Position:</label>
          <span class="dev-detail-value">${Math.round(rect.left)}, ${Math.round(rect.top)}</span>
        </div>
        <div class="dev-detail-item">
          <label>Background:</label>
          <span class="dev-detail-value">${computedStyle.backgroundColor}</span>
        </div>
        <div class="dev-detail-item">
          <label>Font Size:</label>
          <span class="dev-detail-value">${computedStyle.fontSize}</span>
        </div>
        <div class="dev-detail-item">
          <label>Color:</label>
          <span class="dev-detail-value">${computedStyle.color}</span>
        </div>
      </div>
    `;
    
    detailPanel.classList.add('show');
  }

  showInspectorTip() {
    if (!this.inspectorTip) {
      this.inspectorTip = document.createElement('div');
      this.inspectorTip.className = 'dev-inspector-tip';
      this.inspectorTip.innerHTML = `
        <div class="dev-tip-content">
          <strong>🔍 Inspector Mode Active</strong><br>
          <span>Hover elements to inspect • Click to select • Alt+D to exit</span>
        </div>
      `;
      document.body.appendChild(this.inspectorTip);
    }
    this.inspectorTip.classList.add('show');
  }

  hideInspectorTip() {
    if (this.inspectorTip) {
      this.inspectorTip.classList.remove('show');
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DevInspector();
  });
} else {
  new DevInspector();
}