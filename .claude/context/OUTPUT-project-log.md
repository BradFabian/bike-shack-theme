# Project Log — Bike Shack (JS Mastery / Dawn fork)

## 2026-10-14 — Theme onboarding

**Done:** Ran `/onboard-theme` and wrote `OUTPUT-initial-theme-analysis.md`. No code changed.

**Key conventions established:**
- Build to **stock Dawn patterns**, not the existing custom sections, which are unfinished course exercises.
- The section padding mobile multiplier is **0.75** (theme standard), not the 0.5 shown in the CLAUDE.md example.
- Use `PUB_SUB_EVENTS.variantChange` for variant changes. `afterVariantChange` is never dispatched.
- Use the guarded form `customElements.define`, `defer` scripts, and `color_scheme` default `scheme-1`.

**Risks / open questions:**
- The current branch `feature/product-quiz` has a working-but-prototype quiz: hardcoded text, global JS, `alert()`s, and `all_products` lookups. It needs scoping and planning before further build-out. There's no feature folder for it yet.
- `main-product.liquid` is duplicated in two alternate product sections (about 2.3k lines each). Product-page changes must be made three times, or the copies consolidated.
- Debug code in `layout/theme.liquid:353-362` and `console.log`s across the custom JS. Clean up with approval.
- Flickity is loaded render-blocking in the testimonials slider.
- No `.claude/context/reference/` folder yet, so there's no visual or brand reference.

## 2026-10-27 — Scoped: Custom Collection (helmet grid)

**Feature:** `.claude/features/full_helmet_collection/`, on branch `feature/custom-collection-section`. A new standalone "Custom Collection" section copying the landonorris.com helmet grid: notched SVG frame, oval hover reveal of the 2nd image, staggered desktop columns with parallax.

**Key decisions:**
- Custom section rather than editing `main-collection-product-grid` / `card-product` (keeps Dawn core untouched).
- Full filters and sorting through the Dawn `facets` snippet. `facets.js` is reused unchanged by matching its fixed IDs (`#product-grid[data-id]`, `#ProductGridContainer`, `#ProductCount`).
- The section can be added anywhere. It uses the page's collection on collection pages and a collection picker elsewhere, where filters are hidden.

**Risk:** because the filter IDs are fixed, the section can't share a page with the default product grid or with a second copy of itself.

**Open:** which review app the store uses (needed for ratings); placement and an alternate template for "Full" are decided at launch.

## 2026-10-27 — Planned: Custom Collection

The implementation plan and the Round 1 QA checklist are written. There are 10 build steps.

**Design choices worth remembering:**
- Stagger and parallax transforms go on `.helmet-card__inner`, never on the `li`, to avoid fighting Dawn's `scroll-trigger` animations.
- The notch clip uses an `objectBoundingBox` SVG clipPath, and the card aspect ratio is locked.
- The parallax component lives inside `#ProductGridContainer`, so it re-initialises when `facets.js` re-renders the grid.

**To verify early:** `paginate` on a picker collection outside collection templates, and Safari clip-path rendering.
