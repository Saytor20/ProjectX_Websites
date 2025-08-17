import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Plugin Registry API - Manage plugin installation and discovery
 * Provides endpoints for plugin lifecycle management
 */

// Validation schemas
const PluginInstallSchema = z.object({
  pluginId: z.string().min(1),
  source: z.enum(['marketplace', 'file', 'url']),
  url: z.string().url().optional(),
  autoActivate: z.boolean().default(true),
  overwrite: z.boolean().default(false)
});

const PluginActivateSchema = z.object({
  pluginId: z.string().min(1),
  activate: z.boolean()
});

const PluginSearchSchema = z.object({
  query: z.string().optional(),
  category: z.enum(['component', 'theme', 'tool', 'export', 'validation', 'utility']).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
});

// Mock plugin registry data (in production, this would be a database)
const pluginRegistry = new Map([
  ['badge-plugin', {
    id: 'badge-plugin',
    name: 'Badge & Labels',
    version: '1.0.0',
    description: 'Add customizable badges and labels to any component',
    author: 'Restaurant Website Generator Team',
    category: 'component',
    icon: '🏷️',
    permissions: ['dom:read', 'dom:write', 'storage:local'],
    downloads: 1250,
    rating: 4.8,
    tags: ['badges', 'labels', 'ui', 'components'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    fileUrl: '/plugins/badge-plugin-1.0.0.zip',
    verified: true,
    featured: true
  }],
  ['gradient-plugin', {
    id: 'gradient-plugin',
    name: 'Advanced Gradients',
    version: '1.0.0',
    description: 'Create complex gradients with multi-stop controls and presets',
    author: 'Restaurant Website Generator Team',
    category: 'theme',
    icon: '🎨',
    permissions: ['dom:read', 'dom:write', 'theme:read', 'theme:write', 'storage:local'],
    downloads: 890,
    rating: 4.9,
    tags: ['gradients', 'colors', 'design', 'theme'],
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
    fileUrl: '/plugins/gradient-plugin-1.0.0.zip',
    verified: true,
    featured: true
  }],
  ['icon-plugin', {
    id: 'icon-plugin',
    name: 'Icon Library',
    version: '1.0.0',
    description: 'Add icons from popular libraries (Heroicons, Feather, Lucide, Phosphor)',
    author: 'Restaurant Website Generator Team',
    category: 'component',
    icon: '🎯',
    permissions: ['dom:read', 'dom:write', 'storage:local'],
    downloads: 2100,
    rating: 4.7,
    tags: ['icons', 'heroicons', 'feather', 'ui'],
    createdAt: '2024-01-18T16:00:00Z',
    updatedAt: '2024-01-25T13:45:00Z',
    fileUrl: '/plugins/icon-plugin-1.0.0.zip',
    verified: true,
    featured: false
  }],
  ['animation-plugin', {
    id: 'animation-plugin',
    name: 'CSS Animations',
    version: '1.0.0',
    description: 'Add CSS animations and transitions to elements',
    author: 'Restaurant Website Generator Team',
    category: 'tool',
    icon: '⚡',
    permissions: ['dom:read', 'dom:write', 'storage:local'],
    downloads: 675,
    rating: 4.6,
    tags: ['animations', 'css', 'transitions', 'effects'],
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-27T09:20:00Z',
    fileUrl: '/plugins/animation-plugin-1.0.0.zip',
    verified: true,
    featured: false
  }],
  ['seo-plugin', {
    id: 'seo-plugin',
    name: 'SEO Optimizer',
    version: '1.0.0',
    description: 'Comprehensive SEO analysis and optimization tools',
    author: 'Restaurant Website Generator Team',
    category: 'validation',
    icon: '🔍',
    permissions: ['dom:read', 'dom:write', 'storage:local'],
    downloads: 1580,
    rating: 4.9,
    tags: ['seo', 'optimization', 'meta', 'analytics'],
    createdAt: '2024-01-22T14:00:00Z',
    updatedAt: '2024-01-28T16:10:00Z',
    fileUrl: '/plugins/seo-plugin-1.0.0.zip',
    verified: true,
    featured: true
  }]
]);

// User plugin installations (in production, this would be user-specific database storage)
const userInstallations = new Map<string, Set<string>>();
const userActivations = new Map<string, Set<string>>();

function getUserId(request: NextRequest): string {
  // In production, extract from authentication
  return request.headers.get('x-user-id') || 'anonymous';
}

// GET /api/plugins - List available plugins
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured') === 'true';
    const installed = searchParams.get('installed') === 'true';
    
    const userId = getUserId(request);
    const userPlugins = userInstallations.get(userId) || new Set();
    const activePlugins = userActivations.get(userId) || new Set();

    let plugins = Array.from(pluginRegistry.values());

    // Apply filters
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      plugins = plugins.filter(plugin => 
        plugin.name.toLowerCase().includes(lowercaseQuery) ||
        plugin.description.toLowerCase().includes(lowercaseQuery) ||
        plugin.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    }

    if (category) {
      plugins = plugins.filter(plugin => plugin.category === category);
    }

    if (featured) {
      plugins = plugins.filter(plugin => plugin.featured);
    }

    if (installed) {
      plugins = plugins.filter(plugin => userPlugins.has(plugin.id));
    }

    // Sort by featured status, then downloads, then rating
    plugins.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.downloads !== b.downloads) return b.downloads - a.downloads;
      return b.rating - a.rating;
    });

    // Apply pagination
    const paginatedPlugins = plugins.slice(offset, offset + limit);

    // Add installation and activation status
    const pluginsWithStatus = paginatedPlugins.map(plugin => ({
      ...plugin,
      isInstalled: userPlugins.has(plugin.id),
      isActive: activePlugins.has(plugin.id)
    }));

    return NextResponse.json({
      plugins: pluginsWithStatus,
      total: plugins.length,
      limit,
      offset,
      hasMore: offset + limit < plugins.length
    });

  } catch (error) {
    console.error('Plugin listing error:', error);
    return NextResponse.json(
      { error: 'Failed to list plugins' },
      { status: 500 }
    );
  }
}

// POST /api/plugins - Install a plugin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pluginId, source, url, autoActivate, overwrite } = PluginInstallSchema.parse(body);
    
    const userId = getUserId(request);
    const userPlugins = userInstallations.get(userId) || new Set();
    const activePlugins = userActivations.get(userId) || new Set();

    // Check if plugin exists
    const plugin = pluginRegistry.get(pluginId);
    if (!plugin) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }

    // Check if already installed
    if (userPlugins.has(pluginId) && !overwrite) {
      return NextResponse.json(
        { error: 'Plugin already installed' },
        { status: 409 }
      );
    }

    // Simulate installation process
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate download/install time

    // Install plugin
    userPlugins.add(pluginId);
    userInstallations.set(userId, userPlugins);

    // Auto-activate if requested
    if (autoActivate) {
      activePlugins.add(pluginId);
      userActivations.set(userId, activePlugins);
    }

    // Update download count
    plugin.downloads += 1;

    return NextResponse.json({
      success: true,
      plugin: {
        ...plugin,
        isInstalled: true,
        isActive: autoActivate
      },
      message: 'Plugin installed successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Plugin installation error:', error);
    return NextResponse.json(
      { error: 'Failed to install plugin' },
      { status: 500 }
    );
  }
}

// PUT /api/plugins - Activate/Deactivate a plugin
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { pluginId, activate } = PluginActivateSchema.parse(body);
    
    const userId = getUserId(request);
    const userPlugins = userInstallations.get(userId) || new Set();
    const activePlugins = userActivations.get(userId) || new Set();

    // Check if plugin is installed
    if (!userPlugins.has(pluginId)) {
      return NextResponse.json(
        { error: 'Plugin not installed' },
        { status: 404 }
      );
    }

    const plugin = pluginRegistry.get(pluginId);
    if (!plugin) {
      return NextResponse.json(
        { error: 'Plugin not found' },
        { status: 404 }
      );
    }

    // Update activation status
    if (activate) {
      activePlugins.add(pluginId);
    } else {
      activePlugins.delete(pluginId);
    }
    userActivations.set(userId, activePlugins);

    return NextResponse.json({
      success: true,
      plugin: {
        ...plugin,
        isInstalled: true,
        isActive: activate
      },
      message: `Plugin ${activate ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Plugin activation error:', error);
    return NextResponse.json(
      { error: 'Failed to update plugin status' },
      { status: 500 }
    );
  }
}

// DELETE /api/plugins - Uninstall a plugin
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pluginId = searchParams.get('pluginId');
    
    if (!pluginId) {
      return NextResponse.json(
        { error: 'Plugin ID is required' },
        { status: 400 }
      );
    }
    
    const userId = getUserId(request);
    const userPlugins = userInstallations.get(userId) || new Set();
    const activePlugins = userActivations.get(userId) || new Set();

    // Check if plugin is installed
    if (!userPlugins.has(pluginId)) {
      return NextResponse.json(
        { error: 'Plugin not installed' },
        { status: 404 }
      );
    }

    // Remove from installations and activations
    userPlugins.delete(pluginId);
    activePlugins.delete(pluginId);
    userInstallations.set(userId, userPlugins);
    userActivations.set(userId, activePlugins);

    return NextResponse.json({
      success: true,
      message: 'Plugin uninstalled successfully'
    });

  } catch (error) {
    console.error('Plugin uninstallation error:', error);
    return NextResponse.json(
      { error: 'Failed to uninstall plugin' },
      { status: 500 }
    );
  }
}