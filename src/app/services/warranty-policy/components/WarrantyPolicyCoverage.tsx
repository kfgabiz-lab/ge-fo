import WarrantyFeatureCards from "./WarrantyFeatureCards";
import WarrantyTableScroll from "./WarrantyTableScroll";
import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";
import { fetchWarrantyCoverageRows } from "../data/warrantyPolicyData";

// coverage.notes 전용 순수 string[] 렌더러
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="support_service_warranty_bullets">
      {items.map((item) => (
        <li
          key={item.slice(0, 48)}
          className="support_service_warranty_bullets__item"
        >
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

export default async function WarrantyPolicyCoverage() {
  const { coverage } = warrantyPolicyPage;
  // 제품 보증표 행만 bo page-data(warrantyPolicy-data)로 조회 — 그 외 섹션은 정적 유지
  const coverageRows = await fetchWarrantyCoverageRows();

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

          <WarrantyTableScroll withSwipe>
            <table className="support_service_warranty_table support_service_warranty_table--3col">
              <thead>
                <tr>
                  <th scope="col">{coverage.tableColumns.product}</th>
                  <th scope="col">{coverage.tableColumns.category}</th>
                  <th scope="col">{coverage.tableColumns.warranty}</th>
                </tr>
              </thead>
              <tbody data-slug="warrantyPolicy-data" data-slug-repeat="true">
                {/* bo warrantyPolicy-data(page-data) 조회 결과로 렌더.
                    bo 실데이터는 warranty_period 단일 텍스트라 warrantyLines 분기 미사용(설계 문서 3번). */}
                {coverageRows.map((row) => (
                  <tr key={row.id} data-slug-item>
                    <th scope="row" data-slugKey="product">
                      {row.product}
                    </th>
                    <td data-slugKey="category">{row.category}</td>
                    <td data-slugKey="warranty">{row.warranty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </WarrantyTableScroll>

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
