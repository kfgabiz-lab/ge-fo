"use client";

import type { ReactNode } from "react";
import {
  isNearProductSection,
  scrollToProductSection,
} from "../../lib/scrollToProductSection";

type ProductSectionScrollLinkProps = {
  sectionId: string;
  className?: string;
  children: ReactNode;
};

export default function ProductSectionScrollLink({
  sectionId,
  className,
  children,
}: ProductSectionScrollLinkProps) {
  return (
    <a
      href={`#${sectionId}`}
      className={className}
      onClick={(event) => {
        event.preventDefault();

        if (isNearProductSection(sectionId)) {
          if (window.location.hash !== `#${sectionId}`) {
            window.history.replaceState(null, "", `#${sectionId}`);
          }
          return;
        }

        scrollToProductSection(sectionId);
      }}
    >
      {children}
    </a>
  );
}
