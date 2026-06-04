"use client";

import GnbMegaExploreAll from "@/components/layout/shared/GnbMegaExploreAll";
import GnbMegaPanel from "@/components/layout/shared/GnbMegaPanel";
import { devicesMegaMenu } from "@/data/gnb/mega/devices";
import { gnbExploreAllColumns } from "@/data/gnbExploreAllProducts";
import type { GnbMegaDevicesPanelProps } from "@/components/layout/shared/gnb-mega/types";

export default function GnbDevicesMegaPanel({
  activeCategoryId,
  activeDepth3Id,
  onCategoryChange,
  onDepth3Change,
  megaView,
  onExploreAllClick,
  onExploreAllBack,
  onLinkClick,
}: GnbMegaDevicesPanelProps) {
  if (megaView === "explore-all") {
    return (
      <GnbMegaExploreAll
        columns={gnbExploreAllColumns}
        onBack={onExploreAllBack}
        onLinkClick={onLinkClick}
      />
    );
  }

  return (
    <GnbMegaPanel
      categories={devicesMegaMenu.categories}
      activeCategoryId={activeCategoryId}
      activeDepth3Id={activeDepth3Id}
      onExploreAllClick={onExploreAllClick}
      onLinkClick={onLinkClick}
      onCategoryChange={(categoryId) => {
        onCategoryChange(categoryId);
        const category = devicesMegaMenu.categories.find(
          (item) => item.id === categoryId,
        );
        onDepth3Change(category?.children[0]?.id ?? "");
      }}
      onDepth3Change={onDepth3Change}
    />
  );
}
