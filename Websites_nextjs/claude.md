# Restaurant Website Generator - System Architecture

## Overview

The Restaurant Website Generator is a Next.js-based system that automatically creates production-ready restaurant websites. It follows a **shared base + template variant** architecture where common functionality is centralized and design-specific customizations are applied as overlays.

## Core Architecture

### Directory Structure (MANDATORY)

```
Websites_nextjs/
├── templates/
│   ├── _shared/              # Base layer - ALL common functionality
│   │   ├── package.json      # Single source of Next.js 15 dependencies
│   │   ├── next.config.ts    # Static export configuration
│   │   ├── tsconfig.json     # TypeScript settings
│   │   ├── src/
│   │   │   ├── components/   # Shared UI components (Footer, Menu, etc.)
│   │   │   ├── types/        # TypeScript interfaces for restaurant data
│   │   │   ├── theme/        # Material-UI theme system
│   │   │   └── data/         # Restaurant data structure templates
│   └── variants/             # Design layer - template-specific files ONLY
│       ├── minimal-cafe/     # Clean, sophisticated design
│       ├── modern-restaurant/# Cyberpunk neon aesthetics
│       ├── fiola-dc-authentic/# Luxury fine dining
│       └── ... (13 total)
├── restaurant_data/          # Restaurant JSON files (86+ restaurants)
├── generated_sites/          # Generated websites (output)
├── generator/
│   ├── website-builder.js    # Build engine with dual deployment modes
│   └── temp_build/           # Temporary build directory
└── websites*                 # Interactive CLI interface
```

**CRITICAL RULE**: Templates are ONLY added under `variants/` directory. Never modify the root `templates/` structure or `_shared/` contents.

### Build System Architecture

#### Template Merge Process (Automatic)

1. **Copy Base**: All files from `_shared/` copied to temp build directory
2. **Apply Overlay**: Template-specific files from `variants/{template}/` overwrite base files
3. **Data Injection**: Restaurant JSON transformed and injected into `src/data/restaurant.ts`
4. **Next.js Build**: Runs `npm install && npm run build` for optimized bundle
5. **Deployment Mode Processing**: 
   - Static Mode: Copies `out/` directory (static files)
   - Source Mode: Copies entire Next.js source project
6. **Final Deployment**: Website moved to `generated_sites/Restaurant Name/`

#### Dual Deployment Modes

**Static Mode (Testing & Preview)**:
```typescript
// Output Structure
generated_sites/Restaurant Name/
├── index.html              # Static homepage
├── 404.html               # Error page
├── _next/static/          # Optimized CSS/JS bundles
├── favicon.ico            # Site icon
├── restaurant-data.json   # Restaurant data reference
└── deployment-info.json   # Build metadata with mode: "static"
```
- **Purpose**: Local testing, CDN deployment, static hosting
- **Server**: Python HTTP server on http://localhost:8080
- **Deployment**: S3, Netlify, GitHub Pages, Cloudflare Pages

**Source Mode (Production Deployment)**:
```typescript
// Output Structure  
generated_sites/Restaurant Name/
├── src/                   # Complete Next.js source code
│   ├── app/              # App Router pages (layout.tsx, page.tsx)
│   ├── components/       # React components
│   └── types/            # TypeScript definitions
├── package.json          # Next.js 15 dependencies
├── next.config.ts        # Next.js configuration
├── restaurant-data.json  # Restaurant data
└── deployment-info.json  # Build metadata with mode: "source"
```
- **Purpose**: Vercel deployment, full Next.js functionality
- **Server**: `npm run dev` for development, `npm run build` for production
- **Deployment**: Vercel, Netlify (Next.js), custom Next.js hosting

### Technology Stack Requirements

#### Fixed Dependencies (Shared Base)
```json
{
  "dependencies": {
    "next": "15.4.2",
    "react": "19.1.0", 
    "react-dom": "19.1.0",
    "@mui/material": "^7.2.0",
    "@mui/icons-material": "^7.2.0",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "typescript": "^5"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19", 
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.4.2"
  }
}
```

#### Build Tools Configuration
- **Next.js**: App Router architecture with static export capability
- **TypeScript**: Strict mode with comprehensive type checking
- **Tailwind CSS**: Utility-first styling system
- **Material-UI**: Component library with theming
- **ESLint**: Code quality enforcement

### Template Creation Rules

#### Required Files Per Template
```typescript
variants/template-name/
├── template.json           # MANDATORY - Template metadata
└── src/app/               # MANDATORY - Next.js App Router files
    ├── layout.tsx         # Page layout, fonts, metadata
    ├── page.tsx           # Homepage structure & components
    ├── globals.css        # Template-specific CSS
    ├── theme.ts           # Material-UI theme configuration
    └── favicon.ico        # Optional template icon
```

#### Template Development Process
1. **Copy Existing**: Always start by copying `variants/minimal-cafe/`
2. **Modify Required Files**: Only change files that need visual differences
3. **Update Metadata**: Edit `template.json` with accurate information
4. **Test Immediately**: Use CLI to verify template appears and builds correctly

#### Template Differentiation Strategy
| Template | Primary Color | Font Stack | Visual Style | Use Case |
|----------|--------------|------------|--------------|----------|
| minimal-cafe | #1A1A1A (Black) | Inter | Clean, minimal | Coffee shops, bakeries |
| modern-restaurant | #FF6B35 (Orange) | Inter + SF Pro | Cyberpunk, neon effects | Contemporary, fusion |
| fiola-dc-authentic | #2C1810 (Mahogany) | Playfair Display | Traditional elegance | Fine dining |
| bbq-smokehouse | #8B4513 (Brown) | Oswald | Rustic American | BBQ, grills |
| azure-oasis | #0369A1 (Blue) | Inter | Mediterranean | Seafood, Mediterranean |

#### Shared Components (DO NOT DUPLICATE)
Located in `_shared/src/components/`:
- `Header.tsx` - Site navigation and branding
- `Footer.tsx` - Site footer with contact info
- `Menu.tsx` - Restaurant menu display with categories
- `Gallery.tsx` - Photo gallery component
- `Contact.tsx` - Contact form and information
- `About.tsx` - Restaurant story and details

### CLI System Architecture

#### Auto-Discovery System
```typescript
// Template Discovery Logic
const variantsDir = '/templates/variants';
const templates = fs.readdirSync(variantsDir)
  .filter(dir => fs.existsSync(`${variantsDir}/${dir}/template.json`))
  .map(dir => {
    const config = JSON.parse(fs.readFileSync(`${variantsDir}/${dir}/template.json`));
    return { id: dir, name: config.name, ...config };
  });
```

#### Restaurant Discovery Logic
```typescript
// Restaurant Data Discovery
const restaurantFiles = fs.readdirSync('restaurant_data')
  .filter(file => file.endsWith('.json') && !file.includes('_processing_summary'))
  .sort();
```

#### CLI Menu Structure
1. **Build Website 🏗️** - Main generation workflow
2. **System Status 📊** - Display available templates/restaurants/generated sites
3. **View Generated Sites 📁** - Preview existing websites with auto-server
4. **Clean Generated Sites 🗑️** - Remove all generated websites
5. **Exit** - Close CLI

### Data Architecture

#### Restaurant Data Structure (TypeScript)
```typescript
interface RestaurantData {
  restaurant_info: {
    id: string;
    name: string;
    region: string;
    state: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    rating: number;
    review_count: number;
    type_of_food: string;
    hungerstation_url?: string;
  };
  menu_categories: {
    [categoryName: string]: MenuItem[];
  };
  generated_at: string;
  source: string;
}

interface MenuItem {
  item_en: string;
  item_ar: string;
  price: number;
  currency: string;
  description: string;
  image: string;
  offer_price?: number;
  discount?: string;
  menu_id: number;
}
```

#### Data Flow Process
```
Restaurant JSON → Data Validation → TypeScript Interface → 
Template Injection → Next.js Build → Static/Source Output
```

### Performance Architecture

#### Build Performance Optimizations
- **Shared Dependencies**: Single `package.json` reduces install time
- **Incremental Builds**: Next.js caching system for faster rebuilds
- **Template Merge**: Copy-on-write system for efficient file operations
- **Parallel Processing**: Multiple build steps run concurrently

#### Runtime Performance Features
- **Static Export**: CDN-ready HTML/CSS/JS for fastest loading
- **Next.js Optimizations**: Automatic code splitting, image optimization
- **Responsive Images**: Optimized image loading with Next.js Image component
- **SEO Optimization**: Meta tags, structured data, semantic HTML

### Quality Assurance Requirements

#### Automated Testing Checklist
```typescript
// Template Validation Pipeline
const validationChecks = [
  'template_appears_in_cli',
  'website_generation_succeeds',
  'build_completes_under_3_minutes',
  'website_loads_properly',
  'restaurant_data_displays_correctly',
  'mobile_responsive_works',
  'both_deployment_modes_function',
  'typescript_compiles_without_errors'
];
```

#### Error Prevention Systems
- **JSON Validation**: Restaurant data structure verification
- **TypeScript Checks**: Compile-time error prevention  
- **Template Validation**: `template.json` syntax verification
- **Build Verification**: Next.js build success confirmation

### Development Workflow Architecture

#### For Template Developers
```bash
# 1. Template Creation
cp -r templates/variants/minimal-cafe templates/variants/new-template
cd templates/variants/new-template

# 2. Customization Phase
# Edit src/app/layout.tsx (metadata, fonts)
# Edit src/app/page.tsx (components, structure)
# Edit src/app/globals.css (styling)
# Edit src/app/theme.ts (Material-UI theme)
# Edit template.json (metadata)

# 3. Testing Phase
../../websites
# Select new template, test with various restaurants

# 4. Validation Phase
# Verify both deployment modes work
# Test responsive design
# Confirm TypeScript compilation
```

#### For System Developers
```bash
# 1. Shared Component Development
cd templates/_shared/src/components
# Edit shared components (affects all templates)

# 2. Build System Modifications  
cd generator
# Edit website-builder.js for build process changes

# 3. CLI Enhancements
# Edit websites script for CLI improvements

# 4. System Testing
# Test with all templates and multiple restaurants
```

### Deployment Architecture

#### Static Deployment Pipeline
```
Next.js Build → Static Export (out/) → Copy to generated_sites/ → 
Python Server Launch → http://localhost:8080
```

#### Source Deployment Pipeline  
```
Next.js Source Copy → generated_sites/ → Ready for Vercel/Netlify → 
npm run dev (development) / vercel --prod (production)
```

#### Deployment Mode Selection Logic
```typescript
// CLI Deployment Mode Logic
const deploymentMode = userChoice === '1' ? 'static' : 'source';
const outputType = deploymentMode === 'static' ? 'Static Files' : 'Next.js Source';
const purpose = deploymentMode === 'static' ? 'Testing & CDN' : 'Vercel Production';
```

### Extension Points

#### Adding Custom Components
1. **Shared Components**: Add to `_shared/src/components/` (affects all templates)
2. **Template-Specific**: Add to `variants/{template}/src/components/` (template only)
3. **Import Pattern**: Use `@/components/ComponentName` for consistency

#### Custom Data Fields
1. **Type Definitions**: Update `_shared/src/types/restaurant.ts`
2. **Data Processing**: Modify `generator/website-builder.js` transformation logic
3. **Component Usage**: Access via `restaurantData.new_field` in templates

#### New Template Categories
1. **Cuisine-Specific**: Create templates for specific food types (Italian, Chinese, etc.)
2. **Business Models**: Fast food, fine dining, coffee shop templates
3. **Regional Styles**: Templates for different cultural aesthetics

### Monitoring and Maintenance

#### System Health Indicators
```typescript
const healthMetrics = {
  template_count: 13,
  restaurant_data_count: 86,
  build_success_rate: '100%',
  average_build_time: '2.5 minutes',
  cli_auto_discovery: 'working',
  both_deployment_modes: 'functional'
};
```

#### Regular Maintenance Tasks
- **Dependency Updates**: Keep Next.js and React versions current
- **Template Testing**: Verify all templates build successfully
- **Data Validation**: Ensure restaurant JSON files are valid
- **Performance Monitoring**: Track build times and optimization opportunities

### Security Considerations

#### Build Security
- **Input Validation**: All restaurant data validated before processing
- **File System Security**: Restricted access to system directories
- **Dependency Security**: Regular security updates for Node.js packages
- **Output Sanitization**: Generated HTML sanitized to prevent XSS

#### Deployment Security
- **Static Mode**: No server-side vulnerabilities (static files only)
- **Source Mode**: Standard Next.js security practices
- **Environment Isolation**: Each build runs in isolated temporary directory

## Implementation Status

### Current Capabilities ✅
- **13 Professional Templates**: Each with unique design and purpose
- **86+ Restaurant Datasets**: Complete Saudi Arabian restaurant data
- **Dual Deployment Modes**: Static (testing) and Source (production)
- **Interactive CLI**: Auto-discovery of templates and restaurants
- **Next.js 15 + React 19**: Latest stable technology stack
- **TypeScript Throughout**: Type safety across entire system
- **Mobile-First Design**: All templates responsive by default
- **SEO Optimization**: Meta tags and structured data included

### Development Rules (CRITICAL)
1. **NEVER** create files in root `templates/` directory
2. **NEVER** modify `_shared/` contents (affects all templates)
3. **ALWAYS** use existing shared components when possible
4. **ALWAYS** test new templates with CLI before considering complete
5. **NEVER** duplicate functionality between templates
6. **ALWAYS** follow TypeScript strict mode requirements
7. **ALWAYS** ensure both deployment modes work correctly

### Success Metrics
- **Build Time**: Under 3 minutes per website
- **Template Discovery**: Automatic detection of new templates
- **Data Integration**: 100% restaurant data accuracy
- **Deployment Success**: Both modes function correctly
- **Performance**: Generated websites load under 2 seconds
- **Compatibility**: Works across modern browsers and devices

This architecture ensures scalability, maintainability, and performance while providing maximum flexibility for creating diverse restaurant website templates using modern Next.js development practices.