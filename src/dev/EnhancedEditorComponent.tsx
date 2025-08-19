'use client'

import { useEffect } from 'react'

// Enhanced Visual Editor - TypeScript Client Component
// This replaces the raw JS file with proper Next.js bundling and transpilation

interface EditorState {
  isActive: boolean
  selectedElement: HTMLElement | null
  dragState: any
  currentSkin: string | null
  uploadedImages: Map<string, string>
  backgrounds: any[]
  templates: any[]
  editableElements: Set<string>
}

interface DragHandlers {
  isDragging: boolean
  startX: number
  startY: number
  startRect: DOMRect | null
  handleType: string | null
}

export default function EnhancedEditorComponent() {
  useEffect(() => {
    // Only run in development and on client side
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
      return undefined
    }

    // Check if editor already exists to prevent duplicates
    if ((window as any).EnhancedEditor) {
      return undefined
    }

    class EnhancedEditor {
      state: EditorState
      history: any
      clipboard: any
      dragHandlers: DragHandlers
      topToolbar: HTMLElement | null = null
      leftSidebar: HTMLElement | null = null
      rightSidebar: HTMLElement | null = null

      constructor() {
        this.state = {
          isActive: false,
          selectedElement: null,
          dragState: null,
          currentSkin: null,
          uploadedImages: new Map(),
          backgrounds: [],
          templates: [],
          editableElements: new Set()
        }

        this.history = {
          states: [],
          currentIndex: -1,
          maxStates: 50
        }

        this.clipboard = null

        this.dragHandlers = {
          isDragging: false,
          startX: 0,
          startY: 0,
          startRect: null,
          handleType: null
        }

        this.init()
        this.bindKeyboardShortcuts()
      }

      async init() {
        if (typeof window === 'undefined') return

        await this.loadTemplatesAndBackgrounds()
        this.createEditorInterface()
        this.bindEvents()
        this.setupImageUpload()
        this.enableElementDetection()
      }

      async loadTemplatesAndBackgrounds() {
        try {
          // Load available skins/templates
          const skinsResponse = await fetch('/api/skins')
          if (skinsResponse.ok) {
            const skinsData = await skinsResponse.json()
            this.state.templates = skinsData.skins || []
          }

          // Default backgrounds
          this.state.backgrounds = [
            { type: 'solid', value: '#ffffff', name: 'White' },
            { type: 'solid', value: '#f8f9fa', name: 'Light Gray' },
            { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', name: 'Purple Blue' },
            { type: 'gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', name: 'Pink Red' },
            { type: 'gradient', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', name: 'Blue Cyan' }
          ]
        } catch (error) {
          console.warn('Failed to load templates and backgrounds:', error)
        }
      }

      createEditorInterface() {
        // Create minimal editor interface
        this.createTopToolbar()
        this.createLeftSidebar()
        this.createRightSidebar()
      }

      createTopToolbar() {
        if (document.getElementById('enhanced-editor-toolbar')) return

        const toolbar = document.createElement('div')
        toolbar.id = 'enhanced-editor-toolbar'
        toolbar.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 50px;
          background: #2c3e50;
          color: white;
          z-index: 10000;
          display: none;
          align-items: center;
          padding: 0 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          font-family: system-ui, -apple-system, sans-serif;
        `

        toolbar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-weight: bold;">🎨 Enhanced Editor</span>
            <button data-action="toggle" style="padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer;">Toggle</button>
            <button data-action="save" style="padding: 5px 10px; background: #27ae60; color: white; border: none; border-radius: 3px; cursor: pointer;">Save</button>
            <button data-action="close" style="padding: 5px 10px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer;">Close</button>
          </div>
        `

        document.body.appendChild(toolbar)
        this.topToolbar = toolbar
      }

      createLeftSidebar() {
        if (document.getElementById('enhanced-editor-left-sidebar')) return

        const sidebar = document.createElement('div')
        sidebar.id = 'enhanced-editor-left-sidebar'
        sidebar.style.cssText = `
          position: fixed;
          top: 50px;
          left: 0;
          width: 250px;
          height: calc(100vh - 50px);
          background: #34495e;
          color: white;
          z-index: 9999;
          display: none;
          flex-direction: column;
          overflow-y: auto;
          font-family: system-ui, -apple-system, sans-serif;
        `

        sidebar.innerHTML = `
          <div style="padding: 20px;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px;">Templates</h3>
            <div id="template-list" style="margin-bottom: 20px;">
              ${this.state.templates.map(template => `
                <div data-template="${template.id}" style="padding: 8px; background: #2c3e50; margin: 5px 0; border-radius: 3px; cursor: pointer;">
                  ${template.name}
                </div>
              `).join('')}
            </div>
            
            <h3 style="margin: 20px 0 15px 0; font-size: 16px;">Backgrounds</h3>
            <div id="background-list">
              ${this.state.backgrounds.map((bg, index) => `
                <div data-bg-index="${index}" style="padding: 8px; background: #2c3e50; margin: 5px 0; border-radius: 3px; cursor: pointer;">
                  ${bg.name}
                </div>
              `).join('')}
            </div>
          </div>
        `

        document.body.appendChild(sidebar)
        this.leftSidebar = sidebar
      }

      createRightSidebar() {
        if (document.getElementById('enhanced-editor-right-sidebar')) return

        const sidebar = document.createElement('div')
        sidebar.id = 'enhanced-editor-right-sidebar'
        sidebar.style.cssText = `
          position: fixed;
          top: 50px;
          right: 0;
          width: 250px;
          height: calc(100vh - 50px);
          background: #34495e;
          color: white;
          z-index: 9999;
          display: none;
          flex-direction: column;
          overflow-y: auto;
          font-family: system-ui, -apple-system, sans-serif;
        `

        sidebar.innerHTML = `
          <div style="padding: 20px;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px;">Properties</h3>
            <div id="element-properties">
              <p style="color: #bdc3c7; font-size: 14px;">Select an element to edit its properties</p>
            </div>
          </div>
        `

        document.body.appendChild(sidebar)
        this.rightSidebar = sidebar
      }

      bindEvents() {
        // Toolbar actions
        if (this.topToolbar) {
          this.topToolbar.addEventListener('click', (e) => {
            const target = e.target as HTMLElement
            const actionElement = target.closest('[data-action]') as HTMLElement
            const action = actionElement ? actionElement.dataset.action : null

            switch (action) {
              case 'toggle':
                this.toggleEditor()
                break
              case 'close':
                this.closeEditor()
                break
              case 'save':
                this.saveChanges()
                break
            }
          })
        }

        // Template selection
        if (this.leftSidebar) {
          this.leftSidebar.addEventListener('click', (e) => {
            const target = e.target as HTMLElement
            const templateElement = target.closest('[data-template]') as HTMLElement
            const bgElement = target.closest('[data-bg-index]') as HTMLElement
            
            if (templateElement) {
              const templateId = templateElement.dataset.template
              if (templateId) {
                this.loadSkinCSS(templateId)
              }
            }
            
            if (bgElement) {
              const bgIndex = bgElement.dataset.bgIndex
              if (bgIndex !== undefined) {
                this.applyBackground(parseInt(bgIndex))
              }
            }
          })
        }
      }

      bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
          // Alt + E to toggle editor
          if (e.altKey && e.key === 'e') {
            e.preventDefault()
            this.toggleEditor()
          }
          
          // Escape to close editor
          if (e.key === 'Escape' && this.state.isActive) {
            this.closeEditor()
          }
        })
      }

      setupImageUpload() {
        // Placeholder for image upload functionality
        console.log('Image upload system ready')
      }

      enableElementDetection() {
        document.addEventListener('click', (e) => {
          if (!this.state.isActive) return
          
          const target = e.target as HTMLElement
          if (target.closest('#enhanced-editor-toolbar') || 
              target.closest('#enhanced-editor-left-sidebar') || 
              target.closest('#enhanced-editor-right-sidebar')) {
            return
          }
          
          e.preventDefault()
          this.selectElement(target)
        })
      }

      toggleEditor() {
        if (this.state.isActive) {
          this.closeEditor()
        } else {
          this.openEditor()
        }
      }

      openEditor() {
        this.state.isActive = true
        
        if (this.topToolbar) this.topToolbar.style.display = 'flex'
        if (this.leftSidebar) this.leftSidebar.style.display = 'flex'
        if (this.rightSidebar) this.rightSidebar.style.display = 'flex'
        
        document.body.style.paddingTop = '50px'
        document.body.style.paddingLeft = '250px'
        document.body.style.paddingRight = '250px'
        
        this.showStatus('Enhanced Editor activated. Press Alt+E to toggle, Escape to close.', 'success')
      }

      closeEditor() {
        this.state.isActive = false
        
        if (this.topToolbar) this.topToolbar.style.display = 'none'
        if (this.leftSidebar) this.leftSidebar.style.display = 'none'
        if (this.rightSidebar) this.rightSidebar.style.display = 'none'
        
        document.body.style.paddingTop = '0'
        document.body.style.paddingLeft = '0'
        document.body.style.paddingRight = '0'
        
        this.clearSelection()
      }

      selectElement(element: HTMLElement) {
        this.clearSelection()
        this.state.selectedElement = element
        
        element.style.outline = '2px solid #3498db'
        element.style.outlineOffset = '2px'
        
        this.updatePropertyPanel(element)
      }

      clearSelection() {
        if (this.state.selectedElement) {
          this.state.selectedElement.style.outline = ''
          this.state.selectedElement.style.outlineOffset = ''
          this.state.selectedElement = null
        }
      }

      updatePropertyPanel(element: HTMLElement) {
        const propertiesDiv = document.getElementById('element-properties')
        if (!propertiesDiv) return
        
        propertiesDiv.innerHTML = `
          <h4 style="margin: 0 0 10px 0;">${element.tagName.toLowerCase()}</h4>
          <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px; font-size: 12px;">Text Color:</label>
            <input type="color" id="text-color" value="#000000" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px; font-size: 12px;">Background:</label>
            <input type="color" id="bg-color" value="#ffffff" style="width: 100%;">
          </div>
          <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px; font-size: 12px;">Font Size:</label>
            <input type="range" id="font-size" min="10" max="72" value="16" style="width: 100%;">
            <span id="font-size-value">16px</span>
          </div>
        `
        
        // Bind property controls
        const textColorInput = document.getElementById('text-color') as HTMLInputElement
        const bgColorInput = document.getElementById('bg-color') as HTMLInputElement
        const fontSizeInput = document.getElementById('font-size') as HTMLInputElement
        const fontSizeValue = document.getElementById('font-size-value')
        
        if (textColorInput) {
          textColorInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement
            if (this.state.selectedElement) {
              this.state.selectedElement.style.color = target.value
            }
          })
        }
        
        if (bgColorInput) {
          bgColorInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement
            if (this.state.selectedElement) {
              this.state.selectedElement.style.backgroundColor = target.value
            }
          })
        }
        
        if (fontSizeInput && fontSizeValue) {
          fontSizeInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement
            const size = target.value + 'px'
            fontSizeValue.textContent = size
            if (this.state.selectedElement) {
              this.state.selectedElement.style.fontSize = size
            }
          })
        }
      }

      loadSkinCSS(skinId: string) {
        // Remove existing skin CSS
        const existingLinks = document.querySelectorAll('link[href*="/api/skins/"]')
        existingLinks.forEach(link => link.remove())

        // Add new skin CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = `/api/skins/${skinId}/css?t=${Date.now()}`
        document.head.appendChild(link)
        
        this.state.currentSkin = skinId
        this.showStatus(`Template "${skinId}" loaded`, 'success')
      }

      applyBackground(index: number) {
        const background = this.state.backgrounds[index]
        if (!background) return
        
        document.body.style.background = background.value
        this.showStatus(`Background "${background.name}" applied`, 'success')
      }

      saveChanges() {
        // Save current state to localStorage
        const changes = {
          timestamp: Date.now(),
          selectedSkin: this.state.currentSkin,
          bodyBackground: document.body.style.background,
          elementChanges: Array.from(document.querySelectorAll('[style]')).map(el => ({
            selector: this.getElementSelector(el as HTMLElement),
            styles: (el as HTMLElement).style.cssText
          }))
        }
        
        localStorage.setItem('enhanced-editor-changes', JSON.stringify(changes))
        this.showStatus('Changes saved to localStorage', 'success')
      }

      getElementSelector(element: HTMLElement): string {
        if (element.id) return `#${element.id}`
        if (element.className) return `.${element.className.split(' ')[0]}`
        return element.tagName.toLowerCase()
      }

      showStatus(message: string, type: 'success' | 'error' | 'info' = 'info') {
        // Remove existing status
        const existing = document.getElementById('enhanced-editor-status')
        if (existing) existing.remove()
        
        const status = document.createElement('div')
        status.id = 'enhanced-editor-status'
        status.style.cssText = `
          position: fixed;
          top: 60px;
          right: 20px;
          padding: 10px 15px;
          background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
          color: white;
          border-radius: 5px;
          z-index: 10001;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `
        status.textContent = message
        
        document.body.appendChild(status)
        
        setTimeout(() => {
          if (status.parentNode) {
            status.parentNode.removeChild(status)
          }
        }, 3000)
      }
    }

    // Initialize the editor and make it globally available
    const editorInstance = new EnhancedEditor()
    ;(window as any).EnhancedEditor = editorInstance

    // Cleanup function
    return () => {
      // Remove editor elements on unmount
      const toolbar = document.getElementById('enhanced-editor-toolbar')
      const leftSidebar = document.getElementById('enhanced-editor-left-sidebar')
      const rightSidebar = document.getElementById('enhanced-editor-right-sidebar')
      const status = document.getElementById('enhanced-editor-status')
      
      if (toolbar) toolbar.remove()
      if (leftSidebar) leftSidebar.remove()
      if (rightSidebar) rightSidebar.remove()
      if (status) status.remove()
      
      // Reset body styles
      document.body.style.paddingTop = '0'
      document.body.style.paddingLeft = '0'
      document.body.style.paddingRight = '0'
      
      delete (window as any).EnhancedEditor
    }
  }, [])

  return null // This component doesn't render anything visible
}