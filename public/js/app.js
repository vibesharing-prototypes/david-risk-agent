/* ============================================================
   Risk Management Prototype — app.js
   Sidebar (3-state), middle column collapsible + drag-collapse / drag-expand,
   right workspace always present (fills when middle collapsed)
   ============================================================ */

const RIGHT_DEFAULT = 800;
const RIGHT_MIN = 360;
const RIGHT_MAX = 1200;
const HANDLE_W = 8;

const INNER_HANDLE_PX = 8;
const INNER_MIN_PANE = 120;

const MIDDLE_COLLAPSE_AT = 100;
const MIDDLE_EXPAND_AT = 200;

const mainRow = document.getElementById("mainRow");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const middlePanel = document.getElementById("middlePanel");
const middlePanelToggle = document.getElementById("middlePanelToggle");
const resizeHandle = document.getElementById("resizeHandle");
const rightPanel = document.getElementById("rightPanel");
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
let middleCollapsed = false;
let rightPanelWidth = RIGHT_DEFAULT;
let savedRightPanelWidth = RIGHT_DEFAULT;
let leftPaneFraction = 0.48;

function getSidebarOuterWidth() {
  if (!sidebar) return 0;
  const r = sidebar.getBoundingClientRect();
  const mr = parseFloat(getComputedStyle(sidebar).marginRight) || 0;
  return r.width + mr;
}

function getMainRowInnerWidth() {
  return mainRow ? mainRow.getBoundingClientRect().width : 0;
}

function maxMiddleWidth() {
  return Math.max(
    0,
    getMainRowInnerWidth() - getSidebarOuterWidth() - HANDLE_W - RIGHT_MIN
  );
}

function clearMiddleInlineFlex() {
  if (!middlePanel) return;
  middlePanel.style.flex = "";
  middlePanel.style.maxWidth = "";
}

function applyCollapsedLayout() {
  if (!middlePanel || !rightPanel || !middlePanelToggle) return;
  middlePanel.classList.add("is-hidden");
  middlePanel.classList.remove("middle-panel--drag-reveal");
  clearMiddleInlineFlex();
  rightPanel.classList.add("right-panel--fill");
  rightPanel.style.width = "";
  middlePanelToggle.classList.remove("is-active");
  middlePanelToggle.setAttribute("aria-pressed", "false");
}

function applyRightWidthPx(w) {
  if (!rightPanel) return;
  rightPanelWidth = Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, w));
  rightPanel.style.width = rightPanelWidth + "px";
  applyInnerSplit();
}

function applyInnerSplit() {
  if (!rightSplit || !rightPaneA || !rightPaneB) return;
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

function collapseMiddle() {
  if (middleCollapsed) return;
  middleCollapsed = true;
  savedRightPanelWidth = rightPanelWidth;
  applyCollapsedLayout();
  requestAnimationFrame(applyInnerSplit);
}

function expandMiddle() {
  if (!middleCollapsed || !middlePanel || !rightPanel || !middlePanelToggle) return;
  middleCollapsed = false;
  middlePanel.classList.remove("is-hidden", "middle-panel--drag-reveal");
  clearMiddleInlineFlex();
  rightPanel.classList.remove("right-panel--fill");
  rightPanelWidth = savedRightPanelWidth;
  rightPanel.style.width = `${rightPanelWidth}px`;
  middlePanelToggle.classList.add("is-active");
  middlePanelToggle.setAttribute("aria-pressed", "true");
  requestAnimationFrame(applyInnerSplit);
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
  requestAnimationFrame(() => {
    if (!middleCollapsed) {
      applyRightWidthPx(rightPanelWidth);
    }
    applyInnerSplit();
  });
}

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
  const mpTitle = document.getElementById("mpTitle");
  if (mpTitle) mpTitle.textContent = label;

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
  if (!submenu || !item) return;
  const isOpen = submenu.classList.toggle("is-open");
  item.classList.toggle("is-expanded", isOpen);
}

let isDragging = false;
let dragStartX = 0;
let dragStartWidth = 0;

let isExpandDragging = false;
let expandDragStartX = 0;
let expandDragStartMiddle = 0;

function endOuterDrag() {
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
  if (resizeHandle) resizeHandle.classList.remove("is-dragging");
}

function layoutMiddleRightPair(middleW) {
  if (!middlePanel || !rightPanel) return;
  const inner = getMainRowInnerWidth();
  const sb = getSidebarOuterWidth();
  const rw = Math.min(
    RIGHT_MAX,
    Math.max(RIGHT_MIN, inner - sb - HANDLE_W - middleW)
  );
  const mw = inner - sb - HANDLE_W - rw;
  middlePanel.style.flex = `0 0 ${mw}px`;
  rightPanel.style.width = `${rw}px`;
  rightPanelWidth = rw;
}

function bootProtoShell() {
  const ok =
    mainRow &&
    sidebar &&
    sidebarToggle &&
    middlePanel &&
    middlePanelToggle &&
    resizeHandle &&
    rightPanel &&
    rightSplit &&
    rightPaneA &&
    rightPaneB &&
    rightSplitHandle;

  if (!ok) {
    console.error(
      "[app.js] Prototype markup is incomplete — expected #mainRow, #sidebar, #middlePanel, #rightPanel, etc."
    );
    return;
  }

  resizeHandle.style.width = "8px";
  applyRightWidthPx(rightPanelWidth);
  applySidebarState();

  sidebarToggle.addEventListener("click", () => {
    sidebarStateIndex = (sidebarStateIndex + 1) % 3;
    applySidebarState();
  });

  middlePanelToggle.addEventListener("click", () => {
    if (middleCollapsed) expandMiddle();
    else collapseMiddle();
  });

  resizeHandle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (middleCollapsed) {
      isExpandDragging = true;
      expandDragStartX = e.clientX;
      expandDragStartMiddle = 0;
      const rw = rightPanel.getBoundingClientRect().width;
      rightPanelWidth = rw;
      rightPanel.classList.remove("right-panel--fill");
      rightPanel.style.width = rw + "px";
      middlePanel.classList.remove("is-hidden");
      middlePanel.classList.add("middle-panel--drag-reveal");
      middlePanel.style.flex = "0 0 0px";
      resizeHandle.classList.add("is-dragging");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      return;
    }

    isDragging = true;
    dragStartX = e.clientX;
    dragStartWidth = rightPanelWidth;
    resizeHandle.classList.add("is-dragging");
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (isExpandDragging) {
      const delta = e.clientX - expandDragStartX;
      let mw = expandDragStartMiddle + delta;
      mw = Math.max(0, Math.min(maxMiddleWidth(), mw));
      layoutMiddleRightPair(mw);
      return;
    }

    if (!isDragging) return;
    const delta = dragStartX - e.clientX;
    let newRight = dragStartWidth + delta;
    newRight = Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, newRight));
    rightPanel.style.width = `${newRight}px`;
    rightPanelWidth = newRight;
    applyInnerSplit();

    requestAnimationFrame(() => {
      const mw = middlePanel.getBoundingClientRect().width;
      if (!middleCollapsed && mw < MIDDLE_COLLAPSE_AT) {
        collapseMiddle();
        isDragging = false;
        endOuterDrag();
      }
    });
  });

  document.addEventListener("mouseup", () => {
    if (isExpandDragging) {
      isExpandDragging = false;
      endOuterDrag();
      const mw = middlePanel.getBoundingClientRect().width;
      if (mw >= MIDDLE_EXPAND_AT) {
        savedRightPanelWidth = rightPanelWidth;
        expandMiddle();
      } else {
        middlePanel.classList.remove("middle-panel--drag-reveal");
        clearMiddleInlineFlex();
        applyCollapsedLayout();
      }
      requestAnimationFrame(applyInnerSplit);
      return;
    }

    if (!isDragging) return;
    isDragging = false;
    endOuterDrag();
    applyInnerSplit();
  });

  let innerDragging = false;
  let innerDragStartX = 0;
  let innerStartFraction = 0;

  rightSplitHandle.addEventListener("mousedown", (e) => {
    if (middleCollapsed) return;
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

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(() => applyInnerSplit()).observe(rightPanel);
  }

  window.addEventListener("resize", () => {
    applyInnerSplit();
  });
}

bootProtoShell();

window.navigateTo = navigateTo;
window.toggleSubmenu = toggleSubmenu;
