"use client";

import GnbMegaPanel from "@/components/layout/shared/GnbMegaPanel";
import { devicesMegaMenu } from "@/data/gnb/mega/devices";
import type { GnbMegaDevicesPanelProps } from "@/components/layout/shared/gnb-mega/types";

export default function GnbDevicesMegaPanel({
  activeCategoryId,
  activeDepth3Id,
  onCategoryChange,
  onDepth3Change,
  onLinkClick,
}: GnbMegaDevicesPanelProps) {
  return (
    <GnbMegaPanel
      categories={devicesMegaMenu.categories}
      activeCategoryId={activeCategoryId}
      activeDepth3Id={activeDepth3Id}
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
