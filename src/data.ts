import type { Court, MenuItem, Product, ScheduleDay, SiteSettings, SlotStatus } from './types';

export const placeholderMeta = '[PLACEHOLDER: BRAND PALETTE]';

export const courts: Court[] = [
  { id: 'c1', slug: 'court-1', name: 'Court 1', summary: 'A bright, social court prepared for friendly rallies and competitive sets.', features: ['Sample surface: cushioned acrylic', 'Sample setting: covered court', 'Sample capacity: 4 players', 'Sample amenity: courtside seating'], image: '[PLACEHOLDER: COURT 1 PHOTO]', alt: '', active: true, rateDisplay: '[PLACEHOLDER: COURT 1 RATE ₱400/HOUR]', contentStatus: 'placeholder' },
  { id: 'c2', slug: 'court-2', name: 'Court 2', summary: 'A dedicated court with room for warm-ups, spectating, and community play.', features: ['Sample surface: cushioned acrylic', 'Sample lighting: evening ready', 'Sample capacity: 4 players', 'Sample amenity: paddle rack'], image: '[PLACEHOLDER: COURT 2 PHOTO]', alt: '', active: true, rateDisplay: '[PLACEHOLDER: COURT 2 RATE ₱400/HOUR]', contentStatus: 'placeholder' },
];

export const menu: MenuItem[] = [
  { id: 'm1', name: 'Courtside Rice Bowl', description: 'A filling sample meal for post-game refueling.', category: 'Meals', priceDisplay: '[PLACEHOLDER: ₱149]', dietaryTags: [], image: '[PLACEHOLDER: RICE BOWL PHOTO]', availabilityLabel: 'Sample menu item', contentStatus: 'placeholder' },
  { id: 'm2', name: 'Clubhouse Sandwich', description: 'A toasted sample sandwich served fresh at the counter.', category: 'Quick bites', priceDisplay: '[PLACEHOLDER: ₱119]', dietaryTags: [], image: '[PLACEHOLDER: SANDWICH PHOTO]', availabilityLabel: 'Sample menu item', contentStatus: 'placeholder' },
  { id: 'm3', name: 'Iced Calamansi', description: 'A cool citrus drink made for warm match days.', category: 'Drinks', priceDisplay: '[PLACEHOLDER: ₱69]', dietaryTags: [], image: '[PLACEHOLDER: DRINK PHOTO]', availabilityLabel: 'Sample menu item', contentStatus: 'placeholder' },
];

export const products: Product[] = [
  { id: 'p1', name: 'Trisomy21 Club Shirt', category: 'Apparel', description: 'A comfortable club tee for match days and everyday wear.', priceDisplay: '[PLACEHOLDER: ₱599]', variants: ['Sample sizes: S–XXL', 'Sample colors: forest / cream'], image: '[PLACEHOLDER: CLUB SHIRT PHOTO]', actionType: 'inquiry', contentStatus: 'placeholder' },
  { id: 'p2', name: 'Outdoor Pickleballs', category: 'Equipment', description: 'A sample three-ball pack for practice and open play.', priceDisplay: '[PLACEHOLDER: ₱299]', variants: ['Sample pack: 3 balls', 'Sample type: outdoor'], image: '[PLACEHOLDER: PICKLEBALL PHOTO]', actionType: 'inquiry', contentStatus: 'placeholder' },
  { id: 'p3', name: 'Custom Net + Frame', category: 'Custom builds', description: 'A made-to-order net and sturdy frame concept for home or community courts.', priceDisplay: '[PLACEHOLDER: PRICE TO BE CONFIRMED]', variants: ['Sample scope: net + frame', 'Lead time and service area to be confirmed'], image: '[PLACEHOLDER: NET AND FRAME PHOTO]', actionType: 'quote', contentStatus: 'placeholder' },
];

export const settings: SiteSettings = { hours: '[PLACEHOLDER: DAILY, 8:00 AM–10:00 PM]', address: '[PLACEHOLDER: TRISOMY21 ADDRESS]', contacts: '[PLACEHOLDER: PHONE / MESSAGE CHANNEL]', parking: '[PLACEHOLDER: PARKING AND ACCESS DETAILS]', notice: 'Website preview—availability, prices, and ordering are samples.', contentStatus: 'placeholder' };

const statuses: SlotStatus[][] = [
  ['available', 'booked'], ['pending', 'available'], ['available', 'available'], ['booked', 'closed'], ['available', 'booked'], ['closed', 'available'], ['available', 'pending'], ['booked', 'available'], ['available', 'available'], ['pending', 'booked'], ['available', 'closed'], ['booked', 'available'], ['available', 'available'], ['closed', 'closed'],
];

export function localToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export function getSchedule(date: string): ScheduleDay {
  const slots = statuses.flatMap((pair, hourIndex) => courts.map((court, courtIndex) => {
    const hour = 8 + hourIndex;
    const status = pair[courtIndex] ?? 'closed';
    return { id: `${date}-${court.id}-${hour}`, courtId: court.id, start: `${String(hour).padStart(2, '0')}:00`, end: `${String(hour + 1).padStart(2, '0')}:00`, status, publicLabel: status === 'booked' ? 'Booked' : status === 'pending' ? 'Pending' : status === 'closed' ? 'Closed' : 'Available' };
  }));
  return { localDate: date, timezone: 'Asia/Manila', openingTime: '08:00', closingTime: '22:00', slots };
}
