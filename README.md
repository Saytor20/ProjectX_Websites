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
- ⚡ **Vercel-optimized deployment**
- 🎨 **Material-UI theming system**

## 🚀 Quick Start

### Prerequisites
- **Node.js 18-20** (required for Next.js 15)
- **npm** (included with Node.js)

### Generate Your First Website

```bash
# 1. Make CLI executable
chmod +x Websites_nextjs/websites

# 2. Run the interactive CLI
cd Websites_nextjs
./websites

# 3. Follow the prompts:
#    - Select a template (modern-restaurant, minimal-cafe, etc.)
#    - Choose a restaurant from 86+ options
#    - Wait 2-3 minutes for generation
#    - Preview automatically opens at http://localhost:8080
```

That's it! You now have a complete Next.js restaurant website.

## 🏗️ System Architecture

### Next.js-First Architecture
```
Websites_nextjs/
├── templates/
│   ├── _shared/              # Next.js base (package.json, next.config.ts)
│   │   ├── package.json      # Next.js 15 + React 19 dependencies
│   │   ├── next.config.ts    # Static export configuration
│   │   ├── tsconfig.json     # TypeScript configuration
│   │   └── src/
│   │       ├── components/   # Shared React components
│   │       ├── types/        # TypeScript definitions
│   │       └── theme/        # Material-UI theme system
│   └── variants/             # Template designs (13 available)
├── places_json/              # Restaurant data (86+ restaurants)
├── final_websites/           # Generated Next.js websites
├── generator/                # Build system
├── scripts/                  # Deployment utilities
└── websites*                 # Interactive CLI
```

### Build Process
Each generated website is a complete Next.js project:

1. **Template Merge**: Combines shared Next.js base with design variant
2. **Data Injection**: Transforms restaurant data into TypeScript interfaces
3. **Next.js Build**: Runs `npm run build` to create optimized bundle
4. **Static Export**: Generates static HTML/CSS/JS via Next.js export
5. **Deployment Ready**: Optimized for Vercel, Netlify, or any CDN

## 📋 Available Templates

All templates create full Next.js applications with unique designs:

| Template | Description | Best For | Tech Stack |
|----------|-------------|----------|------------|
| **modern-restaurant** | Cyberpunk design with neon effects | Contemporary, fusion dining | Next.js + TypeScript + Tailwind |
| **minimal-cafe** | Clean, sophisticated design | Coffee shops, bakeries | Next.js + TypeScript + Material-UI |
| **fiola-dc-authentic** | Luxury restaurant design | Fine dining, upscale venues | Next.js + TypeScript + Custom CSS |
| **bbq-smokehouse** | Rustic, American BBQ theme | BBQ restaurants, grills | Next.js + TypeScript + Tailwind |
| **vibrant-foodplace** | Tropical paradise theme | Beach restaurants, tiki bars | Next.js + TypeScript + Custom Theme |
| ...and 8 more | Professional designs | Various restaurant types | All built on Next.js |

## 🛠️ Development Workflow

### For Developers

Each generated website is a standard Next.js project:

```bash
# Navigate to generated website
cd final_websites/<restaurant-name>

# Install dependencies (already done during generation)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Export static files
npm run export
```

### Next.js Configuration

All websites include:
- **next.config.ts** with static export configuration
- **TypeScript** support with strict typing
- **App Router** architecture (Next.js 15 standard)
- **Tailwind CSS** for utility-first styling
- **Material-UI** for component library
- **Optimized images** with Next.js Image component

### Template Development

Create new templates as Next.js projects:

```bash
# Copy existing template
cp -r templates/variants/minimal-cafe templates/variants/my-template

# Edit Next.js app files:
# - src/app/layout.tsx (page layout, metadata)
# - src/app/page.tsx (main page components)  
# - src/app/globals.css (custom styling)
# - src/app/theme.ts (Material-UI theme)
# - template.json (template metadata)

# Test with CLI
./websites
```

## 🚀 Deployment (Vercel Recommended)

### Vercel Deployment
Perfect for Next.js applications:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy a generated website
cd final_websites/<restaurant-name>
vercel --prod

# Or use our script
./scripts/deploy-site.sh <restaurant-name>
```

### Why Vercel for Next.js?
- **Zero configuration** for Next.js projects
- **Automatic optimizations** for Next.js applications
- **Edge Functions** support for future enhancements
- **Analytics** built for Next.js performance metrics
- **Preview deployments** for every change

## 📊 Restaurant Data

86+ Saudi Arabian restaurants with complete data:
- **Bilingual content** (Arabic/English)
- **Menu categories** with items and pricing
- **Contact information** and locations
- **Images** and branding assets
- **Structured data** for SEO

## 🔧 Technical Specifications

### Next.js Technology Stack
- **Next.js**: 15.4.2 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.0+
- **Tailwind CSS**: 4.0
- **Material-UI**: 7.2.0
- **Node.js**: 18-20 (required)

### Generated Website Features
- **Static export** capability
- **SEO optimized** with meta tags
- **Responsive design** (mobile-first)
- **TypeScript interfaces** for all data
- **Component architecture** with reusable parts
- **Theming system** with Material-UI
- **Performance optimized** with Next.js optimizations

## 📖 Documentation

- **[CLI Guide](Websites_nextjs/CLI_GUIDE.md)** - Complete CLI documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Vercel deployment instructions
- **[Next.js Project Guide](docs/NEXTJS_PROJECT_GUIDE.md)** - Next.js specific guidelines
- **[Architecture Guide](Websites_nextjs/CLAUDE.md)** - System architecture details

## 🎯 Use Cases

### Perfect For:
- **Restaurant owners** wanting professional websites
- **Web agencies** building restaurant sites at scale
- **Developers** needing Next.js restaurant templates
- **Marketing teams** creating multiple restaurant sites

### Generated Websites Include:
- **Home page** with hero section and highlights
- **Menu display** with categories and pricing
- **About section** with restaurant story
- **Gallery** with food and ambiance photos
- **Contact page** with location and details
- **Responsive navigation** for all screen sizes

## 🤝 System Benefits

### Development Benefits
- **No manual Next.js setup** - automated project creation
- **Type-safe development** with TypeScript throughout
- **Component reusability** via shared base system
- **Modern development** with latest Next.js features
- **Hot reload** during development

### Business Benefits
- **Fast deployment** - websites ready in minutes
- **Professional design** - 13 unique templates
- **SEO optimized** - better search visibility
- **Mobile responsive** - works on all devices
- **Cost effective** - generate unlimited sites

## 📞 Support & Contribution

This system generates production-ready Next.js applications. Each website follows Next.js best practices and can be extended like any standard Next.js project.

---

**Generate your first Next.js restaurant website in 3 minutes! 🚀**