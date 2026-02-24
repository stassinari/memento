# Dark Mode Implementation Plan

## Goals

- Add a robust three-way theme preference: `light`, `system`, `dark`.
- Keep current light mode accents unchanged.
- In dark mode, preserve the same accent families (`orange` main, `blue` accent) with adjusted shades for contrast.
- Add theme picker UI:
  - desktop/tablet (sidebar visible): picker in `SidebarNav`.
  - mobile (sidebar hidden): picker in Settings screen.

## Constraints and decisions

- Use class-based dark mode (`html.dark`) to support explicit `light/system/dark`.
- Persist user preference in `localStorage`.
- Resolve `system` via `prefers-color-scheme: dark`.
- Prevent flash of wrong theme by applying theme class before hydration.
- Keep migration incremental: shell + primitives first, domain components after.

## Phase 1: Theme infrastructure

1. Add theme types and helpers
- Create `src/theme/theme.ts` with:
  - `ThemePreference = "light" | "system" | "dark"`
  - `ResolvedTheme = "light" | "dark"`
  - helpers to read/write preference, resolve system, and apply DOM class.

2. Add theme runtime hook/state
- Create `src/hooks/useTheme.ts`:
  - returns `preference`, `resolvedTheme`, `setPreference`.
  - listens to system theme changes when preference is `system`.
  - updates `<html>` class and optional `color-scheme`.

3. Add no-flash boot script
- In `src/routes/__root.tsx`, inject a small inline script in `<head>` that:
  - reads preference from `localStorage`.
  - resolves system preference.
  - sets `document.documentElement.classList.toggle("dark", ...)` immediately.

4. Tailwind dark variant configuration
- In `src/styles/config.css`, ensure dark variant is class-driven.
- Keep global `html/body` defaults and add dark counterparts for base background/text.

Acceptance criteria:
- Reload keeps selected theme.
- `system` follows OS and reacts to OS theme changes live.
- No light/dark flash on initial load.

## Phase 2: Theme picker UI

1. Build reusable picker component
- Add `src/components/ThemePicker.tsx`.
- 3 options: `Light`, `System`, `Dark`.
- Use existing design language (`Button`/grouped controls).

2. Desktop placement
- Add picker inside `src/components/SidebarNav.tsx` near the bottom section.
- Show whenever sidebar is visible (`md` and up, existing behavior).

3. Mobile placement
- Add picker to `src/routes/_auth/_layout/settings.tsx` under Account section.
- Render mobile-only version (`md:hidden`) so it is tucked in settings on mobile.

Acceptance criteria:
- Sidebar displays theme picker on desktop/tablet layouts.
- Mobile users can change theme from Settings.
- Both pickers are synchronized through shared theme state.

## Phase 3: Shell dark mode pass

Update shell/navigation surfaces first:
- `src/components/Layout.tsx`
- `src/components/SidebarNav.tsx`
- `src/components/BottomNav.tsx`
- `src/components/Breadcrumbs.tsx`
- `src/components/Heading.tsx`

Guideline:
- Preserve current light classes.
- Add `dark:*` classes for neutrals and states.
- Keep accent semantics:
  - main accent orange: light uses existing shades, dark shifts to brighter shades (e.g. `orange-500/400`).
  - secondary accent blue: same approach (`blue-500/400`).

Acceptance criteria:
- Navigation and page chrome are readable and consistent in dark mode.
- Active, hover, focus states remain distinguishable and accessible.

## Phase 4: Primitive/component dark pass

Apply dark mode to mapped primitives:
- `Button`, `IconButton`
- `Input`, `Textarea`
- `Toggle`
- `Badge`
- `Card`, `ListCard`, `DataList`, `Divider`
- `Modal`, `Notification`, `EmptyState`

Acceptance criteria:
- Primary reusable components have complete light/dark states.
- Forms and overlays remain visually coherent in both themes.

## Phase 5: Domain component cleanup

Sweep domain components and wrappers:
- `src/components/form/*`
- `src/components/beans/*`
- `src/components/brews/*`
- `src/components/espresso/*`
- `src/components/drinks/*`

Acceptance criteria:
- No obvious light-only surfaces left in authenticated app flows.

## QA checklist

- Manual smoke:
  - Login page, home, beans list/detail, brews list/detail, espresso list/detail, settings.
  - Toggle theme across all three preferences in each page.
- Responsive:
  - Mobile + desktop layout checks for picker placement.
- Accessibility:
  - Focus ring visibility in both themes.
  - Contrast check for muted and accent text.

## Initial implementation slice

Start coding with:
1. Phase 1 (theme infrastructure).
2. Phase 2 (theme picker + placement).
3. Phase 3 (shell dark mode pass).

Then pause for review before applying Phase 4/5 across all components.
