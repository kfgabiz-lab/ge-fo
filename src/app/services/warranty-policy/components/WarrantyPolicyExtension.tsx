import type { ReactNode } from "react";
import WarrantyFeatureCards from "./WarrantyFeatureCards";
import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";

function NotePanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="support_service_warranty_panel">
      <h3 className="support_service_warranty_panel__tit">{title}</h3>
      {children}
    </div>
  );
}

export default function WarrantyPolicyExtension() {
  const { extension } = warrantyPolicyPage;

  return (
    <section className="support_service_warranty_extension" id="warranty-extension">
      <div className="inner">
        <div className="support_service_warranty_extension__head">
          <h2 className="section_tit">{extension.title}</h2>
          <p className="section_desc">{extension.description}</p>
        </div>
        <div className="support_service_warranty_extension__body">
          <div className="support_service_warranty_extension__cards-wrap">
            <p className="support_service_warranty_extension__cards-heading">
              {extension.cardsHeading}
            </p>
            <WarrantyFeatureCards
              cards={extension.cards}
              footnote={extension.cardsFootnote}
              variant="extension"
            />
          </div>

          <div className="support_service_warranty_extension__panels">
            <NotePanel title={extension.importantNotes.title}>
              <ul className="support_service_warranty_bullets">
                {extension.importantNotes.items.map((item) => (
                  <li
                    key={item}
                    className="support_service_warranty_bullets__item"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </NotePanel>
            <NotePanel title={extension.exclusions.title}>
              <p className="support_service_warranty_panel__intro">
                {extension.exclusions.intro}
              </p>
              <ul className="support_service_warranty_bullets">
                {extension.exclusions.items.map((item) => (
                  <li
                    key={item}
                    className="support_service_warranty_bullets__item"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="support_service_warranty_panel__footnote">
                {extension.exclusions.footnote}
              </p>
            </NotePanel>
          </div>
        </div>
      </div>
    </section>
  );
}
