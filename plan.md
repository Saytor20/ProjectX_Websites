Here's a decisive migration plan that **rips out legacy skins + editor cruft**, installs the **Template Package** model, and gets you a **working product** fast. Each phase includes a **copy-paste Agent Prompt** with: goals, files to create/remove, and a verification checklist (with commands). After every phase we **delete legacy code** to keep the repo clean.

## 🚀 **Parallelization & Subagent Strategy**

### **Serial Dependencies (Must Run in Order)**
- **Phase 0 → Phase 1** - Schema/tokens needed before templates
- **Phase 1 → Phase 2** - Templates must exist before cutover
- **Phase 2 → Phase 3** - Clean system needed before new editor
- **Phase 6 → Phase 7** - All templates converted before QA

### **Parallel Opportunities**
- **Phase 4 & Phase 5** - Can run simultaneously (different template sources)
- **Within Phase 6** - Template conversions can run in parallel (6 subagents)
- **Within Phase 7** - Mobile testing, performance, docs can be parallel

### **Subagent Usage Strategy**
- **Phase 0-3**: Single agent (foundational changes)
- **Phase 4**: 2 subagents (scaffold tool + 2 template conversions)
- **Phase 5**: Single agent (complex HTML parsing logic)
- **Phase 6**: 6 subagents (1 per template conversion) 
- **Phase 7**: 3 subagents (mobile, performance, documentation)

---

# Phase 0 — Prep & guardrails (1–2 hrs)

### Agent Prompt — “Prep the migration”

**What we want:** Create a clean migration branch, set strict compile/type/lint guards, and add a minimal template + data schema baseline.

**Create**

* `src/lib/schema.ts` — Zod schema for `Restaurant`
* `src/lib/tokens.ts` — CSS var defaults (e.g., `--gap`, `--padY`, `--radius`)
* `templates/.keep` — placeholder folder
* `tools/validate-template.ts` — tiny validator: checks manifest + required slots + buildability

### **Task Checklist**
- [x] Create `src/lib/schema.ts` with Restaurant Zod schema
- [x] Create `src/lib/tokens.ts` with CSS variable defaults
- [x] Create `templates/.keep` placeholder folder
- [x] Create `tools/validate-template.ts` validator script
- [x] Update `package.json` scripts section
- [x] Update lint script in package.json
- [x] Git: Create feat/template-migration branch
- [x] Install tsx dependency
- [x] Test: `npm run type-check` (Note: MoveableEditor errors will be fixed in Phase 3)
- [x] Commit Phase 0 changes

**Modify**

* `package.json`:

  * scripts:

    * `"validate-template": "tsx tools/validate-template.ts"`,
    * `"type-check": "tsc -p tsconfig.json --noEmit"`.
* `tsconfig.json` — ensure `strict: true`
* `eslint` — keep current rules; fail on warnings

**Remove (immediately)**

* None yet (we need a running baseline first).

**Verification**

```bash
git checkout -b feat/template-migration
npm i zod tsx
npm run type-check
npm run lint
```

**Post-migration Directory**

.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── restaurants/route.ts          # list/load restaurant JSON
│   │   │   └── templates/route.ts            # list templates (from registry)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── restaurant/[slug]/page.tsx        # renders selected Template Package
│   ├── components/
│   │   └── kit/                              # 10 stable primitives (Navbar, Hero, MenuList, ...)
│   ├── editor/
│   │   ├── Outline.tsx                       # block tree (reads [data-block])
│   │   ├── PatchPanel.tsx                     # text/image/variant/spacing controls
│   │   ├── registry.ts                        # runtime fields registry
│   │   └── useEditableText.ts                 # tiny hook for contenteditable text
│   └── lib/
│       ├── schema.ts                          # Zod Restaurant schema
│       ├── tokens.ts                          # shared CSS var defaults (--gap, --padY, --radius)
│       └── image.ts                           # URL setter / simple uploader util
├── templates/                                 # 10–15 Template Packages (self-contained)
│   ├── bistly/
│   │   ├── Template.tsx
│   │   ├── template.module.css
│   │   ├── manifest.json
│   │   └── README.md
│   ├── shawarma/
│   ├── simple/
│   └── (others…)
├── data/
│   └── restaurants/                          # *.json standardized to Restaurant schema
├── public/
│   ├── preview/                              # per-template thumbs for gallery/selection
│   └── assets/                               # shared static assets (if any)
├── tools/
│   ├── scaffold-template.ts                  # creates /templates/<id>/ with slot stubs
│   ├── ingest-envato.ts                      # Envato HTML → Template Package
│   └── validate-template.ts                  # manifest/slots sanity checks
├── docs/
│   └── templates.md                          # "build/convert a template in 10 minutes"
├── package.json
├── tsconfig.json
├── next.config.ts                            # Next.js configuration (TypeScript)
└── README.md

**Must-NOT-exist (purged legacy)**

skins/                         # all legacy skins
src/lib/css-scoper.ts
src/lib/mapping-dsl.ts
src/lib/component-renderer.tsx # if only used by skins
src/dev/editor/                # Moveable/Selecto editor folder(s)
app/api/skins/                 # legacy skin endpoints
**/map.yml                     # YAML mapping files


---

# Phase 1 — Add Template Packages + Registry (parallel path)

### Agent Prompt — “Introduce Template Packages & Registry without breaking current pages”

**What we want:** Add new **Template Package** system living **alongside** current code (still compiling). Wire a minimal registry and a new route to render a template by query string.

**Create**

* `templates/bistly/Template.tsx` — stub with required slots \[navbar, hero, menu, gallery, hours, cta, footer] and `data-block` attributes on each section.
* `templates/bistly/template.module.css` — scoped CSS module using CSS vars from `src/lib/tokens.ts`
* `templates/bistly/manifest.json`:

  ```json
  { "id": "bistly", "name": "Bistly", "slots": ["navbar","hero","menu","gallery","hours","cta","footer"], "version": "0.1.0" }
  ```
* `templates/registry.ts` — exports `getTemplate(id)` and `listTemplates()`, statically imports `/templates/*/Template.tsx` and `manifest.json`
* `src/app/api/templates/route.ts` — `GET` returns `listTemplates()`

### **Task Checklist**
- [ ] Create `templates/bistly/Template.tsx` with required slots
- [ ] Create `templates/bistly/template.module.css` with CSS module
- [ ] Create `templates/bistly/manifest.json` with template metadata
- [ ] Create `templates/registry.ts` with template functions
- [ ] Create `src/app/api/templates/route.ts` API route
- [ ] Modify `src/app/restaurant/[slug]/page.tsx` to support ?template= param
- [ ] **Enable TypeScript strict mode**: Set `"strict": true` in `tsconfig.json`
- [ ] Note: `templates/` is TS-included via `**/*.ts` - no action required
- [ ] Test: `/restaurant/abu_al_khair_63191?template=bistly` renders slots
- [ ] Test: `curl http://localhost:3000/api/templates` returns JSON
- [ ] Test: `npm run validate-template -- bistly` passes
- [ ] Test: `npm run type-check` passes (with strict mode)

**Modify**

* `src/app/restaurant/[slug]/page.tsx`:

  * Read `?template=` param; if present use `getTemplate(templateId)` and render `<Template restaurant={data} />`.
  * Fallback to existing legacy renderer if `?template` missing (temporary).

**Remove (immediately)**

* None (flip happens next phase).

**Verification**

```bash
npm run dev
# In browser:
# /restaurant/abu_al_khair_63191?template=bistly  => Renders stub slots
curl -s http://localhost:3000/api/templates | jq
npm run validate-template -- bistly
npm run type-check
```

**IMPORTANT: Before proceeding to Phase 2**
```bash
# Save current state with skins for future reference
git add -A && git commit -m "Phase 1 complete: Template system alongside legacy"
git tag pre-skins-purge
```

---

# Phase 2 — Cut over to Templates; delete skins engine

### Agent Prompt — “Switch routing to Template Packages and delete legacy skins”

**What we want:** Make Template Packages the **only** rendering path. Kill the skins pipeline (YAML mapping, CSS scoper, map DSL, legacy skin APIs).

**Modify**

* `src/app/restaurant/[slug]/page.tsx`: remove legacy branch; always use template registry.
* Replace any `map.yml`/JSONPath binding with direct props in `Template.tsx` (typed).

### **Task Checklist**
- [ ] Modify `src/app/restaurant/[slug]/page.tsx` to remove legacy branch
- [ ] Replace `map.yml`/JSONPath bindings with direct props
- [ ] Delete `skins/` directory completely
- [ ] Delete `src/lib/css-scoper.ts`
- [ ] Delete `src/lib/mapping-dsl.ts`
- [ ] Delete `src/lib/component-renderer.tsx`
- [ ] Delete `src/app/api/skins/` directory
- [ ] **Remove/migrate** `src/app/api/overrides/[skinId]/[restaurantId]/route.ts` (uses skinId)
- [ ] **Update** `src/app/page.tsx` to remove MoveableEditor and /api/skins/ CSS links
- [ ] **Remove skin scripts** from `package.json`: `skins:*`, `tokens:*`, `convert`, scoping hooks
- [ ] **Drop** `@/skins/*` alias in `tsconfig.json`
- [ ] Remove all YAML/JSONPath skin mapping files
- [ ] Remove CSS scoping build hooks
- [ ] Test: No references to skins remain (`rg "skins/|api/overrides/|/api/skins/"`)
- [ ] Test: `/restaurant/abu_al_khair_63191?template=bistly` works
- [ ] Test: `npm run build` succeeds

**Remove (right now)**

* `skins/` directory (all)
* `src/lib/css-scoper.ts`
* `src/lib/mapping-dsl.ts`
* `src/lib/component-renderer.tsx` (if only used by skins)
* `src/app/api/skins/*` routes
* Any YAML/JSONPath skin mapping files
* Any CSS scoping build hooks

**Verification**

```bash
# Ensure no references to skins remain:
rg "skins/|css-scoper|mapping-dsl|component-renderer|map\.yml" -n src app || echo "OK"
npm run dev
open "http://localhost:3000/restaurant/abu_al_khair_63191?template=bistly"
npm run build
```

---

# Phase 3 — Minimal Editor (Outline + Patch Panel); remove Moveable editor

### Agent Prompt — “Add block-level editing; remove freeform Moveable editor”

**What we want:** Safe, predictable editing: inline text, image swap, variant toggle, spacing steps. Add an Outline and Patch Panel. **Delete** Moveable-based editor.

**Create**

* `src/editor/registry.ts` — runtime registry of blocks + editable fields (text/image/select/space).
* `src/editor/Outline.tsx` — reads `[data-block]` nodes and builds a list/tree.
* `src/editor/PatchPanel.tsx` — controls based on `registry` fields.
* `src/editor/useEditableText.ts` — small hook enabling `contenteditable` on text nodes while debouncing updates.
* `src/lib/image.ts` — URL setter + (optional) simple uploader.

### **Task Checklist**
- [ ] Create `src/editor/registry.ts` with block registry
- [ ] Create `src/editor/Outline.tsx` for block tree
- [ ] Create `src/editor/PatchPanel.tsx` for controls
- [ ] Create `src/editor/useEditableText.ts` hook
- [ ] Create `src/lib/image.ts` for image handling
- [ ] Modify `templates/bistly/Template.tsx` to register fields
- [ ] Modify `src/app/layout.tsx` to mount editor UI
- [ ] Delete `src/dev/editor/MoveableEditor.tsx`
- [ ] Delete `src/dev/editor/ElementInspector.tsx`
- [ ] Delete `src/dev/editor/style-applier.ts`
- [ ] **Delete** `src/dev/editor/index.ts` (if only re-exports MoveableEditor)
- [ ] **Consider removing** `src/dev/editor/SimpleEditor.tsx` (if unused)
- [ ] Remove Moveable/Selecto from package.json (`npm rm moveable selecto`)
- [ ] Remove unused `/api/editor/*` routes (keep image upload if used)
- [ ] Test: Editor UI toggles with Alt+E
- [ ] Test: Can edit text, toggle variants, adjust spacing
- [ ] Test: `npm run type-check && npm run build` succeeds

**Modify**

* `templates/bistly/Template.tsx` — register fields per block (title text, hero variant, `--padY` spacing).
* `src/app/layout.tsx` — mount editor UI in dev only (Alt+E toggle is fine if trivial).

**Remove (right now)**

* `src/dev/editor/MoveableEditor.tsx`
* `src/dev/editor/ElementInspector.tsx`
* `src/dev/editor/style-applier.ts`
* Any Moveable/Selecto deps from `package.json` (`npm rm moveable selecto` etc.)
* `/api/editor/*` routes you no longer need (keep image upload if used)

**Verification**

```bash
npm rm moveable selecto || true
rg "Moveable|Selecto|EnhancedEditorComponent" -n src dev app || echo "OK"
npm run dev
# Browser: select hero → edit text → toggle variant → bump spacing
npm run type-check && npm run build
```

---

# Phase 4 — Scaffold command + convert 2 templates

### Agent Prompt — “Scaffold and convert two templates to package format”

**What we want:** A CLI to generate a new template folder, then convert **two** existing designs into packages and delete their legacy copies.

**Create**

* `tools/scaffold-template.ts` — creates `/templates/<id>/{Template.tsx,template.module.css,manifest.json,README.md}` with slot stubs.

### **Task Checklist**
- [ ] Create `tools/scaffold-template.ts` scaffolding script
- [ ] Convert `skins/shawarma-king/` to `templates/shawarma/`
- [ ] Convert `skins/simple-modern/` to `templates/simple/`
- [ ] Map restaurant data directly in React props
- [ ] Add sensible variants to converted templates
- [ ] Remove old template files from legacy locations
- [ ] Remove legacy mentions from docs
- [ ] Test: `npx tsx tools/scaffold-template.ts jacaranda` works
- [ ] Test: `npm run validate-template -- jacaranda` passes
- [ ] Test: `/restaurant/coffee_address_153199?template=shawarma` renders
- [ ] Test: No references to old template names remain

### **Parallel Execution Plan**
- **Subagent 1**: Create scaffolding tool + validate
- **Subagent 2**: Convert shawarma-king + simple-modern templates simultaneously

**Convert**

* Convert `shawarma-king` and `simple-modern` into packages: `/templates/shawarma/`, `/templates/simple/`
* Map restaurant data directly in React props; add sensible variants.

**Remove (right now)**

* Any old files for those two templates still lingering under `skins/` (already deleted), or elsewhere (docs/legacy mentions).

**Verification**

```bash
npx tsx tools/scaffold-template.ts jacaranda
npm run validate-template -- jacaranda
npm run dev
open "http://localhost:3000/restaurant/coffee_address_153199?template=shawarma"
rg "shawarma-king|simple-modern" -n || echo "OK"
```

---

# Phase 5 — Envato ingestion tool (HTML → blocks)

### Agent Prompt — “Add Envato HTML ingestion tool and ingest one theme”

**What we want:** A script that takes Envato HTML/CSS, slices into React blocks, prefixes classes (or uses CSS Modules), injects `data-block`, and emits a valid Template Package.

**Create**

* `tools/ingest-envato.ts`:

  * Inputs: `/imports/envato/<theme>/{index.html,assets/*}`
  * Outputs: `/templates/<theme>/Template.tsx`, `template.module.css`, `manifest.json`
  * Heuristics: find `header/hero/section/footer`, create slots, replace text/images with props.

### **Task Checklist**
- [ ] Create `tools/ingest-envato.ts` ingestion script
- [ ] Test script with HTML/CSS inputs parsing
- [ ] Implement heuristics for header/hero/section/footer detection
- [ ] Generate React blocks with proper `data-block` attributes
- [ ] Replace text/images with restaurant data props
- [ ] Ingest one Envato theme into `/templates/envato-one/`
- [ ] Validate generated template structure
- [ ] Clean up temporary import files (optional)
- [ ] Test: `npx tsx tools/ingest-envato.ts imports/envato/theme-a` works
- [ ] Test: `npm run validate-template -- envato-one` passes
- [ ] Test: `/restaurant/abu_al_khair_63191?template=envato-one` renders

**Run**

* Ingest **one** Envato theme into `/templates/envato-one/`.

**Remove (right now)**

* Temporary `/imports/envato/<theme>/` raw dump after success (optional keep).

**Verification**

```bash
npx tsx tools/ingest-envato.ts imports/envato/theme-a
npm run validate-template -- envato-one
npm run dev
open "http://localhost:3000/restaurant/abu_al_khair_63191?template=envato-one"
```

---

# Phase 6 — Convert the rest; reach 10–15 templates

### Agent Prompt — “Batch convert all remaining templates to packages and purge legacy mentions”

**What we want:** Finish conversions so we have **10–15** packages total, each with: slots, at least 1 variant in hero, image swap in gallery, spacing controls.

**Do**

* Convert remaining 6 legacy designs → `/templates/*/`.
* Each template must:

  * expose all 7 slots,
  * have `data-block` tags,
  * wire at least: one text field, one image field, one select variant, one spacing control.

### **Task Checklist**
- [ ] Convert `skins/bistly-modern/` to `templates/bistly/`
- [ ] Convert `skins/cafert-modern/` to `templates/cafert/`  
- [ ] Convert `skins/conbiz-premium/` to `templates/conbiz/`
- [ ] Convert `skins/foodera-modern/` to `templates/foodera/`
- [ ] Convert `skins/mehu-fresh/` to `templates/mehu/`
- [ ] Convert `skins/quantum-nexus/` to `templates/quantum/`
- [ ] Ensure each template exposes all 7 slots
- [ ] Add `data-block` tags to all sections
- [ ] Wire text fields, image fields, variants, spacing controls
- [ ] Remove old docs referencing skins/YAML mapping
- [ ] Remove skin-only APIs and utilities
- [ ] Update README to remove legacy sections
- [ ] Test: Template count >= 10 (`ls -1 templates | wc -l`)
- [ ] Test: All templates validate (`for t in $(ls templates); do npm run validate-template -- $t; done`)
- [ ] Test: `npm run build` succeeds

### **Parallel Execution Plan**
- **Subagent 1**: Convert bistly-modern + cafert-modern
- **Subagent 2**: Convert conbiz-premium + foodera-modern
- **Subagent 3**: Convert mehu-fresh + quantum-nexus
- **Main Agent**: Coordinate, cleanup docs, run final validation

**Remove (right now)**

* Any docs, APIs, or utils that only referenced skins.
* Old README sections describing skins/YAML mapping.

**Verification**

```bash
# Count templates
ls -1 templates | wc -l   # expect >= 10
# Validate all
for t in $(ls templates); do npm run validate-template -- $t; done
npm run build
```

---

# Phase 7 — QA hardening & docs

### Agent Prompt — “QA checklist + concise docs”

**What we want:** Tighten mobile, performance, and write a 1-page migration doc for newcomers.

**Do**

* Add mobile checks at 768px for each package.
* Ensure `<2s` LCP on local (strip heavy webfonts; use `display=swap`).
* Write `docs/templates.md`: how to build/convert a template in 10 minutes.
* Add screenshots to `public/preview/<template>.png`

### **Task Checklist** 
- [ ] Add mobile responsiveness checks at 768px breakpoint
- [ ] Optimize web fonts with `display=swap`
- [ ] Strip heavy webfonts to improve LCP
- [ ] Ensure all templates load <2s locally
- [ ] Write `docs/templates.md` migration guide
- [ ] Create template screenshots in `public/preview/`
- [ ] Remove unused assets from `public/dev/`
- [ ] Remove dead CSS files
- [ ] **Purge** residual doc references to skins in `docs/ARCHITECTURE.md`
- [ ] Test: Mobile breakpoint works on all templates
- [ ] Test: Performance check with Lighthouse
- [ ] Test: No references to legacy systems remain (`rg "skins|map\.yml|css-scoper|Moveable|Selecto"`)
- [ ] Final verification: Repo is clean of legacy code

### **Parallel Execution Plan**
- **Subagent 1**: Mobile responsiveness + performance optimization
- **Subagent 2**: Documentation writing (`docs/templates.md` + ARCHITECTURE.md cleanup)  
- **Subagent 3**: Asset cleanup + screenshot generation

**Remove (right now)**

* Any unused assets in `public/dev/` and dead CSS.

**Verification**

```bash
npm run build
# spot-check performance in devtools Lighthouse (manual)
rg "skins|map\.yml|css-scoper|Moveable|Selecto" -n || echo "Repo clean"
```

---

## What we **keep** (because it serves the new plan)

* **Next.js App Router**: headless routing + API endpoints we still use (`/api/templates`, `/api/restaurants`).
* **`/api/restaurants`**: still handy to enumerate and load JSON data for previews.
* **The 10 core kit components**: they become the building blocks for packages.
* **TypeScript + Zod**: strict contracts make templates robust and agent-friendly.

## What we **remove** (because it doesn’t)

* **Skins directory + YAML mapping + JSONPath**: replaced by typed React props.
* **CSS scoping engine**: replaced by local CSS Modules.
* **Freeform Moveable/Selecto editor**: replaced by Outline + Patch Panel with safe controls.
* **Legacy skin API routes**: replaced by `/api/templates`.

---

## How you’ll run + inspect (every phase after Phase 2)

```bash
npm run dev
# visit one of:
open "http://localhost:3000/restaurant/abu_al_khair_63191?template=bistly"
open "http://localhost:3000/restaurant/coffee_address_153199?template=shawarma"
# Edit via the new Outline/Patch Panel, then save (as implemented)
```

When this is solid, we’ll hook into **v0** + **GitHub Actions** for deploys (next step after this migration).

If you want, I can also drop in:

* the `EditorRegistry` starter (20 lines),
* a minimal `Template.tsx` stub,
* and both `tools/*` scripts so you can paste them straight into Cursor/Claude Code.
