"use client";

import GnbMegaPanel from "@/components/layout/shared/GnbMegaPanel";
import type { GnbMegaDevicesPanelProps } from "@/components/layout/shared/gnb-mega/types";

export default function GnbDevicesMegaPanel({
  categories,
  activeCategoryId,
  activeDepth3Id,
  onCategoryChange,
  onDepth3Change,
  onLinkClick,
}: GnbMegaDevicesPanelProps) {
  return (
    <GnbMegaPanel
      categories={categories}
      activeCategoryId={activeCategoryId}
      activeDepth3Id={activeDepth3Id}
      onLinkClick={onLinkClick}
      onCategoryChange={(categoryId) => {
        onCategoryChange(categoryId);
        const category = categories.find((item) => item.id === categoryId);
        onDepth3Change(category?.children[0]?.id ?? "");
      }}
      onDepth3Change={onDepth3Change}
    />
  );
}
