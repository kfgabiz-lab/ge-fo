import type {
  DevicesProductFeatureDescItem,
  DevicesProductFeatureListItem,
} from "@/components/content/DevicesProductFeaturesSection";

export type SwKeyFeature = { title: string; content: string };

export type SwKeyFeatureVariant = "list" | "desc";

export function mapSwKeyFeatures(
  keyFeatures: readonly SwKeyFeature[],
  variant: "list",
): DevicesProductFeatureListItem[];
export function mapSwKeyFeatures(
  keyFeatures: readonly SwKeyFeature[],
  variant: "desc",
): DevicesProductFeatureDescItem[];
export function mapSwKeyFeatures(
  keyFeatures: readonly SwKeyFeature[],
  variant: SwKeyFeatureVariant,
): DevicesProductFeatureListItem[] | DevicesProductFeatureDescItem[] {
  if (variant === "desc") {
    return keyFeatures.map((feature, index) => ({
      id: `kf-${index + 1}`,
      title: feature.title,
      description: feature.content,
    }));
  }

  return keyFeatures.map((feature, index) => ({
    id: `kf-${index + 1}`,
    title: feature.title,
    bullets: [feature.content],
  }));
}
