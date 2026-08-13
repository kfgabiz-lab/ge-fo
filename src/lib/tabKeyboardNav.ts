import type { KeyboardEvent as ReactKeyboardEvent } from "react";

/** Horizontal tablist: ArrowLeft/Right, Home, End (APG Tabs). */
export function handleHorizontalTabListKeyDown(
  event: ReactKeyboardEvent<HTMLElement>,
  options?: { activateOnMove?: boolean },
) {
  const key = event.key;
  if (
    key !== "ArrowLeft" &&
    key !== "ArrowRight" &&
    key !== "Home" &&
    key !== "End"
  ) {
    return;
  }

  const tablist = event.currentTarget;
  const tabs = Array.from(
    tablist.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'),
  ).filter((tab) => {
    if (tab.getAttribute("aria-disabled") === "true") return false;
    if (tab.closest("[aria-hidden='true']")) return false;
    return true;
  });

  if (tabs.length === 0) return;

  const currentIndex = tabs.indexOf(event.target as HTMLElement);
  if (currentIndex < 0) return;

  let nextIndex = currentIndex;
  if (key === "ArrowLeft") {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (key === "ArrowRight") {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (key === "Home") {
    nextIndex = 0;
  } else if (key === "End") {
    nextIndex = tabs.length - 1;
  }

  if (nextIndex === currentIndex) return;

  event.preventDefault();
  const next = tabs[nextIndex];
  next?.focus();

  if (options?.activateOnMove !== false) {
    next?.click();
  }
}
