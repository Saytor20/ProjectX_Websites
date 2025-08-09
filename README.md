# 🍽️ Restaurant Website Generator

**Professional Next.js restaurant websites with automated CLI generation**

A complete system for generating production-ready restaurant websites using **Next.js 15** and **React 19**. Each generated website is a fully functional Next.js application with static export capability, perfect for fast, SEO-optimized restaurant sites.

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
- **Node.js 18-20** (required for Next.js 15)
- **npm** (included with Node.js)
- **Python 3** (for local preview server)

### Generate Your First Website

```bash
# Run the interactive CLI
websites

# Follow the prompts:
# 1) Build Website 🏗️
#    - Select a template (modern-restaurant, minimal-cafe, etc.)
#    - Choose a restaurant from 86+ options
#    - Pick deployment mode:
#      • Testing & Preview (localhost) - Static files for CDN
#      • Production Deployment (Vercel) - Full Next.js source
#    - Wait 2-3 minutes for generation
#    - Preview automatically opens at http://localhost:8080
```

That's it! You now have a complete Next.js restaurant website.

## 🏗️ System Architecture

### Clean Directory Structure
```
Websites_nextjs/
├── templates/
│   ├── _shared/              # Next.js base (package.json, next.config.ts)
│   │   ├── package.json      # Next.js 15 + React 19 dependencies
│   │   ├── next.config.ts    # Static export configuration
│   │   ├── src/components/   # Shared React components
│   │   └── src/types/        # TypeScript definitions
│   └── variants/             # Template designs (13 available)
│       ├── minimal-cafe/     # Clean, sophisticated design
│       ├── modern-restaurant/# Cyberpunk neon effects
│       ├── fiola-dc-authentic/# Luxury fine dining
│       └── ...
├── restaurant_data/          # Restaurant JSON files (86+ restaurants)
├── generated_sites/          # Generated Next.js websites
├── generator/
│   └── website-builder.js    # Build engine
└── websites*                 # Interactive CLI
```

### Deployment Modes

#### 🧪 Testing & Preview (Static Mode)
Perfect for testing and CDN deployment:
```
generated_sites/Abu Mahal/
├── index.html              # Static homepage
├── _next/static/          # Optimized CSS/JS bundles
├── restaurant-data.json   # Restaurant data reference
└── deployment-info.json   # Build metadata
```
- **Output**: Static HTML/CSS/JS files
- **Server**: Auto-served on http://localhost:8080
- **Deployment**: CDN, static hosting, GitHub Pages

#### 🚀 Production Deployment (Source Mode)
Full Next.js for Vercel deployment:
```
generated_sites/Abu Mahal/
├── src/                   # Complete Next.js source
├── package.json          # Dependencies
├── next.config.ts        # Configuration
└── deployment-info.json  # Build metadata
```
- **Output**: Full Next.js project
- **Server**: `npm run dev` for development
- **Deployment**: Vercel, Netlify, Next.js hosting

## 📋 Available Templates

All templates create full Next.js applications with unique designs:

| Template | Style | Best For |
|----------|-------|----------|
| **minimal-cafe** | Clean, sophisticated | Coffee shops, bakeries |
| **modern-restaurant** | Cyberpunk, neon effects | Contemporary, fusion dining |
| **fiola-dc-authentic** | Luxury fine dining | Upscale restaurants |
| **bbq-smokehouse** | Rustic American BBQ | Grills, BBQ restaurants |
| **azure-oasis** | Mediterranean elegance | Mediterranean, seafood |
| **summer-moon-style** | Coffee shop warmth | Cafés, breakfast spots |
| **romans-nyc-authentic** | NYC Italian style | Italian restaurants |
| **tiago-coffee-style** | Artisan coffee focus | Specialty coffee shops |
| **dhamaka-street-food** | Vibrant street food | Casual dining, food trucks |
| ...and 4 more | Various professional designs | All restaurant types |

## 🔧 Development Workflow

### For Developers

Each generated website is a standard Next.js project:

```bash
# Navigate to generated website
cd generated_sites/"Restaurant Name"

# Development (source mode only)
npm run dev        # http://localhost:3000

# Production build
npm run build      # Creates optimized bundle
npm start         # Production server

# Static export (both modes)
npm run export    # Creates static files in out/
```

### Template Development

Create new templates following Next.js standards:

```bash
# Copy existing template
cp -r templates/variants/minimal-cafe templates/variants/my-template

# Customize Next.js files:
# - src/app/layout.tsx (metadata, fonts)
# - src/app/page.tsx (components)
# - src/app/globals.css (styling)
# - src/app/theme.ts (Material-UI theme)
# - template.json (metadata)

# Test with CLI
websites
```

## 🚀 Deployment

### Vercel (Recommended for Source Mode)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy generated website
cd "generated_sites/Restaurant Name"
vercel --prod

# Result: https://your-restaurant.vercel.app
```

### Static Hosting (Static Mode)

```bash
# Files ready for any static host:
# - AWS S3 + CloudFront
# - Netlify
# - GitHub Pages
# - Cloudflare Pages

# Simply upload generated_sites/Restaurant Name/ contents
```

## 📊 Restaurant Data

86+ Saudi Arabian restaurants with complete data:
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

- **[System Installation](Websites_nextjs/SYSTEM_INSTALLATION.md)** - Complete setup and CLI guide
- **[Template Creation](Websites_nextjs/TEMPLATE_CREATION.md)** - How to create new website templates
- **[Architecture Guide](Websites_nextjs/CLAUDE.md)** - System architecture and development rules

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
- **Zero manual setup** - automated Next.js project creation
- **Type-safe development** with TypeScript throughout
- **Modern architecture** with Next.js 15 App Router
- **Component reusability** via shared base system
- **Hot reload** during development
- **Deployment flexibility** with dual modes

### Business Benefits
- **Fast generation** - websites ready in 3 minutes
- **Professional designs** - 13 unique templates
- **SEO optimized** - better search visibility
- **Mobile responsive** - works perfectly on all devices
- **Cost effective** - generate unlimited sites
- **Production ready** - no additional configuration needed

## 🚀 System Status

**Current Statistics:**
- ✅ 13 professional templates available
- ✅ 86+ restaurant datasets loaded
- ✅ Next.js 15 + React 19 technology stack
- ✅ Dual deployment modes (Static/Source)
- ✅ Interactive CLI with auto-discovery
- ✅ TypeScript throughout for type safety
- ✅ Mobile-first responsive design
- ✅ SEO and performance optimized

## 📞 Support

This system generates production-ready Next.js applications following industry best practices. Each website can be extended like any standard Next.js project.

**Quick Help:**
- Run `websites` for interactive generation
- Check `generated_sites/` for your websites
- Use static mode for testing, source mode for Vercel
- All templates work with all restaurant data

---

**Generate your first professional Next.js restaurant website in 3 minutes! 🚀**