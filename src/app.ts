import './styles.css';
import { courts, localToday, menu, products, settings } from './data';
import { formatDate, formatTime, isLocalDate, shiftDate } from './date';
import { getAvailabilityState, type AvailabilityScenario } from './services';
import type { Slot } from './types';
import { nextMenuExpanded, resolveRequestedDate } from './ui-state';

const tokenText = (value: string): string => value.replace(/^\[PLACEHOLDER:\s*/, '').replace(/\]$/, '');
const params = new URLSearchParams(window.location.search);
const requestedDate = params.get('date') ?? '';
const resolvedDate = resolveRequestedDate(requestedDate, localToday());
let selectedDate = resolvedDate.date;
let selectedCourt = courts.some(c => c.slug === params.get('court')) ? params.get('court')! : 'all';
const scenarioParam = params.get('scheduleState');
const availabilityScenario: AvailabilityScenario = ['empty', 'fully-booked', 'partial', 'error', 'offline'].includes(scenarioParam ?? '') ? scenarioParam as AvailabilityScenario : 'normal';
const invalidDateFallback = resolvedDate.usedFallback;

const imagePlaceholder = (label: string) => `<div class="media-placeholder" role="img" aria-label="Photo coming soon"><span>Sample image</span><strong>${tokenText(label).replace(' PHOTO', '').replace(' IMAGE', '')}</strong><i aria-hidden="true"></i></div>`;
const samplePrice = (value: string) => value.includes('PRICE TO BE CONFIRMED') ? 'Price to be confirmed' : `Sample price: ${tokenText(value).replace(/^.*?₱/, '₱')}`;

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div class="preview-bar">${settings.notice}</div>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="Trisomy21 home"><span class="brand-mark">21</span><span>TRISOMY<br><b>PICKLEBALL CLUB</b></span></a>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" aria-label="Primary"><a href="#courts">Courts</a><a href="#schedule">Schedule</a><a href="#canteen">Canteen</a><a href="#shop">Shop</a><a class="button small" href="#schedule">View availability</a></nav>
  </header>
  <main id="main">
    <section class="hero" id="top">
      <div class="hero-copy"><p class="eyebrow">Your neighborhood pickleball club</p><h1>Good games.<br>Better company.</h1><p>Two courts, courtside food, and useful gear—all built around the joy of showing up and playing together.</p><div class="actions"><a class="button" href="#schedule">View court schedule</a><a class="text-link" href="#courts">Explore the courts <span aria-hidden="true">→</span></a></div><p class="sample-note">Sample venue details · Official information coming soon</p></div>
      <div class="hero-visual">${imagePlaceholder('[PLACEHOLDER: HERO COURT IMAGE]')}<div class="court-line" aria-hidden="true"></div></div>
    </section>

    <section class="section" id="courts"><div class="section-heading"><p class="eyebrow">Play here</p><h2>Two courts. One welcoming club.</h2><p>Choose your side, bring your favorite people, and settle in for a good match.</p></div>
      <div class="court-list">${courts.map((court, index) => `<article class="court-feature ${index % 2 ? 'reverse' : ''}">${imagePlaceholder(court.image)}<div><p class="number">0${index + 1}</p><h3>${court.name}</h3><p>${court.summary}</p><ul>${court.features.map(feature => `<li>${feature}</li>`).join('')}</ul><p class="price">${samplePrice(court.rateDisplay)}</p><a class="text-link court-link" href="#schedule" data-court="${court.slug}">See this court’s schedule →</a></div></article>`).join('')}</div>
      <aside class="rules"><p class="eyebrow">Court rules</p><h3>Keep play simple.</h3><ol><li>Be respectful and friendly.</li><li>Enjoy the game.</li></ol></aside>
    </section>

    <section class="schedule-section" id="schedule"><div class="section schedule-inner"><div class="section-heading light"><p class="eyebrow">Plan a game</p><h2>Check the court schedule.</h2><p>Explore representative availability for both courts. Online reservations are not active yet.</p></div><p class="demo-notice"><strong>Preview mode</strong> Sample availability—not live booking data. Demo hours are 8:00 AM–10:00 PM in Asia/Manila.</p>
      <div id="date-notice">${invalidDateFallback ? `<p class="state-notice warning" role="status"><strong>Invalid date.</strong> “${requestedDate}” is not a calendar date, so today’s schedule is shown instead.</p>` : ''}</div><div class="schedule-tools"><div class="date-nav"><button id="prev-date" type="button" aria-label="Previous day">←</button><label><span>Date</span><input id="date-picker" type="date" value="${selectedDate}"></label><button id="next-date" type="button" aria-label="Next day">→</button></div><fieldset class="court-filter"><legend>Show schedule for</legend><div>${['all', ...courts.map(c => c.slug)].map((value, i) => `<button type="button" data-filter="${value}" aria-pressed="${selectedCourt === value}">${i === 0 ? 'All courts' : courts[i - 1]!.name}</button>`).join('')}</div></fieldset></div>
      <div class="legend" aria-label="Availability legend"><span><i class="available"></i>Available</span><span><i class="pending"></i>Pending</span><span><i class="booked"></i>Booked</span><span><i class="closed"></i>Closed</span></div>
      <div id="schedule-results" aria-live="polite"></div><div id="schedule-status" class="sr-only" aria-live="polite"></div>
    </div></section>

    <section class="section canteen" id="canteen"><div class="section-heading"><p class="eyebrow clay">Stay a little longer</p><h2>From match point<br>to meal time.</h2><p>Grab a quick bite, cool down with a drink, and catch up after the last rally. Everything is ordered right at the canteen.</p><p class="sample-note">Sample canteen hours: daily, 8:00 AM–9:00 PM</p></div><div class="menu-list">${menu.map(item => `<article class="menu-item"><div><p class="category">${item.category}</p><h3>${item.name}</h3><p>${item.description}</p><span class="sample-tag">${item.availabilityLabel}</span></div><strong>${samplePrice(item.priceDisplay)}</strong></article>`).join('')}<p class="counter-note"><strong>Order at the canteen</strong><br>Menu and availability shown here are sample content.</p></div></section>

    <section class="shop-section" id="shop"><div class="section"><div class="section-heading"><p class="eyebrow">Club essentials</p><h2>Play with the right kit.</h2><p>Sample merchandise and practical court gear from Trisomy21. Inventory and pricing are not live.</p></div><div class="product-list">${products.map(product => `<article class="product">${imagePlaceholder(product.image)}<div><p class="category">${product.category}</p><h3>${product.name}</h3><p>${product.description}</p><ul>${product.variants.map(v => `<li>${v}</li>`).join('')}</ul><p class="price">${samplePrice(product.priceDisplay)}</p><button class="text-button inquiry" data-product="${product.id}" type="button">${product.actionType === 'quote' ? 'Request a quote' : product.id === 'p1' ? 'Ask about this shirt' : 'Ask about pickleballs'} →</button></div></article>`).join('')}</div></div></section>

    <section class="visit" id="visit"><div class="section"><div><p class="eyebrow">Come play</p><h2>Find your next game.</h2></div><dl><div><dt>Location</dt><dd>${tokenText(settings.address)}<small>Address to be confirmed</small></dd></div><div><dt>Sample hours</dt><dd>${tokenText(settings.hours)}</dd></div><div><dt>Contact</dt><dd>${tokenText(settings.contacts)}<small>Official contact coming soon</small></dd></div><div><dt>Getting here</dt><dd>${tokenText(settings.parking)}<small>Details to be confirmed</small></dd></div></dl></div></section>
  </main>
  <footer><a class="brand footer-brand" href="#top"><span class="brand-mark">21</span><span>TRISOMY<br><b>PICKLEBALL CLUB</b></span></a><nav aria-label="Footer"><a href="#courts">Courts</a><a href="#schedule">Schedule</a><a href="#canteen">Canteen</a><a href="#shop">Shop</a></nav><p>Website preview · Details are sample content.<br>© 2026 Trisomy21 Pickleball Club</p></footer>
  <a class="mobile-cta" href="#schedule">Check availability</a>
  <dialog id="detail-dialog"><button class="dialog-close" type="button" aria-label="Close dialog">×</button><div id="dialog-content"></div></dialog>`;

const results = document.querySelector<HTMLDivElement>('#schedule-results')!;
const statusRegion = document.querySelector<HTMLDivElement>('#schedule-status')!;
const datePicker = document.querySelector<HTMLInputElement>('#date-picker')!;
const dialog = document.querySelector<HTMLDialogElement>('#detail-dialog')!;
const dialogContent = document.querySelector<HTMLDivElement>('#dialog-content')!;

function updateQuery(): void {
  const url = new URL(window.location.href);
  url.searchParams.set('date', selectedDate);
  if (selectedCourt === 'all') url.searchParams.delete('court'); else url.searchParams.set('court', selectedCourt);
  window.history.replaceState({}, '', url);
}

function slotCell(slot: Slot): string {
  const label = `${courts.find(c => c.id === slot.courtId)?.name}, ${formatTime(slot.start)} to ${formatTime(slot.end)}, ${slot.publicLabel.toLowerCase()}`;
  return slot.status === 'available' ? `<button class="slot available" data-slot="${slot.id}" aria-label="${label}"><strong>Available</strong><span>Select time</span></button>` : `<div class="slot ${slot.status}" aria-label="${label}"><strong>${slot.publicLabel}</strong><span>${slot.status === 'booked' ? 'Not available' : slot.status === 'pending' ? 'Awaiting confirmation' : 'No play'}</span></div>`;
}

async function renderSchedule(): Promise<void> {
  results.setAttribute('aria-busy', 'true');
  results.innerHTML = '<p class="loading">Loading schedule…</p>';
  const selectedIds = selectedCourt === 'all' ? undefined : [courts.find(c => c.slug === selectedCourt)!.id];
  const availability = await getAvailabilityState(selectedDate, selectedIds, availabilityScenario);
  if (availability.state === 'error' || availability.state === 'offline') {
    results.innerHTML = `<div class="schedule-state" role="alert"><h3>${availability.state === 'offline' ? 'Schedule unavailable offline' : 'Schedule unavailable'}</h3><p>${availability.message}</p><button class="button retry-schedule" type="button">Retry schedule</button><p class="sample-note">Official contact details are still to be confirmed.</p></div>`;
    results.setAttribute('aria-busy', 'false');
    statusRegion.textContent = availability.message;
    results.querySelector<HTMLButtonElement>('.retry-schedule')!.addEventListener('click', () => void renderSchedule());
    return;
  }
  if (!('day' in availability)) return;
  const schedule = availability.day;
  if (availability.state === 'empty') {
    results.innerHTML = `<div class="schedule-state"><h3>No playing hours are listed for this date.</h3><p>Try the next day to see more sample availability.</p><button class="button next-available-day" type="button">View next day</button></div>`;
    results.setAttribute('aria-busy', 'false');
    statusRegion.textContent = `No playing hours are listed for ${formatDate(selectedDate)}.`;
    results.querySelector<HTMLButtonElement>('.next-available-day')!.addEventListener('click', () => { selectedDate = shiftDate(selectedDate, 1); datePicker.value = selectedDate; void renderSchedule(); });
    return;
  }
  const failedCourtIds = availability.state === 'partial' ? availability.failedCourtIds : [];
  const visibleCourts = courts.filter(c => (!selectedIds || selectedIds.includes(c.id)) && !failedCourtIds.includes(c.id));
  const hours = [...new Set(schedule.slots.map(s => s.start))];
  const partialNotice = availability.state === 'partial' ? `<div class="state-notice partial" role="status"><strong>Partial schedule.</strong> ${availability.message} <button class="inline-retry" type="button">Retry</button></div>` : '';
  const fullyBookedNotice = availability.state === 'fully-booked' ? `<div class="state-notice"><strong>No open times on this date.</strong> All listed sample slots are booked. <button class="inline-next" type="button">View next day</button></div>` : '';
  results.innerHTML = `${partialNotice}${fullyBookedNotice}<p class="selected-date">${formatDate(selectedDate)}</p><div class="schedule-table-wrap"><table><caption>Sample court availability for ${formatDate(selectedDate)}</caption><thead><tr><th scope="col">Time</th>${visibleCourts.map(c => `<th scope="col">${c.name}</th>`).join('')}</tr></thead><tbody>${hours.map(hour => `<tr><th scope="row">${formatTime(hour)}</th>${visibleCourts.map(court => { const slot = schedule.slots.find(s => s.start === hour && s.courtId === court.id); return `<td>${slot ? slotCell(slot) : '<div class="slot closed"><strong>Unavailable</strong><span>Could not load</span></div>'}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div><div class="schedule-mobile">${visibleCourts.map(court => `<section><h3>${court.name}</h3><ul>${schedule.slots.filter(s => s.courtId === court.id).map(slot => `<li><time>${formatTime(slot.start)}</time>${slotCell(slot)}</li>`).join('')}</ul></section>`).join('')}</div>`;
  results.setAttribute('aria-busy', 'false');
  statusRegion.textContent = `Schedule updated for ${formatDate(selectedDate)}.`;
  results.querySelectorAll<HTMLButtonElement>('[data-slot]').forEach(button => button.addEventListener('click', () => openSlot(schedule.slots.find(s => s.id === button.dataset.slot)!)));
  results.querySelector<HTMLButtonElement>('.inline-retry')?.addEventListener('click', () => void renderSchedule());
  results.querySelector<HTMLButtonElement>('.inline-next')?.addEventListener('click', () => { selectedDate = shiftDate(selectedDate, 1); datePicker.value = selectedDate; void renderSchedule(); });
  updateQuery();
}

function openSlot(slot: Slot): void {
  const court = courts.find(c => c.id === slot.courtId)!;
  dialogContent.innerHTML = `<p class="eyebrow">Sample availability</p><h2>${court.name}</h2><p class="dialog-time">${formatDate(selectedDate)}<br><strong>${formatTime(slot.start)}–${formatTime(slot.end)}</strong></p><p>Online booking will be available soon. Official contact details are still to be confirmed.</p><button class="button dialog-done" type="button">Close</button>`;
  dialog.showModal();
  dialog.querySelector<HTMLButtonElement>('.dialog-done')!.addEventListener('click', () => dialog.close());
}

const menuButton = document.querySelector<HTMLButtonElement>('.menu-button')!;
const siteNav = document.querySelector<HTMLElement>('#site-nav')!;
function closeMenu(restoreFocus = false): void { siteNav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); if (restoreFocus) menuButton.focus(); }
menuButton.addEventListener('click', event => {
  const button = event.currentTarget as HTMLButtonElement;
  const open = nextMenuExpanded(button.getAttribute('aria-expanded') === 'true', 'toggle');
  button.setAttribute('aria-expanded', String(open));
  document.querySelector('#site-nav')!.classList.toggle('open', open);
});
document.querySelectorAll('#site-nav a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { event.preventDefault(); closeMenu(true); } });
document.querySelector('#prev-date')!.addEventListener('click', () => { selectedDate = shiftDate(selectedDate, -1); datePicker.value = selectedDate; void renderSchedule(); });
document.querySelector('#next-date')!.addEventListener('click', () => { selectedDate = shiftDate(selectedDate, 1); datePicker.value = selectedDate; void renderSchedule(); });
datePicker.addEventListener('change', () => { if (isLocalDate(datePicker.value)) { selectedDate = datePicker.value; void renderSchedule(); } });
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => button.addEventListener('click', () => { selectedCourt = button.dataset.filter!; document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); void renderSchedule(); }));
document.querySelectorAll<HTMLAnchorElement>('.court-link').forEach(link => link.addEventListener('click', () => { selectedCourt = link.dataset.court!; document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === selectedCourt))); void renderSchedule(); }));
document.querySelectorAll<HTMLButtonElement>('.inquiry').forEach(button => button.addEventListener('click', () => { const product = products.find(p => p.id === button.dataset.product)!; dialogContent.innerHTML = `<p class="eyebrow">Product preview</p><h2>${product.name}</h2><p>This is sample merchandise. Inquiries will open once Trisomy21’s official contact details are confirmed.</p><button class="button dialog-done" type="button">Close</button>`; dialog.showModal(); dialog.querySelector<HTMLButtonElement>('.dialog-done')!.addEventListener('click', () => dialog.close()); }));
document.querySelector<HTMLButtonElement>('.dialog-close')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
void renderSchedule();
