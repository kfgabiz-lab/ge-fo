import type { HvdcWhyBlock } from "../../data/hvdcContent";

function renderMultilineText(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

function renderWhyBlockHead(block: HvdcWhyBlock) {
  return (
    <div className="devices_product_why__block-head">
      <h3 className="devices_product_why__block-tit">{block.title}</h3>
      {block.lead ? (
        <p className="devices_product_why__block-lead">{renderMultilineText(block.lead)}</p>
      ) : null}
    </div>
  );
}

function renderWhyBlockCards(block: HvdcWhyBlock) {
  return (
    <div className="devices_product_why__cards">
      {block.cards.map((card) => (
        <article key={card.image} className="devices_product_why__card">
          <div className="devices_product_why__card-visual">
            <img loading="lazy" decoding="async" src={card.image} alt="" />
          </div>
        </article>
      ))}
    </div>
  );
}

type DevicesSoftwareHighlightsProps = {
  title: string;
  blocks: HvdcWhyBlock[];
};

export default function DevicesSoftwareHighlights({
  title,
  blocks,
}: DevicesSoftwareHighlightsProps) {
  return (
    <section
      className="devices_product_why devices_product_why--image-only"
      id="product-why"
    >
      <div className="inner">
        <h2 className="section_tit">{title}</h2>
        <div className="devices_product_why__blocks">
          {blocks.map((block) => {
            const isSplit = block.layout === "split";
            const blockClassName = isSplit
              ? "devices_product_why__block devices_product_why__block--split"
              : "devices_product_why__block";

            if (isSplit) {
              return (
                <div key={block.id} className={blockClassName}>
                  <div className="devices_product_why__block-split">
                    {renderWhyBlockHead(block)}
                    {renderWhyBlockCards(block)}
                  </div>
                </div>
              );
            }

            return (
              <div key={block.id} className={blockClassName}>
                {renderWhyBlockHead(block)}
                {renderWhyBlockCards(block)}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
