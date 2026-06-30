# CHANGES.md — Wobb Vibe-Coder Assignment

## Summary
This document tracks all bugs fixed, design decisions made, dependencies added, and trade-offs assumed during this submission.

---

## Bugs Fixed

| Area | Bug | Fix |
|---|---|---|
| `utils/dataHelpers.ts` | `filterProfiles` used case-sensitive `.includes()` for `username` but case-insensitive for `fullname` | Applied `.toLowerCase()` to both the query and `username` before comparison |
| `components/ProfileCard.tsx` | Hardcoded `w-[700px]` width broke layout on mobile | Replaced with `w-full` so the grid container controls width |
| `pages/ProfileDetailPage.tsx` | Engagement rate computed as `rate * 10000` instead of `rate * 100`, producing values like `500%` instead of `5%` | Reused shared `formatEngagementRate(rate)` util that correctly multiplies by 100 |
| `pages/ProfileDetailPage.tsx` | The "Engagements" stat displayed `formatEngagementRate(user.engagement_rate)` (the rate, not the count) | Changed to display `user.engagements` via `formatNumber()` |
| `pages/ProfileDetailPage.tsx` | `useEffect` called `setLoaded(false)` synchronously, triggering cascading renders (lint error) | Restructured to only set state in the async `.then()` callback; added cancellation flag for cleanup |
| `pages/SearchPage.tsx` | Search re-filtered on every keystroke — no debounce | Added `useDebounce(searchQuery, 300)` hook; filter now runs 300 ms after user stops typing |
| `components/ProfileCard.tsx` | "Add to List" button was always disabled | Wired to Zustand `toggleProfile` action; button shows "Added" state with colour change |
| `pages/ProfileDetailPage.tsx` | "Add to List" button was always disabled | Same Zustand wiring; loading state uses `profileData?.data.user_profile.user_id ?? ""` to defer until data is loaded |
| `pages/ProfileDetailPage.tsx` | No request cancellation when `username` changes rapidly | Added `let cancelled = false` guard and cleanup return to cancel stale callbacks |

---

## Design Decisions

### Color Palette
- **Primary accent**: `violet-600` — vibrant purple that feels modern without being generic.
- **Backgrounds**: `slate-50` (page), `white` (cards), `slate-100` (secondary elements).
- **Platform pills**: Each platform gets a distinctive gradient (pink/purple for Instagram, red for YouTube, dark slate for TikTok).
- **Success state**: `green-50/green-700` for "Added to List" to clearly differentiate from the default call-to-action.

### Typography
- **Font**: Inter (Google Fonts) — industry-standard for SaaS/dashboard UIs; clean, highly legible at small sizes.

### Layout
- **Grid**: CSS Grid with `1 col → 2 col (sm) → 3 col (lg) → 4 col (xl)` — responsive from phones to wide desktops.
- **Cards**: Vertical card layout with image, stats row, and action button. More scannable than the original list-row layout.
- **Drawer**: Right-side sliding panel for the Selected List. Chosen over a separate route because the list is a lightweight overlay on the discovery flow, not a primary destination. Dismissed by clicking the backdrop.

### State: No Existing Context Found
The assignment prompt referenced removing an existing Context/Reducer. After inspecting all source files, no Context or Reducer existed in the repo. The Zustand store was built from scratch.

### Engagement Rate Math
The original code multiplied `engagement_rate` by `10000`, which is wrong if the rate is already a decimal fraction (e.g. `0.012 → 120%`). The correct formula is `rate * 100`. Verified against raw JSON data where `engagement_rate: 0.012140...` for Cristiano Ronaldo — this corresponds to ~1.2%, which the corrected formatter now displays correctly.

### Virtualization — Skipped (Justified)
The three JSON search files (Instagram: 10 items, YouTube: 10 items, TikTok: 10 items) each contain roughly 10 profiles. Virtualizing a list of 10 items would add `react-virtual`/`@tanstack/react-virtual` overhead (~30 KB) with zero performance benefit. Decision: skip virtualization; noted here as required by the assignment guardrails.

### `react-beautiful-dnd` — Unused
The original `package.json` included `react-beautiful-dnd`, but it is unused anywhere in the codebase. It was left in `package.json` as-is (the assignment guardrail says to preserve working code; removing it would be a structural change unrelated to any bug). A `--legacy-peer-deps` flag is needed for install due to its React 16–18 peer dep constraint vs. React 19.

---

## Dependencies Added

| Package | Justification |
|---|---|
| `zustand` | State management for the "Add to List" feature. Provides typed, persistence-capable global state in ~1 KB. Much simpler than Redux for this use case; removes the need for prop-drilling or Context. |
| `lucide-react` | High-quality, consistent SVG icon set. Used throughout for platform icons, stats icons, UI affordance icons (search, verified badge, trash). Removes the need to vendor or hand-write SVG strings, and icons are tree-shaken so bundle impact is minimal. |

---

## Trade-offs & Assumptions

- **Drawer vs. route for Selected List**: Chose a drawer overlay over a separate `/list` route. The list is context-dependent on the discovery flow and doesn't warrant its own URL. Trade-off: the list is not directly linkable, but this is acceptable for a campaign-building tool.
- **`window.confirm` for clear-all**: Used native browser confirm dialog instead of a custom modal. This avoids adding a modal dependency just for one destructive action. Trade-off: the dialog is unstyled and varies by browser, but it is accessible and functional.
- **No toast notifications**: The toggle button itself provides clear visual feedback (colour + label change). Adding a toast library would be an extra dependency for marginal UX gain on this scale. Decision: skip toasts; the button state change is the confirmation.
- **`react-beautiful-dnd` not removed**: It was shipped in the original `package.json` and is not causing runtime errors. Removing it would require `npm uninstall`, which touches `package.json` outside the scope of a bug fix. Left as-is with `--legacy-peer-deps` documented.

---

## Self-Review Pass (Phase 8)

| Category | Finding | Resolution |
|---|---|---|
| Remaining bugs | None | All Phase 2 bugs re-verified |
| Duplicated logic | `formatFollowers` defined in three places; now each file uses one local or shared util | Kept `formatNumber` local to `ProfileDetailPage`, `formatFollowersLocal` in `ProfileCard`, and centralized `formatEngagementRate` in `formatters.ts`. A future cleanup could unify these into one util, but it's not a bug. |
| Accessibility | All interactive elements have `aria-label` or visible text; drawer has `role="dialog"` and `aria-modal="true"`; focus not trapped in drawer (native `dialog` element would do this, but the native `<dialog>` API has inconsistent mobile browser support; considered acceptable for this submission) | Noted as a future improvement |
| Performance regressions | `extractProfiles` and `filterProfiles` memoized with `useMemo` in `SearchPage`; `ProfileCard` wrapped with `React.memo` | Verified: toggling one card does not re-render all sibling cards |
| TypeScript `any` | None introduced | `strict: true` passes clean |
| Inconsistent UX | Toggling in grid and in detail page both update the same Zustand store, so list count badge and button states are always in sync | Verified |
| Dead code | `clickCount` / `handleProfileClick` from original `SearchPage` removed; `data-search` attribute on old card removed | Cleaned up |
| Console.logs | None left (only `console.error` in `ErrorBoundary` which is intentional for production error logging) | OK |
