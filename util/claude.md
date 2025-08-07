# Restaurant Website Template System - Requirements & Architecture

## System Overview
This project implements a unified template system for generating restaurant websites using Next.js. The architecture follows a **shared + variant overlay pattern** where common functionality is centralized and template-specific designs are applied as overlays.

## Core Architecture Requirements

### Directory Structure (MANDATORY)
```
Websites_nextjs/
├── templates/
│   ├── _shared/              # Base layer - ALL common functionality
│   │   ├── package.json      # Single source of dependencies
│   │   ├── next.config.ts    # Build configuration
│   │   ├── tsconfig.json     # TypeScript settings
│   │   └── src/
│   │       ├── components/   # Shared UI components
│   │       ├── types/        # TypeScript definitions
│   │       └── data/         # Data structure templates
│   └── variants/             # Design layer - template-specific files ONLY
│       ├── modern-restaurant/
│       ├── classic-restaurant/
│       └── minimal-cafe/
├── places_json/              # Restaurant data (input)
├── final_websites/           # Generated websites (output)
├── generator/                # Build system
└── websites                  # CLI interface
```

**CRITICAL RULE**: Templates are ONLY added under `variants/` directory. Never modify the root `templates/` structure.

### Template Creation Rules

#### For Adding New Templates:
1. **Copy Existing Template**: Always start by copying an existing variant folder
2. **Modify Only Required Files**: Only change files that need visual differences
3. **Update template.json**: Provide accurate metadata and description
4. **Test Immediately**: Use CLI to verify template appears and works

#### Required Files Per Template:
```
variants/{template_name}/
├── template.json           # MANDATORY - Template metadata
└── src/app/               # MANDATORY - Next.js app router files
    ├── layout.tsx         # Page layout, fonts, metadata
    ├── page.tsx           # Homepage structure & components
    ├── globals.css        # Template-specific CSS
    └── theme.ts           # Material-UI theme (colors, typography)
```

### Build System Requirements

#### Merge Process (Automatic):
1. **Copy Base**: All files from `_shared/` copied to build directory
2. **Apply Overlay**: Template-specific files from `variants/{template}/` overwrite base
3. **Data Injection**: Restaurant data inserted into `src/data/restaurant.ts`
4. **Build & Export**: Next.js static build process
5. **Deploy**: Final website moved to `final_websites/`

#### Data Flow:
```
Restaurant JSON → Data Transform → Template Merge → Next.js Build → Static Export
```

### Technology Stack Requirements

#### Core Dependencies (Fixed):
- **Next.js**: 15.4.2 with App Router
- **React**: 19.1.0
- **TypeScript**: 5.0+
- **Material-UI**: 7.2.0 (theming system)
- **Tailwind CSS**: 4.0 (utility classes)

#### Build Tools:
- **Node.js**: Required for build process
- **Static Export**: No server-side rendering
- **Bash CLI**: Interactive template selection

### Template Design Guidelines

#### Visual Differentiation Strategy:
| Template | Primary Color | Font Stack | Visual Style | Use Cases |
|----------|--------------|------------|--------------|-----------|
| Modern Restaurant | #FF6B35 (Orange) | Inter + SF Pro | Cyberpunk, neon effects | Contemporary, fusion, tech-dining |
| Classic Restaurant | #2C1810 (Mahogany) | Playfair Display | Traditional elegance | Fine dining, formal establishments |
| Minimal Cafe | #1A1A1A (Black) | Inter | Clean, minimal | Coffee shops, bakeries, casual |

#### Shared Components (DO NOT DUPLICATE):
- `Navigation.tsx` - Site navigation
- `Footer.tsx` - Site footer
- `Menu.tsx` - Restaurant menu display
- `Gallery.tsx` - Image gallery
- `Contact.tsx` - Contact form
- `About.tsx` - About section
- `Hero*.tsx` - Various hero section styles

### CLI Requirements

#### Auto-Discovery System:
- CLI must automatically detect new templates in `variants/` directory
- Template names pulled from `template.json` files
- No manual registration required

#### User Experience:
1. **Simple Interface**: Number-based selection (1, 2, 3...)
2. **Status Display**: Show available templates, restaurants, generated sites
3. **Local Preview**: Auto-launch websites on http://localhost:8080
4. **Error Handling**: Clear messages for build failures

### Data Requirements

#### Restaurant Data Structure:
```json
{
  "restaurant_info": {
    "name": "Restaurant Name",
    "description": "Description",
    "address": "Full Address",
    "phone": "Phone Number"
  },
  "menu_categories": {
    "Category Name": [
      {
        "item_en": "English Name",
        "item_ar": "Arabic Name", 
        "price": 12.99,
        "description": "Item description"
      }
    ]
  },
  "contact_info": {
    "email": "contact@email.com",
    "website": "www.website.com"
  }
}
```

### Performance Requirements

#### Build Performance:
- **Shared Dependencies**: Single package.json reduces install time
- **Incremental Builds**: Next.js caching for faster rebuilds
- **Static Output**: No runtime server dependencies

#### Runtime Performance:
- **Static Sites**: CDN-ready, fast loading
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags, structured data
- **Accessibility**: WCAG 2.1 AA compliance

### Development Workflow

#### For Non-Developers:
1. Navigate to project directory
2. Run `./websites` CLI
3. Select template and restaurant
4. Wait for generation (2-3 minutes)
5. Preview at http://localhost:8080

#### For Developers:
1. Copy existing template: `cp -r variants/minimal-cafe variants/new-template`
2. Edit `template.json` with new metadata
3. Modify theme.ts for colors/fonts
4. Update globals.css for custom styles
5. Test with `./websites` CLI

### Quality Assurance Requirements

#### Testing Checklist:
- [ ] Template appears in CLI automatically
- [ ] Website generation completes without errors
- [ ] Generated website loads properly
- [ ] Design matches template intention
- [ ] Restaurant data displays correctly
- [ ] Mobile responsiveness works
- [ ] All navigation links function

#### Error Prevention:
- **Validate JSON**: Check template.json syntax
- **Test Builds**: Verify npm install succeeds
- **Check Types**: Ensure TypeScript compiles
- **Validate Data**: Confirm restaurant data format

### Maintenance Requirements

#### Regular Tasks:
- **Dependency Updates**: Keep _shared/package.json current
- **Template Cleanup**: Remove unused variant folders
- **Data Validation**: Verify restaurant JSON files
- **Build Testing**: Test all templates periodically

#### Documentation Updates:
- Update this file when architecture changes
- Maintain template descriptions in template.json
- Document new features in shared components

### Extension Points

#### Adding Custom Components:
1. **Shared Components**: Add to `_shared/src/components/`
2. **Template-Specific**: Add to `variants/{template}/src/components/`
3. **Import Pattern**: Use `@/components/ComponentName` imports

#### Custom Data Fields:
1. Update TypeScript types in `_shared/src/types/`
2. Modify data transformer in `generator/website-builder.js`
3. Use new fields in template components

### Success Metrics

#### System Health Indicators:
- All templates generate successfully
- Build time under 3 minutes per website
- Generated websites load under 2 seconds
- CLI auto-discovery works for new templates
- No TypeScript compilation errors

#### Quality Indicators:
- Templates visually distinct and appropriate
- Restaurant data accurately displayed
- Mobile responsive on all device sizes
- Accessible to screen readers
- SEO optimized structure

## Implementation Status

### Current Templates:
1. **Modern Restaurant** (Cyberpunk design) - Contemporary, neon aesthetics
2. **Classic Restaurant** - Traditional, elegant design
3. **Minimal Cafe** - Clean, minimalist approach

### Development Rules:
1. **NEVER** create new files in root `templates/` directory
2. **ALWAYS** use existing shared components when possible
3. **ONLY** modify files that require visual changes
4. **ALWAYS** test new templates before considering complete
5. **NEVER** duplicate functionality between templates

This architecture ensures scalability, maintainability, and ease of use while providing maximum flexibility for creating diverse restaurant website templates.