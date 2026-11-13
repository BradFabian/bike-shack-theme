# Implementation Plan: Interactive Video

Generated: 2026-11-03
Feature spec: `.claude/features/interactive_video_section/feature.md`
Branch: `feature/interactive-video-section`

## Summary

A new standalone section, **"Interactive Video"** (`sections/section-interactive-video.liquid`), that pins a silent video to the screen on desktop (≥990px) and scrubs it with scroll, with timed tooltips set as section blocks. Below 990px, or if the video can't play, it shows images plus the tooltip text as a list, and phones and tablets never download the video. It's a self-contained web component with no libraries and no Dawn core changes.

## Client Video Facts

Checked with `ffprobe` on `reference/Product Video with Keyframes.mp4`:

| Property | Value |
| --- | --- |
| Length | 6.57s (197 frames at 30fps) |
| Dimensions | 1920×1080 |
| File size | 12.5 MB |
| Keyframes | 197 of 197 (ideal for scrubbing; no re-encoding needed) |
| Audio | None |
| Web optimised | Yes (`moov` before `mdat`) |
| Background | About `#1f1f21`, varying by a few values between frames and corners. One corner reaches `#19191c` near the end. |

The background matches colour schemes 1 and 2 (`#1f1f21`).

Approximate video phases (estimated from a contact sheet, so confirm when timing tooltips):

| Time | Content |
| --- | --- |
| 0–1.6s | Helmet turns to face the front |
| 1.6–3.3s | Holds facing front |
| 3.3–5.5s | Wireframe overlay builds |
| 5.5–6.6s | Ends as a blue shell |

**Encoding command for any replacement video:**

```
ffmpeg -i input.mov -an -c:v libx264 -preset slow -crf 20 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart output.mp4
```

## Human-First Breakdown

### Admin Setup (human tasks in Shopify admin)

#### Upload the video to Shopify

The section plays a video from a link, so the real file has to be hosted on Shopify's CDN. We also need that link to check that Shopify serves the file unchanged.

- [ ] Go to Content → Files → Upload files, and upload `Product Video with Keyframes.mp4`
- [ ] Wait until processing finishes, then copy the file's link
- [ ] Send the link to AI for Step 1
- [ ] In the section settings, paste the link into **Video URL**

#### Prepare the images

Phones and tablets get three images instead of the video. Desktop visitors see one fallback image while the video loads, or if it can't play.

- [ ] Choose 3 mobile images and 1 fallback image. If the client has none, AI can export stills from the video for you to upload.
- [ ] Upload them through the section's image pickers

#### Get the tooltip content

Each tooltip needs words and timing. Placeholder text works during the build, but real copy is needed before launch.

- [ ] Get a title and short text per tooltip from the client (about 120 characters of text fits comfortably)
- [ ] Note each tooltip's start and end time in seconds, using the phases above as a guide
- [ ] Enter them as tooltip blocks in the section

#### Select the colour scheme

The video only blends in when the section background matches. No new scheme is needed.

- [ ] In the section settings, keep Colour scheme on Scheme 1 (or Scheme 2)

### Code Preparation (before any visitor touches the page)

1. A new section called "Interactive Video" is registered and shows up under "Add section" on every template.
2. A newly added section starts with 3 tooltips, whose placeholder text and times suit this video.
3. The optional headline is placed above the scroll area.
4. A tall scroll area is created, and its height comes from the Short / Medium / Long setting.
5. Inside it, a stage as tall as the screen is set up to pin in place.
6. Inside the stage, a video box keeps the video's shape, so tooltip positions stay on the helmet at any screen size.
7. The video element is added muted and with no source, so nothing downloads yet.
8. The fallback image is placed in the video box, on top of the video.
9. Each tooltip is placed in the video box at its chosen position, hidden.
10. The video's edges get a soft fade, so no box shows against the background.
11. The tooltip text is also output as a list. It's visible below 990px and in the fallback layout, and readable only by screen readers when the video is playing.
12. The three mobile images are added, and only show below 990px.
13. If there's no video link, the section uses the fallback layout from the start.
14. If there's nothing at all to show, a hint appears in the theme editor and nothing appears on the live site.

### Live Behavior (when a user interacts)

1. A desktop visitor scrolls towards the section, and the video starts loading shortly before it arrives.
2. The fallback image shows until the video's first frame is ready.
3. The image fades out and the video shows.
4. The headline scrolls past, and the stage pins to the screen.
5. The visitor scrolls down, and the video moves forwards, gliding slightly behind the scroll.
6. The visitor scrolls up, and the video moves backwards.
7. The video reaches a tooltip's start time, and that tooltip fades in while its line reaches towards the helmet.
8. The video passes the tooltip's end time, and the tooltip fades out.
9. The video reaches its last frame, the stage unpins, and the page continues normally.
10. A visitor on a phone or tablet sees the headline, three stacked images, and the text list. The video is never requested.
11. A visitor resizes a desktop window to below 990px, and the layout switches to images.
12. They resize back up, and the video layout returns.
13. If the video link fails, the pinning stops and the fallback image and text list show.
14. A visitor with "reduce motion" on gets the same fallback layout, and the video isn't requested.
15. In the theme editor, selecting a tooltip block jumps to that tooltip's start time, so it can be positioned.

## Files

### New Files

- `sections/section-interactive-video.liquid` — markup, dynamic styles, schema, blocks, preset
- `assets/section-interactive-video.css` — pinned layout, video box, edge fade, tooltips, list, mobile images, fallback states
- `assets/interactive-video.js` — `<interactive-video>` web component: lazy loading, scroll scrubbing, tooltip timing, error handling, theme editor support

### Modified Files

- `locales/en.default.json` — `sections.interactive_video.*` editor hint
- `locales/en.default.schema.json` — `sections.interactive_video.*` schema labels

No templates, Dawn core JS/CSS, or existing snippets are modified.

### Theme Components Reused

- `.page-width` — headline and list width
- `.title-wrapper`, `.title`, `.inline-richtext`, heading size classes — headline
- `.color-{{ scheme }}`, `.gradient` — colour scheme
- `.isolate` — stacking context on the stage content
- `.visually-hidden` — screen-reader copy of the list
- `t:sections.all.colors.label`, `t:sections.all.padding.*`, `t:sections.all.heading_size.*` — shared schema labels
- `assets/custom-collection.js` — pattern for the guarded `customElements.define`, `matchMedia`, `IntersectionObserver`, `requestAnimationFrame` batching, and cleanup

## Build Steps

### Step 1: Check the file on Shopify's CDN

**Do:** Confirm the uploaded video reaches browsers unchanged. No theme code in this step.
**Files:** None
**Details:**
- Needs the CDN link from the admin setup.
- Run `ffprobe` against the URL and compare with the Client Video Facts: 197 frames, 197 keyframes, no audio, same dimensions.
- Use `curl -sI` to check the file size, `Content-Type: video/mp4`, and `Accept-Ranges: bytes` (seeking needs range requests).
- Record the results in this plan's Implementation Notes.

**Verify:** The keyframe count and size match the original. If they don't, stop and decide on a fix before building: try a different link format, or test the Shopify video picker's original source.

### Step 2: Section skeleton, settings, and translations

**Do:** Create the section with asset loading, the padding style block, an empty wrapper, the full schema, and all translation keys. Create the CSS file and a guarded JS stub.
**Files:** `sections/section-interactive-video.liquid`, `assets/section-interactive-video.css`, `assets/interactive-video.js`, `locales/en.default.json`, `locales/en.default.schema.json`
**Details:**
- Load `section-interactive-video.css` with `stylesheet_tag`, then `<script src="{{ 'interactive-video.js' | asset_url }}" defer="defer"></script>`.
- Padding block uses the theme standard: `times: 0.75` on mobile, full value at `min-width: 750px`.
- Schema: `"tag": "section"`, `"class": "section"`, `"disabled_on": { "groups": ["header", "footer"] }`.
- Settings, in order:
  - `video_url` (`text`), with info text on the encoding requirement and the matching background
  - `fallback_image` (`image_picker`)
  - `mobile_image_1`, `mobile_image_2`, `mobile_image_3` (`image_picker`)
  - `heading` (`inline_richtext`, no default, so it's optional)
  - `heading_size` (select, `h2` / `h1` / `h0`, as Dawn's other sections do)
  - `scroll_length` (select `short` / `medium` / `long`, default `medium`)
  - `color_scheme` (default `scheme-1`)
  - padding header, then `padding_top` / `padding_bottom` (0–100, step 4, default 36)
- Block `tooltip`, `"limit": 8`:
  - `title` (`text`), `text` (`textarea`, with info suggesting about 120 characters)
  - `start_time`, `end_time` (seconds)
  - `side` (select `left` / `right`)
  - `target_x`, `target_y` (range 0–100, step 1, `%`)
- **Test here:** whether the `number` setting type accepts a decimal such as 2.5 (not confirmed in Shopify's docs). If it doesn't, use `text` for the two times and parse them in JS with `parseFloat`. Record the result.
- Preset `"name": "t:sections.interactive_video.presets.name"`, with 3 tooltip blocks whose times fit this video: about 1.8–3.2, 3.4–4.9, and 5.0–6.4. Alternate the sides.
- Block `title` and `text` have translated schema defaults, as Dawn's blocks do.
- JS file: guarded `customElements.define` stub only.

**Verify:** "Interactive Video" appears under Add section on the homepage, a page, and a collection template, with 3 tooltip blocks. All settings show proper labels (no raw `t:` strings). No Liquid errors. A decimal time saves correctly.

### Step 3: Pinned layout and video box

**Do:** Build the desktop structure and CSS, with no scrubbing yet.
**Files:** `sections/section-interactive-video.liquid`, `assets/section-interactive-video.css`
**Details:**
- Wrapper: `<div class="interactive-video-section color-{{ section.settings.color_scheme }} gradient section-{{ section.id }}-padding">`.
- Headline: `{%- unless section.settings.heading == blank -%}` with `.page-width` > `.title-wrapper.title-wrapper--no-top-margin` > `<h2 class="title inline-richtext {{ heading_size }}">`. Scroll-reveal classes may go on the headline only, never on an ancestor of the stage.
- Structure:
  ```
  <interactive-video class="interactive-video interactive-video--{{ scroll_length }}" data-video-url="{{ video_url | escape }}">
    <div class="interactive-video__stage">           ← position: sticky; top: 0; height: 100vh
      <div class="interactive-video__box">           ← keeps the video's aspect ratio
        <video muted playsinline preload="none" disablepictureinpicture aria-hidden="true" tabindex="-1">
        <img class="interactive-video__poster">      ← fallback image
        tooltips (Step 5)
      </div>
    </div>
  </interactive-video>
  ```
- Only render the stage when `video_url` isn't blank.
- Scroll area height at ≥990px: short `200vh`, medium `300vh`, long `400vh`. Tune against the real video.
- Box size: `--video-ratio` defaults to `16 / 9`. Use `width: min(100%, calc(100vh * var(--video-ratio)))` with `aspect-ratio: var(--video-ratio)`, centred in the stage. The JS updates the ratio from the video's real dimensions in Step 4.
- Video: `width: 100%; height: 100%; object-fit: contain`.
- Edge fade on the video: linear-gradient `mask-image` on both axes with `mask-composite: intersect` (plus `-webkit-` versions), fading about 4% at each edge.
- Poster: `image_url: width: 1920 | image_tag`, `alt: ''`, `sizes: '100vw'`, absolutely positioned over the video. Fades out on `.is-ready`.
- Fallback image variable: `assign fallback = section.settings.fallback_image | default: section.settings.mobile_image_1`.

**Verify:** With a video URL set, scrolling pins the stage for the chosen length, then releases it. The poster stays centred at 1100×700, 1440×900, and 1920×1080. The whole box is visible. Short / Medium / Long change the length. **This is also the browser check that nothing in the theme stops pinning.**

### Step 4: Scroll scrubbing (go/no-go gate)

**Do:** Build the component that loads the video and drives it from scroll.
**Files:** `assets/interactive-video.js`
**Details:**
- `connectedCallback`:
  - `matchMedia('(min-width: 990px) and (prefers-reduced-motion: no-preference)')` with a change listener. Same pattern as `custom-collection.js`.
  - Loading observer: `IntersectionObserver` with `rootMargin: '100% 0px'`. On first intersection, and only while the media query matches, set `video.src`, `preload = 'auto'`, and call `load()`.
  - Visibility observer: runs the frame loop only while the section is on screen.
- `disconnectedCallback`: remove every listener, disconnect the observers, cancel the animation frame, and clear the video's `src`.
- Video events:
  - `loadedmetadata`: store `duration`, and set `--video-ratio` from `videoWidth` / `videoHeight`.
  - `loadeddata`: add `.is-ready`.
  - `error`: handled in Step 7.
- Progress: `-rect.top / (rect.height - stage.offsetHeight)`, clamped to 0–1, with one `getBoundingClientRect()` per frame. Target time is `progress * duration`.
- Smoothing: each frame, move the displayed time part of the way to the target (start with 0.12 per frame), snapping when it's within about 1/60s.
- Seek safely: set `video.currentTime` only if `!video.seeking`, so seeks can't stack up in Safari.
- Stop requesting frames when the time has settled and restart on scroll.
- If a browser won't paint the first frame until playback starts (known in some Safari versions; not yet tested here), add a `play().then(pause)` on load.
- No globals, no `console.log`.

**Verify (go/no-go):** You scrub up and down, slowly and quickly, in Chrome, Safari, and Firefox with the real CDN file. It should feel smooth, with no freezing or lag, and no scroll stutter on the page itself.

**If it isn't smooth:** first try fetching the whole file into a blob URL, which needs the CDN to allow cross-origin fetches (not yet checked). The last resort is the image sequence, which would need your approval, since it changes the settings. Don't start Step 5 until this passes.

### Step 5: Tooltips

**Do:** Render tooltips from blocks and show them by video time.
**Files:** `sections/section-interactive-video.liquid`, `assets/section-interactive-video.css`, `assets/interactive-video.js`
**Details:**
- Markup, per `tooltip` block, inside the box:
  ```liquid
  <div
    class="interactive-video__tooltip interactive-video__tooltip--{{ block.settings.side }}"
    data-start="{{ block.settings.start_time }}"
    data-end="{{ block.settings.end_time }}"
    style="--target-x: {{ block.settings.target_x }}%; --target-y: {{ block.settings.target_y }}%;"
    aria-hidden="true"
    {{ block.shopify_attributes }}
  >
    <span class="interactive-video__tooltip-line"></span>
    <div class="interactive-video__tooltip-content"><p title>…</p><p text>…</p></div>
  </div>
  ```
  Inline custom properties match the theme's existing `style="--animation-order"` pattern.
- Text column: `width: 28%` at the box's left or right edge. Vertically centred on `--target-y`, clamped so it stays inside the box.
- Line: 1px, `rgba(var(--color-foreground), 0.5)`, horizontal at `--target-y`, running from the text column's inner edge to `--target-x`. Width calculated with `max(0%, …)`, so a target behind the text shows no line.
- Reveal: `opacity` and a small `translateY` on the content, with `transform: scaleX()` on the line, origin at the text side. About 0.5s ease. Toggled by `.is-visible`.
- JS: in the frame loop, add `.is-visible` when `start <= time < end`, using the displayed time so tooltips stay in sync. Only touch the class when the state changes.
- Tooltips stay hidden until `.is-ready`.
- Typography: title `1.6rem` in the body font, bold; text `1.4rem`, `rgba(var(--color-foreground), 0.75)`.

**Verify:** Each preset tooltip appears and disappears at its times, scrolling both ways. Left and right sides work. The sliders move the line's end point, and it stays on the same part of the helmet at 1100×700 and 1920×1080. A tooltip with end before start, or past the video's end, never shows and causes no errors.

### Step 6: Text list and mobile images

**Do:** Build the list and the layout below 990px.
**Files:** `sections/section-interactive-video.liquid`, `assets/section-interactive-video.css`
**Details:**
- Mobile images, inside `.interactive-video__images`, for each of the three that's set:
  - `image_url: width: 1500 | image_tag`
  - `widths: '375, 550, 750, 1100, 1500'`, `sizes: '100vw'`, `loading: 'lazy'`
  - `alt: image.alt | escape`
- List: `<ul class="interactive-video__list list-unstyled" role="list">` inside `.page-width`, one `li` per tooltip with a title and text. Skip it if there are no blocks.
- Visibility:
  - Below 990px: stage hidden, scroll area height `auto`, images and list visible.
  - At ≥990px with the video running: images hidden; list gets the same CSS as `.visually-hidden`, so screen readers still reach it.
- `display: none` lazy images aren't fetched, so the unused layout's images shouldn't download. Confirm in the Network tab.
- Video tooltips are `aria-hidden` because the list is the accessible version, so text isn't announced twice.

**Verify:** At 375px and 800px: no pinning, images stacked, list below them, no horizontal scroll. In the Network tab, the video isn't requested. A screen reader reads each tooltip once on desktop.

### Step 7: Failure handling and fallback layout

**Do:** Make every failure case end in a working layout.
**Files:** `sections/section-interactive-video.liquid`, `assets/section-interactive-video.css`, `assets/interactive-video.js`
**Details:**
- Fallback layout at ≥990px: scroll area height `auto`, stage hidden, `.interactive-video__fallback` (image) and the list visible.
- Triggers:
  - Video URL blank: Liquid adds `interactive-video--fallback`.
  - Video `error` event (broken or deleted link): JS adds `interactive-video--fallback` and stops the frame loop.
  - `prefers-reduced-motion: reduce`: CSS media query, with the same rules, and no video request.
  - No JavaScript: use the theme's existing no-JS class approach (`no-js-hidden`). Confirm the exact class in `layout/theme.liquid` first.
- Resizing across 990px: on a media query change, stop or start the frame loop. Load the video on first need only, and don't clear it on the way down.
- Fallback image rendered once for the stage poster, and once in `.interactive-video__fallback`. Lazy-load the latter.
- Nothing to show (no video, no images, no heading, no tooltips): show `sections.interactive_video.empty` in `request.design_mode`, and nothing on the live site.
- Slow connection: the poster stays pinned until `.is-ready`.

**Verify:** Each of these ends in a clean layout with no console errors: a wrong URL, a blank URL, OS reduced motion, and DevTools offline before the video loads. Fallback image set; empty (uses Mobile image 1); both empty.

### Step 8: Theme editor support

**Do:** Make setup easy, and keep the section stable in the editor.
**Files:** `assets/interactive-video.js`
**Details:**
- Only when `window.Shopify?.designMode`:
  - On `shopify:block:select`, if `event.target` is one of this instance's tooltips, scroll the page so the video lands on that tooltip's `data-start`, and pin the tooltip visible with `.is-selected`.
  - On `shopify:block:deselect`, remove it.
  - Remove these listeners in `disconnectedCallback`.
- The editor scrolls to selected blocks itself, which may fight with this scroll. If it does, freeze the video at the start time instead of scrolling. Test both.
- Changing a setting re-renders the section, which runs `disconnectedCallback`, then `connectedCallback` on the new element.
- Tooltip positions must be set with the theme editor at desktop width.

**Verify:** Selecting each tooltip block shows that tooltip at the right frame. Moving the sliders updates the line without a jump. Adding, reordering, and removing blocks causes no errors.

### Step 9: Final review

**Do:** Check everything against the project rules.
**Files:** All new files, plus both locale files
**Details:**
- Search the new files for hardcoded English and move it to settings or locales.
- Two sections on one page work independently, with no shared state.
- Check `getEventListeners(window)` in Chrome before and after a section re-render, to confirm there are no duplicate listeners.
- Remove any `console.log`.
- Run `shopify theme check` on the new files, if available.
- Check that the JS validates and the schema JSON parses.

**Verify:** The QA checklist is ready to run.

## Risks & Considerations

- **Safari seeking:** the most likely place for scrubbing to stutter, and the reason Step 4 is a gate.
- **Shopify CDN:** not yet confirmed to serve the file unchanged, with range requests. Step 1 checks this before any code.
- **Sticky pinning:** I found no `overflow` rule on the body in `base.css`, but that isn't proof. Step 3 confirms it in a browser. Don't add `overflow`, `transform`, or scroll-reveal classes to the stage's ancestors.
- **Scroll-up header:** the header (`on-scroll-up`) can cover the top of the pinned video when scrolling back. Accepted if it looks fine in testing, since it's temporary. The alternative is reserving header space, which shrinks the video.
- **Colour matching:** browsers can render video colours slightly differently from CSS colours. The edge fade should hide this. Check it on a bright monitor.
- **Scheme coupling:** the blend only works when the section's scheme matches the video background. A new video with a different background needs a different scheme.
- **Tooltip space:** about 280px per tooltip at 990px. The settings suggest a text length, but it's not enforced, so long text may look cramped.
- **Page weight:** 12.5 MB for desktop visitors who reach the section, even if they only scrub part of it. The lazy loading limits this to those near the section.
- **Video replacement:** a new video must use the encoding command above, or scrubbing will stutter. The setting's info text says so. A different length also means re-timing the tooltips.
- **Repo size:** the two videos in `reference/` total about 21 MB. Recommend keeping them out of git; the user decides at commit time.

## Open Questions

- Tooltip copy and count from the client. Not a blocker; placeholder text works during the build.
- Mobile images: use the three `mobile-helmet-*.jpeg` files in `reference/` for now. Decide after QA whether to export 1080×1080 replacements from the video, because these are 500×500 and `mobile-helmet-side.jpeg` shows faint video player controls.
- Fallback image: not chosen yet.
- ~~Mobile tooltips: rethink the list below the images.~~ Resolved 2026-11-13: per-tooltip "Mobile placement" setting (see Implementation Notes).
- Whether the `number` setting accepts decimals (answered in Step 2).

## Implementation Notes

### Step 1: CDN check (2026-11-04) — passed

Video URL: `https://cdn.shopify.com/videos/c/o/v/5ed94fa7f455407fa1ed82dd4fa6e43f.mp4`

- The SHA-256 matches the local file, so Shopify serves the upload byte-for-byte unchanged.
- 1920×1080, 30fps, H.264 High, `yuv420p`, 6.57s, 12,542,679 bytes, no audio.
- 197 frames, 197 keyframes. `moov` comes before `mdat` (faststart).
- `Content-Type: video/mp4`, `Accept-Ranges: bytes`, and a range request returns 206.
- `Access-Control-Allow-Origin: *`, so the blob URL fallback in Step 4 can fetch it.
- Cached for a year (`max-age=31557600`), so a replacement video should be uploaded as a new file with a new link rather than expected to refresh at this URL.
- Not yet tested: scrubbing in real browsers. That's the Step 4 go/no-go gate.

### Step 2: Skeleton, settings, translations (2026-11-04) — built, awaiting editor check

- Created the section, CSS, and JS stub, and added the translation keys. The schema and locale JSON parse, and all 37 `t:` keys resolve.
- Times use the `number` type. The preset contains decimals (1.8, 3.2) as the test. If Shopify rejects them, switch both times to `text` and use `parseFloat` in JS.
- The section appears and adds with 3 tooltips on the homepage, with readable labels (user's screenshot). The decimal check and the other templates are still open; the preset's decimals caused no error when adding the section.

### Step 3: Pinned layout and video box (2026-11-04) — built, awaiting browser check

- Added the headline, scroll area, sticky stage, video box, poster, and edge fade.
- The scroll-length class is only added when there's a video URL, so a blank URL can't leave a tall empty area.
- The stage is hidden below 990px now rather than in Step 6, and the poster is lazy-loaded, so it isn't fetched there. The section is blank below 990px until Step 6.
- The edge fade also covers the poster (the plan only had the video), because the poster's background isn't an exact match either.

### Step 4: Scroll scrubbing (2026-11-04) — built, go/no-go test pending

- Added lazy loading, the frame loop, smoothing (0.12 per frame), and safe seeking.
- The `play().then(pause)` first-frame workaround is deliberately left out until Safari shows it's needed.
- A broken video link keeps the poster pinned until Step 7 adds the fallback.
- Go/no-go results from the user: Safari "works flawlessly"; Chrome smooth both ways, so `SMOOTHING` stays at 0.12. User confirmed desktop looks great in Chrome, Safari, and Firefox. **Gate passed.**

### Steps 5 and 6: Tooltips, images, and text list (2026-11-04) — built, awaiting browser check

- Built together at the user's prompting; both are independent of each other.
- Changed from the plan: a tooltip whose end time is past the video's end now shows through to the last frame, rather than never showing, because that's what someone entering it would expect. It still never shows if its start time is past the end, or its end is before its start. The QA item is updated to match.
- Added: a block with no title and no text is skipped in both the tooltips and the list, so it can't show a line with nothing attached.
- Mobile images use `image_tag`'s default alt text from Shopify; confirm in QA.
- The text clamp assumes about 16rem of tooltip height. Much longer text could run past the box near the top or bottom.
- Preset target positions are placeholders until the real tooltips are positioned.

### Tooltip positioning and fade (2026-11-04) — user request, replaces the Step 5 design above

- `side`, `target_x`, and `target_y` are replaced by `position_x`, `position_y` (the centre of the text), and `line_end`. The text can now sit anywhere on the video instead of being locked to the left or right edge.
- The line stays horizontal, at the text's height, and its direction comes from whether `line_end` is left or right of `position_x`. Alternative considered: a separate line target X and Y with an angled line, which would add a fourth slider and more drawing code. Not built unless QA asks for it.
- The whole tooltip now fades over 0.6s, replacing the text's slide and the line's draw-in.
- The fade is time-based, so a fast scroll past a tooltip still shows a brief partial fade.

### Mobile tooltip placement (2026-11-13) — user request after QA on the unpublished theme

- The user's QA passed on desktop and mobile. Their one request: mobile tooltips should be configurable like desktop.
- Chosen (user picked the recommended option): one `mobile_image` select per tooltip, placing its text under mobile image 1, 2, or 3, or in the list at the end (default). Rejected: a full desktop-style overlay on mobile (4 more settings, about 105px of text width at 375px, covers the helmet, every tooltip positioned twice) and an image plus pointer dot (3 more settings, still positioned twice).
- A tooltip assigned to an empty image falls back to the end list, so text is never lost.
- Markup is now two copies: `.interactive-video__mobile` (images, captions, remaining list; hidden at 990px and up) and `.interactive-video__desktop-list` (all tooltips, visually hidden at 990px and up for screen readers; `display: none` below). Each viewport exposes the text once.
- New snippet `snippets/interactive-video-tooltip-text.liquid` renders a tooltip's title and text for all three places.
- Step 7 note: the desktop fallback layout should make `.interactive-video__desktop-list` visible.
- This replaces the Open Questions item on mobile tooltips.
