/*
  Interactive Video — scrubs a silent video with scroll and shows timed tooltips.
  Used by sections/section-interactive-video.liquid.

  The stage is pinned by CSS (position: sticky). This component maps the scroll position
  across the pinned area to the video's time. The video is never played, only seeked.
  Desktop only (≥990px) and disabled when the user prefers reduced motion, so the video
  isn't requested on phones and tablets.
*/
if (!customElements.get('interactive-video')) {
  customElements.define(
    'interactive-video',
    class InteractiveVideo extends HTMLElement {
      static SMOOTHING = 0.12; // share of the remaining distance covered each frame
      static SNAP_DISTANCE = 1 / 60; // seconds; closer than this jumps straight to the target

      connectedCallback() {
        this.stage = this.querySelector('.interactive-video__stage');
        this.video = this.querySelector('.interactive-video__video');
        if (!this.stage || !this.video) return; // No video URL set

        this.tooltips = Array.from(this.querySelectorAll('.interactive-video__tooltip')).map((element) => ({
          element,
          start: parseFloat(element.dataset.start),
          end: parseFloat(element.dataset.end),
          isVisible: false,
        }));

        this.isNear = false;
        this.isVisible = false;
        this.hasRequestedVideo = false;
        this.duration = 0;
        this.displayedTime = 0;
        this.lastSeekTime = null;
        this.frameId = null;

        this.wake = this.wake.bind(this);
        this.tick = this.tick.bind(this);
        this.onMediaChange = this.onMediaChange.bind(this);
        this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
        this.onLoadedData = this.onLoadedData.bind(this);

        this.video.addEventListener('loadedmetadata', this.onLoadedMetadata);
        this.video.addEventListener('loadeddata', this.onLoadedData);

        this.mediaQuery = window.matchMedia('(min-width: 990px) and (prefers-reduced-motion: no-preference)');
        this.mediaQuery.addEventListener('change', this.onMediaChange);

        // Starts the download one screen before the section arrives.
        this.loadObserver = new IntersectionObserver(
          (entries) => {
            this.isNear = entries[0].isIntersecting;
            this.requestVideo();
          },
          { rootMargin: '100% 0px' }
        );
        this.loadObserver.observe(this);

        // Keeps the frame loop off while the section is out of view.
        this.visibilityObserver = new IntersectionObserver((entries) => {
          this.isVisible = entries[0].isIntersecting;
          this.wake();
        });
        this.visibilityObserver.observe(this);

        this.onMediaChange();
      }

      disconnectedCallback() {
        if (!this.mediaQuery) return;

        this.mediaQuery.removeEventListener('change', this.onMediaChange);
        this.loadObserver.disconnect();
        this.visibilityObserver.disconnect();
        this.removeScrollListeners();
        this.stopLoop();

        this.video.removeEventListener('loadedmetadata', this.onLoadedMetadata);
        this.video.removeEventListener('loadeddata', this.onLoadedData);
        this.video.removeAttribute('src');
        this.video.load();
        this.classList.remove('is-ready');
      }

      onMediaChange() {
        if (this.mediaQuery.matches) {
          window.addEventListener('scroll', this.wake, { passive: true });
          window.addEventListener('resize', this.wake);
          this.requestVideo();
          this.wake();
        } else {
          this.removeScrollListeners();
          this.stopLoop();
        }
      }

      removeScrollListeners() {
        window.removeEventListener('scroll', this.wake);
        window.removeEventListener('resize', this.wake);
      }

      requestVideo() {
        if (this.hasRequestedVideo || !this.isNear || !this.mediaQuery.matches) return;
        this.hasRequestedVideo = true;
        this.loadObserver.disconnect();

        this.video.preload = 'auto';
        this.video.src = this.dataset.videoUrl;
        this.video.load();
      }

      onLoadedMetadata() {
        this.duration = Number.isFinite(this.video.duration) ? this.video.duration : 0;
        if (this.video.videoWidth && this.video.videoHeight) {
          this.style.setProperty('--video-ratio', `${this.video.videoWidth} / ${this.video.videoHeight}`);
        }

        // Start at the current scroll position rather than gliding from the first frame.
        this.displayedTime = this.getTargetTime();
        this.wake();
      }

      onLoadedData() {
        this.classList.add('is-ready');
      }

      getTargetTime() {
        const scrollDistance = this.offsetHeight - this.stage.offsetHeight;
        if (scrollDistance <= 0) return 0;

        const progress = -this.getBoundingClientRect().top / scrollDistance;
        return Math.max(0, Math.min(1, progress)) * this.duration;
      }

      wake() {
        if (this.frameId !== null || !this.isVisible || !this.duration || !this.mediaQuery.matches) return;
        this.frameId = window.requestAnimationFrame(this.tick);
      }

      stopLoop() {
        if (this.frameId === null) return;
        window.cancelAnimationFrame(this.frameId);
        this.frameId = null;
      }

      tick() {
        this.frameId = null;

        const targetTime = this.getTargetTime();
        const distance = targetTime - this.displayedTime;
        this.displayedTime =
          Math.abs(distance) < InteractiveVideo.SNAP_DISTANCE
            ? targetTime
            : this.displayedTime + distance * InteractiveVideo.SMOOTHING;

        // Only seek once the last seek has finished, so seeks can't stack up and freeze the video.
        if (!this.video.seeking && this.lastSeekTime !== this.displayedTime) {
          this.video.currentTime = this.displayedTime;
          this.lastSeekTime = this.displayedTime;
        }

        this.updateTooltips();

        // Stop once the video has caught up. The next scroll wakes the loop again.
        const hasSettled =
          this.displayedTime === targetTime && this.lastSeekTime === targetTime && !this.video.seeking;
        if (!hasSettled) this.wake();
      }

      updateTooltips() {
        this.tooltips.forEach((tooltip) => {
          const shouldShow = tooltip.start <= this.displayedTime && this.displayedTime < tooltip.end;
          if (shouldShow === tooltip.isVisible) return;

          tooltip.isVisible = shouldShow;
          tooltip.element.classList.toggle('is-visible', shouldShow);
        });
      }
    }
  );
}
