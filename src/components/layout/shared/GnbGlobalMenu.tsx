"use client";

import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  gnbGlobalActiveRegionId,
  gnbGlobalRegions,
  type GnbGlobalRegion,
} from "@/data/gnb/gnbGlobalContent";
import {
  focusByIndex,
  moveFocusByDelta,
} from "@/lib/gnbKeyboardNav";

type GnbGlobalMenuProps = {
  isOpen: boolean;
  onClose?: () => void;
  onRequestFocusTrigger?: () => void;
};

function GlobalMenuItem({
  region,
  isOpen,
}: {
  region: GnbGlobalRegion;
  isOpen: boolean;
}) {
  const isActive = region.id === gnbGlobalActiveRegionId;
  const itemClass = [
    "gnb_global_menu__item",
    isActive ? "is-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isActive) {
    return (
      <li role="none">
        <span
          className={itemClass}
          role="menuitem"
          aria-current="true"
          tabIndex={isOpen ? 0 : -1}
        >
          {region.label}
        </span>
      </li>
    );
  }

  return (
    <li role="none">
      <a
        href={region.href}
        className={itemClass}
        role="menuitem"
        tabIndex={isOpen ? 0 : -1}
        onClick={
          region.href === "#"
            ? (event) => {
                event.preventDefault();
              }
            : undefined
        }
      >
        {region.label}
      </a>
    </li>
  );
}

export default function GnbGlobalMenu({
  isOpen,
  onClose,
  onRequestFocusTrigger,
}: GnbGlobalMenuProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      const items = getMenuItems();
      focusByIndex(items, 0);
    });

    return () => window.cancelAnimationFrame(frame);

    function getMenuItems() {
      if (!listRef.current) return [] as HTMLElement[];
      return Array.from(
        listRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]'),
      ).filter((el) => el.tabIndex >= 0);
    }
  }, [isOpen]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    if (!isOpen) return;

    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    ).filter((el) => el.tabIndex >= 0);
    const current =
      event.target instanceof HTMLElement &&
      items.includes(event.target)
        ? event.target
        : null;

    if (event.key === "Escape") {
      event.preventDefault();
      onClose?.();
      onRequestFocusTrigger?.();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocusByDelta(items, current, 1, true);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocusByDelta(items, current, -1, true);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusByIndex(items, 0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusByIndex(items, items.length - 1);
    }
  };

  return (
    <div
      id="gnb-global-menu"
      className={isOpen ? "gnb_global_menu is-open" : "gnb_global_menu"}
      aria-hidden={!isOpen}
    >
      <ul
        ref={listRef}
        className="gnb_global_menu__list"
        role="menu"
        aria-label="Global sites"
        onKeyDown={handleKeyDown}
      >
        {gnbGlobalRegions.map((region) => (
          <GlobalMenuItem key={region.id} region={region} isOpen={isOpen} />
        ))}
      </ul>
    </div>
  );
}
