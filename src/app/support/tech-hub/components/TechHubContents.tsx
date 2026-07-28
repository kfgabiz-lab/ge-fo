"use client";

import { useEffect, useRef, useState } from "react";
import PageNumbering from "@/components/pagination/PageNumbering";
import TechHubActiveFilters from "./TechHubActiveFilters";
import TechHubEmpty from "./TechHubEmpty";
import {
  TechHubFilterBoundary,
  useTechHubFilter,
  useTechHubQuery,
} from "./TechHubFilterProvider";
import TechHubFilterPanel from "./TechHubFilterPanel";
import TechHubVideoCard from "./TechHubVideoCard";
import { techHubPage } from "@/data/support/techHubContent";
import {
  fetchTechHubContents,
  type TechHubCard,
} from "@/data/support/techHubData";

const PAGE_SIZE = techHubPage.pageSize;

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
  const { query, page, setPage } = useTechHubQuery();
  const { getSelectedCategoryValues } = useTechHubFilter();

  const selectedCodes = getSelectedCategoryValues("category");
  const codesKey = [...selectedCodes].sort().join(",");
  const selectedCerts = getSelectedCategoryValues("certification");
  const certsKey = [...selectedCerts].sort().join(",");

  const [items, setItems] = useState<TechHubCard[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const firstResetRef = useRef(true);
  useEffect(() => {
    if (firstResetRef.current) {
      firstResetRef.current = false;
      return;
    }
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, codesKey, certsKey]);

  useEffect(() => {
    if (empty) {
      setItems([]);
      setTotalElements(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    fetchTechHubContents({
      q: query,
      categories: selectedCodes,
      certs: selectedCerts,
      page: page - 1,
      size: PAGE_SIZE,
    })
      .then((res) => {
        if (!alive) return;
        setItems(res.content);
        setTotalElements(res.totalElements);
        setTotalPages(Math.max(1, res.totalPages));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, codesKey, certsKey, page, empty]);

  const isEmptyResult = !loading && items.length === 0;
  const showEmpty = empty || isEmptyResult;
  const resultCount = empty ? 0 : totalElements;

  return (
    <section
      className={`support_tech_hub_contents devices_product_downloads devices_product_downloads--tech-hub${
        showEmpty
          ? " support_tech_hub_contents--no-data devices_product_downloads--no-data"
          : ""
      }`}
      id="support-tech-hub-contents"
    >
      <div className="inner">
        <div className="devices_product_downloads__body">
          <TechHubFilterPanel variant="sidebar" />

          <div className="devices_product_downloads__main">
            <TechHubActiveFilters />
            <p className="devices_product_downloads__count support_tech_hub_contents__count">
              Total <strong>{resultCount.toLocaleString()}</strong>
            </p>

            {showEmpty ? (
              <TechHubEmpty />
            ) : (
              <>
                <div className="support_tech_hub_grid">
                  {items.map((item) => (
                    <TechHubVideoCard key={item.id} item={item} />
                  ))}
                </div>

                <PageNumbering
                  className="support_tech_hub_contents__pagination"
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
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
