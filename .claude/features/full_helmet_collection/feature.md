# Full Helmet Collection

## Brief

Our client has created an collection called Full Face Mountain Bike Helmets they do not like the standard collection grid and would like to have a new collection grid styled to look and behave has the helmet grid on the website https://landonorris.com/on-track. They do want to keep the filtering and sort that exists on the native collection grid. In the reference folder we have screen shots showing the desjtop and mobile designs. An reference to the svg file used on the website in file svg-background.md. Also copied the grid elements code fro the main website and referenced the code in a file called reference-site-element-code.md

The grid will display 4 item cards across for desktop screen sizes. Be fully responsive to all the break points and display 2 item cads across on mobile.
When you hover over the individual product card an slow transtion will replace the image with the second image or lifestyle image.Once you hover off of the product the transtion will reverse back to the main image.

Clicking anywhere in the product grid will have you go to that products product page.

In the lower right corner of the grid diaply the product name, price in a single row than below the rating stars if a product has ratings.

The current collection grid is an section. We should create a new section called Custom Collection that we can replace the collection grid when desired. No need for a new collection template.

---

## Scoping Questions

Generated: 2026-10-27
Chosen approach: Custom section ("Custom Collection"). A new standalone section with its own card markup, CSS, and a small web component. No changes to Dawn core files.

### Q1: Which collections should get the helmet grid?

`templates/collection.json` is shared by every collection. Putting the new section there changes all collections, not just "Full". An alternate template (`collection.full.json`) is created in the theme editor in a few clicks and assigned to "Full" only. It's a JSON settings file, not new code.

- [ ] a) Only "Full", via an alternate template `collection.full.json` (recommended)
- [ ] b) All collections: replace the grid in the default `collection.json`
- [x] c) Undecided. Build the section only; decide placement at launch.

**Notes:**  
The section will be manually placed on the collection.

### Q2: Where does the section get its products from?

Recommendation: (c). It works automatically on any collection page and can also be dropped onto the homepage or other pages, which keeps the section "usable everywhere" as per our conventions.

- [ ] a) The collection of the page it's on (only works on collection pages)
- [ ] b) A collection picker in the section settings (works anywhere, but must be set manually each time)
- [ ] c) Both: the current collection page when there is one, otherwise the picker setting (recommended)

**Notes:**  
The section will work on any collection page however the user will add the section if needed to that collection.

### Q3: Do customers need filtering or sorting on this grid?

The current Dawn grid has filters and sorting (the `facets` snippet). Reusing them is possible but adds significant scope, and they'd need restyling to fit the dark design. The reference site has neither.

- [ ] a) No filters or sorting. Clean grid only, like the reference (recommended for v1).
- [ ] b) Sorting dropdown only
- [x] c) Full filters + sorting (adds noticeable time)

**Notes:**  
For Filters and Sorting keep the current shopify sites styling.

### Q4: How should larger collections be handled?

- [x] a) Standard page numbers, reusing Dawn's `pagination` snippet, with a "products per page" setting (recommended)
- [ ] b) "Load more" button (needs extra JS)
- [ ] c) Show everything on one page (up to Shopify's limit of 50 per page). Fine if "Full" stays small.

**Notes:**  
How many products is "Full" expected to have? 12 products currently expect to paginate at 24 products for now.

### Q5: Where does the hover (lifestyle) image come from?

- [x] a) The product's 2nd image in its media gallery. Nothing extra to set up, but the 2nd image must always be the lifestyle shot (recommended).
- [ ] b) A dedicated product metafield, e.g. "Lifestyle image". More control, but the client must fill it in for every product.
- [ ] c) Metafield first, falling back to the 2nd image

**Notes:**  
If a product has no second image: no hover effect, just the outline highlight. OK? yes ok.

### Q6: Which hover effect?

The reference uses an oval reveal: the lifestyle image grows up from the bottom in a curved shape until it fills the frame, and the outline turns lime. Both options below are CSS-only and reverse smoothly on mouse-out.

- [x] a) Match the reference: oval reveal + lime outline (recommended)
- [ ] b) Simpler crossfade + lime outline

**Notes:**  
Touch devices have no hover. Tapping a card on mobile goes straight to the product page with no reveal. OK? Ok for now.

### Q7: Should the desktop columns be staggered like the reference?

On desktop, columns 2 and 4 sit lower than 1 and 3, and the reference moves them slightly as you scroll (parallax). Mobile is an even 2-column grid either way.

- [ ] a) Static stagger, CSS-only (recommended: the same look with no scroll JS)
- [x] b) Stagger + subtle scroll parallax. Needs a small script; switched off for users who prefer reduced motion.
- [ ] c) No stagger: even 4-column grid

**Notes:**

### Q8: Where do star ratings come from?

Dawn reads ratings from Shopify's standard `reviews.rating` metafield, which most review apps fill (Judge.me, Okendo, Shopify Product Reviews, etc.). I haven't checked whether this store has a review app installed.

- [x] a) Use the standard `reviews.rating` metafield. Stars only show when a rating exists (recommended).
- [ ] b) A specific review app's widget (tell me which app)
- [ ] c) Leave ratings out of v1

**Notes:**  
Show the review count next to the stars, e.g. "(12)"? Yes

### Q9: What appears in the card's info notch?

The brief says: name + price on one row, stars below. The reference puts the second value (year) in lime.

- [x] a) Name + price (price in the accent colour). Sale price shows with the original crossed out. Sold-out products show a "Sold out" label.
- [ ] b) Name + price only. No sale or sold-out handling.

**Notes:**  
Long product names: truncate with "…" after one line, or allow two lines?
Truncate

### Q10: How are the dark background and lime accent controlled?

- [x] a) Theme colour scheme for background/text (create a dark scheme in theme settings) + one "Accent colour" setting for the outline and price (recommended, matches the theme conventions)
- [ ] b) Fixed dark + lime colours in the code

**Notes:**

### Q11: Should the section include its own heading and intro text?

The reference has a "Helmets Hall of Fame" title + paragraph above the grid. Collection pages already have Dawn's collection banner (title + description) above the grid.

- [x] a) No heading. Rely on the existing collection banner (recommended on collection pages).
- [ ] b) Optional heading + text settings (useful if the section is placed on the homepage)

**Notes:**

### Q12: Build order for the text and settings?

- [x] a) Set up schema settings and translations from the start (recommended: it's a small number of settings)
- [ ] b) Hardcode first for a quick prototype, convert to settings afterwards

**Notes:**

---

### Recommendations

- **Don't reuse `card-product.liquid`.** It's shared by search, related products, and featured collections, and its markup can't produce the notched frame. A new snippet keeps the helmet card self-contained. We'll copy its proven logic for responsive `srcset`, ratings, and sale/sold-out badges rather than reinventing it.
- **The notched frame works as an inline SVG outline**, with an SVG `clipPath` (or CSS `clip-path: path()`) clipping the images to the same shape. The reference uses two shapes, a desktop one (407×411) and a mobile one (187×188), because the notch proportions differ. We'll do the same, switched at the theme's 750px breakpoint.
- **Clickable card:** the whole card becomes one link to the product (the brief: "click anywhere"). The product name stays real text inside it so screen readers announce it properly. No quick-add or add-to-cart buttons, which keeps it simple.
- **Image performance:** both images use Shopify's `image_url` + `image_tag` with proper `sizes` (25vw desktop / 50vw mobile). The hover image is lazy-loaded so it doesn't slow the first load.
- **Accessibility:** a visible lime focus outline for keyboard users, the reveal also triggers on keyboard focus, and `prefers-reduced-motion` turns the transition into an instant swap.
- **Files (following project conventions):** `sections/section-custom-collection.liquid`, `snippets/card-helmet.liquid`, `assets/section-custom-collection.css`, and `assets/custom-collection.js` only if Q7 = (b) or Q4 = (b).
- **Fonts:** the reference uses its own display fonts. We'll use the theme's existing heading font (Oswald) unless the client wants something specific.
- **Empty state:** if the collection has no products (or no collection is selected in the editor), show a placeholder message in the editor and nothing on the live site.

## Extended Brief

Generated: 2026-10-27

### Chosen Approach

A new standalone "Custom Collection" section with its own helmet-style product card. It reuses Dawn's existing filtering, sorting, and pagination without modifying any Dawn core files. The section can be added to any page from the theme editor.

### Requirements

- **Grid:** 2 cards across on mobile (<750px), 3 on tablet (750–989px), 4 on desktop (≥990px).
- **Stagger + parallax (desktop only, ≥990px):** columns 2 and 4 sit lower than columns 1 and 3, and they drift slightly as the page scrolls. The movement is off when the user prefers reduced motion, and below 990px the grid is even.
- **Notched frame:** each card has the SVG outline from the reference, with the step cut out at the bottom-left. There are two shapes, desktop (407×411 viewBox) and mobile (187×188 viewBox), switched at 750px.
- **Hover / keyboard focus:**
  - The product's 2nd image grows in from the bottom as an oval (`clip-path` ellipse) until it fills the frame, clipped to the notched shape.
  - The frame outline turns to the accent colour.
  - Both reverse smoothly when the pointer or focus leaves.
  - With no 2nd image, only the outline highlight happens.
- **Click:** the whole card is one link to the product page. On touch devices a tap goes straight to the product page, with no reveal.
- **Info notch (bottom-right of the card):**
  - Row 1: the product name, truncated with "…" after one line, plus the price in the accent colour. On sale, the original price is shown crossed out. When sold out, a "Sold out" label is shown.
  - Row 2: star rating + review count, e.g. "(12)". Only shown when the product has a rating.
- **Filtering + sorting:** Dawn's full filters and sort, with the existing Dawn styling unchanged. Only on collection pages.
- **Pagination:** Dawn's page numbers. Products per page is a setting, default 24.

### Where It Lives

- New section **"Custom Collection"**, added through "Add section" in the theme editor. It has a preset and is not restricted to any template.
- **Collection pages:** uses the page's own collection. Filters, sorting, and pagination are active. The default "Product grid" section (`main-collection-product-grid`) must be removed from that template when this section is used, because both rely on the same element IDs that the filter script looks for.
- **Any other page** (homepage, regular pages): uses the collection chosen in the section's collection picker. Filters and sorting are hidden; pagination still works.
- Where it goes live (e.g. an alternate `collection.full.json` template for "Full" only) is decided by the user at launch. Not part of this build.

### Data Sources

| Data | Source |
| --- | --- |
| Products | `collection` on collection pages; otherwise the `collection` picker setting |
| Main image | `product.featured_media` |
| Hover image | `product.media[1]` |
| Name / price / availability | Product object (`price`, `compare_at_price`, `available`) |
| Rating | `product.metafields.reviews.rating`, `product.metafields.reviews.rating_count` |
| Filters / sort | `collection.filters`, `collection.sort_options` (via Dawn's `facets` snippet) |

### User Interaction

- Desktop: hover or keyboard focus → oval reveal + accent outline; leaving → reverse. Scrolling → subtle parallax on the staggered columns.
- Mobile and touch: no hover state; a tap navigates to the product page.
- Filters and sort: same behaviour as the current Dawn collection page. The grid re-renders without a page reload, and the URL updates.
- Pagination: standard page links.

### Customizer Settings

**Configurable:**

- Collection picker (used outside collection pages)
- Colour scheme (the client creates a dark scheme in theme settings)
- Accent colour (default `#d2ff00`)
- Products per page (default 24)
- Enable filtering
- Enable sorting
- Filter layout (horizontal / vertical / drawer, as Dawn offers)
- Show rating
- Padding top / bottom (theme standard: 0–100, step 4, 0.75× on mobile)

**Not configurable:** frame shape, animation speed and easing, column counts, stagger offset, parallax strength.

All labels and storefront text use translation keys (`en.default.json` / `en.default.schema.json`), with settings and translations set up from the start.

### Decisions Made

| Decision | Reasoning |
| --- | --- |
| Custom section over extending Dawn's grid or using an app | Keeps Dawn core files untouched; a page builder can't reproduce the frame or the reveal |
| Usable anywhere, with collection picker fallback | User wants it in "Add section" everywhere. This overrides the Q2 note that it was for collection pages only. |
| Full filters + sorting with Dawn's styling | Client requirement. Achieved by reusing the `facets` snippet and matching the IDs `facets.js` expects (`#product-grid` with `data-id`, `#ProductGridContainer`, `#ProductCount`), so `facets.js` needs no changes. |
| Page numbers, 24 per page | "Full" has ~12 products today; pagination future-proofs it |
| Hover image = 2nd product image | No extra admin setup |
| Oval reveal matching the reference | Client wants the reference look |
| Stagger + parallax | Client wants the reference feel. Small web component; reduced-motion respected. |
| Ratings from the standard `reviews.rating` metafield, with count | Works with most review apps; review count requested |
| Name truncated to one line | Keeps the notch layout intact |
| Colour scheme + accent colour setting | Matches theme conventions and avoids hardcoded colours |
| No section heading | The collection banner already covers it |
| New `card-helmet` snippet rather than reusing `card-product` | `card-product` is shared site-wide and can't produce the notched frame. Its srcset, rating, and badge logic is reused as reference. |
| Tablet = 3 columns | Smooth step between mobile and desktop |

### Edge Cases to Handle

- **No 2nd image:** outline highlight only, no reveal.
- **No featured image:** Dawn placeholder SVG inside the frame.
- **No rating / zero reviews:** rating row hidden; the notch shows a single row.
- **Long product names:** truncated with an ellipsis; full name kept in the link's accessible name.
- **Sold out:** "Sold out" label; card still links to the product.
- **Empty collection, or no collection picked (non-collection page):** editor-only placeholder message; nothing renders on the live storefront.
- **Filters that return no results:** Dawn's standard "no products found" message, with a link to clear filters.
- **Two Custom Collection sections on one collection page,** or one alongside the default grid: IDs would clash and break filtering. Documented as unsupported. Only the first instance should output the filter IDs; the plan should handle this defensively.
- **Grid re-rendered by filters:** the parallax component must re-initialise and clean up its listeners (`disconnectedCallback`) after `facets.js` replaces the grid HTML.
- **Reduced motion:** no parallax, and the reveal becomes an instant swap.
- **Keyboard:** visible accent-coloured focus outline; the reveal triggers on `:focus-visible`.
- **Mobile:** even 2-column grid, mobile frame shape, smaller notch text.
- **Odd product counts:** the stagger still looks intentional when the last row is incomplete.

### Out of Scope

- Quick-add / add-to-cart buttons on cards
- Section heading / intro text (the reference's "Helmets Hall of Fame" block)
- The reference site's animated text reveals and custom fonts (the theme's Oswald heading font is used)
- "Load more" / infinite scroll
- A product metafield for the lifestyle image
- Creating or assigning the alternate collection template
- Restyling the filter/sort UI
- Tap-to-reveal behaviour on touch devices

### Dependencies

- **Dawn files reused unchanged:** `facets.js`, `snippets/facets.liquid`, `component-facets.css`, `snippets/pagination.liquid`, `component-pagination.css`, `snippets/price.liquid`, `component-rating.css`.
- **Pub/sub and base helpers** from `global.js` (e.g. `throttle`), available because the section's scripts load deferred after it.
- **A review app** writing to the `reviews.rating` metafields, for stars to appear. Not verified yet.
- **A dark colour scheme** created in theme settings by the client/user.

### Notes

- Files (per project conventions):
  - `sections/section-custom-collection.liquid`
  - `snippets/card-helmet.liquid`
  - `assets/section-custom-collection.css`
  - `assets/custom-collection.js` (parallax web component)
  - New translation keys in `locales/en.default.json` and `locales/en.default.schema.json`
- The "Full" collection currently has ~12 products.
- Reference designs: `reference/` (Desktop 1–5, Mobile 1, SVG markup, reference site HTML).

### Needs Client Clarification

- Which review app (if any) the store uses. This confirms that the `reviews.rating` metafields are populated. Can be checked during QA.

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# feature.md — v1.0

# AI Shopify Developer Bootcamp

# by Coding with Jan

# https://codingwithjan.com

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
