'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollaborativeUser, getCollaborationManager } from './CollaborationManager';

/**
 * User Presence Components - Real-time collaborative user indicators
 * Shows user cursors, selections, and activity indicators
 */

interface UserPresenceProps {
  maxVisibleUsers?: number;
  showCursors?: boolean;
  showSelections?: boolean;
  showUserList?: boolean;
}

export default function UserPresence({ 
  maxVisibleUsers = 8,
  showCursors = true,
  showSelections = true,
  showUserList = true
}: UserPresenceProps) {
  const [users, setUsers] = useState<CollaborativeUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CollaborativeUser | null>(null);
  const collaborationManager = getCollaborationManager();

  useEffect(() => {
    if (!collaborationManager) return;

    const updateUsers = () => {
      const connectedUsers = collaborationManager.getConnectedUsers();
      setUsers(connectedUsers);
    };

    // Set up event listeners
    collaborationManager.on('user-joined', updateUsers);
    collaborationManager.on('user-left', updateUsers);
    collaborationManager.on('user-updated', updateUsers);

    // Initial load
    updateUsers();

    return () => {
      if (collaborationManager) {
        collaborationManager.off('user-joined', updateUsers);
        collaborationManager.off('user-left', updateUsers);
        collaborationManager.off('user-updated', updateUsers);
      }
    };
  }, [collaborationManager]);

  const otherUsers = users.filter(user => user.id !== currentUser?.id);

  return (
    <>
      {/* User Cursors */}
      {showCursors && <UserCursors users={otherUsers} />}
      
      {/* User Selections */}
      {showSelections && <UserSelections users={otherUsers} />}
      
      {/* User List */}
      {showUserList && (
        <UserList 
          users={otherUsers} 
          maxVisible={maxVisibleUsers}
          currentUser={currentUser}
        />
      )}
    </>
  );
}

/**
 * User Cursors Component - Shows other users' cursors
 */
interface UserCursorsProps {
  users: CollaborativeUser[];
}

function UserCursors({ users }: UserCursorsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {users
          .filter(user => user.cursor)
          .map(user => (
            <UserCursor key={user.id} user={user} />
          ))}
      </AnimatePresence>
    </div>
  );
}

interface UserCursorProps {
  user: CollaborativeUser;
}

function UserCursor({ user }: UserCursorProps) {
  if (!user.cursor) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: user.cursor.x,
        y: user.cursor.y
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute pointer-events-none"
      style={{ left: 0, top: 0 }}
    >
      {/* Cursor Arrow */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ 
          filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
          transform: 'translate(-2px, -2px)'
        }}
      >
        <path
          d="M2 2L18 8L10 10L8 18L2 2Z"
          fill={user.color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      
      {/* User Name Label */}
      <div
        className="absolute top-5 left-2 px-2 py-1 text-xs font-medium text-white rounded shadow-lg whitespace-nowrap"
        style={{ backgroundColor: user.color }}
      >
        {user.name}
      </div>
    </motion.div>
  );
}

/**
 * User Selections Component - Shows other users' selections
 */
interface UserSelectionsProps {
  users: CollaborativeUser[];
}

function UserSelections({ users }: UserSelectionsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {users
          .filter(user => user.selection)
          .map(user => (
            <UserSelection key={user.id} user={user} />
          ))}
      </AnimatePresence>
    </div>
  );
}

interface UserSelectionProps {
  user: CollaborativeUser;
}

function UserSelection({ user }: UserSelectionProps) {
  if (!user.selection?.bounds) return null;

  const { bounds } = user.selection;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute pointer-events-none"
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        border: `2px solid ${user.color}`,
        borderRadius: '4px',
        backgroundColor: `${user.color}15`,
        boxShadow: `0 0 0 1px ${user.color}40`
      }}
    >
      {/* Selection Label */}
      <div
        className="absolute -top-6 left-0 px-2 py-1 text-xs font-medium text-white rounded shadow-lg whitespace-nowrap"
        style={{ backgroundColor: user.color }}
      >
        {user.name}
      </div>
    </motion.div>
  );
}

/**
 * User List Component - Shows list of connected users
 */
interface UserListProps {
  users: CollaborativeUser[];
  maxVisible: number;
  currentUser: CollaborativeUser | null;
}

function UserList({ users, maxVisible, currentUser }: UserListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleUsers = isExpanded ? users : users.slice(0, maxVisible);
  const hiddenCount = users.length - maxVisible;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            {users.length + 1} collaborator{users.length === 0 ? '' : 's'}
          </span>
        </div>

        <div className="space-y-2">
          {/* Current User */}
          {currentUser && (
            <UserAvatar 
              user={currentUser} 
              isCurrentUser={true}
            />
          )}

          {/* Other Users */}
          <AnimatePresence>
            {visibleUsers.map(user => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <UserAvatar user={user} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Show More Button */}
          {hiddenCount > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-xs text-gray-500 hover:text-gray-700 py-1 transition-colors"
            >
              {isExpanded ? 'Show less' : `+${hiddenCount} more`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * User Avatar Component
 */
interface UserAvatarProps {
  user: CollaborativeUser;
  isCurrentUser?: boolean;
}

function UserAvatar({ user, isCurrentUser = false }: UserAvatarProps) {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isActive = Date.now() - user.lastSeen < 10000; // Active within 10 seconds

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: user.color }}
          >
            {initials}
          </div>
        )}
        
        {/* Activity Indicator */}
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
            isActive ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {user.name}
          {isCurrentUser && (
            <span className="ml-1 text-xs text-gray-500">(you)</span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {isActive ? 'Active now' : 'Away'}
        </div>
      </div>
    </div>
  );
}

/**
 * Collaboration Panel Component - Full collaboration controls
 */
interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
}

export function CollaborationPanel({ isOpen, onClose, roomId }: CollaborationPanelProps) {
  const [users, setUsers] = useState<CollaborativeUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const collaborationManager = getCollaborationManager();

  useEffect(() => {
    if (!collaborationManager) return;

    const updateUsers = () => {
      const connectedUsers = collaborationManager.getConnectedUsers();
      setUsers(connectedUsers);
    };

    const handleConnectionStatus = (event: any) => {
      setIsConnected(event.connected);
      setConnectionStatus(event.connected ? 'connected' : 'disconnected');
    };

    // Set up event listeners
    collaborationManager.on('user-joined', updateUsers);
    collaborationManager.on('user-left', updateUsers);
    collaborationManager.on('user-updated', updateUsers);
    collaborationManager.on('connection-status', handleConnectionStatus);

    // Initial load
    updateUsers();
    setIsConnected(collaborationManager.isActive());

    return () => {
      if (collaborationManager) {
        collaborationManager.off('user-joined', updateUsers);
        collaborationManager.off('user-left', updateUsers);
        collaborationManager.off('user-updated', updateUsers);
        collaborationManager.off('connection-status', handleConnectionStatus);
      }
    };
  }, [collaborationManager]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-[90%] max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Collaboration</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                  'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600 capitalize">
                  {connectionStatus}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Room Info */}
            {roomId && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Room ID</div>
                <div className="text-sm text-gray-600 font-mono break-all">{roomId}</div>
              </div>
            )}

            {/* Connected Users */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Connected Users ({users.length})
              </h3>
              
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">👥</div>
                  <p>No other users connected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">
                          Last seen: {formatLastSeen(user.lastSeen)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => copyRoomLink(roomId)}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                Copy Room Link
              </button>
              
              <button
                onClick={handleLeaveRoom}
                className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
              >
                Leave Room
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Utility functions
 */
function formatLastSeen(timestamp: number): string {
  const diff = Date.now() - timestamp;
  
  if (diff < 10000) return 'Just now';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  
  return new Date(timestamp).toLocaleTimeString();
}

function copyRoomLink(roomId?: string): void {
  if (!roomId) return;
  
  const url = new URL(window.location.href);
  url.searchParams.set('room', roomId);
  
  navigator.clipboard.writeText(url.toString()).then(() => {
    // Show toast notification
    showNotification('Room link copied to clipboard!');
  });
}

function handleLeaveRoom(): void {
  const collaborationManager = getCollaborationManager();
  if (collaborationManager) {
    collaborationManager.disconnect();
  }
  
  // Remove room parameter from URL
  const url = new URL(window.location.href);
  url.searchParams.delete('room');
  window.history.replaceState({}, '', url.toString());
  
  showNotification('Left collaboration room');
}

function showNotification(message: string): void {
  // Simple notification - in a real app you'd use a toast library
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: #4caf50;
    color: white; padding: 12px 20px; border-radius: 4px; z-index: 10001;
    font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Hook for mouse tracking
 */
export function useMouseTracking(): void {
  const collaborationManager = getCollaborationManager();

  useEffect(() => {
    if (!collaborationManager || !collaborationManager.isActive()) return;

    let lastUpdate = 0;
    const throttleMs = 50; // Update cursor position every 50ms

    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleMs) return;
      
      lastUpdate = now;
      collaborationManager.updateCursor(event.clientX, event.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [collaborationManager]);
}