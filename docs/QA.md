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
