import { courts, getSchedule, menu, products } from './data';
import type { Court, MenuItem, Product, ScheduleDay } from './types';

export type AvailabilityScenario = 'normal' | 'empty' | 'fully-booked' | 'partial' | 'error' | 'offline';
export type AvailabilityResult =
  | { state: 'ready' | 'empty' | 'fully-booked'; day: ScheduleDay }
  | { state: 'partial'; day: ScheduleDay; failedCourtIds: string[]; message: string }
  | { state: 'error' | 'offline'; message: string };

export async function getCourts(): Promise<Court[]> { return structuredClone(courts); }
export async function getAvailability(date: string, courtIds?: string[]): Promise<ScheduleDay> {
  const day = getSchedule(date);
  return courtIds?.length ? { ...day, slots: day.slots.filter(slot => courtIds.includes(slot.courtId)) } : day;
}

/** Deterministic view-state adapter. Replace this function with API error mapping later. */
export async function getAvailabilityState(date: string, courtIds?: string[], scenario: AvailabilityScenario = 'normal'): Promise<AvailabilityResult> {
  if (scenario === 'error') return { state: 'error', message: 'We could not load the court schedule.' };
  if (scenario === 'offline') return { state: 'offline', message: 'You appear to be offline. Check your connection and try again.' };
  const day = await getAvailability(date, courtIds);
  if (scenario === 'empty') return { state: 'empty', day: { ...day, slots: [] } };
  if (scenario === 'fully-booked') return { state: 'fully-booked', day: { ...day, slots: day.slots.map(slot => ({ ...slot, status: 'booked', publicLabel: 'Booked' })) } };
  if (scenario === 'partial') {
    const failedCourtId = courtIds?.includes('c2') === false ? 'c1' : 'c2';
    return { state: 'partial', day: { ...day, slots: day.slots.filter(slot => slot.courtId !== failedCourtId) }, failedCourtIds: [failedCourtId], message: `${courts.find(court => court.id === failedCourtId)?.name ?? 'One court'} could not be loaded.` };
  }
  return { state: 'ready', day };
}
export async function getMenu(): Promise<MenuItem[]> { return structuredClone(menu); }
export async function getProducts(): Promise<Product[]> { return structuredClone(products); }
