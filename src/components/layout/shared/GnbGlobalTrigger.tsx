"use client";

import { useEffect, useRef, type ReactNode } from "react";
import GnbGlobalMenu from "@/components/layout/shared/GnbGlobalMenu";
import { gnbGlobalTriggerLabel } from "@/data/gnb/gnbGlobalContent";

type GnbGlobalTriggerProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  wrapClassName: string;
  buttonClassName: string;
  buttonLabel?: string;
  children?: ReactNode;
};

export function GnbGlobalTriggerMainContent() {
  return (
    <>
      <span className="main_header__btn-global-icon" aria-hidden />
      <span className="main_header__btn-global-label">{gnbGlobalTriggerLabel}</span>
    </>
  );
}

export function GnbGlobalTriggerSubContent() {
  return (
    <>
      <span className="icon_global" aria-hidden />
      <span className="gnb_global_label">{gnbGlobalTriggerLabel}</span>
    </>
  );
}

export default function GnbGlobalTrigger({
  isOpen,
  onToggle,
  onClose,
  wrapClassName,
  buttonClassName,
  buttonLabel = gnbGlobalTriggerLabel,
  children,
}: GnbGlobalTriggerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (wrapRef.current?.contains(event.target as Node)) {
        return;
      }
      onClose();
    };

    const handleScroll = () => {
      onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={wrapRef} className={wrapClassName}>
      <button
        type="button"
        className={
          isOpen ? `${buttonClassName} is-active` : buttonClassName
        }
        aria-label={isOpen ? "Close global sites menu" : "Open global sites menu"}
        aria-expanded={isOpen}
        aria-controls="gnb-global-menu"
        aria-haspopup="menu"
        onClick={onToggle}
      >
        {children ?? <span className="ir">{buttonLabel}</span>}
      </button>
      <GnbGlobalMenu isOpen={isOpen} />
    </div>
  );
}
