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
