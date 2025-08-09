# Restaurant Website Generator - System Installation

## Prerequisites

Before using the Restaurant Website Generator, ensure you have:

- **Node.js 18-20** (required for Next.js 15)
- **npm** (included with Node.js)
- **macOS/Linux** with bash support
- **Python 3** (for local preview server)

## Installation Steps

### 1. Initial Setup

```bash
# Navigate to the system directory
cd "/Users/mohammadalmusaiteer/Project Shawrma-Website temp/Websites_nextjs"

# Make the CLI executable
chmod +x websites

# Install shared dependencies (only needed once)
cd templates/_shared && npm install
```

### 2. Global CLI Access (Recommended)

For system-wide access to the `websites` command:

```bash
# The global CLI is already configured at:
# /Users/mohammadalmusaiteer/.local/bin/websites

# Verify it works from any directory
websites --help
```

## CLI Usage Guide

### Interactive Mode

The primary way to use the system:

```bash
# Run the interactive CLI
websites

# Follow the menu:
# 1) Build Website 🏗️      - Generate new restaurant websites  
# 2) System Status 📊      - View templates, restaurants, sites
# 3) View Generated Sites 📁 - Preview existing websites
# 4) Clean Generated Sites 🗑️ - Remove all generated websites
# 5) Exit                   - Close the CLI
```

### Command Line Mode

For automation and scripting:

```bash
# Generate website directly
websites --build --template <template_id> --restaurant <file.json> --mode <static|source>

# Examples:
websites --build --template minimal-cafe --restaurant abu_mahal_131735.json --mode static
websites --build --template modern-restaurant --restaurant alhatab_115244.json --mode source
```

## System Directory Structure

After installation, your system follows this structure:

```
Websites_nextjs/
├── templates/
│   ├── _shared/              # Base Next.js configuration
│   │   ├── package.json      # Dependencies (Next.js 15, React 19)
│   │   ├── next.config.ts    # Static export configuration
│   │   ├── src/components/   # Shared React components
│   │   └── src/types/        # TypeScript interfaces
│   └── variants/             # Design templates
│       ├── minimal-cafe/     # Clean, minimal design
│       ├── modern-restaurant/# Cyberpunk neon design
│       ├── fiola-dc-authentic/# Luxury fine dining
│       └── ... (13 total)
├── restaurant_data/          # Restaurant JSON files (86+ restaurants)
├── generated_sites/          # Output directory for generated websites
├── generator/
│   ├── website-builder.js    # Main build engine
│   └── temp_build/           # Temporary build directory
└── websites*                 # Interactive CLI script
```

## Output Format and Locations

### Generated Website Directory Names

Websites are created using the restaurant's actual name (not filename):

```bash
# Input file: abu_mahal_131735.json
# Output directory: generated_sites/Abu Mahal/

# Input file: alhatab_115244.json  
# Output directory: generated_sites/Alhatab/
```

### Deployment Modes

The system generates different outputs based on deployment mode:

#### Static Mode (Testing & Preview)
```
generated_sites/Restaurant Name/
├── index.html            # Main page (static HTML)
├── 404.html             # Error page
├── _next/               # Next.js assets
│   └── static/          # CSS, JS bundles
├── favicon.ico          # Site icon
├── restaurant-data.json # Restaurant data reference
└── deployment-info.json # Build metadata
```

**Purpose**: Local testing, CDN deployment, static hosting
**Server**: Automatically served on http://localhost:8080

#### Source Mode (Production Deployment)
```
generated_sites/Restaurant Name/
├── src/                 # Next.js source code
│   ├── app/            # App router pages
│   ├── components/     # React components  
│   └── types/          # TypeScript definitions
├── package.json        # Dependencies
├── next.config.ts      # Next.js configuration
├── restaurant-data.json# Restaurant data
└── deployment-info.json# Build metadata
```

**Purpose**: Vercel deployment, full Next.js functionality
**Server**: Run `npm run dev` for development, `npm run build` for production

### Deployment Info Tracking

Each generated website includes `deployment-info.json`:

```json
{
  "template": "minimal-cafe",
  "restaurant": "Abu Mahal", 
  "generated_at": "2025-08-08T20:55:26.229Z",
  "restaurant_file": "abu_mahal_131735.json",
  "build_directory": "/path/to/temp_build/abu_mahal_131735",
  "deploy_directory": "/path/to/generated_sites/Abu Mahal",
  "deployment_mode": "static"
}
```

## Verification Steps

After installation, verify everything works:

### 1. Check CLI Access
```bash
websites
# Should show the interactive menu
```

### 2. Generate Test Website
```bash
# Select option 1 (Build Website)
# Choose any template (e.g., minimal-cafe)
# Choose any restaurant (e.g., abu_mahal_131735.json)
# Select mode 1 (Testing & Preview)
# Wait 2-3 minutes for build
# Website should auto-open at http://localhost:8080
```

### 3. Verify Output Structure
```bash
ls generated_sites/
# Should show restaurant directory (e.g., "Abu Mahal")

ls "generated_sites/Abu Mahal/"
# Should show static files: index.html, _next/, etc.
```

## Troubleshooting

### Common Issues

**CLI not found**:
```bash
# Check if global CLI exists
ls -la /Users/mohammadalmusaiteer/.local/bin/websites
# If missing, the CLI is in the local directory:
cd "/Users/mohammadalmusaiteer/Project Shawrma-Website temp/Websites_nextjs"
./websites
```

**Build failures**:
```bash
# Check Node.js version
node --version  # Should be 18-20

# Check shared dependencies
cd templates/_shared && npm install
```

**Port 8080 in use**:
```bash
# Kill existing servers
pkill -f "python3 -m http.server"
# Or use a different port manually
```

### Template Discovery Issues
```bash
# If templates not found, check directory structure
ls templates/variants/
# Should show multiple template directories
```

## System Maintenance

### Regular Tasks

**Update dependencies**:
```bash
cd templates/_shared
npm update
```

**Clean generated sites**:
```bash
# Use CLI option 4, or manually:
rm -rf generated_sites/*
```

**Add new restaurants**:
```bash
# Place new JSON files in restaurant_data/
# CLI will auto-discover them
```

## Success Indicators

The system is properly installed when:

- ✅ `websites` command works from any directory
- ✅ Interactive menu appears and templates are detected
- ✅ Test website generates successfully in 2-3 minutes  
- ✅ Generated website displays properly at http://localhost:8080
- ✅ Restaurant names are used for directory names (not filenames)
- ✅ Both static and source deployment modes work correctly

Your Restaurant Website Generator is now ready for production use!