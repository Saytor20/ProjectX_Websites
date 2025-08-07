# Shared Infrastructure

This directory contains only the core infrastructure that all templates share:

## Contents
- `package.json` - Dependencies and build scripts
- `next.config.ts` - Next.js build configuration  
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration
- `eslint.config.mjs` - ESLint configuration
- `public/` - Static assets (icons, etc.)
- `src/types/` - TypeScript type definitions
- `src/data/` - Data structure templates

## What's NOT Here
UI Components have been moved to individual variants to ensure unique designs:
- No more shared Hero, Menu, Navigation, Footer components
- Each variant now has its own component library
- This enables truly unique template designs

## Architecture
Each template variant overlays this base structure with:
- Template-specific components
- Unique styling systems
- Custom layouts and animations