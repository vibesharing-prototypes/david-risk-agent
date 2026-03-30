# Widget Patterns

All widgets compose from a shared foundation defined at the top of `css/widgets.css`.
Shared behaviours live in `js/widgets.js` and are accessed via the global `W` object.

---

## Shared foundation

### Card shell — `.w-card`

Every widget sits inside a `.w-card`. It provides the background, radius, and overflow.

```html
<div class="w-card">
  <div class="w-card-header">
    <span class="w-card-title">Widget title</span>
    <span class="w-card-count">12 items</span>
    <div class="w-card-actions">
      <button class="w-btn is-icon" title="Add">+</button>
      <button class="w-ctx-trigger" onclick="W.contextMenu(this, menuItems)">⋮</button>
    </div>
  </div>
  <div class="w-card-body">
    <!-- padded content -->
  </div>
</div>
```

Variants:
- `.w-card.is-outlined` — adds a subtle border
- `.w-card-flush` — use instead of `.w-card-body` for content that manages its own padding (tables, lists)

### Interactive states

Add these classes to any element:

| Class | Behaviour |
|-------|-----------|
| `.is-hoverable` | Subtle background on hover, pointer cursor |
| `.is-selectable` | Click-to-select via `W.select(this)`. Add `.is-selected` to activate. |
| `.is-disabled` | Faded, no pointer events |
| `.w-focus-ring` | Keyboard focus outline via `:focus-visible` |

Multi-select: add a `<span class="w-select-indicator"></span>` inside the selectable element. It renders as a checkbox that fills when `.is-selected`.

### Widget header — `.w-card-header`

Standard top row with:
- `.w-card-title` — left-aligned label (ellipsis on overflow)
- `.w-card-count` — optional muted count
- `.w-card-actions` — right-aligned buttons

A `border-top` divider appears automatically between the header and the body/flush content.

### Empty state

```html
<div class="w-empty">
  <svg class="w-empty-icon" width="40" height="40"><use href="#icon-library"/></svg>
  <span class="w-empty-title">No surveys yet</span>
  <span class="w-empty-description">Create your first survey to start collecting risk data.</span>
  <button class="w-btn is-primary">Create survey</button>
</div>
```

### Loading state

Two options:

**Skeleton placeholders** — add `.w-skeleton` to any element to replace its content with a shimmering block:
```html
<span class="w-stat-value w-skeleton">000</span>
```

**Full card overlay** — add inside a `.w-card`:
```html
<div class="w-loading-overlay"><div class="w-spinner"></div></div>
```

### Collapsible section

```html
<div class="w-collapsible is-open" id="details">
  <button class="w-collapsible-trigger" onclick="W.collapse('details')">
    <span class="w-card-title">Details</span>
    <svg class="w-collapsible-chevron" width="20" height="20">
      <use href="#icon-chevron-down"/>
    </svg>
  </button>
  <div class="w-collapsible-content">
    <div class="w-card-body">…content…</div>
  </div>
</div>
```

Start open: add `.is-open` to `.w-collapsible`.

### Context menu

Defined in JS, rendered dynamically:

```html
<button class="w-ctx-trigger" onclick="W.contextMenu(this, [
  { label: 'Edit',   action: () => alert('Edit') },
  { label: 'Duplicate', action: () => alert('Dup') },
  'divider',
  { label: 'Delete', action: () => alert('Del'), danger: true }
])">⋮</button>
```

Menus close on outside click or Escape key.

### Drag reorder

Initialise once on a container:
```js
W.dragReorder('myListId', {
  handle: '.w-drag-handle',
  onReorder: (items) => console.log('new order', items)
});
```

Each item needs a handle:
```html
<div class="w-list-item is-hoverable">
  <div class="w-drag-handle">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="7" cy="5" r="1.5" fill="currentColor"/>
      <circle cx="13" cy="5" r="1.5" fill="currentColor"/>
      <circle cx="7" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="13" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="7" cy="15" r="1.5" fill="currentColor"/>
      <circle cx="13" cy="15" r="1.5" fill="currentColor"/>
    </svg>
  </div>
  <div class="w-list-content">…</div>
</div>
```

---

## Widget type patterns

### 1. Stat card

```html
<div class="w-stat-row">
  <div class="w-card w-stat">
    <span class="w-stat-value">247</span>
    <span class="w-stat-label">Open risks</span>
    <span class="w-stat-trend is-up">+12%</span>
  </div>
</div>
```

### 2. Data table

```html
<div class="w-card">
  <div class="w-card-header">
    <span class="w-card-title">Risk register</span>
    <span class="w-card-count">24 risks</span>
  </div>
  <div class="w-card-flush">
    <table class="w-table">
      <thead><tr><th>Risk</th><th>Severity</th><th>Status</th></tr></thead>
      <tbody>
        <tr class="is-hoverable">
          <td>Supply chain disruption</td>
          <td><span class="w-badge is-error">Critical</span></td>
          <td>Open</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### 3. Form group

```html
<div class="w-card">
  <div class="w-card-header">
    <span class="w-card-title">New risk</span>
  </div>
  <div class="w-card-body">
    <form class="w-form">
      <div class="w-form-field">
        <label class="w-form-label" for="name">Risk name</label>
        <input class="w-form-input" id="name" placeholder="e.g. Supply chain disruption">
      </div>
      <div class="w-form-actions">
        <button class="w-btn is-secondary" type="button">Cancel</button>
        <button class="w-btn is-primary" type="submit">Save</button>
      </div>
    </form>
  </div>
</div>
```

### 4. List view

```html
<div class="w-card">
  <div class="w-card-header">
    <span class="w-card-title">Surveys</span>
    <div class="w-card-actions">
      <button class="w-btn is-icon" title="New survey">+</button>
    </div>
  </div>
  <div class="w-card-flush">
    <div class="w-list" id="surveyList">
      <div class="w-list-item is-hoverable" onclick="W.select(this)">
        <div class="w-list-icon"><svg width="24" height="24"><use href="#icon-identification"/></svg></div>
        <div class="w-list-content">
          <span class="w-list-title">Q4 Risk Survey</span>
          <span class="w-list-meta">12 responses · Due Dec 15</span>
        </div>
        <span class="w-badge is-success">Active</span>
      </div>
    </div>
  </div>
</div>
```

---

## Creating a new widget type

1. Prefix: `.w-{type}` — check `widgets.css` Section 2 for existing prefixes.
2. Always wrap in `.w-card` — use `.w-card-header` if it needs a title row.
3. Use `.w-card-body` (padded) or `.w-card-flush` (edge-to-edge) for content.
4. Apply shared states: `.is-hoverable`, `.is-selectable`, `.is-disabled`.
5. Use design tokens only — never hardcode colours or sizes.
6. Add JS behaviour through the `W` API — don't add standalone event listeners.
