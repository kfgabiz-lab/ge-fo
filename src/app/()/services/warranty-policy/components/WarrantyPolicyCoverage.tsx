import WarrantyFeatureCards from "./WarrantyFeatureCards";
import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="support_service_warranty_bullets">
      {items.map((item) => (
        <li key={item.slice(0, 48)} className="support_service_warranty_bullets__item">
          {item.split("\n").map((line, index) => (
            <span key={`${line}-${index}`}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </li>
      ))}
    </ul>
  );
}

export default function WarrantyPolicyCoverage() {
  const { coverage } = warrantyPolicyPage;

  return (
    <section className="support_service_warranty_coverage" id="warranty-coverage">
      <div className="inner">
        <h2 className="section_tit">{coverage.title}</h2>
        <div className="support_service_warranty_coverage__body">
          <div className="support_service_warranty_coverage__cards-wrap">
            <p className="support_service_warranty_coverage__cards-heading">
              {coverage.cardsHeading}
            </p>
            <WarrantyFeatureCards
              cards={coverage.cards}
              footnote={coverage.cardsFootnote}
              variant="coverage"
            />
          </div>

          <div className="support_service_warranty_table-wrap">
            <table className="support_service_warranty_table support_service_warranty_table--3col">
              <thead>
                <tr>
                  <th scope="col">{coverage.tableColumns.product}</th>
                  <th scope="col">{coverage.tableColumns.category}</th>
                  <th scope="col">{coverage.tableColumns.warranty}</th>
                </tr>
              </thead>
              <tbody>
                {coverage.tableRows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">{row.product}</th>
                    <td>{row.category}</td>
                    <td
                      className={
                        row.warrantyLines
                          ? "support_service_warranty_table__cell--multiline"
                          : undefined
                      }
                    >
                      {row.warrantyLines ? (
                        row.warrantyLines.map((line, index) => (
                          <span key={line}>
                            {index > 0 ? <br /> : null}
                            {line}
                          </span>
                        ))
                      ) : (
                        row.warranty
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="support_service_warranty_notes">
            <h3 className="support_service_warranty_notes__tit">
              {coverage.notesTitle}
            </h3>
            <BulletList items={coverage.notes} />
          </div>
        </div>
      </div>
    </section>
  );
}
