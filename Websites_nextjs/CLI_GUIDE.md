# 📋 CLI Guide - Restaurant Website Generator

## Overview
The `websites` CLI is the main interface for generating restaurant websites. It provides an interactive menu system that automatically discovers templates and restaurants, making website generation simple and efficient.

## Quick Start

```bash
# Make CLI executable (first time only)
chmod +x websites

# Run the CLI
./websites
```

## Main Menu Options

### 1. Build Websites 🏗️
Generate restaurant websites using available templates.

**Process:**
1. Select from available templates (auto-discovered)
2. Choose restaurant from 86+ pre-loaded options  
3. Wait for generation (2-3 minutes)
4. Preview opens automatically at `http://localhost:8080`

### 2. System Status 📊
Display comprehensive system diagnostics.

**Information Shown:**
- Available templates count
- Restaurant JSON files count
- Generated websites count
- Node.js version
- npm status
- Build dependencies status

### 3. List Templates 📑
View all available website templates with descriptions.

**Details Displayed:**
- Template ID and name
- Description and features
- Custom components
- Template count summary

### 4. List Restaurants 🍽️
Browse all available restaurant data files.

**Information Shown:**
- Restaurant names and IDs
- File locations
- Total restaurant count
- Quick search functionality

### 5. Clean Generated Sites 🗑️
Remove all previously generated websites.

**Actions:**
- Removes all content from `final_websites/` directory
- Frees up disk space
- Prepares for fresh website generation

## Template System

### Auto-Discovery
- CLI automatically detects all templates in `templates/variants/`
- No manual registration required
- Templates appear immediately after creation
- Invalid templates are filtered out

### Template Selection
Templates are numbered for easy selection:
```
Available templates:
1. Modern Restaurant - Cyberpunk design for contemporary dining
2. Classic Restaurant - Elegant design for fine dining
3. Minimal Cafe - Clean design for coffee shops
```

## Restaurant Data

### Included Restaurants (86+)
- **Saudi Arabian restaurants** with complete data
- **Multiple cuisines**: Fast food, traditional, cafes, desserts
- **Bilingual content**: Arabic and English names/descriptions
- **Complete menus**: Items with prices and descriptions

### Restaurant Selection
Restaurants are displayed with clear naming:
```
Available restaurants:
1. Al Hatab (alhatab_115244) - Traditional cuisine
2. Abu Al Khair (abu_al_khair_63191) - Coffee & pastries  
3. Al Othaim (al_othaim_137466) - Fast food
...
```

## Build Process

### Single Website Generation
1. **Template Selection**: Choose from available templates
2. **Restaurant Selection**: Pick restaurant from list
3. **Build Process**: 
   - Copy shared base files
   - Apply template overlay
   - Inject restaurant data
   - Run Next.js build
   - Export static files
4. **Preview Launch**: Automatic preview at `http://localhost:8080`

### Bulk Generation (Advanced)
Generate websites for multiple restaurants:
1. Select template
2. Choose "Generate all restaurants"
3. Batch processing begins
4. Individual previews available after completion

## File Locations

### Input Files
```
places_json/              # Restaurant data
├── restaurant_name.json  # Individual restaurant files
├── _processing_summary.json  # Processing metadata

templates/                # Website templates
├── _shared/             # Base components and dependencies
└── variants/            # Template designs
```

### Output Files
```
final_websites/           # Generated websites
├── restaurant_name/     # Individual website folders
│   ├── index.html      # Main page
│   ├── _next/          # Next.js build assets
│   ├── restaurant-data.json  # Restaurant data
│   └── deployment-info.json  # Build metadata
```

## System Requirements

### Dependencies
- **Node.js**: v18 or higher
- **npm**: Included with Node.js
- **Next.js**: 15.4.2 (automatically managed)
- **React**: 19.1.0 (automatically managed)

### System Status Check
Use the "System Status" menu option to verify:
- ✅ Node.js version compatibility
- ✅ npm functionality
- ✅ Template availability
- ✅ Restaurant data integrity
- ✅ Build dependencies

## Troubleshooting

### Common Issues

#### "Command not found: ./websites"
```bash
chmod +x websites
```

#### "No templates found"
- Verify `templates/variants/` contains valid templates
- Check `template.json` files are valid JSON
- Use "System Status" for diagnostics

#### "Restaurant data missing"
- Verify `places_json/` contains JSON files
- Check file permissions
- Ensure JSON files are valid format

#### Build failures
- Check Node.js version: `node --version` 
- Verify npm installation: `npm --version`
- Clear cache: `rm -rf templates/_shared/node_modules`
- Reinstall dependencies: `cd templates/_shared && npm install`

### Error Recovery

#### Incomplete Builds
- Clean generated sites: Menu option 5
- Retry with different template
- Check system status for issues

#### Permission Errors
```bash
# Fix executable permissions
chmod +x websites

# Fix directory permissions
chmod -R 755 templates/
chmod -R 755 places_json/
```

## Advanced Usage

### Custom Restaurant Data
Add new restaurant JSON files to `places_json/`:
```json
{
  "restaurant_info": {
    "name": "Restaurant Name",
    "type_of_food": "Cuisine Type",
    "description": "Restaurant description",
    "address": "Full address"
  },
  "menu_categories": {
    "Category Name": [
      {
        "item_en": "English Name",
        "item_ar": "Arabic Name",
        "price": 25.00,
        "currency": "SAR",
        "description": "Item description"
      }
    ]
  },
  "contact_info": {
    "phone": "+966...",
    "email": "contact@restaurant.com"
  }
}
```

### Template Development
See `TEMPLATE_CREATION_GUIDELINES.md` for comprehensive template creation instructions.

## Performance Tips

### Faster Builds
- Use SSD storage for project files
- Ensure stable internet connection for dependencies
- Close unnecessary applications during build
- Use local preview for quick testing

### Bulk Operations
- Generate websites during off-peak hours
- Monitor system resources
- Clear previous builds before bulk generation
- Use "Clean Generated Sites" regularly

## CLI Architecture

### Auto-Discovery System
```bash
# Template discovery
for template in templates/variants/*/; do
  if [[ -f "$template/template.json" ]]; then
    # Parse and validate template
    # Add to available templates list
  fi
done

# Restaurant discovery  
for restaurant in places_json/*.json; do
  if [[ -f "$restaurant" ]]; then
    # Parse restaurant data
    # Add to available restaurants list
  fi
done
```

### Build Pipeline
1. **Validation**: Check template and restaurant data
2. **Preparation**: Create build directory
3. **Merge**: Combine shared + template files
4. **Injection**: Insert restaurant data
5. **Build**: Run Next.js build process  
6. **Export**: Generate static files
7. **Cleanup**: Remove temporary files
8. **Preview**: Launch local server

## Integration with Development Tools

### VS Code Integration
- Open project in VS Code
- Use integrated terminal for CLI
- Edit templates with full TypeScript support
- Debug with VS Code debugger

### Git Workflow
```bash
# The CLI works with git repositories
git status          # Check changes
./websites          # Generate websites
git add final_websites/  # Add generated sites
git commit -m "Generated restaurant websites"
```

---

## Quick Reference Card

| Action | Command | Description |
|--------|---------|-------------|
| **Run CLI** | `./websites` | Start interactive menu |
| **Make Executable** | `chmod +x websites` | Enable CLI execution |
| **Check Status** | Menu option 2 | System diagnostics |
| **Build Website** | Menu option 1 | Generate restaurant website |
| **Clean Sites** | Menu option 5 | Remove generated websites |
| **List Templates** | Menu option 3 | View available templates |
| **List Restaurants** | Menu option 4 | Browse restaurant data |

---

**Need help? Use the CLI's built-in system status and diagnostic tools for troubleshooting assistance.**