import { isLocalDate } from './date';

export function resolveRequestedDate(requested: string, today: string): { date: string; usedFallback: boolean } {
  return requested && isLocalDate(requested) ? { date: requested, usedFallback: false } : { date: today, usedFallback: Boolean(requested) };
}

export function nextMenuExpanded(current: boolean, action: 'toggle' | 'escape' | 'anchor'): boolean {
  return action === 'toggle' ? !current : false;
}
