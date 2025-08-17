import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Shapes API - Shape templates, export, and canvas management
 * Provides endpoints for shape library, template management, and export functionality
 */

// Validation schemas
const CreateShapeSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['icon', 'layout', 'decorative', 'ui', 'custom']),
  tags: z.array(z.string()).default([]),
  shapeData: z.object({
    type: z.string(),
    geometry: z.record(z.any()),
    style: z.record(z.any()),
    metadata: z.record(z.any()).optional()
  }),
  isPublic: z.boolean().default(false),
  isTemplate: z.boolean().default(false)
});

const ExportShapeSchema = z.object({
  shapeIds: z.array(z.string()).min(1),
  format: z.enum(['svg', 'png', 'json', 'component']),
  options: z.object({
    quality: z.number().min(0.1).max(1).default(1),
    background: z.boolean().default(false),
    padding: z.number().min(0).max(100).default(0),
    width: z.number().min(1).max(4096).optional(),
    height: z.number().min(1).max(4096).optional()
  }).optional()
});

const UpdateShapeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.enum(['icon', 'layout', 'decorative', 'ui', 'custom']).optional(),
  tags: z.array(z.string()).optional(),
  shapeData: z.object({
    type: z.string(),
    geometry: z.record(z.any()),
    style: z.record(z.any()),
    metadata: z.record(z.any()).optional()
  }).optional(),
  isPublic: z.boolean().optional()
});

// Mock shape storage (in production, this would be a database)
const shapeLibrary = new Map<string, {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  shapeData: {
    type: string;
    geometry: Record<string, any>;
    style: Record<string, any>;
    metadata?: Record<string, any>;
  };
  thumbnail?: string;
  isPublic: boolean;
  isTemplate: boolean;
  authorId: string;
  downloads: number;
  likes: number;
  createdAt: number;
  updatedAt: number;
}>();

const userShapes = new Map<string, Set<string>>();
const shapeCollections = new Map<string, {
  id: string;
  name: string;
  description?: string;
  shapeIds: string[];
  authorId: string;
  isPublic: boolean;
  createdAt: number;
}>();

// Initialize with sample shapes
function initializeSampleShapes() {
  if (shapeLibrary.size > 0) return;

  const sampleShapes = [
    {
      id: 'restaurant-plate',
      name: 'Restaurant Plate',
      description: 'Elegant plate icon for menu sections',
      category: 'icon',
      tags: ['restaurant', 'food', 'plate', 'dining'],
      shapeData: {
        type: 'svg',
        geometry: {
          width: 100,
          height: 100,
          viewBox: '0 0 100 100'
        },
        style: {
          fill: '#8B4513',
          stroke: '#654321',
          strokeWidth: 2
        },
        metadata: {
          path: 'M50 10 C75 10 90 25 90 50 C90 75 75 90 50 90 C25 90 10 75 10 50 C10 25 25 10 50 10 Z M20 50 C20 70 30 80 50 80 C70 80 80 70 80 50 C80 30 70 20 50 20 C30 20 20 30 20 50 Z'
        }
      },
      thumbnail: '/shapes/restaurant-plate.svg',
      isPublic: true,
      isTemplate: true,
      authorId: 'system',
      downloads: 1250,
      likes: 89,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000
    },
    {
      id: 'chef-hat',
      name: 'Chef Hat',
      description: 'Traditional chef hat icon',
      category: 'icon',
      tags: ['chef', 'cooking', 'restaurant', 'culinary'],
      shapeData: {
        type: 'svg',
        geometry: {
          width: 100,
          height: 120,
          viewBox: '0 0 100 120'
        },
        style: {
          fill: '#FFFFFF',
          stroke: '#333333',
          strokeWidth: 2
        },
        metadata: {
          path: 'M20 80 L80 80 L80 100 C80 110 70 120 60 120 L40 120 C30 120 20 110 20 100 Z M50 20 C70 20 85 30 85 45 C85 50 83 55 80 58 L80 80 L20 80 L20 58 C17 55 15 50 15 45 C15 30 30 20 50 20 Z'
        }
      },
      thumbnail: '/shapes/chef-hat.svg',
      isPublic: true,
      isTemplate: true,
      authorId: 'system',
      downloads: 890,
      likes: 67,
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 172800000
    },
    {
      id: 'menu-border',
      name: 'Decorative Menu Border',
      description: 'Ornate border for menu sections',
      category: 'decorative',
      tags: ['border', 'menu', 'decorative', 'ornate'],
      shapeData: {
        type: 'svg',
        geometry: {
          width: 300,
          height: 50,
          viewBox: '0 0 300 50'
        },
        style: {
          fill: 'none',
          stroke: '#D4AF37',
          strokeWidth: 3
        },
        metadata: {
          path: 'M10 25 L50 25 M60 15 L60 35 M70 25 L240 25 M250 15 L250 35 M260 25 L290 25 M25 10 C35 10 35 40 25 40 M275 10 C285 10 285 40 275 40'
        }
      },
      thumbnail: '/shapes/menu-border.svg',
      isPublic: true,
      isTemplate: true,
      authorId: 'system',
      downloads: 445,
      likes: 34,
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 259200000
    },
    {
      id: 'callout-box',
      name: 'Special Offer Callout',
      description: 'Eye-catching callout box for specials',
      category: 'ui',
      tags: ['callout', 'special', 'offer', 'highlight'],
      shapeData: {
        type: 'composite',
        geometry: {
          width: 250,
          height: 100,
          viewBox: '0 0 250 100'
        },
        style: {
          fill: '#FF6B35',
          stroke: '#E55A2B',
          strokeWidth: 2,
          borderRadius: 8
        },
        metadata: {
          shapes: [
            { type: 'rect', x: 0, y: 0, width: 250, height: 100, rx: 8 },
            { type: 'text', x: 125, y: 50, content: 'SPECIAL OFFER', fontSize: 18, fontWeight: 'bold', fill: 'white' }
          ]
        }
      },
      thumbnail: '/shapes/callout-box.svg',
      isPublic: true,
      isTemplate: true,
      authorId: 'system',
      downloads: 782,
      likes: 56,
      createdAt: Date.now() - 345600000,
      updatedAt: Date.now() - 345600000
    }
  ];

  sampleShapes.forEach(shape => {
    shapeLibrary.set(shape.id, shape);
  });
}

function getUserId(request: NextRequest): string {
  // In production, extract from authentication
  return request.headers.get('x-user-id') || 'anonymous';
}

function generateShapeId(): string {
  return `shape_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// GET /api/shapes - List shapes or get specific shape
export async function GET(request: NextRequest) {
  try {
    initializeSampleShapes();
    
    const { searchParams } = new URL(request.url);
    const shapeId = searchParams.get('shapeId');
    const category = searchParams.get('category');
    const query = searchParams.get('query') || '';
    const isTemplate = searchParams.get('template') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = getUserId(request);

    if (shapeId) {
      // Get specific shape
      const shape = shapeLibrary.get(shapeId);
      if (!shape) {
        return NextResponse.json(
          { error: 'Shape not found' },
          { status: 404 }
        );
      }

      // Check if user has access to private shapes
      if (!shape.isPublic && shape.authorId !== userId) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        shape: {
          ...shape,
          isOwned: shape.authorId === userId,
          canEdit: shape.authorId === userId || shape.isPublic
        }
      });
    } else {
      // List shapes with filters
      let shapes = Array.from(shapeLibrary.values());
      const userShapeSet = userShapes.get(userId) || new Set();

      // Apply filters
      shapes = shapes.filter(shape => {
        // Public shapes or user's own shapes
        if (!shape.isPublic && shape.authorId !== userId) return false;
        
        // Category filter
        if (category && shape.category !== category) return false;
        
        // Template filter
        if (isTemplate && !shape.isTemplate) return false;
        
        // Search query
        if (query) {
          const lowercaseQuery = query.toLowerCase();
          return shape.name.toLowerCase().includes(lowercaseQuery) ||
                 shape.description?.toLowerCase().includes(lowercaseQuery) ||
                 shape.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery));
        }
        
        return true;
      });

      // Sort by downloads, then likes, then created date
      shapes.sort((a, b) => {
        if (a.downloads !== b.downloads) return b.downloads - a.downloads;
        if (a.likes !== b.likes) return b.likes - a.likes;
        return b.createdAt - a.createdAt;
      });

      // Apply pagination
      const paginatedShapes = shapes.slice(offset, offset + limit);

      // Add user-specific metadata
      const shapesWithMetadata = paginatedShapes.map(shape => ({
        ...shape,
        isOwned: shape.authorId === userId,
        isSaved: userShapeSet.has(shape.id),
        canEdit: shape.authorId === userId || shape.isPublic
      }));

      return NextResponse.json({
        shapes: shapesWithMetadata,
        total: shapes.length,
        limit,
        offset,
        hasMore: offset + limit < shapes.length,
        categories: ['icon', 'layout', 'decorative', 'ui', 'custom']
      });
    }

  } catch (error) {
    console.error('Shape listing error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shapes' },
      { status: 500 }
    );
  }
}

// POST /api/shapes - Create shape or export shapes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'create';

    if (action === 'create') {
      const shapeData = CreateShapeSchema.parse(body);
      const userId = getUserId(request);
      const shapeId = generateShapeId();

      const shape = {
        id: shapeId,
        ...shapeData,
        authorId: userId,
        downloads: 0,
        likes: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      shapeLibrary.set(shapeId, shape);

      // Add to user's shapes
      const userShapeSet = userShapes.get(userId) || new Set();
      userShapeSet.add(shapeId);
      userShapes.set(userId, userShapeSet);

      return NextResponse.json({
        success: true,
        shape: {
          ...shape,
          isOwned: true,
          canEdit: true
        },
        message: 'Shape created successfully'
      });

    } else if (action === 'export') {
      const { shapeIds, format, options = {} } = ExportShapeSchema.parse(body);
      const userId = getUserId(request);

      // Validate shape access
      const shapes = [];
      for (const shapeId of shapeIds) {
        const shape = shapeLibrary.get(shapeId);
        if (!shape) {
          return NextResponse.json(
            { error: `Shape ${shapeId} not found` },
            { status: 404 }
          );
        }
        if (!shape.isPublic && shape.authorId !== userId) {
          return NextResponse.json(
            { error: `Access denied to shape ${shapeId}` },
            { status: 403 }
          );
        }
        shapes.push(shape);
      }

      // Generate export data based on format
      let exportData;
      const timestamp = Date.now();

      switch (format) {
        case 'svg':
          exportData = generateSVGExport(shapes, options);
          break;
        case 'png':
          exportData = generatePNGExport(shapes, options);
          break;
        case 'json':
          exportData = {
            format: 'tldraw-shapes',
            version: '1.0',
            shapes: shapes.map(s => ({
              id: s.id,
              name: s.name,
              shapeData: s.shapeData,
              metadata: {
                category: s.category,
                tags: s.tags,
                exported: timestamp
              }
            })),
            exportOptions: options,
            timestamp
          };
          break;
        case 'component':
          exportData = generateReactComponentExport(shapes, options);
          break;
        default:
          throw new Error('Invalid export format');
      }

      // Update download counts
      shapes.forEach(shape => {
        shape.downloads += 1;
        shape.updatedAt = Date.now();
      });

      return NextResponse.json({
        success: true,
        exportData,
        format,
        shapeCount: shapes.length,
        filename: `shapes-export-${timestamp}.${format === 'component' ? 'tsx' : format}`,
        message: 'Shapes exported successfully'
      });

    } else if (action === 'save') {
      const { shapeId } = body;
      const userId = getUserId(request);

      const shape = shapeLibrary.get(shapeId);
      if (!shape) {
        return NextResponse.json(
          { error: 'Shape not found' },
          { status: 404 }
        );
      }

      if (!shape.isPublic && shape.authorId !== userId) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      const userShapeSet = userShapes.get(userId) || new Set();
      const wasSaved = userShapeSet.has(shapeId);

      if (wasSaved) {
        userShapeSet.delete(shapeId);
      } else {
        userShapeSet.add(shapeId);
      }
      userShapes.set(userId, userShapeSet);

      return NextResponse.json({
        success: true,
        saved: !wasSaved,
        message: !wasSaved ? 'Shape saved successfully' : 'Shape removed from saved'
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

    console.error('Shape creation/export error:', error);
    return NextResponse.json(
      { error: 'Failed to process shape request' },
      { status: 500 }
    );
  }
}

// PUT /api/shapes - Update shape
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { shapeId, ...updateData } = UpdateShapeSchema.extend({
      shapeId: z.string().min(1)
    }).parse(body);
    
    const userId = getUserId(request);
    const shape = shapeLibrary.get(shapeId);

    if (!shape) {
      return NextResponse.json(
        { error: 'Shape not found' },
        { status: 404 }
      );
    }

    if (shape.authorId !== userId) {
      return NextResponse.json(
        { error: 'Access denied - you can only edit your own shapes' },
        { status: 403 }
      );
    }

    // Update shape properties
    Object.assign(shape, updateData, { updatedAt: Date.now() });

    return NextResponse.json({
      success: true,
      shape: {
        ...shape,
        isOwned: true,
        canEdit: true
      },
      message: 'Shape updated successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Shape update error:', error);
    return NextResponse.json(
      { error: 'Failed to update shape' },
      { status: 500 }
    );
  }
}

// DELETE /api/shapes - Delete shape
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shapeId = searchParams.get('shapeId');
    
    if (!shapeId) {
      return NextResponse.json(
        { error: 'Shape ID is required' },
        { status: 400 }
      );
    }
    
    const userId = getUserId(request);
    const shape = shapeLibrary.get(shapeId);

    if (!shape) {
      return NextResponse.json(
        { error: 'Shape not found' },
        { status: 404 }
      );
    }

    if (shape.authorId !== userId) {
      return NextResponse.json(
        { error: 'Access denied - you can only delete your own shapes' },
        { status: 403 }
      );
    }

    // Remove from library
    shapeLibrary.delete(shapeId);

    // Remove from all user collections
    for (const [userId, userShapeSet] of userShapes.entries()) {
      userShapeSet.delete(shapeId);
    }

    return NextResponse.json({
      success: true,
      message: 'Shape deleted successfully'
    });

  } catch (error) {
    console.error('Shape deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete shape' },
      { status: 500 }
    );
  }
}

/**
 * Export generation functions
 */
function generateSVGExport(shapes: any[], options: any) {
  const { padding = 0, background = false } = options;
  
  // Calculate combined bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  shapes.forEach(shape => {
    const { geometry } = shape.shapeData;
    minX = Math.min(minX, 0);
    minY = Math.min(minY, 0);
    maxX = Math.max(maxX, geometry.width || 100);
    maxY = Math.max(maxY, geometry.height || 100);
  });

  const width = maxX - minX + (padding * 2);
  const height = maxY - minY + (padding * 2);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  if (background) {
    svg += `<rect width="100%" height="100%" fill="white"/>`;
  }

  shapes.forEach((shape, index) => {
    const { shapeData } = shape;
    const x = padding + (index * 120); // Simple horizontal layout
    const y = padding;

    if (shapeData.type === 'svg' && shapeData.metadata?.path) {
      svg += `<g transform="translate(${x}, ${y})">`;
      svg += `<path d="${shapeData.metadata.path}" fill="${shapeData.style.fill}" stroke="${shapeData.style.stroke}" stroke-width="${shapeData.style.strokeWidth}"/>`;
      svg += `</g>`;
    }
  });

  svg += `</svg>`;
  return svg;
}

function generatePNGExport(shapes: any[], options: any) {
  // In a real implementation, this would convert SVG to PNG
  // For now, return a placeholder
  return {
    type: 'png',
    data: 'base64-encoded-png-data',
    width: options.width || 400,
    height: options.height || 300,
    note: 'PNG export requires server-side image processing'
  };
}

function generateReactComponentExport(shapes: any[], options: any) {
  const componentName = `GeneratedShapes${Date.now()}`;
  
  const shapeElements = shapes.map((shape, index) => {
    if (shape.shapeData.type === 'svg' && shape.shapeData.metadata?.path) {
      return `
      <g key="${shape.id}" transform="translate(${index * 120}, 0)">
        <path 
          d="${shape.shapeData.metadata.path}"
          fill="${shape.shapeData.style.fill}"
          stroke="${shape.shapeData.style.stroke}"
          strokeWidth="${shape.shapeData.style.strokeWidth}"
        />
      </g>`;
    }
    return '';
  }).join('');

  return `import React from 'react';

interface ${componentName}Props {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export default function ${componentName}({ 
  className = '', 
  style = {}, 
  width = 400, 
  height = 200 
}: ${componentName}Props) {
  return (
    <div className={\`generated-shapes \${className}\`} style={style}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 400 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        ${shapeElements}
      </svg>
    </div>
  );
}

// Shape metadata
export const shapesMetadata = {
  name: '${componentName}',
  shapes: ${JSON.stringify(shapes.map(s => ({ id: s.id, name: s.name, category: s.category })), null, 2)},
  createdAt: '${new Date().toISOString()}',
  type: 'tldraw-shapes-component'
};`;
}