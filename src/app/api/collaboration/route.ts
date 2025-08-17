import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Collaboration API - Room management and real-time synchronization
 * Provides endpoints for collaboration room lifecycle and user management
 */

// Validation schemas
const CreateRoomSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
  maxUsers: z.number().min(1).max(50).default(10),
  permissions: z.object({
    canEdit: z.boolean().default(true),
    canComment: z.boolean().default(true),
    canShare: z.boolean().default(false)
  }).optional()
});

const JoinRoomSchema = z.object({
  roomId: z.string().min(1),
  userInfo: z.object({
    name: z.string().min(1).max(50),
    avatar: z.string().url().optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i).optional()
  })
});

const SyncDataSchema = z.object({
  roomId: z.string().min(1),
  data: z.record(z.any()),
  timestamp: z.number(),
  userId: z.string().min(1)
});

// Mock collaboration storage (in production, this would be a database + real-time service)
const collaborationRooms = new Map<string, {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  maxUsers: number;
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canShare: boolean;
  };
  users: Array<{
    id: string;
    name: string;
    avatar?: string;
    color: string;
    joinedAt: number;
    lastSeen: number;
    isActive: boolean;
  }>;
  document: Record<string, any>;
  createdAt: number;
  updatedAt: number;
  ownerId: string;
}>();

const userSessions = new Map<string, {
  userId: string;
  roomId: string;
  cursor?: { x: number; y: number };
  selection?: { elementId: string; bounds: any };
  lastActivity: number;
}>();

function getUserId(request: NextRequest): string {
  // In production, extract from authentication
  return request.headers.get('x-user-id') || 'anonymous';
}

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateUserColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#48CAE4', '#F38BA8', '#A8DADC', '#FFB3BA', '#BFDBFE'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// GET /api/collaboration - List rooms or get room details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const userId = getUserId(request);

    if (roomId) {
      // Get specific room details
      const room = collaborationRooms.get(roomId);
      if (!room) {
        return NextResponse.json(
          { error: 'Room not found' },
          { status: 404 }
        );
      }

      // Update user's last seen if they're in the room
      const user = room.users.find(u => u.id === userId);
      if (user) {
        user.lastSeen = Date.now();
        user.isActive = true;
      }

      return NextResponse.json({
        room: {
          ...room,
          users: room.users.map(u => ({
            ...u,
            isActive: Date.now() - u.lastSeen < 30000 // Active within 30 seconds
          }))
        }
      });
    } else {
      // List public rooms
      const publicRooms = Array.from(collaborationRooms.values())
        .filter(room => !room.isPrivate)
        .map(room => ({
          id: room.id,
          name: room.name,
          description: room.description,
          userCount: room.users.length,
          maxUsers: room.maxUsers,
          createdAt: room.createdAt,
          isActive: room.users.some(u => Date.now() - u.lastSeen < 300000) // Active within 5 minutes
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      return NextResponse.json({
        rooms: publicRooms,
        total: publicRooms.length
      });
    }

  } catch (error) {
    console.error('Collaboration room listing error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve collaboration data' },
      { status: 500 }
    );
  }
}

// POST /api/collaboration - Create room or join existing room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'create') {
      const { name, description, isPrivate, maxUsers, permissions } = CreateRoomSchema.parse(body);
      const userId = getUserId(request);
      const roomId = generateRoomId();

      const room = {
        id: roomId,
        name,
        description,
        isPrivate,
        maxUsers,
        permissions: permissions || {
          canEdit: true,
          canComment: true,
          canShare: false
        },
        users: [{
          id: userId,
          name: body.userInfo?.name || 'Anonymous User',
          avatar: body.userInfo?.avatar,
          color: body.userInfo?.color || generateUserColor(),
          joinedAt: Date.now(),
          lastSeen: Date.now(),
          isActive: true
        }],
        document: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ownerId: userId
      };

      collaborationRooms.set(roomId, room);

      return NextResponse.json({
        success: true,
        room,
        message: 'Collaboration room created successfully'
      });

    } else if (action === 'join') {
      const { roomId, userInfo } = JoinRoomSchema.parse(body);
      const userId = getUserId(request);

      const room = collaborationRooms.get(roomId);
      if (!room) {
        return NextResponse.json(
          { error: 'Room not found' },
          { status: 404 }
        );
      }

      // Check if room is full
      if (room.users.length >= room.maxUsers) {
        return NextResponse.json(
          { error: 'Room is full' },
          { status: 409 }
        );
      }

      // Check if user is already in room
      const existingUser = room.users.find(u => u.id === userId);
      if (existingUser) {
        // Update existing user
        existingUser.name = userInfo.name;
        existingUser.avatar = userInfo.avatar;
        existingUser.color = userInfo.color || existingUser.color;
        existingUser.lastSeen = Date.now();
        existingUser.isActive = true;
      } else {
        // Add new user
        room.users.push({
          id: userId,
          name: userInfo.name,
          avatar: userInfo.avatar,
          color: userInfo.color || generateUserColor(),
          joinedAt: Date.now(),
          lastSeen: Date.now(),
          isActive: true
        });
      }

      room.updatedAt = Date.now();

      return NextResponse.json({
        success: true,
        room,
        message: 'Joined collaboration room successfully'
      });

    } else if (action === 'sync') {
      const { roomId, data, timestamp, userId: syncUserId } = SyncDataSchema.parse(body);

      const room = collaborationRooms.get(roomId);
      if (!room) {
        return NextResponse.json(
          { error: 'Room not found' },
          { status: 404 }
        );
      }

      // Update room document
      room.document = { ...room.document, ...data };
      room.updatedAt = Math.max(room.updatedAt, timestamp);

      // Update user activity
      const user = room.users.find(u => u.id === syncUserId);
      if (user) {
        user.lastSeen = Date.now();
        user.isActive = true;
      }

      // Broadcast to other users (in production, this would use WebSocket/WebRTC)
      const activeUsers = room.users
        .filter(u => u.id !== syncUserId && Date.now() - u.lastSeen < 30000)
        .map(u => u.id);

      return NextResponse.json({
        success: true,
        document: room.document,
        broadcast: activeUsers,
        timestamp: room.updatedAt
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Collaboration room creation/join error:', error);
    return NextResponse.json(
      { error: 'Failed to process collaboration request' },
      { status: 500 }
    );
  }
}

// PUT /api/collaboration - Update room settings or user presence
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, action } = body;
    const userId = getUserId(request);

    const room = collaborationRooms.get(roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    const user = room.users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not in room' },
        { status: 403 }
      );
    }

    if (action === 'updatePresence') {
      // Update user cursor and selection
      const session = userSessions.get(`${userId}-${roomId}`) || {
        userId,
        roomId,
        lastActivity: Date.now()
      };

      if (body.cursor) {
        session.cursor = body.cursor;
      }

      if (body.selection) {
        session.selection = body.selection;
      }

      session.lastActivity = Date.now();
      userSessions.set(`${userId}-${roomId}`, session);

      user.lastSeen = Date.now();
      user.isActive = true;

      return NextResponse.json({
        success: true,
        presence: session,
        message: 'Presence updated successfully'
      });

    } else if (action === 'updateSettings' && room.ownerId === userId) {
      // Update room settings (only owner can do this)
      if (body.name) room.name = body.name;
      if (body.description !== undefined) room.description = body.description;
      if (body.maxUsers) room.maxUsers = body.maxUsers;
      if (body.permissions) room.permissions = { ...room.permissions, ...body.permissions };

      room.updatedAt = Date.now();

      return NextResponse.json({
        success: true,
        room,
        message: 'Room settings updated successfully'
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid action or insufficient permissions' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Collaboration room update error:', error);
    return NextResponse.json(
      { error: 'Failed to update collaboration room' },
      { status: 500 }
    );
  }
}

// DELETE /api/collaboration - Leave room or delete room
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const action = searchParams.get('action') || 'leave';
    const userId = getUserId(request);

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const room = collaborationRooms.get(roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    if (action === 'leave') {
      // Remove user from room
      room.users = room.users.filter(u => u.id !== userId);
      
      // Clean up user session
      userSessions.delete(`${userId}-${roomId}`);

      // If room is empty, delete it
      if (room.users.length === 0) {
        collaborationRooms.delete(roomId);
        return NextResponse.json({
          success: true,
          message: 'Left room and room was deleted (empty)'
        });
      }

      // If leaving user was owner, transfer ownership
      if (room.ownerId === userId && room.users.length > 0) {
        room.ownerId = room.users[0].id;
      }

      room.updatedAt = Date.now();

      return NextResponse.json({
        success: true,
        message: 'Left collaboration room successfully'
      });

    } else if (action === 'delete' && room.ownerId === userId) {
      // Delete entire room (only owner can do this)
      collaborationRooms.delete(roomId);

      // Clean up all user sessions for this room
      for (const [key, session] of userSessions.entries()) {
        if (session.roomId === roomId) {
          userSessions.delete(key);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Collaboration room deleted successfully'
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid action or insufficient permissions' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Collaboration room deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete/leave collaboration room' },
      { status: 500 }
    );
  }
}