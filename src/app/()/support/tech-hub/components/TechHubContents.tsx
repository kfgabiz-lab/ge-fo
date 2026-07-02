"use client";

import { useMemo, useState } from "react";
import PageNumbering from "@/components/pagination/PageNumbering";
import DevicesProductDownloadsFilter from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilter";
import {
  DevicesProductDownloadsCategoryFilterRow,
  DevicesProductDownloadsFilterCheckRow,
  DevicesProductDownloadsFilterSection,
} from "@/app/()/products-systems/components/product/DevicesProductDownloadsFilterParts";
import TechHubEmpty from "./TechHubEmpty";
import TechHubVideoCard from "./TechHubVideoCard";
import {
  techHubCertifications,
  techHubPage,
  techHubProductCategories,
  techHubVideos,
} from "@/data/support/techHubContent";

type TechHubContentsProps = {
  empty?: boolean;
};

export default function TechHubContents({ empty = false }: TechHubContentsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { totalResults, pageSize } = techHubPage;
  const resultCount = empty ? 0 : totalResults;

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const pageItems = useMemo(() => {
    if (empty) return [];

    const start = (currentPage - 1) * pageSize;
    const pool: typeof techHubVideos = [];

    while (pool.length < start + pageSize) {
      pool.push(...techHubVideos);
    }

    return pool.slice(start, start + pageSize);
  }, [currentPage, empty, pageSize]);

  return (
    <section
      className={`support_tech_hub_contents devices_product_downloads devices_product_downloads--tech-hub${
        empty ? " support_tech_hub_contents--no-data" : ""
      }`}
      id="support-tech-hub-contents"
    >
      <div className="inner">
        <div className="devices_product_downloads__body">
          <DevicesProductDownloadsFilter>
            <DevicesProductDownloadsFilterSection title="Product Category">
              {techHubProductCategories.map((option) => (
                <DevicesProductDownloadsCategoryFilterRow
                  key={option.id}
                  option={option}
                  idPrefix="th-category"
                />
              ))}
            </DevicesProductDownloadsFilterSection>

            <DevicesProductDownloadsFilterSection
              title="Certification"
              variant="certification"
            >
              {techHubCertifications.map((option) => (
                <DevicesProductDownloadsFilterCheckRow
                  key={option.id}
                  id={`th-cert-${option.id}`}
                  label={option.label}
                  count={option.count}
                  defaultChecked={option.defaultChecked}
                />
              ))}
            </DevicesProductDownloadsFilterSection>
          </DevicesProductDownloadsFilter>

          <div className="devices_product_downloads__main">
            <p className="devices_product_downloads__count support_tech_hub_contents__count">
              Total <strong>{resultCount.toLocaleString()}</strong>
            </p>

            {empty ? (
              <TechHubEmpty />
            ) : (
              <>
                <div className="support_tech_hub_grid">
                  {pageItems.map((item, index) => (
                    <TechHubVideoCard
                      key={`${item.id}-${currentPage}-${index}`}
                      item={item}
                    />
                  ))}
                </div>

                <PageNumbering
                  className="support_tech_hub_contents__pagination"
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  ariaLabel="Tech Hub pagination"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
