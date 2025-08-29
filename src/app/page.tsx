'use client'

import React, { useState, useEffect, useRef } from 'react'
import './figma-ui.css'
import MoveableEditor, { MoveableEditorHandle } from '../dev/editor/MoveableEditor'

interface RestaurantOption {
  id: string
  name: string
  file: string
}

interface SkinOption {
  id: string
  name: string
  version: string
  description: string
}

export default function Home() {
  // UI state (declare first)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('templates')
  
  // Design mode states
  const [isDesignMode, setIsDesignMode] = useState(false)
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'color' | 'image' | 'link' | 'shape'>('select')
  const [colorMode, setColorMode] = useState<'box' | 'font'>('box')
  const [selectedColor, setSelectedColor] = useState('#000000')

  // Core app states
  const [selectedSkin, setSelectedSkin] = useState<string>('') 
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean | string>(false)
  const [error, setError] = useState<string>('')
  const [demoGenerated, setDemoGenerated] = useState(false)
  const [skinLoaded, setSkinLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [availableSkins, setAvailableSkins] = useState<SkinOption[]>([])
  const [loadingSkins, setLoadingSkins] = useState(true)
  const [availableRestaurants, setAvailableRestaurants] = useState<RestaurantOption[]>([])
  const [loadingRestaurants, setLoadingRestaurants] = useState(true)
  const [restaurantData, setRestaurantData] = useState<any>(null)
  const editorRef = useRef<MoveableEditorHandle>(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  
  // Simplified - only one template type
  const [templateType] = useState<'skin'>('skin')
  
  // Enhanced UX states
  const [skinPreviews, setSkinPreviews] = useState<Record<string, string>>({})
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Helper function to validate slug values
  const isValidSlug = (v: any): v is string =>
    typeof v === 'string' && v.trim() !== '' && v !== 'null' && v !== 'undefined';
  const safeRestaurant = isValidSlug(selectedRestaurant) ? selectedRestaurant : null;

  // Menu display controls (foundation for schema-driven display)
  const [menuDisplay, setMenuDisplay] = useState({
    showImages: true,
    imageMode: 'from-data' as 'from-data' | 'static-path',
    imagesBasePath: '/images/menu',
    variant: 'grid-photos' as 'grid-photos' | 'table-clean' | 'cards-compact',
    paginateThreshold: 8,
    showDescriptions: true,
    paginationMode: 'items' as 'items' | 'category',
    itemsPerRow: 3,
    grid: {
      columns: 3,
      imageShape: 'boxed' as 'boxed' | 'rounded' | 'circle'
    }
  })

  // Render preview content for shadow DOM
  // Removed renderPreviewContent - using iframe approach

  // Hero carousel images
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Restaurant interior atmosphere"
    },
    {
      url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Delicious Middle Eastern dish"
    },
    {
      url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Elegant restaurant ambiance"
    },
    {
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Chef preparing traditional cuisine"
    }
  ]

  // Load skin CSS dynamically
  const loadSkinCSS = (skinId: string) => {
    // Only run on client side
    if (typeof window === 'undefined') return

    try {
      // Remove ALL existing skin CSS (not just the one with id)
      const existingLinks = document.querySelectorAll('link[href*="/api/skins/"]')
      existingLinks.forEach(link => link.remove())

      if (skinId) {
        // Add cache-busting timestamp to force reload
        const timestamp = Date.now()
        
        // Create new link element for skin CSS
        const link = document.createElement('link')
        link.id = 'skin-css'
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = `/api/skins/${skinId}/css?t=${timestamp}`
        link.onload = () => {
          console.log(`✓ Loaded skin CSS: ${skinId}`)
          setSkinLoaded(true)
        }
        link.onerror = () => {
          console.warn(`Failed to load skin CSS: ${skinId}`)
          setSkinLoaded(false)
        }
        document.head.appendChild(link)
      }
    } catch (error) {
      console.error('Error loading skin CSS:', error)
      setSkinLoaded(false)
    }
  }

  // Load skin CSS when selectedSkin changes
  useEffect(() => {
    if (selectedSkin) {
      setSkinLoaded(false)
      loadSkinCSS(selectedSkin)
    } else {
      setSkinLoaded(false)
      // Remove any existing skin CSS
      const existingLinks = document.querySelectorAll('link[href*="/api/skins/"]')
      existingLinks.forEach(link => link.remove())
    }
  }, [selectedSkin])

  // Force iframe reload when skin changes (simplified)
  useEffect(() => {
    if (demoGenerated && selectedSkin && safeRestaurant) {
      const timer = setTimeout(() => {
        const iframe = document.querySelector('iframe[title="Website Preview"]') as HTMLIFrameElement
        if (iframe) {
          const baseSrc = `/restaurant/${safeRestaurant}`
          iframe.src = `${baseSrc}?preview=true&skin=${selectedSkin}&t=${Date.now()}`
          console.log(`🔄 Updated iframe src: ${iframe.src}`)
        }
      }, 500) // Small delay to ensure skin CSS is loaded
      
      return () => clearTimeout(timer)
    }
    
    // Return undefined for cases where the condition is not met
    return undefined
  }, [selectedSkin, demoGenerated, safeRestaurant])

  // Load available skins on component mount
  useEffect(() => {
    const loadSkins = async () => {
      try {
        setLoadingSkins(true)
        const response = await fetch('/api/skins')
        const data = await response.json()
        
        if (data.success && data.skins) {
          setAvailableSkins(data.skins)
          console.log(`🎨 Loaded ${data.skins.length} skins:`, data.skins.map(s => s.name))
        } else {
          console.error('Failed to load skins:', data.error)
          setError('Failed to load available templates')
        }
      } catch (error) {
        console.error('Error fetching skins:', error)
        setError('Error loading templates')
      } finally {
        setLoadingSkins(false)
      }
    }

    loadSkins()
  }, [])

  // Load available restaurants on component mount
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoadingRestaurants(true)
        const response = await fetch('/api/restaurants')
        const data = await response.json()
        
        if (data.success && data.restaurants) {
          setAvailableRestaurants(data.restaurants)
          console.log(`🍽️ Loaded ${data.restaurants.length} restaurants:`, data.restaurants.map(r => r.name))
        } else {
          console.error('Failed to load restaurants:', data.error)
          setError('Failed to load available restaurants')
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error)
        setError('Error loading restaurants')
      } finally {
        setLoadingRestaurants(false)
      }
    }

    loadRestaurants()
  }, [])

  // Load restaurant data when selection changes
  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!isValidSlug(selectedRestaurant)) {
        setRestaurantData(null)
        return
      }

      try {
        const restaurant = availableRestaurants.find(r => r.id === selectedRestaurant)
        if (!restaurant) return

        const response = await fetch('/api/restaurants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: restaurant.file })
        })
        
        const data = await response.json()
        if (data.success && data.data) {
          setRestaurantData(data.data)
          console.log(`📊 Loaded data for ${restaurant.name}:`, data.data.restaurant_info?.name)
        } else {
          console.error('Failed to load restaurant data:', data.error)
          setError('Failed to load restaurant data')
        }
      } catch (error) {
        console.error('Error loading restaurant data:', error)
        setError('Error loading restaurant data')
      }
    }

    loadRestaurantData()
  }, [selectedRestaurant, availableRestaurants])

  // Removed loadMappings - using iframe approach, no need for shadow DOM mappings

  // Reset selected category when restaurant changes
  useEffect(() => {
    setSelectedCategory('all')
    setCurrentPage({})
  }, [selectedRestaurant])

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔍 State update:', {
      selectedSkin: `"${selectedSkin}"`,
      selectedRestaurant: `"${selectedRestaurant}"`,
      buttonDisabled: !selectedSkin || !selectedRestaurant
    });
  }, [selectedSkin, selectedRestaurant]);

  // Auto-rotate hero images
  useEffect(() => {
    if (demoGenerated) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        )
      }, 4000) // Change image every 4 seconds

      return () => clearInterval(interval)
    }
    return undefined
  }, [demoGenerated, heroImages.length])

  // Removed keyboard shortcuts - simplified editor approach

  const generateSite = async () => {
    if (!selectedSkin || !selectedRestaurant) {
      setError('Please select both a skin and restaurant')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const selectedRestaurantData = availableRestaurants.find(r => r.id === selectedRestaurant)
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skinId: selectedSkin,
          restaurantId: selectedRestaurant,
          restaurantFile: selectedRestaurantData?.file,
          displayConfig: menuDisplay,
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setDemoGenerated(true)
        // Load restaurant data for preview
        try {
          const restaurantResponse = await fetch(`/api/restaurants/${selectedRestaurant}`)
          if (restaurantResponse.ok) {
            const restaurantDataResult = await restaurantResponse.json()
            setRestaurantData(restaurantDataResult)
          }
        } catch (err) {
          console.log('Failed to load restaurant data for preview:', err)
        }
      } else {
        setError(`Generation failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      setError(`Network error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // Removed auto-save functionality - simplified editor approach

  // Simplified editor - no complex handlers needed

  // Removed standalone site generation - simplified to single template system

  return (
    <div className="figma-workspace">
      {/* Modern Top Header */}
      <div className="figma-header">
        <div className="header-left">
          <div className="logo-area">
            <div className="logo-icon">🎨</div>
            <h1 className="app-title">Website Studio</h1>
          </div>
          <div className="workspace-tabs">
            <button 
              className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              <span className="tab-icon">🎯</span>
              Templates
            </button>
            <button 
              className={`tab ${activeTab === 'design' ? 'active' : ''}`}
              onClick={() => setActiveTab('design')}
              disabled={!demoGenerated}
            >
              <span className="tab-icon">🎨</span>
              Design
            </button>
            <button 
              className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
              disabled={!demoGenerated}
            >
              <span className="tab-icon">👁️</span>
              Preview
            </button>
          </div>
        </div>
        <div className="header-right">
          <button
            className="action-btn secondary"
            onClick={() => window.location.reload()}
            disabled={!demoGenerated}
          >
            <span className="btn-icon">🔄</span>
            Reset
          </button>
          <button className="action-btn primary">
            <span className="btn-icon">🚀</span>
            Export
          </button>
          <button
            className="action-btn secondary"
            onClick={() => {
              console.log('Save functionality will be implemented in SimpleEditor')
            }}
            disabled={!demoGenerated}
          >
            <span className="btn-icon">💾</span>
            Save
          </button>
        </div>
      </div>

      {/* Modern Workspace Layout */}
      <div className="figma-workspace-content">
        {/* Left Sidebar */}
        <div className={`figma-sidebar left ${leftPanelOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <button 
              className="sidebar-toggle"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            >
              {leftPanelOpen ? '◀' : '▶'}
            </button>
            <h3 className="sidebar-title">
              {activeTab === 'templates' ? 'Templates' : activeTab === 'design' ? 'Design Tools' : 'Components'}
            </h3>
          </div>
          
          {leftPanelOpen && (
            <div className="sidebar-content">
              {/* Templates Tab Content */}
              {activeTab === 'templates' && (
                <>
                  {/* Template Selection */}
                  <div className="panel-section">
                    <div className="section-header">
                      <span className="section-icon">🎨</span>
                      <span className="section-title">Templates</span>
                      {loadingSkins && <span className="loading-indicator">⌛</span>}
                    </div>
                    <div className="settings-group">
                      <div className="setting-row">
                        <select
                          value={selectedSkin}
                          onChange={(e) => {
                            console.log('🎨 Template selected:', e.target.value);
                            setSelectedSkin(e.target.value);
                          }}
                          disabled={loadingSkins}
                          className="setting-select"
                          style={{width: '100%', padding: '12px', fontSize: '13px'}}
                        >
                          <option value="">{loadingSkins ? 'Loading templates...' : 'Choose a template...'}</option>
                          {availableSkins.map(skin => (
                            <option key={skin.id} value={skin.id}>
                              {skin.name} v{skin.version}
                            </option>
                          ))}
                        </select>
                        {selectedSkin && (
                          <div style={{marginTop: '8px', fontSize: '11px', color: 'var(--figma-text-muted)'}}>
                            {availableSkins.find(s => s.id === selectedSkin)?.description}
                            {skinLoaded ? ' ✓ Loaded' : ' Loading...'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Restaurant Selection */}
                  <div className="panel-section">
                    <div className="section-header">
                      <span className="section-icon">🍽️</span>
                      <span className="section-title">Restaurant Data</span>
                      {loadingRestaurants && <span className="loading-indicator">⌛</span>}
                    </div>
                    <div className="settings-group">
                      <div className="setting-row">
                        <select
                          value={selectedRestaurant}
                          onChange={(e) => {
                            console.log('🍽️ Restaurant selected:', e.target.value);
                            setSelectedRestaurant(e.target.value);
                          }}
                          disabled={loadingRestaurants}
                          className="setting-select"
                          style={{width: '100%', padding: '12px', fontSize: '13px'}}
                        >
                          <option value="">{loadingRestaurants ? 'Loading restaurants...' : 'Choose a restaurant...'}</option>
                          {availableRestaurants.map(restaurant => (
                            <option key={restaurant.id} value={restaurant.id}>
                              🍴 {restaurant.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Design Tab Content */}
              {activeTab === 'design' && (
                <div className="panel-section">
                  <div className="section-header">
                    <span className="section-icon">🛠️</span>
                    <span className="section-title">Design Mode</span>
                  </div>
                  <div className="section-content">
                    <p style={{fontSize: '12px', color: 'var(--figma-text-secondary)', lineHeight: '1.5'}}>
                      Use the tools at the bottom of the screen to edit your website:
                    </p>
                    <ul style={{fontSize: '12px', color: 'var(--figma-text-secondary)', lineHeight: '1.8', paddingLeft: '20px', marginTop: '8px'}}>
                      <li>👆 Select - Click elements to select</li>
                      <li>📝 Text - Click text to edit</li>
                      <li>🎨 Color - Change colors</li>
                      <li>🖼️ Image - Replace images</li>
                      <li>🔗 Link - Edit link URLs</li>
                      <li>📐 Shape - Add shapes</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Error Display */}
              {error && (
                <div className="panel-section">
                  <div style={{padding: '16px', background: 'rgba(248, 81, 73, 0.1)', border: '1px solid rgba(248, 81, 73, 0.2)', borderRadius: '8px'}}>
                    <div style={{color: 'var(--figma-error)', fontSize: '12px'}}>{error}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="figma-canvas">
          <div className="canvas-header">
            <div className="canvas-controls">
              <button className="canvas-btn" title="Zoom Out">-</button>
              <span className="zoom-level">100%</span>
              <button className="canvas-btn" title="Zoom In">+</button>
            </div>
            {activeTab === 'design' && demoGenerated && (
              <div className="editor-toolbar">
                {/* Tool Buttons */}
                <div className="tool-group">
                  <button
                    onClick={() => setActiveTool('select')}
                    className={`toolbar-btn tool ${activeTool === 'select' ? 'active' : ''}`}
                    title="Select Tool"
                  >
                    👆 Select
                  </button>
                  <button
                    onClick={() => setActiveTool('text')}
                    className={`toolbar-btn tool ${activeTool === 'text' ? 'active' : ''}`}
                    title="Text Tool"
                  >
                    📝 Text
                  </button>
                  <button
                    onClick={() => setActiveTool('color')}
                    className={`toolbar-btn tool ${activeTool === 'color' ? 'active' : ''}`}
                    title="Color Tool"
                  >
                    🎨 Color
                  </button>
                  <button
                    onClick={() => setActiveTool('image')}
                    className={`toolbar-btn tool ${activeTool === 'image' ? 'active' : ''}`}
                    title="Image Tool"
                  >
                    🖼️ Image
                  </button>
                  <button
                    onClick={() => setActiveTool('link')}
                    className={`toolbar-btn tool ${activeTool === 'link' ? 'active' : ''}`}
                    title="Link Tool"
                  >
                    🔗 Link
                  </button>
                  <button
                    onClick={() => setActiveTool('shape')}
                    className={`toolbar-btn tool ${activeTool === 'shape' ? 'active' : ''}`}
                    title="Shape Tool"
                  >
                    📐 Shape
                  </button>
                </div>
                
                {/* Separator */}
                <div className="toolbar-separator"></div>
                
                {/* History Buttons */}
                <div className="history-group">
                  <button 
                    onClick={() => editorRef.current?.undo()}
                    disabled={!canUndo}
                    className="toolbar-btn"
                    title="Undo"
                  >
                    ↶ Undo
                  </button>
                  <button 
                    onClick={() => editorRef.current?.redo()}
                    disabled={!canRedo}
                    className="toolbar-btn"
                    title="Redo"
                  >
                    ↷ Redo
                  </button>
                  <button 
                    onClick={() => editorRef.current?.save()}
                    className="toolbar-btn primary"
                    title="Save Changes"
                  >
                    💾 Save
                  </button>
                </div>
                
                {/* Color Palette - shows when color tool is active */}
                {activeTool === 'color' && (
                  <div className="color-palette-container">
                    <div className="color-mode-toggle">
                      <button
                        onClick={() => setColorMode('box')}
                        className={`mode-btn ${colorMode === 'box' ? 'active' : ''}`}
                      >
                        Box
                      </button>
                      <button
                        onClick={() => setColorMode('font')}
                        className={`mode-btn ${colorMode === 'font' ? 'active' : ''}`}
                      >
                        Font
                      </button>
                    </div>
                    <div className="color-grid">
                      {[
                        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                        '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#FFA500',
                        '#800080', '#FFC0CB', '#A52A2A', '#008000', '#000080'
                      ].map(color => (
                        <button
                          key={color}
                          className="color-swatch"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            setSelectedColor(color);
                            if (editorRef.current) {
                              (editorRef.current as any).applyColor?.(color, colorMode);
                            }
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="canvas-actions">
              <button 
                onClick={() => {
                  console.log('🚀 Generate button clicked!', {
                    selectedSkin,
                    selectedRestaurant,
                    disabled: !selectedSkin || !selectedRestaurant || isGenerating
                  });
                  generateSite();
                }}
                disabled={!selectedSkin || !selectedRestaurant || !!isGenerating}
                className="generate-btn"
              >
                <span className="btn-icon">🚀</span>
                {isGenerating ? 'Generating...' : 'Generate Website'}
              </button>
            </div>
          </div>


          {/* Canvas Content */}
          <div className="canvas-content">
            {/* Templates Tab - Generation Interface */}
            {activeTab === 'templates' && (
              <>
                {demoGenerated ? (
                  <div className="preview-frame">
                    <div className="preview-content" style={{
                      backgroundColor: 'white',
                      borderRadius: '0',
                      margin: '0',
                      padding: '0',
                      overflow: 'hidden',
                      height: '100%',
                      width: '100%',
                      position: 'relative',
                      flex: 1
                    }}>
                      <iframe
                        src={safeRestaurant
                          ? `/restaurant/${safeRestaurant}?preview=true&skin=${selectedSkin}&menuVariant=${encodeURIComponent(menuDisplay.variant)}&menuShowImages=${menuDisplay.showImages}&menuShowDescriptions=${menuDisplay.showDescriptions}&menuItemsPerRow=${menuDisplay.itemsPerRow}`
                          : 'about:blank'}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          backgroundColor: 'white'
                        }}
                        title="Website Preview"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">🎨</div>
                    <div className="empty-state-title">Ready to Create</div>
                    <div className="empty-state-desc">
                      Select a template and restaurant data to generate your website preview
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '16px', justifyContent: 'center', fontSize: '12px', color: 'var(--figma-text-muted)' }}>
                      <span>🎨 {availableSkins.length} templates</span>
                      <span>🍽️ {availableRestaurants.length} restaurants</span>
                      <span>📱 Local data only</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Design Tab - Design Interface */}
            {activeTab === 'design' && demoGenerated && (
              <div className="design-frame">
                <div className="design-content" style={{
                  backgroundColor: 'white',
                  borderRadius: '0',
                  margin: '0',
                  padding: '0',
                  overflow: 'hidden',
                  height: '100%',
                  width: '100%',
                  position: 'relative',
                  flex: 1
                }}>
                  <iframe
                    src={safeRestaurant
                      ? `/restaurant/${safeRestaurant}?skin=${selectedSkin}&menuVariant=${encodeURIComponent(menuDisplay.variant)}&menuShowImages=${menuDisplay.showImages}&menuShowDescriptions=${menuDisplay.showDescriptions}&menuItemsPerRow=${menuDisplay.itemsPerRow}&design=true`
                      : 'about:blank'}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      backgroundColor: 'white'
                    }}
                    title="Design Mode"
                    id="design-iframe"
                  />
                  
                  {/* Moveable Editor Overlay */}
                  <MoveableEditor
                    ref={editorRef}
                    iframeId="design-iframe"
                    skinId={selectedSkin}
                    restaurantId={selectedRestaurant}
                    activeTool={activeTool}
                    colorMode={colorMode}
                    selectedColor={selectedColor}
                    onHistoryChange={(undo, redo) => {
                      setCanUndo(undo)
                      setCanRedo(redo)
                    }}
                  />
                </div>
              </div>
            )}

            {/* Preview Tab - Opens in new window */}
            {activeTab === 'preview' && demoGenerated && (
              <div className="empty-state">
                <div className="empty-state-icon">👁️</div>
                <div className="empty-state-title">Preview Mode</div>
                <div className="empty-state-desc">
                  Your website preview will open in a new window
                </div>
                <div style={{ marginTop: '30px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button 
                    className="action-btn primary"
                    onClick={() => {
                      if (safeRestaurant) window.open(`/restaurant/${safeRestaurant}?skin=${selectedSkin}&preview=true&device=desktop`, '_blank')
                    }}
                  >
                    <span className="btn-icon">🖥️</span>
                    Desktop Preview
                  </button>
                  <button 
                    className="action-btn primary"
                    onClick={() => {
                      if (safeRestaurant) window.open(`/restaurant/${safeRestaurant}?skin=${selectedSkin}&preview=true&device=tablet`, '_blank')
                    }}
                  >
                    <span className="btn-icon">📱</span>
                    Tablet Preview
                  </button>
                  <button 
                    className="action-btn primary"
                    onClick={() => {
                      if (safeRestaurant) window.open(`/restaurant/${safeRestaurant}?skin=${selectedSkin}&preview=true&device=mobile`, '_blank')
                    }}
                  >
                    <span className="btn-icon">📲</span>
                    Mobile Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`figma-sidebar right ${rightPanelOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h3 className="sidebar-title">
              {activeTab === 'design' ? 'Element Properties' : 'Settings'}
            </h3>
            <button 
              className="sidebar-toggle"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
            >
              {rightPanelOpen ? '▶' : '◀'}
            </button>
          </div>
          
          {rightPanelOpen && (
            <div className="sidebar-content">
              {/* Templates Tab - Menu Settings */}
              {activeTab === 'templates' && (
                <div className="panel-section">
                  <div className="section-header">
                    <span className="section-icon">⚙️</span>
                    <span className="section-title">Menu Settings</span>
                  </div>
                  <div className="settings-group">
                    <div className="setting-row">
                      <label className="setting-label">Layout Style</label>
                      <select
                        value={menuDisplay.variant}
                        onChange={(e) => setMenuDisplay(d => ({ ...d, variant: e.target.value as any }))}
                        className="setting-select"
                      >
                        <option value="grid-photos">Grid with Photos</option>
                        <option value="table-clean">Clean Table</option>
                        <option value="cards-compact">Compact Cards</option>
                      </select>
                    </div>
                    
                    <div className="setting-row">
                      <label className="setting-label">Items per Row</label>
                      <select
                        value={menuDisplay.itemsPerRow}
                        onChange={(e) => setMenuDisplay(d => ({ ...d, itemsPerRow: parseInt(e.target.value) }))}
                        className="setting-select"
                      >
                        <option value="2">2 Items</option>
                        <option value="3">3 Items</option>
                        <option value="4">4 Items</option>
                      </select>
                    </div>
                    
                    <div className="setting-row">
                      <label className="setting-toggle">
                        <input
                          type="checkbox"
                          checked={menuDisplay.showImages}
                          onChange={(e) => setMenuDisplay(d => ({ ...d, showImages: e.target.checked }))}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">Show Menu Photos</span>
                      </label>
                    </div>
                    
                    <div className="setting-row">
                      <label className="setting-toggle">
                        <input
                          type="checkbox"
                          checked={menuDisplay.showDescriptions}
                          onChange={(e) => setMenuDisplay(d => ({ ...d, showDescriptions: e.target.checked }))}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">Show Descriptions</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Simplified Design Info */}
              {activeTab === 'design' && demoGenerated && (
                <div className="panel-section">
                  <div className="section-header">
                    <span className="section-icon">ℹ️</span>
                    <span className="section-title">Info</span>
                  </div>
                  <div style={{padding: '16px', fontSize: '12px', color: 'var(--figma-text-muted)', textAlign: 'center'}}>
                    <p>Use the tools at the bottom to edit your website.</p>
                    <p>Changes are saved automatically.</p>
                  </div>
                </div>
              )}


              {/* Preview Tab - Preview Options */}
              {activeTab === 'preview' && demoGenerated && (
                <div className="panel-section">
                  <div className="section-header">
                    <span className="section-icon">👁️</span>
                    <span className="section-title">Preview Options</span>
                  </div>
                  <div className="settings-group">
                    <div className="setting-row">
                      <label className="setting-label">Device View</label>
                      <select className="setting-select">
                        <option value="desktop">Desktop (1920px)</option>
                        <option value="tablet">Tablet (768px)</option>
                        <option value="mobile">Mobile (375px)</option>
                      </select>
                    </div>
                    <div className="setting-row">
                      <button 
                        className="action-btn-full"
                        onClick={() => {
                          if (safeRestaurant) window.open(`/api/preview/${safeRestaurant}?skin=${selectedSkin}`, '_blank')
                        }}
                      >
                        🔗 Open in New Window
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Project Status - Compact Version */}
              {demoGenerated && (
                <div className="panel-section">
                  <div className="section-header">
                    <span className="section-icon">📊</span>
                    <span className="section-title">Status</span>
                  </div>
                  <div className="status-compact">
                    <div className="status-item">
                      <span className="status-label">Template:</span>
                      <span className="status-value">{availableSkins.find(s => s.id === selectedSkin)?.name}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Restaurant:</span>
                      <span className="status-value">{availableRestaurants.find(r => r.id === selectedRestaurant)?.name}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
