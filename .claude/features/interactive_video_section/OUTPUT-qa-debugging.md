# QA: Interactive Video

Feature spec: `.claude/features/interactive_video_section/feature.md`
Implementation plan: `.claude/features/interactive_video_section/OUTPUT-implementation-plan.md`

## How to Use This File

1. Run through the checklist after implementation. Check the items that pass; add notes on the items that fail.
2. Tell AI to read this file. It will fix the issues and reset the checklist for another round.
3. Repeat until everything passes.
4. Previous rounds are kept as a log below the current round.

**Test setup:** the real video's CDN link is in Video URL, Colour scheme is Scheme 1, and at least 3 tooltips are set. Test on a desktop-size window (≥990px) unless an item says otherwise.

## Current Round (Round 1)

Status: Testing

### Core behavior

- [ ] "Interactive Video" appears under Add section on the homepage, a regular page, and a collection template
- [ ] A newly added section starts with 3 tooltip blocks
- [ ] The headline shows above the video when filled in, and takes no space when empty
- [ ] Scrolling to the section: the stage pins to the screen and stays pinned while scrolling
- [ ] Scrolling down moves the video forwards; scrolling up moves it backwards
- [ ] The first frame shows at the start of the pin, and the last frame at the end
- [ ] After the last frame, the stage unpins and the page continues with no jump
- [ ] Short / Medium / Long clearly change how much scrolling the video takes
- [ ] No sound and no play controls appear
- [ ] Changing the colour scheme changes the background and text colours

### Scrubbing quality

- [ ] Slow scrolling looks smooth in Chrome, with no freezing or visible steps
- [ ] Slow scrolling looks smooth in Safari, with no freezing or visible steps
- [ ] Slow scrolling looks smooth in Firefox, with no freezing or visible steps
- [ ] Fast scrolling catches up quickly and doesn't get stuck
- [ ] Scrolling back and forth repeatedly doesn't lag or freeze
- [ ] The page's own scrolling stays smooth while the video scrubs
- [ ] Trackpad and mouse wheel both feel right

### Video blending

- [ ] No visible box or edge around the video against the Scheme 1 background, on a bright screen
- [ ] The whole video stays visible at 1100×700, 1440×900, and 1920×1080
- [ ] The edge fade isn't noticeable, and doesn't cut into the helmet

### Tooltips

- [ ] Each tooltip appears at its start time and disappears at its end time
- [ ] Tooltips also appear and disappear correctly when scrolling up
- [ ] Each tooltip shows its title, text, and a thin line
- [ ] Tooltips fade in and fade out, including the line, scrolling both down and up
- [ ] The X and Y sliders move the tooltip's text anywhere on the video, and the text stays inside the video at 0% and 100%
- [ ] The Line end slider sets where the line stops, on either side of the text, and a line end behind the text shows no line
- [ ] A tooltip's line stays on the same part of the helmet at 1100×700 and 1920×1080
- [ ] Overlapping times show both tooltips (and they're readable if placed apart)
- [ ] A tooltip's text fits and looks right at 990px wide

### Edge cases

- [ ] Video URL with a wrong link: no pinning, fallback image and tooltip list show, no blank area
- [ ] Video URL blank: the same fallback layout
- [ ] Fallback image empty: Mobile image 1 is used instead
- [ ] No video, images, heading, or tooltips: a hint in the theme editor, nothing on the live site
- [ ] Fewer than 3 mobile images: only the ones set are shown
- [ ] No tooltip blocks: the video still scrubs, and no list appears on mobile
- [ ] A tooltip with its end time before its start, or its start time past the video's end: never shows on desktop, no errors, and still appears in the mobile list
- [ ] A tooltip with its end time past the video's end: shows from its start time through to the last frame
- [ ] Very long tooltip text doesn't break the layout
- [ ] DevTools throttled to Slow 4G: the fallback image shows until the video is ready, and there's no blank pinned area
- [ ] Two Interactive Video sections on one page both work independently
- [ ] Scrolling back up with the header reappearing looks acceptable over the video

### Tablet and mobile

- [ ] At 800px and 375px: no pinning, three images stacked vertically
- [ ] A tooltip set to "Under mobile image 1/2/3" shows its text directly under that image
- [ ] A tooltip set to "In the list at the end", or to an image that's empty, shows in the list after the last image
- [ ] Several tooltips on one image all show under it, in block order
- [ ] With every tooltip assigned to an image, no empty list appears at the end
- [ ] At 990px and up, none of the mobile text is visible, and a screen reader still reads each tooltip once
- [ ] The video isn't requested below 990px (check the DevTools Network tab)
- [ ] The fallback image isn't downloaded separately below 990px, unless it's also Mobile image 1
- [ ] No horizontal scroll at 375px
- [ ] Resizing from 1200px to 800px and back switches layouts cleanly, with no errors, and the video resumes at the right frame
- [ ] iPhone Safari: images and list display correctly
- [ ] iPad Safari: images and list display correctly

### Performance

- [ ] The video isn't requested until the section is close to the viewport (put the section low on the page and check the Network tab)
- [ ] Mobile images aren't downloaded on desktop (check the Network tab)
- [ ] No console errors or warnings from `interactive-video.js`
- [ ] After re-rendering the section in the editor, there are no duplicate scroll listeners (`getEventListeners(window)` in the Chrome console)

### Accessibility

- [ ] With OS "Reduce motion" on: no pinning, no scrubbing, fallback image and list show, and the video isn't requested
- [ ] A screen reader reads each tooltip's title and text once, on desktop and mobile
- [ ] The video isn't announced and can't be reached by keyboard
- [ ] Tab moves through the section without getting stuck
- [ ] The mobile images use their alt text from Shopify
- [ ] With JavaScript disabled: the fallback image and list show, not a blank pinned area

### Shopify theme editor

- [ ] All setting labels are readable text (no raw `t:sections…` keys)
- [ ] A decimal time such as 2.5 saves and works
- [ ] Selecting a tooltip block jumps to that tooltip's start time and shows it
- [ ] While a tooltip block is selected, the video holds at its start time; after clicking away, scrolling controls the video again
- [ ] Moving a tooltip's sliders updates the preview
- [ ] Adding, reordering, and removing tooltip blocks causes no errors
- [ ] The limit of 8 tooltips is enforced
- [ ] The section can be added, reordered, and removed without errors
- [ ] No Liquid errors are shown anywhere in the editor

## Previous Rounds

[Empty on first generation. After each QA round, AI moves the completed round here with results preserved.]
