"use client";

import { useEffect, useState } from "react";
import GnbMobileDepth1Menu from "@/components/layout/shared/GnbMobileDepth1Menu";
import GnbMobileDepth2Menu from "@/components/layout/shared/GnbMobileDepth2Menu";
import GnbMobileDepth2GridMenu from "@/components/layout/shared/GnbMobileDepth2GridMenu";
import GnbMobileDepth2SectionsMenu from "@/components/layout/shared/GnbMobileDepth2SectionsMenu";
import GnbMobileDepth3Menu from "@/components/layout/shared/GnbMobileDepth3Menu";
import GnbMobileDepth4Menu from "@/components/layout/shared/GnbMobileDepth4Menu";
import type { GnbNavItem } from "@/data/gnb/types";
import {
  findGnbNavItem,
  getMobileDepth2Items,
  getMobileDepth2Sections,
  getMobileDepth3BackLabel,
  getMobileDepth3Items,
  getMobileDepth4BackLabel,
  getMobileDepth4Data,
  isMobileDepth2GridLayout,
  isMobileDepth2SectionsLayout,
} from "@/data/gnb/mobileNavItems";

type MobileMenuLevel = "depth1" | "depth2" | "depth3" | "depth4";

type GnbMobileMenuPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  /** GnbMenu에서 전달하는 GNB 항목 목록 (정적/API 소스 무관하게 주입) */
  navItems: GnbNavItem[];
};

export default function GnbMobileMenuPanel({
  isOpen,
  onClose,
  navItems,
}: GnbMobileMenuPanelProps) {
  const [level, setLevel] = useState<MobileMenuLevel>("depth1");
  const [activeNavId, setActiveNavId] = useState<string | null>(null);
  const [activeDepth2Id, setActiveDepth2Id] = useState<string | null>(null);
  const [activeDepth3Id, setActiveDepth3Id] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setLevel("depth1");
      setActiveNavId(null);
      setActiveDepth2Id(null);
      setActiveDepth3Id(null);
    }
  }, [isOpen]);

  const handleDepth1Select = (navId: string) => {
    const navItem = findGnbNavItem(navItems, navId);
    if (!navItem?.megaMenu) return;

    setActiveNavId(navId);
    setActiveDepth2Id(null);
    setActiveDepth3Id(null);
    setLevel("depth2");
  };

  const handleDepth2Select = (depth2Id: string) => {
    setActiveDepth2Id(depth2Id);
    setActiveDepth3Id(null);
    setLevel("depth3");
  };

  const handleDepth3Select = (depth3Id: string) => {
    setActiveDepth3Id(depth3Id);
    setLevel("depth4");
  };

  const handleBackToDepth1 = () => {
    setLevel("depth1");
    setActiveNavId(null);
    setActiveDepth2Id(null);
    setActiveDepth3Id(null);
  };

  const handleBackToDepth2 = () => {
    setLevel("depth2");
    setActiveDepth2Id(null);
    setActiveDepth3Id(null);
  };

  const handleBackToDepth3 = () => {
    setLevel("depth3");
    setActiveDepth3Id(null);
  };

  if (level === "depth4" && activeNavId && activeDepth2Id && activeDepth3Id) {
    const depth4Data = getMobileDepth4Data(
      navItems,
      activeNavId,
      activeDepth2Id,
      activeDepth3Id,
    );

    if (depth4Data) {
      return (
        <GnbMobileDepth4Menu
          data={depth4Data}
          backLabel={getMobileDepth4BackLabel(
            navItems,
            activeNavId,
            activeDepth2Id,
          )}
          onBack={handleBackToDepth3}
          onItemNavigate={onClose}
        />
      );
    }
  }

  if (level === "depth3" && activeNavId && activeDepth2Id) {
    const depth3Items = getMobileDepth3Items(
      navItems,
      activeNavId,
      activeDepth2Id,
    );

    return (
      <GnbMobileDepth3Menu
        items={depth3Items}
        backLabel={getMobileDepth3BackLabel(navItems, activeNavId)}
        onBack={handleBackToDepth2}
        onItemSelect={handleDepth3Select}
        onItemNavigate={onClose}
      />
    );
  }

  if (level === "depth2" && activeNavId) {
    const navItem = findGnbNavItem(navItems, activeNavId);
    const depth2Items = navItem ? getMobileDepth2Items(navItem) : [];

    if (navItem && isMobileDepth2GridLayout(navItem)) {
      return (
        <GnbMobileDepth2GridMenu
          items={depth2Items}
          onBack={handleBackToDepth1}
          onItemNavigate={onClose}
        />
      );
    }

    if (navItem && isMobileDepth2SectionsLayout(navItem)) {
      const sections = getMobileDepth2Sections(navItem);

      return (
        <GnbMobileDepth2SectionsMenu
          sections={sections}
          onBack={handleBackToDepth1}
          onItemNavigate={onClose}
        />
      );
    }

    return (
      <GnbMobileDepth2Menu
        items={depth2Items}
        onBack={handleBackToDepth1}
        onItemSelect={handleDepth2Select}
        onItemNavigate={onClose}
      />
    );
  }

  return (
    <GnbMobileDepth1Menu
      navItems={navItems}
      onNavSelect={handleDepth1Select}
      onExploreClick={onClose}
      onDirectNavigate={onClose}
    />
  );
}
