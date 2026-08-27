import { describe, expect, it } from 'vitest';
import { formatTime, isLocalDate, shiftDate } from './date';
import { getSchedule } from './data';
import { getAvailabilityState } from './services';

describe('schedule helpers', () => {
  it('validates real local dates', () => { expect(isLocalDate('2026-02-28')).toBe(true); expect(isLocalDate('2026-02-30')).toBe(false); });
  it('moves across month boundaries', () => { expect(shiftDate('2026-08-31', 1)).toBe('2026-09-01'); });
  it('formats twelve-hour time', () => { expect(formatTime('13:00')).toBe('1:00 PM'); });
  it('creates deterministic private schedule labels', () => { const day = getSchedule('2026-08-27'); expect(day.slots).toHaveLength(28); expect(day.slots.filter(s => s.status === 'booked').every(s => s.publicLabel === 'Booked')).toBe(true); });
});

describe('availability service states', () => {
  it('returns an empty state without inventing slots', async () => { const result = await getAvailabilityState('2026-08-27', undefined, 'empty'); expect(result.state).toBe('empty'); if ('day' in result) expect(result.day.slots).toHaveLength(0); });
  it('retains one court when the other fails', async () => { const result = await getAvailabilityState('2026-08-27', undefined, 'partial'); expect(result.state).toBe('partial'); if (result.state === 'partial') { expect(result.failedCourtIds).toEqual(['c2']); expect(result.day.slots.every(slot => slot.courtId === 'c1')).toBe(true); } });
  it('maps offline failures to recoverable public copy', async () => { const result = await getAvailabilityState('2026-08-27', undefined, 'offline'); expect(result).toEqual({ state: 'offline', message: 'You appear to be offline. Check your connection and try again.' }); });
  it('creates explicit fully-booked data', async () => { const result = await getAvailabilityState('2026-08-27', undefined, 'fully-booked'); expect(result.state).toBe('fully-booked'); if ('day' in result) expect(result.day.slots.every(slot => slot.status === 'booked')).toBe(true); });
});
