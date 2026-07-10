export type GnbGlobalRegion = {
  id: string;
  label: string;
  href: string;
};

/** Figma 5683:60868 · 4288:54296 — GNB global region menu */
export const gnbGlobalActiveRegionId = "america";

export const gnbGlobalRegions: GnbGlobalRegion[] = [
  { id: "america", label: "America", href: "#" },
  { id: "global", label: "Global", href: "#" },
  { id: "korea", label: "Korea", href: "https://www.ls-electric.com/ko/" },
  { id: "china", label: "China", href: "#" },
  { id: "india", label: "India", href: "#" },
  { id: "japan", label: "Japan", href: "#" },
  { id: "middle-east", label: "Middle East", href: "#" },
  { id: "russia", label: "Russia", href: "#" },
  { id: "turkiye", label: "Türkiye", href: "#" },
  { id: "vietnam", label: "Vietnam", href: "#" },
];

export const gnbGlobalTriggerLabel =
  gnbGlobalRegions.find((region) => region.id === gnbGlobalActiveRegionId)?.label ??
  "America";
