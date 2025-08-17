import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Comments API - Collaborative feedback and annotation system
 * Provides endpoints for comment creation, threading, and management
 */

// Validation schemas
const CreateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  elementId: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }).optional(),
  mentions: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  parentId: z.string().optional(), // For replies
  attachments: z.array(z.object({
    filename: z.string(),
    url: z.string().url(),
    type: z.enum(['image', 'file']),
    size: z.number()
  })).default([])
});

const UpdateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  mentions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
});

const CommentFilterSchema = z.object({
  status: z.enum(['all', 'open', 'resolved', 'archived']).default('all'),
  elementId: z.string().optional(),
  authorId: z.string().optional(),
  mentions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(['newest', 'oldest', 'element', 'replies']).default('newest')
});

// Comment data structure
interface Comment {
  id: string;
  content: string;
  elementId?: string;
  position?: { x: number; y: number };
  author: {
    id: string;
    name: string;
    avatar?: string;
    color: string;
  };
  mentions: string[];
  tags: string[];
  status: 'open' | 'resolved' | 'archived';
  parentId?: string; // For threading
  replies: string[]; // Comment IDs of replies
  attachments: Array<{
    id: string;
    filename: string;
    url: string;
    type: 'image' | 'file';
    size: number;
  }>;
  editHistory: Array<{
    timestamp: number;
    previousContent: string;
    editor: {
      id: string;
      name: string;
    };
  }>;
  reactions: Map<string, string[]>; // emoji -> user IDs
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  resolvedBy?: {
    id: string;
    name: string;
  };
}

// Mock comment storage (in production, this would be a database)
const commentsStore = new Map<string, Comment>();
const elementComments = new Map<string, Set<string>>(); // elementId -> comment IDs
const userComments = new Map<string, Set<string>>(); // userId -> comment IDs
const commentThreads = new Map<string, Set<string>>(); // parentId -> reply IDs

// Comment statistics and analytics
const commentStats = {
  totalComments: 0,
  openComments: 0,
  resolvedComments: 0,
  archivedComments: 0,
  totalReplies: 0,
  avgResolutionTime: 0
};

function getUserId(request: NextRequest): string {
  // In production, extract from authentication
  return request.headers.get('x-user-id') || 'anonymous';
}

function getUserInfo(userId: string) {
  // In production, fetch from user service
  const userColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
  return {
    id: userId,
    name: userId === 'anonymous' ? 'Anonymous User' : `User ${userId.slice(-4)}`,
    color: userColors[userId.length % userColors.length]
  };
}

function generateCommentId(): string {
  return `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateAttachmentId(): string {
  return `attachment_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function updateCommentStats() {
  const comments = Array.from(commentsStore.values());
  commentStats.totalComments = comments.length;
  commentStats.openComments = comments.filter(c => c.status === 'open').length;
  commentStats.resolvedComments = comments.filter(c => c.status === 'resolved').length;
  commentStats.archivedComments = comments.filter(c => c.status === 'archived').length;
  commentStats.totalReplies = comments.filter(c => c.parentId).length;
  
  // Calculate average resolution time
  const resolvedComments = comments.filter(c => c.status === 'resolved' && c.resolvedAt);
  if (resolvedComments.length > 0) {
    const totalResolutionTime = resolvedComments.reduce((sum, comment) => {
      return sum + (comment.resolvedAt! - comment.createdAt);
    }, 0);
    commentStats.avgResolutionTime = totalResolutionTime / resolvedComments.length;
  }
}

// Initialize with sample comments
function initializeSampleComments() {
  if (commentsStore.size > 0) return;

  const sampleComments: Partial<Comment>[] = [
    {
      id: 'comment-1',
      content: 'The navbar height seems too tall for mobile devices. Could we reduce it to 56px?',
      elementId: 'navbar-1',
      author: getUserInfo('user-1'),
      mentions: [],
      tags: ['mobile', 'navbar', 'height'],
      status: 'open',
      replies: ['comment-2'],
      attachments: [],
      editHistory: [],
      reactions: new Map(),
      createdAt: Date.now() - 3600000, // 1 hour ago
      updatedAt: Date.now() - 3600000
    },
    {
      id: 'comment-2',
      content: 'Good catch! I\'ll update the mobile breakpoint styles for the navbar.',
      parentId: 'comment-1',
      author: getUserInfo('user-2'),
      mentions: ['user-1'],
      tags: ['mobile', 'fix'],
      status: 'open',
      replies: [],
      attachments: [],
      editHistory: [],
      reactions: new Map([['👍', ['user-1']]]),
      createdAt: Date.now() - 3000000, // 50 minutes ago
      updatedAt: Date.now() - 3000000
    },
    {
      id: 'comment-3',
      content: 'The hero image looks great! Maybe we could add a subtle overlay to improve text readability?',
      elementId: 'hero-1',
      author: getUserInfo('user-3'),
      mentions: [],
      tags: ['hero', 'design', 'accessibility'],
      status: 'resolved',
      replies: [],
      attachments: [],
      editHistory: [],
      reactions: new Map([['❤️', ['user-1', 'user-2']]]),
      createdAt: Date.now() - 1800000, // 30 minutes ago
      updatedAt: Date.now() - 900000, // 15 minutes ago
      resolvedAt: Date.now() - 900000,
      resolvedBy: getUserInfo('user-1')
    }
  ];

  sampleComments.forEach(commentData => {
    const comment = commentData as Comment;
    commentsStore.set(comment.id, comment);
    
    // Update indexes
    if (comment.elementId) {
      if (!elementComments.has(comment.elementId)) {
        elementComments.set(comment.elementId, new Set());
      }
      elementComments.get(comment.elementId)!.add(comment.id);
    }
    
    if (!userComments.has(comment.author.id)) {
      userComments.set(comment.author.id, new Set());
    }
    userComments.get(comment.author.id)!.add(comment.id);
    
    if (comment.parentId) {
      if (!commentThreads.has(comment.parentId)) {
        commentThreads.set(comment.parentId, new Set());
      }
      commentThreads.get(comment.parentId)!.add(comment.id);
    }
  });

  updateCommentStats();
}

// GET /api/comments - List comments with filtering
export async function GET(request: NextRequest) {
  try {
    initializeSampleComments();
    
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    
    if (commentId) {
      // Get specific comment with replies
      const comment = commentsStore.get(commentId);
      if (!comment) {
        return NextResponse.json(
          { error: 'Comment not found' },
          { status: 404 }
        );
      }

      // Get replies
      const replies = comment.replies.map(replyId => commentsStore.get(replyId)).filter(Boolean);

      return NextResponse.json({
        comment: {
          ...comment,
          reactions: Object.fromEntries(comment.reactions)
        },
        replies: replies.map(reply => ({
          ...reply!,
          reactions: Object.fromEntries(reply!.reactions)
        }))
      });
    } else {
      // List comments with filters
      const filters = CommentFilterSchema.parse({
        status: searchParams.get('status') || 'all',
        elementId: searchParams.get('elementId'),
        authorId: searchParams.get('authorId'),
        mentions: searchParams.get('mentions')?.split(',').filter(Boolean),
        tags: searchParams.get('tags')?.split(',').filter(Boolean),
        dateFrom: searchParams.get('dateFrom'),
        dateTo: searchParams.get('dateTo'),
        limit: parseInt(searchParams.get('limit') || '20'),
        offset: parseInt(searchParams.get('offset') || '0'),
        sortBy: searchParams.get('sortBy') || 'newest'
      });

      let comments = Array.from(commentsStore.values());

      // Filter out replies for main listing (they're included with parent comments)
      comments = comments.filter(comment => !comment.parentId);

      // Apply filters
      if (filters.status !== 'all') {
        comments = comments.filter(comment => comment.status === filters.status);
      }

      if (filters.elementId) {
        comments = comments.filter(comment => comment.elementId === filters.elementId);
      }

      if (filters.authorId) {
        comments = comments.filter(comment => comment.author.id === filters.authorId);
      }

      if (filters.mentions && filters.mentions.length > 0) {
        comments = comments.filter(comment => 
          filters.mentions!.some(mention => comment.mentions.includes(mention))
        );
      }

      if (filters.tags && filters.tags.length > 0) {
        comments = comments.filter(comment =>
          filters.tags!.some(tag => comment.tags.includes(tag))
        );
      }

      if (filters.dateFrom) {
        const fromTimestamp = new Date(filters.dateFrom).getTime();
        comments = comments.filter(comment => comment.createdAt >= fromTimestamp);
      }

      if (filters.dateTo) {
        const toTimestamp = new Date(filters.dateTo).getTime();
        comments = comments.filter(comment => comment.createdAt <= toTimestamp);
      }

      // Sort comments
      comments.sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return b.createdAt - a.createdAt;
          case 'oldest':
            return a.createdAt - b.createdAt;
          case 'element':
            return (a.elementId || '').localeCompare(b.elementId || '');
          case 'replies':
            return b.replies.length - a.replies.length;
          default:
            return b.createdAt - a.createdAt;
        }
      });

      // Apply pagination
      const paginatedComments = comments.slice(filters.offset, filters.offset + filters.limit);

      // Include replies for each comment
      const commentsWithReplies = paginatedComments.map(comment => {
        const replies = comment.replies.map(replyId => commentsStore.get(replyId)).filter(Boolean);
        return {
          ...comment,
          reactions: Object.fromEntries(comment.reactions),
          repliesData: replies.map(reply => ({
            ...reply!,
            reactions: Object.fromEntries(reply!.reactions)
          }))
        };
      });

      return NextResponse.json({
        comments: commentsWithReplies,
        total: comments.length,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: filters.offset + filters.limit < comments.length,
        stats: commentStats,
        filters: filters
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid filter parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Comment listing error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create comment or reply
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const commentData = CreateCommentSchema.parse(body);
    const userId = getUserId(request);
    const commentId = generateCommentId();

    // Process attachments
    const processedAttachments = commentData.attachments.map(attachment => ({
      id: generateAttachmentId(),
      ...attachment
    }));

    const comment: Comment = {
      id: commentId,
      content: commentData.content,
      elementId: commentData.elementId,
      position: commentData.position,
      author: getUserInfo(userId),
      mentions: commentData.mentions,
      tags: commentData.tags,
      status: 'open',
      parentId: commentData.parentId,
      replies: [],
      attachments: processedAttachments,
      editHistory: [],
      reactions: new Map(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Store comment
    commentsStore.set(commentId, comment);

    // Update indexes
    if (comment.elementId) {
      if (!elementComments.has(comment.elementId)) {
        elementComments.set(comment.elementId, new Set());
      }
      elementComments.get(comment.elementId)!.add(commentId);
    }

    if (!userComments.has(userId)) {
      userComments.set(userId, new Set());
    }
    userComments.get(userId)!.add(commentId);

    // Handle threading
    if (comment.parentId) {
      const parentComment = commentsStore.get(comment.parentId);
      if (parentComment) {
        parentComment.replies.push(commentId);
        parentComment.updatedAt = Date.now();
        
        if (!commentThreads.has(comment.parentId)) {
          commentThreads.set(comment.parentId, new Set());
        }
        commentThreads.get(comment.parentId)!.add(commentId);
      }
    }

    updateCommentStats();

    return NextResponse.json({
      success: true,
      comment: {
        ...comment,
        reactions: Object.fromEntries(comment.reactions)
      },
      message: comment.parentId ? 'Reply created successfully' : 'Comment created successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid comment data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Comment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// PUT /api/comments - Update comment or change status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, action } = body;
    const userId = getUserId(request);

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const comment = commentsStore.get(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (action === 'edit') {
      // Only author can edit
      if (comment.author.id !== userId) {
        return NextResponse.json(
          { error: 'Only comment author can edit' },
          { status: 403 }
        );
      }

      const updateData = UpdateCommentSchema.parse(body);

      // Save edit history
      comment.editHistory.push({
        timestamp: Date.now(),
        previousContent: comment.content,
        editor: getUserInfo(userId)
      });

      // Update comment
      comment.content = updateData.content;
      if (updateData.mentions) comment.mentions = updateData.mentions;
      if (updateData.tags) comment.tags = updateData.tags;
      comment.updatedAt = Date.now();

    } else if (action === 'resolve') {
      comment.status = comment.status === 'resolved' ? 'open' : 'resolved';
      comment.updatedAt = Date.now();
      
      if (comment.status === 'resolved') {
        comment.resolvedAt = Date.now();
        comment.resolvedBy = getUserInfo(userId);
      } else {
        delete comment.resolvedAt;
        delete comment.resolvedBy;
      }

    } else if (action === 'archive') {
      comment.status = 'archived';
      comment.updatedAt = Date.now();

    } else if (action === 'react') {
      const { emoji } = body;
      if (!emoji) {
        return NextResponse.json(
          { error: 'Emoji is required for reactions' },
          { status: 400 }
        );
      }

      if (!comment.reactions.has(emoji)) {
        comment.reactions.set(emoji, []);
      }

      const users = comment.reactions.get(emoji)!;
      const userIndex = users.indexOf(userId);

      if (userIndex === -1) {
        users.push(userId);
      } else {
        users.splice(userIndex, 1);
        if (users.length === 0) {
          comment.reactions.delete(emoji);
        }
      }

      comment.updatedAt = Date.now();

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    updateCommentStats();

    return NextResponse.json({
      success: true,
      comment: {
        ...comment,
        reactions: Object.fromEntries(comment.reactions)
      },
      message: `Comment ${action}ed successfully`
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid update data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Comment update error:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments - Delete comment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const userId = getUserId(request);

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const comment = commentsStore.get(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Only author can delete (or admin in production)
    if (comment.author.id !== userId) {
      return NextResponse.json(
        { error: 'Only comment author can delete' },
        { status: 403 }
      );
    }

    // Delete all replies first
    comment.replies.forEach(replyId => {
      commentsStore.delete(replyId);
      
      // Clean up indexes
      userComments.forEach(userSet => userSet.delete(replyId));
      elementComments.forEach(elementSet => elementSet.delete(replyId));
    });

    // Clean up thread mapping
    if (comment.parentId) {
      commentThreads.get(comment.parentId)?.delete(commentId);
    }
    commentThreads.delete(commentId);

    // Remove from main storage
    commentsStore.delete(commentId);

    // Clean up indexes
    if (comment.elementId) {
      elementComments.get(comment.elementId)?.delete(commentId);
    }
    userComments.get(userId)?.delete(commentId);

    // Update parent comment if this was a reply
    if (comment.parentId) {
      const parentComment = commentsStore.get(comment.parentId);
      if (parentComment) {
        parentComment.replies = parentComment.replies.filter(id => id !== commentId);
        parentComment.updatedAt = Date.now();
      }
    }

    updateCommentStats();

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
      deletedReplies: comment.replies.length
    });

  } catch (error) {
    console.error('Comment deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}