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

## 2026-10-28 — Built: Custom Collection (awaiting QA)

**New files:**
- `sections/section-custom-collection.liquid`
- `snippets/card-helmet.liquid`
- `assets/section-custom-collection.css`
- `assets/custom-collection.js`

**Locales:** added `sections.custom_collection.*` to `en.default.json` and `en.default.schema.json`. Other labels reuse the existing `main-collection-product-grid` keys.

**Decisions:**
- The rating row hangs below the card because the notch only fits one row.
- The facet IDs are only output on collection pages.

**Not yet rendered:** there's no Shopify CLI locally, so QA needs `shopify theme dev` or an unpublished theme.

## 2026-11-03 — Custom Collection: products per page default

Changed the `products_per_page` default from 24 to 8, at the user's request. This supersedes the "24 per page" decision in `feature.md`. It's still a client-editable setting (4–24).

**Watch:** a section already saved in the theme editor keeps its stored value, so it won't pick up the new default.

## 2026-11-03 — Custom Collection: QA Round 1 fixes

**Done:** The hover reveal now runs top to bottom, with slower, layered motion. The name and price were reworked to fit. Round 2 of QA is ready.

**Decisions:**
- **Card price skips the `price` snippet.** The currency code is a global setting that's on, and turning it off would change the whole site. Alternative rejected: editing the shared snippet.
- **Whole prices drop ".00"**, to save space in the notch.
- **The notch is wider than the reference** (about 57% of the card on desktop instead of 35%), because product names are longer than the reference's. Accepted departure from the reference shape, pending the user's review in Round 2.

**Watch:**
- With no currency code on cards, a store selling in several currencies shows only the symbol there (e.g. "$" for both USD and CAD).
- Very long names still truncate, especially on mobile and at 990px.

