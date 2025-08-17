import { 
  PluginDefinition, 
  PluginContext, 
  PluginEvent, 
  PluginEventData, 
  PluginError, 
  PluginSecurityError,
  PluginPermission,
  PluginInstallOptions,
  PluginInstallResult,
  isValidPluginDefinition,
  hasPermission,
  validatePermissions
} from './PluginAPI';
import { EditorState, EditorAction } from '../types';

/**
 * Central Plugin Registry and Management System
 * Handles plugin registration, activation, deactivation, and lifecycle management
 */
export class PluginRegistry {
  private plugins: Map<string, PluginDefinition> = new Map();
  private activePlugins: Set<string> = new Set();
  private contexts: Map<string, PluginContext> = new Map();
  private eventListeners: Map<PluginEvent, ((data: PluginEventData) => void)[]> = new Map();
  private sandboxes: Map<string, any> = new Map(); // Will be populated by PluginSandbox

  constructor(
    private editorState: EditorState,
    private dispatch: (action: EditorAction) => void
  ) {
    this.initializeEventListeners();
  }

  /**
   * Register a new plugin
   */
  async register(plugin: PluginDefinition): Promise<void> {
    if (!isValidPluginDefinition(plugin)) {
      throw new PluginError('Invalid plugin definition', 'INVALID_PLUGIN', plugin.id);
    }

    if (this.plugins.has(plugin.id)) {
      throw new PluginError('Plugin already registered', 'DUPLICATE_PLUGIN', plugin.id);
    }

    // Validate dependencies
    if (plugin.dependencies) {
      for (const depId of plugin.dependencies) {
        if (!this.plugins.has(depId)) {
          throw new PluginError(
            `Missing dependency: ${depId}`, 
            'MISSING_DEPENDENCY', 
            plugin.id,
            { dependency: depId }
          );
        }
      }
    }

    this.plugins.set(plugin.id, plugin);
    this.emit('plugin:registered', { pluginId: plugin.id, plugin });
  }

  /**
   * Unregister a plugin
   */
  async unregister(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new PluginError('Plugin not found', 'PLUGIN_NOT_FOUND', pluginId);
    }

    // Deactivate if active
    if (this.activePlugins.has(pluginId)) {
      await this.deactivate(pluginId);
    }

    // Check for dependent plugins
    const dependents = this.getDependents(pluginId);
    if (dependents.length > 0) {
      throw new PluginError(
        `Cannot unregister plugin with dependents: ${dependents.join(', ')}`,
        'HAS_DEPENDENTS',
        pluginId,
        { dependents }
      );
    }

    this.plugins.delete(pluginId);
    this.contexts.delete(pluginId);
    this.sandboxes.delete(pluginId);
    this.emit('plugin:unregistered', { pluginId });
  }

  /**
   * Activate a plugin
   */
  async activate(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new PluginError('Plugin not found', 'PLUGIN_NOT_FOUND', pluginId);
    }

    if (this.activePlugins.has(pluginId)) {
      return; // Already active
    }

    try {
      // Activate dependencies first
      if (plugin.dependencies) {
        for (const depId of plugin.dependencies) {
          if (!this.activePlugins.has(depId)) {
            await this.activate(depId);
          }
        }
      }

      // Create plugin context
      const context = this.createPluginContext(plugin);
      this.contexts.set(pluginId, context);

      // Call plugin activation
      await plugin.api.onActivate(context);

      this.activePlugins.add(pluginId);
      this.emit('plugin:activated', { pluginId, plugin });

    } catch (error) {
      this.emit('plugin:error', { 
        pluginId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new PluginError(
        `Failed to activate plugin: ${error}`,
        'ACTIVATION_FAILED',
        pluginId,
        { originalError: error }
      );
    }
  }

  /**
   * Deactivate a plugin
   */
  async deactivate(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new PluginError('Plugin not found', 'PLUGIN_NOT_FOUND', pluginId);
    }

    if (!this.activePlugins.has(pluginId)) {
      return; // Already inactive
    }

    try {
      // Check for active dependents
      const activeDependents = this.getDependents(pluginId).filter(id => 
        this.activePlugins.has(id)
      );
      
      if (activeDependents.length > 0) {
        throw new PluginError(
          `Cannot deactivate plugin with active dependents: ${activeDependents.join(', ')}`,
          'HAS_ACTIVE_DEPENDENTS',
          pluginId,
          { dependents: activeDependents }
        );
      }

      const context = this.contexts.get(pluginId);
      if (context) {
        await plugin.api.onDeactivate(context);
      }

      this.activePlugins.delete(pluginId);
      this.emit('plugin:deactivated', { pluginId, plugin });

    } catch (error) {
      this.emit('plugin:error', { 
        pluginId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw new PluginError(
        `Failed to deactivate plugin: ${error}`,
        'DEACTIVATION_FAILED',
        pluginId,
        { originalError: error }
      );
    }
  }

  /**
   * Get all registered plugins
   */
  getAll(): PluginDefinition[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get active plugins
   */
  getActive(): PluginDefinition[] {
    return Array.from(this.activePlugins)
      .map(id => this.plugins.get(id))
      .filter((plugin): plugin is PluginDefinition => plugin !== undefined);
  }

  /**
   * Get plugin by ID
   */
  get(pluginId: string): PluginDefinition | null {
    return this.plugins.get(pluginId) || null;
  }

  /**
   * Check if plugin is active
   */
  isActive(pluginId: string): boolean {
    return this.activePlugins.has(pluginId);
  }

  /**
   * Install plugin from various sources
   */
  async install(
    source: string | File | PluginDefinition,
    options: PluginInstallOptions = {}
  ): Promise<PluginInstallResult> {
    try {
      let plugin: PluginDefinition;

      if (typeof source === 'object' && 'id' in source) {
        // Direct plugin definition
        plugin = source;
      } else if (source instanceof File) {
        // Install from file
        plugin = await this.loadPluginFromFile(source);
      } else {
        // Install from URL or marketplace
        plugin = await this.loadPluginFromUrl(source);
      }

      // Check if already installed
      if (this.plugins.has(plugin.id) && !options.overwrite) {
        return {
          success: false,
          error: 'Plugin already installed. Use overwrite option to replace.'
        };
      }

      // Install dependencies if requested
      const missingDeps: string[] = [];
      if (options.dependencies && plugin.dependencies) {
        for (const depId of plugin.dependencies) {
          if (!this.plugins.has(depId)) {
            missingDeps.push(depId);
          }
        }
      }

      // Register the plugin
      await this.register(plugin);

      // Auto-activate if requested
      if (options.autoActivate) {
        await this.activate(plugin.id);
      }

      return {
        success: true,
        plugin,
        dependencies: missingDeps.length > 0 ? missingDeps : undefined
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Uninstall a plugin
   */
  async uninstall(pluginId: string): Promise<void> {
    await this.unregister(pluginId);
  }

  /**
   * Event system
   */
  on(event: PluginEvent, listener: (data: PluginEventData) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off(event: PluginEvent, listener: (data: PluginEventData) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event: PluginEvent, data?: any): void {
    const eventData: PluginEventData = {
      pluginId: data?.pluginId || 'system',
      event,
      data,
      timestamp: Date.now()
    };

    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(eventData);
        } catch (error) {
          console.error(`Error in plugin event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Plugin communication
   */
  sendMessage(fromPluginId: string, toPluginId: string, message: any): void {
    const fromPlugin = this.plugins.get(fromPluginId);
    const toPlugin = this.plugins.get(toPluginId);
    
    if (!fromPlugin || !toPlugin) {
      throw new PluginError(
        'Invalid plugin ID for message',
        'INVALID_MESSAGE_TARGET',
        fromPluginId
      );
    }

    if (!this.activePlugins.has(toPluginId)) {
      throw new PluginError(
        'Target plugin is not active',
        'INACTIVE_MESSAGE_TARGET',
        fromPluginId
      );
    }

    const toContext = this.contexts.get(toPluginId);
    if (toContext && toPlugin.api.onMessage) {
      toPlugin.api.onMessage(message, fromPluginId, toContext);
    }
  }

  broadcastMessage(fromPluginId: string, message: any): void {
    const fromPlugin = this.plugins.get(fromPluginId);
    if (!fromPlugin) {
      throw new PluginError(
        'Invalid plugin ID for broadcast',
        'INVALID_BROADCAST_SOURCE',
        fromPluginId
      );
    }

    for (const pluginId of this.activePlugins) {
      if (pluginId !== fromPluginId) {
        try {
          this.sendMessage(fromPluginId, pluginId, message);
        } catch (error) {
          // Continue broadcasting to other plugins
          console.warn(`Failed to broadcast to plugin ${pluginId}:`, error);
        }
      }
    }
  }

  /**
   * Private helper methods
   */
  private createPluginContext(plugin: PluginDefinition): PluginContext {
    return {
      state: this.editorState,
      dispatch: this.dispatch,
      
      selectElement: (element: HTMLElement) => {
        this.checkPermission(plugin, 'dom:read');
        this.dispatch({ type: 'SET_SELECTION', payload: [element] });
      },
      
      getSelectedElements: () => {
        this.checkPermission(plugin, 'dom:read');
        return this.editorState.selection?.elements || [];
      },
      
      getTheme: () => {
        this.checkPermission(plugin, 'theme:read');
        return this.editorState.theming?.currentTheme;
      },
      
      updateTheme: (updates: any) => {
        this.checkPermission(plugin, 'theme:write');
        this.dispatch({ type: 'UPDATE_THEME', payload: updates });
      },
      
      getTokens: () => {
        this.checkPermission(plugin, 'theme:read');
        return this.editorState.theming?.tokens;
      },
      
      updateTokens: (updates: any) => {
        this.checkPermission(plugin, 'theme:write');
        this.dispatch({ type: 'UPDATE_THEME_TOKENS', payload: updates });
      },
      
      getComponents: () => {
        return this.editorState.components || [];
      },
      
      addComponent: (component: any) => {
        this.checkPermission(plugin, 'component:create');
        this.dispatch({ type: 'ADD_COMPONENT', payload: component });
      },
      
      updateComponent: (id: string, updates: any) => {
        this.checkPermission(plugin, 'dom:write');
        this.dispatch({ type: 'UPDATE_COMPONENT', payload: { id, updates } });
      },
      
      api: {
        call: async (endpoint: string, options?: RequestInit) => {
          this.checkPermission(plugin, 'api:call');
          return fetch(endpoint, options);
        },
        
        upload: async (file: File, endpoint = '/api/upload/image') => {
          this.checkPermission(plugin, 'file:upload');
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch(endpoint, {
            method: 'POST',
            body: formData
          });
          return response.json();
        }
      },
      
      storage: {
        local: {
          get: (key: string) => {
            this.checkPermission(plugin, 'storage:local');
            return localStorage.getItem(`plugin:${plugin.id}:${key}`);
          },
          set: (key: string, value: string) => {
            this.checkPermission(plugin, 'storage:local');
            localStorage.setItem(`plugin:${plugin.id}:${key}`, value);
          },
          remove: (key: string) => {
            this.checkPermission(plugin, 'storage:local');
            localStorage.removeItem(`plugin:${plugin.id}:${key}`);
          }
        },
        session: {
          get: (key: string) => {
            this.checkPermission(plugin, 'storage:session');
            return sessionStorage.getItem(`plugin:${plugin.id}:${key}`);
          },
          set: (key: string, value: string) => {
            this.checkPermission(plugin, 'storage:session');
            sessionStorage.setItem(`plugin:${plugin.id}:${key}`, value);
          },
          remove: (key: string) => {
            this.checkPermission(plugin, 'storage:session');
            sessionStorage.removeItem(`plugin:${plugin.id}:${key}`);
          }
        }
      },
      
      plugins: {
        get: (id: string) => this.get(id),
        send: (targetId: string, message: any) => {
          this.sendMessage(plugin.id, targetId, message);
        },
        broadcast: (message: any) => {
          this.broadcastMessage(plugin.id, message);
        }
      }
    };
  }

  private checkPermission(plugin: PluginDefinition, permission: PluginPermission): void {
    if (!hasPermission(plugin, permission)) {
      throw new PluginSecurityError(
        `Plugin ${plugin.id} does not have permission: ${permission}`,
        plugin.id,
        permission
      );
    }
  }

  private getDependents(pluginId: string): string[] {
    const dependents: string[] = [];
    for (const [id, plugin] of this.plugins) {
      if (plugin.dependencies?.includes(pluginId)) {
        dependents.push(id);
      }
    }
    return dependents;
  }

  private async loadPluginFromFile(file: File): Promise<PluginDefinition> {
    // Implementation for loading plugin from file
    // This would parse the file and extract the plugin definition
    throw new Error('File loading not implemented yet');
  }

  private async loadPluginFromUrl(url: string): Promise<PluginDefinition> {
    // Implementation for loading plugin from URL
    // This would fetch and parse the plugin from a remote source
    throw new Error('URL loading not implemented yet');
  }

  private initializeEventListeners(): void {
    // Set up default event listeners for system events
    this.on('plugin:error', (data) => {
      console.error(`Plugin error in ${data.pluginId}:`, data.data);
    });
  }

  /**
   * Cleanup and shutdown
   */
  async shutdown(): Promise<void> {
    // Deactivate all plugins
    const activePluginIds = Array.from(this.activePlugins);
    for (const pluginId of activePluginIds) {
      try {
        await this.deactivate(pluginId);
      } catch (error) {
        console.error(`Error deactivating plugin ${pluginId}:`, error);
      }
    }

    // Clear all maps
    this.plugins.clear();
    this.activePlugins.clear();
    this.contexts.clear();
    this.eventListeners.clear();
    this.sandboxes.clear();
  }
}

/**
 * Global plugin registry instance
 */
let globalRegistry: PluginRegistry | null = null;

export function getPluginRegistry(): PluginRegistry | null {
  return globalRegistry;
}

export function initializePluginRegistry(
  editorState: EditorState,
  dispatch: (action: EditorAction) => void
): PluginRegistry {
  if (globalRegistry) {
    globalRegistry.shutdown();
  }
  
  globalRegistry = new PluginRegistry(editorState, dispatch);
  return globalRegistry;
}

export function shutdownPluginRegistry(): void {
  if (globalRegistry) {
    globalRegistry.shutdown();
    globalRegistry = null;
  }
}