"use client";

import { useState } from "react";
import {
  getReferencesModalPreviewItems,
  referencesModalPreviewHub,
  type ReferencesModalPreviewVariantId,
} from "../data/referencesModalPreview";
import MarketsReferencesModal from "./MarketsReferencesModal";

export default function MarketsReferencesModalPageClient() {
  const [activeVariant, setActiveVariant] =
    useState<ReferencesModalPreviewVariantId | null>(null);

  const previewItems = activeVariant
    ? getReferencesModalPreviewItems(activeVariant)
    : [];

  return (
    <main
      className="markets-page markets-page--references-modal"
      id="Page_markets_references_modal"
    >
      <section
        className="markets_references_modal_hub"
        id="markets-references-modal-hub"
      >
        <div className="inner">
          <h1 className="markets_references_modal_hub__heading">
            {referencesModalPreviewHub.title}
          </h1>
          <p className="markets_references_modal_hub__desc">
            {referencesModalPreviewHub.description}
          </p>
          <ul className="markets_references_modal_hub__list">
            {referencesModalPreviewHub.buttons.map((button) => (
              <li key={button.id} className="markets_references_modal_hub__item">
                <button
                  type="button"
                  className="btn-base btn-lv01 btn-lv01--solid markets_references_modal_hub__btn"
                  onClick={() => setActiveVariant(button.id)}
                >
                  {button.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MarketsReferencesModal
        open={Boolean(activeVariant)}
        items={previewItems}
        onClose={() => setActiveVariant(null)}
      />
    </main>
  );
}
