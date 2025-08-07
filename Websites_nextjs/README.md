# 🌐 Restaurant Website Generator

A powerful CLI tool for generating beautiful restaurant websites from JSON data using Next.js templates. Create professional static websites for restaurants with zero coding required.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

### Installation

1. **Clone the Repository**
```bash
git clone git@github.com:Saytor20/ProjectX_Websites.git
cd ProjectX_Websites
```

2. **Make CLI Executable**
```bash
chmod +x websites
```

3. **Update Configuration**
Edit the `websites` script and update the PROJECT_ROOT path:
```bash
# Change this line in the websites script:
PROJECT_ROOT="/Users/mohammadalmusaiteer/Project Shawrma-Website temp/Websites_nextjs"

# To your actual path:
PROJECT_ROOT="/your/actual/path/to/ProjectX_Websites"
```

4. **Install Dependencies**
```bash
cd templates/_shared
npm install
cd ../..
```

### Running the CLI

```bash
./websites
```

## 🎯 What You Can Do

### 1. Generate Restaurant Websites
- Choose from **multiple templates** (Modern Restaurant, Classic Restaurant, Minimal Cafe)
- **86+ pre-loaded restaurants** with real data
- **Automatic template selection** based on restaurant type
- **Static website generation** ready for hosting anywhere

### 2. Available Templates

| Template | Best For | Design Style | Primary Color |
|----------|----------|--------------|---------------|
| **Modern Restaurant** | Contemporary dining, fusion | Cyberpunk, neon effects | Orange (#FF6B35) |
| **Classic Restaurant** | Fine dining, traditional | Elegant, sophisticated | Mahogany (#2C1810) |
| **Minimal Cafe** | Coffee shops, bakeries | Clean, minimal | Black (#1A1A1A) |

### 3. CLI Features
- ✅ **Interactive menu system**
- ✅ **Auto-discovery of templates**
- ✅ **Real-time build progress**
- ✅ **Local preview server**
- ✅ **System status monitoring**
- ✅ **Error handling & recovery**

## 📁 Project Structure

```
ProjectX_Websites/
├── places_json/           # 86+ restaurant JSON files (ready to use)
├── templates/             # Website templates
│   ├── _shared/          # Common components & dependencies
│   └── variants/         # Template designs (3 available + more)
├── final_websites/        # Generated websites (after running CLI)
├── generator/            # Build system
├── websites*             # CLI script (main interface)
├── CLI_GUIDE.md         # Detailed CLI documentation
├── TEMPLATE_CREATION_GUIDELINES.md  # For developers/agents
└── README.md            # This file
```

## 🎨 Template System

### How Templates Work
- **Shared Base**: All templates use common React components from `templates/_shared/`
- **Design Variants**: Each template in `templates/variants/` has unique styling & layout
- **Data Injection**: Restaurant data automatically inserted during build
- **Static Export**: Pure HTML/CSS/JS websites (no server needed)

### Architecture
The system uses a **shared + variant overlay pattern**:
1. Common functionality lives in `templates/_shared/`
2. Template-specific designs are in `templates/variants/{template_name}/`
3. During build, template files overlay the shared base
4. Result: Optimized, maintainable templates with no code duplication

## 🍽️ Restaurant Data

### Included Restaurants (86+ total)
- **Saudi Arabian restaurants** with real data
- **Multiple cuisines**: Fast food, traditional, cafes, desserts
- **Complete information**: Names, addresses, menus, contact details
- **Bilingual support**: English and Arabic

### Data Structure
Each restaurant follows this JSON structure:
```json
{
  "restaurant_info": {
    "name": "Restaurant Name",
    "type_of_food": "Fast Food",
    "description": "Restaurant description",
    "address": "Full address"
  },
  "menu_categories": {
    "Main Dishes": [
      {
        "item_en": "Burger",
        "item_ar": "برجر",
        "price": 25.00,
        "description": "Delicious beef burger"
      }
    ]
  },
  "contact_info": {
    "phone": "+966...",
    "email": "contact@restaurant.com"
  }
}
```

## 🚀 Usage Examples

### Generate a Single Website
1. Run `./websites`
2. Select "Build Websites"
3. Choose your template
4. Pick a restaurant
5. Wait ~2-3 minutes for generation
6. Preview automatically opens at `http://localhost:8080`

### Generate Multiple Websites (Bulk)
1. Run `./websites`
2. Select "Build Websites"
3. Choose template
4. Select "Generate all restaurants" option
5. Wait for completion (varies by number of restaurants)

### View Generated Websites
```bash
cd final_websites/restaurant_name/
python3 -m http.server 8080
# Open http://localhost:8080
```

## 🛠️ For Developers & Agents

### Creating New Templates
See `TEMPLATE_CREATION_GUIDELINES.md` for detailed instructions on:
- Template architecture requirements
- Step-by-step creation process
- Testing and validation procedures
- Best practices and common patterns

### Technology Stack
- **Next.js**: 15.4.2 with App Router
- **React**: 19.1.0
- **TypeScript**: 5.0+
- **Material-UI**: 7.2.0 (theming system)
- **Tailwind CSS**: 4.0 (utility classes)

## ⚠️ Troubleshooting

### Common Issues

#### 1. "Command not found: ./websites"
```bash
chmod +x websites
```

#### 2. "Project directory not found"
Edit the `websites` script and update the `PROJECT_ROOT` variable to your actual path.

#### 3. "npm install failed"
```bash
cd templates/_shared
rm -rf node_modules package-lock.json
npm install
```

#### 4. Build errors
- Check Node.js version: `node --version` (should be v18+)
- Use "System Status" in CLI menu for diagnostics
- Verify all dependencies are installed

### Getting Help
1. Check **System Status** in CLI for diagnostic info
2. Review the detailed **CLI_GUIDE.md**
3. For template development, see **TEMPLATE_CREATION_GUIDELINES.md**

## 📈 Performance

### Build Performance
- **Single website**: 2-3 minutes generation time
- **Bulk generation**: Varies by number of restaurants
- **Shared dependencies**: Single package.json reduces build time
- **Incremental builds**: Next.js caching for faster rebuilds

### Runtime Performance
- **Static output**: CDN-ready, fast loading
- **Responsive design**: Mobile-first approach
- **SEO optimized**: Meta tags, structured data
- **Accessibility**: WCAG 2.1 AA compliance

## 🎯 Perfect For

- **Restaurant owners** wanting professional websites
- **Web developers** needing quick restaurant sites
- **Agencies** serving hospitality clients  
- **AI agents** automating website creation
- **Students** learning web development
- **Anyone** wanting to generate multiple sites quickly

## 🌟 Key Features

### For End Users
- ✅ **No coding required** - Just run the CLI
- ✅ **Pre-loaded data** - 86+ restaurants ready to use
- ✅ **Multiple designs** - Professional templates
- ✅ **Local preview** - See websites before deploying
- ✅ **Static output** - Host anywhere (GitHub Pages, Netlify, Vercel, etc.)

### For Developers & Agents
- ✅ **Modular architecture** - Easy to extend and maintain
- ✅ **TypeScript support** - Type-safe development
- ✅ **Component library** - Reusable UI components
- ✅ **Theme system** - Easy customization
- ✅ **Auto-discovery** - New templates automatically detected
- ✅ **Build validation** - Error checking and recovery

## 🤖 For AI Agents

This system is designed to work seamlessly with AI agents for automated website creation:

- **Structured templates**: Follow documented patterns in `TEMPLATE_CREATION_GUIDELINES.md`
- **Auto-discovery**: New templates automatically appear in CLI
- **Validation**: Built-in error checking and recovery
- **Documentation**: Comprehensive guides for template creation
- **Extensible**: Easy to add new restaurants, templates, and features

## 📞 Support & Documentation

- **CLI Commands**: See `CLI_GUIDE.md` for detailed interface documentation
- **Template Development**: Follow `TEMPLATE_CREATION_GUIDELINES.md`
- **Architecture**: Check `CLAUDE.md` for system requirements
- **Troubleshooting**: Use CLI "System Status" for diagnostics

---

**Ready to generate beautiful restaurant websites? Run `./websites` to get started!** 🚀

## License

This project is open source. Feel free to use, modify, and distribute according to your needs.