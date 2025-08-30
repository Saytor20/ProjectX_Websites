# Restaurant Website Generator

A modern, production-ready restaurant website generator built with Next.js 15, TypeScript, and React. Features a robust template system, visual design tools, and comprehensive component architecture for creating professional restaurant websites.

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

### 🎨 Template System
- **7 Working Templates**: Professional designs ready for production
  - Cafert Modern - Premium cafe template
  - Simple Modern - Clean, minimalist design
  - Bistly Modern - Bistro aesthetic
  - Foodera Modern - Modern food theme
  - Conbiz Premium - Professional business style
  - Mehu Fresh - Fresh, contemporary theme
  - Quantum Nexus - Futuristic design

### 🛠️ Visual Design Tools
Simple, intuitive design tools for easy customization:
- **👆 Select Tool** - Click any element to select and resize
- **🎨 Colors** - Color picker for element styling
- **📐 Shapes** - Add geometric shapes with layering
- **🖼️ Pictures** - Upload or link images
- **🔗 Links** - Add/edit hyperlinks
- **📝 Text** - Inline text editing

### 🏗️ Component Architecture
10 core restaurant components:
1. **Navbar** - Navigation with logo and menu
2. **Hero** - Hero section with carousel
3. **MenuList** - Restaurant menu display
4. **Gallery** - Photo gallery grid
5. **Hours** - Operating hours
6. **LocationMap** - Location and map
7. **CTA** - Call-to-action sections
8. **Footer** - Contact and links
9. **RichText** - Rich content blocks
10. **Section** - Generic containers

## 🔧 Development

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git

### Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run dev:clean     # Clean cache and restart
```

### Project Structure

```
Websites_nextjs/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/kit/   # Component library
│   ├── lib/              # Core utilities
│   └── dev/              # Development tools
├── templates/            # Template registry
├── public/               # Static assets
├── restaurant_data/      # Sample data
└── docs/                 # Documentation
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