# Mehu Fresh Template

A fresh, green theme inspired by NgeTemplates Mehu. Converted to a React/Next.js template with full integration to our `Restaurant` schema and editor blocks.

- Slots: navbar, hero, product, why-us, testimonial, contact, footer
- Data: Uses real `restaurant_data` (menu_categories, restaurant_info)
- Preview: `http://localhost:3000/restaurant/[slug]?template=mehu`

## Data Integration

- Menu items come from `Object.values(menu_categories).flat()`.
- Product grid renders first 6 items with real `image`, `price`/`offer_price`, and `currency`.
- Info pulled from `restaurant.restaurant_info` for hero, why-us, and contact sections.
- Fallback images use `https://placehold.co/...` when `item.image` is missing.

## Editor Blocks

Each section has `data-block` markers and fields registered via `registerBlock`:
- `navbar`: logo image
- `hero`: kicker, title, subtitle, button text
- `product`: section title
- `why-us`: kicker, title
- `testimonial`: none (static copy for layout)
- `contact`: kicker, title
- `footer`: none

## Notes

- This template avoids bundling third-party assets; visual shapes are implemented with gradients/blobs to keep it self-contained.
- Colors and layout follow the Template Guidelines (CSS variables, responsive grid, 768px breakpoint).

## Quick Test

- Example: `http://localhost:3000/restaurant/shawarma_zone_83339?template=mehu`
- Add `&preview=true&device=mobile` to simulate device widths in preview mode.

