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

---

## Removed feature history — floating quick links

Date removed: 2026-08-27  
Status: **REMOVED BY PRODUCT DIRECTION**

The floating quick-links experiment and its feature-specific tests were removed before release. Its earlier QA findings, QA-QL-01 and QA-QL-02, had been remediated before removal; neither applies to the current product. The standard mobile “Check availability” CTA remains the active fixed navigation treatment. No quick-links browser signoff is required.

---

## Mobile collection carousel QA

Date: 2026-08-27  
Branch: `vercel`  
Verdict: **FAIL — one empty-state defect; populated carousel behavior passes static/automated review; browser signoff pending**

### Automated evidence

- `npm run lint`: pass, exit 0.
- `npm run typecheck`: pass, exit 0.
- `npm run test`: pass, exit 0; 3 files and 20 tests passed.
- `npm run build`: pass, exit 0; production assets generated successfully.
- Carousel tests cover nearest settled index, one-step clamped movement, native boundaries, type-specific labels, track-relative targets, reduced-motion behavior, and button-only announcements.

### Verified implementation evidence

- Enhancement is limited to `max-width:639px`. At 640px and above, carousel roles, labels, tabindex, controls, status, and overflow styling are removed/hidden; existing court, menu, and product layouts remain.
- Each collection uses its original articles in one DOM track. There are no clones, duplicate mobile copies, autoplay, loops, arrow-key capture, or carousel dependency.
- Mobile CSS uses 20px outer/end gutters, a 12px gap, and `clamp(260px, calc(100vw - 64px), 340px)` cards. Cards are top-aligned with intrinsic height; full descriptions, variants, prices, availability, anchors, and actions remain untruncated inside each card.
- Tracks use native horizontal overflow, mandatory start snapping, normal snap stop, and `touch-action:pan-x pan-y`. Native scrollbars remain visible.
- Settled position uses the nearest leading edge with a 140ms debounce. Passive/native scrolling updates visible status silently.
- Status, control labels, slide labels, and button-triggered announcements are type-specific for Court, Menu item, and Club essential.
- Previous/Next moves one clamped index, retains button focus, uses native disabled boundaries, does not wrap, and never focuses a card.
- Smooth movement is used only for button input without reduced motion. Reduced-motion and resize alignment are immediate.
- Mobile tracks are heading-labeled carousel regions; original articles become positional slide groups. Offscreen slides are not `aria-hidden`, and actions remain in DOM focus order. Carousel-only semantics are removed at desktop widths.
- Without JavaScript, mobile overflow and snap remain usable; controls/status are enhancement-only. One-item collections omit controls/status. Index state is retained and realigned without animation on resize/orientation configuration.

### QA-CAR-01 — Medium — zero-item collection lacks an empty state and is exposed as an empty carousel

- Location: `src/mobile-carousel.ts:52-67`.
- Reproduction: initialize a `[data-carousel]` track with zero child articles at 639px or below.
- Expected: show the collection’s documented empty state and omit carousel chrome and semantics.
- Actual: the shared `slides.length <= 1` branch adds `role="region"` and `aria-roledescription="carousel"` even when there are zero slides, without rendering an empty-state message. Controls/status are omitted, but assistive technology encounters a named empty carousel.
- Recommended fix: handle zero separately from one, leave carousel semantics absent, ensure the owning collection renders its type-appropriate empty state, and add zero-item regression tests.
- Routing: Manager → Developer.

### Browser verification limitation

The browser-control runtime remains unavailable. QA could not directly test 375px/200% zoom rendering, 639↔640 transitions, peek/gutter measurements, vertical-versus-horizontal touch and trackpad behavior, snap settling, rapid input, native focus/disabled rendering, live announcements, intrinsic heights, orientation changes, or page overflow.

These are unverified browser checks rather than additional observed defects. After QA-CAR-01 is remediated, perform hands-on testing at 375px and the 639/640 boundary, then regression-check 768, 1024, 1440, and 1920px.

### QA-CAR-01 remediation retest

Date: 2026-08-27  
Verdict: **PASS WITH RENDERED-BROWSER SIGNOFF PENDING**

- `npm run lint`: pass, exit 0.
- `npm run typecheck`: pass, exit 0.
- `npm run test`: pass, exit 0; 3 files and 22 tests passed.
- `npm run build`: pass, exit 0; production assets generated successfully.

#### QA-CAR-01 — Closed

- Zero-item collections now render type-specific owning-section copy: “No courts are listed right now,” “The sample canteen menu is not available right now,” and “No club essentials are listed right now.”
- The enhancement contract returns no carousel semantics and no controls for a zero count. Initialization removes any carousel role, roledescription, label reference, tabindex, and enhanced class, then exits without generating controls/status.
- One-item collections remain differentiated: the single existing article receives the heading-labeled carousel region and positional slide semantics on mobile, while no Previous/Next controls or status/live-region chrome is created.
- Populated collections retain the existing controls, settled status/announcement behavior, slide semantics, and responsive configuration.
- Regression tests explicitly cover zero `{ semantics:false, controls:false }` and one `{ semantics:true, controls:false }`, while the prior movement, boundary, labeling, reduced-motion, and announcement tests remain passing.

No known mobile-carousel implementation blocker remains in static and automated evidence. Direct browser verification at 375px/200% zoom and across the 639/640 breakpoint remains a deployment signoff limitation, not an observed defect.

### Focused Canteen carousel correction

Date: 2026-08-27  
Verdict: **PASS WITH RENDERED-BROWSER SIGNOFF PENDING**

- `npm run lint`: pass, exit 0.
- `npm run typecheck`: pass, exit 0.
- `npm run test`: pass, exit 0; 3 files and 23 tests passed.
- `npm run build`: pass, exit 0; production assets generated successfully.

#### Structure and behavior evidence

- The Canteen track is a semantic `<ul>` and the carousel initializer selects only direct children marked `[data-carousel-slide]` through `:scope > [data-carousel-slide]`.
- Every marked Canteen slide is one `<li>` containing exactly one complete `<article class="menu-item">` with category, name, full description, sample availability, and its own price.
- The Canteen intro, heading, descriptive copy, hours, and concept image are in `.canteen-intro` before the menu track. The counter note follows the closed track and remains outside it. None can be counted or labeled as a slide.
- Controls/status are inserted directly after the populated menu track, before the stationary counter note. With the current three menu items they expose Menu item labels/status, one-step boundary behavior, and settled button-only announcements through the shared verified implementation.
- Empty menu rendering produces one unmarked `.collection-empty` list item, so slide count is zero and no carousel semantics or controls are added. A one-item menu produces one marked slide with region/slide semantics and no controls/status. Populated menu items receive normal controls and labels.
- At 640px and above, mobile overflow styling does not apply, controls remain hidden, and the wrapper `<ul>` has reset list margin/padding while each full menu article retains the established desktop list-row layout.
- Courts and Club Essentials keep their prior article markup/content and now carry only the same direct `data-carousel-slide` marker used by the generic selector; their carousel structure and behavior are otherwise unchanged.
- The focused regression test confirms the menu track contains marked menu slides/articles, excludes Canteen intro/media/counter-note content, and precedes the counter note.

No defect was found in this focused correction. Hands-on mobile/desktop rendering remains covered by the existing browser-runtime limitation rather than a new observed issue.

### Canteen carousel containment retest

Date: 2026-08-27  
Verdict: **PASS**

- `npm run lint`: pass, exit 0.
- `npm run typecheck`: pass, exit 0.
- `npm run test`: pass, exit 0; 3 files and 24 tests passed.
- `npm run build`: pass, exit 0; production assets generated successfully.

#### Independent implementation evidence

- Canteen grid descendants now use `min-width:0` and `max-width:100%`, with the intro, menu list, and menu track explicitly bounded to `width:100%`. The canteen image and stationary counter note are capped to their container; long counter text may wrap instead of widening the page.
- At 639px and below, `.collection-track` is explicitly `width:100%; max-width:100%; min-width:0; overflow-x:auto; overflow-y:hidden` with no negative right margin. Its marked slides own their clamped width and internal wrapping. The menu article is constrained to its slide.
- No `overflow-x:hidden` is applied to `html` or `body`; page overflow is not concealed globally. The horizontal overflow remains localized to each collection track.
- The containment rules are scoped without changing desktop display/grid declarations. At 640px and above the carousel media rules do not apply; the Canteen two-column/list presentation and product/court desktop layouts remain governed by their existing rules.
- Courts and Club Essentials share the bounded mobile track rules and keep their prior marked articles, content, controls, and desktop layouts. No section-specific regression was found.
- Regression tests assert the Canteen containment chain, localized `overflow-x:auto`, constrained menu item, and absence of global overflow masking.

#### Rendered evidence supplied by Manager

At 375×667, the rendered browser reported `documentElement.clientWidth=360` and `scrollWidth=360` (0px global overflow). The Canteen menu track measured `clientWidth=320` and `scrollWidth=978`, confirming it remains internally horizontally scrollable. The Canteen and Shop right edges both measured 360px. The screenshot showed “Menu item 1 of 3,” Previous natively disabled, Next enabled, and the counter note stationary outside the track.

This rendered evidence closes the focused containment concern. Broader gesture, screen-reader, 200% zoom, and cross-browser checks remain general deployment QA items, but no containment defect or release blocker is known.

### Canteen responsive restoration QA

Date: 2026-08-27  
Verdict: **FAIL — exact 640px breakpoint conflict**

- `npm run lint`: pass, exit 0.
- `npm run typecheck`: pass, exit 0.
- `npm run test`: pass, exit 0; 3 files and 25 tests passed.
- `npm run build`: pass, exit 0; production assets generated successfully.

#### Passing evidence

- Above 640px, `.section.canteen` returns to the shared 1280px maximum and a clean `minmax(0,.8fr) / minmax(0,1.2fr)` two-column layout with bounded responsive gap. Intro, heading, copy, hours, and image remain left; the complete menu rows and counter note remain right.
- Desktop menu wrappers are visually neutral: the track/list and slides are block-level, full width, unstyled as list chrome, with visible overflow and no snap. Each menu article returns to the established full-width grid row with transparent background and bottom divider.
- Desktop controls are force-hidden, while JavaScript removes carousel region/slide labeling, tabindex, and mobile-only semantics when the `max-width:639px` query no longer matches.
- At 639px and below, the previously verified localized horizontal overflow, containment, snapping, full cards, controls/status, and zero-page-overflow contract remain unchanged.
- No changes specific to Courts or Club Essentials were introduced by the Canteen restoration block.

### QA-RESP-01 — Medium — legacy mobile rules still apply at exactly 640px

- Location: `src/styles.css` legacy `@media(max-width:640px)` block versus carousel/restoration boundaries at `max-width:639px` and `min-width:640px`.
- Reproduction: render at an exact CSS viewport width of 640px.
- Expected: because mobile carousels stop at 639px, 640px and above use the shared non-mobile section gutters and restored editorial/list/grid layouts.
- Actual: both the legacy `max-width:640px` block and the new `min-width:640px` restoration block match. The restoration resets the Canteen grid and menu wrappers but does not reset `.section` padding, so Canteen retains the 20px mobile gutter/padding instead of the shared 32px tablet gutter. The same legacy block also keeps Courts in its one-column mobile feature layout and Club Essentials in a one-column product grid at exactly 640px even though carousel behavior is off.
- Recommended fix: align the legacy mobile breakpoint to `max-width:639px`, or explicitly restore the shared section padding and Court/Product non-mobile layouts at `min-width:640px`. Add an exact-boundary regression assertion rather than checking only for the presence of the desktop restoration string.
- Routing: Manager → Developer.

No defect was found at 639px or above 640px. QA-RESP-01 is confined to the exact 640px overlap but blocks a clean acceptance of the specified boundary.

### QA-RESP-01 remediation retest

Date: 2026-08-27  
Verdict: **PASS**

- `npm run lint`: pass, exit 0.
- `npm run typecheck`: pass, exit 0.
- `npm run test`: pass, exit 0; 3 files and 26 tests passed.
- `npm run build`: pass, exit 0; production assets generated successfully.

#### QA-RESP-01 — Closed

- No `@media(max-width:640px)` rule remains in the stylesheet. All former mobile-only layout/image rules now stop at `max-width:639px`.
- The carousel controller uses the same `(max-width: 639px)` query, with a tested boundary helper returning mobile at 639 and non-mobile at 640.
- At exact 640px, the `max-width:900px` tablet rule supplies shared `.section` padding of 72px vertically and 32px horizontally; the 20px mobile section gutter no longer applies.
- The Canteen `min-width:640px` restoration supplies its two-column `minmax(0,.8fr) / minmax(0,1.2fr)` grid, neutral desktop menu wrappers, visible overflow, no snap, and hidden controls.
- Courts retain their base two-column feature grid at 640px (with only the tablet gap adjustment), rather than the former mobile one-column override.
- Club Essentials retains the tablet two-column product grid at 640px, rather than the former one-column mobile override.
- JavaScript removes carousel roles, labels, track tabindex, and controls/status at 640px because the mobile query is false.
- At 639px and below, mobile cards, localized horizontal overflow, containment, controls/status, and responsive layout rules remain unchanged.
- Regression tests now reject any reintroduction of `max-width:640px`, assert the mobile CSS/JS boundary, verify tablet padding/restoration strings, and preserve all prior carousel tests.

The exact-boundary defect is closed. No known responsive or carousel release blocker remains in static, automated, and previously supplied rendered containment evidence.
