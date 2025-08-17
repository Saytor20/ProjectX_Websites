# Restaurant Website Generator - System Guide
*Last Updated: August 17, 2025*

## Overview

This is a **Next.js 15 + React 19** restaurant website generator using a **Component Kit + Skin System** architecture with an **Enhanced Visual Design Interface**. The system generates restaurant websites from local JSON data with professional editing tools, drag-and-drop functionality, and comprehensive customization options.

## Key Architecture

### Technology Stack
- **Next.js 15** with App Router and ISR
- **React 19** with Server Components
- **TypeScript** for type safety
- **Enhanced Visual Editor** with drag-and-drop interface
- **Component Kit** (10 fixed components) for reusable UI
- **Skin System** with CSS scoping and performance budgets
- **Image Upload System** with gallery management
- **Background System** with multiple options

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API endpoints (templates, upload, tokens)
│   ├── page.tsx           # Enhanced main interface
│   └── layout.tsx         # Root layout with editor integration
├── components/kit/         # 10 fixed components (Navbar, Hero, etc.)
├── lib/                   # Core system libraries
│   ├── skin-loader.ts     # Template loading system
│   ├── component-renderer.tsx # Component rendering engine
│   └── system-validator.ts # Complete validation system
└── schema/                # Data validation schemas

public/
├── dev/                   # Enhanced Visual Editor
│   ├── phase-d-editor.js  # Complete visual editor (3,200+ lines)
│   ├── phase-d-editor.css # Editor styling (800+ lines)
│   └── inspector.js       # Visual inspection tools
└── skins/                 # Compiled template assets

data/restaurants/          # Restaurant JSON files (80+ restaurants)
skins/                     # Template source files with tokens.json
generated_sites/           # Output directory for generated sites
```

## Enhanced Visual Design Interface

### Core Features
- **🎨 Visual Editor**: Complete drag-and-drop interface with element selection
- **📷 Image Management**: Upload system with click-to-replace functionality
- **🎭 Background Options**: 6+ options including gradients, patterns, and custom images
- **🔧 Property Editor**: Live CSS editing for colors, fonts, spacing
- **📱 Template Selection**: Visual cards with previews for skins and standalone templates
- **⚡ Real-time Preview**: Instant visual feedback for all changes

### Component Kit System (10 Fixed Components)
- **Navbar**: Navigation with logo and social media
- **Hero**: Main banner with carousel support
- **MenuList**: Restaurant menu with categories and pagination
- **Gallery**: Photo gallery grid with carousel
- **Hours**: Operating hours display
- **LocationMap**: Address and map integration
- **CTA**: Call-to-action sections
- **Footer**: Contact info and links
- **RichText**: Formatted content blocks
- **Section**: Generic container with layout options

### MenuList Component Features
The enhanced MenuList component supports:

1. **Multiple Layout Variants**:
   - `grid-photos`: Grid layout with images (default)
   - `table-clean`: Clean table layout without images
   - `cards-compact`: Compact card layout

2. **Pagination System**:
   - Configurable items per page via `paginateThreshold`
   - Arrow navigation for image mode (6-8 items per page)
   - Full pagination for non-image modes

3. **Grid Options**:
   - Configurable columns (2-6 columns)
   - Image shapes: boxed, rounded, circle
   - Auto-responsive breakpoints

4. **Display Controls**:
   - Show/hide images
   - Show/hide descriptions
   - Show/hide prices
   - RTL support

## Using the Enhanced System

### 1. Development Mode
```bash
npm run dev              # Start Next.js dev server
npm run skins:dev        # Start hot reload watcher for tokens/CSS
```
Access at http://localhost:3000

### 2. Enhanced Visual Editor Workflow
1. **Template Selection**: Choose skin or standalone with visual previews
2. **Restaurant Selection**: Pick from 80+ available restaurants
3. **Generate Website**: Create initial preview
4. **Open Visual Editor**: Click "🎨 Open Visual Editor" button
5. **Customize Elements**: Use drag-and-drop, property editor, and upload tools

### 3. Visual Editor Features

#### **Element Manipulation**
- **Click Selection**: Click any element to select and edit
- **Drag Handles**: 8-point resize controls for precise positioning
- **Property Panel**: Live CSS editing (colors, fonts, spacing, margins)
- **Real-time Preview**: Instant visual feedback

#### **Image Management**
- **Upload System**: Drag-and-drop or click to upload
- **Gallery Manager**: Organize and manage uploaded images
- **Click-to-Replace**: Click any image to replace instantly
- **File Validation**: Automatic format and size checking

#### **Background System**
- **Solid Colors**: Color picker with transparency
- **Gradients**: Custom gradient builder with multiple stops
- **Patterns**: Pre-designed pattern library
- **Images**: Upload custom background images
- **Real-time Preview**: See changes instantly

#### **Template System**
- **Skin Templates**: CSS-scoped templates with token system
- **Standalone Templates**: Complete Next.js applications
- **Visual Previews**: Generated previews for all templates
- **Feature Badges**: Clear indication of capabilities

### 4. Restaurant Data Format
Restaurant data files follow this structure:
```json
{
  "restaurant_info": {
    "name": "Restaurant Name",
    "region": "City",
    "state": "State",
    "country": "Saudi Arabia",
    "type_of_food": "Cuisine Type"
  },
  "menu_categories": {
    "Category Name": [
      {
        "item_en": "Item Name",
        "item_ar": "Arabic Name",
        "price": 25.00,
        "currency": "SAR",
        "description": "Item description",
        "image": "https://example.com/image.jpg"
      }
    ]
  }
}
```

## Technical Implementation

### Enhanced API Endpoints
- **`/api/templates/`** - Template management with preview generation
- **`/api/templates/preview`** - Standalone template preview system
- **`/api/upload/image`** - Complete image upload and management
- **`/api/tokens/update`** - Token persistence for visual editor
- **`/api/skins/`** - Skin system with CSS delivery
- **`/api/generate/`** - Website generation for skins
- **`/api/generate/standalone`** - Standalone template generation

### Visual Editor Architecture
- **EnhancedEditor Class**: 3,200+ lines of JavaScript with modular design
- **Element Selection**: Click-to-select with visual highlighting
- **Drag System**: 8-point resize handles with real-time feedback
- **Property Inspector**: Live CSS editing with color pickers and sliders
- **Token Integration**: Real-time token editing with hot reload
- **Component Mapping**: Visual component library browser

### Skin System with Performance Budgets
- **CSS Scoping**: All selectors prefixed with `[data-skin="skin-id"]`
- **Performance Budget**: CSS ≤50KB, JS ≤20KB gzipped per skin
- **Token System**: `tokens.json` to `tokens.css` automatic generation
- **Hot Reload**: File watcher with 300ms debouncing
- **Multi-Skin Testing**: Side-by-side rendering for conflict detection

### Image Upload System
- **Multiple Upload Methods**: Drag-and-drop, click, paste
- **File Validation**: Format, size, and security checks
- **Gallery Management**: Organized storage and retrieval
- **Click-to-Replace**: Seamless image replacement workflow
- **Optimization**: Automatic compression and format conversion

### Background System
- **6+ Background Types**: Solid, gradient, pattern, image, none, custom
- **Gradient Builder**: Multi-stop custom gradient creation
- **Pattern Library**: Pre-designed background patterns
- **Custom Images**: Upload and manage background images
- **Real-time Preview**: Instant application with live feedback

## Key Files to Understand

### Core System Files
1. **`src/app/page.tsx`** - Enhanced main interface with template selection
2. **`src/app/layout.tsx`** - Root layout with visual editor integration
3. **`src/components/kit/`** - 10 fixed components with stable props
4. **`src/lib/system-validator.ts`** - Complete validation system
5. **`src/schema/core.ts`** - Data schema definitions

### Visual Editor Files
6. **`public/dev/phase-d-editor.js`** - Complete visual editor (3,200+ lines)
7. **`public/dev/phase-d-editor.css`** - Editor styling (800+ lines)
8. **`public/dev/inspector.js`** - Visual inspection tools
9. **`src/app/api/tokens/update/route.ts`** - Token persistence API
10. **`src/app/api/upload/image/route.ts`** - Image upload system

### Template System Files
11. **`skins/*/tokens.json`** - Design system tokens for each skin
12. **`skins/*/skin.css`** - Template CSS with scoping
13. **`scripts/build-tokens.ts`** - Token processing system
14. **`scripts/watch-skins.ts`** - Hot reload file watcher

## Menu System Features

### Image Mode (showImages: true)
- **Grid Layout**: 2-6 configurable columns
- **Pagination**: 6-8 items per page with arrow navigation
- **Image Shapes**: Boxed, rounded, or circle
- **Hover Effects**: Elevation and transform animations

### Non-Image Mode (showImages: false)
- **Table Layout**: Clean tabulated format
- **Card Layout**: Compact cards without images
- **Dense Information**: Price-focused display
- **Better Performance**: Faster loading without images

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: 2-3 columns depending on variant
- **Desktop**: Full column configuration

## Development Commands

### Enhanced Development Workflow
```bash
# Core Development
npm run dev              # Start Next.js dev server (main interface)
npm run skins:dev        # Start hot reload watcher for tokens/CSS files

# Token and CSS Management
npm run tokens:build     # Generate CSS from all tokens.json files
npm run skins:build      # Process and scope all skin CSS files

# Safety and Validation
npm run safety:check     # Complete safety validation
npm run safety:branch   # Create design branch for skin work
npm run safety:commit    # Safe commit with validation

# System Testing
npm run validate         # Complete system validation
npm run test:leakage     # Multi-skin CSS leakage testing
npm run build           # Production build with performance checks
```

### Complete Development Setup
```bash
# Terminal 1: Start development server
npm run dev

# Terminal 2: Start hot reload watcher  
npm run skins:dev

# Browser: Navigate to http://localhost:3000
# Use Alt+D for inspector, Alt+G for grid overlay
# Click "🎨 Open Visual Editor" for enhanced editing
```

## Future Agent Guidelines

### When Working on Visual Editor:
1. **Maintain Performance**: Ensure CSS ≤50KB, JS ≤20KB budgets
2. **Test All Features**: Element selection, drag-and-drop, property editing
3. **Validate Integration**: Token system, hot reload, API endpoints
4. **Check Mobile UX**: Touch-friendly controls and responsive design
5. **Ensure Safety**: Use safety guardrails for all changes

### When Adding New Templates:
1. **Follow Template Framework**: Use systematic measurement-driven approach
2. **Create tokens.json**: Include all design system tokens
3. **Implement CSS Scoping**: All selectors prefixed with `[data-skin="id"]`
4. **Add Component Mapping**: Configure `map.yml` for data binding
5. **Validate Performance**: Must pass 50KB CSS budget
6. **Test Multi-Skin**: Ensure no CSS leakage or conflicts

### When Enhancing Editor Features:
1. **Extend EnhancedEditor Class**: Add new functionality to existing modular structure
2. **Update API Endpoints**: Add new endpoints for additional features
3. **Maintain Type Safety**: Update TypeScript interfaces
4. **Add Comprehensive Testing**: Include validation in test suite
5. **Document New Features**: Update both SYSTEM_GUIDE.md and claude.md

### When Working on Upload/Media System:
1. **Security First**: Validate all uploads, check file types and sizes
2. **Optimize Performance**: Implement compression and format conversion
3. **Gallery Management**: Maintain organized storage and retrieval
4. **Integration Testing**: Ensure click-to-replace and drag-and-drop work
5. **Cross-Browser Support**: Test upload functionality across browsers

## System Robustness

The enhanced system includes:
- **Visual Editor**: Complete drag-and-drop interface with professional tools
- **Performance Budgets**: Automated enforcement of CSS ≤50KB, JS ≤20KB limits
- **Multi-Skin Testing**: Side-by-side rendering to catch CSS conflicts
- **Safety Guardrails**: File scope validation, git hygiene, data integrity
- **Type Safety**: Full TypeScript coverage with comprehensive interfaces
- **Error Boundaries**: Graceful error handling and fallback values
- **Hot Reload System**: Real-time token and CSS updates
- **Image Upload Security**: File validation, format checking, size limits
- **API Validation**: Comprehensive request/response validation
- **Mobile Optimization**: Touch-friendly controls and responsive design

## Running the Enhanced System

### Quick Start
1. **Install dependencies**: `npm install`
2. **Start development**: `npm run dev`
3. **Access interface**: http://localhost:3000
4. **Start hot reload**: `npm run skins:dev` (separate terminal)

### Enhanced Workflow
1. **Template Selection**: Choose skin or standalone with visual previews
2. **Restaurant Selection**: Pick from 80+ available restaurants
3. **Generate Website**: Create initial preview
4. **Open Visual Editor**: Click "🎨 Open Visual Editor" button
5. **Customize Design**: Use drag-and-drop, upload images, edit properties
6. **Apply Backgrounds**: Choose from 6+ background options
7. **Real-time Preview**: See all changes instantly
8. **Export/Save**: Use safety commands for version control

### Advanced Features
- **Element Manipulation**: Click any element to edit with 8-point drag handles
- **Property Inspector**: Live CSS editing with color pickers and sliders
- **Image Management**: Upload, organize, and replace images with clicks
- **Background Builder**: Create custom gradients and apply patterns
- **Token Editor**: Real-time design system token editing
- **Component Browser**: Visual component library with mapping interface
- **Multi-Template Support**: Switch between skins and standalone templates
- **Performance Monitoring**: Real-time budget compliance checking

The system now provides a **professional visual design interface** with comprehensive editing tools, drag-and-drop functionality, image management, background options, and real-time customization capabilities - delivering the top-notch UX experience requested.

---

## 📋 **RECENT SYSTEM UPDATES (August 2025)**

### **Data Structure Reorganization**
- **Directory Change**: Moved from `restaurant_data/` to `data/restaurants/`
- **Expanded Dataset**: Now includes 80+ Saudi Arabian restaurants
- **API Updates**: All endpoints updated to reflect new data paths
- **Backward Compatibility**: Maintained all generation functionality

### **Documentation Cleanup**
- **Streamlined Docs**: Consolidated all essential documentation in `/docs/`
- **Removed Legacy**: Eliminated outdated phase files and plans
- **Current Structure**:
  - `claude.md` (root) - Claude context file
  - `docs/SYSTEM_GUIDE.md` - This comprehensive guide
  - `docs/SYSTEM_CAPABILITIES_COMPLETE.md` - Complete system overview
  - `docs/opus4_summary.md` - Cleanup summary
  - `docs/opus4_assessment.md` - System assessment

### **Current Theme System**
The system now includes 6 production-ready themes:
- **Bistly Modern**: Contemporary restaurant design
- **Cafert Modern**: Modern cafe styling
- **Conbiz Premium**: Professional business theme
- **Foodera Modern**: Food-focused design
- **Mehu Fresh**: Fresh and clean aesthetic
- **Quantum Nexus**: Futuristic design approach

### **System Status**
- **Production Ready**: Enterprise-grade capabilities with full Phase 1-4 implementation
- **Performance Optimized**: CSS ≤50KB, JS ≤20KB budgets enforced
- **Clean Architecture**: Professional directory structure following best practices
- **80+ Restaurants**: Complete dataset for testing and production use
- **Visual Editor V2**: Complete drag-and-drop interface with all advanced features