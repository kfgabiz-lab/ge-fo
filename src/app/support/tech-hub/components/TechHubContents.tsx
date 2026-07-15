"use client";

import { useMemo, useState } from "react";
import PageNumbering from "@/components/pagination/PageNumbering";
import TechHubEmpty from "./TechHubEmpty";
import { TechHubFilterBoundary } from "./TechHubFilterProvider";
import TechHubFilterPanel from "./TechHubFilterPanel";
import TechHubVideoCard from "./TechHubVideoCard";
import { techHubPage, techHubVideos } from "@/data/support/techHubContent";

type TechHubContentsProps = {
  empty?: boolean;
};

export default function TechHubContents({ empty = false }: TechHubContentsProps) {
  return (
    <TechHubFilterBoundary>
      <TechHubContentsBody empty={empty} />
    </TechHubFilterBoundary>
  );
}

function TechHubContentsBody({ empty = false }: TechHubContentsProps) {
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
        empty
          ? " support_tech_hub_contents--no-data devices_product_downloads--no-data"
          : ""
      }`}
      id="support-tech-hub-contents"
    >
      <div className="inner">
        <div className="devices_product_downloads__body">
          <TechHubFilterPanel variant="sidebar" />

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
