/* ============================================================
   Risk Management Prototype — app.js
   Panel toggles, sidebar navigation, drag-resize
   ============================================================ */

const RIGHT_DEFAULT = 800;
const RIGHT_MIN     = 600;
const RIGHT_MAX     = 800;

const sidebar       = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const resizeHandle  = document.getElementById('resizeHandle');
const rightPanel    = document.getElementById('rightPanel');
const rightToggle   = document.getElementById('rightPanelToggle');

let sidebarVisible    = true;
let rightPanelVisible = true;
let rightPanelWidth   = RIGHT_DEFAULT;

function applyRightWidth(w) { rightPanel.style.width = w + 'px'; }
resizeHandle.style.width = '8px';
applyRightWidth(rightPanelWidth);

// ── Sidebar toggle ────────────────────────────────────────────────────────────
sidebarToggle.addEventListener('click', () => {
  sidebarVisible = !sidebarVisible;
  sidebar.classList.toggle('is-hidden', !sidebarVisible);
  sidebarToggle.classList.toggle('is-active', sidebarVisible);
  sidebarToggle.setAttribute('aria-pressed', sidebarVisible);
});

// ── Right panel toggle ────────────────────────────────────────────────────────
rightToggle.addEventListener('click', () => {
  rightPanelVisible = !rightPanelVisible;
  if (rightPanelVisible) {
    applyRightWidth(rightPanelWidth);
    resizeHandle.style.width = '8px';
    rightPanel.classList.remove('is-hidden');
    resizeHandle.classList.remove('is-hidden');
  } else {
    applyRightWidth(0);
    resizeHandle.style.width = '0';
    rightPanel.classList.add('is-hidden');
    resizeHandle.classList.add('is-hidden');
  }
  rightToggle.classList.toggle('is-active', rightPanelVisible);
  rightToggle.setAttribute('aria-pressed', rightPanelVisible);
});

// ── Navigation ────────────────────────────────────────────────────────────────
// sb-item and sb-subitem maintain independent active-state pools.
// Expandable items (Identification / Assessment / Mitigation) are containers
// only — they do not navigate and have no active state.
// Each navigable button carries data-view="<id>" that maps to #view-<id>.
function navigateTo(el) {
  if (el.classList.contains('sb-subitem')) {
    document.querySelectorAll('.sb-subitem').forEach(i => i.classList.remove('is-active'));
    el.classList.add('is-active');
  } else {
    document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('is-active'));
    el.classList.add('is-active');
  }
  const label = el.querySelector('.sb-item-label')?.textContent.trim()
              || el.textContent.trim();
  document.getElementById('mpTitle').textContent = label;

  // ── View switching ─────────────────────────────────────────────────────────
  const viewId = el.dataset.view;
  if (viewId) {
    document.querySelectorAll('.mp-view').forEach(v => v.classList.remove('is-active'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('is-active');
  }
}

// ── Submenu expand / collapse ─────────────────────────────────────────────────
function toggleSubmenu(id) {
  const submenu = document.getElementById(id + 'Submenu');
  const item    = document.getElementById(id + 'Item');
  const isOpen  = submenu.classList.toggle('is-open');
  item.classList.toggle('is-expanded', isOpen);
}

// ── Drag resize ───────────────────────────────────────────────────────────────
let isDragging     = false;
let dragStartX     = 0;
let dragStartWidth = 0;

resizeHandle.addEventListener('mousedown', (e) => {
  if (!rightPanelVisible) return;
  isDragging     = true;
  dragStartX     = e.clientX;
  dragStartWidth = rightPanelWidth;
  resizeHandle.classList.add('is-dragging');
  document.body.style.cursor     = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const delta = dragStartX - e.clientX;
  rightPanelWidth = Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, dragStartWidth + delta));
  applyRightWidth(rightPanelWidth);
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  resizeHandle.classList.remove('is-dragging');
  document.body.style.cursor     = '';
  document.body.style.userSelect = '';
});
