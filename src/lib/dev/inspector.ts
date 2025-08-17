// Development Inspector Overlay - Phase A
// Alt+D: Element outlines, Alt+G: Grid overlay

interface DevInspectorState {
  elementOutlines: boolean;
  gridOverlay: boolean;
  currentElement: HTMLElement | null;
}

class DevInspector {
  private state: DevInspectorState = {
    elementOutlines: false,
    gridOverlay: false,
    currentElement: null
  };

  private overlayContainer: HTMLElement | null = null;
  private gridOverlay: HTMLElement | null = null;
  private statusBar: HTMLElement | null = null;
  private hotkeyIndicator: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return;
    }

    this.createOverlayElements();
    this.bindKeyboardEvents();
    this.showInitialHotkeys();
  }

  private createOverlayElements() {
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

  private bindKeyboardEvents() {
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

  private showInitialHotkeys() {
    if (this.hotkeyIndicator) {
      this.hotkeyIndicator.classList.add('show');
      setTimeout(() => {
        this.hotkeyIndicator?.classList.remove('show');
      }, 3000);
    }
  }

  private toggleElementOutlines() {
    this.state.elementOutlines = !this.state.elementOutlines;
    
    if (this.state.elementOutlines) {
      this.enableElementInspection();
      this.statusBar?.classList.add('active');
    } else {
      this.disableElementInspection();
      this.statusBar?.classList.remove('active');
    }

    this.overlayContainer?.classList.toggle('active', this.state.elementOutlines);
  }

  private toggleGridOverlay() {
    this.state.gridOverlay = !this.state.gridOverlay;
    this.gridOverlay?.classList.toggle('active', this.state.gridOverlay);
  }

  private enableElementInspection() {
    document.addEventListener('mouseover', this.handleMouseOver);
    document.addEventListener('mouseout', this.handleMouseOut);
  }

  private disableElementInspection() {
    document.removeEventListener('mouseover', this.handleMouseOver);
    document.removeEventListener('mouseout', this.handleMouseOut);
    this.clearCurrentOutline();
  }

  private handleMouseOver = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    
    // Skip inspector elements
    if (target.classList.contains('dev-inspector-overlay') || 
        target.closest('.dev-inspector-overlay') ||
        target.classList.contains('dev-grid-overlay') ||
        target.classList.contains('dev-status-bar') ||
        target.classList.contains('dev-hotkey-indicator')) {
      return;
    }

    this.highlightElement(target);
  };

  private handleMouseOut = () => {
    this.clearCurrentOutline();
  };

  private highlightElement(element: HTMLElement) {
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

    this.overlayContainer?.appendChild(outline);
    this.overlayContainer?.appendChild(tooltip);

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

  private clearCurrentOutline() {
    if (this.overlayContainer) {
      this.overlayContainer.innerHTML = '';
    }
    this.state.currentElement = null;
  }
}

// Auto-initialize in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new DevInspector();
    });
  } else {
    new DevInspector();
  }
}

export { DevInspector };