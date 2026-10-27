# QA: Custom Collection (Helmet Grid)

Feature spec: `.claude/features/full_helmet_collection/feature.md`
Implementation plan: `.claude/features/full_helmet_collection/OUTPUT-implementation-plan.md`

## How to Use This File

1. Run through the checklist after implementation. Check the items that pass; add notes on the items that fail.
2. Tell AI to read this file. It will fix the issues and reset the checklist for another round.
3. Repeat until everything passes.
4. Previous rounds are kept as a log below the current round.

**Test setup:** a dark colour scheme is selected in the section. Test on a collection page (with the default "Product grid" removed) AND on the homepage with a collection chosen in the picker.

## Current Round (Round 1)

Status: Testing

### Core behavior

- [ ] "Custom Collection" appears under Add section on the homepage, a regular page, and a collection template
- [ ] On a collection page, the section shows that collection's products (the picker setting is ignored)
- [ ] On the homepage, the section shows the products of the collection chosen in the picker
- [ ] Desktop (≥990px): 4 cards per row
- [ ] Tablet (750–989px): 3 cards per row
- [ ] Mobile (<750px): 2 cards per row
- [ ] Each card shows the notched frame outline, with the notch at the bottom-left
- [ ] The product name and price sit on one row in the bottom-right notch area; the price is in the accent colour
- [ ] Clicking anywhere on a card (image, frame, text) opens that product's page
- [ ] Changing the "Accent colour" setting changes the price colour, stars, and hover outline
- [ ] Changing the colour scheme setting changes the section's background and text colours

### Hover reveal

- [ ] Hovering a card turns the frame outline from grey to the accent colour, slowly
- [ ] Hovering a card with 2+ images grows the 2nd image up from the bottom as an oval until it fills the frame
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

- [ ] A product on sale shows the sale price in the accent colour and the original price crossed out
- [ ] A sold-out product shows a "Sold out" label and still links to the product page
- [ ] A product with reviews shows stars + review count, e.g. "(12)", below the name/price row
- [ ] A product with no reviews shows no rating row
- [ ] Turning off the "Show rating" setting hides all stars
- [ ] A very long product name is truncated with "…" on one line

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

[Empty on first generation. After each QA round, AI moves the completed round here with results preserved.]
