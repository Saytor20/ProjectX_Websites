import { ReactNode } from 'react';
import { EditorAction, EditorState } from '../types';

/**
 * Core Plugin API for the Restaurant Website Generator Editor
 * Provides a secure, extensible interface for third-party plugins
 */

export interface PluginDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: PluginCategory;
  icon?: string;
  permissions: PluginPermission[];
  dependencies?: string[];
  api: PluginAPI;
}

export type PluginCategory = 
  | 'component'    // Add new UI components
  | 'theme'        // Extend theme capabilities
  | 'tool'         // Add editing tools
  | 'export'       // Custom export formats
  | 'validation'   // Custom validation rules
  | 'utility';     // General utilities

export type PluginPermission = 
  | 'dom:read'           // Read DOM elements
  | 'dom:write'          // Modify DOM elements
  | 'theme:read'         // Read theme tokens
  | 'theme:write'        // Modify theme tokens
  | 'api:call'           // Make API calls
  | 'storage:local'      // Access localStorage
  | 'storage:session'    // Access sessionStorage
  | 'network:external'   // External network calls
  | 'file:upload'        // File upload capabilities
  | 'component:create'   // Create new components
  | 'collaboration:join'; // Join collaboration sessions

export interface PluginAPI {
  // Core plugin lifecycle methods
  onActivate: (context: PluginContext) => void | Promise<void>;
  onDeactivate: (context: PluginContext) => void | Promise<void>;
  
  // Optional plugin capabilities
  onElementSelected?: (element: HTMLElement, context: PluginContext) => void;
  onThemeChanged?: (theme: any, context: PluginContext) => void;
  onComponentAdded?: (component: any, context: PluginContext) => void;
  
  // UI integration points
  getToolbarItems?: (context: PluginContext) => ToolbarItem[];
  getInspectorPanels?: (element: HTMLElement, context: PluginContext) => InspectorPanel[];
  getMenuItems?: (context: PluginContext) => MenuItem[];
  
  // Component creation (for component plugins)
  createComponent?: (props: any, context: PluginContext) => ReactNode;
  
  // Theme extensions (for theme plugins)
  generateTokens?: (baseTokens: any, context: PluginContext) => any;
  
  // Validation extensions (for validation plugins)
  validate?: (element: HTMLElement, context: PluginContext) => ValidationResult;
  
  // Export extensions (for export plugins)
  export?: (data: any, context: PluginContext) => ExportResult;
}

export interface PluginContext {
  // Editor state and actions
  state: EditorState;
  dispatch: (action: EditorAction) => void;
  
  // Element manipulation
  selectElement: (element: HTMLElement) => void;
  getSelectedElements: () => HTMLElement[];
  
  // Theme manipulation
  getTheme: () => any;
  updateTheme: (updates: any) => void;
  getTokens: () => any;
  updateTokens: (updates: any) => void;
  
  // Component system
  getComponents: () => any[];
  addComponent: (component: any) => void;
  updateComponent: (id: string, updates: any) => void;
  
  // API access (if permitted)
  api: {
    call: (endpoint: string, options?: RequestInit) => Promise<Response>;
    upload: (file: File, endpoint?: string) => Promise<any>;
  };
  
  // Storage access (if permitted)
  storage: {
    local: {
      get: (key: string) => string | null;
      set: (key: string, value: string) => void;
      remove: (key: string) => void;
    };
    session: {
      get: (key: string) => string | null;
      set: (key: string, value: string) => void;
      remove: (key: string) => void;
    };
  };
  
  // Plugin communication
  plugins: {
    get: (id: string) => PluginDefinition | null;
    send: (targetId: string, message: any) => void;
    broadcast: (message: any) => void;
  };
  
  // Collaboration (if available)
  collaboration?: {
    join: (roomId: string) => void;
    leave: () => void;
    send: (data: any) => void;
    isActive: () => boolean;
    getUsers: () => any[];
  };
}

export interface ToolbarItem {
  id: string;
  label: string;
  icon?: string;
  tooltip?: string;
  onClick: (context: PluginContext) => void;
  disabled?: boolean;
  type?: 'button' | 'toggle' | 'dropdown';
  options?: DropdownOption[];
}

export interface DropdownOption {
  id: string;
  label: string;
  icon?: string;
  onClick: (context: PluginContext) => void;
}

export interface InspectorPanel {
  id: string;
  title: string;
  icon?: string;
  render: (context: PluginContext) => ReactNode;
  priority?: number; // Higher numbers appear first
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick: (context: PluginContext) => void;
  submenu?: MenuItem[];
  separator?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  message: string;
  code: string;
  element?: HTMLElement;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning {
  message: string;
  code: string;
  element?: HTMLElement;
  suggestion?: string;
}

export interface ExportResult {
  success: boolean;
  data?: any;
  filename?: string;
  mimeType?: string;
  error?: string;
}

/**
 * Plugin Registry Events
 */
export type PluginEvent = 
  | 'plugin:activated'
  | 'plugin:deactivated'
  | 'plugin:error'
  | 'element:selected'
  | 'theme:changed'
  | 'component:added'
  | 'collaboration:joined'
  | 'collaboration:left';

export interface PluginEventData {
  pluginId: string;
  event: PluginEvent;
  data?: any;
  timestamp: number;
}

/**
 * Security and sandboxing interfaces
 */
export interface PluginSandbox {
  execute: (code: string, context: PluginContext) => any;
  cleanup: () => void;
  isSecure: () => boolean;
}

export interface PluginManifest {
  plugin: PluginDefinition;
  files: PluginFile[];
  checksum: string;
  signature?: string;
}

export interface PluginFile {
  path: string;
  content: string;
  type: 'javascript' | 'css' | 'json' | 'image';
  size: number;
}

/**
 * Plugin distribution and marketplace interfaces
 */
export interface PluginPackage {
  manifest: PluginManifest;
  readme?: string;
  changelog?: string;
  license?: string;
  screenshots?: string[];
  tags?: string[];
  downloads?: number;
  rating?: number;
  reviews?: PluginReview[];
}

export interface PluginReview {
  id: string;
  rating: number;
  comment: string;
  author: string;
  timestamp: number;
}

/**
 * Plugin installation and management
 */
export interface PluginInstallOptions {
  source: 'marketplace' | 'file' | 'url';
  autoActivate?: boolean;
  dependencies?: boolean;
  overwrite?: boolean;
}

export interface PluginInstallResult {
  success: boolean;
  plugin?: PluginDefinition;
  error?: string;
  dependencies?: string[];
}

/**
 * Error handling
 */
export class PluginError extends Error {
  constructor(
    message: string,
    public code: string,
    public pluginId: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PluginError';
  }
}

export class PluginSecurityError extends PluginError {
  constructor(
    message: string,
    pluginId: string,
    public permission: PluginPermission,
    details?: any
  ) {
    super(message, 'SECURITY_VIOLATION', pluginId, details);
    this.name = 'PluginSecurityError';
  }
}

/**
 * Type guards and utilities
 */
export function isValidPluginDefinition(obj: any): obj is PluginDefinition {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.version === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.author === 'string' &&
    typeof obj.category === 'string' &&
    Array.isArray(obj.permissions) &&
    typeof obj.api === 'object' &&
    typeof obj.api.onActivate === 'function' &&
    typeof obj.api.onDeactivate === 'function'
  );
}

export function hasPermission(
  plugin: PluginDefinition,
  permission: PluginPermission
): boolean {
  return plugin.permissions.includes(permission);
}

export function validatePermissions(
  plugin: PluginDefinition,
  requiredPermissions: PluginPermission[]
): boolean {
  return requiredPermissions.every(permission => 
    hasPermission(plugin, permission)
  );
}