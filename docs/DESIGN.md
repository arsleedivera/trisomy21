# Trisomy21 website design

Status: approved frontend specification for phase one and ready for Developer handoff. Backend booking, ordering, payments, and inventory are deferred.

## Content status and placeholder convention

The Manager/user approved placeholders for every missing brand, media, and business detail, including all prices. Keep placeholders in the mock-data layer rather than scattering fallback strings through components. Every placeholder value must begin with `[PLACEHOLDER:` and end with `]`, making it searchable with `rg "\\[PLACEHOLDER:"`. Examples: `[PLACEHOLDER: OFFICIAL LOGO]`, `[PLACEHOLDER: COURT 1 PHOTO]`, `[PLACEHOLDER: COURT RATE]`, and `[PLACEHOLDER: SHIRT PRICE]`.

Placeholder content is never presented as verified. In the rendered preview, pair it with a nearby “Sample content” label or use neutral language such as “Price to be confirmed.” Verified owner-supplied fields should carry a `contentStatus: "verified"`; placeholder fixtures use `contentStatus: "placeholder"`. The UI must not rely on the bracketed developer token alone to explain status to visitors.

## Product intent

Trisomy21 is a pickleball venue with two courts, an on-site kitchen/canteen, club merchandise, pickleballs, and custom net-and-frame builds. The first release helps visitors answer: what is it like to play here, when is a court available, what can I eat, and what gear can I buy?

This is a polished sales demonstration, not a working reservation or commerce system. Availability is representative mock data and every booking/order action must say so. Do not collect payment or sensitive personal data.

## Experience direction

The visual idea is **courtside social club**: energetic but composed, local rather than corporate, and useful while planning a game. Use court geometry, crisp rules, confident typography, candid photography, and a compact live-schedule motif. Avoid a generic SaaS dashboard, card walls, neon gaming aesthetics, glass effects, decorative gradients, and sports clichés.

The experience should feel active through image crops and court lines; welcoming through people, food, and social play; trustworthy through clear hours, amenities, and demo labels; and fast through immediate content and restrained motion.

## Content architecture

Use one landing page with anchored navigation:

1. **Header:** identity, Courts, Schedule, Canteen, Shop, and “View availability.”
2. **Hero:** venue-led headline, one-line value, “View court schedule,” “Explore the courts,” and one authentic image.
3. **Courts:** Court 1 and Court 2 with placeholder photos and clearly labeled placeholder surface, lighting/cover, amenities, capacity, and rates until confirmed. The court-rules block contains exactly the two approved rules defined below.
4. **Availability:** selected date, adjacent-day controls, date picker, court filter, legend, time grid, and persistent demo notice.
5. **Canteen:** hospitality story, hours, featured menu groups/items, and “Order at the canteen.” No fake checkout.
6. **Shop:** club shirts, pickleballs, and custom net + frame builds. Custom builds use an inquiry action.
7. **Visit:** address, hours, contact, parking/access details, and a map only after location verification.
8. **Footer:** identity, navigation, contact/social links, copyright, and preview note where needed.

On mobile, a sticky “Check availability” action is allowed after the hero if it does not cover content. Desktop needs no floating CTA.

## Core journeys

**Check a court:** select a date and court, inspect slots, then open an available slot. Phase one responds: “Online booking will be available soon. Contact Trisomy21 to reserve.” Offer phone/message only when verified.

**Plan food:** scan food/drink categories and canteen hours. Any availability is labeled as sample, not live stock. Ordering is on-site until a backend exists.

**Browse products:** compare products and placeholder variants/prices clearly labeled as samples. “Ask about this item” carries product context into a future contact flow. Custom net + frame content explains the scope and uses “Request a quote.”

## Court rules

The user-facing court-rules list must contain exactly these two rules, with this capitalization and punctuation:

1. Be respectful and friendly.
2. Enjoy the game.

Do not add implied policies, etiquette, footwear, safety, cancellation, food, or equipment rules to this list until the owner approves revised copy. Operational booking facts belong outside the court-rules list.

## Availability and privacy

The schedule is not a member directory. Show only:

- available: “Available”;
- held: “Pending” or “Reserved”;
- booked: first name + last initial (for example “Mika R.”), a consented neutral group name, or preferably “Booked”;
- private: “Private booking.”

Never expose full names, contact details, payment state, notes, or booking IDs. Mock data uses fictional names and a pre-sanitized `publicLabel`. Timezone is Asia/Manila. Use local dates and 12-hour time unless owner research says otherwise.

The grid covers confirmed opening hours only. If unknown, visibly label demo hours (for example 8:00 AM–10:00 PM) and 60-minute slots as assumptions. Do not merge adjacent slots if comparison becomes harder.

## Visual system

The owner-supplied logo artwork establishes **Option A: Night Court Editorial** as the approved visual palette. Business details and prices remain placeholders. Near-black frames the header, schedule, footer, and selected hero treatments; the courts, canteen, and shop remain on the light canvas. Electric blue carries primary actions, while neon lime is reserved for selected and available accents and sparse highlights.

| Token | Value | Purpose |
| --- | --- | --- |
| `ink` | `#080D15` | Near-black text and branded framing |
| `canvas` | `#F4F6F8` | Light courts, canteen, and shop background |
| `surface` | `#FFFFFF` | Light controls and raised content surfaces |
| `surface-dark` | `#101A29` | Schedule table and dark inset surfaces |
| `line` | `#C8CED8` | Dividers on light surfaces |
| `line-dark` | `#334155` | Dividers and control borders on dark surfaces |
| `muted` | `#525D6D` | Supporting text on light surfaces |
| `muted-on-dark` | `#B8C2D1` | Supporting text on dark surfaces |
| `primary` | `#066EE8` | Primary actions and branded emphasis |
| `primary-hover` | `#0054B8` | Primary hover and pressed state |
| `accent-lime` | `#C7F000` | Selected/available accents and sparse highlights |
| `food-warm` | `#B45309` | Canteen eyebrow and contained hospitality callout |
| `focus` | `#1457D9` | Focus ring |
| `danger` | `#B42318` | Errors |

Do not place white text or body copy on `accent-lime`; use `ink` on lime. Canteen warmth is contained to its eyebrow and callout rather than becoming a section wash. Color never communicates status alone: schedule states retain explicit text labels and use these approved combinations:

| Status | Background | Text | Marker |
| --- | --- | --- | --- |
| Available | `#EAF7B0` | `#080D15` | `#8FB000` |
| Pending | `#FDE7C2` | `#713F12` | `#D97706` |
| Booked | `#E2E8F0` | `#334155` | `#64748B` |
| Closed | `#263243` | `#FFFFFF` | `#94A3B8` |

Keyboard focus uses a 2px `focus` ring with a 2–3px offset. Dark and blue components add a white separation halo so the ring remains distinct from their surface.

Use a licensed/self-hosted condensed display face only if supplied. Safe stacks: `Arial Narrow, Roboto Condensed, ui-sans-serif, system-ui` for short headings and `Inter, ui-sans-serif, system-ui` for body/UI. Do not fetch fonts without approval. Hero 48/52 desktop and 36/40 mobile; H1 40/44; H2 32/38 desktop and 28/34 mobile; H3 22/28; body 16/26; UI 14/20.

Use a 4px spacing base: 4, 8, 12, 16, 24, 32, 48, 64, 96. Gutters: 20px at 375, 32px at 768, 48px from 1024. Maximum content width 1280px; reading width 680px. Touch targets are at least 44px. Corners are modest (6–12px); schedule cells are not pills.

## Imagery requirements

The supplied owner artwork is the authoritative logo and hero source. Generated concept imagery now fills the court, canteen, shirt, pickleball, and net/frame slots for the proposal; each generated asset is visibly labeled “Concept image.” Replace these with real, consented venue and product photography before the purchased production release. Reserve ratios: hero 16:10 mobile/~3:2 desktop; courts and canteen 4:3; products 4:5.

Until supplied, use neutral labeled placeholders or local abstract court textures—not unrelated stock. Image records use searchable values such as `[PLACEHOLDER: HERO COURT IMAGE]`, and rendered placeholders visibly say “Photo coming soon” or “Sample image.” Useful real images get descriptive alt text; decorative court lines get empty alt/CSS.

## Responsive behavior

- **375px:** one column; compact menu; scrollable date strip with affordance; one court at a time; vertical time-slot list.
- **768px:** editorial sections may use two columns; show both courts only if cells stay at least 140px wide.
- **1024px:** persistent nav, two-column court comparison, aligned time + two-court schedule.
- **1440/1920px:** retain 1280px max width and add outer whitespace, not larger text.

Source order remains logical. All functions work at 200% zoom without horizontal page scrolling.

## Accessibility

Target WCAG 2.2 AA. Include skip link, landmarks, one H1, logical headings, visible 2px focus ring, descriptive labels, 44px targets, form labels, and live status announcements. Body contrast is at least 4.5:1 and controls/graphics 3:1.

The schedule works without color. Desktop may use a semantic table; mobile uses an equivalent list without duplicated accessible content. Date controls expose state. Popovers close with Escape and restore focus. Date changes preserve focus and politely announce “Schedule updated for…”. Respect reduced motion/high contrast; autoplay nothing.

## Mock data and backend boundary

Keep deterministic fixtures outside components:

- `Court`: id, name, slug, summary, features, image, alt, active, contentStatus;
- `ScheduleDay`: localDate, timezone, openingTime, closingTime, slots;
- `Slot`: id, courtId, start, end, status (`available | pending | booked | closed`), publicLabel;
- `MenuItem`: id, name, description, category, priceDisplay, dietaryTags, image, availabilityLabel, contentStatus;
- `Product`: id, name, category, description, priceDisplay, variants, image, actionType, contentStatus;
- `SiteSettings`: hours, address, contacts, socials, notice, contentStatus.

Never randomize status during render. Show “Sample availability—not live booking data.” Placeholder prices must be recognizable mock values in fixtures and render as “Sample price: ₱…” or “Price to be confirmed,” never as an unlabeled live price. Service boundaries: `getCourts()`, `getAvailability(date, courtIds?)`, `getMenu()`, and `getProducts()`. Future `createBookingIntent`/`createInquiry` require product approval. Preserve date/court in query parameters. Later, server time is authoritative. Define loading, empty, partial, offline, and error states now. No auth, payment, cart, or personal-data storage in phase one.

## Placeholder replacement checklist

- `[PLACEHOLDER: OFFICIAL LOGO]`, brand palette, tone/tagline.
- Court names/photos, features, rates, slot length, hours, and operating facts. Court rules remain the two approved lines above unless explicitly revised.
- Canteen menu, every price, hours, allergen wording, and future pre-order need.
- Product photos, variants, every price, fulfillment, and custom-build service area/quote process.
- Address/map pin, contacts/socials, parking/access notes, and policies.
- Public booking label policy; “Booked” remains the privacy default.

When the owner supplies a value, replace the corresponding `[PLACEHOLDER: ...]`, set its `contentStatus` to `verified`, remove only its associated “Sample” label, and retain review history in content data or project documentation.
