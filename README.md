# Restaurant Website Generator - Template Package System

A modern, production-ready restaurant website generator built with Next.js 15, TypeScript, and React. Features a robust Template Package system, visual block editor, and comprehensive component architecture for creating professional restaurant websites.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## ✨ Key Features

### 🎨 Template Package System
- **11 Working Templates**: Professional designs ready for production
  - Bistly - Elegant bistro aesthetic
  - Simple Modern - Clean, minimalist design  
  - Royate - Royal themed template
  - Foodera & Foodera-v2 - Modern food themes
  - Mehu - Fresh modern theme
  - Shara - Contemporary design
  - Tasty - Delicious food focus
  - Callix - Professional calling template
  - Cafe & Coill - Additional themed templates

### 🛠️ Block-Level Visual Editor
Modern block editor with safe, predictable editing:
- **Block Outline** - Navigate template structure with click-to-select
- **Patch Panel** - Dynamic controls for text, images, variants, and spacing
- **Inline Text Editing** - Contenteditable with debounced updates
- **Image Swapping** - Click to replace images with proper validation
- **Variant Toggles** - Switch between design variants (light/dark themes)
- **Spacing Controls** - Adjust margins and padding with steps
- **Keyboard Shortcuts** - Alt+E to toggle, proper undo/redo support

### 🏗️ Template Package Architecture
7 standardized slots for consistent layouts:
1. **Navbar** - Navigation with logo and menu
2. **Hero** - Hero banner with CTA buttons  
3. **Menu** - Restaurant menu with categories
4. **Gallery** - Photo gallery grid
5. **Hours** - Operating hours and contact
6. **CTA** - Call-to-action sections
7. **Footer** - Contact info and links

Each template is a self-contained package with:
- `Template.tsx` - React component with data-block attributes
- `template.module.css` - Scoped CSS modules
- `manifest.json` - Template metadata and configuration
- Editor field registration for visual customization

## 🔧 Development

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git

### Available Scripts

```bash
npm run dev                    # Start development server
npm run build                  # Build for production  
npm run start                  # Start production server
npm run lint                   # Run ESLint
npm run type-check             # TypeScript compilation check
npm run validate-template      # Validate template structure
npx tsx tools/scaffold-template.ts  # Create new template
npx tsx tools/ingest-envato.ts       # Convert HTML templates
```

### Project Structure

```
Websites_nextjs/
├── src/
│   ├── app/              # Next.js 15 App Router
│   │   ├── api/          # API routes (restaurants, templates)
│   │   ├── restaurant/[slug]/  # Dynamic restaurant pages
│   │   └── layout.tsx    # Root layout with editor integration
│   ├── components/kit/   # 10 core restaurant components
│   ├── editor/           # Block editor system
│   │   ├── registry.ts   # Field registration system
│   │   ├── Outline.tsx   # Block tree navigation
│   │   └── PatchPanel.tsx # Dynamic editing controls
│   └── lib/              # Core utilities (schema, tokens, image)
├── templates/            # Template Package registry
│   ├── bistly/           # Individual template packages
│   ├── simple-modern/    # Each with Template.tsx + CSS + manifest
│   └── registry.ts       # Template discovery system
├── tools/                # Development tools
│   ├── scaffold-template.ts  # Template generator
│   ├── ingest-envato.ts      # HTML converter
│   └── validate-template.ts  # Validation tool
├── restaurant_data/      # Restaurant JSON data (Zod schema)
└── docs/                 # Architecture documentation
```

## 🎯 Usage

### Generating a Website

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Select a template**
   - Navigate to the Templates tab
   - Choose from 7 available templates
   - Select a restaurant from the data

3. **Customize the design**
   - Use the Design tab for visual editing
   - Click elements to select and modify
   - Apply colors, add shapes, upload images

4. **Preview the result**
   - Switch to Preview tab
   - Opens in new window for full experience
   - All changes auto-save to localStorage

### Visual Editor Keyboard Shortcuts

- `Alt + E` - Toggle visual editor
- `Alt + Drag` - Move elements
- `Shift + Drag` - Resize elements
- `Escape` - Close editor

## 🏢 Template Development

### Creating a New Template

1. **Create template directory**
   ```
   templates/your-template/
   ├── tokens.json    # Design tokens
   ├── styles.css     # Template styles
   └── map.yml        # Component mapping
   ```

2. **Define design tokens**
   ```json
   {
     "colors": {
       "primary": "#B38E6A",
       "secondary": "#534931"
     },
     "fonts": {
       "sans": "Montserrat",
       "serif": "Raleway"
     }
   }
   ```

3. **Register in registry**
   ```typescript
   // templates/registry.ts
   export const templates = {
     'your-template': {
       name: 'Your Template',
       path: '/templates/your-template'
     }
   }
   ```

### Template Standards

- **CSS Budget**: ≤50KB per template
- **Scoped Styles**: All CSS auto-scoped to template
- **Responsive**: Mobile-first, 768px breakpoint
- **Performance**: <2s load time requirement

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Auto-deploys on push to main

### Build Configuration

- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: 18.x or higher

## 📊 Performance

### Optimization Features

- **CSS Scoping**: Automatic template isolation
- **Performance Budgets**: Enforced size limits
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting

### Monitoring

```bash
npm run validate         # System validation
npm run test:leakage    # CSS isolation test
npm run perf:budget     # Performance check
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Template Guidelines](TEMPLATE_GUIDELINES.md)
- [Component Documentation](docs/components.md)
- [API Reference](docs/api.md)

## 🐛 Known Issues

- Template hot reload requires manual refresh
- Some templates may need optimization for very large menus (100+ items)

## 📄 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with CSS Modules
- Icons from various open-source libraries
- Inspired by modern restaurant web design

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review the claude.md file for detailed technical information

---

**Current Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✅