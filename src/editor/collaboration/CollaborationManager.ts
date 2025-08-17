import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import { EditorState, EditorAction } from '../types';

/**
 * Collaboration Manager - Real-time collaboration using Yjs
 * Handles document synchronization, conflict resolution, and user presence
 */

export interface CollaborativeUser {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  selection?: { elementId: string; bounds: DOMRect };
  lastSeen: number;
}

export interface CollaborationConfig {
  roomId: string;
  userId: string;
  userName: string;
  userColor: string;
  websocketUrl?: string;
  enableWebRTC?: boolean;
  enablePersistence?: boolean;
  signaling?: string[];
}

export interface CollaborationUpdate {
  type: 'document' | 'presence' | 'selection' | 'cursor';
  userId: string;
  timestamp: number;
  data: any;
}

export type CollaborationEventType = 
  | 'user-joined'
  | 'user-left'
  | 'user-updated'
  | 'document-updated'
  | 'selection-changed'
  | 'cursor-moved'
  | 'conflict-resolved'
  | 'connection-status'
  | 'sync-completed';

export interface CollaborationEvent {
  type: CollaborationEventType;
  user?: CollaborativeUser;
  data?: any;
  timestamp: number;
}

export type CollaborationEventListener = (event: CollaborationEvent) => void;

export class CollaborationManager {
  private ydoc: Y.Doc;
  private providers: (WebsocketProvider | WebrtcProvider | IndexeddbPersistence)[] = [];
  private eventListeners: Map<CollaborationEventType, CollaborationEventListener[]> = new Map();
  private currentUser: CollaborativeUser;
  private users: Map<string, CollaborativeUser> = new Map();
  private isConnected = false;
  private config: CollaborationConfig;
  private awarenessUpdateHandler: (update: any) => void;
  private documentUpdateHandler: (update: Uint8Array, origin: any) => void;

  // Shared Yjs types
  private editorState: Y.Map<any>;
  private components: Y.Array<any>;
  private theme: Y.Map<any>;
  private selection: Y.Map<any>;
  private presence: Y.Map<any>;

  constructor(config: CollaborationConfig) {
    this.config = config;
    this.ydoc = new Y.Doc();
    
    // Initialize shared types
    this.editorState = this.ydoc.getMap('editorState');
    this.components = this.ydoc.getArray('components');
    this.theme = this.ydoc.getMap('theme');
    this.selection = this.ydoc.getMap('selection');
    this.presence = this.ydoc.getMap('presence');

    // Set up current user
    this.currentUser = {
      id: config.userId,
      name: config.userName,
      color: config.userColor,
      lastSeen: Date.now()
    };

    // Set up event handlers
    this.awarenessUpdateHandler = this.handleAwarenessUpdate.bind(this);
    this.documentUpdateHandler = this.handleDocumentUpdate.bind(this);

    this.setupEventListeners();
  }

  /**
   * Connect to collaboration session
   */
  async connect(): Promise<void> {
    try {
      // Set up WebSocket provider if URL provided
      if (this.config.websocketUrl) {
        const wsProvider = new WebsocketProvider(
          this.config.websocketUrl,
          this.config.roomId,
          this.ydoc
        );
        this.providers.push(wsProvider);

        // Set up awareness for user presence
        wsProvider.awareness.setLocalState({
          user: this.currentUser,
          timestamp: Date.now()
        });

        wsProvider.awareness.on('update', this.awarenessUpdateHandler);
        
        wsProvider.on('status', (event: any) => {
          this.isConnected = event.status === 'connected';
          this.emit('connection-status', { connected: this.isConnected });
        });
      }

      // Set up WebRTC provider for peer-to-peer connection
      if (this.config.enableWebRTC) {
        const webrtcProvider = new WebrtcProvider(
          this.config.roomId,
          this.ydoc,
          {
            signaling: this.config.signaling || ['wss://signaling.yjs.dev']
          }
        );
        this.providers.push(webrtcProvider);

        webrtcProvider.awareness.setLocalState({
          user: this.currentUser,
          timestamp: Date.now()
        });

        webrtcProvider.awareness.on('update', this.awarenessUpdateHandler);
      }

      // Set up IndexedDB persistence
      if (this.config.enablePersistence) {
        const persistence = new IndexeddbPersistence(this.config.roomId, this.ydoc);
        this.providers.push(persistence);

        persistence.on('synced', () => {
          this.emit('sync-completed', { source: 'indexeddb' });
        });
      }

      // Add current user to presence
      this.updateUserPresence(this.currentUser);

      this.emit('user-joined', { user: this.currentUser });

    } catch (error) {
      console.error('Failed to connect to collaboration session:', error);
      throw error;
    }
  }

  /**
   * Disconnect from collaboration session
   */
  async disconnect(): Promise<void> {
    // Remove user from presence
    this.presence.delete(this.currentUser.id);

    // Disconnect all providers
    for (const provider of this.providers) {
      if (provider instanceof WebsocketProvider || provider instanceof WebrtcProvider) {
        provider.awareness.off('update', this.awarenessUpdateHandler);
        provider.disconnect();
      } else if (provider instanceof IndexeddbPersistence) {
        provider.destroy();
      }
    }

    this.providers = [];
    this.users.clear();
    this.isConnected = false;

    this.emit('user-left', { user: this.currentUser });
  }

  /**
   * Update editor state in collaborative document
   */
  updateEditorState(updates: Partial<EditorState>): void {
    this.ydoc.transact(() => {
      Object.entries(updates).forEach(([key, value]) => {
        this.editorState.set(key, value);
      });
    });

    this.emit('document-updated', { 
      type: 'editor-state', 
      updates,
      user: this.currentUser 
    });
  }

  /**
   * Update theme in collaborative document
   */
  updateTheme(themeUpdates: any): void {
    this.ydoc.transact(() => {
      Object.entries(themeUpdates).forEach(([key, value]) => {
        this.theme.set(key, value);
      });
    });

    this.emit('document-updated', { 
      type: 'theme', 
      updates: themeUpdates,
      user: this.currentUser 
    });
  }

  /**
   * Update components in collaborative document
   */
  updateComponents(componentUpdates: any[]): void {
    this.ydoc.transact(() => {
      this.components.delete(0, this.components.length);
      this.components.insert(0, componentUpdates);
    });

    this.emit('document-updated', { 
      type: 'components', 
      updates: componentUpdates,
      user: this.currentUser 
    });
  }

  /**
   * Update user selection
   */
  updateSelection(elementIds: string[], bounds?: DOMRect): void {
    const selectionData = {
      userId: this.currentUser.id,
      elementIds,
      bounds: bounds ? {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height
      } : null,
      timestamp: Date.now()
    };

    this.selection.set(this.currentUser.id, selectionData);

    // Update user presence with selection
    const updatedUser = {
      ...this.currentUser,
      selection: bounds ? { elementId: elementIds[0] || '', bounds } : undefined
    };

    this.updateUserPresence(updatedUser);
    this.emit('selection-changed', { user: updatedUser, elementIds, bounds });
  }

  /**
   * Update cursor position
   */
  updateCursor(x: number, y: number): void {
    const updatedUser = {
      ...this.currentUser,
      cursor: { x, y },
      lastSeen: Date.now()
    };

    this.updateUserPresence(updatedUser);
    this.emit('cursor-moved', { user: updatedUser });
  }

  /**
   * Get current collaborative document state
   */
  getCollaborativeState(): {
    editorState: any;
    theme: any;
    components: any[];
    selection: Map<string, any>;
    users: CollaborativeUser[];
  } {
    return {
      editorState: this.editorState.toJSON(),
      theme: this.theme.toJSON(),
      components: this.components.toArray(),
      selection: new Map(this.selection.entries()),
      users: Array.from(this.users.values())
    };
  }

  /**
   * Get list of connected users
   */
  getConnectedUsers(): CollaborativeUser[] {
    return Array.from(this.users.values()).filter(user => 
      Date.now() - user.lastSeen < 30000 // Active within last 30 seconds
    );
  }

  /**
   * Check if collaboration is active
   */
  isActive(): boolean {
    return this.isConnected && this.providers.length > 0;
  }

  /**
   * Apply collaborative updates to local editor state
   */
  applyCollaborativeUpdates(dispatch: (action: EditorAction) => void): void {
    // Listen for editor state changes
    this.editorState.observe((event: Y.YMapEvent<any>) => {
      const updates: Record<string, any> = {};
      
      event.changes.keys.forEach((change, key) => {
        if (change.action === 'add' || change.action === 'update') {
          updates[key] = this.editorState.get(key);
        }
      });

      if (Object.keys(updates).length > 0) {
        dispatch({ type: 'APPLY_COLLABORATIVE_UPDATE', payload: updates });
      }
    });

    // Listen for theme changes
    this.theme.observe((event: Y.YMapEvent<any>) => {
      const updates: Record<string, any> = {};
      
      event.changes.keys.forEach((change, key) => {
        if (change.action === 'add' || change.action === 'update') {
          updates[key] = this.theme.get(key);
        }
      });

      if (Object.keys(updates).length > 0) {
        dispatch({ type: 'UPDATE_THEME_COLLABORATIVE', payload: updates });
      }
    });

    // Listen for component changes
    this.components.observe((event: Y.YArrayEvent<any>) => {
      const components = this.components.toArray();
      dispatch({ type: 'UPDATE_COMPONENTS_COLLABORATIVE', payload: components });
    });

    // Listen for selection changes
    this.selection.observe((event: Y.YMapEvent<any>) => {
      const selections: Record<string, any> = {};
      
      event.changes.keys.forEach((change, key) => {
        if (change.action === 'add' || change.action === 'update') {
          selections[key] = this.selection.get(key);
        } else if (change.action === 'delete') {
          selections[key] = null;
        }
      });

      dispatch({ type: 'UPDATE_COLLABORATIVE_SELECTIONS', payload: selections });
    });
  }

  /**
   * Event system
   */
  on(eventType: CollaborationEventType, listener: CollaborationEventListener): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }

  off(eventType: CollaborationEventType, listener: CollaborationEventListener): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(eventType: CollaborationEventType, data?: any): void {
    const event: CollaborationEvent = {
      type: eventType,
      timestamp: Date.now(),
      ...data
    };

    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in collaboration event listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Private helper methods
   */
  private setupEventListeners(): void {
    // Listen for document updates
    this.ydoc.on('update', this.documentUpdateHandler);

    // Listen for undo/redo events
    this.ydoc.on('afterTransaction', (transaction: Y.Transaction) => {
      if (transaction.origin !== this.currentUser.id) {
        // Handle conflict resolution
        this.handleConflictResolution(transaction);
      }
    });
  }

  private handleAwarenessUpdate(update: any): void {
    const awareness = update.awareness || update;
    
    awareness.getStates().forEach((state: any, clientId: number) => {
      if (state.user && state.user.id !== this.currentUser.id) {
        const user: CollaborativeUser = {
          ...state.user,
          lastSeen: state.timestamp || Date.now()
        };

        const existingUser = this.users.get(user.id);
        if (!existingUser) {
          this.users.set(user.id, user);
          this.emit('user-joined', { user });
        } else {
          this.users.set(user.id, user);
          this.emit('user-updated', { user });
        }
      }
    });

    // Remove disconnected users
    this.users.forEach((user, userId) => {
      if (Date.now() - user.lastSeen > 60000) { // 1 minute timeout
        this.users.delete(userId);
        this.emit('user-left', { user });
      }
    });
  }

  private handleDocumentUpdate(update: Uint8Array, origin: any): void {
    if (origin !== this.currentUser.id) {
      this.emit('document-updated', {
        type: 'remote-update',
        origin,
        update: Array.from(update)
      });
    }
  }

  private handleConflictResolution(transaction: Y.Transaction): void {
    // Log conflicts for debugging
    if (transaction.changed.size > 0) {
      console.log('Conflict resolved:', {
        changes: Array.from(transaction.changed.keys()).map(item => item.constructor.name),
        origin: transaction.origin
      });

      this.emit('conflict-resolved', {
        transaction: {
          changes: Array.from(transaction.changed.keys()).length,
          origin: transaction.origin
        }
      });
    }
  }

  private updateUserPresence(user: CollaborativeUser): void {
    this.currentUser = user;
    this.users.set(user.id, user);

    this.presence.set(user.id, {
      ...user,
      timestamp: Date.now()
    });

    // Update awareness for all providers
    this.providers.forEach(provider => {
      if (provider instanceof WebsocketProvider || provider instanceof WebrtcProvider) {
        provider.awareness.setLocalState({
          user,
          timestamp: Date.now()
        });
      }
    });
  }

  /**
   * Cleanup and destroy
   */
  destroy(): void {
    this.disconnect();
    this.ydoc.off('update', this.documentUpdateHandler);
    this.ydoc.destroy();
    this.eventListeners.clear();
    this.users.clear();
  }
}

/**
 * Collaboration utilities
 */
export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateUserColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function createCollaborationConfig(
  roomId: string,
  options: Partial<CollaborationConfig> = {}
): CollaborationConfig {
  return {
    roomId,
    userId: options.userId || generateUserId(),
    userName: options.userName || 'Anonymous User',
    userColor: options.userColor || generateUserColor(),
    websocketUrl: options.websocketUrl || process.env.NEXT_PUBLIC_COLLABORATION_WS_URL,
    enableWebRTC: options.enableWebRTC ?? true,
    enablePersistence: options.enablePersistence ?? true,
    signaling: options.signaling || ['wss://signaling.yjs.dev'],
    ...options
  };
}

/**
 * Global collaboration manager instance
 */
let globalCollaborationManager: CollaborationManager | null = null;

export function getCollaborationManager(): CollaborationManager | null {
  return globalCollaborationManager;
}

export function initializeCollaboration(config: CollaborationConfig): CollaborationManager {
  if (globalCollaborationManager) {
    globalCollaborationManager.destroy();
  }
  
  globalCollaborationManager = new CollaborationManager(config);
  return globalCollaborationManager;
}

export function shutdownCollaboration(): void {
  if (globalCollaborationManager) {
    globalCollaborationManager.destroy();
    globalCollaborationManager = null;
  }
}