"use client";

import {
  gnbGlobalActiveRegionId,
  gnbGlobalRegions,
  type GnbGlobalRegion,
} from "@/data/gnb/gnbGlobalContent";

type GnbGlobalMenuProps = {
  isOpen: boolean;
};

function GlobalMenuItem({ region }: { region: GnbGlobalRegion }) {
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

/** Figma 5683:60868 · 4288:54296 — #gnb-global-menu */
export default function GnbGlobalMenu({ isOpen }: GnbGlobalMenuProps) {
  return (
    <div
      id="gnb-global-menu"
      className={isOpen ? "gnb_global_menu is-open" : "gnb_global_menu"}
      aria-hidden={!isOpen}
    >
      <ul className="gnb_global_menu__list" role="menu" aria-label="Global sites">
        {gnbGlobalRegions.map((region) => (
          <GlobalMenuItem key={region.id} region={region} />
        ))}
      </ul>
    </div>
  );
}
