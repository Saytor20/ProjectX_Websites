# System Architecture - Restaurant Website Generator
*Created: August 19, 2025, 02:05 AM*
*Last Updated: December 29, 2024*
*Migration: Template Package System - Phase 0 Complete*

## System Overview
**Production-Ready Restaurant Website Generator** built with Next.js 15, TypeScript, and React. Features a sophisticated template system, advanced visual editor, and automated deployment pipeline for creating professional restaurant websites.

### 🎯 **Current System Status: FULLY OPERATIONAL**
- **8 Working Templates**: Production-ready with real restaurant data integration
- **Simple Design Tools**: 6-box interface for intuitive website editing  
- **Zero JavaScript Errors**: All React/Next.js issues resolved
- **Consistent Rendering**: Design and Preview tabs show identical templates
- **TypeScript Integration**: Full type safety across entire codebase

---

## 🏗️ **System Architecture & Technology Stack**

### **Frontend Framework**
- **Next.js 15** with App Router and React 19
- **TypeScript** for complete type safety and development experience
- **CSS Modules** with automated scoping for template isolation
- **React Components** with consistent props interface across all templates

### **Template Engine Architecture**
```
Restaurant JSON Data + Template Package → React Components → CSS Modules → Generated Website
```

### **Data Processing Pipeline**
```
data/restaurants/*.json → Zod Validation → Template Package → React SSR → Styled Website
```

---

## 📊 **Restaurant Data Structure**

Our system uses a standardized JSON format for all restaurant data. Every restaurant file follows this identical structure:

### **Sample Restaurant Data Format**
```json
{
  "restaurant_info": {
    "name": "Abu Al Khair Restaurant",
    "description": "Authentic Middle Eastern cuisine with traditional recipes",
    "cuisine_type": ["Middle Eastern", "Lebanese", "Arabic"],
    "address": "123 Main Street, Downtown District, City Center", 
    "phone": "+966 12 345 6789",
    "working_hours": "Daily 11:00 AM - 11:00 PM",
    "delivery": true,
    "pickup": true,
    "rating": 4.5,
    "price_range": "$$"
  },
  "menu": [
    {
      "id": "1",
      "name": "Chicken Shawarma",
      "description": "Tender marinated chicken wrapped in fresh pita bread",
      "price": "25",
      "category": "Main Dishes",
      "image": "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400"
    },
    {
      "id": "2",
      "name": "Beef Kabab", 
      "description": "Grilled beef skewers seasoned with traditional spices",
      "price": "35",
      "category": "Main Dishes",
      "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=400"
    }
    // ... more menu items
  ]
}
```

### **Data Normalization Process**
The system automatically transforms raw restaurant JSON into a normalized structure:
- `$.restaurant_info.*` → Business details and contact information
- `$.menu[]` → Menu items grouped by categories  
- Images, ratings, hours → Structured for component consumption
- All data validated and type-checked during processing

---

## 🎨 **Template Package System**

### **Template Structure**
Each template is a self-contained package in `/templates/[template-name]/`:

```
templates/bistly/
├── Template.tsx       # Main React component
├── template.module.css # CSS Modules (auto-scoped)
├── manifest.json      # Template metadata & slots
└── README.md          # Template documentation
```

### **Design Tokens System**
```json
{
  "colors": {
    "primary_color": "#D0965C",
    "heading_color": "#2D4443", 
    "text_color": "#2D4443",
    "white_color": "#ffffff"
  },
  "fonts": {
    "heading_font": "Marcellus, serif",
    "body_font": "Roboto, sans-serif" 
  },
  "spacing": {
    "xs": "0.25rem", "sm": "0.5rem", "md": "1rem",
    "lg": "1.5rem", "xl": "2rem", "2xl": "3rem"
  }
}
```

### **Template Manifest**
Templates declare their slots and dependencies:
```json
{
  "id": "bistly",
  "name": "Bistly Modern",
  "slots": ["navbar", "hero", "menu", "footer"],
  "preview": "/preview/bistly.png",
  "version": "1.0.0"
}
```

---

## ⚙️ **Template Isolation & Styling**

### **CSS Modules** (Built-in Next.js)
- **Purpose**: Automatic style isolation per template
- **Method**: CSS Modules generate unique class names automatically
- **Processing**: Next.js handles scoping at build time
- **Validation**: Enforces CSS size limits (≤50KB per template)

### **Example CSS Module**
```css
/* template.module.css */
.navbar { background: #fff; }
@media (max-width: 768px) { .navbar { display: none; } }

/* Output (auto-scoped) */
.Bistly_navbar__3xK9z { background: #fff; }
@media (max-width: 768px) { .Bistly_navbar__3xK9z { display: none; } }
```

---

## 🖼️ **Component System Architecture**

### **10 Fixed React Components**
```typescript
// Core Component Library
Navbar     // Navigation with logo, menu, social links
Hero       // Main banner with CTA buttons  
MenuList   // Restaurant menu with categories
Gallery    // Photo gallery grid
Hours      // Operating hours display
LocationMap // Address and map integration
CTA        // Call-to-action sections
Footer     // Contact info and links  
RichText   // Formatted content blocks
Section    // Generic container component
RawHTML    // Direct HTML injection for complex layouts
```

### **Component Props Interface**
```typescript
interface ComponentProps {
  id: string;
  variant?: string;
  theme?: ThemeVariant;
  layout?: LayoutOptions; 
  data: ComponentData;
  className?: string;
}
```

### **Data Binding System**
Components receive data through JSONPath expressions:
```yaml
- as: Hero
  props:
    title: "$.restaurant_info.name"           # Maps to restaurant name
    subtitle: "$.restaurant_info.description" # Maps to description
    rating: "$.restaurant_info.rating"        # Maps to rating
```

---

## ✏️ **Visual Design Editor System**

### **Simple Design Tools Interface**
Modern 6-box tool system for intuitive website editing:

1. **👆 Select Tool** - Click any element to select with 8-point resize handles
2. **🎨 Colors** - Color picker popup for text and background colors
3. **📐 Shapes** - Add rectangles, circles, triangles with proper layering
4. **🖼️ Pictures** - Import images via file upload or URL
5. **🔗 Links** - Click text to add/edit hyperlinks  
6. **📝 Text** - Edit text content inline

### **Advanced Editor Implementation**
**Primary Editor**: `src/dev/editor/MoveableEditor.tsx`
- **Technology**: React + TypeScript with Moveable.js library
- **Features**: Drag-and-drop, resize handles, property inspector
- **Real-time**: Live CSS editing with color pickers and sliders
- **Keyboard Shortcuts**: Alt+E to activate, Escape to close

### **Editor Capabilities**
- **Element Selection**: Click-to-select with visual highlighting
- **Multi-select**: Shift+click for multiple element selection
- **Drag & Drop**: Alt+drag to reposition elements
- **Resize**: 8-point handles for precise element sizing
- **Property Panel**: Live CSS editing (colors, fonts, spacing)
- **History System**: Undo/redo with change tracking

---

## 🛠️ **Template Creation Workflow**

### **Step-by-Step Template Development**
```bash
# 1. Scaffold new template
npm run scaffold:template bistly

# 2. Generated structure
templates/bistly/
├── Template.tsx          # React component
├── template.module.css   # CSS Modules
├── manifest.json         # Metadata
└── README.md            # Documentation

# 3. Start development server
npm run dev

# 4. Test template
curl http://localhost:3000/api/templates
```

### **Template Development Standards**
- **CSS Performance**: ≤50KB budget enforced automatically
- **Component Integration**: Must use existing 10-component library
- **Responsive Design**: Mobile-first with 768px breakpoint
- **Browser Testing**: Chrome, Safari, Firefox compatibility required
- **Data Integration**: All restaurant data fields must be mapped

### **Quality Assurance Checklist**
- [ ] CSS Modules validation (automatic scoping)
- [ ] Performance budget compliance  
- [ ] Cross-template isolation testing
- [ ] Mobile responsive verification
- [ ] Data binding accuracy check
- [ ] Browser compatibility testing

---

## 🚀 **API Endpoints & System Integration**

### **Template API Routes**
- `GET /api/templates` - List all available Template Packages
- `GET /api/templates/[id]/manifest` - Get template metadata
- `POST /api/templates/[id]/render` - Server-side render with data

### **Restaurant Data API**  
- `GET /api/restaurants` - List available restaurant data files
- `GET /api/restaurants/[id]` - Load specific restaurant data (validated)
- `POST /api/generate` - Generate website with template + data

### **Editor Integration API**
- `POST /api/editor/save` - Save visual editor changes
- `GET /api/editor/history` - Retrieve edit history
- `POST /api/editor/upload` - Handle image uploads

---

## 📁 **Complete File Structure**

```
Websites_nextjs/
├── src/                           # Core application source
│   ├── app/                       # Next.js 15 App Router
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Main generator interface
│   │   ├── globals.css            # Global styles
│   │   ├── restaurant/[slug]/     # Dynamic restaurant pages
│   │   └── api/                   # REST API endpoints
│   │       ├── restaurants/route.ts    # Restaurant data API
│   │       └── templates/route.ts      # Template registry API
│   ├── components/kit/            # Fixed component library (10 components)
│   ├── lib/                       # Core utilities
│   │   ├── schema.ts              # Zod Restaurant schema
│   │   ├── tokens.ts              # CSS variable defaults
│   │   └── image.ts               # Image URL utilities
│   └── editor/                    # Patch Panel editor
│       ├── PatchPanel.tsx         # Main editor component
│       ├── Outline.tsx            # Element outliner
│       ├── registry.ts            # Template registry
│       └── useEditableText.ts     # Text editing hook
├── templates/                     # Template Packages (self-contained)
│   ├── bistly/
│   │   ├── Template.tsx
│   │   ├── template.module.css
│   │   ├── manifest.json
│   │   └── README.md
│   ├── shawarma/
│   ├── simple/
│   └── (others...)
├── data/
│   └── restaurants/               # Restaurant JSON files
│       ├── abu_al_khair_63191.json     # Standardized data
│       └── coffee_address_153199.json
├── tools/                         # Build & migration tools
│   ├── scaffold-template.ts      # Template scaffolder
│   ├── ingest-envato.ts          # Envato converter
│   └── validate-template.ts      # Template validator
├── docs/                          # System documentation
│   └── ARCHITECTURE.md            # This document
├── public/                        # Static assets
│   └── preview/                   # Template previews
├── package.json
├── tsconfig.json
├── next.config.ts                 # Next.js configuration
└── README.md
```

---

## 🔧 **Development Commands & Workflow**

### **Local Development**
```bash
npm run dev              # Start Next.js development server  
npm run build            # Production build with TypeScript validation
npm run lint             # ESLint code quality check
npm run type-check       # TypeScript compilation check
```

### **Template Development Workflow**
```bash
# 1. Start development environment
npm run dev

# 2. Create new template
npm run scaffold:template my-template

# 3. Test template
curl http://localhost:3000/api/templates

# 4. Validate and deploy
npm run validate:template my-template
npm run build           # Production build
```

---

## 🎯 **Performance & Quality Standards**

### **Automated Quality Enforcement**
- **CSS Budget**: ≤50KB per template (build fails if exceeded)
- **TypeScript**: 100% type coverage, no `any` types allowed
- **Component Safety**: Runtime validation prevents errors
- **Browser Compatibility**: Chrome, Safari, Firefox support
- **Mobile Performance**: <2 seconds load time on 3G

### **Template Quality Scorecard**
- **Visual Fidelity**: 85/100 minimum score required
- **Performance**: CSS <50KB, no JavaScript errors
- **Responsive**: Perfect mobile adaptation at 768px
- **Data Integration**: All restaurant fields properly mapped
- **Cross-Browser**: Works in 3+ major browsers

---

## 🔍 **System Evaluation Considerations**

### **Current Architecture Strengths**
1. **Mature Technology Stack**: Next.js 15 + React 19 + TypeScript
2. **Production-Ready**: 8 working templates, zero JavaScript errors
3. **Sophisticated Editor**: Advanced visual editing capabilities
4. **Performance Optimized**: CSS budgets, automated scoping
5. **Type Safety**: Full TypeScript coverage prevents runtime errors
6. **Scalable Architecture**: Component-based with clean separation

### **System Complexity Assessment**
- **Frontend Complexity**: High (Advanced React, TypeScript, visual editor)
- **Template System**: Medium-High (CSS scoping, component mapping)
- **Data Processing**: Medium (JSON normalization, validation)
- **Editor Implementation**: High (Moveable.js, real-time editing)
- **Build Pipeline**: Medium (Next.js, automated validation)

### **Alternative Platform Considerations**
- **Current System**: Full-featured, production-ready, high complexity
- **Simpler Alternative**: Basic template system with limited customization
- **Trade-offs**: Feature richness vs. simplicity, power vs. ease of use

---

## 📋 **System Deployment Status**

### **✅ Production-Ready Features**
- 8 working templates with restaurant data integration
- Simple design tools with intuitive 6-box interface
- Consistent template rendering across all views
- TypeScript integration with zero JavaScript errors
- Advanced visual editor with drag-and-drop capabilities
- Performance optimization and automated quality checks

### **🚀 Ready for Production Deployment**
The system has reached full operational status with comprehensive features, robust architecture, and production-ready code quality. All critical issues have been resolved and the platform is suitable for generating professional restaurant websites.

---

**This architecture provides a comprehensive, production-ready system for generating professional restaurant websites with advanced visual editing capabilities and robust performance standards.**

## Key Systems

### 🎯 **Template Package System**
- **Purpose**: Self-contained, typed template components
- **Method**: Each template is a React component with CSS Modules
- **Features**: Manifest-based configuration, slot system
- **Performance**: Validates CSS size limits (≤50KB)

### 🖼️ **Component Kit** (`src/components/kit/`)
- **10 Core Components**: Navbar, Hero, MenuList, Gallery, etc.
- **Data Binding**: Props directly from validated Restaurant data
- **Type Safety**: Full TypeScript coverage
- **Flexibility**: Templates compose components as needed

### ✏️ **Patch Panel Editor** (`src/editor/PatchPanel.tsx`)
- **TypeScript**: Simple property editor (no Moveable.js)
- **Features**: Text editing, color changes, CSS variables
- **Keyboard**: Alt+E to toggle, Escape to close
- **Scope**: Development-only with graceful degradation

## API Endpoints

### **Template System**
- `GET /api/templates` - List available templates
- `GET /api/templates/[id]/manifest` - Get template metadata
- `POST /api/templates/[id]/render` - Server-side render with data

### **Data & Generation**
- `GET /api/restaurants` - List available restaurant data
- `POST /api/restaurants` - Load specific restaurant data
- `POST /api/generate` - Generate website preview

## File Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main generator interface
│   ├── restaurant/[slug]/ # Dynamic restaurant pages
│   └── api/               # REST API endpoints
│       ├── restaurants/route.ts
│       └── templates/route.ts
├── components/kit/        # 10 core components
├── lib/                   # Core utilities
│   ├── schema.ts         # Zod Restaurant schema
│   ├── tokens.ts         # CSS variable defaults
│   └── image.ts          # Image utilities
└── editor/                # Patch Panel editor
    ├── PatchPanel.tsx
    └── registry.ts

templates/                 # Template Packages
├── bistly/
│   ├── Template.tsx      # React component
│   ├── template.module.css
│   └── manifest.json
└── [other-templates]/

data/restaurants/          # Restaurant JSON files
public/preview/           # Template preview images
tools/                     # Build tools
├── validate-template.ts  # Template validator
├── scaffold-template.ts  # Template scaffolder
└── ingest-envato.ts     # HTML converter
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
1. Run `npm run scaffold:template [name]`
2. Edit `templates/[name]/Template.tsx` component
3. Style with `template.module.css` (CSS Modules)
4. Configure `manifest.json` with slots
5. Test with `/api/templates`

### **Component Development**
- Never break the stable props API
- Use design tokens for consistent theming
- Test across all existing templates
- Maintain accessibility standards

## Performance & Quality

### **Automated Enforcement**
- **CSS Budget**: ≤50KB per template (build fails if exceeded)
- **Module Validation**: CSS Modules auto-scope, no leakage
- **Component Safety**: Type checking prevents runtime errors
- **Build Validation**: Comprehensive testing before deployment

### **Browser Compatibility**
- Modern browsers (Chrome, Safari, Firefox)
- TypeScript transpilation ensures ES compatibility
- Progressive enhancement for older browsers

## Troubleshooting

### **Template Not Loading**
1. Check `/api/templates` includes your template
2. Verify `Template.tsx` exports default component
3. Check browser console for module errors

### **Component Errors**
1. Verify component imports in Template.tsx
2. Check data props match Restaurant schema
3. Ensure all kit components exist in `src/components/kit/`

### **Visual Editor Issues**
1. Confirm development mode (`npm run dev`)
2. Check browser console for TypeScript errors
3. Try Alt+E keyboard shortcut
4. Verify no JavaScript syntax errors

---

**This architecture provides a clean, maintainable system for generating professional restaurant websites with visual editing capabilities.**