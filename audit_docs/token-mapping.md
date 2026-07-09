# M2 Token Mapping — App vocabulary → Unified shadcn vocabulary

> Produced 2026-07-09 (M2). The unified system uses shadcn's variable convention (`:root`/`.dark` plain vars + `@theme inline`) — confirmed as the documented Tailwind v4 pattern for class-switched theming (tailwindcss.com → theme.mdx / colors.mdx "Referencing other variables"). **All values are the brand's original palette** (from the pre-shadcn `@theme` block, verified against production in M0). shadcn's taupe values are gone.

## Core mapping (shadcn-native names, brand values)

| New var | Light | Dark | Replaces app token | Utility rename |
|---|---|---|---|---|
| `--background` | `#ffffff` | `#0f172a` slate-900 | `surface` | `bg-surface`→`bg-background`, `from/via-surface`→`from/via-background` |
| `--foreground` | `#1f2937` gray-800 | `#f1f5f9` slate-100 | `primary` (headings text) | `text-primary`→`text-foreground` |
| `--card` / `--card-foreground` | `#ffffff` / foreground | `#1e293b` slate-800 / foreground | `elevated` | `bg-elevated`→`bg-card` |
| `--popover` / `--popover-foreground` | = card | = card | `elevated` (dropdowns) | (shadcn components) |
| `--primary` | `#f59e0b` amber-500 | `#d97706` amber-600 | `accent-bg` (button fills) | `bg-accent-bg`→`bg-primary` |
| `--primary-hover` (ext) | `#b45309` amber-700 | `#f59e0b` amber-500 | `accent-bg-hover` | `hover:bg-accent-bg-hover`→`hover:bg-primary-hover` |
| `--primary-foreground` | `#ffffff` | `#ffffff` | (text on amber fills) | (shadcn components) |
| `--brand` (ext) | `#d97706` amber-600 | `#fbbf24` amber-400 | `accent` (interactive text/links/active) | `text-accent`→`text-brand`, `bg-accent`→`bg-brand`, `focus:border-accent`→`focus:border-brand`, `focus:ring-accent`→`focus:ring-brand` |
| `--accent` / `--accent-foreground` | `#fef3c7` amber-100 / `#92400e` amber-800 | `rgba(120,53,15,.4)` / `#fbbf24` | `accent-subtle` (hover tints) | `bg-accent-subtle`→`bg-accent` |
| `--muted` | `#f3f4f6` gray-100 | `#334155` slate-700 | `hover-bg` | `bg-hover-bg`→`bg-muted` |
| `--muted-foreground` | `#6b7280` gray-500 | `#94a3b8` slate-400 | `muted` (captions/dates/icons) | `text-muted`→`text-muted-foreground` |
| `--destructive` | `#dc2626` red-600 | `#f87171` red-400 | `error` | `text-error`→`text-destructive` |
| `--border` | `#9ca3af` gray-400 | `#475569` slate-600 | `border` | `border-border` unchanged |
| `--input` | `#d1d5db` gray-300 | `#475569` slate-600 | (shadcn input borders; matches app `disabled` border shade) | (shadcn components) |
| `--ring` | `#f59e0b` amber-500 | `#d97706` amber-600 | (focus rings = brand) | `focus:ring-accent`→`focus:ring-brand` (exact shade kept via brand) |

## App-specific extensions (no shadcn equivalent — names kept, zero collisions)

| Var (unchanged utility) | Light | Dark |
|---|---|---|
| `--foreground-secondary` — **renamed from `secondary`** (body text): `text-secondary`→`text-foreground-secondary`, `bg-secondary`→`bg-foreground-secondary` (HamburgerButton bars) | `#4b5563` gray-600 | `#cbd5e1` slate-300 |
| `--elevated-glass` (`bg-elevated-glass`) | `rgba(255,255,255,.5)` | `rgba(30,41,59,.7)` |
| `--border-subtle` (`border-border-subtle`) | `#e5e7eb` gray-200 | `#334155` slate-700 |
| `--control-active` (`bg-control-active`) | `#ffffff` | `#475569` slate-600 |
| `--disabled` (`text-disabled`) | `#d1d5db` gray-300 | `#475569` slate-600 |
| `--disabled-bg` (`bg-disabled-bg`) | `#9ca3af` gray-400 | `#475569` slate-600 |
| `--placeholder` (`placeholder:text-placeholder`) | `#9ca3af` gray-400 | `#64748b` slate-500 |
| `--success` (`text-success`) | `#16a34a` green-600 | `#4ade80` green-400 |
| `--warning` / `--warning-subtle` / `--warning-border` | `#a16207` / `#fef9c3` / `#eab308` | `#facc15` / `rgba(113,63,18,.3)` / `#ca8a04` |

## Deliberate decisions & flagged deltas

1. **`--brand` kept separate from `--primary`.** The brand amber has two roles with different shades per mode (interactive text amber-600/400 vs fills amber-500/600). Consolidating onto one shadcn `--primary` would visibly change either links or buttons (esp. dark mode). Extension token preserves every pixel of the baseline. *Owner may later choose to consolidate — flagged, not done.*
2. **Pre-existing drift found (new finding F045):** 8 app files use `bg-accent` (amber-600) for fills while others use `bg-accent-bg` (amber-500) — two different amber fill shades in production. M2 preserves both exactly (`bg-brand` vs `bg-primary`); consolidation is a one-line change later if wanted.
3. **shadcn `--radius` remap dropped.** shadcn's `--radius: 0.625rem` + `--radius-sm..4xl` remapping silently inflated every existing `rounded-*` in the app (e.g. `rounded-md` 0.375rem → 0.5rem). Removed to restore the pre-shadcn look; shadcn components added in M3 will use Tailwind default radii (revisit there if they look off).
4. **`--chart-*` / `--sidebar-*` variables dropped** — nothing uses them; the shadcn CLI re-adds them if a component ever needs them.
5. **`@layer base { * { @apply border-border } }` kept** (shadcn-canonical; its components rely on it) — but `--border` is now the brand gray-400, not taupe. Verified visually against baseline.
6. **`@import "shadcn/tailwind.css"` kept** (F034 resolved): audited — it contains only data-state variants + scroll-fade/shimmer utilities and **zero color tokens**; shadcn components need it.
7. **Fonts staged for O1:** tokens `--font-serif` (body) and `--font-heading` now exist; Tinos/Cardo remain active pending the O1 side-by-side. Cormorant Garamond removed from the Google Fonts import (its `@font-face` was already commented out).
8. **Untouched exceptions:** `NewsCard` `categoryColor()` raw Tailwind colors and `AppTitle` `dark:invert`.
9. **`components/ui/**` (shadcn-generated) excluded from all renames** — it already speaks the new vocabulary.
