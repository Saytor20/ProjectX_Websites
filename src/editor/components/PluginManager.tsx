'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PluginDefinition, 
  PluginCategory, 
  PluginInstallOptions, 
  PluginInstallResult 
} from '../plugins/PluginAPI';
import { getPluginRegistry } from '../plugins/PluginRegistry';
import { getSandboxManager } from '../plugins/PluginSandbox';

// Import sample plugins
import { BadgePlugin } from '../plugins/examples/BadgePlugin';
import { GradientPlugin } from '../plugins/examples/GradientPlugin';
import { IconPlugin } from '../plugins/examples/IconPlugin';
import { AnimationPlugin } from '../plugins/examples/AnimationPlugin';
import { SEOPlugin } from '../plugins/examples/SEOPlugin';

/**
 * Plugin Manager Component - User interface for plugin management
 * Provides plugin discovery, installation, configuration, and management
 */

interface PluginManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onPluginActivated?: (plugin: PluginDefinition) => void;
  onPluginDeactivated?: (plugin: PluginDefinition) => void;
}

interface PluginStats {
  total: number;
  active: number;
  categories: Record<PluginCategory, number>;
}

const samplePlugins: PluginDefinition[] = [
  BadgePlugin,
  GradientPlugin,
  IconPlugin,
  AnimationPlugin,
  SEOPlugin
];

export default function PluginManager({ 
  isOpen, 
  onClose, 
  onPluginActivated, 
  onPluginDeactivated 
}: PluginManagerProps) {
  const [activeTab, setActiveTab] = useState<'installed' | 'marketplace' | 'settings'>('installed');
  const [installedPlugins, setInstalledPlugins] = useState<PluginDefinition[]>([]);
  const [activePlugins, setActivePlugins] = useState<Set<string>>(new Set());
  const [pluginStats, setPluginStats] = useState<PluginStats>({
    total: 0,
    active: 0,
    categories: {
      component: 0,
      theme: 0,
      tool: 0,
      export: 0,
      validation: 0,
      utility: 0
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PluginCategory | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize plugin data
  useEffect(() => {
    loadPluginData();
  }, []);

  const loadPluginData = async () => {
    try {
      const registry = getPluginRegistry();
      if (!registry) return;

      const all = registry.getAll();
      const active = registry.getActive();
      
      setInstalledPlugins(all);
      setActivePlugins(new Set(active.map(p => p.id)));
      
      // Calculate stats
      const stats: PluginStats = {
        total: all.length,
        active: active.length,
        categories: {
          component: all.filter(p => p.category === 'component').length,
          theme: all.filter(p => p.category === 'theme').length,
          tool: all.filter(p => p.category === 'tool').length,
          export: all.filter(p => p.category === 'export').length,
          validation: all.filter(p => p.category === 'validation').length,
          utility: all.filter(p => p.category === 'utility').length
        }
      };
      
      setPluginStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plugins');
    }
  };

  const handlePluginToggle = async (plugin: PluginDefinition) => {
    setLoading(true);
    setError(null);
    
    try {
      const registry = getPluginRegistry();
      if (!registry) throw new Error('Plugin registry not available');

      const isActive = activePlugins.has(plugin.id);
      
      if (isActive) {
        await registry.deactivate(plugin.id);
        onPluginDeactivated?.(plugin);
      } else {
        await registry.activate(plugin.id);
        onPluginActivated?.(plugin);
      }
      
      await loadPluginData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle plugin');
    } finally {
      setLoading(false);
    }
  };

  const handlePluginInstall = async (plugin: PluginDefinition) => {
    setLoading(true);
    setError(null);
    
    try {
      const registry = getPluginRegistry();
      if (!registry) throw new Error('Plugin registry not available');

      const options: PluginInstallOptions = {
        source: 'file',
        autoActivate: true,
        dependencies: true
      };

      const result: PluginInstallResult = await registry.install(plugin, options);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to install plugin');
      }
      
      await loadPluginData();
      
      if (result.plugin) {
        onPluginActivated?.(result.plugin);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to install plugin');
    } finally {
      setLoading(false);
    }
  };

  const handlePluginUninstall = async (pluginId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const registry = getPluginRegistry();
      if (!registry) throw new Error('Plugin registry not available');

      await registry.uninstall(pluginId);
      await loadPluginData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to uninstall plugin');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlugins = installedPlugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const marketplacePlugins = samplePlugins.filter(plugin => 
    !installedPlugins.some(installed => installed.id === plugin.id)
  );

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
          className="bg-white rounded-lg shadow-xl w-[90%] max-w-4xl h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Plugin Manager</h2>
              <p className="text-gray-600">
                {pluginStats.total} plugins installed, {pluginStats.active} active
              </p>
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

          {/* Stats Overview */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{pluginStats.total}</div>
                <div className="text-sm text-gray-600">Total Plugins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{pluginStats.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.values(pluginStats.categories).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(pluginStats.categories).map(([category, count]) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {category}: {count}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex">
              {[
                { id: 'installed', label: 'Installed', count: pluginStats.total },
                { id: 'marketplace', label: 'Marketplace', count: marketplacePlugins.length },
                { id: 'settings', label: 'Settings', count: 0 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Search and Filters */}
            {(activeTab === 'installed' || activeTab === 'marketplace') && (
              <div className="p-4 border-b bg-white">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search plugins..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="component">Component</option>
                    <option value="theme">Theme</option>
                    <option value="tool">Tool</option>
                    <option value="export">Export</option>
                    <option value="validation">Validation</option>
                    <option value="utility">Utility</option>
                  </select>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'installed' && (
                <InstalledPluginsTab
                  plugins={filteredPlugins}
                  activePlugins={activePlugins}
                  onToggle={handlePluginToggle}
                  onUninstall={handlePluginUninstall}
                  loading={loading}
                />
              )}

              {activeTab === 'marketplace' && (
                <MarketplaceTab
                  plugins={marketplacePlugins.filter(plugin => {
                    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
                    return matchesSearch && matchesCategory;
                  })}
                  onInstall={handlePluginInstall}
                  loading={loading}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsTab />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Installed Plugins Tab Component
 */
interface InstalledPluginsTabProps {
  plugins: PluginDefinition[];
  activePlugins: Set<string>;
  onToggle: (plugin: PluginDefinition) => void;
  onUninstall: (pluginId: string) => void;
  loading: boolean;
}

function InstalledPluginsTab({ 
  plugins, 
  activePlugins, 
  onToggle, 
  onUninstall, 
  loading 
}: InstalledPluginsTabProps) {
  if (plugins.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🧩</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No plugins installed</h3>
        <p className="text-gray-600 mb-4">Browse the marketplace to install plugins</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {plugins.map((plugin) => (
        <PluginCard
          key={plugin.id}
          plugin={plugin}
          isActive={activePlugins.has(plugin.id)}
          isInstalled={true}
          onToggle={() => onToggle(plugin)}
          onUninstall={() => onUninstall(plugin.id)}
          loading={loading}
        />
      ))}
    </div>
  );
}

/**
 * Marketplace Tab Component
 */
interface MarketplaceTabProps {
  plugins: PluginDefinition[];
  onInstall: (plugin: PluginDefinition) => void;
  loading: boolean;
}

function MarketplaceTab({ plugins, onInstall, loading }: MarketplaceTabProps) {
  if (plugins.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏪</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No plugins available</h3>
        <p className="text-gray-600">All available plugins are already installed</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {plugins.map((plugin) => (
        <PluginCard
          key={plugin.id}
          plugin={plugin}
          isActive={false}
          isInstalled={false}
          onInstall={() => onInstall(plugin)}
          loading={loading}
        />
      ))}
    </div>
  );
}

/**
 * Settings Tab Component
 */
function SettingsTab() {
  const [settings, setSettings] = useState({
    autoUpdate: true,
    allowBeta: false,
    sandboxMode: true,
    analyticsEnabled: false
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plugin Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto-update plugins</label>
              <p className="text-sm text-gray-500">Automatically update plugins when new versions are available</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoUpdate}
                onChange={(e) => setSettings(prev => ({ ...prev, autoUpdate: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Allow beta plugins</label>
              <p className="text-sm text-gray-500">Enable installation of beta and experimental plugins</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowBeta}
                onChange={(e) => setSettings(prev => ({ ...prev, allowBeta: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Sandbox mode</label>
              <p className="text-sm text-gray-500">Run plugins in secure sandboxed environment</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sandboxMode}
                onChange={(e) => setSettings(prev => ({ ...prev, sandboxMode: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Only install plugins from trusted sources. Plugins run with elevated permissions and can access your editor data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Plugin Card Component
 */
interface PluginCardProps {
  plugin: PluginDefinition;
  isActive: boolean;
  isInstalled: boolean;
  onToggle?: () => void;
  onInstall?: () => void;
  onUninstall?: () => void;
  loading: boolean;
}

function PluginCard({ 
  plugin, 
  isActive, 
  isInstalled, 
  onToggle, 
  onInstall, 
  onUninstall, 
  loading 
}: PluginCardProps) {
  const categoryColors = {
    component: 'bg-blue-100 text-blue-800',
    theme: 'bg-purple-100 text-purple-800',
    tool: 'bg-green-100 text-green-800',
    export: 'bg-orange-100 text-orange-800',
    validation: 'bg-red-100 text-red-800',
    utility: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{plugin.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{plugin.name}</h3>
              <p className="text-sm text-gray-500">v{plugin.version} by {plugin.author}</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-3">{plugin.description}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[plugin.category]}`}>
              {plugin.category}
            </span>
            {isActive && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Active
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {plugin.permissions.map((permission) => (
              <span
                key={permission}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                title={`Requires ${permission} permission`}
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          {isInstalled ? (
            <>
              <button
                onClick={onToggle}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } disabled:opacity-50`}
              >
                {loading ? '...' : isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={onUninstall}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Uninstall
              </button>
            </>
          ) : (
            <button
              onClick={onInstall}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Installing...' : 'Install'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}