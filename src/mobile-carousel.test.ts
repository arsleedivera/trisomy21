import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { announcementLabel, boundaryState, carouselEnhancement, nearestSlideIndex, nextSlideIndex, scrollBehavior, scrollTarget, shouldAnnounce, shouldMoveFocus, slideLabel, statusLabel } from './mobile-carousel';

describe('mobile collection carousel helpers', () => {
  it('selects the leading edge nearest the snap position', () => { expect(nearestSlideIndex([0, 323, 646], 480)).toBe(1); expect(nearestSlideIndex([0, 323, 646], 600)).toBe(2); });
  it('moves one item without wrapping', () => { expect(nextSlideIndex(0, 1, 3)).toBe(1); expect(nextSlideIndex(2, 1, 3)).toBe(2); expect(nextSlideIndex(0, -1, 3)).toBe(0); });
  it('reports native button boundaries', () => { expect(boundaryState(0, 3)).toEqual({ previousDisabled: true, nextDisabled: false }); expect(boundaryState(2, 3)).toEqual({ previousDisabled: false, nextDisabled: true }); expect(boundaryState(0, 1)).toEqual({ previousDisabled: true, nextDisabled: true }); });
  it('builds positional slide, status, and announcement labels', () => { expect(slideLabel('Court', 0, 2, 'Court 1')).toBe('Court 1 of 2: Court 1'); expect(statusLabel('Menu item', 1, 3)).toBe('Menu item 2 of 3'); expect(announcementLabel('Club essential', 2, 3, 'Custom Net + Frame')).toBe('Club essential 3 of 3, Custom Net + Frame'); });
  it('calculates track-relative scroll targets', () => { expect(scrollTarget(343, 20)).toBe(323); expect(scrollTarget(10, 20)).toBe(0); });
  it('uses smooth movement only for button input without reduced motion', () => { expect(scrollBehavior(false, 'button')).toBe('smooth'); expect(scrollBehavior(true, 'button')).toBe('auto'); expect(scrollBehavior(false, 'resize')).toBe('auto'); });
  it('announces only button-driven changes and never moves focus to a slide', () => { expect(shouldAnnounce('button')).toBe(true); expect(shouldAnnounce('passive')).toBe(false); expect(shouldAnnounce('resize')).toBe(false); expect(shouldMoveFocus()).toBe(false); });
  it('leaves zero-item empty states without carousel semantics or chrome', () => { expect(carouselEnhancement(0)).toEqual({ semantics: false, controls: false }); });
  it('gives one item carousel semantics without controls or status chrome', () => { expect(carouselEnhancement(1)).toEqual({ semantics: true, controls: false }); });
  it('keeps only menu slides inside the canteen carousel track', () => {
    const source = readFileSync(new URL('./app.ts', import.meta.url), 'utf8');
    const track = source.match(/<ul class="menu-track collection-track"[\s\S]*?<\/ul>/)?.[0] ?? '';
    expect(track).toContain('data-carousel-slide');
    expect(track).toContain('<article class="menu-item">');
    expect(track).not.toContain('canteen-intro');
    expect(track).not.toContain('brand-media');
    expect(track).not.toContain('counter-note');
    expect(source.indexOf('counter-note')).toBeGreaterThan(source.indexOf('</ul>', source.indexOf('menu-track collection-track')));
  });
  it('contains the canteen grid and assigns horizontal overflow to the track', () => {
    const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
    expect(css).toContain('.canteen,.canteen-intro,.menu-list,.menu-track{min-width:0;max-width:100%}');
    expect(css).toContain('.collection-track{display:flex!important;align-items:flex-start;gap:12px;width:100%;max-width:100%;min-width:0;overflow-x:auto;overflow-y:hidden;margin-right:0;padding-right:20px');
    expect(css).toContain('.menu-slide>.menu-item{width:100%;min-width:0;max-width:100%}');
    expect(css).not.toMatch(/(?:html|body)\s*\{[^}]*overflow-x\s*:\s*hidden/);
  });
});
