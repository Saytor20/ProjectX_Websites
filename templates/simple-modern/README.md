# Simple Modern Template

Clean, minimal restaurant template with professional typography, light/dark variants, and responsive layout. Implements seven required slots with `data-block` markers: navbar, hero, menu, gallery, hours, cta, footer.

Usage:
- Select with `?template=simple-modern` on the restaurant page.
- Pass a `Restaurant` object via props.
- Optional `variant` prop: `light | dark` (default `light`).

Files:
- `Template.tsx` – React component with all slots and data bindings
- `template.module.css` – Scoped CSS module with 768px breakpoint
- `manifest.json` – Template metadata including slots and version
