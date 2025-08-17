# ProjectX Websites - Advanced Restaurant Website Generator
*Last Updated: August 17, 2025*

## Overview
Professional restaurant website generation system with complete visual editor capabilities. Features 4-phase implementation including canvas editing, content management, theme system, and plugin architecture.

## Quick Start
```bash
npm run dev              # Start development server
npm run skins:dev        # Hot reload for themes (optional)
```

## Key Features
- **Visual Editor V2**: Complete drag-and-drop interface with 4 implementation phases
- **10-Component Kit**: Navbar, Hero, MenuList, Gallery, Hours, LocationMap, CTA, Footer, RichText, Section
- **6 Professional Themes**: Token-based design system with CSS scoping
- **85+ Restaurant Dataset**: Complete restaurant data for testing and production
- **Performance Compliant**: CSS ≤50KB, JS ≤15-20KB budgets enforced
- **WCAG 2.1 AA Accessible**: Full accessibility compliance

## Architecture
- **Next.js 15** + React 19 + TypeScript
- **Component Kit + Skin System** with data-skin scoping
- **Token-based Design System** with hot reload
- **API-first Development** with comprehensive endpoints
- **Production Ready** with performance monitoring

## Directory Structure
```
src/editor/              # Complete Visual Editor V2 (Phases 1-4)
src/components/kit/      # 10-component system
src/app/api/            # REST API endpoints
skins/                  # 6 theme system with tokens
data/restaurants/       # 85+ restaurant dataset
docs/                   # Complete documentation (16 files)
scripts/                # Build automation
public/skins/           # Generated CSS
tools/                  # CLI tools and VS Code workspace
```

## Development Commands
```bash
npm run dev             # Development server
npm run skins:dev       # Theme hot reload
npm run validate        # System validation
npm run safety:check    # Safety validation

# CLI Tools
./tools/websites        # Website generation CLI
```

## Documentation
See `/docs/` directory for complete system documentation:
- **SYSTEM_CAPABILITIES_COMPLETE.md**: Full feature overview
- **claude.md**: Technical architecture details
- **Phase files**: Implementation documentation
- **opus4_summary.md**: System assessment results

## Performance Standards
- CSS ≤50KB per theme (enforced)
- JS ≤15-20KB gzipped with dynamic loading
- Cross-browser compatible (Chrome, Safari, Firefox)
- WCAG 2.1 AA accessibility compliant
- Production-ready output

---
*ProjectX Websites: Professional restaurant website generation with enterprise-grade visual editing capabilities*

## Repository
- **GitHub**: [Saytor20/ProjectX_Websites](https://github.com/Saytor20/ProjectX_Websites)
- **Project Name**: ProjectX Websites
- **Package Name**: projectx-websites