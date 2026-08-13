/** Desktop GNB keyboard helpers (disclosure + column/grid arrow nav). */

export const GNB_ARROW_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
] as const;

export type GnbArrowKey = (typeof GNB_ARROW_KEYS)[number];

const FOCUSABLE_IN_COL =
  'a[href]:not([disabled]), button:not([disabled]):not(.gnb_mega__close)';

export function isGnbArrowKey(key: string): key is GnbArrowKey {
  return (GNB_ARROW_KEYS as readonly string[]).includes(key);
}

export function getFocusableIn(container: ParentNode | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_IN_COL),
  ).filter((el) => {
    if (el.getAttribute("aria-disabled") === "true") return false;
    if (el.closest("[aria-hidden='true']")) return false;
    const style = window.getComputedStyle(el);
    return style.visibility !== "hidden" && style.display !== "none";
  });
}

export function focusByIndex(
  items: HTMLElement[],
  index: number,
): HTMLElement | null {
  if (!items.length) return null;
  const clamped = Math.max(0, Math.min(index, items.length - 1));
  const el = items[clamped];
  el?.focus();
  return el ?? null;
}

export function moveFocusByDelta(
  items: HTMLElement[],
  current: HTMLElement | null,
  delta: number,
  wrap = false,
): HTMLElement | null {
  if (!items.length) return null;
  const index = current ? items.indexOf(current) : -1;
  let next = index + delta;
  if (wrap) {
    next = ((next % items.length) + items.length) % items.length;
  } else {
    next = Math.max(0, Math.min(next, items.length - 1));
  }
  return focusByIndex(items, next);
}

type ColGroup = { root: HTMLElement; items: HTMLElement[] };

function getColumnGroups(megaRoot: HTMLElement): ColGroup[] {
  const colNodes = Array.from(
    megaRoot.querySelectorAll<HTMLElement>("[data-gnb-col]"),
  );
  return colNodes
    .map((root) => ({ root, items: getFocusableIn(root) }))
    .filter((col) => col.items.length > 0);
}

function findColumnIndex(cols: ColGroup[], target: HTMLElement): number {
  return cols.findIndex((col) => col.root.contains(target));
}

/** CSS grid with `grid-auto-flow: column` + fixed row count (Markets). */
function handleGridArrowKey(
  event: KeyboardEvent,
  grid: HTMLElement,
  target: HTMLElement,
  rows: number,
): boolean {
  const cells = Array.from(grid.querySelectorAll<HTMLElement>(".gnb_mega__cell"));
  if (!cells.length || rows < 1) return false;

  const cellItems = cells.map(
    (cell) =>
      cell.querySelector<HTMLElement>(
        'a[href]:not([disabled]), button:not([disabled])',
      ),
  );
  const index = cellItems.findIndex((el) => el === target);
  if (index < 0) return false;

  const col = Math.floor(index / rows);
  const row = index % rows;
  const colCount = Math.ceil(cells.length / rows);

  const focusAt = (nextIndex: number): boolean => {
    if (nextIndex < 0 || nextIndex >= cellItems.length) return false;
    const el = cellItems[nextIndex];
    if (!el) return false;
    event.preventDefault();
    el.focus();
    return true;
  };

  const findInDirection = (
    start: number,
    step: number,
    limit: (i: number) => boolean,
  ): boolean => {
    let i = start + step;
    while (limit(i)) {
      if (cellItems[i]) return focusAt(i);
      i += step;
    }
    return false;
  };

  switch (event.key) {
    case "ArrowUp": {
      if (row === 0) return false;
      return findInDirection(index, -1, (i) => i >= col * rows);
    }
    case "ArrowDown": {
      if (row >= rows - 1) return false;
      return findInDirection(
        index,
        1,
        (i) => i < Math.min(col * rows + rows, cells.length),
      );
    }
    case "ArrowLeft": {
      if (col === 0) return false;
      for (let c = col - 1; c >= 0; c -= 1) {
        const candidate = c * rows + row;
        if (focusAt(candidate)) return true;
      }
      return false;
    }
    case "ArrowRight": {
      if (col >= colCount - 1) return false;
      for (let c = col + 1; c < colCount; c += 1) {
        const candidate = c * rows + row;
        if (focusAt(candidate)) return true;
      }
      return false;
    }
    case "Home": {
      return findInDirection(col * rows - 1, 1, (i) => i < col * rows + rows);
    }
    case "End": {
      return findInDirection(
        Math.min(col * rows + rows, cells.length),
        -1,
        (i) => i >= col * rows,
      );
    }
    default:
      return false;
  }
}

/**
 * Handle arrow keys inside an open mega panel.
 * @returns "trigger" when focus should return to the depth1 trigger
 */
export function handleMegaPanelArrowKey(
  event: KeyboardEvent,
): "handled" | "trigger" | false {
  if (!isGnbArrowKey(event.key)) return false;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;

  const megaRoot = target.closest<HTMLElement>("[data-gnb-mega-root]");
  if (!megaRoot) return false;

  if (target.classList.contains("gnb_mega__close")) {
    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      const first = getFocusableIn(megaRoot)[0];
      if (first) {
        event.preventDefault();
        first.focus();
        return "handled";
      }
    }
    return false;
  }

  const grid = target.closest<HTMLElement>("[data-gnb-grid]");
  if (grid) {
    const rows = Number(grid.dataset.gnbGridRows || "2") || 2;
    if (handleGridArrowKey(event, grid, target, rows)) {
      return "handled";
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      const items = getFocusableIn(grid);
      if (items[0] === target) {
        event.preventDefault();
        return "trigger";
      }
    }
    return false;
  }

  const cols = getColumnGroups(megaRoot);
  if (!cols.length) {
    const flat = getFocusableIn(megaRoot);
    if (!flat.length) return false;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (flat[0] === target) {
        event.preventDefault();
        return "trigger";
      }
    }
    if (event.key === "Home") {
      event.preventDefault();
      focusByIndex(flat, 0);
      return "handled";
    }
    if (event.key === "End") {
      event.preventDefault();
      focusByIndex(flat, flat.length - 1);
      return "handled";
    }
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      moveFocusByDelta(flat, target, 1, false);
      return "handled";
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocusByDelta(flat, target, -1, false);
      return "handled";
    }
    return false;
  }

  const colIndex = findColumnIndex(cols, target);
  if (colIndex < 0) return false;

  const col = cols[colIndex];
  const itemIndex = col.items.indexOf(target);
  if (itemIndex < 0) return false;

  switch (event.key) {
    case "ArrowUp": {
      if (itemIndex === 0) {
        if (colIndex === 0) {
          event.preventDefault();
          return "trigger";
        }
        return false;
      }
      event.preventDefault();
      focusByIndex(col.items, itemIndex - 1);
      return "handled";
    }
    case "ArrowDown": {
      if (itemIndex >= col.items.length - 1) return false;
      event.preventDefault();
      focusByIndex(col.items, itemIndex + 1);
      return "handled";
    }
    case "ArrowLeft": {
      if (colIndex === 0) {
        event.preventDefault();
        return "trigger";
      }
      event.preventDefault();
      const prev = cols[colIndex - 1];
      focusByIndex(prev.items, Math.min(itemIndex, prev.items.length - 1));
      return "handled";
    }
    case "ArrowRight": {
      if (colIndex >= cols.length - 1) return false;
      event.preventDefault();
      const next = cols[colIndex + 1];
      focusByIndex(next.items, Math.min(itemIndex, next.items.length - 1));
      return "handled";
    }
    case "Home": {
      event.preventDefault();
      focusByIndex(col.items, 0);
      return "handled";
    }
    case "End": {
      event.preventDefault();
      focusByIndex(col.items, col.items.length - 1);
      return "handled";
    }
    default:
      return false;
  }
}

export function focusFirstMegaContent(megaRoot: HTMLElement | null): void {
  if (!megaRoot) return;
  const cols = getColumnGroups(megaRoot);
  if (cols[0]?.items[0]) {
    cols[0].items[0].focus();
    return;
  }
  getFocusableIn(megaRoot)[0]?.focus();
}
