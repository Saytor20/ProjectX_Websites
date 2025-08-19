# System Architecture - Restaurant Website Generator
*Created: August 19, 2025, 02:05 AM*
*Last Updated: August 19, 2025, 02:08 AM*

## Overview
Clean, modern restaurant website generator built on Next.js 15 with TypeScript. Features a component-based template system, visual editor, and performance-optimized output.

## Core Architecture

### 🏗️ **Component → Template → Website Flow**
```
Restaurant Data + Template Selection → Component Rendering → Styled Output → Generated Website
```

### 🧩 **Component System (10 Fixed Components)**
- **Stable API**: All components use consistent props interface
- **Type Safety**: Full TypeScript coverage with validated props
- **Reusability**: Components work across all templates

```typescript
// Core Components
Navbar, Hero, MenuList, Gallery, Hours, LocationMap, CTA, Footer, RichText, Section
```

### 🎨 **Template System**
- **Source**: Raw CSS + component mappings in `/skins/[template-id]/`
- **Processing**: CSS automatically scoped with `[data-skin="template-id"]` 
- **Output**: Served via `/api/skins/[skinId]/css` with scoping applied
- **Mapping**: YAML configuration defines component usage and props

### 📊 **Data Flow**
```
/restaurant_data/[restaurant].json → Normalized Structure → Component Props → Rendered Page
```

**Normalized Data Structure:**
- `$.business.name`, `$.business.tagline`, `$.business.description`
- `$.menu.sections[]` (array of menu sections with items)
- `$.gallery.images[]`, `$.locations[0]`, `$.metadata`

## Key Systems

### 🎯 **CSS Scoping Engine** (`src/lib/css-scoper.ts`)
- **Purpose**: Prevents template CSS conflicts
- **Method**: Prefixes all selectors with `[data-skin="template-id"]`
- **Features**: Handles @media queries, keyframes, complex selectors
- **Performance**: Validates CSS size limits (≤50KB)

### 🖼️ **Component Renderer** (`src/lib/component-renderer.tsx`)
- **Dynamic Rendering**: Maps YAML configuration to React components
- **Data Binding**: JSONPath expressions resolve restaurant data
- **Conditional Rendering**: `when` conditions control component visibility
- **Type Safety**: Runtime component validation

### ✏️ **Visual Editor** (`src/dev/EnhancedEditorComponent.tsx`)
- **TypeScript**: Transpiled by Next.js bundler (no raw JS files)
- **Features**: Click-to-select, drag-to-move, property editing
- **Keyboard**: Alt+E to toggle, Escape to close
- **Scope**: Development-only with graceful degradation

## API Endpoints

### **Template System**
- `GET /api/skins` - List available templates
- `GET /api/skins/[skinId]/css` - Get scoped CSS for template
- `GET /api/skins/[skinId]/mapping` - Get component mapping configuration

### **Data & Generation**
- `GET /api/restaurants` - List available restaurant data
- `POST /api/restaurants` - Load specific restaurant data
- `POST /api/generate` - Generate website preview

## File Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout + dev editor
│   ├── page.tsx           # Main generator interface
│   ├── restaurant/[slug]/ # Dynamic restaurant pages
│   └── api/               # REST API endpoints
├── components/kit/        # 10 core components
├── lib/                   # Core utilities
│   ├── css-scoper.ts     # Centralized CSS scoping
│   ├── component-renderer.tsx # Component mapping engine
│   └── mapping-dsl.ts    # Template configuration processor
└── dev/                   # Development tools
    └── EnhancedEditorComponent.tsx # Visual editor

skins/                     # Template sources
├── cafert-modern/         # Example template
│   ├── skin.css          # Unscoped source CSS
│   ├── tokens.json       # Design system tokens
│   └── map.yml           # Component mapping
└── [other-templates]/

restaurant_data/           # Restaurant JSON files
public/dev/               # Static dev assets (CSS only)
```

## Development Workflow

### **Local Development**
```bash
npm run dev          # Start Next.js server
```
- Templates auto-reload when CSS/mapping changes
- Visual editor available at Alt+E
- All components type-checked in real-time

### **Template Creation**
1. Create `/skins/[template-id]/` directory
2. Add `skin.css` (unscoped CSS)
3. Create `map.yml` with component configuration
4. Add `tokens.json` for design system
5. Test with `/api/skins/[template-id]/css`

### **Component Development**
- Never break the stable props API
- Use design tokens for consistent theming
- Test across all existing templates
- Maintain accessibility standards

## Performance & Quality

### **Automated Enforcement**
- **CSS Budget**: ≤50KB per template (build fails if exceeded)
- **Scoping Validation**: All CSS properly scoped, no leakage
- **Component Safety**: Type checking prevents runtime errors
- **Build Validation**: Comprehensive testing before deployment

### **Browser Compatibility**
- Modern browsers (Chrome, Safari, Firefox)
- TypeScript transpilation ensures ES compatibility
- Progressive enhancement for older browsers

## Troubleshooting

### **Template Not Loading**
1. Check `/api/skins/[template-id]/css` responds
2. Verify `skin.css` exists in `/skins/[template-id]/`
3. Check browser console for CSS syntax errors

### **Component Errors**
1. Verify component mapping in `map.yml`
2. Check data paths match normalized structure
3. Ensure all referenced components exist in registry

### **Visual Editor Issues**
1. Confirm development mode (`npm run dev`)
2. Check browser console for TypeScript errors
3. Try Alt+E keyboard shortcut
4. Verify no JavaScript syntax errors

---

**This architecture provides a clean, maintainable system for generating professional restaurant websites with visual editing capabilities.**