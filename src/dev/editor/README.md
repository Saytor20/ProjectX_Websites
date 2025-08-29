# Moveable Editor System

This directory contains the core Moveable editor system with 3 main files that provide visual editing capabilities for elements within an iframe.

## Files

### 1. `style-applier.ts`
Handles applying CSS styles to DOM elements and managing style patches.

**Key Functions:**
- `applyStylePatch(element, styles)` - Apply styles directly to a DOM element
- `generateCSSPatch(editorId, styles)` - Generate CSS string for a specific element ID
- `applyPatchesToDocument(patches, doc)` - Apply multiple style patches to a document

### 2. `history.ts`
Custom React hook using the `use-undo` package for undo/redo functionality.

**Features:**
- Undo/redo operations for style changes
- Auto-save to localStorage with debouncing
- Per-skin and per-restaurant storage isolation

**Usage:**
```tsx
const { patches, undo, redo, addPatch, save, load, canUndo, canRedo } = useEditorHistory(skinId, restaurantId);
```

### 3. `MoveableEditor.tsx`
Main React component that provides the visual editor interface.

**Features:**
- Click to select elements in iframe
- Drag and resize elements with react-moveable
- Color picker for background colors
- Undo/redo toolbar
- Real-time style application

**Props:**
```tsx
interface MoveableEditorProps {
  iframeId: string;
  skinId: string;
  restaurantId: string;
}
```

## Usage Example

```tsx
import { MoveableEditor } from '@/dev/editor';

function EditorPage() {
  return (
    <div>
      <iframe id="preview-iframe" src="/restaurant/my-restaurant" />
      <MoveableEditor 
        iframeId="preview-iframe"
        skinId="modern-restaurant"
        restaurantId="restaurant-123"
      />
    </div>
  );
}
```

## Features

- **Element Selection**: Click any element in the iframe to select it
- **Visual Manipulation**: Drag to move, drag corners to resize
- **Color Editing**: Click color button to open color picker
- **History Management**: Undo/redo with keyboard shortcuts
- **Auto-Save**: Changes automatically saved to localStorage
- **Per-Project Storage**: Separate editor state for each skin/restaurant combination

## Dependencies

This system uses the following packages (already installed):
- `react-moveable` - For drag/resize functionality
- `use-undo` - For undo/redo state management
- `react-colorful` - For color picker interface