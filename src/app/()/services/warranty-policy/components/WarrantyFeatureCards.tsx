import type { WarrantyFeatureCard } from "@/data/services/warrantyPolicyContent";
import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";

type WarrantyFeatureCardsProps = {
  cards: WarrantyFeatureCard[];
  footnote?: string;
  variant?: "coverage" | "extension";
};

export default function WarrantyFeatureCards({
  cards,
  footnote,
  variant = "coverage",
}: WarrantyFeatureCardsProps) {
  return (
    <div
      className={`support_service_warranty_cards support_service_warranty_cards--${variant}`}
    >
      <ul className="support_service_warranty_cards__list">
        {cards.map((card) => (
          <li key={card.id} className="support_service_warranty_cards__item">
            <div className="support_service_warranty_cards__card">
              <span className="support_service_warranty_cards__num" aria-hidden>
                <img
                  loading="lazy"
                  decoding="async"
                  src={warrantyPolicyPage.numBadgeIcon}
                  alt=""
                />
                <span className="support_service_warranty_cards__num-label">
                  {card.number}
                </span>
              </span>
              <div className="support_service_warranty_cards__icon">
                <img loading="lazy" decoding="async" src={card.icon} alt="" />
              </div>
              <p className="support_service_warranty_cards__tit">
                {card.titleLines.map((line) => (
                  <span key={line} className="support_service_warranty_cards__tit-line">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {footnote ? (
        <p className="support_service_warranty_cards__footnote">{footnote}</p>
      ) : null}
    </div>
  );
}
