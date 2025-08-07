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

### **Phase 1: Source Analysis & Data Integration**
1. **Study the Target Website**: Examine layout, navigation, visual elements, typography
2. **Identify Key Sections**: Landing, Menu, About, Contact sections with specific classes
3. **Understand Data Requirements**: Map target layout to our Hungerstation data structure
4. **Plan Component Strategy**: Determine which shared components to use vs custom components needed

### **Phase 2: Template Foundation Setup**
```bash
# Always start by copying an existing working template
cd "/Users/mohammadalmusaiteer/Project Shawrma-Website temp/Websites_nextjs/templates/variants"
cp -r romans-inspired your-new-template-name
```

### **Phase 3: Template Configuration**
1. **Update template.json** with new metadata:
   - Change `id` and `name` to match new template
   - Update `description` to be specific and detailed
   - Add new `recommended_for` categories
   - Update `custom_files` list

### **Phase 4: Data-Driven Development**
1. **Create Custom Components** (like RomansMenu.tsx) that:
   - Import data from `@/data/restaurant`
   - Handle Hungerstation data structure (`menu_categories`, `restaurant_info`)
   - Support bilingual content (Arabic/English)
   - Display pricing with currency
   - Handle offer prices and discounts

2. **Update page.tsx** to:
   - Use exact section structure from target website
   - Implement proper navigation hash routing
   - Load restaurant data dynamically
   - Create authentic layout matching target

### **Phase 5: Visual Authenticity Implementation**
1. **globals.css** must:
   - Replicate exact color scheme from target
   - Match typography (fonts, weights, spacing)
   - Implement responsive behavior
   - Add target-specific CSS classes

2. **theme.ts** should:
   - Define Material-UI theme matching target colors
   - Set up typography scales
   - Configure component overrides

### **Phase 6: Testing & Validation**
1. **Visual Comparison**: Side-by-side comparison with target website
2. **Data Integration**: Test with actual restaurant JSON files
3. **Responsive Design**: Verify mobile/tablet/desktop layouts
4. **Component Functionality**: Ensure all interactions work

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
  interface RestaurantData {
    restaurant_info: {
      id: string;
      name: string;
      region: string;
      type_of_food: string;
      description?: string;
    };
    menu_categories: {
      [categoryName: string]: MenuItem[];
    };
  }
  ```
- **SUPPORT** bilingual content (English/Arabic)
- **HANDLE** pricing with currency display
- **MANAGE** offer prices and discounts

### 3. **Component Import Strategy**
- **ALWAYS** import shared components: `import ComponentName from '@/components/ComponentName'`
- **CREATE** custom components only for unique target-specific functionality
- **ENSURE** all imports resolve correctly before testing

## 📁 Template Structure Requirements (Romans NYC Standard)

### Mandatory Files Structure
```
variants/{template-name}/
├── template.json              # REQUIRED - Template metadata
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Page layout, fonts, metadata
│   │   ├── page.tsx          # Homepage with exact target structure
│   │   ├── globals.css       # Target-specific CSS (Romans style)
│   │   └── theme.ts          # Material-UI theme configuration
│   └── components/           # OPTIONAL - Only for unique components
│       └── CustomMenu.tsx    # Example: Target-specific menu component
```

### Required template.json Format (Based on Romans NYC)
```json
{
  "id": "template-id",
  "name": "Template Display Name",
  "description": "Exact replica of [Target Website] design with authentic layout, navigation structure, and visual styling compatible with Hungerstation data",
  "version": "1.0.0",
  "framework": "nextjs",
  "language": "typescript", 
  "styling": "tailwind+mui",
  "recommended_for": ["cuisine-type", "restaurant-type", "authentic-replica"],
  "features": [
    "responsive-design",
    "typescript",
    "target-specific-layout",
    "exact-replica-design",
    "authentic-navigation",
    "hungerstation-data-integration",
    "bilingual-support"
  ],
  "structure": {
    "template_type": "variant",
    "uses_shared": true,
    "custom_files": [
      "src/app/layout.tsx",
      "src/app/page.tsx", 
      "src/app/globals.css",
      "src/app/theme.ts",
      "src/components/CustomComponent.tsx"
    ]
  }
}
```

## 🎨 Visual Design Guidelines (Romans NYC Approach)

### Template Creation from Real Website Clones

#### **Step 1: Website Analysis**
- Use **HTTrack** or **wget** to clone target website (see comparison below)
- Study HTML structure, CSS classes, layout patterns
- Identify key visual elements: colors, fonts, spacing, animations
- Document navigation structure and section organization

#### **Step 2: Data Mapping**
- Map target website sections to our restaurant data structure
- Plan how menu items will be displayed
- Consider bilingual support requirements
- Plan responsive behavior adaptation

#### **Step 3: Exact Replication**
- Match colors precisely using browser dev tools
- Replicate typography using Google Fonts or similar
- Copy layout structure with CSS Grid/Flexbox
- Implement animations and interactions

### Color Palette Requirements
```css
:root {
  --background: #FFFFFF;     /* Exact match from target */
  --foreground: #333333;     /* Primary text color */
  --primary: #333333;        /* Brand/accent color */
  --secondary: #666666;      /* Supporting color */
  --border: #e9ecef;         /* Border/divider color */
  --light-bg: #f8f9fa;       /* Section backgrounds */
}
```

### Typography Requirements (Romans NYC Pattern)
```css
/* Import exact fonts from target website */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Define font families matching target */
.primary-heading {
  font-family: 'DIN Light Regular', 'Inter', sans-serif;
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.body-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}
```

## ⚙️ Technical Implementation (Romans NYC Standard)

### 1. Page Structure Implementation
```tsx
// Follow exact target website section structure
export default function Home() {
  return (
    <main className="target-main-class">
      {/* Fixed Navigation - exactly like target */}
      <Navigation />
      
      {/* Landing Section - match target hero */}
      <section id="landing" className="section segments-landing-template">
        {/* Hero content matching target layout */}
      </section>

      {/* Menu Section - custom component for data integration */}
      <section id="menus" className="section segments-menus-template">
        <CustomMenu />
      </section>

      {/* Additional sections matching target structure */}
      <section id="about" className="section segments-about-template">
        <About />
      </section>
      
      <Footer />
    </main>
  );
}
```

### 2. Custom Component Creation (Romans Menu Pattern)
```tsx
// Create target-specific components for unique functionality
'use client';
import React, { useState } from 'react';
import { restaurantData } from '@/data/restaurant';

interface HungerstationMenuItem {
  item_en: string;
  item_ar: string;
  price: number;
  currency: string;
  description?: string;
  offer_price?: number | null;
}

const CustomMenu: React.FC = () => {
  // Get menu categories from Hungerstation data
  const menuCategories = restaurantData.menu_categories || {};
  
  return (
    <div className="target-menu-layout">
      {Object.entries(menuCategories).map(([category, items]) => (
        <div key={category} className="target-menu-section">
          <h3 className="target-category-heading">{category}</h3>
          {items.map((item, index) => (
            <div key={index} className="target-menu-item">
              <div className="target-item-header">
                <h4>{item.item_en}</h4>
                <span className="target-price">
                  {item.offer_price || item.price} {item.currency}
                </span>
              </div>
              {item.description && (
                <p className="target-description">{item.description}</p>
              )}
              {item.item_ar && item.item_ar !== item.item_en && (
                <span className="target-arabic">{item.item_ar}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

### 3. CSS Implementation (Target-Specific Classes)
```css
/* Use exact class names from target website when possible */
.segments-landing-template {
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.segments-menus-template {
  background: var(--light-bg);
  padding: 4rem 0;
}

/* Replicate target typography exactly */
.target-category-heading {
  font-family: 'DIN Light Regular', 'Inter', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--primary);
  text-align: center;
  margin-bottom: 2rem;
}

.target-menu-item {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

/* Responsive design matching target */
@media (max-width: 768px) {
  .target-item-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

## 📊 HTTrack vs wget Analysis

Based on the Romans NYC clone files analysis:

### **HTTrack Analysis** ✅ **RECOMMENDED**
**What we used for Romans NYC Clone:**

**Advantages:**
- **Complete Website Mirroring**: Downloads entire website structure with proper folder organization
- **Asset Preservation**: Maintains CSS, JS, images with correct relative paths
- **Link Rewriting**: Automatically rewrites internal links for offline browsing
- **Resume Capability**: Can resume interrupted downloads
- **Comprehensive Logging**: Detailed logs of what was downloaded (hts-log.txt)
- **Cache Management**: Efficient caching system (hts-cache folder)
- **Configuration Options**: Rich set of options for filtering and customization

**Evidence from Romans Clone:**
```
HTTrack3.49-2 launched on Wed, 06 Aug 2025 19:13:29 at https://butcherandbee.com
118 links scanned, 112 files written (37990504 bytes overall)
Complete folder structure preserved with CSS/JS/images
```

**Disadvantages:**
- **Larger Download Size**: Downloads everything including unnecessary files
- **Complex Output**: Creates additional metadata files
- **Windows/Mac GUI**: Can be complex for beginners

### **wget Analysis** ⚠️ **LIMITED USE**

**Advantages:**
- **Lightweight**: Smaller, simpler tool
- **Command Line Focused**: Great for scripts and automation
- **Fast Single File Downloads**: Excellent for individual files
- **Universal Availability**: Available on most Unix systems

**Disadvantages:**
- **Limited Website Structure Preservation**: Doesn't maintain proper folder structure
- **Manual Link Management**: Requires manual work to fix internal links  
- **No Asset Organization**: CSS/JS/images may not be properly organized
- **Basic Logging**: Less detailed information about download process

### **Recommendation: Use HTTrack for Template Creation**

For template creation like Romans NYC Clone:
```bash
# Use HTTrack for complete website cloning
httrack "https://target-website.com" -O "templates/clone/target-name" -s0 -a -K0 -c8
```

**Why HTTrack is Superior for Our Use Case:**
1. **Complete Analysis**: Provides full website structure for comprehensive analysis
2. **Asset Preservation**: Maintains all CSS/JS needed to understand styling
3. **Offline Browsing**: Can study the website offline with full functionality
4. **Professional Results**: Better foundation for creating accurate replicas

## 🧪 Testing Protocol (Romans NYC Standard)

### Pre-Build Testing Checklist
- [ ] Target website structure replicated accurately
- [ ] All Hungerstation data fields integrated properly
- [ ] Custom components handle bilingual content
- [ ] Pricing displays correctly with currency
- [ ] Responsive design matches target website
- [ ] Navigation structure mirrors target exactly

### Build Testing Process
```bash
# Test template with Romans NYC methodology
cd "/Users/mohammadalmusaiteer/Project Shawrma-Website temp/Websites_nextjs"
./websites

# Select your new template and test with actual restaurant data
# Verify:
# - Menu categories display correctly
# - Arabic/English content shows properly  
# - Pricing and offers work correctly
# - Visual design matches target website
# - Mobile responsiveness works perfectly
```

## 📋 Template Creation Workflow (Romans NYC Method)

### Step 1: Website Analysis & Cloning
```bash
# Clone target website using HTTrack
httrack "https://target-website.com" -O "templates/clone/target-name" -s0 -a -K0 -c8

# Study the cloned website structure
open templates/clone/target-name/index.html
```

### Step 2: Template Foundation
```bash
# Copy existing working template
cp -r templates/variants/romans-nyc-clone templates/variants/new-template-name

# Update template.json with new information
# Plan data integration strategy
```

### Step 3: Development (Romans Pattern)
1. **Update template.json** with accurate metadata and new ID
2. **Create custom menu component** that handles Hungerstation data
3. **Update page.tsx** with exact target section structure  
4. **Modify globals.css** to match target visual design exactly
5. **Configure theme.ts** with target colors and typography
6. **Test with real restaurant data** throughout development

### Step 4: Validation & Testing
1. **Visual Comparison**: Side-by-side with target website
2. **Data Integration**: Test with multiple restaurant JSON files
3. **Responsive Testing**: Mobile, tablet, desktop layouts
4. **Interactive Elements**: Navigation, tabs, buttons functionality
5. **Performance Testing**: Loading speed and smooth animations

### Step 5: Production Readiness
1. **Final template.json** with complete metadata
2. **Documentation** of any special requirements
3. **CLI Integration** verification (auto-discovery)
4. **Quality Assurance** against Romans NYC standard

## 📚 Reference Implementation: Romans NYC Clone

**Location**: `/templates/variants/romans-nyc-clone/`

**Key Files to Study:**
- `template.json` - Complete metadata structure
- `src/app/page.tsx` - Target section structure implementation
- `src/components/RomansMenu.tsx` - Hungerstation data integration
- `src/app/globals.css` - Target visual design replication
- `src/app/theme.ts` - Material-UI theme configuration

**Success Metrics Achieved:**
- ✅ Exact visual replica of Romans NYC
- ✅ Full Hungerstation data integration
- ✅ Bilingual support (Arabic/English)
- ✅ Responsive design across all devices
- ✅ Auto-discovery by CLI system
- ✅ Perfect data-driven content population

## 🎯 Quality Standards (Romans NYC Level)

### Visual Authenticity Requirements
- **99% Visual Match**: Template should be nearly indistinguishable from target
- **Responsive Fidelity**: Mobile/tablet versions match target behavior
- **Interactive Elements**: All buttons, navigation, animations work exactly like target
- **Typography Precision**: Fonts, sizes, weights, spacing match exactly

### Data Integration Excellence
- **Complete Support**: All Hungerstation data fields display correctly
- **Bilingual Excellence**: Arabic and English content both render properly
- **Pricing Accuracy**: Regular prices, offer prices, discounts all work
- **Category Management**: Menu categories organize and display correctly
- **Fallback Handling**: Graceful handling of missing data fields

### Technical Quality Benchmarks
- **Build Success**: 100% successful builds with no errors
- **Performance**: Page loads under 2 seconds
- **Compatibility**: Works perfectly across all modern browsers
- **Accessibility**: Meets WCAG 2.1 AA standards
- **Mobile First**: Perfect mobile experience with responsive design

---

## 🔄 Romans NYC Clone Success Formula

**The Romans NYC Clone template demonstrates our perfect template creation methodology. Every future template should:**

1. **Study a real website** thoroughly using HTTrack
2. **Map target structure** to our Hungerstation data
3. **Create custom components** for unique functionality
4. **Replicate visual design** with precision
5. **Integrate restaurant data** seamlessly
6. **Test comprehensively** across all scenarios
7. **Document completely** for future reference

**This approach ensures every template is:**
- Visually authentic and professional
- Data-driven and functional
- Responsive and accessible  
- Maintainable and scalable
- Production-ready from day one

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