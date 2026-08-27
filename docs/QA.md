# QA retest report

Date: 2026-08-27  
Scope: remediated phase-one Trisomy21 frontend  
Verdict: **PASS WITH RENDERED-BROWSER SIGNOFF PENDING**

No known implementation or design release blocker remains in the evidence available to QA. The required automated gate passes. Rendered viewport and hands-on browser checks remain a verification limitation—not a confirmed defect—because the required browser-control runtime is unavailable in this environment.

## Automated evidence

- `npm run lint`: pass, exit 0.
- `npm run typecheck`: pass, exit 0.
- `npm run test`: pass, exit 0. Two test files and 13 tests passed.
- `npm run build`: pass, exit 0. Vite generated production HTML and hashed CSS/JS assets.

The test run used approved execution so Vitest could spawn its worker. The earlier `spawn EPERM` environment failure did not recur.

## Remediation verification

### QA-01 — Closed — automated test gate

Vitest collected and passed `src/date.test.ts` and `src/ui-state.test.ts`: 2 files, 13 tests, zero failures.

### QA-02 — Closed — invalid-date fallback

- Evidence: `resolveRequestedDate` marks invalid dates as fallback conditions; `src/app.ts` renders a persistent visible `role="status"` notice beside the schedule controls.
- Scenario: `?date=2026-02-30` resolves to the Asia/Manila local today and displays that the requested value is not a calendar date.
- Tests: valid/invalid/empty date resolution is covered in `src/ui-state.test.ts`.
- Result: the explanation is no longer overwritten by the schedule-updated live message.

### QA-03 — Closed — schedule data states

`scheduleState` accepts only `empty`, `fully-booked`, `partial`, `error`, and `offline`; other values fall back to normal deterministic availability.

- `?scheduleState=empty`: renders “No playing hours are listed for this date” and a next-day action.
- `?scheduleState=fully-booked`: converts all exposed slots to privacy-safe “Booked,” states that no open times exist, and offers the next day.
- `?scheduleState=partial`: retains the successful court, identifies the unavailable court, and exposes Retry.
- `?scheduleState=error`: renders an alert with plain-language failure copy and Retry.
- `?scheduleState=offline`: renders an alert with connection guidance and Retry.
- Missing schedule cells now use an explicit “Unavailable / Could not load” fallback rather than a non-null crash path.
- Tests cover empty, partial, offline, and fully-booked service results; production code contains the error branch and allow-listed query parsing.

These states are deterministic preview hooks, so Retry intentionally repeats the selected scenario until the query parameter is removed; this is acceptable for frontend demonstration data and should be replaced by real transport retry behavior with the backend.

### QA-04 — Closed — mobile-menu Escape behavior

- Evidence: the open disclosure listens for Escape, closes the panel, resets `aria-expanded` to `false`, and restores focus to the Menu button.
- Anchor selection also closes the disclosure.
- Tests cover Escape, anchor selection, and toggle state behavior.

### QA-05 — Closed by approved design decision

`docs/COMPONENTS.md` and `docs/ANIMATIONS.md` now define the phase-one mobile navigation as a compact non-modal disclosure that opens immediately without backdrop or translation. The current implementation conforms. This is a documented Designer resolution, not an implementation defect.

## Static regression evidence

- The page retains one H1, landmarks, skip link, labeled controls, visible focus styling, and reduced-motion/forced-colors CSS.
- Court rules remain exactly “Be respectful and friendly.” and “Enjoy the game.”
- Booked slots expose only “Booked”; no personal/payment data or transactional UI is present.
- Sample availability, provisional prices, media, and venue details remain explicitly labeled.
- Date and court selections update query parameters while preserving `scheduleState` through URL mutation.
- Production compilation and bundling complete successfully.

## Rendered-browser verification limitation

The required in-app browser-control runtime is unavailable, so QA could not directly execute or visually inspect the page at 375, 768, 1024, 1440, or 1920 px. The same limitation applies to hands-on keyboard traversal, 200% zoom, screen-reader announcement order, computed contrast, real horizontal overflow, sticky CTA obstruction, native dialog focus behavior, and reduced-motion rendering.

These are **unverified checks, not observed defects**. Before public deployment, complete a rendered browser pass at all required widths and verify keyboard focus/Escape behavior, dialogs, schedule scenarios, zoom/overflow, contrast, sticky CTA clearance, and reduced motion. Reopen QA only if that pass finds a defect.

---

## Option A palette and branded-imagery regression

Date: 2026-08-27  
Branch: `vercel`  
Verdict: **PASS WITH ONE NON-BLOCKING DOCUMENTATION DEFECT AND RENDERED-BROWSER SIGNOFF PENDING**

### Required gates

- `npm run lint`: pass, exit 0.
- `npm run typecheck`: pass, exit 0.
- `npm run test`: pass, exit 0; 2 files and 13 tests passed.
- `npm run build`: pass, exit 0; Vite produced production HTML and hashed CSS/JS assets.

### Palette verification

- The effective `:root` tokens match the approved Option A table in `docs/DESIGN.md`: ink `#080D15`, canvas `#F4F6F8`, surface `#FFFFFF`, surface-dark `#101A29`, line `#C8CED8`, line-dark `#334155`, muted `#525D6D`, muted-on-dark `#B8C2D1`, primary `#066EE8`, primary-hover `#0054B8`, accent-lime `#C7F000`, food-warm `#B45309`, focus `#1457D9`, and danger `#B42318`.
- Primary actions resolve to electric blue and blue hover; the light courts, canteen, and shop use the approved canvas while header, schedule, visit, and footer use near-black framing.
- Schedule statuses retain explicit text labels in markup and match the approved combinations: Available `#EAF7B0/#080D15/#8FB000`; Pending `#FDE7C2/#713F12/#D97706`; Booked `#E2E8F0/#334155/#64748B`; Closed `#263243/#FFFFFF/#94A3B8`.
- Available-slot secondary text is explicitly near-black. Pending and booked secondary text inherit their approved dark foregrounds. Closed secondary text uses `muted-on-dark`, avoiding the legacy low-opacity treatment.
- Lime surfaces use near-black text: preview bar, selected court filter, available slot, and mobile availability CTA. No implemented white-on-lime pairing was found.
- Dark-surface supporting copy uses `muted-on-dark`, including schedule headings/labels/slot detail, visit metadata, and footer notes.
- `food-warm` is confined to the canteen eyebrow and contained counter callout. It is not used as a section wash.
- Global `:focus-visible` uses the approved 2px focus-blue outline, 3px offset, and 2px white separation halo, keeping focus distinct on dark and blue components.

The stylesheet still contains legacy declarations before the final Option A override block, but the later declarations produce the approved computed values. This is not a functional defect; consolidation may improve maintainability in a future cleanup.

### Branded imagery verification

- All eight referenced PNG assets exist and are non-empty: logo, hero, two courts, canteen, club shirt, pickleballs, and net/frame.
- Direct image decoding/inspection succeeded for the logo, hero, Court 1, canteen, shirt, pickleballs, and net/frame assets. Images consistently use the approved night-court blue/lime/near-black direction.
- The official logo and hero artwork are labeled as official; generated venue/product imagery is visibly labeled “Concept image.” Court and product images have descriptive alternative text, while the repeated logo uses an empty image alt inside a named home link to avoid duplicate announcement.
- CSS reserves hero, court, canteen, and product aspect ratios and uses `object-fit: cover`, reducing layout shift and inconsistent crops.

### QA-PAL-01 — Low — component documentation retains superseded green-primary guidance

- Severity: Low; non-blocking documentation inconsistency.
- Location: `docs/COMPONENTS.md`, Shared behavior.
- Reproduction: compare “Primary controls use court green” with the approved Option A palette in `docs/DESIGN.md` and the implemented blue primary token.
- Expected: component guidance identifies electric blue/`primary` as the approved primary action color.
- Actual: the component document still instructs future agents to use court green, while implementation and design specification use electric blue.
- Recommended fix: Designer should update the sentence to reference `primary`/electric blue so future work does not regress the palette.
- Routing: Manager → Designer.

### Rendered-browser limitation

The browser-control runtime remains unavailable, so responsive rendering and page overflow could not be directly observed at 375, 768, 1024, 1440, or 1920 px. Static CSS review shows bounded media, `minmax(0, ...)` hero columns, mobile stacking, scroll-contained court filters, a mobile schedule list, and a 1280px maximum content width; no definite overflow defect was found.

This is an **unverified responsive signoff item, not an observed defect**. Before public deployment, visually inspect all five required widths plus 200% zoom, with particular attention to logo/header height, mobile menu, fixed CTA clearance, image crops, schedule controls, and horizontal page overflow.
