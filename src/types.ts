export type ContentStatus = 'placeholder' | 'verified';
export type SlotStatus = 'available' | 'pending' | 'booked' | 'closed';

export interface Court { id: string; slug: string; name: string; summary: string; features: string[]; image: string; alt: string; active: boolean; rateDisplay: string; contentStatus: ContentStatus }
export interface Slot { id: string; courtId: string; start: string; end: string; status: SlotStatus; publicLabel: string }
export interface ScheduleDay { localDate: string; timezone: 'Asia/Manila'; openingTime: string; closingTime: string; slots: Slot[] }
export interface MenuItem { id: string; name: string; description: string; category: string; priceDisplay: string; dietaryTags: string[]; image: string; availabilityLabel: string; contentStatus: ContentStatus }
export interface Product { id: string; name: string; category: string; description: string; priceDisplay: string; variants: string[]; image: string; actionType: 'inquiry' | 'quote'; contentStatus: ContentStatus }
export interface SiteSettings { hours: string; address: string; contacts: string; parking: string; notice: string; contentStatus: ContentStatus }
