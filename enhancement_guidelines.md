below is a concrete, minimal plan to standardize alignment and simplify integration.

Findings
- Headers/footers are implemented inconsistently across variants
  - Some variants render header/footer inside `page.tsx` instead of `layout.tsx`, causing spacing/stacking inconsistencies across pages.
```23:31:Websites_nextjs/templates/variants/fiola-elegant/src/app/page.tsx
return (
  <main>
    <FiolaHeader />
    <FiolaHero />
    ...
    <Footer />
  </main>
);
```
```70:80:Websites_nextjs/templates/variants/modern-restaurant/src/app/page.tsx
return (
  <Fade in={showContent} timeout={1000}>
    <main className="cyber-grid matrix-bg">
      <CyberpunkNavigation />
      ...
      <Footer />
    </main>
  </Fade>
);
```
- Shared `Footer` hard-codes an orange theme and container sizing; it clashes with many variants:
```5:16:Websites_nextjs/templates/_shared/src/components/Footer.tsx
<footer className="bg-orange-600 text-white py-12 mt-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    ...
    <p className="text-orange-100 mb-4 opacity-80">
      {restaurantData.description}
```
- Several variants ship custom headers/footers with bespoke spacing and nav logic (duplicated across variants), diverging from shared components and shared spacing scales.
```1:22:Websites_nextjs/templates/variants/fiola-elegant/src/components/FiolaHeader.tsx
'use client';
import { useState } from 'react';
import { restaurantData } from '@/data/restaurant';
...
<header className="fixed top-0 left-0 right-0 z-50 bg-warm-white/95 ...">
  ...
  <h1 className="text-2xl font-bold text-wine-red font-serif">{restaurantData.name}</h1>
```
- Mixed styling systems across variants (Tailwind everywhere, plus MUI in `minimal-cafe` via `ThemeProvider`). This leads to divergent paddings, font stacks, and container widths.
```1:8:Websites_nextjs/templates/variants/minimal-cafe/src/app/layout.tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
```
- Data integration from `@places_json/` is already centralized: the builder merges `_shared` with a chosen variant, then generates `src/data/restaurant.ts` matching `_shared` types.
```64:110:Websites_nextjs/generator/website-builder.js
transformRestaurantData(restaurantData) {
  const { restaurant_info, menu_categories = {}, contact_info = {} } = restaurantData;
  ...
  return {
    name: restaurant_info.name || 'Restaurant',
    description: ...,
    phone: contact_info.phone || restaurant_info.phone || '(555) 123-4567',
    address: restaurant_info.address || restaurant_info.location || 'Restaurant Address',
    email: contact_info.email || restaurant_info.email || 'info@restaurant.com',
    website: ...,
    heroImage: restaurant_info.photo_url || restaurant_info.cover_photo || ...,
    aboutImage: ...,
    menu: transformedMenu,
    gallery: gallery
  };
}
```

What to change (minimal, high-impact)
- Standardize layout composition
  - Move all header/footer rendering into `src/app/layout.tsx` for every variant. `page.tsx` should only render page sections.
  - Impact: consistent stacking order, spacing, and behavior site-wide.

- Introduce design tokens + theme layer in `_shared`
  - Add a tiny token interface and default tokens (colors, spacing, container width, fonts) and a provider via CSS variables.
  - Variants can override tokens with a one-file override export instead of rewriting headers/footers.
  - Keep Tailwind as the primary styling system for tokens via CSS variables; MUI variant can still read CSS variables without pulling in MUI theming everywhere.

- Unify `Header` and `Footer` in `_shared` with token-driven styles and optional slots
  - Replace hard-coded orange values with token lookups.
  - Allow variants to inject small extras (e.g., `rightSlot`, `navBefore`, `navAfter`) without forking the whole component.
  - Variants that truly need custom headers/footers can override by dropping files in `variants/<id>/src/components/Header.tsx` or `Footer.tsx`, but default to shared.

- Normalize container/gutters/spacing
  - Define container rules once (e.g., `container mx-auto px-[var(--space-4)] max-w-[var(--container-max)]`) and use them across all shared sections.
  - Adopt consistent vertical rhythm (e.g., `py-[var(--space-12)]` for sections) so header/footer align with hero and content.

- Expand `RestaurantData` to cover brand + footer needs
  - Add optional fields that header/footer often need but are missing now:
    - `logo?: string`
    - `brand?: { primary: string; surface: string; onPrimary: string; onSurface: string; accent?: string }`
    - `social?: { facebook?: string; instagram?: string; twitter?: string; tiktok?: string }`
    - `hours?: Array<{ day: string; open: string; close: string }>`
    - `locationUrl?: string`
  - Keep all optional so existing variants don’t break.

- Map new fields in the builder from `@places_json/`
  - In `transformRestaurantData(...)`, populate new fields where present:
    - `logo` from `restaurant_info.logo_url` if available.
    - `brand` from any `brand_color` hints or compute from hero image or defaults per variant (fallback).
    - `social` if URLs exist in `contact_info` or `restaurant_info`.
    - `locationUrl` from a maps link if provided, otherwise construct from coordinates if present.
  - Fall back to safe defaults to avoid breaking builds.

- Normalize anchors and section IDs
  - Standardize to `#home`, `#about`, `#menu`, `#gallery`, `#contact`.
  - Provide a small shared `NavItems` array and a `Section` wrapper that enforces consistent spacing and IDs.

Concrete edits to make it happen
- Files to add in `_shared`:
  - `src/theme/tokens.ts`:
    ```ts
    export type ThemeTokens = {
      colors: {
        primary: string;
        surface: string;
        onPrimary: string;
        onSurface: string;
        accent?: string;
      };
      layout: {
        containerMax: string;   // e.g. '1280px'
        gutterX: string;        // e.g. '1rem'
        sectionY: string;       // e.g. '4rem'
      };
      typography: {
        fontFamily: string;
        headingFamily?: string;
      };
    };

    export const defaultTokens: ThemeTokens = {
      colors: { primary: '#ea580c', surface: '#ffffff', onPrimary: '#ffffff', onSurface: '#0f172a' },
      layout: { containerMax: '80rem', gutterX: '1rem', sectionY: '4rem' },
      typography: { fontFamily: 'Inter, system-ui, sans-serif' },
    };
    ```
  - `src/theme/ThemeProvider.tsx`:
    ```tsx
    'use client';
    import React from 'react';
    import { ThemeTokens, defaultTokens } from './tokens';

    export const ThemeContext = React.createContext<ThemeTokens>(defaultTokens);

    export function ThemeProvider({ tokens, children }: { tokens?: Partial<ThemeTokens>; children: React.ReactNode }) {
      const merged = { ...defaultTokens, ...tokens, colors: { ...defaultTokens.colors, ...(tokens?.colors||{}) }, layout: { ...defaultTokens.layout, ...(tokens?.layout||{}) }, typography: { ...defaultTokens.typography, ...(tokens?.typography||{}) } };
      return (
        <ThemeContext.Provider value={merged}>
          <div style={{
            // expose as CSS vars so Tailwind classes and CSS can use them
            ['--color-primary' as any]: merged.colors.primary,
            ['--color-surface' as any]: merged.colors.surface,
            ['--color-onPrimary' as any]: merged.colors.onPrimary,
            ['--color-onSurface' as any]: merged.colors.onSurface,
            ['--container-max' as any]: merged.layout.containerMax,
            ['--gutter-x' as any]: merged.layout.gutterX,
            ['--section-y' as any]: merged.layout.sectionY,
            ['--font-body' as any]: merged.typography.fontFamily,
            ['--font-heading' as any]: merged.typography.headingFamily || merged.typography.fontFamily,
          } as React.CSSProperties}>
            {children}
          </div>
        </ThemeContext.Provider>
      );
    }
    ```
- Update shared `Footer` to tokens and remove hard-coded orange:
  - Replace:
    - `bg-orange-600` with `bg-[var(--color-primary)]`
    - `text-orange-100` with `text-white/80` or `text-[color:var(--color-onPrimary)]/80` depending on background
    - container with `max-w-[var(--container-max)] mx-auto px-[var(--gutter-x)]`
  - Keep quick links and contact wired to `restaurantData`.

- Add a shared `Header` (if not already) with tokens and standardized nav items; expose optional slots for variant-specific embellishments.

- Variants override tokens instead of forking components
  - Add `variants/<id>/src/theme.tokens.ts` exporting a token object; in that variant’s `layout.tsx`, wrap children with `_shared` `ThemeProvider` and pass its tokens.
  - Example in `fiola-elegant/src/app/layout.tsx`: import `fiolaTokens` and wrap children.

- Enforce header/footer in all variants’ `layout.tsx`
  - Layout structure for every variant:
    ```tsx
    import './globals.css';
    import { ThemeProvider } from '@/theme/ThemeProvider';
    import { tokens as variantTokens } from '../theme.tokens'; // optional per variant
    import Header from '@/components/Header';
    import Footer from '@/components/Footer';

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <body>
            <ThemeProvider tokens={variantTokens}>
              <Header />
              {children}
              <Footer />
            </ThemeProvider>
          </body>
        </html>
      );
    }
    ```

- Extend `_shared/src/types/restaurant.ts` (all optional to avoid breaking):
  ```ts
  export interface RestaurantData {
    name: string;
    description: string;
    phone: string;
    address: string;
    email?: string;
    website?: string;
    heroImage: string;
    aboutImage?: string;
    menu: MenuItem[];
    gallery?: string[];
    logo?: string;
    brand?: { primary: string; surface: string; onPrimary: string; onSurface: string; accent?: string };
    social?: { facebook?: string; instagram?: string; twitter?: string; tiktok?: string };
    hours?: Array<{ day: string; open: string; close: string }>;
    locationUrl?: string;
  }
  ```

- Update builder mapping minimally to fill the new fields when present
  - In `transformRestaurantData(...)`, add:
    ```js
    logo: restaurant_info.logo_url || '',
    brand: restaurant_info.brand || undefined,
    social: contact_info.social || restaurant_info.social || undefined,
    locationUrl: restaurant_info.maps_url || (
      restaurant_info.coordinates
        ? `https://maps.google.com/?q=${restaurant_info.coordinates.latitude},${restaurant_info.coordinates.longitude}`
        : undefined
    ),
    ```
  - These are optional and won’t disrupt existing variants.

Rollout plan (quick)
- Phase 1: Add tokens + provider, refactor shared `Footer` to tokens. Move header/footer into `layout.tsx` for 2–3 variants to validate.
- Phase 2: Add shared `Header` and migrate remaining variants. Keep variant overrides only where necessary.
- Phase 3: Extend data mapping for brand/logo/social when available. Clean up duplicate variant headers/footers.

Acceptance
- All variants render header/footer from `_shared` by default, themed via tokens.
- No hard-coded brand colors in shared components.
- Layout contains header/footer; `page.tsx` contains sections only.
- Anchors and spacing are consistent across variants.
- Build output unchanged functionally; visuals become consistent per variant theme.
- `restaurantData` remains the single import path for runtime data; populated by the builder from `@places_json/`.

If you want, I can start with Phase 1 now on a single variant (e.g., `fiola-elegant`) to show the exact edits and verify visuals.

- Investigated shared and variant header/footer usage; found hard-coded theme and inconsistent placement causing misalignment.
- Proposed a tokens-based theme in `_shared`, shared `Header`/`Footer` with slots, and enforcing header/footer in `layout.tsx`.
- Suggested minimal `RestaurantData` extensions and small builder mapping additions so templates stay easy to integrate with `@places_json/`.