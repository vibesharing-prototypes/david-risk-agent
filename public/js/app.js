/* ============================================================
   Risk Management Prototype — app.js
   Sidebar (3-state), middle panel, right workspace + inner split
   ============================================================ */

const RIGHT_DEFAULT = 800;
const RIGHT_MIN = 360;
const RIGHT_MAX = 1200;

const INNER_HANDLE_PX = 8;
const INNER_MIN_PANE = 120;

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const middlePanel = document.getElementById("middlePanel");
const middlePanelToggle = document.getElementById("middlePanelToggle");
const resizeHandle = document.getElementById("resizeHandle");
const rightPanel = document.getElementById("rightPanel");
const rightToggle = document.getElementById("rightPanelToggle");
const rightSplit = document.getElementById("rightSplit");
const rightPaneA = document.getElementById("rightPaneA");
const rightPaneB = document.getElementById("rightPaneB");
const rightSplitHandle = document.getElementById("rightSplitHandle");

const SIDEBAR_TITLES = [
  "Sidebar: full — click for compact icons",
  "Sidebar: icons only — click to hide",
  "Sidebar: hidden — click to restore full",
];

let sidebarStateIndex = 0;
let middleVisible = true;
let rightPanelVisible = true;
let rightPanelWidth = RIGHT_DEFAULT;

/** Fraction of (right workspace minus inner handle) for the left column */
let leftPaneFraction = 0.48;

function applyRightWidth(w) {
  rightPanel.style.width = w + "px";
  applyInnerSplit();
}

function applyInnerSplit() {
  if (!rightSplit || !rightPaneA || !rightPaneB) return;
  if (!rightPanelVisible || rightPanel.classList.contains("is-hidden")) return;
  const total = rightSplit.clientWidth;
  if (total <= INNER_HANDLE_PX) return;
  const avail = total - INNER_HANDLE_PX;
  let wA = Math.round(avail * leftPaneFraction);
  wA = Math.max(INNER_MIN_PANE, Math.min(avail - INNER_MIN_PANE, wA));
  const wB = avail - wA;
  leftPaneFraction = wA / avail;
  rightPaneA.style.flex = `0 0 ${wA}px`;
  rightPaneB.style.flex = `0 0 ${wB}px`;
}

function applySidebarState() {
  if (!sidebar || !sidebarToggle) return;
  sidebar.classList.remove("is-collapsed", "is-hidden");
  const states = ["expanded", "collapsed", "hidden"];
  const state = states[sidebarStateIndex];
  if (state === "collapsed") sidebar.classList.add("is-collapsed");
  if (state === "hidden") sidebar.classList.add("is-hidden");
  sidebarToggle.dataset.sidebarState = state;
  sidebarToggle.title = SIDEBAR_TITLES[sidebarStateIndex];
  const visible = state !== "hidden";
  sidebarToggle.classList.toggle("is-active", visible);
  sidebarToggle.setAttribute(
    "aria-pressed",
    state === "hidden" ? "false" : "true"
  );
}

resizeHandle.style.width = "8px";
applyRightWidth(rightPanelWidth);
applySidebarState();

// ── Sidebar: expanded → collapsed (icons) → hidden ───────────────────────────
sidebarToggle.addEventListener("click", () => {
  sidebarStateIndex = (sidebarStateIndex + 1) % 3;
  applySidebarState();
});

// ── Middle panel ──────────────────────────────────────────────────────────────
middlePanelToggle.addEventListener("click", () => {
  middleVisible = !middleVisible;
  middlePanel.classList.toggle("is-hidden", !middleVisible);
  middlePanelToggle.classList.toggle("is-active", middleVisible);
  middlePanelToggle.setAttribute("aria-pressed", middleVisible);
  requestAnimationFrame(applyInnerSplit);
});

// ── Right workspace (outer) toggle ────────────────────────────────────────────
rightToggle.addEventListener("click", () => {
  rightPanelVisible = !rightPanelVisible;
  if (rightPanelVisible) {
    applyRightWidth(rightPanelWidth);
    resizeHandle.style.width = "8px";
    rightPanel.classList.remove("is-hidden");
    resizeHandle.classList.remove("is-hidden");
  } else {
    rightPanel.style.width = "0";
    resizeHandle.style.width = "0";
    rightPanel.classList.add("is-hidden");
    resizeHandle.classList.add("is-hidden");
  }
  rightToggle.classList.toggle("is-active", rightPanelVisible);
  rightToggle.setAttribute("aria-pressed", rightPanelVisible);
  requestAnimationFrame(applyInnerSplit);
});

// ── Navigation ────────────────────────────────────────────────────────────────
function navigateTo(el) {
  if (el.classList.contains("sb-subitem")) {
    document.querySelectorAll(".sb-subitem").forEach((i) => i.classList.remove("is-active"));
    el.classList.add("is-active");
  } else {
    document.querySelectorAll(".sb-item").forEach((i) => i.classList.remove("is-active"));
    el.classList.add("is-active");
  }
  const label =
    el.querySelector(".sb-item-label")?.textContent.trim() ||
    el.textContent.trim();
  document.getElementById("mpTitle").textContent = label;

  const viewId = el.dataset.view;
  if (viewId) {
    document.querySelectorAll(".mp-view").forEach((v) => v.classList.remove("is-active"));
    const target = document.getElementById("view-" + viewId);
    if (target) target.classList.add("is-active");
  }
}

function toggleSubmenu(id) {
  const submenu = document.getElementById(id + "Submenu");
  const item = document.getElementById(id + "Item");
  const isOpen = submenu.classList.toggle("is-open");
  item.classList.toggle("is-expanded", isOpen);
}

// ── Drag: main column vs right workspace ───────────────────────────────────────
let isDragging = false;
let dragStartX = 0;
let dragStartWidth = 0;

resizeHandle.addEventListener("mousedown", (e) => {
  if (!rightPanelVisible) return;
  isDragging = true;
  dragStartX = e.clientX;
  dragStartWidth = rightPanelWidth;
  resizeHandle.classList.add("is-dragging");
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const delta = dragStartX - e.clientX;
  rightPanelWidth = Math.min(
    RIGHT_MAX,
    Math.max(RIGHT_MIN, dragStartWidth + delta)
  );
  applyRightWidth(rightPanelWidth);
});

document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  resizeHandle.classList.remove("is-dragging");
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
  applyInnerSplit();
});

// ── Drag: split inside right workspace ───────────────────────────────────────
let innerDragging = false;
let innerDragStartX = 0;
let innerStartFraction = 0;

rightSplitHandle.addEventListener("mousedown", (e) => {
  if (!rightPanelVisible || rightPanel.classList.contains("is-hidden")) return;
  innerDragging = true;
  innerDragStartX = e.clientX;
  innerStartFraction = leftPaneFraction;
  rightSplitHandle.classList.add("is-dragging");
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!innerDragging || !rightSplit) return;
  const rect = rightSplit.getBoundingClientRect();
  const avail = rect.width - INNER_HANDLE_PX;
  if (avail <= 0) return;
  const delta = e.clientX - innerDragStartX;
  const next = innerStartFraction + delta / avail;
  leftPaneFraction = Math.min(0.88, Math.max(0.12, next));
  applyInnerSplit();
});

document.addEventListener("mouseup", () => {
  if (!innerDragging) return;
  innerDragging = false;
  rightSplitHandle.classList.remove("is-dragging");
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
});

if (typeof ResizeObserver !== "undefined" && rightPanel) {
  new ResizeObserver(() => applyInnerSplit()).observe(rightPanel);
}

window.addEventListener("resize", () => {
  applyInnerSplit();
});

window.navigateTo = navigateTo;
window.toggleSubmenu = toggleSubmenu;
