# Wobb Frontend Assignment

A starter influencer search application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. This project is intentionally left in a rough-but-working state for candidates to improve.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## What's Included

- **Search / Dashboard** — filter influencers by platform (Instagram, YouTube, TikTok) and search by username or full name
- **Profile Details** — click a profile to view extended data loaded from individual JSON files
- **Routing** — `react-router-dom` with `/` (search) and `/profile/:username` (details)

Sample data lives in:

- `src/assets/data/search/` — platform search results (10 profiles each)
- `src/assets/data/profiles/` — detailed profile JSON per username

## How to Submit

1. **Download or clone** this starter project to your machine.
2. **Create a new repository** on your own GitHub account. Do not fork the original assignment repo — push your work to a repo you own.
3. Complete the tasks below and push your changes to that repository.
4. **Share the public GitHub repository URL** with us as your submission.

### Deadline (strict)

- **Due:** **2 July 2026, 2:00 PM IST** (Indian Standard Time, UTC+5:30)
- **Any git commits made after this deadline will disqualify your submission.** We will only consider the repository state as of the deadline; late commits will not be reviewed.
- Make sure your final work is pushed **before** the cutoff.

## What We Did (Completed Tasks)

Here is a summary of how we completed the assignment requirements:

1. **Found and fixed all bugs and quality issues**
   - Fixed case-sensitive search logic in `dataHelpers.ts`.
   - Fixed a math logic error in `ProfileDetailPage.tsx` where engagement rate was incorrectly multiplied by 10000 instead of 100.
   - Fixed UI layout bugs (e.g., hard-coded mobile width in `ProfileCard`).
   - Fixed a React hook dependency bug causing infinite render loops.
   - Fixed a file-loading casing bug (e.g., `MrBeast6000.json` vs url `mrbeast6000`).

2. **Completely redesigned the UI/UX**
   - Implemented a modern, responsive CSS Grid layout using Tailwind.
   - Built a custom design system with Inter typography, vibrant gradients, and slate backgrounds.
   - Integrated `lucide-react` for beautiful, consistent iconography.
   - Created empty states and error states for all asynchronous actions.

3. **Replaced React Context with Zustand**
   - Built `src/store/useSelectedListStore.ts` using Zustand from scratch to manage global state.

4. **Implemented "Select profile & Add to List"**
   - Added interactive "Add to List" toggles on both the Profile Cards and the Profile Detail Page.
   - Built a sleek, accessible Right-Side Sliding Drawer to view, manage, and clear the selected list.
   - Added `persist` middleware to save the list to `localStorage` so it survives page reloads.
   - Handled duplicates flawlessly (using `user_id` as unique dictionary keys).

5. **Improved code quality and project structure**
   - Enabled `strict: true` in TypeScript configs.
   - Extracted logic into reusable hooks (e.g., `useDebounce`).
   - Implemented a global `ErrorBoundary` to gracefully catch and report runtime UI crashes.

6. **Optimized performance**
   - Debounced search inputs so the UI doesn't lag on every keystroke.
   - Used `useMemo` in `SearchPage.tsx` to prevent redundant array filtering.
   - Used `React.memo` on `ProfileCard` to prevent re-rendering all siblings when one card is toggled.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run lint`  | Run ESLint               |

## Submission Notes & Trade-offs

- **State Management**: Built a full Zustand store from scratch because no existing Context/Reducer existed to replace.
- **Drawer vs. Route**: Chose a right-side sliding drawer for the Selected List instead of a separate `/list` route to keep the list accessible without losing context of the discovery flow.
- **Virtualization Skipped**: With only ~10 profiles per platform, adding virtualization libraries (like `@tanstack/react-virtual`) would add unnecessary bundle overhead for zero performance gain.
- **Verification**: `npm run build` and `npm run lint` pass flawlessly.
