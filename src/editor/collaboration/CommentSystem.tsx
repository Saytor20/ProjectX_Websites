'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollaborativeUser, getCollaborationManager } from './CollaborationManager';

/**
 * Comment System - Collaborative feedback and annotation system
 * Provides contextual commenting, threads, mentions, and resolution workflow
 */

export interface Comment {
  id: string;
  elementId?: string; // Element the comment is attached to
  position?: { x: number; y: number }; // Screen position for floating comments
  content: string;
  author: CollaborativeUser;
  timestamp: number;
  replies: CommentReply[];
  mentions: string[]; // User IDs mentioned in the comment
  status: 'open' | 'resolved' | 'archived';
  tags?: string[];
  attachments?: CommentAttachment[];
  editHistory?: CommentEdit[];
}

export interface CommentReply {
  id: string;
  content: string;
  author: CollaborativeUser;
  timestamp: number;
  mentions: string[];
  editHistory?: CommentEdit[];
}

export interface CommentAttachment {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'file';
  size: number;
}

export interface CommentEdit {
  timestamp: number;
  previousContent: string;
  editor: CollaborativeUser;
}

interface CommentSystemProps {
  isOpen: boolean;
  onClose?: () => void;
  selectedElementId?: string;
  currentUser: CollaborativeUser;
}

interface CommentThreadProps {
  comment: Comment;
  currentUser: CollaborativeUser;
  onReply: (commentId: string, content: string, mentions: string[]) => void;
  onResolve: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (commentId: string) => void;
}

interface CommentFormProps {
  onSubmit: (content: string, mentions: string[], tags: string[]) => void;
  onCancel?: () => void;
  placeholder?: string;
  currentUser: CollaborativeUser;
  elementId?: string;
  isReply?: boolean;
}

export default function CommentSystem({ 
  isOpen, 
  onClose, 
  selectedElementId, 
  currentUser 
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'mine'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'element'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  const [collapsedThreads, setCollapsedThreads] = useState<Set<string>>(new Set());
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const collaborationManager = getCollaborationManager();

  // Load comments from collaboration system
  useEffect(() => {
    loadComments();
    
    if (collaborationManager) {
      // Listen for new comments from other users
      collaborationManager.on('document-updated', (event) => {
        if (event.type === 'comments') {
          loadComments();
        }
      });
    }
  }, [collaborationManager]);

  // Auto-show form when element is selected
  useEffect(() => {
    if (selectedElementId && isOpen) {
      setShowNewCommentForm(true);
    }
  }, [selectedElementId, isOpen]);

  const loadComments = () => {
    // In a real implementation, this would load from the collaboration system
    const mockComments: Comment[] = [
      {
        id: 'comment-1',
        elementId: 'navbar-1',
        content: 'The navbar height seems too tall for mobile. Can we reduce it to 56px?',
        author: {
          id: 'user-1',
          name: 'Sarah Wilson',
          color: '#FF6B6B',
          lastSeen: Date.now() - 300000
        },
        timestamp: Date.now() - 3600000,
        replies: [
          {
            id: 'reply-1',
            content: 'Good catch! I\'ll update the mobile breakpoint.',
            author: {
              id: 'user-2',
              name: 'Mike Chen',
              color: '#4ECDC4',
              lastSeen: Date.now() - 60000
            },
            timestamp: Date.now() - 3000000,
            mentions: ['user-1']
          }
        ],
        mentions: [],
        status: 'resolved',
        tags: ['mobile', 'navbar']
      },
      {
        id: 'comment-2',
        elementId: 'hero-1',
        content: 'The hero image looks great! Maybe we could add a subtle overlay to improve text readability?',
        author: {
          id: 'user-3',
          name: 'Alex Rodriguez',
          color: '#45B7D1',
          lastSeen: Date.now() - 120000
        },
        timestamp: Date.now() - 1800000,
        replies: [],
        mentions: [],
        status: 'open',
        tags: ['hero', 'design']
      }
    ];
    
    setComments(mockComments);
  };

  const handleAddComment = (content: string, mentions: string[], tags: string[]) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      elementId: selectedElementId,
      content,
      author: currentUser,
      timestamp: Date.now(),
      replies: [],
      mentions,
      status: 'open',
      tags
    };

    setComments(prev => [newComment, ...prev]);
    setShowNewCommentForm(false);

    // Send to collaboration system
    if (collaborationManager) {
      collaborationManager.updateEditorState({
        comments: [newComment, ...comments]
      });
    }
  };

  const handleReply = (commentId: string, content: string, mentions: string[]) => {
    const reply: CommentReply = {
      id: `reply-${Date.now()}`,
      content,
      author: currentUser,
      timestamp: Date.now(),
      mentions
    };

    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));
  };

  const handleResolve = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: comment.status === 'resolved' ? 'open' : 'resolved' }
        : comment
    ));
  };

  const handleEdit = (commentId: string, newContent: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const edit: CommentEdit = {
          timestamp: Date.now(),
          previousContent: comment.content,
          editor: currentUser
        };
        
        return {
          ...comment,
          content: newContent,
          editHistory: [...(comment.editHistory || []), edit]
        };
      }
      return comment;
    }));
  };

  const handleDelete = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const toggleThreadCollapse = (commentId: string) => {
    setCollapsedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Filter and sort comments
  const filteredComments = comments
    .filter(comment => {
      // Filter by status
      if (filter === 'open' && comment.status !== 'open') return false;
      if (filter === 'resolved' && comment.status !== 'resolved') return false;
      if (filter === 'mine' && comment.author.id !== currentUser.id) return false;
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return comment.content.toLowerCase().includes(query) ||
               comment.author.name.toLowerCase().includes(query) ||
               comment.tags?.some(tag => tag.toLowerCase().includes(query));
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'element':
          return (a.elementId || '').localeCompare(b.elementId || '');
        default:
          return 0;
      }
    });

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-4 bottom-4 w-96 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
          <p className="text-sm text-gray-500">
            {comments.length} comment{comments.length === 1 ? '' : 's'}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-b space-y-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search comments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filters and Sort */}
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="all">All Comments</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="mine">My Comments</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="element">By Element</option>
          </select>
        </div>

        {/* Add Comment Button */}
        <button
          onClick={() => setShowNewCommentForm(true)}
          className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto">
        {/* New Comment Form */}
        {showNewCommentForm && (
          <div className="p-4 border-b bg-gray-50">
            <CommentForm
              onSubmit={handleAddComment}
              onCancel={() => setShowNewCommentForm(false)}
              placeholder={selectedElementId ? 
                `Add comment to selected element...` : 
                'Add a general comment...'
              }
              currentUser={currentUser}
              elementId={selectedElementId}
            />
          </div>
        )}

        {/* Comment Threads */}
        <div className="space-y-0">
          <AnimatePresence>
            {filteredComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CommentThread
                  comment={comment}
                  currentUser={currentUser}
                  onReply={handleReply}
                  onResolve={handleResolve}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isCollapsed={collapsedThreads.has(comment.id)}
                  onToggleCollapse={toggleThreadCollapse}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredComments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-sm">No comments found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-blue-600 hover:text-blue-700 mt-1"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Comment Thread Component
 */
function CommentThread({ 
  comment, 
  currentUser, 
  onReply, 
  onResolve, 
  onEdit, 
  onDelete,
  isCollapsed,
  onToggleCollapse
}: CommentThreadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEdit = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  const handleReply = (content: string, mentions: string[]) => {
    onReply(comment.id, content, mentions);
    setShowReplyForm(false);
  };

  const canEdit = comment.author.id === currentUser.id;
  const canDelete = comment.author.id === currentUser.id;

  return (
    <div className={`border-b border-gray-100 ${
      comment.status === 'resolved' ? 'bg-green-50' : ''
    }`}>
      <div className="p-4">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserAvatar user={comment.author} size="sm" />
            <div>
              <span className="text-sm font-medium text-gray-900">
                {comment.author.name}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {comment.elementId && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Element
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded ${
              comment.status === 'resolved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {comment.status}
            </span>
          </div>
        </div>

        {/* Comment Content */}
        <div className="mb-3">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-900 whitespace-pre-wrap">
              {comment.content}
            </div>
          )}
        </div>

        {/* Comment Tags */}
        {comment.tags && comment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {comment.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comment Actions */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setShowReplyForm(true)}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            Reply
          </button>
          
          <button
            onClick={() => onResolve(comment.id)}
            className={`transition-colors ${
              comment.status === 'resolved'
                ? 'text-green-600 hover:text-green-700'
                : 'text-gray-500 hover:text-green-600'
            }`}
          >
            {comment.status === 'resolved' ? 'Reopen' : 'Resolve'}
          </button>

          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Edit
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          )}

          {comment.replies.length > 0 && onToggleCollapse && (
            <button
              onClick={() => onToggleCollapse(comment.id)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {isCollapsed ? 'Show' : 'Hide'} {comment.replies.length} repl{comment.replies.length === 1 ? 'y' : 'ies'}
            </button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <CommentForm
              onSubmit={handleReply}
              onCancel={() => setShowReplyForm(false)}
              placeholder="Write a reply..."
              currentUser={currentUser}
              isReply={true}
            />
          </div>
        )}

        {/* Replies */}
        {comment.replies.length > 0 && !isCollapsed && (
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="pl-4 border-l-2 border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <UserAvatar user={reply.author} size="xs" />
                  <span className="text-sm font-medium text-gray-900">
                    {reply.author.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(reply.timestamp)}
                  </span>
                </div>
                <div className="text-sm text-gray-900 whitespace-pre-wrap">
                  {reply.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Comment Form Component
 */
function CommentForm({ 
  onSubmit, 
  onCancel, 
  placeholder = 'Write a comment...', 
  currentUser,
  elementId,
  isReply = false
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [mentions, setMentions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim(), mentions, tags);
      setContent('');
      setMentions([]);
      setTags([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  // Parse mentions and tags from content
  useEffect(() => {
    const mentionMatches = content.match(/@\w+/g) || [];
    const tagMatches = content.match(/#\w+/g) || [];
    
    setMentions(mentionMatches.map(m => m.slice(1)));
    setTags(tagMatches.map(t => t.slice(1)));
  }, [content]);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start gap-2">
        <UserAvatar user={currentUser} size="sm" />
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={isReply ? 2 : 3}
          />
          
          {/* Mention/Tag hints */}
          <div className="text-xs text-gray-500 mt-1">
            Use @ to mention users, # for tags. {!isReply && 'Cmd/Ctrl + Enter to submit.'}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isReply ? 'Reply' : 'Comment'}
        </button>
      </div>
    </form>
  );
}

/**
 * User Avatar Component
 */
interface UserAvatarProps {
  user: CollaborativeUser;
  size?: 'xs' | 'sm' | 'md';
}

function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm'
  };

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: user.color }}
      title={user.name}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

/**
 * Floating Comment Indicators - Shows comment indicators on elements
 */
interface FloatingCommentIndicatorsProps {
  comments: Comment[];
  onCommentClick: (comment: Comment) => void;
}

export function FloatingCommentIndicators({ 
  comments, 
  onCommentClick 
}: FloatingCommentIndicatorsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {comments
        .filter(comment => comment.elementId && comment.status === 'open')
        .map(comment => {
          const element = document.querySelector(`[data-element-id="${comment.elementId}"]`);
          if (!element) return null;

          const rect = element.getBoundingClientRect();
          
          return (
            <motion.div
              key={comment.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute pointer-events-auto"
              style={{
                left: rect.right + 8,
                top: rect.top + 8
              }}
            >
              <button
                onClick={() => onCommentClick(comment)}
                className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg hover:bg-blue-600 transition-colors"
                title={`${comment.replies.length + 1} comment${comment.replies.length === 0 ? '' : 's'}`}
              >
                {comment.replies.length + 1}
              </button>
            </motion.div>
          );
        })}
    </div>
  );
}

/**
 * Utility functions
 */
function formatTimestamp(timestamp: number): string {
  const diff = Date.now() - timestamp;
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}