"use client";

import { useEffect, useState } from "react";
import WarrantyFeatureCards from "./WarrantyFeatureCards";
import WarrantyPolicyDocuments from "./WarrantyPolicyDocuments";
import WarrantyTableScroll from "./WarrantyTableScroll";
import { warrantyPolicyPage } from "@/data/services/warrantyPolicyContent";
import {
  fetchWarrantyCoverageRows,
  type WarrantyCoverageRow,
} from "../data/warrantyPolicyData";

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

export default function WarrantyPolicyCoverage() {
  const { coverage } = warrantyPolicyPage;
  const [coverageRows, setCoverageRows] = useState<WarrantyCoverageRow[]>([]);

  useEffect(() => {
    let alive = true;
    fetchWarrantyCoverageRows()
      .then((rows) => {
        if (alive) setCoverageRows(rows);
      })
      .catch(() => {
        if (alive) setCoverageRows([]);
      });
    return () => {
      alive = false;
    };
  }, []);

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
                {coverageRows.map((row) => (
                  <tr key={row.id} data-slug-item>
                    <th scope="row" data-slugkey="product">
                      {row.product}
                    </th>
                    <td data-slugkey="category">{row.category}</td>
                    <td data-slugkey="warranty">{row.warranty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </WarrantyTableScroll>

          {/* 260811 start */}
          <WarrantyPolicyDocuments />
          {/* 260811 end */}

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
