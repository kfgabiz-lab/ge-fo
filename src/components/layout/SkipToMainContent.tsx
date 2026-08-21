"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type MouseEvent } from "react";

const FALLBACK_MAIN_ID = "main-content";

/**
 * Skip navigation: first Tab stop. Targets the page <main> (not chrome).
 * Syncs href to each route's main id so hash + focus both work.
 */
export default function SkipToMainContent() {
  const pathname = usePathname();
  const [targetId, setTargetId] = useState(FALLBACK_MAIN_ID);

  const resolveMain = useCallback(() => {
    const main = document.querySelector("main");
    if (!(main instanceof HTMLElement)) {
      setTargetId(FALLBACK_MAIN_ID);
      return null;
    }

    if (!main.id) {
      main.id = FALLBACK_MAIN_ID;
    }

    setTargetId(main.id);
    return main;
  }, []);

  useEffect(() => {
    // Only sync the skip href target — do not mutate tabindex here.
    // Setting tabIndex before page hydration causes a mismatch on <main>.
    resolveMain();
  }, [pathname, resolveMain]);

  const handleActivate = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const main = resolveMain();
    if (!main) return;

    if (!main.hasAttribute("tabindex")) {
      main.tabIndex = -1;
    }

    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: "start" });

    const id = main.id || FALLBACK_MAIN_ID;
    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <nav className="skip_nav" aria-label="Skip">
      <a
        href={`#${targetId}`}
        className="skip_to_content"
        onClick={handleActivate}
      >
        Skip to main content
      </a>
    </nav>
  );
}
