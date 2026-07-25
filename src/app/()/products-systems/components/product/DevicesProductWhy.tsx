import type { HvdcWhyBlock } from "../../data/hvdcContent";
import { renderMultilineText } from "../../lib/renderMultilineText";

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

// imageOnly=true면 카드 본문(제목/설명)을 렌더하지 않고 비주얼만 노출한다(구 SoftwareHighlights 동작).
function renderWhyBlockCards(block: HvdcWhyBlock, imageOnly: boolean) {
  return (
    <div className="devices_product_why__cards">
      {block.cards.map((card) => (
        <article key={card.title || card.image} className="devices_product_why__card">
          <div className="devices_product_why__card-visual">
            <img loading="lazy" decoding="async" src={card.image} alt="" />
          </div>
          {imageOnly ? null : (
            <div className="devices_product_why__card-body">
              <h4 className="devices_product_why__card-tit">{card.title}</h4>
              <p className="devices_product_why__card-desc">
                {renderMultilineText(card.description)}
              </p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

type DevicesProductWhyProps = {
  title: string;
  blocks: HvdcWhyBlock[];
  // imageOnly=true: 카드 비주얼만 노출 + 헤드 영역을 __head 래퍼로 감싸고 description 노출(--image-only 변형).
  imageOnly?: boolean;
  description?: string;
};

export default function DevicesProductWhy({
  title,
  blocks,
  imageOnly = false,
  description,
}: DevicesProductWhyProps) {
  const sectionClassName = imageOnly
    ? "devices_product_why devices_product_why--image-only"
    : "devices_product_why";

  return (
    <section className={sectionClassName} id="product-why">
      <div className="inner">
        {imageOnly ? (
          <div className="devices_product_why__head">
            <h2 className="section_tit">{title}</h2>
            {description ? <p className="section_desc">{description}</p> : null}
          </div>
        ) : (
          <h2 className="section_tit">{title}</h2>
        )}
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
                    {renderWhyBlockCards(block, imageOnly)}
                  </div>
                </div>
              );
            }

            return (
              <div key={block.id} className={blockClassName}>
                {renderWhyBlockHead(block)}
                {renderWhyBlockCards(block, imageOnly)}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
