# 🍽️ Shawrma Website Generator

**Professional restaurant website generator built with Next.js 15 and React 19**

A modern, production-ready system for generating beautiful restaurant websites. Features a sophisticated template system, visual editor, and comprehensive component architecture for creating professional restaurant sites.

## ✨ What This System Creates

### Next.js Restaurant Websites
- **Full Next.js applications** with App Router architecture
- **TypeScript** for type safety and better development experience
- **Tailwind CSS + Material-UI** for professional styling
- **Static export** capability for fast loading and CDN deployment
- **Responsive design** optimized for all devices
- **SEO-ready** with meta tags and structured data

### Key Features
- 🏗️ **13 professional templates** with unique designs
- 🚀 **Interactive CLI** for easy website generation
- 📊 **86+ pre-loaded restaurant data** (Saudi Arabian restaurants)
- 🌍 **Bilingual support** (Arabic/English)
- 📱 **Mobile-first responsive design**
- ⚡ **Dual deployment modes** (Static/Source)
- 🎨 **Material-UI theming system**

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (required for Next.js 15)
- **npm** (included with Node.js)

### Installation & Setup

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

## 🏗️ System Architecture

### Clean Directory Structure
```
├── src/                      # Core application source
│   ├── app/                  # Next.js 15 App Router
│   │   ├── api/              # API routes (restaurants, templates)
│   │   ├── restaurant/[slug]/# Dynamic restaurant pages
│   │   └── layout.tsx        # Root layout
│   ├── components/kit/       # 10 core restaurant components
│   ├── editor/               # Block editor system
│   └── lib/                  # Core utilities (schema, tokens, image)
├── templates/                # Template Packages (11 working templates)
│   ├── bistly/               # Elegant bistro aesthetic
│   ├── simple-modern/        # Clean, minimalist design
│   ├── foodera/              # Modern food theme
│   └── ...
├── data/                     # Restaurant data
│   └── restaurants/          # JSON files for 89 restaurants
├── public/                   # Static assets
├── docs/                     # System documentation
└── tools/                    # Development utilities
```

### Template System

Each template is a self-contained React component with CSS Modules:

```
templates/bistly/
├── Template.tsx          # Main React component
├── template.module.css   # CSS Modules (auto-scoped)
├── manifest.json         # Template metadata
└── README.md            # Documentation
```

### Visual Editor

The system includes a sophisticated block-level editor:
- **Block Outline** - Navigate template structure  
- **Patch Panel** - Dynamic controls for text, images, variants
- **Inline Editing** - Direct text editing with debouncing
- **Image Swapping** - Click to replace images
- **Keyboard Shortcuts** - Alt+E to toggle editor

## 📋 Available Templates

11 professional templates with unique designs:

| Template | Style | Best For |
|----------|-------|----------|
| **bistly** | Elegant bistro aesthetic | Upscale bistros, cafés |
| **simple-modern** | Clean, minimalist design | Modern restaurants |
| **royate** | Royal themed with golden accents | Fine dining |
| **foodera** | Modern vibrant design | Contemporary dining |
| **mehu** | Fresh juice bar style | Juice bars, smoothie shops |
| **shara** | Contemporary design | Modern casual dining |
| **tasty** | Delicious food focus | Family restaurants |
| **callix** | Professional template | Business dining |
| **coill** | Additional themed design | Various restaurants |

## 🔧 Development Workflow

### Available Scripts

```bash
npm run dev              # Start development server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript compilation check
npm run validate-template # Validate template structure
```

### Template Development

Create new templates following the Template Package system:

```bash
# Scaffold new template
npx tsx tools/scaffold-template.ts my-template

# Edit template files:
# - Template.tsx (React component)
# - template.module.css (CSS Modules)
# - manifest.json (metadata)

# Test template
curl http://localhost:3000/api/templates
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Result: https://your-restaurant.vercel.app
```

### Build Configuration

- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: 18.x or higher

## 📊 Restaurant Data

89 restaurants with complete data:
- **Menu categories** with items, prices, descriptions
- **Bilingual content** (Arabic/English names)
- **Restaurant info** (location, contact, ratings)
- **High-quality images** for all menu items
- **Structured data** optimized for SEO

### Data Structure
```json
{
  "restaurant_info": {
    "name": "Abu Mahal",
    "region": "Abha", 
    "rating": 4.3,
    "review_count": 113,
    "type_of_food": "Arabic,American,Burgers"
  },
  "menu_categories": {
    "Bestsellers 🔥": [
      {
        "item_en": "Chicken Kebab Sandwich",
        "price": 12.5,
        "currency": "SAR",
        "description": "Bread, cheese, lettuce, potatoes, abu mahal sauce",
        "image": "https://images.deliveryhero.io/..."
      }
    ]
  }
}
```

## 🔧 Technical Specifications

### Technology Stack
- **Next.js**: 15.4.2 (App Router architecture)
- **React**: 19.1.0 (Latest stable)
- **TypeScript**: 5.0+ (Strict mode)
- **Tailwind CSS**: 4.0 (Utility-first styling)
- **Material-UI**: 7.2.0 (Component library)
- **Node.js**: 18-20 (Build requirement)

### Generated Website Features
- **Static export** for optimal performance
- **TypeScript interfaces** for all data
- **Responsive design** (mobile-first)
- **SEO optimization** with meta tags
- **Component architecture** with reusable parts
- **Performance optimized** with Next.js built-ins
- **Accessibility** compliant (WCAG 2.1)

## 📖 Documentation

Essential system documentation:

- **[Architecture Overview](docs/ARCHITECTURE.md)** - System architecture and components
- **[Template Guidelines](docs/TEMPLATE_GUIDELINES.md)** - Template development best practices
- **[Component Documentation](docs/components.md)** - Component library reference

## 🎯 Use Cases

### Perfect For:
- **Restaurant owners** wanting professional Next.js websites
- **Web agencies** building restaurant sites at scale
- **Developers** needing modern restaurant templates
- **Marketing teams** creating multiple restaurant sites

### Generated Websites Include:
- **Hero section** with restaurant branding
- **Menu display** with categories, items, and pricing
- **About section** with restaurant story
- **Photo gallery** with food and ambiance images
- **Contact information** with location and hours
- **Responsive navigation** for all screen sizes
- **Footer** with social links and details

## 🔄 System Benefits

### Development Benefits
- **Type-safe development** with TypeScript throughout
- **Modern architecture** with Next.js 15 App Router
- **Component reusability** via 10-component kit
- **CSS Modules** for automatic style isolation
- **Visual editor** for rapid customization
- **Hot reload** during development

### Performance Features
- **CSS Budget**: ≤50KB per template enforced
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Static Generation**: Pre-rendered pages
- **SEO optimized**: Meta tags and structured data
- **Mobile responsive**: All templates mobile-first

## 🚀 System Status

**Current Statistics:**
- ✅ 11 working templates available
- ✅ 89 restaurant datasets loaded
- ✅ Next.js 15 + React 19 + TypeScript
- ✅ Visual block editor with patch panel
- ✅ CSS Modules for style isolation
- ✅ 10 reusable restaurant components
- ✅ Mobile-first responsive design
- ✅ SEO and performance optimized

## 📞 Support

This system generates production-ready restaurant websites following industry best practices with Next.js 15, React 19, and TypeScript.

**Quick Help:**
- Run `npm run dev` to start development server
- Visit `http://localhost:3000` to see the application
- Templates are in `templates/` directory
- Restaurant data in `data/restaurants/`

---

**Built with Next.js 15, React 19, and TypeScript for modern restaurant websites! 🚀**