# Template Creation Guidelines

## Overview

This guide covers creating new website templates for the Restaurant Website Generator. All templates are Next.js 15 applications with TypeScript, using a shared base + variant overlay architecture.

## Template Architecture

### Shared Base System

All templates inherit from `templates/_shared/`:

```
templates/_shared/
├── package.json      # Next.js 15 + React 19 dependencies
├── next.config.ts    # Static export configuration  
├── tsconfig.json     # TypeScript settings
├── src/
│   ├── components/   # Shared React components (Footer, Menu, etc.)
│   ├── types/        # TypeScript interfaces
│   ├── theme/        # Material-UI theme system
│   └── data/         # Restaurant data templates
```

**🚫 NEVER modify files in `_shared/`** - changes affect all templates.

### Template Variants

Templates are created in `templates/variants/<template-name>/`:

```
variants/my-template/
├── template.json     # REQUIRED - Template metadata
└── src/              # REQUIRED - Next.js app files
    └── app/          # App Router structure
        ├── layout.tsx    # Page layout, fonts, metadata
        ├── page.tsx      # Homepage components
        ├── globals.css   # Custom CSS styles
        ├── theme.ts      # Material-UI theme config
        └── favicon.ico   # Template icon (optional)
```

## Creating a New Template

### Step 1: Copy Existing Template

Always start by copying an existing template:

```bash
# Navigate to variants directory
cd templates/variants/

# Copy a similar template (minimal-cafe is a good base)
cp -r minimal-cafe my-new-template

# Enter the new template
cd my-new-template/
```

### Step 2: Update Template Metadata

Edit `template.json` with your template information:

```json
{
  "id": "my-new-template",
  "name": "My Restaurant Template",
  "description": "A modern template for contemporary restaurants",
  "recommended_for": ["Fine dining", "Contemporary restaurants", "Upscale venues"],
  "color_scheme": "warm",
  "design_style": "modern",
  "features": ["hero_section", "menu_display", "gallery", "contact_form"]
}
```

**Required fields:**
- `id`: Directory name (kebab-case)
- `name`: Display name shown in CLI
- `description`: Brief template description
- `recommended_for`: Array of restaurant types

### Step 3: Customize Visual Design

#### A. Layout Structure (`src/app/layout.tsx`)

Controls page structure, fonts, and metadata:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Template - Restaurant Name",
  description: "Your restaurant description here",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Custom fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-900">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### B. Homepage Components (`src/app/page.tsx`)

Defines the page structure and components:

```tsx
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { restaurantData } from '@/data/restaurant';
import MyCustomHero from '@/components/MyCustomHero';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MyCustomHero restaurant={restaurantData} />
        {/* Add more sections */}
      </main>
      <Footer />
    </div>
  );
}
```

#### C. Styling (`src/app/globals.css`)

Template-specific CSS (builds on shared Tailwind):

```css
/* Import shared styles */
@import '@/theme/variables.css';

/* Template-specific styles */
.my-template-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.my-template-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.my-template-card:hover {
  transform: translateY(-5px);
}
```

#### D. Theme Configuration (`src/app/theme.ts`)

Material-UI theme customization:

```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#ffffff',
      paper: '#f8fafc',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
});

export default theme;
```

### Step 4: Create Custom Components (Optional)

If your template needs unique components, create them in `src/components/`:

```tsx
// src/components/MyCustomHero.tsx
import { RestaurantData } from '@/types/restaurant';

interface MyCustomHeroProps {
  restaurant: RestaurantData;
}

export default function MyCustomHero({ restaurant }: MyCustomHeroProps) {
  return (
    <section className="my-template-hero min-h-screen flex items-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">
          {restaurant.restaurant_info.name}
        </h1>
        <p className="text-xl opacity-90">
          {restaurant.restaurant_info.description}
        </p>
      </div>
    </section>
  );
}
```

### Step 5: Test Your Template

Use the CLI to test your template:

```bash
# Navigate to system root
cd "/Users/mohammadalmusaiteer/Project Shawrma-Website temp/Websites_nextjs"

# Run CLI
./websites

# Select option 1 (Build Website)
# Choose your new template
# Choose any restaurant
# Select mode 1 (Testing & Preview)
# Verify the website works correctly
```

## Design Guidelines

### Visual Differentiation Strategy

Make templates visually distinct:

| Element | Differentiation Options |
|---------|------------------------|
| **Colors** | Primary color, secondary palette, background tones |
| **Typography** | Font families, weights, sizes, line heights |
| **Layout** | Grid systems, spacing, component arrangement |
| **Components** | Hero styles, navigation design, card layouts |
| **Effects** | Animations, hover states, transitions |

### Template Categories

#### Modern/Contemporary
- Clean lines, minimal design
- Sans-serif fonts (Inter, Roboto)
- Neutral colors with accent colors
- Grid-based layouts

#### Traditional/Classic  
- Elegant serif fonts (Playfair Display)
- Rich, warm color palettes
- Ornamental elements
- Symmetrical layouts

#### Specialty (Coffee, BBQ, etc.)
- Theme-specific imagery and colors
- Industry-appropriate fonts
- Contextual design elements
- Targeted user experience

### Responsive Design Requirements

All templates must be mobile-responsive:

```css
/* Mobile-first approach */
.my-component {
  /* Mobile styles (default) */
  padding: 1rem;
  font-size: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .my-component {
    padding: 2rem;
    font-size: 1.125rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .my-component {
    padding: 3rem;
    font-size: 1.25rem;
  }
}
```

## Advanced Customization

### Component Overrides

Override shared components by creating template-specific versions:

```bash
# Override shared component
cp templates/_shared/src/components/Menu.tsx templates/variants/my-template/src/components/

# Customize the copied component for your template
```

### Theme Token System

Use the theme token system for consistency:

```css
/* Use CSS variables from theme tokens */
.my-element {
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-heading);
  border-radius: var(--border-radius-lg);
}
```

### Data Integration

Templates automatically receive restaurant data via TypeScript interfaces:

```tsx
// Access restaurant data
import { restaurantData } from '@/data/restaurant';

// TypeScript interfaces available
import type { RestaurantData, MenuItem, MenuCategory } from '@/types/restaurant';

// Use in components
export function MenuDisplay() {
  return (
    <div>
      {Object.entries(restaurantData.menu_categories).map(([category, items]) => (
        <CategorySection key={category} name={category} items={items} />
      ))}
    </div>
  );
}
```

## Quality Assurance

### Testing Checklist

Before considering a template complete:

- [ ] **CLI Discovery**: Template appears in CLI automatically
- [ ] **Build Success**: Website generates without errors (2-3 minutes)
- [ ] **Visual Design**: Template looks unique and professional
- [ ] **Data Integration**: Restaurant data displays correctly
- [ ] **Responsive Design**: Works on mobile, tablet, and desktop
- [ ] **Performance**: Page loads quickly, smooth interactions
- [ ] **Typography**: Fonts load correctly, readable hierarchy
- [ ] **Navigation**: All sections accessible, smooth scrolling
- [ ] **Images**: Restaurant images display properly
- [ ] **Contact Info**: Phone, email, address show correctly

### Browser Testing

Test generated websites in:
- Chrome (desktop & mobile)
- Safari (desktop & mobile)
- Firefox (desktop)

### Common Issues

**Template not appearing in CLI**:
- Check `template.json` syntax with `cat template.json | jq .`
- Verify directory is in `templates/variants/`

**Build failures**:
- Check for TypeScript errors: `npx tsc --noEmit`
- Verify shared component imports use `@/components/`
- Ensure all dependencies are in `_shared/package.json`

**Styling issues**:
- Check CSS class names don't conflict
- Verify Tailwind classes are available
- Test responsive breakpoints

## Template Maintenance

### Regular Updates

Keep templates current:

```bash
# Test all templates periodically
./websites  # Build test sites with each template

# Update shared components when needed
# Templates automatically inherit updates
```

### Version Control

Maintain template versions:

```json
{
  "id": "my-template",
  "name": "My Template",
  "version": "1.2.0",
  "last_updated": "2025-08-08",
  "changelog": [
    "1.2.0: Added mobile menu improvements",
    "1.1.0: Enhanced hero section animations",
    "1.0.0: Initial release"
  ]
}
```

## Best Practices

### Do's ✅
- Always start by copying an existing template
- Focus on visual differentiation through colors, fonts, and layout
- Test with multiple restaurants to verify data integration
- Use semantic HTML and accessible design principles
- Follow Next.js and React best practices
- Keep custom CSS minimal and well-organized

### Don'ts ❌
- Don't modify files in `templates/_shared/`
- Don't duplicate functionality between templates
- Don't hardcode restaurant data in templates
- Don't ignore responsive design requirements
- Don't create templates without testing them first
- Don't forget to update `template.json` metadata

Your new template is ready when it passes all tests and provides a unique, professional design for restaurant websites!