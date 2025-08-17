// Phase 3: Import theme types
import type { 
  ThemeMetadata, 
  ThemeChange, 
  TokenUpdate, 
  ThemeCustomization 
} from './theme';

export interface EditorSelection {
  elements: HTMLElement[];
  lastSelected?: HTMLElement;
}

export interface EditorState {
  selection: EditorSelection;
  isEditMode: boolean;
  showGuides: boolean;
  showGrid: boolean;
  history: EditorHistory;
  textEditing: {
    isEditing: boolean;
    element: HTMLElement | null;
  };
  theming: {
    currentTheme: string;
    availableThemes: ThemeMetadata[];
    isCustomizing: boolean;
    customTokens: Record<string, any>;
    previewMode: boolean;
    isDarkMode: boolean;
    responsivePreview: 'mobile' | 'tablet' | 'desktop';
    isThemeSwitcherOpen: boolean;
    isThemeCustomizerOpen: boolean;
  };
}

export interface EditorHistory {
  states: HistoryState[];
  currentIndex: number;
  maxStates: number;
}

export interface HistoryState {
  id: string;
  timestamp: number;
  type: 'move' | 'resize' | 'select' | 'style' | 'delete' | 'content' | 'image' | 'background' | 'theme' | 'tokens';
  elementId: string;
  beforeState: ElementState;
  afterState: ElementState;
  // Phase 3: Theme-specific history data
  themeBefore?: string;
  themeAfter?: string;
  tokensBefore?: Record<string, any>;
  tokensAfter?: Record<string, any>;
  customizationBefore?: ThemeCustomization;
  customizationAfter?: ThemeCustomization;
}

export interface ElementState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  styles: Record<string, string>;
  content?: string;
  imageSrc?: string;
}

export interface MoveableOptions {
  draggable: boolean;
  resizable: boolean;
  rotatable: boolean;
  scalable: boolean;
  snappable: boolean;
  bounds: boolean;
  keepRatio: boolean;
}

export interface SelectoOptions {
  selectableTargets: string[];
  selectByClick: boolean;
  selectFromInside: boolean;
  continueSelect: boolean;
  toggleContinueSelect: string[];
  keyContainer: HTMLElement | null;
}

export interface GuidesOptions {
  type: 'horizontal' | 'vertical';
  snapThreshold: number;
  isDisplaySnapDigit: boolean;
  snapGap: boolean;
  snapElement: boolean;
  snapCenter: boolean;
}

export interface EditorContext {
  state: EditorState;
  dispatch: (action: EditorAction) => void;
  selectElements: (elements: HTMLElement[]) => void;
  clearSelection: () => void;
  undo: () => void;
  redo: () => void;
  addToHistory: (state: HistoryState) => void;
}

// Phase 2 Content and Media types
export interface ContentUpdate {
  elementId: string;
  previousContent: string;
  newContent: string;
  timestamp: number;
}

export interface ImageUpdate {
  elementId: string;
  previousSrc: string;
  newSrc: string;
  timestamp: number;
}

export type EditorAction = 
  | { type: 'SET_SELECTION'; payload: HTMLElement[] }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'TOGGLE_GUIDES' }
  | { type: 'TOGGLE_GRID' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'ADD_HISTORY'; payload: HistoryState }
  // Phase 2 actions
  | { type: 'START_TEXT_EDIT'; payload: HTMLElement }
  | { type: 'END_TEXT_EDIT' }
  | { type: 'UPDATE_CONTENT'; payload: ContentUpdate }
  | { type: 'REPLACE_IMAGE'; payload: ImageUpdate }
  // Phase 3 theme actions
  | { type: 'SET_THEME'; payload: ThemeChange }
  | { type: 'UPDATE_THEME_TOKENS'; payload: TokenUpdate }
  | { type: 'RESET_THEME'; payload: string }
  | { type: 'START_THEME_CUSTOMIZATION' }
  | { type: 'END_THEME_CUSTOMIZATION' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_RESPONSIVE_PREVIEW'; payload: 'mobile' | 'tablet' | 'desktop' }
  | { type: 'TOGGLE_THEME_SWITCHER' }
  | { type: 'TOGGLE_THEME_CUSTOMIZER' }
  | { type: 'SAVE_CUSTOM_THEME'; payload: ThemeCustomization }
  | { type: 'DELETE_CUSTOM_THEME'; payload: string }
  | { type: 'SET_AVAILABLE_THEMES'; payload: ThemeMetadata[] };