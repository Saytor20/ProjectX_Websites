import { 
  PluginDefinition, 
  PluginContext, 
  PluginPermission, 
  PluginSecurityError,
  hasPermission 
} from './PluginAPI';

/**
 * Secure Plugin Sandbox for safe plugin execution
 * Implements sandboxing and permission validation for plugin code
 */

export class PluginSandbox {
  private iframe: HTMLIFrameElement | null = null;
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  private isInitialized = false;
  private allowedAPIs: Set<string> = new Set();

  constructor(
    private plugin: PluginDefinition,
    private context: PluginContext
  ) {
    this.initializeAllowedAPIs();
  }

  /**
   * Initialize the sandbox environment
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Create isolated iframe for plugin execution
      this.iframe = this.createSandboxIframe();
      
      // Set up secure communication channel
      this.setupMessageChannel();
      
      // Inject controlled APIs based on permissions
      await this.injectControlledAPIs();
      
      this.isInitialized = true;
    } catch (error) {
      throw new PluginSecurityError(
        `Failed to initialize sandbox: ${error}`,
        this.plugin.id,
        'dom:read'
      );
    }
  }

  /**
   * Execute plugin code safely within the sandbox
   */
  async execute(code: string): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.iframe?.contentWindow) {
      throw new PluginSecurityError(
        'Sandbox iframe not available',
        this.plugin.id,
        'dom:read'
      );
    }

    return new Promise((resolve, reject) => {
      const executionId = this.generateExecutionId();
      const timeout = setTimeout(() => {
        reject(new PluginSecurityError(
          'Plugin execution timeout',
          this.plugin.id,
          'dom:read'
        ));
      }, 5000); // 5 second timeout

      // Listen for execution result
      const resultListener = (event: MessageEvent) => {
        if (event.data.type === 'execution-result' && event.data.id === executionId) {
          clearTimeout(timeout);
          window.removeEventListener('message', resultListener);
          
          if (event.data.error) {
            reject(new PluginSecurityError(
              event.data.error,
              this.plugin.id,
              'dom:read'
            ));
          } else {
            resolve(event.data.result);
          }
        }
      };

      window.addEventListener('message', resultListener);

      // Send code for execution
      this.iframe.contentWindow.postMessage({
        type: 'execute',
        id: executionId,
        code: this.wrapCodeWithSecurity(code),
        pluginId: this.plugin.id
      }, '*');
    });
  }

  /**
   * Cleanup sandbox resources
   */
  cleanup(): void {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = null;
    }

    if (this.iframe && this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
      this.iframe = null;
    }

    this.isInitialized = false;
  }

  /**
   * Check if the sandbox is secure and properly isolated
   */
  isSecure(): boolean {
    return (
      this.isInitialized &&
      this.iframe !== null &&
      this.iframe.sandbox.contains('allow-scripts') &&
      !this.iframe.sandbox.contains('allow-same-origin') &&
      !this.iframe.sandbox.contains('allow-top-navigation')
    );
  }

  /**
   * Validate and filter API calls based on permissions
   */
  validateAPICall(apiPath: string, permission: PluginPermission): boolean {
    if (!hasPermission(this.plugin, permission)) {
      throw new PluginSecurityError(
        `Plugin does not have permission for ${apiPath}`,
        this.plugin.id,
        permission
      );
    }

    if (!this.allowedAPIs.has(apiPath)) {
      throw new PluginSecurityError(
        `API ${apiPath} is not allowed`,
        this.plugin.id,
        permission
      );
    }

    return true;
  }

  /**
   * Private implementation methods
   */
  private createSandboxIframe(): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    
    // Configure sandbox restrictions
    iframe.sandbox.add(
      'allow-scripts'  // Allow JavaScript execution
      // Explicitly NOT adding:
      // - allow-same-origin (prevents access to parent origin)
      // - allow-top-navigation (prevents navigation)
      // - allow-forms (prevents form submission)
      // - allow-popups (prevents popup creation)
    );

    // Make iframe invisible
    iframe.style.display = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    // Create minimal HTML document
    iframe.srcdoc = this.createSandboxHTML();

    // Add to DOM
    document.body.appendChild(iframe);

    return iframe;
  }

  private createSandboxHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Plugin Sandbox</title>
        <meta http-equiv="Content-Security-Policy" content="
          default-src 'none';
          script-src 'unsafe-inline' 'unsafe-eval';
          connect-src ${this.getAllowedOrigins()};
        ">
      </head>
      <body>
        <script>
          ${this.getSandboxBootstrapCode()}
        </script>
      </body>
      </html>
    `;
  }

  private getSandboxBootstrapCode(): string {
    return `
      // Sandbox environment setup
      const pluginAPI = ${JSON.stringify(this.createRestrictedAPI())};
      
      // Override dangerous globals
      window.location = undefined;
      window.history = undefined;
      window.localStorage = undefined;
      window.sessionStorage = undefined;
      delete window.localStorage;
      delete window.sessionStorage;
      
      // Prevent access to parent window
      window.parent = window;
      window.top = window;
      
      // Set up secure communication
      window.addEventListener('message', function(event) {
        if (event.data.type === 'execute') {
          try {
            // Create isolated execution context
            const result = (function() {
              const context = pluginAPI;
              return eval(event.data.code);
            })();
            
            parent.postMessage({
              type: 'execution-result',
              id: event.data.id,
              result: result
            }, '*');
          } catch (error) {
            parent.postMessage({
              type: 'execution-result',
              id: event.data.id,
              error: error.message
            }, '*');
          }
        }
      });
      
      // Signal ready
      parent.postMessage({ type: 'sandbox-ready' }, '*');
    `;
  }

  private createRestrictedAPI(): any {
    const restrictedAPI: any = {};

    // Add APIs based on permissions
    if (hasPermission(this.plugin, 'dom:read')) {
      restrictedAPI.dom = {
        querySelector: (selector: string) => {
          return this.createElementProxy(document.querySelector(selector));
        },
        querySelectorAll: (selector: string) => {
          return Array.from(document.querySelectorAll(selector))
            .map(el => this.createElementProxy(el));
        }
      };
    }

    if (hasPermission(this.plugin, 'theme:read')) {
      restrictedAPI.theme = {
        getTokens: () => this.context.getTokens(),
        getCurrentTheme: () => this.context.getTheme()
      };
    }

    if (hasPermission(this.plugin, 'theme:write')) {
      if (!restrictedAPI.theme) restrictedAPI.theme = {};
      restrictedAPI.theme.updateTokens = (updates: any) => {
        this.context.updateTokens(updates);
      };
    }

    if (hasPermission(this.plugin, 'api:call')) {
      restrictedAPI.api = {
        call: async (endpoint: string, options?: RequestInit) => {
          // Validate endpoint is allowed
          if (!this.isEndpointAllowed(endpoint)) {
            throw new Error(`Endpoint not allowed: ${endpoint}`);
          }
          return this.context.api.call(endpoint, options);
        }
      };
    }

    if (hasPermission(this.plugin, 'storage:local')) {
      restrictedAPI.storage = {
        local: this.context.storage.local
      };
    }

    if (hasPermission(this.plugin, 'storage:session')) {
      if (!restrictedAPI.storage) restrictedAPI.storage = {};
      restrictedAPI.storage.session = this.context.storage.session;
    }

    return restrictedAPI;
  }

  private createElementProxy(element: Element | null): any {
    if (!element) return null;

    // Create proxy that only allows safe operations
    return {
      tagName: element.tagName,
      className: element.className,
      id: element.id,
      textContent: element.textContent,
      innerHTML: hasPermission(this.plugin, 'dom:write') ? element.innerHTML : undefined,
      style: this.createStyleProxy(element as HTMLElement),
      getAttribute: (name: string) => element.getAttribute(name),
      setAttribute: hasPermission(this.plugin, 'dom:write') 
        ? (name: string, value: string) => element.setAttribute(name, value)
        : undefined,
      getBoundingClientRect: () => element.getBoundingClientRect(),
      querySelector: (selector: string) => this.createElementProxy(element.querySelector(selector)),
      querySelectorAll: (selector: string) => 
        Array.from(element.querySelectorAll(selector)).map(el => this.createElementProxy(el))
    };
  }

  private createStyleProxy(element: HTMLElement): any {
    if (!hasPermission(this.plugin, 'dom:write')) {
      return undefined;
    }

    return new Proxy(element.style, {
      set: (target, property, value) => {
        // Validate CSS property is safe
        if (this.isCSSPropertySafe(String(property))) {
          target[property as any] = value;
          return true;
        }
        return false;
      }
    });
  }

  private isCSSPropertySafe(property: string): boolean {
    const unsafeProperties = [
      'behavior', 'binding', 'expression', 
      'javascript', 'vbscript', 'mozbinding'
    ];
    
    return !unsafeProperties.some(unsafe => 
      property.toLowerCase().includes(unsafe)
    );
  }

  private isEndpointAllowed(endpoint: string): boolean {
    const allowedEndpoints = [
      '/api/tokens/update',
      '/api/themes/',
      '/api/upload/image',
      '/api/plugins/',
      '/api/collaboration/'
    ];

    return allowedEndpoints.some(allowed => endpoint.startsWith(allowed));
  }

  private getAllowedOrigins(): string {
    if (hasPermission(this.plugin, 'network:external')) {
      return "'self' https:";
    }
    return "'self'";
  }

  private setupMessageChannel(): void {
    this.messageHandler = (event: MessageEvent) => {
      if (event.source === this.iframe?.contentWindow) {
        if (event.data.type === 'sandbox-ready') {
          // Sandbox is ready for code execution
        }
        // Handle other sandbox messages
      }
    };

    window.addEventListener('message', this.messageHandler);
  }

  private async injectControlledAPIs(): Promise<void> {
    // Wait for iframe to load
    return new Promise((resolve) => {
      if (this.iframe) {
        this.iframe.onload = () => {
          // APIs are injected via the sandbox HTML
          resolve();
        };
      }
    });
  }

  private initializeAllowedAPIs(): void {
    // Define allowed API paths based on permissions
    const apiMappings: Record<PluginPermission, string[]> = {
      'dom:read': ['dom.querySelector', 'dom.querySelectorAll'],
      'dom:write': ['dom.setAttribute', 'dom.style'],
      'theme:read': ['theme.getTokens', 'theme.getCurrentTheme'],
      'theme:write': ['theme.updateTokens'],
      'api:call': ['api.call'],
      'storage:local': ['storage.local'],
      'storage:session': ['storage.session'],
      'network:external': ['api.call'],
      'file:upload': ['api.upload'],
      'component:create': ['components.create'],
      'collaboration:join': ['collaboration.join']
    };

    for (const permission of this.plugin.permissions) {
      const apis = apiMappings[permission];
      if (apis) {
        apis.forEach(api => this.allowedAPIs.add(api));
      }
    }
  }

  private wrapCodeWithSecurity(code: string): string {
    return `
      (function() {
        'use strict';
        
        // Prevent access to window and global objects
        var window = undefined;
        var document = undefined;
        var global = undefined;
        var globalThis = undefined;
        
        // Provide controlled context
        var context = arguments[0];
        
        ${code}
      })(pluginAPI);
    `;
  }

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Sandbox Manager for handling multiple plugin sandboxes
 */
export class SandboxManager {
  private sandboxes: Map<string, PluginSandbox> = new Map();

  /**
   * Create a new sandbox for a plugin
   */
  async createSandbox(
    plugin: PluginDefinition, 
    context: PluginContext
  ): Promise<PluginSandbox> {
    const sandbox = new PluginSandbox(plugin, context);
    await sandbox.initialize();
    this.sandboxes.set(plugin.id, sandbox);
    return sandbox;
  }

  /**
   * Get existing sandbox for a plugin
   */
  getSandbox(pluginId: string): PluginSandbox | null {
    return this.sandboxes.get(pluginId) || null;
  }

  /**
   * Remove and cleanup sandbox for a plugin
   */
  removeSandbox(pluginId: string): void {
    const sandbox = this.sandboxes.get(pluginId);
    if (sandbox) {
      sandbox.cleanup();
      this.sandboxes.delete(pluginId);
    }
  }

  /**
   * Cleanup all sandboxes
   */
  cleanup(): void {
    for (const sandbox of this.sandboxes.values()) {
      sandbox.cleanup();
    }
    this.sandboxes.clear();
  }

  /**
   * Security audit of all active sandboxes
   */
  auditSecurity(): { pluginId: string; isSecure: boolean; issues: string[] }[] {
    const results: { pluginId: string; isSecure: boolean; issues: string[] }[] = [];

    for (const [pluginId, sandbox] of this.sandboxes) {
      const issues: string[] = [];
      const isSecure = sandbox.isSecure();

      if (!isSecure) {
        issues.push('Sandbox is not properly isolated');
      }

      results.push({ pluginId, isSecure, issues });
    }

    return results;
  }
}

/**
 * Global sandbox manager instance
 */
let globalSandboxManager: SandboxManager | null = null;

export function getSandboxManager(): SandboxManager {
  if (!globalSandboxManager) {
    globalSandboxManager = new SandboxManager();
  }
  return globalSandboxManager;
}

export function shutdownSandboxManager(): void {
  if (globalSandboxManager) {
    globalSandboxManager.cleanup();
    globalSandboxManager = null;
  }
}