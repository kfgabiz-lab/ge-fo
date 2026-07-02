"use client";

import { useState } from "react";
import GnbMenu from "@/components/common/gnb/gnb-menu";

type GnbGuideVariant = "main" | "markets";

const variantLabels: Record<GnbGuideVariant, string> = {
  main: "Main GNB",
  markets: "Sub GNB (Markets)",
};

export default function GnbGuidePreview() {
  const [variant, setVariant] = useState<GnbGuideVariant>("main");
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const wrapClassName =
    variant === "main"
      ? "main_header-wrap"
      : ["sub_header-wrap", "is-at-top"].join(" ");

  return (
    <div className="gnb-guide-preview">
      <div
        className="gnb-guide-preview__toolbar"
        role="tablist"
        aria-label="GNB variant"
      >
        {(Object.keys(variantLabels) as GnbGuideVariant[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={variant === key}
            className={
              variant === key
                ? "gnb-guide-preview__tab is-active"
                : "gnb-guide-preview__tab"
            }
            onClick={() => setVariant(key)}
          >
            {variantLabels[key]}
          </button>
        ))}
      </div>

      <div className="gnb-guide-preview__scroll">
        <div className={wrapClassName}>
          <GnbMenu
            variant={variant}
            logoHref={variant === "main" ? "/main" : "/main"}
            isAtTop={variant === "markets"}
            isHeaderHidden={false}
            isHeaderRevealed={false}
            onMegaOpenChange={setIsMegaOpen}
            onMobileMenuOpenChange={setIsMobileMenuOpen}
          />
        </div>
      </div>

      <p className="gnb-guide-preview__hint">
        메가 메뉴 {isMegaOpen ? "열림" : "닫힘"} · 모바일 메뉴{" "}
        {isMobileMenuOpen ? "열림" : "닫힘"}
      </p>
    </div>
  );
}
