import { describe, expect, it } from 'vitest';
import { nextMenuExpanded, resolveRequestedDate } from './ui-state';

describe('URL date fallback', () => {
  it('preserves a valid requested date', () => { expect(resolveRequestedDate('2026-08-27', '2026-08-28')).toEqual({ date: '2026-08-27', usedFallback: false }); });
  it('marks an invalid requested date as a visible fallback condition', () => { expect(resolveRequestedDate('2026-02-30', '2026-08-28')).toEqual({ date: '2026-08-28', usedFallback: true }); });
});

describe('mobile menu state', () => {
  it('closes on Escape', () => { expect(nextMenuExpanded(true, 'escape')).toBe(false); });
  it('closes after normal anchor selection', () => { expect(nextMenuExpanded(true, 'anchor')).toBe(false); });
  it('toggles from the trigger', () => { expect(nextMenuExpanded(false, 'toggle')).toBe(true); });
});
