# Trisomy21 component specification

Status: approved phase-one frontend specification, finalized for Developer handoff. Components consume deterministic mock data through replaceable service interfaces.

## Shared behavior

Use semantic HTML first. Every control defines default, hover, focus-visible, pressed, disabled, loading, and error states where relevant. Focus is not hover. Primary controls use the approved electric blue (`primary` / `#066EE8`, with `primary-hover` / `#0054B8`); neon lime is reserved for selected, available, and sparse highlight accents. Secondary controls use a visible border; body links are underlined. Keep one primary action per decision group.

All unknown content comes from searchable `[PLACEHOLDER: ...]` fixture values with `contentStatus: "placeholder"`. Components translate that state into visible “Sample content,” “Sample price,” “Price to be confirmed,” or “Photo coming soon” language. Never display an unlabeled placeholder as verified. Owner-confirmed records use `contentStatus: "verified"`.

## Global header

Contains logo/wordmark, Courts, Schedule, Canteen, Shop, and “View availability.” Desktop navigation is inline from 1024px. Mobile uses a compact non-modal disclosure anchored below the header; it opens/closes immediately without a backdrop or translation and does not trap or move focus on open. Its labeled Menu button exposes `aria-expanded`; Escape and anchor selection close it, and Escape restores focus to the Menu button. Current section uses weight and underline, not color alone. A future modal/full-screen drawer would require inert background, focus containment, and the separate drawer motion documented in `ANIMATIONS.md`.

## Hero

A two-part editorial layout with short headline, concise copy, two actions, operating status only if backed by known hours, and a venue image. Content is readable before the image loads. No carousel, autoplay video, counters, or oversized slogan.

## Court showcase

Render two `CourtFeature` sections, not generic cards. Each has name, image, description, 3–5 verified features, and “See this court’s schedule.” Alternate image/text on wide screens while preserving source order. Mobile stacks image, text, action. Missing details are omitted. Image loading reserves space; failure uses a labeled neutral surface; maintenance gets explicit status.

`CourtRules` renders exactly two list items and no additional user-facing rules:

1. Be respectful and friendly.
2. Enjoy the game.

Do not derive extra court rules from feature, schedule, or placeholder data.

At 639px and below, the two `CourtFeature` items use the shared `MobileCollectionCarousel`. Keep each image, name, details, and schedule link together in semantic source order. `CourtRules` stays outside the carousel.

## Availability explorer

### Composition

`AvailabilityExplorer` contains:

1. heading and sample-data notice;
2. `DateNavigator` with previous, selected date/native picker, next, and optional Today;
3. `CourtFilter`: All courts, Court 1, Court 2;
4. `AvailabilityLegend`: Available, Pending/Reserved, Booked, Closed;
5. desktop `ScheduleGrid` or mobile `ScheduleList`;
6. polite live region;
7. inline empty/error/retry state.

### Slot behavior

Each slot exposes court, start/end, status, and sanitized public label. Available slots are buttons named like “Court 1, 6:00 PM to 7:00 PM, available.” Booked/closed slots are plain status cells unless details add useful, non-sensitive information. Do not make unavailable slots disabled buttons merely for tooltips.

Available selection opens inline detail on desktop and a compact dialog/sheet on mobile. Repeat court/date/time and state that online booking is inactive. Show “Contact Trisomy21” only with verified contact data; otherwise “Close.” Booked detail exposes only public label and time.

Desktop uses a semantic table with a selected-date caption and `<th>` headers. Mobile uses one selected court and a list grouped by time. Only one representation is exposed to assistive technology. Native tab/button order is sufficient; no custom arrow-key grid.

Date changes preserve court filter, localize loading to results, and preserve focus. Query parameters are `date=YYYY-MM-DD` and optional `court=<slug>`. Invalid dates fall back with an explanation.

### Data states

- Loading: keep dimensions, announce loading, show static placeholders after a short delay.
- Empty: “No playing hours are listed for this date,” with next-day action.
- Closed: label “Closed”; do not imply sold out.
- Fully booked: say no open times and offer adjacent dates.
- Partial failure: retain successful court and show inline error in the failed column.
- Error/offline: plain language, retry, and verified contact fallback.
- Mock mode: persistent “Sample availability—not live booking data.”

## Canteen

Use an editorial intro, `MenuCategory` lists, and a limited featured image grid. `MenuItem` includes name, description, price if confirmed, verified dietary markers, and availability text. Never infer allergen safety.

The action is “Order at the canteen” or “View menu,” not “Order now.” Placeholder prices render “Sample price: ₱…” or “Price to be confirmed”; missing price says “Ask at the counter,” never `₱0`. Define empty menu, unavailable item, and image-failure states.

At 639px and below, individual menu items use `MobileCollectionCarousel`. Keep category, name, complete description, availability, and price visible with no line clamp. Use intrinsic card heights and top alignment so variable copy neither clips nor creates large forced empty areas. Do not create nested category carousels for the current menu.

## Shop

Use `ProductList` with three merchandise stories:

- Club shirts: image, story, confirmed sizes/colors/price, “Ask about this shirt.”
- Pickleballs: confirmed pack/spec/price, “Ask about pickleballs.”
- Custom net + frame: scope image, included elements, confirmed service area/lead time, “Request a quote.”

Product tiles may use borders and 8–12px corners but cannot nest cards. Actions open a non-transactional inquiry notice or verified contact channel. Variant controls state that inventory is not live. No cart, checkout, fake scarcity, reviews, or payment UI.

Every provisional product price and variant is visibly labeled as sample. A numeric placeholder price must never appear beside purchase-like language.

At 639px and below, the three Club Essentials products use `MobileCollectionCarousel`. Each card keeps image, name, complete summary/variants/sample price, and inquiry action together. At 640px and above, retain the product grid.

## Mobile collection carousel

`MobileCollectionCarousel` progressively enhances one ordered collection. Use a section-local region with `role="region"`, `aria-roledescription="carousel"`, and an accessible name derived from its visible section heading. Items remain `<article>` elements or `<li>` elements within a semantic list; each uses `role="group"`, `aria-roledescription="slide"`, and a positional label such as “Court 1 of 2: Court 1.” Do not apply `aria-hidden` to off-screen items; all content and actions remain available in normal reading and focus order.

Place a controls row after the track. Native buttons use collection-specific labels: “Previous/Next court,” “Previous/Next menu item,” or “Previous/Next club essential.” A visible status names the current type/item and position. It may be a polite atomic live region only for Previous/Next button changes. Touch/trackpad/native scrolling updates visible status after scrolling settles without announcing every intermediate intersection; debounce settled-scroll detection.

Previous/Next moves exactly one item and leaves focus on the activated button. It never focuses a card. Previous is natively disabled at item one; Next is disabled at the last item; there is no wrapping. With zero items, show the documented empty state and omit all carousel chrome. With one item, show the item and omit controls/status.

Touch and trackpad use native scrolling. Keyboard users Tab through controls and native card actions in DOM order. Do not capture document ArrowLeft/ArrowRight. If the overflow track naturally needs `tabindex="0"` for discoverability, arrow keys retain native scrolling and do not move focus or selection. Use `scroll-margin-inline: 20px` so focused content and focus rings are fully visible.

On resize/orientation change, recompute geometry and align the previously current item without animation. At 640px, remove carousel-only roles, chrome, and overflow behavior while exposing the same DOM items in the editorial/list/grid layout; do not maintain duplicate mobile and desktop copies.

Without JavaScript, the mobile track stays horizontally scrollable and snap-enabled, and all items/actions remain usable. Hide Previous/Next and status by default until enhancement initializes. An input-neutral “Scroll for more items” instruction may remain, but it cannot be the only overflow cue.

## Visit and footer

`VisitSection` presents only verified address, hours, contacts, directions, parking, and accessibility notes. A map requires a correct pin, title, privacy/performance consideration, and directions fallback; otherwise use text.

Footer repeats essential navigation and contacts/socials. External links identify their service and stay in the same tab by default.

## Dialogs and status

Dialogs are reserved for slot/inquiry details. They have title, close button, sensible initial focus, trap, Escape, inert background, and focus restoration. Important outcomes stay inline; toasts are never sole confirmation.

The schedule demo notice is adjacent and persistent. A site-wide prototype banner may say: “Website preview—availability, prices, and ordering are samples.”

## Backend-ready events

Components emit intent without owning transport:

- `onDateChange(localDate)`
- `onCourtFilterChange(courtIds)`
- `onSlotSelect({ slotId, courtId, localDate })`
- `onMenuItemSelect(itemId)`
- `onProductInquiry({ productId, variantId? })`
- `onContact(method, context)`

Do not log names, contacts, or slot IDs to analytics by default. Future API records map to public view models before display. Full booking records never enter the public bundle.

## Acceptance criteria

- Every action works by keyboard and has an accessible name/state.
- Schedule meaning survives color removal and 200% zoom.
- Test 375, 768, 1024, 1440, 1920px with no accidental page overflow.
- Long names, prices, and labels wrap safely.
- Mock status is unmistakable; no action implies completed booking/order/purchase.
- `rg "\\[PLACEHOLDER:"` locates every unresolved fixture; each has a visible sample state in the relevant UI.
- `CourtRules` contains exactly the two approved sentences, including punctuation.
- Loading, empty, partial, error, offline, and image-failure states preserve layout and recovery.
- Stable fixtures and IDs permit later API integration without changing UI behavior.
- Mobile collection carousels preserve every item, full text, native actions, focus order, and boundary state without autoplay or looping.
