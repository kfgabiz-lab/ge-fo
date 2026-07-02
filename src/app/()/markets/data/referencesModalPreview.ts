import type { ReferenceItem } from "./marketsContent";
import { dataCenterReferences } from "./marketsDataCenterContent";

export type ReferencesModalPreviewVariantId = "single" | "multi";

export const referencesModalPreviewHub = {
  title: "References — Project Modal",
  description:
    "Figma Markets_07 Modal · 단일 레퍼런스(5535:92373) · 다중 레퍼런스 탭(5970:71483)",
  buttons: [
    {
      id: "single" as const,
      label: "1개일 경우",
    },
    {
      id: "multi" as const,
      label: "1개 이상일 경우",
    },
  ],
};

export function getReferencesModalPreviewItems(
  variant: ReferencesModalPreviewVariantId,
): ReferenceItem[] {
  if (variant === "single") {
    return [dataCenterReferences[0]];
  }

  return dataCenterReferences;
}
