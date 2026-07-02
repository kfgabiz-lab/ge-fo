"use client";

import {
  getReferenceForModal,
  REFERENCES_MODAL_DEFAULT_ID,
} from "../data/marketsContent";
import MarketsReferencesModal from "./MarketsReferencesModal";

/** Section guide — LG reference modal (multi-image gallery) */
export default function MarketsReferencesModalPreview() {
  return (
    <MarketsReferencesModal
      embedded
      open
      item={getReferenceForModal(REFERENCES_MODAL_DEFAULT_ID)!}
      onClose={() => undefined}
    />
  );
}
