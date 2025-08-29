export interface StylePatch {
  id: string;
  styles: Record<string, string>;
}

/**
 * Apply styles directly to a DOM element
 */
export function applyStylePatch(element: HTMLElement, styles: Record<string, string>): void {
  Object.entries(styles).forEach(([property, value]) => {
    // Convert CSS property names from kebab-case to camelCase for style object
    const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    (element.style as any)[camelProperty] = value;
  });
}

/**
 * Generate CSS string for a specific element ID
 */
export function generateCSSPatch(editorId: string, styles: Record<string, string>): string {
  const selector = `[data-editor-id="${editorId}"]`;
  const cssRules = Object.entries(styles)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');
  
  return `${selector} {\n${cssRules}\n}`;
}

/**
 * Apply multiple style patches to a document by injecting CSS
 */
export function applyPatchesToDocument(patches: StylePatch[], doc: Document): void {
  applyPatchesToRoot(patches, doc);
}

/**
 * Apply multiple style patches to a document or shadow root by injecting CSS
 */
export function applyPatchesToRoot(patches: StylePatch[], root: Document | ShadowRoot): void {
  // Remove existing patch styles
  const existingStyle = root.querySelector('#moveable-editor-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  if (patches.length === 0) return;

  // Create new style element
  const styleElement = (root as Document).createElement ? 
    (root as Document).createElement('style') : 
    (root as ShadowRoot).ownerDocument!.createElement('style');
  
  styleElement.id = 'moveable-editor-styles';
  styleElement.textContent = patches
    .map(patch => generateCSSPatch(patch.id, patch.styles))
    .join('\n\n');

  // Append to appropriate location
  try {
    if (root instanceof Document) {
      // For Document, append to head
      if (root.head) {
        root.head.appendChild(styleElement);
      } else {
        // If no head yet, wait for it
        console.warn('Document head not ready yet');
        return;
      }
    } else if (root instanceof ShadowRoot) {
      // For ShadowRoot, append directly
      root.appendChild(styleElement);
    } else {
      // Fallback: try to find head in whatever root we have
      const head = (root as any).head || (root as any).querySelector?.('head');
      if (head) {
        head.appendChild(styleElement);
      } else {
        console.warn('Could not find appropriate place to append styles');
      }
    }
  } catch (error) {
    console.warn('Failed to append style element:', error);
  }
}