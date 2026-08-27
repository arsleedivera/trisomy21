export type CarouselInput = 'button' | 'passive' | 'resize';
export interface CarouselEnhancement { semantics: boolean; controls: boolean }

export function carouselEnhancement(count: number): CarouselEnhancement {
  return count <= 0 ? { semantics: false, controls: false } : { semantics: true, controls: count > 1 };
}

export function nearestSlideIndex(starts: readonly number[], scrollPosition: number): number {
  if (starts.length === 0) return 0;
  return starts.reduce((closest, start, index) => Math.abs(start - scrollPosition) < Math.abs(starts[closest]! - scrollPosition) ? index : closest, 0);
}

export function nextSlideIndex(current: number, direction: -1 | 1, count: number): number {
  return Math.min(Math.max(current + direction, 0), Math.max(count - 1, 0));
}

export function boundaryState(index: number, count: number): { previousDisabled: boolean; nextDisabled: boolean } {
  return { previousDisabled: count <= 1 || index <= 0, nextDisabled: count <= 1 || index >= count - 1 };
}

export function slideLabel(type: string, index: number, count: number, name: string): string {
  return `${type} ${index + 1} of ${count}: ${name}`;
}

export function statusLabel(type: string, index: number, count: number): string {
  return `${type} ${index + 1} of ${count}`;
}

export function announcementLabel(type: string, index: number, count: number, name: string): string {
  return `${type} ${index + 1} of ${count}, ${name}`;
}

export function scrollTarget(slideLeadingEdge: number, trackLeadingEdge: number): number {
  return Math.max(0, slideLeadingEdge - trackLeadingEdge);
}

export function scrollBehavior(reducedMotion: boolean, input: CarouselInput): ScrollBehavior {
  return !reducedMotion && input === 'button' ? 'smooth' : 'auto';
}

export function shouldAnnounce(input: CarouselInput): boolean { return input === 'button'; }
export function shouldMoveFocus(): boolean { return false; }

export function initMobileCarousels(): void {
  const breakpoint = window.matchMedia('(max-width: 639px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(track => {
    const slides = Array.from(track.querySelectorAll<HTMLElement>(':scope > [data-carousel-slide]'));
    const type = track.dataset.carouselType ?? 'Item';
    const headingId = track.dataset.carouselHeading;
    let current = 0;
    let announcementPending = false;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const enhancement = carouselEnhancement(slides.length);
    if (!enhancement.semantics) {
      track.classList.remove('carousel-enhanced');
      track.removeAttribute('role'); track.removeAttribute('aria-roledescription'); track.removeAttribute('aria-labelledby'); track.removeAttribute('tabindex');
      return;
    }

    if (!enhancement.controls) {
      const configureSingle = () => {
        const mobile = breakpoint.matches;
        track.classList.toggle('carousel-enhanced', mobile);
        if (mobile) {
          track.setAttribute('role', 'region'); track.setAttribute('aria-roledescription', 'carousel'); if (headingId) track.setAttribute('aria-labelledby', headingId);
          const slide = slides[0];
          if (slide) { const name = slide.querySelector('h3')?.textContent?.trim() || type; slide.setAttribute('role', 'group'); slide.setAttribute('aria-roledescription', 'slide'); slide.setAttribute('aria-label', slideLabel(type, 0, 1, name)); }
        } else {
          track.removeAttribute('role'); track.removeAttribute('aria-roledescription'); track.removeAttribute('aria-labelledby');
          slides.forEach(slide => { slide.removeAttribute('role'); slide.removeAttribute('aria-roledescription'); slide.removeAttribute('aria-label'); });
        }
      };
      breakpoint.addEventListener('change', configureSingle);
      configureSingle();
      return;
    }

    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.hidden = true;
    controls.innerHTML = `<button class="carousel-previous" type="button" aria-label="Previous ${type.toLowerCase()}">←</button><span class="carousel-status"></span><button class="carousel-next" type="button" aria-label="Next ${type.toLowerCase()}">→</button><span class="sr-only carousel-announcement" aria-live="polite" aria-atomic="true"></span>`;
    track.insertAdjacentElement('afterend', controls);

    const previous = controls.querySelector<HTMLButtonElement>('.carousel-previous')!;
    const next = controls.querySelector<HTMLButtonElement>('.carousel-next')!;
    const status = controls.querySelector<HTMLElement>('.carousel-status')!;
    const announcement = controls.querySelector<HTMLElement>('.carousel-announcement')!;
    previous.disabled = true;

    const starts = () => slides.map(slide => scrollTarget(slide.offsetLeft, track.offsetLeft));
    const itemName = (index: number) => slides[index]?.querySelector('h3')?.textContent?.trim() || `${type} ${index + 1}`;
    const update = (input: CarouselInput) => {
      current = nearestSlideIndex(starts(), track.scrollLeft);
      const boundaries = boundaryState(current, slides.length);
      previous.disabled = boundaries.previousDisabled;
      next.disabled = boundaries.nextDisabled;
      status.textContent = statusLabel(type, current, slides.length);
      if (shouldAnnounce(input)) announcement.textContent = announcementLabel(type, current, slides.length, itemName(current));
    };

    const align = (index: number, input: CarouselInput) => {
      const target = starts()[index] ?? 0;
      track.scrollTo({ left: target, behavior: scrollBehavior(reducedMotion.matches, input) });
    };

    const settle = (input: CarouselInput) => {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => { update(input); announcementPending = false; }, 140);
    };

    const move = (direction: -1 | 1) => {
      current = nextSlideIndex(current, direction, slides.length);
      announcementPending = true;
      align(current, 'button');
    };

    const configure = () => {
      const mobile = breakpoint.matches;
      track.classList.toggle('carousel-enhanced', mobile);
      if (mobile) {
        track.setAttribute('role', 'region');
        track.setAttribute('aria-roledescription', 'carousel');
        if (headingId) track.setAttribute('aria-labelledby', headingId);
        track.tabIndex = 0;
        slides.forEach((slide, index) => { slide.setAttribute('role', 'group'); slide.setAttribute('aria-roledescription', 'slide'); slide.setAttribute('aria-label', slideLabel(type, index, slides.length, itemName(index))); });
        controls.hidden = slides.length <= 1;
        window.requestAnimationFrame(() => { align(current, 'resize'); update('resize'); });
      } else {
        track.removeAttribute('role'); track.removeAttribute('aria-roledescription'); track.removeAttribute('aria-labelledby'); track.removeAttribute('tabindex');
        slides.forEach(slide => { slide.removeAttribute('role'); slide.removeAttribute('aria-roledescription'); slide.removeAttribute('aria-label'); });
        controls.hidden = true;
      }
    };

    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', () => settle(announcementPending ? 'button' : 'passive'), { passive: true });
    const resize = () => { if (resizeTimer) clearTimeout(resizeTimer); resizeTimer = setTimeout(configure, 80); };
    breakpoint.addEventListener('change', configure);
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    configure();
  });
}
