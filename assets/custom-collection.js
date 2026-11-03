/*
  Custom Collection — scroll parallax for the staggered helmet grid columns.
  Used by sections/section-custom-collection.liquid.

  Sets a single CSS variable (--helmet-parallax-offset) on the host element while the grid
  is on screen. Only the offset columns read it (see section-custom-collection.css).
  Desktop only (≥990px) and disabled when the user prefers reduced motion.

  The element sits inside #ProductGridContainer, so when facets.js re-renders the grid
  the old instance is disconnected (listeners removed) and a new one connects.
*/
if (!customElements.get('helmet-grid-parallax')) {
  customElements.define(
    'helmet-grid-parallax',
    class HelmetGridParallax extends HTMLElement {
      static MAX_OFFSET = 40; // px of drift in each direction

      connectedCallback() {
        this.isVisible = false;
        this.isActive = false;
        this.ticking = false;

        this.onScroll = this.onScroll.bind(this);
        this.update = this.update.bind(this);
        this.onMediaChange = this.onMediaChange.bind(this);

        this.mediaQuery = window.matchMedia('(min-width: 990px) and (prefers-reduced-motion: no-preference)');
        this.mediaQuery.addEventListener('change', this.onMediaChange);

        this.observer = new IntersectionObserver((entries) => {
          this.isVisible = entries[0].isIntersecting;
          if (this.isVisible) this.onScroll();
        });
        this.observer.observe(this);

        this.onMediaChange();
      }

      disconnectedCallback() {
        this.mediaQuery.removeEventListener('change', this.onMediaChange);
        this.observer.disconnect();
        this.disable();
      }

      onMediaChange() {
        if (this.mediaQuery.matches) {
          this.enable();
        } else {
          this.disable();
        }
      }

      enable() {
        if (this.isActive) return;
        this.isActive = true;
        window.addEventListener('scroll', this.onScroll, { passive: true });
        this.onScroll();
      }

      disable() {
        if (!this.isActive) return;
        this.isActive = false;
        window.removeEventListener('scroll', this.onScroll);
        this.style.removeProperty('--helmet-parallax-offset');
      }

      onScroll() {
        if (!this.isActive || !this.isVisible || this.ticking) return;
        this.ticking = true;
        window.requestAnimationFrame(this.update);
      }

      update() {
        this.ticking = false;

        const rect = this.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // -1 when the grid's centre is just below the viewport, 1 when it's just above it.
        const distanceFromCentre = viewportHeight / 2 - (rect.top + rect.height / 2);
        const range = viewportHeight / 2 + rect.height / 2;
        const progress = Math.max(-1, Math.min(1, distanceFromCentre / range));

        const offset = (progress * -HelmetGridParallax.MAX_OFFSET).toFixed(1);
        this.style.setProperty('--helmet-parallax-offset', `${offset}px`);
      }
    }
  );
}
