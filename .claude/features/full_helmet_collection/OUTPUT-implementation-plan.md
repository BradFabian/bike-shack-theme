# Implementation Plan: Custom Collection (Helmet Grid)

Generated: 2026-10-27
Feature spec: `.claude/features/full_helmet_collection/feature.md`
Branch: `feature/custom-collection-section`

## Summary

A new standalone section, **"Custom Collection"** (`sections/section-custom-collection.liquid`), that displays a collection as a helmet-style grid modelled on landonorris.com/on-track. Each card has a notched SVG frame and an oval hover reveal of the product's 2nd image. Desktop columns are staggered and drift with scroll. The section can be added to any page:
- On collection pages it uses the page's collection and Dawn's filters, sorting, and pagination, with `facets.js` unchanged.
- Elsewhere it uses a collection picker.

It must not share a page with Dawn's `main-collection-product-grid`, because both rely on the same fixed element IDs.

## Human-First Breakdown

### Admin Setup (human tasks in Shopify admin / theme editor)

#### Create a dark colour scheme

The section takes its background and text colours from a theme colour scheme, like every other Dawn section. The helmet look needs a dark scheme to exist so it can be selected in the section settings.

- [ ] Online Store → Themes → Customize (on the dev/unpublished theme) → Theme settings → Colors
- [ ] Add a new scheme: Background `#111214`, Text `#FFFFFF`, Solid button background `#D2FF00`, Solid button label `#111214`
- [ ] Note which scheme number it becomes (e.g. "Scheme 6") so you can select it in the section

#### Put the lifestyle image in position 2 for every product

The hover reveal always uses the product's 2nd image. If the 2nd image isn't the lifestyle shot, the wrong photo appears on hover.

- [ ] Products → open each product in the "Full" collection
- [ ] In Media, drag the lifestyle photo into the 2nd position (the 1st position stays the clean product shot)
- [ ] Products without a lifestyle photo can stay as they are: they'll only get the outline highlight

#### Confirm the source of star ratings

Stars are read from Shopify's standard `reviews.rating` and `reviews.rating_count` product metafields, which review apps fill automatically.

- [ ] Apps → check whether a review app is installed (Judge.me, Shopify Product Reviews, Okendo, …)
- [ ] Open one reviewed product → Metafields and check that "Product rating" / "Product rating count" have values
- [ ] If there's no review app, that's fine: stars stay hidden

#### Place the section (at launch, not during build)

The default "Product grid" and the new section can't live on the same page, because both rely on the same IDs that the filter script looks for.

- [ ] *(Optional, to affect "Full" only)* Theme editor → template dropdown → Collections → Create template → name it `full`, based on "Default collection"
- [ ] *(Optional)* Products → Collections → Full → Theme template → choose `full` → Save
- [ ] In the chosen collection template: remove **Product grid**, then click **Add section → Custom Collection**
- [ ] In the section settings, select the dark colour scheme

### Code Preparation (before any visitor touches the page)

1. A new section called "Custom Collection" is registered and shows up under "Add section" on every template.
2. The section works out which collection to show: the current page's collection if it's a collection page, otherwise the collection chosen in the picker.
3. The products are split into pages of 24 by default (a setting).
4. On collection pages only, Dawn's existing sort dropdown, filters, and product count are placed above the grid. Their markup and styling are unchanged.
5. The grid wrapper carries the same IDs that Dawn's filter script expects, so the filter script can refresh it.
6. Each product is rendered as one card. The whole card is one link to the product page.
7. Each card contains two frame outlines: a desktop shape and a mobile shape. Only one is visible at a time.
8. Each card contains the main product image, which is visible.
9. Each card contains the 2nd image, already loaded lazily but hidden: clipped down to a zero-size oval at the bottom edge.
10. Both images are clipped to the notched frame shape, so they never spill past the frame.
11. The notch area holds:
    - Row 1: the product name (cut off with "…" if too long) and the price in the accent colour, with the original price crossed out if on sale and a "Sold out" label if unavailable.
    - Row 2: stars + review count, only when a rating exists.
12. On desktop, columns 2 and 4 are pushed down by a fixed amount, and the grid has extra bottom space so nothing overlaps.
13. If there are no products, or no collection is chosen, a short hint appears in the theme editor and nothing appears on the live site.

### Live Behavior (when a user interacts)

1. The page loads, and the grid shows 2 cards per row on a phone, 3 on a tablet, 4 on desktop.
2. On desktop, the visitor scrolls, and the staggered columns drift up and down slightly relative to the others.
3. If the visitor has "reduce motion" turned on, the columns stay still.
4. The visitor moves the mouse onto a card, and the frame outline slowly changes from grey to the accent colour.
5. At the same time, the lifestyle image grows upward from the bottom as an oval until it fills the frame.
6. The visitor moves the mouse off the card, and the oval shrinks back down and the outline returns to grey.
7. A product with no 2nd image only changes its outline colour.
8. A keyboard user presses Tab onto a card, sees a focus outline, and gets the same reveal.
9. The visitor clicks (or taps on mobile) anywhere on a card, and the product page opens.
10. On a collection page, the visitor picks a filter or sort option, and a loading state shows over the grid.
11. The grid re-renders with the matching products, the product count updates, and the URL updates.
12. The hover reveal and scroll movement keep working on the refreshed cards.
13. If a filter returns no products, an empty message shows with a link to clear the filters.
14. The visitor clicks a page number at the bottom, and the next page of products loads.

## Files

### New Files

- `sections/section-custom-collection.liquid` — choosing the collection, pagination, facets integration, grid markup, dynamic styles, schema + preset
- `snippets/card-helmet.liquid` — one helmet card: link, SVG frames, images, info notch (name, price, sold out, rating)
- `assets/section-custom-collection.css` — grid, stagger, frame, notch, reveal transition, focus, reduced motion
- `assets/custom-collection.js` — `<helmet-grid-parallax>` web component: desktop-only scroll drift for staggered columns

### Modified Files

- `locales/en.default.json` — new `sections.custom_collection.*` storefront strings (editor hints)
- `locales/en.default.schema.json` — new `sections.custom_collection.*` schema labels

No templates, no Dawn core JS/CSS, and no existing snippets are modified.

### Theme Components Reused

- `snippets/facets.liquid` + `assets/facets.js` + `assets/component-facets.css` — filters and sorting, unchanged
- `snippets/pagination.liquid` + `component-pagination.css` (loaded by the snippet) — page links
- `snippets/price.liquid` + `assets/component-price.css` — price, sale, and sold-out output (`show_badges`, `show_compare_at_price`)
- `assets/component-rating.css` — the `.rating` / `.rating-star` star rendering (same markup as `card-product.liquid`, lines 166–199)
- `snippets/loading-spinner.liquid` — inside the vertical sort form, same as Dawn's grid
- `assets/template-collection.css` — `.collection`, `.loading-overlay`, and the `.collection.loading` loading state that `facets.js` toggles
- Layout and colour classes: `.page-width`, `.color-{{ scheme }}`, `.gradient`, `.isolate`, `.visually-hidden`, `.title`, `.title-wrapper`, `.underlined-link`
- Global helper `throttle()` from `global.js` (or `requestAnimationFrame` batching)
- Existing translation keys: `products.product.sold_out`, `accessibility.star_reviews_info`, `accessibility.total_reviews`, `sections.collection_template.empty`, `sections.collection_template.use_fewer_filters_html`, `products.facets.*`, `t:sections.all.colors.label`, `t:sections.all.padding.*`, and the existing `t:sections.main-collection-product-grid.settings.*` labels for products-per-page and the filter settings

## Build Steps

### Step 1: Section skeleton + schema

**Do:** Create the section file with asset loading, the padding style block, an empty wrapper, and the full schema and preset. Create empty CSS and JS files. Add schema translation keys.
**Files:** `sections/section-custom-collection.liquid`, `assets/section-custom-collection.css`, `assets/custom-collection.js`, `locales/en.default.schema.json`
**Details:**
- Load in order:
  1. `section-custom-collection.css`, `component-price.css`, `component-rating.css`, `template-collection.css` via `stylesheet_tag`
  2. `<script src="{{ 'custom-collection.js' | asset_url }}" defer="defer"></script>`
- The padding style block uses the theme standard: `times: 0.75` on mobile, full value at `min-width: 750px`.
- Wrapper: `<div class="custom-collection color-{{ section.settings.color_scheme }} gradient section-{{ section.id }}-padding" style>…</div>` plus a `{%- style -%}` rule `.custom-collection-{{ section.id }} { --helmet-accent: {{ section.settings.accent_color }}; }`.
- Schema:
  - `"name": "t:sections.custom_collection.name"`, `"tag": "section"`, `"class": "section"`
  - `"disabled_on": { "groups": ["header","footer"] }`, with no `enabled_on` restriction
  - Settings, in order:
    - `collection` (collection)
    - `products_per_page` (range 4–24, step 4, default 24)
    - `color_scheme` (default `scheme-1`)
    - `accent_color` (color, default `#d2ff00`)
    - `show_rating` (checkbox, default true)
    - header "Filtering and sorting", then `enable_filtering` (checkbox, true), `filter_type` (select horizontal / vertical / drawer, default horizontal), `enable_sorting` (checkbox, true)
    - padding header, then `padding_top` / `padding_bottom` (0–100, step 4, default 36)
  - Preset: `[{ "name": "t:sections.custom_collection.presets.name" }]`
  - **Note:** Dawn's `products_per_page` range max is 24. The spec default of 24 fits.
- Reuse existing `t:` keys where they exist (colors, padding, products_per_page, filter labels). Add new keys only for: section name, collection label + info, accent colour label, show-rating label, preset name.
- JS file: guarded `customElements.define` stub only.

**Verify:** In the theme editor, "Custom Collection" appears under Add section on the homepage, a page, and a collection template. All settings show proper labels (no raw `t:` strings). There are no Liquid errors.

### Step 2: Choosing the collection + pagination

**Do:** Work out which collection to show, paginate it, and output a plain list of product titles as a placeholder.
**Files:** `sections/section-custom-collection.liquid`
**Details:**
- Resolve the collection:
  ```liquid
  {%- liquid
    assign is_collection_page = false
    if template.name == 'collection' and collection != blank
      assign is_collection_page = true
      assign helmet_collection = collection
    else
      assign helmet_collection = section.settings.collection
    endif
  -%}
  ```
  Don't reassign the global `collection` variable; use `helmet_collection`. Validate `template.name` with the Shopify Dev MCP or docs if it's unclear.
- `{%- paginate helmet_collection.products by section.settings.products_per_page -%}` … `{%- endpaginate -%}`.
- **Unverified:** that `paginate` on a picker collection works on non-collection templates (homepage). Test it explicitly. If it fails, fall back to rendering `helmet_collection.products | limit: products_per_page` without pagination off collection pages, and log the trade-off.
- Editor-only hints (`request.design_mode`):
  - No collection resolved → `sections.custom_collection.no_collection` ("Select a collection to display products.")
  - Collection with 0 products (and no active filters) → `sections.custom_collection.empty`
  - On the live storefront, render nothing in both cases.
- Add `{% render 'pagination', paginate: paginate, anchor: '' %}` when `paginate.pages > 1`.

**Verify:**
- On a collection template, the section lists that collection's titles.
- On the homepage with a picked collection, it lists the picker's titles.
- With products-per-page set to 4, page links appear and work.
- With no collection picked, the theme editor shows the hint and the live preview shows nothing.

### Step 3: Helmet card markup

**Do:** Build `card-helmet.liquid` and render it per product inside the grid list.
**Files:** `snippets/card-helmet.liquid`, `sections/section-custom-collection.liquid`
**Details:**
- Snippet params: `card_product`, `section_id`, `show_rating`, `lazy_load`. Add a doc comment at the top like the other Dawn snippets.
- Structure:
  ```
  <a class="helmet-card" href="{{ card_product.url }}">
    <div class="helmet-card__inner">                    ← stagger/parallax target
      <div class="helmet-card__frame helmet-card__frame--desktop" aria-hidden="true"> SVG outline 407×411 </div>
      <div class="helmet-card__frame helmet-card__frame--mobile"  aria-hidden="true"> SVG outline 187×188 </div>
      <div class="helmet-card__media">                  ← clipped to notched shape
        main image (product.featured_media)
        reveal image (product.media[1], only if it exists) with class helmet-card__reveal
      </div>
      <div class="helmet-card__info">
        <div class="helmet-card__row">
          <h3 class="helmet-card__title">{{ card_product.title | escape }}</h3>
          {% render 'price', product: card_product, show_badges: true, show_compare_at_price: true, price_class: 'helmet-card__price' %}
        </div>
        rating block (only if show_rating and reviews.rating.value != blank)
      </div>
    </div>
  </a>
  ```
- Frame SVGs: copy the path data from `reference/reference-site-element-code.md`:
  - Desktop base path from `svg-background.md`
  - Mobile path with viewBox `0 0 187 188`
  - Use `stroke="currentColor"`, `vector-effect="non-scaling-stroke"`, `preserveAspectRatio="none"` only if the aspect ratio is locked (see step 4)
- Images: `image_url: width: 1000 | image_tag` with `widths: '250, 375, 500, 750, 1000'` and `sizes: '(min-width: 990px) 25vw, (min-width: 750px) 33vw, 50vw'`.
  - Main image: `loading: 'lazy'` unless `lazy_load == false` (the first 4 cards are eager).
  - Reveal image: always lazy, with `alt: ''` (decorative; the link's name comes from the title).
- No featured image: `{{ 'product-apparel-1' | placeholder_svg_tag: 'placeholder-svg' }}`.
- Rating block: copy the markup from `card-product.liquid` lines 166–199 (the `.rating` / `.rating-star` CSS vars with the decimal rounding), but output only the stars + `rating-count` ("(12)" + visually-hidden "12 total reviews"). Leave out the "4.5 / 5" text.
- Section: `<ul id="product-grid" data-id="{{ section.id }}" class="helmet-grid" role="list">` with `<li class="helmet-grid__item">` per product. `lazy_load = forloop.index > 4`.
- **Do not** add Dawn's `scroll-trigger animate--slide-in` classes to the `li`. They would fight the stagger transforms. If an entrance animation is wanted, it goes on the `li` while stagger and parallax go on `.helmet-card__inner`.

**Verify:** Unstyled cards show: both images (the 2nd only when it exists), the title, the price with sale/sold-out state, and stars + count on a reviewed product. Clicking anywhere on a card opens the product page. The HTML has a single `<a>` per card with no nested links or buttons.

### Step 4: Grid, frame and notch styling (static, no hover)

**Do:** Style the grid and card to match `Desktop 1 - Grid.jpg` and `Mobile 1 - Two Column Layout.jpg`.
**Files:** `assets/section-custom-collection.css`
**Details:**
- `.helmet-grid`: CSS grid, `list-style: none; padding: 0; margin: 0`.
  - Columns: `repeat(2, 1fr)` by default; `repeat(3, 1fr)` at `min-width: 750px`; `repeat(4, 1fr)` at `min-width: 990px`.
  - Gap: use the theme vars (`var(--grid-mobile-horizontal-spacing)` / `var(--grid-desktop-horizontal-spacing)`) or a tighter value to match the reference (~1.6rem desktop). Decide visually and document it.
- Wrap the grid in `.page-width`, like Dawn's grid.
- `.helmet-card`: `display: block; color: rgb(var(--color-foreground)); text-decoration: none;`.
- `.helmet-card__inner`:
  - `position: relative; aspect-ratio: 407 / 411;`
  - Mobile: `aspect-ratio: 187 / 188`
- Frames: `position: absolute; inset: 0; color: rgba(var(--color-foreground), 0.35);`.
  - `--mobile` is shown below 750px and `--desktop` from 750px up (`display: none` toggling).
  - **Check against the reference:** the desktop notch shape is used for the tablet + desktop grid and the mobile shape for phones.
- `.helmet-card__media`:
  - `position: absolute; inset: 0;`, clipped to the notched shape (see step 5 for the clip definition; add it here so images never overflow even before hover).
  - Images: `object-fit: contain` for the main image (the helmets are cut-outs), `object-fit: cover` for the reveal image, both `width: 100%; height: 100%`.
  - The main image sits in the upper part of the frame, matching the reference (padding ~15%).
- `.helmet-card__info`:
  - `position: absolute; right: 0; bottom: 0;`, with a width matching the notch area (~45% desktop, ~70% mobile; tune to the reference).
  - `display: flex; flex-direction: column; align-items: flex-end;`
- `.helmet-card__row`: `display: flex; gap: 1.2rem; align-items: baseline; justify-content: flex-end;`.
- Title:
  - Font: `font-family: var(--font-heading-family)` or the body font, matching the reference weight; size `1.4rem` mobile, `1.6rem` desktop
  - Truncation: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;`
- Price: `color: var(--helmet-accent)`, scoped as `.helmet-card .price`. Override `component-price.css` colours only inside `.helmet-card`. The sale price is the accent colour; the compare-at price is a muted foreground with line-through. Restyle the badge to a small outlined label.
- Rating: scope the star colour to `var(--helmet-accent)` via `.helmet-card .rating-star { --color-rating-star: … }` (check `component-rating.css` for the exact var name before writing).

**Verify:**
- The desktop layout matches Desktop 1 (4 columns, notched frames, name + price bottom-right, price in lime) on a dark colour scheme.
- Mobile matches Mobile 1.
- At tablet width (800px) there are 3 columns.
- Long names are truncated, and nothing overflows the frame.

### Step 5: Hover / focus reveal + outline highlight

**Do:** Add the oval reveal and the outline colour transition, both reversible, plus focus and reduced-motion handling.
**Files:** `snippets/card-helmet.liquid`, `assets/section-custom-collection.css`
**Details:**
- **Clipping to the notched shape:** convert the reference paths to `objectBoundingBox` units: divide every x by 407 (or 187) and every y by 411 (or 188). Output one inline hidden `<svg width="0" height="0" aria-hidden="true"><defs><clipPath id="helmet-clip-desktop-{{ section.id }}" clipPathUnits="objectBoundingBox">…</clipPath>…mobile…</defs></svg>` **once per section**, not per card, and apply `clip-path: url(#helmet-clip-desktop-{{ section.id }})` through the section's `{%- style -%}` block. This works because `.helmet-card__inner` has a fixed aspect ratio. Corner curves would distort if the ratio changed.
  - **Alternative**, if `url()` clip references prove flaky in Safari: a CSS `mask-image` using the SVG as a data URI. Test Safari early.
- **Oval reveal:** the reveal image has `clip-path: ellipse(0% 0% at 50% 100%)`. On hover it becomes `ellipse(150% 150% at 50% 100%)`, with `transition: clip-path 0.8s cubic-bezier(0.65, 0, 0.35, 1)`. Matching shape functions (ellipse → ellipse) are needed for clip-path to interpolate. The reveal image sits inside `.helmet-card__media`, so it's also clipped by the outer notch shape.
- **Outline:** `.helmet-card__frame { transition: color 0.4s ease; }`, with `.helmet-card:hover .helmet-card__frame, .helmet-card:focus-visible .helmet-card__frame { color: var(--helmet-accent); }`.
- **Triggers:** `.helmet-card:hover`, `.helmet-card:focus-visible`, wrapped in `@media (hover: hover)` for hover so touch devices don't get a "sticky" hover on tap. Keep `:focus-visible` outside that media query.
- **Focus:** `.helmet-card:focus-visible { outline: none; }`. Use the frame colour change + a `box-shadow`-free approach. The accent outline is the focus indicator; confirm its contrast is ≥3:1 against the dark background (lime on `#111214` passes).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce) { .helmet-card__reveal, .helmet-card__frame { transition: none; } }`.
- **No 2nd image:** the reveal element isn't rendered, so only the outline changes.

**Verify:**
- Hover matches Desktop 2 (lime outline), Desktop 4 (mid-reveal oval), and Desktop 3/5 (fully revealed, clipped to the notch shape).
- Mouse-out reverses smoothly.
- Tab focus triggers the same.
- With reduced motion enabled in OS settings, the swap is instant.
- Tested in Chrome, Safari, and Firefox.

### Step 6: Static desktop stagger

**Do:** Push columns 2 and 4 down on desktop only.
**Files:** `assets/section-custom-collection.css`
**Details:**
- At `min-width: 990px`: `.helmet-grid__item:nth-child(4n+2) .helmet-card__inner, .helmet-grid__item:nth-child(4n+4) .helmet-card__inner { --helmet-stagger: 35%; }`. The ~35% of card height matches the reference offset; tune visually.
- `.helmet-card__inner { transform: translateY(calc(var(--helmet-stagger, 0px) + var(--helmet-parallax, 0px))); }`. Note that a percentage in `translateY` is relative to the element's own height, which is what we want.
- Add `padding-bottom` to `.helmet-grid` at ≥990px equal to the stagger amount, so the last row doesn't overlap the pagination.
- Below 990px: no stagger (the variable isn't set).

**Verify:**
- The desktop stagger matches Desktop 1.
- With 12 products (3 full rows) and with an odd count (e.g. 10), the stagger looks intentional and nothing overlaps the pagination.
- Tablet and mobile grids are even.

### Step 7: Scroll parallax web component

**Do:** Add subtle scroll-linked drift to the staggered columns.
**Files:** `assets/custom-collection.js`, `sections/section-custom-collection.liquid`
**Details:**
- Wrap the `<ul id="product-grid">` in `<helmet-grid-parallax>` **inside** `#ProductGridContainer`. `facets.js` replaces that container's `innerHTML`, so the element is re-created → `connectedCallback` runs again on the new grid, and `disconnectedCallback` cleans up the old one.
- Component outline:
  ```js
  if (!customElements.get('helmet-grid-parallax')) {
    customElements.define('helmet-grid-parallax', class HelmetGridParallax extends HTMLElement {
      connectedCallback() {
        this.desktopQuery = window.matchMedia('(min-width: 990px) and (prefers-reduced-motion: no-preference)');
        this.onScroll = this.onScroll.bind(this);
        this.onQueryChange = this.onQueryChange.bind(this);
        this.observer = new IntersectionObserver(…toggle this.isVisible…);
        this.observer.observe(this);
        this.desktopQuery.addEventListener('change', this.onQueryChange);
        this.onQueryChange();
      }
      disconnectedCallback() { /* remove scroll listener, disconnect observer, remove query listener */ }
      onQueryChange() { /* add or remove passive scroll listener; reset --helmet-parallax to 0 when disabled */ }
      onScroll() { /* requestAnimationFrame-batched: compute progress of this element through viewport (-1..1), set --helmet-parallax on staggered items' .helmet-card__inner */ }
    });
  }
  ```
- Drift range: about ±4rem. Only the staggered items (`:nth-child(4n+2)`, `:nth-child(4n+4)`) move, which matches the reference, where only alternate columns translate.
- Use `{ passive: true }` on the scroll listener. Do one `requestAnimationFrame` per frame (a `ticking` flag). Write only CSS custom properties (no layout reads inside the loop beyond one `getBoundingClientRect()` of the host).
- No globals. No dependency on `global.js` except optional `throttle`.

**Verify:**
- On desktop, scrolling moves columns 2 and 4 slightly; the movement is smooth, with no jank in the DevTools Performance panel.
- Resizing to below 990px stops the movement and resets the positions.
- With OS reduced motion on, there's no movement.
- After applying a filter, the parallax still works and there are no duplicate listeners: check `getEventListeners(window)` in the Chrome console before and after filtering.

### Step 8: Filters, sorting, and product count (collection pages only)

**Do:** Integrate Dawn's facets exactly as `main-collection-product-grid.liquid` does, gated to collection pages.
**Files:** `sections/section-custom-collection.liquid`
**Details:**
- Only when `is_collection_page` is true and (`enable_filtering` or `enable_sorting`):
  - Load `component-facets.css` (`stylesheet_tag`) and `<script src="{{ 'facets.js' | asset_url }}" defer="defer"></script>`.
  - If `enable_sorting` and `filter_type == 'vertical'`: copy the `<facet-filters-form class="facets facets-vertical-sort …">` block (lines 32–91 of `main-collection-product-grid.liquid`) with the `#FacetSortForm`, `#SortBy`, and `#ProductCountDesktop` markup.
  - Wrapper `<div class="{% if filter_type == 'vertical' %} facets-vertical page-width{% endif %}">`.
  - `<aside id="main-collection-filters" data-id="{{ section.id }}" class="facets-wrapper …">{% render 'facets', results: helmet_collection, enable_filtering: …, enable_sorting: …, filter_type: …, paginate: paginate %}</aside>`.
- Required for `facets.js` (keep exactly):
  - `<div id="ProductGridContainer" class="product-grid-container">`
  - Inside it, `<div class="collection …">` with `<div class="loading-overlay gradient"></div>`
  - Inside that, `<ul id="product-grid" data-id="{{ section.id }}">`
  - The empty state uses the `.collection.collection--empty` + `#product-grid` structure (lines 120–133).
- On non-collection pages: keep the `#ProductGridContainer` / `#product-grid` IDs off. Use classes only, so that a picker-based section on the homepage can't collide with anything.
- **Vertical layout check:** with `filter_type == 'vertical'`, Dawn puts the filters in a sidebar and the grid takes the remaining width. Check that the 4-column helmet grid still looks right in the narrower area. If not, drop to 3 columns at ≥990px when vertical (a modifier class `helmet-grid--with-sidebar`).

**Verify:**
- On a collection page, apply a filter: the grid updates without a reload, the product count updates, and the URL gets filter params.
- Sorting works.
- Clearing a filter works.
- Horizontal, vertical, and drawer layouts all render, and the mobile filter drawer opens.
- No console errors.
- On the homepage (picker), no filter UI appears and there are no console errors from `facets.js`, because it isn't loaded.

### Step 9: Empty and edge states

**Do:** Finish all empty and edge states from the spec.
**Files:** `sections/section-custom-collection.liquid`, `snippets/card-helmet.liquid`, `locales/en.default.json`
**Details:**
- Filters with 0 results: Dawn's `sections.collection_template.empty` + `use_fewer_filters_html` (link to `helmet_collection.url`).
- Collection empty with no filters active / no collection picked: an editor-only hint, nothing on the live site.
- Product without a featured image: placeholder SVG.
- Product with 1 image: no reveal element.
- Product without a rating, or `rating_count` 0: no rating row.
- Sold out: the price snippet badge, styled.
- Add `sections.custom_collection.no_collection` and `sections.custom_collection.empty` to `en.default.json`.

**Verify:** Each state renders as described (see the QA file). There are no Liquid errors in the theme editor.

### Step 10: Translations, performance, and accessibility pass

**Do:** Final review against the project rules.
**Files:** all new files, plus both locale files
**Details:**
- Grep the new files for any hardcoded English text and move it into locales.
- Images: main images for the first 4 cards are eager (not lazy); everything else is lazy; `sizes` matches the real column widths.
- Accessibility:
  - Each card is one link with the product title as its text.
  - The SVG frames are `aria-hidden="true"`.
  - The reveal image has `alt=""`.
  - The rating has `role="img"` + `aria-label`.
  - The focus indicator is visible.
  - The grid is `role="list"`.
- Run Shopify Theme Check (`shopify theme check`), if available, on the new files.
- Remove any `console.log`s.

**Verify:** Theme Check is clean for the new files, and the QA checklist is ready to run.

## Risks & Considerations

- **Fixed facets IDs:** `facets.js` hardcodes `#ProductGridContainer`, `#product-grid`, `#ProductCount`, and `#FacetFiltersFormMobile`. Only one grid using them can exist per page, and Liquid sections can't detect each other, so this is a **documented rule** that can't be enforced. If both grids end up on one page, filters will silently update the wrong grid.
- **Clip-path in Safari:** SVG `clipPath` with `objectBoundingBox`, plus CSS `clip-path: ellipse()` transitions, is supported in current Safari, but nested clipping has had rendering bugs historically. Test Safari at step 5, before building further. The fallback is `mask-image`.
- **Aspect ratio lock:** the notch shape depends on a fixed card aspect ratio (407:411 desktop, 187:188 mobile). Product images with very different ratios are letterboxed inside it (`contain`) rather than changing the card shape.
- **Dawn scroll animations:** "Reveal sections on scroll" is enabled in theme settings. Its transforms are kept off the elements we transform (stagger and parallax live on `.helmet-card__inner`) to avoid conflicts.
- **Unverified Shopify behaviour:** `paginate` on a picker collection on non-collection templates (step 2) and `template.name == 'collection'` detection. Test early; fallbacks are noted in step 2. The Shopify Dev MCP isn't connected yet; connecting it would let us validate these against the docs.
- **Price snippet styling:** `price.liquid` outputs Dawn's badge and price markup, styled by `component-price.css`. Our overrides must be scoped under `.helmet-card` so other grids aren't affected.
- **Parallax performance:** the scroll handler only runs on desktop, only while the grid is on screen, is batched with rAF, and writes only CSS custom properties.
- **Dark scheme dependency:** the section only looks right once a dark colour scheme exists and is selected (admin task).

## Open Questions

- Which review app (if any) populates `reviews.rating`. Can be confirmed during QA.
