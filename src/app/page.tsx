'use client'

import React, { useState, useEffect, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

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
  
  // Template type toggle
  const [templateType, setTemplateType] = useState<'skin' | 'standalone'>('skin')
  const [selectedStandalone, setSelectedStandalone] = useState<string>('')
  
  // Enhanced UX states
  const [isVisualEditorActive, setIsVisualEditorActive] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState('default')
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({})
  const [editableElements, setEditableElements] = useState<string[]>([])
  const [skinPreviews, setSkinPreviews] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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
      // Remove existing skin CSS
      const existingLink = document.getElementById('skin-css') as HTMLLinkElement
      if (existingLink) {
        existingLink.remove()
      }

      if (skinId) {
        // Create new link element for skin CSS
        const link = document.createElement('link')
        link.id = 'skin-css'
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = `/api/skins/${skinId}/css`
        link.onload = () => setSkinLoaded(true)
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
      const existingLink = document.getElementById('skin-css') as HTMLLinkElement
      if (existingLink) {
        existingLink.remove()
      }
    }
  }, [selectedSkin])

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
      if (!selectedRestaurant) {
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
      } else {
        setError(`Generation failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      setError(`Network error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateStandaloneSite = async (deploymentType: 'dev' | 'static' | 'build' = 'dev') => {
    if (!selectedStandalone || !selectedRestaurant) {
      setError('Please select both a template and restaurant')
      return
    }

    setIsGenerating(`${deploymentType === 'dev' ? 'Starting development server' : 
                     deploymentType === 'static' ? 'Building static export' : 
                     'Building production version'}`)
    setError('')

    try {
      const selectedRestaurantData = availableRestaurants.find(r => r.id === selectedRestaurant)
      
      const response = await fetch('/api/generate/standalone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedStandalone,
          restaurantId: selectedRestaurant,
          restaurantFile: selectedRestaurantData?.file,
          deploymentType,
          generateStatic: deploymentType === 'static',
          buildProduction: deploymentType === 'build'
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setDemoGenerated(true)
      } else {
        setError(`Generation failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      setError(`Network error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Control Panel */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 
            className="text-3xl font-bold text-gray-900 mb-6 cursor-pointer"
            onClick={() => {
              console.log('🔍 JavaScript is working! State check:', { selectedSkin, selectedRestaurant });
              alert(`JS Working! Skin: "${selectedSkin}", Restaurant: "${selectedRestaurant}"`);
            }}
            title="Click to test JavaScript execution"
          >
            Restaurant Website Generator
          </h1>
          <p className="text-gray-600 mb-6">
            Component Kit + Skin System - Current Phase: Local JSON Only
          </p>
          
          {/* Template Type Toggle */}
          <div className="mb-6">
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1">
              <button
                onClick={() => setTemplateType('skin')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  templateType === 'skin'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Skin Templates
              </button>
              <button
                onClick={() => setTemplateType('standalone')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  templateType === 'standalone'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Standalone Templates
              </button>
            </div>
          </div>
          
          {templateType === 'skin' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Skin Selection */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Skin {loadingSkins && '(Loading...)'}
              </label>
              <select
                value={selectedSkin}
                onChange={(e) => {
                  console.log('🎨 Skin selection changed:', e.target.value);
                  setSelectedSkin(e.target.value);
                }}
                disabled={loadingSkins}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">{loadingSkins ? 'Loading templates...' : 'Choose a skin...'}</option>
                {availableSkins.map(skin => (
                  <option key={skin.id} value={skin.id}>
                    {skin.name} v{skin.version}
                  </option>
                ))}
              </select>
              {selectedSkin && (
                <p className="mt-1 text-xs text-gray-500">
                  {availableSkins.find(s => s.id === selectedSkin)?.description}
                  {skinLoaded ? ' ✓ Loaded' : ' Loading...'}
                </p>
              )}
            </div>

            {/* Restaurant Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Restaurant {loadingRestaurants && '(Loading...)'}
              </label>
              <select
                value={selectedRestaurant}
                onChange={(e) => {
                  console.log('🍽️ Restaurant selection changed:', e.target.value);
                  setSelectedRestaurant(e.target.value);
                }}
                disabled={loadingRestaurants}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">{loadingRestaurants ? 'Loading restaurants...' : 'Choose a restaurant...'}</option>
                {availableRestaurants.map(restaurant => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Menu Display Options */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menu Display Configuration
              </label>
              <div className="p-3 border border-gray-200 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Layout Variant */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Layout Style</label>
                    <select
                      value={menuDisplay.variant}
                      onChange={(e) => setMenuDisplay(d => ({ ...d, variant: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="grid-photos">Grid with Photos</option>
                      <option value="table-clean">Clean Table Layout</option>
                      <option value="cards-compact">Compact Cards</option>
                    </select>
                  </div>

                  {/* Items Per Row */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Items per Row</label>
                    <select
                      value={menuDisplay.itemsPerRow}
                      onChange={(e) => setMenuDisplay(d => ({ ...d, itemsPerRow: parseInt(e.target.value) }))}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="2">2 Items</option>
                      <option value="3">3 Items</option>
                      <option value="4">4 Items</option>
                      <option value="5">5 Items</option>
                    </select>
                  </div>
                </div>

                {/* Image Options */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={menuDisplay.showImages}
                      onChange={(e) => setMenuDisplay(d => ({ ...d, showImages: e.target.checked }))}
                    />
                    <span className="text-sm text-gray-700">Show Menu Photos</span>
                  </label>

                  {menuDisplay.showImages && (
                    <div className="ml-6 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Grid Columns</label>
                        <select
                          value={menuDisplay.grid.columns}
                          onChange={(e) => setMenuDisplay(d => ({ 
                            ...d, 
                            grid: { ...d.grid, columns: parseInt(e.target.value) },
                            itemsPerRow: parseInt(e.target.value)
                          }))}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="2">2 Columns</option>
                          <option value="3">3 Columns</option>
                          <option value="4">4 Columns</option>
                          <option value="5">5 Columns</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Image Shape</label>
                        <select
                          value={menuDisplay.grid.imageShape}
                          onChange={(e) => setMenuDisplay(d => ({ 
                            ...d, 
                            grid: { ...d.grid, imageShape: e.target.value as any }
                          }))}
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="boxed">Boxed</option>
                          <option value="rounded">Rounded</option>
                          <option value="circle">Circle</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Items per page */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Items per page (0 = all)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={menuDisplay.paginateThreshold}
                      onChange={(e) => setMenuDisplay(d => ({ ...d, paginateThreshold: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="8"
                    />
                  </div>
                </div>

                {/* Other Options */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={menuDisplay.showDescriptions}
                    onChange={(e) => setMenuDisplay(d => ({ ...d, showDescriptions: e.target.checked }))}
                  />
                  <span className="text-sm text-gray-700">Show Item Descriptions</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
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
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate Website'}
              </button>
            </div>
          </div>
          )}

          {/* Stats */}
          {demoGenerated && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-800 font-semibold">Skin</div>
                <div className="text-blue-600">{availableSkins.find(s => s.id === selectedSkin)?.name}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-green-800 font-semibold">CSS Size</div>
                <div className="text-green-600">32KB</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-purple-800 font-semibold">Components</div>
                <div className="text-purple-600">10</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-orange-800 font-semibold">Restaurant</div>
                <div className="text-orange-600">{availableRestaurants.find(r => r.id === selectedRestaurant)?.name}</div>
              </div>
            </div>
          )}
          
          {templateType === 'standalone' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Standalone Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Template
                </label>
                <select
                  value={selectedStandalone}
                  onChange={(e) => setSelectedStandalone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a template...</option>
                  <option value="foodera-site">Foodera Modern</option>
                </select>
                {selectedStandalone && (
                  <p className="mt-1 text-xs text-gray-500">
                    Complete Next.js application with unique design
                  </p>
                )}
              </div>

              {/* Restaurant Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Restaurant {loadingRestaurants && '(Loading...)'}
                </label>
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  disabled={loadingRestaurants}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">{loadingRestaurants ? 'Loading restaurants...' : 'Choose a restaurant...'}</option>
                  {availableRestaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <div className="flex items-end">
                <button
                  onClick={() => generateStandaloneSite('dev')}
                  disabled={!selectedStandalone || !selectedRestaurant || !!isGenerating}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? String(isGenerating) : 'Generate Standalone Site'}
                </button>
              </div>
            </div>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
        </div>
      </div>

      {/* Generated Site Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {demoGenerated ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-100 border-b">
              <h2 className="font-semibold text-gray-800">Generated Website Preview</h2>
              <p className="text-sm text-gray-600">
                {templateType === 'skin' 
                  ? `Skin: ${availableSkins.find(s => s.id === selectedSkin)?.name} | Restaurant: ${availableRestaurants.find(r => r.id === selectedRestaurant)?.name}`
                  : `Template: ${selectedStandalone === 'foodera-site' ? 'Foodera Modern' : selectedStandalone} | Restaurant: ${availableRestaurants.find(r => r.id === selectedRestaurant)?.name}`
                }
              </p>
            </div>
            
            {/* Website Preview - Different for Skin vs Standalone */}
            {templateType === 'skin' ? (
              <div className="relative preview-mode" data-skin={selectedSkin}>
                {/* Navbar */}
                <nav className="navbar">
                <div className="navbar__container">
                  <div className="navbar__left">
                    <div className="navbar__logo">
                      <img src="/food-smile-logo.svg" alt="Food Smile Logo" />
                    </div>
                    <div className="navbar__social">
                      <a href="#" className="navbar__social-link" aria-label="Facebook">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a href="#" className="navbar__social-link" aria-label="Instagram">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a href="#" className="navbar__social-link" aria-label="Twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <ul className="navbar__nav">
                    <li><a href="#menu" className="navbar__nav-link">Menu</a></li>
                    <li><a href="#gallery" className="navbar__nav-link">Gallery</a></li>
                    <li><a href="#contact" className="navbar__nav-link">Contact</a></li>
                    <li><a href="#locations" className="navbar__nav-link">Locations</a></li>
                  </ul>
                </div>
              </nav>

              {/* Hero Section */}
              <section id="hero" className="hero">
                <div className="hero__container">
                  <div className="hero__content">
                    <p className="hero__subtitle">Welcome to</p>
                    <h1 className="hero__title">
                      {restaurantData?.restaurant_info?.name || availableRestaurants.find(r => r.id === selectedRestaurant)?.name || 'Our Restaurant'}
                    </h1>
                    <p className="hero__description">
                      {restaurantData?.restaurant_info?.type_of_food 
                        ? `Experience authentic ${restaurantData.restaurant_info.type_of_food} cuisine ${restaurantData.restaurant_info.address ? `in ${restaurantData.restaurant_info.address.split(',')[0]}` : ''}. Fresh ingredients, traditional recipes, and modern presentation come together to create an unforgettable dining experience.`
                        : 'Experience authentic Middle Eastern cuisine in the heart of Saudi Arabia. Fresh ingredients, traditional recipes, and modern presentation come together to create an unforgettable dining experience.'
                      }
                    </p>
                    <button className="hero__cta-button">
                      View Our Menu
                    </button>
                  </div>
                  <div className="hero__image">
                    <div className="hero__carousel">
                      {heroImages.map((image, index) => (
                        <img 
                          key={index}
                          src={image.url} 
                          alt={image.alt}
                          className={`hero__carousel-image ${index === currentImageIndex ? 'active' : ''}`}
                        />
                      ))}
                      <div className="hero__carousel-dots">
                        {heroImages.map((_, index) => (
                          <button
                            key={index}
                            className={`hero__carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Menu Section - With Tabs */}
              <section id="menu" className="menu-list">
                <div className="menu-list__header">
                  <h2 className="menu-list__title">Our Menu</h2>
                  <p className="menu-list__subtitle">
                    {restaurantData ? 'Discover our carefully crafted dishes' : 'Select a restaurant to view menu'}
                  </p>
                </div>
                
                {restaurantData?.menu_categories ? (() => {
                  const allCategories = Object.entries(restaurantData.menu_categories)
                    .filter(([category, items]) => Array.isArray(items) && items.length > 0);
                  
                  const paginateThreshold = menuDisplay.paginateThreshold || 0;
                  
                  // Filter categories based on selection
                  const displayCategories = selectedCategory === 'all' 
                    ? allCategories 
                    : allCategories.filter(([category]) => category === selectedCategory);
                  
                  return (
                    <div className={`menu-list__container menu-list--${menuDisplay.variant}`}>
                      {/* Category Tabs */}
                      <div className="menu-list__tabs" style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '2rem',
                        borderBottom: '2px solid #E5DCD2',
                        paddingBottom: '1rem'
                      }}>
                        <button
                          onClick={() => setSelectedCategory('all')}
                          style={{
                            padding: '12px 20px',
                            borderRadius: '25px',
                            background: selectedCategory === 'all' ? '#B38E6A' : '#f8f9fa',
                            color: selectedCategory === 'all' ? 'white' : '#534931',
                            fontWeight: selectedCategory === 'all' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            border: selectedCategory === 'all' ? '2px solid #B38E6A' : '2px solid transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedCategory !== 'all') {
                              e.currentTarget.style.background = '#E5DCD2';
                              e.currentTarget.style.color = '#534931';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedCategory !== 'all') {
                              e.currentTarget.style.background = '#f8f9fa';
                              e.currentTarget.style.color = '#534931';
                            }
                          }}
                        >
                          All Categories ({allCategories.length})
                        </button>
                        {allCategories.map(([category, items]) => {
                          const itemsArray = items as any[];
                          const categoryDisplay = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                          const isSelected = selectedCategory === category;
                          
                          return (
                            <button
                              key={category}
                              onClick={() => setSelectedCategory(category)}
                              style={{
                                padding: '12px 20px',
                                borderRadius: '25px',
                                background: isSelected ? '#B38E6A' : '#f8f9fa',
                                color: isSelected ? 'white' : '#534931',
                                fontWeight: isSelected ? 'bold' : 'normal',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',
                                border: isSelected ? '2px solid #B38E6A' : '2px solid transparent'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = '#E5DCD2';
                                  e.currentTarget.style.color = '#534931';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = '#f8f9fa';
                                  e.currentTarget.style.color = '#534931';
                                }
                              }}
                            >
                              {categoryDisplay} ({itemsArray.length})
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Display Selected Categories */}
                      {displayCategories.map(([category, items]) => {
                        const itemsArray = items as any[];
                        const totalItems = itemsArray.length;
                        const categoryCurrentPage = currentPage[category] || 0;
                        const showPagination = paginateThreshold > 0 && totalItems > paginateThreshold;
                        const startIndex = showPagination ? categoryCurrentPage * paginateThreshold : 0;
                        const endIndex = showPagination ? startIndex + paginateThreshold : totalItems;
                        const visibleItems = itemsArray.slice(startIndex, endIndex);
                        const totalPages = showPagination ? Math.ceil(totalItems / paginateThreshold) : 1;
                        
                        return (
                          <div key={category} className="menu-list__category">
                            {/* Items Grid */}
                            {menuDisplay.variant === 'grid-photos' && menuDisplay.showImages ? (
                              <div 
                                className="menu-list__grid" 
                                style={{ 
                                  display: 'grid',
                                  gridTemplateColumns: `repeat(${menuDisplay.itemsPerRow}, 1fr)`,
                                  gap: '1.5rem',
                                  marginBottom: '2rem'
                                }}
                              >
                                {visibleItems.map((item: any, index: number) => (
                                  <div key={`${category}-${startIndex + index}`} className={`menu-list__item menu-list__item--${menuDisplay.grid.imageShape}`}>
                                    <div className="menu-list__item-image" style={{ position: 'relative', marginBottom: '0.75rem' }}>
                                      {(() => {
                                        const name = item.item_en || item.item_ar || item.name || item.item_name || `item-${index}`
                                        const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-')
                                        const dataImg = item.image || (item.images && item.images[0]?.url)
                                        const src = menuDisplay.imageMode === 'from-data' && dataImg
                                          ? dataImg
                                          : `${menuDisplay.imagesBasePath}/${slug}.jpg`
                                        
                                        const imageStyle = {
                                          width: '100%',
                                          height: '220px',
                                          objectFit: 'cover' as const,
                                          display: 'block',
                                          borderRadius: menuDisplay.grid.imageShape === 'circle' ? '50%' : menuDisplay.grid.imageShape === 'rounded' ? '12px' : '8px',
                                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                        };
                                        
                                        return (
                                          <img
                                            src={src}
                                            alt={name}
                                            style={imageStyle}
                                            loading="lazy"
                                            onError={(e) => {
                                              e.currentTarget.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                                            }}
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.transform = 'translateY(-4px)';
                                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.transform = 'translateY(0)';
                                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                            }}
                                          />
                                        )
                                      })()}
                                      {item.price && (
                                        <div className="menu-list__item-price" style={{ 
                                          position: 'absolute', 
                                          top: '12px', 
                                          right: '12px', 
                                          background: '#B38E6A', 
                                          color: 'white', 
                                          padding: '6px 12px', 
                                          borderRadius: '20px',
                                          fontSize: '14px',
                                          fontWeight: 'bold',
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        }}>
                                          {typeof item.price === 'string' ? item.price : `${item.price} ${item.currency || 'SAR'}`}
                                        </div>
                                      )}
                                    </div>
                                    <div className="menu-list__item-content">
                                      <div className="menu-list__item-name" style={{ 
                                        fontWeight: 'bold', 
                                        marginBottom: '6px',
                                        fontSize: '16px',
                                        color: '#534931',
                                        lineHeight: '1.4'
                                      }}>
                                        {item.item_en || item.item_ar || item.name || item.item_name || `Item ${startIndex + index + 1}`}
                                      </div>
                                      {menuDisplay.showDescriptions && item.description && (
                                        <div className="menu-list__item-description" style={{ 
                                          fontSize: '14px', 
                                          color: '#666', 
                                          lineHeight: '1.5',
                                          marginTop: '4px'
                                        }}>
                                          {item.description.length > 80 
                                            ? `${item.description.substring(0, 80)}...` 
                                            : item.description
                                          }
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : menuDisplay.variant === 'table-clean' ? (
                              <div className="menu-list__table-grid" style={{ 
                                display: 'grid',
                                gridTemplateColumns: `repeat(${menuDisplay.itemsPerRow}, 1fr)`,
                                gap: '1rem',
                                marginBottom: '2rem'
                              }}>
                                {visibleItems.map((item: any, index: number) => (
                                  <div key={`${category}-${startIndex + index}`} className="menu-list__table-item" style={{ 
                                    padding: '16px', 
                                    border: '2px solid #E5DCD2', 
                                    borderRadius: '8px',
                                    background: 'white',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: '140px'
                                  }}>
                                    <div>
                                      <div className="menu-list__table-item-name" style={{ 
                                        color: '#534931', 
                                        fontSize: '16px', 
                                        fontWeight: 'bold',
                                        marginBottom: '8px',
                                        lineHeight: '1.3'
                                      }}>
                                        {item.item_en || item.item_ar || item.name || item.item_name || `Item ${startIndex + index + 1}`}
                                      </div>
                                      {menuDisplay.showDescriptions && item.description && (
                                        <div className="menu-list__table-item-description" style={{ 
                                          fontSize: '14px', 
                                          color: '#666', 
                                          lineHeight: '1.4',
                                          marginBottom: '8px'
                                        }}>
                                          {item.description.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
                                        </div>
                                      )}
                                    </div>
                                    {item.price && (
                                      <div className="menu-list__table-item-price" style={{ 
                                        fontWeight: 'bold', 
                                        color: '#B38E6A', 
                                        fontSize: '16px',
                                        textAlign: 'right',
                                        marginTop: 'auto'
                                      }}>
                                        {typeof item.price === 'string' ? item.price : `${item.price} ${item.currency || 'SAR'}`}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Compact Cards Layout
                              <div className="menu-list__cards-grid" style={{ 
                                display: 'grid',
                                gridTemplateColumns: `repeat(${menuDisplay.itemsPerRow}, 1fr)`,
                                gap: '1rem',
                                marginBottom: '2rem'
                              }}>
                                {visibleItems.map((item: any, index: number) => (
                                  <div key={`${category}-${startIndex + index}`} className="menu-list__card-item" style={{ 
                                    padding: '12px', 
                                    border: '1px solid #E5DCD2', 
                                    borderRadius: '6px',
                                    background: 'white',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: '120px',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
                                  }}
                                  >
                                    <div>
                                      <div className="menu-list__card-item-name" style={{ 
                                        color: '#534931', 
                                        fontSize: '15px', 
                                        fontWeight: 'bold',
                                        marginBottom: '6px',
                                        lineHeight: '1.3'
                                      }}>
                                        {item.item_en || item.item_ar || item.name || item.item_name || `Item ${startIndex + index + 1}`}
                                      </div>
                                      {menuDisplay.showDescriptions && item.description && (
                                        <div className="menu-list__card-item-description" style={{ 
                                          fontSize: '13px', 
                                          color: '#666', 
                                          lineHeight: '1.4',
                                          marginBottom: '6px'
                                        }}>
                                          {item.description.length > 60 ? `${item.description.substring(0, 60)}...` : item.description}
                                        </div>
                                      )}
                                    </div>
                                    {item.price && (
                                      <div className="menu-list__card-item-price" style={{ 
                                        fontWeight: 'bold', 
                                        color: '#B38E6A', 
                                        fontSize: '15px',
                                        textAlign: 'right',
                                        marginTop: 'auto'
                                      }}>
                                        {typeof item.price === 'string' ? item.price : `${item.price} ${item.currency || 'SAR'}`}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Pagination for individual categories */}
                            {showPagination && totalPages > 1 && (
                              <div className="menu-list__pagination" style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginTop: '2rem',
                                padding: '1.5rem',
                                background: '#f8f9fa',
                                borderRadius: '12px',
                                border: '2px solid #E5DCD2'
                              }}>
                                <div className="menu-list__pagination-info">
                                  <span style={{ color: '#534931', fontWeight: 'bold' }}>
                                    {endIndex < totalItems ? `+ ${totalItems - endIndex} more items` : 'All items shown'}
                                  </span>
                                </div>
                                <div className="menu-list__pagination-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <button 
                                    className="menu-list__pagination-arrow menu-list__pagination-arrow--left" 
                                    disabled={categoryCurrentPage === 0}
                                    onClick={() => setCurrentPage(prev => ({ ...prev, [category]: Math.max(0, categoryCurrentPage - 1) }))}
                                    style={{ 
                                      padding: '12px', 
                                      border: '2px solid #B38E6A', 
                                      borderRadius: '8px', 
                                      background: categoryCurrentPage === 0 ? '#f0f0f0' : '#B38E6A',
                                      color: categoryCurrentPage === 0 ? '#999' : 'white',
                                      cursor: categoryCurrentPage === 0 ? 'not-allowed' : 'pointer',
                                      transition: 'all 0.3s ease'
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                    </svg>
                                  </button>
                                  <span className="menu-list__pagination-page" style={{ 
                                    padding: '0 16px',
                                    fontWeight: 'bold',
                                    color: '#534931'
                                  }}>
                                    {categoryCurrentPage + 1} of {totalPages}
                                  </span>
                                  <button 
                                    className="menu-list__pagination-arrow menu-list__pagination-arrow--right"
                                    disabled={categoryCurrentPage >= totalPages - 1}
                                    onClick={() => setCurrentPage(prev => ({ ...prev, [category]: Math.min(totalPages - 1, categoryCurrentPage + 1) }))}
                                    style={{ 
                                      padding: '12px', 
                                      border: '2px solid #B38E6A', 
                                      borderRadius: '8px', 
                                      background: categoryCurrentPage >= totalPages - 1 ? '#f0f0f0' : '#B38E6A',
                                      color: categoryCurrentPage >= totalPages - 1 ? '#999' : 'white',
                                      cursor: categoryCurrentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                                      transition: 'all 0.3s ease'
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })() : restaurantData ? (
                  <div className="menu-list__grid">
                    <div className="menu-list__category">
                      <h3 className="menu-list__category-title">Menu Information</h3>
                      <ul className="menu-list__items">
                        <li className="menu-list__item">
                          <div className="menu-list__item-info">
                            <div className="menu-list__item-name">Visit us for our full menu</div>
                            <div className="menu-list__item-description">
                              {restaurantData.restaurant_info?.name} offers authentic cuisine with fresh ingredients
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="menu-list__grid">
                    <div className="menu-list__category">
                      <h3 className="menu-list__category-title">Loading Menu...</h3>
                      <ul className="menu-list__items">
                        <li className="menu-list__item">
                          <div className="menu-list__item-info">
                            <div className="menu-list__item-name">Please select a restaurant to view menu</div>
                            <div className="menu-list__item-description">Choose from our available restaurants above</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </section>

              {/* Gallery Section */}
              <section id="gallery" className="gallery">
                <div className="gallery__container">
                  <div className="gallery__header">
                    <h2 className="gallery__title">Our Gallery</h2>
                  </div>
                  <div className="gallery__grid">
                    <div className="gallery__item">
                      <div className="gallery__carousel">
                        <div className="gallery__carousel-images">
                          <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Delicious dish" className={`gallery__carousel-image ${0 === currentImageIndex ? 'active' : ''}`} />
                          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Restaurant ambiance" className={`gallery__carousel-image ${1 === currentImageIndex ? 'active' : ''}`} />
                          <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Fresh ingredients" className={`gallery__carousel-image ${2 === currentImageIndex ? 'active' : ''}`} />
                          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Chef cooking" className={`gallery__carousel-image ${3 === currentImageIndex ? 'active' : ''}`} />
                        </div>
                        <div className="gallery__carousel-dots">
                          {heroImages.map((_, index) => (
                            <button
                              key={index}
                              className={`gallery__carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                              onClick={() => setCurrentImageIndex(index)}
                              aria-label={`Go to gallery slide ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="gallery__item">
                      <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Restaurant ambiance" />
                    </div>
                    <div className="gallery__item">
                      <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Fresh ingredients" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Locations Section */}
              <section id="locations" className="locations">
                <div className="locations__container">
                  <div className="locations__header">
                    <h2 className="locations__title">Our Location</h2>
                    <p className="locations__subtitle">Visit us at our location</p>
                  </div>
                  <div className="locations__grid">
                    <div className="locations__item">
                      <h3 className="locations__branch-name">
                        {restaurantData?.restaurant_info?.name || 'Main Branch'}
                      </h3>
                      <p className="locations__address">
                        {restaurantData?.restaurant_info?.address || 'Riyadh, Saudi Arabia'}
                      </p>
                      {restaurantData?.restaurant_info?.phone && (
                        <p className="locations__phone">{restaurantData.restaurant_info.phone}</p>
                      )}
                      {restaurantData?.restaurant_info?.hours && (
                        <p className="locations__hours">{restaurantData.restaurant_info.hours}</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="footer">
                <div className="footer__container">
                  <div className="footer__content">
                    <div className="footer__section">
                      <h3>Contact Info</h3>
                      <p>📍 {restaurantData?.restaurant_info?.address || 'Riyadh, Saudi Arabia'}</p>
                      <p>📞 {restaurantData?.restaurant_info?.phone || '+966 11 123 4567'}</p>
                      <p>✉️ info@{selectedRestaurant}.com</p>
                    </div>
                    <div className="footer__section">
                      <h3>Opening Hours</h3>
                      {restaurantData?.restaurant_info?.hours ? (
                        <p>{restaurantData.restaurant_info.hours}</p>
                      ) : (
                        <>
                          <p>Saturday - Thursday: 11:00 AM - 11:00 PM</p>
                          <p>Friday: 2:00 PM - 11:00 PM</p>
                        </>
                      )}
                    </div>
                    <div className="footer__section">
                      <h3>About</h3>
                      <p>{restaurantData?.restaurant_info?.name || 'Restaurant'}</p>
                      <p>{restaurantData?.restaurant_info?.type_of_food || 'Authentic cuisine'}</p>
                    </div>
                  </div>
                  <div className="footer__bottom">
                    <p>&copy; 2024 {availableRestaurants.find(r => r.id === selectedRestaurant)?.name}. All rights reserved.</p>
                  </div>
                </div>
              </footer>
            </div>
            ) : (
              /* Standalone Template Preview */
              <div className="bg-gray-50 p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Standalone Template Preview
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {selectedStandalone === 'foodera-site' ? 'Foodera Modern' : selectedStandalone} template is running independently
                </p>
                
                {/* Simple view website link */}
                <a 
                  href={`http://localhost:3001/${selectedRestaurant}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  View Website
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Website Generated</h3>
            <p className="text-gray-600 mb-6">
              Select a skin and restaurant above, then click "Generate Website" to see the preview.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>🎨 <strong>{availableSkins.length}</strong> premium skins available</p>
              <p>🍽️ <strong>{availableRestaurants.length}</strong> restaurants available</p>
              <p>📱 Render only from local JSON files; no external fetching yet.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Editor Integration */}
      {typeof window !== 'undefined' && (
        <script 
          src="/dev/enhanced-editor.js" 
          defer
          onLoad={() => {
            if (window.enhancedEditor && restaurantData) {
              window.restaurantData = restaurantData;
            }
          }}
        />
      )}
    </div>
  )
}

// Enhanced Template Selector Components
function SkinTemplateSelector({ 
  selectedSkin, 
  onSkinSelect, 
  skinLoaded, 
  availableSkins, 
  loadingSkins 
}: {
  selectedSkin: string
  onSkinSelect: (skinId: string) => void
  skinLoaded: boolean
  availableSkins: any[]
  loadingSkins: boolean
}) {
  const [previews, setPreviews] = useState<Record<string, string>>({})
  
  useEffect(() => {
    // Load template previews
    const loadPreviews = async () => {
      const newPreviews: Record<string, string> = {}
      
      for (const skin of availableSkins) {
        try {
          const response = await fetch(`/api/skins/${skin.id}/preview`)
          if (response.ok) {
            const previewData = await response.text()
            newPreviews[skin.id] = previewData
          }
        } catch (error) {
          console.warn(`Failed to load preview for ${skin.id}:`, error)
        }
      }
      
      setPreviews(newPreviews)
    }
    
    if (availableSkins.length > 0) {
      loadPreviews()
    }
  }, [availableSkins])
  
  return (
    <div className="enhanced-skin-selector">
      <h3 className="text-lg font-semibold mb-4">🎨 Choose Your Design</h3>
      
      {loadingSkins ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="skin-placeholder animate-pulse">
              <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableSkins.map(skin => (
            <div 
              key={skin.id}
              className={`skin-card cursor-pointer border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                selectedSkin === skin.id 
                  ? 'border-blue-500 bg-blue-50 shadow-lg' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => onSkinSelect(skin.id)}
            >
              <div className="skin-preview-container mb-3">
                {previews[skin.id] ? (
                  <div 
                    className="preview-content h-32 rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: previews[skin.id] }}
                  />
                ) : (
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Loading preview...</span>
                  </div>
                )}
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-1">{skin.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{skin.description}</p>
              
              <div className="skin-features">
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    ✓ Responsive
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    ✓ Customizable
                  </span>
                  {selectedSkin === skin.id && skinLoaded && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      ✓ Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .skin-card {
          transform-style: preserve-3d;
        }
        
        .skin-card:hover {
          transform: translateY(-4px) rotateX(5deg);
        }
        
        .preview-content {
          transform: scale(0.8);
          transform-origin: top left;
          width: 125%;
          height: 125%;
        }
        
        .skin-placeholder {
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}

function StandalonePreview({ 
  templateId, 
  restaurantData, 
  isGenerating 
}: {
  templateId: string
  restaurantData: any
  isGenerating: boolean | string
}) {
  const [previewHTML, setPreviewHTML] = useState<string>('')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (templateId && restaurantData) {
      loadStandalonePreview()
    }
  }, [templateId, restaurantData])
  
  const loadStandalonePreview = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/templates/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          restaurantData
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setPreviewHTML(result.previewHTML)
      }
    } catch (error) {
      console.error('Failed to load standalone preview:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (!templateId) {
    return (
      <div className="standalone-empty-state text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Standalone Template</h3>
        <p className="text-gray-600">Choose from our collection of complete Next.js templates</p>
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="standalone-loading text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading template preview...</p>
      </div>
    )
  }
  
  return (
    <div className="standalone-preview-wrapper">
      <div className="preview-header bg-gray-50 p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800">📱 Standalone Template Preview</h3>
            <p className="text-sm text-gray-600">
              {templateId === 'foodera-site' ? 'Foodera Modern' : templateId} • 
              {restaurantData?.restaurant_info?.name || 'Restaurant'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              📱 Mobile View
            </button>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
              🚀 Launch
            </button>
          </div>
        </div>
      </div>
      
      <div className="preview-content">
        {previewHTML ? (
          <div 
            className="standalone-preview-html"
            dangerouslySetInnerHTML={{ __html: previewHTML }}
          />
        ) : (
          <div className="preview-fallback bg-gray-50 p-8 text-center">
            <p className="text-gray-600 mb-4">Preview not available</p>
            <a 
              href={`http://localhost:3001/${restaurantData?.restaurant_info?.name || 'restaurant'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              View Full Site
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function StandaloneTemplateSelector({
  selectedStandalone,
  onTemplateSelect,
  restaurantData
}: {
  selectedStandalone: string
  onTemplateSelect: (templateId: string) => void
  restaurantData: any
}) {
  const templates = [
    {
      id: 'foodera-site',
      name: 'Foodera Modern',
      description: 'Complete Next.js application with modern design system',
      features: ['Full Next.js App', 'Custom Components', 'Advanced Animations', 'Mobile First'],
      preview: '/images/template-previews/foodera-modern.jpg'
    }
  ]
  
  return (
    <div className="standalone-template-selector">
      <h3 className="text-lg font-semibold mb-4">🚀 Standalone Templates</h3>
      <p className="text-gray-600 mb-6">Complete Next.js applications with unique design systems</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map(template => (
          <div 
            key={template.id}
            className={`template-card cursor-pointer border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
              selectedStandalone === template.id 
                ? 'border-purple-500 bg-purple-50 shadow-lg' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <div className="template-preview mb-4">
              <div className="h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {template.name}
              </div>
            </div>
            
            <h4 className="font-bold text-gray-800 mb-2">{template.name}</h4>
            <p className="text-gray-600 mb-4">{template.description}</p>
            
            <div className="template-features mb-4">
              <div className="grid grid-cols-2 gap-2">
                {template.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full text-center"
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>
            
            {selectedStandalone === template.id && (
              <div className="selected-indicator">
                <div className="flex items-center text-purple-600 font-medium">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Selected Template
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}