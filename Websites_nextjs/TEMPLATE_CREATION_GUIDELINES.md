# 🤖 Template Creation Guidelines for AI Agents & Developers

## Overview
This document provides **comprehensive guidelines for AI agents and developers** creating new restaurant website templates in our Next.js system. These guidelines are based on the successful **Romans NYC Clone** template creation process and must be followed to ensure consistency, functionality, and maintainability.

## 🎯 For AI Agents - Critical Instructions

### Agent Behavior Requirements
When working with this template system, **AI agents must**:

1. **ALWAYS** read this entire document before creating templates
2. **NEVER** modify files in `/templates/_shared/` directory
3. **ONLY** work within `/templates/variants/{template-name}/` directories
4. **FOLLOW** the exact Romans NYC Clone methodology outlined below
5. **TEST** templates immediately after creation using the CLI
6. **VALIDATE** that all Hungerstation data integrates correctly
7. **ENSURE** bilingual support (Arabic/English) works perfectly

### Auto-Discovery Requirements
- Templates are **automatically discovered** by the CLI system
- **No manual registration** is required
- Template appears in CLI menu immediately after creation
- `template.json` must be **valid JSON** with all required fields

### Quality Assurance for Agents
- **Build must succeed** without errors
- **Visual design** must match target website 99%
- **Data integration** must handle all restaurant fields
- **Responsive design** must work on mobile/tablet/desktop
- **Bilingual content** must display correctly

## 🚀 **Romans NYC Clone Methodology** - Follow This Approach

The Romans NYC Clone template represents our **gold standard** template creation process. All future templates should follow this exact methodology:

### Step 1: Target Website Analysis
1. **Study Target Website**: Analyze the visual design, layout, and user experience
2. **Identify Key Components**: Hero section, navigation, menu display, contact form
3. **Extract Design Elements**: Colors, fonts, spacing, animations, imagery style
4. **Document Requirements**: Create a detailed specification of what needs to be replicated

### Step 2: Template Structure Setup
```bash
cd templates/variants/
cp -r romans-nyc-clone your-new-template-name
```

### Step 3: Core File Updates
**Always update these files in this exact order:**

1. **template.json** - Template metadata and configuration
2. **src/app/theme.ts** - Material-UI theme with colors and typography
3. **src/app/globals.css** - Custom CSS styles and animations
4. **src/app/layout.tsx** - Page layout, fonts, and metadata
5. **src/app/page.tsx** - Main page structure and component integration
6. **src/components/** - Custom components for unique functionality

### Step 4: Data Integration Requirements
Every template must handle the **complete Hungerstation data structure**:

```typescript
interface RestaurantData {
  restaurant_info: {
    name: string;
    type_of_food: string;
    description: string;
    address: string;
    phone?: string;
  };
  menu_categories: {
    [category: string]: MenuItem[];
  };
  contact_info: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

interface MenuItem {
  item_en: string;
  item_ar: string;
  price: number;
  currency: string;
  description?: string;
  offer_price?: number | null;
}
```

## 🚨 Critical Rules - Never Break These (Especially Important for AI Agents)

### 1. **Architecture Boundaries** 🔒
- **NEVER** modify files in `/templates/_shared/` when creating new templates
- **ONLY** work in `/templates/variants/{template-name}/` directory
- **ALWAYS** use shared components via `@/components/` imports
- **NEVER** duplicate functionality that exists in shared components
- **FORBIDDEN**: Creating files outside variant directory structure
- **REQUIRED**: Follow exact file naming conventions

### 2. **Data Integration Requirements**
- **ALWAYS** support Hungerstation data structure:
  ```typescript
  // Import restaurant data
  import { restaurantData } from '@/data/restaurant';
  
  // Handle bilingual menu items
  {menu_categories[category].map(item => (
    <div key={item.item_en}>
      <h3>{item.item_en} / {item.item_ar}</h3>
      <p>{item.price} {item.currency}</p>
      {item.offer_price && <span>Offer: {item.offer_price}</span>}
    </div>
  ))}
  ```

### 3. **Visual Design Fidelity**
- **99% Accuracy Required**: Template must look nearly identical to target website
- **Responsive Design**: Must work perfectly on mobile, tablet, and desktop
- **Performance**: Fast loading times and smooth animations
- **Accessibility**: WCAG 2.1 AA compliance required

### 4. **File Structure Compliance**
```
variants/{your-template}/
├── template.json          # MANDATORY - Template metadata
├── src/app/
│   ├── layout.tsx        # Page layout and fonts
│   ├── page.tsx          # Main page structure
│   ├── globals.css       # Custom styles
│   └── theme.ts          # Material-UI theme
└── src/components/       # Template-specific components
    └── YourCustomComponent.tsx
```

## 🎨 Romans NYC Clone Success Factors

### What Made Romans NYC Clone Exceptional:

1. **Perfect Visual Replication**: 99% match with target website design
2. **Custom Component Strategy**: Created `RomansHero.tsx`, `RomansMenu.tsx`, etc.
3. **Data Integration Excellence**: Flawlessly handled all Hungerstation fields
4. **Responsive Design**: Works perfectly across all device sizes
5. **Performance Optimization**: Fast loading with smooth animations
6. **Clean Code Structure**: Well-organized, maintainable components

### Romans NYC Clone File Analysis:
```typescript
// src/components/RomansMenu.tsx - Perfect data integration example
import { restaurantData } from '@/data/restaurant';

export default function RomansMenu() {
  return (
    <section className="romans-menu">
      {Object.entries(restaurantData.menu_categories).map(([category, items]) => (
        <div key={category} className="category-section">
          <h2>{category}</h2>
          {items.map((item, index) => (
            <div key={index} className="menu-item">
              <div className="item-info">
                <h3>{item.item_en}</h3>
                <p className="arabic-text">{item.item_ar}</p>
                <p className="description">{item.description}</p>
              </div>
              <div className="price-info">
                <span className="price">{item.price} {item.currency}</span>
                {item.offer_price && (
                  <span className="offer">{item.offer_price} {item.currency}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
```

## 🛠️ Template Creation Process

### Phase 1: Setup and Planning
1. **Copy Romans NYC Clone Template**:
   ```bash
   cd templates/variants/
   cp -r romans-nyc-clone new-template-name
   ```

2. **Update template.json**:
   ```json
   {
     "id": "new-template-name",
     "name": "New Template Display Name",
     "description": "Detailed description of the template's design and use cases",
     "features": [
       "Feature 1",
       "Feature 2",
       "Feature 3"
     ],
     "custom_files": [
       "src/components/CustomComponent.tsx"
     ]
   }
   ```

### Phase 2: Visual Design Implementation
1. **Update Theme (src/app/theme.ts)**:
   ```typescript
   export const theme = createTheme({
     palette: {
       primary: { main: '#YOUR_PRIMARY_COLOR' },
       secondary: { main: '#YOUR_SECONDARY_COLOR' }
     },
     typography: {
       fontFamily: ['YourFont', 'sans-serif'].join(','),
       h1: { fontSize: '3rem', fontWeight: 'bold' }
     }
   });
   ```

2. **Update Styles (src/app/globals.css)**:
   ```css
   .your-template-hero {
     background: linear-gradient(135deg, #color1, #color2);
     min-height: 100vh;
     display: flex;
     align-items: center;
   }
   ```

### Phase 3: Component Development
1. **Create Custom Components**: Build components specific to your template's design
2. **Import Shared Components**: Use existing components where possible
3. **Integrate Data**: Ensure all restaurant data displays correctly

### Phase 4: Testing and Validation
1. **CLI Testing**: Verify template appears in CLI menu
2. **Build Testing**: Ensure `npm run build` succeeds
3. **Visual Testing**: Check design accuracy across devices
4. **Data Testing**: Test with multiple restaurant JSON files

## 🔍 Quality Checklist

Before considering a template complete, verify:

- [ ] **Auto-Discovery**: Template appears in CLI menu automatically
- [ ] **Build Success**: No TypeScript or build errors
- [ ] **Visual Accuracy**: 99% match with target website
- [ ] **Data Integration**: All restaurant data displays correctly
- [ ] **Bilingual Support**: Arabic and English both render correctly
- [ ] **Responsive Design**: Perfect on mobile, tablet, desktop
- [ ] **Performance**: Page loads in under 2 seconds
- [ ] **Navigation**: All links and interactions work
- [ ] **Accessibility**: Screen reader compatible

## 📋 Common Patterns and Best Practices

### Component Naming Convention
```typescript
// Template-specific components should be prefixed
src/components/RomansHero.tsx    // ✅ Good
src/components/FiolaMenu.tsx     // ✅ Good  
src/components/Hero.tsx          // ❌ Bad - too generic
```

### Data Integration Pattern
```typescript
// Always import restaurant data the same way
import { restaurantData } from '@/data/restaurant';

// Handle missing data gracefully
const phone = restaurantData.contact_info?.phone || 
             restaurantData.restaurant_info?.phone || 
             'Contact for details';
```

### CSS Organization
```css
/* Organize styles by component */
.template-name-hero { /* Hero styles */ }
.template-name-menu { /* Menu styles */ }
.template-name-footer { /* Footer styles */ }
```

## 🚫 Common Mistakes to Avoid

### Critical Don'ts:
1. **Never modify** `/templates/_shared/` files
2. **Never duplicate** existing shared components
3. **Never ignore** bilingual support requirements
4. **Never skip** responsive design testing
5. **Never commit** templates with build errors
6. **Never assume** data will always be present

### Quality Issues:
1. **Poor visual matching** - Template doesn't look like target
2. **Broken responsive design** - Doesn't work on mobile
3. **Missing data integration** - Doesn't display all restaurant info
4. **Performance problems** - Slow loading or laggy animations
5. **Accessibility failures** - Not usable with screen readers

## 🎯 Success Metrics

A template is production-ready when it achieves:
- ✅ **99% Visual Accuracy** to target website
- ✅ **Zero Build Errors** in TypeScript compilation
- ✅ **Perfect Data Integration** with all Hungerstation fields
- ✅ **Complete Responsiveness** across all device sizes
- ✅ **Optimal Performance** with fast load times
- ✅ **Auto-Discovery** in CLI interface

## 🔧 Troubleshooting Guide

### Build Errors
```bash
# Check for TypeScript errors
cd templates/variants/your-template
npx tsc --noEmit

# Test build process
npm run build
```

### CLI Detection Issues
```bash
# Verify template.json syntax
cat template.json | python -m json.tool

# Check if CLI detects template
../../websites
# Your template should appear in the list
```

### Data Integration Problems
```typescript
// Debug data structure
console.log('Restaurant Data:', restaurantData);
console.log('Menu Categories:', Object.keys(restaurantData.menu_categories));
```

## 📚 Reference Implementation

Study the **Romans NYC Clone** template as your reference:
- **Perfect metadata**: `romans-nyc-clone/template.json`
- **Excellent theming**: `romans-nyc-clone/src/app/theme.ts`
- **Data integration**: `romans-nyc-clone/src/components/RomansMenu.tsx`
- **Visual styling**: `romans-nyc-clone/src/app/globals.css`

## 🎓 Learning Path for Template Creation

1. **Study Romans NYC Clone**: Understand the gold standard implementation
2. **Analyze Target Website**: Break down design into components
3. **Create Template Structure**: Copy and modify Romans NYC Clone
4. **Implement Visual Design**: Match target website exactly
5. **Integrate Data**: Handle all restaurant data fields
6. **Test Thoroughly**: Verify functionality across devices
7. **Deploy and Validate**: Use CLI to generate test websites

## 📞 Support and Resources

### Available Resources:
- **Shared Components**: `/templates/_shared/src/components/`
- **Type Definitions**: `/templates/_shared/src/types/`
- **Example Templates**: Study existing variants for patterns
- **CLI Interface**: Use `./websites` for testing

### Getting Help:
1. **Review existing templates** for implementation patterns
2. **Check build logs** for specific error messages
3. **Use CLI system status** for diagnostics
4. **Test with multiple restaurants** to validate data integration

---

*Follow the Romans NYC Clone methodology for guaranteed template creation success.*

---

*This document should be updated whenever new techniques are discovered or improvements are implemented. The Romans NYC Clone represents our current gold standard for template creation excellence.*

---

## 🤖 Comprehensive AI Agent Instructions

### Step-by-Step Agent Workflow

#### Phase 1: Preparation & Analysis
```bash
# 1. Agent must first understand the target website
# Study the website structure, design, and functionality
# Identify key sections: Hero, Menu, About, Contact
# Note color scheme, typography, layout patterns
# Plan data integration strategy

# 2. Agent must check existing templates for reference
ls "/templates/variants/"
# Study romans-nyc-clone as the gold standard example
```

#### Phase 2: Template Creation
```bash
# 3. Agent creates new template by copying existing one
cd "/templates/variants"
cp -r "romans-nyc-clone" "new-template-name"

# 4. Agent updates template.json immediately
# Must include all required fields:
# - id (unique identifier)
# - name (display name)
# - description (detailed description)
# - features array
# - custom_files array
```

#### Phase 3: Development & Integration
```typescript
// 5. Agent must create custom components for unique functionality
// Example: Custom menu component that handles Hungerstation data

interface HungerstationMenuItem {
  item_en: string;
  item_ar: string;
  price: number;
  currency: string;
  description?: string;
  offer_price?: number | null;
}

// 6. Agent must implement bilingual support
// Handle both Arabic and English content
// Display pricing with proper currency formatting
// Support offer prices and discounts
```

#### Phase 4: Styling & Visual Replication
```css
/* 7. Agent must match target website visual design exactly */
/* Use exact colors, fonts, spacing, layout */
/* Implement responsive design for all screen sizes */
/* Ensure animations and interactions work properly */
```

#### Phase 5: Testing & Validation
```bash
# 8. Agent must test the template immediately
cd "/templates/root/directory"
./websites

# 9. Agent must verify:
# - Template appears in CLI menu
# - Build completes successfully
# - Website loads correctly
# - Data integration works
# - Mobile responsiveness functions
# - All navigation works
```

### Agent Error Prevention Checklist

Before considering a template complete, agents must verify:

- [ ] **File Structure**: Only files in `/templates/variants/{name}/` modified
- [ ] **template.json**: Valid JSON with all required fields
- [ ] **Data Integration**: All Hungerstation fields supported
- [ ] **Bilingual Support**: Arabic and English both render correctly
- [ ] **Build Success**: `npm run build` completes without errors
- [ ] **CLI Detection**: Template appears in websites CLI menu
- [ ] **Visual Accuracy**: 99% match with target website design
- [ ] **Responsive Design**: Works on mobile, tablet, desktop
- [ ] **Interactive Elements**: Navigation, buttons, forms all function
- [ ] **Performance**: Page loads quickly (under 2 seconds)

### Common Agent Mistakes to Avoid

#### 🚫 **DO NOT DO THESE:**
1. **Modifying Shared Files**: Never touch `/templates/_shared/` files
2. **Duplicating Components**: Use existing shared components instead
3. **Ignoring Data Structure**: Must support full Hungerstation data format
4. **Skipping Testing**: Always test templates before considering complete
5. **Poor Visual Matching**: Template must look nearly identical to target
6. **Missing Bilingual Support**: Must handle Arabic and English content
7. **Breaking Responsive Design**: Must work on all screen sizes
8. **Invalid JSON**: template.json must be valid and complete

#### ✅ **ALWAYS DO THESE:**
1. **Copy Existing Template**: Start with working romans-nyc-clone
2. **Follow File Structure**: Maintain exact directory organization
3. **Update template.json**: Provide complete metadata
4. **Create Custom Components**: For unique target-specific functionality
5. **Test Immediately**: Use CLI to verify everything works
6. **Validate Data**: Test with multiple restaurant JSON files
7. **Check Responsiveness**: Verify mobile/tablet/desktop layouts
8. **Document Clearly**: Update template.json with accurate descriptions

### Agent Success Validation

A template is **READY FOR PRODUCTION** when:

1. ✅ **Auto-Discovery Works**: Template appears in CLI menu automatically
2. ✅ **Build Succeeds**: No TypeScript or build errors
3. ✅ **Visual Match**: 99% identical to target website
4. ✅ **Data Integration**: All restaurant data displays correctly
5. ✅ **Bilingual Support**: Arabic and English both work perfectly
6. ✅ **Responsive Design**: Perfect on all device sizes
7. ✅ **Performance**: Fast loading and smooth interactions
8. ✅ **Navigation**: All links and interactions function properly

### Agent Debugging Guide

If template creation fails:

```bash
# Check build errors
cd "/templates/variants/your-template"
npm run build

# Check template JSON validity
jq . template.json

# Test CLI detection
cd "../.."
./websites
# Your template should appear in the list

# Check file structure
ls -la src/app/
# Should see: layout.tsx, page.tsx, globals.css, theme.ts
```

### Agent Reference Materials

**Study These Files for Examples:**
- `/templates/variants/romans-nyc-clone/template.json` - Perfect metadata example
- `/templates/variants/romans-nyc-clone/src/app/page.tsx` - Target structure implementation
- `/templates/variants/romans-nyc-clone/src/components/RomansMenu.tsx` - Data integration example
- `/templates/variants/romans-nyc-clone/src/app/globals.css` - Visual design replication
- `/templates/variants/romans-nyc-clone/src/app/theme.ts` - Theme configuration

**Understanding Shared Components:**
- `/templates/_shared/src/components/` - Available shared components
- `/templates/_shared/src/types/` - TypeScript interfaces
- `/templates/_shared/package.json` - Available dependencies

### Agent Performance Requirements

**Speed**: Template creation should take 10-15 minutes maximum
**Quality**: Must meet 99% visual accuracy standard
**Testing**: Must verify all functionality works correctly
**Documentation**: Must provide accurate template.json metadata

---

**For AI Agents: Following these guidelines ensures your templates will be production-ready, maintainable, and perfectly integrated with the restaurant website generation system. The Romans NYC Clone methodology is your blueprint for success.**