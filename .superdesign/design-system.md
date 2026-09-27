# Admin MOOC — Blue / White Tech Palette Preview

## Product and scope

Vue 3 + Tailwind CSS 4 + Element Plus administration system. The requested target is a standalone, reviewable HTML palette board, not the live application's theme implementation. It must show common colors, interaction states, and a practical Chinese type scale. The user will review it before any theme migration into the app.

## Visual direction

Bright, precise enterprise technology. White and cool blue surfaces dominate. Deep navy is used for headings and one compact hero/preview panel. Cyan is a small data accent, never a competing primary. Avoid heavy glass effects, purple, neon gradients, oversized decorative blur, and low-contrast pale text. Use clear grid alignment, fine hairline borders, restrained shadows, and generous whitespace.

## Color primitives

| Token | Value | Role |
| --- | --- | --- |
| blue-50 | `#EFF6FF` | selected wash |
| blue-100 | `#DBEAFE` | hover wash |
| blue-200 | `#BFDBFE` | selected border |
| blue-300 | `#93C5FD` | decorative chart |
| blue-400 | `#60A5FA` | highlight on dark |
| blue-500 | `#3B82F6` | light accent |
| blue-600 | `#2563EB` | primary action |
| blue-700 | `#1D4ED8` | primary hover |
| blue-800 | `#1E40AF` | primary pressed |
| blue-900 | `#172554` | deep brand surface |
| cyan-600 | `#0891B2` | data accent only |
| slate-0 | `#FFFFFF` | card and input surface |
| slate-50 | `#F8FAFC` | page background |
| slate-100 | `#F1F5F9` | subtle fill |
| slate-200 | `#E2E8F0` | border |
| slate-300 | `#CBD5E1` | disabled border |
| slate-400 | `#94A3B8` | disabled text |
| slate-500 | `#64748B` | metadata |
| slate-600 | `#475569` | secondary text |
| slate-700 | `#334155` | body text |
| slate-800 | `#1E293B` | heading text |
| slate-900 | `#0F172A` | high emphasis |

## Semantic tokens

- `--app-primary: #2563EB`; `--app-primary-hover: #1D4ED8`; `--app-primary-active: #1E40AF`; `--app-on-primary: #FFFFFF`.
- `--app-page: #F8FAFC`; `--app-surface: #FFFFFF`; `--app-surface-alt: #F1F5F9`.
- `--app-text: #1E293B`; `--app-text-secondary: #475569`; `--app-text-muted: #64748B`; `--app-text-disabled: #94A3B8`.
- `--app-border: #E2E8F0`; `--app-border-strong: #CBD5E1`; `--app-focus: #2563EB`.
- Success `#15803D` / background `#F0FDF4` / border `#BBF7D0`.
- Warning `#B45309` / background `#FFFBEB` / border `#FDE68A`.
- Danger `#DC2626` / background `#FEF2F2` / border `#FECACA`.
- Info `#0369A1` / background `#F0F9FF` / border `#BAE6FD`.

## Typography

Font family: `Inter`, `PingFang SC`, `Microsoft YaHei`, `Noto Sans CJK SC`, system sans-serif. Latin numeric labels may use `ui-monospace`, `SFMono-Regular`, `Consolas`, monospace. No network font dependency.

| Role | Size / line height | Weight |
| --- | --- | --- |
| Display | 36 / 44 px | 700 |
| Page title | 28 / 36 px | 700 |
| Section title | 22 / 30 px | 650 |
| Subheading | 18 / 26 px | 600 |
| Body | 16 / 24 px | 400 |
| UI control / table | 14 / 22 px | 500 |
| Caption / helper | 12 / 18 px | 500 |

Use body size 16 for reading; 14 for dense control labels; never below 12. Keep important Chinese text dark enough to read on white.

## Component and interaction rules

- Primary button: blue-600, white text, 8 px radius, hover blue-700, pressed blue-800, visible blue focus ring, disabled slate-200 with slate-400 text.
- Secondary button: white surface with slate-200 border, hover blue-50 / blue-200 border.
- Destructive button: danger red on white or solid red only for confirmed destructive action.
- Inputs: white surface, slate-200 border, blue border and ring on focus, danger border and helper text on error, slate-100 background when disabled.
- Success/warning/error/info badges include text and icon/word meaning; color alone must not convey status.
- Links use blue-700 with underline on hover/focus.
- Layout sample: clean admin card, compact table row, metric tiles, form controls, tags, sidebar selected state. These are visual examples, not a functional dashboard.

## Layout and motion

Desktop content width up to 1440 px, responsive columns collapsing at 900 and 600 px. Spacing increments 4 / 8 / 12 / 16 / 24 / 32 px. Card radius 14 px, control radius 8 px. Hairline borders with restrained shadow `0 12px 36px rgba(15, 23, 42, .05)`. Hover transitions about 160 ms; honor reduced motion.

## Dark companion palette — review preview only

This is a second, parallel palette board for the same product. Preserve the light palette above and its typography, spacing, component roles and information architecture. The dark board must demonstrate equivalent semantic roles and interaction states; it does not change the running Vue app.

| Semantic role | Dark value | Use |
| --- | --- | --- |
| `--app-page` | `#0B1220` | deepest page background |
| `--app-surface` | `#111C2E` | cards, table, input |
| `--app-surface-alt` | `#17243A` | selected/raised surface |
| `--app-surface-hover` | `#1D2E47` | hover surface |
| `--app-border` | `#2B3A50` | subtle dividers |
| `--app-border-strong` | `#41536B` | emphasized input border |
| `--app-text` | `#F1F5F9` | headings and body |
| `--app-text-secondary` | `#CBD5E1` | supporting text |
| `--app-text-muted` | `#94A3B8` | metadata |
| `--app-text-disabled` | `#64748B` | disabled only |
| `--app-primary` | `#60A5FA` | primary button/link |
| `--app-primary-hover` | `#93C5FD` | hover |
| `--app-primary-active` | `#3B82F6` | pressed |
| `--app-on-primary` | `#071426` | text on filled blue buttons |
| `--app-focus` | `#93C5FD` | visible focus ring |

Dark status colors: success `#4ADE80` on `#102C23` with border `#235D44`; warning `#FBBF24` on `#332510` with border `#725319`; danger `#F87171` on `#321B24` with border `#763445`; info `#38BDF8` on `#102B3B` with border `#24546B`. Pair colored badges with labels, never color alone. A muted cyan `#22D3EE` may be used for tiny data highlights only. Avoid pure black, pure white blocks, neon glows, violet, gradients and glass blur.

For the dark palette board, retain the 12 / 14 / 16 / 18 / 22 / 28 / 36 px type scale and show blue ramp, neutral surface ladder, semantic feedback, buttons (default/hover/pressed/disabled/focus), inputs (default/focus/error/disabled), links, tags, a table, sidebar selection and a compact admin preview. Surface the actual hex values for review. Normal text should have at least 4.5:1 contrast against its surface; muted/disabled text is not used for important body copy.
