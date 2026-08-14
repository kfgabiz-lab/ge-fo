export type GnbGlobalRegion = {
  id: string;
  label: string;
  href: string;
};

export const gnbGlobalActiveRegionId = "america";
//global, korea 제외 숨김 처리
export const gnbGlobalRegions: GnbGlobalRegion[] = [
  { id: "america", label: "America", href: "#" },
  { id: "global", label: "Global", href: "https://www.ls-electric.com" },
  { id: "korea", label: "Korea", href: "https://www.ls-electric.com/ko/" },
  // { id: "china", label: "China", href: "#" },
  // { id: "india", label: "India", href: "#" },
  // { id: "japan", label: "Japan", href: "#" },
  // { id: "middle-east", label: "Middle East", href: "#" },
  // { id: "russia", label: "Russia", href: "#" },
  // { id: "turkiye", label: "Türkiye", href: "#" },
  // { id: "vietnam", label: "Vietnam", href: "#" },
];

export const gnbGlobalTriggerLabel =
  gnbGlobalRegions.find((region) => region.id === gnbGlobalActiveRegionId)?.label ??
  "America";
