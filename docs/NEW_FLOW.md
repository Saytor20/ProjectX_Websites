## New Website Generation Flow

This project uses a copy-based flow:

- Data source: `Websites_nextjs/places_json/*.json`
- Template source: `Websites_nextjs/templates/variants/<templateId>/`
- Generator copies the template, injects transformed JSON into `src/data/restaurant.ts`, builds, and exports a static site under `Websites_nextjs/final_websites/<restaurant_slug>/`.

Benefits
- Clear separation of template code and restaurant data
- Deterministic static outputs for GitHub/Vercel hosting

Known limitation and next step
- Updating content currently requires regeneration. We will evolve toward a single Next.js app that reads a per-restaurant JSON file at runtime to enable content changes without rebuilds.

