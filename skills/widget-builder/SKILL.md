---
name: widget-builder
description: "Build UI widgets for the Risk Management prototype. Use this skill whenever the user asks to add, create, or modify widgets, components, or UI elements inside the middle panel — stat cards, data tables, forms, list views, charts, or any new interactive element. Also trigger when the user says things like 'add a section to the page', 'show some data', 'build a dashboard', or references the middle panel content."
---

# Widget Builder

You are extending a working HTML/CSS/JS prototype for a Risk Management app. The prototype uses the **Atlas Design System** dark theme tokens and **Plus Jakarta Sans** as its typeface.

## Project structure

```
riskmanager-aifirst-proto/
├── index.html            ← page shell + inline SVG sprite
├── css/
│   ├── styles.css        ← layout, sidebar, tokens (do not add widgets here)
│   └── widgets.css       ← all widget styles live here
├── js/
│   └── app.js            ← navigation, panel toggles, drag-resize
├── icons/                ← SVG source files + sprite.svg
├── tokens/               ← Atlas design token JSONs
└── scripts/
    └── update-icons.py   ← icon sprite automation
```

## Where widgets go

**CSS** → `css/widgets.css` (linked after `styles.css` in `index.html`).
**HTML** → inside `<div class="mp-inner">`, after the `<div class="mp-header">` block.
**JS** (if needed) → add to `js/app.js` or create a new file in `js/`.

## Design token reference

Before building any widget, read `references/tokens.md` in this skill directory. It lists every available CSS custom property — colours, spacing, typography, surfaces, outlines, and status tokens. Use these variables exclusively; never hardcode hex values.

## Widget types and patterns

Read `references/widget-patterns.md` for copy-pasteable HTML/CSS templates for each widget type:

- **Stat card** (`w-stat`) — a KPI tile: value, label, optional trend
- **Data table** (`w-table`) — sortable rows with header, body, optional footer
- **Form group** (`w-form`) — labelled inputs, selects, toggles, grouped in fieldsets
- **List view** (`w-list`) — scrollable item cards with icon, title, meta, and actions

Each pattern follows a consistent naming scheme: `.w-{type}` for the container, `.w-{type}-{part}` for children.

## How to build a new widget

1. **Pick a type prefix.** Check existing prefixes in `widgets.css` to avoid collisions. Use the naming pattern `.w-{type}` (e.g. `.w-chart`, `.w-timeline`).

2. **Write the CSS in `css/widgets.css`.** Group the new widget in a clearly commented section:
   ```css
   /* ── Widget: Chart ───────────────────────────────── */
   .w-chart { ... }
   .w-chart-title { ... }
   ```

3. **Write the HTML inside `.mp-inner`.** Widgets sit inside a layout wrapper:
   ```html
   <div class="mp-body">
     <!-- widget groups go here -->
   </div>
   ```
   Use `<section class="w-section">` to group related widgets with an optional heading.

4. **Use semantic HTML.** Tables for tabular data, `<form>` for inputs, `<ul>` for lists. Add `aria-label` on interactive elements.

5. **Verify visually** by opening `index.html` in a browser.

## Layout guidance

- `.mp-inner` has `max-width: 600px` and is centred — widgets inherit this constraint.
- Use the spacing tokens (`--space-1` through `--space-7`) for all padding, margins, and gaps.
- Prefer `gap` on flex/grid containers over margin on children.
- Use `--panel-radius` (8px) for card-level rounding and `6px` for inner elements.
- Surfaces use `--color-surface-variant` or `--color-surface-variant-subtle` for card backgrounds against the `--color-background-base` panel.
- Borders use `--color-outline-static` (subtle) or `--color-outline-default` (visible).

## Typography quick reference

| Style | CSS vars | Size | Weight |
|-------|----------|------|--------|
| H1 Billboard | `--type-title-h1-*` | 28px | 400 |
| H2 Display | `--type-title-h2-*` | 24px | 400 |
| H3 Lg | `--type-title-h3-lg-*` | 20px | 400 |
| Body | `--type-text-body-*` | 14px | 400 |
| Body Emphasis | `--type-text-body-*` + emphasis-weight | 14px | 600 |
| Md | `--type-text-md-*` | 12px | 400 |
| Sm | `--type-text-sm-*` | 10px | 400 |

## Colour quick reference

| Token | Purpose |
|-------|---------|
| `--color-type-default` | Primary text (#FFF) |
| `--color-type-muted` | Secondary text |
| `--color-type-disabled` | Disabled text |
| `--color-surface-variant` | Card background |
| `--color-surface-variant-subtle` | Subtle card / hover bg |
| `--color-outline-static` | Subtle border |
| `--color-outline-default` | Visible border |
| `--color-action-primary-default` | Primary accent (sky-70) |
| `--color-status-success-default` | Green |
| `--color-status-warning-default` | Yellow |
| `--color-status-error-default` | Red |
