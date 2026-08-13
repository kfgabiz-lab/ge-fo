"use client";

import { useId, useState } from "react";
import { references, type ReferenceItem } from "../data/marketsContent";
import MarketsReferencesModal from "./MarketsReferencesModal";

type MarketsReferencesProps = {
  items?: ReferenceItem[];
};

export default function MarketsReferences({
  items = references,
}: MarketsReferencesProps) {
  const dialogId = useId();
  const [activeItem, setActiveItem] = useState<ReferenceItem | null>(null);

  return (
    <section className="markets_references">
      <div className="inner">
        <div className="markets_references__head">
          <h2 className="section_tit">References</h2>
          <p className="section_desc">
            Trusted by leading organizations across the globe see how we deliver results.
          </p>
        </div>
        <div className="markets_references__list">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              className="item"
              aria-haspopup="dialog"
              aria-expanded={activeItem?.id === item.id}
              aria-controls={dialogId}
              onClick={() => setActiveItem(item)}
            >
              <div className="img_area">
                <img loading="lazy" decoding="async" src={item.image} alt="" />
              </div>
              <div className="txt_area">
                <h3 className="tit">{item.title}</h3>
                <p className="txt">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <MarketsReferencesModal
        open={Boolean(activeItem)}
        item={activeItem}
        items={items}
        dialogId={dialogId}
        onClose={() => setActiveItem(null)}
        onActiveItemChange={setActiveItem}
      />
    </section>
  );
}
