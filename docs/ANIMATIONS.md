# Trisomy21 motion specification

Status: approved and finalized for Developer handoff. Placeholder media and verified media use the same motion rules; placeholder status is communicated through persistent text, never animation.

Motion makes schedule and navigation changes understandable while retaining a lively courtside tone. It never delays access, implies mock data is live, or decorates every section.

## Tokens

| Token | Duration | Use |
| --- | ---: | --- |
| `instant` | 0ms | Reduced motion/direct replacement |
| `fast` | 100ms | Hover, press, color/border |
| `standard` | 180ms | Menu, popover, slot detail |
| `slow` | 240ms | Dialog entrance or a future full-screen navigation drawer |

Enter: `cubic-bezier(0.16, 1, 0.3, 1)`. Exit: `cubic-bezier(0.4, 0, 1, 1)`, 20–30% faster where possible. Color uses `ease-out`. No bounce, elastic, or spring.

## Approved motion

- Buttons/links: color, background, border for 100ms; no routine scale.
- Mobile navigation: the approved phase-one pattern is a compact disclosure anchored directly below the header, so it opens and closes immediately with no backdrop or translation. This preserves a direct response, avoids implying modal behavior, and is valid under reduced motion without a separate treatment. If navigation later becomes a modal/full-screen drawer, use a backdrop fade plus logical inline-edge translation up to 240ms and move focus when mounted, not after motion.
- Date popover: opacity + at most 4px travel over 140–180ms. Escape closes and restores focus.
- Court tabs: selected border/background for 100ms; do not slide a highlight across options.
- Schedule update: preserve height; optional 100–150ms crossfade only after data is ready. Old results are `aria-busy` and non-interactive. Do not animate cells individually.
- Slot detail: inline fade over 180ms without auto-scroll; mobile dialog uses backdrop + at most 8px travel over 200–240ms.
- Images: optional opacity after load when space is reserved. No crop-changing zoom hover.
- Anchors: immediate by default; smooth scroll only for explicit anchor actions and without reduced motion.
- Loading: delay indicator about 300ms, then restrained spinner or static placeholders; no shimmer.

## Hero and sections

Do not stage headline, words, buttons, and image. Content appears immediately. A static court-line graphic may add energy. No parallax, autoplay video, rotating hero, marquee, animated gradient, cursor follower, scroll hijacking, or routine scroll-reveal. Any later brand entrance treatment needs Designer approval.

## Availability safeguards

On date/filter change:

1. mark results busy and prevent stale selection;
2. preserve dimensions;
3. replace content after full or defined partial response;
4. announce date/result summary politely;
5. preserve focus on the initiating control.

Status changes use text and color immediately, never color cycling. No countdown in phase one. Errors do not shake.

## Reduced motion

Honor `prefers-reduced-motion: reduce` globally. Remove transforms, smooth scrolling, crossfades over 100ms, and nonessential fades. Open menus/dialogs immediately or with at most 100ms opacity. Replace looping indicators with static progress text when possible. Keep focus, loading text, selection state, and announcements.

## Performance and QA

Prefer `opacity` and `transform`; avoid layout animation. Reserve image/schedule space. Do not animate large blur, shadow, filter, or full-page surfaces. Use CSS transitions; add no motion dependency in phase one. Interaction cannot depend on `transitionend`.

Test every motion at target widths, keyboard-only, 200% zoom, reduced motion, and CPU slowdown. Reject motion that delays response, drops frames, shifts reading position, obscures focus, duplicates announcements, permits stale selection, or competes with content.
