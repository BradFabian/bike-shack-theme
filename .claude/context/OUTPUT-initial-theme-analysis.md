# Theme Analysis — JS Mastery (Dawn fork) / Bike Shack

Generated: 2026-10-14

## Summary

"JS Mastery" v1.2.0 (`theme_author: "Dawn x Coding with Jan"`), a fork of Shopify's Dawn theme used as a JavaScript course sandbox for the Bike Shack store. The stock Dawn files are untouched and consistent. On top of them sit about a dozen custom sections, assets, and templates (quiz, product compare, countdown, testimonials slider, tracking video, availability status, custom contact form). Several of these are **unfinished exercise scaffolds**: stubbed JS, hardcoded test content, and logging. Treat the stock Dawn code as the convention source, not the custom files.

Global settings in use (`config/settings_data.json`): `page_width: 1600`, `spacing_sections: 52`, `spacing_grid_horizontal/vertical: 40`, `cart_type: "drawer"`, `animations_reveal_on_scroll: true`, heading font Oswald (`oswald_n5`, scale 140), body font Avenir Next (`avenir_next_n5`, scale 100).

## File Structure Overview

| Folder | Count | Notes |
| --- | --- | --- |
| `sections/` | 64 `.liquid` + `header-group.json`, `footer-group.json` | |
| `snippets/` | 74 (39 `icon-*`, 35 others) | |
| `templates/` | 20 + 7 in `customers/` | All JSON except `gift_card.liquid` |
| `assets/` | 116 | ~55 CSS, ~45 JS, 5 images |
| `locales/` | 51 | Full Dawn translations + `.schema.json` files |
| `layout/` | `theme.liquid`, `password.liquid` | |
| `blocks/` | — | Doesn't exist (no theme blocks, classic section blocks only) |

**Custom / non-stock files**

| Type | Files |
| --- | --- |
| Sections | `main-quiz`, `product-compare`, `compare-product-card`, `countdown`, `custom-testimonials-slider`, `custom-tracking-video`, `contact-custom-form`, `main-product-availability-status`, `main-product-meta-information`, `test-section` |
| Assets – JS | `quiz.js`, `product-compare-view.js`, `countdown.js`, `custom-testimonials-slider.js`, `custom-tracking-video.js`, `contact-form-custom.js`, `availability-status-element.js`, `flickity.pkgd.min.js` |
| Assets – CSS | `section-quiz.css`, `section-product-compare-view.css`, `component-countdown.css`, `custom-testimonials-slider.css`, `component-availability-status-element.css`, `component-visual-display.css`, `mask-blobs.css`, `flickity.css` |
| Assets – images | `quiz-bike.jpg`, `quiz-equipment.jpg`, `quiz-mountain.jpg`, `quiz-track.jpg` (~2.7 MB total), `sparkle.gif` |
| Snippets | `availability-status-element`, `visual-display`, `mask-arch` |
| Templates | `page.product-quiz`, `page.product-comparison`, `page.contact-custom`, `page.ajax-upsell`, `page.about`, `product.availability-status`, `product.meta-information` |
| Layout edit | `theme.liquid:353-362`, a debug `afterVariantChange` listener on product pages |

## CSS Conventions

### Grid System

A flexbox grid in `base.css` (`/* component-grid */`, around line 890):

```css
.grid        { display: flex; flex-wrap: wrap; column-gap: var(--grid-mobile-horizontal-spacing); row-gap: var(--grid-mobile-vertical-spacing); }
.grid__item  { width: calc(25% - var(--grid-mobile-horizontal-spacing) * 3 / 4); max-width: calc(50% - …); flex-grow: 1; }
```

Column modifiers go on the `.grid` parent and are applied through the section settings:

- `grid--1-col`, `grid--2-col`, `grid--3-col`
- `grid--2-col-tablet`, `grid--3-col-tablet`, `grid--4-col-tablet` (≥750px)
- `grid--1-col-tablet-down` (≤989px)
- `grid--{n}-col-desktop` (≥990px)
- `grid--gapless`, `grid--peek` (mobile slider peek)

Example from multicolumn: `class="grid grid--{{ section.settings.columns_mobile }}-col-tablet-down grid--{{ section.settings.columns_desktop }}-col-desktop"`.

The gaps come from global settings: `--grid-desktop-horizontal-spacing` / `--grid-desktop-vertical-spacing` (40px), and the mobile versions are half that.

### Breakpoints

Ranked by usage across all CSS:

| Breakpoint | Uses | Role |
| --- | --- | --- |
| `min-width: 750px` | ~180 | **Primary**: mobile → tablet/desktop |
| `max-width: 749px` | ~66 | Mobile only |
| `min-width: 990px` | ~57 | Desktop |
| `max-width: 989px` | 21 | Tablet and below |
| `min-width: 750px and max-width: 989px` | 10 | Tablet only |
| `1200px`, `1400px`, `900px` | 1 each | Rare one-offs |

Accessibility queries are also used: `forced-colors: active`, `prefers-reduced-motion`.

**Use 750 / 990.** The custom `section-quiz.css` uses `max-width: 750px` (off by one compared with the theme's 749px).

### Color Variables

Each color scheme is generated in `theme.liquid` as `.color-scheme-N { … }`. The first scheme also applies to `:root`. The values are **raw RGB triplets**, so wrap them in `rgb()` / `rgba()`:

| Variable | Source |
| --- | --- |
| `--color-background` | scheme background |
| `--gradient-background` | scheme gradient, falls back to background |
| `--color-foreground` | scheme text |
| `--color-background-contrast` | computed |
| `--color-button`, `--color-button-text` | primary button |
| `--color-secondary-button`, `--color-secondary-button-text` | secondary button |
| `--color-link` | = secondary button label |
| `--color-shadow` | shadow |
| `--color-badge-foreground`, `-background`, `-border` | badges |

Usage: `color: rgb(var(--color-foreground));` and `background: rgba(var(--color-foreground), 0.04);`.

Base alpha tokens in `base.css :root`: `--alpha-button-background`, `--alpha-button-border`, `--alpha-link: 0.85`, `--alpha-badge-border: 0.1`.

The schemes in use are `scheme-1` through `scheme-5`.

Other global tokens (from `theme.liquid :root`):

| Category | Variables |
| --- | --- |
| Fonts | `--font-body-family/style/weight/weight-bold`, `--font-heading-family/style/weight`, `--font-body-scale`, `--font-heading-scale` |
| Layout | `--page-width` (160rem), `--page-width-margin`, `--spacing-sections-desktop/-mobile` |
| Component styling | `--buttons-*`, `--inputs-*`, `--variant-pills-*`, `--media-*`, `--product-card-*`, `--collection-card-*`, `--blog-card-*`, `--text-boxes-*`, `--popup-*`, `--drawer-*`, `--badge-corner-radius` |

The base font size is `html { font-size: calc(var(--font-body-scale) * 62.5%) }`, so **1rem ≈ 10px**. Dawn sizes everything in rem on that basis.

### Naming Convention

Dawn uses BEM-ish naming: `block__element--modifier`, with file prefixes that group the CSS.

- Elements: `multicolumn-card__image-wrapper`, `rich-text__blocks`, `title-wrapper-with-link`
- Modifiers: `multicolumn-card__image-wrapper--half-width`, `button--secondary`, `page-width--narrow`, `content-container--full-width`
- CSS file prefixes:
  - `section-*.css`: section-specific styles (`section-rich-text.css`)
  - `component-*.css`: reusable UI (`component-card.css`, `component-slider.css`)
  - `template-*.css`: template-level styles
- Utilities: `hidden`, `visually-hidden`, `isolate`, `center`, `small-hide`, `medium-hide`, `large-up-hide`, `list-unstyled`, `rte`, `inline-richtext`
- Typography classes: `h0`, `h1`, `h2`, `hxl`, `subtitle`, `caption-with-letter-spacing`, `caption-large`
- Animation classes: `scroll-trigger animate--slide-in` with `data-cascade` and `style="--animation-order: N;"`

The custom files don't follow this consistently. `section-quiz.css` styles IDs and bare elements (`.quiz h2`, `#nav-buttons`, `.label-container`). `test-section.liquid` uses `cusotm-heading` (typo).

### Spacing Patterns

- **Between sections:** `.section + .section { margin-top: var(--spacing-sections-mobile/desktop) }`. This only applies when the schema has `"class": "section"`.
- **Inside a section:** per-section padding with the `section-{{ section.id }}-padding` pattern (see Liquid Conventions).
- **Inside grids:** the `--grid-*-spacing` variables.
- **No spacing utility scale.** Values are written by hand in rem (`margin-bottom: 2rem`, `.element-margin-top { margin-top: 5rem }`).

### Page Width / Containers

```css
.page-width          { max-width: var(--page-width) /* 160rem = 1600px */; margin: 0 auto; padding: 0 1.5rem; }
@media (min-width: 750px) { .page-width { padding: 0 5rem; } }

.page-width--narrow  { /* ≥750: padding 0 9rem; ≥990: max-width 72.6rem; padding 0 */ }
.page-width-desktop  { /* full-bleed until 990px, then constrained */ }
.page-width-tablet   { /* padding 0 5rem at ≥750 */ }
.rte-width           { max-width: 82rem; }
```

Supporting classes:

- `.isolate { position: relative; z-index: 0 }` wraps sections that use gradient backgrounds.
- `.content-container` adds text-box border, shadow, and radius from the global settings.
- `.global-media-settings` adds the media border, shadow, and radius.

## JavaScript Conventions

### Base Files (do not modify)

| File | Purpose |
| --- | --- |
| `constants.js` | `ON_CHANGE_DEBOUNCE_TIMER = 300`; `PUB_SUB_EVENTS` = `{ cartUpdate: 'cart-update', quantityUpdate: 'quantity-update', variantChange: 'variant-change', cartError: 'cart-error' }` |
| `pubsub.js` | Global `subscribe(eventName, cb)` (returns an unsubscribe function) and `publish(eventName, data)` |
| `global.js` | Helpers: `getFocusableElements`, `trapFocus`, `removeTrapFocus`, `onKeyUpEscape`, `pauseAllMedia`, `debounce`, `throttle`, `fetchConfig(type)`. Core components (listed below). |
| `animations.js` | Scroll-reveal (`scroll-trigger`). Only loaded when `animations_reveal_on_scroll` is on. |
| `cart.js`, `cart-drawer.js`, `cart-notification.js` | Cart system |
| `product-form.js`, `product-info.js`, `media-gallery.js` | Product page |
| `facets.js`, `predictive-search.js`, `search-form.js`, `main-search.js` | Collection filtering and search |
| `details-disclosure.js`, `details-modal.js` | Disclosure and modal bases |
| `quick-add.js`, `quick-order-list.js`, `quantity-popover.js`, `price-per-item.js`, `recipient-form.js`, `pickup-availability.js`, `localization-form.js`, `share.js`, `show-more.js`, `magnify.js`, `product-modal.js`, `product-model.js`, `customer.js`, `password-modal.js`, `theme-editor.js` | Stock Dawn components |

### Existing Components

| Tag | File | What it does |
| --- | --- | --- |
| `quantity-input` | global.js | +/- quantity stepper; subscribes to `quantityUpdate` |
| `menu-drawer` | global.js | Mobile menu drawer |
| `header-drawer` | global.js | Extends `menu-drawer` |
| `modal-dialog` | global.js | Base modal with `show(opener)` / `hide()`; fires `modalClosed` on body |
| `modal-opener` | global.js | Button that opens a `modal-dialog` by selector |
| `deferred-media` | global.js | Lazy video/iframe; dispatches `videoLoaded` |
| `slider-component` | global.js | Native scroll-snap slider; dispatches `slideChanged` |
| `slideshow-component` | global.js | Extends `slider-component` with autoplay |
| `variant-selects` | global.js | Variant picker; publishes `variantChange` |
| `product-recommendations` | global.js | Section Rendering API loader |
| `cart-items`, `cart-remove-button`, `cart-note` | cart.js | Cart page; publishes and subscribes to `cartUpdate` |
| `cart-drawer`, `cart-drawer-items` | cart-drawer.js | Drawer with `open()` / `close()` / `renderContents()` |
| `cart-notification` | cart-notification.js | Popup notification cart |
| `product-form` | product-form.js | Add-to-cart; publishes `cartUpdate` / `cartError` |
| `product-info` | product-info.js | Quantity rules; subscribes to `variantChange` |
| `media-gallery` | media-gallery.js | Product media |
| `product-modal` | product-modal.js | Media zoom modal (extends `ModalDialog`) |
| `product-model` | product-model.js | 3D model (extends `DeferredMedia`) |
| `quick-add-modal` | quick-add.js | Quick add (extends `ModalDialog`) |
| `facet-filters-form`, `price-range`, `facet-remove` | facets.js | Collection filtering |
| `search-form`, `main-search`, `predictive-search` | search JS | Search |
| `details-disclosure`, `header-menu` | details-disclosure.js | `<details>` dropdowns |
| `details-modal`, `password-modal` | details-modal.js, password-modal.js | `<details>`-based modals |
| `localization-form` | localization-form.js | Country and language picker |
| `pickup-availability`, `pickup-availability-drawer` | pickup-availability.js | Store pickup |
| `quick-order-list`, `quick-order-list-remove-button`, `quick-order-list-remove-all-button` | quick-order-list.js | B2B order list |
| `quantity-popover`, `price-per-item`, `recipient-form`, `share-button`, `show-more-button` | various | Stock Dawn |
| **Custom:** `countdown-timer` | countdown.js | **Stub.** Hardcoded end date, empty `handleTick()` |
| **Custom:** `product-compare-view` | product-compare-view.js | **Stub.** Exercise TODOs; `productHandle = "?"` |
| **Custom:** `availability-status` | availability-status-element.js | Fetches demo stock JSON from a GitHub gist. Hardcoded "New York" / "Los Angeles" and English strings. |

**Non-component custom scripts (global scope):**

- `quiz.js`: top-level `const` variables, `alert()`s, `console.log`
- `contact-form-custom.js`: top-level queries; part of the code runs before `DOMContentLoaded`
- `custom-tracking-video.js`: defines a global `gtag()` that shadows Google's; currently commented out in its section
- `custom-testimonials-slider.js`: comments only, no code

### Event Patterns

1. **Pub/sub (`pubsub.js`)** is the main cross-component channel. Always store the unsubscribe function and call it in `disconnectedCallback`:
   ```js
   this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => { … });
   // disconnectedCallback: this.cartUpdateUnsubscriber?.();
   ```
   - `variantChange` payload: `{ data: { sectionId, html, variant } }`
   - `cartUpdate` payload: `{ source, productVariantId | variantId, cartData }`
2. **DOM CustomEvents:**
   - `videoLoaded` from `deferred-media`, with `detail.videoElement`
   - `slideChanged` from `slider-component`
   - `modalClosed` on `document.body`
   - `preventHeaderReveal` on the sticky header
3. **⚠️ `afterVariantChange` is never dispatched.** `availability-status-element.js` and `theme.liquid:355` both listen for it, but nothing fires it. To react to variant changes, subscribe to `PUB_SUB_EVENTS.variantChange` instead.

### Third-Party Libraries

- **Flickity** (`flickity.pkgd.min.js` + `flickity.css`), stored locally in assets. It's only used by `custom-testimonials-slider.liquid`, which loads it with `script_tag` (**render-blocking**, not deferred). No other libraries.
- Dawn's own slider (`slider-component`, `component-slider.css`) uses native scroll-snap. Prefer it for new carousels unless Flickity-specific features are needed.

### Script Loading

The standard pattern is a plain `<script defer>` placed at the top of the section file:

```liquid
<script src="{{ 'product-form.js' | asset_url }}" defer="defer"></script>
```

- `constants.js` → `pubsub.js` → `global.js` load deferred in the `<head>`, in that order. All deferred section scripts run after them, so `subscribe`, `publish`, `PUB_SUB_EVENTS`, `debounce`, and `fetchConfig` are available.
- Stock files register components with the guard `if (!customElements.get('x')) { customElements.define('x', class … ) }`. Older files call `customElements.define` bare (`cart.js`, `facets.js`, and the custom `countdown.js` / `product-compare-view.js`), which throws if the script is loaded twice on one page. **Use the guarded form.**
- `countdown.liquid` uses `type="module" defer`. That's the only module script; don't mix patterns.
- Translated strings reach JS through `window.variantStrings`, `window.cartStrings`, `window.accessibilityStrings`, and `window.quickOrderListStrings` in `theme.liquid`. URLs come from `window.routes` (`cart_add_url`, `cart_change_url`, `cart_update_url`, `cart_url`, `predictive_search_url`).

## Liquid Conventions

### Section Wrapper Pattern

There are two standard variants.

**A. Color scheme on the outer element, page-width inside** (multicolumn, video, contact-form, newsletter, featured-collection):

```liquid
<div class="multicolumn color-{{ section.settings.color_scheme }} gradient">
  <div class="page-width section-{{ section.id }}-padding isolate">
    …
  </div>
</div>
```

**B. Isolate + page-width outer, color scheme inner** (rich-text, collapsible-content), used when a section has a `full_width` toggle:

```liquid
<div class="isolate{% unless section.settings.full_width %} page-width{% endunless %}">
  <div class="rich-text content-container color-{{ section.settings.color_scheme }} gradient section-{{ section.id }}-padding">
    …
  </div>
</div>
```

The schema always declares `"tag": "section", "class": "section"`, which makes the `.section + .section` spacing apply.

Headings use: `<h2 class="title inline-richtext {{ section.settings.heading_size }}">` inside `.title-wrapper` or `.title-wrapper-with-link`, with `title-wrapper--no-top-margin`.

### Section Padding Approach

35 of 36 sections that use padding apply a **0.75** mobile multiplier. This is the Dawn standard, not 0.5:

```liquid
{%- style -%}
  .section-{{ section.id }}-padding {
    padding-top: {{ section.settings.padding_top | times: 0.75 | round: 0 }}px;
    padding-bottom: {{ section.settings.padding_bottom | times: 0.75 | round: 0 }}px;
  }

  @media screen and (min-width: 750px) {
    .section-{{ section.id }}-padding {
      padding-top: {{ section.settings.padding_top }}px;
      padding-bottom: {{ section.settings.padding_bottom }}px;
    }
  }
{%- endstyle -%}
```

The only exception is `custom-testimonials-slider.liquid`, which uses `0.5`. **Use 0.75 for new sections** so they match.

### Standard Schema Settings

Order typically seen (rich-text, multicolumn, video, contact-form):

1. Content and layout settings (`heading` / `title` as `inline_richtext`, `heading_size` select, alignment, columns)
2. `color_scheme` (`"type": "color_scheme"`, `"label": "t:sections.all.colors.label"`, `"default": "scheme-1"`)
3. `full_width` checkbox (when relevant)
4. `header` → `"t:sections.all.padding.section_padding_heading"`
5. `padding_top` / `padding_bottom` ranges

Plus `"disabled_on": { "groups": ["header", "footer"] }` on content sections.

### Section Structure

File anatomy, in order:

1. `{{ 'section-x.css' | asset_url | stylesheet_tag }}` plus any `component-*.css` it needs
2. `<script src="…" defer="defer">` (if interactive)
3. `{%- style -%}` padding block
4. `{%- liquid … -%}` for computed assigns
5. Markup: wrapper, title, then content. Blocks use `{%- for block in section.blocks -%}{%- case block.type -%}` with `{{ block.shopify_attributes }}` on each block root.
6. `{% schema %}`

### Snippet Patterns

- Always included with `{% render 'name', param: value %}`. The one legacy `{% include %}` use is in `custom-testimonials-slider.liquid` for the star icons; use `render` instead.
- Most rendered: `icon-caret` (63), `icon-arrow` (26), `loading-spinner` (23), `icon-close` (18), `icon-error` (17), `icon-accordion` (12), `card-product` (10), `price` (8).
- Naming: `icon-*` for SVG icons; `card-product` / `card-collection` / `article-card` for cards; `product-*` for PDP pieces; `header-*` for header parts; `swatch` / `swatch-input`, `quantity-input`, `price`, `pagination`, `facets`.
- `card-product` is the go-to product card. It takes params such as `card_product`, `media_aspect_ratio`, `show_secondary_image`, `show_vendor`, `section_id`, `quick_add`.

### Translation Approach

- Stock Dawn: schema labels and info always use `t:` keys from `locales/en.default.schema.json`. Storefront text uses `{{ 'key' | t }}` from `locales/en.default.json`. Usage is consistent.
- **Custom sections are a gap:**
  - `main-quiz.liquid`: zero translation or setting usage; every question and label is hardcoded
  - `countdown.liquid`, `product-compare.liquid`, `test-section.liquid`: plain English schema labels; hardcoded `"Select a bike"` / `"Add to Comparison"`
  - `contact-custom-form.liquid`: hardcoded `Business Account` / `Company Name`
  - `custom-testimonials-slider.liquid`: hardcoded test slides and `"label": "caption_text"`
  - `availability-status-element.js`: hardcoded `"Available"` / `"Unvailable"` (typo)
- For new work: use `t:` keys for schema labels where a shared key fits (`t:sections.all.colors.label`, `t:sections.all.padding.*`, `t:sections.all.heading_size.*`). Put storefront strings in schema settings or new `en.default.json` keys.

### Block Patterns

- Blocks are typed and rendered through `case block.type` with a `"limit"` per type. Rich-text has `heading` ×3, `caption` ×3, `text` ×3, `button` ×2.
- Common block types: `heading`, `text`, `button`, `column` (multicolumn), `image`, `collapsible_row`, plus `@app` on product sections.
- Scroll-reveal cascade per block: `{% if settings.animations_reveal_on_scroll %} scroll-trigger animate--slide-in{% endif %}` with `data-cascade style="--animation-order: {{ forloop.index }};"`.

## Schema Conventions

### Common Settings

| Setting | Type | Frequency |
| --- | --- | --- |
| `color_scheme` | `color_scheme` | ~40 sections |
| `padding_top` / `padding_bottom` | `range` 0–100, step 4, `px` | ~36 sections |
| `heading` / `title` | `inline_richtext` | Most content sections |
| `heading_size` | `select` (`h2`, `h1`, `h0`, `hxl`) | Most content sections |
| `full_width` | `checkbox` | Where an edge-to-edge layout makes sense |

Other common types: `image_picker`, `richtext`, `text`, `url`, `select`, `checkbox`, `collection`, `product`, `video`, `video_url`.

### Color Scheme Handling

- Uses a `color_scheme` setting rendered as the class `color-{{ section.settings.color_scheme }}`, usually alongside `gradient`. The `.gradient` class applies `--gradient-background`.
- Defined schemes: `scheme-1` to `scheme-5`. Default to `"scheme-1"`.
- ⚠️ `custom-testimonials-slider.liquid` defaults to `"background-1"`, a legacy pre-v10 Dawn ID that doesn't exist here. Its preset also sets `"color_scheme": ""`.

### Padding / Spacing Approach

- Range `0–100`, `step: 4`, `unit: px`.
- Defaults vary by section: rich-text 40/52; multicolumn, video, and most others 36/36.
- Mobile gets 0.75× (see above).
- The section heading for padding settings is always `t:sections.all.padding.section_padding_heading`.

### Preset Patterns

- Stock: `"name": "t:sections.X.presets.name"`. Presets usually include default blocks, e.g. `[{ "type": "heading" }, { "type": "text" }, { "type": "button" }]`. Blocks get defaults from their own setting `default`s rather than preset settings.
- Custom sections use `"category": "Custom"` to group in the editor (quiz, countdown, test-section).
- Every reusable section has a preset. Template-only `main-*` sections don't.

## Visual Analysis

No reference images found: `.claude/context/reference/` doesn't exist. Add screenshots or brand guidelines there and re-run this step if visual direction is needed.

From the settings alone: Oswald headings (condensed sans) at 140% scale, Avenir Next body text, and a 1600px max content width. The quiz CSS assumes a dark background (white text and borders).

## Recommendations

1. **Build to the stock Dawn patterns, not the custom sections.** The custom files are course exercises and break several conventions: missing `color_scheme` and padding settings, hardcoded text, global-scope JS, ID-based CSS.
2. **Padding multiplier is 0.75, not 0.5.** The CLAUDE.md template example shows 0.5; this theme uses 0.75 everywhere except the testimonials slider.
3. **`afterVariantChange` doesn't exist.** Subscribe to `PUB_SUB_EVENTS.variantChange`. The listener in `theme.liquid:353-362` is dead debug code; remove it when convenient (with approval, since it's in the layout).
4. **Guard every `customElements.define`** with `if (!customElements.get(...))`. Several custom components don't, and will throw if loaded twice (e.g. two countdown sections on one page).
5. **Clean up subscriptions.** Stock components such as `cart-items` and `product-info` unsubscribe in `disconnectedCallback`. The custom `availability-status` adds a `document` listener and never removes it. New components must follow the stock pattern.
6. **Flickity is loaded render-blocking** in `custom-testimonials-slider.liquid` (`script_tag`, no defer), and the section only renders hardcoded test slides. Prefer Dawn's `slider-component` for new carousels.
7. **The product quiz (current branch, `feature/product-quiz`) needs a refactor before it's production-ready:**
   - Hardcoded questions and answers
   - `all_products['handle']` lookups (limited to 20 per page and brittle)
   - Global `const`s and `alert()` / `console.log` in `quiz.js`
   - Images without `alt`, `width`, or `height`
   - No settings, `color_scheme`, or padding
   - Should become a `<product-quiz>` web component with blocks for questions
8. **Heavy quiz images:** `quiz-mountain.jpg` (1.16 MB) and `quiz-track.jpg` (928 KB) are served via `asset_url` at full size. Move them to `image_picker` settings so Shopify's CDN can resize them with `image_url: width:`.
9. **Breakpoints:** use `750px` / `990px` with `max-width: 749px` / `989px`. Don't use `max-width: 750px`, which overlaps at exactly 750px.
10. **Leftover debug and demo code:**
    - `test-section.liquid` (class typo `cusotm-heading`)
    - `console.log`s across the custom JS
    - The `availability-status` gist fetch, an external runtime dependency on a third-party URL
    - `countdown.js` end date hardcoded to a past date (May 2026)
11. **Product templates** `product.availability-status.json` and `product.meta-information.json` each rely on a near-copy of `main-product.liquid` (2,317 / 2,335 / 2,405 lines). Changes to the product page must be repeated in each, or consolidated (needs discussion).
12. **Base files not to modify:** `global.js`, `pubsub.js`, `constants.js`, `cart*.js`, `product-form.js`, `product-info.js`, `facets.js`, `base.css`, `layout/theme.liquid`.
