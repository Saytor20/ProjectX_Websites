'use client';

// Types for the editor field system
export type FieldType = 'text' | 'image' | 'select' | 'spacing' | 'color';

export interface EditorField {
  id: string;
  type: FieldType;
  label: string;
  selector?: string; // CSS selector to target the element
  property?: string; // CSS property to modify
  options?: string[]; // For select fields
  min?: number; // For spacing fields
  max?: number; // For spacing fields
  step?: number; // For spacing fields
  unit?: string; // For spacing fields (rem, px, etc.)
}

export interface BlockRegistration {
  id: string;
  name: string;
  selector: string; // CSS selector to identify the block
  fields: EditorField[];
}

// Global registry
const blockRegistry: Map<string, BlockRegistration> = new Map();

// Register a block with its editable fields
export function registerBlock(block: BlockRegistration): void {
  blockRegistry.set(block.id, block);
  console.log(`Registered block: ${block.id} with ${block.fields.length} fields`);
}

// Get all registered blocks
export function getAllBlocks(): BlockRegistration[] {
  return Array.from(blockRegistry.values());
}

// Get a specific block by ID
export function getBlock(id: string): BlockRegistration | undefined {
  return blockRegistry.get(id);
}

// Get blocks that are currently in the DOM
export function getActiveBlocks(): { block: BlockRegistration; element: HTMLElement }[] {
  const activeBlocks: { block: BlockRegistration; element: HTMLElement }[] = [];
  
  blockRegistry.forEach((block) => {
    const elements = document.querySelectorAll(block.selector);
    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        activeBlocks.push({ block, element });
      }
    });
  });

  return activeBlocks;
}

// Clear all registrations (useful for hot reload)
export function clearRegistry(): void {
  blockRegistry.clear();
}

// Utility to apply field changes
export function applyFieldChange(
  element: HTMLElement,
  field: EditorField,
  value: string | number
): void {
  const targetElement = field.selector 
    ? element.querySelector(field.selector) as HTMLElement || element
    : element;

  switch (field.type) {
    case 'text':
      if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') {
        (targetElement as HTMLInputElement).value = String(value);
      } else {
        targetElement.textContent = String(value);
      }
      break;

    case 'image':
      if (targetElement.tagName === 'IMG') {
        (targetElement as HTMLImageElement).src = String(value);
      } else {
        targetElement.style.backgroundImage = `url(${value})`;
      }
      break;

    case 'select':
      if (field.property) {
        targetElement.style.setProperty(field.property, String(value));
      } else {
        // Apply as CSS class
        field.options?.forEach(option => {
          targetElement.classList.remove(option);
        });
        targetElement.classList.add(String(value));
      }
      break;

    case 'spacing':
    case 'color':
      if (field.property) {
        const cssValue = field.unit ? `${value}${field.unit}` : String(value);
        targetElement.style.setProperty(field.property, cssValue);
      }
      break;
  }
}

// Get current value of a field
export function getFieldValue(element: HTMLElement, field: EditorField): string | number {
  const targetElement = field.selector 
    ? element.querySelector(field.selector) as HTMLElement || element
    : element;

  switch (field.type) {
    case 'text':
      if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA') {
        return (targetElement as HTMLInputElement).value;
      } else {
        return targetElement.textContent || '';
      }

    case 'image':
      if (targetElement.tagName === 'IMG') {
        return (targetElement as HTMLImageElement).src;
      } else {
        const bg = targetElement.style.backgroundImage;
        const match = bg.match(/url\(['"]?([^'"]*)['"]?\)/);
        return match ? (match[1] || '') : '';
      }

    case 'select':
      if (field.property) {
        return targetElement.style.getPropertyValue(field.property) || field.options?.[0] || '';
      } else {
        // Find which class is active
        const activeOption = field.options?.find(option => 
          targetElement.classList.contains(option)
        );
        return activeOption || field.options?.[0] || '';
      }

    case 'spacing':
      if (field.property) {
        const value = targetElement.style.getPropertyValue(field.property);
        if (field.unit && value.includes(field.unit)) {
          return parseFloat(value.replace(field.unit, ''));
        }
        return parseFloat(value) || 0;
      }
      return 0;

    case 'color':
      if (field.property) {
        return targetElement.style.getPropertyValue(field.property) || '#000000';
      }
      return '#000000';

    default:
      return '';
  }
}