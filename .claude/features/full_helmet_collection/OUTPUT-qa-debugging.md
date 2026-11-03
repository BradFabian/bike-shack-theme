# QA: Custom Collection (Helmet Grid)

Feature spec: `.claude/features/full_helmet_collection/feature.md`
Implementation plan: `.claude/features/full_helmet_collection/OUTPUT-implementation-plan.md`

## How to Use This File

1. Run through the checklist after implementation. Check the items that pass; add notes on the items that fail.
2. Tell AI to read this file. It will fix the issues and reset the checklist for another round.
3. Repeat until everything passes.
4. Previous rounds are kept as a log below the current round.

**Test setup:** a dark colour scheme is selected in the section. Test on a collection page (with the default "Product grid" hidden) AND on the homepage with a collection chosen in the picker.

## Current Round (Round 2)

Status: Passed (2026-11-03). The user confirmed in chat: "round 2 QA is perfect". The boxes below were not ticked individually, so they're left as they were.

**Accepted trade-offs:**
- The notch is wider than the reference (about 57% of the card on desktop instead of 35%, about 74% on mobile instead of 68%), to fit product names.
- Very long names still truncate with "…", most often on mobile and on small desktop/tablet widths.
- Cards show no currency code and drop ".00" on whole prices. The rest of the site still shows the code.
- Sold-out cards show the label in place of the price.
- The section can't share a page with the default "Product grid", or with a second copy of itself on a collection page. This is a documented rule that the code can't enforce.

### Core behavior

- [ ] "Custom Collection" appears under Add section on the homepage, a regular page, and a collection template
- [ ] On a collection page, the section shows that collection's products (the picker setting is ignored)
- [ ] On the homepage, the section shows the products of the collection chosen in the picker
- [ ] Desktop (≥990px): 4 cards per row
- [ ] Tablet (750–989px): 3 cards per row
- [ ] Mobile (<750px): 2 cards per row
- [ ] Each card shows the notched frame outline, with the wider notch at the bottom-left, and the shape still feels right against the reference
- [ ] The product name and price sit on one row in the bottom-right notch area; the price is in the accent colour with no "USD", and the name is readable on all 8 cards
- [ ] Clicking anywhere on a card (image, frame, text) opens that product's page
- [ ] Changing the "Accent colour" setting changes the price colour, stars, and hover outline
- [ ] Changing the colour scheme setting changes the section's background and text colours

### Hover reveal

- [ ] Hovering a card turns the frame outline from grey to the accent colour, slowly
- [ ] Hovering a card with 2+ images grows the 2nd image down from the top with a curved lower edge until it fills the frame (like Desktop 4)
- [ ] The hover feels slow and premium: the lifestyle image settles from a slight zoom while the helmet sinks and fades out
- [ ] The revealed image is clipped to the notched frame shape (never spills outside the outline)
- [ ] Moving the mouse off reverses both effects smoothly
- [ ] Moving quickly across several cards causes no flicker or stuck states
- [ ] A product with only 1 image: hover changes the outline only, no reveal

### Stagger + parallax (desktop)

- [ ] On desktop, columns 2 and 4 sit lower than columns 1 and 3 (like Desktop 1)
- [ ] Scrolling makes columns 2 and 4 drift slightly; the movement is smooth
- [ ] The last row never overlaps the pagination links
- [ ] With an odd number of products (e.g. 10), the layout still looks intentional
- [ ] Tablet and mobile: no stagger, no scroll movement

### Price, sold out, and rating

- [ ] A product on sale shows the sale price in the accent colour and the original price crossed out, neither with "USD"
- [ ] A sold-out product shows a "Sold out" label in place of the price and still links to the product page
- [ ] A product with reviews shows stars + review count, e.g. "(12)", below the name/price row
- [ ] A product with no reviews shows no rating row
- [ ] Turning off the "Show rating" setting hides all stars
- [ ] A very long product name is truncated with "…" on one line, only when it really doesn't fit (desktop, tablet, and mobile)

### Filters, sorting, and pagination (collection page)

- [ ] The filter UI looks the same as the current Dawn collection page
- [ ] Applying a filter updates the grid without a page reload, and the URL updates
- [ ] The product count updates after filtering
- [ ] Sorting (e.g. Price, low to high) reorders the grid
- [ ] Removing a filter / "Clear all" restores the full grid
- [ ] After filtering or sorting, hover reveal and scroll parallax still work on the new cards
- [ ] Filter layout setting: horizontal, vertical, and drawer each render correctly
- [ ] With products per page = 4, page links appear and page 2 loads the next products
- [ ] Turning off "Enable filtering" and "Enable sorting" removes the filter UI entirely

### Edge cases

- [ ] Filters that match nothing show "No products found" with a working link to clear filters
- [ ] Homepage with no collection picked: a hint shows in the theme editor; nothing appears on the live preview
- [ ] An empty collection: a hint in the theme editor, nothing on the live site
- [ ] A product with no images shows a placeholder inside the frame
- [ ] On the homepage, no filter UI appears and there are no console errors

### Mobile

- [ ] Cards use the mobile frame shape (a smaller notch) below 750px
- [ ] Text in the notch is readable and doesn't overflow the card
- [ ] Tapping a card goes straight to the product page (no stuck hover state)
- [ ] The mobile filter drawer opens, filters apply, and the drawer closes
- [ ] No horizontal scroll at 375px width

### Accessibility

- [ ] Tab moves card to card; each focused card shows the accent outline and the reveal
- [ ] Enter on a focused card opens the product page
- [ ] The screen reader announces each card as a link with the product name (no "image" noise from the frames)
- [ ] The screen reader reads the rating as "X out of 5 stars" and "N total reviews"
- [ ] With OS "Reduce motion" on: no parallax, and the reveal swaps instantly (no animation)

### Shopify theme editor

- [ ] All setting labels are readable text (no raw `t:sections…` keys)
- [ ] Changing settings updates the preview without errors
- [ ] The section can be added, reordered, and removed without errors
- [ ] No Liquid errors are shown anywhere in the editor

### Performance / browsers

- [ ] Chrome, Safari, and Firefox (desktop): reveal, clipping, and parallax all work
- [ ] iOS Safari: layout and tap behaviour are correct
- [ ] Lifestyle (2nd) images don't load until scrolled near (check the DevTools Network tab)
- [ ] No console errors or warnings from `custom-collection.js`

## Previous Rounds

### Round 1

Status: Fixes applied, retest in Round 2

> Items marked [SKIPPED] were left unchecked in the file. The user said in chat that everything else was "working great", but didn't mark them individually.


### Core behavior

#### [PASS] "Custom Collection" appears under Add section on the homepage, a regular page, and a collection template
#### [PASS] On a collection page, the section shows that collection's products (the picker setting is ignored)
#### [PASS] On the homepage, the section shows the products of the collection chosen in the picker
#### [PASS] Desktop (≥990px): 4 cards per row
#### [PASS] Tablet (750–989px): 3 cards per row
#### [PASS] Mobile (<750px): 2 cards per row
#### [PASS] Each card shows the notched frame outline, with the notch at the bottom-left
#### [FAIL] The product name and price sit on one row in the bottom-right notch area; the price is in the accent colour
**User feedback:** "product name and price are not dispalyign well. Remove usd from price and fit name and price for a better ui/ux experience." Screenshots: `reference/round-1-qa-name-price-desktop.png`, `reference/round-1-qa-name-price-mobile.png`.
**Fix:** Replaced the `price` snippet in the card with own markup, because the snippet adds the currency code when the global setting is on (the setting stays on for the rest of the site). Prices use `money_without_trailing_zeros`, so $100.00 USD is now $100. Widened the notch from 35% to about 57% of the card on desktop/tablet and from about 68% to about 74% on mobile, so the name has more room.

#### [PASS] Clicking anywhere on a card (image, frame, text) opens that product's page
#### [PASS] Changing the "Accent colour" setting changes the price colour, stars, and hover outline
#### [PASS] Changing the colour scheme setting changes the section's background and text colours

### Hover reveal

#### [PASS] Hovering a card turns the frame outline from grey to the accent colour, slowly
#### [FAIL] Hovering a card with 2+ images grows the 2nd image up from the bottom as an oval until it fills the frame
**User feedback:** "The hover transtion doesnt feel premium enough. Also it hovers from bottom to top rather from top to bottom."
**Fix:** The oval is now anchored to the top edge and grows downward with a wide curved lower edge, matching `reference/Desktop 4 - Elliptical reveal.jpg`. Slower, softer timing (1.2s in, 0.9s out). The lifestyle image settles from a 1.1 zoom while the helmet sinks and fades out, and the outline colour runs on the same timing.

#### [PASS] The revealed image is clipped to the notched frame shape (never spills outside the outline)
#### [PASS] Moving the mouse off reverses both effects smoothly
#### [PASS] Moving quickly across several cards causes no flicker or stuck states
#### [PASS] A product with only 1 image: hover changes the outline only, no reveal

### Stagger + parallax (desktop)

#### [PASS] On desktop, columns 2 and 4 sit lower than columns 1 and 3 (like Desktop 1)
#### [PASS] Scrolling makes columns 2 and 4 drift slightly; the movement is smooth
#### [PASS] The last row never overlaps the pagination links
#### [PASS] With an odd number of products (e.g. 10), the layout still looks intentional
#### [PASS] Tablet and mobile: no stagger, no scroll movement

### Price, sold out, and rating

#### [PASS] A product on sale shows the sale price in the accent colour and the original price crossed out
#### [PASS] A sold-out product shows a "Sold out" label and still links to the product page
#### [PASS] A product with reviews shows stars + review count, e.g. "(12)", below the name/price row
#### [PASS] A product with no reviews shows no rating row
#### [PASS] Turning off the "Show rating" setting hides all stars
#### [FAIL] A very long product name is truncated with "…" on one line
**User feedback:** "After oen letter it's truncated, we need to fit full name and price better"
**Fix:** Same as above. Names keep the one-line ellipsis from the spec, but only when they don't fit the wider notch. Sold-out products show the label in place of the price.


### Filters, sorting, and pagination (collection page)

#### [PASS] The filter UI looks the same as the current Dawn collection page
#### [PASS] Applying a filter updates the grid without a page reload, and the URL updates
#### [PASS] The product count updates after filtering
#### [PASS] Sorting (e.g. Price, low to high) reorders the grid
#### [PASS] Removing a filter / "Clear all" restores the full grid
#### [PASS] After filtering or sorting, hover reveal and scroll parallax still work on the new cards
#### [PASS] Filter layout setting: horizontal, vertical, and drawer each render correctly
#### [PASS] With products per page = 4, page links appear and page 2 loads the next products
#### [PASS] Turning off "Enable filtering" and "Enable sorting" removes the filter UI entirely

### Edge cases

#### [SKIPPED] Filters that match nothing show "No products found" with a working link to clear filters
#### [SKIPPED] Homepage with no collection picked: a hint shows in the theme editor; nothing appears on the live preview
#### [SKIPPED] An empty collection: a hint in the theme editor, nothing on the live site
#### [SKIPPED] A product with no images shows a placeholder inside the frame
#### [SKIPPED] On the homepage, no filter UI appears and there are no console errors

### Mobile

#### [SKIPPED] Cards use the mobile frame shape (a smaller notch) below 750px
#### [SKIPPED] Text in the notch is readable and doesn't overflow the card
#### [SKIPPED] Tapping a card goes straight to the product page (no stuck hover state)
#### [SKIPPED] The mobile filter drawer opens, filters apply, and the drawer closes
#### [SKIPPED] No horizontal scroll at 375px width

### Accessibility

#### [SKIPPED] Tab moves card to card; each focused card shows the accent outline and the reveal
#### [SKIPPED] Enter on a focused card opens the product page
#### [SKIPPED] The screen reader announces each card as a link with the product name (no "image" noise from the frames)
#### [SKIPPED] The screen reader reads the rating as "X out of 5 stars" and "N total reviews"
#### [SKIPPED] With OS "Reduce motion" on: no parallax, and the reveal swaps instantly (no animation)

### Shopify theme editor

#### [SKIPPED] All setting labels are readable text (no raw `t:sections…` keys)
#### [SKIPPED] Changing settings updates the preview without errors
#### [SKIPPED] The section can be added, reordered, and removed without errors
#### [SKIPPED] No Liquid errors are shown anywhere in the editor

### Performance / browsers

#### [SKIPPED] Chrome, Safari, and Firefox (desktop): reveal, clipping, and parallax all work
#### [SKIPPED] iOS Safari: layout and tap behaviour are correct
#### [SKIPPED] Lifestyle (2nd) images don't load until scrolled near (check the DevTools Network tab)
#### [SKIPPED] No console errors or warnings from `custom-collection.js`
