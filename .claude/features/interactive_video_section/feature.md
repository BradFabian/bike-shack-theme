# [Feature Name]

## Brief

Our client is looking for a customized section that is a scroll-driven video. Very similar to how Apple has the example on their old AirPods 4 website. I have a reference video in the reference folder under interactive video section. The behaviors that we want is a video playback that is driven by a scroll position. We want tooltips that appear at specific frame rates to highlight key product features. On mobile, I want the video to be replaced with a static image, three images that display vertically. I would like customizer settings to include a video URL text input so I can put in the Shopify CDN link for the video, a mobile fallback images, so the image picker times three, a headline above the section, which is an optional text field, and tooltip configuration so they can have text content, timing per tooltip, ideally as the section blocks.

---

## Scoping Questions

Generated: 2026-11-03
Chosen approach: Custom section with a real `<video>`, scrubbed by scroll and specially encoded so seeking is smooth. A new section with a small web component. No changes to Dawn core files.

### Q1: How should the video be added in the customizer?

Your brief asks for a text field where you paste the CDN link. Shopify also has a video picker that chooses from Content → Files. Shopify's docs say its videos can include the original file, lower-resolution versions, and a streaming playlist. Either way, we need to confirm the browser receives the specially encoded version, so we'll test this first.

- [Lts go with this selection but include a fall back image if video url is broken] a) Text field for the CDN link, as briefed. Direct control of the file, but a mistyped or deleted link breaks the section (recommended, pending the test).
- [ ] b) Shopify video picker. Harder to get wrong, but we must confirm it can deliver the original file.
- [ ] c) Decide after the encoding test.

**Notes:**

### Q2: Do we have the client's final video yet?

This decides what we build and test with. The ideal video is silent, shows the product turning against a plain background, and is roughly 5–15 seconds long. The attached Apple recording only shows the behaviour; it can't be used as the source, because it's a screen recording of Apple's page.

- [x] a) Yes, the final video is available.
- [ ] b) Not yet. Build with a placeholder clip and swap in the final video before launch.
- [ ] c) No, and nobody has been asked to make it yet. (This blocks launch, so it's worth raising with the client now.)

**Notes:**  
Video length, dimensions, and who owns the export:

### Q3: How should the video fit on screen?

The reference keeps the whole product visible, with empty space for the tooltips. A full-screen crop looks more dramatic but can cut off the product at some screen sizes, which also moves it away from the tooltip lines.

- [X , backgorund video so sound is striped and dont need play controls] a) Contained: the whole video is always visible, centred, and blends into the section background (recommended, matches the reference).
- [ ] b) Full screen: the video fills the screen and is cropped to fit.

**Notes:**  
For (a), the video's background must exactly match the section's colour scheme or a visible box appears. Current schemes are dark `#1f1f21` (scheme 1 and 2) and white `#ffffff` (scheme 3). Which background will the video have?

### Q4: How should each tooltip's timing be entered?

Your brief mentions frames, but seconds are easier to read from any video player and don't depend on the frame rate.

- [x] a) Start and end time in seconds, e.g. 2.5 to 4.0 (recommended).
- [ ] b) Start and end as a percentage of the scroll, e.g. 20% to 35%. Survives a video length change, but it's harder to work out.
- [ ] c) Frame numbers. Exact, but needs the frame rate and an editing tool to find them.

**Notes:**

### Q5: What does a tooltip contain, and how is it positioned?

In the reference, each tooltip has a bold title, short text, and a thin line pointing at the product. Because the product moves, the line's target has to be set per tooltip.

- [x] a) Title + text + line. Settings: which side the text sits on, plus horizontal and vertical sliders for the point the line touches (recommended, matches the reference).
- [ ] b) Title + text, no line. Settings: side and vertical position only. Simpler to set up, but less precise.

**Notes:**  
How many tooltips do you expect per video? Do they ever overlap in time?

### Q6: How long should the section stay pinned while scrolling?

This controls how much scrolling it takes to play the whole video. More scroll feels slower and more deliberate, but too much feels like the page is stuck.

- [x] a) A simple Short / Medium / Long setting (recommended).
- [ ] b) Fixed length, chosen by me and tuned to the video.
- [ ] c) A precise slider.

**Notes:**

### Q7: Which screen sizes get the video, and which get the images?

Your brief says mobile gets images. Tablets are the open question: side-by-side tooltips get cramped, and scrubbing is likely to be least reliable on iPads, since it depends on how Safari seeks. I haven't tested this.

- [x] a) Video at 990px and up; images below that, including tablets (recommended).
- [ ] b) Video at 750px and up, including tablets; images on phones only. Needs more testing.

**Notes:**

### Q8: What happens to the tooltip text on mobile?

The brief doesn't cover this. If tooltips are dropped, phone visitors lose the feature highlights entirely, and on many stores that's most of the traffic.

- [x] a) Reuse the tooltip titles and text as a simple list below the three images. No extra settings (recommended).
- [ ] b) Add a separate caption setting to each of the three images. More control, but more to fill in.
- [ ] c) Images only, with no feature text on mobile.

**Notes:**

### Q9: What text appears around the video?

The brief asks for an optional headline. The reference also has a small label above the headline, a paragraph below it, and a closing caption under the product.

- [x] a) Optional headline only, as briefed (recommended for v1).
- [ ] b) Optional headline + optional intro paragraph.
- [ ] c) Optional headline + optional intro paragraph + optional closing caption.

**Notes:**

### Q10: Build order for text and settings?

- [x] a) Set up schema settings and translations from the start (recommended: the brief already defines them).
- [ ] b) Hardcode first for a quick prototype, convert to settings afterwards.

**Notes:**

---

### Recommendations

- **Test the risky part first.** Before building the full section, encode a short clip, upload it to Shopify Files, and scrub it in Chrome, Safari, and Firefox. Shopify's docs don't tell us how the direct link behaves here, so we need to test it. If it isn't smooth, we find out before investing in the rest.
- **Encoding:** the file needs a keyframe on every frame (or very close to it), no audio, and web-optimised MP4 settings. I'll supply the exact `ffmpeg` command. Expect a noticeably larger file than a normal export, so keeping the video short and sensibly sized matters.
- **Don't load the video on phones.** The file should only be requested on screens that show it, and only as the section nears the viewport. Otherwise phone visitors download a large file they never see.
- **Fallbacks:** if the video fails to load, or the visitor has "reduce motion" turned on, show the three images and the tooltip text instead of a blank pinned area. This means the images should be filled in even if the client thinks of them as mobile-only.
- **Reuse the file pattern:** `sections/section-interactive-video.liquid`, `assets/section-interactive-video.css`, and `assets/interactive-video.js` (a `<interactive-video>` web component). Scroll work is batched with `requestAnimationFrame`, and listeners are cleaned up in `disconnectedCallback`, following the helmet grid's parallax component.
- **Sticky header:** the store's header is set to reappear on scroll up, so it can slide over the top of the pinned video when a visitor scrolls back. The layout needs to allow for this.
- **Pinning:** I found no `overflow` rule on the page body in `base.css` that should stop pinning, but this still needs confirming in a browser.
- **Theme editor:** the preview should still work when a setting changes, and selecting a tooltip block should ideally jump the video to that tooltip's time so the client can position it. That's a small addition that makes setup much easier.
- **Accessibility:** tooltip text should exist in the page for screen readers, not only appear visually at a certain scroll position. The video is decorative, and it has no sound, so it needs no controls or captions.

## Extended Brief

Generated: 2026-11-03

### Chosen Approach

A new standalone "Interactive Video" section with a silent background `<video>` scrubbed by scroll. It's a custom section and small web component, with no libraries and no Dawn core changes. Chosen over an image sequence because the client can swap one video without a developer, and over an autoplay video because scroll-driven playback is the core request.

### Requirements

- **Desktop (≥990px):**
  - The optional headline scrolls in and away normally, then the video pins to the screen.
  - Scroll position drives the video: scrolling down moves it forwards, and scrolling up reverses it.
  - After the last frame, the section unpins and the page continues normally.
  - The whole video stays visible and centred, and it blends into the section background.
  - The video is muted, with no audio track and no play controls.
- **Tooltips (desktop):**
  - Each one fades in and out at its own start and end time.
  - Each has a bold title, short text, and a thin line pointing at the product.
  - Up to 8 tooltips. They may overlap if their times overlap.
- **Below 990px (tablets and phones):**
  - The three images stack vertically.
  - Tooltip titles and text appear as a simple list below the images.
  - The video file is never requested.
- **Fallback (desktop):** if the video can't play, or the visitor has "reduce motion" on, there's no pinning. The fallback image shows, with the tooltip text listed below it.
- **Video loading:** the video is only requested as the section nears the viewport. The fallback image shows until it's ready.

### Where It Lives

- New section added through "Add section" in the theme editor. It has a preset and isn't restricted to any template; only the header and footer groups are excluded.
- The page or template it launches on isn't part of this build.

### Data Sources

| Data | Source |
| --- | --- |
| Video | CDN link pasted into a text setting, from Shopify Content → Files |
| Fallback and mobile images | `image_picker` settings |
| Headline | Section setting |
| Tooltip content, timing, and position | Section blocks |

### User Interaction

- **Desktop:** scrolling scrubs the video forwards and backwards, and tooltips fade in and out at their times. There's nothing to click.
- **Below 990px:** a normal vertical scroll through the images and list.
- **Theme editor:** selecting a tooltip block jumps the video to that tooltip's start time, so it's easy to position.
- **Screen readers:** tooltip text is available in the page regardless of scroll position. The video is decorative.

### Customizer Settings

**Section:**

- Video URL (text)
- Desktop fallback image
- Mobile images 1, 2, and 3
- Headline (optional) and heading size
- Scroll length: Short / Medium / Long
- Colour scheme
- Padding top / bottom (theme standard: 0–100, step 4, 0.75× on mobile)

**Tooltip block (limit 8):**

- Title
- Text
- Start time and end time, in seconds
- Side: left or right
- Horizontal and vertical sliders for the point the line touches

**Not configurable:** animation timing, line style, the 990px switch point, exact scroll distances.

All labels and storefront text use translation keys or settings, set up from the start.

### Decisions Made

| Decision | Reasoning |
| --- | --- |
| Real video scrubbed by scroll | Matches the brief and is easy for the client to replace |
| Specially encoded video | Normal exports stutter when scrubbed |
| Encoding test comes first | Shopify's docs don't confirm how a pasted CDN link behaves, so this is the biggest risk |
| Text field for the video URL, plus a fallback image | Briefed; the fallback covers broken or deleted links (user request) |
| The fallback image also shows while the video loads | Avoids a blank area and a second setting |
| Silent background video with no controls | User decision |
| Contained, not full screen | Keeps the whole product visible and tooltip lines accurate |
| Timing in seconds | Easy to read from any video player, and doesn't depend on the frame rate |
| Title + text + line, with position sliders | Matches the reference; the product moves, so each line needs its own target |
| Short / Medium / Long scroll length | Simple for the client; no pixel-level control |
| Video at 990px and up, images below | Tooltips get cramped on tablets, and iPad scrubbing is likely the least reliable |
| Tooltip text reused as a list below 990px | Mobile visitors keep the feature highlights, with no extra settings |
| Headline only | As briefed for v1 |
| Settings and translations from the start | The brief already defines them |

### Edge Cases to Handle

- **Video URL broken or blank:** use the fallback layout. A theme-editor hint is useful when it's blank.
- **Reduced motion:** use the fallback layout, with no pinning.
- **No fallback image set:** use Mobile image 1. If that's empty too, show a theme-editor hint and nothing on the live site.
- **Fewer than 3 mobile images:** show the ones that are set.
- **Tooltip end time before its start, or past the end of the video:** it may never show on desktop, but its text still appears in the list and to screen readers.
- **No tooltips:** the video still scrubs, and no list appears.
- **Resizing across 990px:** switch cleanly between layouts, and don't request the video until it's needed.
- **Sticky header:** it reappears on scroll up, so the layout must allow for it sliding over the pinned video.
- **Slow connection:** the fallback image stays until the video can play, with no blank pinned area.
- **Multiple copies on one page:** each instance must work independently, with no global state.
- **Theme editor:** the section must keep working when settings change or blocks are reordered.
- **Listeners:** scroll work is batched with `requestAnimationFrame`, and listeners are cleaned up in `disconnectedCallback`.

### Out of Scope

- Sound and play controls
- The small label above the headline, an intro paragraph, and a closing caption
- Video on tablets and phones
- An image-sequence (canvas) version
- A Shopify video picker
- Choosing the launch page or template

### Dependencies

- **The client's final video**, encoded with a keyframe on every frame (or close to it), no audio, and web-optimised MP4 settings, then uploaded to Shopify Files. The `ffmpeg` command is supplied during the build.
- **A colour scheme matching the video's background.** Current schemes are dark `#1f1f21` and white `#ffffff`.
- **Dawn base files, reused unchanged:** `base.css` utilities and grid, and shared `t:` schema labels.

### Notes

- **Files, per project conventions:**
  - `sections/section-interactive-video.liquid`
  - `assets/section-interactive-video.css`
  - `assets/interactive-video.js` (`<interactive-video>` web component)
  - New keys in `locales/en.default.json` and `locales/en.default.schema.json`
- **To verify during planning:** whether Shopify's `number` setting accepts decimals such as 2.5. A text setting is the fallback.
- **To verify in a browser:** that nothing in the theme stops the video pinning. No `overflow` rule on the page body was found in `base.css`.
- **Reference:** `reference/Apple Website.mov` shows the behaviour only and can't be used as the source video.

### Needs Client Clarification

- **Video background colour:** must exactly match a colour scheme, or a visible box appears around the video.
- **The final video file:** marked as available in Q2, but not yet in the `reference` folder. Its length, dimensions, and export owner are still unknown, and it's needed for the encoding test.
- **Tooltip count and overlaps:** not confirmed, so the spec assumes up to 8, with overlaps allowed.

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# feature.md — v1.0

# AI Shopify Developer Bootcamp

# by Coding with Jan

# https://codingwithjan.com

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
